const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('./sanityClient.js')
const serializers = require('./serializers')
const imageUrlBuilder = require('@sanity/image-url')

const builder = imageUrlBuilder(client)

function generatePost (post) {
  const body = BlocksToMarkdown(post.body, { serializers, ...client.config() })

  let previewImageUrl = null
  if (post && post.mainImage) {
    try {
      previewImageUrl = builder.image(post.mainImage).width(1200).url()
    } catch (err) {
      previewImageUrl = null
    }
  }

  return Object.assign({}, post, {
    body,
    previewImageUrl
  })
}

async function getPosts () {
  const filter = groq`*[_type == "post" && defined(slug) && publishedAt < now()]`
  const projection = groq`{
    _id,
    publishedAt,
    title,
    mainImage,
    slug,
    body[]{
      ...,
      children[]{
        ...,
        // Join inline reference
        _type == "authorReference" => {
          // check /studio/documents/authors.js for more fields
          "name": @.author->name,
          "slug": @.author->slug
        }
      }
    },
    "authors": authors[].author->
  }`
  const order = `| order(publishedAt desc)`
  const query = [filter, projection, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const preparePosts = docs.map(generatePost)
  return preparePosts
}

module.exports = getPosts
