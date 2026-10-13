"""
Charte LEQ pour les diaporamas PowerPoint (16:9) : couleurs, polices, fonds, dessins, photos, QR codes
et briques de mise en page. Importée par generer-modele.py et les diaporamas d'ateliers.
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
    elif kind == "blanc":  # blanc, très légère touche de bleu ciel en bas à droite
        im = gradient(["FFFFFF", "FFFFFF", "EAF4FD"], 0.35)
    elif kind == "ciel":  # bleu ciel doux
        im = gradient(["F2F8FE", "E3F1FC", "D3E9FA"], 0.3)
    elif kind == "ember":
        im = gradient(["2E1106", "0b1d3f", "001636"])
    path = os.path.join(TMP, f"bg-{kind}.png")
    im.save(path)
    BG[kind] = path
    return path


def doodle(name, size=240, mono=None):
    S = size * 2
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S / 2
    if mono:  # dessin au trait, d'une seule couleur
        col, wd = hex2t(mono), int(S * 0.03)
        if name == "sparkle":
            r = S * 0.46
            for ang in range(0, 360, 45):
                a = math.radians(ang)
                r1 = r * (0.42 if ang % 90 else 0.38)
                d.line((c + math.cos(a) * r1, c + math.sin(a) * r1, c + math.cos(a) * r, c + math.sin(a) * r), fill=col, width=int(S * 0.05))
        elif name == "heart":
            pts = []
            for i in range(201):
                t = i / 200 * 2 * math.pi
                x = 16 * math.sin(t) ** 3
                y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
                pts.append((c + x * S / 36, c - y * S / 36))
            d.line(pts, fill=col, width=int(S * 0.05), joint="curve")
        elif name == "mic":
            d.rounded_rectangle((S * 0.36, S * 0.06, S * 0.64, S * 0.52), radius=S * 0.14, outline=col, width=wd)
            for k in (0.18, 0.27, 0.36):
                d.line((S * 0.43, S * k, S * 0.57, S * k), fill=col, width=int(S * 0.02))
            d.arc((S * 0.24, S * 0.16, S * 0.76, S * 0.66), start=0, end=180, fill=col, width=wd)
            d.line((c, S * 0.66, c, S * 0.86), fill=col, width=wd)
            d.line((S * 0.38, S * 0.88, S * 0.62, S * 0.88), fill=col, width=wd)
        elif name == "bubble":
            x, y, w, h = S * 0.06, S * 0.16, S * 0.88, S * 0.5
            d.rounded_rectangle((x, y, x + w, y + h), radius=h * 0.28, outline=col, width=wd)
            d.polygon([(x + w * 0.22, y + h - wd), (x + w * 0.22, y + h * 1.45), (x + w * 0.42, y + h - wd)], fill=(0, 0, 0, 0))
            d.line((x + w * 0.22, y + h - 2, x + w * 0.22, y + h * 1.45), fill=col, width=wd)
            d.line((x + w * 0.22, y + h * 1.45, x + w * 0.42, y + h - 2), fill=col, width=wd)
            d.line((x + w * 0.2, y + h * 0.4, x + w * 0.8, y + h * 0.4), fill=col, width=wd)
            d.line((x + w * 0.2, y + h * 0.62, x + w * 0.58, y + h * 0.62), fill=col, width=wd)
        path = os.path.join(TMP, f"d-{name}-{mono}.png")
        im.resize((size, size), Image.LANCZOS).save(path)
        return path
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


def qr(url, name="qr"):
    img = qrcode.make(url, border=1).convert("RGB")
    path = os.path.join(TMP, f"{name}.png")
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
                elif st == "m":  # graisse intermédiaire (ex. « Inter Medium »)
                    f.name = SANS + " Medium"
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

