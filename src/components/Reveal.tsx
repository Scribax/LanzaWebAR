import React from 'react'

type Props = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
  delay?: number // ms
}

const Reveal: React.FC<Props> = ({ as: Tag = 'div', className = '', children, delay = 0 }) => {
  const ref = React.useRef<HTMLElement | null>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setShown(true), delay)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    // @ts-ignore - dynamic tag
    <Tag ref={ref} className={`reveal ${shown ? 'show' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

export default Reveal
