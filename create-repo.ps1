# Script to create GitHub repository
# سكريبت إنشاء المستودع على GitHub

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Creating GitHub repository..." -ForegroundColor Cyan
Write-Host ""

# Check authentication
Write-Host "Checking authentication..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in yet." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please login first:" -ForegroundColor Yellow
    Write-Host "   gh auth login" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Logged in successfully!" -ForegroundColor Green
Write-Host ""

# Repository details
$REPO_NAME = "oman-education-ai-system"
$REPO_DESCRIPTION = "AI-powered Arabic Education System"

Write-Host "Creating repository: $REPO_NAME" -ForegroundColor Yellow
Write-Host "Description: $REPO_DESCRIPTION" -ForegroundColor Gray
Write-Host ""

# Create repository (private by default)
gh repo create $REPO_NAME --description $REPO_DESCRIPTION --private --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Repository created and code pushed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL:" -ForegroundColor Cyan
    Write-Host "   https://github.com/K8U2R/$REPO_NAME" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error creating repository." -ForegroundColor Red
    Write-Host ""
    Write-Host "Try manually:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "   2. Repository name: $REPO_NAME" -ForegroundColor White
    Write-Host "   3. Click 'Create repository'" -ForegroundColor White
    Write-Host "   4. Then run: git push -u origin main" -ForegroundColor White
    Write-Host ""
}
