import { practicumSlides } from "../data/practicum-slides.data.js";

export function initPracticumSlideshow() {
  const root = document.getElementById("practicum-slideshow");
  if (!root) return;

  root.innerHTML = renderMarkup();

  const state = { index: 0 };
  const els = {
    slides: root.querySelectorAll(".slide-deck__slide"),
    dots: root.querySelectorAll(".slide-deck__dot"),
    counter: root.querySelector(".slide-deck__counter"),
    prevBtn: root.querySelector('[data-action="prev"]'),
    nextBtn: root.querySelector('[data-action="next"]'),
  };

  function goTo(index) {
    state.index = Math.min(Math.max(index, 0), practicumSlides.length - 1);
    els.slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === state.index)
    );
    els.dots.forEach((dot, i) =>
      dot.setAttribute("aria-current", String(i === state.index))
    );
    els.counter.textContent = `${state.index + 1} / ${practicumSlides.length}`;
    els.prevBtn.disabled = state.index === 0;
    els.nextBtn.disabled = state.index === practicumSlides.length - 1;
  }

  els.prevBtn.addEventListener("click", () => goTo(state.index - 1));
  els.nextBtn.addEventListener("click", () => goTo(state.index + 1));
  els.dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goTo(state.index + 1);
    if (event.key === "ArrowLeft") goTo(state.index - 1);
  });

  goTo(0);
  attachLazyFade(root);
}

function renderMarkup() {
  const slides = practicumSlides
    .map(
      (slide, i) => `
      <article class="slide-deck__slide${i === 0 ? " is-active" : ""}">
        <img
          class="slide-deck__image"
          src="${slide.image}"
          alt=""
          loading="lazy"
        />
        <div class="slide-deck__content">
          <h2 class="slide-deck__title">${slide.title}</h2>
          ${slide.body.map((p) => `<p class="slide-deck__paragraph">${p}</p>`).join("")}
        </div>
      </article>
    `
    )
    .join("");

  const dots = practicumSlides
    .map((_, i) => `<button class="slide-deck__dot" aria-label="Go to slide ${i + 1}"></button>`)
    .join("");

  return `
    <div class="slide-deck__viewport">
      ${slides}
    </div>
    <div class="slide-deck__nav">
      <button class="slide-deck__arrow" data-action="prev" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="slide-deck__dots">${dots}</div>
      <span class="slide-deck__counter"></span>
      <button class="slide-deck__arrow" data-action="next" aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  `;
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