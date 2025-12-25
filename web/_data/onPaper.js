const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "artworkOnPaper"][0]{
    title,
    "slug": slug.current,
    description,
    mainImage,
    images1[]{
      title,
      mainImage,
      description,
      dimensions
    }
  }`

  const doc = await client.fetch(query).catch(err => { console.error(err); return null })
  if (!doc) return {}

  let previewImageUrl = null
  if (doc.mainImage) {
    try {
      previewImageUrl = builder.image(doc.mainImage).width(800).url()
    } catch (err) {
      previewImageUrl = null
    }
  }

  return Object.assign({}, doc, { previewImageUrl })
}
