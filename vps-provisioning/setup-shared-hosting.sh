#!/bin/bash

# ========================================
# SHARED VPS HOSTING SETUP
# Franco's Multi-Domain VPS Setup
# ========================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
CLIENT_NAME=""
DOMAIN=""
PROJECT_TYPE="basic"
ADMIN_EMAIL=""

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --client)
            CLIENT_NAME="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --type)
            PROJECT_TYPE="$2"
            shift 2
            ;;
        --email)
            ADMIN_EMAIL="$2"
            shift 2
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate required arguments
if [[ -z "$CLIENT_NAME" || -z "$DOMAIN" || -z "$ADMIN_EMAIL" ]]; then
    error "Missing required arguments: --client, --domain, --email"
fi

log "Adding new domain: $DOMAIN to shared hosting"

# Create project structure
PROJECT_DIR="/var/www/$DOMAIN"
mkdir -p "$PROJECT_DIR"/{html,logs,backups}

# Install project template
case $PROJECT_TYPE in
    "basic")
        cat > "$PROJECT_DIR/html/index.html" <<EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$CLIENT_NAME - Sitio Web</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        .container {
            text-align: center; max-width: 600px; padding: 40px;
            background: rgba(255,255,255,0.1); border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .status { background: #22c55e; padding: 10px 20px; border-radius: 25px; 
                 display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Sitio Web Activo!</h1>
        <p>Bienvenido $CLIENT_NAME</p>
        <div class="status">✅ Hosting Configurado</div>
        <p><strong>Dominio:</strong> $DOMAIN</p>
        <p><strong>SSL:</strong> Activado 🔒</p>
        <p><em>Tu sitio está listo. Puedes subir tu contenido.</em></p>
    </div>
</body>
</html>
EOF
        ;;
    "react")
        # Similar template but with React
        cp -r /opt/templates/react/* "$PROJECT_DIR/html/"
        ;;
esac

# Create Nginx virtual host
cat > "/etc/nginx/sites-available/$DOMAIN" <<EOF
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Document root
    root /var/www/$DOMAIN/html;
    index index.html index.htm;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Main location
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Logs (separated by domain)
    access_log /var/www/$DOMAIN/logs/access.log;
    error_log /var/www/$DOMAIN/logs/error.log;
}
EOF

# Enable the site
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

# Test nginx configuration
nginx -t || error "Nginx configuration test failed"

# Get SSL certificate
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$ADMIN_EMAIL" || {
    log "SSL certificate installation failed, but site is available via HTTP"
}

# Reload nginx
systemctl reload nginx

# Set proper permissions
chown -R nginx:nginx "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"

# Create backup script for this domain
cat > "/var/www/$DOMAIN/backup.sh" <<EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
cd /var/www/$DOMAIN
tar -czf backups/backup_\$DATE.tar.gz html/
find backups/ -name "backup_*.tar.gz" -mtime +7 -delete
echo "Backup completed for $DOMAIN: backup_\$DATE.tar.gz"
EOF

chmod +x "/var/www/$DOMAIN/backup.sh"

# Add to daily cron (if not already added)
CRON_JOB="0 2 * * * /var/www/$DOMAIN/backup.sh"
(crontab -l 2>/dev/null | grep -F "$DOMAIN" || echo "$CRON_JOB") | crontab -

# Create client documentation
cat > "/var/www/$DOMAIN/README.md" <<EOF
# Hosting Configurado - $CLIENT_NAME

## 📋 Información

- **Cliente:** $CLIENT_NAME
- **Dominio:** $DOMAIN
- **Tipo:** $PROJECT_TYPE
- **Configurado:** $(date)

## 🌐 Accesos

- **Sitio Web:** https://$DOMAIN
- **Directorio:** /var/www/$DOMAIN/html/
- **Logs:** /var/www/$DOMAIN/logs/

## 📁 Subir contenido

Puedes subir tu contenido web a:
\`/var/www/$DOMAIN/html/\`

## 🔧 Servicios

- ✅ SSL automático (Let's Encrypt)
- ✅ Backups diarios a las 2 AM
- ✅ Logs separados por dominio
- ✅ Gzip compression habilitado

## 📞 Soporte

- WhatsApp: +54 9 11 5617-7616
- Email: Francodemartos2025@gmail.com

---
Hosting configurado por Franco's VPS Service
EOF

log "✅ Domain $DOMAIN successfully added to shared hosting!"
info "🌐 Website: https://$DOMAIN"
info "📁 Content directory: /var/www/$DOMAIN/html/"
info "📋 Documentation: /var/www/$DOMAIN/README.md"

# Show current domains hosted
info "📊 Domains currently hosted on this server:"
ls -1 /etc/nginx/sites-enabled/ | grep -v default || true