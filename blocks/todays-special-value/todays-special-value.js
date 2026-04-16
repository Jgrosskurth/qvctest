export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];

    // Cell 0 = image, Cell 1 = text content
    if (cells.length >= 2) {
      const textCell = cells[1];

      // Find the first <p> which contains the timer text (e.g., "Ends in ...")
      const paragraphs = [...textCell.querySelectorAll('p')];
      const timerP = paragraphs.find((p) => p.textContent.trim().startsWith('Ends in'));
      if (timerP) {
        timerP.classList.add('tsv-timer');
      }

      // Find the promo paragraph (Auto-Delivery / Exclusive)
      const promoP = paragraphs.find((p) => p.textContent.includes('Auto-Delivery') || p.textContent.includes('Exclusive'));
      if (promoP) {
        promoP.classList.add('tsv-promo');
      }
    }
  });
}
