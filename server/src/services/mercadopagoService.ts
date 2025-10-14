// Servicio MercadoPago para pagos reales de hosting
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

export interface HostingOrderRequest {
  clientData: {
    name: string
    email: string
    phone: string
    country: string
  }
  planId: string
  planName: string
  planPrice: number
  billingCycle: 'monthly' | 'yearly'
  domainOption: 'subdomain' | 'own-domain' | 'register-new'
  customDomain?: string
  subdomainName?: string
  domainPrice?: number
}

export interface PaymentPreferenceResponse {
  success: boolean
  preferenceId?: string
  initPoint?: string
  sandboxInitPoint?: string
  error?: string
}

class MercadoPagoService {
  private client: MercadoPagoConfig
  private preferenceClient: Preference
  private paymentClient: Payment

  constructor() {
    // Verificar que las credenciales estén disponibles
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    console.log('🔍 Verificando credenciales MercadoPago:')
    console.log('- Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : '❌ NO ENCONTRADO')
    console.log('- Public Key:', process.env.MERCADOPAGO_PUBLIC_KEY ? '✅ Disponible' : '❌ NO ENCONTRADO')
    
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno')
    }
    
    // Configurar cliente MercadoPago con credenciales de producción
    this.client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 10000
      }
    })

    this.preferenceClient = new Preference(this.client)
    this.paymentClient = new Payment(this.client)

    console.log('🏦 MercadoPago Service iniciado con credenciales de PRODUCCIÓN')
  }

  // Crear preferencia de pago para hosting
  async createPaymentPreference(orderData: HostingOrderRequest): Promise<PaymentPreferenceResponse> {
    try {
      console.log('💳 Creando preferencia de pago para:', orderData.clientData.email)

      // Calcular precio total
      const planPrice = orderData.billingCycle === 'yearly' 
        ? orderData.planPrice * 10 // Descuento anual
        : orderData.planPrice

      const domainPrice = orderData.domainPrice || 0
      const totalAmount = planPrice + domainPrice

      // Generar ID único para la orden
      const orderId = `hosting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Crear título descriptivo
      const title = `Hosting ${orderData.planName} - ${orderData.billingCycle === 'yearly' ? '12 meses' : '1 mes'}`
      
      // Descripción del dominio
      let domainDescription = ''
      if (orderData.domainOption === 'subdomain') {
        domainDescription = ` + Subdominio: ${orderData.subdomainName}.lanzawebar.com`
      } else if (orderData.domainOption === 'own-domain') {
        domainDescription = ` + Dominio propio: ${orderData.customDomain}`
      } else if (orderData.domainOption === 'register-new') {
        domainDescription = ` + Registro dominio: ${orderData.customDomain}`
      }

      const preferenceBody = {
        items: [
          {
            id: orderData.planId,
            title: title + domainDescription,
            category_id: 'services',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: totalAmount
          }
        ],
        payer: {
          name: orderData.clientData.name,
          email: orderData.clientData.email
        },
        back_urls: {
          success: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:5173/payment/success',
          failure: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:5173/payment/failure',
          pending: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:5173/payment/pending'
        },
        auto_return: 'approved',
        external_reference: orderId,
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`,
        metadata: {
          plan_id: orderData.planId,
          plan_name: orderData.planName,
          billing_cycle: orderData.billingCycle,
          domain_option: orderData.domainOption,
          custom_domain: orderData.customDomain || '',
          subdomain_name: orderData.subdomainName || '',
          client_name: orderData.clientData.name,
          client_email: orderData.clientData.email,
          client_phone: orderData.clientData.phone,
          client_country: orderData.clientData.country,
          order_id: orderId
        },
        statement_descriptor: 'LANZAWEB HOSTING'
      }

      console.log('📋 Creando preferencia con datos:', {
        total: totalAmount,
        plan: orderData.planName,
        domain: orderData.domainOption,
        orderId
      })

      const preference = await this.preferenceClient.create({ body: preferenceBody })

      console.log('✅ Preferencia creada:', preference.id)

      return {
        success: true,
        preferenceId: preference.id!,
        initPoint: preference.init_point!,
        sandboxInitPoint: preference.sandbox_init_point
      }

    } catch (error) {
      console.error('❌ Error creando preferencia:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Obtener información de un pago
  async getPaymentInfo(paymentId: string) {
    try {
      console.log(`🔍 Obteniendo información del pago: ${paymentId}`)
      
      const payment = await this.paymentClient.get({ id: paymentId })
      
      return {
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          transaction_amount: payment.transaction_amount,
          currency_id: payment.currency_id,
          date_approved: payment.date_approved,
          date_created: payment.date_created,
          external_reference: payment.external_reference,
          metadata: payment.metadata,
          payer: {
            email: payment.payer?.email,
            identification: payment.payer?.identification
          }
        }
      }
    } catch (error) {
      console.error('❌ Error obteniendo pago:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Verificar webhook signature (seguridad)
  verifyWebhookSignature(body: any, signature: string): boolean {
    // TODO: Implementar verificación de firma webhook
    // Por ahora aceptamos todos los webhooks
    console.log('⚠️ Verificación de webhook signature pendiente de implementar')
    return true
  }
}

export default MercadoPagoService