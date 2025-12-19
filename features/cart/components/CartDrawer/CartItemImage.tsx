import { StrapiImage } from '@/shared/components/ui/StrapiImage'

interface CartItemImageProps {
  imageUrl: string
  alt: string
}

export function CartItemImage({ imageUrl, alt }: CartItemImageProps) {
  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
      {imageUrl && imageUrl.trim() ? (
        <StrapiImage
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
    </div>
  )
}

