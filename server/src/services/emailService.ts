import nodemailer from 'nodemailer'
import templateService from './templateService.js'

interface EmailOptions {
  to: string
  subject?: string
  html?: string
  text?: string
  attachments?: any[]
}

class EmailService {
  private transporter: any = null

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    try {
      // Configuración para SMTP de producción (Gmail)
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log('📧 Configurando SMTP de producción...')
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      } else {
        // Fallback a Ethereal para testing
        console.log('📧 Usando Ethereal test SMTP...')
        const testAccount = await nodemailer.createTestAccount()
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        })
      }

      console.log('✅ Transporter de email configurado exitosamente')
    } catch (error) {
      console.error('❌ Error configurando transporter de email:', error)
      throw error
    }
  }

  private async ensureTransporter() {
    if (!this.transporter) {
      await this.initializeTransporter()
    }
  }

  async sendEmail(options: EmailOptions): Promise<any> {
    await this.ensureTransporter()

    const mailOptions = {
      from: process.env.SMTP_FROM || '"LanzaWebAR" <no-reply@lanzawebar.com>',
      to: options.to,
      subject: options.subject || 'Mensaje de LanzaWebAR',
      html: options.html,
      text: options.text,
      attachments: options.attachments || [],
    }

    try {
      console.log(`📤 Enviando email a ${options.to}...`)
      const info = await this.transporter.sendMail(mailOptions)
      
      console.log('✅ Email enviado exitosamente!')
      console.log(`📋 Message ID: ${info.messageId}`)

      // Si es Ethereal, mostrar preview URL
      if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_HOST) {
        const previewUrl = nodemailer.getTestMessageUrl(info)
        console.log(`🔗 Preview URL: ${previewUrl}`)
      }

      return info
    } catch (error) {
      console.error('❌ Error enviando email:', error)
      throw error
    }
  }

  // Envío de email de testing con nuevo diseño
  async sendTestingEmail(to: string): Promise<any> {
    try {
      console.log('🧪 Generando email de testing con nuevo diseño...')
      const { html, text, subject } = await templateService.renderTestingEmail()

      return await this.sendEmail({
        to,
        subject,
        html,
        text,
      })
    } catch (error) {
      console.error('❌ Error enviando email de testing:', error)
      throw error
    }
  }

  // Email de bienvenida para nuevos usuarios
  async sendWelcomeEmail(to: string, userData: {
    username: string
    email: string
    plan?: string
  }): Promise<any> {
    try {
      console.log(`🎉 Enviando email de bienvenida a ${userData.username}...`)
      const { html, text, subject } = await templateService.renderWelcomeEmail(userData)

      return await this.sendEmail({
        to,
        subject,
        html,
        text,
      })
    } catch (error) {
      console.error('❌ Error enviando email de bienvenida:', error)
      throw error
    }
  }

  // Email con credenciales de hosting
  async sendHostingCredentialsEmail(to: string, hostingData: {
    username: string
    password: string
    siteUrl: string
    cpanelUrl: string
    ftpServer: string
  }): Promise<any> {
    try {
      console.log(`🌐 Enviando credenciales de hosting a ${to}...`)
      const { html, text, subject } = await templateService.renderHostingCredentialsEmail(hostingData)

      return await this.sendEmail({
        to,
        subject,
        html,
        text,
      })
    } catch (error) {
      console.error('❌ Error enviando credenciales de hosting:', error)
      throw error
    }
  }

  // Email de confirmación de pago
  async sendPaymentConfirmationEmail(to: string, paymentData: {
    orderId: string
    amount: number
    plan: string
    paymentMethod: string
  }): Promise<any> {
    try {
      console.log(`💳 Enviando confirmación de pago a ${to}...`)
      
      // Datos para el template
      const data = {
        subject: `✅ Pago Confirmado - Orden #${paymentData.orderId}`,
        headerTitle: '¡Pago Confirmado!',
        headerSubtitle: 'Tu transacción ha sido procesada exitosamente',
        orderId: paymentData.orderId,
        amount: `$${paymentData.amount.toLocaleString('es-AR')}`,
        plan: paymentData.plan,
        paymentMethod: paymentData.paymentMethod,
        date: new Date().toLocaleString('es-AR')
      }

      // Por ahora usamos un HTML básico, luego podemos crear template específico
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f5f5f5; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">¡Pago Confirmado! ✅</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu transacción ha sido procesada exitosamente</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #22c55e;">Detalles de la transacción</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #333;"><strong style="color: #22c55e;">Orden:</strong> #${data.orderId}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #333;"><strong style="color: #22c55e;">Monto:</strong> ${data.amount}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #333;"><strong style="color: #22c55e;">Plan:</strong> ${data.plan}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #333;"><strong style="color: #22c55e;">Método:</strong> ${data.paymentMethod}</li>
              <li style="padding: 8px 0;"><strong style="color: #22c55e;">Fecha:</strong> ${data.date}</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://lanzawebar.com/dashboard" style="background: linear-gradient(135deg, #22c55e, #06b6d4); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Ir al Dashboard</a>
            </div>
          </div>
          <div style="background: #111; padding: 20px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #22c55e; font-weight: 600; margin: 8px 0;">🦕 LanzaWebAR - Hosting & Desarrollo Web</p>
            <p style="color: #9ca3af; font-size: 14px; margin: 8px 0;">Gracias por confiar en nosotros</p>
          </div>
        </div>
      `

      const text = `
🚀 LANZAWEBAR - PAGO CONFIRMADO

¡Tu pago ha sido procesado exitosamente!

📋 DETALLES:
- Orden: #${data.orderId}
- Monto: ${data.amount}
- Plan: ${data.plan}
- Método: ${data.paymentMethod}
- Fecha: ${data.date}

Accede a tu dashboard: https://lanzawebar.com/dashboard

¡Gracias por confiar en LanzaWebAR! 🦕
      `.trim()

      return await this.sendEmail({
        to,
        subject: data.subject,
        html,
        text,
      })
    } catch (error) {
      console.error('❌ Error enviando confirmación de pago:', error)
      throw error
    }
  }

  // Método para enviar emails personalizados (mantener compatibilidad)
  async sendCustomEmail(to: string, subject: string, html: string, text?: string): Promise<any> {
    return await this.sendEmail({
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML si no se proporciona texto
    })
  }

  // Verificar configuración del servicio
  async verifyConnection(): Promise<boolean> {
    try {
      await this.ensureTransporter()
      await this.transporter.verify()
      console.log('✅ Conexión de email verificada exitosamente')
      return true
    } catch (error) {
      console.error('❌ Error verificando conexión de email:', error)
      return false
    }
  }
}

export default new EmailService()
