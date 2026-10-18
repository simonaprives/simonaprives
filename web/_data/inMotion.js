const groq = require('groq')
const client = require('../utils/sanityClient')
const { workImageUrls } = require('../utils/workImage')

module.exports = async function() {
  const query = groq`*[_type == "artworksInMotion"] | order(orderRank) {
    title,
    "slug": slug.current,
    description,
    mainImage,
    "imageWidth": mainImage.asset->metadata.dimensions.width,
    "imageHeight": mainImage.asset->metadata.dimensions.height,
    videos[]{
      title,
      "slug": slug.current,
      description,
      videoUrl,
      mainImage
    }
  }`

  const docs = await client.fetch(query).catch(err => { console.error(err); return [] })

  return docs.map(doc => Object.assign({}, doc, workImageUrls(doc.mainImage)))
}
