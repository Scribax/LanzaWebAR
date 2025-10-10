import React, { useEffect, useMemo, useState } from 'react'
import { Star, Heart, MapPin, Bed, Bath, Square, Car, Eye, Calendar, Phone, Mail, Map, X } from 'lucide-react'
import Reveal from '../../components/Reveal'
import DynamicMap from '../../components/DynamicMap'


// Tipos
type Property = {
  id: number
  title: string
  city: string
  country: string
  neighborhood: string
  price: number
  beds: number
  baths: number
  area: number // m2
  parkings: number
  type: 'Casa' | 'Depto' | 'PH' | 'Lote' | 'Oficina'
  status: 'Venta' | 'Alquiler' | 'Temporal'
  condition: 'Nuevo' | 'Usado' | 'A estrenar' | 'Refaccionado'
  image: string
  images: string[]
  rating: number
  description: string
  amenities: string[]
  yearBuilt: number
  expenses?: number
  lat: number
  lng: number
  agent: {
    name: string
    phone: string
    email: string
    image: string
  }
  featured: boolean
  views: number
  daysOnMarket: number
}

const sampleData: Property[] = [
  {
    id: 1,
    title: 'Casa moderna con jardín y pileta',
    city: 'Buenos Aires',
    country: 'Argentina',
    neighborhood: 'Palermo',
    price: 420000,
    beds: 4,
    baths: 3,
    area: 210,
    parkings: 2,
    type: 'Casa',
    status: 'Venta',
    condition: 'A estrenar',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.8,
    description: 'Espectacular casa de diseño contemporáneo con terminaciones de lujo. Ambientes integrados con doble altura, cocina gourmet con isla central, master suite con walking closet y baño en suite. Jardín con piscina climatizada y deck. Sistema de domótica integrado.',
    amenities: ['Pileta Climatizada', 'Parrilla Premium', 'Cochera 2 Autos', 'Jardín Paisajístico', 'Domótica', 'Seguridad', 'Laundry'],
    yearBuilt: 2023,
    lat: -34.5876,
    lng: -58.4227,
    agent: {
      name: 'María González',
      phone: '+54 11 5555-0001',
      email: 'maria@realestate.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b691?q=80&w=200&auto=format&fit=crop'
    },
    featured: true,
    views: 847,
    daysOnMarket: 12
  },
  {
    id: 2,
    title: 'Departamento céntrico con vista panorámica',
    city: 'CABA',
    country: 'Argentina',
    neighborhood: 'Puerto Madero',
    price: 1250,
    beds: 2,
    baths: 2,
    area: 85,
    parkings: 1,
    type: 'Depto',
    status: 'Alquiler',
    condition: 'Usado',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.6,
    description: 'Increíble departamento en torre premium con vista 360° al río y la ciudad. Living-comedor integrado con ventanales de piso a techo, cocina equipada, dos dormitorios en suite. Amenities de primer nivel en el edificio.',
    amenities: ['SUM', 'Gimnasio', 'Pileta', 'Seguridad 24hs', 'Portería', 'Sala de Juegos', 'Business Center', 'Terraza'],
    yearBuilt: 2018,
    expenses: 45000,
    lat: -34.6118,
    lng: -58.3960,
    agent: {
      name: 'Carlos Mendez',
      phone: '+54 11 5555-0002',
      email: 'carlos@realestate.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    featured: false,
    views: 623,
    daysOnMarket: 8
  },
  {
    id: 3,
    title: 'PH de diseño con terraza única',
    city: 'La Plata',
    country: 'Argentina',
    neighborhood: 'Centro',
    price: 185000,
    beds: 3,
    baths: 2,
    area: 120,
    parkings: 0,
    type: 'PH',
    status: 'Venta',
    condition: 'Refaccionado',
    image: 'https://images.unsplash.com/photo-1613977257593-31a0b36a3a56?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1613977257593-31a0b36a3a56?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.4,
    description: 'Hermoso PH totalmente refaccionado conservando detalles de época. Planta baja con living, comedor, cocina y patio. Primera planta con 3 dormitorios y baño completo. Terraza exclusiva de 40m² con parrilla.',
    amenities: ['Terraza Propia', 'Patio', 'Parrilla', 'Lavadero', 'Detalles de Época'],
    yearBuilt: 1950,
    lat: -34.9214,
    lng: -57.9544,
    agent: {
      name: 'Ana Rodríguez',
      phone: '+54 221 555-0003',
      email: 'ana@realestate.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
    },
    featured: true,
    views: 412,
    daysOnMarket: 25
  },
  {
    id: 4,
    title: 'Lote premium en barrio cerrado',
    city: 'Pilar',
    country: 'Argentina',
    neighborhood: 'Country Club',
    price: 85000,
    beds: 0,
    baths: 0,
    area: 800,
    parkings: 0,
    type: 'Lote',
    status: 'Venta',
    condition: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop'],
    rating: 4.3,
    description: 'Excelente lote en uno de los countries más exclusivos de Pilar. Ubicación privilegiada sobre área verde, con todos los servicios. Ideal para construir la casa de tus sueños. Reglamentación flexible.',
    amenities: ['Club House', 'Cancha de Golf', 'Tenis', 'Pileta', 'Seguridad 24hs', 'Vigilancia', 'Área Comercial'],
    yearBuilt: 2024,
    lat: -34.4588,
    lng: -58.9142,
    agent: {
      name: 'Roberto Silva',
      phone: '+54 230 555-0004',
      email: 'roberto@realestate.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    featured: false,
    views: 289,
    daysOnMarket: 18
  },
  {
    id: 5,
    title: 'Oficina corporativa en edificio inteligente',
    city: 'CABA',
    country: 'Argentina',
    neighborhood: 'Catalinas',
    price: 2800,
    beds: 0,
    baths: 2,
    area: 150,
    parkings: 2,
    type: 'Oficina',
    status: 'Alquiler',
    condition: 'A estrenar',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.9,
    description: 'Moderna oficina en torre AAA con certificación LEED. Open space con divisiones de vidrio, sala de reuniones, kitchenette y dos baños privados. Piso técnico, AA central, sistema de seguridad integrado.',
    amenities: ['AA Central', 'Piso Técnico', 'Seguridad Integrada', 'Ascensores de Alta Velocidad', 'Estacionamiento', 'Sala de Reuniones'],
    yearBuilt: 2022,
    expenses: 85000,
    lat: -34.5960,
    lng: -58.3736,
    agent: {
      name: 'Patricia López',
      phone: '+54 11 5555-0005',
      email: 'patricia@realestate.com',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop'
    },
    featured: true,
    views: 1024,
    daysOnMarket: 5
  },
  {
    id: 6,
    title: 'Casa quinta con pileta y quincho',
    city: 'Tigre',
    country: 'Argentina',
    neighborhood: 'Rincón de Milberg',
    price: 890,
    beds: 5,
    baths: 3,
    area: 280,
    parkings: 3,
    type: 'Casa',
    status: 'Temporal',
    condition: 'Usado',
    image: 'https://images.unsplash.com/photo-1566908829550-e6ca6f9a1b3d?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566908829550-e6ca6f9a1b3d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.2,
    description: 'Hermosa casa quinta ideal para descanso familiar. Amplio living con hogar, cocina comedor, 5 dormitorios distribuidos en dos plantas. Parque con pileta, quincho y parrilla. Muelle propio sobre canal navegable.',
    amenities: ['Pileta', 'Quincho', 'Parrilla', 'Muelle Propio', 'Parque 1000m²', 'Cochera Triple', 'Canal Navegable'],
    yearBuilt: 1995,
    lat: -34.4236,
    lng: -58.5665,
    agent: {
      name: 'Miguel Torres',
      phone: '+54 11 5555-0006',
      email: 'miguel@realestate.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'
    },
    featured: false,
    views: 567,
    daysOnMarket: 32
  },
  {
    id: 7,
    title: 'Monoambiente moderno en Microcentro',
    city: 'CABA',
    country: 'Argentina',
    neighborhood: 'Microcentro',
    price: 165000,
    beds: 1,
    baths: 1,
    area: 32,
    parkings: 0,
    type: 'Depto',
    status: 'Venta',
    condition: 'Refaccionado',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop'],
    rating: 4.1,
    description: 'Práctico monoambiente totalmente refaccionado, ideal para inversión o primera vivienda. Excelente ubicación a metros del subte y centros comerciales. Cocina integrada y baño completo.',
    amenities: ['Portería', 'Ascensor', 'Ubicación Céntrica', 'Transporte Público'],
    yearBuilt: 1980,
    expenses: 18000,
    lat: -34.6081,
    lng: -58.3773,
    agent: {
      name: 'Laura Fernández',
      phone: '+54 11 5555-0007',
      email: 'laura@realestate.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b691?q=80&w=200&auto=format&fit=crop'
    },
    featured: false,
    views: 334,
    daysOnMarket: 45
  },
  {
    id: 8,
    title: 'Penthouse con terraza 360°',
    city: 'CABA',
    country: 'Argentina',
    neighborhood: 'Belgrano',
    price: 850000,
    beds: 4,
    baths: 4,
    area: 220,
    parkings: 2,
    type: 'Depto',
    status: 'Venta',
    condition: 'A estrenar',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop'
    ],
    rating: 4.9,
    description: 'Exclusivo penthouse de lujo con terraza privada de 150m² con vista panorámica. Diseño de arquitecto, materiales premium, domótica completa. Master suite con jacuzzi, vestidor y vista al río.',
    amenities: ['Terraza 360°', 'Jacuzzi', 'Domótica', 'Vestidor', 'Vista Panorámica', 'Parrilla Terraza', 'Solarium'],
    yearBuilt: 2024,
    expenses: 95000,
    lat: -34.5503,
    lng: -58.4526,
    agent: {
      name: 'Eduardo Martín',
      phone: '+54 11 5555-0008',
      email: 'eduardo@realestate.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    featured: true,
    views: 1456,
    daysOnMarket: 3
  }
]

const currency = (n: number, isRent: boolean) =>
  isRent ? `$${n.toLocaleString('es-AR')}/m` : `$${n.toLocaleString('es-AR')}`

const FavKey = 'repro_favs'

const RealEstatePro: React.FC = () => {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'Todos' | Property['type']>('Todos')
  const [status, setStatus] = useState<'Todos' | Property['status']>('Todos')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [detail, setDetail] = useState<Property | null>(null)
  const [favs, setFavs] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  // Load favorites
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FavKey)
      if (raw) setFavs(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FavKey, JSON.stringify(favs))
    } catch {}
  }, [favs])

  const toggleFav = (id: number) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const data = useMemo(() => {
    let list = sampleData

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }

    if (type !== 'Todos') list = list.filter((p) => p.type === type)
    if (status !== 'Todos') list = list.filter((p) => p.status === status)
    if (typeof minPrice === 'number')
      list = list.filter((p) => p.price >= minPrice)
    if (typeof maxPrice === 'number')
      list = list.filter((p) => p.price <= maxPrice)
    if (onlyFavs) list = list.filter((p) => favs.includes(p.id))

    return list
  }, [query, type, status, minPrice, maxPrice, onlyFavs, favs])

  return (
    <section className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="h2">RealEstate Pro</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="p mt-2 max-w-3xl">
            Plataforma inmobiliaria demostrativa con búsqueda avanzada, filtros, favoritos persistentes y
            vista detallada. Datos de ejemplo sin conexión real.
          </p>
        </Reveal>

        {/* Filtros */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, ciudad..."
            className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm"
          >
            <option>Todos</option>
            <option>Casa</option>
            <option>Depto</option>
            <option>PH</option>
            <option>Lote</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm"
          >
            <option>Todos</option>
            <option>Venta</option>
            <option>Alquiler</option>
          </select>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="Precio mín"
            className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="Precio máx"
            className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={onlyFavs}
              onChange={(e) => setOnlyFavs(e.target.checked)}
              className="h-4 w-4"
            />
            Solo favoritos
          </label>
        </div>

        {/* Resultados */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            {data.length} resultados • Favoritos: {favs.length}
          </p>
          <div className="flex rounded-lg border border-neutral-800 bg-neutral-900/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-neutral-700 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Square className="h-4 w-4" />
              Grilla
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-r-lg transition-colors ${
                viewMode === 'map' 
                  ? 'bg-neutral-700 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Map className="h-4 w-4" />
              Mapa
            </button>
          </div>
        </div>

        {/* Vista condicional: Grilla o Mapa */}
        {viewMode === 'grid' ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <article key={p.id} className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden hover:border-neutral-600 transition-colors">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute left-3 top-3 rounded-md bg-neutral-900/80 px-2 py-1 text-xs ring-1 ring-neutral-800">
                    {p.type} · {p.status}
                  </div>
                  {p.featured && (
                    <div className="absolute left-3 bottom-3 rounded-md bg-red-500 px-2 py-1 text-xs text-white font-medium">
                      ⭐ Destacado
                    </div>
                  )}
                  <button
                    onClick={() => toggleFav(p.id)}
                    className={`absolute right-3 top-3 rounded-full p-2 transition-all ${
                      favs.includes(p.id) 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favs.includes(p.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {p.neighborhood}, {p.city}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {p.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {p.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" /> {p.area}m²
                    </span>
                    {p.parkings > 0 && (
                      <span className="flex items-center gap-1">
                        <Car className="h-4 w-4" /> {p.parkings}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {p.views} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {p.daysOnMarket} días
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" /> {p.rating}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-emerald-400">
                        {currency(p.price, p.status === 'Alquiler')}
                      </span>
                      {p.expenses && (
                        <span className="text-xs text-neutral-500">+ ${p.expenses.toLocaleString()} expensas</span>
                      )}
                    </div>
                    <button
                      onClick={() => setDetail(p)}
                      className="rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 px-4 py-2 text-sm transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <DynamicMap 
              properties={data}
              onPropertyClick={setDetail}
              favs={favs}
              toggleFav={toggleFav}
            />
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setDetail(null)}>
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950" onClick={(e) => e.stopPropagation()}>
            {/* Header con imágenes */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-1">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={detail.image} alt={detail.title} className="h-full w-full object-cover" />
                </div>
                <div className="grid grid-rows-2 gap-1">
                  {detail.images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="aspect-[16/10] overflow-hidden">
                      <img src={img} alt={`${detail.title} ${idx + 2}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="absolute right-3 top-3 rounded-full bg-neutral-900/90 p-2 text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {detail.featured && (
                <div className="absolute left-3 top-3 rounded-md bg-red-500 px-3 py-1.5 text-sm text-white font-medium">
                  ⭐ Destacado
                </div>
              )}
            </div>
            
            <div className="p-6">
              {/* Header info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{detail.title}</h3>
                  <p className="mt-1 text-neutral-400 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {detail.neighborhood}, {detail.city}, {detail.country}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {detail.views} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {detail.daysOnMarket} días en mercado
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" /> {detail.rating}/5
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFav(detail.id)}
                  className={`p-3 rounded-full transition-all ${
                    favs.includes(detail.id) 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favs.includes(detail.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Especificaciones */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-neutral-400" />
                  <div>
                    <div className="text-lg font-semibold">{detail.beds}</div>
                    <div className="text-xs text-neutral-400">Dormitorios</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-neutral-400" />
                  <div>
                    <div className="text-lg font-semibold">{detail.baths}</div>
                    <div className="text-xs text-neutral-400">Baños</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-neutral-400" />
                  <div>
                    <div className="text-lg font-semibold">{detail.area}m²</div>
                    <div className="text-xs text-neutral-400">Superficie</div>
                  </div>
                </div>
                {detail.parkings > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-neutral-400" />
                    <div>
                      <div className="text-lg font-semibold">{detail.parkings}</div>
                      <div className="text-xs text-neutral-400">Cocheras</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Descripción</h4>
                <p className="text-neutral-300 leading-relaxed">{detail.description}</p>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-neutral-900/60 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs">Año de construcción</div>
                  <div className="font-semibold">{detail.yearBuilt}</div>
                </div>
                <div className="bg-neutral-900/60 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs">Condición</div>
                  <div className="font-semibold">{detail.condition}</div>
                </div>
                <div className="bg-neutral-900/60 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs">Tipo</div>
                  <div className="font-semibold">{detail.type} en {detail.status}</div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Comodidades</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {detail.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-center text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agente */}
              <div className="mt-6 bg-neutral-900/40 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3">Agente a cargo</h4>
                <div className="flex items-center gap-4">
                  <img 
                    src={detail.agent.image} 
                    alt={detail.agent.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{detail.agent.name}</div>
                    <div className="text-sm text-neutral-400">Agente inmobiliario</div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${detail.agent.phone}`}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a 
                      href={`mailto:${detail.agent.email}`}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between bg-neutral-900/40 rounded-lg p-4">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {currency(detail.price, detail.status === 'Alquiler')}
                  </div>
                  {detail.expenses && (
                    <div className="text-sm text-neutral-400">+ ${detail.expenses.toLocaleString()} expensas</div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDetail(null)}
                    className="px-4 py-2 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Cerrar
                  </button>
                  <a 
                    href={`tel:${detail.agent.phone}`}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RealEstatePro
