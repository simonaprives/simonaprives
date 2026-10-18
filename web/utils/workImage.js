const imageUrlBuilder = require("@sanity/image-url");
const client = require("./sanityClient");

const builder = imageUrlBuilder(client);

// Same crop and hotspot. Only the requested width changes, so a morph can
// start on the preview and swap to the sharper file after the snapshot.
function workImageUrls(image) {
  if (!image) return { previewImageUrl: null, fullImageUrl: null };
  try {
    return {
      previewImageUrl: builder.image(image).width(800).url(),
      fullImageUrl: builder.image(image).width(1200).url(),
    };
  } catch (err) {
    return { previewImageUrl: null, fullImageUrl: null };
  }
}

module.exports = { workImageUrls };
