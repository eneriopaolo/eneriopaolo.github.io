/**
 * js/navigation.js
 * ------------------------------------------------------------------
 * Handles the mobile nav toggle. Active-tab state is set per-page
 * via aria-current="page" directly in the HTML, so no JS is needed
 * for that part.
 * ------------------------------------------------------------------
 */
export function initNavigation() {
  const toggle = document.querySelector(".nav__toggle");
  const tabs = document.querySelector(".nav__tabs");

  if (!toggle || !tabs) return;

  toggle.addEventListener("click", () => {
    const isOpen = tabs.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after a nav link is chosen.
  tabs.addEventListener("click", (event) => {
    if (event.target.closest(".nav__tab")) {
      tabs.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}
