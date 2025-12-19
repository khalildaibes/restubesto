import Image from 'next/image'

interface CartItemImageProps {
  imageUrl: string
  alt: string
}

export function CartItemImage({ imageUrl, alt }: CartItemImageProps) {
  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
      <Image src={imageUrl} alt={alt} fill className="object-cover" />
    </div>
  )
}

