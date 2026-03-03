// utils/ScrollNav.js

/**
 * Smoothly scrolls to a target element by its ID or anchor href.
 * Usage: scrollNav('#team') or scrollNav('#contact')
 */
export function scrollNav(href) {
  if (!href || href === '#') return;

  const targetEl = document.querySelector(href);
  if (!targetEl) return;

  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}