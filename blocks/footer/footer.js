import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function groupByHeadings(wrapper, className) {
  const children = [...wrapper.children];
  const groups = [];
  let current = null;

  children.forEach((el) => {
    if (el.tagName === 'H3') {
      current = document.createElement('div');
      current.className = 'footer-col';
      groups.push(current);
    }
    if (current) current.append(el);
  });

  if (groups.length > 1) {
    const grid = document.createElement('div');
    grid.className = className;
    groups.forEach((g) => grid.append(g));
    wrapper.textContent = '';
    wrapper.append(grid);
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll('.section');

  // Section 0: Promo banners
  if (sections[0]) {
    const w = sections[0].querySelector('.default-content-wrapper');
    if (w) w.classList.add('footer-promos');
  }

  // Section 1: 3-col info (Stay in Touch / Manage Account / QCard)
  if (sections[1]) {
    const w = sections[1].querySelector('.default-content-wrapper');
    if (w) groupByHeadings(w, 'footer-3-cols');
  }

  // Section 2: 5-col links (Customer Service / Connect / Learn / Work / Stay Connected)
  if (sections[2]) {
    const w = sections[2].querySelector('.default-content-wrapper');
    if (w) groupByHeadings(w, 'footer-5-cols');
  }

  // Section 3: Bottom bar
  if (sections[3]) {
    const w = sections[3].querySelector('.default-content-wrapper');
    if (w) w.classList.add('footer-bottom');
  }

  block.append(footer);
}
