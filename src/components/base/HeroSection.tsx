import React from 'react'
import Reveal from '../Reveal'
import Button from './Button'

interface HeroSectionProps {
  badge?: string
  title: React.ReactNode
  subtitle: string
  primaryCTA?: {
    text: string
    href?: string
    to?: string
    onClick?: () => void
  }
  secondaryCTA?: {
    text: string
    href?: string
    to?: string
    onClick?: () => void
  }
  tertiaryCTA?: {
    text: string
    href?: string
    to?: string
    onClick?: () => void
  }
  className?: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  badge,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  tertiaryCTA,
  className = ''
}) => {
  return (
    <section className={`relative isolate overflow-hidden pt-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-20 md:py-28">
          {badge && (
            <Reveal>
              <p className="mb-4 inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-neutral-800">
                {badge}
              </p>
            </Reveal>
          )}
          
          <Reveal delay={100}>
            <h1 className="h1">{title}</h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="p mt-4 max-w-2xl">{subtitle}</p>
          </Reveal>
          
          {(primaryCTA || secondaryCTA || tertiaryCTA) && (
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCTA && (
                  <Button 
                    variant="primary"
                    href={primaryCTA.href}
                    to={primaryCTA.to}
                    onClick={primaryCTA.onClick}
                  >
                    {primaryCTA.text}
                  </Button>
                )}
                {secondaryCTA && (
                  <Button 
                    variant="secondary"
                    href={secondaryCTA.href}
                    to={secondaryCTA.to}
                    onClick={secondaryCTA.onClick}
                  >
                    {secondaryCTA.text}
                  </Button>
                )}
                {tertiaryCTA && (
                  <Button 
                    variant="tertiary"
                    href={tertiaryCTA.href}
                    to={tertiaryCTA.to}
                    onClick={tertiaryCTA.onClick}
                  >
                    {tertiaryCTA.text}
                  </Button>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* Blobs flotantes signature */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-sky-500/30" />
        <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/30 via-emerald-500/30 to-cyan-500/30 [animation-delay:1.5s]" />
      </div>

      {/* Background gradient signature */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(6,182,212,0.14)_0%,rgba(10,10,10,0)_60%)]" />
    </section>
  )
}

export default HeroSection
