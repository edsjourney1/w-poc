import { slideUp, slideDown } from '../../scripts/tools.js';
import { closeAllNavItems } from './nav-clicks.js';
import { closeAllBlogMenuItems } from './form-blog-menu.js';
import popupDataAnalytics from './popup-analytics.js';

const activeCls = 'siteheader-active';
let openCount = 0;

const loginEventFn = (ctaEl, ctaWrapEl, wrapEl, navArr, navMaskEl, loginMaskEl, str) => {
  ctaEl?.addEventListener('click', () => {
    if (ctaWrapEl.classList.contains(activeCls)) {
      ctaWrapEl.classList.remove(activeCls);
      loginMaskEl.classList.remove(activeCls);
      ctaWrapEl.closest(`.siteheader-${str}-wrapper`).classList.remove(activeCls);
      slideUp(wrapEl, 175);
      popupDataAnalytics('close', 'Login / Register', openCount);
    } else {
      openCount += 1;
      ctaWrapEl.classList.add(activeCls);
      loginMaskEl.classList.add(activeCls);
      ctaWrapEl.closest(`.siteheader-${str}-wrapper`).classList.add(activeCls);
      closeAllBlogMenuItems();
      slideDown(wrapEl, 175);
      closeAllNavItems(navArr, navMaskEl);
      popupDataAnalytics('open', 'Login / Register', openCount);
    }
  });
};

export default loginEventFn;
