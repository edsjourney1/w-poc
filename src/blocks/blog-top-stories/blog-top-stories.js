import { excelDateToDate } from '../../scripts/tools.js';

export default async function decorate(block) {
  const heading = block.children[0].children[0].innerText;
  const articleOne = block.children[1].children[0].textContent;
  const articleTwo = block.children[2].children[0].textContent;
  const articleThree = block.children[3].children[0].textContent;
  const articleFour = block.children[4].children[0].textContent;
  const articleFive = block.children[5].children[0].textContent;
  const headDiv = document.createElement('div');
  if (heading !== '') {
    const headingSpam = document.createElement('h2');
    headingSpam.classList.add('stories-title');
    headingSpam.append(heading);
    headDiv.classList.add('top-heading');
    headDiv.append(headingSpam);
  }
  block.innerHTML = '';
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('top-cards');
  block.append(headDiv, blockDiv);
  const data = await fetch('/query-index.json');
  const json = await data.json();
  const postArticle1 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleOne.trim();
  });
  if (postArticle1) {
    const relativeUrl = new URL(postArticle1.url.trim()).pathname;
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('top-card-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    mainDiv.appendChild(contentDiv);

    const mainTitle = document.createElement('h3');
    const titleanchor = document.createElement('a');
    mainTitle.classList.add('card-title');
    titleanchor.textContent = postArticle1.title;
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
    datetimeDiv.appendChild(arcretime);

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle1.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      const mainUrl = `/${postArticle1.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')}`;
      categorySpan.href = window.location.origin + mainUrl;
      categorySpan.textContent = item.trim();
      categorySpan.title = item;
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle2 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleTwo.trim();
  });
  if (postArticle2) {
    const relativeUrl = new URL(postArticle2.url.trim()).pathname;
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('top-card-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    mainDiv.appendChild(contentDiv);

    const mainTitle = document.createElement('h3');
    const titleanchor = document.createElement('a');
    mainTitle.classList.add('card-title');
    titleanchor.textContent = postArticle2.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle2.publishedDate;
    pubDate.textContent = postArticle2.publishedDate.includes('/')
      ? postArticle2.publishedDate
      : excelDateToDate(postArticle2.publishedDate);
    if (postArticle2.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle2.readTime} min read`;
    datetimeDiv.appendChild(arcretime);

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle2.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      const mainUrl = `/${postArticle2.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')}`;
      categorySpan.href = window.location.origin + mainUrl;
      categorySpan.textContent = item.trim();
      categorySpan.title = item;
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle3 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleThree.trim();
  });
  if (postArticle3) {
    const relativeUrl = new URL(postArticle3.url.trim()).pathname;
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('top-card-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    mainDiv.appendChild(contentDiv);

    const mainTitle = document.createElement('h3');
    const titleanchor = document.createElement('a');
    mainTitle.classList.add('card-title');
    titleanchor.textContent = postArticle3.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle3.publishedDate;
    pubDate.textContent = postArticle3.publishedDate.includes('/')
      ? postArticle3.publishedDate
      : excelDateToDate(postArticle3.publishedDate);
    if (postArticle3.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle3.readTime} min read`;
    datetimeDiv.appendChild(arcretime);

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle3.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      const mainUrl = `/${postArticle3.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')}`;
      categorySpan.href = window.location.origin + mainUrl;
      categorySpan.textContent = item.trim();
      categorySpan.title = item;
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle4 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleFour.trim();
  });
  if (postArticle4) {
    const relativeUrl = new URL(postArticle4.url.trim()).pathname;
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('top-card-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    mainDiv.appendChild(contentDiv);

    const mainTitle = document.createElement('h3');
    const titleanchor = document.createElement('a');
    mainTitle.classList.add('card-title');
    titleanchor.textContent = postArticle4.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle4.publishedDate;
    pubDate.textContent = postArticle4.publishedDate.includes('/')
      ? postArticle4.publishedDate
      : excelDateToDate(postArticle4.publishedDate);
    if (postArticle4.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle4.readTime} min read`;
    datetimeDiv.appendChild(arcretime);

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle4.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      const mainUrl = `/${postArticle4.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')}`;
      categorySpan.href = window.location.origin + mainUrl;
      categorySpan.textContent = item.trim();
      categorySpan.title = item;
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
  const postArticle5 = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === articleFive.trim();
  });
  if (postArticle5) {
    const relativeUrl = new URL(postArticle5.url.trim()).pathname;
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('top-card-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');
    mainDiv.appendChild(contentDiv);

    const mainTitle = document.createElement('h3');
    const titleanchor = document.createElement('a');
    mainTitle.classList.add('card-title');
    titleanchor.textContent = postArticle5.title;
    mainTitle.append(titleanchor);
    titleanchor.href = `${relativeUrl}`;
    contentDiv.appendChild(mainTitle);

    const datetimeDiv = document.createElement('div');
    datetimeDiv.classList.add('date-div');
    contentDiv.appendChild(datetimeDiv);

    const pubDate = document.createElement('p');
    pubDate.classList.add('date');
    pubDate.textContent = postArticle5.publishedDate;
    pubDate.textContent = postArticle5.publishedDate.includes('/')
      ? postArticle5.publishedDate
      : excelDateToDate(postArticle5.publishedDate);
    if (postArticle5.publishedDate !== '') {
      datetimeDiv.appendChild(pubDate);
    }

    const arcretime = document.createElement('p');
    arcretime.classList.add('read-time');
    arcretime.textContent = `${postArticle5.readTime} min read`;
    datetimeDiv.appendChild(arcretime);

    const categoryPara = document.createElement('p');
    categoryPara.classList.add('category-list');
    contentDiv.appendChild(categoryPara);
    postArticle5.tags.split(',').forEach((item) => {
      const categorySpan = document.createElement('a');
      const mainUrl = `/${postArticle5.segment}/tags/${item
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        // eslint-disable-next-line quotes
        .replaceAll("'", '')}`;
      categorySpan.href = window.location.origin + mainUrl;
      categorySpan.textContent = item.trim();
      categorySpan.title = item;
      categoryPara.append(categorySpan);
    });
    blockDiv.appendChild(mainDiv);
  }
}
