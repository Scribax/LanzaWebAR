// WHM API Integration Service
// Este archivo contiene las funciones para conectar con tu WHM reseller API

export interface WHMConfig {
  baseUrl: string
  username: string
  accessHash?: string // Hash de acceso de WHM
  password?: string // Contraseña alternativa
}

export interface CreateAccountParams {
  username: string
  password: string
  domain: string
  plan: string // Paquete de hosting (ej: 'starter', 'business', 'professional')
  contactemail: string
  cgi?: number
  frontpage?: number
  hasshell?: number
  contactemail2?: string
  quota?: number // Espacio en MB
  maxftp?: number
  maxemaillists?: number
  maxpop?: number
  maxsub?: number
  maxpark?: number
  maxaddon?: number
  bwlimit?: number // Ancho de banda en MB
  customip?: string
}

export interface WHMResponse {
  metadata: {
    result: number
    reason: string
    version: number
  }
  data?: any
}

class WHMApiService {
  private config: WHMConfig

  constructor(config: WHMConfig) {
    this.config = config
  }

  // Headers básicos para todas las requests a WHM
  private getHeaders(): Record<string, string> {
    const auth = this.config.accessHash 
      ? `WHM ${this.config.username}:${this.config.accessHash}`
      : `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`
    
    return {
      'Authorization': auth,
      'User-Agent': 'LanzaWebAR-API/1.0'
    }
  }

  // Crear cuenta de hosting
  async createAccount(params: CreateAccountParams): Promise<WHMResponse> {
    try {
      // Convertir parámetros a query string para WHM
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
      
      const url = `${this.config.baseUrl}/json-api/createacct?${queryParams.toString()}`
      
      const response = await fetch(url, {
        method: 'GET', // WHM usa GET para la mayoría de endpoints
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`WHM API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // WHM puede devolver diferentes formatos
      if (data.status === 1 || data.metadata?.result === 1) {
        return { metadata: { result: 1, reason: 'Success', version: 1 }, data }
      } else {
        return { metadata: { result: 0, reason: data.statusmsg || data.error || 'Unknown error', version: 1 } }
      }
    } catch (error) {
      console.error('Error creating account:', error)
      throw error
    }
  }

  // Suspender cuenta
  async suspendAccount(username: string, reason?: string): Promise<WHMResponse> {
    try {
      const params = {
        user: username,
        reason: reason || 'Payment overdue'
      }

      const response = await fetch(
        `${this.config.baseUrl}/json-api/suspendacct`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(params)
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error suspending account:', error)
      throw error
    }
  }

  // Reactivar cuenta
  async unsuspendAccount(username: string): Promise<WHMResponse> {
    try {
      const params = { user: username }

      const response = await fetch(
        `${this.config.baseUrl}/json-api/unsuspendacct`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(params)
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error unsuspending account:', error)
      throw error
    }
  }

  // Obtener información de cuenta
  async getAccountInfo(username: string): Promise<WHMResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/json-api/accountsummary?user=${username}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error getting account info:', error)
      throw error
    }
  }

  // Listar paquetes disponibles
  async listPackages(): Promise<WHMResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/json-api/listpkgs`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error listing packages:', error)
      throw error
    }
  }

  // Cambiar paquete de una cuenta
  async changePackage(username: string, packageName: string): Promise<WHMResponse> {
    try {
      const params = {
        user: username,
        pkg: packageName
      }

      const response = await fetch(
        `${this.config.baseUrl}/json-api/changepackage`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(params)
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error changing package:', error)
      throw error
    }
  }

  // Obtener uso de recursos de una cuenta
  async getAccountUsage(username: string): Promise<WHMResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/json-api/showbw?search=${username}&searchtype=user`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      )

      return await response.json()
    } catch (error) {
      console.error('Error getting account usage:', error)
      throw error
    }
  }

  // Generar subdominio único para cliente
  generateUniqueSubdomain(clientName: string, email: string): string {
    // Limpiar nombre del cliente
    const cleanName = clientName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15)
    
    // Agregar sufijo único basado en timestamp
    const timestamp = Date.now().toString().slice(-4)
    
    return `${cleanName}${timestamp}`
  }

  // Crear cuenta con automatización completa
  async createAccountAutomated({
    clientName,
    clientEmail,
    planId,
    domainOption,
    customDomain
  }: {
    clientName: string
    clientEmail: string
    planId: string
    domainOption: 'subdomain' | 'own-domain' | 'register-new'
    customDomain?: string
  }): Promise<{
    success: boolean
    accountDetails?: {
      username: string
      password: string
      domain: string
      cpanelUrl: string
      email: string
    }
    error?: string
  }> {
    try {
      // Generar username único
      const username = this.generateUniqueSubdomain(clientName, clientEmail)
      
      // Generar password seguro
      const password = this.generateSecurePassword()
      
      // Determinar dominio según opción
      let domain: string
      
      if (domainOption === 'subdomain') {
        domain = `${username}.lanzawebar.com`
      } else if (domainOption === 'own-domain' && customDomain) {
        domain = customDomain
      } else if (domainOption === 'register-new' && customDomain) {
        // TODO: Integrar con Namecheap para registro automático
        domain = customDomain
      } else {
        throw new Error('Opción de dominio inválida')
      }
      
      // Mapear plan a paquete WHM (con prefijo de reseller)
      const packageMap = {
        'basico': 'lanzawe1_lanza_basico',
        'intermedio': 'lanzawe1_lanza_pro', 
        'premium': 'lanzawe1_lanza_premium'
      }
      
      const whmPackage = packageMap[planId as keyof typeof packageMap] || 'lanza_basico'
      
      // Crear cuenta en WHM
      const createParams: CreateAccountParams = {
        username,
        password,
        domain,
        plan: whmPackage,
        contactemail: clientEmail,
        cgi: 1,
        frontpage: 0,
        hasshell: 0
      }
      
      const response = await this.createAccount(createParams)
      
      if (response.metadata.result === 1) {
        return {
          success: true,
          accountDetails: {
            username,
            password,
            domain,
            cpanelUrl: `https://blue106.dnsmisitio.net:2083`,
            email: clientEmail
          }
        }
      } else {
        throw new Error(response.metadata.reason)
      }
      
    } catch (error) {
      console.error('Error in automated account creation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
  
  // Generar password seguro
  private generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    return password
  }
}

// Función para inicializar el servicio WHM
export function createWHMService(): WHMApiService {
  // Estas variables deberían venir de variables de entorno
  const config: WHMConfig = {
    baseUrl: process.env.REACT_APP_WHM_BASE_URL || 'https://your-server.com:2087',
    username: process.env.REACT_APP_WHM_USERNAME || 'root',
    accessHash: process.env.REACT_APP_WHM_ACCESS_HASH || ''
  }

  return new WHMApiService(config)
}

// Utilidades para generar datos de cuenta
export const accountUtils = {
  // Generar username único basado en dominio
  generateUsername: (domain: string): string => {
    const cleanDomain = domain.replace(/\./g, '').toLowerCase()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `${cleanDomain}${randomSuffix}`.substring(0, 16) // Max 16 chars
  },

  // Generar password seguro
  generatePassword: (length: number = 12): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  },

  // Mapear plan del frontend a paquete WHM
  mapPlanToPackage: (planId: string): string => {
    const mapping = {
      'basico': 'basico_package',
      'intermedio': 'pro_package', 
      'premium': 'premium_package'
    }
    return mapping[planId as keyof typeof mapping] || 'basico_package'
  },

  // Validar dominio
  validateDomain: (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/
    return domainRegex.test(domain)
  }
}

export default WHMApiService