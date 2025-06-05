export default async function decorate(block) {
  const parentEl = block.closest('.page-selector-wrapper');
  const selectedEm = block.querySelector('em');
  const notselected = block.querySelector('.button-container');

  if (selectedEm && (selectedEm.textContent || '').toLowerCase() === 'selected') {
    const linkEl = selectedEm.closest('div').querySelector('a');
    linkEl?.classList.add('page-selector-active');
    linkEl?.setAttribute('aria-label', `${linkEl.textContent} checked`);
  }
  if (notselected) {
    const notcheck = notselected.closest('div').querySelector('a');
    notcheck?.setAttribute('aria-label', `${notcheck.textContent} not checked`);
  }

  const mainEl = document.querySelector('main');
  const breadcrumbsEl = document.querySelector('.breadcrumbs');

  if (breadcrumbsEl) {
    breadcrumbsEl.parentNode.insertBefore(parentEl, breadcrumbsEl.nextSibling);
  } else {
    mainEl.insertBefore(parentEl, mainEl.firstChild);
    parentEl.classList.add('page-selector-active');
  }
}
