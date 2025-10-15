import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface TemplateData {
  [key: string]: string | number | Date
}

interface EmailTemplate {
  subject: string
  headerTitle: string
  headerSubtitle: string
  content: string
  contactEmail: string
}

class TemplateService {
  private templatesDir: string
  private baseTemplate: string | null = null

  constructor() {
    this.templatesDir = path.resolve(__dirname, '../../templates/email')
    this.loadBaseTemplate()
  }

  private async loadBaseTemplate(): Promise<void> {
    try {
      const baseTemplatePath = path.join(this.templatesDir, 'base.html')
      this.baseTemplate = await fs.promises.readFile(baseTemplatePath, 'utf-8')
    } catch (error) {
      console.error('❌ Error loading base email template:', error)
      throw new Error('No se pudo cargar el template base de email')
    }
  }

  private async loadContentTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.html`)
      return await fs.promises.readFile(templatePath, 'utf-8')
    } catch (error) {
      console.error(`❌ Error loading template ${templateName}:`, error)
      throw new Error(`No se pudo cargar el template: ${templateName}`)
    }
  }

  private replaceVariables(template: string, data: TemplateData): string {
    let processedTemplate = template

    // Reemplazar todas las variables {{variable}}
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processedTemplate = processedTemplate.replace(regex, String(value))
    })

    // Limpiar variables no reemplazadas
    processedTemplate = processedTemplate.replace(/\{\{[^}]+\}\}/g, '')

    return processedTemplate
  }

  async renderTemplate(templateName: string, data: TemplateData): Promise<EmailTemplate> {
    if (!this.baseTemplate) {
      await this.loadBaseTemplate()
    }

    // Cargar el contenido específico del template
    const contentTemplate = await this.loadContentTemplate(templateName)

    // Datos por defecto
    const defaultData = {
      contactEmail: process.env.CONTACT_TO || 'info@lanzawebar.com',
      date: new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Combinar datos por defecto con datos proporcionados
    const templateData = { ...defaultData, ...data }

    // Procesar el contenido
    const processedContent = this.replaceVariables(contentTemplate, templateData)

    // Datos específicos para el template base
    const baseData = {
      ...templateData,
      content: processedContent
    }

    // Procesar template base
    const processedTemplate = this.replaceVariables(this.baseTemplate!, baseData)

    return {
      subject: String(data.subject || 'Mensaje de LanzaWebAR'),
      headerTitle: String(data.headerTitle || 'LanzaWebAR'),
      headerSubtitle: String(data.headerSubtitle || 'Hosting & Desarrollo Web'),
      content: processedContent,
      contactEmail: String(templateData.contactEmail)
    }
  }

  // Templates específicos con datos predefinidos
  async renderTestingEmail(additionalData: TemplateData = {}): Promise<{ html: string; text: string; subject: string }> {
    const currentDate = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const data = {
      subject: '🚀 [Testing] Sistema de Emails LanzaWebAR - Nuevo Diseño',
      headerTitle: '¡Sistema de Emails Funcionando!',
      headerSubtitle: 'Nuevo diseño moderno con dinosaurio 🦕',
      server: process.env.SMTP_HOST || 'Gmail SMTP',
      user: process.env.SMTP_USER || 'Sistema interno',
      port: process.env.SMTP_PORT || '465',
      security: process.env.SMTP_PORT === '465' ? 'SSL/TLS' : 'STARTTLS',
      date: currentDate,
      ...additionalData
    }

    const template = await this.renderTemplate('testing', data)
    const html = this.replaceVariables(this.baseTemplate!, {
      subject: template.subject,
      headerTitle: template.headerTitle,
      headerSubtitle: template.headerSubtitle,
      content: template.content,
      contactEmail: template.contactEmail
    })

    // Versión texto plano simplificada
    const text = `
🚀 LANZAWEBAR - SISTEMA DE EMAILS FUNCIONANDO

${template.headerTitle}
${template.headerSubtitle}

✅ Email Testing Exitoso

Este mensaje confirma que el sistema de correos está funcionando perfectamente.

📊 Detalles del Test:
- Fecha: ${data.date}
- Servidor: ${data.server}
- Usuario: ${data.user}
- Puerto: ${data.port}
- Seguridad: ${data.security}

🎨 Nuevo Sistema de Templates:
- Diseño responsive y moderno
- Dinosaurio mascota incluido 🦕
- Gradientes de marca (Verde → Cian → Azul)
- Compatibilidad total con clientes de email

⚡ Sistema listo para emails de bienvenida, credenciales, notificaciones y soporte.

¡El sistema está 100% operativo!

© 2025 LanzaWebAR - Hosting & Desarrollo Web
Contacto: ${template.contactEmail}
    `.trim()

    return {
      html,
      text,
      subject: template.subject
    }
  }

  async renderWelcomeEmail(userData: {
    username: string
    email: string
    plan?: string
    registrationDate?: string
  }): Promise<{ html: string; text: string; subject: string }> {
    const data = {
      subject: `¡Bienvenido/a a LanzaWebAR, ${userData.username}! 🎉`,
      headerTitle: '¡Bienvenido/a a LanzaWebAR!',
      headerSubtitle: 'Tu cuenta está lista para usar',
      username: userData.username,
      email: userData.email,
      plan: userData.plan || 'Plan Básico',
      registrationDate: userData.registrationDate || new Date().toLocaleDateString('es-AR'),
    }

    const template = await this.renderTemplate('welcome', data)
    const html = this.replaceVariables(this.baseTemplate!, {
      subject: template.subject,
      headerTitle: template.headerTitle,
      headerSubtitle: template.headerSubtitle,
      content: template.content,
      contactEmail: template.contactEmail
    })

    const text = `
🚀 LANZAWEBAR - BIENVENIDO/A

¡Hola ${userData.username}!

Te damos la bienvenida a nuestra plataforma de hosting y desarrollo web.

📋 Datos de tu cuenta:
- Usuario: ${userData.username}
- Email: ${userData.email}
- Plan: ${data.plan}
- Registro: ${data.registrationDate}

🎯 Puedes empezar a:
- Explorar servicios de hosting
- Solicitar desarrollo personalizado  
- Acceder a tu panel de control

¡Gracias por elegir LanzaWebAR! 🦕

Contacto: ${template.contactEmail}
    `.trim()

    return { html, text, subject: template.subject }
  }

  async renderHostingCredentialsEmail(hostingData: {
    username: string
    password: string
    siteUrl: string
    cpanelUrl: string
    ftpServer: string
  }): Promise<{ html: string; text: string; subject: string }> {
    const data = {
      subject: '🌐 Tu Hosting está Listo - Credenciales de Acceso',
      headerTitle: '¡Tu Hosting está Listo!',
      headerSubtitle: 'Accede ya a tu nuevo sitio web',
      username: hostingData.username,
      password: hostingData.password,
      siteUrl: hostingData.siteUrl,
      cpanelUrl: hostingData.cpanelUrl,
      ftpServer: hostingData.ftpServer,
    }

    const template = await this.renderTemplate('hosting-credentials', data)
    const html = this.replaceVariables(this.baseTemplate!, {
      subject: template.subject,
      headerTitle: template.headerTitle,
      headerSubtitle: template.headerSubtitle,
      content: template.content,
      contactEmail: template.contactEmail
    })

    const text = `
🚀 LANZAWEBAR - HOSTING LISTO

Tu servicio de hosting ha sido configurado exitosamente.

🌐 DATOS DE ACCESO:
- Sitio Web: ${hostingData.siteUrl}
- Usuario cPanel: ${hostingData.username}  
- Contraseña: ${hostingData.password}
- Panel de Control: ${hostingData.cpanelUrl}
- Servidor FTP: ${hostingData.ftpServer}
- Puerto FTP: 21

⚠️ INFORMACIÓN CONFIDENCIAL: Guarda estos datos en un lugar seguro.

Tu sitio ya está online y funcionando!

🛠️ Configuración FTP:
Servidor: ${hostingData.ftpServer}
Usuario: ${hostingData.username}
Puerto: 21 (FTP) o 22 (SFTP)
Directorio: /public_html/

¡Tu sitio está online y funcionando! 🚀

Contacto: ${template.contactEmail}
    `.trim()

    return { html, text, subject: template.subject }
  }
}

export default new TemplateService()
