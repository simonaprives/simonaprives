const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports = async function() {
  const query = groq`*[_type == "artworksInMotion"]{
    videos[]{
      title,
      "slug": slug.current,
      description,
      videoUrl,
      mainImage
    }
  }`

  const docs = await client.fetch(query).catch(err => { 
    console.error(err)
    return []
  })

  // Flatten the videos arrays from all artworksInMotion documents
  const allVideos = docs.reduce((acc, doc) => {
    if (doc.videos) {
      return acc.concat(doc.videos)
    }
    return acc
  }, [])

  // Filter out items without slugs and add preview images
  return allVideos
    .filter(video => video.slug)
    .map(video => {
      let previewImageUrl = null
      if (video.mainImage) {
        try {
          previewImageUrl = builder.image(video.mainImage).width(800).url()
        } catch (err) {
          previewImageUrl = null
        }
      }
      return Object.assign({}, video, { previewImageUrl })
    })
}
