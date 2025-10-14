import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Loader, CheckCircle } from 'lucide-react'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register, loading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  })

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    if (name === 'name') {
      if (!value.trim()) {
        errors.name = 'El nombre es requerido'
      } else if (value.trim().length < 2) {
        errors.name = 'Mínimo 2 caracteres'
      }
    }
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        errors.email = 'El email es requerido'
      } else if (!emailRegex.test(value)) {
        errors.email = 'El email no es válido'
      }
    }
    
    if (name === 'phone' && value) {
      const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/
      if (!phoneRegex.test(value)) {
        errors.phone = 'Formato de teléfono inválido'
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'La contraseña es requerida'
      } else if (passwordStrength.score < 3) {
        errors.password = 'La contraseña no es lo suficientemente segura'
      }
    }
    
    if (name === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Confirma tu contraseña'
      } else if (value !== formData.password) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    return errors
  }

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
    
    const score = Object.values(requirements).filter(Boolean).length
    setPasswordStrength({ score, requirements })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Verificar fortaleza de contraseña
    if (name === 'password') {
      checkPasswordStrength(value)
    }
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos los campos
    const nameErrors = validateField('name', formData.name)
    const emailErrors = validateField('email', formData.email)
    const phoneErrors = validateField('phone', formData.phone)
    const passwordErrors = validateField('password', formData.password)
    const confirmPasswordErrors = validateField('confirmPassword', formData.confirmPassword)
    
    const allErrors = { ...nameErrors, ...emailErrors, ...phoneErrors, ...passwordErrors, ...confirmPasswordErrors }
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      return
    }

    const success = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone || undefined
    )
    
    if (success) {
      onSuccess?.()
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'text-red-400'
    if (passwordStrength.score <= 2) return 'text-yellow-400'
    if (passwordStrength.score <= 3) return 'text-blue-400'
    return 'text-green-400'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 1) return 'Muy débil'
    if (passwordStrength.score <= 2) return 'Débil'
    if (passwordStrength.score <= 3) return 'Buena'
    return 'Fuerte'
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-gray-400">Únete a LanzaWebAR</p>
        </div>

        {/* Error General */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.name 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                }`}
                placeholder="Tu nombre completo"
              />
            </div>
            {fieldErrors.name && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.email 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                }`}
                placeholder="tu@email.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Teléfono <span className="text-gray-500">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.phone 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                }`}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                }`}
                placeholder="Crea una contraseña segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Fortaleza de contraseña</span>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 rounded-full flex-1 transition-colors duration-200 ${
                        passwordStrength.score >= level
                          ? passwordStrength.score <= 1 ? 'bg-red-500'
                            : passwordStrength.score <= 2 ? 'bg-yellow-500'
                            : passwordStrength.score <= 3 ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                    <div key={key} className={`flex items-center gap-1 ${met ? 'text-green-400' : 'text-gray-500'}`}>
                      {met ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      <span>
                        {key === 'length' && '8+ caracteres'}
                        {key === 'uppercase' && 'Mayúscula'}
                        {key === 'lowercase' && 'Minúscula'}
                        {key === 'number' && 'Número'}
                        {key === 'special' && 'Especial'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {fieldErrors.password && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                    ? 'border-green-500 focus:ring-green-500/20'
                    : 'border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                }`}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            {onSwitchToLogin ? (
              <button
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            ) : (
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}