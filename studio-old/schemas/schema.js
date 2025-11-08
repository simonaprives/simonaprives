// Schema types collector (v3-friendly export)

// document schemas
import author from './documents/author'
import category from './documents/category'
import post from './documents/post'
import siteSettings from './documents/siteSettings'

// Object types
import bodyPortableText from './objects/bodyPortableText'
import bioPortableText from './objects/bioPortableText'
import excerptPortableText from './objects/excerptPortableText'
import mainImage from './objects/mainImage'
import authorReference from './objects/authorReference'

// Export a `types` array so a v3 `sanity.config.js` can import it.
// We explicitly list the local types here. If you use additional plugin
// types, import and include them as needed.
export const types = [
  siteSettings,
  post,
  category,
  author,
  mainImage,
  authorReference,
  bodyPortableText,
  bioPortableText,
  excerptPortableText
]

export default { types }
