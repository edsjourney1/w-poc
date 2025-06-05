const { computePosition, flip, shift, offset, arrow } = window.FloatingUIDOM;

const tooltipComponents = Array.from(document.querySelectorAll('.tooltip'));
const tooltipsBlocksArr = [];
const tooltipsMainArr = [];

let areTooltipsCounted = false;

const updateTooltipPosition = (obj) => {
  computePosition(obj.link, obj.tooltipEl, {
    placement: 'top',
    middleware: [offset(6), flip(), shift({ padding: 5 }), arrow({ element: obj.arrowEl })],
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(obj.tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    const { x: arrowX, y: arrowY } = middlewareData.arrow;

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]];
    Object.assign(obj.arrowEl.style, {
      left: arrowX ? `${arrowX}px` : '',
      top: arrowY ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    });
  });
};

const hideTooltip = (obj) => {
  obj.tooltipEl.classList.remove('tooltip-wrapper-active');
  obj.isActive = false;
  obj.tooltipEl.setAttribute('aria-hidden', 'true');
  obj.tooltipEl.style.display = 'none';
};

const showTooltip = (obj) => {
  tooltipsMainArr.forEach((tEl) => {
    if (obj.index !== tEl.index) {
      hideTooltip(tEl);
    }
  });
  obj.tooltipEl.classList.add('tooltip-wrapper-active');
  obj.isActive = true;
  obj.tooltipEl.setAttribute('aria-hidden', 'false');
  obj.tooltipEl.style.display = 'block';
  const tooltipIdx = obj.tooltipEl.children[0].children[0].children[0];
  tooltipIdx.setAttribute('tabindex', '0');
  updateTooltipPosition(obj);
};

const initializeTooltips = () => {
  const allTooltipLinks = Array.from(document.querySelectorAll('a[href^="#tooltip-"]'));
  const tooltipArr = [];
  let tooltipNode;
  allTooltipLinks.forEach((href) => {
    tooltipNode = tooltipsBlocksArr.find((el) =>
      el.classList.contains(href.getAttribute('href').substring(1)),
    );
    const linkCta = document.createElement('button');

    linkCta.innerHTML = href.innerHTML;
    linkCta.dataset.href = href.href;
    linkCta.className = `${href.className} tooltip-btn-hidden`;
    linkCta.style.cssText = href.style.cssText;

    href.replaceWith(linkCta);

    const tooltipObj = {
      link: linkCta,
      tooltipEl: tooltipNode ? tooltipNode.parentNode : null,
    };
    tooltipArr.push(tooltipObj);
  });

  setTimeout(() => {
    tooltipArr.forEach((obj, index) => {
      if (obj.tooltipEl && obj.link) {
        const genId = `tooltip_${Math.random().toString(16).slice(2)}_${index}`;
        obj.link.classList.add('tooltip-link');
        obj.link.setAttribute('aria-describedby', genId);
        obj.tooltipEl.setAttribute('role', 'tooltip');
        obj.tooltipEl.setAttribute('id', genId);

        const arrowEl = document.createElement('div');
        arrowEl.classList.add('tooltip-arrow');
        obj.tooltipEl.append(arrowEl);
        obj.arrowEl = arrowEl;
        obj.index = index;
        obj.isActive = false;

        updateTooltipPosition(obj);
        obj.link.classList.remove('tooltip-btn-hidden');
        obj.link.addEventListener('click', (event) => {
          event.stopPropagation();
          showTooltip(obj);
        });

        tooltipsMainArr.push(obj);
      }
    });
    document.addEventListener('click', (event) => {
      tooltipsMainArr.forEach((tEl) => {
        if (!event.composedPath().includes(tEl.tooltipEl) && tEl.isActive) {
          hideTooltip(tEl);
        }
      });
    });
    document.addEventListener('keydown', (event) => {
      tooltipsMainArr.forEach((tEl) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
          hideTooltip(tEl);
        }
      });
    });
  }, 100);
};

export default async function decorate(block) {
  if (computePosition && flip && shift && offset && arrow) {
    const thisblock = block;
    tooltipsBlocksArr.push(thisblock);
    if (!areTooltipsCounted && tooltipComponents.length === tooltipsBlocksArr.length) {
      areTooltipsCounted = true;
      initializeTooltips();
    }
  }
}
