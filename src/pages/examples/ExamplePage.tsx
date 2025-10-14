import React from 'react'
import { Section, Card, Button, HeroSection, H2, H3, P, GradientText } from '../../components/base'
import Reveal from '../../components/Reveal'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const ExamplePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero con tu estilo signature */}
      <HeroSection
        badge="Página de ejemplo"
        title={
          <>
            Ejemplo de página con <GradientText>tu estilo</GradientText>
          </>
        }
        subtitle="Esta página demuestra cómo usar los componentes base para mantener consistencia con tu diseño y colores únicos."
        primaryCTA={{
          text: "CTA Principal",
          href: "#features"
        }}
        secondaryCTA={{
          text: "Ver Componentes",
          href: "#components"
        }}
        tertiaryCTA={{
          text: "Volver al Inicio",
          to: "/"
        }}
      />

      {/* Sección con características */}
      <Section 
        id="features"
        title="Características de tu Estilo"
        subtitle="Todos estos elementos mantienen automáticamente tu esencia visual"
        centered
        withBackground
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <Card hover>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                🎨
              </div>
              <H3>Colores Consistentes</H3>
              <P className="mt-2">
                Trilogía verde → cian → azul aplicada automáticamente en gradientes y acentos.
              </P>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card hover glass>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                ✨
              </div>
              <H3>Efectos Visuales</H3>
              <P className="mt-2">
                Blobs flotantes, glass effects y animaciones sutiles que definen tu identidad.
              </P>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card hover>
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                🏗️
              </div>
              <H3>Componentes Reutilizables</H3>
              <P className="mt-2">
                Section, Card, Button y Typography listos para crear nuevas páginas rápidamente.
              </P>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Sección de componentes */}
      <Section 
        id="components"
        title="Componentes Base"
        subtitle="Ejemplos de cómo usar cada componente manteniendo tu estilo"
        withBlobs
      >
        <div className="space-y-12">
          {/* Botones */}
          <Reveal>
            <div>
              <H2>Botones</H2>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="primary">Botón Primario</Button>
                <Button variant="secondary">Botón Secundario</Button>
                <Button variant="tertiary">Botón Terciario</Button>
              </div>
            </div>
          </Reveal>

          {/* Cards */}
          <Reveal delay={100}>
            <div>
              <H2>Cards</H2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <H3>Card Normal</H3>
                  <P className="mt-2">Card estándar con tu paleta de colores y bordes sutiles.</P>
                </Card>
                <Card glass hover>
                  <H3>Card Glass + Hover</H3>
                  <P className="mt-2">Card con efecto glass y animación hover característica.</P>
                </Card>
              </div>
            </div>
          </Reveal>

          {/* Tipografía */}
          <Reveal delay={200}>
            <div>
              <H2>Tipografía</H2>
              <div className="mt-6 space-y-4">
                <H2>Título H2 con tu estilo</H2>
                <H3>Título H3 complementario</H3>
                <P>Párrafo con el color y spacing correcto para mantener legibilidad en dark mode.</P>
                <P>Texto con <GradientText>palabras destacadas</GradientText> usando tu gradiente signature.</P>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

export default ExamplePage
