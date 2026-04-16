export default async function decorate(block) {
  const rows = [...block.children];

  // First row is the heading — leave it as is
  const headingRow = rows[0];

  // Remaining rows are card items — wrap them in a flex container
  const cardRows = rows.slice(1);
  if (cardRows.length > 0) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-row');

    cardRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('div');
      card.classList.add('card');

      // Create a link wrapping the whole card
      // Look for the link in the text cell
      let href = '';
      let linkText = '';
      const textCell = cells.length > 1 ? cells[1] : cells[0];
      const imgCell = cells.length > 1 ? cells[0] : null;

      const anchor = textCell.querySelector('a');
      if (anchor) {
        href = anchor.href;
        linkText = anchor.textContent.trim();
      }

      const link = document.createElement('a');
      link.href = href;

      // Add image
      if (imgCell) {
        const picture = imgCell.querySelector('picture');
        if (picture) {
          link.appendChild(picture);
        }
      }

      // Add title
      const titleP = document.createElement('p');
      titleP.textContent = linkText;
      link.appendChild(titleP);

      card.appendChild(link);
      cardContainer.appendChild(card);

      // Remove the original row
      row.remove();
    });

    block.appendChild(cardContainer);
  }
}
