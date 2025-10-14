import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

const ServiceComparison: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-neutral-950/50 to-transparent">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="h2 text-center">¿Qué necesitas?</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2 max-w-3xl mx-auto text-center">
            Elegí la opción que mejor se adapte a tu proyecto. Podemos desarrollar tu sitio completo 
            o simplemente brindarte el hosting para tu proyecto existente.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Paquete Completo */}
          <Reveal delay={200}>
            <div className="relative">
              <div className="rounded-xl p-[1px] bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-8">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                      🚀 Solución Completa
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Desarrollo + Hosting</h3>
                  <p className="text-neutral-300 mb-6">
                    Tu sitio web completo desde cero. Nos encargamos del diseño, desarrollo, 
                    hosting y mantenimiento para que te enfoques en tu negocio.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      'Diseño y desarrollo completo',
                      'Hosting profesional incluido',
                      'Dominio .com gratis 1er año (luego AR$ 2500/año)',
                      'SEO técnico y optimización',
                      'Responsive design',
                      'Soporte y mantenimiento',
                      'Backup automático',
                      'Certificados de seguridad'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-neutral-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-3xl font-bold">AR$ 15.000</span>
                      <span className="text-neutral-400 ml-2 text-xs">setup + 1er mes hosting gratis</span>
                    </div>
                    <Link 
                      to={{ pathname: '/', hash: '#contact' }}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      Solicitar Cotización
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Solo Hosting */}
          <Reveal delay={320}>
            <div className="relative">
              <div className="rounded-xl p-[1px] bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-8">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 ring-1 ring-green-500/30">
                      ⚡ Solo Hosting
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Hosting Profesional</h3>
                  <p className="text-neutral-300 mb-6">
                    Perfecto si ya tienes tu sitio web o lo estás desarrollando. 
                    Hosting confiable y rápido con todas las herramientas que necesitas.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      'cPanel completo incluido',
                      'SSL gratuito y renovación automática', 
                      'Backups diarios automáticos',
                      'Softaculous (WordPress, etc.)',
                      'Cuentas de email ilimitadas',
                      'Bases de datos MySQL',
                      'Soporte técnico 24/7',
                      'Uptime 99.9% garantizado'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-neutral-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-3xl font-bold">Desde AR$ 2.000</span>
                      <span className="text-neutral-400 ml-2">/mes</span>
                    </div>
                    <Link 
                      to="/hosting"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium"
                    >
                      Ver Planes de Hosting
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Call to Action adicional */}
        <Reveal delay={440}>
          <div className="mt-12 text-center">
            <p className="text-neutral-400 mb-4">
              ¿No estás seguro de cuál opción es mejor para ti?
            </p>
            <Link 
              to={{ pathname: '/', hash: '#contact' }}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              Hablemos y te ayudamos a decidir
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ServiceComparison