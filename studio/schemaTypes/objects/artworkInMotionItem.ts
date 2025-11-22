export default {
  // Object type used inside the On Paper document
  name: 'artworkInMotionItem',
  type: 'object',
  title: 'Artwork In motion (item)',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      type: 'string',
      title: 'Description',
      description: 'Displays on social share previews',
    },
    {
     name: 'videoUrl',
     title: 'Video url',
     type: 'url',
     description: 'Ensure that field includes an url like https://vimeo.com/661763692',
     validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['https'],
        }),
    },
    {
      name: 'mainImage',
      type: 'mainImage',
      title: 'Poster Image',
      description: 'Add a photo that displays in social sharing preview'
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
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