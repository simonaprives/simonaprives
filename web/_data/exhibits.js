const groq = require('groq')
const client = require('../utils/sanityClient')
const { workImageUrls } = require('../utils/workImage')

module.exports = async function() {
  const query = groq`*[_type == "artworkExhibits"] | order(orderRank) {
    title,
    "slug": slug.current,
    description,
    venue,
    location,
    photoCredit,
    mainImage,
    "imageWidth": mainImage.asset->metadata.dimensions.width,
    "imageHeight": mainImage.asset->metadata.dimensions.height,
    images,
    relatedInMotion->{
      title,
      "slug": slug.current
    }
  }`

  const docs = await client.fetch(query).catch(err => { console.error(err); return [] })

  return docs.map(doc => Object.assign({}, doc, workImageUrls(doc.mainImage)))
}
