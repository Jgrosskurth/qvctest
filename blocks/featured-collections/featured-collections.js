export default async function decorate(block) {
  const rows = [...block.children];

  // First row is the header (heading + subtitle + shop link)
  // Card rows follow — each has an image cell and a text cell
  rows.forEach((row, index) => {
    if (index === 0) {
      row.classList.add('fc-header');
    } else {
      row.classList.add('fc-card');
      // Make the entire card clickable — wrap content in the link from text cell
      const textCell = row.querySelector('div:last-child');
      const link = textCell ? textCell.querySelector('a') : null;
      if (link) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
          if (e.target.tagName !== 'A') {
            link.click();
          }
        });
      }
    }
  });
}
