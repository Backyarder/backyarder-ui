import { SyntheticEvent } from 'react'

// Shown when a plant has no image or its image fails to load.
export const FALLBACK_IMAGE = `${process.env.PUBLIC_URL}/images/plant-fallback.png`

// Resolve a plant image for an <img src>. Falls back when the API gives us nothing.
export const plantImageSrc = (image: string | null | undefined): string => image || FALLBACK_IMAGE

// Swap in the fallback if the image URL is dead (e.g. an expired or moved CDN link).
export const onImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget
  if (img.src !== FALLBACK_IMAGE && !img.src.endsWith('/images/plant-fallback.png')) {
    img.src = FALLBACK_IMAGE
  }
}
