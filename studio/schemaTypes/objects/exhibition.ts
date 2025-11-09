import { SparkleIcon } from '@sanity/icons'

export default {
  name: 'exhibition',
  type: 'object',
  title: 'exhibition',
  icon: SparkleIcon,
  fields: [
    {
      name: 'ExhibitionYear',
      title: 'Exhibition Year',
      type: 'number',
      validation: (Rule: any) =>
      Rule.required().min(1900).max(new Date().getFullYear() + 1),
      },
      {
        name: 'title',
        title: 'Exhibition Title',
        type: 'string'
      },
      {
        name: 'location',
        title: 'Exhibition Location',
        type: 'string'
      },
      {
        name: 'solo',
        title: 'Solo',
        type: 'boolean'
      },
  ]
  ,
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