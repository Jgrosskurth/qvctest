export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  // Row 0: Heading (keep as-is)
  const headingRow = rows[0];

  // Row 1: Chips — transform comma-separated text into buttons
  const chipsRow = rows[1];
  const chipsText = chipsRow.textContent.trim();
  const chipNames = chipsText.split(',').map((s) => s.trim()).filter(Boolean);

  const chipsList = document.createElement('ul');
  chipsList.className = 'chips-list';
  chipNames.forEach((name, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.className = i === 0 ? 'chip active' : 'chip';
    li.appendChild(btn);
    chipsList.appendChild(li);
  });
  chipsRow.innerHTML = '';
  chipsRow.appendChild(chipsList);

  // Rows 2+: Show cards — each row has: [info, img1, img2, img3, img4, link]
  const cardRows = rows.slice(2);

  // Create carousel wrapper
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';

  const carousel = document.createElement('div');
  carousel.className = 'carousel';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    // Cell 0: info (time + title)
    const infoCell = cells[0];
    const paragraphs = infoCell.querySelectorAll('p');
    const headings = infoCell.querySelectorAll('h3');
    const timeText = paragraphs[0]?.textContent?.trim() || '';
    const titleText = headings[0]?.textContent?.trim() || '';

    // Cells 1-4: images
    const images = [];
    for (let i = 1; i <= 4 && i < cells.length; i += 1) {
      const img = cells[i].querySelector('img');
      if (img) images.push(img.cloneNode(true));
    }

    // Last cell: link
    const linkCell = cells[cells.length - 1];
    const linkEl = linkCell.querySelector('a');
    const href = linkEl?.getAttribute('href') || '#';

    // Build card
    const card = document.createElement('a');
    card.className = 'show-card';
    card.href = href;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    const timePara = document.createElement('p');
    timePara.className = 'card-time';
    timePara.textContent = timeText;

    const titlePara = document.createElement('p');
    titlePara.className = 'card-title';
    titlePara.textContent = titleText;

    cardInfo.appendChild(timePara);
    cardInfo.appendChild(titlePara);

    const products = document.createElement('div');
    products.className = 'card-products';
    images.forEach((img) => {
      // Remove LCP attributes that distort sizing
      img.removeAttribute('fetchpriority');
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.setAttribute('loading', 'lazy');
      products.appendChild(img);
    });

    card.appendChild(cardInfo);
    card.appendChild(products);
    carousel.appendChild(card);
  });

  // Scroll buttons
  const leftBtn = document.createElement('button');
  leftBtn.className = 'scroll-btn left';
  leftBtn.textContent = '\u2039';
  leftBtn.setAttribute('aria-label', 'Scroll left');

  const rightBtn = document.createElement('button');
  rightBtn.className = 'scroll-btn right';
  rightBtn.textContent = '\u203A';
  rightBtn.setAttribute('aria-label', 'Scroll right');

  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -268, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 268, behavior: 'smooth' });
  });

  carouselWrapper.appendChild(leftBtn);
  carouselWrapper.appendChild(carousel);
  carouselWrapper.appendChild(rightBtn);

  // Remove original card rows and replace with carousel
  cardRows.forEach((r) => r.remove());
  block.appendChild(carouselWrapper);
}
