'use client'

import { useTranslations } from '@/shared/i18n'
import { IconButton } from '@/shared/components/ui/IconButton'
import { CloseIcon } from '@/shared/components/ui/CloseIcon'

interface CartDrawerHeaderProps {
  onClose: () => void
}

export function CartDrawerHeader({ onClose }: CartDrawerHeaderProps) {
  const t = useTranslations()

  return (
    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">{t.cart.cart}</h2>
      <IconButton onClick={onClose} aria-label="Close cart">
        <CloseIcon className="w-5 h-5 text-gray-900" />
      </IconButton>
    </div>
  )
}

