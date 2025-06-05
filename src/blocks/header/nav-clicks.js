import { slideUp, slideDown } from '../../scripts/tools.js';
import { closeAllBlogMenuItems } from './form-blog-menu.js';
import popupDataAnalytics from './popup-analytics.js';

const activeCls = 'siteheader-active';
let openCount = 0;

export const closeAllNavItems = (navArr, navMaskEl) => {
  navArr.forEach((item) => {
    item.link.ariaExpanded = 'false';
    item.isActive = false;
    item.link.classList.remove(activeCls);
    item.subnav.classList.remove(activeCls);
    slideUp(item.subnav, 175);
    navMaskEl.classList.remove('siteheader-active');
    item.link.closest('nav > ul').classList.remove(activeCls);
  });
};

export const navClicks = (liObj, navArr, navMaskEl) => {
  if (liObj.isActive) {
    popupDataAnalytics('close', 'main_navigation', openCount);
    closeAllNavItems(navArr, navMaskEl);
  } else {
    navArr.forEach((item) => {
      if (item.index === liObj.index) {
        openCount += 1;
        closeAllBlogMenuItems();
        liObj.isActive = true;
        // console.log(item.link);
        item.link.ariaExpanded = true;
        item.link.classList.add(activeCls);
        item.subnav.classList.add(activeCls);
        slideDown(item.subnav, 175);
        navMaskEl.classList.add('siteheader-active');
        popupDataAnalytics('open', 'main_navigation', openCount);
      } else {
        item.link.ariaExpanded = false;
        item.isActive = false;
        item.link.classList.remove(activeCls);
        item.subnav.classList.remove(activeCls);
        slideUp(item.subnav, 175);
      }
    });
    liObj.link.closest('nav > ul').classList.add(activeCls);
  }
};
