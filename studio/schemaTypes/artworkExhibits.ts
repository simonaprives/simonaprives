import {defineField, defineType} from 'sanity'
import ReadOnlyMainImage from '../components/ReadOnlyMainImage'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'artworkExhibits',
  title: 'Exhibits',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image (read-only)',
      type: 'mainImage',
      readOnly: true,
      description:
        'Read-only. This reflects the first image in the Images array — edit the Images array to change the gallery main image.',
      components: {input: ReadOnlyMainImage},
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
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'photoCredit',
      title: 'Photo Credit',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      icon: ImagesIcon,
      type: 'array',
      of: [
        {
        type: 'mainImage',
        title: 'Image',
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'title',
      // use the first image in the `images` array as the gallery main image
      media: 'mainImage',
    },
  },
})
