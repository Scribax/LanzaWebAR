// Rutas para procesar pagos con MercadoPago
import express from 'express'
import MercadoPagoService, { HostingOrderRequest } from '../services/mercadopagoService'
import HostingAutomationService, { HostingOrderData } from '../services/hostingAutomation'

const router = express.Router()

// Lazy initialization para evitar cargar antes de las variables de entorno
let mercadopagoService: MercadoPagoService | null = null
let hostingService: HostingAutomationService | null = null

function getMercadoPagoService() {
  if (!mercadopagoService) {
    mercadopagoService = new MercadoPagoService()
  }
  return mercadopagoService
}

function getHostingService() {
  if (!hostingService) {
    hostingService = new HostingAutomationService()
  }
  return hostingService
}

// Crear preferencia de pago
router.post('/create-preference', async (req, res) => {
  try {
    console.log('💳 [PAYMENTS] Solicitud de nueva preferencia de pago')
    
    const orderData: HostingOrderRequest = req.body
    
    // Validar datos básicos
    if (!orderData.clientData?.name || !orderData.clientData?.email) {
      return res.status(400).json({
        success: false,
        error: 'Datos del cliente incompletos'
      })
    }
    
    if (!orderData.planId || !orderData.planPrice) {
      return res.status(400).json({
        success: false,
        error: 'Información del plan requerida'
      })
    }

    console.log('📋 Datos de la orden:', {
      cliente: orderData.clientData.email,
      plan: `${orderData.planId} - $${orderData.planPrice}`,
      dominio: orderData.domainOption,
      ciclo: orderData.billingCycle
    })

    // Crear preferencia en MercadoPago
    const result = await getMercadoPagoService().createPaymentPreference(orderData)
    
    if (result.success) {
      console.log('✅ [PAYMENTS] Preferencia creada exitosamente:', result.preferenceId)
      
      res.status(200).json({
        success: true,
        preferenceId: result.preferenceId,
        initPoint: result.initPoint,
        message: 'Preferencia de pago creada exitosamente'
      })
    } else {
      console.error('❌ [PAYMENTS] Error creando preferencia:', result.error)
      
      res.status(500).json({
        success: false,
        error: result.error || 'Error creando preferencia de pago'
      })
    }
    
  } catch (error) {
    console.error('💥 [PAYMENTS] Error crítico:', error)
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error del servidor'
    })
  }
})

// Webhook de MercadoPago - CRÍTICO para automatización
router.post('/webhook', async (req, res) => {
  try {
    console.log('🔔 [WEBHOOK] Webhook recibido de MercadoPago')
    console.log('📋 Headers:', req.headers)
    console.log('📦 Body:', req.body)
    
    const { action, api_version, data, date_created, id, live_mode, type, user_id } = req.body
    
    // Responder rápidamente a MercadoPago (requerido)
    res.status(200).send('OK')
    
    // Solo procesar notificaciones de payment
    if (type !== 'payment') {
      console.log(`ℹ️ [WEBHOOK] Tipo ${type} ignorado, solo procesamos payment`)
      return
    }

    if (action !== 'payment.created' && action !== 'payment.updated') {
      console.log(`ℹ️ [WEBHOOK] Acción ${action} ignorada`)
      return
    }

    const paymentId = data?.id
    if (!paymentId) {
      console.error('❌ [WEBHOOK] No se encontró payment ID')
      return
    }

    console.log(`🔍 [WEBHOOK] Procesando pago: ${paymentId}`)
    
    // Obtener información completa del pago
    const paymentInfo = await getMercadoPagoService().getPaymentInfo(paymentId.toString())
    
    if (!paymentInfo.success) {
      console.error('❌ [WEBHOOK] Error obteniendo info del pago:', paymentInfo.error)
      return
    }

    const payment = paymentInfo.payment
    if (!payment) {
      console.error('❌ [WEBHOOK] No se pudo obtener información del pago')
      return
    }
    
    console.log('💰 [WEBHOOK] Estado del pago:', payment.status)
    console.log('📋 [WEBHOOK] Metadata:', payment.metadata)
    
    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      console.log(`⏸️ [WEBHOOK] Pago ${paymentId} en estado ${payment.status}, esperando aprobación`)
      return
    }

    console.log('🎉 [WEBHOOK] ¡PAGO APROBADO! Iniciando automatización de hosting')
    
    // Extraer metadata para automatización
    const metadata = payment.metadata
    if (!metadata || !metadata.client_email) {
      console.error('❌ [WEBHOOK] Metadata incompleta, no se puede automatizar')
      return
    }

    // Construir datos para automatización
    const automationData: HostingOrderData = {
      clientData: {
        name: metadata.client_name || 'Cliente',
        email: metadata.client_email,
        phone: metadata.client_phone || '',
        company: '',
        address: '',
        city: '',
        country: metadata.client_country || 'Argentina',
        zipCode: ''
      },
      planId: metadata.plan_id,
      billingCycle: metadata.billing_cycle as 'monthly' | 'yearly',
      domainOption: metadata.domain_option as 'subdomain' | 'own-domain' | 'register-new',
      customDomain: metadata.custom_domain,
      subdomainName: metadata.subdomain_name
    }

    console.log('🚀 [WEBHOOK] Iniciando automatización con datos:', {
      email: automationData.clientData.email,
      plan: automationData.planId,
      domain: automationData.domainOption
    })

    // EJECUTAR AUTOMATIZACIÓN COMPLETA
    const automationResult = await getHostingService().processHostingOrder(automationData)
    
    if (automationResult.success) {
      console.log('🎊 [WEBHOOK] ¡AUTOMATIZACIÓN COMPLETADA EXITOSAMENTE!')
      console.log('📊 [WEBHOOK] Cuenta creada:', {
        domain: automationResult.accountDetails?.domain,
        username: automationResult.accountDetails?.username,
        cpanel: automationResult.accountDetails?.cpanelUrl
      })
      
      // TODO: Actualizar base de datos con el pago y cuenta creada
      // TODO: Enviar email de confirmación adicional si es necesario
      
    } else {
      console.error('💥 [WEBHOOK] Error en automatización:', automationResult.errors)
      // TODO: Manejar fallo de automatización (reintento, notificación manual, etc.)
    }
    
  } catch (error) {
    console.error('💥 [WEBHOOK] Error crítico procesando webhook:', error)
    // No reenviamos error a MercadoPago, ya enviamos 200 OK
  }
})

// Verificar estado de pago (para frontend)
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params
    
    console.log(`🔍 [PAYMENTS] Consultando estado del pago: ${paymentId}`)
    
    const result = await getMercadoPagoService().getPaymentInfo(paymentId)
    
    if (result.success) {
      res.json({
        success: true,
        payment: result.payment
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      })
    }
    
  } catch (error) {
    console.error('❌ [PAYMENTS] Error consultando pago:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error del servidor'
    })
  }
})

export default router