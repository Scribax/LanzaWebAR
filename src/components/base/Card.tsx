import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  border?: boolean
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  border = true,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const baseClasses = `
    rounded-xl
    ${hover ? 'card-hover cursor-pointer' : ''}
    ${glass ? 'glass' : 'bg-neutral-900/30'}
    ${border ? 'border border-neutral-800/50' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
