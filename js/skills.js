/**
 * js/skills.js
 * ------------------------------------------------------------------
 * Renders skill categories into #skills-grid from data/skills.js.
 * Each skill renders as a fixed-size square tile: icon centered on
 * top, label centered underneath.
 * ------------------------------------------------------------------
 */
import { skillCategories } from "../data/skills.data.js";

function renderTile({ name, icon }) {
  return `
    <div class="skill-tile">
      <img class="skill-tile__icon" src="${icon}" alt="" loading="lazy" width="36" height="36" />
      <span class="skill-tile__label">${name}</span>
    </div>
  `;
}

function renderCategory({ category, items }) {
  const tiles = items.map(renderTile).join("");

  return `
    <div class="skill-category">
      <h3 class="skill-category__name">${category}</h3>
      <div class="skill-badges">${tiles}</div>
    </div>
  `;
}

export function initSkills() {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  grid.innerHTML = skillCategories.map(renderCategory).join("");
  attachLazyFade(grid);
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