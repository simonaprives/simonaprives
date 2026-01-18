import {defineField, defineType} from 'sanity'
import ReadOnlyMainImage from '../components/ReadOnlyMainImage'
import { ImagesIcon } from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'artworksInMotion',
  title: 'In Motion',
  type: 'document',
  groups: [
    {
      name: 'gallery',
      title: 'Gallery'
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'mainImage',
    },
    prepare({title = 'No title', slug = {}, media}: any) {
      const path = `/${slug?.current || ''}`
      return {
        title,
        media,
        subtitle: path,
      }
    },
  },
  options: {
    // Enable Presentation Tool for this document type
    liveEdit: false,
  },
  // Define the preview URL for Presentation Tool
  __experimental_actions: ['create', 'update', 'delete', 'publish'],
  // @ts-ignore
  locate: (params: any) => {
    if (params?.document?.slug?.current) {
      return {
        locations: [
          {
            title: 'View In Motion',
            href: `/in-motion/${params.document.slug.current}`,
          },
        ],
      }
    }
    return null
  },
  fields: [
    // Add the orderRank field required by the orderable-document-list plugin
    orderRankField({ type: 'artworkExhibits' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'mainImage',
      readOnly: true,
      hidden: false,
      description:
        'Read-only. This reflects the first video thumbnail in the Gallery — edit the Gallery to change the main image.',
      components: {input: ReadOnlyMainImage},
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
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'videos',
      title: 'Gallery',
      group: 'gallery',
      icon: ImagesIcon,
      type: 'array',
      of: [
        {
          type: 'artworkInMotionItem',
          title: 'Video'
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'mainImage',
    },
    prepare({title = 'No title', slug = {}, media}: any) {
      const path = `/${slug?.current || ''}`
      return {
        title,
        media,
        subtitle: path,
      }
    },
  },
  // Optional: make the plugin's ordering available to other desks or queries
  orderings: [orderRankOrdering],
})