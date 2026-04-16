export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // Cell 0 = image, Cell 1 = text (h3 + p), Cell 2 = link
    const imgCell = cells[0];
    const textCell = cells[1];
    const linkCell = cells[2];
    const anchor = linkCell?.querySelector('a');

    // Mark image cell for circular styling
    if (imgCell) imgCell.classList.add('watch-and-shop-img');
    // Mark text cell
    if (textCell) textCell.classList.add('watch-and-shop-text');

    if (anchor) {
      // Wrap the row content in a link
      const wrapper = document.createElement('a');
      wrapper.href = anchor.href;
      wrapper.className = 'watch-and-shop-card';
      // Move image and text cells into the wrapper
      if (imgCell) wrapper.appendChild(imgCell);
      if (textCell) wrapper.appendChild(textCell);
      // Remove link cell
      if (linkCell) linkCell.remove();
      row.appendChild(wrapper);
    }
  });
}
