import {defineField, defineType} from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'biolinks',
  title: 'Biolinks',
  type: 'document',
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
    }),
    defineField({
      name: 'biolinks',
      title: 'Biolinks',
      description: 'Include 5-7 promotional links',
      type: 'array',
      of: [
        {
          type: 'link',
          title: 'Link',
          icon: LinkIcon
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
