import React from 'react'
import { HeroSection, Section, Card, Button, H2, H3, P, GradientText } from '../components/base'
import Reveal from '../components/Reveal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Home, Search, ArrowLeft, Compass } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero 404 con tu estilo signature */}
      <HeroSection
        badge="Error 404"
        title={
          <>
            Página <GradientText>no encontrada</GradientText>
          </>
        }
        subtitle="La página que buscas no existe o ha sido movida. Te ayudamos a encontrar lo que necesitas."
        primaryCTA={{
          text: "Volver al inicio",
          to: "/",
          
        }}
        secondaryCTA={{
          text: "Ver proyectos",
          href: "/#projects"
        }}
        tertiaryCTA={{
          text: "Contactar",
          href: "/#contact"
        }}
      />

      {/* Número 404 grande y estilizado */}
      <Section className="py-12">
        <div className="text-center">
          <Reveal>
            <div className="relative">
              {/* Número 404 gigante con gradiente */}
              <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none tracking-tighter">
                <span className="gradient-text">404</span>
              </div>
              
              {/* Efectos decorativos alrededor del 404 */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-500 rounded-full opacity-60 animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-500 rounded-full opacity-40 animate-bounce" />
                <div className="absolute bottom-1/4 left-3/4 w-4 h-4 bg-blue-500 rounded-full opacity-50" style={{animationDelay: '1s'}} />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Sección de sugerencias útiles */}
      <Section 
        id="suggestions"
        title="¿Qué puedes hacer?"
        subtitle="Te sugerimos estas opciones para continuar navegando"
        centered
        withBlobs
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <Card hover glass className="text-center">
              <div className="mb-4 mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <H3>Página Principal</H3>
              <P className="mt-2 text-sm">
                Regresa al inicio y descubre todos nuestros servicios.
              </P>
              <div className="mt-4">
                <Button variant="primary" to="/" size="sm">
                  Ir al inicio
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card hover className="text-center">
              <div className="mb-4 mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <H3>Nuestros Proyectos</H3>
              <P className="mt-2 text-sm">
                Explora nuestro portfolio con 4 demos interactivos.
              </P>
              <div className="mt-4">
                <Button variant="secondary" href="/#projects" size="sm">
                  Ver proyectos
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card hover className="text-center">
              <div className="mb-4 mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <H3>Hosting Web</H3>
              <P className="mt-2 text-sm">
                Descubre nuestros planes de hosting profesional.
              </P>
              <div className="mt-4">
                <Button variant="tertiary" to="/hosting" size="sm">
                  Ver hosting
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={300}>
            <Card hover glass className="text-center">
              <div className="mb-4 mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <ArrowLeft className="w-6 h-6 text-white" />
              </div>
              <H3>Volver Atrás</H3>
              <P className="mt-2 text-sm">
                Regresa a la página anterior usando tu navegador.
              </P>
              <div className="mt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => window.history.back()} 
                  size="sm"
                >
                  Ir atrás
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Sección con links útiles */}
      <Section 
        title="Enlaces Útiles"
        subtitle="Páginas más visitadas de LanzaWebAR"
        withBackground
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <Card hover>
              <H3>Servicios</H3>
              <P className="mt-2 text-sm text-neutral-400">
                Desarrollo web, apps móviles, branding y hosting profesional.
              </P>
              <div className="mt-4">
                <Button variant="tertiary" href="/#services" size="sm">
                  Ver servicios
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card hover>
              <H3>Portfolio</H3>
              <P className="mt-2 text-sm text-neutral-400">
                ShopMini, Analytics Pro, SaaSify y RealEstate Pro demos.
              </P>
              <div className="mt-4">
                <Button variant="tertiary" href="/#projects" size="sm">
                  Ver demos
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card hover>
              <H3>Contacto</H3>
              <P className="mt-2 text-sm text-neutral-400">
                Hablemos de tu próximo proyecto web o app móvil.
              </P>
              <div className="mt-4">
                <Button variant="tertiary" href="/#contact" size="sm">
                  Contactar
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Mensaje final divertido */}
      <Section centered>
        <Reveal>
          <div className="text-center py-12">
            <div className="mb-6">
              <span className="text-6xl">🚀</span>
            </div>
            <H2>No te preocupes</H2>
            <P className="mt-4 max-w-2xl mx-auto">
              Hasta los mejores exploradores se pierden a veces. Lo importante es 
              encontrar el camino de regreso y <GradientText>seguir navegando</GradientText>.
            </P>
            <div className="mt-8">
              <Button variant="primary" to="/">
                Volver al inicio
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Footer />
    </div>
  )
}

export default NotFound
