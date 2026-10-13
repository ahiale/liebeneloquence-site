"""
Génère le modèle de présentation des ateliers LEQ (PowerPoint 16:9, importable dans Canva).
Utilisation (depuis le dossier du projet) :
    python communication/atelier/generer-modele.py
Nécessite : pip install python-pptx qrcode pillow
Résultat : communication/atelier/LEQ-modele-atelier.pptx
"""
from charte_pptx import *  # noqa: F401,F403 (charte et briques partagées)

OUT = os.path.join(ROOT, "communication", "atelier", "LEQ-modele-atelier.pptx")

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
