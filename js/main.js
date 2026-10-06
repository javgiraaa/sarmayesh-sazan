import { initNavbarScroll } from './navbar-scroll.js';
import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initProducts } from './products.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initBacktop } from './backtop.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initNavbarScroll(20);
  initStagger();
  initProducts();
  initReveal();
  initCounters();
  initBacktop();
  initForm();
});

/* Soft staggered entrance: assigns --d per child (~70ms steps) then reveals.
   Runs after the view-transition page fade; reduced-motion shows instantly via CSS. */
function initStagger() {
  const groups = document.querySelectorAll('.stagger-in');
  if (!groups.length) return;
  groups.forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--d', `${Math.min(i, 12) * 70}ms`);
    });
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      groups.forEach((group) => group.classList.add('in'));
    });
  });
}
