import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'mainImage',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true
  },
  fields: [
    defineField({
      title: 'Caption',
      name: 'caption',
      type: 'string',
      options: {
        isHighlighted: true
      }
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description: 'Important for SEO and accessiblity.',
      options: {
        isHighlighted: true
      }
    })
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'caption'
    }
  }
})
