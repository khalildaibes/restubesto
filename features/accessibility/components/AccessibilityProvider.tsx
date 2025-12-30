'use client'

import { useEffect } from 'react'
import { useAccessibilityStore } from '@/stores/accessibility'

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const state = useAccessibilityStore()

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.classList.toggle('a11y-contrast', state.highContrast)
    root.classList.toggle('a11y-underline-links', state.underlineLinks)
    root.classList.toggle('a11y-reduce-motion', state.reduceMotion)
    root.dataset.fontScale = state.fontScale
  }, [state.highContrast, state.underlineLinks, state.reduceMotion, state.fontScale])

  return <>{children}</>
}




