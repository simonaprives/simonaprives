const sanityClient = require("@sanity/client");

/**
 * May break in certain build tools
 * if ../studio is not accessible
 */
const { api } = require('../../studio/sanity.json')

/**
 * Set manually. Find configuration in
 * studio/sanity.json or on manage.sanity.io
 */

/*
const config = {
  projectId: 'anokeucs',
  dataset: 'eleventy',
  useCdn: true
}
*/

const previewMode = process.env.ELEVENTY_ENV === 'preview'

module.exports = sanityClient({
  ...api, 
  useCdn: !previewMode,
  perspective: previewMode ? 'previewDrafts' : 'published',
  token: previewMode ? process.env.SANITY_READ_TOKEN : undefined,
});
