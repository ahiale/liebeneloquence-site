"""
Génère l'image de partage du site (aperçu WhatsApp, LinkedIn, Instagram…) : public/partage.jpg, 1200 × 630.
Utilisation (depuis le dossier du projet) :  python outils/generer-image-partage.py
Nécessite : pip install pillow
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FONTS = os.path.join(ROOT, "src", "design", "fonts")
PHOTO = os.path.join(ROOT, "public", "images", "rebecca", "pont-du-gard.jpg")
OUT = os.path.join(ROOT, "public", "partage.jpg")

W, H, K = 1200, 630, 2  # dessin en double résolution, réduit à la fin
NAVY, ROYAL, SKY, GOLD, ORANGE = (0, 22, 54), (17, 77, 168), (42, 100, 196), (255, 189, 89), (255, 94, 1)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size * K)


# Fond : dégradé bleu nuit → bleu roi, halo lumineux à droite
bg = Image.new("RGB", (W * K, H * K))
px = bg.load()
for y in range(H * K):
    for x in range(0, W * K):
        t = min(1, max(0, (x / (W * K)) * 0.65 + (y / (H * K)) * 0.35))
        c = [int(NAVY[i] + (ROYAL[i] - NAVY[i]) * t / 0.6) if t < 0.6 else int(ROYAL[i] + (SKY[i] - ROYAL[i]) * (t - 0.6) / 0.4) for i in range(3)]
        px[x, y] = tuple(c)
halo = Image.new("L", bg.size, 0)
ImageDraw.Draw(halo).ellipse((700 * K, -100 * K, 1300 * K, 500 * K), fill=60)
bg = Image.composite(Image.new("RGB", bg.size, (255, 255, 255)), bg, halo.filter(ImageFilter.GaussianBlur(120 * K)))
d = ImageDraw.Draw(bg)

# Photo dans une arche à bordure blanche
aw, ah, b = 330 * K, 440 * K, 10 * K
ph = Image.open(PHOTO).convert("RGB")
r = max(aw / ph.width, ah / ph.height)
ph = ph.resize((int(ph.width * r), int(ph.height * r)), Image.LANCZOS)
ph = ph.crop(((ph.width - aw) // 2, 0, (ph.width - aw) // 2 + aw, ah))


def arch(w, h):
    m = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(m)
    md.rounded_rectangle((0, 0, w, h), radius=40 * K, fill=255)
    md.rectangle((0, 0, w, w // 2), fill=0)
    md.pieslice((0, 0, w, w), 180, 360, fill=255)
    return m


ax, ay = 800 * K, 110 * K
bg.paste((255, 255, 255), (ax - b, ay - b, ax + aw + b, ay + ah + b), arch(aw + 2 * b, ah + 2 * b))
bg.paste(ph, (ax, ay), arch(aw, ah))

# Étincelle dorée
cx, cy = 1135 * K, 95 * K
for ang in range(0, 360, 45):
    a = math.radians(ang)
    r0, r1 = (16 if ang % 90 else 13) * K, 34 * K
    d.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * r1, cy + math.sin(a) * r1), fill=GOLD, width=5 * K)

# Logo
x0 = 70 * K
lg = font("sf-pro-display-700.otf", 34)
d.text((x0, 52 * K), "LEQ", font=lg, fill="white")
lw = d.textlength("LEQ", font=lg)
d.ellipse((x0 + lw + 4 * K, 52 * K + 30 * K, x0 + lw + 14 * K, 52 * K + 40 * K), fill=ORANGE)

# Surtitre
d.text((x0, 150 * K), "COACHING PRISE DE PAROLE  ·  FORMATION ÉLOQUENCE", font=font("sf-pro-display-600.otf", 15), fill=GOLD)

# Titre : « Parlez pour plaire, convaincre, impacter. »
big = font("sf-pro-display-700.otf", 58)
ser = font("melodrame.ttf", 66)
y = 190 * K
d.text((x0, y), "Parlez pour", font=big, fill="white")
y += 74 * K
line = [("plaire, ", ser, GOLD), ("convaincre,", ser, GOLD)]
x = x0
for txt, f, col in line:
    d.text((x, y), txt, font=f, fill=col)
    x += d.textlength(txt, font=f)
y += 78 * K
d.text((x0, y), "impacter.", font=big, fill="white")
d.line((x0, y + 82 * K, x0 + 230 * K, y + 82 * K), fill=ORANGE, width=5 * K)

# Pied
d.text((x0, 520 * K), "Grand Oral · Oral de BTS · Soutenance · Concours d'éloquence", font=font("sf-pro-display-500.otf", 19), fill=(230, 237, 250))
d.text((x0, 555 * K), "liebeneloquence.com", font=font("sf-pro-display-700.otf", 19), fill="white")

bg.resize((W, H), Image.LANCZOS).save(OUT, quality=88, optimize=True, progressive=True)
print("ok", OUT, os.path.getsize(OUT) // 1024, "Ko")
