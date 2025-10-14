#!/bin/bash
# Post-creation hook avanzado para WHM - LanzaWeb AR
# Este script se ejecuta automáticamente después de crear una cuenta
# Configuración completa: subdominios, página de bienvenida, SSL, backups

# Variables pasadas por WHM:
USER="$1"
DOMAIN="$2"
PASSWORD="$3"

# Configuración
LOGFILE="/var/log/lanzawebar-post-creation.log"
MAIN_DOMAIN="lanzawebar.com"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$USER] $1" >> $LOGFILE
}

log "=== POST-CREATION HOOK INICIADO ==="
log "Usuario: $USER, Dominio: $DOMAIN"
echo "🚀 Configurando hosting para $USER ($DOMAIN)"

# Variables derivadas
USER_HOME="/home/$USER"
PUBLIC_HTML="$USER_HOME/public_html"

# 1. CONFIGURAR PÁGINA DE BIENVENIDA
log "Configurando página de bienvenida..."
if [ -d "$PUBLIC_HTML" ]; then
    if [ ! -f "$PUBLIC_HTML/index.html" ]; then
        echo "🎨 Creando página de bienvenida personalizada..."
        
        # Crear página de bienvenida avanzada
        cat > $PUBLIC_HTML/index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hosting Activo - LanzaWeb AR</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 700px;
            text-align: center;
            backdrop-filter: blur(10px);
        }
        h1 {
            color: #333;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .status {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .info-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 15px;
            border-left: 4px solid #667eea;
        }
        .info-card h3 {
            color: #334155;
            margin-bottom: 10px;
        }
        .info-card p {
            color: #64748b;
            line-height: 1.6;
        }
        .domain-info {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px dashed #cbd5e1;
        }
        .domain-url {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            color: #1e293b;
            font-weight: bold;
            background: white;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9rem;
        }
        .powered-by {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 2rem; }
            .info-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 ¡Hosting Activo!</h1>
        <div class="status">✅ Configuración Completada</div>
        
        <div class="domain-info">
            <h3>Tu sitio web está disponible en:</h3>
            <div class="domain-url">https://DOMAIN_PLACEHOLDER</div>
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <h3>📊 Panel de Control</h3>
                <p>Accede a tu cPanel para gestionar archivos, emails, bases de datos y más.</p>
            </div>
            <div class="info-card">
                <h3>🔒 SSL Incluido</h3>
                <p>Tu sitio cuenta con certificado SSL gratuito para conexiones seguras.</p>
            </div>
            <div class="info-card">
                <h3>📧 Email Profesional</h3>
                <p>Crea cuentas de email con tu dominio desde el panel de control.</p>
            </div>
            <div class="info-card">
                <h3>🔄 Backups Automáticos</h3>
                <p>Tus archivos se respaldan automáticamente para tu tranquilidad.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Ya puedes comenzar a subir tu contenido web.</p>
            <p>Si necesitas ayuda, contacta nuestro soporte 24/7</p>
            <p class="powered-by">Hosting powered by LanzaWeb AR</p>
        </div>
    </div>
</body>
</html>
EOF
        
        # Reemplazar placeholder con el dominio real
        sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" $PUBLIC_HTML/index.html
        
        # Establecer permisos correctos
        chown $USER:$USER $PUBLIC_HTML/index.html
        chmod 644 $PUBLIC_HTML/index.html
        
        echo "✅ Página de bienvenida creada exitosamente"
        log "Página de bienvenida creada exitosamente"
    else
        echo "📄 index.html ya existe, omitiendo creación"
        log "Index.html ya existe, omitiendo creación"
    fi
    
    # 2. CREAR ESTRUCTURA DE DIRECTORIOS ÚTILES
    echo "📁 Creando estructura de directorios..."
    mkdir -p $USER_HOME/{logs,backups,scripts}
    mkdir -p $PUBLIC_HTML/{assets,images,css,js}
    
    # Crear archivo .htaccess básico
    cat > $PUBLIC_HTML/.htaccess << 'EOF'
# .htaccess generado automáticamente por LanzaWeb AR
# Configuraciones de seguridad y rendimiento

# Redirección forzada a HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Protección de archivos sensibles
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|inc|bak)$">
Order Allow,Deny
Deny from all
</FilesMatch>

# Compresión GZIP
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF
    
    # 3. CONFIGURAR BACKUP AUTOMÁTICO
    echo "🔄 Configurando backup automático..."
    cat > $USER_HOME/scripts/backup.sh << 'EOF'
#!/bin/bash
# Script de backup automático generado por LanzaWeb AR

USER="USER_PLACEHOLDER"
DOMAIN="DOMAIN_PLACEHOLDER"
BACKUP_DIR="/home/$USER/backups"
SOURCE_DIR="/home/$USER/public_html"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Crear backup comprimido
cd /home/$USER
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz public_html/ etc/ 2>/dev/null || {
    echo "Error creando backup" | logger -t "backup-$USER"
    exit 1
}

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete 2>/dev/null

echo "Backup completado: backup_$DATE.tar.gz" | logger -t "backup-$USER"
EOF
    
    # Reemplazar placeholders
    sed -i "s/USER_PLACEHOLDER/$USER/g" $USER_HOME/scripts/backup.sh
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" $USER_HOME/scripts/backup.sh
    
    # Hacer ejecutable
    chmod +x $USER_HOME/scripts/backup.sh
    
    # 4. ESTABLECER PERMISOS CORRECTOS
    echo "🔐 Estableciendo permisos..."
    chown -R $USER:$USER $USER_HOME/{logs,backups,scripts}
    chown -R $USER:$USER $PUBLIC_HTML/{assets,images,css,js}
    chown $USER:$USER $PUBLIC_HTML/.htaccess
    
    chmod 755 $USER_HOME/{logs,backups,scripts}
    chmod 755 $PUBLIC_HTML/{assets,images,css,js}
    chmod 644 $PUBLIC_HTML/.htaccess
    
    # 5. CREAR ARCHIVO DE INFORMACIÓN
    cat > $USER_HOME/HOSTING_INFO.txt << EOF
=== INFORMACIÓN DEL HOSTING ===
Generado automáticamente por LanzaWeb AR

Usuario: $USER
Dominio Principal: $DOMAIN
Directorio Web: $PUBLIC_HTML
URL del Sitio: https://$DOMAIN
cPanel URL: https://blue106.dnsmisitio.net:2083

Fecha de Creación: $(date)

=== CONFIGURACIONES ===
- .htaccess configurado con HTTPS forzado
- Estructura de directorios creada
- Script de backup configurado
- Página de bienvenida instalada

=== SOPORTE ===
Email: soporte@lanzawebar.com
WhatsApp: +54 11 1234-5678
Web: www.lanzawebar.com

Hosting powered by LanzaWeb AR
EOF
    
    chown $USER:$USER $USER_HOME/HOSTING_INFO.txt
    chmod 644 $USER_HOME/HOSTING_INFO.txt
    
    echo "✅ Configuración completa para $USER ($DOMAIN)"
    log "Configuración completada exitosamente para $USER ($DOMAIN)"
    
else
    echo "❌ ERROR: No se encontró el directorio public_html para $USER"
    log "ERROR: No se encontró el directorio public_html para $USER"
fi

log "=== POST-CREATION HOOK COMPLETADO ==="
echo "🏁 Hook completado para $USER"
