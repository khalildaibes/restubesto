interface BannerPaginationProps {
  count: number
  currentIndex: number
  onSelect: (index: number) => void
}

export function BannerPagination({
  count,
  currentIndex,
  onSelect,
}: BannerPaginationProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2 rounded-full transition-all ${
            index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
          }`}
          aria-label={`Go to banner ${index + 1}`}
        />
      ))}
    </div>
  )
}

