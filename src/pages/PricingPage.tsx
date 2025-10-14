import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { CheckCircleIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { 
  CodeBracketIcon, 
  ServerIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon 
} from '@heroicons/react/24/outline'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number | string
  period: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaLink: string
  icon: React.ReactNode
  category: 'development' | 'hosting' | 'additional'
}

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'development' | 'hosting' | 'additional'>('all')

  const plans: PricingPlan[] = [
    // Desarrollo Web
    {
      id: 'website-complete',
      name: 'Paquete Completo',
      description: 'Sitio web profesional completo con hosting incluido por 1 año',
      price: 15000,
      period: 'único',
      category: 'development',
      popular: true,
      icon: <SparklesIcon className="w-6 h-6" />,
      features: [
        'Diseño 100% personalizado',
        'Hasta 5 páginas optimizadas',
        'SEO técnico avanzado',
        'Responsive design (móvil/tablet)',
        'Formularios de contacto',
        'Integración redes sociales',
        'Primer mes de hosting premium GRATIS (luego AR$ 2000/mes)',
        'Dominio .com/.net/.org GRATIS primer año (luego AR$ 2500/año)',
        'SSL y certificados incluidos',
        'Backup automático',
        'Capacitación personalizada',
        '3 revisiones incluidas',
        '30 días soporte post-lanzamiento',
        'Optimización para buscadores'
      ],
      ctaText: 'Solicitar Paquete Completo',
      ctaLink: '#contact'
    },
    
    // Hosting
    {
      id: 'hosting-basico',
      name: 'Lanza Básico',
      description: 'Ideal para webs personales o pequeños negocios',
      price: 2000,
      period: 'mensual',
      category: 'hosting',
      icon: <ServerIcon className="w-6 h-6" />,
      features: [
        '2 GB SSD',
        '20 GB transferencia',
        '1 dominio incluido',
        'Emails ilimitados',
        'Bases de datos ilimitadas',
        'Subdominios ilimitados',
        'SSL gratuito',
        'cPanel + Softaculous',
        'Backup automático',
        'Soporte técnico 24/7'
      ],
      ctaText: 'Contratar Ahora',
      ctaLink: '/hosting'
    },
    {
      id: 'hosting-pro',
      name: 'Lanza Pro',
      description: 'Perfecto para empresas o tiendas pequeñas',
      price: 3500,
      period: 'mensual',
      category: 'hosting',
      popular: true,
      icon: <ServerIcon className="w-6 h-6" />,
      features: [
        '5 GB SSD',
        '50 GB transferencia',
        '2 dominios incluidos',
        'Emails ilimitados',
        'Bases de datos ilimitadas',
        'Subdominios ilimitados',
        'SSL gratuito',
        'cPanel + Softaculous',
        'Backup automático',
        'Soporte técnico prioritario 24/7'
      ],
      ctaText: 'Contratar Ahora',
      ctaLink: '/hosting'
    },
    {
      id: 'hosting-premium',
      name: 'Lanza Premium',
      description: 'Potencia total, ideal para proyectos exigentes o agencias',
      price: 5500,
      period: 'mensual',
      category: 'hosting',
      icon: <ServerIcon className="w-6 h-6" />,
      features: [
        '10 GB SSD',
        '100 GB transferencia',
        '3 dominios incluidos',
        'Emails ilimitados',
        'Bases de datos ilimitadas',
        'Subdominios ilimitados',
        'SSL gratuito',
        'cPanel premium + Softaculous',
        'Backup diario automático',
        'Soporte técnico VIP 24/7',
        'Staging environment'
      ],
      ctaText: 'Contratar Ahora',
      ctaLink: '/hosting'
    },

    // Servicios Adicionales
    {
      id: 'domain-premium',
      name: 'Dominio Premium',
      description: 'Dominios .com, .net, .org - Los más populares y confiables',
      price: 2500,
      period: 'anual',
      category: 'additional',
      icon: <GlobeAltIcon className="w-6 h-6" />,
      features: [
        'Extensiones .com, .net, .org',
        'Reconocimiento mundial',
        'Gestión de DNS completa',
        'Protección de privacidad WHOIS',
        'Redirección de emails',
        'Renovación automática',
        'Soporte técnico prioritario'
      ],
      ctaText: 'Registrar Dominio Premium',
      ctaLink: '#contact'
    },
    {
      id: 'domain-argentina',
      name: 'Dominio Argentina',
      description: 'Dominio .com.ar para posicionarte localmente',
      price: 8000,
      period: 'anual',
      category: 'additional',
      icon: <GlobeAltIcon className="w-6 h-6" />,
      features: [
        'Extensión .com.ar',
        'Presencia local argentina',
        'Mejor SEO local',
        'Gestión de DNS completa',
        'Protección de privacidad',
        'Soporte técnico especializado'
      ],
      ctaText: 'Registrar .com.ar',
      ctaLink: '#contact'
    },
    {
      id: 'domain-specialized',
      name: 'Dominio Especializado',
      description: 'Dominios .blog, .pro y otras extensiones especiales',
      price: 4500,
      period: 'anual',
      category: 'additional',
      icon: <GlobeAltIcon className="w-6 h-6" />,
      features: [
        'Extensiones .blog, .pro, .cl',
        'Diferenciación profesional',
        'Perfectos para nichos específicos',
        'Gestión de DNS completa',
        'Protección de privacidad',
        'Soporte técnico incluido'
      ],
      ctaText: 'Registrar Especializado',
      ctaLink: '#contact'
    }
  ]

  const filteredPlans = activeCategory === 'all' ? plans : plans.filter(plan => plan.category === activeCategory)

  const categoryLabels = {
    all: 'Todos los Servicios',
    development: 'Desarrollo Web',
    hosting: 'Hosting',
    additional: 'Servicios Adicionales'
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Precios <span className="gradient-text">Transparentes</span>
          </h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-12">
            Sin letra chica, sin sorpresas. Elegí exactamente lo que necesitas para tu proyecto digital.
          </p>

          {/* Category Filter */}
          <div className="inline-flex bg-neutral-900/50 rounded-lg p-1 mb-16">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as any)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeCategory === key
                    ? 'bg-white text-neutral-900'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Development Section */}
      {(activeCategory === 'all' || activeCategory === 'development') && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Desarrollo Web</h2>
              <p className="text-xl text-neutral-300">Sitio web completo con todo incluido</p>
            </div>
            <div className="flex justify-center">
              {plans.filter(plan => plan.category === 'development').map((plan) => (
                <div
                  key={plan.id}
                  className="relative rounded-xl p-[1px] transition-all duration-300 hover:scale-105 bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))] max-w-md w-full"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <StarIcon className="w-4 h-4 mr-1" />
                      Más Popular
                    </div>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 p-8 h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-500/20 text-blue-400">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          Desarrollo
                        </span>
                      </div>
                    </div>

                    <p className="text-neutral-300 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          AR$ {plan.price.toLocaleString('es-AR')}
                        </span>
                        <span className="text-neutral-400 ml-2">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.ctaLink}
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                      {plan.ctaText}
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hosting Section */}
      {(activeCategory === 'all' || activeCategory === 'hosting') && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Planes de Hosting</h2>
              <p className="text-xl text-neutral-300">Hosting profesional con cPanel y soporte 24/7</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.filter(plan => plan.category === 'hosting').map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-[1px] transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]' 
                      : 'bg-gradient-to-b from-neutral-800 to-neutral-900'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <StarIcon className="w-4 h-4 mr-1" />
                        Más Popular
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-neutral-900/80 p-8 h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-green-500/20 text-green-400">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                          Hosting
                        </span>
                      </div>
                    </div>

                    <p className="text-neutral-300 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          AR$ {plan.price.toLocaleString('es-AR')}
                        </span>
                        <span className="text-neutral-400 ml-2">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={plan.ctaLink}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      {plan.ctaText}
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Services Section */}
      {(activeCategory === 'all' || activeCategory === 'additional') && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Servicios Adicionales</h2>
              <p className="text-xl text-neutral-300">Complementa tu proyecto con servicios profesionales</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.filter(plan => plan.category === 'additional').map((plan) => (
                <div
                  key={plan.id}
                  className="relative rounded-xl p-[1px] transition-all duration-300 hover:scale-105 bg-gradient-to-b from-neutral-800 to-neutral-900"
                >
                  <div className="rounded-xl bg-neutral-900/80 p-8 h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-purple-500/20 text-purple-400">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                          Adicional
                        </span>
                      </div>
                    </div>

                    <p className="text-neutral-300 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          AR$ {plan.price.toLocaleString('es-AR')}
                        </span>
                        <span className="text-neutral-400 ml-2">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.ctaLink}
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-neutral-800 text-white hover:bg-neutral-700"
                    >
                      {plan.ctaText}
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-neutral-950/50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-neutral-400">Todo lo que necesitas saber sobre nuestros servicios</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">¿Puedo cambiar de plan de hosting?</h3>
              <p className="text-neutral-300 text-sm">
                Sí, puedes upgrader o downgrader tu plan en cualquier momento. 
                Los cambios se reflejan inmediatamente y facturamos la diferencia.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">¿Qué incluye el desarrollo completo?</h3>
              <p className="text-neutral-300 text-sm">
                Incluye diseño, desarrollo, SEO básico, hosting por 1 año, dominio gratis 
                y soporte post-lanzamiento durante 30 días.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">¿Hay costos ocultos?</h3>
              <p className="text-neutral-300 text-sm">
                No. Todos nuestros precios son transparentes. Solo pagas lo que ves, 
                sin sorpresas ni costos adicionales no especificados.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">¿Ofrecen garantía?</h3>
              <p className="text-neutral-300 text-sm">
                Sí, ofrecemos 30 días de garantía en desarrollo web y 99.9% uptime 
                garantizado en hosting. Tu satisfacción es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Contáctanos y te ayudaremos a elegir la mejor opción para tu proyecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Hablar con un Experto
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </a>
            <Link
              to="/hosting"
              className="inline-flex items-center px-8 py-3 border border-neutral-600 text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 font-medium"
            >
              Ver Solo Hosting
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}