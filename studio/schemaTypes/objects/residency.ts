import { SparkleIcon } from '@sanity/icons'

export default {
  name: 'residency',
  type: 'object',
  title: 'residency',
  icon: SparkleIcon,
  fields: [
    {
      name: 'residencyYear',
      title: 'Residency Year',
      type: 'number',
      validation: (Rule: any) =>
      Rule.required().min(1900).max(new Date().getFullYear() + 1),
      },
      {
        name: 'title',
        title: 'Residency Title',
        type: 'string'
      },
      {
        name: 'location',
        title: 'Residency Location',
        type: 'string'
      },
  ]
  ,
  preview: {
    select: {
      year: 'residencyYear',
      title: 'title',
      location: 'location',
    },
    prepare(selection: any) {
      const {year, title, location, solo} = selection
      const parts = []
      if (year) parts.push(year)
      if (title) parts.push(`— ${title}`)
      const subtitleParts = []
      if (location) subtitleParts.push(location)
      const subtitle = subtitleParts.join(' • ')
      return {
        title: parts.join(' '),
        subtitle: subtitle || undefined,
      }
    },
  }
}