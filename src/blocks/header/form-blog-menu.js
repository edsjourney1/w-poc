import { renderImages } from '../../scripts/externalImage.js';
import { slideUp, slideDown } from '../../scripts/tools.js';
import popupDataAnalytics from './popup-analytics.js';

const liBlogMenuArr = [];
const activeClsMain = 'siteheader-active';
const activeCls = 'siteheader-blog-has-subnav-active';
const bodyEl = document.querySelector('body');
let openSubnavCount = 0;
let openBlogNavCount = 0;

export const closeAllBlogMenuItems = () => {
  liBlogMenuArr.forEach((item) => {
    if (item.subnav) {
      item.isActive = false;
      item.link.classList.remove(activeCls);
      item.ariaExpanded = false;
      slideUp(item.subnav, 175);
      item.link.closest('nav .siteheader-blog-menu > ul').classList.remove(activeCls);
    }
  });
};

const initiateBlogSubnav = () => {
  liBlogMenuArr.forEach((item) => {
    item.link.addEventListener('click', (event) => {
      if (item.subnav) {
        event.preventDefault();
        if (item.isActive) {
          popupDataAnalytics('close', 'blog_menu_subnav', openSubnavCount);
          closeAllBlogMenuItems();
        } else {
          liBlogMenuArr.forEach((item2) => {
            if (item2.subnav) {
              if (item2.index === item.index) {
                openSubnavCount += 1;
                item2.isActive = true;
                item2.link.classList.add(activeCls);
                slideDown(item2.subnav, 175);
                popupDataAnalytics('open', 'blog_menu_subnav', openSubnavCount);
              } else {
                item2.isActive = false;
                item2.link.classList.remove(activeCls);
                slideUp(item2.subnav, 175);
              }
            }
          });
          item.link.closest('nav .siteheader-blog-menu > ul').classList.add(activeCls);
        }
      }
    });

    item.link.addEventListener('keyup', (event) => {
      if (event.key === 'Tab') {
        let found = false;
        for (let navCount = 0; navCount < liBlogMenuArr.length; navCount += 1) {
          const subnavEl = liBlogMenuArr[navCount].subnav;
          if (
            liBlogMenuArr[navCount].index !== item.index &&
            subnavEl &&
            getComputedStyle(subnavEl).display === 'block'
          ) {
            found = true;
            break;
          }
        }
        if (found) {
          setTimeout(() => {
            item.link.dispatchEvent(new Event('click'));
          }, 300);
        }
        if (!item.subnav) {
          closeAllBlogMenuItems();
        }
      }
    });
  });
};

const attachBlogMenuEvents = (headerSection) => {
  const navBtn = headerSection.querySelector('.siteheader-blog-nav-toggle > button');
  const navParent = headerSection.querySelector('.siteheader-blog-menu');
  const liItems = Array.from(headerSection.querySelectorAll('nav > div > ul > li'));
  const subscribeBtn = headerSection.querySelector('.subscribe-btn');

  subscribeBtn?.addEventListener('click', () => {
    setTimeout(() => {
      const targetEl = document.querySelector('main > .marketo-form-fragment-container');
      const boxTop = targetEl?.getBoundingClientRect().top;
      closeAllBlogMenuItems();
      if (headerSection.classList.contains('siteheader-blog-menu-active')) {
        navBtn.dispatchEvent(new Event('click'));
      }
      if (boxTop) {
        window.scrollTo({
          behavior: 'smooth',
          top: boxTop + window.scrollY - 160,
        });
      }
    }, 250);
  });

  liItems.forEach((li, index) => {
    const currentLink = li.querySelector(':scope > a');
    const l0ElSpan = document.createElement('span');
    if (li.querySelector('ul')) {
      l0ElSpan.className = 'icon icon-solid--chevron-down';
      l0ElSpan.innerHTML =
        '<i class="fa-solid fa-chevron-down" data-icon-name="solid--chevron-down"></i>';
      currentLink?.append(l0ElSpan);
      currentLink?.classList.add('siteheader-blog-has-subnav');
      // Set the aria-haspopup attribute
      currentLink?.setAttribute('aria-haspopup', 'listbox');
    }

    liBlogMenuArr.push({
      link: currentLink,
      subnav: li.querySelector(':scope > ul'),
      index,
      isActive: false,
    });
  });

  initiateBlogSubnav();

  const allHeaderSectionEl = Array.from(headerSection.querySelectorAll('*'));

  if (navBtn && navParent && liItems.length) {
    navBtn.addEventListener('click', () => {
      if (headerSection.classList.contains('siteheader-blog-menu-active')) {
        headerSection.classList.remove('siteheader-blog-menu-active');
        slideUp(navParent, 175);
        bodyEl.classList.remove('siteheader-blog-nav-active');
        popupDataAnalytics('close', 'blog_menu', openBlogNavCount);
        setTimeout(() => {
          allHeaderSectionEl.forEach((el) => {
            if (el.getAttribute('style')?.length > 0) {
              el.style.display = '';
            }
          });
        }, 300);
      } else {
        openBlogNavCount += 1;
        headerSection.classList.add('siteheader-blog-menu-active');
        bodyEl.classList.add('siteheader-blog-nav-active');
        slideDown(navParent, 175);
        popupDataAnalytics('open', 'blog_menu', openBlogNavCount);
      }
    });
  }
};

export const structureBlogMenu = (blogFragment) => {
  const headerSection = document.createElement('section');
  headerSection.className = blogFragment.className;

  let blogHeaderTop;
  let blogHeaderNavCta;
  let blogHeaderNav;

  if (blogFragment?.querySelector('.siteheader')) {
    [blogHeaderTop, blogHeaderNavCta, blogHeaderNav] =
      blogFragment.querySelector('.siteheader').children;
  }

  const topColorEl = blogHeaderTop?.children[1]?.querySelector('p');
  const bottomColorEl = blogHeaderTop?.children[2]?.querySelector('p');

  headerSection.classList.add('siteheader-blog');
  headerSection.innerHTML = `<div class='siteheader-blog-top-wrapper'>
      <div class='siteheader-blog-header-top'>
        <div class='siteheader-blog-header-row'>
            <div class='siteheader-blog-header-col'></div>
            <div class='siteheader-blog-header-col'></div>
        </div>
      </div>
    </div>
    <div class='siteheader-blog-bottom-wrapper'>
      <div class='siteheader-blog-header-bottom'>
        <div class='siteheader-blog-nav'>
          <nav></nav>
        </div>
      </div>
    </div>`;

  if (blogHeaderTop?.children[0]) {
    const [blogLogoImg, blogLogoTagline] = blogHeaderTop.children[0].children;
    headerSection.querySelector('.siteheader-blog-header-col:first-child').innerHTML = `
      <div class="siteheader-blog-logo-wrap">
        <div class="siteheader-blog-logo-img">
          ${blogLogoImg.innerHTML.replaceAll('<em></em>', '')}
        </div>
        ${
          blogLogoTagline?.textContent.length > 0
            ? `<div class="siteheader-blog-logo-tagline">
                ${blogLogoTagline.textContent}
              </div>`
            : ''
        }
      </div>
    `;
  }
  if (blogHeaderTop?.children[4]) {
    headerSection.querySelector('.siteheader-blog-header-col:last-child').innerHTML = `
          <button type='button' class='subscribe-btn'>${blogHeaderTop.children[4]?.querySelector('p').innerHTML}</button>
    `;
  }

  if (blogHeaderNavCta && blogHeaderNav) {
    headerSection.querySelector('.siteheader-blog-nav nav').innerHTML = `
      <div class='siteheader-blog-nav-toggle'>
        <button type='button'>${blogHeaderNavCta.querySelector('p')?.innerHTML}</button>
      </div>
      ${blogHeaderNav.innerHTML}
    `;
    headerSection.querySelector('nav > div:last-child').classList.add('siteheader-blog-menu');
    attachBlogMenuEvents(headerSection);
  }

  if (topColorEl.innerHTML.length) {
    headerSection.querySelector('.siteheader-blog-top-wrapper').classList.add(topColorEl.innerHTML);
  }
  if (bottomColorEl.innerHTML.length) {
    headerSection
      .querySelector('.siteheader-blog-bottom-wrapper')
      .classList.add(bottomColorEl.innerHTML);
  }

  const currentHeaderEl = document.querySelector('header');
  const currentMainEl = document.querySelector('main');
  currentHeaderEl.classList.add('header-has-blogmenu');
  currentMainEl.insertBefore(headerSection, currentMainEl.firstChild);

  renderImages(document.querySelector('.siteheader-blog'), () => {
    setTimeout(() => {
      headerSection.classList.add(activeClsMain);
    }, 100);
  });
};
