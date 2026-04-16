export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // First row is header (heading + link)
  const headerRow = rows[0];
  const headerCells = [...headerRow.children];
  const header = document.createElement('div');
  header.className = 'tp-header';

  // Extract heading and link from header cell
  const h2 = headerCells[0]?.querySelector('h2');
  const headerLink = headerCells[0]?.querySelector('a');
  if (h2) header.appendChild(h2);
  if (headerLink) {
    headerLink.classList.remove('button');
    const p = headerLink.closest('p, .button-container');
    if (p) p.remove();
    header.appendChild(headerLink);
  }

  // Product rows become carousel cards
  const carousel = document.createElement('div');
  carousel.className = 'tp-carousel';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'tp-card';

    // Cell 0 = image, Cell 1 = badge + title link
    const imgCell = cells[0];
    const infoCell = cells[1];

    const img = imgCell?.querySelector('img');
    const link = infoCell?.querySelector('a');
    const href = link?.getAttribute('href') || '#';

    // Build card as a single link wrapping image + info
    const a = document.createElement('a');
    a.href = href;

    if (img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'tp-img';
      img.removeAttribute('width');
      img.removeAttribute('height');
      imgWrap.appendChild(img);
      a.appendChild(imgWrap);
    }

    // Extract badge text (paragraphs that aren't the link paragraph)
    if (infoCell) {
      const paragraphs = [...infoCell.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (!p.querySelector('a') && text) {
          const badge = document.createElement('div');
          badge.className = 'tp-badge';
          badge.textContent = text;
          a.appendChild(badge);
        }
      });

      // Title from the link text
      if (link) {
        const title = document.createElement('div');
        title.className = 'tp-title';
        title.textContent = link.textContent.trim();
        a.appendChild(title);
      }
    }

    card.appendChild(a);
    carousel.appendChild(card);
  });

  // Replace block content
  block.textContent = '';
  block.appendChild(header);
  block.appendChild(carousel);
}
