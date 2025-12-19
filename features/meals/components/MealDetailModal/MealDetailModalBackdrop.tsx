import { motion } from 'framer-motion'

interface MealDetailModalBackdropProps {
  onClose: () => void
}

export function MealDetailModalBackdrop({
  onClose,
}: MealDetailModalBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    />
  )
}

