import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home',
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
     name: 'videoUrl',
     title: 'Video url',
     type: 'url',
     description: 'Ensure that field includes an url like https://vimeo.com/661763692',
     validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'mainImage',
      type: 'mainImage',
      title: 'Poster Image',
      description: 'Add a photo that displays in social sharing preview and a placeholder if the video has not yet loaded.'
    }),
  ],
})
