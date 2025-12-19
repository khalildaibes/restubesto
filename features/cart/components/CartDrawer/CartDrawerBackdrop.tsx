import { motion } from 'framer-motion'

interface CartDrawerBackdropProps {
  onClose: () => void
}

export function CartDrawerBackdrop({ onClose }: CartDrawerBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    />
  )
}

