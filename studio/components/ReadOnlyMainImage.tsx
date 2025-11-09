import React from 'react'
import {useFormValue} from 'sanity'

// Small read-only input component that displays the first image in `images`.
// It constructs a CDN URL from the Sanity asset reference. Adjust projectId/dataset if needed.
export default function ReadOnlyMainImage() {
  const images = useFormValue(['images']) as any[] | undefined
  const first = images && images.length > 0 ? images[0] : undefined

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
      const projectId = 'xkgmhl6j'
      const dataset = 'production'
      src = `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`
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
