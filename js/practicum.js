/**
 * js/practicum.js
 * ------------------------------------------------------------------
 * Renders the centered Practicum summary (logo, org info, two
 * paragraphs) into #practicum-summary on practicum.html, from
 * data/practicum.js. For the detailed slideshow, see
 * js/practicum-slides.js instead.
 * ------------------------------------------------------------------
 */
import { practicumSummary } from "../data/practicum.data.js";

export function initPracticumSummary() {
  const root = document.getElementById("practicum-summary");
  if (!root) return;

  const paragraphs = practicumSummary.summary
    .map((p) => `<p class="practicum-summary__paragraph">${p}</p>`)
    .join("");

  root.innerHTML = `
    <img
      class="practicum-summary__logo"
      src="${practicumSummary.logo}"
      alt="${practicumSummary.company} logo"
      width="120"
      height="120"
    />
    <h1 class="practicum-summary__company">${practicumSummary.company}</h1>
    <p class="practicum-summary__meta">
      ${practicumSummary.position} &middot; ${practicumSummary.location} &middot; ${practicumSummary.duration}
    </p>
    <div class="practicum-summary__text">${paragraphs}</div>
    <a class="btn btn--primary" href="practicum-journey.html">
      View my Practicum Journey
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  `;
}