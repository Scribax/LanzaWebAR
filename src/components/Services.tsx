import React from 'react'
import Reveal from './Reveal'
import { CodeIcon, AppIcon, GaugeIcon, PaletteIcon } from './icons'

const Services: React.FC = () => {
  type Item = { title: string; desc: string; icon: React.ReactNode }
  const items: Item[] = [
    {
      title: 'Sitios a medida',
      desc: 'Desarrollo de landing pages y sitios corporativos con mejores prácticas y SEO técnico.',
      icon: <CodeIcon className="h-5 w-5 text-white/80" />,
    },
    {
      title: 'Web Apps',
      desc: 'Aplicaciones SPA/SSR con React, integraciones y diseño de componentes reutilizables.',
      icon: <AppIcon className="h-5 w-5 text-white/80" />,
    },
    {
      title: 'Performance & Accesibilidad',
      desc: 'Optimización de carga, Lighthouse, accesibilidad WCAG y métricas Core Web Vitals.',
      icon: <GaugeIcon className="h-5 w-5 text-white/80" />,
    },
    {
      title: 'Branding & UI',
      desc: 'Sistemas de diseño coherentes, tipografías modernas y paletas de color escalables.',
      icon: <PaletteIcon className="h-5 w-5 text-white/80" />,
    },
  ]

  return (
    <section id="services" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="h2">Servicios</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2 max-w-2xl">Soluciones enfocadas en resultados y mantenibilidad a largo plazo.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={120 + i * 80}>
<div className="rounded-xl p-[1px] bg-[conic-gradient(var(--accent-from),var(--accent-via),var(--accent-to),var(--accent-from))]">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 card-hover">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 ring-1 ring-neutral-800/70">
                  {s.icon}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-300">{s.desc}</p>
</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
