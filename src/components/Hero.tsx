import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-20 md:py-28">
          <Reveal>
            <p className="mb-4 inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-neutral-800">Equipo disponible para nuevos proyectos</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="h1">
              Diseño y desarrollo de <span className="gradient-text">sitios web modernos</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="p mt-4 max-w-2xl">
              Ayudamos a negocios y marcas a construir presencia digital con enfoque en rendimiento, accesibilidad y un diseño limpio.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-gradient"><span>Sitio completo</span></a>
              <Link to="/hosting" className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors">Solo Hosting</Link>
              <a href="#projects" className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors">Ver proyectos</a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Animated gradient blobs (verde→cian→azul) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-sky-500/30" />
        <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/30 via-emerald-500/30 to-cyan-500/30 [animation-delay:1.5s]" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(6,182,212,0.14)_0%,rgba(10,10,10,0)_60%)]" />
    </section>
  )
}

export default Hero
