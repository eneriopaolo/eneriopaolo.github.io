/**
 * js/main.js
 * ------------------------------------------------------------------
 * Entry point for index.html (the Home page). Imports and initializes
 * each module. Kept deliberately thin — all actual logic lives in the
 * per-feature modules (typing.js, projects.js, skills.js,
 * certificates.js, navigation.js, scroll-reveal.js).
 * ------------------------------------------------------------------
 */
import { TypingEffect } from "./typing.js";
import { initNavigation } from "./navigation.js";
import { initProjects } from "./projects.js";
import { initSkills } from "./skills.js";
import { initCertificates } from "./certificates.js";
import { initScrollReveal } from "./scroll-reveal.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initProjects();
  initSkills();
  initCertificates();
  initScrollReveal();

  const typedEl = document.getElementById("typed-role");
  if (typedEl) {
    new TypingEffect(typedEl, ["Software Engineer", "Machine Learning Specialist", "Full Stack Developer"]);
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});