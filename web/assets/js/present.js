(function () {
  var carousels = document.querySelectorAll("section.carousel");
  if (!carousels.length) return;

  var STORAGE = "present-settings";
  var catalogPromise = null;
  var host = null;
  var slides = [];
  var index = 0;
  var timer = 0;
  var token = 0;
  var mutedFallback = false;
  var playbackToken = 0;

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) || {};
    } catch (err) {
      return {};
    }
  }

  function writeSettings(next) {
    var current = readSettings();
    Object.keys(next).forEach(function (key) {
      current[key] = next[key];
    });
    localStorage.setItem(STORAGE, JSON.stringify(current));
  }

  function vimeoId(url) {
    var match = String(url || "").match(/(\d{5,})/);
    return match ? match[1] : "";
  }

  function slidesFrom(carousel) {
    return Array.prototype.map
      .call(carousel.querySelectorAll(".carousel__slide"), function (figure, slideIndex) {
        var label = figure.getAttribute("data-label") || "Slide " + (slideIndex + 1);
        var img = figure.querySelector("img");
        var iframe = figure.querySelector("iframe");
        if (img) {
          var src = img.getAttribute("data-present-src");
          if (!src) {
            src = (img.currentSrc || img.getAttribute("src") || "").replace(/([?&])w=\d+/, "$1w=2400");
          }
          return src ? { type: "image", src: src, label: label } : null;
        }
        if (iframe) {
          var id = vimeoId(iframe.getAttribute("src"));
          return id ? { type: "video", vimeoId: id, label: label } : null;
        }
        return null;
      })
      .filter(Boolean);
  }

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch("/present/catalog.json")
        .then(function (response) {
          if (!response.ok) throw new Error("catalog");
          return response.json();
        })
        .catch(function () {
          return { galleries: [] };
        });
    }
    return catalogPromise;
  }

  function videoMode(id) {
    var modes = readSettings().videoMode || {};
    return modes[id] === "loop" ? "loop" : "advance";
  }

  function setVideoMode(id, mode) {
    var modes = readSettings().videoMode || {};
    modes[id] = mode;
    writeSettings({ videoMode: modes });
  }

  function dwellMs() {
    var dwell = Number(readSettings().dwell);
    if (!dwell || dwell < 2) dwell = 8;
    if (dwell > 60) dwell = 60;
    return dwell * 1000;
  }

  function buildDialog() {
    var dialog = document.createElement("dialog");
    dialog.className = "present";
    dialog.setAttribute("aria-label", "Slideshow");
    dialog.tabIndex = -1;
    dialog.innerHTML =
      '<div class="present__stage"></div>' +
      '<div class="present__edge">' +
      '<div class="present__controls">' +
      '<label>Show <select data-source>' +
      '<option value="current">This gallery</option>' +
      '<option value="gallery">Another gallery</option>' +
      '<option value="images">All image galleries</option>' +
      '<option value="videos">All video galleries</option>' +
      "</select></label>" +
      '<label data-gallery-label hidden>Gallery <select data-gallery></select></label>' +
      '<label>Advance <select data-advance>' +
      '<option value="manual">Manual</option>' +
      '<option value="auto">Auto</option>' +
      "</select></label>" +
      '<label data-dwell-label hidden>Seconds <input data-dwell type="number" min="2" max="60" value="8"></label>' +
      '<label data-video-label hidden>This video <select data-video-mode>' +
      '<option value="loop">Loop</option>' +
      '<option value="advance">Advance when it ends</option>' +
      "</select></label>" +
      '<button type="button" data-close>Close</button>' +
      "</div></div>" +
      '<button type="button" class="present__nav present__nav--prev" data-prev><img src="/assets/images/icon-arrow-left.svg" alt="Previous"></button>' +
      '<button type="button" class="present__nav present__nav--next" data-next><img src="/assets/images/icon-arrow-right.svg" alt="Next"></button>';
    document.body.appendChild(dialog);
    return dialog;
  }

  var dialog = buildDialog();
  var stage = dialog.querySelector(".present__stage");
  var sourceSelect = dialog.querySelector("[data-source]");
  var galleryLabel = dialog.querySelector("[data-gallery-label]");
  var gallerySelect = dialog.querySelector("[data-gallery]");
  var advanceSelect = dialog.querySelector("[data-advance]");
  var dwellLabel = dialog.querySelector("[data-dwell-label]");
  var dwellInput = dialog.querySelector("[data-dwell]");
  var videoLabel = dialog.querySelector("[data-video-label]");
  var videoSelect = dialog.querySelector("[data-video-mode]");

  function clearTimer() {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  }

  function post(frame, method, value) {
    if (!frame.contentWindow) return;
    var message = { method: method };
    if (value !== undefined) message.value = value;
    frame.contentWindow.postMessage(message, "https://player.vimeo.com");
  }

  function showSlide(direction) {
    clearTimer();
    token += 1;
    videoLabel.hidden = true;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!slides.length) {
      stage.replaceChildren();
      var empty = document.createElement("p");
      empty.className = "present__empty";
      empty.textContent = "Nothing to show";
      stage.appendChild(empty);
      return;
    }
    index = (index + slides.length) % slides.length;
    var slide = slides[index];
    var pane = document.createElement("div");
    pane.className = "present__slide present__slide--current";
    if (slide.type === "video") {
      videoLabel.hidden = false;
      videoSelect.value = videoMode(slide.vimeoId);
      var frame = document.createElement("iframe");
      frame.src =
        "https://player.vimeo.com/video/" +
        slide.vimeoId +
        "?autoplay=1&api=1&title=0&byline=0&portrait=0";
      frame.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");
      frame.title = slide.label || "Video";
      pane.appendChild(frame);
    } else {
      var img = document.createElement("img");
      img.alt = slide.label || "";
      img.src = slide.src;
      pane.appendChild(img);
      if (readSettings().advance === "auto") {
        timer = window.setTimeout(function () {
          go(1);
        }, dwellMs());
      }
    }
    var outgoing = stage.querySelector(".present__slide");
    if (!direction || reduce || !outgoing) {
      stage.replaceChildren(pane);
      return;
    }
    outgoing.classList.remove("present__slide--current");
    pane.style.transform = direction > 0 ? "translateX(100%)" : "translateX(-100%)";
    stage.appendChild(pane);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pane.style.transform = "translateX(0)";
        outgoing.style.transform = direction > 0 ? "translateX(-100%)" : "translateX(100%)";
      });
    });
    window.setTimeout(function () {
      if (outgoing.parentNode === stage) outgoing.remove();
    }, 450);
  }

  function go(step) {
    index += step;
    showSlide(step);
  }

  function collect(catalog) {
    var source = sourceSelect.value;
    if (source === "gallery") {
      var match = (catalog.galleries || []).filter(function (gallery) {
        return gallery.id === gallerySelect.value;
      })[0];
      return match ? match.slides.slice() : [];
    }
    if (source === "images" || source === "videos") {
      var kind = source === "images" ? "image" : "video";
      return (catalog.galleries || [])
        .filter(function (gallery) {
          return gallery.kind === kind;
        })
        .reduce(function (list, gallery) {
          return list.concat(gallery.slides);
        }, []);
    }
    return slidesFrom(host);
  }

  function fillGalleries(catalog) {
    gallerySelect.replaceChildren();
    (catalog.galleries || []).forEach(function (gallery) {
      var option = document.createElement("option");
      option.value = gallery.id;
      option.textContent = gallery.title;
      gallerySelect.appendChild(option);
    });
    var saved = readSettings().galleryId;
    if (saved && gallerySelect.querySelector('option[value="' + CSS.escape(saved) + '"]')) {
      gallerySelect.value = saved;
    }
  }

  function syncControls() {
    var prefs = readSettings();
    sourceSelect.value = prefs.source || "current";
    advanceSelect.value = prefs.advance === "auto" ? "auto" : "manual";
    dwellInput.value = String(Math.round(dwellMs() / 1000));
    galleryLabel.hidden = sourceSelect.value !== "gallery";
    dwellLabel.hidden = advanceSelect.value !== "auto";
  }

  function restart() {
    index = 0;
    loadCatalog().then(function (catalog) {
      slides = collect(catalog);
      showSlide();
    });
  }

  function lockPage() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function unlockPage() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function open(carousel) {
    host = carousel;
    mutedFallback = false;
    syncControls();
    lockPage();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.focus();
    if (dialog.requestFullscreen) {
      dialog.requestFullscreen().catch(function () {});
    }
    loadCatalog().then(function (catalog) {
      fillGalleries(catalog);
      slides = collect(catalog);
      index = 0;
      showSlide();
    });
  }

  function close() {
    if (!dialog.open) return;
    clearTimer();
    token += 1;
    stage.replaceChildren();
    unlockPage();
    if (document.fullscreenElement === dialog && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
    dialog.close();
  }

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) close();
  });

  dialog.addEventListener("close", function () {
    clearTimer();
    token += 1;
    stage.replaceChildren();
    unlockPage();
  });

  dialog.addEventListener("cancel", function () {
    if (document.fullscreenElement === dialog && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  });

  dialog.addEventListener("keydown", function (event) {
    var tag = event.target.tagName;
    if (tag === "SELECT" || tag === "INPUT") return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  });

  sourceSelect.addEventListener("change", function () {
    writeSettings({ source: sourceSelect.value });
    syncControls();
    restart();
  });

  gallerySelect.addEventListener("change", function () {
    writeSettings({ galleryId: gallerySelect.value, source: "gallery" });
    restart();
  });

  advanceSelect.addEventListener("change", function () {
    writeSettings({ advance: advanceSelect.value });
    syncControls();
    showSlide();
  });

  dwellInput.addEventListener("change", function () {
    var dwell = Number(dwellInput.value);
    if (!dwell || dwell < 2) dwell = 2;
    if (dwell > 60) dwell = 60;
    dwellInput.value = String(dwell);
    writeSettings({ dwell: dwell });
    if (readSettings().advance === "auto") showSlide();
  });

  videoSelect.addEventListener("change", function () {
    var slide = slides[index];
    if (!slide || slide.type !== "video") return;
    setVideoMode(slide.vimeoId, videoSelect.value);
    var frame = stage.querySelector(".present__slide--current iframe");
    if (frame) post(frame, "setLoop", videoSelect.value === "loop");
  });

  dialog.querySelector("[data-prev]").addEventListener("click", function () {
    go(-1);
  });
  dialog.querySelector("[data-next]").addEventListener("click", function () {
    go(1);
  });
  dialog.querySelector("[data-close]").addEventListener("click", close);

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://player.vimeo.com") return;
    var data = event.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        return;
      }
    }
    if (!data) return;
    var frame = stage.querySelector(".present__slide--current iframe");
    if (!frame || event.source !== frame.contentWindow) return;
    var slide = slides[index];
    if (!slide || slide.type !== "video") return;
    if (data.event === "ready") {
      post(frame, "addEventListener", "finish");
      post(frame, "addEventListener", "ended");
      post(frame, "addEventListener", "play");
      post(frame, "addEventListener", "playProgress");
      post(frame, "setLoop", videoMode(slide.vimeoId) === "loop");
      if (mutedFallback) post(frame, "setMuted", true);
      post(frame, "play");
      window.setTimeout(function () {
        if (playbackToken === token) return;
        var current = stage.querySelector(".present__slide--current iframe");
        if (!current || current !== frame) return;
        mutedFallback = true;
        post(frame, "setMuted", true);
        post(frame, "play");
      }, 1500);
    }
    if (data.event === "play" || data.event === "playProgress") playbackToken = token;
    if (data.event === "finish" || data.event === "ended") {
      if (videoMode(slide.vimeoId) === "advance") go(1);
    }
    if (data.event === "error" && !mutedFallback) {
      mutedFallback = true;
      post(frame, "setMuted", true);
      post(frame, "play");
    }
  });

  Array.prototype.forEach.call(carousels, function (carousel) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "present-launch";
    button.setAttribute("aria-label", "Present");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">' +
      '<path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
    var article = carousel.closest("article");
    var heading = article && article.querySelector("h1");
    if (heading) {
      var row = document.createElement("div");
      row.className = "present-heading";
      heading.before(row);
      row.append(heading, button);
    } else {
      carousel.insertAdjacentElement("beforebegin", button);
    }
    button.addEventListener("click", function () {
      open(carousel);
    });
  });
})();
