import React, { useState, useEffect } from 'react'

const WhatsAppButton: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const phoneNumber = '+5491156177616' // Formato internacional para WhatsApp
  const message = '¡Hola! Nos interesa conocer más sobre sus servicios de desarrollo web.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 300 // Distancia máxima para completar la transición
      const progress = Math.min(scrollY / maxScroll, 1) // Valor entre 0 y 1
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calcular posiciones basadas en el progreso del scroll
  const translateX = scrollProgress * 35 // Se mueve hacia la derecha (reducido para mejor accesibilidad)
  const translateY = scrollProgress * -8 // Se mueve ligeramente hacia arriba
  const scale = 1 - scrollProgress * 0.1 // Se hace más pequeño (de 1 a 0.9 - menos reducción)
  const isFullyScrolled = scrollProgress > 0.8

  const buttonStyle = {
    transform: `translateX(${translateX}vw) translateY(${translateY}px) translateX(-50%) scale(${scale})`,
    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Curva suave personalizada
  }

  return (
    <>
      <div
        className="fixed z-50 bottom-8 left-1/2"
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-center rounded-full bg-green-500 shadow-lg transition-all duration-300 hover:bg-green-600 hover:shadow-xl hover:scale-110 ${
            isFullyScrolled ? 'h-14 w-14' : 'h-16 w-16 md:h-18 md:w-18'
          } ${
            scrollProgress < 0.1 ? 'animate-bounce-gentle' : ''
          }`}
          aria-label="Contactar por WhatsApp"
        >
          {/* Efecto de pulso */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
          
          {/* Ícono de WhatsApp */}
          <svg
            className={`relative z-10 fill-white transition-transform duration-300 group-hover:scale-110 ${
              isFullyScrolled ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Tooltip */}
          {isHovered && scrollProgress < 0.3 && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1 text-sm text-white shadow-lg">
              ¡Contacta con nuestro equipo!
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </a>

        {/* Mensaje flotante cuando está más hacia la esquina */}
        {scrollProgress > 0.6 && isHovered && (
          <div className="absolute bottom-full right-0 mb-2 animate-fadeIn">
            <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow-lg border border-gray-200 min-w-max">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">¿Tienes un proyecto en mente?</p>
                <p className="text-xs text-gray-600">¡Contáctanos por WhatsApp!</p>
              </div>
            </div>
            <div className="absolute top-full right-4 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
          </div>
        )}
      </div>
    </>
  )
}

export default WhatsAppButton