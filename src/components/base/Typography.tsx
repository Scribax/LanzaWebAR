import React from 'react'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`h1 ${className}`}>{children}</h1>
)

export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`h2 ${className}`}>{children}</h2>
)

export const H3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl md:text-2xl font-semibold ${className}`}>{children}</h3>
)

export const P: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`p ${className}`}>{children}</p>
)

export const GradientText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`gradient-text ${className}`}>{children}</span>
)

export const Lead: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-lg md:text-xl text-neutral-200 ${className}`}>{children}</p>
)

export const Small: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-sm text-neutral-400 ${className}`}>{children}</span>
)

export const Badge: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-neutral-800 ${className}`}>
    {children}
  </span>
)
