import React from 'react'

const ScrollProgress: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      const progress = Math.min(1, Math.max(0, max > 0 ? scrollTop / max : 0))
      el.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        ref={ref}
        className="origin-left h-full w-full scale-x-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 transition-transform duration-150"
      />
    </div>
  )
}

export default ScrollProgress
