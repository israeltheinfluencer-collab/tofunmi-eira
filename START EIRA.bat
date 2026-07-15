@echo off
echo Starting Tofunmi EIRA...
echo.
echo Opening in browser at http://localhost:8000
echo.
echo DO NOT CLOSE THIS WINDOW while using the app.
echo Close this window when you are done.
echo.
start "" "http://localhost:8000"
python -m http.server 8000
pause
