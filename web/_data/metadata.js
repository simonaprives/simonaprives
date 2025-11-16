const groq = require('groq')
const client = require('../utils/sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

module.exports =  async function() {
  const data = await client.fetch(groq`
    *[_id == "siteSettings"]{
      ...,
      author->
    }[0]
  `)

  // Helper to build an image URL from a Sanity image object/ref.
  // Usage in templates: `{{ metadata.imageUrl(pageImage, 1200) }}`
  function imageUrl (imageObj, width = 1200) {
    if (!imageObj) return null
    try {
      return builder.image(imageObj).width(width).url()
    } catch (err) {
      return null
    }
  }

  // Expose a default previewImageUrl if the site settings include one.
  // Some site schemas may not include a site-level image; keep null otherwise.
  let previewImageUrl = null
  if (data && data.mainImage) {
    previewImageUrl = imageUrl(data.mainImage, 1200)
  }

  return Object.assign({}, data, {
    imageUrl,
    previewImageUrl
  })
}
