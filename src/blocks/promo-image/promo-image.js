import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const focusPictureDiv = document.querySelector('.promo-image > div > div > p');
  if (focusPictureDiv) {
    const backgroundPromoimg = focusPictureDiv.querySelector('picture img');
    const backgroundHref = focusPictureDiv.querySelector('a');
    if (backgroundPromoimg) {
      const backgroundbannerUrl = backgroundPromoimg.src;
      const title = block.children[1].innerText;
      const imageWrapperDiv = block.parentElement;
      imageWrapperDiv.style.background = `url(${backgroundbannerUrl})`;
      imageWrapperDiv.style.backgroundSize = 'cover';
      imageWrapperDiv.style.backgroundPosition = 'center';
      imageWrapperDiv.style.backgroundRepeat = 'no-repeat';
      const mainHeading = document.createElement('h2');
      mainHeading.classList.add('promo-image-heading');
      mainHeading.textContent = `${title}`;
      imageWrapperDiv.prepend(mainHeading);
    } else if (backgroundHref) {
      const backgroundbannerUrl = backgroundHref.href;
      const title = block.children[1].innerText;
      const imageWrapperDiv = block.parentElement;
      imageWrapperDiv.style.background = `url(${backgroundbannerUrl})`;
      imageWrapperDiv.style.backgroundSize = 'cover';
      imageWrapperDiv.style.backgroundPosition = 'center';
      imageWrapperDiv.style.backgroundRepeat = 'no-repeat';
      const mainHeading = document.createElement('h2');
      mainHeading.classList.add('promo-image-heading');
      mainHeading.textContent = `${title}`;
      imageWrapperDiv.prepend(mainHeading);
    }
  }
  const ul = document.createElement('ul');
  const promoClass = `promo-${block.children.length - 2}-column`;
  ul.classList.add(promoClass);
  [...block.children].forEach((row, index) => {
    if (index > 1) {
      const li = document.createElement('li');
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) {
          div.className = 'cards-card-image';
        } else {
          div.className = 'cards-card-body';
        }
      });
      ul.append(li);
    }
  });
  ul.querySelectorAll('picture > img').forEach((img) =>
    img
      .closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])),
  );
  block.textContent = '';
  block.append(ul);
}
