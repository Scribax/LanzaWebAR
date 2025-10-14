# 🚀 Guía Rápida de Componentes Base

## Importación
```tsx
import { Section, Card, Button, HeroSection, H1, H2, P, GradientText } from './components/base'
```

## Ejemplos de Uso

### Hero Section
```tsx
<HeroSection
  badge="Nuevo"
  title={<>Mi página con <GradientText>estilo único</GradientText></>}
  subtitle="Descripción que mantiene tu esencia visual automáticamente"
  primaryCTA={{ text: "Empezar", href: "#start" }}
  secondaryCTA={{ text: "Más info", to: "/info" }}
/>
```

### Section con contenido
```tsx
<Section 
  id="features"
  title="Título de la sección"
  subtitle="Subtítulo descriptivo"
  centered
  withBlobs
>
  <div className="grid gap-8 md:grid-cols-3">
    {/* Tu contenido aquí */}
  </div>
</Section>
```

### Cards
```tsx
<Card hover glass>
  <H3>Título del Card</H3>
  <P>Descripción del contenido</P>
  <Button variant="primary">Acción</Button>
</Card>
```

### Botones
```tsx
<Button variant="primary" to="/page">CTA Principal</Button>
<Button variant="secondary" href="#section">CTA Secundario</Button>
<Button variant="tertiary" onClick={handleClick}>CTA Terciario</Button>
```

## Ventajas

✅ **Consistencia automática**: Mantienen tu trilogía de colores y efectos visuales
✅ **Responsive**: Adaptación automática a móvil/desktop
✅ **Animaciones incluidas**: Reveal, hover effects, blobs flotantes
✅ **Accesible**: Focus rings y estados visuales incluidos
✅ **TypeScript**: Intellisense completo
✅ **Modular**: Usa solo lo que necesites

## Para nuevas páginas

1. Importa los componentes base necesarios
2. Usa `HeroSection` para el hero
3. Envuelve el contenido en `Section`
4. Usa `Card` para elementos destacados
5. Aplica `GradientText` en palabras clave
6. Los blobs, colores y animaciones se aplican automáticamente

¡Tu estilo visual se mantiene consistente sin esfuerzo adicional!
