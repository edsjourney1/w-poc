import { analyticsModal, analyticsClick, analyticsNavigation } from '../../scripts/analytics.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { marketoFn } from '../../scripts/tools.js';

// extract html from the fragment
function decDialog(fragmentHeader, fragmentFooter) {
  return {
    dialogInnerHTML: fragmentHeader?.children[0]?.innerHTML,
    CloseHTML: fragmentHeader?.children[1]?.querySelector('p')?.innerHTML,
    ContinueHTML: fragmentFooter?.children[0]?.querySelector('p')?.innerHTML,
  };
}

function isMedAdvSection(link) {
  if (
    // link.includes('/shop/medicare/medicare-advantage/') ||
    // link.includes('/member/medicare-advantage/')
    link.includes('/medicare-advantage')
  ) {
    return true;
  }

  return false;
}

function isCobrandedWebsite(map, linkHref) {
  const linkUrl = new URL(linkHref);
  const urlDetail = map.get(linkUrl.origin);
  const size = urlDetail?.size;
  /* 
      ------ url detail -------
  {
    size:1,           size:2,
    domain:[""],      domain:["",""],
    path:[""],        path:["",""],
    service:[""]      service:["",""]
    path:[""]         path:["",""]
  }

  */
  const isMatch = urlDetail && size === 1 && urlDetail.path[0] === linkUrl.pathname;
  if (isMatch) {
    // undefined or true
    return {
      partner: urlDetail.partner[0],
      service: urlDetail.service[0],
      domain: urlDetail.domain[0],
    };
  }
  if (size > 1) {
    const pathLink = linkUrl.pathname;
    const index = urlDetail.path.indexOf(pathLink);
    if (index >= 0) {
      return {
        partner: urlDetail.partner[index],
        service: urlDetail.service[index],
        domain: urlDetail.domain[index],
      };
    }
  }

  return null;
}
function isContactURL(link) {
  return link.href.startsWith('mailto:') || link.href.startsWith('tel:');
}

function isInernaltoMedicare(mednonintURLsSet, link) {
  // when we are moving from medicare section to wellmark domain but non medicare section
  // and if the url is not included in the sheet
  if (link.nextElementSibling?.classList.contains('siteheader-subnav')) {
    return false;
  }
  const isExclusive = mednonintURLsSet.has(link.href);
  if (isExclusive) return false;
  const url = new URL(link.href);
  const isWellmarkDomain = url.origin === window.location.origin;
  return !isMedAdvSection(link.href) && isWellmarkDomain;
}

function isUrlExternal(link) {
  if (
    link.children[0]?.classList.contains('icon-regular--arrow-up-right-from-square') ||
    link.children[0]?.classList.contains('icon-solid--arrow-up-right-from-square') ||
    link.children[0]?.classList.contains('icon-solid--square-arrow-up-right') ||
    link.children[0]?.classList.contains('icon-arrow-up-right-from-square')
  ) {
    return true;
  }
  const nextElm = link.nextElementSibling;

  if (
    nextElm?.classList.contains('icon-arrow-up-right-from-square') ||
    nextElm?.classList.contains('icon-solid--arrow-up-right-from-square') ||
    nextElm?.classList.contains('icon-regular--arrow-up-right-from-square') ||
    nextElm?.classList.contains('icon-solid--square-arrow-up-right')
  ) {
    return true;
  }
  /* eslint-enable */
  if (
    nextElm?.classList.contains('fa-arrow-up-right-from-square') ||
    nextElm?.classList.contains('fa-square-arrow-up-right')
  ) {
    return true;
  }

  if (!nextElm) {
    const pElement = link.parentElement;
    if (pElement && pElement.children.length === 1 && pElement.children[0] === link) {
      // link is wrapped in strong/em
      const parentNext = pElement.nextElementSibling;
      const isIcon = parentNext?.tagName === 'SPAN' || parentNext?.tagName === 'ICON';

      if (
        isIcon &&
        (parentNext?.classList.contains('icon-arrow-up-right-from-square') ||
          parentNext?.classList.contains('icon-solid--arrow-up-right-from-square') ||
          parentNext?.classList.contains('icon-regular--arrow-up-right-from-square') ||
          parentNext?.classList.contains('icon-solid--square-arrow-up-right') ||
          parentNext?.classList.contains('fa-arrow-up-right-from-square'))
      ) {
        return true;
      }
    }
  }

  return false;
}
function isExternalPDF(link) {
  const url = new URL(link);
  const isLinkExternal = url.origin !== window.location.origin;
  const nextelm = link.nextElementSibling;
  if (nextelm && isLinkExternal) {
    if (
      nextelm.classList.contains('icon-solid--file-pdf') ||
      nextelm.classList.contains('icon-regular--file-pdf') ||
      nextelm.classList.contains('icon-file-pdf')
    ) {
      return true;
    }
  } else if (isLinkExternal) {
    const parent = link.parentElement;
    const parentSibling = parent.nextElementSibling;
    if (
      parentSibling &&
      (parentSibling.classList.contains('icon-solid--file-pdf') ||
        parentSibling.classList.contains('icon-regular--file-pdf') ||
        parentSibling.classList.contains('icon-file-pdf'))
    ) {
      return true;
    }
  }
  return false;
}
export default async function decorate() {
  const modalAnalytics = {
    open: {
      cobranded: 0,
      medicareexternal: 0,
      medicareinternal: 0,
      downloadmodal: 0,
    },
    close: {
      cobranded: 0,
      medicareexternal: 0,
      medicareinternal: 0,
      downloadmodal: 0,
    },
  };

  const bodyEl = document.querySelector('body');
  const formEL = document.createElement('p');
  // formID
  formEL.innerHTML = 'mktoForm_1157';

  // load all modal fragments
  const popupMetaCobranded = getMetadata('/content-fragments/modals/cobranded');
  const popupMetaMedicare = getMetadata('/content-fragments/modals/medicare-advantage');
  const popupMetaAdhoc = getMetadata('/content-fragments/modals/adhoc');

  const cobrandedPath = popupMetaCobranded
    ? new URL(popupMetaCobranded, window.location).pathname
    : '/content-fragments/modals/cobranded';

  const medicarePath = popupMetaMedicare
    ? new URL(popupMetaMedicare, window.location).pathname
    : '/content-fragments/modals/medicare-advantage';

  const adhocPath = popupMetaAdhoc
    ? new URL(popupMetaAdhoc, window.location).pathname
    : '/content-fragments/modals/adhoc';

  const cobrandedURLsMap = new Map();
  const medExtURLsSet = new Set();
  const medNonIntURLsSet = new Set();

  const isMedicalAdvantageSection = isMedAdvSection(window.location.href);

  const modalURLRes = await fetch('/modal-urls.json');

  const [cbrfrag, medfrag, adfrag] = await Promise.allSettled([
    loadFragment(cobrandedPath),
    loadFragment(medicarePath),
    loadFragment(adhocPath),
  ]);

  const cobrandedFragment = cbrfrag.value;
  const medicareAdvantageFragment = medfrag.value;
  const adhocFragment = adfrag.value;

  const bodyElem = document.querySelector('body');
  if (modalURLRes.ok) {
    const modalURLs = await modalURLRes.json();
    const { cobrandedurls, medicareExturls, medicareInturlsExclusion } = modalURLs;
    cobrandedurls.data.forEach((website) => {
      const url = new URL(website.url);
      //  http://www.abc.com/route?a=1&c=2
      //  map - "http://www.abc.com" :{"service","domain","partner",/route}

      const details = cobrandedURLsMap.get(url.origin);

      if (details) {
        details.size += 1;
        details.partner.push(`${website.partner.trim()}`);
        details.domain.push(`${website.domain.trim()}`);
        details.service.push(`${website.service.trim()}`);
        details.path.push(url.pathname);
        cobrandedURLsMap.set(url.origin, details);
      } else {
        cobrandedURLsMap.set(url.origin, {
          size: 1,
          service: [`${website.service.trim()}`],
          partner: [`${website.partner.trim()}`],
          domain: [`${website.domain.trim()}`],
          path: [url.pathname],
        });
      }
    });
    medicareExturls.data.forEach((website) => {
      const url = new URL(website.url);
      medExtURLsSet.add(url.origin);
    });
    medicareInturlsExclusion.data.forEach((website) => {
      try {
        /*eslint-disable */
        const url = new URL(website.url);
        medNonIntURLsSet.add(website.url);
      } catch (e) {
        medNonIntURLsSet.add(window.location.origin + website.url);
      }
      // medNonIntURLsSet.add(website.url);
    });
  }

  const [cobrandedHeader, cobrandedFooter] = Array.from(
    cobrandedFragment?.querySelector('.cobranded-modal-external')?.children || [],
  );
  const [medicareExternalHeader, medicareExternalFooter] = Array.from(
    medicareAdvantageFragment?.querySelector('.medadv-modal-external')?.children || [],
  );
  const [medicareInternalHeader, medicareInternalFooter] = Array.from(
    medicareAdvantageFragment?.querySelector('.medadv-modal-internal')?.children || [],
  );
  const externalDialogEl = document.createElement('dialog');
  const content = document.createElement('div');
  content.classList.add('content-box');
  externalDialogEl.append(content);
  const externalDialogClose = document.createElement('button');
  const externalDialogCancel = document.createElement('button');
  const externalDialogContinue = document.createElement('a');
  externalDialogClose.setAttribute('type', 'button');
  externalDialogClose.ariaLabel = 'Close';
  externalDialogClose.setAttribute('autofocus', true);
  externalDialogClose.classList.add('close-btn');
  externalDialogEl.classList.add('modal-popup');
  externalDialogContinue.classList.add('modal-popup-link');
  externalDialogCancel.classList.add('modal-popup-cancel');
  bodyElem.append(externalDialogEl);
  setTimeout(() => {
    const links = document.body.querySelectorAll('a');

    // const main = document.querySelector('main');
    // const links = main.querySelectorAll('a');
    /*eslint-disable */
    links.forEach((link) => {
      // link - <a href='...'>...</a>
      if (!link.href || isContactURL(link)) return;
      let exception = new URL(link.href);
      if (
        // exception.origin?.includes('wellmarkma1.destinationrx') ||
        // exception.origin?.includes('secure.healthx') ||
        exception.origin?.includes('digital-assets.wellmark.com')
      ) {
        // link.target = '_blank';
        return;
      }
      const isAdhocURL = adhocFragment && link.getAttribute('href')?.includes('#adhoc');
      const isDownloadFormURL = link?.getAttribute('href')?.includes('#downloadmodal-');
      const formID = isDownloadFormURL && link.getAttribute('href')?.split('-')[1];
      if (isDownloadFormURL) {
        // remove the authoring page link
        link.href = '#' + link.href.split('#')[1];
      }
      if (!isAdhocURL && !isDownloadFormURL && link.getAttribute('href').includes('#')) {
        // no modal action on jump links
        const url = new URL(link.href);
        const ismedicare = isMedAdvSection(window.location.href);
        if (url.origin === window.location.origin && !ismedicare) return;
      }

      const isCobranded =
        !isAdhocURL &&
        !isDownloadFormURL &&
        !isContactURL(link) &&
        cobrandedHeader &&
        isCobrandedWebsite(cobrandedURLsMap, link.href);

      // non-wellmark links
      const isMedicalAdvExt =
        !isCobranded &&
        isMedicalAdvantageSection &&
        !isAdhocURL &&
        !isDownloadFormURL &&
        !isContactURL(link) &&
        medicareExternalHeader &&
        medExtURLsSet.has(link.origin);
      // isExternaltoMedicare(medextURLs, link);

      // that will leave the medicare advantage section but still on wellmark
      const isMedicalAdvInt =
        !isCobranded &&
        isMedicalAdvantageSection &&
        !isAdhocURL &&
        !isDownloadFormURL &&
        !isContactURL(link) &&
        medicareInternalHeader &&
        isInernaltoMedicare(medNonIntURLsSet, link);

      const adhocName = isAdhocURL ? link.getAttribute('href')?.split('-')?.[1] : null;
      if (adhocName) {
        modalAnalytics.open['adhoc' + adhocName] = 0;
        modalAnalytics.close['adhoc' + adhocName] = 0;
      }
      const adhocModal = isAdhocURL && adhocFragment.querySelector(`.adhocname-${adhocName}`);
      const [adhocHeadertemp, adhocFootertemp] =
        isAdhocURL && adhocModal ? Array.from(adhocModal?.children) : [];

      if (isDownloadFormURL) {
        modalAnalytics.open['downloadmodal-' + formID] = 0;
        modalAnalytics.close['downloadmodal-' + formID] = 0;
        formEL.innerText = 'mktoForm_' + formID;
        const container = document.createElement('div');
        container.style.display = 'none';
        container.classList.add(
          'download-modal-container',
          'marketo-form',
          `download-form-container-${formID}`,
        );
        const issameForm = externalDialogEl.querySelector('.mktoform-' + formID);
        if (!issameForm) {
          document.body.append(container);
          marketoFn(container, formEL);
          externalDialogEl.append(container);
        }
      }
      if (!isCobranded && !isMedicalAdvExt && !isMedicalAdvInt) {
        const isExternal = isUrlExternal(link);
        const isExternalPDFlink = isExternalPDF(link);
        if (isExternal || isExternalPDFlink) {
          link.target = '_blank';
        }
      }
      if (isCobranded || isMedicalAdvExt || isMedicalAdvInt || isAdhocURL || isDownloadFormURL) {
        link.ariaHasPopup = 'dialog';
      }
      // --------- ON CLick ------------
      link.addEventListener('click', function (event) {
        if (!this.href) {
          return;
        }

        // if mail or phone number
        if (isContactURL(this)) {
          return;
        }

        if (
          !isCobranded &&
          !isMedicalAdvExt &&
          !isMedicalAdvInt &&
          !isAdhocURL &&
          !isDownloadFormURL
        ) {
          // if modal dialog need not to open,early return
          return;
        }
        event.preventDefault();
        let modalnameAnalytics = null;
        let modalimpressionaAnalytics = null;
        if (isDownloadFormURL) {
          externalDialogEl.setAttribute('modalName', `downloadmodal-${formID}`);
          externalDialogClose.innerHTML =
            '<span class="icon icon-solid--x"><i style="height:16px; width:16px" class="fa-solid fa-x" data-icon-name="regular--circle-xmark"></i></span>';
          content.innerHTML = '';
          externalDialogContinue.style.display = 'none';
          externalDialogCancel.style.display = 'none';
          const formContainer = externalDialogEl.querySelector(
            `.download-form-container-${formID}`,
          );
          formContainer.style.display = 'block';
          modalAnalytics.open['downloadmodal-' + formID] += 1;
          modalnameAnalytics = `downloadmodal-${formID}`;
          modalimpressionaAnalytics = modalAnalytics.open['downloadmodal-' + formID];
        }

        // if cobrandedURL
        if (isCobranded) {
          externalDialogEl.classList.add('cobranded-external');
          externalDialogEl.setAttribute('modalName', 'cobranded');
          const htmlobj = decDialog(cobrandedHeader, cobrandedFooter);
          // content.innerHTML = htmlobj.dialogInnerHTML;
          content.innerHTML = htmlobj.dialogInnerHTML
            .replaceAll('{{domain}}', isCobranded.domain)
            .replaceAll('{{partner}}', isCobranded.partner)
            .replaceAll('{{service}}', isCobranded.service);

          externalDialogClose.innerHTML = htmlobj.CloseHTML;
          externalDialogContinue.innerHTML = htmlobj.ContinueHTML;
          externalDialogContinue.target = '_blank';
          externalDialogContinue.href = this.href;
          externalDialogCancel.innerHTML = 'Cancel';
          modalAnalytics.open.cobranded += 1;
          modalnameAnalytics = 'cobranded';
          modalimpressionaAnalytics = modalAnalytics.open.cobranded;
        } else if (isMedicalAdvExt) {
          externalDialogEl.classList.add('medicare-external');
          externalDialogEl.setAttribute('modalName', 'medicareexternal');
          const htmlobj = decDialog(medicareExternalHeader, medicareExternalFooter);
          // externalDialogEl.innerHTML = htmlobj.dialogInnerHTML;
          content.innerHTML = htmlobj.dialogInnerHTML;
          externalDialogClose.innerHTML = htmlobj.CloseHTML;
          externalDialogContinue.innerHTML = htmlobj.ContinueHTML;
          externalDialogContinue.href = this.href;
          externalDialogContinue.setAttribute('target', '_blank');
          externalDialogCancel.innerHTML = 'Cancel';
          modalAnalytics.open.medicareexternal += 1;
          modalnameAnalytics = 'medicareexternal';
          modalimpressionaAnalytics = modalAnalytics.open.medicareexternal;
        } else if (isMedicalAdvInt) {
          externalDialogEl.classList.add('medicare-internal');
          externalDialogEl.setAttribute('modalName', 'medicareinternal');
          const htmlobj = decDialog(medicareInternalHeader, medicareInternalFooter);
          content.innerHTML = htmlobj.dialogInnerHTML;
          externalDialogClose.innerHTML = htmlobj.CloseHTML;
          externalDialogContinue.innerHTML = htmlobj.ContinueHTML;
          externalDialogContinue.target = '';
          externalDialogContinue.href = this.href;
          externalDialogCancel.innerHTML = 'Cancel';
          modalAnalytics.open.medicareinternal += 1;
          modalnameAnalytics = 'medicareinternal';
          modalimpressionaAnalytics = modalAnalytics.open.medicareinternal;
        } else if (isAdhocURL) {
          const cleanURL = this.href.replace(/#adhoc-[^/#?]*$/, '');
          externalDialogEl.setAttribute('modalName', `adhoc${adhocName}`);
          externalDialogEl.classList.add('adhoc');
          const htmlobj = decDialog(adhocHeadertemp, adhocFootertemp);
          content.innerHTML = htmlobj.dialogInnerHTML;
          externalDialogClose.innerHTML = htmlobj.CloseHTML;
          externalDialogContinue.setAttribute('modal', 'adhoc');
          externalDialogContinue.innerHTML = htmlobj.ContinueHTML;
          externalDialogContinue.href = cleanURL;
          externalDialogCancel.innerHTML = 'Cancel';
          modalAnalytics.open['adhoc' + adhocName] += 1;
          modalnameAnalytics = `adhoc${adhocName}`;
          modalimpressionaAnalytics = modalAnalytics.open['adhoc' + adhocName];
        }
        if (!isDownloadFormURL) {
          externalDialogContinue.style.display = 'flex';
          externalDialogCancel.style.display = 'flex';
        }
        externalDialogEl.append(externalDialogContinue);
        externalDialogEl.append(externalDialogCancel);
        externalDialogEl.append(externalDialogClose);
        externalDialogEl.showModal();
        try {
          analyticsModal({
            modal_action: 'open',
            modal_location: window.location.href,
            modal_name: modalnameAnalytics,
            modal_impression: modalimpressionaAnalytics,
          });
        } catch (e) {
          console.log('------------Analytics Error----------', e);
        }

        // }
      });
    });
    /* eslint-enable */

    // on outside click

    externalDialogEl.addEventListener('click', (e) => {
      const { left, right, top, bottom } = externalDialogEl.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
        if (clientX === 0 && clientY === 0) return;
        externalDialogEl.close();
      }
    });

    externalDialogEl.addEventListener('keydown', (e) => {
      // eslint-disable
      const modalname = externalDialogEl.getAttribute('modalname');
      const formID = modalname.startsWith('download') ? modalname.split('-')[1] : null;
      const firstInput = externalDialogEl.querySelector(`.download-form-container-${formID} input`);
      const form = externalDialogEl.querySelector(
        `.download-form-container-${formID} .mktoform-${formID}`,
      );
      const isFormSubmitted = form && window.getComputedStyle(form).display === 'none';
      const thnkyouMsganchors = externalDialogEl.querySelectorAll(
        `.download-form-container-${formID} .mkto-tymsg-block a`,
      );
      const thnkyouMsg = [...thnkyouMsganchors]?.filter((anchor) => {
        const style = window.getComputedStyle(anchor);
        return style.display !== 'none';
      });
      if (e.key === 'Tab') {
        // if there is form (continue/cancel button not present)
        if (firstInput && firstInput) {
          if (e.shiftKey) {
            if (isFormSubmitted) {
              if (document.activeElement === thnkyouMsg[0]) {
                e.preventDefault();
                externalDialogClose.focus();
                return;
              }
            }
            if (document.activeElement === firstInput) {
              e.preventDefault();
              externalDialogClose.focus();
            }
          } else if (document.activeElement === externalDialogClose) {
            e.preventDefault();
            if (isFormSubmitted) {
              thnkyouMsg[0]?.focus();
              return;
            }
            firstInput.focus();
          }
          return;
        }

        if (e.shiftKey) {
          // shift+tab
          if (document.activeElement === externalDialogContinue) {
            e.preventDefault();
            externalDialogClose.focus();
          }
        } else if (document.activeElement === externalDialogClose) {
          e.preventDefault();
          externalDialogContinue.focus();
        }
      }
      // eslint-enable
    });
    externalDialogContinue.addEventListener('click', function (e) {
      if (this.getAttribute('modal') === 'adhoc') {
        const url = new URL(this.href);
        if (url.pathname === window.location.pathname) {
          this.setAttribute('navigate', 'true');
          e.preventDefault(); // for now just close
        } else {
          analyticsNavigation({
            nav_click_image_alt_text: 'undefined',
            nav_click_text: externalDialogContinue.innerText,
            nav_menu_type: 'body',
            asset_name: 'undefined',
            asset_type: 'undefined',
            asset_id: 'undefined',
          });
        }
      }
      const modalname = externalDialogEl.getAttribute('modalname');
      externalDialogEl.close();
      if (modalname === 'medicareinternal') {
        analyticsNavigation({
          nav_click_image_alt_text: 'undefined',
          nav_click_text: externalDialogContinue.innerText,
          nav_menu_type: 'body',
          asset_name: 'undefined',
          asset_type: 'undefined',
          asset_id: 'undefined',
        });
      } else if (modalname === 'cobranded' || modalname === 'medicareexternal') {
        analyticsClick({
          link_classes: externalDialogContinue.getAttribute('class'),
          link_domain: new URL(externalDialogContinue.href).hostname,
          link_id: externalDialogContinue.getAttribute('id') || 'undefined',
          link_text: externalDialogContinue.innerText,
          link_url: externalDialogContinue.href,
          asset_name: 'undefined',
          asset_type: 'undefined',
          asset_id: 'undefined',
          outbound: true,
        });
      }
    });

    // close modal on click on 'cancel' button
    externalDialogCancel.addEventListener('click', () => {
      externalDialogEl.close();
      bodyEl.classList.remove('modal-popup-open');
    });
    // close modal on click on 'close icon'
    externalDialogClose.addEventListener('click', () => {
      externalDialogEl.close();
      bodyEl.classList.remove('modal-popup-open');
    });
    // reset the dialog classes when dialog closes
    externalDialogEl.addEventListener('close', () => {
      const modalName = externalDialogEl.getAttribute('modalname');
      externalDialogContinue.removeAttribute('modal');
      modalAnalytics.close[modalName] += 1;
      externalDialogEl.classList.forEach((classname) => {
        if (classname !== 'modal-popup') {
          externalDialogEl.classList.remove(classname);
        }
        externalDialogEl.querySelectorAll('.download-modal-container').forEach((container) => {
          container.style.display = 'none';
        });
      });

      analyticsModal({
        modal_action: 'close',
        modal_location: window.location.href,
        modal_name: modalName,
        modal_impression: modalAnalytics.close[modalName],
      });
    });
  }, 1000);
}
