import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800/80 py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-400">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
<p>© {new Date().getFullYear()} LanzaWeb. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#home" className="hover:text-white">Inicio</a>
            <Link to="/hosting" className="hover:text-white">Hosting</Link>
            <a href="#projects" className="hover:text-white">Proyectos</a>
            <a href="#contact" className="hover:text-white">Contacto</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/" className="hover:text-white">LinkedIn</a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
