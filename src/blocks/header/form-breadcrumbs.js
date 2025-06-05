import { windowUrlDetails } from '../../scripts/tools.js';

const loopThroughItems = (navItems, thisLinkDetailsArr) => {
  let hrefArr = thisLinkDetailsArr;
  const arr = [];
  while (hrefArr.length > 0) {
    const arrJoin = hrefArr.join('/');
    let item;
    let itemHref = '';
    for (let i = 0; i < navItems.length; i += 1) {
      item = navItems[i] || null;
      if (item?.getAttribute('href').charAt(0) === '/') {
        itemHref = item?.href || '';
      } else {
        itemHref = item?.getAttribute('href') || '';
      }

      if (
        item?.getAttribute('href').charAt(0) !== '#' &&
        itemHref.length > 0 &&
        arrJoin ===
          new URL(itemHref).pathname
            .split('/')
            .filter((pathItem) => pathItem)
            .join('/')
      ) {
        item.classList.add('siteheader-active-nav');
        arr.push({
          current: hrefArr.join('/').length === thisLinkDetailsArr.join('/').length,
          el: item,
          link: item.href,
          title: item.innerText || item.textContent,
        });
        break;
      }
    }
    hrefArr = hrefArr.slice(0, -1);
  }
  return arr;
};

const buildCrumbs = () => {
  const crumbsArr = [];
  const currentUrl = windowUrlDetails;
  const urlPath = currentUrl.pathname;
  const urlArr = urlPath.split('/').filter((pathItem) => pathItem);
  const isBlog = urlArr.indexOf('blue') > -1 || urlPath.indexOf('blue-at-work') > -1;
  let navParent;
  const footerParent = document.querySelector('footer');

  if (urlArr.length > 1 && isBlog) {
    navParent = document.querySelector('.siteheader-blog .siteheader-blog-menu > ul');
    crumbsArr.push({
      current: false,
      title: urlArr.indexOf('blue') > -1 ? 'Blue' : 'Blue@Work',
      link: document.querySelector('.siteheader-blog-logo-img > a')?.href,
    });
  } else if (urlArr.length > 0 && !isBlog) {
    navParent = document.querySelector('.siteheader-mobile-wrapper nav > ul');
    crumbsArr.push({
      current: false,
      link: '/',
      title: 'Home',
    });
  }

  if (navParent) {
    const thisLinkDetails = currentUrl;
    const thisLinkDetailsArr = thisLinkDetails.pathname.split('/').filter((item) => item);
    let fullArr = [];
    if (thisLinkDetailsArr.length > 0) {
      fullArr = loopThroughItems(Array.from(navParent.querySelectorAll('a')), thisLinkDetailsArr);
    }
    if (fullArr.length === 0) {
      fullArr = loopThroughItems(
        Array.from(footerParent.querySelectorAll('a')),
        thisLinkDetailsArr,
      );
    }
    return [
      ...crumbsArr,
      ...fullArr
        .filter((obj2) => !crumbsArr.some((obj1) => obj1.title === obj2.title))
        .sort((a, b) => a.link.length - b.link.length),
    ];
  }
  return [];
};

const uniqueByLink = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.link)) {
      return false;
    }
    seen.add(item.link);
    return true;
  });
};

const formBreadcrumbs = () => {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
  let crumbs = buildCrumbs();
  const hasCurrent = crumbs.find((item) => item.current);
  if (!hasCurrent) {
    let pageTitle = (document.querySelector('meta[name="page-title"]')?.content || '').trim();
    if (pageTitle.length === 0) {
      pageTitle = document.querySelector('h1')?.innerHTML || '';
    }
    crumbs.push({
      current: true,
      title: pageTitle || '',
      link: '#',
    });
  }
  const ol = document.createElement('ol');
  crumbs = JSON.parse(JSON.stringify(uniqueByLink(crumbs)));
  crumbs.forEach((item, index) => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.innerHTML = item.title;
    anchor.href = item.link;
    if (item.current) {
      anchor.setAttribute('aria-current', 'page');
      anchor.setAttribute('tabindex', -1);
      li.setAttribute('aria-hidden', 'true');
    }

    let arrowTag;
    arrowTag = document.createElement('span');
    arrowTag.innerHTML = '<i class="fa-regular fa-chevron-left"></i>';
    arrowTag.className = 'breadcrumbs-prev';
    if (index === crumbs.length - 2) {
      li.className = 'breacrumbs-mobile';
    }
    li.appendChild(arrowTag);
    li.appendChild(anchor);
    if (index < crumbs.length - 1) {
      arrowTag = document.createElement('span');
      arrowTag.innerHTML = '<i class="fa-regular fa-chevron-right"></i>';
      arrowTag.className = 'breadcrumbs-next';
      li.appendChild(arrowTag);
    }

    ol.append(li);
  });
  if ([true, 'true'].includes(document.querySelector('meta[name="breadcrumbs"]')?.content)) {
    breadcrumbs.append(ol);
    const currentMainEl = document.querySelector('main');
    if (currentMainEl.querySelector('.siteheader-blog')) {
      currentMainEl.insertBefore(breadcrumbs, currentMainEl.firstChild.nextSibling);
    } else {
      currentMainEl.insertBefore(breadcrumbs, currentMainEl.firstChild);
    }
  }
};

export default formBreadcrumbs;
