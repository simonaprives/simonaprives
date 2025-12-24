const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "biolinks"][0]{
    title,
    "slug": slug.current,
    mainImage,
    biolinks[]{
      title,
      url
    }
  }`

  const doc = await client.fetch(query).catch(err => { console.error(err); return null })
  if (!doc) return {}

  let mainImageUrl = null
  if (doc.mainImage) {
    try {
      mainImageUrl = builder.image(doc.mainImage).width(1200).url()
    } catch (err) {
      mainImageUrl = null
    }
  }

  return Object.assign({}, doc, { mainImageUrl })
}
