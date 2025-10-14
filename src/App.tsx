import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import Services from './components/Services'
import ServiceComparison from './components/ServiceComparison'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import SpecialOffer from './components/SpecialOffer'
import EcommerceMinimal from './pages/projects/EcommerceMinimal'
import DashboardAnalytics from './pages/projects/DashboardAnalytics'
import LandingSaas from './pages/projects/LandingSaas'
import RealEstatePro from './pages/projects/RealEstatePro'
import ProductDetail from './pages/projects/ecommerce/ProductDetail'
import HostingPage from './pages/HostingPage'
import PricingPage from './pages/PricingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HostingServices from './pages/HostingServices'
import Billing from './pages/Billing'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import { ProtectedRoute } from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ScrollProgress />
      <ScrollToTop />
      <main>
        <Hero />
        <SpecialOffer />
        <Services />
        <ServiceComparison />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hosting" element={<HostingPage />} />
        <Route path="/precios" element={<PricingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <HostingServices />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/projects/ecommerce-minimal" element={<EcommerceMinimal />} />
        <Route path="/projects/dashboard-analytics" element={<DashboardAnalytics />} />
        <Route path="/projects/landing-saas" element={<LandingSaas />} />
        <Route path="/projects/real-estate-pro" element={<RealEstatePro />} />
        <Route path="/projects/ecommerce-minimal/:id" element={<ProductDetail />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
    </AuthProvider>
  )
}

export default App
