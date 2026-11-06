@echo off
echo ==============================================
echo  Initializing Git Repository and Staging Files
echo ==============================================

git init
git branch -M main
git add .
git commit -m "Initial commit: Complete Mini Mart Inventory and POS System"

echo.
echo ==============================================
echo  Local Git Repository Ready!
echo ==============================================
git status
git log -1 --oneline
