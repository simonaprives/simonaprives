const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "homePage"][0]{
    title,
    "slug": slug.current,
    videoUrl,
    mainImage
  }`

  const doc = await client.fetch(query).catch(err => { console.error(err); return null })
  if (!doc) return {}

  let posterImageUrl = null
  if (doc.mainImage) {
    try {
      posterImageUrl = builder.image(doc.mainImage).width(1920).url()
    } catch (err) {
      posterImageUrl = null
    }
  }

  return Object.assign({}, doc, { posterImageUrl })
}
