'use client'

import { motion } from 'framer-motion'
import { CartIcon } from '@/shared/components/ui/CartIcon'
import { IconButton } from '@/shared/components/ui/IconButton'
import { useTranslations } from '@/shared/i18n'

interface CartButtonProps {
  onClick: () => void
  itemCount: number
}

export function CartButton({ onClick, itemCount }: CartButtonProps) {
  const t = useTranslations()

  return (
    <IconButton
      onClick={onClick}
      aria-label={t.common.cart}
      className="relative p-2"
    >
      <CartIcon className="w-6 h-6 text-gray-900" />
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </motion.span>
      )}
    </IconButton>
  )
}

