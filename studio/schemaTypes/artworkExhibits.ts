import {defineField, defineType} from 'sanity'
import ReadOnlyMainImage from '../components/ReadOnlyMainImage'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'artworkExhibits',
  title: 'Exhibits',
  type: 'document',
  groups: [
    {
      name: 'gallery',
      title: 'Gallery'
    }
  ],
  fields: [
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
      description:
        'Read-only. This reflects the first image in the Images array — edit the Images array to change the gallery main image.',
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
      name: 'venue',
      title: 'Venue',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'photoCredit',
      title: 'Photo Credit',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Gallery',
      group: 'gallery',
      icon: ImagesIcon,
      type: 'array',
      of: [
        {
        type: 'mainImage',
        title: 'Image',
        // provide an explicit preview for array items so thumbnails and labels render reliably
        preview: {
          select: {
            alt: 'alt',
            caption: 'caption',
            assetRef: 'asset._ref',
            imageUrl: 'asset.url',
          },
          prepare(selection: any) {
            const {alt, caption, assetRef, imageUrl} = selection || {}
            return {
              title: alt || 'Image',
              subtitle: caption || undefined,
              media: assetRef ? ({asset: {_ref: assetRef}} as any) : undefined,
            }
          }
        }
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
})
