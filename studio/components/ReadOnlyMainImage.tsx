import React, {useEffect, useRef} from 'react'
import {useFormValue, useClient} from 'sanity'

// Small read-only input component that displays the first image in `images`.
// It also auto-syncs that image into the top-level `mainImage` field by
// patching the document when the first image changes.
export default function ReadOnlyMainImage() {
  const client = useClient({apiVersion: '2023-01-01'})
  // Support multiple gallery field names: `images` (array of image objects),
  // `images1` (array of artwork items that may contain `mainImage`), and
  // `videos` (in-motion gallery items that contain `mainImage` poster images).
  const images = useFormValue(['images']) as any[] | undefined
  const images1 = useFormValue(['images1']) as any[] | undefined
  const videos = useFormValue(['videos']) as any[] | undefined
  const main = useFormValue(['mainImage']) as any | undefined
  const id = useFormValue(['_id']) as string | undefined
  // Determine the first image: prefer `images` array items (image objects),
  // otherwise try `images1[0].mainImage` or `videos[0].mainImage` for item arrays.
  let first = images && images.length > 0 ? images[0] : undefined
  if (!first && images1 && images1.length > 0) {
    const item = images1[0]
    first = item && item.mainImage ? item.mainImage : undefined
  }
  if (!first && videos && videos.length > 0) {
    const item = videos[0]
    first = item && item.mainImage ? item.mainImage : undefined
  }
  const prevRef = useRef<string | undefined>(undefined)

  // Auto-sync: when the first image asset ref changes, patch the document's
  // `mainImage` to match. Use a ref to avoid duplicate patches.
  useEffect(() => {
  const firstRef = first?.asset?._ref
    if (!id) return
    if (!firstRef) return
    const mainRef = main?.asset?._ref
    if (mainRef === firstRef) return
    if (prevRef.current === firstRef) return
    prevRef.current = firstRef

    // Patch the document to set mainImage to the first image (or nested mainImage)
    // Ensure we have both asset and alt text before syncing
    const altText = first?.alt || first?.asset?.alt || `Image from gallery`
    const imageToSync = {
      ...first,
      alt: altText
    }
    
    client
      .patch(id)
      .set({mainImage: imageToSync})
      .commit()
      .catch(() => {
        // ignore; syncing is a convenience, not critical
      })
  }, [client, first, id, main])

  let src: string | undefined
  try {
  const ref = first?.asset?._ref
    if (typeof ref === 'string' && ref.startsWith('image-')) {
      // ref example: image-<id>-<width>x<height>-png
      const rest = ref.slice(6)
      const parts = rest.split('-')
      const ext = parts.pop()
      const idAndDims = parts.join('-')
      const filename = `${idAndDims}.${ext}`
      // Prefer to read project/dataset from the client config so this works
      // across environments.
      try {
        const cfg = client.config() as any
        const projectId = cfg.projectId || 'xkgmhl6j'
        const dataset = cfg.dataset || 'production'
        src = `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`
      } catch (err) {
        const projectId = 'xkgmhl6j'
        const dataset = 'production'
        src = `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`
      }
    }
  } catch (err) {
    // swallow
  }

  return (
    <div style={{padding: '0.5rem'}}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Main image" style={{maxWidth: '100%', height: 'auto', display: 'block'}} />
      ) : (
        <div style={{color: '#666'}}>No main image — add images and the first one will be shown here.</div>
      )}
    </div>
  )
}
