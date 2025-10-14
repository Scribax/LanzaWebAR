import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// Definir types para TypeScript
export interface User {
  id: number
  email: string
  password_hash: string
  name: string
  phone?: string
  created_at: string
  status: 'active' | 'suspended'
}

export interface Order {
  id: number
  user_id: number
  plan_id: string
  domain_option: 'subdomain' | 'own-domain' | 'register-new'
  domain_name: string
  total_amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  mercadopago_payment_id?: string
  created_at: string
  paid_at?: string
}

export interface HostingService {
  id: number
  order_id: number
  user_id: number
  whm_username?: string
  whm_password?: string
  domain: string
  cpanel_url?: string
  plan_name: string
  status: 'creating' | 'active' | 'suspended' | 'cancelled'
  created_at: string
  expires_at?: string
}

class Database {
  private db: any

  async initialize() {
    // Crear base de datos en el directorio del servidor
    const dbPath = './database.sqlite'
    
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Crear tablas
    await this.createTables()
    console.log('✅ Base de datos inicializada correctamente')
  }

  private async createTables() {
    // Tabla de usuarios
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active'
      )
    `)

    // Tabla de órdenes
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id TEXT NOT NULL,
        domain_option TEXT NOT NULL,
        domain_name TEXT NOT NULL,
        total_amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'ARS',
        status TEXT DEFAULT 'pending',
        mercadopago_payment_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        paid_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // Tabla de servicios de hosting
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS hosting_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        whm_username TEXT,
        whm_password TEXT,
        domain TEXT NOT NULL,
        cpanel_url TEXT,
        plan_name TEXT NOT NULL,
        status TEXT DEFAULT 'creating',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    console.log('📊 Tablas de base de datos creadas')
  }

  // Métodos para usuarios
  async createUser(email: string, passwordHash: string, name: string, phone?: string): Promise<User> {
    const result = await this.db.run(
      'INSERT INTO users (email, password_hash, name, phone) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name, phone]
    )

    const user = await this.getUserById(result.lastID)
    if (!user) {
      throw new Error('Failed to create user')
    }
    return user
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id])
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.db.get('SELECT * FROM users WHERE email = ?', [email])
  }

  // Métodos para órdenes
  async createOrder(
    userId: number, 
    type: string, 
    planId: string, 
    totalAmount: number, 
    status: string = 'pending',
    detailsJson?: string
  ): Promise<Order> {
    // Extraer detalles del JSON si está disponible
    let domainOption = 'subdomain'
    let domainName = 'example.com'
    
    if (detailsJson) {
      try {
        const details = JSON.parse(detailsJson)
        domainOption = details.domainOption || 'subdomain'
        domainName = details.domainName || details.subdomainName || 'example.com'
      } catch (e) {
        console.warn('Error parseando detalles de orden:', e)
      }
    }
    
    const result = await this.db.run(
      `INSERT INTO orders (user_id, plan_id, domain_option, domain_name, total_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, planId, domainOption, domainName, totalAmount, status]
    )

    const order = await this.getOrderById(result.lastID)
    if (!order) {
      throw new Error('Failed to create order')
    }
    return order
  }

  async getOrderById(id: number): Promise<Order | null> {
    return await this.db.get('SELECT * FROM orders WHERE id = ?', [id])
  }

  async updateOrderStatus(id: number, status: string, paymentId?: string): Promise<void> {
    if (paymentId) {
      await this.db.run(
        'UPDATE orders SET status = ?, mercadopago_payment_id = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, paymentId, id]
      )
    } else {
      await this.db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id])
    }
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId])
  }

  // Métodos para servicios de hosting
  async createHostingService(serviceData: {
    order_id: number
    user_id: number
    domain: string
    plan_name: string
    whm_username?: string
    whm_password?: string
    cpanel_url?: string
  }): Promise<HostingService> {
    const result = await this.db.run(
      `INSERT INTO hosting_services (order_id, user_id, domain, plan_name, whm_username, whm_password, cpanel_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [serviceData.order_id, serviceData.user_id, serviceData.domain, serviceData.plan_name, 
       serviceData.whm_username, serviceData.whm_password, serviceData.cpanel_url]
    )

    const service = await this.getHostingServiceById(result.lastID)
    if (!service) {
      throw new Error('Failed to create hosting service')
    }
    return service
  }

  async getHostingServiceById(id: number): Promise<HostingService | null> {
    return await this.db.get('SELECT * FROM hosting_services WHERE id = ?', [id])
  }

  async getUserHostingServices(userId: number): Promise<HostingService[]> {
    return await this.db.all(
      'SELECT * FROM hosting_services WHERE user_id = ? ORDER BY created_at DESC', 
      [userId]
    )
  }

  async updateHostingServiceStatus(id: number, status: string): Promise<void> {
    await this.db.run('UPDATE hosting_services SET status = ? WHERE id = ?', [status, id])
  }

  // Cerrar conexión
  async close() {
    if (this.db) {
      await this.db.close()
    }
  }
}

// Instancia singleton de la base de datos
export const database = new Database()

// Función para inicializar la base de datos
export async function initializeDatabase() {
  await database.initialize()
}