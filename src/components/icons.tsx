import React from 'react'

export type IconProps = { className?: string }

export const CodeIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 6l-4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const AppIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="2" />
    <path d="M3 10h18" strokeWidth="2" />
    <circle cx="7" cy="8" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="8" r="1" fill="currentColor" />
  </svg>
)

export const GaugeIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path d="M5 18a7 7 0 0114 0" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V12l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
  </svg>
)

export const PaletteIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path d="M12 5a7 7 0 100 14h2a2 2 0 000-4h-3a4 4 0 01-4-4c0-3.314 2.686-6 6-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="10" r="1.1" fill="currentColor" />
    <circle cx="13.5" cy="9" r="1.1" fill="currentColor" />
    <circle cx="9.5" cy="14" r="1.1" fill="currentColor" />
  </svg>
)
