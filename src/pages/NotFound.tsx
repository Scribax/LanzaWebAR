import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => (
  <div className="mx-auto max-w-6xl px-4 py-24 text-center">
    <h1 className="text-5xl font-extrabold">404</h1>
    <p className="mt-2 text-neutral-400">La página que buscas no existe.</p>
    <div className="mt-6">
      <Link to="/" className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900">Volver al inicio</Link>
    </div>
  </div>
)

export default NotFound