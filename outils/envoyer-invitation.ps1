# Envoie l'invitation à un événement (mail mis en forme, depuis formationn@liebeneloquence.com) à une liste d'adresses.
# Utilisation, dans le terminal de VS Code :
#   Test (une seule adresse, la vôtre) :
#     powershell -ExecutionPolicy Bypass -File outils\envoyer-invitation.ps1 -Evenement rendez-vous-mensuel-leq-octobre-2026 -Edition deuxième -Test
#   Envoi réel (les adresses sont lues dans n'importe quel fichier texte, CSV ou copié depuis Excel) :
#     powershell -ExecutionPolicy Bypass -File outils\envoyer-invitation.ps1 -Evenement rendez-vous-mensuel-leq-octobre-2026 -Edition deuxième -Fichier C:\chemin\liste.csv
#
# Chaque personne reçoit son propre mail (personne ne voit les autres adresses). Une adresse déjà invitée
# à ce même événement est ignorée : relancer le script ne crée jamais de doublon.

param(
  [Parameter(Mandatory = $true)][string]$Evenement,
  [string]$Fichier,
  [string]$Edition,
  [switch]$Test,
  [string]$AdresseTest = "formationn@liebeneloquence.com"
)

$Serveur = "root@169.58.187.153"
# Accents transmis intacts au serveur et affichés correctement au retour
$utf8 = New-Object System.Text.UTF8Encoding $false
$OutputEncoding = $utf8
[Console]::OutputEncoding = $utf8

if ($Test) {
  $emails = @($AdresseTest)
} else {
  if (-not $Fichier -or -not (Test-Path $Fichier)) { Write-Host "Indiquez le fichier de la liste avec -Fichier (ou -Test pour un essai)."; exit 1 }
  $texte = Get-Content -Raw -Encoding UTF8 $Fichier
  $emails = @([regex]::Matches($texte, "[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}") | ForEach-Object { $_.Value.ToLower() } | Select-Object -Unique)
  if ($emails.Count -eq 0) { Write-Host "Aucune adresse email trouvée dans $Fichier."; exit 1 }
  Write-Host "$($emails.Count) adresse(s) trouvée(s) :"
  $emails | ForEach-Object { Write-Host "  $_" }
  $ok = Read-Host "Envoyer l'invitation à ces $($emails.Count) personne(s) ? Tapez OUI pour confirmer"
  if ($ok -ne "OUI") { Write-Host "Envoi annulé."; exit 0 }
  Write-Host "Envoi en cours (2 secondes par mail)…"
}

$corps = @{ slug = $Evenement; emails = $emails; test = [bool]$Test }
if ($Edition) { $corps.edition = $Edition }
$json = $corps | ConvertTo-Json -Compress

# La clé d'accès reste sur le serveur : l'appel est fait depuis le conteneur du site.
$distant = "cd /opt/leq && docker compose exec -T site sh -c 'cat > /tmp/invitation.json && wget -q -O - -T 3600 --header=Content-Type:application/json --header=X-LEQ-Cle:`$DATA_API_KEY --post-file=/tmp/invitation.json http://127.0.0.1:3000/api/invitations; rm -f /tmp/invitation.json'"
$reponse = $json | ssh $Serveur $distant
if (-not $reponse) { Write-Host "Pas de réponse du site : vérifiez le nom de l'événement (-Evenement) puis réessayez."; exit 1 }
$r = $reponse | ConvertFrom-Json
Write-Host ""
Write-Host "Objet du mail : $($r.objet)"
Write-Host "Envoyés : $($r.envoyes)"
if ($r.dejaInvites.Count) { Write-Host "Déjà invités (ignorés) : $($r.dejaInvites -join ', ')" }
if ($r.echecs.Count) { Write-Host "Échecs (à vérifier) : $($r.echecs -join ', ')" }
