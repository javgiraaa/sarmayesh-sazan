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
  initProducts();
  initReveal();
  initCounters();
  initBacktop();
  initForm();
});
