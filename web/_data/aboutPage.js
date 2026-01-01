const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../utils/sanityClient')
const serializers = require('../utils/serializers')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "aboutPage"][0]{
    title,
    "slug": slug.current,
    deck,
    mainImage,
    bio
  }`

  const doc = await client.fetch(query).catch(err => { console.error(err); return null })
  if (!doc) return {}

  const bio = doc.bio ? BlocksToMarkdown(doc.bio, { serializers, ...client.config() }) : null

  let mainImageUrl = null
  let mainImageCaption = null
  if (doc.mainImage) {
    try {
      mainImageUrl = builder.image(doc.mainImage).width(1200).url()
      mainImageCaption = doc.mainImage.caption || null
    } catch (err) {
      mainImageUrl = null
    }
  }

  return Object.assign({}, doc, { bio, mainImageUrl, mainImageCaption })
}
