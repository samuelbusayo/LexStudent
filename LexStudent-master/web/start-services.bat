@echo off
set NODE_PATH=C:\nodejs\node-v22.14.0-win-x64
set PATH=%NODE_PATH%;%PATH%
set BASE_DIR=C:\Users\zsazs\OneDrive\Desktop\law prep

echo Starting LexScholar Server...
start "LexScholar Server" /MIN "%NODE_PATH%\node.exe" "%BASE_DIR%\server\index.js"

timeout /t 3 /nobreak > nul

echo Starting LexScholar Client...
start "LexScholar Client" /MIN "%NODE_PATH%\node.exe" "%BASE_DIR%\client\node_modules\vite\bin\vite.js" --port 5173 --host

echo.
echo ========================================
echo  Services starting...
echo  Server: http://localhost:3001
echo  Client: http://localhost:5173
echo ========================================
