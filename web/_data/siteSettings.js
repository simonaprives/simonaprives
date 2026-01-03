const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports = async function() {
  const query = groq`*[_id == "siteSettings"][0]{
    title,
    description,
    keywords,
    contact
  }`

  const doc = await client.fetch(query).catch(err => { 
    console.error(err) 
    return null 
  })
  
  return doc || {}
}
