import React from 'react'
import {Card, Text, Flex} from '@sanity/ui'

interface PreviewIframeProps {
  document: {
    displayed: {
      _type: string
      slug?: {current: string}
      title?: string
    }
  }
}

export default function PreviewIframe(props: PreviewIframeProps) {
  const {_type, slug} = props.document.displayed
  
  // Determine the preview URL based on document type
  let previewUrl = 'http://localhost:8080'
  
  if (_type === 'homePage') {
    previewUrl += '/?preview=true'
  } else if (_type === 'aboutPage') {
    previewUrl += '/about/?preview=true'
  } else if (_type === 'cv') {
    previewUrl += '/cv/?preview=true'
  } else if (_type === 'biolinks') {
    previewUrl += '/biolinks/?preview=true'
  } else if (_type === 'artworkExhibits' && slug?.current) {
    previewUrl += `/exhibits/${slug.current}/?preview=true`
  } else if (_type === 'artworksInMotion' && slug?.current) {
    previewUrl += `/in-motion/${slug.current}/?preview=true`
  } else {
    return (
      <Card padding={4}>
        <Flex align="center" justify="center" style={{minHeight: '50vh'}}>
          <Text>Preview not available for this document type</Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Card style={{height: '100%', overflow: 'hidden'}}>
      <iframe
        src={previewUrl}
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
        }}
        title="Preview"
      />
    </Card>
  )
}
