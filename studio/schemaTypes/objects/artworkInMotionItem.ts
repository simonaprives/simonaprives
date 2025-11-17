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
      name: 'mainImage',
      type: 'mainImage',
      title: 'Poster Image',
      description: 'Add a photo that displays in social sharing preview'
    },
    {
     name: 'vimeo',
     title: 'Vimeo Video',
     type: 'object',
     description: 'Video url + accessible description (grouped)',
     fields: [
       {
         name: 'url',
         type: 'url',
         title: 'YouTube video URL',
         validation: (Rule: { uri: (arg0: { scheme: string[] }) => any }) => Rule.uri({ scheme: ['http', 'https'] })
       },
       {
         name: 'description',
         type: 'string',
         title: 'Video description (for accessibility / caption)'
       },
       {
         name: 'preferVideo',
         type: 'boolean',
         title: 'Prefer showing video over image',
         initialValue: false
       }
     ]
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