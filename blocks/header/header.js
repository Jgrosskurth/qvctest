import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Label the 3 sections: brand, sections, tools
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Clean up button classes on brand link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const container = brandLink.closest('.button-container');
      if (container) container.className = '';
    }
  }

  // === ROW 1: Top promo bar ===
  const topBar = document.createElement('div');
  topBar.className = 'nav-top-bar';
  topBar.innerHTML = '<p>QVC\'s 40 Years of Memories Contest Is On! <a href="https://www.qvc.com/">Learn How to Enter &amp; More ›</a></p>';

  // === ROW 2: Main navigation bar ===
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';

  // Logo
  const logoArea = document.createElement('div');
  logoArea.className = 'nav-logo';
  if (navBrand) {
    const logoContent = navBrand.querySelector('p');
    if (logoContent) logoArea.append(logoContent);
  }

  // Main links (Shop, Watch, Items on Air)
  const mainLinks = document.createElement('div');
  mainLinks.className = 'nav-main-links';
  mainLinks.innerHTML = `
    <a href="https://www.qvc.com/">Shop</a>
    <a href="https://www.qvc.com/content/featured/qvc-everywhere.html">Watch</a>
    <a href="https://www.qvc.com/content/featured/tsv.html">Items on Air</a>
  `;

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'nav-search';
  searchBar.innerHTML = '<input type="text" placeholder="Enter Keyword or Item #" aria-label="Search"><button type="button" aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>';

  // Utility (Sign in, Cart)
  const utilArea = document.createElement('div');
  utilArea.className = 'nav-utility';
  utilArea.innerHTML = `
    <a href="https://www.qvc.com/myaccount/my-account.html" class="nav-signin"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Sign in</a>
    <a href="https://www.qvc.com/checkout/cart.html" class="nav-cart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Cart</a>
  `;

  mainBar.append(logoArea, mainLinks, searchBar, utilArea);

  // === ROW 3: Category bar ===
  const catBar = document.createElement('div');
  catBar.className = 'nav-category-bar';

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const ul = navSections.querySelector('ul');
    if (ul) catBar.append(ul);
  }

  // TSV & Deals link from tools section
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const tsvLink = navTools.querySelector('a');
    if (tsvLink) {
      tsvLink.className = 'nav-tsv-link';
      catBar.append(tsvLink);
    }
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Assemble nav
  nav.textContent = '';
  nav.append(topBar, mainBar, catBar, hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
