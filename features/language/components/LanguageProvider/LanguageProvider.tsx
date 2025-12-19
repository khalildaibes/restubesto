'use client'

import { useEffect } from 'react'
import { useLanguageStore } from '@/stores/language'

interface LanguageProviderProps {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { direction, language } = useLanguageStore()

  useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = language
  }, [direction, language])

  return <>{children}</>
}

