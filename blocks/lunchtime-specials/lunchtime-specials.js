export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the header
  const headerRow = rows[0];
  headerRow.classList.add('header-row');

  // Remaining rows are product cards
  const productRows = rows.slice(1);

  // Build carousel container
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const track = document.createElement('div');
  track.classList.add('carousel-track');

  productRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    if (!imageCell || !textCell) return;

    const card = document.createElement('div');
    card.classList.add('product-card');

    // Image
    const img = imageCell.querySelector('img');
    if (img) {
      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      const picture = imageCell.querySelector('picture') || document.createElement('div');
      cardImage.appendChild(picture.cloneNode(true));
      card.appendChild(cardImage);
    }

    // Text content
    const paragraphs = [...textCell.querySelectorAll('p')];
    if (paragraphs.length >= 1) {
      // Badge (first p)
      const badge = document.createElement('span');
      badge.classList.add('badge');
      badge.textContent = paragraphs[0]?.textContent?.trim() || '';
      card.appendChild(badge);
    }

    if (paragraphs.length >= 2) {
      // Product title (second p)
      const title = document.createElement('p');
      title.classList.add('card-title');
      title.textContent = paragraphs[1]?.textContent?.trim() || '';
      card.appendChild(title);
    }

    // Price area
    const priceArea = document.createElement('div');
    priceArea.classList.add('price-area');

    if (paragraphs.length >= 3) {
      const sellPrice = document.createElement('span');
      sellPrice.classList.add('price-sell');
      sellPrice.textContent = paragraphs[2]?.textContent?.trim() || '';
      priceArea.appendChild(sellPrice);
    }

    if (paragraphs.length >= 4) {
      const oldPrice = document.createElement('span');
      oldPrice.classList.add('price-old');
      // Get just the text, not the <s> wrapping
      const sEl = paragraphs[3]?.querySelector('s');
      oldPrice.textContent = sEl ? sEl.textContent.trim() : paragraphs[3]?.textContent?.trim() || '';
      priceArea.appendChild(oldPrice);
    }

    card.appendChild(priceArea);
    track.appendChild(card);

    // Hide original row
    row.style.display = 'none';
  });

  carouselContainer.appendChild(track);

  // Add navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('carousel-nav', 'prev');
  prevBtn.setAttribute('aria-label', 'Scroll left');
  prevBtn.innerHTML = '&#8249;';
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -460, behavior: 'smooth' });
  });

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('carousel-nav', 'next');
  nextBtn.setAttribute('aria-label', 'Scroll right');
  nextBtn.innerHTML = '&#8250;';
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 460, behavior: 'smooth' });
  });

  carouselContainer.appendChild(prevBtn);
  carouselContainer.appendChild(nextBtn);

  block.appendChild(carouselContainer);
}
