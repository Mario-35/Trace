#
# Trace Windows setup/deploy script.
#
# @copyright 2024-present Inrae
# @author mario.adam@inrae.fr
# version 1.1
#
# Windows port of trace.sh. Requires PowerShell 5.1+ and an elevated
# (Administrator) session for the installation steps (Chocolatey, Node,
# PostgreSQL, PATH changes).
#

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Clear-Host

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

$FileDist    = ".\dist.zip"
$FileDistOld = ".\distOld.zip"
$FileRun     = ".\run.ps1"
$PgVersion   = "17"
$PgHbaPath   = "C:\Program Files\PostgreSQL\$PgVersion\data\pg_hba.conf"

# ---------------------------------------------------------------------------
# Create run script
# ---------------------------------------------------------------------------

function New-RunScript {
    if (Test-Path $FileRun) {
        Remove-Item $FileRun -Force
        Write-Info "Delete => $FileRun"
    }
    @(
        'pm2 stop main'
        'pm2 flush'
        'pm2 delete main'
        'Write-Host "API starting ..."'
        '$env:NODE_ENV = "production"'
        'pm2 start .\trace\main.js --env production'
        'pm2 logs --lines 500'
    ) | Set-Content -Path $FileRun -Encoding UTF8
    Write-Info "Create script => $FileRun"
}

# ---------------------------------------------------------------------------
# Prerequisite: elevated session (Windows equivalent of the bash "sudo" checks)
# ---------------------------------------------------------------------------

function Test-Administrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Err "This script must be run from an elevated (Administrator) PowerShell session."
        exit 1
    }
    Write-Success "Running elevated"
}

# ---------------------------------------------------------------------------
# Prerequisite: Chocolatey (Windows equivalent of apt for unattended installs)
# ---------------------------------------------------------------------------

function Test-Chocolatey {
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Info "Installing Chocolatey..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    } else {
        Write-Success "Chocolatey found"
    }
}

# ---------------------------------------------------------------------------
# Node
# ---------------------------------------------------------------------------

function Test-Node {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Info "Installing Node..."
        choco install nodejs-lts -y
        Update-SessionPath
    } else {
        Write-Success "Node found"
    }
    $script:NodeVersion = node -v
}

function Update-SessionPath {
    $machine = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $user = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machine;$user"
}

# ---------------------------------------------------------------------------
# npm global prefix / PATH (Windows equivalent of config_node)
# ---------------------------------------------------------------------------

function Set-NpmGlobalConfig {
    Write-Info "Setting up npm to install global packages in the user profile..."

    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Err "npm is not installed. Please install Node.js and npm first."
        exit 1
    }

    $npmGlobalDir = Join-Path $env:USERPROFILE ".npm-global"
    $currentPrefix = npm config get prefix 2>$null

    if ($currentPrefix -eq $npmGlobalDir) {
        Write-Success "npm is already configured to use $npmGlobalDir"
    } else {
        if (-not (Test-Path $npmGlobalDir)) {
            Write-Info "Creating $npmGlobalDir directory..."
            New-Item -ItemType Directory -Path $npmGlobalDir -Force | Out-Null
        }

        Write-Info "Configuring npm to use $npmGlobalDir..."
        npm config set prefix "$npmGlobalDir"
        Write-Success "npm prefix set to $npmGlobalDir"
    }

    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -split ";" -contains $npmGlobalDir) {
        Write-Success "PATH already includes $npmGlobalDir"
    } else {
        Write-Info "Adding $npmGlobalDir to the user PATH..."
        [Environment]::SetEnvironmentVariable("Path", "$userPath;$npmGlobalDir", "User")
        Update-SessionPath
        Write-Success "Added $npmGlobalDir to PATH"
        Write-Warning2 "Open a new terminal for the PATH change to apply everywhere."
    }

    Write-Host ""
    Write-Success "npm global setup complete!"
    Write-Host ""
    Write-Info "You can now install global packages:"
    Write-Host "  npm install -g <package-name>"
    Write-Host ""
    Write-Info "Current configuration:"
    Write-Host "  npm prefix: $(npm config get prefix)"
}

# ---------------------------------------------------------------------------
# PostgreSQL + PostGIS
# ---------------------------------------------------------------------------

function Test-PostgreSql {
    $psql = Get-Command psql -ErrorAction SilentlyContinue
    if (-not $psql -or -not ((& psql --version) -match "psql \(PostgreSQL\)")) {
        Write-Warning2 "Installing postgresql-postgis..."
        choco install postgresql$PgVersion --params "/Password:postgres" -y
        choco install postgis -y
        Update-SessionPath

        if (-not ((& psql --version) -match "psql \(PostgreSQL\)")) {
            exit 1
        }

        $env:PGPASSWORD = "postgres"
        & psql -U postgres -c "SELECT PostGIS_version();"
        & psql -U postgres -c "CREATE USER trace WITH PASSWORD 'trace';"
        & psql -U postgres -c "CREATE DATABASE trace;"
        Update-PgHba
        $script:PgVer = & psql --version
    } else {
        Write-Info "postgresql installed"
        $script:PgVer = & psql --version
    }
}

# Allow remote md5-authenticated connections, mirroring the intent of the
# original bash update_pg_hba (which appended an equivalent host rule).
function Update-PgHba {
    Copy-Item $PgHbaPath "$PgHbaPath.bak" -Force
    Add-Content -Path $PgHbaPath -Value "host    all             all             0.0.0.0/0            md5"
    (Get-Content "C:\Program Files\PostgreSQL\$PgVersion\data\postgresql.conf") -replace "^#?listen_addresses\s*=.*", "listen_addresses = '*'" |
        Set-Content "C:\Program Files\PostgreSQL\$PgVersion\data\postgresql.conf"
    Restart-Service -Name "postgresql-x64-$PgVersion"
}

# ---------------------------------------------------------------------------
# pm2
# ---------------------------------------------------------------------------

function Test-Pm2 {
    if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
        Write-Warning2 "Installing pm2..."
        npm install pm2@latest -g
        Update-SessionPath
    } else {
        Write-Info "pm2 installed"
    }
    $script:Pm2Version = pm2 -v
}

# ---------------------------------------------------------------------------
# dist.zip handling (Expand-Archive replaces unzip - built into Windows)
# ---------------------------------------------------------------------------

function Test-DistFile {
    if (Test-Path $FileDist) {
        Write-Warning2 "$FileDist is already present."
        do {
            $answer = Read-Host "Do you wish to use it (y/n)"
            switch -Regex ($answer) {
                '^[Yy]' { $useExisting = $true; break }
                '^[Nn]' { Get-Dist; $useExisting = $true; break }
                default { Write-Host "Please answer yes or no." }
            }
        } until ($useExisting)
    } else {
        Get-Dist
    }
}

function Save-Dist {
    if (Test-Path $FileDist) {
        Remove-Item $FileDistOld -Force -ErrorAction SilentlyContinue
        Write-Info "Delete => $FileDistOld"
        Move-Item $FileDist $FileDistOld -Force
        Write-Info "Move $FileDist => $FileDistOld"
    }
}

function Get-Dist {
    Save-Dist
    Invoke-WebRequest -Uri "https://github.com/Mario-35/trace/raw/refs/heads/main/dist.zip" -OutFile $FileDist
}

# ---------------------------------------------------------------------------
# Install / stop / start trace
# ---------------------------------------------------------------------------

function Install-Trace {
    if (Test-Path .\trace) {
        if (Test-Path .\traceBak) {
            Remove-Item .\traceBak -Recurse -Force
            Write-Info "Delete => .\traceBak"
        }
        Move-Item .\trace .\traceBak
        Write-Info "Move .\trace => .\traceBak"
    }

    Expand-Archive -Path $FileDist -DestinationPath .\trace -Force
    Save-Dist
    npm install --omit=dev --prefix .\trace\
}

function Stop-Trace {
    Write-Host "API Stopping ..."
    pm2 stop main
    pm2 kill
}

function Start-Trace {
    Write-Host "API starting ..."
    $env:NODE_ENV = "production"
    pm2 start .\trace\main.js
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

Test-Administrator
Test-Chocolatey
Test-PostgreSql
Test-Node
Set-NpmGlobalConfig
Test-Pm2
Test-DistFile
Stop-Trace
Install-Trace
New-RunScript
