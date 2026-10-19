"""
Prépare les visuels du jeu Avocat du diable pour le site (public/jeu/), à partir de communication/jeu/sources/ :
- couverture.png : allégée (sert de dessus de boîte en 3D et d'image de partage) ;
- cartes.png : fond beige retiré, puis une image par carte (carte-role, carte-sabotage) ;
- tableau-audience.png : recadré en rond, fond transparent.
Règle du site : 1600 px de large au plus, 150 Ko au plus par image.
Aussi : cartes Affaire et Sabotage Personnage, billets de la Banque LEQ (banque.png découpée).
Utilisation (depuis le dossier du projet) :  python communication/jeu/preparer-images.py
"""
import os

from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "communication", "jeu", "sources")
OUT = os.path.join(ROOT, "public", "jeu")
os.makedirs(OUT, exist_ok=True)


def enregistrer(im, nom, largeur, max_ko=150):
    """Redimensionne puis baisse la qualité jusqu'à passer sous max_ko."""
    if im.width > largeur:
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    chemin = os.path.join(OUT, nom)
    for q in range(86, 40, -4):
        im.save(chemin, "WEBP", quality=q, method=6)
        if os.path.getsize(chemin) <= max_ko * 1024:
            break
    print(f"{nom} : {im.width}x{im.height}, {os.path.getsize(chemin) // 1024} Ko (qualité {q})")


# Couverture
enregistrer(Image.open(os.path.join(SRC, "couverture.png")).convert("RGB"), "couverture.webp", 1200)

# Cartes : on rend transparent le fond beige relié aux bords (remplissage depuis les coins)
cartes = Image.open(os.path.join(SRC, "cartes.png")).convert("RGBA")
fond = cartes.getpixel((5, 5))
masque = Image.new("L", cartes.size, 0)
rgb = cartes.convert("RGB")
for coin in [(0, 0), (cartes.width - 1, 0), (0, cartes.height - 1), (cartes.width - 1, cartes.height - 1), (cartes.width // 2, 2), (cartes.width // 2, cartes.height - 3)]:
    ImageDraw.floodfill(rgb, coin, (255, 0, 255), thresh=28)
px, mp = rgb.load(), masque.load()
for y in range(cartes.height):
    for x in range(cartes.width):
        if px[x, y] != (255, 0, 255):
            mp[x, y] = 255
cartes.putalpha(masque)
cartes = cartes.crop(cartes.getbbox())

# Tableau d'audience : recadré en rond
plateau = Image.open(os.path.join(SRC, "tableau-audience.png")).convert("RGBA")
c = min(plateau.size)
plateau = plateau.crop(((plateau.width - c) // 2, (plateau.height - c) // 2, (plateau.width + c) // 2, (plateau.height + c) // 2))
grand = Image.new("L", (c * 4, c * 4), 0)
m = round(c * 4 * 0.012)  # marge : on garde le liseré doré
ImageDraw.Draw(grand).ellipse((m, m, c * 4 - m, c * 4 - m), fill=255)
plateau.putalpha(grand.resize((c, c), Image.LANCZOS))
enregistrer(plateau, "tableau-audience.webp", 900)

# Les deux cartes séparément (coupure au milieu de l'espace transparent entre elles)
alpha = cartes.getchannel("A")
milieu = cartes.width // 2
vides = [x for x in range(cartes.width // 3, 2 * cartes.width // 3) if not alpha.crop((x, 0, x + 1, cartes.height)).getbbox()]
coupe = vides[len(vides) // 2] if vides else milieu
for nom, boite in [("carte-role.webp", (0, 0, coupe, cartes.height)), ("carte-sabotage.webp", (coupe, 0, cartes.width, cartes.height))]:
    carte = cartes.crop(boite)
    enregistrer(carte.crop(carte.getbbox()), nom, 600, 90)


def detourer(im, thresh=28):
    """Rend transparent le fond uni relié aux bords (coins et milieux des côtés)."""
    im = im.convert("RGBA")
    rgb = im.convert("RGB")
    w, h = im.size
    fond = rgb.getpixel((0, 0))  # couleur du fond : celle du coin
    proche = lambda c: sum(abs(c[i] - fond[i]) for i in range(3)) <= thresh
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if rgb.getpixel(p) != (255, 0, 255) and proche(rgb.getpixel(p)):
            ImageDraw.floodfill(rgb, p, (255, 0, 255), thresh=thresh)
    masque = Image.new("L", im.size, 0)
    px, mp = rgb.load(), masque.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] != (255, 0, 255):
                mp[x, y] = 255
    im.putalpha(Image.composite(im.getchannel("A"), masque, masque))
    return im.crop(im.getbbox())


def bandes(alpha, axe):
    """Intervalles non vides le long d'un axe (0 : colonnes, 1 : lignes) d'un masque alpha."""
    n = alpha.width if axe == 0 else alpha.height
    pleins = [bool(alpha.crop((i, 0, i + 1, alpha.height) if axe == 0 else (0, i, alpha.width, i + 1)).getbbox()) for i in range(n)]
    res, debut = [], None
    for i, v in enumerate(pleins + [False]):
        if v and debut is None:
            debut = i
        elif not v and debut is not None:
            if i - debut > 40:
                res.append((debut, i))
            debut = None
    return res


# Nouvelles cartes
enregistrer(detourer(Image.open(os.path.join(SRC, "carte-sabotage-personnage.png"))), "carte-personnage.webp", 600, 90)
affaire = Image.open(os.path.join(SRC, "carte-affaire.png")).convert("RGBA")
enregistrer(affaire.crop(affaire.getbbox()), "carte-affaire.webp", 600, 90)

# Banque LEQ : 4 billets (1, 10, 5, 20 dans l'ordre colonnes puis lignes) ; la carte Banque n'est pas utilisée
banque = detourer(Image.open(os.path.join(SRC, "banque.png")))
noms = iter(["billet-1", "billet-10", "billet-5", "billet-20", None])
for x0, x1 in bandes(banque.getchannel("A"), 0):
    colonne = banque.crop((x0, 0, x1, banque.height))
    for y0, y1 in bandes(colonne.getchannel("A"), 1):
        morceau = colonne.crop((0, y0, colonne.width, y1))
        nom = next(noms)
        if nom:
            enregistrer(morceau.crop(morceau.getbbox()), f"{nom}.webp", 520, 60)
