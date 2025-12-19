import { motion } from 'framer-motion'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { TRANSITION_DURATIONS } from '@/shared/constants/animations'

interface BackdropProps {
  onClick: () => void
}

export function Backdrop({ onClick }: BackdropProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? TRANSITION_DURATIONS.reduced : 0.2 }}
      onClick={onClick}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    />
  )
}

