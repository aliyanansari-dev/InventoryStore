@echo off
echo ==============================================
echo  Publishing to GitHub: aliyanansari-dev
echo  Repository: minimart-inventory-pos
echo ==============================================
echo.

echo [1/5] Initializing Git...
git init

echo.
echo [2/5] Setting main branch...
git branch -M main

echo.
echo [3/5] Staging files...
git add .

echo.
echo [4/5] Creating commit...
git commit -m "Initial commit: Production-ready Mini Mart Inventory and POS System"

echo.
echo [5/5] Configuring remote and pushing to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/aliyanansari-dev/minimart-inventory-pos.git
git push -u origin main

echo.
echo ==============================================
echo  Repository URL:
echo  https://github.com/aliyanansari-dev/minimart-inventory-pos
echo ==============================================
pause
