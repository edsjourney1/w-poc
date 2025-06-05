import { analyticsInit } from './analytics.js';

async function fetchSrOnlyData() {
  const srJsonPath = '/sr-only.json';
  const allSpan = document.querySelectorAll('span');
  fetch(srJsonPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      allSpan.forEach((span) => {
        data.data.forEach((item) => {
          if (span.classList.value.includes(item.identifier)) {
            if (
              !(
                span.parentElement?.querySelector('del') ||
                span.parentElement?.querySelector('.sr-only')
              )
            ) {
              if (span.closest('a')) {
                const srSpan = document.createElement('span');
                srSpan.innerText = item.textSr;
                srSpan.classList.add('sr-only');
                if (span.closest('a').target === '_blank') {
                  srSpan.innerText += ' opens in a new tab';
                }
                span.after(srSpan);
              } else if (
                span.previousElementSibling &&
                span.previousElementSibling.tagName === 'A'
              ) {
                const srSpan = document.createElement('span');
                srSpan.innerText = item.textSr;
                srSpan.classList.add('sr-only');
                if (span.previousElementSibling.target === '_blank') {
                  srSpan.innerText += ' opens in a new tab';
                }
                span.previousElementSibling.appendChild(srSpan);
              } else if (span.nextElementSibling && span.nextElementSibling.tagName === 'A') {
                const srSpan = document.createElement('span');
                srSpan.innerText = item.textSr;
                srSpan.classList.add('sr-only');
                if (span.nextElementSibling.target === '_blank') {
                  srSpan.innerText += ' opens in a new tab';
                }
                span.nextElementSibling.appendChild(srSpan);
              } else {
                const srSpan = document.createElement('span');
                srSpan.innerText = item.textSr;
                srSpan.classList.add('sr-only');
                span.parentElement.appendChild(srSpan);
              }
            }
          }
        });
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was a problem with the fetch operation:', error);
    });
}

async function convertDelToSrSpan() {
  const delTags = document.querySelectorAll('del');
  delTags.forEach((del) => {
    const span = document.createElement('span');
    span.classList.add('sr-only');
    span.textContent = del.textContent;
    if (del.parentElement?.querySelector('a')) {
      del.parentElement.querySelector('a').appendChild(span);
    } else {
      del.parentElement.appendChild(span);
    }
    del.remove();
  });
}

async function navigationAccessibility() {
  const breadcrumb = document.querySelector('.breadcrumbs');
  if (breadcrumb) {
    const currentPage = breadcrumb.querySelector('a[aria-current]');
    const span = document.createElement('span');
    span.classList.add('sr-only');
    span.textContent = currentPage.parentElement.previousElementSibling.textContent;
    currentPage.parentElement.previousElementSibling
      .querySelector('.breadcrumbs-prev')
      .appendChild(span);
  }
}

async function paginationAccessibility() {
  const paginationCountResult = document.querySelector('.pagination .count-result');
  if (paginationCountResult) {
    paginationCountResult.querySelectorAll('button').forEach((button) => {
      const span = document.createElement('span');
      span.classList.add('sr-only');
      span.textContent = 'Page';
      button.prepend(span);
    });
  }
}

async function addSrTextToBlogSocial() {
  const srJsonPath = '/blog-sr-only.json';
  const allSpan = document.querySelectorAll('.blog-social-links span');
  fetch(srJsonPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      allSpan.forEach((span) => {
        data.data.forEach((item) => {
          if (span.classList.value.includes(item.identifier)) {
            if (span.parentElement.parentElement?.querySelector('a')) {
              if (span.parentElement.querySelector('.sr-only')) {
                span.parentElement.querySelector('.sr-only').remove();
              }
              const srSpan = document.createElement('span');
              srSpan.innerText = item.textSr;
              srSpan.classList.add('sr-only');
              span.after(srSpan);
            } else {
              const srSpan = document.createElement('span');
              srSpan.innerText = item.textSr;
              srSpan.classList.add('sr-only');
              span.parentElement.appendChild(srSpan);
            }
          }
        });
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was a problem with the fetch operation:', error);
    });
}

async function addSrtextToAppstore() {
  const appstore = document.querySelector('.appstore-links');
  if (appstore) {
    const downloadLink = appstore.querySelector(
      'a[href="https://itunes.wellmark.com/us/app/wellmark/id484542399?mt=8"]',
    );
    const appstoreSpan = document.createElement('span');
    appstoreSpan.classList.add('sr-only');
    appstoreSpan.textContent = 'Download the Wellmark app on the App Store';
    downloadLink.appendChild(appstoreSpan);

    const googleLink = appstore.querySelector(
      'a[href="https://play.google.com/store/apps/details?id=com.wellmark.wellmark"]',
    );
    const googlePlaySpan = document.createElement('span');
    googlePlaySpan.classList.add('sr-only');
    googlePlaySpan.textContent = 'Download the Wellmark app on Google Play';
    googleLink.appendChild(googlePlaySpan);
  }
}

setTimeout(fetchSrOnlyData, 5000);
console.log('timeout ');
convertDelToSrSpan();
navigationAccessibility();
paginationAccessibility();
addSrtextToAppstore();
setTimeout(addSrTextToBlogSocial, 2000);
setTimeout(analyticsInit, 100);
