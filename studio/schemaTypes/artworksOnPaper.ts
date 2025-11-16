import {defineField, defineType} from 'sanity'
import ReadOnlyMainImage from '../components/ReadOnlyMainImage'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'artworkOnPaper',
  title: 'On Paper',
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
        'Read-only. This reflects the first image in the Images array — edit the Images array to change the gallery main image. This image is primarily used for SEO and social share.',
        components: {input: ReadOnlyMainImage},
    }),
    defineField({
        name: 'description',
        title: 'Description',
        type: 'string',
    }),
    defineField({
      name: 'images1',
      title: 'Gallery',
      group: 'gallery',
      type: 'array',
      of: [
        {
          type: 'artworkOnPaperItem',
          title: 'Artwork'
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
