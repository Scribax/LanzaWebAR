import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

const Projects: React.FC = () => {
  const items = [
    {
      title: 'E-commerce Minimal',
      href: '/projects/ecommerce-minimal',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      desc: 'Checkout con cupones, envío, impuestos y carrito persistente.',
    },
    {
      title: 'Dashboard Analytics',
      href: '/projects/dashboard-analytics',
      img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
      desc: 'KPIs, filtros por canal, exportación CSV y tablas ordenables.',
    },
    {
      title: 'Landing SaaS',
      href: '/projects/landing-saas',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      desc: 'Propuesta clara, prueba social, precios y formulario de captura.',
    },
  ]

  return (
    <section id="projects" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="h2">Proyectos</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2 max-w-2xl">Demostramos nuestras capacidades con estos proyectos interactivos.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={120 + i * 100}>
<div className="rounded-xl p-[1px] bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]">
                <article className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 card-hover">
                <Link to={p.href} className="absolute inset-0 z-10" aria-label={`Ver proyecto ${p.title}`} />
                <div className="aspect-[16/10] overflow-hidden">
<img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300">{p.desc}</p>
                </div>
</article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
