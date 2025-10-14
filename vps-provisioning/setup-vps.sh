#!/bin/bash

# ========================================
# VPS AUTO-PROVISIONING SCRIPT
# Franco's VPS-as-a-Service
# ========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLIENT_NAME=""
DOMAIN=""
PROJECT_TYPE="basic"  # basic, react, ecommerce, saas
ADMIN_EMAIL=""
PANEL_PASSWORD=""

# Function to print colored output
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Parse command line arguments
parse_args() {
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
            --password)
                PANEL_PASSWORD="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
}

show_help() {
    echo "VPS Auto-Provisioning Script"
    echo ""
    echo "Usage: $0 --client <name> --domain <domain> --type <type> --email <email> --password <password>"
    echo ""
    echo "Options:"
    echo "  --client      Client name (required)"
    echo "  --domain      Domain name (required)"
    echo "  --type        Project type: basic|react|ecommerce|saas (default: basic)"
    echo "  --email       Admin email (required)"
    echo "  --password    Panel password (required)"
    echo ""
    echo "Example:"
    echo "  $0 --client 'Juan Perez' --domain juanperez.com --type react --email admin@juanperez.com --password secure123"
}

# Validate required arguments
validate_args() {
    if [[ -z "$CLIENT_NAME" || -z "$DOMAIN" || -z "$ADMIN_EMAIL" || -z "$PANEL_PASSWORD" ]]; then
        error "Missing required arguments. Use --help for usage information."
    fi
    
    if [[ ! "$PROJECT_TYPE" =~ ^(basic|react|ecommerce|saas)$ ]]; then
        error "Invalid project type. Must be: basic, react, ecommerce, or saas"
    fi
    
    log "Configuration validated successfully"
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    if command -v yum &> /dev/null; then
        # AlmaLinux/RHEL/CentOS
        yum update -y
        yum install -y curl wget git unzip nano htop
    elif command -v apt &> /dev/null; then
        # Ubuntu/Debian
        apt update -y
        apt upgrade -y
        apt install -y curl wget git unzip nano htop software-properties-common
    else
        error "Unsupported operating system"
    fi
    
    log "System packages updated"
}

# Install Node.js and npm
install_nodejs() {
    log "Installing Node.js 20..."
    
    # Install Node.js 20 using NodeSource repository
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    
    if command -v yum &> /dev/null; then
        yum install -y nodejs
    else
        apt install -y nodejs
    fi
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    
    log "Node.js installed: $node_version"
    log "npm installed: $npm_version"
}

# Install and configure Nginx
install_nginx() {
    log "Installing and configuring Nginx..."
    
    if command -v yum &> /dev/null; then
        yum install -y nginx
    else
        apt install -y nginx
    fi
    
    # Start and enable Nginx
    systemctl start nginx
    systemctl enable nginx
    
    # Create SSL directory
    mkdir -p /etc/nginx/ssl
    
    log "Nginx installed and configured"
}

# Install SSL certificate (Let's Encrypt)
install_ssl() {
    log "Installing SSL certificate for $DOMAIN..."
    
    # Install certbot
    if command -v yum &> /dev/null; then
        yum install -y certbot python3-certbot-nginx
    else
        apt install -y certbot python3-certbot-nginx
    fi
    
    # Get certificate (this will modify nginx config automatically)
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$ADMIN_EMAIL"
    
    # Set up auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
    log "SSL certificate installed for $DOMAIN"
}

# Create project directory structure
create_project_structure() {
    log "Creating project directory structure..."
    
    PROJECT_DIR="/var/www/$DOMAIN"
    
    # Create directories
    mkdir -p "$PROJECT_DIR"/{html,logs,backups,config}
    mkdir -p "/home/$CLIENT_NAME"
    
    # Set permissions
    chown -R nginx:nginx "$PROJECT_DIR"
    chmod -R 755 "$PROJECT_DIR"
    
    log "Project structure created at $PROJECT_DIR"
}

# Install project template based on type
install_project_template() {
    log "Installing $PROJECT_TYPE template..."
    
    PROJECT_DIR="/var/www/$DOMAIN"
    
    case $PROJECT_TYPE in
        "basic")
            install_basic_template
            ;;
        "react")
            install_react_template
            ;;
        "ecommerce")
            install_ecommerce_template
            ;;
        "saas")
            install_saas_template
            ;;
    esac
    
    log "$PROJECT_TYPE template installed"
}

# Install basic HTML template
install_basic_template() {
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
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 800px;
            padding: 40px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        .subtitle { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .status { 
            background: #22c55e; 
            padding: 10px 20px; 
            border-radius: 25px; 
            display: inline-block; 
            margin: 20px 0;
            font-weight: bold;
        }
        .info { margin: 20px 0; font-size: 0.9rem; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Sitio Web Activo!</h1>
        <p class="subtitle">Bienvenido $CLIENT_NAME</p>
        <div class="status">✅ VPS Configurado Correctamente</div>
        <div class="info">
            <p><strong>Dominio:</strong> $DOMAIN</p>
            <p><strong>SSL:</strong> Activado 🔒</p>
            <p><strong>Estado:</strong> Listo para desarrollo</p>
        </div>
        <p><em>Tu sitio web está listo. Puedes comenzar a subir tu contenido.</em></p>
    </div>
</body>
</html>
EOF
}

# Install React template
install_react_template() {
    cd "$PROJECT_DIR"
    
    # Create a simple React app structure
    cat > "$PROJECT_DIR/html/index.html" <<EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$CLIENT_NAME - React App</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        #root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .app { text-align: center; color: white; max-width: 600px; padding: 40px; }
        .logo { font-size: 4rem; margin-bottom: 20px; }
        h1 { margin-bottom: 10px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
        .feature { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const App = () => {
            return (
                <div className="app">
                    <div className="logo">⚛️</div>
                    <h1>React App Lista</h1>
                    <p>Hola $CLIENT_NAME, tu aplicación React está configurada</p>
                    <div className="features">
                        <div className="feature">
                            <h3>🚀 Rápido</h3>
                            <p>Optimizado para rendimiento</p>
                        </div>
                        <div className="feature">
                            <h3>🔒 Seguro</h3>
                            <p>SSL configurado</p>
                        </div>
                        <div className="feature">
                            <h3>📱 Responsive</h3>
                            <p>Compatible con móviles</p>
                        </div>
                    </div>
                </div>
            );
        };
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
EOF
}

# Install e-commerce template
install_ecommerce_template() {
    install_basic_template
    # TODO: Add specific e-commerce template
    log "E-commerce template placeholder installed"
}

# Install SaaS template  
install_saas_template() {
    install_basic_template
    # TODO: Add specific SaaS template
    log "SaaS template placeholder installed"
}

# Configure Nginx virtual host
configure_nginx() {
    log "Configuring Nginx for $DOMAIN..."
    
    cat > "/etc/nginx/sites-available/$DOMAIN" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

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
    index index.html index.php;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Main location
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # PHP support (if needed)
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm/www.sock;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Access and error logs
    access_log /var/www/$DOMAIN/logs/access.log;
    error_log /var/www/$DOMAIN/logs/error.log;
}
EOF

    # Create sites-available and sites-enabled directories if they don't exist (for AlmaLinux)
    mkdir -p /etc/nginx/sites-available
    mkdir -p /etc/nginx/sites-enabled
    
    # Add include directive to nginx.conf if not present
    if ! grep -q "sites-enabled" /etc/nginx/nginx.conf; then
        sed -i '/include \/etc\/nginx\/conf.d/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf
    fi
    
    # Enable site
    ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
    
    # Test nginx configuration
    nginx -t || error "Nginx configuration test failed"
    
    # Reload nginx
    systemctl reload nginx
    
    log "Nginx configured for $DOMAIN"
}

# Install control panel
install_control_panel() {
    log "Installing control panel..."
    
    PANEL_DIR="/var/www/panel-$CLIENT_NAME"
    mkdir -p "$PANEL_DIR/html"
    
    # Create simple control panel
    cat > "$PANEL_DIR/html/index.html" <<EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control - $CLIENT_NAME</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; }
        .header { background: #2c3e50; color: white; padding: 20px 0; text-align: center; }
        .container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px; }
        .card h3 { color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .status-good { color: #27ae60; }
        .status-warning { color: #f39c12; }
        .btn { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn:hover { background: #2980b9; }
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-server"></i> Panel de Control VPS</h1>
        <p>$CLIENT_NAME - $DOMAIN</p>
    </div>
    
    <div class="container">
        <div class="grid">
            <div class="card">
                <h3><i class="fas fa-check-circle status-good"></i> Estado del Servidor</h3>
                <p><strong>Estado:</strong> <span class="status-good">Activo</span></p>
                <p><strong>Dominio:</strong> $DOMAIN</p>
                <p><strong>SSL:</strong> <span class="status-good">Configurado</span></p>
                <p><strong>Tipo:</strong> $PROJECT_TYPE</p>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-globe"></i> Accesos</h3>
                <p><strong>Sitio Web:</strong> <a href="https://$DOMAIN" target="_blank">https://$DOMAIN</a></p>
                <p><strong>Admin Email:</strong> $ADMIN_EMAIL</p>
                <p><strong>Configurado:</strong> $(date)</p>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-tools"></i> Herramientas</h3>
                <p>✅ Nginx configurado</p>
                <p>✅ SSL Let's Encrypt activo</p>
                <p>✅ Node.js 20 instalado</p>
                <p>✅ Backups automáticos</p>
            </div>
            
            <div class="card">
                <h3><i class="fas fa-life-ring"></i> Soporte</h3>
                <p>¿Necesitás ayuda con tu VPS?</p>
                <a href="https://wa.me/5491156177616" class="btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> Contactar Soporte
                </a>
            </div>
        </div>
    </div>
</body>
</html>
EOF

    # Set permissions
    chown -R nginx:nginx "$PANEL_DIR"
    
    log "Control panel installed at $PANEL_DIR"
}

# Create backup script
create_backup_script() {
    log "Creating backup script..."
    
    cat > "/home/$CLIENT_NAME/backup.sh" <<EOF
#!/bin/bash
# Backup script for $CLIENT_NAME - $DOMAIN

DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/$DOMAIN/backups"
PROJECT_DIR="/var/www/$DOMAIN/html"

# Create backup
tar -czf "\$BACKUP_DIR/backup_\$DATE.tar.gz" -C "\$PROJECT_DIR" .

# Keep only last 7 backups
find "\$BACKUP_DIR" -name "backup_*.tar.gz" -type f -mtime +7 -delete

echo "Backup completed: backup_\$DATE.tar.gz"
EOF

    chmod +x "/home/$CLIENT_NAME/backup.sh"
    
    # Add to crontab - daily backup at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * /home/$CLIENT_NAME/backup.sh") | crontab -
    
    log "Backup script created and scheduled"
}

# Generate client documentation
generate_documentation() {
    log "Generating client documentation..."
    
    cat > "/home/$CLIENT_NAME/README.md" <<EOF
# VPS Setup Complete - $CLIENT_NAME

## 📋 Información del Servidor

- **Cliente:** $CLIENT_NAME
- **Dominio:** $DOMAIN
- **Tipo de Proyecto:** $PROJECT_TYPE
- **Email Administrativo:** $ADMIN_EMAIL
- **Fecha de Configuración:** $(date)

## 🌐 Accesos

- **Sitio Web:** https://$DOMAIN
- **Panel de Control:** /var/www/panel-$CLIENT_NAME/html/index.html

## 🔧 Servicios Instalados

- ✅ **Nginx** - Servidor web optimizado
- ✅ **SSL/TLS** - Let's Encrypt configurado
- ✅ **Node.js 20** - Runtime JavaScript
- ✅ **Backups automáticos** - Diarios a las 2 AM
- ✅ **Monitoreo básico** - Logs en /var/www/$DOMAIN/logs/

## 📁 Estructura de Directorios

\`\`\`
/var/www/$DOMAIN/
├── html/           # Tu sitio web
├── logs/           # Logs de acceso y errores
├── backups/        # Backups automáticos
└── config/         # Configuraciones

/home/$CLIENT_NAME/
├── backup.sh       # Script de backup manual
└── README.md       # Esta documentación
\`\`\`

## 🚀 Próximos Pasos

1. **Sube tu contenido** a \`/var/www/$DOMAIN/html/\`
2. **Personaliza tu sitio** según tus necesidades
3. **Revisa los logs** regularmente en \`/var/www/$DOMAIN/logs/\`
4. **Los backups** se hacen automáticamente cada día

## 📞 Soporte

¿Necesitás ayuda? Contactá a Franco:
- **WhatsApp:** +54 9 11 5617-7616
- **Email:** Francodemartos2025@gmail.com

---
*VPS configurado automáticamente por Franco's VPS-as-a-Service*
EOF

    log "Client documentation generated"
}

# Main execution function
main() {
    log "Starting VPS provisioning for $CLIENT_NAME..."
    
    # Pre-flight checks
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
    fi
    
    # Execute provisioning steps
    update_system
    install_nodejs
    install_nginx
    create_project_structure
    configure_nginx
    install_project_template
    install_ssl  # This must be after nginx configuration
    install_control_panel
    create_backup_script
    generate_documentation
    
    # Final message
    log "✅ VPS provisioning completed successfully!"
    info "🌐 Website: https://$DOMAIN"
    info "📧 Admin Email: $ADMIN_EMAIL"
    info "📁 Project Directory: /var/www/$DOMAIN"
    info "📋 Documentation: /home/$CLIENT_NAME/README.md"
    
    warn "⚠️  Please save these details and share them with the client."
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    parse_args "$@"
    validate_args
    main
fi