// Webhook Handler Service
// Este servicio maneja los webhooks de MercadoPago/otros procesadores de pago
// y automatiza la creación de cuentas de hosting

import { createWHMService, accountUtils } from './whmApi'
import type { WebhookPayload, HostingOrder, ClientData, DomainInfo } from '../types/hosting'

export interface PaymentWebhookData {
  orderId: string
  paymentId: string
  status: 'approved' | 'rejected' | 'cancelled' | 'pending'
  amount: number
  currency: string
  paymentMethod: string
  paidAt?: Date
  customerEmail: string
  metadata?: {
    planId: string
    domain: string
    billingCycle: string
  }
}

export interface WebhookProcessResult {
  success: boolean
  message: string
  accountCreated?: boolean
  accountDetails?: {
    username: string
    cpanelUrl: string
    temporaryPassword: string
  }
  error?: string
}

class WebhookHandler {
  private whmService = createWHMService()

  // Procesar webhook de MercadoPago
  async processMercadoPagoWebhook(webhookData: any): Promise<WebhookProcessResult> {
    try {
      console.log('Processing MercadoPago webhook:', webhookData)

      // Mapear datos de MercadoPago a nuestro formato
      const paymentData: PaymentWebhookData = {
        orderId: webhookData.external_reference || webhookData.metadata?.order_id,
        paymentId: webhookData.id.toString(),
        status: this.mapMercadoPagoStatus(webhookData.status),
        amount: webhookData.transaction_amount,
        currency: webhookData.currency_id,
        paymentMethod: webhookData.payment_method_id,
        paidAt: new Date(webhookData.date_approved),
        customerEmail: webhookData.payer?.email,
        metadata: webhookData.metadata
      }

      return await this.processPayment(paymentData)
    } catch (error) {
      console.error('Error processing MercadoPago webhook:', error)
      return {
        success: false,
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Procesar webhook de Stripe
  async processStripeWebhook(webhookData: any): Promise<WebhookProcessResult> {
    try {
      console.log('Processing Stripe webhook:', webhookData)

      const paymentData: PaymentWebhookData = {
        orderId: webhookData.metadata?.order_id,
        paymentId: webhookData.id,
        status: webhookData.status === 'succeeded' ? 'approved' : 'rejected',
        amount: webhookData.amount / 100, // Stripe usa centavos
        currency: webhookData.currency.toUpperCase(),
        paymentMethod: webhookData.payment_method?.type || 'card',
        paidAt: new Date(webhookData.created * 1000),
        customerEmail: webhookData.receipt_email || webhookData.billing_details?.email,
        metadata: webhookData.metadata
      }

      return await this.processPayment(paymentData)
    } catch (error) {
      console.error('Error processing Stripe webhook:', error)
      return {
        success: false,
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Lógica principal para procesar pagos aprobados
  private async processPayment(paymentData: PaymentWebhookData): Promise<WebhookProcessResult> {
    try {
      // Solo procesar pagos aprobados
      if (paymentData.status !== 'approved') {
        return {
          success: true,
          message: `Payment status is ${paymentData.status}, no action needed`
        }
      }

      // Buscar la orden en tu base de datos (aquí usarías tu sistema de base de datos)
      const orderData = await this.getOrderData(paymentData.orderId)
      if (!orderData) {
        return {
          success: false,
          message: 'Order not found',
          error: `Order ID ${paymentData.orderId} not found`
        }
      }

      // Crear cuenta de hosting automáticamente
      const accountResult = await this.createHostingAccount(orderData, paymentData)
      
      if (accountResult.success) {
        // Enviar email de bienvenida con credenciales
        await this.sendWelcomeEmail(orderData, accountResult.accountDetails!)
        
        // Actualizar estado de la orden en la base de datos
        await this.updateOrderStatus(paymentData.orderId, 'active')

        return accountResult
      } else {
        return accountResult
      }

    } catch (error) {
      console.error('Error processing payment:', error)
      return {
        success: false,
        message: 'Failed to process payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Crear cuenta de hosting usando WHM API
  private async createHostingAccount(
    orderData: any, 
    paymentData: PaymentWebhookData
  ): Promise<WebhookProcessResult> {
    try {
      // Generar datos de la cuenta
      const domain = orderData.domainInfo.name
      const username = accountUtils.generateUsername(domain)
      const password = accountUtils.generatePassword(12)
      const packageName = accountUtils.mapPlanToPackage(orderData.planId)

      // Parámetros para crear la cuenta en WHM
      const accountParams = {
        username,
        password,
        domain,
        plan: packageName,
        contactemail: orderData.clientData.email,
        quota: this.getQuotaByPlan(orderData.planId),
        bwlimit: this.getBandwidthByPlan(orderData.planId)
      }

      // Crear cuenta en WHM
      const whmResponse = await this.whmService.createAccount(accountParams)

      if (whmResponse.metadata.result === 1) {
        // Éxito - cuenta creada
        return {
          success: true,
          message: 'Hosting account created successfully',
          accountCreated: true,
          accountDetails: {
            username,
            cpanelUrl: `https://cpanel.${domain}`, // Ajusta según tu configuración
            temporaryPassword: password
          }
        }
      } else {
        // Error en WHM
        return {
          success: false,
          message: 'Failed to create hosting account',
          error: whmResponse.metadata.reason
        }
      }

    } catch (error) {
      console.error('Error creating hosting account:', error)
      return {
        success: false,
        message: 'Error creating hosting account',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Mapear status de MercadoPago
  private mapMercadoPagoStatus(status: string): PaymentWebhookData['status'] {
    const statusMap: Record<string, PaymentWebhookData['status']> = {
      'approved': 'approved',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'pending': 'pending',
      'in_process': 'pending'
    }
    return statusMap[status] || 'pending'
  }

  // Obtener datos de orden (mock - implementar con tu base de datos)
  private async getOrderData(orderId: string): Promise<any | null> {
    // TODO: Implementar consulta a tu base de datos
    // Por ahora retornamos datos mock
    console.log(`Getting order data for ID: ${orderId}`)
    
    // En producción, esto sería algo como:
    // return await database.orders.findById(orderId)
    
    return null // Placeholder
  }

  // Actualizar estado de orden (mock)
  private async updateOrderStatus(orderId: string, status: string): Promise<void> {
    // TODO: Implementar actualización en tu base de datos
    console.log(`Updating order ${orderId} status to: ${status}`)
    
    // En producción, esto sería algo como:
    // await database.orders.updateById(orderId, { status })
  }

  // Enviar email de bienvenida
  private async sendWelcomeEmail(orderData: any, accountDetails: any): Promise<void> {
    // TODO: Implementar envío de email
    console.log('Sending welcome email to:', orderData.clientData.email)
    console.log('Account details:', accountDetails)
    
    // En producción, usarías un servicio como SendGrid, Mailgun, etc.
    // const emailService = new EmailService()
    // await emailService.sendWelcomeEmail(orderData.clientData.email, accountDetails)
  }

  // Obtener quota por plan
  private getQuotaByPlan(planId: string): number {
    const quotas: Record<string, number> = {
      'basico': 2048, // 2 GB en MB
      'intermedio': 5120, // 5 GB en MB
      'premium': 10240 // 10 GB en MB
    }
    return quotas[planId] || quotas['basico']
  }

  // Obtener ancho de banda por plan
  private getBandwidthByPlan(planId: string): number {
    const bandwidths: Record<string, number> = {
      'basico': 20480, // 20 GB en MB
      'intermedio': 51200, // 50 GB en MB
      'premium': 102400 // 100 GB en MB
    }
    return bandwidths[planId] || bandwidths['basico']
  }
}

// Función para crear y usar el webhook handler
export function createWebhookHandler(): WebhookHandler {
  return new WebhookHandler()
}

export default WebhookHandler