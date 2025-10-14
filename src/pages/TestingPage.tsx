import React from 'react'
import { HeroSection, Section, Card, Button, H2, H3, P, GradientText } from '../components/base'
import Reveal from '../components/Reveal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TestingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero usando nuestros componentes base */}
      <HeroSection
        badge="Página de prueba"
        title={
          <>
            Testing de <GradientText>componentes base</GradientText>
          </>
        }
        subtitle="Esta página demuestra cómo los componentes mantienen automáticamente tu estilo único - dark theme, gradientes verde→cian→azul, blobs flotantes y animaciones."
        primaryCTA={{
          text: "Ver componentes",
          href: "#components"
        }}
        secondaryCTA={{
          text: "Style Guide",
          href: "#guide"
        }}
        tertiaryCTA={{
          text: "Volver inicio",
          to: "/"
        }}
      />

      {/* Sección con cards para probar estilos */}
      <Section 
        id="components"
        title="Componentes en Acción"
        subtitle="Cada elemento mantiene automáticamente tu identidad visual única"
        centered
        withBackground
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <Card hover>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                🎨
              </div>
              <H3>Tu Paleta</H3>
              <P className="mt-2">
                Verde #22c55e → Cian #06b6d4 → Azul #3b82f6 aplicados automáticamente.
              </P>
              <div className="mt-4">
                <Button variant="primary" size="sm">Gradiente</Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card hover glass>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                ✨
              </div>
              <H3>Efectos Glass</H3>
              <P className="mt-2">
                Backdrop blur y transparencias que respetan tu dark theme.
              </P>
              <div className="mt-4">
                <Button variant="secondary" size="sm">Glass Effect</Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card hover>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                🏗️
              </div>
              <H3>Animaciones</H3>
              <P className="mt-2">
                Reveal on scroll, hover lifts y blobs flotantes incluidos.
              </P>
              <div className="mt-4">
                <Button variant="tertiary" size="sm">Interactivo</Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Sección con blobs para mostrar tu estilo signature */}
      <Section 
        id="guide"
        title="Tu Estilo Signature"
        subtitle="Elementos que definen la identidad visual de LanzaWebAR"
        withBlobs
      >
        <div className="space-y-12">
          <Reveal>
            <div className="text-center">
              <H2>Fondo Dark + Gradientes Sutiles</H2>
              <P className="mt-4 max-w-3xl mx-auto">
                El fondo negro profundo (#0a0a0a) con radial gradients sutiles crea 
                la atmósfera tecnológica característica. Los <GradientText>blobs flotantes</GradientText> 
                añaden vida sin distraer del contenido.
              </P>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid gap-8 md:grid-cols-2">
              <Card glass padding="lg">
                <H3>Tipografía Consistente</H3>
                <P className="mt-3">
                  Jerarquías claras con .h1 (4xl/6xl), .h2 (2xl/3xl) y .p (neutral-300) 
                  que garantizan legibilidad en dark mode.
                </P>
                <div className="mt-6 space-y-2">
                  <div className="text-xs text-neutral-500">Ejemplo:</div>
                  <div className="gradient-text text-lg font-bold">Texto con gradiente</div>
                  <div className="text-neutral-300">Texto secundario legible</div>
                </div>
              </Card>

              <Card hover padding="lg">
                <H3>Microinteracciones</H3>
                <P className="mt-3">
                  Hover lifts de 4px, transiciones cubic-bezier y focus rings verdes 
                  que crean una experiencia táctil sutil pero efectiva.
                </P>
                <div className="mt-6 flex gap-3">
                  <Button variant="primary" size="sm">Hover me</Button>
                  <Button variant="secondary" size="sm">Focus me</Button>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Sección final con mensaje */}
      <Section centered>
        <Reveal>
          <div className="text-center py-12">
            <H2>¡Componentes Base Funcionando!</H2>
            <P className="mt-4 max-w-2xl mx-auto">
              Esta página se creó usando los componentes base. Todo el estilo visual 
              se aplicó automáticamente - colores, animaciones, espaciado y efectos.
            </P>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="primary" to="/">Volver al inicio</Button>
              <Button variant="tertiary" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                Scroll to top
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Footer />
    </div>
  )
}

export default TestingPage
