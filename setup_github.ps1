param (
    [string]$RepoName = "minimart-inventory-pos",
    [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Automated Git & GitHub Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Verify Git Installation
try {
    $gitVer = git --version
    Write-Host "[OK] Git detected: $gitVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Check Git User Configuration
$gitUser = (git config --global user.name)
$gitEmail = (git config --global user.email)

if (-not $gitUser) {
    Write-Host "[INFO] Setting Git global user.name to Minimart Admin" -ForegroundColor Yellow
    git config --global user.name "Minimart Admin"
    $gitUser = "Minimart Admin"
}

if (-not $gitEmail) {
    Write-Host "[INFO] Setting Git global user.email to admin@minimart.com" -ForegroundColor Yellow
    git config --global user.email "admin@minimart.com"
    $gitEmail = "admin@minimart.com"
}

Write-Host "[OK] Git Identity: $gitUser <$gitEmail>" -ForegroundColor Green

# 3. Verify GitHub CLI (gh)
try {
    $ghVer = gh --version
    Write-Host "[OK] GitHub CLI detected." -ForegroundColor Green
} catch {
    Write-Host "[ERROR] GitHub CLI (gh) is not installed." -ForegroundColor Red
    exit 1
}

# Check gh auth status
$authStatus = gh auth status 2>&1
Write-Host $authStatus

# 4. Initialize Local Git Repository if not exists
if (-not (Test-Path -Path ".git")) {
    Write-Host "[INFO] Initializing new Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
    Write-Host "[OK] Initialized Git repository on main branch." -ForegroundColor Green
} else {
    Write-Host "[OK] Git repository already initialized." -ForegroundColor Green
}

# 5. Stage and Commit Files
Write-Host "[INFO] Staging all files..." -ForegroundColor Cyan
git add .
$statusOutput = git status --porcelain
if ($statusOutput) {
    Write-Host "[INFO] Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: Production-ready Mini Mart Inventory and POS System"
    Write-Host "[OK] Commit created successfully." -ForegroundColor Green
} else {
    Write-Host "[OK] Working tree clean, no new files to commit." -ForegroundColor Green
}

# 6. Create Remote and Push
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
    Write-Host "[INFO] Creating GitHub repository $RepoName ($Visibility)..." -ForegroundColor Cyan
    if ($Visibility -eq "public") {
        gh repo create $RepoName --public --source=. --remote=origin --push
    } else {
        gh repo create $RepoName --private --source=. --remote=origin --push
    }
    Write-Host "[OK] Repository created and pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "[INFO] Remote origin found: $existingRemote" -ForegroundColor Green
    Write-Host "[INFO] Pushing commits to origin main..." -ForegroundColor Cyan
    git push -u origin main
    Write-Host "[OK] Pushed to origin main." -ForegroundColor Green
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " GitHub Setup Completed Successfully!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

git status
git remote -v
git log -1 --oneline
