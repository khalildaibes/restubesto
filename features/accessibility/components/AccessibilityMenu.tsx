'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronIcon } from '@/shared/components/ui/ChevronIcon'
import { useAccessibilityStore } from '@/stores/accessibility'
import type { FontScale } from '@/stores/accessibility'

const fontScaleLabels: Record<FontScale, string> = {
  normal: 'Default size',
  large: 'Large',
  xlarge: 'Extra large',
}

export function AccessibilityMenu() {
  const {
    fontScale,
    highContrast,
    underlineLinks,
    reduceMotion,
    setFontScale,
    toggleHighContrast,
    toggleUnderlineLinks,
    toggleReduceMotion,
  } = useAccessibilityStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-900 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <span aria-hidden="true">🛈</span>
        <span>Accessibility</span>
        <ChevronIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="accessibility-menu"
              role="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 z-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[240px]"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Text size</p>
                <div className="flex items-center gap-2 mt-2">
                  {(['normal', 'large', 'xlarge'] as FontScale[]).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setFontScale(scale)}
                      className={`flex-1 px-2 py-2 rounded-lg border text-sm transition-colors ${
                        fontScale === scale
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                      role="menuitemradio"
                      aria-checked={fontScale === scale}
                    >
                      {fontScaleLabels[scale]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                <ToggleRow
                  label="High contrast"
                  description="Increase contrast and outlines"
                  checked={highContrast}
                  onToggle={toggleHighContrast}
                />
                <ToggleRow
                  label="Underline links"
                  description="Show visible link styles"
                  checked={underlineLinks}
                  onToggle={toggleUnderlineLinks}
                />
                <ToggleRow
                  label="Reduce motion"
                  description="Minimize animations"
                  checked={reduceMotion}
                  onToggle={toggleReduceMotion}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onToggle: () => void
}

function ToggleRow({ label, description, checked, onToggle }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="menuitemcheckbox"
      aria-checked={checked}
      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <span>
        <span className="block text-sm font-medium text-gray-900">{label}</span>
        <span className="block text-xs text-gray-600">{description}</span>
      </span>
      <span
        className={`w-10 h-6 flex items-center rounded-full px-1 transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        aria-hidden="true"
      >
        <motion.span
          layout
          className="w-4 h-4 bg-white rounded-full shadow-sm"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ translateX: checked ? '14px' : '0px' }}
        />
      </span>
    </button>
  )
}

