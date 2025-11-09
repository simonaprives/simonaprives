import { ImageIcon } from '@sanity/icons'

export default {
  name: 'artworkExhibit',
  type: 'object',
  title: 'exhibition',
  icon: ImageIcon,
  fields: [
      {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
          {
            type: 'mainImage',
            title: 'Image',
          }
        ]
      }
  ],

  preview: {
    select: {
      year: 'ExhibitionYear',
      title: 'title',
      location: 'location',
      solo: 'solo',
    },
    prepare(selection: any) {
      const {year, title, location, solo} = selection
      const parts = []
      if (year) parts.push(year)
      if (title) parts.push(`— ${title}`)
      const subtitleParts = []
      if (location) subtitleParts.push(location)
      if (solo) subtitleParts.push('solo')
      const subtitle = subtitleParts.join(' • ')
      return {
        title: parts.join(' '),
        subtitle: subtitle || undefined,
      }
    },
  }
}