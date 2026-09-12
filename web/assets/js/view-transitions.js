(function () {
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function canUseViewTransitions() {
    return (
      typeof document.startViewTransition === "function" ||
      CSS.supports("view-transition-name", "none")
    );
  }

  if (prefersReducedMotion() || !canUseViewTransitions()) {
    return;
  }

  function clearAllVtNames() {
    document.querySelectorAll("[data-vt-name]").forEach(function (el) {
      el.style.viewTransitionName = "none";
      el.style.removeProperty("view-transition-name");
    });
  }

  function activateVtName(img) {
    var name = img.getAttribute("data-vt-name");
    if (!name) return;
    clearAllVtNames();
    img.style.viewTransitionName = name;
  }

  function findVtThumb(fromEl) {
    if (!fromEl) return null;
    if (fromEl.matches && fromEl.matches("[data-vt-name]")) return fromEl;

    var link = fromEl.closest ? fromEl.closest("a[href]") : null;
    if (link) {
      var inLink = link.querySelector("[data-vt-name]");
      if (inLink) return inLink;
    }

    var card = fromEl.closest ? fromEl.closest("li, figure, .exhibits-grid > *") : null;
    if (card) {
      var inCard = card.querySelector("[data-vt-name]");
      if (inCard) return inCard;
    }

    return null;
  }

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("a[href]");
      if (!link) return;

      var img = findVtThumb(event.target);
      if (!img) img = findVtThumb(link);
      if (!img) return;

      activateVtName(img);
    },
    true
  );
})();
