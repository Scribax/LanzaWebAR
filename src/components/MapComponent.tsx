import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix para los iconos por defecto de Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// Iconos personalizados para cada tipo de propiedad
const createCustomIcon = (type: string, featured: boolean) => {
  const typeColors: Record<string, string> = {
    'Casa': '#22c55e',
    'Depto': '#3b82f6', 
    'PH': '#f59e0b',
    'Lote': '#8b5cf6',
    'Oficina': '#06b6d4'
  }
  
  const color = featured ? '#ef4444' : typeColors[type] || '#3b82f6'
  const symbol = featured ? '★' : type[0]
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${symbol}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

// Función para formatear precios
const currency = (n: number, isRent: boolean) =>
  isRent ? `$${n.toLocaleString('es-AR')}/m` : `$${n.toLocaleString('es-AR')}`

interface MapComponentProps {
  properties: any[]
  onPropertyClick: (property: any) => void
  favs: number[]
  toggleFav: (id: number) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  properties, 
  onPropertyClick, 
  favs, 
  toggleFav 
}) => {
  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #1f1f1f !important;
          color: white !important;
          border-radius: 8px;
          border: 1px solid #404040;
        }
        .leaflet-popup-tip {
          background: #1f1f1f !important;
          border: 1px solid #404040;
        }
        .leaflet-popup-close-button {
          color: white !important;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          background: #0f172a !important;
        }
      `}</style>
      <div className="h-[600px] w-full rounded-xl overflow-hidden border border-neutral-800">
        <MapContainer 
          center={[-34.6037, -58.3816]} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createCustomIcon(property.type, property.featured)}
            >
              <Popup maxWidth={280} closeButton={true}>
                <div className="p-3">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold text-white mb-1 text-sm">{property.title}</h3>
                  <p className="text-xs text-gray-300 mb-2">
                    📍 {property.neighborhood}, {property.city}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-3">
                    <span>🛏 {property.beds}</span>
                    <span>🛁 {property.baths}</span>
                    <span>📏 {property.area}m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">
                      {currency(property.price, property.status === 'Alquiler')}
                    </span>
                    <button
                      onClick={() => onPropertyClick(property)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}

export default MapComponent