// Servicio para gestionar la welcome page personalizada
import fs from 'fs/promises';
import path from 'path';
import FTPService from './ftpService.js';

class WelcomePageService {
    constructor() {
        this.templatePath = path.join(process.cwd(), 'server', 'welcome-template.html');
        this.ftpService = new FTPService();
    }

    /**
     * Generar welcome page personalizada para una nueva cuenta
     */
    async generateWelcomePage(accountDetails, planName) {
        try {
            console.log('📝 Generando welcome page personalizada...');

            // Leer el template
            const templateContent = await fs.readFile(this.templatePath, 'utf-8');

            // Datos para personalización
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Determinar información SSL
            const hasSSL = accountDetails.hasSSL || false;
            const sslStatus = hasSSL ? 'Certificado activo ✅' : 'Activando certificado...';
            const sslInfo = hasSSL ? '🔒 HTTPS Habilitado' : '🔓 Configurando SSL...';
            const sslColor = hasSSL ? '#16a34a' : '#f59e0b';
            const siteUrl = `${hasSSL ? 'https' : 'http'}://${accountDetails.domain}`;

            // Reemplazar placeholders con datos reales
            const personalizedContent = templateContent
                .replace(/\{\{DOMAIN\}\}/g, accountDetails.domain)
                .replace(/\{\{USERNAME\}\}/g, accountDetails.username)
                .replace(/\{\{PLAN_NAME\}\}/g, planName)
                .replace(/\{\{CPANEL_URL\}\}/g, accountDetails.cpanelUrl)
                .replace(/\{\{SERVER_IP\}\}/g, '186.64.119.195') // IP del servidor
                .replace(/\{\{DATE\}\}/g, currentDate)
                .replace(/\{\{SSL_STATUS\}\}/g, sslStatus)
                .replace(/\{\{SSL_INFO\}\}/g, sslInfo)
                .replace(/\{\{SSL_COLOR\}\}/g, sslColor)
                .replace(/\{\{SITE_URL\}\}/g, siteUrl);

            console.log('✅ Welcome page personalizada generada');

            return {
                success: true,
                content: personalizedContent,
                filename: 'index.html'
            };

        } catch (error) {
            console.error('❌ Error generando welcome page:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

    /**
     * Subir welcome page al servidor via FTP
     */
    async uploadWelcomePageToCPanel(accountDetails, welcomePageContent) {
        try {
            console.log('📤 Subiendo welcome page via FTP...');

            // Primero probar la conexión FTP
            console.log('🔍 Probando conexión FTP...');
            const connectionTest = await this.ftpService.testConnection({
                username: accountDetails.username,
                password: accountDetails.password
            });

            if (!connectionTest.success) {
                throw new Error(`Error de conexión FTP: ${connectionTest.error}`);
            }

            console.log('✅ Conexión FTP exitosa');
            console.log(`📁 Directorios disponibles: ${connectionTest.directories.join(', ')}`);

            // Subir el archivo index.html
            const uploadResult = await this.ftpService.uploadFile(
                {
                    username: accountDetails.username,
                    password: accountDetails.password
                },
                welcomePageContent,
                'index.html',
                'public_html'
            );

            if (uploadResult.success) {
                console.log('✅ Welcome page subida exitosamente via FTP!');
                console.log(`📄 Archivo: ${uploadResult.filePath}`);
                console.log(`📊 Tamaño: ${Math.round(uploadResult.size / 1024)} KB`);
                
                return {
                    success: true,
                    message: 'Welcome page instalada correctamente via FTP',
                    url: `https://${accountDetails.domain}`,
                    filePath: uploadResult.filePath,
                    uploadMethod: 'FTP'
                };
            } else {
                throw new Error(uploadResult.error);
            }

        } catch (error) {
            console.error('❌ Error subiendo welcome page:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de subida FTP'
            };
        }
    }


    /**
     * Proceso completo: generar y subir welcome page
     */
    async deployWelcomePageForAccount(accountDetails, planName) {
        try {
            console.log('🎯 Iniciando despliegue de welcome page...');

            // 1. Generar welcome page personalizada
            const generateResult = await this.generateWelcomePage(accountDetails, planName);
            if (!generateResult.success) {
                return {
                    success: false,
                    error: `Error generando página: ${generateResult.error}`
                };
            }

            // 2. Subir al servidor
            const uploadResult = await this.uploadWelcomePageToCPanel(
                accountDetails, 
                generateResult.content
            );

            if (uploadResult.success) {
                console.log('🎉 Welcome page desplegada exitosamente!');
                return {
                    success: true,
                    message: 'Welcome page instalada y funcionando',
                    url: uploadResult.url,
                    details: {
                        filename: generateResult.filename,
                        domain: accountDetails.domain,
                        uploadPath: 'public_html/index.html'
                    }
                };
            } else {
                return {
                    success: false,
                    error: `Error subiendo página: ${uploadResult.error}`
                };
            }

        } catch (error) {
            console.error('❌ Error en despliegue de welcome page:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de despliegue'
            };
        }
    }

    /**
     * Crear welcome page para pruebas locales
     */
    async createLocalWelcomePageForTesting(accountDetails, planName, outputPath) {
        try {
            const generateResult = await this.generateWelcomePage(accountDetails, planName);
            
            if (generateResult.success) {
                await fs.writeFile(outputPath, generateResult.content, 'utf-8');
                console.log(`✅ Welcome page de prueba creada en: ${outputPath}`);
                return { success: true, path: outputPath };
            } else {
                return generateResult;
            }

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error creando archivo local'
            };
        }
    }
}

export default WelcomePageService;