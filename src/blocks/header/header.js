import { getMetadata } from '../../scripts/aem.js';
import { windowUrlDetails } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';
import structureMainHeader from './form-main-header.js';

export default async function decorate(block) {
  const thisBlock = block;
  const siteHeaderMeta = getMetadata('/content-fragments/siteheader-fragment');
  const siteHeaderPath = siteHeaderMeta
    ? new URL(siteHeaderMeta, window.location).pathname
    : '/content-fragments/siteheader-fragment';

  const thisFragment = await loadFragment(siteHeaderPath);

  let blogHeaderMeta;
  let blogHeaderPath;

  const urlArr = (windowUrlDetails.pathname || '').split('/');
  if (urlArr.indexOf('blue') !== -1) {
    blogHeaderMeta = getMetadata('/content-fragments/siteheader-blue-fragment');
    blogHeaderPath = blogHeaderMeta
      ? new URL(blogHeaderMeta, window.location).pathname
      : '/content-fragments/siteheader-blue-fragment';
  } else if (urlArr.indexOf('blue-at-work') !== -1) {
    blogHeaderMeta = getMetadata('/content-fragments/siteheader-blue-at-work-fragment');
    blogHeaderPath = blogHeaderMeta
      ? new URL(blogHeaderMeta, window.location).pathname
      : '/content-fragments/siteheader-blue-at-work-fragment';
  }

  let blogFragment;
  if (blogHeaderPath) {
    blogFragment = await loadFragment(blogHeaderPath);
  }

  structureMainHeader(thisBlock, thisFragment, blogFragment);
}
