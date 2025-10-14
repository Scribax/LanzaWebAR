// Servicio FTP para subir archivos al servidor cPanel
import FTP from 'ftp';

class FTPService {
    constructor() {
        // Configuración del servidor FTP (mismo que cPanel)
        this.serverConfig = {
            host: 'blue106.dnsmisitio.net',
            port: 21,
            secure: false, // true para FTPS
            connTimeout: 30000,
            pasvTimeout: 30000,
            keepalive: 30000
        };
    }

    /**
     * Subir un archivo via FTP a la cuenta de hosting
     */
    async uploadFile(accountCredentials, fileContent, fileName, targetDir = 'public_html') {
        return new Promise((resolve, reject) => {
            const client = new FTP();

            // Configurar eventos
            client.on('error', (err) => {
                console.error('❌ Error de conexión FTP:', err.message);
                resolve({
                    success: false,
                    error: `Error de conexión FTP: ${err.message}`
                });
            });

            client.on('ready', () => {
                console.log('✅ Conexión FTP establecida');

                // Cambiar al directorio destino
                client.cwd(targetDir, (err) => {
                    if (err) {
                        console.error(`❌ Error accediendo a directorio ${targetDir}:`, err.message);
                        client.end();
                        resolve({
                            success: false,
                            error: `No se pudo acceder al directorio ${targetDir}: ${err.message}`
                        });
                        return;
                    }

                    console.log(`📁 Cambiado a directorio: ${targetDir}`);

                    // Crear un buffer del contenido del archivo
                    const fileBuffer = Buffer.from(fileContent, 'utf8');

                    // Subir el archivo
                    client.put(fileBuffer, fileName, (err) => {
                        client.end();

                        if (err) {
                            console.error(`❌ Error subiendo archivo ${fileName}:`, err.message);
                            resolve({
                                success: false,
                                error: `Error subiendo archivo: ${err.message}`
                            });
                        } else {
                            console.log(`✅ Archivo ${fileName} subido exitosamente a ${targetDir}/`);
                            resolve({
                                success: true,
                                message: 'Archivo subido exitosamente',
                                filePath: `${targetDir}/${fileName}`,
                                size: fileBuffer.length
                            });
                        }
                    });
                });
            });

            // Conectar al FTP
            console.log(`🔌 Conectando a FTP: ${accountCredentials.username}@${this.serverConfig.host}`);
            
            client.connect({
                ...this.serverConfig,
                user: accountCredentials.username,
                password: accountCredentials.password
            });

            // Timeout de seguridad
            setTimeout(() => {
                if (client.connected) {
                    client.end();
                }
                resolve({
                    success: false,
                    error: 'Timeout de conexión FTP (30 segundos)'
                });
            }, 30000);
        });
    }

    /**
     * Verificar si un archivo existe en el directorio
     */
    async fileExists(accountCredentials, fileName, targetDir = 'public_html') {
        return new Promise((resolve, reject) => {
            const client = new FTP();

            client.on('error', (err) => {
                resolve({ exists: false, error: err.message });
            });

            client.on('ready', () => {
                client.cwd(targetDir, (err) => {
                    if (err) {
                        client.end();
                        resolve({ exists: false, error: `No se pudo acceder a ${targetDir}` });
                        return;
                    }

                    client.list((err, list) => {
                        client.end();
                        
                        if (err) {
                            resolve({ exists: false, error: 'Error listando archivos' });
                        } else {
                            const fileExists = list.some(file => file.name === fileName);
                            resolve({ exists: fileExists, files: list.length });
                        }
                    });
                });
            });

            client.connect({
                ...this.serverConfig,
                user: accountCredentials.username,
                password: accountCredentials.password
            });
        });
    }

    /**
     * Crear directorio si no existe
     */
    async ensureDirectory(accountCredentials, dirPath) {
        return new Promise((resolve) => {
            const client = new FTP();

            client.on('error', (err) => {
                resolve({ success: false, error: err.message });
            });

            client.on('ready', () => {
                client.mkdir(dirPath, true, (err) => {
                    client.end();
                    
                    if (err && err.code !== 550) { // 550 = directory already exists
                        resolve({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, message: `Directorio ${dirPath} disponible` });
                    }
                });
            });

            client.connect({
                ...this.serverConfig,
                user: accountCredentials.username,
                password: accountCredentials.password
            });
        });
    }

    /**
     * Probar conexión FTP con credenciales
     */
    async testConnection(accountCredentials) {
        return new Promise((resolve) => {
            const client = new FTP();

            client.on('error', (err) => {
                resolve({
                    success: false,
                    error: `Error de conexión: ${err.message}`
                });
            });

            client.on('ready', () => {
                console.log('✅ Conexión FTP de prueba exitosa');
                
                // Listar el directorio raíz para verificar
                client.list((err, list) => {
                    client.end();
                    
                    if (err) {
                        resolve({
                            success: false,
                            error: 'Conexión exitosa pero error listando archivos'
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'Conexión FTP exitosa',
                            filesInRoot: list.length,
                            directories: list.filter(item => item.type === 'd').map(item => item.name)
                        });
                    }
                });
            });

            client.connect({
                ...this.serverConfig,
                user: accountCredentials.username,
                password: accountCredentials.password
            });

            // Timeout
            setTimeout(() => {
                if (client.connected) {
                    client.end();
                }
                resolve({
                    success: false,
                    error: 'Timeout de conexión FTP'
                });
            }, 15000);
        });
    }
}

export default FTPService;