const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "artworksInMotion" && _id == "artworksInMotion"][0]{
    title,
    "slug": slug.current,
    description,
    mainImage,
    videos[]{
      title,
      description,
      videoUrl,
      mainImage
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
