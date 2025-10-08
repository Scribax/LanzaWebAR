# 🚀 LanzaWebAR - Portfolio Profesional

Portfolio web moderno y profesional que demuestra capacidades de desarrollo con 3 demos interactivos completos.

## ✨ Características Principales

- **3 Demos Profesionales**:
  - 🛒 **ShopMini**: E-commerce completo con carrito, cupones y checkout
  - 📊 **AnalyticsPro**: Dashboard con KPIs, gráficos y exportación
  - 🎯 **SaaSify**: Landing page optimizada para conversión

- **Stack Tecnológico Moderno**:
  - ⚛️ React 19 + TypeScript
  - ⚡ Vite 7 para desarrollo rápido
  - 🎨 Tailwind CSS 4
  - 📊 Chart.js para visualizaciones
  - 🛠️ ESLint 9 para código limpio

- **Funcionalidades Avanzadas**:
  - 📱 Completamente responsive
  - 🌐 Routing con React Router 7
  - 💾 Persistencia con localStorage
  - 📞 Botón WhatsApp flotante animado
  - ✨ Animaciones fluidas y reveal effects

## 🎯 Demos Incluidos

### 🛒 ShopMini (E-commerce)
- Catálogo con búsqueda y filtros
- Carrito persistente con cálculos completos
- Sistema de cupones (`DESC10`, `ENVIOGRATIS`)
- Checkout con validación
- Cálculo de envío gratuito (umbral $120)

### 📊 AnalyticsPro (Dashboard)
- KPIs con variaciones dinámicas
- Filtros por canal (SEM/SEO/Social)
- Gráficos interactivos (Chart.js)
- Tabla con búsqueda y ordenación
- Exportación CSV/JSON

### 🎯 SaaSify (Landing SaaS)
- Hero optimizado para conversión
- Toggle precios mensual/anual (-20%)
- Testimonios con ratings
- Formulario de newsletter
- Secciones de beneficios y precios

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/LanzaWebAR.git

# Navegar al directorio
cd LanzaWebAR

# Instalar dependencias del frontend
npm ci

# Instalar dependencias del backend
npm --prefix server ci
```

### Scripts Disponibles

```bash
# Desarrollo (solo frontend)
npm run dev

# Desarrollo completo (frontend + backend)
npm run dev:full

# Build de producción
npm run build

# Linting
npm run lint

# Preview del build
npm run preview
```

### Inicio Rápido con Script

**Windows:**
```bash
# Ejecutar el script de inicio automático
.\start.bat
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:3001/

## 📁 Estructura del Proyecto

```
LanzaWebAR/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── WhatsAppButton.tsx
│   │   ├── SpecialOffer.tsx
│   │   └── ...
│   ├── pages/
│   │   └── projects/        # Las 3 demos principales
│   ├── hooks/              # Custom hooks
│   └── assets/             # Recursos estáticos
├── server/                 # Backend Node.js/Express
│   └── src/
│       └── index.ts        # API endpoints
├── public/                 # Archivos públicos
└── start.bat              # Script de inicio automático
```

## 🎨 Paleta de Colores

- **Verde**: `#22c55e` (emerald-500)
- **Cyan**: `#06b6d4` (cyan-500)
- **Azul**: `#3b82f6` (blue-500)
- **Fondo**: `#0a0a0a` (negro profundo)

## 🔧 Configuración del Backend

El backend incluye endpoints para:
- `/api/products` - Catálogo de productos
- `/api/checkout` - Proceso de compra
- `/api/contact` - Formulario de contacto
- `/api/analytics` - Datos de dashboard

## 📱 Características Responsivas

- ✅ Diseño mobile-first
- ✅ Breakpoints optimizados
- ✅ Componentes adaptativos
- ✅ Imágenes responsivas
- ✅ Performance optimizado

## 🚀 Despliegue

El proyecto incluye configuración para:
- Docker (frontend + backend)
- CI/CD con GitHub Actions
- VPS deployment ready

Ver `WARP.MD` para el plan completo de despliegue.

## 📄 Licencia

© 2025 LanzaWebAR. Todos los derechos reservados.

## 🤝 Contacto

- WhatsApp: +54 9 11 5617-7616
- Proyecto Demo: [Ver en vivo](#)

---

**Desarrollado con ❤️ usando React + TypeScript + Tailwind**
