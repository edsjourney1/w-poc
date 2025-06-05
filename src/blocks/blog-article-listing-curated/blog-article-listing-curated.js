// import { getMetadata } from '../../scripts/aem.js';

import { renderImages } from '../../scripts/externalImage.js';
import { excelDateToDate } from '../../scripts/tools.js';

// import { loadFragment } from '../fragment/fragment.js';
export default async function decorate(block) {
  const heading = block.children[0].children[0].innerText;
  const articleOne = block.children[1].children[0].textContent;
  const articleTwo = block.children[1].children[1].textContent;
  const articleThree = block.children[1].children[2].textContent;
  const headDiv = document.createElement('div');
  if (heading !== '') {
    const headingSpam = document.createElement('h2');
    headingSpam.classList.add('title');
    headingSpam.append(heading);
    headDiv.classList.add('heading-div');
    headDiv.append(headingSpam);
  }
  block.innerHTML = '';
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('cards-div');
  block.append(headDiv, blockDiv);
  const data = await fetch('/query-index.json');
  const json = await data.json();
  const postArticle1 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleOne.trim();
  });
  if (postArticle1) {
    // const mainDiv = document.createElement('div');
    // mainDiv.classList.add('card-div');
    // const relativeUrl = new URL(postArticle1.url.trim()).pathname;
    // const imageDiv = document.createElement('div');
    // imageDiv.classList.add('image-div');
    // const imageAnchor = document.createElement('a');
    // imageAnchor.ariaLabel = postArticle1.title;
    // const imageSrc = document.createElement('img');
    // const imageAlt = postArticle1.image.split('#');
    // // eslint-disable-next-line prefer-destructuring
    // imageSrc.src = imageAlt[0];
    // imageSrc.alt = imageAlt[1] || '';
    // imageAnchor.append(imageSrc);
    // imageAnchor.href = `${relativeUrl}`;
    // imageDiv.append(imageAnchor);
    // mainDiv.appendChild(imageDiv);
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('card-div');
    const relativeUrl = new URL(postArticle1.url.trim()).pathname;
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-div');
    const imageAnchor = document.createElement('a');
    const imageAlt = postArticle1.image.split('#');
    // imageAnchor.href = image;
    imageDiv.append(imageAnchor);
    const imagePara = document.createElement('p');
    // eslint-disable-next-line
    imageAnchor.href = imageAlt[0];
    imagePara.append(imageAnchor);
    const imageEm = document.createElement('em');
    const imageEmanchor = document.createElement('a');
    imageEmanchor.href = `${relativeUrl}#${postArticle1.title}-thumbnail`;
    // imageEmanchor.textContent = `${relativeUrl}#${postArticle1.title}`;
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
    titleanchor.innerHTML = postArticle1.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle1.publishedDate;
    pubDate.textContent = postArticle1.publishedDate.includes('/')
      ? postArticle1.publishedDate
      : excelDateToDate(postArticle1.publishedDate);
    if (postArticle1.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle1.readTime} min read`;
    if (postArticle1.readTime !== '') {
      datetimeDiv.appendChild(arcretime);
    }

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle1.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      // eslint-disable-next-line
      const url = `/${postArticle1.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')} `;
      categorySpan.href = window.location.origin + url;
      categorySpan.textContent = item.trim();
      categorySpan.title = item.trim();
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle2 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleTwo.trim();
  });
  if (postArticle2) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('card-div');
    const relativeUrl = new URL(postArticle2.url.trim()).pathname;
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-div');
    const imageAnchor = document.createElement('a');
    const imageAlt = postArticle2.image.split('#');
    // imageAnchor.href = image;
    imageDiv.append(imageAnchor);
    const imagePara = document.createElement('p');
    // eslint-disable-next-line
    imageAnchor.href = imageAlt[0];
    imagePara.append(imageAnchor);
    const imageEm = document.createElement('em');
    const imageEmanchor = document.createElement('a');
    imageEmanchor.href = `${relativeUrl}#${postArticle2.title}-thumbnail`;
    // imageEmanchor.textContent = `${relativeUrl}#${postArticle2.title}`;
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
    titleanchor.innerHTML = postArticle2.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle2.publishedDate.includes('/')
      ? postArticle2.publishedDate
      : excelDateToDate(postArticle2.publishedDate);
    if (postArticle2.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle2.readTime} min read`;
    if (postArticle2.readTime !== '') {
      datetimeDiv.appendChild(arcretime);
    }

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle2.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      // eslint-disable-next-line
      const url = `/${postArticle2.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')} `;
      categorySpan.href = window.location.origin + url;
      categorySpan.textContent = item.trim();
      categorySpan.title = item.trim();
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle3 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleThree.trim();
  });
  if (postArticle3) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('card-div');
    const relativeUrl = new URL(postArticle3.url.trim()).pathname;
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-div');
    const imageAnchor = document.createElement('a');
    const imageAlt = postArticle3.image.split('#');
    // imageAnchor.href = image;
    imageDiv.append(imageAnchor);
    const imagePara = document.createElement('p');
    // eslint-disable-next-line
    imageAnchor.href = imageAlt[0];
    imagePara.append(imageAnchor);
    const imageEm = document.createElement('em');
    const imageEmanchor = document.createElement('a');
    imageEmanchor.href = `${relativeUrl}#${postArticle3.title}-thumbnail`;
    // imageEmanchor.textContent = `${relativeUrl}#${postArticle3.title}`;
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
    titleanchor.innerHTML = postArticle3.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle3.publishedDate.includes('/')
      ? postArticle3.publishedDate
      : excelDateToDate(postArticle3.publishedDate);
    if (postArticle3.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle3.readTime} min read`;
    if (postArticle3.readTime !== '') {
      datetimeDiv.appendChild(arcretime);
    }

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle3.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      // eslint-disable-next-line
      const url = `/${postArticle3.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')} `;
      categorySpan.href = window.location.origin + url;
      categorySpan.textContent = item.trim();
      categorySpan.title = item.trim();
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
}
