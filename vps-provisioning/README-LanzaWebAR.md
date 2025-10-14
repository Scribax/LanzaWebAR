# 🚀 LanzaWebAR - Sistema de Hosting Automatizado

Sistema completo de automatización para hosting compartido que integra WHM API, deployment automático vía FTP, notificaciones por email y gestión de clientes.

## 📋 Características Principales

✅ **Integración WHM API** - Crea cuentas de hosting automáticamente
✅ **Deployment Automático** - Sube plantillas web vía FTP
✅ **Plantillas Pre-definidas** - Básico, React, E-commerce, SaaS
✅ **Notificaciones Email** - Alertas automáticas para cliente y admin
✅ **Panel Web** - Interfaz gráfica para gestión
✅ **Gestión de Clientes** - Base de datos local de clientes
✅ **Reportes** - Estadísticas de ingresos y clientes
✅ **Documentación Automática** - Guías completas para clientes

## 🖥️ Información del Servidor

**Servidor:** Blue106 (BlueHosting)
**IP:** 186.64.119.195
**Panel WHM:** https://186.64.119.195:2087
**Usuario:** lanzawe1
**Plan:** Reseller POWER

**DNS Servers:**
- ns1.dnsmisitio.net (186.64.112.73)
- ns2.dnsmisitio.net (45.79.214.161)  
- ns3.dnsmisitio.net (144.217.14.213)

## 🔧 Instalación

### Prerequisitos

- Node.js 14+ 
- npm
- Acceso a cuenta Reseller WHM

### Paso 1: Clonar/Descargar

```bash
# Navegar al directorio del proyecto
cd vps-provisioning
```

### Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias necesarias
npm install

# O instalar manualmente
npm install basic-ftp nodemailer archiver
```

### Paso 3: Configurar Email (Opcional)

Edita el archivo `lanzawebar-provisioner.js` líneas 25-29:

```javascript
email: {
    service: 'gmail', // o tu proveedor
    user: 'tu-email@gmail.com',
    pass: 'tu-password-app', // Password de aplicación
    from: 'LanzaWebAR <tu-email@gmail.com>'
}
```

## 🚀 Uso

### Crear Hosting Completo

```bash
# Crear cuenta completa de hosting
node lanzawebar-provisioner.js create "Juan Pérez" "juan@ejemplo.com" "ejemplo.com" "basic" "Proyecto urgente"

# Usando npm script
npm run create-hosting "María González" "maria@example.com" "miempresa.com" "react"
```

**Tipos de proyecto disponibles:**
- `basic` - Sitio web básico (HTML/CSS/JS)
- `react` - Aplicación React
- `ecommerce` - Tienda online
- `saas` - Aplicación SaaS

### Panel Web

```bash
# Iniciar panel web en puerto 3000
npm run panel

# Luego abrir: http://localhost:3000
```

### Generar Reportes

```bash
# Generar reporte del sistema
node lanzawebar-provisioner.js report

# O usando npm
npm run generate-report
```

### Uso Individual de Módulos

#### Solo crear cuenta WHM:
```bash
node whm-integration.js "Juan Pérez" "ejemplo.com" "juan@ejemplo.com" "basic"
```

#### Solo deployment FTP:
```bash
node ftp-deployment.js "186.64.119.195" "usuario123" "password" "ejemplo.com" "basic"
```

## 📁 Estructura del Proyecto

```
vps-provisioning/
├── lanzawebar-provisioner.js    # Script principal
├── whm-integration.js           # Integración WHM API
├── ftp-deployment.js           # Sistema de deployment
├── panel-reseller.html         # Panel web
├── package.json                # Configuración npm
├── README-LanzaWebAR.md        # Esta documentación
└── generados/
    ├── accounts/               # Info de cuentas creadas
    ├── templates/              # Plantillas web
    ├── client-docs/           # Documentación clientes
    ├── clients-database/      # Base de datos clientes
    ├── dns-configs/           # Configuraciones DNS
    └── reports/               # Reportes generados
```

## 🔄 Proceso Completo Automatizado

Cuando ejecutas `lanzawebar-provisioner.js create`, se realizan estas fases:

1. **📋 FASE 1:** Crear cuenta de hosting en WHM
2. **📋 FASE 2:** Deployment de plantilla web vía FTP
3. **📋 FASE 3:** Configuración DNS (informativa)
4. **📋 FASE 4:** Generar documentación completa
5. **📋 FASE 5:** Enviar notificaciones por email
6. **📋 FASE 6:** Registrar cliente en sistema

**Tiempo total:** ~10 minutos

## 💰 Modelo de Precios Configurado

- **Desarrollo web:** $15.000 (pago único)
- **Hosting mensual:** $600
- **Dominio:** $1.000/año (opcional)
- **Primer mes:** GRATIS ✅

## 📧 Configuración Email

Para habilitar notificaciones automáticas:

1. **Gmail:** Crear password de aplicación
2. **Outlook:** Configurar SMTP
3. **Otro:** Ajustar configuración en código

## 🛠️ Funcionalidades del Hosting

Cada cuenta incluye:
- ✅ 1GB espacio en disco
- ✅ Transferencia ilimitada
- ✅ 5 cuentas de email
- ✅ 5 bases de datos MySQL
- ✅ SSL automático
- ✅ Backup diario
- ✅ Panel cPanel completo

## 📊 Panel Web - Características

- **Crear Hosting:** Interfaz para nuevos clientes
- **Gestionar Cuentas:** Lista de todas las cuentas
- **Ver Precios:** Planes y tarifas actuales
- **Herramientas:** Accesos directos y utilidades
- **Estadísticas:** Ingresos y métricas

## 🔧 Personalización

### Cambiar Plantillas

Edita los métodos en `ftp-deployment.js`:
- `createBasicTemplate()`
- `createReactTemplate()`
- `createEcommerceTemplate()`
- `createSaasTemplate()`

### Modificar Precios

Edita `lanzawebar-provisioner.js` líneas 36-40:

```javascript
pricing: {
    development: 15000,
    hosting_monthly: 600,
    domain_yearly: 1000
}
```

### Personalizar Emails

Modifica el método `sendNotifications()` en `lanzawebar-provisioner.js`

## 🐛 Troubleshooting

### Error de conexión WHM
- Verificar IP y credenciales
- Comprobar puertos 2087/2083
- Revisar SSL/certificados

### Error FTP
- Verificar credenciales de la cuenta
- Comprobar que la cuenta fue creada
- Revisar permisos de archivos

### Error Email
- Verificar configuración SMTP
- Comprobar passwords de aplicación
- Revisar límites del proveedor

## 📞 Soporte

**¿Necesitas ayuda?**
- Email: soporte@lanzawebar.com
- WhatsApp: +54 9 XXXX XXXX
- Panel WHM: https://186.64.119.195:2087

## 🔄 Comandos Útiles

```bash
# Ver todas las cuentas creadas
ls accounts/

# Ver clientes en base de datos
cat clients-database/master-registry.json

# Ver último reporte
ls -la reports/

# Iniciar solo el panel web
npm run panel

# Ver logs de deployment
node lanzawebar-provisioner.js create "Test" "test@test.com" "test.com" "basic" 2>&1 | tee deployment.log
```

## 📈 Métricas y Reporting

El sistema genera automáticamente:
- Número total de clientes
- Clientes activos/suspendidos  
- Ingresos mensuales
- Ingresos totales
- Próximos vencimientos
- Clientes recientes

## 🔐 Seguridad

- Credenciales WHM en archivo (cambiar después de instalación)
- Passwords generados automáticamente para cuentas
- SSL automático para todos los sitios
- Backups diarios automáticos
- Configuración .htaccess de seguridad

## 📝 Notas Importantes

1. **DNS:** Los clientes deben configurar DNS manualmente
2. **SSL:** Se activa automáticamente en 1-2 horas
3. **Propagación:** DNS puede tomar hasta 24 horas
4. **Backups:** Son automáticos, no requieren intervención
5. **Facturación:** Sistema manual, considera automatizar

## 🎯 Próximas Mejoras

- [ ] Integración con sistema de pagos
- [ ] Dashboard avanzado con métricas
- [ ] Automatización de renovaciones
- [ ] API REST para integraciones
- [ ] App móvil para administración
- [ ] Integración con registradores de dominio

## 💡 Ejemplo de Uso Completo

```bash
# 1. Instalar dependencias
npm install

# 2. Crear hosting para cliente
node lanzawebar-provisioner.js create \
  "Restaurante El Buen Sabor" \
  "admin@elbuensabor.com" \
  "elbuensabor.com" \
  "basic" \
  "Website para restaurante familiar"

# 3. Verificar creación
ls -la accounts/
cat accounts/elbuensabor.com.json

# 4. Generar reporte
node lanzawebar-provisioner.js report

# 5. Abrir panel web
npm run panel
```

## 🎊 Qué Recibe el Cliente

Después del provisioning automático, el cliente recibe:

- **Email de bienvenida** con todos los accesos
- **Documentación completa** en PDF/Markdown
- **Sitio web funcionando** con SSL
- **Panel cPanel** configurado
- **Credenciales FTP** para subir archivos
- **Instrucciones DNS** paso a paso
- **Información de facturación** y próximos pagos

---

**LanzaWebAR - Tu sitio web en menos de 48 horas**

*Sistema desarrollado para automatizar completamente el proceso de hosting compartido usando la cuenta Reseller de BlueHosting*