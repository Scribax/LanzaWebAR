// Rutas para automatización de hosting
import express from 'express'
import HostingAutomationService, { HostingOrderData } from '../services/hostingAutomation'

const router = express.Router()
const hostingService = new HostingAutomationService()

// Validar datos de orden
function validateOrderData(orderData: HostingOrderData): { valid: boolean, errors?: string[] } {
  const errors: string[] = []
  
  if (!orderData.clientData?.name) errors.push('Nombre del cliente requerido')
  if (!orderData.clientData?.email) errors.push('Email del cliente requerido')
  if (!orderData.planId) errors.push('ID del plan requerido')
  if (orderData.domainOption === 'subdomain' && !orderData.subdomainName) {
    errors.push('Nombre del subdominio requerido')
  }
  if ((orderData.domainOption === 'own-domain' || orderData.domainOption === 'register-new') && !orderData.customDomain) {
    errors.push('Dominio personalizado requerido')
  }
  
  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

// Crear cuenta de hosting automatizada
router.post('/create-automated', async (req, res) => {
  try {
    console.log('📥 Recibida orden de hosting automatizada')
    
    // Validar datos de entrada
    const orderData: HostingOrderData = req.body
    
    const validation = validateOrderData(orderData)
    if (!validation.valid) {
      console.log('❌ Datos inválidos:', validation.errors)
      return res.status(400).json({
        success: false,
        errors: validation.errors
      })
    }

    // Procesar la orden
    console.log('🚀 Iniciando automatización...')
    const result = await hostingService.processHostingOrder(orderData)
    
    if (result.success) {
      console.log('✅ Automatización exitosa para:', orderData.clientData.email)
      
      // Log para monitoreo
      console.log('📊 Resumen:', {
        domain: result.accountDetails?.domain,
        username: result.accountDetails?.username,
        plan: result.accountDetails?.planName,
        emailSent: result.emails?.welcomeEmailSent
      })
      
      res.status(200).json(result)
    } else {
      console.log('❌ Error en automatización:', result.errors)
      res.status(500).json(result)
    }

  } catch (error) {
    console.error('💥 Error crítico en automatización:', error)
    
    res.status(500).json({
      success: false,
      errors: [`Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`]
    })
  }
})

// Verificar estado de cuenta
router.get('/account-status/:username', async (req, res) => {
  try {
    const { username } = req.params
    
    // TODO: Implementar verificación de estado de cuenta
    // Por ahora retornamos datos mock para testing
    
    res.json({
      success: true,
      account: {
        username,
        status: 'active',
        domain: `${username}.lanzawebar.com`,
        planName: 'Lanza Básico',
        createdAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// Obtener lista de cuentas (para admin)
router.get('/accounts', async (req, res) => {
  try {
    // TODO: Implementar listado de cuentas desde WHM
    // Por ahora retornamos datos mock
    
    const accounts = [
      {
        username: 'demo1234',
        domain: 'demo1234.lanzawebar.com',
        plan: 'Lanza Básico',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        username: 'cliente5678',
        domain: 'miempresa.com',
        plan: 'Lanza Pro',
        status: 'active', 
        createdAt: '2024-01-14T15:45:00Z'
      }
    ]
    
    res.json({
      success: true,
      accounts,
      total: accounts.length
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// Webhook para notificaciones de pago (ej: MercadoPago, Stripe)
router.post('/payment-webhook', async (req, res) => {
  try {
    console.log('💳 Webhook de pago recibido:', req.body)
    
    // TODO: Implementar lógica de webhook de pago
    // 1. Validar webhook signature
    // 2. Procesar pago exitoso
    // 3. Activar cuenta de hosting
    // 4. Enviar confirmación al cliente
    
    // Por ahora solo logueamos
    res.status(200).json({ received: true })
    
  } catch (error) {
    console.error('Error procesando webhook:', error)
    res.status(500).json({ error: 'Webhook error' })
  }
})

// Suspender cuenta (para admin)
router.post('/suspend/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { reason } = req.body
    
    console.log(`⏸️ Suspendiendo cuenta: ${username}`)
    
    // TODO: Implementar suspensión usando WHM API
    
    res.json({
      success: true,
      message: `Cuenta ${username} suspendida`,
      reason: reason || 'No especificada'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// Reactivar cuenta (para admin)  
router.post('/unsuspend/:username', async (req, res) => {
  try {
    const { username } = req.params
    
    console.log(`▶️ Reactivando cuenta: ${username}`)
    
    // TODO: Implementar reactivación usando WHM API
    
    res.json({
      success: true,
      message: `Cuenta ${username} reactivada`
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// Verificar estado SSL de un dominio
router.get('/ssl-status/:domain', async (req, res) => {
  try {
    const { domain } = req.params
    
    console.log(`🔍 Verificando SSL para: ${domain}`)
    
    const result = await hostingService.checkSSLStatus(domain)
    
    res.json({
      success: true,
      domain,
      ssl: {
        enabled: result.hasSSL,
        status: result.hasSSL ? 'active' : 'pending',
        message: result.hasSSL 
          ? '✅ Certificado SSL activo y funcionando'
          : '🔄 SSL en proceso de configuración (1-10 minutos)',
        error: result.error,
        details: result.details
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error verificando SSL:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

export default router
