'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

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
  const [loaded, setLoaded] = useState(false)
  const isHttp = src.startsWith('http://')
  const isStrapiUrl = src.includes('142.93.172.35')

  // Log image loading attempt
  useEffect(() => {
    console.log('🖼️ StrapiImage - Attempting to load:', {
      src,
      alt,
      isHttp,
      isStrapiUrl,
      fill,
      width,
      height,
    })
  }, [src, alt, isHttp, isStrapiUrl, fill, width, height])

  const handleLoad = () => {
    setLoaded(true)
    console.log('✅ StrapiImage - Successfully loaded:', src)
  }

  const handleError = (e: any) => {
    setError(true)
    console.error('❌ StrapiImage - Failed to load image:', {
      src,
      alt,
      error: e,
      isHttp,
      isStrapiUrl,
      imageElement: e.target,
    })
    
    // Try to diagnose the issue
    if (isHttp && isStrapiUrl) {
      console.warn('🔍 Image Debug Info:', {
        url: src,
        protocol: new URL(src).protocol,
        hostname: new URL(src).hostname,
        pathname: new URL(src).pathname,
        fullUrl: src,
        suggestion: 'Check if Strapi server is accessible and CORS is configured',
      })
    }
  }

  // For HTTP Strapi images, use regular img tag to avoid mixed content issues
  if (isHttp && isStrapiUrl) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onLoad={handleLoad}
          onError={handleError}
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
        onLoad={handleLoad}
        onError={handleError}
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
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}

