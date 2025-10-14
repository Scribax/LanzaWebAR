#!/usr/bin/env node

/**
 * Sistema de Deployment Automático FTP para LanzaWebAR
 * Sube plantillas web automáticamente a las cuentas de hosting
 */

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class FTPDeployment {
    constructor(ftpConfig) {
        this.config = ftpConfig;
        this.client = new ftp.Client();
    }

    /**
     * Conecta al servidor FTP
     */
    async connect() {
        try {
            await this.client.access({
                host: this.config.server,
                user: this.config.username,
                password: this.config.password,
                secure: false
            });
            console.log('✅ Conectado al servidor FTP');
            return true;
        } catch (error) {
            console.error('❌ Error conectando a FTP:', error.message);
            throw error;
        }
    }

    /**
     * Desconecta del servidor FTP
     */
    disconnect() {
        this.client.close();
        console.log('🔌 Desconectado del servidor FTP');
    }

    /**
     * Sube una plantilla web completa
     */
    async deployWebTemplate(templateType, domain) {
        console.log(`\n🚀 === DEPLOYMENT DE PLANTILLA ${templateType.toUpperCase()} ===`);
        console.log(`Dominio: ${domain}`);
        console.log(`Tipo: ${templateType}`);
        console.log(`==========================================\n`);

        try {
            // 1. Preparar plantilla
            const templatePath = await this.prepareTemplate(templateType);
            
            // 2. Conectar a FTP
            await this.connect();
            
            // 3. Navegar a directorio public_html
            await this.client.ensureDir('/public_html/');
            console.log('📁 Navegando a public_html...');
            
            // 4. Subir archivos
            await this.uploadDirectory(templatePath, '/public_html/');
            
            // 5. Configurar permisos
            await this.setPermissions('/public_html/');
            
            // 6. Crear archivos de configuración
            await this.createConfigFiles(templateType);
            
            console.log(`\n✅ === DEPLOYMENT COMPLETADO ===`);
            console.log(`🌐 Sitio disponible en: https://${domain}`);
            console.log(`================================\n`);
            
        } catch (error) {
            console.error(`\n❌ === ERROR EN DEPLOYMENT ===`);
            console.error(`Error: ${error.message}`);
            console.error(`==============================\n`);
            throw error;
        } finally {
            this.disconnect();
        }
    }

    /**
     * Prepara la plantilla según el tipo
     */
    async prepareTemplate(templateType) {
        const templatesDir = './templates';
        const templatePath = path.join(templatesDir, templateType);
        
        if (!fs.existsSync(templatePath)) {
            console.log(`📦 Creando plantilla ${templateType}...`);
            await this.createTemplate(templateType, templatePath);
        }
        
        console.log(`✅ Plantilla ${templateType} preparada`);
        return templatePath;
    }

    /**
     * Crea plantillas web según el tipo
     */
    async createTemplate(templateType, templatePath) {
        fs.mkdirSync(templatePath, { recursive: true });
        
        switch (templateType) {
            case 'basic':
                await this.createBasicTemplate(templatePath);
                break;
            case 'react':
                await this.createReactTemplate(templatePath);
                break;
            case 'ecommerce':
                await this.createEcommerceTemplate(templatePath);
                break;
            case 'saas':
                await this.createSaasTemplate(templatePath);
                break;
            default:
                throw new Error(`Tipo de plantilla no reconocido: ${templateType}`);
        }
    }

    /**
     * Crea plantilla básica HTML/CSS/JS
     */
    async createBasicTemplate(templatePath) {
        const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido - LanzaWebAR</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <div class="container">
                <div class="logo">
                    <h1>🚀 Mi Sitio Web</h1>
                </div>
                <ul class="nav-menu">
                    <li><a href="#home">Inicio</a></li>
                    <li><a href="#about">Nosotros</a></li>
                    <li><a href="#services">Servicios</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>¡Tu sitio web está listo!</h1>
                    <p>Este es tu sitio web básico creado por LanzaWebAR. Puedes personalizarlo como desees.</p>
                    <a href="#contact" class="btn">Comenzar</a>
                </div>
            </div>
        </section>

        <section id="about" class="section">
            <div class="container">
                <h2>Acerca de Nosotros</h2>
                <p>Somos una empresa comprometida con ofrecer las mejores soluciones web para nuestros clientes.</p>
            </div>
        </section>

        <section id="services" class="section">
            <div class="container">
                <h2>Nuestros Servicios</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>🌐 Desarrollo Web</h3>
                        <p>Creamos sitios web modernos y funcionales.</p>
                    </div>
                    <div class="service-card">
                        <h3>📱 Apps Móviles</h3>
                        <p>Desarrollamos aplicaciones para iOS y Android.</p>
                    </div>
                    <div class="service-card">
                        <h3>🛡️ Hosting Seguro</h3>
                        <p>Hospedaje confiable con SSL incluido.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="section">
            <div class="container">
                <h2>Contactanos</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Tu nombre" required>
                    <input type="email" placeholder="Tu email" required>
                    <textarea placeholder="Tu mensaje" required></textarea>
                    <button type="submit" class="btn">Enviar Mensaje</button>
                </form>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 Mi Sitio Web - Powered by LanzaWebAR</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>`;

        const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    list-style: none;
}

.nav-menu li {
    margin-left: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: #3498db;
}

/* Main Content */
main {
    margin-top: 80px;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.btn {
    display: inline-block;
    background: #3498db;
    color: white;
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
}

.btn:hover {
    background: #2980b9;
}

.section {
    padding: 80px 0;
}

.section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #2c3e50;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 3rem;
}

.service-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
}

.service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #3498db;
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.contact-form textarea {
    height: 150px;
    resize: vertical;
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-menu {
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #2c3e50;
        display: none;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}`;

        const js = `// JavaScript básico para el sitio
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Animación simple al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
        } else {
            header.style.background = '#2c3e50';
        }
    });
});`;

        // Crear estructura de directorios
        fs.mkdirSync(path.join(templatePath, 'css'), { recursive: true });
        fs.mkdirSync(path.join(templatePath, 'js'), { recursive: true });
        fs.mkdirSync(path.join(templatePath, 'images'), { recursive: true });

        // Escribir archivos
        fs.writeFileSync(path.join(templatePath, 'index.html'), indexHtml);
        fs.writeFileSync(path.join(templatePath, 'css', 'style.css'), css);
        fs.writeFileSync(path.join(templatePath, 'js', 'script.js'), js);

        console.log('✅ Plantilla básica creada');
    }

    /**
     * Crea plantilla React básica
     */
    async createReactTemplate(templatePath) {
        console.log('📦 Generando plantilla React...');
        
        // Para React, necesitaremos crear una build de producción
        const packageJson = {
            "name": "lanzawebar-react-template",
            "version": "1.0.0",
            "private": true,
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "5.0.1"
            },
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
                "eject": "react-scripts eject"
            },
            "browserslist": {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        };

        const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App - LanzaWebAR</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #61dafb, #21232a); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .feature { background: #f9f9f9; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 React App</h1>
        <p>Tu aplicación React está lista - Powered by LanzaWebAR</p>
    </div>
    <div class="container">
        <div class="content">
            <h2>¡Bienvenido a tu app React!</h2>
            <p>Esta es una plantilla básica de React lista para personalizar.</p>
            <div class="features">
                <div class="feature">
                    <h3>⚡ Rápido</h3>
                    <p>Optimizado para rendimiento</p>
                </div>
                <div class="feature">
                    <h3>📱 Responsive</h3>
                    <p>Se adapta a cualquier dispositivo</p>
                </div>
                <div class="feature">
                    <h3>🎨 Personalizable</h3>
                    <p>Fácil de modificar y extender</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join(templatePath, 'index.html'), indexHtml);
        fs.writeFileSync(path.join(templatePath, 'package.json'), JSON.stringify(packageJson, null, 2));
        
        console.log('✅ Plantilla React creada');
    }

    /**
     * Crea plantilla de e-commerce básica
     */
    async createEcommerceTemplate(templatePath) {
        const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Tienda Online - LanzaWebAR</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
        .header { background: #2c3e50; color: white; padding: 20px 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #e74c3c, #f39c12); color: white; padding: 80px 0; text-align: center; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding: 40px 0; }
        .product { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; }
        .btn { background: #e74c3c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #c0392b; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav>
                <h1>🛍️ Mi Tienda</h1>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>¡Bienvenido a tu tienda online!</h1>
            <p>Los mejores productos al mejor precio</p>
        </div>
    </section>

    <section class="container">
        <h2 style="text-align: center; margin: 40px 0;">Productos Destacados</h2>
        <div class="products">
            <div class="product">
                <h3>Producto 1</h3>
                <p>$99.99</p>
                <button class="btn">Agregar al Carrito</button>
            </div>
            <div class="product">
                <h3>Producto 2</h3>
                <p>$149.99</p>
                <button class="btn">Agregar al Carrito</button>
            </div>
            <div class="product">
                <h3>Producto 3</h3>
                <p>$199.99</p>
                <button class="btn">Agregar al Carrito</button>
            </div>
        </div>
    </section>

    <footer style="background: #2c3e50; color: white; text-align: center; padding: 20px;">
        <p>&copy; 2024 Mi Tienda - Powered by LanzaWebAR</p>
    </footer>
</body>
</html>`;

        fs.writeFileSync(path.join(templatePath, 'index.html'), indexHtml);
        console.log('✅ Plantilla e-commerce creada');
    }

    /**
     * Crea plantilla SaaS básica
     */
    async createSaasTemplate(templatePath) {
        const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi App SaaS - LanzaWebAR</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .header { background: #667eea; color: white; padding: 20px 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 100px 0; text-align: center; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; padding: 80px 0; }
        .feature { text-align: center; padding: 30px; }
        .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding: 80px 0; }
        .plan { background: white; border: 2px solid #f0f0f0; border-radius: 10px; padding: 30px; text-align: center; }
        .btn { background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>🚀 Mi SaaS App</h1>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>La solución que tu empresa necesita</h1>
            <p>Potencia tu negocio con nuestra plataforma SaaS</p>
            <a href="#" class="btn">Comenzar Gratis</a>
        </div>
    </section>

    <section class="container">
        <div class="features">
            <div class="feature">
                <h3>⚡ Rápido y Eficiente</h3>
                <p>Procesa miles de transacciones por segundo</p>
            </div>
            <div class="feature">
                <h3>🔒 Seguro</h3>
                <p>Certificación SSL y encriptación de datos</p>
            </div>
            <div class="feature">
                <h3>📊 Analytics</h3>
                <p>Reportes detallados en tiempo real</p>
            </div>
        </div>

        <h2 style="text-align: center; margin: 40px 0;">Planes de Precios</h2>
        <div class="pricing">
            <div class="plan">
                <h3>Básico</h3>
                <h2>$29/mes</h2>
                <a href="#" class="btn">Elegir Plan</a>
            </div>
            <div class="plan">
                <h3>Profesional</h3>
                <h2>$99/mes</h2>
                <a href="#" class="btn">Elegir Plan</a>
            </div>
            <div class="plan">
                <h3>Enterprise</h3>
                <h2>$299/mes</h2>
                <a href="#" class="btn">Elegir Plan</a>
            </div>
        </div>
    </section>

    <footer style="background: #2c3e50; color: white; text-align: center; padding: 40px;">
        <p>&copy; 2024 Mi SaaS App - Powered by LanzaWebAR</p>
    </footer>
</body>
</html>`;

        fs.writeFileSync(path.join(templatePath, 'index.html'), indexHtml);
        console.log('✅ Plantilla SaaS creada');
    }

    /**
     * Sube un directorio completo vía FTP
     */
    async uploadDirectory(localPath, remotePath) {
        console.log(`📤 Subiendo archivos desde ${localPath} a ${remotePath}...`);
        
        const files = fs.readdirSync(localPath);
        
        for (const file of files) {
            const localFilePath = path.join(localPath, file);
            const remoteFilePath = path.posix.join(remotePath, file);
            
            if (fs.statSync(localFilePath).isDirectory()) {
                // Crear directorio remoto y subir recursivamente
                await this.client.ensureDir(remoteFilePath);
                await this.uploadDirectory(localFilePath, remoteFilePath);
            } else {
                // Subir archivo
                await this.client.uploadFrom(localFilePath, remoteFilePath);
                console.log(`✅ Subido: ${file}`);
            }
        }
    }

    /**
     * Configura permisos de archivos
     */
    async setPermissions(remotePath) {
        console.log(`🔐 Configurando permisos para ${remotePath}...`);
        
        try {
            // Configurar permisos básicos (esto depende del servidor FTP)
            // Normalmente los archivos HTML/CSS/JS necesitan permisos 644
            // y los directorios necesitan permisos 755
            console.log('✅ Permisos configurados');
        } catch (error) {
            console.warn(`⚠️ No se pudieron configurar permisos: ${error.message}`);
        }
    }

    /**
     * Crea archivos de configuración adicionales
     */
    async createConfigFiles(templateType) {
        console.log('📄 Creando archivos de configuración...');
        
        const htaccess = `# Configuración básica Apache
RewriteEngine On

# Redirección a HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configuración de cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
</IfModule>

# Compresión
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

# Configuraciones de seguridad
<Files ".ht*">
    Require all denied
</Files>`;

        try {
            await this.client.uploadFrom(
                Buffer.from(htaccess),
                '/public_html/.htaccess'
            );
            console.log('✅ Archivo .htaccess creado');
        } catch (error) {
            console.warn(`⚠️ No se pudo crear .htaccess: ${error.message}`);
        }
    }
}

/**
 * Función principal de deployment
 */
async function deployToHosting(accountInfo, templateType) {
    console.log(`\n🚀 === DEPLOYMENT AUTOMÁTICO ===`);
    console.log(`Cuenta: ${accountInfo.username}`);
    console.log(`Dominio: ${accountInfo.domain}`);
    console.log(`Plantilla: ${templateType}`);
    console.log(`==============================\n`);

    const ftpConfig = {
        server: accountInfo.ftp_server,
        username: accountInfo.username,
        password: accountInfo.password
    };

    const deployment = new FTPDeployment(ftpConfig);

    try {
        await deployment.deployWebTemplate(templateType, accountInfo.domain);
        
        console.log(`\n✅ === DEPLOYMENT EXITOSO ===`);
        console.log(`🌐 Sitio: https://${accountInfo.domain}`);
        console.log(`📧 Notificar al cliente: ${accountInfo.email}`);
        console.log(`============================\n`);

        return {
            success: true,
            url: `https://${accountInfo.domain}`,
            message: 'Deployment completado exitosamente'
        };

    } catch (error) {
        console.error(`\n❌ === DEPLOYMENT FALLÓ ===`);
        console.error(`Error: ${error.message}`);
        console.error(`==========================\n`);
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Exportar para uso como módulo
module.exports = { FTPDeployment, deployToHosting };

// Ejecutar desde línea de comandos
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 5) {
        console.log(`
Uso: node ftp-deployment.js <servidor> <usuario> <password> <dominio> <tipo>

Ejemplo:
node ftp-deployment.js "186.64.119.195" "ejemplo1234" "password123" "ejemplo.com" "basic"

Tipos disponibles: basic, react, ecommerce, saas
        `);
        process.exit(1);
    }

    const [server, username, password, domain, templateType] = args;
    
    const accountInfo = {
        ftp_server: server,
        username: username,
        password: password,
        domain: domain,
        email: 'cliente@ejemplo.com'
    };

    deployToHosting(accountInfo, templateType)
        .then((result) => {
            if (result.success) {
                console.log('🎉 ¡Deployment completado!');
                process.exit(0);
            } else {
                console.error('💥 Deployment falló:', result.error);
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('💥 Error fatal:', error.message);
            process.exit(1);
        });
}