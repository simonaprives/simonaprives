import { SparkleIcon } from '@sanity/icons'

export default {
  name: 'education',
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
        name: 'degree',
        title: 'Degree',
        type: 'string'
      },
  ]
  ,
  preview: {
    select: {
      school: 'schoolName',
      degree: 'degree',
    },
    prepare(selection: any) {
      const {school, degree} = selection
      return {
        title: school || degree || 'Education',
        subtitle: degree || undefined,
        media: undefined,
      }
    }
  }
}