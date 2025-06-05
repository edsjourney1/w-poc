import { setEqualHeights } from '../../scripts/tools.js';

const allBioTiles = [];

export default function decorate(block) {
  const thisBlock = block;
  const blockChildren = thisBlock?.children;
  if (blockChildren[0]) {
    blockChildren[0].classList.add('bio-grid-title');
  }
  for (let i = 1; i < blockChildren.length; i += 1) {
    const items = Array.from(blockChildren[i].querySelectorAll(':scope > div'));
    items.forEach((item) => {
      const parentEl = document.createElement('article');
      const imgEl = item.querySelector('h3')?.previousElementSibling;
      const linkEl = item.querySelector('h3 a');
      let imgWrapper;
      if (imgEl) {
        if (linkEl) {
          imgWrapper = document.createElement('a');
          [...linkEl.attributes].forEach((attr) => {
            imgWrapper.setAttribute(attr.nodeName, attr.nodeValue);
          });
        } else {
          imgWrapper = document.createElement('div');
        }
        imgWrapper.classList.add('bio-grid-thumb');
        imgWrapper.append(imgEl);
        item.insertBefore(imgWrapper, item.firstChild);

        parentEl.appendChild(imgWrapper);
        parentEl.appendChild(item.querySelector(':scope > h3'));
        // eslint-disable-next-line no-unused-expressions
        item.querySelector(':scope > p') && parentEl.appendChild(item.querySelector(':scope > p'));
        item.append(parentEl);
        allBioTiles.push(item);
      } else {
        item.remove();
      }
    });
  }
  setTimeout(() => {
    allBioTiles.forEach((tile) => {
      tile.removeAttribute('style');
    });
    setEqualHeights(allBioTiles);
  }, 1000);
}

window.addEventListener('resize', () => {
  setTimeout(() => {
    allBioTiles.forEach((tile) => {
      tile.removeAttribute('style');
    });
    setEqualHeights(allBioTiles);
  }, 500);
});
