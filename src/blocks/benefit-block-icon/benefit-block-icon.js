export default function decorate(block) {
  // slicing the first element of the block
  const innerleftDivs = [...block.children].slice(0, 1);
  const blockleft = document.createElement('div');
  blockleft.classList.add('block-left');
  block.prepend(blockleft);
  blockleft.append(innerleftDivs[0]);

  // slicing remaining elements of the block
  const childLength = [...block.children].length;
  const innerrightDivs = [...block.children].slice(1, childLength);
  const blockRight = document.createElement('div');
  blockRight.classList.add('block-right');
  block.append(blockRight);

  if (innerrightDivs) {
    blockRight.append(...innerrightDivs);

    // Change all the <h2> to <h4> if it has only text content
    const divs = blockRight.querySelectorAll('div');
    divs.forEach((div) => {
      const h2Spans = div.querySelectorAll('h2:has(span i)');
      h2Spans.forEach((h2) => {
        if (h2.childNodes.length > 0 && h2.textContent.trim() === '') {
          const pTag = document.createElement('span');
          pTag.innerHTML = h2.innerHTML; // Copy the inner HTML
          h2.replaceWith(pTag); // Replace the <h2> with <h4>
        }
      });
    });

    // Remove empty divs
    const emptyDivs = blockRight.querySelectorAll('div:empty');
    emptyDivs.forEach((div) => div.remove());
  }
}
