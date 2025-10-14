import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import { initializeDatabase, database } from './database'
import { authMiddleware, generateToken, hashPassword, verifyPassword, isValidEmail, isStrongPassword, AuthRequest } from './auth'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar dotenv - Detecta automáticamente la ubicación correcta del .env
// IMPORTANTE: Usar lazy initialization en los servicios para evitar problemas de orden
const envPaths = [
  path.resolve(process.cwd(), '.env'),           // Directorio actual (server/)
  path.resolve(process.cwd(), '..', 'server', '.env'),  // Si ejecutamos desde root/
  path.resolve(__dirname, '..', '..', '.env')    // Relativo al archivo compilado
]

// Cargar variables de entorno
let envLoaded = false
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔧 Variables cargadas desde: ${envPath}`)
    }
    envLoaded = true
    break
  }
}

if (!envLoaded) {
  console.warn('⚠️ No se encontró archivo .env. Usando variables del sistema.')
}

// Solo mostrar debug en desarrollo
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Variables de entorno:')
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅' : '❌')
  console.log('- MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅' : '❌')
  console.log('- SMTP_HOST:', process.env.SMTP_HOST ? '✅' : '❌')
}

const app = express()
app.use(cors())
app.use(express.json())

// Inicializar base de datos
initializeDatabase().catch(console.error)

// Función para enviar email de bienvenida de registro
async function sendWelcomeRegistrationEmail(userData: { name: string; email: string }) {
  const { name, email } = userData

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
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="cta-button">🎯 Ir a mi Dashboard</a>
              </div>
              
              <div class="welcome-box" style="background: #e8f5e8; border-color: #22c55e;">
                  <h4>🎁 Oferta Especial de Bienvenida</h4>
                  <p>Como nuevo miembro, tienes acceso a <strong>15% de descuento</strong> en tu primer plan de hosting. Usa el código: <code style="background: #d4edda; padding: 5px 10px; border-radius: 4px; font-weight: bold;">BIENVENIDO15</code></p>
              </div>
              
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
          </div>
      </div>
  </body>
  </html>
  `

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

Accede a tu dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard

¿Necesitas ayuda?
📧 soporte@lanzawebar.com
📱 WhatsApp: +54 11 1234-5678

¡Gracias por unirte a LanzaWeb AR!
  `

  let transporter: nodemailer.Transporter
  let isTest = false

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })
  } else {
    const test = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    })
    isTest = true
    console.log('[welcome-email] Using Ethereal test SMTP')
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"LanzaWeb AR" <no-reply@lanzawebar.com>`,
    to: email,
    subject: `🎉 ¡Bienvenido a LanzaWeb AR! Tu cuenta está lista`,
    html,
    text
  })

  const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : undefined
  if (previewUrl) console.log('[welcome-email] Preview URL:', previewUrl)

  return info
}

// Función para enviar email de credenciales de hosting
async function sendHostingWelcomeEmail(hostingData: {
  name: string
  email: string
  username: string
  password: string
  domain: string
  cpanelUrl: string
  planName: string
}) {
  const { name, email, username, password, domain, cpanelUrl, planName } = hostingData

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #3b82f6 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f8f9fa; }
          .credentials-box { background: white; border: 3px solid #22c55e; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .credential-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #22c55e; }
          .credential-label { font-weight: bold; color: #333; font-size: 14px; }
          .credential-value { font-family: 'Courier New', monospace; background: #e8f5e8; padding: 8px 12px; border-radius: 6px; margin-top: 8px; font-size: 16px; color: #2d5a2d; font-weight: bold; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #06b6d4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 16px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          .warning-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎉 ¡Tu Hosting está Listo!</h1>
              <p>Credenciales de acceso para ${domain}</p>
          </div>
          
          <div class="content">
              <h2>¡Hola ${name}! 👋</h2>
              <p>Tu plan de hosting <strong>${planName}</strong> ha sido creado exitosamente y ya está funcionando. Aquí tienes todas las credenciales que necesitas:</p>
              
              <div class="credentials-box">
                  <h3 style="color: #22c55e; margin-top: 0;">🔑 Datos de Acceso a tu Hosting</h3>
                  
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
                      <div class="credential-label">🖥️ Panel de Control (cPanel):</div>
                      <div class="credential-value">${cpanelUrl}</div>
                  </div>
              </div>
              
              <div style="text-align: center;">
                  <a href="${cpanelUrl}" class="cta-button">🚀 Acceder a mi cPanel</a>
              </div>
              
              <div class="warning-box">
                  <h4 style="color: #856404; margin-top: 0;">⚠️ Importante - Guárdalo bien:</h4>
                  <ul style="color: #856404;">
                      <li><strong>Guarda estas credenciales en un lugar seguro</strong></li>
                      <li>Te recomendamos cambiar la contraseña desde cPanel</li>
                      <li>Tu dominio puede tardar 1-2 horas en estar completamente activo</li>
                      <li>Si tienes problemas, contacta soporte inmediatamente</li>
                  </ul>
              </div>
              
              <h3>🛠️ ¿Qué puedes hacer ahora?</h3>
              <ol>
                  <li><strong>Acceder a cPanel</strong> - Usa las credenciales de arriba</li>
                  <li><strong>Configurar email</strong> - Crea cuentas de correo profesionales</li>
                  <li><strong>Subir tu contenido</strong> - Administrador de archivos o FTP</li>
                  <li><strong>Instalar WordPress</strong> - Desde Softaculous en cPanel</li>
                  <li><strong>Configurar SSL</strong> - Ya está incluido y activo</li>
              </ol>
              
              <h3>📞 ¿Necesitas Ayuda?</h3>
              <p>Nuestro equipo de soporte está disponible 24/7:</p>
              <ul>
                  <li><strong>📧 Email:</strong> soporte@lanzawebar.com</li>
                  <li><strong>📱 WhatsApp:</strong> +54 11 1234-5678</li>
                  <li><strong>🌐 Web:</strong> www.lanzawebar.com/soporte</li>
              </ul>
              
              <p style="margin-top: 30px;">¡Gracias por confiar en LanzaWeb AR para tu presencia digital! 🚀</p>
              
              <p>Saludos,<br>
              <strong>El equipo de LanzaWeb AR</strong></p>
          </div>
          
          <div class="footer">
              <p>© 2024 LanzaWeb AR - Hosting Profesional Argentino</p>
              <p>Email enviado a ${email}</p>
              <p style="font-size: 12px; color: #ccc; margin-top: 10px;">Guarda este email, contiene información importante sobre tu hosting</p>
          </div>
      </div>
  </body>
  </html>
  `

  const text = `
¡Tu Hosting está Listo, ${name}!

Tu plan ${planName} ha sido creado exitosamente.

🔑 CREDENCIALES DE ACCESO:

🌐 Tu sitio: https://${domain}
👤 Usuario: ${username}
🔒 Contraseña: ${password}
🖥️ cPanel: ${cpanelUrl}

⚠️ IMPORTANTE:
- Guarda estas credenciales en un lugar seguro
- Cambia la contraseña desde cPanel
- Tu dominio estará activo en 1-2 horas

🛠️ PRÓXIMOS PASOS:
1. Acceder a cPanel
2. Configurar email
3. Subir contenido
4. Instalar WordPress

📞 SOPORTE 24/7:
📧 soporte@lanzawebar.com
📱 WhatsApp: +54 11 1234-5678

¡Gracias por elegir LanzaWeb AR!
  `

  let transporter: nodemailer.Transporter
  let isTest = false

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })
  } else {
    const test = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    })
    isTest = true
    console.log('[hosting-email] Using Ethereal test SMTP')
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"LanzaWeb AR" <no-reply@lanzawebar.com>`,
    to: email,
    subject: `🚀 Tu Hosting está listo! Credenciales para ${domain}`,
    html,
    text
  })

  const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : undefined
  if (previewUrl) console.log('[hosting-email] Preview URL:', previewUrl)

  return info
}

// Mock data
const products = [
  { id: 1, name: 'Reloj Minimal', price: 99, cat: 'Relojes', desc: 'Reloj de diseño minimalista con correa de silicona.', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Auriculares', price: 59, cat: 'Audio', desc: 'Auriculares inalámbricos con cancelación pasiva.', img:'https://images.unsplash.com/photo-1518443692290-07d5f10ff0e6?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Smartband', price: 79, cat: 'Wearables', desc: 'Pulsera inteligente con monitoreo de actividad.', img:'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Reloj Sport', price: 129, cat: 'Relojes', desc: 'Reloj deportivo resistente al agua.', img:'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, name: 'Auriculares Pro', price: 89, cat: 'Audio', desc: 'Sonido balanceado y estuche de carga rápida.', img:'https://images.unsplash.com/photo-1518443692290-07d5f10ff0e6?q=80&w=1200&auto=format&fit=crop' },
]

// 🔐 ENDPOINTS DE AUTENTICACIÓN

// Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔐 Registro de usuario iniciado')
    console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2))
    
    const { name, email, password, phone } = req.body
    
    // Validaciones
    console.log('✅ Validando datos:')
    console.log('- Name:', name ? '✓' : '✗')
    console.log('- Email:', email ? '✓' : '✗')
    console.log('- Password:', password ? '✓' : '✗')
    
    if (!name || !email || !password) {
      console.log('❌ Validación fallida: campos requeridos')
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }
    
    const passwordValidation = isStrongPassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message })
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await database.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }
    
    // Crear usuario
    const passwordHash = await hashPassword(password)
    const user = await database.createUser(email, passwordHash, name, phone)
    
    // Generar token
    const token = generateToken(user)
    
    // Enviar email de bienvenida
    try {
      await sendWelcomeRegistrationEmail({
        name: user.name,
        email: user.email
      })
      console.log(`📧 Email de bienvenida enviado a: ${user.email}`)
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError)
      // No fallar el registro por un error de email
    }
    
    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    })
    
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }
    
    // Buscar usuario
    const user = await database.getUserByEmail(email)
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' })
    }
    
    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' })
    }
    
    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      return res.status(400).json({ error: 'Cuenta desactivada' })
    }
    
    // Generar token
    const token = generateToken(user)
    
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener perfil de usuario (requiere autenticación)
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
      phone: req.user!.phone,
      created_at: req.user!.created_at
    }
  })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.get('/api/products', (_req, res) => res.json(products))
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id)
  const product = products.find(p => p.id === id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
})

app.post('/api/checkout', (req, res) => {
  const { items, customer } = req.body || {}
  if (!Array.isArray(items) || !customer) return res.status(400).json({ error: 'Invalid payload' })
  const orderId = Math.random().toString(36).slice(2, 10)
  res.json({ ok: true, orderId })
})

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'Invalid payload' })

    let transporter: nodemailer.Transporter
    let isTest = false

    if (process.env.SMTP_HOST) {
      // Use real SMTP from environment
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
      })
    } else {
      // Dev fallback: create a disposable Ethereal account so the request doesn't fail
      const test = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: test.user, pass: test.pass },
      })
      isTest = true
      console.log('[contact] Using Ethereal test SMTP (set SMTP_HOST to use your provider)')
    }

    const to = process.env.CONTACT_TO || 'Francodemartos2025@gmail.com'
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Portfolio Contact" <no-reply@localhost>`,
      to,
      subject: `Nuevo mensaje de ${name}`,
      replyTo: email,
      text: message,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g,'<br/>')}</p>`,
    })

    const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : undefined
    if (previewUrl) console.log('[contact] Preview URL:', previewUrl)

    res.json({ ok: true, id: info.messageId, previewUrl })
  } catch (err) {
    console.error('[contact] error', err)
    res.status(500).json({ error: 'Email send failed' })
  }
})

app.get('/api/analytics', (_req, res) => {
  res.json({
    kpis: [{ label: 'Usuarios', value: 1240 }, { label: 'Ventas', value: 320 }, { label: 'Tasa conv.', value: 4.2 }],
    bars: [60, 75, 40, 90, 55, 70],
    points: [0, 20, 45, 30, 70, 55, 85]
  })
})

// 🚀 HOSTING AUTOMATION ROUTES
// Importar servicios de hosting REAL
import HostingAutomationService from './services/hostingAutomation'

// 💳 MERCADOPAGO ROUTES
// Importar rutas de pagos
import paymentsRouter from './routes/payments'

// Crear instancia del servicio de automatización
const hostingService = new HostingAutomationService()

// Registrar rutas de pagos
app.use('/api/payments', paymentsRouter)

// Endpoint de prueba para WHM
app.get('/api/test-whm', async (_req, res) => {
  try {
    const result = await hostingService.testWHMConnection()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error testing WHM connection',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// 🛍️ ENDPOINTS DE ÓRDENES DE HOSTING (protegidos)

// Obtener órdenes del usuario
app.get('/api/hosting/orders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orders = await database.getUserOrders(req.user!.id)
    res.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/hosting/create-automated
// Crear cuenta de hosting automáticamente desde el frontend (requiere autenticación)
app.post('/api/hosting/create-automated', authMiddleware, async (req: AuthRequest, res) => {
    console.log('🚀 Request recibido para crear hosting automático')
    console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2))
    console.log('👤 Usuario autenticado:', req.user!.email)
  
  try {
    const orderData = req.body
    const userId = req.user!.id
    
    // Validar datos de entrada (implementación mock)
    console.log('🔍 Validando datos de la orden:')
    console.log('- Client Data:', orderData.clientData ? '✓' : '✗')
    console.log('- Client Email:', orderData.clientData?.email ? '✓' : '✗')
    console.log('- Plan ID:', orderData.planId)
    console.log('- Plan válido:', ['basico', 'intermedio', 'premium'].includes(orderData.planId) ? '✓' : '✗')
    
    if (!orderData.clientData?.email) {
      console.log('❌ Error: Email del cliente es requerido')
      return res.status(400).json({
        success: false,
        errors: ['Email del cliente es requerido']
      })
    }
    
    if (!orderData.planId || !['basico', 'intermedio', 'premium'].includes(orderData.planId)) {
      console.log('❌ Error: Plan inválido -', orderData.planId)
      return res.status(400).json({
        success: false,
        errors: ['Plan inválido']
      })
    }
    
    console.log(`📋 Procesando orden para:`, orderData.clientData.email)
    
    // Usar automatización REAL de hosting
    console.log('🚀 Ejecutando automatización real de WHM...')
    const result = await hostingService.processHostingOrder(orderData)
    
    console.log('🔍 Resultado de automatización:', result)
    
    if (result.success) {
      console.log('✅ Hosting creado exitosamente')
      
      // Guardar la orden en la base de datos
      const order = await database.createOrder(
        userId,
        'hosting',
        orderData.planId,
        orderData.planPrice || (orderData.planId === 'basico' ? 2000 : orderData.planId === 'intermedio' ? 3500 : 5500),
        'completed',
        JSON.stringify({
          ...orderData,
          accountDetails: result.accountDetails
        })
      )
      
      // Crear servicio de hosting con credenciales reales
      if (result.accountDetails) {
        await database.createHostingService({
          order_id: order.id,
          user_id: userId,
          domain: result.accountDetails.domain,
          plan_name: result.accountDetails.planName,
          whm_username: result.accountDetails.username,
          whm_password: result.accountDetails.password,
          cpanel_url: result.accountDetails.cpanelUrl
        })
        
        console.log('💾 Credenciales reales guardadas en la base de datos')
      }
      
      // El email ya se envía como parte de la automatización, no necesitamos duplicarlo aqui
      console.log(`✅ Automatización completada - Emails enviados: ${result.emails?.welcomeEmailSent ? 'Sí' : 'No'}`)
      
      res.json({
        success: true,
        message: 'Hosting creado exitosamente',
        orderId: order.id,
        accountDetails: result.accountDetails,
        emails: result.emails,
        warnings: result.warnings
      })
      
    } else {
      console.error('❌ Error creando hosting:', result.errors)
      
      res.status(500).json({
        success: false,
        errors: result.errors || ['Error interno del servidor'],
        warnings: result.warnings
      })
    }
    
  } catch (error) {
    console.error('💥 Error inesperado:', error)
    
    res.status(500).json({
      success: false,
      errors: ['Error interno del servidor'],
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// Obtener detalles de una orden específica
app.get('/api/hosting/orders/:orderId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orderId = parseInt(req.params.orderId)
    const order = await database.getOrderById(orderId)
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    // Verificar que la orden pertenece al usuario
    if (order.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    
    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Actualizar estado de una orden (para admin)
app.put('/api/hosting/orders/:orderId/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orderId = parseInt(req.params.orderId)
    const { status } = req.body
    
    if (!['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }
    
    const order = await database.getOrderById(orderId)
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    
    // Por ahora solo el propietario puede actualizar
    if (order.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    
    await database.updateOrderStatus(orderId, status)
    
    res.json({
      success: true,
      message: 'Estado actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error actualizando estado:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /api/hosting/plans
// Obtener planes de hosting disponibles
app.get('/api/hosting/plans', (_req, res) => {
  const planes = {
    basico: {
      id: 'basico',
      name: 'Lanza Básico',
      price: 2000,
      description: 'Ideal para webs personales o pequeños negocios',
      features: [
        '2 GB de Almacenamiento SSD',
        '20 GB de Transferencia',
        'Cuentas de Email Ilimitadas',
        'SSL Gratis',
        'Soporte técnico 24/7'
      ]
    },
    pro: {
      id: 'pro', 
      name: 'Lanza Pro',
      price: 3500,
      description: 'Perfecto para empresas o tiendas pequeñas',
      features: [
        '5 GB de Almacenamiento SSD',
        '50 GB de Transferencia', 
        'Cuentas de Email Ilimitadas',
        'SSL Gratis',
        'Soporte técnico prioritario 24/7'
      ]
    },
    premium: {
      id: 'premium',
      name: 'Lanza Premium', 
      price: 5500,
      description: 'Potencia total para proyectos exigentes',
      features: [
        '10 GB de Almacenamiento SSD',
        '100 GB de Transferencia',
        'Cuentas de Email Ilimitadas', 
        'SSL Gratis',
        'Soporte técnico VIP 24/7',
        'Staging environment'
      ]
    }
  }
  
  res.json({
    success: true,
    plans: planes
  })
})

// POST /api/send-email
// Endpoint para envío de emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body
    
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros requeridos'
      })
    }
    
    let transporter: nodemailer.Transporter
    let isTest = false

    if (process.env.SMTP_HOST) {
      // Use real SMTP from environment
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
      })
    } else {
      // Dev fallback: create a disposable Ethereal account
      const test = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: test.user, pass: test.pass },
      })
      isTest = true
      console.log('[send-email] Using Ethereal test SMTP (set SMTP_HOST to use your provider)')
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"LanzaWeb AR" <no-reply@lanzawebar.com>`,
      to,
      subject,
      html,
      text
    })

    const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : undefined
    if (previewUrl) console.log('[send-email] Preview URL:', previewUrl)
    
    console.log(`📧 Email enviado exitosamente a: ${to}`)
    console.log(`📝 Asunto: ${subject}`)
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email enviado exitosamente',
      previewUrl: previewUrl
    })
    
  } catch (error) {
    console.error('Error enviando email:', error)
    res.status(500).json({
      success: false,
      error: 'Error enviando email',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`))
