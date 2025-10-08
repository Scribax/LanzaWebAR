import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Espera al render y desplaza a la ancla respetando scroll-margin-top
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          ;(el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname, hash])
  return null
}
