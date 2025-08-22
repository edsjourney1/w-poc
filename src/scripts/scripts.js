import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
  loadPublishedDate,
  loadExternalPopup,
  loadCommonFragments,
  loadScript,
  toCamelCase,
  toClassName,
} from './aem.js';

import decorateExternalImages from './externalImage.js';
import { orderlist, scrollIdlink, windowUrlDetails } from './tools.js';

const AUDIENCES = {
  mobile: () => window.innerWidth < 752,
  desktop: () => window.innerWidth >= 752,
  // us: async () => (await geoPromise).region === 'us',
  // eu: async () => (await geoPromise).region === 'eu',
};

// eslint-disable-next-line import/no-cycle
// import initAccessibilityMode from
// '../tools/sidekick/plugins/accessibility-mode/accessibility-mode.js';
// let isA11yModeActive = false;

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
export function getAllMetadata(scope) {
  return [
    ...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`),
  ].reduce((res, meta) => {
    const id = toClassName(
      meta.name
        ? meta.name.substring(scope.length + 1)
        : meta.getAttribute('property').split(':')[1],
    );
    res[id] = meta.getAttribute('content');
    return res;
  }, {});
}

const pluginContext = {
  getAllMetadata,
  getMetadata,
  loadCSS,
  loadScript,
  sampleRUM,
  toCamelCase,
  toClassName,
};

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  /*eslint-disable */
  // eslint-disable-next-line no-bitwise
  if (
    // eslint-disable-next-line no-bitwise
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
  /* eslint-enable */
}

/**
 * create an element.
 * @param {string} tagName the tag for the element
 * @param {object} props properties to apply
 * @param {string|Element} html content to add
 * @returns the element
 */

export function createElement() {
  // tagName, props, html
  return null;
  //   const elem = document.createElement(tagName);
  //   if (props) {
  //     Object.keys(props).forEach((propName) => {
  //       const val = props[propName];
  //       if (propName === 'class') {
  //         const classesArr = typeof val === 'string' ? [val] : val;
  //         elem.classList.add(...classesArr);
  //       } else {
  //         elem.setAttribute(propName, val);
  //       }
  //     });
  //   }
  //   if (html) {
  //     const appendEl = (el) => {
  //       if (el instanceof HTMLElement || el instanceof SVGElement) {
  //         elem.append(el);
  //       } else {
  //         elem.insertAdjacentHTML('beforeend', el);
  //       }
  //     };

  //     if (Array.isArray(html)) {
  //       html.forEach(appendEl);
  //     } else {
  //       appendEl(html);
  //     }
  //   }

  //   return elem;
  // }

  // const accessibilityMode = async (e) => {
  //   const pluginButton = e.target.shadowRoot.querySelector('plugin-action-bar')
  //     ? e.target.shadowRoot
  //       .querySelector('plugin-action-bar')
  //       .shadowRoot.querySelector('.accessibility-mode')
  //     : e.target.shadowRoot.querySelector('.accessibility-mode > button');

  //   isA11yModeActive = !isA11yModeActive;

  //   if (isA11yModeActive) {
  //     pluginButton.style.backgroundColor = '#4e9a17';

  //     pluginButton.style.color = '#fff';
  //   } else {
  //     pluginButton.removeAttribute('style');
  //   }

  //   document.querySelector('body').classList.toggle('accessibility-mode-active');

  //   await initAccessibilityMode(isA11yModeActive);
  // };

  // let sk = document.querySelector('aem-sidekick') || document.querySelector('helix-sidekick');

  // if (sk) {
  //   sk.addEventListener('custom:accessibility-mode', accessibilityMode);
  // } else {
  //   document.addEventListener(
  //     'sidekick-ready',
  //     () => {
  //       sk = document.querySelector('aem-sidekick') || document.querySelector('helix-sidekick');
  //       sk.addEventListener('custom:accessibility-mode', accessibilityMode);
  //     },
  //     {
  //       once: true,
  //     },
  //   );
}

function updateLists() {
  const allLiItems = Array.from(document.querySelectorAll('li:first-child'));
  let olType = 1;
  let ulType = 'disc';
  allLiItems.forEach((liItem) => {
    const textContent = liItem.innerHTML || liItem.textContent;
    const foundPattern = (textContent.match(/#.*?#/g) || [])[0];
    if (foundPattern) {
      const foundPatternArr = foundPattern.substring(1, foundPattern.length - 1).split('--');
      if (foundPatternArr[0] === 'type') {
        switch (foundPatternArr[1]) {
          case 'A':
            olType = 'A';
            break;
          case 'a':
            olType = 'a';
            break;
          case 'I':
            olType = 'I';
            break;
          case 'i':
            olType = 'i';
            break;
          case 'solid':
            ulType = 'disc';
            break;
          case 'circle':
            ulType = 'circle';
            break;
          case 'square':
            ulType = 'square';
            break;
          default:
            break;
        }
        liItem.closest('ol')?.setAttribute('type', olType);
        liItem.closest('ul')?.setAttribute('type', ulType);
        if (foundPattern.indexOf('first-letter-bold') > -1) {
          liItem.closest('ol')?.classList.add('first-letter-bold');
          liItem.closest('ul')?.classList.add('first-letter-bold');
        }
        // if (foundPatternArr[2] === 'start') {
        //   liItem.closest('ol')?.setAttribute('start', foundPatternArr[3] || 1);
        // }

        liItem.innerHTML = liItem.innerHTML.replace(/#.*?#/gi, '');
      }
    }
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // do nothing
  }
}
function autolinkModals() {
  // doc is rceived as argument of function
  // doc.addEventListener('click', async (e) => {
  //   const origin = e.target.closest('a');
  //   if (origin && origin.href && origin.href.includes('/modals/')) {
  //     e.preventDefault();
  //     const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
  //     openModal(origin.href);
  //   }
  // });
}
/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}
// Scroll link
window.addEventListener('load', () => {
  const getHashParameter = window.location.hash;
  let element;
  if (getHashParameter) {
    element = document.querySelector(getHashParameter);
  }
  if (element) {
    let headerOffset;
    const screenWidth = window.outerWidth;
    switch (true) {
      case screenWidth >= 1920:
        // Desktop
        headerOffset = 170;
        break;
      case screenWidth >= 1024:
        // Laptop
        headerOffset = 170;
        break;
      case screenWidth >= 480:
        // Tablet
        headerOffset = 90;
        break;
      default:
        // Mobile
        headerOffset = 85;
    }
    setTimeout(() => {
      window.scrollTo({
        behavior: 'smooth',
        top: element.getBoundingClientRect().top + window.scrollY - headerOffset,
      });
    }, 500);
  }
});

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateExternalImages(main);
  // decorateExternalImages(main, '//External Image//');
  orderlist();
  scrollIdlink();
}
/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  if (
    windowUrlDetails.origin.indexOf('localhost') < 0 &&
    (getMetadata('experiment') ||
      Object.keys(getAllMetadata('content')).length ||
      Object.keys(getAllMetadata('audience')).length)
  ) {
    /*eslint-disable */
    // eslint-disable-next-line import/no-relative-packages
    const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
    await runEager(
      document,
      {
        audiences: AUDIENCES,
        campaignsMetaTagPrefix: 'content',
        campaignsQueryParameter: 'content',
      },
      pluginContext,
    );
    /* eslint-enable */
  }

  doc.documentElement.lang = 'en';
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
  loadPublishedDate();
  decorateTemplateAndTheme();
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    doc.body.dataset.breadcrumbs = true;
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    doc.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
  sampleRUM.enhance();
  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
      updateLists();
    }
  } catch (e) {
    // do nothing
  }
}
/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);
  const main = doc.querySelector('main');
  const bodyElem = doc.querySelector('body');
  await loadSections(main);
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) {
    element.scrollIntoView();
  }
  loadCommonFragments(bodyElem);
  loadExternalPopup(bodyElem);
  loadFonts();
  if (
    windowUrlDetails.origin.indexOf('localhost') < 0 &&
    (getMetadata('experiment') ||
      Object.keys(getAllMetadata('content')).length ||
      Object.keys(getAllMetadata('audience')).length)
  ) {
    /*eslint-disable */
    // eslint-disable-next-line import/no-relative-packages
    const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
    await runLazy(
      document,
      {
        audiences: AUDIENCES,
        campaignsMetaTagPrefix: 'content',
        campaignsQueryParameter: 'content',
      },
      pluginContext,
    );
    /* eslint-enable */
  }
}
/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}
loadPage();
console.log("Sheet Less testing")
