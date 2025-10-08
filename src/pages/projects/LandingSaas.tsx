import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LandingSaas: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null)
  const [yearly, setYearly] = useState(false)
  const [newsletter, setNewsletter] = useState<'idle'|'ok'>('idle')
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight text-violet-700">SaaSify</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#beneficios" className="hover:text-slate-900">Beneficios</a>
            <a href="#precios" className="hover:text-slate-900">Precios</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <Link to="/" className="text-sm text-violet-700 hover:text-violet-900">Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="rounded-2xl border bg-white p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Convierte visitas en clientes</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">Producto SaaS listo para crecer: onboarding claro, analítica integrada y precios transparentes.</p>
              <div className="mt-6 flex gap-3">
                <a className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700" href="#precios">Comenzar</a>
                <a className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50" href="#beneficios">Ver más</a>
              </div>
              <p className="mt-3 text-xs text-slate-500">SSL, RGPD y buenas prácticas de rendimiento (Lighthouse 90+).</p>
            </div>
            <div className="flex-1">
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-violet-50">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop" alt="Panel SaaS en escritorio" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {t:'Rendimiento', d:'SSR/SPA optimizado, imágenes responsive y caching inteligente.'},
            {t:'Seguridad', d:'Autenticación, roles y mejores prácticas OWASP (demo).'},
            {t:'Escalabilidad', d:'Arquitectura modular, CI/CD y tests listos para crecer.'},
          ].map((b) => (
            <div key={b.t} className="rounded-xl border bg-white p-5">
              <div className="font-semibold">{b.t}</div>
              <p className="mt-2 text-sm text-slate-600">{b.d}</p>
            </div>
          ))}
        </section>

        <section id="precios" className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Facturación:</span>
            <button onClick={()=>setYearly((v)=>!v)} aria-pressed={yearly} className={`relative inline-flex h-6 w-12 items-center rounded-full border p-1 ${yearly?'bg-violet-600':'bg-white'}`}>
              <span className={`h-4 w-4 rounded-full bg-slate-300 transition-transform ${yearly?'translate-x-6':''}`} />
            </button>
            <span className="text-sm text-slate-600">Mensual / Anual {yearly && <em className="text-xs text-violet-700">(−20%)</em>}</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Básico', price: 9 },
              { name: 'Pro', price: 29 },
              { name: 'Empresa', price: 79 },
            ].map((t) => {
              const price = yearly ? Math.round(t.price * 12 * 0.8) : t.price
              return (
                <div key={t.name} className="rounded-2xl border bg-white p-6">
                  <div className="text-sm text-slate-500">{t.name}</div>
                  <div className="mt-2 text-3xl font-extrabold">
                    ${price}
                    <span className="text-base font-medium text-slate-500">/{yearly?'año':'mes'}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>✔ Característica A</li>
                    <li>✔ Característica B</li>
                    <li>✔ Característica C</li>
                  </ul>
                  <div className="mt-5">
                    <a className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700" href="#">Elegir</a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="faq" className="mt-10 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
          <div className="mt-4 divide-y">
            {[
              ['¿Hay prueba gratuita?', 'Sí, 14 días sin tarjeta.'],
              ['¿Puedo cancelar cuando quiera?', 'Claro, sin permanencia.'],
              ['¿Ofrecen soporte?', 'Soporte prioritario en planes Pro y Empresa.'],
            ].map((f, i) => (
              <div key={i} className="py-3">
                <button onClick={() => setOpen(open===i?null:i)} className="flex w-full items-center justify-between text-left">
                  <span className="font-medium">{f[0]}</span>
                  <span className="text-slate-500">{open===i?'−':'+'}</span>
                </button>
                {open===i && <p className="mt-2 text-sm text-slate-600">{f[1]}</p>}
              </div>
            ))}
          </div>
        </section>
        {/* Testimonios */}
        <section className="mt-10 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Testimonios</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              ['María G.', '“Duplicamos la conversión en 8 semanas con el nuevo onboarding.”'],
              ['Carlos R.', '“Migración sin downtime y métricas claras para el equipo.”'],
              ['Lucía P.', '“Crecimos en MQLs un 35% tras optimizar la landing.”'],
            ].map(([name, q]) => (
              <figure key={name} className="rounded-xl border bg-white p-5">
                <div className="text-yellow-500">★★★★★</div>
                <blockquote className="mt-2 text-sm text-slate-600">{q}</blockquote>
                <figcaption className="mt-3 text-sm text-slate-500">{name} • Cliente verificado</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-10 rounded-2xl border bg-white p-6 text-center">
          <h2 className="text-xl font-semibold">Suscríbete para recibir novedades</h2>
          {newsletter==='idle' ? (
            <form onSubmit={(e)=>{e.preventDefault(); setNewsletter('ok')}} className="mt-4 flex flex-col items-center gap-3 md:flex-row md:justify-center">
              <input type="email" required placeholder="tu@email.com" className="w-72 rounded-md border px-3 py-2 text-sm" />
              <button className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Suscribirme</button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-emerald-600">¡Gracias! Te enviaremos novedades.</p>
          )}
        </section>

        {/* CTA final */}
        <section className="mt-10 rounded-2xl border bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 text-center">
          <h2 className="text-2xl font-bold">¿Listo para lanzar?</h2>
          <p className="mt-1 text-slate-600">Empieza gratis y escala cuando lo necesites.</p>
          <div className="mt-4">
            <a className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700" href="#">Crear cuenta</a>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">Demo Landing • SaaSify</footer>
    </div>
  )
}

export default LandingSaas
