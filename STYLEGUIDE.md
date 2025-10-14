# 🎨 LanzaWebAR Style Guide

## Esencia Visual

LanzaWebAR tiene una identidad visual dark-first, moderna y tecnológica, caracterizada por gradientes dinámicos y elementos flotantes sutiles.

## 🌈 Paleta de Colores

### Colores de Marca (Trilogía Signature)
```css
:root {
  --accent-from: #22c55e; /* emerald-500 - Verde vibrante */
  --accent-via: #06b6d4;  /* cyan-500 - Cian tecnológico */  
  --accent-to: #3b82f6;   /* blue-500 - Azul moderno */
}
```

### Colores Base
- **Fondo principal**: `#0a0a0a` (negro profundo)
- **Texto primario**: `text-white` / `text-neutral-100`
- **Texto secundario**: `text-neutral-300`
- **Bordes**: `border-neutral-700` / `border-neutral-800`
- **Fondos de elementos**: `bg-neutral-900` / `bg-neutral-950`

### Gradientes de Marca
```css
/* Texto gradiente */
.gradient-text {
  background: linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Botón principal */
.btn-gradient {
  background: linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to));
}
```

## 🎭 Componentes Base

### 1. Tipografía
```css
.h1 { @apply text-4xl md:text-6xl font-extrabold tracking-tight; }
.h2 { @apply text-2xl md:text-3xl font-bold tracking-tight; }
.p  { @apply text-base md:text-lg text-neutral-300; }
```

### 2. Botones

#### Botón Primario (Gradiente)
```tsx
<a href="#" className="btn-gradient">
  <span>Texto del botón</span>
</a>
```

#### Botón Secundario
```tsx
<button className="btn-secondary">
  Texto del botón
</button>
```

#### Botón Terciario
```tsx
<button className="inline-flex items-center rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors">
  Texto del botón
</button>
```

### 3. Cards
```tsx
<div className="card-hover rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-6">
  <h3 className="h2">Título</h3>
  <p className="p">Descripción</p>
</div>
```

### 4. Secciones
```tsx
<section className="scroll-mt-24 py-20">
  <div className="mx-auto max-w-6xl px-4">
    {/* Contenido */}
  </div>
</section>
```

## ✨ Efectos Visuales Signature

### 1. Blobs Flotantes
```tsx
<div className="pointer-events-none absolute inset-0 -z-10">
  <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-sky-500/30" />
  <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/30 via-emerald-500/30 to-cyan-500/30 [animation-delay:1.5s]" />
</div>
```

### 2. Reveal Animations
```tsx
<Reveal>
  <h1 className="h1">Título que aparece</h1>
</Reveal>

<Reveal delay={100}>
  <p className="p">Párrafo con delay</p>
</Reveal>
```

### 3. Glass Effect
```tsx
<div className="glass rounded-xl p-6">
  <h3>Contenido con efecto glass</h3>
</div>
```

## 🎪 Backgrounds Característicos

### Background de Hero
```css
body {
  background: 
    radial-gradient(60% 60% at 20% 0%, rgba(34,197,94,0.18) 0%, rgba(2,6,23,0) 50%),
    radial-gradient(50% 50% at 100% 10%, rgba(6,182,212,0.22) 0%, rgba(2,6,23,0) 45%),
    radial-gradient(60% 40% at 80% 0%, rgba(59,130,246,0.18) 0%, rgba(2,6,23,0) 50%),
    #0a0a0a;
}
```

### Background de Sección
```tsx
<div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(6,182,212,0.14)_0%,rgba(10,10,10,0)_60%)]" />
```

## 🏗️ Layouts Base

### Hero Section
```tsx
<section className="relative isolate overflow-hidden pt-28">
  <div className="mx-auto max-w-6xl px-4">
    <div className="py-20 md:py-28">
      <Reveal>
        <p className="mb-4 inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-neutral-800">
          Badge de estado
        </p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="h1">
          Título principal con <span className="gradient-text">palabras destacadas</span>
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="p mt-4 max-w-2xl">
          Descripción principal de la sección
        </p>
      </Reveal>
      <Reveal delay={300}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="btn-gradient"><span>CTA Principal</span></a>
          <a href="#projects" className="btn-secondary">CTA Secundario</a>
        </div>
      </Reveal>
    </div>
  </div>

  {/* Blobs flotantes */}
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-sky-500/30" />
    <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/30 via-emerald-500/30 to-cyan-500/30 [animation-delay:1.5s]" />
  </div>
</section>
```

### Content Section
```tsx
<section className="scroll-mt-24 py-20">
  <div className="mx-auto max-w-6xl px-4">
    <Reveal>
      <h2 className="h2 text-center">Título de Sección</h2>
      <p className="p mx-auto mt-4 max-w-2xl text-center">
        Descripción de la sección
      </p>
    </Reveal>
    
    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Items de contenido */}
    </div>
  </div>
</section>
```

## 🎯 Estados Visuales

### Estados de Botones
- **Normal**: Colores base
- **Hover**: Elevación sutil + cambio de color
- **Focus**: Ring verde (`focus:ring-green-500/50`)
- **Disabled**: Opacidad reducida (`disabled:opacity-50`)

### Estados de Elementos
```css
.status-active  { @apply text-green-400 bg-green-900/20; }
.status-pending { @apply text-yellow-400 bg-yellow-900/20; animation: status-pulse 2s infinite; }
.status-error   { @apply text-red-400 bg-red-900/20; }
```

## 📱 Responsividad

### Breakpoints
- **Móvil**: Base (sin prefijo)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Desktop grande**: `xl:` (1280px+)

### Patrones Comunes
```tsx
{/* Tipografía responsive */}
<h1 className="text-4xl md:text-6xl">Título</h1>

{/* Grid responsive */}
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

{/* Padding responsive */}
<div className="py-20 md:py-28">

{/* Flex responsive */}
<div className="flex flex-col md:flex-row gap-4">
```

## 🔧 Utilidades Personalizadas

### Focus Ring
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900;
}
```

### Inputs
```css
.input-field {
  @apply w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200;
}
```

## 🎬 Animaciones

### Keyframes Personalizados
```css
@keyframes float {
  0% { transform: translateY(0px) translateX(0px) scale(1); }
  50% { transform: translateY(-8px) translateX(6px) scale(1.02); }
  100% { transform: translateY(0px) translateX(0px) scale(1); }
}

@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}
```

## 📐 Espaciado y Ritmo

### Espaciado Vertical
- **Secciones**: `py-20` (móvil) / `py-28` (desktop)
- **Entre elementos**: `mt-4`, `mt-8`, `mt-16`
- **Contenedores**: `px-4` (móvil) / `px-6` (desktop)

### Contenedores
- **Ancho máximo**: `max-w-6xl mx-auto`
- **Contenido de texto**: `max-w-2xl` para párrafos largos

## ✅ Checklist para Nuevas Páginas

- [ ] Usar fondo dark base (`#0a0a0a`) con gradientes sutiles
- [ ] Aplicar la trilogía de colores en elementos clave
- [ ] Incluir al menos 2 blobs flotantes con gradiente de marca
- [ ] Usar componente `Reveal` para animaciones de entrada
- [ ] Aplicar tipografía consistente (`.h1`, `.h2`, `.p`)
- [ ] Botón principal con `.btn-gradient`
- [ ] Espaciado vertical consistente (`py-20/28`)
- [ ] Contenedor máximo de `max-w-6xl`
- [ ] Efectos hover sutiles en elementos interactivos
- [ ] Focus rings verdes en elementos focuseables
- [ ] Responsive design con breakpoints md/lg
