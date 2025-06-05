import { getMetadata } from '../../scripts/aem.js';
import { marketoFn, windowUrlDetails } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';
import generateLangs from './generate-lang.js';
import generateSkip from './generate-skip.js';
import generateSocial from './generate-social.js';

export default async function decorate() {
  const skipMeta = getMetadata('/content-fragments/skip-to-content-fragment');
  const skipPath = skipMeta
    ? new URL(skipMeta, window.location).pathname
    : '/content-fragments/skip-to-content-fragment';
  const skipfragment = await loadFragment(skipPath);
  generateSkip(skipfragment);

  const socialMeta = getMetadata('/content-fragments/blog-social-fragment');
  const socialPath = socialMeta
    ? new URL(socialMeta, window.location).pathname
    : '/content-fragments/blog-social-fragment';

  const socialfragment = await loadFragment(socialPath);
  generateSocial(socialfragment);

  generateLangs();

  const urlArr = (windowUrlDetails.pathname || '').split('/');
  let blogSubscribeMeta;
  let blogSubscribePath;

  if (urlArr.indexOf('blue') !== -1) {
    blogSubscribeMeta = getMetadata('/content-fragments/subscribe-newsletter-blue-fragment');
    blogSubscribePath = blogSubscribeMeta
      ? new URL(blogSubscribeMeta, window.location).pathname
      : '/content-fragments/subscribe-newsletter-blue-fragment';
  } else if (urlArr.indexOf('blue-at-work') !== -1) {
    blogSubscribeMeta = getMetadata(
      '/content-fragments/subscribe-newsletter-blue-at-work-fragment',
    );
    blogSubscribePath = blogSubscribeMeta
      ? new URL(blogSubscribeMeta, window.location).pathname
      : '/content-fragments/subscribe-newsletter-blue-at-work-fragment';
  } else if (urlArr.indexOf('blueink') !== -1) {
    blogSubscribeMeta = getMetadata('/content-fragments/subscribe-newsletter-blueink-fragment');
    blogSubscribePath = blogSubscribeMeta
      ? new URL(blogSubscribeMeta, window.location).pathname
      : '/content-fragments/subscribe-newsletter-blueink-fragment';
  }
  if (blogSubscribePath) {
    try {
      const mainEl = document.querySelector('main');
      const blogSubscribeFragment = await loadFragment(blogSubscribePath);
      const formContainer = blogSubscribeFragment.querySelector('.marketo-form-fragment-container');
      if (mainEl && formContainer) {
        mainEl.append(formContainer);
        marketoFn(formContainer, formContainer.querySelector('p'));
      }
    } catch (e) {
      // throw new Error(e);
    }
  }
}
