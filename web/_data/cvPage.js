const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports = async function() {
  const query = groq`*[_type == "cv"][0]{
    title,
    "slug": slug.current,
    exhibitions[]{
      ExhibitionYear,
      title,
      galleryName,
      location,
      solo,
      "exhibitSlug": exhibitReference->slug.current
    },
    residencies[]{
      residencyYear,
      title,
      location
    },
    teaching[]{
      schoolName,
      title
    },
    education[]{
      schoolName,
      degree
    }
  }`

  const doc = await client.fetch(query).catch(err => { console.error(err); return null })
  if (!doc) return {}

  // Sort each section by year (descending)
  if (doc.exhibitions) {
    doc.exhibitions = doc.exhibitions.sort((a, b) => (b.ExhibitionYear || 0) - (a.ExhibitionYear || 0))
  }
  if (doc.residencies) {
    doc.residencies = doc.residencies.sort((a, b) => (b.residencyYear || 0) - (a.residencyYear || 0))
  }

  return doc
}
