class EmailService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'https://lanzawebar.com';
    }
    // Template de email de bienvenida con credenciales
    generateWelcomeEmail(credentials) {
        const { username, password, domain, cpanelUrl, email, planName, clientName } = credentials;
        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .credentials-box { background: white; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .credential-item { margin: 15px 0; padding: 10px; background: #f1f3f4; border-radius: 4px; }
            .credential-label { font-weight: bold; color: #333; }
            .credential-value { font-family: monospace; background: #e9ecef; padding: 5px 8px; border-radius: 3px; margin-top: 5px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ¡Bienvenido a LanzaWeb AR!</h1>
                <p>Tu cuenta de hosting ya está lista</p>
            </div>
            
            <div class="content">
                <p>Hola <strong>${clientName}</strong>,</p>
                
                <p>¡Excelente noticia! Tu cuenta de hosting <strong>${planName}</strong> ha sido creada exitosamente. Aquí tienes todos los datos que necesitas para comenzar:</p>
                
                <div class="credentials-box">
                    <h3>🔑 Credenciales de Acceso</h3>
                    
                    <div class="credential-item">
                        <div class="credential-label">🌐 Tu sitio web:</div>
                        <div class="credential-value">https://${domain}</div>
                    </div>
                    
                    <div class="credential-item">
                        <div class="credential-label">👤 Usuario cPanel:</div>
                        <div class="credential-value">${username}</div>
                    </div>
                    
                    <div class="credential-item">
                        <div class="credential-label">🔒 Contraseña:</div>
                        <div class="credential-value">${password}</div>
                    </div>
                    
                    <div class="credential-item">
                        <div class="credential-label">🖥️ Panel de Control:</div>
                        <div class="credential-value">${cpanelUrl}</div>
                    </div>
                    
                    <div class="credential-item">
                        <div class="credential-label">📧 Email de contacto:</div>
                        <div class="credential-value">${email}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${cpanelUrl}" class="button">🚀 Acceder a tu Panel de Control</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Importante:</strong>
                    <ul>
                        <li>Guarda estas credenciales en un lugar seguro</li>
                        <li>Te recomendamos cambiar la contraseña desde el panel de control</li>
                        <li>Tu sitio puede tardar hasta 24 horas en propagarse completamente</li>
                    </ul>
                </div>
                
                <h3>📚 Próximos Pasos:</h3>
                <ol>
                    <li><strong>Accede a tu cPanel</strong> con las credenciales de arriba</li>
                    <li><strong>Configura tu email</strong> (Cuentas de email > Crear)</li>
                    <li><strong>Sube tu contenido</strong> (Administrador de archivos)</li>
                    <li><strong>Instala WordPress</strong> si lo necesitas (Softaculous)</li>
                </ol>
                
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Nuestro equipo de soporte está disponible 24/7.</p>
                
                <p>¡Bienvenido a la familia LanzaWeb AR! 🚀</p>
                
                <hr style="margin: 30px 0; border: none; height: 1px; background: #ddd;">
                
                <p><strong>Equipo LanzaWeb AR</strong><br>
                📧 soporte@lanzawebar.com<br>
                📱 WhatsApp: +54 11 1234-5678<br>
                🌐 www.lanzawebar.com</p>
            </div>
            
            <div class="footer">
                <p>© 2024 LanzaWeb AR - Hosting Profesional Argentino</p>
                <p>Este email contiene información confidencial. Si no eres el destinatario, por favor elimínalo.</p>
            </div>
        </div>
    </body>
    </html>
    `;
        const text = `
¡Bienvenido a LanzaWeb AR, ${clientName}!

Tu cuenta de hosting ${planName} está lista. Aquí tienes tus datos de acceso:

🌐 Tu sitio web: https://${domain}
👤 Usuario cPanel: ${username}
🔒 Contraseña: ${password}
🖥️ Panel de Control: ${cpanelUrl}
📧 Email: ${email}

Próximos pasos:
1. Accede a tu cPanel con las credenciales de arriba
2. Configura tu email
3. Sube tu contenido
4. Instala WordPress si lo necesitas

¿Necesitas ayuda? Contáctanos:
📧 soporte@lanzawebar.com
📱 WhatsApp: +54 11 1234-5678

¡Bienvenido a la familia LanzaWeb AR!

---
LanzaWeb AR - Hosting Profesional Argentino
www.lanzawebar.com
    `;
        return {
            subject: `🎉 Tu cuenta de hosting está lista - ${domain}`,
            html,
            text
        };
    }
    // Enviar email usando el backend
    async sendWelcomeEmail(credentials) {
        try {
            const emailTemplate = this.generateWelcomeEmail(credentials);
            const response = await fetch(`${this.apiUrl}/api/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: credentials.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                    text: emailTemplate.text
                })
            });
            if (!response.ok) {
                throw new Error(`Email API Error: ${response.status}`);
            }
            const result = await response.json();
            return result.success === true;
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }
    }
    // Template de email de bienvenida para nuevos usuarios registrados
    generateRegistrationWelcomeEmail(userData) {
        const { name, email } = userData;
        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #3b82f6 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .welcome-box { background: white; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .feature-list { background: #f1f3f4; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #06b6d4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #22c55e; text-decoration: none; margin: 0 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ¡Bienvenido a LanzaWeb AR!</h1>
                <p>Tu cuenta ha sido creada exitosamente</p>
            </div>
            
            <div class="content">
                <div class="welcome-box">
                    <h2>¡Hola ${name}! 👋</h2>
                    <p>Nos emociona tenerte como parte de la familia LanzaWeb AR. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar todo lo que tenemos para ofrecerte.</p>
                </div>
                
                <h3>🚀 ¿Qué puedes hacer ahora?</h3>
                <div class="feature-list">
                    <ul>
                        <li><strong>🌐 Contratar Hosting:</strong> Planes desde $2.000 ARS mensuales</li>
                        <li><strong>💻 Desarrollo Web:</strong> Sitios personalizados para tu negocio</li>
                        <li><strong>📱 Apps Móviles:</strong> Soluciones digitales completas</li>
                        <li><strong>🎨 Diseño UI/UX:</strong> Interfaces modernas y atractivas</li>
                        <li><strong>🛠️ Soporte Técnico:</strong> Ayuda profesional 24/7</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${process.env.REACT_APP_FRONTEND_URL || 'https://lanzawebar.com'}/dashboard" class="cta-button">🎯 Ir a mi Dashboard</a>
                </div>
                
                <h3>💡 Próximos Pasos:</h3>
                <ol>
                    <li><strong>Explora tu dashboard</strong> - Ve todas las opciones disponibles</li>
                    <li><strong>Elige un plan de hosting</strong> - Si necesitas alojar tu sitio web</li>
                    <li><strong>Contacta nuestro equipo</strong> - Para desarrollo personalizado</li>
                    <li><strong>Únete a nuestra comunidad</strong> - Síguenos en redes sociales</li>
                </ol>
                
                <div class="welcome-box" style="background: #e8f5e8; border-color: #22c55e;">
                    <h4>🎁 Oferta Especial de Bienvenida</h4>
                    <p>Como nuevo miembro, tienes acceso a <strong>15% de descuento</strong> en tu primer plan de hosting. Usa el código: <code style="background: #d4edda; padding: 5px 10px; border-radius: 4px; font-weight: bold;">BIENVENIDO15</code></p>
                </div>
                
                <div class="social-links">
                    <p>Síguenos en nuestras redes sociales:</p>
                    <a href="#">📘 Facebook</a>
                    <a href="#">📷 Instagram</a>
                    <a href="#">🐦 Twitter</a>
                    <a href="#">💼 LinkedIn</a>
                </div>
                
                <hr style="margin: 30px 0; border: none; height: 1px; background: #ddd;">
                
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos:</p>
                <p><strong>📧 Email:</strong> soporte@lanzawebar.com<br>
                <strong>📱 WhatsApp:</strong> +54 11 1234-5678<br>
                <strong>🌐 Web:</strong> www.lanzawebar.com</p>
                
                <p>¡Gracias por confiar en nosotros para hacer crecer tu presencia digital!</p>
                
                <p>Con cariño,<br>
                <strong>El equipo de LanzaWeb AR</strong> 🚀</p>
            </div>
            
            <div class="footer">
                <p>© 2024 LanzaWeb AR - Desarrollo Web y Hosting Profesional</p>
                <p>Este email fue enviado a ${email}</p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">Si no creaste esta cuenta, puedes ignorar este email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
        const text = `
¡Bienvenido a LanzaWeb AR, ${name}!

Tu cuenta ha sido creada exitosamente. Aquí está lo que puedes hacer:

🌐 Contratar Hosting - Planes desde $2.000 ARS
💻 Desarrollo Web personalizado
📱 Apps Móviles
🎨 Diseño UI/UX
🛠️ Soporte Técnico 24/7

🎁 OFERTA ESPECIAL: 15% de descuento en tu primer hosting
Código: BIENVENIDO15

Accede a tu dashboard: ${process.env.REACT_APP_FRONTEND_URL || 'https://lanzawebar.com'}/dashboard

¿Necesitas ayuda?
📧 soporte@lanzawebar.com
📱 WhatsApp: +54 11 1234-5678

¡Gracias por unirte a LanzaWeb AR!

---
LanzaWeb AR - Desarrollo Web y Hosting Profesional
www.lanzawebar.com
    `;
        return {
            subject: `🎉 ¡Bienvenido a LanzaWeb AR! Tu cuenta está lista`,
            html,
            text
        };
    }
    // Enviar email de bienvenida de registro
    async sendRegistrationWelcomeEmail(userData) {
        try {
            const emailTemplate = this.generateRegistrationWelcomeEmail(userData);
            const response = await fetch(`${this.apiUrl}/api/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: userData.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                    text: emailTemplate.text
                })
            });
            if (!response.ok) {
                throw new Error(`Email API Error: ${response.status}`);
            }
            const result = await response.json();
            return result.success === true;
        }
        catch (error) {
            console.error('Error sending registration welcome email:', error);
            return false;
        }
    }
    // Template para configuración de dominio propio
    generateDomainConfigEmail(clientData) {
        const { name, domain, nameservers } = clientData;
        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .config-box { background: white; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .nameserver-item { background: #e9ecef; padding: 10px; margin: 5px 0; border-radius: 5px; font-family: monospace; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 Configuración de Dominio</h1>
                <p>Instrucciones para ${domain}</p>
            </div>
            
            <div class="content">
                <p>Hola <strong>${name}</strong>,</p>
                
                <p>Para que tu dominio <strong>${domain}</strong> funcione con tu hosting, necesitas configurar los nameservers en tu registrador de dominio.</p>
                
                <div class="config-box">
                    <h3>🌐 Nameservers a configurar:</h3>
                    ${nameservers.map((ns, index) => `<div class="nameserver-item">NS${index + 1}: ${ns}</div>`).join('')}
                </div>
                
                <div class="warning">
                    <strong>📝 Pasos a seguir:</strong>
                    <ol>
                        <li>Accede al panel de tu registrador de dominio</li>
                        <li>Busca la sección "DNS" o "Nameservers"</li>
                        <li>Cambia los nameservers por los de arriba</li>
                        <li>Guarda los cambios</li>
                        <li>Espera 24-48 horas para la propagación</li>
                    </ol>
                </div>
                
                <p>Una vez configurados, tu sitio estará disponible en <strong>https://${domain}</strong></p>
                
                <p>Si necesitas ayuda con la configuración, no dudes en contactarnos.</p>
            </div>
        </div>
    </body>
    </html>
    `;
        const text = `
Configuración de Dominio - ${domain}

Hola ${name},

Para que tu dominio ${domain} funcione con tu hosting, configura estos nameservers:

${nameservers.map((ns, index) => `NS${index + 1}: ${ns}`).join('\n')}

Pasos:
1. Accede al panel de tu registrador
2. Busca "DNS" o "Nameservers"  
3. Cambia por los nameservers de arriba
4. Guarda y espera 24-48 horas

¿Necesitas ayuda? Contáctanos:
soporte@lanzawebar.com
    `;
        return {
            subject: `🔧 Configurar nameservers para ${domain}`,
            html,
            text
        };
    }
}
export default new EmailService();
