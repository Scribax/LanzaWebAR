# Handover de Proyecto — LanzaWebAR (WARP)

Este documento resume el estado actual del proyecto, decisiones de diseño/tecnología, rutas, cambios realizados y un plan operativo para servidores remotos (VPS), despliegue y CI/CD. Está pensado para continuar el trabajo en otra terminal sin perder contexto.


## 1) Objetivo general

Crear tres demos profesionales y creíbles para mostrar capacidades de producto/diseño y dejar una base lista para conectar con datos reales y branding:
- E‑commerce Minimal (ShopMini)
- Dashboard Analytics (AnalyticsPro)
- Landing SaaS (SaaSify)


## 2) Estructura y stack

- Ruta del proyecto (local): `C:\Users\franc\Desktop\LanzaWebAR`
- Gestor de paquetes: npm (package-lock.json)
- Frontend: React 19, React Router 7, Vite 7, TypeScript 5.9
- Estilos: Tailwind CSS 4 (via @tailwindcss/vite)
- Gráficas: Chart.js 4 + react-chartjs-2
- Linting: ESLint 9
- Backend local: carpeta `server/` con script `dev`

Scripts en package.json:
- `dev`: Vite (frontend)
- `dev:full`: `vite` + `npm --prefix server run dev` en paralelo (concurrently)
- `build`: `tsc -b && vite build`
- `preview`: `vite preview`
- `lint`: `eslint .`


## 3) Cómo levantar en otra terminal (PowerShell)

```powershell path=null start=null
Set-Location 'C:\Users\franc\Desktop\LanzaWebAR'
npm ci   # o npm install
```
- Opción A (recomendada, front + back):
```powershell path=null start=null
npm run dev:full
```
- Opción B (ventanas separadas):
```powershell path=null start=null
# Ventana A (frontend)
npm run dev
# Ventana B (backend)
npm --prefix server run dev
```
- Frontend: http://localhost:5173/


## 4) Navegación y rutas

- Home: `/`
- Proyectos:
  - `/projects/ecommerce-minimal`
  - `/projects/dashboard-analytics`
  - `/projects/landing-saas`
- Detalle de producto (ecommerce): `/projects/ecommerce-minimal/:id`


## 5) Temas y paletas (referenciales)

- E‑commerce Minimal: tema claro sky/emerald
  - Sky: `#0ea5e9` / `#0369a1`
  - Emerald: `#10b981` / `#065f46`
- Dashboard Analytics: tema claro slate/indigo
  - Slate: `#1f2937`–`#64748b`
  - Indigo: `#6366f1` / `#4338ca`
- Landing SaaS: tema claro violet
  - Violet: `#7c3aed` / `#5b21b6` (acentos fucsia claros para fondos)


## 6) Cambios clave realizados (resumen por módulo)

A) Home > Sección “Proyectos”
- Imágenes nuevas y más profesionales (Unsplash) por demo.
- Copys orientados a valor.
- Archivo: `src/components/Projects.tsx`

B) E‑commerce Minimal (ShopMini)
- Catálogo con búsqueda, filtros por categoría, ordenación.
- Carrito con incremento/decremento, quitar ítems.
- Cálculo completo: Subtotal, Cupones, Envío, Impuestos (18%), Total.
- Umbral de envío gratis: `$120` (const `FREE_SHIPPING_THRESHOLD`).
- Mensaje dinámico de cuánto falta para envío gratis.
- Cupones: `DESC10` (−10%), `ENVIOGRATIS` (0 envío).
- Persistencia: `localStorage` (`shopmini_cart`, `shopmini_coupon`).
- Checkout con validación básica de email.
- Señales de confianza: “Pago seguro SSL • Envío 24/48h • Devolución 30 días”.
- Accesibilidad: `alt` descriptivos en catálogo, modal y detalle.
- Fallback de productos con imágenes y descripciones coherentes:
  - Reloj Minimal: aluminio 40mm, 5ATM, 7 días.
  - Auriculares: BT 5.3, 24h con estuche, mic con cancelación.
  - Smartband: actividad + HR 24/7, IP68.
  - Reloj Sport: GPS, cristal reforzado, 10ATM.
  - Auriculares Pro: drivers 10mm, USB‑C, transparencia.
- Archivos: `src/pages/projects/EcommerceMinimal.tsx`, `src/pages/projects/ecommerce/ProductDetail.tsx`.

C) Dashboard Analytics (AnalyticsPro)
- KPIs con variaciones ▲, filtros por canal (All/SEM/SEO/Social).
- Gráficos: Barras (afectado por filtro) y Línea (tensión 0.3).
- Tabla: búsqueda y orden asc/desc por columna.
- Exportaciones: CSV y (nuevo) JSON.
- Indicador: “Fuente: API demo • Última sincronización: hh:mm:ss”.
- Datos remotos demo: `fetch('/api/analytics')` con fallback.
- Archivo: `src/pages/projects/DashboardAnalytics.tsx`.

D) Landing SaaS (SaaSify)
- Hero con imagen real (Unsplash) y nota “SSL, RGPD, rendimiento 90+”.
- Beneficios concretos: rendimiento, seguridad (OWASP demo), escalabilidad.
- Precios con toggle mensual/anual (−20% anual), 3 planes.
- Testimonios con rating “★★★★★” y “Cliente verificado”.
- Newsletter con estado “ok”.
- Archivo: `src/pages/projects/LandingSaas.tsx`.

E) Navbar/Footer
- Navbar usa `/logo.png` (reemplazable por tu logo).
- Footer con enlaces y redes placeholder.


## 7) Imágenes: criterio y fuentes

- Sección Proyectos: URLs fijas de Unsplash (no cambian).
- Fallback de productos: `source.unsplash.com` con palabras clave (pueden variar por recarga).
- Recomendación para producción: mover imágenes a `/public/images` y referenciarlas por ruta local para estabilidad visual.


## 8) Backend local

- Carpeta: `server/` (script `dev`).
- Archivo `server.env` para variables locales (no se expone su contenido aquí).
- Pendiente: definir endpoints reales para productos/analytics.


## 9) Plan de servidores remotos (VPS) y despliegue

Estado actual: no hay VPS provisionados aún. A continuación, propuesta escalable (fase 1 una sola VPS; fase 2 separación front/back).

### 9.1 Arquitectura recomendada

- Fase 1 (rápida y económica):
  - 1 VPS (Ubuntu 22.04 LTS, 2 vCPU, 4 GB RAM, 60 GB SSD).
  - Docker + Docker Compose para orquestar `frontend` (estático en Nginx) y `api` (Node).
  - Nginx como reverse proxy con TLS (Let’s Encrypt vía `certbot` o Caddy si prefieres autoconfigurar TLS).

- Fase 2 (escala):
  - VPS A: `api` (Node/Postgres/Redis si aplica).
  - VPS B: `frontend` + Nginx.
  - Opcional: CDN para activos estáticos.

Puertos/Firewall (ufw):
- Abrir 80 (HTTP), 443 (HTTPS). Mantener 22 (SSH) con fail2ban + SSH keys.

### 9.2 Dominios y DNS (ejemplo)

- `app.midominio.com` → frontend (Nginx sirve dist/ o container `frontend`).
- `api.midominio.com` → backend (proxy a container `api`).
- `www.midominio.com` → redirección a dominio raíz si aplica.

### 9.3 Dockerización (propuesta)

Dockerfile (frontend, build + serve con Nginx):
```dockerfile path=null start=null
# build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# run stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./infra/nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Dockerfile (api, ejemplo Node):
```dockerfile path=null start=null
FROM node:20-alpine
WORKDIR /srv/api
COPY server/package*.json ./
RUN npm ci
COPY server .
EXPOSE 3000
CMD ["npm","run","start"]
```

docker-compose.yml (front + api + proxy):
```yaml path=null start=null
version: '3.8'
services:
  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/conf.d:/etc/nginx/conf.d
      - ./infra/certs:/etc/letsencrypt
      - ./infra/www:/var/www/html
    depends_on:
      - frontend
      - api

  frontend:
    build:
      context: .
      dockerfile: infra/docker/frontend.Dockerfile
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: infra/docker/api.Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=3000
      # Más variables desde .env (no cometerlas)
    restart: unless-stopped
```

Nginx (proxy + TLS; si usas Caddy, se simplifica):
```nginx path=null start=null
server {
  listen 80;
  server_name app.midominio.com;
  location / {
    proxy_pass http://frontend:80;
  }
}
server {
  listen 80;
  server_name api.midominio.com;
  location / {
    proxy_pass http://api:3000;
  }
}
```

Certificados TLS
- Opción A (clásica): Nginx + certbot (Let’s Encrypt) con renovación automática.
- Opción B: Caddy (autoconfigura TLS/renovaciones y simplifica el proxy).

### 9.4 Seguridad mínima

- SSH keys, deshabilitar password auth.
- `ufw` (allow 22, 80, 443), `fail2ban`.
- Usuarios no-root + `docker` group.
- Variables sensibles solo en `.env` (no en repositorio); inyectarlas como secrets en CI.

### 9.5 CI/CD (GitHub Actions → VPS)

- Estrategia: build de contenedores en CI, push a GHCR/Docker Hub, y despliegue vía SSH (pull + `docker compose up -d`).

Workflow base (GH Actions):
```yaml path=null start=null
name: deploy
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build & push frontend
        uses: docker/build-push-action@v6
        with:
          context: .
          file: infra/docker/frontend.Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}-frontend:latest
      - name: Build & push api
        uses: docker/build-push-action@v6
        with:
          context: .
          file: infra/docker/api.Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}-api:latest
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/lanzawebar
            docker compose pull
            docker compose up -d --remove-orphans
```

Secrets necesarios (no exponer valores):
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (clave privada)
- Si usas registry externo: `REGISTRY_USER`, `REGISTRY_PASS`

### 9.6 Provisionamiento rápido (comandos guía)

```bash path=null start=null
# En la VPS (Ubuntu 22.04)
sudo apt-get update && sudo apt-get upgrade -y
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Compose (si es necesario instalarlo por separado)
sudo apt-get install -y docker-compose-plugin
# Firewall básico
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Estructura sugerida en la VPS:
```bash path=null start=null
/opt/lanzawebar
  ├─ docker-compose.yml
  └─ infra/
      ├─ docker/
      │   ├─ frontend.Dockerfile
      │   └─ api.Dockerfile
      └─ nginx/
          └─ conf.d/
              └─ default.conf
```

### 9.7 Monitoreo, logs y backups

- Monitoreo simple: Uptime Kuma o healthchecks externos.
- Logs: `docker logs -f <service>` y rotación con opciones de logging de Docker.
- Backups (si hay DB en el futuro): cron + `pg_dump`/`mongodump` a almacenamiento externo.

### 9.8 Costos aproximados (orientativos)

- Fase 1 (1 VPS 2vCPU/4GB): 10–18 USD/mes (según proveedor y región).
- Fase 2 (2 VPS pequeños): 20–36 USD/mes total.
- Dominio + DNS: 10–12 USD/año.


## 10) Propuestas de valor (VPs) por demo

- E‑commerce Minimal: tienda ágil con búsqueda/filtros, carrito persistente y checkout creíble (cupones, envío e impuestos), lista para conectar con pagos/stock reales.
- Dashboard Analytics: visibilidad clara de métricas con KPIs, filtros por canal, gráficos, tabla ordenable y exportaciones CSV/JSON; base para integrar API real.
- Landing SaaS: conversión orientada a producto: propuesta clara, beneficios concretos, prueba social, precios simples y captación vía newsletter.


## 11) Checklist de próximos pasos

- Branding completo: logo SVG, favicon, tipografías, paleta final y voz de marca.
- Mover imágenes a `/public` y referenciarlas localmente para estabilidad.
- Backend real:
  - Ecommerce: catálogo, stock, precios, pedidos (sandbox de pagos).
  - Dashboard: endpoints para KPIs/barras/línea/tabla.
- Validación de formularios con Zod/Yup + react-hook-form.
- Autenticación (si aplica): Auth0/Supabase y roles.
- SEO/Accesibilidad: metadatos, OG, ARIA, contrastes; sitemap/robots.
- Rendimiento: optimización de imágenes, code-splitting, Lighthouse 90+.
- i18n (react-i18next) y dark mode opcional.
- Tests: unitarios/integración (Vitest/RTL), E2E (Playwright).
- Infra: crear `infra/` con Dockerfiles, Nginx y compose; preparar VPS y CI/CD.


## 12) Notas de seguridad y secretos

- Nunca exponer secretos en texto plano en comandos o commits.
- Usar variables de entorno y gestores de secretos (GitHub Secrets, 1Password, etc.).
- En terminal: cargar secretos en variables antes de usarlos y no imprimirlos (`echo` prohibido).


## 13) Contactos / pendientes

- `server.env` existe para desarrollo local: completar cuando se definan endpoints reales.
- Confirmar si se usará Caddy o Nginx + certbot para TLS en la VPS.
- Definir dominio(s) y proveedor DNS para crear registros A/AAAA.

---
Documento generado para handover WARP. Cualquier duda, continuar desde la raíz del proyecto: `C:\Users\franc\Desktop\LanzaWebAR`.