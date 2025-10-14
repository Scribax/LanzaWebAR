import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HostingSection from '../components/HostingSection'
import HostingPurchaseForm from '../components/HostingPurchaseForm'
import ClientDashboard from '../components/ClientDashboard'
import WhatsAppButton from '../components/WhatsAppButton'
import { ServerIcon, ShieldCheckIcon, BoltIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import type { HostingPlan, ClientData, DomainInfo } from '../types/hosting'

export default function HostingPage() {
  const [selectedPlan, setSelectedPlan] = useState<HostingPlan | null>(null)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [clientEmail, setClientEmail] = useState('')

  const handleSelectPlan = (plan: HostingPlan) => {
    setSelectedPlan(plan)
    setShowPurchaseForm(true)
  }

  const handleClosePurchaseForm = () => {
    setShowPurchaseForm(false)
    setSelectedPlan(null)
  }

  const handlePurchaseSubmit = async (data: { clientData: ClientData; domainInfo: DomainInfo }) => {
    try {
      // Aquí llamarías a tu API para crear el pedido
      console.log('Creating order with data:', { 
        plan: selectedPlan, 
        clientData: data.clientData, 
        domainInfo: data.domainInfo 
      })

      // Simular llamada API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            orderId: 'ord_' + Math.random().toString(36).substr(2, 9),
            paymentUrl: 'https://mercadopago.com/checkout/...' // URL de MercadoPago
          })
        }, 2000)
      })

      // En producción, rediriges al usuario a la URL de pago
      // window.location.href = response.paymentUrl
      
      // Para el demo, mostramos un mensaje de éxito
      alert('¡Perfecto! Te redirigiremos al pago. Una vez completado, tu hosting se activará automáticamente.')
      
      setShowPurchaseForm(false)
      setSelectedPlan(null)
      
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Ocurrió un error al procesar tu pedido. Por favor, inténtalo nuevamente.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 ring-1 ring-neutral-800/70 p-4 rounded-full">
                <ServerIcon className="w-10 h-10 text-white/80" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Hosting Web <span className="gradient-text">Profesional</span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-8">
              Potencia tu presencia online con nuestro hosting optimizado. Rendimiento excepcional, 
              seguridad avanzada y soporte técnico especializado las 24 horas.
            </p>
            
            {/* Quick Access Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="#planes" 
                className="btn-gradient"
              >
                <span>Ver Planes y Precios</span>
              </a>
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                Acceso Clientes
              </button>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <div className="flex flex-col items-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 card-hover">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">99.9% Uptime</h3>
                <p className="text-sm text-neutral-300 text-center">Garantía de disponibilidad</p>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 card-hover">
                <BoltIcon className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">SSD Ultrarrápido</h3>
                <p className="text-sm text-neutral-300 text-center">Almacenamiento de alta velocidad</p>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 card-hover">
                <GlobeAltIcon className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">SSL Gratuito</h3>
                <p className="text-sm text-neutral-300 text-center">Certificados de seguridad incluidos</p>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 card-hover">
                <CheckCircleIcon className="w-8 h-8 text-fuchsia-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Soporte 24/7</h3>
                <p className="text-sm text-neutral-300 text-center">Asistencia técnica especializada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Dashboard Modal/Section */}
      {showDashboard && (
        <section className="py-16 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Panel de Cliente</h2>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Ingresa tu email para acceder a tu panel:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-neutral-600 text-white"
                  />
                  <button
                    onClick={() => clientEmail && setShowDashboard(true)}
                    disabled={!clientEmail}
                    className="btn-gradient disabled:opacity-50"
                  >
                    <span>Acceder</span>
                  </button>
                </div>
              </div>
            </div>
            
            {clientEmail && (
              <ClientDashboard clientEmail={clientEmail} />
            )}
          </div>
        </section>
      )}

      {/* Main Hosting Section */}
      <section id="planes">
        <HostingSection onSelectPlan={handleSelectPlan} />
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">¿Por qué elegir nuestro hosting?</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Más de 10 años de experiencia ofreciendo soluciones de hosting confiables y seguras
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 ring-1 ring-neutral-800/70">
                <ServerIcon className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Infraestructura de Primera</h3>
              <p className="text-neutral-300">
                Servidores de última generación con tecnología SSD, procesadores de alto rendimiento 
                y conexiones de red redundantes para garantizar máximo uptime.
              </p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-emerald-500/20 via-green-500/20 to-teal-500/20 ring-1 ring-neutral-800/70">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Seguridad Avanzada</h3>
              <p className="text-neutral-300">
                Protección DDoS, firewall avanzado, SSL gratuito, backups automáticos y monitoreo 
                constante para mantener tu sitio web seguro las 24 horas.
              </p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-purple-500/20 via-fuchsia-500/20 to-pink-500/20 ring-1 ring-neutral-800/70">
                <CheckCircleIcon className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Soporte Técnico Experto</h3>
              <p className="text-neutral-300">
                Nuestro equipo de especialistas está disponible 24/7 para ayudarte con cualquier 
                consulta técnica. Respuesta garantizada en menos de 2 horas.
              </p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-yellow-500/20 via-amber-500/20 to-orange-500/20 ring-1 ring-neutral-800/70">
                <BoltIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Velocidad Optimizada</h3>
              <p className="text-neutral-300">
                CDN global incluido, compresión avanzada, cache inteligente y optimización automática 
                para que tu sitio cargue en tiempo récord.
              </p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-teal-500/20 ring-1 ring-neutral-800/70">
                <GlobeAltIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Panel de Control Intuitivo</h3>
              <p className="text-neutral-300">
                cPanel actualizado, instalador de aplicaciones con un clic, gestor de archivos 
                avanzado y herramientas de administración fáciles de usar.
              </p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 card-hover">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-red-500/20 via-rose-500/20 to-pink-500/20 ring-1 ring-neutral-800/70">
                <CheckCircleIcon className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Garantía de Satisfacción</h3>
              <p className="text-neutral-300">
                30 días de garantía de devolución del dinero. Si no estás completamente satisfecho, 
                te devolvemos el 100% de tu inversión sin preguntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-neutral-300">Miles de sitios web confían en nosotros</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 card-hover">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircleIcon key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-300 mb-4">
                "Excelente servicio de hosting. Mi sitio web carga súper rápido y nunca he tenido problemas. 
                El soporte técnico es muy profesional y responde al instante."
              </p>
              <div className="font-medium text-white">María González</div>
              <div className="text-sm text-neutral-400">Propietaria de tienda online</div>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 card-hover">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircleIcon key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-300 mb-4">
                "Migré mi empresa a este hosting hace un año y ha sido la mejor decisión. 
                Uptime perfecto, velocidad increíble y precios muy competitivos."
              </p>
              <div className="font-medium text-white">Carlos Rodríguez</div>
              <div className="text-sm text-neutral-400">Director de TI</div>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 card-hover">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircleIcon key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-300 mb-4">
                "Como desarrollador web, valoro mucho la estabilidad y las herramientas que ofrecen. 
                El cPanel es completo y fácil de usar. Muy recomendado."
              </p>
              <div className="font-medium text-white">Ana Martínez</div>
              <div className="text-sm text-neutral-400">Desarrolladora Web</div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Form Modal */}
      {showPurchaseForm && selectedPlan && (
        <HostingPurchaseForm
          selectedPlan={selectedPlan}
          onClose={handleClosePurchaseForm}
          onSubmit={handlePurchaseSubmit}
        />
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  )
}