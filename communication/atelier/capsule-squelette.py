"""
Diaporama de la capsule « Construire le squelette d'une présentation » (16:9).
Dans l'univers du site : diapositives bleues et blanches, petits dessins discrets, titres en graisse normale.
Le texte complet de la fiche est dans les notes de l'orateur.
Utilisation (depuis le dossier du projet) :  python communication/atelier/capsule-squelette.py
Résultat : communication/atelier/LEQ-capsule-squelette.pptx
"""
from charte_pptx import *  # noqa: F401,F403

OUT = os.path.join(ROOT, "communication", "atelier", "LEQ-capsule-squelette.pptx")
URL_AVIS = "https://liebeneloquence.com/avis"
URL_SEANCE = "https://calendly.com/formationn-liebeneloquence/30min"

ENCRE, GRIS = NAVY, "5B6B85"
CIEL, CIEL_CLAIR = "3A8DDE", "E3F1FC"
BLANC_DOUX, CIEL_PALE = "E6EDFA", "B9D6F5"


def notes(s, texte):
    s.notes_slide.notes_text_frame.text = texte


def entete(s, surtitre, titre, accent="", bleu=False):
    """Logo, surtitre discret, titre en graisse normale ; accent en italique (doré sur bleu, bleu sur blanc), comme sur le site."""
    logo(s, dark=not bleu)
    text(s, 90, 165, 1400, 40, [[(surtitre.upper(), "")]], size=11, color=CIEL_PALE if bleu else CIEL)
    runs = [(titre, f"c:{'FFFFFF' if bleu else ENCRE}")] + ([(accent, f"serif c:{'FFFFFF' if bleu else ROYAL} s:50")] if accent else [])
    text(s, 90, 205, 1740, 130, [runs], size=40)
    box(s, 92, 330, 60, 2, CIEL_PALE if bleu else CIEL, None, shape=MSO_SHAPE.RECTANGLE)


def dessins(s, *elements):
    """Petits dessins du site au trait, discrets : (nom, x, y, largeur, couleur). Couleur par défaut : blanc sur bleu, bleu ciel sur blanc."""
    for nom, x, y, w, *c in elements:
        pic(s, doodle(nom, 300, mono=c[0] if c else None), x, y, w=w)


def numero(s, x, y, n, d=64, bleu=False):
    if bleu:
        box(s, x, y, d, d, "FFFFFF", None, shape=MSO_SHAPE.OVAL)
    else:
        box(s, x, y, d, d, "FFFFFF", CIEL, shape=MSO_SHAPE.OVAL, line_w=1.5)
    text(s, x, y, d, d, str(n), size=int(d / 3), color=ROYAL if bleu else CIEL, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def carte(s, x, y, w, h, fond=CIEL_CLAIR):
    return box(s, x, y, w, h, fond, None, radius=0.08)


def pied(s, n, bleu=False):
    footer(s, dark=bleu, n=n)


# ---------------------------------------------------------------- 1. Couverture (bleue)
s = new_slide("hero")
logo(s)
text(s, 90, 300, 1400, 40, [[("CAPSULE ÉDUCATIVE", "")]], size=12, color=CIEL_PALE)
text(s, 90, 350, 1300, 260, [[("Construire le squelette", "c:FFFFFF")], [("d'une présentation", "serif c:FFFFFF s:66")]], size=54, spacing=1.0)
box(s, 92, 640, 60, 2, CIEL_PALE, None, shape=MSO_SHAPE.RECTANGLE)
text(s, 90, 690, 1300, 60, "On retient bien mieux un plan qu'un texte.", size=22, color=BLANC_DOUX)
dessins(s, ("mic", 1480, 330, 240, "FFFFFF"))
pic(s, doodle("sparkle", 200, mono=GOLD), 1700, 150, w=80)  # la seule touche de jaune
pied(s, 1, bleu=True)
notes(s, "Capsule éducative : construire le squelette d'une présentation.\nMessage central : on retient bien mieux un plan qu'un texte.")

# ---------------------------------------------------------------- 2. Icebreaker (bleue)
s = new_slide("hero")
logo(s)
text(s, 90, 380, 1740, 200, [[("Icebreaker", "serif c:FFFFFF")]], size=96, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
box(s, 930, 600, 60, 2, CIEL_PALE, None, shape=MSO_SHAPE.RECTANGLE)
dessins(s, ("bubble", 1560, 700, 180, "FFFFFF"), ("sparkle", 300, 220, 70, "FFFFFF"))
pied(s, 2, bleu=True)
notes(s, "Icebreaker.\nDans le chat : « Tapez 1 si vous avez déjà eu un trou en récitant un texte appris par cœur. »\nLes réponses arrivent en rafale, ce qui crée tout de suite du lien.")

# ---------------------------------------------------------------- 3. D'où ça vient
s = new_slide("blanc")
entete(s, "D'où ça vient", "Le secret des orateurs ", "de l'Antiquité")
text(s, 90, 380, 1740, 60, "Ils parlaient pendant des heures sans notes. Cicéron décrit cinq étapes pour préparer un discours :", size=19, color=GRIS)
canons = [("Inventio", "trouver ses idées", False), ("Dispositio", "organiser ses idées", True), ("Elocutio", "choisir ses mots", False), ("Memoria", "les retenir", True), ("Actio", "les dire", False)]
for i, (nom, sens, cle) in enumerate(canons):
    x = 90 + i * 350
    box(s, x, 480, 320, 190, CIEL_CLAIR if cle else "FFFFFF", None if cle else "DCE3EC", radius=0.1, line_w=1)
    text(s, x + 28, 510, 270, 60, [[(nom, f"serif c:{ROYAL if cle else '8A97AB'}")]], size=28)
    text(s, x + 28, 590, 270, 60, sens, size=16, color=ENCRE if cle else "8A97AB")
text(s, 90, 760, 1740, 80, [[("Leur secret : ", f"c:{GRIS}"), ("ils mémorisaient un plan, pas des phrases.", f"c:{ENCRE}")]], size=26)
dessins(s, ("sparkle", 1720, 150, 80, CIEL))
pied(s, 3)
notes(s, "D'où ça vient (3 à 6 min).\nLes orateurs de l'Antiquité parlaient pendant des heures sans notes. La rhétorique classique, décrite notamment par Cicéron, divise la préparation d'un discours en cinq étapes, dont deux nous intéressent :\n- la dispositio : organiser ses idées ;\n- la memoria : les retenir.\nLeur secret : ils ne mémorisaient pas des phrases, ils mémorisaient un plan. C'est exactement ce qu'on va faire.")

# ---------------------------------------------------------------- 4. La méthode (bleue)
s = new_slide("hero")
entete(s, "La méthode", "5 étapes pour construire ", "un plan", bleu=True)
etapes = ["Le message central", "Vider sa tête", "Regrouper en 3 groupes", "Associer les images", "L'entrée et la sortie"]
box(s, 150, 562, 1620, 2, CIEL_PALE, None, shape=MSO_SHAPE.RECTANGLE)
for i, t in enumerate(etapes):
    x = 90 + i * 360
    numero(s, x + 133, 530, i + 1, bleu=True)
    text(s, x, 640, 330, 110, t, size=19, color="FFFFFF", align=PP_ALIGN.CENTER)
dessins(s, ("sparkle", 1720, 150, 80, "FFFFFF"))
pied(s, 4, bleu=True)
notes(s, "La méthode en 5 étapes :\n1. Le message central en une phrase\n2. Vider sa tête\n3. Regrouper en 3 groupes\n4. Associer les idées aux images (accrocher de la chair à chaque os)\n5. L'entrée et la sortie")

# ---------------------------------------------------------------- 5. Étape 1
s = new_slide("blanc")
entete(s, "Étape 1 sur 5", "Le message central ", "en une phrase")
carte(s, 90, 420, 1740, 220)
text(s, 150, 420, 1620, 220, [[("« Si le public ne retient qu'une chose, ce sera quoi ? »", f"serif c:{ENCRE}")]], size=36, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 90, 720, 1740, 80, "Si on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.", size=22, color=GRIS, align=PP_ALIGN.CENTER)
dessins(s, ("bubble", 1680, 130, 150, CIEL))
pied(s, 5)
notes(s, "Étape 1 : le message central en une phrase.\nQuestion à se poser : « Si le public ne retient qu'une chose, ce sera quoi ? »\nSi on ne peut pas le dire en 60 secondes, voire moins, le sujet est encore flou.")

# ---------------------------------------------------------------- 6. Étape 2
s = new_slide("blanc")
entete(s, "Étape 2 sur 5", "Vider ", "sa tête")
text(s, 90, 440, 1300, 200, [[("On note ", f"c:{GRIS}"), ("en vrac", f"c:{ENCRE}"), (" tout ce qu'on sait ou veut dire sur le sujet, et on découpe en plusieurs points.", f"c:{GRIS}")]], size=28, spacing=1.35)
carte(s, 1480, 420, 350, 260)
text(s, 1480, 440, 350, 150, "5", size=80, color=ROYAL, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1480, 590, 350, 60, "minutes, sans trier", size=18, color=ENCRE, align=PP_ALIGN.CENTER)
dessins(s, ("sparkle", 1720, 150, 80, CIEL))
pied(s, 6)
notes(s, "Étape 2 : vider sa tête.\nPendant 5 minutes, on note en vrac tout ce qu'on sait ou veut dire sur le sujet, sans trier, et on découpe en plusieurs points.")

# ---------------------------------------------------------------- 7. Étape 3
s = new_slide("blanc")
entete(s, "Étape 3 sur 5", "Regrouper ", "en 3 groupes")
text(s, 90, 370, 1740, 60, "Les idées mises bout à bout sont regroupées. Chaque groupe devient une partie. Pas d'idée ? Un plan tout prêt :", size=18, color=GRIS)
plans = [("Pour convaincre", "Problème", "Solution", "Bénéfice"), ("Pour expliquer", "Pourquoi", "Quoi", "Comment"), ("Pour raconter", "Avant", "Aujourd'hui", "Demain")]
for i, (but, a, b, c) in enumerate(plans):
    x = 90 + i * 590
    carte(s, x, 470, 560, 400)
    text(s, x + 40, 500, 480, 50, [[(but.upper(), "")]], size=12, color=CIEL)
    for j, mot in enumerate((a, b, c)):
        text(s, x + 40, 570 + j * 95, 480, 70, [[(f"{j + 1}   ", f"c:{CIEL}"), (mot, f"c:{ENCRE}")]], size=26)
dessins(s, ("heart", 1740, 160, 60, CIEL))
pied(s, 7)
notes(s, "Étape 3 : regrouper en 3 groupes.\nLes idées mises bout à bout sont regroupées : chaque groupe devient une partie. Si les groupes ne viennent pas naturellement, on prend un plan tout prêt :\n- Problème → Solution → Bénéfice (pour convaincre)\n- Pourquoi → Quoi → Comment (pour expliquer)\n- Avant → Aujourd'hui → Demain (pour raconter)")

# ---------------------------------------------------------------- 8. Étape 4
s = new_slide("blanc")
entete(s, "Étape 4 sur 5", "Associer les idées ", "aux images")
text(s, 90, 400, 1000, 60, "Pour chaque partie :", size=22, color=GRIS)
for j, (n, t) in enumerate([("1", "mot-clé"), ("1", "anecdote, exemple ou image")]):
    y = 480 + j * 110
    numero(s, 90, y, n, 72)
    text(s, 200, y, 1000, 72, t, size=28, color=ENCRE, anchor=MSO_ANCHOR.MIDDLE)
carte(s, 90, 740, 1740, 140)
text(s, 140, 740, 1640, 140, "Une histoire se retient sans effort. Une phrase rédigée, elle, doit être apprise.", size=22, color=ENCRE, anchor=MSO_ANCHOR.MIDDLE)
dessins(s, ("bubble", 1560, 400, 220, CIEL))
pied(s, 8)
notes(s, "Étape 4 : associer les idées aux images (accrocher de la chair à chaque os).\nPour chaque partie, on note un mot-clé et une anecdote, un exemple ou une image. Une histoire se retient sans effort, alors qu'une phrase rédigée demande d'être apprise.\nExemple : « Trajets » → « Marc gagne 1 h 30 par jour depuis qu'il télétravaille le vendredi. »")

# ---------------------------------------------------------------- 9. Étape 5
s = new_slide("blanc")
entete(s, "Étape 5 sur 5", "L'entrée ", "et la sortie")
for i, (nom, contenu) in enumerate([("Introduction", "Une accroche, puis l'annonce des 3 parties."), ("Conclusion", "Le rappel du message central, puis une action ou une question pour le public.")]):
    x = 90 + i * 880
    carte(s, x, 410, 850, 240)
    text(s, x + 40, 440, 770, 50, [[(nom.upper(), "")]], size=12, color=CIEL)
    text(s, x + 40, 500, 770, 140, contenu, size=21, color=ENCRE, spacing=1.3)
text(s, 90, 730, 1740, 70, [[("Le seul passage appris par cœur : ", f"c:{GRIS}"), ("la première et la dernière phrase.", f"c:{ENCRE}")]], size=26)
text(s, 90, 810, 1740, 60, "Entre les deux, on parle librement autour des mots-clés.", size=19, color=GRIS)
dessins(s, ("mic", 1690, 130, 140, CIEL))
pied(s, 9)
notes(s, "Étape 5 : l'entrée et la sortie.\n- Introduction : une accroche, puis l'annonce des 3 parties.\n- Conclusion : le rappel du message central, puis une action ou une question pour le public.\nC'est le seul passage qu'on apprend par cœur : la première et la dernière phrase. Entre les deux, on parle librement autour des mots-clés.")

# ---------------------------------------------------------------- 10. Exercice (bleue)
s = new_slide("hero")
entete(s, "Exercice", "À vous ", "de jouer", bleu=True)
carte(s, 90, 410, 1000, 470, "FFFFFF")
text(s, 140, 440, 900, 50, [[("SUR PAPIER, UN SUJET PERSONNEL", "")]], size=12, color=CIEL)
text(s, 140, 495, 900, 50, "Mon métier, mon dernier voyage, une passion…", size=17, color=GRIS)
for j, (n, t) in enumerate([("1", "message central"), ("3", "mots-clés"), ("1", "anecdote par mot-clé")]):
    y = 575 + j * 95
    numero(s, 140, y, n, 64)
    text(s, 240, y, 800, 64, t, size=24, color=ENCRE, anchor=MSO_ANCHOR.MIDDLE)
carte(s, 1140, 410, 690, 470, "FFFFFF")
text(s, 1180, 440, 620, 50, [[("MISE EN VOIX", "")]], size=12, color=CIEL)
text(s, 1180, 500, 620, 120, "2 ou 3 volontaires, 1 minute chacun.", size=24, color=ENCRE, spacing=1.25)
text(s, 1180, 640, 620, 200, "Caméra allumée, sans notes. On montre 1, 2 puis 3 doigts à l'écran pour marquer chaque partie.", size=18, color=GRIS, spacing=1.35)
dessins(s, ("mic", 1690, 120, 140, "FFFFFF"))
pied(s, 10, bleu=True)
notes(s, "Exercice en ligne.\nChacun choisit un sujet personnel (mon métier, mon dernier voyage, une passion) et note sur papier : 1 message central, 3 mots-clés et 1 anecdote par mot-clé.\nTemps 3, mise en voix (2 à 3 volontaires, 1 min chacun) : chaque volontaire présente caméra allumée, sans notes, en montrant 1, 2 puis 3 doigts à l'écran pour marquer chaque partie.")

# ---------------------------------------------------------------- 11. Vos questions, vos blocages
s = new_slide("blanc")
entete(s, "À vous la parole", "Vos questions, ", "vos blocages")
for i, b in enumerate(["Le trou de mémoire", "Le trac avant de commencer", "Ne pas savoir par où commencer", "Parler trop vite"]):
    x, y = 90 + (i % 2) * 880, 420 + (i // 2) * 150
    carte(s, x, y, 840, 115)
    text(s, x + 40, y, 760, 115, f"« {b} »", size=23, color=ENCRE, anchor=MSO_ANCHOR.MIDDLE)
text(s, 90, 780, 1740, 70, "Écrivez votre question dans le chat ou levez la main : on en parle ensemble.", size=20, color=GRIS)
dessins(s, ("bubble", 1660, 120, 170, CIEL))
pied(s, 11)
notes(s, "Questions sur vos blocages.\nOuvrir la parole : qu'est-ce qui vous bloque quand vous prenez la parole ? (trou de mémoire, trac, ne pas savoir par où commencer, débit trop rapide…)\nLes participants écrivent dans le chat ou lèvent la main.")

# ---------------------------------------------------------------- 12. Conclusion (bleue)
s = new_slide("hero")
logo(s)
text(s, 90, 165, 1400, 40, [[("CONCLUSION", "")]], size=11, color=CIEL_PALE)
text(s, 90, 230, 1050, 260, [[("On retient bien mieux", "c:FFFFFF")], [("un plan qu'un texte.", "serif c:FFFFFF s:58")]], size=46, spacing=1.0)
box(s, 92, 520, 60, 2, CIEL_PALE, None, shape=MSO_SHAPE.RECTANGLE)
text(s, 90, 570, 1000, 150, "Un message central, 3 parties, 1 histoire par partie, et seulement la première et la dernière phrase apprises par cœur.", size=19, color=BLANC_DOUX, spacing=1.4)
text(s, 90, 790, 1000, 70, "Merci, à très vite !", size=28, color="FFFFFF")
for i, (url, nom, label, sous) in enumerate([(URL_AVIS, "qr-avis", "Donnez votre avis", "1 minute"), (URL_SEANCE, "qr-seance", "Réservez une séance", "avec Rebecca")]):
    x = 1230 + i * 330
    box(s, x, 330, 300, 300, "FFFFFF", None, radius=0.06)
    pic(s, qr(url, nom), x + 25, 355, w=250)
    text(s, x - 15, 650, 330, 50, label, size=16, color="FFFFFF", align=PP_ALIGN.CENTER)
    text(s, x, 700, 300, 50, sous, size=14, color="B9C6DE", align=PP_ALIGN.CENTER)
dessins(s, ("sparkle", 1740, 150, 70, "FFFFFF"))
pic(s, doodle("heart", 200, mono=ORANGE), 1180, 270, w=50)  # la seule touche d'orange
pied(s, 12, bleu=True)
notes(s, f"Conclusion et transition.\nRappel du message central : on retient bien mieux un plan qu'un texte.\nQR code de gauche : donner son avis ({URL_AVIS}).\nQR code de droite : réserver une séance avec Rebecca ({URL_SEANCE}).")

prs.save(OUT)
print("ok", OUT)
