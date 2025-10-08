import React from 'react'
import { Link } from 'react-router-dom'

const EcommerceMinimal: React.FC = () => {
  const [cart, setCart] = React.useState<{ id: number; name: string; price: number; qty: number }[]>([])
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<'relevancia' | 'precio-asc' | 'precio-desc'>('relevancia')
  const categories = ['Relojes', 'Audio', 'Wearables'] as const
  const [activeCat, setActiveCat] = React.useState<(typeof categories)[number] | 'Todo'>('Todo')
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const [customer, setCustomer] = React.useState({ nombre: '', email: '', direccion: '' })

  type Product = { id:number; name:string; price:number; cat:'Relojes'|'Audio'|'Wearables'; desc:string; img:string }
  const [products, setProducts] = React.useState<Product[]>([])
  React.useEffect(()=>{
    fetch('/api/products')
      .then(r=>r.json())
      .then((data: Product[])=> setProducts(data))
      .catch(()=>{
        // fallback en caso de API caída
        setProducts([
          { id: 1, name: 'Reloj Minimal', price: 99, cat: 'Relojes', desc: 'Caja de aluminio 40mm, correa de silicona, 5ATM, batería hasta 7 días.', img:'https://source.unsplash.com/1200x800/?watch,minimal' },
          { id: 2, name: 'Auriculares', price: 59, cat: 'Audio', desc: 'Bluetooth 5.3, 24h con estuche, micrófono con cancelación de ruido.', img:'https://source.unsplash.com/1200x800/?headphones' },
          { id: 3, name: 'Smartband', price: 79, cat: 'Wearables', desc: 'Seguimiento de actividad, frecuencia cardíaca 24/7, resistencia IP68.', img:'https://source.unsplash.com/1200x800/?smartwatch,fitness' },
          { id: 4, name: 'Reloj Sport', price: 129, cat: 'Relojes', desc: 'GPS integrado, cristal reforzado, 10ATM para natación.', img:'https://source.unsplash.com/1200x800/?watch,sport' },
          { id: 5, name: 'Auriculares Pro', price: 89, cat: 'Audio', desc: 'Drivers de 10mm, carga rápida USB‑C, modo transparencia.', img:'https://source.unsplash.com/1200x800/?headphones,pro' },
        ])
      })
  }, [])
  const add = (p: { id: number; name: string; price: number }) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id)
      if (i >= 0) {
        const next = [...c]
        next[i] = { ...next[i], qty: next[i].qty + 1 }
        return next
      }
      return [...c, { ...p, qty: 1 }]
    })
  }
  const dec = (id: number) => {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))
  }
  const inc = (id: number) => {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)))
  }
  const remove = (id: number) => setCart((c) => c.filter((x) => x.id !== id))
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const [coupon, setCoupon] = React.useState<string>(()=>{
    try { return localStorage.getItem('shopmini_coupon') || '' } catch { return '' }
  })
  const FREE_SHIPPING_THRESHOLD = 120
  const shippingBase = cart.length ? 5 : 0
  const discount = coupon.toUpperCase()==='DESC10' ? Math.round(subtotal * 0.10) : 0
  const shipping = (coupon.toUpperCase()==='ENVIOGRATIS' || (subtotal - discount) >= FREE_SHIPPING_THRESHOLD) ? 0 : shippingBase
  const impuestos = Math.round((subtotal - discount) * 0.18)
  const total = Math.max(0, subtotal - discount) + shipping + impuestos

  let filtered = products.filter((p) =>
    (activeCat === 'Todo' || p.cat === activeCat) && p.name.toLowerCase().includes(query.toLowerCase())
  )
  if (sort === 'precio-asc') filtered = filtered.sort((a, b) => a.price - b.price)
  if (sort === 'precio-desc') filtered = filtered.sort((a, b) => b.price - a.price)

  React.useEffect(()=>{
    try { localStorage.setItem('shopmini_coupon', coupon) } catch {}
  }, [coupon])

  function placeOrder(e: React.FormEvent) {
    e.preventDefault()
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)
    if (!customer.nombre || !emailOk || !customer.direccion) {
      return alert('Revisa los datos: nombre, email válido y dirección son obligatorios')
    }
    alert('Pedido realizado (demo). ¡Gracias!')
    setCart([])
    setCheckoutOpen(false)
  }

  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem('shopmini_cart')
      if (raw) setCart(JSON.parse(raw))
    } catch {}
  }, [])
  React.useEffect(()=>{
    try { localStorage.setItem('shopmini_cart', JSON.stringify(cart)) } catch {}
  }, [cart])

  const [selected, setSelected] = React.useState<Product | null>(null)

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight text-sky-700">ShopMini</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
            <a className="hover:text-neutral-900" href="#catalogo">Catálogo</a>
            <a className="hover:text-neutral-900" href="#carrito">Carrito</a>
          </nav>
          <Link to="/" className="text-sm text-sky-700 hover:text-sky-900">Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Promo hero */}
        <div className="rounded-xl border bg-gradient-to-r from-sky-50 to-emerald-50 p-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">E‑commerce Minimal</h1>
          <p className="mt-2 text-neutral-600">Catálogo con búsqueda y filtros, carrito persistente, cupones y cálculo realista de envío/impuestos.</p>
          <p className="mt-1 text-sm text-emerald-700">Pago seguro, envíos 24/48h y devoluciones en 30 días (demo).</p>
        </div>

        {/* Filtros */}
        <section id="catalogo" className="mt-6 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full md:w-64 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
            <div className="hidden md:block text-xs text-neutral-600">Envío gratis a partir de ${FREE_SHIPPING_THRESHOLD}</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-sky-500"
            >
              <option value="relevancia">Ordenar: Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
            <div className="ml-auto flex flex-wrap gap-2">
              <button onClick={() => setActiveCat('Todo')} className={`rounded-full px-3 py-1.5 text-sm border ${activeCat==='Todo'?'bg-sky-100 border-sky-300 text-sky-800':'border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>Todo</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setActiveCat(c)} className={`rounded-full px-3 py-1.5 text-sm border ${activeCat===c?'bg-sky-100 border-sky-300 text-sky-800':'border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border p-5 bg-white hover:shadow-sm transition-shadow">
                <Link to={`/projects/ecommerce-minimal/${p.id}`} className="block w-full text-left">
                  <div className="aspect-[16/10] rounded-lg bg-neutral-100 overflow-hidden">
<img src={p.img} alt={`Imagen de ${p.name}`} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-neutral-500">${p.price}</div>
                  </div>
                  <button onClick={() => add(p)} className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Añadir</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carrito */}
        <section id="carrito" className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-lg">Carrito</h2>
            {cart.length === 0 ? (
              <p className="text-sm text-neutral-500 mt-2">Vacío. Agrega productos.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {cart.map((i) => (
                  <div key={i.id} className="flex items-center justify-between text-sm">
                    <div className="font-medium">{i.name}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => dec(i.id)} className="rounded-md border px-2 py-1">−</button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button onClick={() => inc(i.id)} className="rounded-md border px-2 py-1">+</button>
                    </div>
                    <div className="w-20 text-right">${i.price * i.qty}</div>
                    <button onClick={() => remove(i.id)} className="text-red-600 hover:underline">Quitar</button>
                  </div>
                ))}
                <div className="mt-3 space-y-1 border-t pt-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
                  <div className="flex justify-between"><span>Envío</span><span>${shipping}</span></div>
                  <div className="flex justify-between"><span>Impuestos (18%)</span><span>${impuestos}</span></div>
                  <div className="flex justify-between font-semibold text-neutral-900"><span>Total</span><span>${total}</span></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span>Cupones: </span>
                    <button onClick={()=>setCoupon('DESC10')} className="rounded-full border px-2 py-1 hover:bg-neutral-50">DESC10</button>
                    <button onClick={()=>setCoupon('ENVIOGRATIS')} className="rounded-full border px-2 py-1 hover:bg-neutral-50">ENVIOGRATIS</button>
                    <button onClick={()=>setCoupon('')} className="rounded-full border px-2 py-1 hover:bg-neutral-50">Quitar</button>
                  </div>
                  <button onClick={() => setCheckoutOpen(true)} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Proceder al pago</button>
                </div>
                <div className="mt-2 text-xs text-neutral-600">
                  { (subtotal - discount) >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-700">¡Tienes envío gratis!</span>
                  ) : (
                    <span>Te faltan ${Math.max(0, FREE_SHIPPING_THRESHOLD - Math.max(0, subtotal - discount))} para envío gratis.</span>
                  ) }
                </div>
                <div className="mt-2 text-[11px] text-neutral-500">Pago seguro SSL • Envío 24/48h • Devolución 30 días</div>
              </div>
            )}
          </div>

          {/* Checkout */}
          {checkoutOpen && (
            <form onSubmit={placeOrder} className="rounded-xl border bg-white p-5">
              <h2 className="font-semibold text-lg">Datos de envío</h2>
              <div className="mt-3 grid gap-3">
                <input className="rounded-md border px-3 py-2 text-sm" placeholder="Nombre y apellido" value={customer.nombre} onChange={(e)=>setCustomer({...customer, nombre:e.target.value})} required />
                <input className="rounded-md border px-3 py-2 text-sm" placeholder="Email" type="email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} required />
                <input className="rounded-md border px-3 py-2 text-sm" placeholder="Dirección" value={customer.direccion} onChange={(e)=>setCustomer({...customer, direccion:e.target.value})} required />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button type="button" onClick={()=>setCheckoutOpen(false)} className="rounded-md border px-4 py-2 text-sm">Cancelar</button>
                <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Pagar ${total}</button>
              </div>
            </form>
          )}
        </section>
        {/* Modal de detalle */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={()=>setSelected(null)}>
            <div className="w-full max-w-xl rounded-xl border bg-white p-5" onClick={(e)=>e.stopPropagation()}>
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100">
<img src={selected.img} alt={`Imagen de ${selected.name}`} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{selected.name}</h3>
              <div className="mt-1 text-sm text-neutral-600">{selected.desc}</div>
              <div className="mt-2 text-yellow-500">★★★★★</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-2xl font-bold">${selected.price}</div>
                <div className="flex gap-2">
                  <button onClick={()=>{add(selected); setSelected(null)}} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Añadir al carrito</button>
                  <button onClick={()=>setSelected(null)} className="rounded-md border px-4 py-2 text-sm">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-neutral-500">Demo E‑commerce • ShopMini</footer>
    </div>
  )
}

export default EcommerceMinimal
