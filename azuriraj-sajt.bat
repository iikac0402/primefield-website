@echo off
cd /d "%~dp0"

echo Azuriram sajt...
echo.

git add -A
git commit -m "update sajta"
git push

echo.
echo ================================
echo Gotovo. Netlify ce sada da pokupi izmene i automatski ih objavi.
echo ================================
echo.
pause
