import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccessibilityStore, FontScale } from './types'

const storageKey = 'accessibility-preferences'

const applyDocumentClasses = (state: AccessibilityStore) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.toggle('a11y-contrast', state.highContrast)
  root.classList.toggle('a11y-underline-links', state.underlineLinks)
  root.classList.toggle('a11y-reduce-motion', state.reduceMotion)

  root.dataset.fontScale = state.fontScale
}

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      fontScale: 'normal',
      highContrast: false,
      underlineLinks: false,
      reduceMotion: false,
      setFontScale: (scale: FontScale) => {
        set({ fontScale: scale })
        applyDocumentClasses({ ...get(), fontScale: scale })
      },
      toggleHighContrast: () => {
        set({ highContrast: !get().highContrast })
        applyDocumentClasses({ ...get(), highContrast: !get().highContrast })
      },
      toggleUnderlineLinks: () => {
        set({ underlineLinks: !get().underlineLinks })
        applyDocumentClasses({ ...get(), underlineLinks: !get().underlineLinks })
      },
      toggleReduceMotion: () => {
        set({ reduceMotion: !get().reduceMotion })
        applyDocumentClasses({ ...get(), reduceMotion: !get().reduceMotion })
      },
    }),
    {
      name: storageKey,
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDocumentClasses(state as AccessibilityStore)
        }
      },
    }
  )
)

