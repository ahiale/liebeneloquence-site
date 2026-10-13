"""
Diaporama de la capsule « Construire le squelette d'une présentation » (16:9).
Textes : ceux de la version corrigée par Rebecca (OneDrive, 13/10/2026), à respecter tels quels.
Style du site : bleu et blanc, petits dessins au trait (communication/atelier/dessins, voir generer-dessins.cjs),
touches légères d'orange et de jaune, police Inter en graisse normale, italiques d'accent en Mélodrame.
Utilisation (depuis le dossier du projet) :  python communication/atelier/capsule-squelette.py
Résultat : communication/atelier/LEQ-capsule-squelette.pptx
"""
import charte_pptx
from charte_pptx import *  # noqa: F401,F403

charte_pptx.SANS = "Inter"  # police de ce diaporama (installée depuis Google Fonts)

OUT = os.path.join(ROOT, "communication", "atelier", "LEQ-capsule-squelette.pptx")
DESSINS = os.path.join(ROOT, "communication", "atelier", "dessins")
URL_AVIS = "https://liebeneloquence.com/avis"
URL_SEANCE = "https://calendly.com/formationn-liebeneloquence/30min"

ENCRE, GRIS = NAVY, "5B6B85"
CIEL, CIEL_CLAIR, CIEL_PALE, BLANC_DOUX = "3A8DDE", "E3F1FC", "B9D6F5", "E6EDFA"


def dessin(s, nom, couleur, x, y, w):
    """Petit dessin du site : nom (etincelle, etoile, coeur, gribouillis, fleche, souligne, bulle, micro), couleur (blanc, ciel, royal, orange, or)."""
    pic(s, os.path.join(DESSINS, f"{nom}-{couleur}.png"), x, y, w=w)


def notes(s, texte):
    s.notes_slide.notes_text_frame.text = texte


def surtitre(s, label, bleu=False):
    text(s, 90, 150, 1400, 40, [[(label.upper(), "m")]], size=11, color=CIEL_PALE if bleu else CIEL)


def titre(s, debut, accent, y=190, bleu=False, x=90, w=1740):
    text(s, x, y, w, 130, [[(debut, f"c:{'FFFFFF' if bleu else ENCRE}"), (accent, f"serif c:{'FFFFFF' if bleu else ROYAL} s:52")]], size=42)


def pastille(s, x, y, n, d=64, bleu=False):
    if bleu:
        box(s, x, y, d, d, "FFFFFF", None, shape=MSO_SHAPE.OVAL)
    else:
        box(s, x, y, d, d, "FFFFFF", CIEL, shape=MSO_SHAPE.OVAL, line_w=1.5)
    text(s, x, y, d, d, str(n), size=int(d / 3), color=ROYAL if bleu else CIEL, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def etape(s, n, debut, accent):
    """En-tête des diapositives d'étape : surtitre, pastille numérotée et titre."""
    surtitre(s, f"La méthode · étape {n} sur 5")
    pastille(s, 90, 200, n, 76)
    titre(s, debut, accent, y=196, x=200, w=1600)


def carte(s, x, y, w, h, fond=CIEL_CLAIR):
    return box(s, x, y, w, h, fond, None, radius=0.08)


def blanche():
    s = new_slide("blanc")
    logo(s, dark=True)
    return s


def bleue():
    s = new_slide("hero")
    logo(s)
    return s


# ---------------------------------------------------------------- 1. Couverture
s = bleue()
text(s, 90, 250, 1200, 40, [[("CAPSULE ÉDUCATIVE · ATELIER LEQ", "m")]], size=12, color=CIEL_PALE)
text(s, 90, 300, 1200, 80, "Construire le", size=50)
text(s, 90, 385, 1200, 130, [[("squelette", "serif")]], size=88)
dessin(s, "souligne", "orange", 100, 585, 340)
text(s, 90, 625, 1200, 80, "d'une présentation", size=50)
text(s, 90, 770, 1000, 60, "On retient bien mieux un plan qu'un texte.", size=24, color=BLANC_DOUX)
dessin(s, "micro", "blanc", 1400, 250, 230)
dessin(s, "etincelle", "or", 1680, 150, 80)
dessin(s, "etoile", "blanc", 1300, 660, 56)
dessin(s, "gribouillis", "blanc", 1600, 640, 150)
dessin(s, "coeur", "orange", 1250, 230, 40)
footer(s, dark=True, n=1)
notes(s, "Capsule éducative : construire le squelette d'une présentation.\nMessage central : on retient bien mieux un plan qu'un texte.")

# ---------------------------------------------------------------- 2. Icebreaker
s = bleue()
text(s, 90, 360, 1740, 240, [[("Icebreaker", "")]], size=110, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
dessin(s, "souligne", "orange", 760, 600, 400)
dessin(s, "bulle", "blanc", 1550, 720, 190)
dessin(s, "etincelle", "blanc", 330, 230, 80)
dessin(s, "etoile", "or", 1560, 250, 50)
dessin(s, "coeur", "orange", 380, 760, 40)
footer(s, dark=True, n=2)
notes(s, "Accroche.\nDans le chat : « Tapez 1 si vous avez déjà eu un trou en récitant un texte appris par cœur. »\nLes réponses arrivent en rafale, ce qui crée tout de suite du lien.")

# ---------------------------------------------------------------- 3. Le secret des orateurs
s = blanche()
titre(s, "Le secret des orateurs ", "de l'Antiquité.")
text(s, 90, 350, 1740, 50, "Cicéron décrit 5 étapes pour préparer un discours :", size=20, color=GRIS)
for i, (nom, sens) in enumerate([("Inventio", "trouver ses idées"), ("Dispositio", "organiser ses idées"), ("Elocutio", "choisir ses mots"), ("Memoria", "les retenir"), ("Actio", "les dire")]):
    x = 90 + i * 350
    carte(s, x, 470, 320, 210)
    text(s, x + 30, 505, 270, 60, [[(nom, f"serif c:{ROYAL}")]], size=30)
    text(s, x + 30, 590, 270, 60, sens, size=17, color=ENCRE)
dessin(s, "etoile", "ciel", 1730, 150, 60)
dessin(s, "gribouillis", "ciel", 1500, 780, 170)
dessin(s, "coeur", "orange", 1700, 800, 40)
footer(s, n=3)
notes(s, "D'où ça vient (3 à 6 min).\nLes orateurs de l'Antiquité parlaient pendant des heures sans notes. La rhétorique classique, décrite notamment par Cicéron, divise la préparation d'un discours en cinq étapes, dont deux nous intéressent :\n- la dispositio : organiser ses idées ;\n- la memoria : les retenir.\nLeur secret : ils ne mémorisaient pas des phrases, ils mémorisaient un plan. C'est exactement ce qu'on va faire.")

# ---------------------------------------------------------------- 4. La méthode
s = bleue()
surtitre(s, "La méthode", bleu=True)
titre(s, "5 étapes pour ", "construire un plan.", bleu=True)
box(s, 150, 562, 1620, 2, CIEL_PALE, None, shape=MSO_SHAPE.RECTANGLE)
for i, t in enumerate(["Le message central", "Vider sa tête", "Regrouper en 3 groupes", "Associer les images", "L'entrée et la sortie"]):
    x = 90 + i * 360
    pastille(s, x + 133, 530, i + 1, bleu=True)
    text(s, x, 640, 330, 110, t, size=20, color="FFFFFF", align=PP_ALIGN.CENTER)
dessin(s, "fleche", "blanc", 1600, 820, 180)
dessin(s, "etincelle", "or", 1720, 150, 70)
dessin(s, "coeur", "orange", 160, 840, 40)
footer(s, dark=True, n=4)
notes(s, "La méthode en 5 étapes :\n1. Le message central en une phrase\n2. Vider sa tête\n3. Regrouper en 3 tas\n4. Accrocher de la chair à chaque os\n5. L'entrée et la sortie")

# ---------------------------------------------------------------- 5. Étape 1
s = blanche()
etape(s, 1, "Le message central ", "en une phrase")
carte(s, 130, 400, 1640, 230)
text(s, 190, 400, 1520, 230, [[("« Si le public ne retient qu'une chose, ce sera quoi ? »", f"serif c:{ENCRE}")]], size=38, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 130, 690, 1640, 60, "Si on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.", size=22, color=GRIS, align=PP_ALIGN.CENTER)
dessin(s, "bulle", "ciel", 1640, 170, 150)
dessin(s, "coeur", "orange", 1720, 800, 40)
dessin(s, "etincelle", "ciel", 140, 820, 60)
footer(s, n=5)
notes(s, "Étape 1 : le message central en une phrase.\nQuestion à se poser : « Si le public ne retient qu'une chose, ce sera quoi ? »\nSi on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.")

# ---------------------------------------------------------------- 6. Étape 2
s = blanche()
etape(s, 2, "Vider ", "sa tête")
text(s, 90, 430, 1200, 260, [[("On note en vrac tout ce qu'on sait ou veut dire sur le sujet et découpe en plusieurs points.", "")]], size=32, color=ENCRE, spacing=1.35)
dessin(s, "gribouillis", "ciel", 1430, 420, 300)
dessin(s, "etincelle", "orange", 1720, 300, 60)
dessin(s, "etoile", "ciel", 1500, 720, 60)
footer(s, n=6)
notes(s, "Étape 2 : vider sa tête.\nPendant 5 minutes, on note en vrac tout ce qu'on sait ou veut dire sur le sujet, sans trier.")

# ---------------------------------------------------------------- 7. Étape 3
s = blanche()
etape(s, 3, "Regrouper ", "en 3 tas")
text(s, 90, 360, 1740, 50, "Les idées mises bout à bout sont regroupées", size=20, color=GRIS)
for i, (but, mots) in enumerate([("Pour convaincre", ("Problème", "Solution", "Bénéfice")), ("Pour expliquer", ("Pourquoi", "Quoi", "Comment")), ("Pour raconter", ("Avant", "Aujourd'hui", "Demain"))]):
    x = 90 + i * 590
    carte(s, x, 460, 560, 400)
    text(s, x + 40, 495, 480, 40, [[(but.upper(), "m")]], size=13, color=CIEL)
    for j, mot in enumerate(mots):
        text(s, x + 40, 565 + j * 95, 480, 70, [[(f"{j + 1}. ", f"c:{CIEL}"), (mot, f"c:{ENCRE}")]], size=28)
dessin(s, "etoile", "ciel", 1740, 150, 56)
dessin(s, "coeur", "orange", 1790, 900, 36)
footer(s, n=7)
notes(s, "Étape 3 : regrouper en 3 tas.\nChaque tas devient une partie. Si les tas ne viennent pas naturellement, on prend un plan tout prêt :\n- Problème → Solution → Bénéfice (pour convaincre)\n- Pourquoi → Quoi → Comment (pour expliquer)\n- Avant → Aujourd'hui → Demain (pour raconter)")

# ---------------------------------------------------------------- 8. Étape 4 (sans surtitre, comme dans la version corrigée)
s = blanche()
pastille(s, 90, 200, 4, 76)
titre(s, "Associer les idées ", "aux images", y=196, x=200, w=1600)
text(s, 90, 390, 1050, 330, [[("Pour chaque partie :", f"c:{GRIS} s:24")], [("1 mot-clé", f"serif c:{ROYAL} s:44")], [("+ 1 anecdote, un exemple ou une image", f"c:{ENCRE} s:26")]], size=24, spacing=1.45)
text(s, 90, 790, 1000, 90, "Une histoire se retient sans effort. Une phrase rédigée, elle, doit être apprise.", size=20, color=GRIS, spacing=1.3)
dessin(s, "bulle", "ciel", 1260, 400, 320)
dessin(s, "etincelle", "orange", 1560, 360, 70)
dessin(s, "fleche", "ciel", 1250, 790, 200)
dessin(s, "etoile", "ciel", 1640, 700, 56)
footer(s, n=8)
notes(s, "Étape 4 : accrocher de la chair à chaque os.\nPour chaque partie, on note un mot-clé et une anecdote, un exemple ou une image. Une histoire se retient sans effort, alors qu'une phrase rédigée demande d'être apprise.\nExemple : « Trajets » → « Marc gagne 1 h 30 par jour depuis qu'il télétravaille le vendredi. »")

# ---------------------------------------------------------------- 9. Étape 5
s = blanche()
etape(s, 5, "L'entrée ", "et la sortie")
for i, (nom, contenu) in enumerate([("Introduction", "Une accroche, puis l'annonce des 3 parties."), ("Conclusion", "Le rappel du message central, puis une action ou une question pour le public.")]):
    x = 90 + i * 880
    carte(s, x, 400, 850, 260)
    text(s, x + 40, 435, 770, 50, [[(nom, "m")]], size=26, color=ROYAL)
    text(s, x + 40, 505, 770, 140, contenu, size=20, color=ENCRE, spacing=1.3)
text(s, 90, 720, 1740, 70, [[("Le seul passage appris par cœur : ", f"c:{ENCRE}"), ("la première et la dernière phrase.", f"serif c:{ROYAL} s:34")]], size=24)
text(s, 90, 810, 1740, 50, "Entre les deux, on parle librement autour des mots-clés.", size=20, color=GRIS)
dessin(s, "micro", "ciel", 1720, 150, 90)
dessin(s, "coeur", "orange", 1650, 200, 36)
footer(s, n=9)
notes(s, "Étape 5 : l'entrée et la sortie.\n- Introduction : une accroche, puis l'annonce des 3 parties.\n- Conclusion : le rappel du message central, puis une action ou une question pour le public.\nC'est le seul passage qu'on apprend par cœur : la première et la dernière phrase. Entre les deux, on parle librement autour des mots-clés.")

# ---------------------------------------------------------------- 10. Exercice
s = bleue()
surtitre(s, "Exercice en ligne", bleu=True)
titre(s, "À vous ", "de jouer !", bleu=True)
carte(s, 90, 380, 1000, 480, "FFFFFF")
text(s, 140, 420, 900, 50, [[("Sur papier, un sujet personnel", "m")]], size=24, color=ENCRE)
text(s, 140, 482, 900, 40, "Mon métier, mon dernier voyage, une passion…", size=17, color=GRIS)
for j, (n, t) in enumerate([("1", "message central"), ("3", "mots-clés"), ("1", "anecdote par mot-clé")]):
    y = 560 + j * 95
    pastille(s, 140, y, n, 64)
    text(s, 240, y, 800, 64, t, size=24, color=ENCRE, anchor=MSO_ANCHOR.MIDDLE)
dessin(s, "micro", "blanc", 1340, 380, 260)
dessin(s, "etincelle", "or", 1680, 330, 70)
dessin(s, "gribouillis", "blanc", 1560, 780, 160)
dessin(s, "coeur", "orange", 1250, 760, 40)
footer(s, dark=True, n=10)
notes(s, "Exercice en ligne.\nChacun choisit un sujet personnel (mon métier, mon dernier voyage, une passion) et note sur papier : 1 message central, 3 mots-clés et 1 anecdote par mot-clé.\nTemps 3, mise en voix (2 à 3 volontaires, 1 min chacun) : chaque volontaire présente caméra allumée, sans notes, en montrant 1, 2 puis 3 doigts à l'écran pour marquer chaque partie.")

# ---------------------------------------------------------------- 11. Vos questions, vos blocages
s = blanche()
surtitre(s, "À vous la parole")
titre(s, "Vos questions, ", "vos blocages.")
dessin(s, "bulle", "ciel", 700, 380, 300)
dessin(s, "bulle", "royal", 1010, 470, 190)
dessin(s, "etincelle", "orange", 1240, 400, 60)
dessin(s, "coeur", "orange", 640, 600, 36)
text(s, 90, 768, 1740, 60, "Écrivez votre question dans le chat ou levez la main : on en parle ensemble.", size=22, color=ENCRE, align=PP_ALIGN.CENTER)
footer(s, n=11)
notes(s, "Questions sur vos blocages.\nOuvrir la parole : qu'est-ce qui vous bloque quand vous prenez la parole ? (trou de mémoire, trac, ne pas savoir par où commencer, débit trop rapide…)\nLes participants écrivent dans le chat ou lèvent la main.")

# ---------------------------------------------------------------- 12. Conclusion
s = bleue()
surtitre(s, "Conclusion", bleu=True)
text(s, 90, 420, 1000, 200, [[("Merci ! ", ""), ("À très vite.", "serif s:72")]], size=56)
dessin(s, "souligne", "orange", 500, 605, 420)
for i, (url, nom, label) in enumerate([(URL_AVIS, "qr-avis", "Donnez votre avis"), (URL_SEANCE, "qr-seance", "Réservez une séance")]):
    x = 1230 + i * 330
    box(s, x, 330, 300, 300, "FFFFFF", None, radius=0.06)
    pic(s, qr(url, nom), x + 25, 355, w=250)
    text(s, x - 15, 655, 330, 50, label, size=15, color="FFFFFF", align=PP_ALIGN.CENTER)
dessin(s, "etincelle", "or", 1170, 250, 64)
dessin(s, "coeur", "orange", 1830, 270, 40)
dessin(s, "etoile", "blanc", 300, 260, 50)
dessin(s, "fleche", "blanc", 900, 700, 190)
footer(s, dark=True, n=12)
notes(s, f"Conclusion et transition.\nRappel du message central : on retient bien mieux un plan qu'un texte.\nQR code de gauche : donner son avis ({URL_AVIS}).\nQR code de droite : réserver une séance avec Rebecca ({URL_SEANCE}).")

prs.save(OUT)
print("ok", OUT)
