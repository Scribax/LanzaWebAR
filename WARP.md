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

## Important Notes

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