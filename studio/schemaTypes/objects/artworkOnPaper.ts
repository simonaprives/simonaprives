import { SparkleIcon } from '@sanity/icons'

export default {
  // Object type used inside the On Paper document
  name: 'artworkOnPaperItem',
  type: 'object',
  title: 'Artwork On Paper (item)',
  icon: SparkleIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'mainImage',
      title: 'Image',
      type: 'mainImage',
      options: { hotspot: true }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'dimensions',
      media: 'mainImage'
    },
    prepare(selection: any) {
      const {title, subtitle, media} = selection || {}
      return {
        title: title || 'Untitled artwork',
        subtitle: subtitle || undefined,
        media: media || undefined
      }
    }
  }
}