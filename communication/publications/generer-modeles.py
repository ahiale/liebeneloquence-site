"""
Génère les modèles de publications Instagram / LinkedIn LEQ (PowerPoint au format 4:5, 1080 × 1350,
importable dans Canva) et le logo « fun » en PNG.
Utilisation (depuis le dossier du projet) :
    python communication/publications/generer-modeles.py
Nécessite : pip install python-pptx pillow
Résultats : communication/publications/LEQ-modeles-publications.pptx
            communication/publications/logo-fun.png (fond transparent)
"""
import math
import os
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Pt

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HERE = os.path.join(ROOT, "communication", "publications")
OUT = os.path.join(HERE, "LEQ-modeles-publications.pptx")
LOGO_OUT = os.path.join(HERE, "logo-fun.png")
FONTS = os.path.join(ROOT, "src", "design", "fonts")
TMP = tempfile.mkdtemp(prefix="leq-posts-")

NAVY, ROYAL, GOLD, ORANGE, CREAM = "001636", "114DA8", "FFBD59", "FF5E01", "FFF6D6"
SANS = "SF Pro Display"
SERIF = "Relationship of Mélodrame"
W, H = 1080, 1350  # pixels d'une publication 4:5 ; 1 px = 0,5 pt


def rgb(h):
    return RGBColor.from_string(h)


def hex2t(h):
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------- fonds et dessins (PNG)

def gradient(stops, mix_k=0.45):
    ver = Image.linear_gradient("L").resize((W, H))
    hor = Image.linear_gradient("L").rotate(90, expand=True).resize((W, H)).transpose(Image.FLIP_LEFT_RIGHT)
    mix = Image.blend(ver, hor, mix_k)
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
    g = g.filter(ImageFilter.GaussianBlur(140))
    return Image.composite(Image.new("RGB", im.size, (255, 255, 255)), im, g)


BG = {}


def background(kind):
    if kind in BG:
        return BG[kind]
    if kind == "hero":
        im = glow(gradient(["0B3070", "114DA8", "2A64C4"]), (500, 0, 1300, 700), 40)
    elif kind == "night":
        im = glow(gradient(["000d21", "001636", "0B3070"]), (600, -300, 1400, 400), 25)
    elif kind == "light":
        im = gradient(["FFFFFF", "F6F8FC", "E8EFFA"], 0.2)
    elif kind == "warm":
        im = gradient(["FBF8F4", "EDE7E1", "D5DDEB"], 0.3)
    elif kind == "orange":
        im = glow(gradient(["FF5E01", "FF7A1F", "FFBD59"]), (-200, 900, 600, 1600), 30)
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
    elif name == "arrow":
        col = hex2t(GOLD)
        wd = int(S * 0.05)
        pts = [(S * 0.08 + i * S * 0.0084, S * 0.62 - math.sin(i / 100 * math.pi) * S * 0.22) for i in range(101)]
        d.line(pts, fill=col, width=wd, joint="curve")
        d.line((S * 0.92, S * 0.62, S * 0.76, S * 0.5), fill=col, width=wd)
        d.line((S * 0.92, S * 0.62, S * 0.76, S * 0.74), fill=col, width=wd)
    elif name == "underline":
        pts = [(S * 0.04 + i * S * 0.0092, S * 0.5 + math.sin(i / 100 * math.pi * 2.2) * S * 0.04) for i in range(101)]
        d.line(pts, fill=hex2t(ORANGE), width=int(S * 0.035), joint="curve")
    path = os.path.join(TMP, f"d-{name}.png")
    im.resize((size, size), Image.LANCZOS).save(path)
    return path


def arch_photo(src, w=700, h=860, name="arch"):
    """Photo dans une arche (haut arrondi) avec bordure blanche, comme sur le site."""
    im = Image.open(src).convert("RGB")
    r = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
    left = (im.width - w) // 2
    im = im.crop((left, 0, left + w, h))
    border = 16

    def arch_mask(size_w, size_h):
        m = Image.new("L", (size_w, size_h), 0)
        md = ImageDraw.Draw(m)
        md.rounded_rectangle((0, 0, size_w, size_h), radius=56, fill=255)
        md.rectangle((0, 0, size_w, size_w // 2), fill=0)
        md.pieslice((0, 0, size_w, size_w), 180, 360, fill=255)
        return m

    out = Image.new("RGBA", (w + border * 2, h + border * 2), (0, 0, 0, 0))
    out.paste(Image.new("RGBA", out.size, (255, 255, 255, 255)), (0, 0), arch_mask(*out.size))
    photo = im.convert("RGBA")
    photo.putalpha(arch_mask(w, h))
    out.alpha_composite(photo, (border, border))
    path = os.path.join(TMP, f"{name}.png")
    out.save(path)
    return path


def round_photo(src, d=300, name="rond"):
    im = Image.open(src).convert("RGB")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, int((im.height - s) * 0.2), (im.width - s) // 2 + s, int((im.height - s) * 0.2) + s)).resize((d, d), Image.LANCZOS)
    out = Image.new("RGBA", (d + 16, d + 16), (0, 0, 0, 0))
    ImageDraw.Draw(out).ellipse((0, 0, d + 15, d + 15), fill=(255, 255, 255, 255))
    m = Image.new("L", (d, d), 0)
    ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    im = im.convert("RGBA")
    im.putalpha(m)
    out.alpha_composite(im, (8, 8))
    path = os.path.join(TMP, f"{name}.png")
    out.save(path)
    return path


def logo_fun(path, scale=1.0):
    """Logo « fun » : LEQ. dans une bulle de parole inclinée, avec étincelle et petit cœur."""
    S = int(1000 * scale)
    im = Image.new("RGBA", (S, int(S * 0.8)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bold = ImageFont.truetype(os.path.join(FONTS, "sf-pro-display-700.otf"), int(S * 0.27))
    # bulle
    bx0, by0, bx1, by1 = S * 0.1, S * 0.12, S * 0.86, S * 0.56
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((bx0 + 18, by0 + 18, bx1 + 18, by1 + 18), radius=S * 0.12, fill=hex2t(ORANGE) + (255,))
    sd.polygon([(S * 0.26 + 18, by1 + 10), (S * 0.22 + 18, S * 0.72 + 18), (S * 0.42 + 18, by1 + 10)], fill=hex2t(ORANGE) + (255,))
    im.alpha_composite(shadow)
    d.rounded_rectangle((bx0, by0, bx1, by1), radius=S * 0.12, fill=(255, 255, 255, 255), outline=hex2t(NAVY) + (255,), width=int(S * 0.018))
    d.polygon([(S * 0.26, by1 - 4), (S * 0.22, S * 0.72), (S * 0.42, by1 - 4)], fill=(255, 255, 255, 255))
    d.line((S * 0.26, by1, S * 0.22, S * 0.72), fill=hex2t(NAVY), width=int(S * 0.018))
    d.line((S * 0.22, S * 0.72, S * 0.42, by1), fill=hex2t(NAVY), width=int(S * 0.018))
    # texte LEQ + point orange
    tw = d.textlength("LEQ", font=bold)
    tx = (bx0 + bx1) / 2 - (tw + S * 0.07) / 2
    ty = (by0 + by1) / 2 - S * 0.17
    d.text((tx, ty), "LEQ", font=bold, fill=hex2t(NAVY) + (255,))
    r = S * 0.033
    cx, cy = tx + tw + S * 0.045, ty + S * 0.27
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=hex2t(ORANGE) + (255,))
    # étincelle dorée
    c0 = (S * 0.9, S * 0.1)
    for ang in range(0, 360, 45):
        a = math.radians(ang)
        r0, r1 = S * (0.035 if ang % 90 else 0.03), S * 0.085
        d.line((c0[0] + math.cos(a) * r0, c0[1] + math.sin(a) * r0, c0[0] + math.cos(a) * r1, c0[1] + math.sin(a) * r1), fill=hex2t(GOLD) + (255,), width=int(S * 0.014))
    im = im.rotate(6, resample=Image.BICUBIC, expand=True)
    im = im.crop(im.getbbox())
    im.save(path)
    return path


# ---------------------------------------------------------------- briques PowerPoint

prs = Presentation()
prs.slide_width, prs.slide_height = Pt(W / 2), Pt(H / 2)
BLANK = prs.slide_layouts[6]


def px(v):
    return Emu(int(Pt(v / 2)))


def new_slide(bg):
    s = prs.slides.add_slide(BLANK)
    s.shapes.add_picture(background(bg), 0, 0, prs.slide_width, prs.slide_height)
    return s


def text(s, x, y, w, h, runs, size=20, color="FFFFFF", align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.1):
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


def box(s, x, y, w, h, fill, line=None, radius=0.12, line_w=2.5, shape=MSO_SHAPE.ROUNDED_RECTANGLE, rot=0):
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
    sh.rotation = rot
    return sh


def pic(s, path, x, y, w=None, h=None, rot=0):
    p = s.shapes.add_picture(path, px(x), px(y), px(w) if w else None, px(h) if h else None)
    p.rotation = rot
    return p


def logo(s, x=70, y=64, dark=False):
    text(s, x, y, 300, 50, [[("LEQ", "b c:" + (NAVY if dark else "FFFFFF")), (".", "b c:" + ORANGE)]], size=17)


def handle(s, dark=False, label="@becca_lieben"):
    text(s, 70, 1262, 600, 40, label, size=10, color="8FA3C7" if dark else "B9C6DE")


def eyebrow(s, x, y, label, color=GOLD, w=900):
    text(s, x, y, w, 40, [[(label.upper(), "b")]], size=10, color=color)


def swipe(s, dark=False):
    col = NAVY if dark else "FFFFFF"
    box(s, 790, 1240, 220, 64, None, col, radius=0.5, line_w=1.25)
    text(s, 790, 1240, 220, 64, "Glissez  →", size=11, color=col, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


IMG = os.path.join(ROOT, "public", "images", "rebecca")
FUN = logo_fun(LOGO_OUT)


# ---------------------------------------------------------------- 1. Couverture de carrousel
s = new_slide("hero")
pic(s, FUN, 60, 50, w=230, rot=0)
pic(s, doodle("sparkle", 200), 900, 120, w=100)
eyebrow(s, 70, 360, "Prise de parole · Astuce")
text(s, 70, 400, 940, 420, [[("3 erreurs qui", "b")], [("trahissent", "serif c:" + GOLD + " s:66")], [("votre trac", "b")]], size=50, spacing=0.95)
pic(s, doodle("underline", 400), 60, 625, w=380)
text(s, 70, 880, 860, 140, "Et comment les corriger dès votre prochaine prise de parole.", size=16, color="E6EDFA", spacing=1.3)
pic(s, doodle("mic", 300), 820, 930, w=220)
handle(s)
swipe(s)

# ---------------------------------------------------------------- 2. Page intérieure de carrousel
s = new_slide("light")
logo(s, dark=True)
text(s, 940, 64, 80, 50, "2/5", size=11, color="8FA3C7", align=PP_ALIGN.RIGHT)
text(s, 70, 230, 400, 260, [[("01", "serif c:" + ORANGE)]], size=120)
text(s, 70, 520, 940, 200, [[("Titre de l'erreur ", "b c:" + NAVY), ("ou du conseil.", "serif c:" + ROYAL + " s:44")]], size=36, spacing=1.0)
text(s, 70, 740, 900, 320,
     "Expliquez en deux ou trois phrases. Un exemple concret vaut mieux qu'une longue théorie : décrivez la situation, puis ce qu'il faut faire à la place.",
     size=16, color="33415C", spacing=1.45)
box(s, 70, 1090, 940, 110, "FFF6D6", None, radius=0.3)
text(s, 110, 1090, 880, 110, [[("À essayer : ", "b c:" + ORANGE), ("un mini-exercice en une ligne.", "c:" + NAVY)]], size=14, anchor=MSO_ANCHOR.MIDDLE)
handle(s, dark=True)
swipe(s, dark=True)

# ---------------------------------------------------------------- 3. Dernière page de carrousel (appel à l'action)
s = new_slide("night")
logo(s)
pic(s, doodle("sparkle", 200), 880, 150, w=110)
text(s, 70, 330, 940, 300, [[("Et vous, ", "b"), ("quel orateur", "serif c:" + GOLD + " s:62")], [("êtes-vous ?", "b")]], size=48, spacing=1.0)
text(s, 70, 640, 900, 140, "Faites le quiz gratuit et recevez votre fiche orateur personnalisée.", size=17, color="E6EDFA", spacing=1.35)
box(s, 70, 830, 560, 96, ORANGE, None, radius=0.5)
text(s, 70, 830, 560, 96, "liebeneloquence.com/quiz", size=16, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE).text_frame.paragraphs[0].runs[0].font.bold = True
for i, lab in enumerate(["Enregistrez", "Commentez", "Partagez"]):
    text(s, 70 + i * 300, 1030, 280, 60, lab, size=13, color="B9C6DE")
pic(s, FUN, 760, 1060, w=250)
handle(s)

# ---------------------------------------------------------------- 4. Conseil du jour (post-it)
s = new_slide("warm")
logo(s, dark=True)
pic(s, doodle("sparkle", 200), 900, 150, w=90)
box(s, 120, 280, 840, 820, CREAM, None, radius=0.04, rot=-2.5)
box(s, 440, 250, 200, 60, "F0D9A8", None, radius=0.1, rot=-6)
text(s, 190, 360, 700, 60, [[("LE CONSEIL DU JOUR", "b")]], size=12, color=ORANGE)
text(s, 190, 430, 700, 520, [[("Respirez avant ", "b c:" + NAVY), ("la première phrase.", "serif c:" + ROYAL + " s:46")], [("Votre conseil en deux ou trois lignes, simple et applicable tout de suite.", "c:33415C s:16")]], size=38, spacing=1.15)
pic(s, doodle("heart", 200), 820, 960, w=90)
handle(s, dark=True)

# ---------------------------------------------------------------- 5. Citation
s = new_slide("hero")
logo(s)
text(s, 90, 190, 300, 200, [[("«", "serif c:" + GOLD)]], size=120)
text(s, 90, 450, 900, 480, [[("Avant d'être des êtres rationnels, nous sommes des êtres d'émotion.", "serif c:FFFFFF")]], size=44, spacing=1.12)
pic(s, doodle("underline", 400), 90, 930, w=300)
text(s, 90, 1010, 800, 50, [[("Rebecca Lieben Ahiale", "b")]], size=15, color=GOLD)
pic(s, FUN, 780, 1100, w=230)
handle(s)

# ---------------------------------------------------------------- 6. Annonce d'événement
s = new_slide("night")
logo(s)
pic(s, arch_photo(os.path.join(IMG, "pont-du-gard.jpg"), 520, 620), 500, 120, w=500)
pic(s, doodle("sparkle", 200), 420, 140, w=90)
box(s, 70, 230, 330, 70, GOLD, None, radius=0.5)
text(s, 70, 230, 330, 70, [[("MASTERCLASS", "b")]], size=12, color=NAVY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 70, 330, 400, 300, [[("25", "b")], [("octobre", "serif c:" + GOLD + " s:40")]], size=72, spacing=0.9)
text(s, 70, 780, 940, 200, [[("Titre de ", "b"), ("l'événement", "serif c:" + GOLD + " s:50")]], size=40, spacing=1.0)
text(s, 70, 930, 940, 60, "18h30 – 20h30 · En ligne · 24,99 €", size=15, color="E6EDFA")
box(s, 70, 1060, 600, 92, ORANGE, None, radius=0.5)
text(s, 70, 1060, 600, 92, "Réservez sur liebeneloquence.com", size=14, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE).text_frame.paragraphs[0].runs[0].font.bold = True
handle(s)

# ---------------------------------------------------------------- 7. Idée reçue / réalité
s = new_slide("light")
logo(s, dark=True)
eyebrow(s, 70, 200, "Idée reçue", ORANGE)
text(s, 70, 240, 940, 200, [[("« Les bons orateurs ", "b c:" + NAVY), ("sont nés comme ça. »", "serif c:" + ROYAL + " s:40")]], size=34, spacing=1.05)
box(s, 70, 520, 940, 300, "FFFFFF", "E3D9CF", radius=0.08, line_w=1)
text(s, 120, 550, 300, 50, [[("✗  ON PENSE", "b")]], size=11, color="C0392B")
text(s, 120, 610, 840, 190, "Ce que la plupart des gens croient, en une ou deux phrases.", size=16, color="33415C", spacing=1.35)
box(s, 70, 860, 940, 300, NAVY, None, radius=0.08)
text(s, 120, 890, 300, 50, [[("✓  EN RÉALITÉ", "b")]], size=11, color=GOLD)
text(s, 120, 950, 840, 190, "Ce qui se passe vraiment, et ce que l'on peut travailler.", size=16, color="FFFFFF", spacing=1.35)
handle(s, dark=True)

# ---------------------------------------------------------------- 8. Témoignage
s = new_slide("warm")
logo(s, dark=True)
pic(s, doodle("sparkle", 200), 900, 140, w=90)
box(s, 70, 240, 940, 830, "FFFFFF", None, radius=0.06)
text(s, 130, 300, 400, 60, "★★★★★", size=22, color=GOLD)
text(s, 130, 400, 820, 480, [[("« Le témoignage de votre élève, tel qu'il l'a écrit, avec son accord. »", "serif c:" + NAVY)]], size=32, spacing=1.15)
text(s, 130, 930, 800, 50, [[("Prénom", "b")]], size=16, color=NAVY)
text(s, 130, 980, 800, 50, "Situation : concours, soutenance, entretien…", size=13, color="5B6B85")
pic(s, doodle("heart", 200), 900, 1010, w=110)
text(s, 70, 1130, 940, 60, "Lisez tous les avis sur liebeneloquence.com", size=13, color=NAVY, align=PP_ALIGN.CENTER)
handle(s, dark=True)

# ---------------------------------------------------------------- 9. Présentation (qui suis-je)
s = new_slide("hero")
pic(s, FUN, 60, 50, w=230)
pic(s, round_photo(os.path.join(IMG, "portrait-rose.jpg"), 420), 590, 220, w=400)
pic(s, doodle("sparkle", 200), 960, 200, w=90)
eyebrow(s, 70, 330, "Enchantée !")
text(s, 70, 370, 520, 260, [[("Moi, c'est ", "b")], [("Rebecca.", "serif c:" + GOLD + " s:60")]], size=44, spacing=1.0)
text(s, 70, 720, 940, 300, [
    [("2022 ", "serif c:" + GOLD + " s:20"), ("Vice-championne du concours d'art oratoire au féminin", "")],
    [("2025 ", "serif c:" + GOLD + " s:20"), ("Présidente d'Eloquentia Toulon", "")],
    [("2026 ", "serif c:" + GOLD + " s:20"), ("Vice-championne du Mondial de la Parole", "")],
], size=15, spacing=1.7)
text(s, 70, 1060, 940, 100, "J'accompagne celles et ceux qui veulent oser prendre la parole et convaincre.", size=15, color="E6EDFA", spacing=1.35)
handle(s)

prs.save(OUT)
print("ok", OUT)
print("ok", LOGO_OUT)
