'use client'

import { AnimatePresence } from 'framer-motion'
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock'
import { CartDrawerBackdrop } from './CartDrawerBackdrop'
import { CartDrawerContent } from './CartDrawerContent'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  useBodyScrollLock(isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <CartDrawerBackdrop onClose={onClose} />
          <CartDrawerContent onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

