"""
Génère le modèle de présentation des ateliers LEQ (PowerPoint 16:9, importable dans Canva).
Utilisation (depuis le dossier du projet) :
    python communication/atelier/generer-modele.py
Nécessite : pip install python-pptx qrcode pillow
Résultat : communication/atelier/LEQ-modele-atelier.pptx
"""
import math
import os
import tempfile

import qrcode
from PIL import Image, ImageDraw, ImageFilter
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "communication", "atelier", "LEQ-modele-atelier.pptx")
TMP = tempfile.mkdtemp(prefix="leq-pptx-")

NAVY, ROYAL, SKY, GOLD, ORANGE, CLOUD, CREAM = "001636", "114DA8", "2A64C4", "FFBD59", "FF5E01", "E8EFFA", "FFF6D6"
SANS = "SF Pro Display"
SERIF = "Relationship of Mélodrame"  # italiques d'accent de la charte
W, H = 1920, 1080  # pixels des fonds (16:9)


def rgb(h):
    return RGBColor.from_string(h)


def hex2t(h):
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------- fonds et dessins (PNG)

def gradient(stops, angle_mix=0.45):
    ver = Image.linear_gradient("L").resize((W, H))
    hor = Image.linear_gradient("L").rotate(90, expand=True).resize((W, H)).transpose(Image.FLIP_LEFT_RIGHT)
    mix = Image.blend(ver, hor, angle_mix)
    a, b, c = [hex2t(s) for s in stops]
    lut = []
    for i in range(256):
        t = i / 255
        if t < 0.55:
            k = t / 0.55
            lut.append(tuple(int(a[j] + (b[j] - a[j]) * k) for j in range(3)))
        else:
            k = (t - 0.55) / 0.45
            lut.append(tuple(int(b[j] + (c[j] - b[j]) * k) for j in range(3)))
    return Image.merge("RGB", [mix.point([l[j] for l in lut]) for j in range(3)])


def glow(im, box, strength):
    g = Image.new("L", im.size, 0)
    ImageDraw.Draw(g).ellipse(box, fill=strength)
    g = g.filter(ImageFilter.GaussianBlur(160))
    return Image.composite(Image.new("RGB", im.size, (255, 255, 255)), im, g)


BG = {}


def background(kind):
    if kind in BG:
        return BG[kind]
    if kind == "hero":
        im = glow(gradient(["0B3070", "114DA8", "2A64C4"]), (1050, 120, 1900, 900), 40)
    elif kind == "night":
        im = glow(gradient(["000d21", "001636", "0B3070"]), (1200, -200, 2100, 600), 25)
    elif kind == "light":
        im = gradient(["FFFFFF", "F6F8FC", "E8EFFA"], 0.2)
    elif kind == "warm":
        im = gradient(["FBF8F4", "EDE7E1", "D5DDEB"], 0.3)
    elif kind == "ember":
        im = gradient(["2E1106", "0b1d3f", "001636"])
    path = os.path.join(TMP, f"bg-{kind}.png")
    im.save(path)
    BG[kind] = path
    return path


def doodle(name, size=240):
    S = size * 2
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S / 2
    if name.startswith("sparkle"):
        col = hex2t(GOLD) if name == "sparkle" else (255, 255, 255)
        r, wd = S * 0.46, int(S * 0.06)
        for ang in range(0, 360, 45):
            a = math.radians(ang)
            r1 = r * (0.42 if ang % 90 else 0.38)
            d.line((c + math.cos(a) * r1, c + math.sin(a) * r1, c + math.cos(a) * r, c + math.sin(a) * r), fill=col, width=wd)
    elif name == "heart":
        pts = []
        for i in range(200):
            t = i / 200 * 2 * math.pi
            x = 16 * math.sin(t) ** 3
            y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
            pts.append((c + x * S / 36, c - y * S / 36))
        d.polygon(pts, fill=hex2t(ORANGE))
    elif name == "mic":
        s = S
        d.rounded_rectangle((s * 0.36, s * 0.06, s * 0.64, s * 0.52), radius=s * 0.14, fill=(255, 255, 255), outline=hex2t(NAVY), width=int(s * 0.03))
        for k in (0.18, 0.27, 0.36):
            d.line((s * 0.42, s * k, s * 0.58, s * k), fill=hex2t(NAVY), width=int(s * 0.022))
        d.arc((s * 0.24, s * 0.16, s * 0.76, s * 0.66), start=0, end=180, fill=hex2t(ORANGE), width=int(s * 0.035))
        d.line((c, s * 0.66, c, s * 0.86), fill=hex2t(ORANGE), width=int(s * 0.035))
        d.line((s * 0.38, s * 0.88, s * 0.62, s * 0.88), fill=hex2t(ORANGE), width=int(s * 0.035))
    elif name == "bubble":
        x, y, w, h = S * 0.06, S * 0.16, S * 0.88, S * 0.5
        d.rounded_rectangle((x, y, x + w, y + h), radius=h * 0.28, fill=(255, 255, 255), outline=hex2t(NAVY), width=int(S * 0.025))
        d.polygon([(x + w * 0.22, y + h - 6), (x + w * 0.22, y + h * 1.45), (x + w * 0.42, y + h - 6)], fill=(255, 255, 255))
        d.line((x + w * 0.22, y + h - 2, x + w * 0.22, y + h * 1.45), fill=hex2t(NAVY), width=int(S * 0.025))
        d.line((x + w * 0.22, y + h * 1.45, x + w * 0.42, y + h - 2), fill=hex2t(NAVY), width=int(S * 0.025))
        d.line((x + w * 0.18, y + h * 0.38, x + w * 0.82, y + h * 0.38), fill=hex2t(ORANGE), width=int(S * 0.035))
        d.line((x + w * 0.18, y + h * 0.62, x + w * 0.6, y + h * 0.62), fill=hex2t(ORANGE), width=int(S * 0.035))
    path = os.path.join(TMP, f"d-{name}.png")
    im.resize((size, size), Image.LANCZOS).save(path)
    return path


def arch_photo(src, w=900, h=1100):
    """Photo dans une arche (haut arrondi) avec bordure blanche, comme sur le site."""
    im = Image.open(src).convert("RGB")
    r = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
    left = (im.width - w) // 2
    im = im.crop((left, 0, left + w, h))
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, w, h), radius=60, fill=255)
    md.rectangle((0, 0, w, w // 2), fill=0)
    md.pieslice((0, 0, w, w), 180, 360, fill=255)
    border = 18
    out = Image.new("RGBA", (w + border * 2, h + border * 2), (0, 0, 0, 0))
    bm = Image.new("L", out.size, 0)
    bd = ImageDraw.Draw(bm)
    W2 = w + border * 2
    bd.rounded_rectangle((0, 0, W2, out.size[1]), radius=60 + border, fill=255)
    bd.rectangle((0, 0, W2, W2 // 2), fill=0)
    bd.pieslice((0, 0, W2, W2), 180, 360, fill=255)
    out.paste(Image.new("RGBA", out.size, (255, 255, 255, 255)), (0, 0), bm)
    photo = im.convert("RGBA")
    photo.putalpha(mask)
    out.alpha_composite(photo, (border, border))
    path = os.path.join(TMP, "arch.png")
    out.save(path)
    return path


def rounded_photo(src, w, h, radius=60, name="photo"):
    im = Image.open(src).convert("RGB")
    r = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
    left, top = (im.width - w) // 2, int((im.height - h) * 0.2)
    im = im.crop((left, top, left + w, top + h)).convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    im.putalpha(mask)
    path = os.path.join(TMP, f"{name}.png")
    im.save(path)
    return path


def qr(url):
    img = qrcode.make(url, border=1).convert("RGB")
    path = os.path.join(TMP, "qr.png")
    img.save(path)
    return path


# ---------------------------------------------------------------- briques PowerPoint

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BLANK = prs.slide_layouts[6]
PX = Emu(int(Inches(13.333) / W))  # 1 pixel de fond en EMU


def px(v):
    return Emu(int(v * PX))


def new_slide(bg):
    s = prs.slides.add_slide(BLANK)
    s.shapes.add_picture(background(bg), 0, 0, prs.slide_width, prs.slide_height)
    return s


def text(s, x, y, w, h, runs, size=28, color="FFFFFF", align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.1):
    """runs : liste de paragraphes ; chaque paragraphe = liste de (texte, style) avec style dans
    {'b' gras, 'serif' italique d'accent, 'c:RRGGBB' couleur, 's:NN' taille}."""
    tb = s.shapes.add_textbox(px(x), px(y), px(w), px(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    if isinstance(runs, str):
        runs = [[(runs, "")]]
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = spacing
        for txt, style in para:
            r = p.add_run()
            r.text = txt
            f = r.font
            f.name = SANS
            f.size = Pt(size)
            f.color.rgb = rgb(color)
            f.bold = False
            for st in style.split():
                if st == "b":
                    f.bold = True
                elif st == "serif":
                    f.name = SERIF
                    f.italic = True
                elif st.startswith("c:"):
                    f.color.rgb = rgb(st[2:])
                elif st.startswith("s:"):
                    f.size = Pt(int(st[2:]))
    return tb


def box(s, x, y, w, h, fill, line=None, radius=0.12, line_w=2.5, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    sh = s.shapes.add_shape(shape, px(x), px(y), px(w), px(h))
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        sh.adjustments[0] = radius
    if fill:
        sh.fill.solid()
        sh.fill.fore_color.rgb = rgb(fill)
    else:
        sh.fill.background()
    if line:
        sh.line.color.rgb = rgb(line)
        sh.line.width = Pt(line_w)
    else:
        sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def pic(s, path, x, y, w=None, h=None):
    return s.shapes.add_picture(path, px(x), px(y), px(w) if w else None, px(h) if h else None)


def logo(s, x=90, y=60, dark=False, size=22):
    text(s, x, y, 300, 60, [[("LEQ", "b c:" + (NAVY if dark else "FFFFFF")), (".", "b c:" + ORANGE)]], size=size)


def eyebrow(s, x, y, label, color=GOLD, w=1200):
    text(s, x, y, w, 40, [[(label.upper(), "b")]], size=11, color=color)


def footer(s, dark=False, n=None):
    col = "94A0B4" if dark else "8FA3C7"
    text(s, 90, 1005, 900, 40, "Lieben Éloquence · liebeneloquence.com", size=10, color=col)
    if n:
        text(s, 1700, 1005, 130, 40, str(n), size=10, color=col, align=PP_ALIGN.RIGHT)


PHOTO = os.path.join(ROOT, "public", "images", "rebecca", "pont-du-gard.jpg")
PORTRAIT = os.path.join(ROOT, "public", "images", "rebecca", "portrait-rose.jpg")

# ---------------------------------------------------------------- 1. Couverture
s = new_slide("hero")
logo(s)
eyebrow(s, 90, 250, "Atelier · Prise de parole")
text(s, 90, 300, 1000, 330, [[("Titre de votre", "b")], [("atelier", "serif c:" + GOLD + " s:84")]], size=60, spacing=0.95)
text(s, 95, 660, 950, 60, "Établissement · Date · Lieu", size=20, color="E6EDFA")
box(s, 90, 770, 600, 76, None, "FFFFFF", radius=0.5, line_w=1.5)
text(s, 90, 770, 600, 76, "Animé par Rebecca Lieben Ahiale", size=15, color="FFFFFF", align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
pic(s, arch_photo(PHOTO), 1250, 150, w=540)
pic(s, doodle("sparkle", 200), 1720, 90, w=110)
pic(s, doodle("heart", 200), 1180, 850, w=80)
pic(s, doodle("bubble", 300), 1080, 220, w=170)

# ---------------------------------------------------------------- 2. Qui suis-je ?
s = new_slide("light")
logo(s, dark=True)
pic(s, rounded_photo(PORTRAIT, 760, 900, name="portrait"), 110, 120, w=560)
pic(s, doodle("sparkle", 200), 610, 90, w=100)
eyebrow(s, 780, 170, "La formatrice", ORANGE)
text(s, 780, 205, 1050, 150, [[("Qui suis-", "b c:" + NAVY), ("je ?", "serif c:" + ROYAL + " s:62")]], size=50)
text(s, 780, 360, 1020, 280,
     "Rebecca Lieben Ahiale, passionnée de la scène, du public et du micro. Depuis 2019, je pratique, je concours, je juge et j'accompagne : aujourd'hui, je transmets cette maîtrise de la parole à celles et ceux qui veulent oser et convaincre.",
     size=15, color="33415C", spacing=1.35)
for i, (y_, t) in enumerate([("2022", "Vice-championne du concours d'art oratoire au féminin"), ("2023", "Lauréate du Trophée Coup de Cœur de la meilleure compétition d'éloquence du Togo"), ("2025", "Présidente d'Eloquentia Toulon"), ("2026", "Vice-championne du Mondial de la Parole")]):
    yy = 640 + i * 82
    text(s, 780, yy, 130, 60, [[(y_, "serif c:" + ORANGE)]], size=24)
    text(s, 920, yy + 6, 900, 90, t, size=14, color=NAVY)
footer(s, n=2)

# ---------------------------------------------------------------- 3. Objectifs
s = new_slide("light")
logo(s, dark=True)
eyebrow(s, 90, 170, "Objectifs de l'atelier", ORANGE)
text(s, 90, 210, 1600, 140, [[("À la fin de l'atelier, ", "b c:" + NAVY), ("vous saurez…", "serif c:" + ROYAL + " s:54")]], size=44)
for i in range(3):
    x = 90 + i * 590
    box(s, x, 420, 550, 440, "FFFFFF", NAVY, radius=0.1)
    box(s, x + 40, 460, 90, 90, GOLD, None, shape=MSO_SHAPE.OVAL)
    text(s, x + 40, 460, 90, 90, str(i + 1), size=34, color=NAVY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE).text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x + 40, 580, 470, 80, f"Objectif {i + 1}", size=22, color=NAVY).text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x + 40, 660, 470, 180, "Décrivez en une ou deux phrases ce que les participants sauront faire.", size=18, color="5B6B85", spacing=1.3)
pic(s, doodle("sparkle", 200), 1700, 150, w=100)
footer(s, n=3)

# ---------------------------------------------------------------- 4. Déroulé de la séance
s = new_slide("hero")
logo(s)
eyebrow(s, 90, 170, "Déroulé de la séance")
text(s, 90, 210, 1600, 140, [[("Les 4 étapes ", "b"), ("de la séance.", "serif c:" + GOLD + " s:54")]], size=44)
steps = [("Quiz & icebreaker", "Retour sur la séance précédente"), ("Théorie", "Discussions autour des thématiques"), ("Exercices", "Icebreaker, mise en contexte"), ("Feedback", "Attestation, évaluation finale")]
box(s, 180, 545, 1560, 8, GOLD, None, radius=0.5)
for i, (t, d_) in enumerate(steps):
    x = 90 + i * 440
    box(s, x + 40, 480, 130, 130, GOLD, "FFFFFF", shape=MSO_SHAPE.OVAL, line_w=4)
    text(s, x + 40, 480, 130, 130, str(i + 1), size=48, color=NAVY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE).text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x, 650, 400, 40, f"ÉTAPE {i + 1}", size=11, color=GOLD).text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x, 690, 400, 60, t, size=20).text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x, 750, 390, 140, d_, size=14, color="DCE6F7", spacing=1.3)
footer(s, dark=True, n=4)

# ---------------------------------------------------------------- 5. Séparateur de partie
s = new_slide("night")
logo(s)
text(s, 90, 230, 560, 460, [[("01", "serif c:" + GOLD)]], size=190)
text(s, 660, 390, 1150, 130, [[("Titre de la partie", "b")]], size=50)
text(s, 665, 550, 1100, 80, "Une phrase pour introduire ce que l'on va voir.", size=20, color="B9C6DE")
pic(s, doodle("mic", 300), 1600, 600, w=230)
pic(s, doodle("sparkle", 200), 1500, 220, w=110)
footer(s, dark=True, n=5)

# ---------------------------------------------------------------- 6. Contenu (texte + image)
s = new_slide("light")
logo(s, dark=True)
eyebrow(s, 90, 170, "Partie 1", ORANGE)
text(s, 90, 210, 900, 160, [[("Titre de la ", "b c:" + NAVY), ("notion.", "serif c:" + ROYAL + " s:54")]], size=44)
text(s, 90, 380, 860, 520, [
    [("•  ", "b c:" + ORANGE), ("Premier point clé, en une phrase courte.", "")],
    [("•  ", "b c:" + ORANGE), ("Deuxième point clé, avec un exemple concret.", "")],
    [("•  ", "b c:" + ORANGE), ("Troisième point clé, à retenir.", "")],
], size=19, color="33415C", spacing=1.6)
ph = box(s, 1060, 170, 770, 760, CLOUD, ROYAL, radius=0.06, line_w=2)
ph.line.dash_style = 4
text(s, 1060, 170, 770, 760, "Insérez une image ou un schéma", size=20, color="5B6B85", align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
footer(s, n=6)

# ---------------------------------------------------------------- 7. Exercice
s = new_slide("ember")
logo(s)
eyebrow(s, 90, 170, "Exercice · Mise en situation", ORANGE)
text(s, 90, 210, 1300, 160, [[("À vous ", "b"), ("de jouer !", "serif c:" + ORANGE + " s:64")]], size=54)
box(s, 90, 420, 1100, 460, "FFFFFF", None, radius=0.08)
text(s, 140, 460, 1000, 60, "Consigne", size=22, color=NAVY).text_frame.paragraphs[0].runs[0].font.bold = True
text(s, 140, 530, 1000, 330, [
    [("1.  ", "b c:" + ORANGE), ("Première consigne de l'exercice.", "")],
    [("2.  ", "b c:" + ORANGE), ("Deuxième consigne.", "")],
    [("3.  ", "b c:" + ORANGE), ("Partage et retours du groupe.", "")],
], size=22, color="33415C", spacing=1.6)
box(s, 1330, 470, 380, 380, ORANGE, None, shape=MSO_SHAPE.OVAL)
text(s, 1330, 500, 380, 230, [[("5", "b")]], size=90, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1330, 740, 380, 50, "minutes", size=20, align=PP_ALIGN.CENTER)
pic(s, doodle("sparkle", 200), 1700, 380, w=100)
footer(s, dark=True, n=7)

# ---------------------------------------------------------------- 8. Citation
s = new_slide("hero")
logo(s)
text(s, 240, 300, 1440, 420, [[("« Avant d'être des êtres rationnels, nous sommes des êtres d'émotion. »", "serif c:" + GOLD)]], size=46, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=1.15)
text(s, 240, 760, 1440, 50, "Rebecca Lieben Ahiale", size=20, color="DCE6F7", align=PP_ALIGN.CENTER)
pic(s, doodle("bubble", 300), 130, 180, w=190)
pic(s, doodle("heart", 200), 1680, 760, w=80)
footer(s, dark=True, n=8)

# ---------------------------------------------------------------- 9. Chiffres clés
s = new_slide("night")
logo(s)
eyebrow(s, 90, 170, "Le saviez-vous ?")
text(s, 90, 210, 1600, 140, [[("La prise de parole ", "b"), ("en chiffres.", "serif c:" + GOLD + " s:54")]], size=44)
for i, (v, u, t) in enumerate([("75", "%", "des gens craignent de parler en public"), ("3", "x", "plus redoutable que la peur de la mort"), ("7", "min", "suffisent pour convaincre un jury")]):
    x = 90 + i * 590
    text(s, x, 400, 550, 270, [[(v, "serif c:" + GOLD + " s:115"), (u, "serif s:54")]], size=115, align=PP_ALIGN.CENTER)
    text(s, x + 40, 720, 470, 120, t, size=18, color="E6EDFA", align=PP_ALIGN.CENTER, spacing=1.3)
footer(s, dark=True, n=9)

# ---------------------------------------------------------------- 10. Question au public
s = new_slide("light")
logo(s, dark=True)
eyebrow(s, 90, 170, "Quiz", ORANGE)
text(s, 90, 210, 1700, 200, [[("Votre question ", "b c:" + NAVY), ("au public ?", "serif c:" + ROYAL + " s:54")]], size=44)
for i, L in enumerate("ABCD"):
    x, y = 90 + (i % 2) * 880, 450 + (i // 2) * 240
    box(s, x, y, 840, 200, "FFFFFF", NAVY, radius=0.18)
    box(s, x + 35, y + 50, 100, 100, [GOLD, ORANGE, ROYAL, SKY][i], None, shape=MSO_SHAPE.OVAL)
    t = text(s, x + 35, y + 50, 100, 100, L, size=36, color="FFFFFF" if i > 0 else NAVY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    t.text_frame.paragraphs[0].runs[0].font.bold = True
    text(s, x + 170, y + 50, 640, 100, f"Réponse {L}", size=20, color=NAVY, anchor=MSO_ANCHOR.MIDDLE)
footer(s, n=10)

# ---------------------------------------------------------------- 11. À retenir
s = new_slide("warm")
logo(s, dark=True)
eyebrow(s, 90, 170, "À retenir", ORANGE)
text(s, 90, 210, 1600, 140, [[("Ce que vous ", "b c:" + NAVY), ("emportez.", "serif c:" + ORANGE + " s:54")]], size=44)
for i in range(4):
    y = 400 + i * 130
    box(s, 90, y, 1100, 105, "FFFFFF", None, radius=0.3)
    box(s, 120, y + 22, 60, 60, ORANGE, None, shape=MSO_SHAPE.OVAL)
    text(s, 120, y + 22, 60, 60, "✓", size=20, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text(s, 210, y, 950, 105, f"Point à retenir n°{i + 1}", size=19, color=NAVY, anchor=MSO_ANCHOR.MIDDLE)
pic(s, doodle("mic", 300), 1380, 380, w=320)
pic(s, doodle("sparkle", 200), 1650, 300, w=100)
footer(s, n=11)

# ---------------------------------------------------------------- 12. Merci
s = new_slide("hero")
logo(s)
text(s, 90, 220, 1100, 250, [[("Merci ", "b"), ("!", "serif c:" + GOLD)]], size=100)
text(s, 95, 500, 1150, 70, "Des questions ? Restons en contact.", size=24, color="E6EDFA")
text(s, 95, 640, 1000, 220, [
    [("formationn@liebeneloquence.com", "")],
    [("liebeneloquence.com", "b c:" + GOLD)],
    [("Instagram : @becca_lieben", "")],
], size=18, spacing=1.5)
box(s, 1350, 330, 420, 420, "FFFFFF", None, radius=0.08)
pic(s, qr("https://liebeneloquence.com/quiz"), 1390, 370, w=340)
text(s, 1300, 770, 520, 80, "Faites le quiz d'orateur", size=15, color="FFFFFF", align=PP_ALIGN.CENTER)
pic(s, doodle("sparkle", 200), 1720, 220, w=100)
pic(s, doodle("heart", 200), 1250, 760, w=70)

prs.save(OUT)
print("ok", OUT)
