"""
Diaporama de la capsule « Construire le squelette d'une présentation » (16:9, charte LEQ).
Peu de texte à l'écran ; le texte complet de la fiche est dans les notes de l'orateur.
Utilisation (depuis le dossier du projet) :  python communication/atelier/capsule-squelette.py
Résultat : communication/atelier/LEQ-capsule-squelette.pptx
"""
from charte_pptx import *  # noqa: F401,F403

OUT = os.path.join(ROOT, "communication", "atelier", "LEQ-capsule-squelette.pptx")
URL_AVIS = "https://liebeneloquence.com/avis"
URL_SEANCE = "https://calendly.com/formationn-liebeneloquence/30min"
TOTAL = 12


def notes(s, texte):
    s.notes_slide.notes_text_frame.text = texte


def titre(s, y, debut, accent, couleur_debut="FFFFFF", couleur_accent=GOLD, taille=44):
    return text(s, 90, y, 1740, 150, [[(debut, f"b c:{couleur_debut}"), (accent, f"serif c:{couleur_accent} s:{int(taille * 1.22)}")]], size=taille)


def pastille(s, x, y, n, fond=GOLD, couleur=NAVY, d=92):
    box(s, x, y, d, d, fond, None, shape=MSO_SHAPE.OVAL)
    text(s, x, y, d, d, [[(str(n), "b")]], size=int(d / 3.4), color=couleur, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def etape_entete(s, n, debut, accent, sombre=True):
    logo(s, dark=not sombre)
    eyebrow(s, 90, 150, f"La méthode · étape {n} sur 5", GOLD if sombre else ORANGE)
    pastille(s, 90, 205, n, ORANGE, "FFFFFF", 110)
    text(s, 230, 210, 1600, 120, [[(debut, f"b c:{'FFFFFF' if sombre else NAVY}"), (accent, f"serif c:{GOLD if sombre else ROYAL} s:54")]], size=44, anchor=MSO_ANCHOR.MIDDLE)


# ---------------------------------------------------------------- 1. Couverture
s = new_slide("hero")
logo(s)
eyebrow(s, 90, 250, "Capsule éducative · Atelier LEQ")
text(s, 90, 290, 1180, 360, [[("Construire le", "b")], [("squelette", "b")], [("d'une présentation", "serif c:" + GOLD + " s:60")]], size=48, spacing=0.95)
box(s, 90, 730, 1000, 110, "FFFFFF", None, radius=0.5)
text(s, 130, 730, 940, 110, [[("On retient bien mieux ", f"b c:{NAVY}"), ("un plan", f"serif c:{ORANGE} s:30"), (" qu'un texte.", f"b c:{NAVY}")]], size=21, anchor=MSO_ANCHOR.MIDDLE)
pic(s, doodle("mic", 300), 1440, 260, w=300)
pic(s, doodle("sparkle", 200), 1700, 120, w=110)
pic(s, doodle("heart", 200), 1300, 760, w=80)
pic(s, doodle("bubble", 300), 1250, 420, w=170)
footer(s, n=1)
notes(s, "Capsule éducative : construire le squelette d'une présentation.\nMessage central : on retient bien mieux un plan qu'un texte.")

# ---------------------------------------------------------------- 2. Accroche
s = new_slide("ember")
logo(s)
eyebrow(s, 90, 200, "Pour commencer, dans le chat", ORANGE)
text(s, 90, 300, 520, 420, [[("1", "b c:" + GOLD)]], size=220, anchor=MSO_ANCHOR.MIDDLE)
text(s, 560, 300, 1280, 420, [[("Tapez ", "b"), ("1", "b c:" + GOLD), (" si vous avez déjà eu", "b")], [("un trou en récitant un texte", "b")], [("appris par cœur.", "serif c:" + GOLD + " s:50")]], size=38, spacing=1.15)
pic(s, doodle("bubble", 300), 1600, 760, w=200)
footer(s, dark=True, n=2)
notes(s, "Accroche.\nDans le chat : « Tapez 1 si vous avez déjà eu un trou en récitant un texte appris par cœur. »\nLes réponses arrivent en rafale, ce qui crée tout de suite du lien.")

# ---------------------------------------------------------------- 3. D'où ça vient
s = new_slide("night")
logo(s)
eyebrow(s, 90, 150, "D'où ça vient · 3 à 6 min")
titre(s, 190, "Le secret des orateurs ", "de l'Antiquité.")
text(s, 90, 350, 1700, 90, "Ils parlaient pendant des heures sans notes. Cicéron décrit 5 étapes pour préparer un discours :", size=19, color="DCE6F7")
canons = [("Inventio", "trouver ses idées", False), ("Dispositio", "organiser ses idées", True), ("Elocutio", "choisir ses mots", False), ("Memoria", "les retenir", True), ("Actio", "les dire", False)]
for i, (nom, sens, cle) in enumerate(canons):
    x = 90 + i * 350
    box(s, x, 470, 320, 220, "FFFFFF" if cle else None, None if cle else "5B6B85", radius=0.12, line_w=1.5)
    text(s, x + 26, 500, 270, 70, [[(nom, f"serif c:{ORANGE if cle else 'B9C6DE'}")]], size=30)
    text(s, x + 26, 585, 270, 80, sens, size=17, color=NAVY if cle else "B9C6DE")
box(s, 90, 760, 1740, 130, ORANGE, None, radius=0.3)
text(s, 140, 760, 1640, 130, [[("Leur secret : ", "b"), ("ils mémorisaient un plan, pas des phrases.", "")]], size=26, anchor=MSO_ANCHOR.MIDDLE)
footer(s, dark=True, n=3)
notes(s, "D'où ça vient (3 à 6 min).\nLes orateurs de l'Antiquité parlaient pendant des heures sans notes. La rhétorique classique, décrite notamment par Cicéron, divise la préparation d'un discours en cinq étapes, dont deux nous intéressent :\n- la dispositio : organiser ses idées ;\n- la memoria : les retenir.\nLeur secret : ils ne mémorisaient pas des phrases, ils mémorisaient un plan. C'est exactement ce qu'on va faire.")

# ---------------------------------------------------------------- 4. La méthode en 5 étapes
s = new_slide("hero")
logo(s)
eyebrow(s, 90, 150, "La méthode")
titre(s, 190, "5 étapes pour un plan ", "qui tient debout.")
etapes = [("Le message central", "en une phrase"), ("Vider sa tête", "5 minutes, en vrac"), ("Regrouper en 3 tas", "3 parties"), ("De la chair sur les os", "mots-clés et histoires"), ("L'entrée et la sortie", "les seules phrases apprises")]
box(s, 150, 545, 1620, 6, GOLD, None, shape=MSO_SHAPE.RECTANGLE)
for i, (t, d_) in enumerate(etapes):
    x = 90 + i * 360
    pastille(s, x + 60, 500, i + 1)
    text(s, x, 640, 330, 110, [[(t, "b")]], size=20, align=PP_ALIGN.CENTER)
    text(s, x, 740, 330, 80, d_, size=16, color="DCE6F7", align=PP_ALIGN.CENTER)
footer(s, dark=True, n=4)
notes(s, "La méthode en 5 étapes :\n1. Le message central en une phrase\n2. Vider sa tête\n3. Regrouper en 3 tas\n4. Accrocher de la chair à chaque os\n5. L'entrée et la sortie")

# ---------------------------------------------------------------- 5. Étape 1
s = new_slide("light")
etape_entete(s, 1, "Le message central ", "en une phrase", sombre=False)
box(s, 90, 400, 1740, 230, "FFFFFF", GOLD, radius=0.12, line_w=2)
text(s, 140, 400, 1640, 230, [[("« Si le public ne retient qu'une chose, ", "b c:" + NAVY), ("ce sera quoi ? »", "serif c:" + ORANGE + " s:40")]], size=30, anchor=MSO_ANCHOR.MIDDLE, align=PP_ALIGN.CENTER)
box(s, 90, 700, 380, 180, ORANGE, None, radius=0.2)
text(s, 90, 700, 380, 180, [[("60 s", "b")], [("voire moins", "serif s:26")]], size=48, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 520, 720, 1300, 160, "Si on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.", size=22, color="33415C", anchor=MSO_ANCHOR.MIDDLE)
footer(s, n=5)
notes(s, "Étape 1 : le message central en une phrase.\nQuestion à se poser : « Si le public ne retient qu'une chose, ce sera quoi ? »\nSi on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.")

# ---------------------------------------------------------------- 6. Étape 2
s = new_slide("warm")
etape_entete(s, 2, "Vider ", "sa tête", sombre=False)
box(s, 1330, 400, 420, 420, ORANGE, None, shape=MSO_SHAPE.OVAL)
text(s, 1330, 470, 420, 220, [[("5", "b")]], size=120, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1330, 690, 420, 60, "minutes", size=24, align=PP_ALIGN.CENTER)
text(s, 90, 420, 1150, 400, [
    [("On note ", "c:33415C"), ("en vrac", "b c:" + NAVY), (" tout ce qu'on sait", "c:33415C")],
    [("ou veut dire sur le sujet.", "c:33415C")],
    [("", "")],
    [("Sans trier. ", "serif c:" + ROYAL + " s:44"), ("Sans juger.", "serif c:" + ORANGE + " s:44")],
], size=30, spacing=1.2)
pic(s, doodle("sparkle", 200), 1700, 300, w=90)
footer(s, n=6)
notes(s, "Étape 2 : vider sa tête.\nPendant 5 minutes, on note en vrac tout ce qu'on sait ou veut dire sur le sujet, sans trier.")

# ---------------------------------------------------------------- 7. Étape 3
s = new_slide("light")
etape_entete(s, 3, "Regrouper ", "en 3 tas", sombre=False)
text(s, 90, 365, 1740, 70, "Chaque tas devient une partie. Pas d'idée ? On prend un plan tout prêt :", size=20, color="33415C")
plans = [("Pour convaincre", "Problème", "Solution", "Bénéfice", ORANGE), ("Pour expliquer", "Pourquoi", "Quoi", "Comment", ROYAL), ("Pour raconter", "Avant", "Aujourd'hui", "Demain", "B8860B")]
for i, (but, a, b, c, col) in enumerate(plans):
    x = 90 + i * 590
    box(s, x, 470, 560, 420, "FFFFFF", col, radius=0.08, line_w=2.5)
    text(s, x + 36, 500, 490, 60, [[(but.upper(), "b")]], size=14, color=col)
    for j, mot in enumerate((a, b, c)):
        text(s, x + 36, 575 + j * 100, 490, 80, [[(f"{j + 1}. ", f"b c:{col}"), (mot, f"b c:{NAVY}")]], size=28)
footer(s, n=7)
notes(s, "Étape 3 : regrouper en 3 tas.\nChaque tas devient une partie. Si les tas ne viennent pas naturellement, on prend un plan tout prêt :\n- Problème → Solution → Bénéfice (pour convaincre)\n- Pourquoi → Quoi → Comment (pour expliquer)\n- Avant → Aujourd'hui → Demain (pour raconter)")

# ---------------------------------------------------------------- 8. Étape 4
s = new_slide("night")
etape_entete(s, 4, "De la chair ", "sur chaque os")
text(s, 90, 380, 840, 330, [
    [("Pour chaque partie :", "b")],
    [("1 mot-clé", "serif c:" + GOLD + " s:40")],
    [("+ 1 anecdote, un exemple ou une image", "c:DCE6F7 s:22")],
], size=26, spacing=1.3)
text(s, 90, 760, 840, 140, "Une histoire se retient sans effort. Une phrase rédigée, elle, doit être apprise.", size=18, color="B9C6DE", spacing=1.3)
box(s, 980, 380, 850, 470, "FFFFFF", None, radius=0.08)
text(s, 1030, 420, 760, 50, [[("EXEMPLE", "b")]], size=14, color=ORANGE)
box(s, 1030, 490, 300, 80, CREAM, None, radius=0.5)
text(s, 1030, 490, 300, 80, [[("Trajets", "b c:" + NAVY)]], size=24, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1350, 490, 80, 80, [[("→", "b c:" + ORANGE)]], size=34, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1030, 610, 760, 220, [[("« Marc gagne 1 h 30 par jour depuis qu'il télétravaille le vendredi. »", "serif c:" + ROYAL)]], size=30, spacing=1.15)
footer(s, dark=True, n=8)
notes(s, "Étape 4 : accrocher de la chair à chaque os.\nPour chaque partie, on note un mot-clé et une anecdote, un exemple ou une image. Une histoire se retient sans effort, alors qu'une phrase rédigée demande d'être apprise.\nExemple : « Trajets » → « Marc gagne 1 h 30 par jour depuis qu'il télétravaille le vendredi. »")

# ---------------------------------------------------------------- 9. Étape 5
s = new_slide("light")
etape_entete(s, 5, "L'entrée ", "et la sortie", sombre=False)
for i, (nom, contenu, col) in enumerate([("Introduction", "Une accroche, puis l'annonce des 3 parties.", ROYAL), ("Conclusion", "Le rappel du message central, puis une action ou une question pour le public.", ORANGE)]):
    x = 90 + i * 880
    box(s, x, 390, 850, 250, "FFFFFF", col, radius=0.1, line_w=2.5)
    text(s, x + 40, 420, 770, 60, [[(nom, f"b c:{col}")]], size=26)
    text(s, x + 40, 490, 770, 140, contenu, size=20, color="33415C", spacing=1.3)
box(s, 90, 690, 1740, 200, NAVY, None, radius=0.15)
text(s, 140, 690, 1640, 200, [
    [("Le seul passage appris par cœur : ", "b c:FFFFFF"), ("la première et la dernière phrase.", "serif c:" + GOLD + " s:34")],
    [("Entre les deux, on parle librement autour des mots-clés.", "c:DCE6F7 s:20")],
], size=28, anchor=MSO_ANCHOR.MIDDLE, spacing=1.3)
footer(s, n=9)
notes(s, "Étape 5 : l'entrée et la sortie.\n- Introduction : une accroche, puis l'annonce des 3 parties.\n- Conclusion : le rappel du message central, puis une action ou une question pour le public.\nC'est le seul passage qu'on apprend par cœur : la première et la dernière phrase. Entre les deux, on parle librement autour des mots-clés.")

# ---------------------------------------------------------------- 10. Exercice
s = new_slide("ember")
logo(s)
eyebrow(s, 90, 150, "Exercice en ligne", ORANGE)
titre(s, 190, "À vous ", "de jouer !", couleur_accent=ORANGE)
box(s, 90, 380, 1000, 500, "FFFFFF", None, radius=0.06)
text(s, 140, 410, 900, 60, [[("Sur papier, un sujet personnel", "b c:" + NAVY)]], size=22)
text(s, 140, 465, 900, 50, "Mon métier, mon dernier voyage, une passion…", size=17, color="5B6B85")
for j, (n, t) in enumerate([("1", "message central"), ("3", "mots-clés"), ("1", "anecdote par mot-clé")]):
    y = 545 + j * 105
    pastille(s, 140, y, n, ORANGE, "FFFFFF", 80)
    text(s, 250, y, 800, 80, [[(t, "b c:" + NAVY)]], size=24, anchor=MSO_ANCHOR.MIDDLE)
box(s, 1140, 380, 690, 500, None, GOLD, radius=0.08, line_w=2)
text(s, 1180, 410, 620, 60, [[("TEMPS 3 · MISE EN VOIX", "b")]], size=14, color=GOLD)
text(s, 1180, 470, 620, 160, [[("2 ou 3 volontaires, ", "b"), ("1 minute chacun", "serif c:" + GOLD + " s:30")]], size=24, spacing=1.2)
text(s, 1180, 640, 620, 220, "Caméra allumée, sans notes. On montre 1, 2 puis 3 doigts à l'écran pour marquer chaque partie.", size=18, color="E6EDFA", spacing=1.35)
footer(s, dark=True, n=10)
notes(s, "Exercice en ligne.\nChacun choisit un sujet personnel (mon métier, mon dernier voyage, une passion) et note sur papier : 1 message central, 3 mots-clés et 1 anecdote par mot-clé.\nTemps 3, mise en voix (2 à 3 volontaires, 1 min chacun) : chaque volontaire présente caméra allumée, sans notes, en montrant 1, 2 puis 3 doigts à l'écran pour marquer chaque partie.")

# ---------------------------------------------------------------- 11. Questions sur vos blocages
s = new_slide("hero")
logo(s)
eyebrow(s, 90, 150, "À vous la parole")
titre(s, 190, "Vos questions, ", "vos blocages.")
blocages = ["Le trou de mémoire", "Le trac avant de commencer", "Ne pas savoir par où commencer", "Parler trop vite"]
for i, b in enumerate(blocages):
    x, y = 90 + (i % 2) * 880, 400 + (i // 2) * 170
    box(s, x, y, 840, 130, "FFFFFF", None, radius=0.3)
    text(s, x + 40, y, 760, 130, [[("« ", "b c:" + ORANGE), (b, "b c:" + NAVY), (" »", "b c:" + ORANGE)]], size=24, anchor=MSO_ANCHOR.MIDDLE)
text(s, 90, 770, 1740, 100, "Écrivez votre question dans le chat ou levez la main : on en parle ensemble.", size=22, color="E6EDFA")
pic(s, doodle("bubble", 300), 1620, 120, w=200)
footer(s, dark=True, n=11)
notes(s, "Questions sur vos blocages.\nOuvrir la parole : qu'est-ce qui vous bloque quand vous prenez la parole ? (trou de mémoire, trac, ne pas savoir par où commencer, débit trop rapide…)\nLes participants écrivent dans le chat ou lèvent la main.")

# ---------------------------------------------------------------- 12. Conclusion et transition
s = new_slide("night")
logo(s)
eyebrow(s, 90, 150, "Conclusion")
text(s, 90, 200, 1080, 330, [[("On retient", "b")], [("bien mieux", "b")], [("un plan qu'un texte.", "serif c:" + GOLD + " s:56")]], size=46, spacing=0.98)
text(s, 90, 600, 1050, 150, "Message central, 3 parties, 1 histoire par partie, et seulement la première et la dernière phrase apprises par cœur.", size=19, color="DCE6F7", spacing=1.35)
text(s, 90, 790, 1000, 80, [[("Merci ! ", "b c:" + ORANGE), ("À très vite.", "serif c:FFFFFF s:34")]], size=32)
for i, (url, nom, label) in enumerate([(URL_AVIS, "qr-avis", "Donnez votre avis"), (URL_SEANCE, "qr-seance", "Réservez une séance")]):
    x = 1230 + i * 330
    box(s, x, 330, 300, 300, "FFFFFF", None, radius=0.08)
    pic(s, qr(url, nom), x + 25, 355, w=250)
    text(s, x - 15, 650, 330, 60, [[(label, "b")]], size=15, align=PP_ALIGN.CENTER)
    text(s, x, 715, 300, 50, "1 minute" if i == 0 else "avec Rebecca", size=15, color="B9C6DE", align=PP_ALIGN.CENTER)
pic(s, doodle("heart", 200), 1180, 260, w=70)
footer(s, dark=True, n=12)
notes(s, f"Conclusion et transition.\nRappel du message central : on retient bien mieux un plan qu'un texte.\nQR code de gauche : donner son avis ({URL_AVIS}).\nQR code de droite : réserver une séance avec Rebecca ({URL_SEANCE}).")

prs.save(OUT)
print("ok", OUT)
