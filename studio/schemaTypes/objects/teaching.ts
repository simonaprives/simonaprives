import { SparkleIcon } from '@sanity/icons'

export default {
  name: 'teaching',
  type: 'object',
  title: 'Teaching',
  icon: SparkleIcon,
  fields: [
      {
        name: 'schoolName',
        title: 'School Name',
        type: 'string'
      },
      {
        name: 'title',
        title: 'Title',
        type: 'string'
      },
  ]
  ,
  preview: {
    select: {
      school: 'schoolName',
      role: 'title',
    },
    prepare(selection: any) {
      const {school, role} = selection
      const title = school && role ? `${school} — ${role}` : school || role || 'Teaching'
      return {
        title,
        subtitle: undefined,
        media: undefined,
      }
    }
  }
}