# 🚀 LanzaWebAR - Plataforma de Hosting Automatizada

**LanzaWebAR** es una plataforma completa de hosting automatizada que combina un sitio web profesional con un sistema backend robusto para la gestión automática de servicios de hosting mediante integración WHM/cPanel.

> **🎯 Estado Actual:** Sistema completo funcionando en producción en https://lanzawebar.com

## ✨ Características Principales

### 🌐 **Sitio Web Profesional**
- **Sitio React moderno** con diseño oscuro y gradientes de marca (verde→cian→azul)
- **Portfolio interactivo** con 4 demos profesionales integrados
- **Sistema de autenticación** completo con JWT
- **Dashboard de usuario** para gestión de servicios
- **Integración MercadoPago** para pagos en producción
- **Páginas de resultado de pago** (success/failure/pending) con diseño coherente

### 🛒 **Demos Profesionales Incluidos**
- 🛒 **ShopMini**: E-commerce completo con carrito, cupones y checkout
- 📊 **AnalyticsPro**: Dashboard con KPIs, gráficos y exportación CSV/JSON
- 🎯 **SaaSify**: Landing page SaaS optimizada para conversión
- 🏠 **RealEstate Pro**: Plataforma inmobiliaria con mapas interactivos y favoritos

### ⚡ **Backend Robusto**
- **API REST completa** con Node.js + TypeScript + Express
- **Base de datos SQLite** para usuarios, órdenes y servicios
- **Integración WHM API** para creación automática de cuentas de hosting
- **Sistema de emails** con Gmail SMTP configurado
- **Autenticación JWT** con middleware de seguridad
- **Validaciones completas** y manejo de errores

### 🔧 **Automatización de Hosting**
- **Creación automática** de cuentas cPanel via WHM API
- **Subdominios personalizados** (`usuario.lanzawebar.com`)
- **3 planes reales** mapeados a paquetes WHM
- **Generación segura** de credenciales
- **Emails automáticos** con credenciales de acceso
- **Integración FTP** para deployment de plantillas

## 🎯 **Sistema de Hosting en Producción**

### **📋 Planes Disponibles:**
- **Básico**: AR$ 2.000/mes - 2GB SSD / 20GB transferencia
- **Pro**: AR$ 3.500/mes - 5GB SSD / 50GB transferencia  
- **Premium**: AR$ 5.500/mes - 10GB SSD / 100GB transferencia

### **🌐 Servidor de Producción:**
- **Servidor**: Blue106 (BlueHosting)  
- **IP**: 186.64.119.195
- **Panel WHM**: https://blue106.dnsmisitio.net:2087
- **Usuario**: lanzawe1
- **DNS**: ns1.dnsmisitio.net, ns2.dnsmisitio.net, ns3.dnsmisitio.net

### **💳 Pagos en Producción:**
- **MercadoPago** integrado con credenciales reales
- **Facturación** mensual y anual (-20% descuento)
- **URLs de retorno** configuradas correctamente
- **Webhooks** para automatización de post-pago

## 🏗️ **Stack Tecnológico**

### **Frontend**
- ⚛️ **React 19** + TypeScript
- ⚡ **Vite 7** para desarrollo y build optimizado
- 🎨 **Tailwind CSS 4** con diseño custom
- 📊 **Chart.js** para visualizaciones de datos
- 🗺️ **Leaflet** para mapas interactivos (RealEstate demo)
- 🛣️ **React Router 7** para navegación SPA
- 🔒 **Context API** para autenticación global

### **Backend**
- 🟢 **Node.js 20** + TypeScript + Express
- 🗄️ **SQLite** con queries SQL nativas
- 🔐 **JWT** para autenticación segura
- 📧 **Nodemailer** + Gmail SMTP
- 🏠 **WHM API** para gestión de hosting
- 📊 **Bcrypt** para hash de passwords
- ⚙️ **Dotenv** para configuración de entorno

### **Infraestructura**
- 🌐 **Nginx** como reverse proxy y servidor estático
- 🔒 **SSL/TLS** con certificados Let's Encrypt
- ☁️ **Cloudflare** proxy para CDN y seguridad
- 📂 **FTP** para deployment automatizado
- 📊 **Systemd** para servicios en producción

## 🚀 **Instalación y Desarrollo**

### **Requisitos**
- Node.js 18+
- npm/yarn
- Git

### **Instalación Completa**

```bash
# Clonar el repositorio
git clone https://github.com/Scribax/LanzaWebAR.git
cd LanzaWebAR

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### **Configuración de Entorno**

```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env

# Configurar variables de entorno
nano .env
```

**Variables de entorno principales:**
```bash
# JWT
JWT_SECRET=tu_jwt_secret

# Base de datos
DATABASE_URL=./database.sqlite

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# WHM
WHM_URL=https://tu-servidor:2087
WHM_USERNAME=tu_usuario_whm
WHM_PASSWORD=tu_password_whm

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### **Scripts de Desarrollo**

```bash
# Desarrollo frontend solamente
npm run dev

# Desarrollo completo (frontend + backend)
npm run dev:full

# Solo backend
cd server && npm run dev

# Build de producción
npm run build

# Linting y verificaciones
npm run lint
```

## 📁 **Estructura del Proyecto**

```
LanzaWebAR/
├── 📁 src/                          # Frontend React
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── Hero.tsx                # Hero con gradientes animados
│   │   ├── Services.tsx            # Sección de servicios
│   │   ├── Projects.tsx            # Portfolio con demos
│   │   ├── Contact.tsx             # Formulario de contacto
│   │   ├── Navbar.tsx              # Navegación principal
│   │   ├── WhatsAppButton.tsx      # Botón flotante WhatsApp
│   │   └── auth/                   # Componentes de autenticación
│   ├── 📁 pages/                   # Páginas principales
│   │   ├── Login.tsx               # Página de login
│   │   ├── Register.tsx            # Página de registro
│   │   ├── Dashboard.tsx           # Dashboard de usuario
│   │   ├── HostingPage.tsx         # Página de planes de hosting
│   │   ├── payment/                # Páginas de resultado de pago
│   │   │   ├── PaymentSuccess.tsx  # Pago exitoso
│   │   │   ├── PaymentFailure.tsx  # Pago fallido
│   │   │   └── PaymentPending.tsx  # Pago pendiente
│   │   └── projects/               # Demos integrados
│   │       ├── EcommerceMinimal.tsx
│   │       ├── DashboardAnalytics.tsx
│   │       ├── LandingSaas.tsx
│   │       └── RealEstatePro.tsx
│   ├── 📁 contexts/                # Context API
│   │   └── AuthContext.tsx         # Contexto de autenticación
│   ├── 📁 services/                # Servicios y APIs
│   └── 📁 assets/                  # Recursos estáticos
│
├── 📁 server/                      # Backend Node.js
│   ├── 📁 src/
│   │   ├── index.ts                # Servidor principal
│   │   ├── auth.ts                 # Autenticación y JWT
│   │   ├── database.ts             # Gestión de base de datos
│   │   └── services/               # Servicios del backend
│   │       ├── mercadopagoService.ts
│   │       ├── emailService.ts
│   │       └── hostingAutomation.ts
│   ├── database.sqlite             # Base de datos SQLite
│   └── package.json                # Dependencias backend
│
├── 📁 vps-provisioning/            # Sistema de automatización
│   ├── lanzawebar-provisioner.js   # Script principal
│   ├── whm-integration.js          # Integración WHM
│   ├── ftp-deployment.js           # Deployment automático
│   └── panel-reseller.html         # Panel de gestión web
│
├── 📁 dist/                        # Build de producción
├── 📁 public/                      # Archivos públicos
├── .env                            # Variables de entorno
├── README.md                       # Esta documentación
├── IMPLEMENTACION_FINAL.md         # Documentación técnica
└── package.json                    # Dependencias frontend
```

## 🎨 **Diseño y Marca**

### **Paleta de Colores**
```css
:root {
  --accent-from: #22c55e; /* emerald-500 */
  --accent-via: #06b6d4;  /* cyan-500 */
  --accent-to: #3b82f6;   /* blue-500 */
}
```

### **Características Visuales**
- ✅ **Fondo oscuro** (`bg-neutral-950`) con detalles sutiles
- ✅ **Gradientes animados** flotantes con efectos blob
- ✅ **Tipografía moderna** con Inter y pesos optimizados
- ✅ **Botones con gradiente** usando clase `btn-gradient`
- ✅ **Texto con gradiente** usando clase `gradient-text`
- ✅ **Transiciones fluidas** en toda la interfaz
- ✅ **Diseño responsive** mobile-first

## 🌐 **URLs de Producción**

### **Sitio Principal**
- **Principal**: https://lanzawebar.com
- **Login**: https://lanzawebar.com/login
- **Registro**: https://lanzawebar.com/register
- **Dashboard**: https://lanzawebar.com/dashboard
- **Hosting**: https://lanzawebar.com/hosting

### **Demos Integrados**
- **ShopMini**: https://lanzawebar.com/projects/ecommerce-minimal
- **Analytics**: https://lanzawebar.com/projects/dashboard-analytics  
- **SaaS**: https://lanzawebar.com/projects/landing-saas
- **RealEstate**: https://lanzawebar.com/projects/real-estate-pro

### **Páginas de Pago**
- **Éxito**: https://lanzawebar.com/payment/success
- **Error**: https://lanzawebar.com/payment/failure
- **Pendiente**: https://lanzawebar.com/payment/pending

### **Backend API**
- **API Base**: https://lanzawebar.com/api
- **Autenticación**: https://lanzawebar.com/api/auth/*
- **Hosting**: https://lanzawebar.com/api/hosting/*
- **Pagos**: https://lanzawebar.com/api/payments/*

## 🔧 **Funcionalidades del Backend**

### **Endpoints de Autenticación**
```typescript
POST /api/auth/register  // Registro de usuarios
POST /api/auth/login     // Login con JWT
GET  /api/auth/me        // Perfil del usuario
```

### **Endpoints de Hosting**
```typescript
POST /api/hosting/create-account    // Crear cuenta de hosting
GET  /api/hosting/orders           // Listar órdenes del usuario
GET  /api/hosting/services         // Servicios activos
```

### **Endpoints de Pagos**
```typescript
POST /api/payments/create-preference  // Crear preferencia MercadoPago
POST /api/payments/webhook           // Webhook de MercadoPago
GET  /api/payments/status/:id        // Estado del pago
```

### **Características del Backend**
- ✅ **Validación completa** de inputs con mensajes claros
- ✅ **Manejo de errores** estructurado con logs
- ✅ **Rate limiting** para seguridad
- ✅ **CORS configurado** para el dominio de producción
- ✅ **Middleware de autenticación** con JWT
- ✅ **Base de datos** con queries optimizadas
- ✅ **Emails transaccionales** automáticos

## 🔐 **Seguridad Implementada**

### **Frontend**
- ✅ **Rutas protegidas** con ProtectedRoute component
- ✅ **Tokens almacenados** en localStorage de forma segura
- ✅ **Validación de formularios** en tiempo real
- ✅ **HTTPS obligatorio** en producción

### **Backend**
- ✅ **Passwords hasheados** con bcrypt (12 rounds)
- ✅ **JWT con expiración** (7 días)
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Variables de entorno** para credenciales
- ✅ **Headers de seguridad** configurados

## 📊 **Base de Datos**

### **Tabla: users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);
```

### **Tabla: orders**
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id TEXT NOT NULL,
  domain_option TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'ARS',
  status TEXT DEFAULT 'pending',
  mercadopago_payment_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### **Tabla: hosting_services**
```sql
CREATE TABLE hosting_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  whm_username TEXT,
  whm_password TEXT,
  domain TEXT NOT NULL,
  cpanel_url TEXT,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'creating',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders (id)
);
```

## 🚀 **Despliegue en Producción**

### **Servidor VPS AlmaLinux 8.3**
```bash
# Ubicación del proyecto
/var/www/lanzaweb/

# Servicio del backend
systemctl status lanzaweb-backend

# Nginx configuración
/etc/nginx/sites-available/lanzawebar.com

# SSL certificados
/etc/letsencrypt/live/lanzawebar.com/
```

### **Configuración Nginx**
```nginx
server {
    listen 443 ssl http2;
    server_name lanzawebar.com www.lanzawebar.com;
    
    # SSL configuración
    ssl_certificate /etc/letsencrypt/live/lanzawebar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lanzawebar.com/privkey.pem;
    
    # Frontend estático
    location / {
        root /var/www/lanzaweb/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **Servicio Systemd**
```ini
[Unit]
Description=LanzaWebAR Backend Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/lanzaweb/server
Environment=NODE_ENV=production
EnvironmentFile=/var/www/lanzaweb/server/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 📈 **Métricas y Performance**

### **Performance del Sitio**
- ✅ **Lighthouse Score**: 90+ en todas las métricas
- ✅ **First Content Paint**: < 1.2s
- ✅ **Time to Interactive**: < 2.5s
- ✅ **Cumulative Layout Shift**: < 0.1

### **Estadísticas del Proyecto**
- **📄 Líneas de código**: +8,000 líneas TypeScript/React
- **🧩 Componentes**: 45+ componentes React
- **🛣️ Rutas**: 15+ rutas configuradas
- **📊 Endpoints API**: 20+ endpoints backend
- **🎨 Demos**: 4 aplicaciones completas integradas

## 📞 **Contacto y Soporte**

### **Información de Contacto**
- **WhatsApp**: +54 9 11 5617-7616
- **Email**: francodemartos2025@gmail.com
- **Sitio Web**: https://lanzawebar.com
- **GitHub**: https://github.com/Scribax/LanzaWebAR

### **Soporte Técnico**
- **Email Soporte**: soporte@lanzawebar.com
- **Documentación**: Ver archivos `IMPLEMENTACION_FINAL.md` y `vps-provisioning/README.md`
- **Panel WHM**: https://blue106.dnsmisitio.net:2087

## 📄 **Licencia**

© 2025 LanzaWebAR - Franco Demartos. Todos los derechos reservados.

Este proyecto es propiedad privada y está desarrollado como una plataforma comercial de hosting automatizada.

## 🏆 **Estado del Proyecto**

### **✅ Completado y en Producción:**
- [x] Sitio web completo con 4 demos integrados
- [x] Sistema de autenticación completo
- [x] Backend API con todas las funcionalidades
- [x] Integración MercadoPago funcionando
- [x] Creación automática de cuentas de hosting
- [x] Sistema de emails configurado
- [x] Páginas de resultado de pago diseñadas
- [x] Despliegue en producción con SSL
- [x] Subdominios personalizados funcionando
- [x] Base de datos con usuarios reales
- [x] Documentación completa

### **🔄 Próximas Mejoras:**
- [ ] Panel de administración avanzado
- [ ] Sistema de tickets de soporte
- [ ] Integración con more payment providers
- [ ] App móvil para gestión
- [ ] Sistema de afiliados
- [ ] Métricas avanzadas y analytics

---

**🚀 LanzaWebAR - Plataforma de Hosting Automatizada Lista para Escalar**

*Desarrollado con ❤️ usando React + TypeScript + Node.js + WHM API*
