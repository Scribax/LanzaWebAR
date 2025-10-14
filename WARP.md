# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LanzaWebAR is a production-ready automated hosting platform that combines a modern React frontend with a robust Node.js backend. The system integrates with WHM/cPanel APIs to automatically provision hosting accounts and provides a complete e-commerce experience with MercadoPago integration.

**Production URL**: https://lanzawebar.com

## Development Commands

### Frontend Development
```bash
# Start frontend development server (React + Vite)
npm run dev

# Build frontend for production
npm run build

# Run ESLint on frontend code
npm run lint

# Preview production build locally
npm run preview
```

### Backend Development
```bash
# Start backend development server with TypeScript watch mode
cd server && npm run dev

# Build backend TypeScript to JavaScript
cd server && npm run build

# Start production backend server
cd server && npm run start
```

### Full Stack Development
```bash
# Start both frontend and backend concurrently
npm run dev:full

# This runs:
# - Frontend: Vite dev server on port 5173
# - Backend: Node.js server on port 3001 (with TypeScript watch mode)
```

### Database Operations
```bash
# The SQLite database is automatically initialized when the backend starts
# Database file location: server/database.sqlite

# To manually recreate/reset the database, delete the file and restart the server
rm server/database.sqlite
cd server && npm run dev
```

## Architecture Overview

### Frontend Architecture (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7 with Hot Module Replacement
- **Styling**: Tailwind CSS 4 with custom design system
- **Routing**: React Router 7 for SPA navigation
- **State Management**: React Context API for authentication
- **UI Patterns**: Component-based architecture with protected routes

### Backend Architecture (Node.js + Express)
- **Runtime**: Node.js with TypeScript compilation
- **Framework**: Express.js with CORS enabled
- **Database**: SQLite with direct SQL queries (not an ORM)
- **Authentication**: JWT tokens with bcrypt password hashing
- **External APIs**: WHM API for hosting automation, MercadoPago for payments
- **Email Service**: Nodemailer with Gmail SMTP

### Key Integration Points

#### WHM/cPanel Automation
- Automated hosting account creation via WHM API
- Real package mapping: `basico` → `lanzawe1_lanza_basico`, `intermedio` → `lanzawe1_lanza_pro`, `premium` → `lanzawe1_lanza_premium`
- Subdomain creation pattern: `username.lanzawebar.com`
- Automated SSL setup and welcome page deployment

#### Payment Processing
- MercadoPago integration for Argentine market
- Webhook handling for payment status updates
- Order tracking with database persistence

#### Database Schema
Three main tables:
- `users`: Authentication and user profiles
- `orders`: Payment and plan selections
- `hosting_services`: WHM account details and credentials

## Project Structure Insights

### Frontend Component Architecture
```
src/
├── components/          # Reusable UI components
│   ├── Hero.tsx        # Landing page hero with animated gradients
│   ├── Projects.tsx    # Portfolio showcase with 4 integrated demos
│   ├── ProtectedRoute.tsx # Auth guard for dashboard routes
│   └── ...
├── pages/              # Route-level components
│   ├── projects/       # 4 fully functional demo applications:
│   │   ├── EcommerceMinimal.tsx    # Complete e-commerce with cart
│   │   ├── DashboardAnalytics.tsx  # Charts and KPI dashboard
│   │   ├── LandingSaas.tsx         # SaaS landing page
│   │   └── RealEstatePro.tsx       # Real estate with maps
│   └── payment/        # Payment result pages
└── contexts/           # React Context providers
```

### Backend Service Architecture
```
server/src/
├── index.ts            # Main Express server with email templates
├── auth.ts             # JWT authentication and password hashing
├── database.ts         # SQLite initialization and schema
├── routes/             # API route handlers
└── services/           # Business logic services
    ├── hostingAutomation.ts  # WHM integration and account creation
    ├── mercadopagoService.ts # Payment processing
    ├── emailService.ts       # Transactional emails
    └── whmApi.ts            # WHM API client
```

## Development Environment Setup

### Required Environment Variables
Create `.env` in project root and `server/.env`:

```bash
# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Database
DATABASE_URL=./database.sqlite

# SMTP Configuration (Gmail recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="LanzaWeb AR" <no-reply@yourdomain.com>

# WHM Configuration (Production hosting server)
WHM_URL=https://blue106.dnsmisitio.net:2087
WHM_USERNAME=lanzawe1
WHM_PASSWORD=your_whm_password

# MercadoPago Configuration
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key

# Application URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

## Design System

### Brand Colors
- **Primary Gradient**: `#22c55e` (emerald) → `#06b6d4` (cyan) → `#3b82f6` (blue)
- **Background**: `bg-neutral-950` (very dark)
- **Text**: Gradients and white text on dark backgrounds

### CSS Classes
- `.btn-gradient`: Button with brand gradient background
- `.gradient-text`: Text with brand gradient colors
- Animated blob gradients for visual effects

## Testing and Quality

### Frontend Testing
- ESLint configured with TypeScript and React rules
- No test framework currently configured

### Backend Validation
- Input validation on all API endpoints
- Password strength requirements: 8+ chars, mixed case, numbers, symbols
- Email format validation
- JWT token expiration (7 days)

## Production Deployment

### Server Configuration
- **Production Server**: AlmaLinux 8.3 VPS
- **Reverse Proxy**: Nginx with SSL termination
- **SSL**: Let's Encrypt certificates with Cloudflare proxy
- **Process Management**: systemd service for backend
- **Static Files**: Nginx serves frontend build directly

### Deployment Commands
```bash
# Build frontend for production
npm run build

# Build backend TypeScript
cd server && npm run build

# Frontend files go to: /var/www/lanzaweb/dist/
# Backend files go to: /var/www/lanzaweb/server/dist/
```

## Integration Notes

### WHM API Integration
- Uses HTTPS API calls with authentication
- Handles both access hash and password authentication
- Automatically parses WHM response format: `{ result: [{ status: 1, ... }] }`
- Error handling for failed account creations

### MercadoPago Integration
- Handles Argentine peso (ARS) currency
- Webhook verification for payment status
- Preference creation for checkout links
- Payment status tracking in database

### Email System
- HTML email templates with brand styling
- Welcome emails for new users
- Hosting credential emails for new accounts
- Fallback to Ethereal for development testing

## Debugging Commands

### Backend Debugging
```bash
# View backend logs
cd server && npm run dev

# Test WHM connection
# Add this to hostingAutomation.ts and call via API endpoint:
# await hostingService.testWHMConnection()
```

### Database Inspection
```bash
# Install sqlite3 CLI tool
npm install -g sqlite3

# Inspect database
sqlite3 server/database.sqlite
.tables
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM hosting_services;
```

### Frontend Debugging
```bash
# Check for build issues
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

## Critical Architecture Notes

### Environment Variables Loading Issue
**CRITICAL**: Services must use **lazy initialization** to avoid loading before environment variables are available.

**❌ NEVER DO THIS:**
```typescript
// routes/payments.ts
const mercadopagoService = new MercadoPagoService() // Loads before .env!
```

**✅ ALWAYS DO THIS:**
```typescript
// routes/payments.ts  
let mercadopagoService: MercadoPagoService | null = null

function getMercadoPagoService() {
  if (!mercadopagoService) {
    mercadopagoService = new MercadoPagoService() // Lazy load after .env
  }
  return mercadopagoService
}
```

**Why**: ES module imports execute before the main module code, so `new Service()` at the top level runs before `dotenv.config()` in index.ts.

### Other Important Notes
- **Security**: All passwords are bcrypt hashed (12 rounds), JWT tokens expire after 7 days
- **Database**: SQLite with direct SQL queries - no ORM used
- **Hosting**: Real WHM integration - creates actual cPanel accounts
- **Payments**: Production MercadoPago integration for real transactions
- **SSL**: Automatic SSL certificate setup for new hosting accounts
- **Subdomains**: Automatic DNS configuration for `*.lanzawebar.com` subdomains
- **Email**: Production SMTP with Gmail for transactional emails

## Development Workflow

1. **Frontend changes**: Edit React components, Vite provides instant HMR
2. **Backend changes**: Edit TypeScript files, `tsx` provides automatic restarts
3. **API testing**: Use `http://localhost:5173` (proxies `/api` to backend)
4. **Database changes**: Modify `database.ts` schema and restart backend
5. **Integration testing**: Use `npm run dev:full` to test full stack locally

The system is production-ready and handles real hosting account creation, payment processing, and customer onboarding automatically.

## VPS Production Deployment

### Prerequisites
- AlmaLinux 8.3 VPS (current production server)
- Node.js 18+ installed
- Nginx configured as reverse proxy
- SSL certificates (Let's Encrypt)
- Systemd for process management

### Step-by-Step VPS Deployment

#### 1. Prepare Local Code
```bash
# Ensure everything is committed and clean
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### 2. Server Setup (SSH into VPS)
```bash
# Connect to your VPS
ssh root@your-vps-ip

# Navigate to project directory
cd /var/www/lanzaweb

# Pull latest changes
git pull origin main
```

#### 3. Environment Configuration
```bash
# Copy production environment template
cp server/.env.production server/.env

# Edit with production-specific values
nano server/.env

# CRITICAL: Change JWT_SECRET to a strong random value
# Verify all URLs point to https://lanzawebar.com
```

#### 4. Build Application
```bash
# Install/update dependencies
npm ci
cd server && npm ci && cd ..

# Build frontend for production
npm run build

# Build backend TypeScript
cd server && npm run build && cd ..
```

#### 5. Database Setup
```bash
# The SQLite database will be created automatically on first run
# Ensure proper permissions
chown -R www-data:www-data /var/www/lanzaweb
chmod 755 /var/www/lanzaweb/server
```

#### 6. Systemd Service Configuration
Create/update `/etc/systemd/system/lanzaweb-backend.service`:
```ini
[Unit]
Description=LanzaWeb AR Backend Server
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
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

#### 7. Nginx Configuration
Ensure `/etc/nginx/sites-available/lanzawebar.com` includes:
```nginx
server {
    listen 443 ssl http2;
    server_name lanzawebar.com www.lanzawebar.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/lanzawebar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lanzawebar.com/privkey.pem;
    
    # Frontend static files
    location / {
        root /var/www/lanzaweb/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
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
        
        # Timeout settings for long operations (hosting creation)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 120s;
    }
}
```

#### 8. Deploy and Start Services
```bash
# Restart and enable the backend service
systemctl daemon-reload
systemctl restart lanzaweb-backend
systemctl enable lanzaweb-backend

# Check service status
systemctl status lanzaweb-backend

# Check logs if needed
journalctl -u lanzaweb-backend -f

# Restart Nginx
systemctl restart nginx
```

#### 9. Verify Deployment
```bash
# Test backend directly
curl http://localhost:3001/api/health

# Test through Nginx
curl https://lanzawebar.com/api/health

# Check frontend
curl https://lanzawebar.com
```

### Production Environment Variables
Key variables that MUST be set correctly in production `.env`:

```bash
# Security
JWT_SECRET=super_strong_random_secret_here
NODE_ENV=production

# URLs (HTTPS in production)
FRONTEND_URL=https://lanzawebar.com
BACKEND_URL=https://lanzawebar.com

# MercadoPago URLs (HTTPS)
MERCADOPAGO_SUCCESS_URL=https://lanzawebar.com/payment/success
MERCADOPAGO_FAILURE_URL=https://lanzawebar.com/payment/failure
MERCADOPAGO_PENDING_URL=https://lanzawebar.com/payment/pending
```

### Deployment Checklist
- [ ] Code committed and pushed to GitHub
- [ ] VPS has latest code (`git pull`)
- [ ] Production `.env` configured with HTTPS URLs
- [ ] JWT_SECRET changed to production value
- [ ] Dependencies installed (`npm ci`)
- [ ] Frontend built (`npm run build`)
- [ ] Backend built (`cd server && npm run build`)
- [ ] Systemd service restarted
- [ ] Nginx configuration updated
- [ ] SSL certificates valid
- [ ] Backend service running (`systemctl status lanzaweb-backend`)
- [ ] API accessible via HTTPS
- [ ] Frontend loading correctly
- [ ] Payment flow tested (use small amount)
- [ ] Email notifications working
- [ ] WHM integration functional

### Troubleshooting Production Issues

#### Service Won't Start
```bash
# Check detailed logs
journalctl -u lanzaweb-backend -n 50

# Check environment variables loading
sudo -u root env $(cat /var/www/lanzaweb/server/.env | xargs) node /var/www/lanzaweb/server/dist/index.js
```

#### Database Issues
```bash
# Check database file permissions
ls -la /var/www/lanzaweb/server/database.sqlite

# Recreate database if corrupted
rm /var/www/lanzaweb/server/database.sqlite
systemctl restart lanzaweb-backend
```

#### API Not Accessible
```bash
# Test backend directly
curl http://localhost:3001/api/health

# Check Nginx configuration
nginx -t
systemctl reload nginx
```
