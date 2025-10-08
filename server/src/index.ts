import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Mock data
const products = [
  { id: 1, name: 'Reloj Minimal', price: 99, cat: 'Relojes', desc: 'Reloj de diseño minimalista con correa de silicona.', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Auriculares', price: 59, cat: 'Audio', desc: 'Auriculares inalámbricos con cancelación pasiva.', img:'https://images.unsplash.com/photo-1518443692290-07d5f10ff0e6?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Smartband', price: 79, cat: 'Wearables', desc: 'Pulsera inteligente con monitoreo de actividad.', img:'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Reloj Sport', price: 129, cat: 'Relojes', desc: 'Reloj deportivo resistente al agua.', img:'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, name: 'Auriculares Pro', price: 89, cat: 'Audio', desc: 'Sonido balanceado y estuche de carga rápida.', img:'https://images.unsplash.com/photo-1518443692290-07d5f10ff0e6?q=80&w=1200&auto=format&fit=crop' },
]

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`))
