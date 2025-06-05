import { setEqualHeights } from '../../scripts/tools.js';

const hideOnMobile = (col) => {
  if (parseInt(col.getAttribute('data-panelheight'), 10) > 450) {
    col.classList.add('panels-item-closed');
  } else {
    col.classList.remove('panels-item-closed');
  }
};

const doPanelResize = (children, topSections, bottomSections) => {
  [...topSections, ...bottomSections].forEach((el) => {
    el.removeAttribute('style');
  });
  if (window.matchMedia('(min-width: 768px)').matches) {
    setEqualHeights(topSections);
    setEqualHeights(bottomSections);
    children.forEach((col) => {
      col.removeAttribute('data-panelheight');
    });
  } else {
    children.forEach((col) => {
      col.setAttribute('data-panelheight', col.clientHeight);
      hideOnMobile(col);
    });
  }
};

export default async function decorate(block) {
  const children = Array.from(block.children);
  children.forEach((col) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('panels-col');
    col.classList.add('panels-item');
    col.parentNode.insertBefore(wrapper, col);
    wrapper.appendChild(col);

    const [topSection, bottomSection, labelSection, collapsibleSection] = col.children;
    topSection?.classList.add('panels-top-section');
    bottomSection?.classList.add('panels-bottom-section');
    collapsibleSection?.classList.add('panels-toggle-section');

    if (labelSection?.children.length) {
      col.classList.add('panels-item-has-label');
      labelSection.classList.add('panels-label-section');
    }
    if (collapsibleSection?.children.length) {
      collapsibleSection.classList.add('panels-toggle-section-auto');
      const [toggleOpenEl, toggleCloseEl] = collapsibleSection.children;
      const toggleOpenBtn = document.createElement('button');
      const toggleCloseBtn = document.createElement('button');
      toggleOpenBtn.className = 'panels-toggle-section-open';
      toggleCloseBtn.className = 'panels-toggle-section-close';
      toggleOpenBtn.innerHTML = toggleOpenEl.innerHTML;
      toggleCloseBtn.innerHTML = toggleCloseEl.innerHTML;
      toggleOpenEl.remove();
      toggleCloseEl.remove();
      collapsibleSection.append(toggleOpenBtn);
      collapsibleSection.append(toggleCloseBtn);
      toggleOpenBtn.addEventListener('click', () => {
        col.closest('.panels-item').classList.remove('panels-item-closed');
      });
      toggleCloseBtn.addEventListener('click', () => {
        col.closest('.panels-item').classList.add('panels-item-closed');
      });
    }
  });
  const topSections = Array.from(block.querySelectorAll('.panels-top-section'));
  const bottomSections = Array.from(block.querySelectorAll('.panels-bottom-section'));
  setTimeout(() => {
    doPanelResize(children, topSections, bottomSections);
  }, 1000);
  window.addEventListener('resize', () => {
    setTimeout(() => {
      doPanelResize(children, topSections, bottomSections);
    }, 1000);
  });
}
