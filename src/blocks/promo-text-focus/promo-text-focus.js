import { renderImages } from '../../scripts/externalImage.js';

export default function decorate(block) {
  const parentPromoFocus = block.parentElement?.parentElement;
  if (parentPromoFocus) {
    parentPromoFocus.classList.add('blue-550');
  }
  // Banner append
  const focusPictureDiv = document.querySelector('.promo-text-focus > div > div > p');
  if (focusPictureDiv) {
    let backgroundPromoimg = focusPictureDiv.querySelector('picture img');
    const backgroundHref = focusPictureDiv.querySelector('a');
    if (backgroundPromoimg) {
      const backgroundbannerUrl = backgroundPromoimg.src;
      const altText = backgroundbannerUrl.substring(backgroundbannerUrl.lastIndexOf('#') + 1);
      backgroundPromoimg.alt = altText;
      const promofocusbanner = block.parentElement;
      if (promofocusbanner) {
        promofocusbanner.setAttribute('alt', altText);
        promofocusbanner.style.backgroundImage = `url(${backgroundbannerUrl})`;
        promofocusbanner.style.backgroundSize = 'cover';
        promofocusbanner.style.backgroundRepeat = 'no-repeat';
      }
    } else if (backgroundHref) {
      renderImages(focusPictureDiv, () => {
        backgroundPromoimg = focusPictureDiv.querySelector('picture img')?.getAttribute('src');
        const promofocusbanner = block.parentElement;
        if (promofocusbanner) {
          promofocusbanner.style.backgroundImage = `url(${backgroundPromoimg})`;
          promofocusbanner.style.backgroundSize = 'cover';
          promofocusbanner.style.backgroundRepeat = 'no-repeat';
          promofocusbanner.style.backgroundPosition = 'center center';
        }
      });
    }
  }

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
  // Division append
  const promotextfocus = document.querySelector('.promo-text-focus');
  const innerdiv = promotextfocus.children[1];
  const promotextdiv = document.createElement('div');
  promotextdiv.className = 'promo-focus-block';
  promotextdiv.append(innerdiv);
  promotextfocus.textContent = '';
  promotextfocus.append(promotextdiv);
}
