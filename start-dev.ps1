# LanzaWebAR - Script de Inicio para Desarrollo Local
# Ejecuta: .\start-dev.ps1

Write-Host "🚀 Iniciando LanzaWebAR en modo desarrollo..." -ForegroundColor Green
Write-Host ""

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Configurar archivo de entorno para desarrollo
if (Test-Path "server/.env.development") {
    Write-Host "🔧 Usando configuración de desarrollo (.env.development)" -ForegroundColor Cyan
    # Crear un archivo .env temporal que cargue las variables de desarrollo
    Copy-Item "server/.env.development" "server/.env.local"
} elseif (-not (Test-Path "server/.env")) {
    Write-Host "⚠️ No se encontró configuración de entorno" -ForegroundColor Yellow
    Write-Host "📝 Copiando desde server/.env.example..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "🔧 Por favor, configura tus variables de entorno en server/.env" -ForegroundColor Cyan
}

# Mostrar URLs importantes
Write-Host ""
Write-Host "🌐 URLs de desarrollo:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   API:      http://localhost:5173/api (proxy)" -ForegroundColor White
Write-Host ""

# Iniciar desarrollo completo
Write-Host "🚀 Iniciando frontend y backend..." -ForegroundColor Green
Write-Host "💡 Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

npm run dev:full