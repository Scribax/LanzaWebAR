import React, { useState, useEffect } from 'react'
import { ChevronRightIcon, CheckIcon, StarIcon } from '@heroicons/react/24/outline'
import { ServerIcon, ShieldCheckIcon, BoltIcon, GlobeAltIcon } from '@heroicons/react/24/solid'
import type { HostingPlan } from '../types/hosting'

const hostingPlans: HostingPlan[] = [
  {
    id: 'basico',
    name: 'Lanza Básico',
    description: 'Ideal para webs personales o pequeños negocios',
    price: 2000,
    billingCycle: 'monthly',
    features: [
      '1 Dominio incluido',
      '2 GB de Almacenamiento SSD',
      '20 GB de Transferencia',
      'Cuentas de Email Ilimitadas',
      'Bases de datos Ilimitadas',
      'Subdominios Ilimitados',
      'SSL Gratis',
      'Softaculous (WordPress, etc.)',
      'cPanel completo',
      'Backup automático',
      'Soporte técnico 24/7'
    ],
    specs: {
      storage: '2 GB SSD',
      bandwidth: '20 GB',
      databases: 'Ilimitado',
      emails: 'Ilimitado',
      domains: '1',
      ssl: true,
      backup: true,
      support: '24/7'
    }
  },
  {
    id: 'intermedio',
    name: 'Lanza Pro',
    description: 'Perfecto para empresas o tiendas pequeñas',
    price: 3500,
    billingCycle: 'monthly',
    features: [
      '2 Dominios incluidos',
      '5 GB de Almacenamiento SSD',
      '50 GB de Transferencia',
      'Cuentas de Email Ilimitadas',
      'Bases de datos Ilimitadas',
      'Subdominios Ilimitados',
      'SSL Gratis',
      'Softaculous (WordPress, etc.)',
      'cPanel completo',
      'Backup automático',
      'Soporte técnico prioritario 24/7'
    ],
    specs: {
      storage: '5 GB SSD',
      bandwidth: '50 GB',
      databases: 'Ilimitado',
      emails: 'Ilimitado',
      domains: '2',
      ssl: true,
      backup: true,
      support: '24/7'
    },
    popular: true
  },
  {
    id: 'premium',
    name: 'Lanza Premium',
    description: 'Potencia total, ideal para proyectos exigentes o agencias',
    price: 5500,
    billingCycle: 'monthly',
    features: [
      '3 Dominios incluidos',
      '10 GB de Almacenamiento SSD',
      '100 GB de Transferencia',
      'Cuentas de Email Ilimitadas',
      'Bases de datos Ilimitadas',
      'Subdominios Ilimitados',
      'SSL Gratis',
      'Softaculous (WordPress, etc.)',
      'cPanel premium',
      'Backup diario automático',
      'Soporte técnico VIP 24/7',
      'Staging environment'
    ],
    specs: {
      storage: '10 GB SSD',
      bandwidth: '100 GB',
      databases: 'Ilimitado',
      emails: 'Ilimitado',
      domains: '3',
      ssl: true,
      backup: true,
      support: '24/7'
    }
  }
]

interface HostingSectionProps {
  onSelectPlan?: (plan: HostingPlan) => void
}

export default function HostingSection({ onSelectPlan }: HostingSectionProps) {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSelectPlan = (plan: HostingPlan) => {
    const planWithBilling = { ...plan, billingCycle: selectedBilling }
    if (onSelectPlan) {
      onSelectPlan(planWithBilling)
    }
  }

  const calculatePrice = (plan: HostingPlan) => {
    const basePrice = plan.price
    if (selectedBilling === 'yearly') {
      return (basePrice * 10) // 2 meses gratis
    }
    return basePrice
  }

  const getSavingsText = (plan: HostingPlan) => {
    if (selectedBilling === 'yearly') {
      const monthlyCost = plan.price * 12
      const yearlyCost = plan.price * 10
      const savings = Math.round((monthlyCost - yearlyCost) / monthlyCost * 100)
      return `Ahorra ${savings}%`
    }
    return null
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 ring-1 ring-neutral-800/70 p-3 rounded-full">
              <ServerIcon className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <h2 className={`h2 mb-4 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Hosting Web Profesional
          </h2>
          <p className={`p max-w-3xl mx-auto mb-8 transition-all duration-700 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Potencia tu presencia online con nuestros planes de hosting optimizados. 
            Rendimiento excepcional, seguridad avanzada y soporte técnico especializado.
          </p>
          
          {/* Billing Toggle */}
          <div className={`inline-flex items-center bg-neutral-900/50 rounded-lg p-1 transition-all duration-700 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                selectedBilling === 'monthly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                selectedBilling === 'yearly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Anual
              <span className="ml-2 text-emerald-400 text-xs font-bold">-17%</span>
            </button>
          </div>
        </div>

        {/* Features Banner */}
        <div className={`bg-gradient-to-r from-neutral-900/40 to-neutral-800/40 border border-neutral-700 rounded-2xl p-8 mb-16 transition-all duration-700 delay-300 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-white">Seguridad Avanzada</h3>
              <p className="text-sm text-neutral-300">SSL gratuito y protección anti-malware</p>
            </div>
            <div className="flex flex-col items-center">
              <BoltIcon className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-semibold text-white">Alto Rendimiento</h3>
              <p className="text-sm text-neutral-300">Almacenamiento SSD y CDN incluido</p>
            </div>
            <div className="flex flex-col items-center">
              <GlobeAltIcon className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white">99.9% Uptime</h3>
              <p className="text-sm text-neutral-300">Garantía de disponibilidad</p>
            </div>
            <div className="flex flex-col items-center">
              <ServerIcon className="w-8 h-8 text-fuchsia-400 mb-3" />
              <h3 className="font-semibold text-white">Soporte 24/7</h3>
              <p className="text-sm text-neutral-300">Asistencia técnica especializada</p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {hostingPlans.map((plan, index) => {
            const savings = getSavingsText(plan)
            const finalPrice = calculatePrice(plan)
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-[1px] transition-all duration-700 hover:shadow-xl hover:scale-105 ${
                  plan.popular 
                    ? 'bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]' 
                    : 'bg-gradient-to-b from-neutral-800 to-neutral-900'
                } ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <StarIcon className="w-4 h-4 mr-1" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-neutral-300 text-sm mb-4">{plan.description}</p>
                    
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-4xl font-bold text-white">AR$ {finalPrice.toLocaleString('es-AR')}</span>
                      <span className="text-neutral-300 ml-2">
                        /{selectedBilling === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    
                    {savings && (
                      <div className="text-emerald-400 text-sm font-medium mb-2">
                        {savings}
                      </div>
                    )}
                    
                    {selectedBilling === 'yearly' && (
                      <div className="text-neutral-400 text-sm">
                        AR$ {Math.round(finalPrice / 12).toLocaleString('es-AR')}/mes facturado anualmente
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckIcon className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-neutral-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-neutral-800 text-white hover:bg-neutral-700'
                    }`}
                  >
                    Seleccionar Plan
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className={`text-center transition-all duration-700 delay-800 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-neutral-900/40 to-neutral-800/40 border border-neutral-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">¿Necesitas ayuda para elegir?</h3>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está disponible para ayudarte a seleccionar el plan perfecto 
              para tu proyecto. Contáctanos sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hosting@lanzawebar.com"
                className="btn-gradient"
              >
                <span>Consultar por Email</span>
              </a>
              <a 
                href="https://wa.me/1234567890"
                className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}