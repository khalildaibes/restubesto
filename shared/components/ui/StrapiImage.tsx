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
  const isProxyUrl = src.startsWith('/api/images/')

  // Log image loading attempt
  useEffect(() => {
    console.log('🖼️ StrapiImage - Attempting to load:', {
      src,
      alt,
      isHttp,
      isStrapiUrl,
      isProxyUrl,
      fill,
      width,
      height,
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      isProduction: typeof window !== 'undefined' && 
                    window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1'),
    })
  }, [src, alt, isHttp, isStrapiUrl, isProxyUrl, fill, width, height])

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
      isProxyUrl,
      imageElement: e.target,
      currentProtocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
    })
    
    // Try to diagnose the issue
    if (isHttp && isStrapiUrl && !isProxyUrl) {
      console.warn('🔍 Image Debug Info - Direct HTTP URL:', {
        url: src,
        protocol: (() => {
          try { return new URL(src).protocol } catch { return 'invalid' }
        })(),
        suggestion: 'This might be blocked due to mixed content. Consider using image proxy.',
      })
    } else if (isProxyUrl) {
      console.warn('🔍 Image Debug Info - Proxy URL:', {
        url: src,
        suggestion: 'Check if /api/images route is working correctly',
      })
    }
  }

  // For proxy URLs or HTTP Strapi images, use regular img tag
  // Proxy URLs are served through Next.js API route, so they're same-origin
  if (isProxyUrl || (isHttp && isStrapiUrl)) {
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

