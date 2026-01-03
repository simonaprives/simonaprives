import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'Keywords',
      description: 'Add keywords that describes your site.',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'string',
      description: 'Email shown on the About page (will be linked mailto:).',
      validation: Rule => Rule.email()
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
