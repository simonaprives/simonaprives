const { presentUrl } = require("./workImage");

function vimeoId(url) {
  if (!url) return "";
  var match = String(url).match(/(\d{5,})/);
  return match ? match[1] : "";
}

function imageSlide(image, label) {
  var src = presentUrl(image);
  if (!src) return null;
  return { type: "image", src: src, label: label || "" };
}

function exhibitGallery(doc) {
  if (!doc || !doc.slug) return null;
  var slides = [];
  var mainRef = doc.mainImage && doc.mainImage.asset && doc.mainImage.asset._ref;
  var hero = imageSlide(doc.mainImage, doc.title);
  if (hero) slides.push(hero);
  (doc.images || []).forEach(function (image, index) {
    if (!image || !image.asset) return;
    if (mainRef && image.asset._ref === mainRef) return;
    var slide = imageSlide(image, image.alt || image.caption || "Slide " + (index + 1));
    if (slide) slides.push(slide);
  });
  if (!slides.length) return null;
  return {
    id: "exhibits/" + doc.slug,
    title: doc.title || doc.slug,
    kind: "image",
    href: "/exhibits/" + doc.slug + "/",
    slides: slides,
  };
}

function onPaperGallery(doc) {
  if (!doc) return null;
  var slides = [];
  (doc.images1 || []).forEach(function (artwork, index) {
    var slide = imageSlide(
      artwork && artwork.mainImage,
      (artwork && (artwork.title || artwork.description)) || "Slide " + (index + 1)
    );
    if (slide) slides.push(slide);
  });
  if (!slides.length) return null;
  return {
    id: "on-paper",
    title: doc.title || "On Paper",
    kind: "image",
    href: "/on-paper/",
    slides: slides,
  };
}

function motionGallery(doc) {
  if (!doc || !doc.slug) return null;
  var slides = [];
  var hasVideo = false;
  var hero = imageSlide(doc.mainImage, doc.title);
  if (hero) slides.push(hero);
  (doc.videos || []).forEach(function (video, index) {
    var id = vimeoId(video && video.videoUrl);
    var label = (video && video.title) || "Slide " + (index + 1);
    if (id) {
      hasVideo = true;
      slides.push({ type: "video", vimeoId: id, label: label });
      return;
    }
    var slide = imageSlide(video && video.mainImage, label);
    if (slide) slides.push(slide);
  });
  if (!slides.length) return null;
  return {
    id: "in-motion/" + doc.slug,
    title: doc.title || doc.slug,
    kind: hasVideo ? "video" : "image",
    href: "/in-motion/" + doc.slug + "/",
    slides: slides,
  };
}

function buildPresentCatalog(exhibits, inMotion, onPaper) {
  var galleries = [];
  (exhibits || []).forEach(function (doc) {
    var gallery = exhibitGallery(doc);
    if (gallery) galleries.push(gallery);
  });
  var paper = onPaperGallery(onPaper);
  if (paper) galleries.push(paper);
  (inMotion || []).forEach(function (doc) {
    var gallery = motionGallery(doc);
    if (gallery) galleries.push(gallery);
  });
  return JSON.stringify({ galleries: galleries });
}

module.exports = { buildPresentCatalog };
