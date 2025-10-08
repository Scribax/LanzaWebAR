import React from 'react'
import Reveal from './Reveal'

const SpecialOffer: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo con gradiente y efectos */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-cyan-900/20 to-blue-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-ping [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping [animation-delay:2s]"></div>
        <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-ping [animation-delay:0.5s]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Reveal>
            {/* Badge de oferta limitada */}
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              OFERTA ESPECIAL - TIEMPO LIMITADO
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text">¡Todo en un Solo Paquete!</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Lanza tu presencia digital completa sin complicaciones ni costos ocultos
            </p>
          </Reveal>

          {/* Precio destacado */}
          <Reveal delay={300}>
            <div className="mb-10">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 blur-xl"></div>
                <div className="relative bg-neutral-900/90 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-sm text-emerald-400 font-semibold mb-2">PAQUETE COMPLETO</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl md:text-6xl font-extrabold gradient-text">$15,000</span>
                    <span className="text-lg text-neutral-400 font-medium">ARS</span>
                  </div>
                  <div className="text-neutral-300 text-sm">Precio único • Setup completo</div>
                  <div className="text-xs text-neutral-400 mt-1">*Hosting: 1er mes gratis, luego $600/mes sin IVA</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Lista de lo que incluye */}
          <Reveal delay={400}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-neutral-900/60 border border-neutral-700 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Certificado SSL</h3>
                <p className="text-sm text-neutral-400">Seguridad HTTPS completa</p>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-700 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Hosting Premium</h3>
                <p className="text-sm text-neutral-400">1er mes gratis • $600/mes sin IVA</p>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-700 rounded-lg p-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Dominio .com</h3>
                <p className="text-sm text-neutral-400">Registro completo por 1 año</p>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-700 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Página Web</h3>
                <p className="text-sm text-neutral-400">Diseño profesional moderno</p>
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#contact" 
                className="btn-gradient text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <span>¡Quiero Mi Paquete Completo!</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <div className="text-sm text-neutral-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Oferta válida este mes
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default SpecialOffer