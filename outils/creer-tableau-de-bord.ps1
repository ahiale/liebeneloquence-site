# Crée le tableau de bord Excel des données du site (LEQ-donnees.xlsx), relié en direct au site.
# Utilisation (une seule fois, ou pour le recréer) :
#   powershell -ExecutionPolicy Bypass -File outils\creer-tableau-de-bord.ps1
# Le fichier est créé dans le dossier parent du projet (hors GitHub : il contient la clé d'accès
# et des données personnelles). Il se met à jour tout seul à l'ouverture et toutes les 5 minutes.

param(
  [string]$Sortie = (Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) "LEQ-donnees.xlsx"),
  [string]$Site = "https://liebeneloquence.com",
  [string]$Cle = ""
)

$Serveur = "root@169.58.187.153"
if (-not $Cle) { $Cle = (ssh $Serveur "grep '^DATA_API_KEY=' /opt/leq/.env | cut -d= -f2-") }
if (-not $Cle -or $Cle.Trim().Length -lt 32) { Write-Host "Clé DATA_API_KEY introuvable sur le serveur (voir deploy/.env.example)."; exit 1 }
$Cle = $Cle.Trim()

$Feuilles = @(
  @{ Feuille = "Liste d'attente"; Api = "liste-attente"; Table = "TAttente"; Noms = @{};    Titre = "Liste d'attente LEQ'FAM";       Info = "Une ligne par personne (les inscriptions en double sont ignorées)." },
  @{ Feuille = "Fiches orateur";  Api = "fiches";        Table = "TFiches"; Noms = @{};     Titre = "Fiches orateur demandées";       Info = "Personnes qui ont laissé prénom et email pour recevoir leur fiche après le quiz." },
  @{ Feuille = "Quiz réalisés";   Api = "quiz";          Table = "TQuiz"; Noms = @{ Q_Profil = "B"; Q_Pack = "D" };       Titre = "Quiz réalisés";                  Info = "Chaque quiz terminé, anonyme (la personne a pu ensuite demander sa fiche ou non)." },
  @{ Feuille = "Demandes";        Api = "demandes";      Table = "TDemandes"; Noms = @{ Dem_Type = "B" };   Titre = "Demandes : devis, Grand Oral, contact"; Info = "Tous les formulaires qui vous sont aussi notifiés par mail." },
  @{ Feuille = "Newsletter";      Api = "newsletter";    Table = "TNewsletter"; Noms = @{}; Titre = "Inscriptions à la newsletter";   Info = "Une ligne par adresse." }
)

$NAVY = 0x361600; $ORANGE = 0x015EFF; $GOLD = 0x59BDFF; $CLOUD = 0xFAEFE8; $GREY = 0x856B5B   # couleurs BGR d'Excel

$xl = New-Object -ComObject Excel.Application
$xl.DisplayAlerts = $false
$xl.Visible = $false
$wb = $xl.Workbooks.Add()
while ($wb.Worksheets.Count -gt 1) { $wb.Worksheets.Item($wb.Worksheets.Count).Delete() }
$tdb = $wb.Worksheets.Item(1)
$tdb.Name = "Tableau de bord"

$apres = $tdb
foreach ($f in $Feuilles) {
  $ws = $wb.Worksheets.Add([Type]::Missing, $apres)
  $ws.Name = $f.Feuille
  $apres = $ws
  $ws.Range("A1").Value2 = $f.Titre
  $ws.Range("A1").Font.Size = 18; $ws.Range("A1").Font.Bold = $true; $ws.Range("A1").Font.Color = $NAVY
  $ws.Range("A2").Value2 = $f.Info + " Les plus anciennes en haut, les nouvelles s'ajoutent en bas."
  $ws.Range("A2").Font.Color = $GREY; $ws.Range("A2").Font.Italic = $true
  $qt = $ws.QueryTables.Add("TEXT;$Site/api/donnees/$($f.Api)?cle=$Cle", $ws.Range("A4"))
  $qt.Name = $f.Table
  $qt.TextFilePlatform = 65001
  $qt.TextFileParseType = 1
  $qt.TextFileSemicolonDelimiter = $true
  $qt.TextFileCommaDelimiter = $false
  $qt.TextFileTabDelimiter = $false
  $qt.TextFileTextQualifier = 1
  $types = @(5) + @(1) * 20
  $qt.TextFileColumnDataTypes = [object[]]$types
  $qt.RefreshOnFileOpen = $true
  $qt.RefreshPeriod = 5
  $qt.BackgroundQuery = $true
  $qt.PreserveFormatting = $true
  $qt.SaveData = $true
  $qt.Refresh($false) | Out-Null
  $qt.AdjustColumnWidth = $false
  $nb = $qt.ResultRange.Columns.Count
  $entete = $ws.Range($ws.Cells.Item(4, 1), $ws.Cells.Item(4, $nb))
  $entete.Font.Bold = $true; $entete.Font.Color = 0xFFFFFF; $entete.Interior.Color = $NAVY
  $ws.Columns.Item(1).NumberFormat = "dd/mm/yyyy hh:mm"
  $ws.Range("A1:A2").NumberFormat = "General"
  $ws.Range($ws.Cells.Item(4, 2), $ws.Cells.Item(4, $nb)).EntireColumn.AutoFit() | Out-Null
  $ws.Columns.Item(1).ColumnWidth = 18
  for ($c = 1; $c -le $nb; $c++) { if ($ws.Columns.Item($c).ColumnWidth -gt 60) { $ws.Columns.Item($c).ColumnWidth = 60 } }
  $ws.Activate(); $xl.ActiveWindow.DisplayGridlines = $false
  $ws.Range("A5").Select() | Out-Null; $xl.ActiveWindow.FreezePanes = $true
  # Noms utilisés par le tableau de bord (colonnes entières : elles suivent les nouvelles lignes)
  $feuille = "'" + ($f.Feuille -replace "'", "''") + "'"
  $null = $wb.Names.Add("D_" + $f.Table.Substring(1), "=$feuille!`$A:`$A")
  foreach ($n in $f.Noms.Keys) { $null = $wb.Names.Add($n, "=$feuille!`$$($f.Noms[$n]):`$$($f.Noms[$n])") }
}

# ---------------------------------------------------------------- Tableau de bord
$t = $tdb
$t.Activate(); $xl.ActiveWindow.DisplayGridlines = $false
$t.Cells.Font.Name = "Calibri"
$t.Columns.Item(1).ColumnWidth = 3
foreach ($i in 2..9) { $t.Columns.Item($i).ColumnWidth = 17 }

$titre = $t.Range("B2:I3"); $titre.Merge(); $titre.Interior.Color = $NAVY
$titre.Value2 = "  LEQ.  Tableau de bord du site"; $titre.Font.Color = 0xFFFFFF; $titre.Font.Size = 20; $titre.Font.Bold = $true; $titre.VerticalAlignment = -4108
$t.Range("B4:I4").Interior.Color = $ORANGE; $t.Rows.Item(4).RowHeight = 4
$t.Range("B5").Value2 = "Se met à jour tout seul à l'ouverture et toutes les 5 minutes. Pour forcer : onglet Données > Actualiser tout."
$t.Range("B5").Font.Color = $GREY; $t.Range("B5").Font.Italic = $true

function Carte($cell, $label, $formule, $sous) {
  $r = $t.Range($cell)
  $box = $r.Resize(4, 2)
  $box.Interior.Color = $CLOUD
  $r.Value2 = $label; $r.Font.Bold = $true; $r.Font.Color = $NAVY; $r.Font.Size = 11
  $n = $r.Offset(1, 0).Resize(2, 2); $n.Merge(); $n.FormulaLocal = $formule
  $n.Font.Size = 30; $n.Font.Bold = $true; $n.Font.Color = $ORANGE; $n.HorizontalAlignment = -4131; $n.VerticalAlignment = -4108
  $s = $r.Offset(3, 0).Resize(1, 2); $s.Merge(); $s.FormulaLocal = $sous; $s.Font.Color = $GREY; $s.Font.Size = 9.5
}

# Formules en français (FormulaLocal) : cet Excel refuse certaines fonctions écrites en anglais.
Carte "B7" "Liste d'attente"   "=NB(D_Attente)"     '="+" & NB.SI(D_Attente;">="&AUJOURDHUI()-7) & " ces 7 derniers jours"'
Carte "D7" "Fiches orateur"    "=NB(D_Fiches)"      '="+" & NB.SI(D_Fiches;">="&AUJOURDHUI()-7) & " ces 7 derniers jours"'
Carte "F7" "Quiz réalisés"     "=NB(D_Quiz)"        '=SIERREUR(TEXTE(NB(D_Fiches)/NB(D_Quiz);"0 %");"0 %") & " ont demandé leur fiche"'
Carte "H7" "Demandes"          "=NB(D_Demandes)"    '=NB.SI(Dem_Type;"Devis") & " devis · " & NB.SI(Dem_Type;"Grand Oral") & " Grand Oral · " & NB.SI(Dem_Type;"Contact") & " contact"'
Carte "B12" "Newsletter"       "=NB(D_Newsletter)"  '="+" & NB.SI(D_Newsletter;">="&AUJOURDHUI()-7) & " ces 7 derniers jours"'
Carte "D12" "Dernière inscription" '=MAX(D_Attente;D_Fiches;D_Demandes;D_Newsletter)' '="toutes listes confondues"'
$t.Range("D13").Font.Size = 20; $t.Range("D13").NumberFormatLocal = "jj/mm hh:mm"

# Profils du quiz
$t.Range("F12").Value2 = "Profils obtenus au quiz"; $t.Range("F12").Font.Bold = $true; $t.Range("F12").Font.Color = $NAVY
$profils = @("Le Conteur", "Le Stratège", "Le Tribun", "Le Diplomate", "L’Improvisateur")
for ($i = 0; $i -lt $profils.Count; $i++) {
  $t.Cells.Item(13 + $i, 6).Value2 = $profils[$i]
  $t.Cells.Item(13 + $i, 7).FormulaLocal = "=NB.SI(Q_Profil;F$(13 + $i))"
}
$t.Range("H12").Value2 = "Pack conseillé"; $t.Range("H12").Font.Bold = $true; $t.Range("H12").Font.Color = $NAVY
$packs = @("Senghor", "Cicéron", "Socrate")
for ($i = 0; $i -lt $packs.Count; $i++) {
  $t.Cells.Item(13 + $i, 8).Value2 = $packs[$i]
  $t.Cells.Item(13 + $i, 9).FormulaLocal = "=NB.SI(Q_Pack;H$(13 + $i))"
}

# 14 derniers jours
$t.Range("B19").Value2 = "Les 14 derniers jours"; $t.Range("B19").Font.Bold = $true; $t.Range("B19").Font.Color = $NAVY; $t.Range("B19").Font.Size = 13
$entetes = @("Jour", "Quiz", "Fiches", "Liste d'attente", "Demandes", "Newsletter")
for ($i = 0; $i -lt $entetes.Count; $i++) { $c = $t.Cells.Item(20, 2 + $i); $c.Value2 = $entetes[$i]; $c.Font.Bold = $true; $c.Font.Color = 0xFFFFFF; $c.Interior.Color = $NAVY }
$tables = @("D_Quiz", "D_Fiches", "D_Attente", "D_Demandes", "D_Newsletter")
for ($d = 0; $d -lt 14; $d++) {
  $row = 21 + $d
  $t.Cells.Item($row, 2).FormulaLocal = "=AUJOURDHUI()-$(13 - $d)"
  $t.Cells.Item($row, 2).NumberFormatLocal = "jjj jj/mm"
  for ($k = 0; $k -lt $tables.Count; $k++) {
    $t.Cells.Item($row, 3 + $k).FormulaLocal = "=NB.SI.ENS($($tables[$k]);"">=""&`$B$row;$($tables[$k]);""<""&`$B$row+1)"
  }
  if ($d % 2 -eq 1) { $t.Range("B$($row):G$($row)").Interior.Color = $CLOUD }
}
$t.Range("C21:G34").HorizontalAlignment = -4108

# Graphiques
$g1 = $t.ChartObjects().Add($t.Range("I19").Left + 10, $t.Range("I19").Top, 430, 270).Chart
$g1.ChartType = 51  # histogramme groupé
$g1.SetSourceData($t.Range("B20:D34"))
$g1.HasTitle = $true; $g1.ChartTitle.Text = "Quiz et fiches par jour"
$g1.SeriesCollection(1).Format.Fill.ForeColor.RGB = $NAVY
$g1.SeriesCollection(2).Format.Fill.ForeColor.RGB = $ORANGE

$g2 = $t.ChartObjects().Add($t.Range("B38").Left, $t.Range("B38").Top, 430, 230).Chart
$g2.ChartType = 57  # barres
$g2.SetSourceData($t.Range("F13:G17"))
$g2.HasTitle = $true; $g2.ChartTitle.Text = "Profils obtenus au quiz"; $g2.HasLegend = $false
$g2.SeriesCollection(1).Format.Fill.ForeColor.RGB = $GOLD

$t.Range("B36").Value2 = "Astuce : dans chaque onglet, Données > Filtrer pour trier ou filtrer (par profil, par date…)."
$t.Range("B36").Font.Color = $GREY; $t.Range("B36").Font.Italic = $true
$t.Activate(); $t.Range("A1").Select() | Out-Null

if (Test-Path $Sortie) { Remove-Item $Sortie -Force }
$wb.SaveAs($Sortie, 51)
$wb.Close($false)
$xl.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) | Out-Null
Write-Host "Tableau de bord créé : $Sortie"
