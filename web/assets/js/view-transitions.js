(function () {
  var NAME = "work-image";
  var LIST_PATHS = { "/": true, "/exhibits": true, "/in-motion": true };
  var PAIR_KEY = "vt-pair";
  var clickedImg = null;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    upgradeAll();
    return;
  }

  function abs(url) {
    try {
      return new URL(url, window.location.href).href;
    } catch (err) {
      return url || "";
    }
  }

  function normalizePath(url) {
    var path = "";
    try {
      path = new URL(url, window.location.href).pathname;
    } catch (err) {
      return "";
    }
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return path;
  }

  function clearNames() {
    document.querySelectorAll("img.vt-thumb").forEach(function (img) {
      img.style.viewTransitionName = "none";
      img.style.removeProperty("view-transition-name");
    });
  }

  // Keep the snapshot on the same file the previous page painted.
  // Skip the swap if that file is no longer decoded, so we never snapshot a blank.
  function showPreview(img) {
    var preview = img.getAttribute("data-preview-src");
    if (!preview || abs(img.src) === abs(preview)) return;
    var cached = new Image();
    cached.src = preview;
    if (cached.complete && cached.naturalWidth) img.src = preview;
  }

  function upgradeImage(img) {
    var full = img.getAttribute("data-full-src");
    if (!full || abs(img.src) === abs(full) || img.dataset.vtHold === "1") return;
    var loader = new Image();
    loader.onload = function () {
      if (img.dataset.vtHold === "1") return;
      img.src = full;
    };
    loader.src = full;
  }

  function upgradeAll() {
    document.querySelectorAll("img[data-full-src]").forEach(upgradeImage);
  }

  function hold(img) {
    if (img) img.dataset.vtHold = "1";
  }

  function releaseAndUpgrade() {
    document.querySelectorAll("img[data-vt-hold]").forEach(function (img) {
      delete img.dataset.vtHold;
    });
    upgradeAll();
  }

  function nameImage(img) {
    if (!img) return;
    clearNames();
    showPreview(img);
    hold(img);
    img.style.viewTransitionName = NAME;
  }

  function imageMatchesPath(img, path) {
    var scope = img.closest("li, figure");
    if (!scope || !path) return false;
    var links = scope.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      if (normalizePath(links[i].href) === path) return true;
    }
    return false;
  }

  function findParticipant(path) {
    var imgs = document.querySelectorAll("img.vt-thumb[data-vt-name]");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.classList.contains("vt-thumb--hero")) continue;
      if (imageMatchesPath(img, path)) return img;
    }
    return null;
  }

  function heroImage() {
    return document.querySelector("img.vt-thumb--hero[data-vt-name]");
  }

  function remember(img) {
    if (!img || img.classList.contains("vt-thumb--hero")) return;
    try {
      sessionStorage.setItem(
        PAIR_KEY,
        JSON.stringify({
          id: img.getAttribute("data-vt-name"),
          role: img.getAttribute("data-vt-role") || "grid",
        })
      );
    } catch (err) {}
  }

  function imageFromMemory(fromPath) {
    var raw = "";
    try {
      raw = sessionStorage.getItem(PAIR_KEY) || "";
    } catch (err) {
      return null;
    }
    if (!raw || !fromPath) return null;
    var pair;
    try {
      pair = JSON.parse(raw);
    } catch (err) {
      return null;
    }
    if (!pair || !pair.id) return null;

    var selector = 'img[data-vt-name="' + CSS.escape(pair.id) + '"]';
    var imgs = document.querySelectorAll(selector);
    var fallback = null;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.classList.contains("vt-thumb--hero")) continue;
      if (!imageMatchesPath(img, fromPath)) continue;
      if (pair.role && img.getAttribute("data-vt-role") === pair.role) return img;
      if (!fallback) fallback = img;
    }
    return fallback;
  }

  function fromUrl() {
    var activation = window.navigation && window.navigation.activation;
    if (activation && activation.from && activation.from.url) return activation.from.url;
    return "";
  }

  function imageForLink(link) {
    var scope = link.closest("li, figure");
    if (!scope) return null;
    return scope.querySelector("img.vt-thumb[data-vt-name]");
  }

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("a[href]");
      clickedImg = link ? imageForLink(link) : null;
    },
    true
  );

  window.addEventListener("pageswap", function (event) {
    if (!event.viewTransition) return;
    clearNames();

    var dest = event.activation && event.activation.entry
      ? normalizePath(event.activation.entry.url)
      : "";
    var img = clickedImg && imageMatchesPath(clickedImg, dest) ? clickedImg : null;
    if (!img && dest) img = findParticipant(dest);
    if (!img && LIST_PATHS[dest]) img = heroImage();
    if (img) {
      nameImage(img);
      remember(img);
    }

    event.viewTransition.finished.finally(clearNames);
  });

  window.addEventListener("pagereveal", function (event) {
    if (!event.viewTransition) {
      upgradeAll();
      return;
    }

    clearNames();
    var hero = heroImage();
    if (hero) {
      nameImage(hero);
    } else {
      var from = normalizePath(fromUrl());
      nameImage(imageFromMemory(from) || findParticipant(from));
    }

    event.viewTransition.finished.finally(function () {
      clearNames();
      releaseAndUpgrade();
    });
  });

  if (!("onpagereveal" in window)) upgradeAll();
})();
