import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

// Minimal product source (sync with EcommerceMinimal)
const PRODUCTS = [
  { id: 1, name: 'Reloj Minimal', price: 99, cat: 'Relojes', desc: 'Caja de aluminio 40mm, correa de silicona, 5ATM, batería hasta 7 días.', img:'https://source.unsplash.com/1200x800/?watch,minimal' },
  { id: 2, name: 'Auriculares', price: 59, cat: 'Audio', desc: 'Bluetooth 5.3, 24h con estuche, micrófono con cancelación de ruido.', img:'https://source.unsplash.com/1200x800/?headphones' },
  { id: 3, name: 'Smartband', price: 79, cat: 'Wearables', desc: 'Seguimiento de actividad, frecuencia cardíaca 24/7, resistencia IP68.', img:'https://source.unsplash.com/1200x800/?smartwatch,fitness' },
  { id: 4, name: 'Reloj Sport', price: 129, cat: 'Relojes', desc: 'GPS integrado, cristal reforzado, 10ATM para natación.', img:'https://source.unsplash.com/1200x800/?watch,sport' },
  { id: 5, name: 'Auriculares Pro', price: 89, cat: 'Audio', desc: 'Drivers de 10mm, carga rápida USB‑C, modo transparencia.', img:'https://source.unsplash.com/1200x800/?headphones,pro' },
]

type Product = typeof PRODUCTS[number]

const ProductDetail: React.FC = () => {
  const { id } = useParams()
  const nav = useNavigate()
  const [product, setProduct] = React.useState<Product | null>(null)
  React.useEffect(()=>{
    fetch(`/api/products/${id}`)
      .then(r=>r.ok?r.json():null)
      .then((data)=> setProduct(data || PRODUCTS.find(p=>p.id===Number(id)) || null))
      .catch(()=> setProduct(PRODUCTS.find(p=>p.id===Number(id)) || null))
  }, [id])

  const add = (p: Product) => {
    try {
      const raw = localStorage.getItem('shopmini_cart')
      const cart = raw ? JSON.parse(raw) : []
      const i = cart.findIndex((x: any) => x.id === p.id)
      if (i >= 0) cart[i].qty += 1; else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 })
      localStorage.setItem('shopmini_cart', JSON.stringify(cart))
      alert('Añadido al carrito (demo)')
    } catch {}
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p className="text-sm text-neutral-500">Producto no encontrado.</p>
        <button onClick={()=>nav(-1)} className="mt-4 rounded-md border px-3 py-1.5 text-sm">Volver</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/projects/ecommerce-minimal" className="text-sm text-sky-700 hover:text-sky-900">← Catálogo</Link>
          <Link to="/" className="text-sm text-sky-700 hover:text-sky-900">Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">
<img src={product.img} alt={`Imagen de ${product.name}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <div className="text-sm text-neutral-500">{product.cat}</div>
            <h1 className="mt-1 text-2xl font-extrabold">{product.name}</h1>
            <div className="mt-2 text-yellow-500">★★★★★</div>
            <p className="mt-3 text-sm text-neutral-600">{product.desc}</p>
            <div className="mt-4 text-3xl font-extrabold">${product.price}</div>
            <div className="mt-5 flex gap-2">
              <button onClick={()=>add(product)} className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Añadir al carrito</button>
              <button onClick={()=>nav(-1)} className="rounded-md border px-5 py-2.5 text-sm">Volver</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
