/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
import { getMetadata } from '../../scripts/aem.js';
import { windowUrlDetails } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';
import formBreadcrumbs from '../header/form-breadcrumbs.js';

export default async function decorate(block) {
  // load footer as fragment

  const footerMeta = getMetadata('/content-fragments/footer-fragment');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/content-fragments/footer-fragment';
  const fragment = await loadFragment(footerPath);
  const urlArr = (windowUrlDetails.pathname || '').split('/');

  if (fragment) {
    // decorate footer DOM
    block.textContent = '';
    const footer = document.createElement('div');
    if (fragment.firstElementChild) {
      const footerMain = fragment.firstElementChild.querySelector('.sitefooter-main');
      const footerProvider = fragment.firstElementChild.querySelector('.sitefooter-provider');
      const footerMedAdv = fragment.firstElementChild.querySelector('.sitefooter-medadv');
      if (urlArr.includes('providers') || urlArr.includes('provider')) {
        footer.append(footerProvider);
      } else if (urlArr.includes('medicare-advantage')) {
        footer.append(footerMedAdv);
      } else {
        footer.append(footerMain);
      }
    }

    const contactLiArr = footer.querySelectorAll(
      '.sitefooter-info-content > div:nth-child(2) ul > li > a',
    );
    let hrefArr = [];
    const blogObj = {};

    contactLiArr.forEach((link) => {
      hrefArr = link.getAttribute('href').split('/');
      if (hrefArr.includes('blue')) {
        blogObj.blue = link.parentNode;
      } else if (hrefArr.includes('blue-at-work')) {
        blogObj.blueatwork = link.parentNode;
      } else if (hrefArr.includes('blueink')) {
        blogObj.blueink = link.parentNode;
      }
    });

    if (urlArr.includes('blue')) {
      blogObj.blue?.classList.add('footer-li-hidden');
      blogObj.blueink?.classList.add('footer-li-hidden');
    } else if (urlArr.includes('blue-at-work')) {
      blogObj.blueatwork?.classList.add('footer-li-hidden');
      blogObj.blueink?.classList.add('footer-li-hidden');
    } else if (urlArr.includes('blueink')) {
      blogObj.blue?.classList.add('footer-li-hidden');
      blogObj.blueatwork?.classList.add('footer-li-hidden');
    }
    block.append(footer);

    setTimeout(() => {
      formBreadcrumbs();
    }, 250);
  }
}
