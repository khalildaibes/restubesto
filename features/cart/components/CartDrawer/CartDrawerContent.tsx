'use client'

import { motion } from 'framer-motion'
import { useLanguageStore } from '@/stores/language'
import { CartDrawerHeader } from './CartDrawerHeader'
import { CartDrawerItems } from './CartDrawerItems'
import { CartDrawerFooter } from './CartDrawerFooter'

interface CartDrawerContentProps {
  onClose: () => void
}

export function CartDrawerContent({ onClose }: CartDrawerContentProps) {
  const { language } = useLanguageStore()
  const isRTL = language === 'he' || language === 'ar'

  return (
    <motion.div
      initial={{ x: isRTL ? '-100%' : '100%' }}
      animate={{ x: 0 }}
      exit={{ x: isRTL ? '-100%' : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`fixed top-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col ${
        isRTL ? 'left-0' : 'right-0'
      }`}
    >
      <CartDrawerHeader onClose={onClose} />
      <CartDrawerItems />
      <CartDrawerFooter />
    </motion.div>
  )
}

