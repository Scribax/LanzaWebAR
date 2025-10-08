@echo off
echo ====================================
echo     LanzaWebAR - Iniciando proyecto
echo ====================================
echo.

:: Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo Error: No se encontro package.json
    echo Asegurate de ejecutar este archivo desde la raiz del proyecto LanzaWebAR
    pause
    exit /b 1
)

:: Verificar si node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm ci
    if errorlevel 1 (
        echo Error al instalar dependencias del frontend
        pause
        exit /b 1
    )
)

:: Verificar si las dependencias del servidor existen
if not exist "server\node_modules" (
    echo Instalando dependencias del backend...
    call npm --prefix server ci
    if errorlevel 1 (
        echo Error al instalar dependencias del backend
        pause
        exit /b 1
    )
)

echo.
echo Iniciando frontend (Vite) y backend (Express)...
echo Frontend estara disponible en: http://localhost:5173/
echo Backend API estara disponible en: http://localhost:3001/
echo.
echo Presiona Ctrl+C para detener ambos servicios
echo.

:: Iniciar frontend y backend simultaneamente usando el script dev:full
call npm run dev:full