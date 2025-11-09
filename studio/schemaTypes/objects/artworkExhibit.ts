export default {
  name: 'artworkExhibit',
  type: 'object',
  title: 'exhibition',
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
}