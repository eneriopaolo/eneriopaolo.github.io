/**
 * js/projects.js
 * ------------------------------------------------------------------
 * Renders project cards into #projects-grid from data/projects.js.
 * To add a project, edit the data file only — this renderer needs
 * no changes.
 * ------------------------------------------------------------------
 */
import { projects } from "../data/projects.data.js";

function renderProjectCard(project) {
  const techTags = project.tech
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const repoLink = project.repoUrl
    ? `<a href="${project.repoUrl}" target="_blank" rel="noopener">GitHub →</a>`
    : "";

  const demoLink = project.demoUrl
    ? `<a href="${project.demoUrl}" target="_blank" rel="noopener">Live demo →</a>`
    : "";

  return `
    <article class="project-card">
      <img
        class="project-card__thumb"
        src="${project.image}"
        alt="Screenshot of ${project.name}"
        loading="lazy"
      />
      <div class="project-card__body">
        <h3 class="project-card__name">${project.name}</h3>
        <p class="project-card__desc">${project.description}</p>
        <div class="project-card__tech">${techTags}</div>
        <div class="project-card__links">
          ${repoLink}
          ${demoLink}
        </div>
      </div>
    </article>
  `;
}

export function initProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects.map(renderProjectCard).join("");
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