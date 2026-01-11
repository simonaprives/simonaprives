const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "artworkExhibits"] | order(orderRank) {
    title,
    "slug": slug.current,
    description,
    venue,
    location,
    photoCredit,
    mainImage,
    images,
    relatedArtwork
  }`

  const docs = await client.fetch(query).catch(err => { console.error(err); return [] })

  // Add preview image URLs
  return docs.map(doc => {
    let previewImageUrl = null
    if (doc.mainImage) {
      try {
        previewImageUrl = builder.image(doc.mainImage).width(800).url()
      } catch (err) {
        previewImageUrl = null
      }
    }
    return Object.assign({}, doc, { previewImageUrl })
  })
}
