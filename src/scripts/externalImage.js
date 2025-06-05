import { getAssetId, getImgFileExtension } from './tools.js';

/*
 * Appends query params to a URL
 * @param {string} url The URL to append query params to
 * @param {object} params The query params to append
 * @returns {string} The URL with query params appended
 * @private
 * @example
 * appendQueryParams('https://example.com', { foo: 'bar' });
 * // returns 'https://example.com?foo=bar'
 */
const appendQueryParams = (url, params) => {
  const { searchParams } = url;
  params.forEach((value, key) => {
    searchParams.set(key, value);
  });
  url.search = searchParams.toString();
  return url.toString();
};

const createSmartCropPicture = (src, article, landscape, portrait, square, type, alt = '') => {
  const url = new URL(src);
  const picture = document.createElement('picture');
  picture.classList.add('eds-asset-image');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
  const img = document.createElement('img');
  img.setAttribute('loading', 'lazy');
  if (alt.length > 0) {
    img.setAttribute('alt', alt);
  } else {
    img.setAttribute('alt', '');
  }
  img.addEventListener('error', () => {
    console.error('Smartcropped image loading error: ', src);
  });
  picture.appendChild(img);

  // if (type === 'landscape') {
  //   const source = document.createElement('source');
  //   source.setAttribute('media', '(max-width:1200px)');
  //   source.setAttribute(
  //     'srcset',
  //     appendQueryParams(
  //       url,
  //       new URLSearchParams({
  //         smartcrop: 'landscape',
  //         height: large.height || '400',
  //         width: large.width || '600',
  //         format: ext,
  //       }),
  //     ),
  //   );
  //   picture.appendChild(source);
  // }
  if (type === 'landscape') {
    img.setAttribute(
      'src',
      appendQueryParams(
        url,
        new URLSearchParams({
          smartcrop: 'landscape',
          height: landscape.height || '400',
          width: landscape.width || '400',
          format: ext,
        }),
      ),
    );
  } else if (type === 'square') {
    img.setAttribute(
      'src',
      appendQueryParams(
        url,
        new URLSearchParams({
          smartcrop: 'square',
          height: square.height || '400',
          width: square.width || '400',
          format: ext,
        }),
      ),
    );
  }

  return picture;
};

/**
 * Creates an optimized picture element for an image.
 * If the image is not an absolute URL, it will be passed to libCreateOptimizedPicture.
 * @param {string} src The image source URL
 * @param {string} alt The image alt text
 * @param {boolean} eager Whether to load the image eagerly
 * @param {object[]} breakpoints The breakpoints to use
 * @returns {Element} The picture element
 *
 */
const createOptimizedPicture = (
  src,
  alt = '',
  eager = false,
  breakpoints = [
    { media: '(max-width:480px)', width: '480' },
    { media: '(max-width:1023px)', width: '1023' },
    { media: '(max-width:1200px)', width: '1200' },
    { media: '(max-width:1920px)', width: '1920' },
  ],
) => {
  const url = new URL(src);
  const picture = document.createElement('picture');
  picture.classList.add('eds-asset-image');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  // breakpoints.forEach((br) => {
  //   const source = document.createElement('source');
  //   if (br.media) source.setAttribute('media', br.media);
  //   source.setAttribute('type', 'image/webp');
  //   const searchParams = new URLSearchParams({ width: br.width, format: 'webply' });
  //   source.setAttribute('srcset', appendQueryParams(url, searchParams));
  //   picture.appendChild(source);
  // });

  // fallback
  breakpoints.forEach((br, i) => {
    const searchParams = new URLSearchParams({ width: br.width, format: ext });

    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', appendQueryParams(url, searchParams));
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      if (alt.length > 0) {
        img.setAttribute('alt', alt);
      } else {
        img.setAttribute('alt', '');
      }
      picture.appendChild(img);
      img.setAttribute('src', appendQueryParams(url, searchParams));
      img.addEventListener('error', () => {
        console.error('Optimized image loading error: ', src);
      });
    }
  });

  return picture;
};

const getImgDetails = async (url) => {
  const assetId = getAssetId(url);
  if (assetId) {
    try {
      /* inject:dam-js */
      const damURL = 'https://delivery-p140377-e1434145.adobeaemcloud.com/adobe/assets';
      /* endinject */
      const resp = await fetch(`${damURL}/${assetId}/metadata`, {
        method: 'GET',
        headers: {
          'If-None-Match': 'string',
        },
      });
      if (!resp.ok) {
        return '';
      }
      const json = await resp.json();
      return json;
    } catch (e) {
      return '';
    }
  }
  return '';
};

const formImageLinks = (extImages) => {
  extImages.forEach((extImage) => {
    const extImageHref = extImage.getAttribute('href') || '';
    const isEMChild = extImage.parentNode && extImage.parentNode.tagName === 'EM';
    if (isEMChild) {
      const associatedImg = extImage.parentNode.previousElementSibling;
      if (associatedImg && associatedImg.classList.contains('eds-asset-image')) {
        const link = document.createElement('a');
        const [linkURL, linkHash] = extImageHref.split('#') || [];
        const [linkTitle, windowType, jumpId] = linkHash?.split('--') || [];
        if (linkTitle) {
          link.title = decodeURIComponent(linkTitle);
        }
        if (windowType === 'new') {
          link.href = linkURL;
          link.target = '_blank';
        } else if (windowType === 'jump' && jumpId) {
          link.href = `#${jumpId}`;
        } else {
          link.href = extImageHref;
        }
        extImage.remove();
        associatedImg.parentNode.insertBefore(link, associatedImg);
        link.append(associatedImg);
      }
    }
  });
};

export const renderImages = async (ele, callback) => {
  const extImages = Array.from(ele.querySelectorAll('a'));
  await Promise.all(
    extImages.map(async (extImage) => {
      let imageCrop = 'landscape';
      if (
        extImage.closest('.title-banner-container') ||
        extImage.closest('.benefit-block-icon-container') ||
        extImage.closest('.benefit-block-image-container') ||
        extImage.closest('.bio-grid-wrapper') ||
        extImage.closest('.blog-hero-article-container') ||
        extImage.closest('.image-content-container') ||
        extImage.closest('.image-content-with-icon-container') ||
        extImage.closest('.image-overlap-container') ||
        extImage.closest('.siteheader-subnav-info')
      ) {
        imageCrop = 'square';
      }
      const extImageHref = extImage.getAttribute('href') || '';
      const assetSelected = extImageHref.indexOf('/adobe/assets/urn:aaid') > -1;
      const isscene7Image = extImageHref.indexOf('scene7.com/is/image/') > -1;
      if (isscene7Image) {
        const isEMChild = extImage.parentNode.tagName === 'EM';
        if (!isEMChild) {
          const extPicture = document.createElement('img');
          extPicture.src = extImageHref;
          extPicture.classList.add('eds-asset-image');
          extPicture.setAttribute('alt', extImage.innerText || extImage.textContent);
          extImage.replaceWith(extPicture);
        }
      }
      if (assetSelected) {
        const isEMChild = extImage.parentNode.tagName === 'EM';
        const extn = getImgFileExtension(extImageHref);
        if (extn && !isEMChild) {
          let altAttr = '';
          let altAttrHash = '';
          altAttrHash = decodeURIComponent((new URL(extImageHref).hash || '#').trim().substring(1));

          const metadata = await getImgDetails(extImage.getAttribute('href'));
          altAttr = (metadata?.assetMetadata || {})['dc:title'] || ''; // change it to dc:description

          if (altAttrHash) {
            altAttr = altAttrHash;
          }

          if (altAttrHash === '') {
            altAttr = '';
          }

          let extPicture;

          const square = metadata?.repositoryMetadata?.smartcrops?.square;
          const landscape = metadata?.repositoryMetadata?.smartcrops?.landscape;
          if (imageCrop === 'square' && square) {
            extPicture = createSmartCropPicture(
              extImageHref,
              null,
              null,
              null,
              square,
              'square',
              altAttr,
            );
          } else if (imageCrop === 'landscape' && landscape) {
            extPicture = createSmartCropPicture(
              extImageHref,
              null,
              landscape,
              null,
              null,
              'landscape',
              altAttr,
            );
          } else {
            extPicture = createOptimizedPicture(extImageHref, altAttr);
          }
          // if (large && medium) {
          //   extPicture = createSmartCropPicture(extImageHref, large, medium, altAttr);
          // } else {
          //   extPicture = createOptimizedPicture(extImageHref, altAttr);
          // }
          extImage.replaceWith(extPicture);
        }
      }
    }),
  )
    .then(() => {
      formImageLinks(extImages);
    })
    .then(() => {
      if (callback) {
        setTimeout(() => {
          callback.call();
        }, 100);
      }
    });
};

/*
 * Decorates external images with a picture element
 * @param {Element} ele The element
 * @param {string} deliveryMarker The marker for external images
 * @private
 * @example
 * decorateExternalImages(main, '//External Image//');
 */
const decorateExternalImages = async (ele) => {
  await renderImages(ele);
};

export default decorateExternalImages;
