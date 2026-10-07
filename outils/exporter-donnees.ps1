# Récupère les données des formulaires du site et les enregistre en fichiers Excel (CSV).
# Utilisation : clic droit sur ce fichier > « Exécuter avec PowerShell »,
# ou dans le terminal de VS Code :  powershell -ExecutionPolicy Bypass -File outils\exporter-donnees.ps1
#
# Résultat : un dossier « LEQ-donnees-AAAA-MM-JJ » dans vos Téléchargements.

$Serveur = "root@169.58.187.153"
$Fichiers = @(
  @{ Nom = "newsletter";     Titre = "Inscriptions newsletter" },
  @{ Nom = "liste-attente";  Titre = "Liste d'attente LEQ'FAM" },
  @{ Nom = "demandes";       Titre = "Demandes (devis, Grand Oral, contact)" },
  @{ Nom = "quiz";           Titre = "Résultats du quiz" },
  @{ Nom = "inscriptions";   Titre = "Inscriptions aux événements" }
)

$Dossier = Join-Path ([Environment]::GetFolderPath("UserProfile")) ("Downloads\LEQ-donnees-" + (Get-Date -Format "yyyy-MM-dd"))
New-Item -ItemType Directory -Force -Path $Dossier | Out-Null
$Utf8 = New-Object System.Text.UTF8Encoding($true)  # avec BOM : Excel affiche bien les accents

foreach ($f in $Fichiers) {
  $brut = ssh $Serveur "cd /opt/leq && docker compose exec -T site sh -c 'cat /data/$($f.Nom).jsonl 2>/dev/null'"
  $lignes = @($brut | Where-Object { $_ -and $_.Trim().StartsWith("{") })
  if ($lignes.Count -eq 0) { Write-Host "  $($f.Titre) : aucune donnée"; continue }

  $objets = @(foreach ($l in $lignes) {
    $o = $l | ConvertFrom-Json
    $ligne = [ordered]@{}
    foreach ($p in $o.PSObject.Properties) {
      $v = $p.Value
      if ($v -is [System.Array]) { $v = ($v | ForEach-Object { if ($_ -is [System.Array]) { $_ -join " + " } else { $_ } }) -join " | " }
      if ($p.Name -eq "createdAt") { $p2 = "date"; $v = ([datetime]$v).ToLocalTime().ToString("dd/MM/yyyy HH:mm") } else { $p2 = $p.Name }
      $ligne[$p2] = $v
    }
    [pscustomobject]$ligne
  })

  # Toutes les colonnes rencontrées (les lignes n'ont pas toutes les mêmes champs)
  $colonnes = $objets | ForEach-Object { $_.PSObject.Properties.Name } | Select-Object -Unique
  $csv = $objets | Select-Object $colonnes | ConvertTo-Csv -Delimiter ";" -NoTypeInformation
  $chemin = Join-Path $Dossier "$($f.Nom).csv"
  try { [System.IO.File]::WriteAllLines($chemin, $csv, $Utf8) }
  catch {
    # Fichier déjà ouvert (dans Excel) : on enregistre une copie horodatée
    $chemin = Join-Path $Dossier ("$($f.Nom)-" + (Get-Date -Format "HH'h'mm") + ".csv")
    [System.IO.File]::WriteAllLines($chemin, $csv, $Utf8)
  }
  Write-Host "  $($f.Titre) : $($objets.Count) ligne(s)"
}

Write-Host ""
Write-Host "Fichiers enregistrés dans : $Dossier"
Start-Process $Dossier
