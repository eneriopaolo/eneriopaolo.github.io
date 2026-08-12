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
      <img src="assets/icons/ui/link-arrow.svg" alt="" width="16" height="16" />
    </a>
  `;
}