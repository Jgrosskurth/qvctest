import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

const NAV_CATEGORIES = [
  { label: 'Your Picks', href: 'https://www.qvc.com/content/featured/my-recommendations.html' },
  { label: 'New', href: 'https://www.qvc.com/collections/featured-new-this-month.html' },
  { label: 'Trending Now', href: 'https://www.qvc.com/collections/featured-trending-today.html' },
  { label: "Mother's Day Gift Guide", href: 'https://www.qvc.com/collections/holiday-mothers-day-gifts.html' },
  { label: 'Clearance', href: 'https://www.qvc.com/collections/deals-clearance.html' },
  { label: 'Garden', href: 'https://www.qvc.com/c/garden-and-outdoor-living/-/gq7tw6/c.html' },
  { label: 'Fashion', href: 'https://www.qvc.com/c/fashion/-/lglt/c.html' },
  { label: 'Beauty', href: 'https://www.qvc.com/c/beauty/-/rhty/c.html' },
  { label: 'Jewelry', href: 'https://www.qvc.com/c/jewelry/-/mflu/c.html' },
  { label: 'Shoes', href: 'https://www.qvc.com/c/shoes/-/1doux/c.html' },
  { label: 'Bags', href: 'https://www.qvc.com/c/handbags-and-luggage/-/uoq0/c.html' },
  { label: 'Home', href: 'https://www.qvc.com/c/for-the-home/-/lglu/c.html' },
  { label: 'Electronics', href: 'https://www.qvc.com/c/electronics/-/lglw/c.html' },
  { label: 'Kitchen', href: 'https://www.qvc.com/c/kitchen-and-food/-/lglv/c.html' },
];

function toggleMenu(nav, forceExpanded = null) {
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

function buildCategoryList(fragment) {
  // Try to extract categories from the loaded fragment
  const ul = fragment ? fragment.querySelector('ul') : null;
  if (ul && ul.querySelectorAll('li').length > 0) return ul;

  // Fallback: build from hardcoded data
  const list = document.createElement('ul');
  NAV_CATEGORIES.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    li.append(a);
    list.append(li);
  });
  return list;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let fragment;
  try {
    fragment = await loadFragment(navPath);
  } catch (e) {
    // fragment load failed, continue with fallback
  }

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

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
  logoArea.innerHTML = '<a href="https://www.qvc.com/"><img src="https://qvc.scene7.com/is/image/QVC/qvc-logo-rebrand?fmt=png-alpha&wid=160" alt="QVC" width="160" height="52"></a>';

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
  catBar.append(buildCategoryList(fragment));

  // TSV & Deals link
  const tsvLink = document.createElement('a');
  tsvLink.className = 'nav-tsv-link';
  tsvLink.href = 'https://www.qvc.com/content/featured/tsv.html';
  tsvLink.textContent = "Today's Special Value & Deals";
  catBar.append(tsvLink);

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.addEventListener('click', () => toggleMenu(nav));

  // Assemble nav
  nav.append(topBar, mainBar, catBar, hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
