const generateSkip = (fragment) => {
  const thisBlock = fragment?.querySelector('.skip-to-content-container');
  const headerWrapper = document.querySelector('.header-wrapper');

  // TODO: REVIEW THIS:
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.id = 'maincontent';
  }

  const mainContent = document.querySelector('#maincontent');

  // const mainContent = true;
  const bodyEl = document.body;
  if (thisBlock && bodyEl && mainContent) {
    const anchorLink = document.createElement('a');
    const pTag = thisBlock.querySelector('p');
    if (pTag) {
      anchorLink.innerHTML = pTag.innerHTML;
      anchorLink.setAttribute('href', '#maincontent');
      anchorLink.addEventListener('focus', () => {
        thisBlock.classList.add('skip-to-content-focus');
        headerWrapper?.classList.add('skip-to-content-open');
      });
      anchorLink.addEventListener('blur', () => {
        thisBlock.classList.remove('skip-to-content-focus');
        headerWrapper?.classList.remove('skip-to-content-open');
      });
      anchorLink.addEventListener('click', (event) => {
        event.preventDefault();
        const main = document.querySelector('main');
        const focusableElements = main.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      });
      anchorLink.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const main = document.querySelector('main');
          const focusableElements = main.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      });
      pTag.replaceWith(anchorLink);
    }
    bodyEl.insertBefore(thisBlock, bodyEl.firstChild);
  }
};

export default generateSkip;
