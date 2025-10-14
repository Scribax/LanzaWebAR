import React from 'react'
import Reveal from '../Reveal'

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
  title?: string
  subtitle?: string
  centered?: boolean
  withBackground?: boolean
  withBlobs?: boolean
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  title,
  subtitle,
  centered = false,
  withBackground = false,
  withBlobs = false
}) => {
  return (
    <section 
      id={id}
      className={`scroll-mt-24 py-20 ${className} ${withBackground ? 'relative isolate overflow-hidden' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        {(title || subtitle) && (
          <div className={`${centered ? 'text-center' : ''} mb-16`}>
            {title && (
              <Reveal>
                <h2 className="h2">{title}</h2>
              </Reveal>
            )}
            {subtitle && (
              <Reveal delay={100}>
                <p className={`p mt-4 ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
                  {subtitle}
                </p>
              </Reveal>
            )}
          </div>
        )}
        
        {children}
      </div>

      {/* Background con blobs opcional */}
      {withBlobs && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-sky-500/30" />
          <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/30 via-emerald-500/30 to-cyan-500/30 [animation-delay:1.5s]" />
        </div>
      )}

      {/* Background gradient opcional */}
      {withBackground && (
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(6,182,212,0.14)_0%,rgba(10,10,10,0)_60%)]" />
      )}
    </section>
  )
}

export default Section
