# 🛠️ Guía de Desarrollo Local - LanzaWebAR

## Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```powershell
# En PowerShell
.\start-dev.ps1
```

### Opción 2: Manual
```bash
# 1. Instalar dependencias
npm install
cd server && npm install && cd ..

# 2. Iniciar desarrollo completo (frontend + backend)
npm run dev:full
```

## URLs de Desarrollo
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001  
- **API (proxy)**: http://localhost:5173/api

## Estructura del Proyecto
```
LanzaWebAR/
├── src/                    # Frontend React
├── server/                 # Backend Node.js
├── dist/                   # Build del frontend
├── server/dist/           # Build del backend
├── WARP.md                # Configuración para WARP
├── start-dev.ps1          # Script de desarrollo
└── package.json           # Dependencias del frontend
```

## Comandos Disponibles

### Frontend
```bash
npm run dev        # Solo frontend (puerto 5173)
npm run build      # Build de producción
npm run lint       # ESLint
npm run preview    # Preview del build
```

### Backend
```bash
cd server
npm run dev        # Desarrollo con hot reload
npm run build      # Compilar TypeScript
npm run start      # Servidor de producción
```

### Full Stack
```bash
npm run dev:full   # Frontend + Backend simultáneo
```

## Configuración de Entorno

### Variables Críticas
Archivo: `server/.env`
```bash
JWT_SECRET=desarrollo_local_jwt_secret_muy_seguro_2024
DATABASE_URL=./database.sqlite
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### Para Probar Emails (Opcional)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

### Para Probar Pagos (Opcional)
```bash
# Credenciales de prueba de MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-test-token
MERCADOPAGO_PUBLIC_KEY=TEST-tu-test-public-key
```

## Base de Datos

La base de datos SQLite se crea automáticamente en `server/database.sqlite` al iniciar el backend.

### Resetear BD
```bash
# Eliminar y reiniciar
Remove-Item server/database.sqlite
# Luego reiniciar el servidor
```

## Debugging

### Ver Logs del Backend
Los logs aparecen en la consola cuando ejecutas `npm run dev:full`

### Inspeccionar Base de Datos
```bash
# Instalar herramienta SQLite
npm install -g sqlite3

# Explorar BD
sqlite3 server/database.sqlite
.tables
SELECT * FROM users;
```

### Verificar Compilación
```bash
# Frontend
npm run build

# Backend  
cd server && npm run build
```

## Flujo de Desarrollo

1. **Hacer cambios**: Edita archivos en `src/` (frontend) o `server/src/` (backend)
2. **Hot reload**: Los cambios se reflejan automáticamente
3. **Probar APIs**: Usa http://localhost:5173/api/... (el proxy redirige al backend)
4. **Commit**: `git add . && git commit -m "mensaje"`

## Arquitectura de Desarrollo

### Frontend (React + Vite)
- **Hot Module Replacement** instantáneo
- **Proxy configurado** (`/api` → `localhost:3001`)
- **TypeScript** con validación en tiempo real
- **Tailwind CSS** con compilación automática

### Backend (Node.js + Express)
- **TypeScript watch mode** con `tsx`
- **Restart automático** al cambiar archivos
- **SQLite** con inicialización automática
- **CORS** habilitado para desarrollo

### Integración
- El frontend en puerto 5173 hace proxy de `/api/*` al backend en puerto 3001
- JWT tokens para autenticación
- Emails usando Ethereal (desarrollo) o Gmail (configurado)

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
npm install
cd server && npm install
```

### Error: "Port already in use"
```bash
# Ver procesos usando los puertos
netstat -ano | findstr :5173
netstat -ano | findstr :3001
# Matar proceso si es necesario
taskkill /PID [PID] /F
```

### Error de TypeScript
```bash
# Verificar errores
npm run build
cd server && npm run build
```

## Deploy a Producción

Una vez que termines el desarrollo local:

1. **Commit cambios**: `git add . && git commit -m "feature"`
2. **Push a GitHub**: `git push origin main`
3. **Deploy en VPS**: Pull desde el servidor y rebuild

## Notas Importantes

- ⚠️ **No subir `.env`**: Contiene credenciales reales
- 🔒 **JWT_SECRET**: Cambia en producción
- 📧 **SMTP**: Opcional para desarrollo local
- 💳 **MercadoPago**: Usar credenciales TEST para desarrollo
- 🌐 **WHM**: Comentar credenciales para evitar crear cuentas reales durante desarrollo