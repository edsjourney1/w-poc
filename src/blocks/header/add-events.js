import { debounce } from '../../scripts/tools.js';
import { closeAllBlogMenuItems } from './form-blog-menu.js';
import loginEventFn from './login-events.js';
import loginURLs from './login-urls.js';
import { navClicks, closeAllNavItems } from './nav-clicks.js';
import popupDataAnalytics from './popup-analytics.js';

const {
  loginApiUrl,
  loginFailApiUrl,
  recaptchaSiteKey,
  cookieApiUrl,
  mfaFalse,
  mfaTrue,
  mfaNA,
  profileApiUrl,
  portals,
} = JSON.parse(loginURLs);

const bodyElem = document.querySelector('body');
const activeCls = 'siteheader-active';

let windowWidth = window.outerWidth;
let windowHeight = window.outerHeight;
let formSubmitted = false;
const navArr = [];

const validateField = (el) => {
  if (el.value.trim().length === 0) {
    el.parentNode.querySelector('.siteheader-login-error').classList.add('error-visible');
  } else {
    el.parentNode.querySelector('.siteheader-login-error').classList.remove('error-visible');
  }

  return el.value.trim().length === 0;
};

const validateLoginForm = (userIdEl, passwordIdEl, commonErrorBlock) => {
  const isUserIdInvalid = validateField(userIdEl);
  const isPasswordInvalid = validateField(passwordIdEl);

  if (isUserIdInvalid || isPasswordInvalid) {
    commonErrorBlock.querySelector('ul')?.remove();
    commonErrorBlock.querySelector('.siteheader-response-error')?.remove();
    commonErrorBlock.classList.add('error-visible');
    const ul = document.createElement('ul');
    ul.innerHTML += isUserIdInvalid
      ? `<li><label for=${userIdEl.getAttribute('id')}>${userIdEl.getAttribute(
          'data-errortext',
        )}</label></li>`
      : '';
    ul.innerHTML += isPasswordInvalid
      ? `<li><label for=${passwordIdEl.getAttribute('id')}>${passwordIdEl.getAttribute(
          'data-errortext',
        )}</label></li>`
      : '';
    commonErrorBlock.append(ul);
  } else {
    commonErrorBlock.classList.remove('error-visible');
  }

  return isUserIdInvalid || isPasswordInvalid;
};

const toggleThisForm = (formEl, shouldDisable) => {
  const inputs = Array.from(formEl.querySelectorAll('input, button'));
  inputs.forEach((input) => {
    if (shouldDisable) {
      input.setAttribute('disabled', 'disabled');
      formEl
        .closest('.siteheader-login-wrapper-grid')
        ?.classList.add('siteheader-login-wrapper-grid-disabled');
    } else {
      input.removeAttribute('disabled');
      input.value = '';
      formEl
        .closest('.siteheader-login-wrapper-grid')
        ?.classList.remove('siteheader-login-wrapper-grid-disabled');
    }
  });
};

const toggleAllForms = (formObj, shouldDisable) => {
  toggleThisForm(formObj.primary, shouldDisable);
  toggleThisForm(formObj.secondary, shouldDisable);
};

const addValidation = (formObj) => {
  const commonErrorBlock = formObj.primary
    .closest('.siteheader-login-wrapper')
    .querySelector('.siteheader-login-error-common');
  const userIdEl = formObj.primary.querySelector('[name="userid"]');
  const passwordIdEl = formObj.primary.querySelector('[name="password"]');

  userIdEl.addEventListener('keyup', () => {
    if (formSubmitted) {
      validateLoginForm(userIdEl, passwordIdEl, commonErrorBlock);
    }
  });
  passwordIdEl.addEventListener('keyup', () => {
    if (formSubmitted) {
      validateLoginForm(userIdEl, passwordIdEl, commonErrorBlock);
    }
  });

  const handleInvalidForm = (url) => {
    window.localStorage.setItem('landedFromExternal', 'true');
    window.location.href = url;
  };

  formObj.primary.addEventListener('submit', (event) => {
    formSubmitted = true;
    event.preventDefault();
    if (!validateLoginForm(userIdEl, passwordIdEl, commonErrorBlock)) {
      toggleAllForms(formObj, true);
      const captchaObj = window.grecaptcha;
      if (captchaObj) {
        captchaObj.ready(() => {
          captchaObj.execute(recaptchaSiteKey, { action: 'submit' }).then(async (token) => {
            try {
              const loginResponse = await fetch(loginApiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  recaptchaid: token,
                },
                credentials: 'include',
                body: JSON.stringify({
                  username: userIdEl.value,
                  password: passwordIdEl.value,
                  ipAddress: '192.168.1.1', // Consider making this dynamic if needed
                }),
              });

              if (!loginResponse.ok) {
                handleInvalidForm(loginFailApiUrl);
                return;
              }

              const cookieResponse = await fetch(cookieApiUrl, {
                method: 'GET',
                credentials: 'include',
              });
              if (!cookieResponse.ok) {
                handleInvalidForm(loginFailApiUrl);
                return;
              }

              const cookieJson = await cookieResponse.json();
              if (!cookieJson.jwt) {
                handleInvalidForm(loginFailApiUrl);
                return;
              }

              const mfa = loginResponse.mfa || {};
              if (mfa.isMFARequired) {
                if (loginResponse.isMFAEnrolled) {
                  window.location.href = mfaTrue;
                } else {
                  window.location.href = mfaFalse;
                }
                return;
              }

              const profileResponse = await fetch(profileApiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  Authorization: `Bearer ${cookieJson.jwt}`,
                },
              });

              if (!profileResponse.ok) {
                handleInvalidForm(loginFailApiUrl);
                return;
              }

              const profileJson = await profileResponse.json();
              let orgType = (profileJson?.data?.orgType || '').toLowerCase();
              if (/^ws/.test(orgType)) {
                orgType = orgType.substring(2);
              }
              if (portals[orgType]) {
                window.location.href = portals[orgType];
              } else {
                window.location.href = mfaNA;
              }
            } catch (error) {
              handleInvalidForm(loginFailApiUrl);
            }
          });
        });
      } else {
        handleInvalidForm(loginFailApiUrl);
      }
    }
  });
};

const addLoginEvents = (thisBlock, ctaWrapEl, str, navMaskEl, loginMaskEl) => {
  const ctaEl = ctaWrapEl?.querySelector('button');
  const wrapEl = thisBlock.querySelector(`.siteheader-${str}-wrapper-outer`);
  loginEventFn(ctaEl, ctaWrapEl, wrapEl, navArr, navMaskEl, loginMaskEl, str);
};

let loginCtaWrapEl;
let logoutCtaWrapEl;
let loginWrapper;
let logoutWrapper;

const addAccountEvents = (thisBlock, navMaskEl, loginMaskEl) => {
  loginCtaWrapEl = thisBlock?.querySelector('.siteheader-login-wrapper-cta');
  logoutCtaWrapEl = thisBlock?.querySelector('.siteheader-logout-wrapper-cta');

  const loginFormDesktop = thisBlock?.querySelector('form#gn-loginForm');
  const loginFormMobile = thisBlock?.querySelector('form#gn-loginForm-mobile');

  if (loginCtaWrapEl) {
    addLoginEvents(thisBlock, loginCtaWrapEl, 'login', navMaskEl, loginMaskEl);
  }
  if (logoutCtaWrapEl) {
    addLoginEvents(thisBlock, logoutCtaWrapEl, 'logout', navMaskEl, loginMaskEl);
  }

  loginWrapper = document.querySelector('.siteheader-login-wrapper');
  logoutWrapper = document.querySelector('.siteheader-logout-wrapper');

  if (loginFormDesktop && loginFormMobile) {
    addValidation({ primary: loginFormDesktop, secondary: loginFormMobile });
    addValidation({ primary: loginFormMobile, secondary: loginFormDesktop });
  }
};

const addEvents = (thisBlock, navMaskEl, searchMaskEl) => {
  const navCtaEl = thisBlock?.querySelector('.siteheader-mobile-wrapper > button');
  const searchParent = document.querySelector(
    '.siteheader-search-wrapper > .siteheader-search-inner',
  );
  const searchCtaEl = document.querySelector('.siteheader-search-wrapper > button');
  let mobileSearchOpencount = 0;
  let mobileNavOpencount = 0;

  searchCtaEl.addEventListener('click', () => {
    if (navCtaEl.classList.contains(activeCls)) {
      navCtaEl.dispatchEvent(new MouseEvent('click'));
    }
    if (searchParent.classList.contains(activeCls)) {
      searchCtaEl.classList.remove(activeCls);
      searchParent.classList.remove(activeCls);
      searchMaskEl.classList.remove(activeCls);
      bodyElem.classList.remove('siteheader-search-active');
      popupDataAnalytics('close', 'Search', mobileSearchOpencount);
    } else {
      mobileSearchOpencount += 1;
      searchCtaEl.classList.add(activeCls);
      searchParent.classList.add(activeCls);
      searchMaskEl.classList.add(activeCls);
      bodyElem.classList.add('siteheader-search-active');
      popupDataAnalytics('open', 'Search', mobileSearchOpencount);
    }
  });

  const navEl = thisBlock.querySelector('.siteheader-mobile-wrapper > nav');

  const l0Links = Array.from(thisBlock.querySelectorAll('.siteheader-has-subnav'));
  l0Links.forEach((link, index) => {
    navArr.push({
      index,
      isActive: false,
      link,
      subnav: link.nextElementSibling,
    });
  });

  navArr.forEach((liObj) => {
    liObj.link.ariaHasPopup = 'listbox';
    liObj.link.addEventListener('click', (event) => {
      event.preventDefault();
      navClicks(liObj, navArr, navMaskEl);
    });
  });

  const focusableLinks = Array.from(
    thisBlock.querySelectorAll('.siteheader-mobile-wrapper nav>ul> li > a'),
  );

  focusableLinks.forEach((liLink) => {
    liLink.addEventListener('keyup', (event) => {
      if (event.key === 'Tab') {
        let found = false;
        for (let navCount = 0; navCount < focusableLinks.length; navCount += 1) {
          const subnavEl = focusableLinks[navCount].parentNode.querySelector('.siteheader-subnav');
          if (
            !focusableLinks[navCount].isSameNode(liLink) &&
            subnavEl &&
            getComputedStyle(subnavEl).display === 'block'
          ) {
            found = true;
            break;
          }
        }
        if (found) {
          setTimeout(() => {
            liLink.dispatchEvent(new Event('click'));
          }, 300);
        }
        if (!liLink.parentNode.querySelector('.siteheader-subnav')) {
          closeAllNavItems(navArr, navMaskEl);
        }
      }
    });
  });

  navCtaEl?.addEventListener('click', () => {
    if (searchCtaEl.classList.contains(activeCls)) {
      searchCtaEl.dispatchEvent(new MouseEvent('click'));
    }
    if (navCtaEl.classList.contains(activeCls)) {
      navCtaEl.classList.remove(activeCls);
      navEl.classList.remove(activeCls);
      bodyElem.classList.remove('siteheader-nav-active');
      closeAllNavItems(navArr, navMaskEl);
      popupDataAnalytics('close', 'mobile_navigation', mobileNavOpencount);
    } else {
      mobileNavOpencount += 1;
      bodyElem.classList.add('siteheader-nav-active');
      navCtaEl.classList.add(activeCls);
      navEl.classList.add(activeCls);
      popupDataAnalytics('open', 'mobile_navigation', mobileNavOpencount);
    }
  });

  const closeOnSomeInteractions = () => {
    if (loginCtaWrapEl?.classList.contains(activeCls)) {
      loginCtaWrapEl?.querySelector(':scope > button').dispatchEvent(new MouseEvent('click'));
    }
    if (logoutCtaWrapEl?.classList.contains(activeCls)) {
      logoutCtaWrapEl?.querySelector(':scope > button').dispatchEvent(new MouseEvent('click'));
    }
    if (document.querySelector(`.siteheader-nav-mask.${activeCls}`)) {
      closeAllNavItems(navArr, navMaskEl);
    }
    if (document.querySelector('.siteheader-blog-has-subnav-active')) {
      closeAllBlogMenuItems();
    }
  };

  window.addEventListener('scroll', () => {
    closeOnSomeInteractions();
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      const newWindowWidth = window.outerWidth;
      const newWindowHeight = window.outerHeight;
      if (
        windowWidth !== newWindowWidth &&
        ((windowWidth > windowHeight && newWindowWidth <= newWindowHeight) ||
          (windowWidth < windowHeight && newWindowWidth >= newWindowHeight))
      ) {
        windowWidth = newWindowWidth;
        windowHeight = newWindowHeight;
        closeAllNavItems(navArr, navMaskEl);
        closeAllBlogMenuItems();
      }
    }, 100),
  );

  document.addEventListener('click', (event) => {
    [
      document.querySelector(`.siteheader-mobile-wrapper nav > ul.${activeCls}`),
      document.querySelector(`.siteheader-login-wrapper.${activeCls}`),
      document.querySelector(`.siteheader-logout-wrapper.${activeCls}`),
      document.querySelector('.siteheader-blog-nav ul.siteheader-blog-has-subnav-active'),
    ].forEach((container) => {
      if (container && container !== event.target && !container.contains(event.target)) {
        closeAllNavItems(navArr, navMaskEl);
        closeAllBlogMenuItems();
        if (loginWrapper && loginCtaWrapEl && loginCtaWrapEl.classList.contains(activeCls)) {
          loginWrapper
            .querySelector('.siteheader-login-wrapper-cta > button')
            .dispatchEvent(new MouseEvent('click'));
        }
        if (logoutWrapper && logoutCtaWrapEl && logoutCtaWrapEl.classList.contains(activeCls)) {
          logoutWrapper
            .querySelector('.siteheader-logout-wrapper-cta > button')
            .dispatchEvent(new MouseEvent('click'));
        }
      }
    });
    // Update aria-expanded attribute when dropdown is toggled
    const toggledLink = event.target.closest('.siteheader-blog-has-subnav');
    if (toggledLink) {
      const isExpanded = toggledLink.getAttribute('aria-expanded') === 'true';
      toggledLink.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeAllNavItems(navArr, navMaskEl);
      closeAllBlogMenuItems();
      if (loginWrapper && loginCtaWrapEl && loginCtaWrapEl.classList.contains(activeCls)) {
        loginWrapper
          .querySelector('.siteheader-login-wrapper-cta > button')
          .dispatchEvent(new MouseEvent('click'));
      }
      if (logoutWrapper && logoutCtaWrapEl && logoutCtaWrapEl.classList.contains(activeCls)) {
        logoutWrapper
          .querySelector('.siteheader-logout-wrapper-cta > button')
          .dispatchEvent(new MouseEvent('click'));
      }
    }
    if (event.key === 'Tab' && !event.target.closest('.siteheader-mobile-wrapper nav')) {
      closeAllNavItems(navArr, navMaskEl);
    }
    if (event.key === 'Tab' && !event.target.closest('.siteheader-blog-bottom-wrapper')) {
      closeAllBlogMenuItems();
    }
  });
};

export { addEvents, addAccountEvents };
