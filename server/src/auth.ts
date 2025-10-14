import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { database, User } from './database'

// JWT Secret (en producción esto debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'lanzaweb-secret-key-change-in-production'

export interface AuthRequest extends Request {
  user?: User
}

// Generar JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verificar JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware de autenticación
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acceso requerido' })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }

    // Buscar usuario en la base de datos
    const user = await database.getUserById(decoded.id)
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Usuario no encontrado o desactivado' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Error en autenticación:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// Middleware de autenticación opcional (no falla si no hay token)
export async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)
      
      if (decoded) {
        const user = await database.getUserById(decoded.id)
        if (user && user.status === 'active') {
          req.user = user
        }
      }
    }

    next()
  } catch (error) {
    // En caso de error, continúa sin autenticación
    next()
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verificar password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Validar email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar password strength
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' }
  }
  
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número' }
  }

  return { valid: true }
}

// Extraer usuario del token sin validar completamente (útil para webhooks)
export function extractUserFromToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}