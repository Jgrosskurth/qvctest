export default async function decorate(block) {
  // Each row has: cell[0] = image, cell[1] = text with link
  // Make the entire card clickable by wrapping row content in anchor
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const linkEl = cells[1].querySelector('a');
      if (linkEl) {
        // Make the row itself act as a link card
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          window.location.href = linkEl.href;
        });
      }
    }
  });
}
