"""
Prépare les visuels de la BD « Mellie a le trac » pour le site (public/mellie/), à partir du PDF publié
(public/mellie/mellie-a-le-trac.pdf, le même que celui téléchargé par les lecteurs).
Pour une nouvelle version de la BD : remplacer le PDF, puis relancer ce script.
Utilisation (depuis le dossier du projet) :  python communication/mellie/preparer-images.py
"""
import io
import os

import pymupdf
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "mellie")
PDF = os.path.join(OUT, "mellie-a-le-trac.pdf")

# Page du PDF (1 = couverture) → nom de l'image, largeur maximale
# (six-secrets sert aux visuels Instagram)
PAGES = {1: ("couverture", 900), 3: ("personnages", 900), 4: ("planche-ruche", 900), 23: ("six-secrets", 900), 25: ("cahier-respiration", 900)}

doc = pymupdf.open(PDF)
for num, (nom, largeur) in PAGES.items():
    pix = doc[num - 1].get_pixmap(dpi=150)
    im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    chemin = os.path.join(OUT, f"{nom}.webp")
    for q in range(84, 40, -4):
        im.save(chemin, "WEBP", quality=q, method=6)
        if os.path.getsize(chemin) <= 150 * 1024:
            break
    print(f"{nom}.webp : {im.width}x{im.height}, {os.path.getsize(chemin) // 1024} Ko")
