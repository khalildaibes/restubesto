export type FontScale = 'normal' | 'large' | 'xlarge'

export interface AccessibilityState {
  fontScale: FontScale
  highContrast: boolean
  underlineLinks: boolean
  reduceMotion: boolean
}

export interface AccessibilityStore extends AccessibilityState {
  setFontScale: (scale: FontScale) => void
  toggleHighContrast: () => void
  toggleUnderlineLinks: () => void
  toggleReduceMotion: () => void
}

