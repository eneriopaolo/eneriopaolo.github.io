/**
 * js/certificates.js
 * ------------------------------------------------------------------
 * Drives the Certificates section: an auto-advancing slideshow with
 * prev/next controls, a toggle to switch to a static grid, and a
 * lightbox for viewing any certificate at full size.
 * ------------------------------------------------------------------
 */
import { certificates } from "../data/certificates.data.js";

const AUTO_ADVANCE_MS = 3000;
const FADE_MS = 300;

export function initCertificates() {
  const root = document.getElementById("certificates-root");
  const toggleGroup = document.getElementById("certs-view-toggle");
  if (!root) return;

  root.innerHTML = renderMarkup();

  const state = {
    index: 0,
    view: "slideshow",
    timer: null,
  };

  const els = {
    slideshow: root.querySelector(".certs-slideshow"),
    grid: root.querySelector(".certs-grid"),
    slides: root.querySelectorAll(".certs-slideshow__slide"),
    dots: root.querySelectorAll(".certs-slideshow__dot"),
    caption: root.querySelector(".certs-slideshow__caption"),
    counter: root.querySelector(".certs-slideshow__counter"),
    prevBtn: root.querySelector('[data-action="prev"]'),
    nextBtn: root.querySelector('[data-action="next"]'),
    slideshowToggle: toggleGroup ? toggleGroup.querySelector('[data-view="slideshow"]') : null,
    gridToggle: toggleGroup ? toggleGroup.querySelector('[data-view="grid"]') : null,
  };

  function goTo(index) {
    state.index = (index + certificates.length) % certificates.length;
    els.slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === state.index)
    );
    els.dots.forEach((dot, i) =>
      dot.setAttribute("aria-current", String(i === state.index))
    );
    const current = certificates[state.index];
    const verifyLink = current.verifyUrl
      ? `<p class="certs-slideshow__verify-row"><a class="certs-slideshow__verify" href="${current.verifyUrl}" target="_blank" rel="noopener">Verify →</a></p>`
      : "";
    els.caption.innerHTML = `<h3>${current.title}</h3><p>${current.issuer} · ${current.date}</p>${verifyLink}`;
    if (els.counter) {
      els.counter.textContent = `${state.index + 1} / ${certificates.length}`;
    }
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    state.timer = setInterval(() => goTo(state.index + 1), AUTO_ADVANCE_MS);
  }

  function stopAutoAdvance() {
    if (state.timer) clearInterval(state.timer);
  }

  function setView(view) {
    if (state.view === view) return;
    state.view = view;

    const showEl = view === "slideshow" ? els.slideshow : els.grid;
    const hideEl = view === "slideshow" ? els.grid : els.slideshow;

    if (els.slideshowToggle) {
      els.slideshowToggle.setAttribute("aria-pressed", String(view === "slideshow"));
    }
    if (els.gridToggle) {
      els.gridToggle.setAttribute("aria-pressed", String(view === "grid"));
    }

    hideEl.classList.add("is-fading-out");
    window.setTimeout(() => {
      hideEl.hidden = true;
      hideEl.classList.remove("is-fading-out");
    }, FADE_MS);

    showEl.hidden = false;
    showEl.classList.add("is-fading-out");
    void showEl.offsetWidth;
    showEl.classList.remove("is-fading-out");

    if (view === "slideshow") {
      startAutoAdvance();
    } else {
      stopAutoAdvance();
    }
  }

  els.prevBtn.addEventListener("click", () => {
    goTo(state.index - 1);
    startAutoAdvance();
  });
  els.nextBtn.addEventListener("click", () => {
    goTo(state.index + 1);
    startAutoAdvance();
  });
  els.dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      goTo(i);
      startAutoAdvance();
    })
  );
  if (els.slideshowToggle) {
    els.slideshowToggle.addEventListener("click", () => setView("slideshow"));
  }
  if (els.gridToggle) {
    els.gridToggle.addEventListener("click", () => setView("grid"));
  }

  els.slideshow.addEventListener("mouseenter", stopAutoAdvance);
  els.slideshow.addEventListener("mouseleave", startAutoAdvance);

  root.querySelectorAll("[data-cert-index]").forEach((el) => {
    el.addEventListener("click", () => {
      const i = Number(el.dataset.certIndex);
      openLightbox(certificates[i]);
    });
  });

  // Verify links live inside elements that also carry data-cert-index
  // (the grid card), so their clicks must not bubble up and trigger
  // the lightbox as well.
  root.querySelectorAll(".cert-card__verify, .certs-slideshow__verify").forEach((el) => {
    el.addEventListener("click", (event) => event.stopPropagation());
  });

  goTo(0);
  els.grid.hidden = true;
  startAutoAdvance();
  initLightbox();
  attachLazyFade(root);
}

function renderMarkup() {
  const slides = certificates
    .map(
      (cert, i) => `
      <div class="certs-slideshow__slide${i === 0 ? " is-active" : ""}">
        <img
          src="${cert.image}"
          alt="${cert.title}"
          loading="lazy"
          data-cert-index="${i}"
        />
      </div>
    `
    )
    .join("");

  const dots = certificates
    .map((_, i) => `<button class="certs-slideshow__dot" aria-label="Go to certificate ${i + 1}"></button>`)
    .join("");

  const gridCards = certificates
    .map((cert, i) => {
      const verifyLink = cert.verifyUrl
        ? `<a class="cert-card__verify" href="${cert.verifyUrl}" target="_blank" rel="noopener">Verify →</a>`
        : "";
      return `
      <div class="cert-card" data-cert-index="${i}">
        <img src="${cert.image}" alt="${cert.title}" loading="lazy" />
        <div class="cert-card__label">
          <h3>${cert.title}</h3>
          <p>${cert.issuer} · ${cert.date}</p>
          ${verifyLink}
        </div>
      </div>
    `;
    })
    .join("");

  return `
    <div class="certs-slideshow">
      <div class="certs-slideshow__viewport">
        ${slides}
      </div>
      <div class="certs-slideshow__caption"></div>
      <div class="certs-slideshow__nav">
        <button data-action="prev" aria-label="Previous certificate">
          <img src="assets/icons/ui/chevron-left.svg" alt="" width="16" height="16" />
        </button>
        <div class="certs-slideshow__dots">${dots}</div>
        <span class="certs-slideshow__counter"></span>
        <button data-action="next" aria-label="Next certificate">
          <img src="assets/icons/ui/chevron-right.svg" alt="" width="16" height="16" />
        </button>
      </div>
    </div>

    <div class="certs-grid">
      ${gridCards}
    </div>
  `;
}

function openLightbox(cert) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.querySelector("img").src = cert.image;
  lightbox.querySelector("img").alt = cert.title;
  lightbox.querySelector(".lightbox__caption").textContent = `${cert.title} — ${cert.issuer}, ${cert.date}`;
  lightbox.hidden = false;
  lightbox.classList.add("is-fading-out");
  void lightbox.offsetWidth;
  lightbox.classList.remove("is-fading-out");
  lightbox.querySelector(".lightbox__close").focus();
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  function close() {
    if (lightbox.hidden) return;
    lightbox.classList.add("is-fading-out");
    window.setTimeout(() => {
      lightbox.hidden = true;
      lightbox.classList.remove("is-fading-out");
    }, FADE_MS);
  }

  lightbox.querySelector(".lightbox__close").addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
}

function attachLazyFade(container) {
  container.querySelectorAll("img[loading='lazy']").forEach((img) => {
    const reveal = () => img.classList.add("is-loaded");

    if (img.complete) {
      reveal();
    } else {
      img.addEventListener("load", reveal, { once: true });
      img.addEventListener("error", reveal, { once: true });
    }
  });
}