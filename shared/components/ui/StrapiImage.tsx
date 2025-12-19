'use client'

import Image from 'next/image'
import { useState } from 'react'

interface StrapiImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

/**
 * Image component that handles HTTP Strapi images in production
 * Uses regular img tag for HTTP URLs to avoid mixed content issues
 */
export function StrapiImage({
  src,
  alt,
  fill,
  className,
  priority,
  width,
  height,
}: StrapiImageProps) {
  const [error, setError] = useState(false)
  const isHttp = src.startsWith('http://')
  const isStrapiUrl = src.includes('142.93.172.35')

  // For HTTP Strapi images, use regular img tag to avoid mixed content issues
  if (isHttp && isStrapiUrl) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onError={() => {
            setError(true)
            console.error(`Failed to load image:`, src)
          }}
        />
      )
    }
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={{ objectFit: 'cover' }}
        onError={() => {
          setError(true)
          console.error(`Failed to load image:`, src)
        }}
      />
    )
  }

  // For HTTPS images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={isHttp}
      onError={() => {
        setError(true)
        console.error(`Failed to load image:`, src)
      }}
    />
  )
}

