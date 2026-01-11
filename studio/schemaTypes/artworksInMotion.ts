import {defineField, defineType} from 'sanity'
import ReadOnlyMainImage from '../components/ReadOnlyMainImage'

export default defineType({
  name: 'artworksInMotion',
  title: 'In Motion',
  type: 'document',
  groups: [
    {
      name: 'gallery',
      title: 'Gallery'
    }
  ],
  fields: [
      defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
      }),
      defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
          source: 'title',
          maxLength: 96,
          },
      }),
      defineField({
          name: 'mainImage',
          title: 'Main image',
          type: 'mainImage',
          readOnly: true,
          description:
          'Read-only. This field reflects the first image in gallery. This image is primarily used for SEO and social share.',
          components: {input: ReadOnlyMainImage},
      }),
      defineField({
        name: 'description',
        title: 'Description',
        description: 'This field is primarily used for SEO and social share.',
        type: 'string',
      }),
      defineField({
        name: 'videos',
        title: 'Gallery',
        group: 'gallery',
        type: 'array',
        of: [
            {
            type: 'artworkInMotionItem',
            title: 'Video'
            }
        ]
        }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'mainImage',
    },
    prepare({title = 'Untitled', slug = {}, media}: any) {
      const path = `/in-motion/${slug?.current || ''}`
      return {
        title,
        subtitle: path,
        media,
      }
    },
  },
})