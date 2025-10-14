import React, { useState } from 'react'
import { X, CreditCard, Globe, User, Building, Server, Check, AlertTriangle, ArrowLeft, ArrowRight, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LoginForm } from './auth/LoginForm'
import { RegisterForm } from './auth/RegisterForm'
import type { HostingPlan, ClientData, DomainInfo } from '../types/hosting'

interface HostingPurchaseFormProps {
  selectedPlan: HostingPlan
  onClose: () => void
  onSubmit: (data: { clientData: ClientData; domainInfo: DomainInfo }) => void
}

interface FormErrors {
  [key: string]: string
}

export default function HostingPurchaseForm({ selectedPlan, onClose, onSubmit }: HostingPurchaseFormProps) {
  const { user, token } = useAuth()
  const [step, setStep] = useState(user ? 1 : 0) // 0 = auth, 1 = plan info, 2 = domain, 3 = payment
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  
  // Client Data State
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: 'Argentina',
    zipCode: ''
  })

  // Domain Info State
  const [domainInfo, setDomainInfo] = useState<DomainInfo>({
    name: '',
    action: 'register',
    registrationYears: 1
  })
  
  // Nueva opción de dominio
  const [domainOption, setDomainOption] = useState<'subdomain' | 'own-domain' | 'register-new'>('subdomain')
  const [previewSubdomain, setPreviewSubdomain] = useState('')

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {}

    if (stepNumber === 2) {
      // Validate domain info based on selected option
      if (domainOption === 'subdomain') {
        if (!previewSubdomain.trim()) {
          newErrors.subdomain = 'El nombre del subdominio es requerido'
        } else if (previewSubdomain.length < 3) {
          newErrors.subdomain = 'El subdominio debe tener al menos 3 caracteres'
        }
      } else if (domainOption === 'own-domain' || domainOption === 'register-new') {
        if (!domainInfo.name.trim()) {
          newErrors.domain = 'El dominio es requerido'
        } else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i.test(domainInfo.name)) {
          newErrors.domain = 'Formato de dominio inválido (ej: miempresa.com)'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    try {
      console.log('💳 Iniciando proceso de pago con MercadoPago...')
      
      // Preparar datos para MercadoPago
      const finalClientData = {
        name: user?.name || clientData.name || 'Cliente',
        email: user?.email || clientData.email,
        phone: user?.phone || clientData.phone || '',
        country: 'Argentina'
      }
      
      // Calcular precio del dominio si aplica
      let domainPrice = 0
      if (domainOption === 'register-new') {
        domainPrice = getDomainPrice(domainInfo.name)
      }
      
      const paymentData = {
        clientData: finalClientData,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planPrice: selectedPlan.price,
        billingCycle: selectedPlan.billingCycle,
        domainOption,
        customDomain: domainOption === 'register-new' || domainOption === 'own-domain' ? domainInfo.name : undefined,
        subdomainName: domainOption === 'subdomain' ? previewSubdomain : undefined,
        domainPrice
      }
      
      console.log('📋 Datos del pago:', paymentData)
      
      // Crear preferencia de pago en MercadoPago
      const response = await fetch('https://lanzawebar.com/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.initPoint) {
        console.log('✅ Preferencia de pago creada:', result.preferenceId)
        
        // Mostrar mensaje informativo antes de redireccionar
        const infoMessage = `
💳 ¡Perfecto! Ahora procederemos al pago seguro.

🔒 Serás redirigido a MercadoPago para completar tu compra de forma segura.

🎯 Después del pago exitoso:
• Tu hosting se creará AUTOMÁTICAMENTE
• Recibirás las credenciales por email
• Tu sitio estará listo en minutos

🚀 ¡Presiona OK para ir a pagar!
        `
        
        if (confirm(infoMessage)) {
          // Cerrar modal antes de redireccionar
          onClose()
          
          // Redireccionar a MercadoPago
          window.location.href = result.initPoint
        }
      } else {
        throw new Error(result.error || 'Error creando preferencia de pago')
      }
      
    } catch (error) {
      console.error('❌ Error en proceso de pago:', error)
      alert(`❌ Error procesando el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const getDomainPrice = (domainName: string) => {
    if (!domainName || domainInfo.action !== 'register') return 0
    
    // Extraer extensión del dominio
    const extension = domainName.toLowerCase().split('.').slice(-2).join('.') || domainName.toLowerCase().split('.').pop() || ''
    
    // Precios según extensión
    const domainPrices: { [key: string]: number } = {
      'com': 2500,
      'net': 2500, 
      'org': 2500,
      'com.ar': 8000,
      'blog': 4500,
      'pro': 4500,
      'cl': 4500
    }
    
    return domainPrices[extension] || 2500 // Default a precio premium si no se encuentra
  }

  const calculateTotal = () => {
    const planPrice = selectedPlan.billingCycle === 'yearly' ? selectedPlan.price * 10 : selectedPlan.price
    let domainPrice = 0
    
    if (domainOption === 'register-new') {
      domainPrice = getDomainPrice(domainInfo.name)
    }
    // subdominio y dominio propio son gratis
    
    return planPrice + domainPrice
  }

  const renderStepIndicator = () => {
    const steps = user 
      ? ['Configuración', 'Dominio', 'Pago']
      : ['Autenticación', 'Configuración', 'Dominio', 'Pago']

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((stepName, index) => {
          const stepNumber = user ? index + 1 : index
          const isActive = step === stepNumber
          const isCompleted = step > stepNumber
          
          return (
            <React.Fragment key={stepNumber}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'border-green-500 text-green-400 bg-green-500/10' :
                'border-gray-600 text-gray-400'
              }`}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                  step > stepNumber ? 'bg-green-500' : 'bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const renderAuthStep = () => {
    if (user) return null

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Server className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Inicia sesión para continuar
          </h3>
          <p className="text-gray-400">
            Necesitas una cuenta para contratar nuestros servicios de hosting
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-800/50 p-1 rounded-xl flex">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === 'login'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === 'register'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {authMode === 'login' ? (
            <LoginForm 
              onSuccess={() => setStep(1)}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={() => setStep(1)}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Contratar Hosting</h2>
            <p className="text-gray-300">Plan: {selectedPlan.name} - ${selectedPlan.price}/mes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {renderStepIndicator()}
          
          {/* Content */}
          {step === 0 && renderAuthStep()}

          {/* Main Steps */}
          {step === 1 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Configuración del Servicio
                </h3>
                <p className="text-gray-400">
                  El usuario autenticado usará su información de cuenta para el servicio
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedPlan.name}</h4>
                    <p className="text-gray-400 text-sm">${selectedPlan.price}/mes - {selectedPlan.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-2">Especificaciones</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {selectedPlan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-2">Usuario del Servicio</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nombre:</span>
                        <span className="text-white">{user?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 transition-all"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Configuración del Dominio
                </h3>
                <p className="text-gray-400">
                  Elige cómo quieres configurar tu sitio web
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {/* Opción Subdominio Gratis */}
                <label className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  domainOption === 'subdomain' 
                    ? 'border-green-500 bg-green-500/10 shadow-green-500/20 shadow-lg' 
                    : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                }`}>
                  <input
                    type="radio"
                    name="domainOption"
                    value="subdomain"
                    checked={domainOption === 'subdomain'}
                    onChange={(e) => setDomainOption(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                        domainOption === 'subdomain' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-600'
                      }`}>
                        {domainOption === 'subdomain' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                          🎉 Subdominio GRATIS
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">RECOMENDADO</span>
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          Tu sitio estará disponible en: <strong className="text-white">tu-nombre.lanzawebar.com</strong>
                        </p>
                        <p className="text-green-400 text-xs">
                          Perfecto para comenzar sin costo adicional
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-400">$0</span>
                  </div>
                </label>

                {/* Opción Dominio Propio */}
                <label className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  domainOption === 'own-domain'
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-cyan-500/20 shadow-lg'
                    : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                }`}>
                  <input
                    type="radio"
                    name="domainOption"
                    value="own-domain"
                    checked={domainOption === 'own-domain'}
                    onChange={(e) => setDomainOption(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                        domainOption === 'own-domain' 
                          ? 'border-cyan-500 bg-cyan-500' 
                          : 'border-gray-600'
                      }`}>
                        {domainOption === 'own-domain' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          Ya tengo mi dominio
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          Usar tu dominio ya registrado (ej: miempresa.com)
                        </p>
                        <p className="text-cyan-400 text-xs">
                          Configuraremos el DNS por ti
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-400">$0</span>
                  </div>
                </label>

                {/* Opción Registrar Nuevo */}
                <label className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  domainOption === 'register-new'
                    ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg'
                    : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                }`}>
                  <input
                    type="radio"
                    name="domainOption"
                    value="register-new"
                    checked={domainOption === 'register-new'}
                    onChange={(e) => setDomainOption(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                        domainOption === 'register-new' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-600'
                      }`}>
                        {domainOption === 'register-new' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          Registrar dominio nuevo
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          Registramos el dominio que elijas (.com, .com.ar, etc.)
                        </p>
                        <p className="text-orange-400 text-xs">
                          Incluye gestión completa del dominio
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-400">desde $2.500/año</span>
                  </div>
                </label>
              </div>

              {/* Campo para subdominio */}
              {domainOption === 'subdomain' && (
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Elige tu subdominio *
                  </label>
                  <div className="flex items-center bg-gray-800 rounded-xl border border-gray-600 overflow-hidden">
                    <input
                      type="text"
                      value={previewSubdomain}
                      onChange={(e) => {
                        const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                        setPreviewSubdomain(cleaned)
                      }}
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                      placeholder="mi-empresa"
                    />
                    <div className="px-4 py-3 bg-gray-700 text-gray-300 text-sm font-medium">
                      .lanzawebar.com
                    </div>
                  </div>
                  {previewSubdomain && (
                    <p className="mt-2 text-green-400 text-sm">
                      ✓ Tu sitio estará disponible en: <strong>{previewSubdomain}.lanzawebar.com</strong>
                    </p>
                  )}
                  {errors.subdomain && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.subdomain}
                    </p>
                  )}
                </div>
              )}

              {/* Campo para dominio propio o nuevo */}
              {(domainOption === 'own-domain' || domainOption === 'register-new') && (
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {domainOption === 'own-domain' ? 'Tu dominio existente *' : 'Dominio a registrar *'}
                  </label>
                  <input
                    type="text"
                    value={domainInfo.name}
                    onChange={(e) => setDomainInfo({ ...domainInfo, name: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="miempresa.com"
                  />
                  {domainInfo.name && domainOption === 'register-new' && (
                    <p className="mt-2 text-blue-400 text-sm">
                      Precio estimado: <strong>${getDomainPrice(domainInfo.name).toLocaleString('es-AR')}/año</strong>
                    </p>
                  )}
                  {errors.domain && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.domain}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <button
                  onClick={() => validateStep(2) && setStep(3)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 transition-all"
                >
                  Finalizar Compra
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Resumen de la Compra
                </h3>
                <p className="text-gray-400">
                  Revisa los detalles antes de finalizar
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Plan {selectedPlan.name}</span>
                    <span className="text-white font-semibold">${selectedPlan.price}/mes</span>
                  </div>
                  
                  {domainOption === 'subdomain' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subdominio: {previewSubdomain}.lanzawebar.com</span>
                      <span className="text-green-400 font-semibold">GRATIS</span>
                    </div>
                  )}
                  
                  {domainOption === 'own-domain' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Dominio: {domainInfo.name}</span>
                      <span className="text-green-400 font-semibold">GRATIS</span>
                    </div>
                  )}
                  
                  {domainOption === 'register-new' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Registro de dominio: {domainInfo.name}</span>
                      <span className="text-white font-semibold">${getDomainPrice(domainInfo.name).toLocaleString('es-AR')}/año</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-600" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      ${calculateTotal().toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Contratar Ahora
                      <CreditCard className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}