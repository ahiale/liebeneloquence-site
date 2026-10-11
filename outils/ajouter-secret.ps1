# Enregistre une clé secrète (robot Discord, clé Stripe…) sur le serveur, dans /opt/leq/.env,
# sans qu'elle apparaisse à l'écran, dans un fichier du projet ou dans une conversation.
# Utilisation, dans le terminal de VS Code :
#   powershell -ExecutionPolicy Bypass -File outils\ajouter-secret.ps1 -Nom DISCORD_BOT_TOKEN
# Collez la clé quand elle est demandée (clic droit pour coller), puis Entrée. Rien ne s'affiche : c'est normal.

param([Parameter(Mandatory = $true)][ValidatePattern("^[A-Z][A-Z0-9_]+$")][string]$Nom)

$Serveur = "root@169.58.187.153"
$OutputEncoding = New-Object System.Text.UTF8Encoding $false  # pas de caractère invisible ajouté devant la clé

$secure = Read-Host "Collez la valeur de $Nom puis Entrée" -AsSecureString
$valeur = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)).Trim()
if ($valeur.Length -lt 10) { Write-Host "Valeur vide ou trop courte : rien n'a été enregistré. Réessayez (clic droit pour coller)."; exit 1 }

# La valeur passe par l'entrée standard de SSH (chiffrée), jamais dans une ligne de commande visible.
$script = "read -r v; v=`$(printf '%s' ""`$v"" | tr -d '\r'); f=/opt/leq/.env; grep -v '^$Nom=' `$f > `$f.tmp; printf '%s=%s\n' '$Nom' ""`$v"" >> `$f.tmp; mv `$f.tmp `$f; chmod 600 `$f; cd /opt/leq && docker compose up -d site >/dev/null 2>&1; echo ok"
$res = $valeur | ssh $Serveur $script
$valeur = $null
if ($res -match "ok") { Write-Host "$Nom est enregistré sur le serveur. Vous pouvez prévenir Claude." } else { Write-Host "L'enregistrement n'a pas abouti : $res" }
