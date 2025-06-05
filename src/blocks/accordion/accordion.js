/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */
export default function decorate(block) {
  const accordionWrapper = [...block.children];
  const accordionSection = accordionWrapper.slice(1, accordionWrapper.length);
  accordionSection.forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    // Query select the p tags within the summary element
    const summaryPTags = label.querySelectorAll('p');
    // Add class names based on the number of p tags
    summaryPTags.forEach((pTag, index) => {
      if (summaryPTags.length === 2) {
        // First p tag gets item-title class
        if (index === 0) pTag.classList.add('item-title');
        // Second p tag gets item-description class
        else if (index === 1) pTag.classList.add('item-description');
      } else if (summaryPTags.length === 1) {
        // Single p tag gets item-title class
        pTag.classList.add('item-title');
      }
    });
    // Append the p tags to the summary element
    summary.append(...summaryPTags);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
  const { parentElement } = block;
  // get the first child
  const title = block.children[0];
  // remove the first child
  title.remove();
  // Check if the title exists and has non-empty content
  if (title && title.textContent.trim() !== '') {
    // Create the heading element for accordion
    const mainHeading = document.createElement('h2');
    mainHeading.classList.add('accordion-heading');
    mainHeading.textContent = title.textContent.trim(); // Use the trimmed content
    const id = mainHeading.innerText.replace(/\s+/g, '-').toLowerCase(); // Replace whitespace with hyphens
    mainHeading.id = id;
    parentElement.prepend(mainHeading);
  }
}
