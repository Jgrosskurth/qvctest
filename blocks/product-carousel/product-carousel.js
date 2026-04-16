export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the header (title, subtitle, CTA link)
  const headerRow = rows[0];
  const headerCell = headerRow.querySelector(':scope > div');

  // Find the last link in the header cell — that's the "Shop …" CTA
  if (headerCell) {
    const links = headerCell.querySelectorAll('a');
    const lastLink = links.length > 0 ? links[links.length - 1] : null;
    if (lastLink && !lastLink.closest('h2') && !lastLink.closest('h3')) {
      lastLink.classList.add('shop-link');
    }
  }

  // Remaining rows are product cards (image cell + title cell)
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('cards-container');

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.classList.add('card');

    // Find the image and the title/link
    let picture = null;
    let titleContent = null;
    let link = null;

    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic) {
        picture = pic;
      }
      const a = cell.querySelector('a');
      if (a && !pic) {
        link = a;
        titleContent = a.textContent.trim();
      } else if (a && pic) {
        // Image cell might also have a link
        if (!link) {
          link = a;
          titleContent = a.textContent.trim();
        }
      }
      // If cell has text but no picture, use that as the title
      if (!pic && !a && cell.textContent.trim()) {
        titleContent = cell.textContent.trim();
      }
    });

    // Build card structure
    if (link) {
      const cardLink = document.createElement('a');
      cardLink.href = link.href;

      if (picture) {
        cardLink.appendChild(picture);
      }

      if (titleContent) {
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('card-title');
        titleDiv.textContent = titleContent;
        cardLink.appendChild(titleDiv);
      }

      card.appendChild(cardLink);
    } else {
      if (picture) card.appendChild(picture);
      if (titleContent) {
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('card-title');
        titleDiv.textContent = titleContent;
        card.appendChild(titleDiv);
      }
    }

    cardsContainer.appendChild(card);
    row.remove();
  });

  block.appendChild(cardsContainer);
}
