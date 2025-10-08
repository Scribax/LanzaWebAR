import React from 'react'
import Reveal from './Reveal'

const Testimonials: React.FC = () => {
  const items = [
    {
      name: 'María G.',
      role: 'CMO, Startup X',
      quote:
        'Excelente calidad y tiempos de entrega. El sitio cargó más rápido y mejoró la conversión.',
    },
    {
      name: 'Carlos R.',
      role: 'Founder, Agencia Y',
      quote:
        'Equipo profesional, atentos a detalles y comunicación perfecta. Los recomendamos totalmente.',
    },
    {
      name: 'Lucía P.',
      role: 'PM, Producto Z',
      quote: 'El diseño quedó increíble y la implementación impecable en móvil y desktop.',
    },
  ]

  return (
    <section id="testimonials" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="h2">Testimonios</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2 max-w-2xl">Clientes contentos con resultados medibles y soporte continuo.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={120 + i * 100}>
              <figure className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 card-hover">
                <blockquote className="text-sm text-neutral-300">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-neutral-400">
                  <span className="font-medium text-neutral-200">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
