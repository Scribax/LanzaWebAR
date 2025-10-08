import React from 'react'
import { Link } from 'react-router-dom'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

type Row = [string, string, string]

const DashboardAnalytics: React.FC = () => {
  const data = [
    { label: 'Usuarios', value: 1240 },
    { label: 'Ventas', value: 320 },
    { label: 'Tasa conv.', value: 4.2 },
  ]
  const [chip, setChip] = React.useState<'SEM'|'SEO'|'Social'|'All'>('All')
  const [barsBase, setBarsBase] = React.useState<number[]>([60, 75, 40, 90, 55, 70])
  const barsSem = [40, 65, 55, 80, 70, 75]
  const barsSeo = [70, 85, 45, 60, 65, 72]
  const barsSoc = [50, 45, 65, 50, 70, 60]
  const bars = chip==='SEM'?barsSem:chip==='SEO'?barsSeo:chip==='Social'?barsSoc:barsBase
  const [points, setPoints] = React.useState<number[]>([0, 20, 45, 30, 70, 55, 85])
  const [sortKey, setSortKey] = React.useState<'Canal'|'Sesiones'|'Conversion'>('Canal')
  const [sortDir, setSortDir] = React.useState<'asc'|'desc'>('asc')
  const [q, setQ] = React.useState('')

  React.useEffect(()=>{
    fetch('/api/analytics')
      .then(r=>r.json())
      .then((data)=>{ setBarsBase(data.bars || barsBase); setPoints(data.points || points) })
      .catch(()=>{})
  }, [])

  function exportCSV() {
    const rows = [
      ['Canal', 'Sesiones', 'Conversion'],
      ['Orgánico', '5240', '4.8%'],
      ['Social', '2120', '3.1%'],
      ['Referidos', '860', '2.9%'],
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight text-indigo-700">AnalyticsPro</Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#kpis" className="hover:text-slate-900">KPIs</a>
            <a href="#charts" className="hover:text-slate-900">Gráficos</a>
            <a href="#tabla" className="hover:text-slate-900">Tabla</a>
          </div>
          <Link to="/" className="text-sm text-indigo-700 hover:text-indigo-900">Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mr-auto">Dashboard Analytics</h1>
          <input type="date" className="rounded-md border px-3 py-2 text-sm" />
          <input type="date" className="rounded-md border px-3 py-2 text-sm" />
          <button onClick={exportCSV} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Exportar CSV</button>
          <button onClick={()=>{ const blob = new Blob([JSON.stringify({bars: bars, points}, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='analytics.json'; a.click(); URL.revokeObjectURL(url); }} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Exportar JSON</button>
        </div>
        <p className="mt-2 text-slate-600">KPIs con variaciones, filtros por canal que afectan al gráfico de barras y tabla ordenable.</p>
        <p className="mt-1 text-xs text-slate-500">Fuente de datos: API demo • Última sincronización: <span id="last-sync">{new Date().toLocaleTimeString()}</span></p>

        <section id="kpis" className="mt-6 grid gap-6 sm:grid-cols-3">
          {data.map((m) => (
            <div key={m.label} className="rounded-xl border bg-white p-5">
              <div className="text-sm text-slate-500">{m.label}</div>
              <div className="mt-2 text-2xl font-bold">{m.value}</div>
              <div className="mt-1 text-xs text-emerald-600">▲ {Math.floor(Math.random()*10)+1}%</div>
            </div>
          ))}
        </section>

        <section id="charts" className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-5">
            <div className="text-sm text-slate-500">Rendimiento semanal</div>
            <div className="mt-4">
              <Bar
                height={160}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 20, max: 100 } } },
                }}
                data={{
                  labels: ['L','M','X','J','V','S'],
                  datasets: [{
                    data: bars,
                    backgroundColor: 'rgba(99,102,241,0.5)',
                  }],
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="text-sm text-slate-500">Tendencia (línea)</div>
            <div className="mt-4">
              <Line
                height={160}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  elements: { line: { tension: 0.3 } },
                  scales: { y: { beginAtZero: true } },
                }}
                data={{
                  labels: ['W1','W2','W3','W4','W5','W6','W7'],
                  datasets: [{
                    data: points,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.1)',
                  }],
                }}
              />
            </div>
          </div>
        </section>

        <section id="tabla" className="mt-8 rounded-xl border bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm text-slate-500">
            <span>Top canales</span>
            <div className="flex items-center gap-2">
              {(['All','SEM','SEO','Social'] as const).map((c)=> (
                <button key={c} onClick={()=>setChip(c)} className={`rounded-full border px-3 py-1.5 text-xs ${chip===c?'bg-indigo-50 border-indigo-200 text-indigo-700':'hover:bg-slate-50'}`}>{c}</button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar canal..." className="rounded-md border px-3 py-1.5 text-xs" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {(['Canal','Sesiones','Conversion'] as const).map((h)=> (
                    <th key={h} className="px-4 py-2 text-left">
                      <button onClick={()=>{ setSortKey(h); setSortDir((d)=> d==='asc'?'desc':'asc') }} className="inline-flex items-center gap-1">
                        {h}
                        <span className="text-xs">{sortKey===h?(sortDir==='asc'?'▲':'▼'):''}</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ['Orgánico', '5,240', '4.8%'],
                  ['Social', '2,120', '3.1%'],
                  ['Referidos', '860', '2.9%'],
                ] as Row[])
                  .filter(r => r[0].toLowerCase().includes(q.toLowerCase()))
                  .sort((a,b)=>{
                    const idx = sortKey==='Canal'?0:sortKey==='Sesiones'?1:2
                    const va = idx===0? a[idx] : parseFloat(a[idx].replace(/[,\%]/g,''))
                    const vb = idx===0? b[idx] : parseFloat(b[idx].replace(/[,\%]/g,''))
                    const cmp = va>vb?1:va<vb?-1:0
                    return sortDir==='asc'?cmp:-cmp
                  })
                  .map((r) => (
                  <tr key={r[0]} className="border-t">
                    <td className="px-4 py-2">{r[0]}</td>
                    <td className="px-4 py-2">{r[1]}</td>
                    <td className="px-4 py-2">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">Demo Dashboard • AnalyticsPro</footer>
    </div>
  )
}

export default DashboardAnalytics
