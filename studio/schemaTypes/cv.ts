import {defineField, defineType} from 'sanity'
import { SparkleIcon } from '@sanity/icons'

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  groups: [
    {
      name: 'exhibitions',
      title: 'Exhibitions'
    },
    {
      name: 'residencies',
      title: 'Residencies'
    },
    {
      name: 'teaching',
      title: 'Teaching'
    },
    {
      name: 'education',
      title: 'Education'
    }
  ],
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
      name: 'exhibitions',
      title: 'Select Exhibitions',
      group: 'exhibitions',
      icon: SparkleIcon,
      type: 'array',
      of: [
        {
        type: 'exhibition',
        title: 'Exhibition',
        }
      ]
    }),
    defineField({
      name: 'residencies',
      title: 'Residencies',
      group: 'residencies',
      icon: SparkleIcon,
      type: 'array',
      of: [
        {
        type: 'residency',
        title: 'Residency',
        }
      ]
    }),
    defineField({
      name: 'teaching',
      title: 'Teaching',
      group: 'teaching',
      icon: SparkleIcon,
      type: 'array',
      of: [
        {
        type: 'teaching',
        title: 'Teaching',
        }
      ]
    }),
    defineField({
      name: 'education',
      title: 'Education',
      group: 'education',
      icon: SparkleIcon,
      type: 'array',
      of: [
        {
        type: 'education',
        title: 'Education',
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
