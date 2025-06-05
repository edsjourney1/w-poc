import { getAssetId, getDocFileExtension, windowUrlDetails } from './tools.js';

const dL = window.adobeDataLayer;

let allClickables = [];
const analyticsElements = [];
const analyticsFormsArr = [];
const analyticsFaqArr = [];
const urlDetails = windowUrlDetails;
const allAssetsNames = [];
const allAssetsTypes = [];
const allAssetsIds = [];

const bodyEl = document.body;

const isRelativeURL = (linkHref) => {
  const url = new URL(linkHref, window.location.href);
  return url.origin === window.location.origin;
};

const isOutboundLink = (linkHref) => {
  let outboundLink = false;

  if (isRelativeURL(linkHref)) {
    outboundLink = false;
  } else {
    const linkURL = new URL(linkHref);
    if (linkURL.hostname !== window.location.hostname) {
      outboundLink = true;
    }
  }
  return outboundLink;
};

const createEventData = (obj) => {
  if (obj) {
    return {
      eventData: { ...obj },
    };
  }
  return {
    eventData: {},
  };
};
const pushToAdobe = (obj = {}) => {
  if (!bodyEl.classList.contains('sidekick-library')) {
    console.log(
      '\n\n\n============== (FOR DATA TRACKING TESTING ONLY) ==============\n',
      JSON.stringify(obj),
      '\n==============\n\n\n',
    );
    dL.push(obj);
  }
};

const analyticsClick = (details) => {
  pushToAdobe({
    event: 'click',
    ...createEventData(details),
  });
};
const analyticsNavigation = (details) => {
  pushToAdobe({
    event: 'navigation',
    ...createEventData(details),
  });
};
const analyticsCallToAction = (details) => {
  pushToAdobe({
    event: 'call_to_action',
    ...createEventData(details),
  });
};

const analyticsModal = (details) => {
  pushToAdobe({
    event: 'modal',
    ...createEventData(details),
  });
};

// const analyticsViewSearchResults = (details) => {
//   pushToAdobe({
//     event: 'view_search_results',
//     ...createEventData(details),
//   });
//   // adobeDataLayer.push({
//   //   'event':'View Search Results',
//   //   eventData: {
//   //   'search_result_count':'<Search Result Count>',
//   //   'search_term':<Search Term>,
//   //   'q_<additional key="""">':<Q Additional Key >
//   //   }
//   // });
// };
const analyticsFileDownload = (details) => {
  pushToAdobe({
    event: 'file_download',
    ...createEventData(details),
  });
};
const analyticsForms = (details) => {
  pushToAdobe({
    event: 'forms',
    ...createEventData(details),
  });
};
// const analyticsErrorTracking = (details) => {
//   pushToAdobe({
//     event: 'error_tracking',
//     ...createEventData(details),
//   });
//   // adobeDataLayer.push({
//   //   'event':'error_tracking',
//   //   eventData: {
//   //   'error_reason':<Error Reason>,
//   //   'error_displayed_count':<Error Displayed Count>,
//   //   'error_backround_count':<Error Backround Count>,
//   //   'error_http':<Error Http>,
//   //   'error_location':<Error Location>,
//   //   'error_displayed_text':<Error Displayed Text>
//   //   }
//   // });
// };
const analyticsContact = (details) => {
  pushToAdobe({
    event: 'contact',
    ...createEventData(details),
  });
};
const analyticsFAQ = (details) => {
  pushToAdobe({
    event: 'faq',
    ...createEventData(details),
  });
};
const analyticsSocial = (details) => {
  pushToAdobe({
    event: 'social',
    ...createEventData(details),
  });
};
const analyticsPageView = (details) => {
  pushToAdobe({
    event: 'page_view',
    ...createEventData(details),
  });
};

const gatherOtherAssets = () => {
  const allImgs = document.querySelectorAll('img, iframe, video source, [name="video-embed-src"]');
  allImgs.forEach((img) => {
    const fileSrc = img.src || img.value || '';
    const fileExtn = getDocFileExtension(fileSrc);
    const fileId = img.getAttribute('data-videourl')
      ? getAssetId(img.getAttribute('data-videourl'))
      : getAssetId(fileSrc);
    if (fileExtn) {
      allAssetsNames.push(
        new URL(img.getAttribute('data-videourl') || fileSrc).pathname
          .split('/')
          .filter((text) => text)
          .pop(),
      );
      allAssetsTypes.push(fileExtn);
      allAssetsIds.push(fileId.replace('urn:aaid:aem:', ''));
    }
  });
  analyticsPageView({
    account_login_status: 'logged out',
    age: 'undefined',
    audience_role: 'undefined',
    audience_size: 'undefined',
    audience_type: 'undefined',
    environment: urlDetails.hostname === 'www.wellmark.com' ? 'PROD' : 'DEV',
    gender: 'undefined',
    page_type: 'undefined',
    site_name: 'wellmark',
    site_section: urlDetails.pathname
      .split('/')
      .filter((text) => text)
      .join('|'),
    site_subcategory_depth: urlDetails.pathname.split('/').filter((text) => text).length,
    site_subcategory: urlDetails.pathname.split('/').filter((text) => text)[0] || 'undefined',
    user_id: 0,
    user_relationship_to_member: 'undefined',
    user_role: 'undefined',
    user_type: 'undefined',
    asset_name: allAssetsNames.filter((text) => text).join('|'),
    asset_type: allAssetsTypes
      .filter((text) => text)
      .join('|')
      .toLowerCase(),
    asset_id: allAssetsIds.filter((text) => text).join('|'),
  });
};

const faqAnalyticsInit = () => {
  const allFaqAccordions = Array.from(
    document.querySelectorAll('.accordion-container .accordion-item'),
  );
  allFaqAccordions.forEach((accordionItem) => {
    const itemObj = {
      el: accordionItem,
      question:
        accordionItem.querySelector('.item-title').innerText ||
        accordionItem.querySelector('.item-title').textContent,
      faq_name: null,
      faq_toggle: null,
      summary: accordionItem.querySelector('summary'),
    };
    analyticsFaqArr.push(itemObj);
  });

  const analyzeFaqItem = (item) => {
    if (item.el.attributes?.open) {
      analyticsFAQ({
        faq_question: item.question,
        faq_name: item.question,
        faq_toggle: 'collapse',
      });
    } else {
      analyticsFAQ({
        faq_question: item.question,
        faq_name: item.question,
        faq_toggle: 'expand',
      });
    }
  };

  analyticsFaqArr.forEach((item) => {
    item.summary.addEventListener(
      'click',
      () => {
        analyzeFaqItem(item);
      },
      false,
    );
    // item.summary.addEventListener(
    //   'keyup',
    //   () => {
    //     analyzeFaqItem(item);
    //   },
    //   false,
    // );
  });
};

const linksAnalyticsInit = () => {
  const navlist = document.querySelectorAll('.siteheader-mobile-wrapper > nav > ul > li');
  const bluenavlist = document.querySelectorAll('.siteheader-blog-menu > ul > li');
  const navitems = Array.from(navlist);
  const bluenavItems = bluenavlist && Array.from(bluenavlist);
  const popupButton = document.querySelector('.siteheader-login-wrapper button');
  const menubutton = document.querySelector('.siteheader-mobile-wrapper > button');
  const searchbutton = document.querySelector('.siteheader-search-wrapper > button');

  allClickables.forEach((anchor, index) => {
    const anchorObj = {
      alt: anchor.querySelector('img')?.getAttribute('alt'),
      isHeader: anchor.classList?.contains('siteheader-has-subnav'),
      isBlueHeader: anchor.classList?.contains('siteheader-blog-has-subnav'),
      isdialogpopup: anchor.getAttribute('aria-haspopup') === 'dialog',
      isLoginBtn: anchor === popupButton,
      isMenuButton: anchor === menubutton,
      isSearchButton: anchor === searchbutton,
      isBreadcrumb: anchor.closest('.breadcrumbs'),
      assetId: null,
      assetName: null,
      assetType: null,
      blogNav: anchor.closest('.siteheader-blog'),
      classList: anchor.getAttribute('class'),
      contact: null,
      contactCount: 0,
      contactDescriptor: null,
      contactLocation: null,
      ctaElementType: 'button',
      ctaLocation: null,
      dataAttrs: [],
      display: null,
      domain: null,
      el: anchor,
      extn: null,
      footer: anchor.closest('footer'),
      hasModal: false,
      header: anchor.closest('header'),
      href: anchor.href,
      id: anchor.getAttribute('id'),
      img: anchor.querySelector('img'),
      imgUrlDetails: null,
      isCTA: null,
      isJumpLink: anchor.getAttribute('href')?.indexOf(0) === '#',
      label: anchor.getAttribute('aria-label') || '',
      mainNav: anchor.closest('.siteheader-mobile-wrapper'),
      menuType: null,
      modal: anchor.closest('dialog'),
      outbound: false,
      popup: null,
      social: null,
      socialClick: 0,
      tag: anchor.tagName.toLowerCase(),
      text: anchor.innerText || anchor.textContent,
      title: anchor.getAttribute('title') || '',
      urlDetails: null,
    };

    const linkHref = (anchorObj.href || '').toLowerCase();

    if (linkHref.length > 0) {
      anchorObj.urlDetails = new URL(linkHref);
      anchorObj.domain = anchorObj.urlDetails?.host;
      anchorObj.extn = getDocFileExtension(linkHref);
    }
    if (anchorObj.img) {
      anchorObj.imgUrlDetails = new URL(anchorObj.img.src);
      anchorObj.assetType = getDocFileExtension(anchorObj.img.src);
      anchorObj.assetId = getAssetId(anchorObj.img.src);
    }

    let thisAssetId;

    if (anchorObj.extn) {
      const attr = anchorObj.urlDetails?.pathname
        .split('/')
        .filter((text) => text)
        .pop();
      anchorObj.assetName = attr;
      anchorObj.assetType = anchorObj.extn;
      allAssetsNames.push(anchorObj.assetName);
      allAssetsTypes.push(anchorObj.extn);
      thisAssetId = getAssetId(anchorObj.href);
      if (thisAssetId.length > 0) {
        anchorObj.assetId = thisAssetId;
        allAssetsIds.push(thisAssetId.replace('urn:aaid:aem:', ''));
      }
    }

    thisAssetId = '';
    if (anchorObj.assetType) {
      const attr = anchorObj.urlDetails?.pathname
        .split('/')
        .filter((text) => text)
        .pop();
      anchorObj.assetName = attr;
      if (!anchorObj.alt) {
        anchorObj.alt = attr;
      }
      // allAssetsNames.push(anchorObj.assetName);
      // allAssetsTypes.push(anchorObj.assetType);
      if ((anchorObj.img || {}).src) {
        thisAssetId = getAssetId(anchorObj.img.src);
        if (thisAssetId.length > 0) {
          allAssetsIds.push(thisAssetId.replace('urn:aaid:aem:', ''));
        }
      }
    }

    const contactsTelDetails = linkHref.match(/^tel:([^?]+)/);
    const contactsEmailDetails = linkHref.match(/^mailto:([^?]+)/);

    if (linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) {
      anchorObj.contactLocation = 'body';
      if (anchorObj.header) {
        anchorObj.contactLocation = 'header';
      }
      if (anchorObj.footer) {
        anchorObj.contactLocation = 'footer';
      }
      if (anchorObj.dialog) {
        anchorObj.contactLocation = 'dialog';
      }
    }

    if (linkHref.startsWith('mailto:')) {
      anchorObj.contact = 'email';
      if (contactsEmailDetails) {
        const [contactDetails] = contactsEmailDetails;
        anchorObj.contactDescriptor = contactDetails;
      }
    }
    if (linkHref.startsWith('tel:')) {
      anchorObj.contact = 'phone';
      if (contactsTelDetails) {
        const [contactDetails] = contactsTelDetails;
        anchorObj.contactDescriptor = contactDetails;
      }
    }

    if (!anchorObj.contactDescriptor) {
      anchorObj.contactDescriptor = 'undefined';
    }

    if (anchorObj.urlDetails?.origin.includes('facebook')) {
      anchorObj.social = 'facebook';
    }
    if (anchorObj.urlDetails?.origin.includes('linkedin')) {
      anchorObj.social = 'linkedin';
    }
    if (
      anchorObj.urlDetails?.origin.includes('twitter') ||
      anchorObj.urlDetails?.origin.includes('.x.com') ||
      anchorObj.urlDetails?.origin.includes('/x.com')
    ) {
      anchorObj.social = 'x';
    }
    if (anchorObj.urlDetails?.origin.includes('youtube')) {
      anchorObj.social = 'youtube';
    }
    if (anchorObj.urlDetails?.origin.includes('instagram')) {
      anchorObj.social = 'instagram';
    }

    anchorObj.display = getComputedStyle(anchor).display.toLowerCase();
    anchorObj.isCTA =
      anchorObj.display !== 'inline' &&
      !anchorObj.img &&
      !navitems.includes(anchor.parentElement) &&
      !bluenavItems.includes(anchor.parentElement) &&
      !anchorObj.isLoginBtn &&
      !anchorObj.isSearchButton &&
      !anchorObj.isMenuButton;

    if (anchorObj.isCTA) {
      anchorObj.ctaLocation = 'body';
      if (anchorObj.header) {
        anchorObj.ctaLocation = 'header';
      }
      if (anchorObj.footer) {
        anchorObj.ctaLocation = 'footer';
      }
      if (anchorObj.dialog) {
        anchorObj.ctaLocation = 'dialog';
      }
    }

    if (!anchorObj.text) {
      anchorObj.text = anchor.getAttribute('aria-label') || '';
    }

    if (anchorObj.header) {
      anchorObj.menuType = 'header';
    } else if (anchorObj.footer) {
      anchorObj.menuType = 'footer';
    } else if (anchorObj.isBreadcrumb) {
      anchorObj.menuType = 'breadcrumbs';
    } else {
      anchorObj.menuType = 'body';
    }

    anchorObj.outbound = isOutboundLink(anchorObj.href);

    analyticsElements.push(anchorObj);
    for (let i = 0, atts = anchor.attributes, n = atts.length; i < n; i += 1) {
      if (atts[i].nodeName.startsWith('data')) {
        anchorObj.dataAttrs.push({
          node: atts[i].nodeName,
          value: atts[i].value,
        });
      }
    }

    if (index === allClickables.length - 1) {
      gatherOtherAssets();
    }
  });

  analyticsElements.forEach((anchorObj) => {
    anchorObj.el.addEventListener('click', () => {
      if (anchorObj.outbound && !anchorObj.isdialogpopup) {
        if (anchorObj.contact) {
          anchorObj.contactCount += 1;
          analyticsContact({
            contact_count: anchorObj.contactCount,
            contact_location: anchorObj.contactLocation,
            contact_method: anchorObj.contact,
            contact_descriptor: anchorObj.contactDescriptor,
          });
        } else if (anchorObj.social) {
          anchorObj.socialClick += 1;
          analyticsSocial({
            social_network: anchorObj.social,
            social_share: 'undefined',
            social_clickthrough: anchorObj.socialClick,
          });
        } else if (anchorObj.extn) {
          analyticsFileDownload({
            file_extension: anchorObj.extn,
            file_name: anchorObj.assetName,
            link_classes: anchorObj.classList,
            link_domain: anchorObj.domain,
            link_id: anchorObj.id,
            link_text: anchorObj.text,
            link_url: anchorObj.href,
            asset_name: anchorObj.assetName,
            asset_type: anchorObj.assetType,
            asset_id: anchorObj.assetId,
          });
        } else {
          analyticsClick({
            link_classes: anchorObj.classList || 'undefined',
            link_domain: anchorObj.domain,
            link_id: anchorObj.id || 'undefined',
            link_text: anchorObj.text,
            link_url: anchorObj.href,
            asset_name: anchorObj.assetName,
            asset_type: anchorObj.assetType,
            asset_id: anchorObj.assetId,
            outbound: true,
          });
        }
      }
      if (!anchorObj.outbound) {
        if (anchorObj.isCTA && !anchorObj.isHeader) {
          analyticsCallToAction({
            link_url: anchorObj.href || 0,
            cta_click_image_alt_text: anchorObj.alt,
            cta_click_text: anchorObj.text,
            cta_element_type: anchorObj.ctaElementType,
            cta_location: anchorObj.ctaLocation,
            cta_type: anchorObj.tag,
            asset_name: anchorObj.assetName || 'undefined',
            asset_type: anchorObj.assetType || 'undefined',
            asset_id: anchorObj.assetId || 'undefined',
          });
        } else if (anchorObj.extn) {
          analyticsFileDownload({
            file_extension: anchorObj.extn,
            file_name: anchorObj.assetName,
            link_classes: anchorObj.classList,
            link_domain: anchorObj.domain,
            link_id: anchorObj.id,
            link_text: anchorObj.text,
            link_url: anchorObj.href,
            asset_name: anchorObj.assetName,
            asset_type: anchorObj.assetType,
            asset_id: anchorObj.assetId,
          });
        } else if (
          !anchorObj.isHeader &&
          !anchorObj.isBlueHeader &&
          !anchorObj.isdialogpopup &&
          !anchorObj.isLoginBtn &&
          !anchorObj.isSearchButton &&
          !anchorObj.isMenuButton
        ) {
          analyticsNavigation({
            link_url: anchorObj.href || '0',
            nav_click_image_alt_text: anchorObj.alt || 'undefined',
            nav_click_text: anchorObj.text,
            nav_menu_type: anchorObj.menuType,
            asset_name: anchorObj.assetName || 'undefined',
            asset_type: anchorObj.assetType || 'undefined',
            asset_id: anchorObj.assetId || 'undefined',
          });
        }
      }
    });
  });
};

const formAnalyticsInit = () => {
  Array.from(document.querySelectorAll('form')).forEach((form) => {
    if (!form.classList.contains('eds-mkto-form')) {
      const formObj = {
        el: form,
        action: form.getAttribute('action') || '',
        category: null,
        errorblock: null,
        errorLabel: '',
        id: form.getAttribute('id') || '',
        inputErrorCount: 0,
        method: form.getAttribute('method') || '',
        name: form.getAttribute('name') || '',
        start: true,
        step: 1,
        submitCount: 0,
        techErrorCount: 0,
      };
      analyticsFormsArr.push(formObj);
    }
  });
  analyticsFormsArr.forEach((formObj) => {
    // formObj.el.addEventListener(
    //   'keyup',
    //   () => {
    //     formObj.start = true;
    //   },
    //   {
    //     once: true,
    //   },
    // );
    // formObj.el.addEventListener(
    //   'mouseup',
    //   () => {
    //     formObj.start = true;
    //   },
    //   {
    //     once: true,
    //   },
    // );

    if (formObj.id === 'gn-loginForm' || formObj.id === 'gn-loginForm-mobile') {
      formObj.errorblock = formObj.el
        .closest('.siteheader-login-wrapper-grid')
        ?.querySelector('.form-error-block');
    }

    formObj.el.addEventListener('submit', () => {
      formObj.submitCount += 1;
      setTimeout(() => {
        const errorLi = formObj.errorblock?.querySelectorAll('li') || [];
        let errorMsg = '';
        errorLi.forEach((li) => {
          errorMsg += `${li.innerText || li.textContent || ''},`;
        });
        analyticsForms({
          form_action: formObj.action,
          form_category: formObj.category,
          form_error_label: errorMsg,
          form_input_error_count: errorLi.length || '0',
          form_name: formObj.name,
          form_start: formObj.start,
          form_step: formObj.step,
          form_submit_count: formObj.submitCount,
          form_tech_error_count: 0,
        });
      }, 500);
    });
  });
};

const analyticsInit = () => {
  if (!bodyEl.classList.contains('sidekick-library')) {
    allClickables = Array.from(document.querySelectorAll('a, button'));

    formAnalyticsInit();
    linksAnalyticsInit();
    faqAnalyticsInit();
  }
};

const trackYTStart = (details) => {
  pushToAdobe({
    event: 'video_start',
    ...createEventData(details),
  });
};
const trackYTPause = (details) => {
  pushToAdobe({
    event: 'video_pause',
    ...createEventData(details),
  });
};
const trackYTResume = (details) => {
  pushToAdobe({
    event: 'video_resume',
    ...createEventData(details),
  });
};
const trackYTProgress = (details) => {
  pushToAdobe({
    event: 'video_progress',
    ...createEventData(details),
  });
};
const trackYTComplete = (details) => {
  pushToAdobe({
    event: 'video_complete',
    ...createEventData(details),
  });
};
// "adobeDataLayer.push({
//   'event':'video_start',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>
//   }
// });"
// "adobeDataLayer.push({
//   'event':'video_pause',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>
//   }
// });"
// "adobeDataLayer.push({
//   'event':'video_resume',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>
//   }
// });"
// "adobeDataLayer.push({
//   'event':'video_progress',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>,
// 'video_milestone': 25
//   }
// });"
// "adobeDataLayer.push({
//   'event':'video_progress',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>,
// 'video_milestone': 50
//   }
// });"
// "adobeDataLayer.push({
//   'event':'videoStart',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>
// 'video_milestone':75
//   }
// });"
// "adobeDataLayer.push({
//   'event':'video_complete',
//   eventData: {
//   'video_id':<Video ID>,
//   'video_name':<Video Name>,
//   'video_url':<Video URL>,
//  'video_duration':<Video Duration>
// 'video_milestone':100
//   }
// });"

export {
  analyticsClick,
  analyticsNavigation,
  analyticsInit,
  analyticsModal,
  trackYTStart,
  trackYTPause,
  trackYTResume,
  trackYTProgress,
  trackYTComplete,
};
