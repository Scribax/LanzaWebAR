import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import Services from './components/Services'
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
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/ecommerce-minimal" element={<EcommerceMinimal />} />
        <Route path="/projects/dashboard-analytics" element={<DashboardAnalytics />} />
        <Route path="/projects/landing-saas" element={<LandingSaas />} />
        <Route path="/projects/real-estate-pro" element={<RealEstatePro />} />
        <Route path="/projects/ecommerce-minimal/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
    </>
  )
}

export default App
