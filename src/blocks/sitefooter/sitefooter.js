import { windowUrlDetails } from '../../scripts/tools.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  let langMeta;
  let langPath;

  const urlArr = (windowUrlDetails.pathname || '').split('/');

  if (urlArr.includes('languages-ma')) {
    langMeta = getMetadata('/content-fragments/language-ma-helper-fragment');
    langPath = langMeta
      ? new URL(langMeta, window.location).pathname
      : '/content-fragments/language-ma-helper-fragment';
  } else {
    langMeta = getMetadata('/content-fragments/language-helper-fragment');
    langPath = langMeta
      ? new URL(langMeta, window.location).pathname
      : '/content-fragments/language-helper-fragment';
  }

  const fragment = await loadFragment(langPath);
  const allLangs = Array.from(fragment.querySelectorAll('.language-helper'));

  const allDivs = Array.from(block.querySelectorAll(':scope > div'));

  const footerInfoDiv = document.createElement('div');
  footerInfoDiv.className = 'sitefooter-info';

  const copyrightDiv = document.createElement('div');
  copyrightDiv.className = 'sitefooter-copy';

  footerInfoDiv.innerHTML = '<div class="sitefooter-info-content"></div>';
  copyrightDiv.innerHTML = '<div class="sitefooter-copy-content"></div>';

  let pageIdData = document.querySelector('meta[name="page-id"]')?.getAttribute('content') || '';

  allDivs.forEach((item, index) => {
    if (index < 7) {
      if (index === 0) {
        const [logoInfo, shareInfo] = item.children;
        item.append(logoInfo);
        item.append(shareInfo);
      }
      footerInfoDiv.querySelector('div').append(item);
    } else if (index === 9) {
      item.classList.add('sitefooter-page-id');
      copyrightDiv.querySelector('div').append(item);
    } else {
      copyrightDiv.querySelector('div').append(item);
    }
  });

  const langDiv = footerInfoDiv.querySelector('div:nth-child(5)');
  const targetDiv = footerInfoDiv.querySelector('div:nth-child(6)');

  if (allLangs.length > 0 && !urlArr.includes('providers') && !urlArr.includes('provider')) {
    const ul = document.createElement('ul');
    allLangs.forEach((item) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      const em = document.createElement('em');
      button.type = 'button';
      let str = '';
      const [first] = item.children;
      const [title, lang, dir, font] = first.children;

      button.textContent = title.querySelector('p')?.textContent;
      button.setAttribute('lang', lang.querySelector('p')?.textContent);
      button.setAttribute('dir', dir.querySelector('p')?.textContent);
      button.className = `fontfamily-${font.querySelector('p')?.textContent}`;

      for (let i = 1; i < item.children.length; i += 1) {
        const [type, text] = item.children[i].children;
        if (text.querySelector('p')) {
          if (type.querySelector('p').textContent === 'custom') {
            str += `<span class='fontfamily-${font.querySelector('p')?.innerHTML}'>${text.querySelector('p').innerHTML}</span>`;
          } else {
            str += `<span class='fontfamily-roboto'>${text.querySelector('p').innerHTML}</span>`;
          }
        } else {
          str += '<span class="fontfamily-roboto">&nbsp;</span>';
        }
      }
      em.innerHTML = str;
      li.append(button);
      li.append(em);
      ul.append(li);

      button.addEventListener('click', () => {
        targetDiv.innerHTML = em.innerHTML;
        targetDiv.setAttribute('lang', lang.querySelector('p')?.textContent);
        targetDiv.setAttribute('dir', dir.querySelector('p')?.textContent);
      });
    });
    langDiv.append(ul);

    window.addEventListener('unload', () => {
      targetDiv.innerHTML = '';
      targetDiv.removeAttribute('lang');
      targetDiv.removeAttribute('dir');
    });
  }

  const yearEm = copyrightDiv.querySelector('.sitefooter-copy p em');
  yearEm.innerHTML = new Date().getFullYear();

  const pageIdParaEl = copyrightDiv.querySelector('.sitefooter-copy .sitefooter-page-id p');
  if (pageIdParaEl) {
    let lastUpdatedDate =
      document.querySelector('meta[name="last-updated-date"]')?.getAttribute('content') || '';
    if (lastUpdatedDate.length === 0) {
      const todaysDate = new Date();
      let datForm =
        todaysDate.getMonth() > 8 ? todaysDate.getMonth() + 1 : `0${todaysDate.getMonth() + 1}`;
      datForm += `/${todaysDate.getDate() > 9 ? todaysDate.getDate() : `0${todaysDate.getDate()}`}`;
      datForm += `/${todaysDate.getFullYear()}`;
      lastUpdatedDate = datForm;
    }

    if (pageIdData.length > 0) {
      pageIdData = `<span>|</span>${pageIdData}`;
    }

    pageIdParaEl.innerHTML = `${pageIdParaEl.innerHTML}: ${lastUpdatedDate}${pageIdData}`;
  }

  block.append(footerInfoDiv);
  block.append(copyrightDiv);
}
