import React, { useState } from 'react'
import Reveal from './Reveal'

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

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
