import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useSectionSpy from '../hooks/useSectionSpy'

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const location = useLocation()
  const isHome = location.pathname === '/'
  const active = isHome ? useSectionSpy(['services', 'projects', 'testimonials', 'contact']) : ''

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
<Link to="/" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
<img src="/logo.png" alt="LanzaWeb" className="h-7 w-7 rounded-full" />
            <span className="gradient-text">LanzaWeb</span>
          </Link>
          <nav aria-label="Principal" className="hidden gap-8 text-sm text-neutral-300 md:flex">
            <Link to={{ pathname: '/', hash: '#services' }} className={`hover:text-white transition-colors ${active==='services' ? 'text-white' : ''}`}>Servicios</Link>
            <Link to={{ pathname: '/', hash: '#projects' }} className={`hover:text-white transition-colors ${active==='projects' ? 'text-white' : ''}`}>Proyectos</Link>
            <Link to={{ pathname: '/', hash: '#testimonials' }} className={`hover:text-white transition-colors ${active==='testimonials' ? 'text-white' : ''}`}>Testimonios</Link>
            <Link to={{ pathname: '/', hash: '#contact' }} className={`hover:text-white transition-colors ${active==='contact' ? 'text-white' : ''}`}>Contacto</Link>
          </nav>
          <div className="hidden md:block">
            <Link to={{ pathname: '/', hash: '#contact' }} className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-neutral-200 transition-colors">
              Hablemos
            </Link>
          </div>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md border border-neutral-800 p-2 text-neutral-300 hover:bg-neutral-900 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel móvil */}
      <div
        className={`md:hidden fixed top-16 inset-x-0 z-50 origin-top border-b border-neutral-800 bg-neutral-950 transition-transform duration-200 ${
          open ? 'scale-y-100' : 'scale-y-0'
        }`}
      >
        <nav aria-label="Móvil" className="mx-auto max-w-6xl px-4 py-4 text-sm text-neutral-300">
          <div className="grid gap-3">
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#services' }} className={`rounded-md px-2 py-2 hover:bg-neutral-900 hover:text-white ${active==='services' ? 'text-white' : ''}`}>Servicios</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#projects' }} className={`rounded-md px-2 py-2 hover:bg-neutral-900 hover:text-white ${active==='projects' ? 'text-white' : ''}`}>Proyectos</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#testimonials' }} className={`rounded-md px-2 py-2 hover:bg-neutral-900 hover:text-white ${active==='testimonials' ? 'text-white' : ''}`}>Testimonios</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#contact' }} className={`rounded-md px-2 py-2 hover:bg-neutral-900 hover:text-white ${active==='contact' ? 'text-white' : ''}`}>Contacto</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
