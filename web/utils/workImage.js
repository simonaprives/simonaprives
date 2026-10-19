const imageUrlBuilder = require("@sanity/image-url");
const client = require("./sanityClient");

const builder = imageUrlBuilder(client);

function urls(image) {
  return {
    previewImageUrl: builder.image(image).width(800).url(),
    fullImageUrl: builder.image(image).width(1200).url(),
    presentImageUrl: builder.image(image).width(2400).url(),
  };
}

// Same crop and hotspot. Only the requested width changes.
function workImageUrls(image) {
  if (!image) return { previewImageUrl: null, fullImageUrl: null, presentImageUrl: null };
  try {
    return urls(image);
  } catch (err) {
    return { previewImageUrl: null, fullImageUrl: null, presentImageUrl: null };
  }
}

function presentUrl(image) {
  return workImageUrls(image).presentImageUrl;
}

module.exports = { workImageUrls, presentUrl };
