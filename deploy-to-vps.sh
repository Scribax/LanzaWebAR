#!/bin/bash
# LanzaWebAR - Script de Deployment Automático para VPS
# Ejecutar desde el directorio local del proyecto: ./deploy-to-vps.sh

set -e  # Salir si hay algún error

echo "🚀 Iniciando deployment de LanzaWebAR a VPS..."
echo "=============================================="

# Configuración (editar según tu VPS)
VPS_USER="root"
VPS_HOST="tu-vps-ip"  # Cambiar por la IP de tu VPS
VPS_PATH="/var/www/lanzaweb"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde el directorio raíz de LanzaWebAR"
fi

log "✅ Directorio verificado"

# 2. Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    error "Hay cambios sin commitear. Haz commit antes de hacer deploy"
fi

log "✅ Git status limpio"

# 3. Build local para verificar que compila
log "🔨 Compilando proyecto localmente..."
npm run build
cd server && npm run build && cd ..
log "✅ Compilación local exitosa"

# 4. Push a GitHub
log "📤 Haciendo push a GitHub..."
git push origin main
log "✅ Código enviado a GitHub"

# 5. Deployment en VPS
log "🌐 Conectando al VPS y desplegando..."

ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
set -e

echo "📥 Actualizando código en VPS..."
cd /var/www/lanzaweb

# Backup del .env actual
if [ -f "server/.env" ]; then
    cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup de .env creado"
fi

# Pull latest code
git pull origin main
echo "✅ Código actualizado"

# Install dependencies
echo "📦 Instalando dependencias..."
npm ci
cd server && npm ci && cd ..
echo "✅ Dependencias instaladas"

# Build application
echo "🔨 Compilando aplicación..."
npm run build
cd server && npm run build && cd ..
echo "✅ Aplicación compilada"

# Ensure .env exists with production settings
if [ ! -f "server/.env" ]; then
    echo "📝 Creando .env de producción..."
    cp server/.env.production server/.env
    echo "⚠️ IMPORTANTE: Edita server/.env con los valores correctos"
    echo "⚠️ Especialmente JWT_SECRET debe ser un valor fuerte y único"
fi

# Set proper permissions
echo "🔒 Configurando permisos..."
chown -R www-data:www-data /var/www/lanzaweb
chmod 755 /var/www/lanzaweb/server

# Restart services
echo "🔄 Reiniciando servicios..."
systemctl daemon-reload
systemctl restart lanzaweb-backend
systemctl reload nginx

# Check service status
if systemctl is-active --quiet lanzaweb-backend; then
    echo "✅ Backend service is running"
else
    echo "❌ Backend service failed to start"
    journalctl -u lanzaweb-backend -n 20 --no-pager
    exit 1
fi

echo "🎉 Deployment completado exitosamente!"
ENDSSH

# 6. Verificación final
log "🧪 Verificando deployment..."
sleep 5

# Test API
if curl -f -s https://lanzawebar.com/api/health > /dev/null; then
    log "✅ API funcionando correctamente"
else
    warn "⚠️ API no responde. Verifica manualmente"
fi

# Test frontend
if curl -f -s https://lanzawebar.com > /dev/null; then
    log "✅ Frontend funcionando correctamente"
else
    warn "⚠️ Frontend no responde. Verifica manualmente"
fi

echo ""
log "🎊 ¡DEPLOYMENT COMPLETADO!"
echo "=============================================="
echo "🌐 Frontend: https://lanzawebar.com"
echo "🔌 API: https://lanzawebar.com/api"
echo "📊 Logs del backend: ssh $VPS_USER@$VPS_HOST 'journalctl -u lanzaweb-backend -f'"
echo ""
echo "📋 Checklist post-deployment:"
echo "   - [ ] Verificar que la página principal carga"
echo "   - [ ] Probar login/registro"
echo "   - [ ] Probar flujo de pago (con monto pequeño)"
echo "   - [ ] Verificar emails de bienvenida"
echo "   - [ ] Testear creación de hosting"
echo ""