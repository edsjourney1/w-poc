// export const formatLanguage = (htmlStr) => {
//   const attrProtected = htmlStr.replace(
//     /(\w+="[^"]*?)(\d[\d=-]*\d)([^"]*?")/g,
//     (match, p1, p2, p3) => `${p1}__PROTECTED_${p2}__${p3}`,
//   );

//   const container = document.createElement('div');
//   container.innerHTML = attrProtected;

//   // Step 3: Recursively walk through text nodes and wrap matching numbers
//   function wrapNumbersInTextNodes(node) {
//     if (node.nodeType === Node.TEXT_NODE) {
//       const regex = /\d[\d=-]*\d/g;
//       if (regex.test(node.nodeValue)) {
//         const frag = document.createDocumentFragment();
//         let lastIndex = 0;
//         let match;

//         regex.lastIndex = 0;
//         /* eslint-disable */
//         while ((match = regex.exec(node.nodeValue)) !== null) {
//           const before = node.nodeValue.slice(lastIndex, match.index);
//           const span = document.createElement('span');
//           span.className = 'fontfamily-roboto';
//           span.textContent = match[0];
//           if (before) frag.appendChild(document.createTextNode(before));
//           frag.appendChild(span);
//           lastIndex = regex.lastIndex;
//         }
//         /* eslint-enable */
//         const after = node.nodeValue.slice(lastIndex);
//         if (after) frag.appendChild(document.createTextNode(after));
//         node.replaceWith(frag);
//       }
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       node.childNodes.forEach(wrapNumbersInTextNodes);
//     }
//   }

//   wrapNumbersInTextNodes(container);

//   return container.innerHTML.replace(/__PROTECTED_(\d[\d=-]*\d)__/g, (_, num) => num);
// };

const formatDate = (date) => {
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${mm}/${dd}/${date.getUTCFullYear()}`;
};

const convertDateNumber = (value, excelSystem = 'windows') => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid input: must be a number.');
  }

  if (value >= 1000000000) {
    const date = new Date(value * 1000);
    return formatDate(date);
  }

  const isMac = excelSystem.toLowerCase() === 'mac';
  const baseDate = new Date(Date.UTC(isMac ? 1904 : 1899, isMac ? 0 : 11, isMac ? 1 : 30));
  const correctedSerial = !isMac && value >= 60 ? value - 1 : value;

  const resultDate = new Date(baseDate.getTime() + correctedSerial * 86400000);
  resultDate.setUTCHours(0, 0, 0, 0);
  resultDate.setDate(resultDate.getDate() + 1);

  return formatDate(resultDate);
};

export const excelDateToDate = (date) => convertDateNumber(Number(date));

export const getAssetId = (url) =>
  (url.split('/') || []).find((item) => item.startsWith('urn:aaid:aem:')) || '';

export const windowUrlDetails = new URL(window.location.href);

export const setEqualHeights = (elements) => {
  const maxHeight = Math.max(...elements.map((el) => el.clientHeight));
  elements.forEach((el) => {
    el.style.height = `${maxHeight}px`;
  });
};

export const getImgFileExtension = (url) => {
  const extensionValid = (url || '').split(/[#?]/)[0].split('.').pop().trim();
  const geturlvalid = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
    extensionValid.toLowerCase(),
  );
  return geturlvalid ? extensionValid : '';
};

export const getDocFileExtension = (url) => {
  const extensionValid = (url || '').split(/[#?]/)[0].split('.').pop().trim();
  const geturlvalid = [
    'pdf',
    'xslx',
    'docx',
    'txt',
    'rtf',
    'csv',
    'exe',
    'key',
    'pps',
    'ppt',
    'pptx',
    '7z',
    'pkg',
    'tar',
    'zip',
    'avi',
    'mov',
    'mp4',
    'mpg',
    'mpeg',
    'wmv',
    'midi',
    'mp3',
    'wav',
    'wma',
    'gif',
    'jpeg',
    'jpg',
    'png',
    'svg',
    'webp',
  ].includes(extensionValid.toLowerCase());
  return geturlvalid ? extensionValid : '';
};

export const scrollIdlink = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    // eslint-disable-next-line func-names
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this?.getAttribute('href')?.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        let headerOffset;
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1920) {
          // Desktop
          headerOffset = 170;
        } else if (screenWidth >= 1024) {
          // Laptop
          headerOffset = 170;
        } else if (screenWidth >= 480) {
          // Tablet
          headerOffset = 90;
        } else {
          // Mobile
          headerOffset = 85;
        }
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
};

export const orderlist = () => {
  const orderedWrapperList = document.querySelectorAll('.heading-ordered');
  const unorderedWrappersList = document.querySelectorAll('.heading-unordered');
  if (unorderedWrappersList) {
    unorderedWrappersList.forEach((unorderedWrapper) => {
      const unorderedDiv = unorderedWrapper.children[0];
      const ul = document.createElement('ul');
      const unorderChildren = Array.from(unorderedDiv.children);
      unorderChildren.forEach((child, index) => {
        if (/^H[2-6]$/.test(child.tagName)) {
          const li = document.createElement('li');
          li.appendChild(child);
          while (
            unorderChildren[index + 1] &&
            !/^H[2-6]$/.test(unorderChildren[index + 1].tagName)
          ) {
            li.appendChild(unorderChildren[index + 1]);
            // eslint-disable-next-line no-plusplus, no-param-reassign
            index++;
          }
          ul.appendChild(li);
          unorderedDiv.appendChild(ul);
        }
      });
    });
  }
  if (orderedWrapperList) {
    orderedWrapperList.forEach((orderedWrapper) => {
      const orderedDiv = orderedWrapper.children[0];
      const ol = document.createElement('ol');
      const orderChildren = Array.from(orderedDiv.children);
      orderChildren.forEach((child, index) => {
        if (/^H[2-6]$/.test(child.tagName)) {
          const li = document.createElement('li');
          li.appendChild(child);
          while (orderChildren[index + 1] && !/^H[2-6]$/.test(orderChildren[index + 1].tagName)) {
            li.appendChild(orderChildren[index + 1]);
            // eslint-disable-next-line no-plusplus, no-param-reassign
            index++;
          }
          ol.appendChild(li);
          orderedDiv.appendChild(ol);
        }
      });
    });
  }
};

/* Marketo Form GLobal */

export const debounce = (func, delay) => {
  let timeoutId;
  /* eslint-disable */
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
  /* eslint-enable */
};

const removeStyleAttributes = (form) => {
  if (form.style.display !== 'none') {
    const elementsWithStyle = form.querySelectorAll('[style]');
    form.removeAttribute('style');
    elementsWithStyle.forEach((element) => {
      if (
        !(
          element.classList.contains('mktoError') ||
          element.classList.contains('mktoErrors') ||
          element.classList.contains('modal') ||
          element.classList.contains('mkto-error-block') ||
          element.classList.contains('mktoFormRow') ||
          element.id === 'hidden-content' ||
          element.id === 'ty-msg' ||
          element.id === 'guide-link-ia' ||
          element.id === 'guide-link-sd'
        )
      ) {
        element.removeAttribute('style');
      }
    });
  }
};

const clickEventHandler = (form) => {
  removeStyleAttributes(form);
  const labels = form.querySelectorAll('.mktoRequiredField label:has(.mktoAsterix)');
  labels.forEach((label) => {
    const childNodes = Array.from(label.childNodes);
    let asteriskFirst = false;
    for (let i = 0; i < childNodes.length; i += 1) {
      const node = childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('.mktoAsterix')) {
        asteriskFirst = true;
      }
      if (node.nodeType === Node.TEXT_NODE && asteriskFirst) {
        const asterisk = label.firstChild;
        const textNode = label.lastChild;
        label.textContent = '';
        label.appendChild(textNode);
        label.appendChild(asterisk);
        break;
      }
    }
  });
};

export const marketoFn = (block, formIdEl) => {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  const cForm = document.createElement('form');
  cForm.classList.add('eds-mkto-form');
  const divIDkebab = formIdEl.innerHTML.toLowerCase().replace('_', '-');
  const authoredFormId = formIdEl.innerHTML.split('_')[1];
  cForm.classList.add(divIDkebab);
  cForm.setAttribute('id', formIdEl.innerHTML);
  block.append(loader);
  block.append(cForm);
  if (window.MktoForms2) {
    setTimeout(() => {
      const formId = parseInt(authoredFormId, 10);

      /* inject:marketo */
      window.MktoForms2.loadForm('//899-BTB-436.mktoweb.com', '899-BTB-436', formId);
      /* endinject */

      window.MktoForms2.whenReady((prop) => {
        // prop
        const mktoform = prop.getFormElem();
        if ((mktoform || [])[0]) {
          mktoform[0].removeAttribute('style');
          const allchildren = mktoform[0].querySelectorAll('*');
          allchildren.forEach((elm) => {
            elm.removeAttribute('style');
          });
          const asterisks = mktoform[0].querySelectorAll(
            '.mktoRequiredField .mktoAsterix:first-child',
          );
          asterisks.forEach((asterisk) => {
            const label = asterisk.parentElement;
            const textNode = label.lastChild;
            if (textNode.nodeType === Node.TEXT_NODE) {
              label.textContent = '';
              label.appendChild(textNode);
              label.appendChild(asterisk);
            }
          });
          loader.style.display = 'none';
          mktoform[0].style.display = 'flex';
          window.addEventListener(
            'resize',
            debounce(() => removeStyleAttributes(mktoform[0]), 100),
          );
          mktoform[0].addEventListener(
            'click',
            debounce(() => clickEventHandler(mktoform[0]), 100),
          );
          if (
            block.hasAttribute('data-id') ||
            block.parentElement.parentElement.hasAttribute('data-id')
          ) {
            const id = block.hasAttribute('data-id')
              ? block.getAttribute('data-id')
              : block.parentElement.parentElement.getAttribute('data-id');
            block.setAttribute('id', id);
            block.style.scrollMarginTop = `${document.querySelector('.header').clientHeight}px`;
          }
          block.querySelector('.mkto-error-block').style.scrollMarginTop = `${
            document.querySelector('.header').clientHeight
          }px`;
          block
            .querySelector('.mktoButtonRow button[type="submit"]')
            .addEventListener('click', () => {
              setTimeout(() => {
                if (block.querySelector('.mkto-error-block').children.length > 0) {
                  block.querySelector('.mkto-error-block').scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }, 500);
            });
          if (window.location.href.includes('/medicare/iowa')) {
            block.querySelector('#medicare-iowa').closest('.mktoFormRow').style.display = 'flex';
          }
          if (window.location.href.includes('/medicare/south-dakota')) {
            block.querySelector('#medicare-south-dakota').closest('.mktoFormRow').style.display =
              'flex';
          }
          if (
            window.location.href.includes('/marketing/medicare') &&
            !window.location.href.includes('/marketing/medicareguide')
          ) {
            block.querySelector('#marketing-medicare').closest('.mktoFormRow').style.display =
              'flex';
          }
          if (window.location.href.includes('/marketing/medicareguide')) {
            block.querySelector('#marketing-medicareguide').closest('.mktoFormRow').style.display =
              'flex';
          }
          if (window.location.href.includes('/medicare/under-65')) {
            block.querySelector('#medicare-under-65').closest('.mktoFormRow').style.display =
              'flex';
          }
          if (window.location.href.includes('/medicare/over-65')) {
            block.querySelector('#medicare-over-65').closest('.mktoFormRow').style.display = 'flex';
          }
          if (window.location.href.includes('/medicare-explained/medicare-questions')) {
            block.querySelector('#medicare-questions').closest('.mktoFormRow').style.display =
              'flex';
          }
          if (window.location.href.includes('/shop-medicare-plans')) {
            block.querySelector('#shop-medicare-plans').closest('.mktoFormRow').style.display =
              'flex';
          }
        }
      });
    }, 1000);
  }
};

/* SLIDE UP */
export const slideUp = (target, duration = 500) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = 'border-box';
  target.style.height = `${target.offsetHeight}px`;
  // eslint-disable-next-line no-unused-expressions
  target && target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

/* SLIDE DOWN */
export const slideDown = (target, duration = 500) => {
  target.style.removeProperty('display');
  // eslint-disable-next-line prefer-destructuring
  let display = window.getComputedStyle(target).display;
  if (display === 'none') {
    display = 'block';
  }
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  // eslint-disable-next-line no-unused-expressions
  target && target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.height = `${height}px`;
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};
