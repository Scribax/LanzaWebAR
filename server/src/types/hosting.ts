// Tipos para hosting y webhooks

export interface ClientData {
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  country: string
  zipCode: string
}

export interface DomainInfo {
  name: string
  type: 'subdomain' | 'own-domain' | 'register-new'
  subdomain?: string
}

export interface HostingOrder {
  id: string
  clientData: ClientData
  domainInfo: DomainInfo
  planId: string
  billingCycle: 'monthly' | 'yearly'
  status: 'pending' | 'active' | 'suspended' | 'cancelled'
  createdAt: Date
  amount: number
  currency: string
}

export interface WebhookPayload {
  orderId: string
  paymentId: string
  status: 'approved' | 'rejected' | 'cancelled' | 'pending'
  amount: number
  currency: string
  paymentMethod: string
  paidAt?: Date
  customerEmail: string
  metadata?: Record<string, any>
}