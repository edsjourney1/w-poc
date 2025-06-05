// import { getMetadata } from '../../scripts-for-dev/aem';

import { renderImages } from '../../scripts/externalImage.js';
import { excelDateToDate } from '../../scripts/tools.js';

// import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  let categoryByauthor;
  let tagByauthor;
  const data = await fetch('/query-index.json');
  const json = await data.json();
  let categoryBasedJson;
  if (block.children[1].children[0].innerText.trim().toLowerCase() === 'category') {
    categoryByauthor = block.children[1].children[1].innerText;
    categoryBasedJson = json.data.filter((article) =>
      article.category.toLowerCase().includes(categoryByauthor.toLowerCase()),
    );
  }
  if (block.children[1].children[0].innerText.trim().toLowerCase() === 'tag') {
    tagByauthor = block.children[1].children[1].innerText;
    categoryBasedJson = json.data.filter((article) =>
      article.tags.toLowerCase().includes(tagByauthor.toLowerCase()),
    );
  }
  const heading = block.children[0].children[0].textContent;
  const inlinewithIcon = block.children[0].children[1].innerHTML;
  const headingSpam = document.createElement('h2');
  headingSpam.classList.add('title');
  const iconwithtext = document.createElement('span');
  iconwithtext.classList.add('text-icon');
  iconwithtext.innerHTML = inlinewithIcon;
  headingSpam.append(heading);
  const headDiv = document.createElement('div');
  headDiv.classList.add('heading-div');
  headDiv.append(headingSpam, iconwithtext);
  block.innerHTML = '';
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('cards-div');
  block.append(headDiv, blockDiv);
  // eslint-disable-next-line max-len
  function renderItems() {
    blockDiv.innerHTML = '';
    function getRandomArticlesfromJSON(num = 3) {
      for (let i = 0; i < categoryBasedJson.length - 1; i += 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [categoryBasedJson[i], categoryBasedJson[j]] = [categoryBasedJson[j], categoryBasedJson[i]];
      }
      return categoryBasedJson.slice(0, num);
    }
    const randomArticles = getRandomArticlesfromJSON();
    randomArticles.forEach(({ image, tags, publishedDate, readTime, title, url, segment }) => {
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('card-div');
      const relativeUrl = new URL(url).pathname;
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image-div');
      const imageAnchor = document.createElement('a');
      const imageAlt = image.split('#');
      // imageAnchor.href = image;
      imageDiv.append(imageAnchor);
      const imagePara = document.createElement('p');
      // eslint-disable-next-line
      imageAnchor.href = imageAlt[0];
      imagePara.append(imageAnchor);
      const imageEm = document.createElement('em');
      const imageEmanchor = document.createElement('a');
      imageEmanchor.href = `${relativeUrl}#${title}-thumbnail`;
      // imageEmanchor.textContent = `${relativeUrl}#${title}`;
      imageEm.append(imageEmanchor);
      imagePara.append(imageEm);
      imageDiv.append(imagePara);
      renderImages(imageDiv);
      mainDiv.appendChild(imageDiv);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content-div');
      mainDiv.appendChild(contentDiv);

      const mainTitle = document.createElement('h3');
      const titleanchor = document.createElement('a');
      mainTitle.classList.add('card-title');
      titleanchor.innerHTML = title;
      mainTitle.append(titleanchor);
      titleanchor.href = `${relativeUrl}`;
      contentDiv.appendChild(mainTitle);

      const datetimeDiv = document.createElement('div');
      datetimeDiv.classList.add('date-div');
      contentDiv.appendChild(datetimeDiv);

      const pubDate = document.createElement('p');
      pubDate.classList.add('date');
      pubDate.textContent = publishedDate.includes('/')
        ? publishedDate
        : excelDateToDate(publishedDate);
      if (publishedDate !== '') {
        datetimeDiv.appendChild(pubDate);
      }

      const arcretime = document.createElement('p');
      arcretime.classList.add('read-time');
      arcretime.textContent = `${readTime} min read`;
      if (readTime !== '') {
        datetimeDiv.appendChild(arcretime);
      }

      const categoryPara = document.createElement('p');
      categoryPara.classList.add('category-list');
      contentDiv.appendChild(categoryPara);
      tags.split(',').forEach((item) => {
        const anchor = document.createElement('a');
        // eslint-disable-next-line
        const mainUrl = `/${segment}/tags/${item
          .trim()
          .toLowerCase()
          .replaceAll(' ', '-')
          // eslint-disable-next-line quotes
          .replaceAll("'", '')}`;
        anchor.href = window.location.origin + mainUrl;
        anchor.innerText = item.trim();
        anchor.title = item.trim();
        categoryPara.appendChild(anchor);
      });
      blockDiv.appendChild(mainDiv);
    });
  }
  renderItems();
}
