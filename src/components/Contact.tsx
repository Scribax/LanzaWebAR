import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from './Reveal'

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const navigate = useNavigate()

  const handleHostingNavigation = () => {
    navigate('/hosting')
    // Pequeño delay para asegurar que la navegación se complete antes del scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      message: String(data.get('message') || ''),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('ok')
      form.reset()
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Reveal>
          <h2 className="h2">Contacto</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2">¿Tienes un proyecto en mente? Hablemos de cómo podemos ayudarte.</p>
        </Reveal>
        
        {/* Quick Hosting Option */}
        <Reveal delay={160}>
          <div className="mt-6 p-4 bg-gradient-to-r from-neutral-900/40 to-neutral-800/40 border border-neutral-700 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">¿Solo necesitas hosting?</h3>
                <p className="text-xs text-neutral-400 mt-1">Si ya tienes tu sitio web, puedes contratar hosting directamente</p>
              </div>
              <button 
                onClick={handleHostingNavigation}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                Ver planes de hosting →
              </button>
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={200}>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-neutral-300">Nombre</label>
              <input name="name" required type="text" className="w-full rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-neutral-600" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-neutral-300">Email</label>
              <input name="email" required type="email" className="w-full rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-neutral-600" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-neutral-300">Mensaje</label>
              <textarea name="message" required rows={5} className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-neutral-600" placeholder="Cuéntanos sobre tu proyecto" />
            </div>
            <div className="mt-2">
              <button type="submit" disabled={status==='sending'} className="btn-gradient disabled:opacity-60"><span>{status==='sending'?'Enviando…':'Enviar'}</span></button>
              {status === 'ok' && (
                <span className="ml-3 text-sm text-emerald-400">¡Mensaje enviado!</span>
              )}
              {status === 'error' && (
                <span className="ml-3 text-sm text-rose-400">Hubo un problema. Intenta de nuevo.</span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
