/**
 * Product Feed block - fetches products from QVC's public API
 * and renders them in a scrollable carousel.
 *
 * Content structure:
 *   Row 1: feed-type (e.g. "trending", "deals", "new-releases")
 *   Row 2: api-url (optional override)
 */

const FEED_CONFIGS = {
  trending: {
    title: 'Currently Trending',
    url: 'https://api.qvc.com/api/search/hierarchy/v1/us/group/createCioUrls?url=https://www.qvc.com/collections/featured-trending-today.html',
    fallback: 'https://api.qvc.com/api/sales/presentation/v3/us/products/list/A723955,A732279,A727533,V93368,A724111,A724098,A732950,A721587',
  },
  deals: {
    title: "Our Don't-Miss Deal List",
    fallback: 'https://api.qvc.com/api/sales/presentation/v3/us/products/list/V93368,A727533,E328504,E328505,H517287,M139453,A727383,J459458',
  },
  'new-releases': {
    title: 'Top Selling New Releases',
    fallback: 'https://api.qvc.com/api/sales/presentation/v3/us/products/list/A723955,A732279,A727533,V93368,A724111,A724098,A732950,A721587,A724091,A725728',
  },
  lunchtime: {
    title: 'Lunchtime Specials',
    fallback: 'https://api.qvc.com/api/sales/presentation/v3/us/products/list/A632362,A647420,A634606,A625726,A632354,A632798',
  },
};

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const id = product.id || product.productId || '';
  const idLower = id.toLowerCase();
  const firstChar = idLower.charAt(0);
  const lastTwo = idLower.slice(-2);
  const imgUrl = `https://qvc.scene7.com/is/image/QVC/${firstChar}/${lastTwo}/${idLower}.001?$aemprodcarousellg80$`;

  const name = product.name || product.productName || product.description || id;
  const price = product.pricing?.currentPrice?.value
    || product.pricing?.salePrice?.value
    || product.price
    || '';
  const wasPrice = product.pricing?.listPrice?.value
    || product.pricing?.regularPrice?.value
    || product.wasPrice
    || '';
  const link = `https://www.qvc.com/qvc.product.${id}.html`;

  card.innerHTML = `
    <a href="${link}" target="_blank" rel="noopener">
      <div class="product-card-image">
        <img src="${imgUrl}" alt="${name}" loading="lazy" width="280" height="249">
      </div>
      <p class="product-card-name">${name}</p>
      <p class="product-card-price">
        ${price ? `<span class="price-current">$${typeof price === 'number' ? price.toFixed(2) : price}</span>` : ''}
        ${wasPrice && wasPrice !== price ? `<span class="price-was">$${typeof wasPrice === 'number' ? wasPrice.toFixed(2) : wasPrice}</span>` : ''}
      </p>
    </a>
  `;
  return card;
}

async function fetchProducts(feedType, customUrl) {
  const config = FEED_CONFIGS[feedType] || FEED_CONFIGS.trending;
  const url = customUrl || config.fallback;
  if (!url) return [];

  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const data = await resp.json();
    // Handle different API response shapes
    if (Array.isArray(data)) return data;
    if (data.products) return data.products;
    if (data.data) return data.data;
    if (data.items) return data.items;
    return [];
  } catch (e) {
    return [];
  }
}

export default async function decorate(block) {
  const rows = [...block.children];
  const feedType = rows[0]?.textContent?.trim()?.toLowerCase() || 'trending';
  const customUrl = rows[1]?.textContent?.trim() || '';
  const config = FEED_CONFIGS[feedType] || FEED_CONFIGS.trending;

  block.textContent = '';

  // Title
  const title = document.createElement('h2');
  title.textContent = config.title;
  block.append(title);

  // Carousel container
  const carousel = document.createElement('div');
  carousel.className = 'product-feed-carousel';
  block.append(carousel);

  // Loading state
  carousel.innerHTML = '<p class="product-feed-loading">Loading products...</p>';

  // If API fails, render static product cards from known IDs
  const products = await fetchProducts(feedType, customUrl);

  carousel.textContent = '';

  if (products.length === 0) {
    // Fallback: render product cards from known product IDs
    const fallbackIds = (config.fallback || '').split('/').pop()?.split(',') || [];
    fallbackIds.forEach((id) => {
      if (!id) return;
      const card = document.createElement('div');
      card.className = 'product-card';
      const idLower = id.toLowerCase();
      const firstChar = idLower.charAt(0);
      const lastTwo = idLower.slice(-2);
      card.innerHTML = `
        <a href="https://www.qvc.com/qvc.product.${id}.html" target="_blank" rel="noopener">
          <div class="product-card-image">
            <img src="https://qvc.scene7.com/is/image/QVC/${firstChar}/${lastTwo}/${idLower}.001?$aemprodcarousellg80$"
                 alt="${id}" loading="lazy" width="280" height="249">
          </div>
          <p class="product-card-name">${id}</p>
        </a>
      `;
      carousel.append(card);
    });
  } else {
    products.forEach((product) => {
      carousel.append(createProductCard(product));
    });
  }

  // Navigation arrows
  const leftBtn = document.createElement('button');
  leftBtn.className = 'product-feed-prev';
  leftBtn.setAttribute('aria-label', 'Previous');
  leftBtn.innerHTML = '‹';

  const rightBtn = document.createElement('button');
  rightBtn.className = 'product-feed-next';
  rightBtn.setAttribute('aria-label', 'Next');
  rightBtn.innerHTML = '›';

  block.append(leftBtn, rightBtn);

  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}
