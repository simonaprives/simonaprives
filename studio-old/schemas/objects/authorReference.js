import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'authorReference',
  type: 'object',
  title: 'Author reference',
  fields: [
    defineField({
      type: 'reference',
      name: 'author',
      to: [
        {
          type: 'author'
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'author.name',
      media: 'author.image.asset'
    }
  }
})
