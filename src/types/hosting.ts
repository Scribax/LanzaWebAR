export interface HostingPlan {
  id: string
  name: string
  description: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  specs: {
    storage: string
    bandwidth: string
    databases: string
    emails: string
    domains: string
    ssl: boolean
    backup: boolean
    support: '24/7' | 'business' | 'email'
  }
  popular?: boolean
  discount?: number
}

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
  action: 'register' | 'transfer' | 'existing'
  registrationYears?: number
}

export interface HostingOrder {
  id: string
  planId: string
  clientData: ClientData
  domainInfo: DomainInfo
  billingCycle: 'monthly' | 'yearly'
  totalAmount: number
  status: 'pending' | 'processing' | 'active' | 'suspended' | 'cancelled'
  createdAt: Date
  nextBilling?: Date
}

export interface HostingService {
  id: string
  orderId: string
  planName: string
  domain: string
  status: 'active' | 'suspended' | 'cancelled'
  createdAt: Date
  expiresAt: Date
  cpanelUrl?: string
  cpanelUsername?: string
  ftpCredentials?: {
    host: string
    username: string
    password: string
  }
  specs: HostingPlan['specs']
}

export interface Invoice {
  id: string
  orderId: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidAt?: Date
  paymentMethod?: string
  downloadUrl?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaymentData {
  orderId: string
  amount: number
  currency: string
  paymentMethod: 'mercadopago' | 'stripe' | 'paypal'
  returnUrl: string
  cancelUrl: string
}

export interface WebhookPayload {
  orderId: string
  status: 'paid' | 'failed' | 'cancelled'
  paymentId: string
  amount: number
  currency: string
  paidAt: Date
}