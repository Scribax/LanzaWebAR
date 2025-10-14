import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  target?: string
  rel?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  target,
  rel
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variantClasses = {
    primary: 'btn-gradient',
    secondary: 'btn-secondary',
    tertiary: 'inline-flex items-center rounded-md border border-neutral-700 font-semibold text-white hover:bg-neutral-900 transition-colors'
  }

  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-md
    transition-all duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const content = variant === 'primary' ? <span>{children}</span> : children

  if (to) {
    return (
      <Link 
        to={to} 
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a 
        href={href}
        target={target}
        rel={rel}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {content}
    </button>
  )
}

export default Button
