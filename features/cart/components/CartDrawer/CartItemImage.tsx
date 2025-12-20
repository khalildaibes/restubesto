import { StrapiImage } from '@/shared/components/ui/StrapiImage'

interface CartItemImageProps {
  imageUrl: string
  alt: string
}

export function CartItemImage({ imageUrl, alt }: CartItemImageProps) {
  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm ring-1 ring-gray-200/50">
      {imageUrl && imageUrl.trim() ? (
        <StrapiImage
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}

