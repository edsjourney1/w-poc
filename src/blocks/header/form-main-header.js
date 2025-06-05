import { addEvents, addAccountEvents } from './add-events.js';
import { enableAutocomplete, searchBuilder } from './search-builder.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { renderImages } from '../../scripts/externalImage.js';
import { structureBlogMenu } from './form-blog-menu.js';
import { windowUrlDetails } from '../../scripts/tools.js';
import loginURLs from './login-urls.js';

const { authUrl, profileApiUrl, logoutApiUrl, portals, cookieApiUrl } = JSON.parse(loginURLs);
const navEl = document.createElement('nav');
const navMaskEl = document.createElement('div');
navMaskEl.className = 'siteheader-nav-mask';

const searchMaskEl = document.createElement('div');
searchMaskEl.className = 'siteheader-search-mask';

const loginMaskEl = document.createElement('div');
loginMaskEl.className = 'siteheader-login-mask';

const generateLoginForm = (loginElArr, formCount) => {
  let str = '';
  loginElArr.forEach((el, index) => {
    str += `<div><label for='${
      index === 0 ? 'gn-login-user-input' : 'gn-login-password-input'
    }_${formCount}'>${el.querySelector('p:first-child').innerHTML}</label>`;
    str += `<input type='${index === 0 ? 'text' : 'password'}'
        id='${index === 0 ? 'gn-login-user-input' : 'gn-login-password-input'}_${formCount}'
        autocomplete='on' name='${index === 0 ? 'userid' : 'password'}' data-errortext='${
          el.querySelector('p:last-child').textContent
        }'/>`;
    str += `<div class='siteheader-login-error siteheader-login-error-field'
      aria-hidden="true" role="alert" aria-live="assertive" aria-atomic="true" data-error='
      ${index === 0 ? 'userid' : 'password'}_${formCount}'>
          ${el.querySelector('p:last-child').innerHTML}</div></div>`;
  });
  return str;
};

const constructLogin = async (headerFragment2, thisBlock, loginInfo) => {
  const alertBlockrMeta = getMetadata('/content-fragments/alert-states');
  const alertBlockPath = alertBlockrMeta
    ? new URL(alertBlockrMeta, window.location).pathname
    : '/content-fragments/alert-states';

  const alertFragment = await loadFragment(alertBlockPath);
  const [loginHeader, loginError, loginBody, loginCta, loginMessage] = Array.from(
    headerFragment2.querySelector('.siteheader.megamenu-loginnav')?.children,
  );
  const [registerHeader, registerBody] = Array.from(
    headerFragment2.querySelector('.siteheader.megamenu-registernav')?.children,
  );

  const loginFieldsStr = `<form
      id="{{replace--formid}}" name="loginForm"
      action="${authUrl}"
      method="post"
      novalidate="true"><div>
      {{replace--hiddenfields}}
      {{replace--formfields}}
      </div><div><button type='submit'>
      ${loginCta.children[0].querySelector('p').innerHTML}</button>
      ${loginCta.children[1].querySelector('p').innerHTML}</div>
    </form>`;

  let loginFieldsDesktopStr = loginFieldsStr.replace('{{replace--formid}}', 'gn-loginForm');
  let loginFieldsMobileStr = loginFieldsStr.replace('{{replace--formid}}', 'gn-loginForm-mobile');
  loginFieldsDesktopStr = loginFieldsDesktopStr.replace(
    '{{replace--hiddenfields}}',
    `<input name="scController" type="hidden" value="Auth"/>
      <input name="scAction" type="hidden" value="Login"/>
      <input name="dsItemId" type="hidden" value="a87e419e-65f9-4368-b409-0e24e8fd565d"/>
      <input name="indexLogin" value="true" type="hidden"/>`,
  );
  loginFieldsMobileStr = loginFieldsMobileStr.replace(
    '{{replace--hiddenfields}}',
    `<input name="scController" type="hidden" value="Auth"/>
      <input name="scAction" type="hidden" value="Login"/>
      <input name="dsItemId" type="hidden" value="a87e419e-65f9-4368-b409-0e24e8fd565d"/>
      <input name="indexLogin" value="true" type="hidden"/>`,
  );

  const loginformDesktop = generateLoginForm(Array.from(loginBody?.children), 0);
  const loginformMobile = generateLoginForm(Array.from(loginBody?.children), 1);

  loginFieldsDesktopStr = loginFieldsDesktopStr.replace(
    '{{replace--formfields}}',
    loginformDesktop,
  );
  loginFieldsMobileStr = loginFieldsMobileStr.replace('{{replace--formfields}}', loginformMobile);

  let loginMsgEl;
  const loginMsgSelector = loginMessage?.children[0]?.querySelector('p');

  let loginMsgStr = '';
  if (loginMsgSelector) {
    loginMsgEl = alertFragment
      ?.querySelector(`.${loginMsgSelector.innerHTML}`)
      ?.closest('.alert-wrapper');
    if (loginMsgEl?.querySelector('.alert > div > div:nth-child(2)')) {
      loginMsgEl.querySelector('.alert > div > div:nth-child(2)').innerHTML = '';
    }
    const loginMsgParent = loginMsgEl?.querySelector('.icon').closest('div');
    if (loginMsgParent) {
      Array.from(loginMsgParent?.children || []).forEach((el, index) => {
        if (index !== 0) {
          el.remove();
        }
      });
      loginMsgParent.append(loginMessage?.children[1]);
      loginMsgStr = loginMsgParent.closest('.alert-container').innerHTML;
    }
  }
  let tempElem = '';
  if (loginError) {
    tempElem = document.createElement('div');
    loginError.classList.add('siteheader-login-error');
    loginError.classList.add('form-error-block');
    loginError.classList.add('siteheader-login-error-common');
    loginError.setAttribute('aria-hidden', true);
    loginError.setAttribute('role', 'alert');
    loginError.setAttribute('aria-live', 'assertive');
    loginError.setAttribute('aria-atomic', true);
    tempElem.append(loginError);
  }
  if (loginInfo) {
    const loginWrapperDesktopEl = document.createElement('div');
    loginWrapperDesktopEl.className = 'siteheader-login-wrapper';
    const loginWrapperMobileEl = document.createElement('div');
    loginWrapperMobileEl.className = 'siteheader-login-wrapper';
    loginWrapperMobileEl.innerHTML = `<div class='siteheader-login-wrapper-grid'>
      <div>
        ${loginMsgStr}
        ${tempElem.innerHTML}
        ${loginHeader.innerHTML}
        <div class='siteheader-login-fields'>
          ${loginFieldsMobileStr}
        </div>
      </div>
      <div>
        ${registerHeader.innerHTML}
        ${registerBody.innerHTML}
      </div>
    </div>`;

    navEl.append(loginWrapperMobileEl);

    loginWrapperDesktopEl.innerHTML = `<div class='siteheader-login-wrapper-cta'>
      <button type='button'>
          <span>${loginInfo.querySelector('p').innerHTML}</span>
      </button>
    </div>
    <div class='siteheader-login-wrapper-outer'>
      <div class='siteheader-login-wrapper-inner'>
        <div class='siteheader-login-wrapper-grid'>
          <div>
            ${loginMsgStr}
            ${tempElem.innerHTML}
            ${loginHeader.innerHTML}
            <div class='siteheader-login-fields'>
              ${loginFieldsDesktopStr}
            </div>
          </div>
          <div>
            ${registerHeader.innerHTML}
            ${registerBody.innerHTML}
          </div>
        </div>
      </div>
    </div>`;

    const loginPlaceholder = thisBlock.querySelector('.siteheader-login-placeholder');
    if (loginPlaceholder) {
      loginPlaceholder.replaceWith(loginWrapperDesktopEl);
    }
    addAccountEvents(thisBlock, navMaskEl, loginMaskEl);
  }
};

const constructLogout = (headerFragment2, thisBlock, logoutInfo, logoutObj) => {
  const [returnCta, logoutCta] = Array.from(
    headerFragment2.querySelector('.siteheader.megamenu-logoutnav > div')?.children,
  );
  const portalNames = Array.from(
    headerFragment2.querySelector('.siteheader.megamenu-portals')?.children,
  );
  const portalArr = [];
  portalNames.forEach((portalName) => {
    portalArr.push({
      names: [
        portalName.querySelector('div:nth-child(1)')?.textContent.toLowerCase(),
        portalName.querySelector('div:nth-child(2)')?.textContent.toLowerCase(),
      ],
      label: portalName.querySelector('div:nth-child(3)')?.textContent,
    });
  });

  // portals.not_found = '#';

  let returnCtaEl;
  let logoutCtaEl;
  let thisPortal;
  try {
    thisPortal = portalArr.find((portalItem) =>
      portalItem.names.includes(logoutObj.orgType.toLowerCase()),
    );
  } catch (e) {
    thisPortal = {
      names: ['not_found'],
      label: logoutObj.orgType.toLowerCase(),
    };
    console.error('Portal Name not found');
  }
  if (returnCta) {
    returnCtaEl = document.createElement('button');
    returnCtaEl.setAttribute('type', 'button');
    returnCtaEl.innerHTML = `${returnCta.querySelector('p')?.innerHTML} ${thisPortal.label}`;
    returnCtaEl.className = 'siteheader-logout-wrapper-return';
    returnCtaEl.addEventListener('click', () => {
      window.localStorage.setItem('landedFromExternal', 'true');
      setTimeout(() => {
        window.location.href = portals[thisPortal.names[0]];
      }, 0);
    });
  }
  if (logoutCta) {
    logoutCtaEl = document.createElement('button');
    logoutCtaEl.setAttribute('type', 'button');
    logoutCtaEl.innerHTML = `${logoutCta.querySelector('p')?.innerHTML}`;
    logoutCtaEl.className = 'siteheader-logout-wrapper-logout';
    logoutCtaEl.addEventListener('click', () => {
      window.localStorage.setItem('landedFromExternal', 'true');
      setTimeout(() => {
        window.location.href = logoutApiUrl;
      }, 0);
    });
  }
  const logoutWrapperDesktopEl = document.createElement('div');
  logoutWrapperDesktopEl.className = 'siteheader-logout-wrapper';
  if (logoutInfo) {
    logoutWrapperDesktopEl.innerHTML = `<div class='siteheader-logout-wrapper-cta'>
        <button type='button'>
          <span>${logoutInfo.querySelector('p')?.innerHTML}</span>
        </button>
      </div>
      <div class='siteheader-logout-wrapper-outer'>
        <div class='siteheader-logout-wrapper-inner'></div>
      </div>`;
    const returnCtaElClone = returnCtaEl.cloneNode(true);
    const logoutCtaElClone = logoutCtaEl.cloneNode(true);

    returnCtaElClone.addEventListener('click', () => {
      window.localStorage.setItem('landedFromExternal', 'true');
      setTimeout(() => {
        window.location.href = portals[thisPortal.names[0]];
      }, 0);
    });

    logoutCtaElClone.addEventListener('click', () => {
      window.localStorage.setItem('landedFromExternal', 'true');
      setTimeout(() => {
        window.location.href = logoutApiUrl;
      }, 0);
    });

    logoutWrapperDesktopEl.querySelector('.siteheader-logout-wrapper-inner').append(returnCtaEl);
    logoutWrapperDesktopEl.querySelector('.siteheader-logout-wrapper-inner').append(logoutCtaEl);

    const ulWrap2Login = document.createElement('div');
    ulWrap2Login.innerHTML = `<div class='siteheader-logout-wrapper'>
      <div class='siteheader-logout-wrapper-outer'>
        <div class='siteheader-logout-wrapper-inner'></div>
      </div>`;
    ulWrap2Login.querySelector('.siteheader-logout-wrapper-inner').append(returnCtaElClone);
    ulWrap2Login.querySelector('.siteheader-logout-wrapper-inner').append(logoutCtaElClone);

    navEl.appendChild(ulWrap2Login);
    const loginPlaceholder = thisBlock.querySelector('.siteheader-login-placeholder');
    if (loginPlaceholder) {
      loginPlaceholder.replaceWith(logoutWrapperDesktopEl);
    }
    addAccountEvents(thisBlock, navMaskEl, loginMaskEl);
  }
};

const fetchAccountInfo = async (headerFragment2, thisBlock, loginInfo, logoutInfo) => {
  try {
    const cookieResponse = await fetch(cookieApiUrl, {
      method: 'GET',
      credentials: 'include',
    });

    if (!cookieResponse.ok) {
      constructLogin(headerFragment2, thisBlock, loginInfo);
      return;
    }

    const cookieJson = await cookieResponse.json();
    if (!cookieJson.jwt) {
      constructLogin(headerFragment2, thisBlock, loginInfo);
      return;
    }

    const profileResponse = await fetch(profileApiUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${cookieJson.jwt}`,
      },
    });

    if (profileResponse.ok) {
      const profileJson = await profileResponse.json();

      const orgType = profileJson?.data?.orgType;
      const firstName = profileJson?.data?.firstName;
      const lastName = profileJson?.data?.lastName;

      constructLogout(headerFragment2, thisBlock, logoutInfo, {
        orgType,
        firstName,
        lastName,
      });
    } else {
      constructLogin(headerFragment2, thisBlock, loginInfo);
    }
  } catch (e) {
    constructLogin(headerFragment2, thisBlock, loginInfo);
  }
};

const structureRemainingNav = (
  thisBlock,
  fragment,
  navUl,
  headerFragment2,
  loginInfo,
  logoutInfo,
) => {
  const headerWrapper = thisBlock.closest('.header-wrapper');
  const headerFragment = fragment
    .querySelector('.siteheader.siteheader-default')
    ?.closest('.siteheader-container');
  const megamenuInfo = Array.from(
    headerFragment.querySelectorAll('[class^="siteheader megamenu-"]'),
  );

  if (headerWrapper) {
    headerWrapper.parentNode.insertBefore(navMaskEl, headerWrapper);
    headerWrapper.parentNode.insertBefore(searchMaskEl, headerWrapper);
    headerWrapper.parentNode.insertBefore(loginMaskEl, headerWrapper);
  }
  Array.from(navUl.querySelectorAll(':scope > li')).forEach((liEl) => {
    const anchor = liEl.querySelector('a');
    const subnavEl = liEl.querySelector('.siteheader-subnav > div');
    const infoDiv = megamenuInfo.find((infoEl) =>
      infoEl.classList.contains(
        `megamenu-${(anchor.textContent || '').split(' ').join('-').toLowerCase()}`,
      ),
    );
    if (anchor && subnavEl) {
      const subSubNavUl = subnavEl.querySelector(':scope > ul');
      const megamenuLi = document.createElement('li');
      megamenuLi.className = 'siteheader-subnav-info';
      Array.from(subSubNavUl.querySelectorAll(':scope > li')).forEach((l2LiEl) => {
        const h3El = document.createElement('h3');
        const strongEl = Array.from(l2LiEl.querySelectorAll(':scope > strong'));
        h3El.innerHTML = strongEl.map((el) => el.innerHTML).join(' ') || '';
        strongEl[0].replaceWith(h3El);
        for (let strongElCount = 1; strongElCount < strongEl.length; strongElCount += 1) {
          strongEl[strongElCount].remove();
        }
      });
      if (infoDiv) {
        megamenuLi.append(infoDiv.querySelector('h3'));
        infoDiv.children[1].classList.add('siteheader-subnav-grid');
        megamenuLi.append(infoDiv.children[1]);
        subSubNavUl.append(megamenuLi);
      }
    }
  });
  addEvents(thisBlock, navMaskEl, searchMaskEl, loginMaskEl);

  const searchForm = thisBlock.querySelector('#siteheader-search-form');
  if (searchForm) {
    const searchInput = searchForm.querySelector('#header_search');
    if (searchInput) {
      enableAutocomplete('header_search');
      // searchInput.addEventListener('selection', (event) => {
      //   const linkArr = (event.detail?.selection?.value || '').split('---') || [];
      //   if (linkArr[3] === '#') {
      //     const tempSearchEl = document.createElement('div');
      //     /* eslint-disable */
      //     tempSearchEl.innerHTML = linkArr[2];
      //     /* eslint-enable */
      //     window.location.href = `${windowUrlDetails.origin}/search?q=${tempSearchEl.textContent}`;
      //     searchForm.setAttribute('data-linkclicked', 'true');
      //   } else {
      //     alert(`TO BE IMPLEMENTED: Must go to ${linkArr[3]}`);
      //     searchForm.setAttribute('data-linkclicked', 'true');
      //   }
      // });
    }

    // searchForm.addEventListener('submit', (event) => {
    //   console.log('submit');
    // event.preventDefault();
    // if (
    //   ![true, 'true'].includes(searchForm.getAttribute('data-linkclicked')) &&
    //   searchInput.value.trim().length > 0
    // ) {
    //   window.location.href = `${windowUrlDetails.origin}/search?q=${searchInput.value}`;
    // }
    // searchForm.removeAttribute('data-linkclicked');
    // });
  }
  renderImages(navEl);
  fetchAccountInfo(headerFragment2, thisBlock, loginInfo, logoutInfo);
};

const formMainNavigationL1 = (thisBlock, navUl, navCtaEl) => {
  const mobileBtnWrapperEl = document.createElement('div');
  mobileBtnWrapperEl.className = 'siteheader-mobile-wrapper';
  mobileBtnWrapperEl.innerHTML = `<button type='button'>
            <div>${navCtaEl.querySelector('p:first-child').innerHTML}</div>
            <div>${navCtaEl.querySelector('p:last-child').innerHTML}</div>
        </button>`;
  thisBlock.append(mobileBtnWrapperEl);

  navEl.append(navUl);

  const l0Ul = navEl.children[0];
  const l0Li = Array.from(l0Ul.children);
  l0Li.forEach((l0El) => {
    const l1Ul = l0El.querySelector('ul');
    const l0Anchor = l0El.querySelector('a');

    const textWrap = document.createElement('span');
    textWrap.textContent = l0Anchor.textContent;
    l0Anchor.replaceChild(textWrap, l0Anchor.firstChild);

    if (l1Ul) {
      const l0ElSpan = document.createElement('span');
      l0ElSpan.className = 'icon icon-solid--chevron-down';
      l0ElSpan.innerHTML =
        '<i class="fa-solid fa-chevron-down" data-icon-name="solid--chevron-down"></i>';

      l0Anchor.classList.add('siteheader-has-subnav');
      l0Anchor.append(l0ElSpan);
      const ulWrap = document.createElement('div');
      ulWrap.className = 'siteheader-subnav';
      l1Ul.parentNode.insertBefore(ulWrap, l1Ul);

      const ulWrap2 = document.createElement('div');
      ulWrap.appendChild(ulWrap2);

      ulWrap2.appendChild(l1Ul);
    }
  });

  mobileBtnWrapperEl.append(navEl);
};

const structureMainHeader = (thisBlock, fragment, blogFragmentCode) => {
  const thisFragment = fragment.cloneNode(true);
  const headerFragment = fragment
    .querySelector('.siteheader.siteheader-default')
    ?.closest('.siteheader-container');
  const headerFragment2 = headerFragment.cloneNode(true);

  const blogFragment = blogFragmentCode?.querySelector('.siteheader-container');

  if (headerFragment) {
    const [, searchInfo, searchToggle, loginInfo, logoutInfo] = Array.from(
      headerFragment.querySelector('.siteheader.siteheader-default > div:first-child')?.children,
    );
    const [defaultLogo, providerLogo, medAdvLogo] = Array.from(
      headerFragment.querySelector('.siteheader.siteheader-logos > div:nth-child(2)')?.children,
    );
    const [navCtaEl] = Array.from(
      headerFragment.querySelector('.siteheader.siteheader-default > div:nth-child(2)').children,
    );
    const [navUlEl] = Array.from(
      headerFragment.querySelector('.siteheader.siteheader-default > div:nth-child(3)').children,
    );

    const navUl = navUlEl?.querySelector('ul');
    const urlArr = (windowUrlDetails.pathname || '').split('/');

    let logoWrapperStr = '';
    let currentLogo;
    if (urlArr.includes('providers') || (urlArr.includes('provider') && providerLogo)) {
      const [logoData] = providerLogo.children;
      currentLogo = logoData;
    } else if (urlArr.includes('medicare-advantage') && medAdvLogo) {
      const [logoData] = medAdvLogo.children;
      currentLogo = logoData;
    } else if (defaultLogo) {
      const [logoData] = defaultLogo.children;
      currentLogo = logoData;
    }

    logoWrapperStr = `<div class='siteheader-logo-wrapper'>
          ${currentLogo?.innerHTML.replaceAll('<em></em>', '')}
        </div>`;

    const searchSectionStartStr = '<div class="siteheader-right-section">';
    const searchSectionEndStr = '<div class="siteheader-login-placeholder"></div></div>';
    const searchWrapperStr = searchBuilder(searchInfo, searchToggle);

    headerFragment.innerHTML = `<div class="siteheader-outer"><div class="siteheader-inner">
      ${logoWrapperStr}
      ${searchSectionStartStr}
      ${searchWrapperStr}
      ${searchSectionEndStr}
    </div></div>`;
    thisBlock.append(headerFragment);

    const headerEl = document.querySelector('header .header');

    if (navUl && navCtaEl) {
      formMainNavigationL1(thisBlock, navUl, navCtaEl);
    }

    renderImages(headerEl, () => {
      headerEl.classList.add('header-loaded');
    });

    if (blogFragment) {
      structureBlogMenu(blogFragment);
    }
    structureRemainingNav(thisBlock, thisFragment, navUl, headerFragment2, loginInfo, logoutInfo);
  }
};

export default structureMainHeader;
