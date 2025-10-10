import { lazy, Suspense } from 'react'

// Cargar el mapa de forma dinámica para evitar problemas de SSR
const MapComponent = lazy(() => import('./MapComponent'))

interface DynamicMapProps {
  properties: any[]
  onPropertyClick: (property: any) => void
  favs: number[]
  toggleFav: (id: number) => void
}

const DynamicMap: React.FC<DynamicMapProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="h-[600px] w-full rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="mt-2 text-neutral-400">Cargando mapa...</p>
        </div>
      </div>
    }>
      <MapComponent {...props} />
    </Suspense>
  )
}

export default DynamicMap