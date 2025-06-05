import { renderImages } from '../../scripts/externalImage.js';
import { excelDateToDate } from '../../scripts/tools.js';

export default async function decorate(block) {
  const mainPageURL = String(block.children[0].textContent);
  block.innerHTML = '';
  const data = await fetch('/query-index.json');
  const json = await data.json();
  const postArticle = json.data.find((item) => {
    const relativeUrl = new URL(item.url.trim()).pathname;
    return relativeUrl === mainPageURL.trim();
  });
  const relativeUrl = new URL(postArticle.url).pathname;
  const blogHero = document.createElement('div');
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('image-div');
  const imageAnchor = document.createElement('a');
  const imageAlt = postArticle.image.split('#');
  // imageAnchor.href = image;
  imageDiv.append(imageAnchor);
  const imagePara = document.createElement('p');
  // eslint-disable-next-line
  imageAnchor.href = imageAlt[0];
  imagePara.append(imageAnchor);
  const imageEm = document.createElement('em');
  const imageEmanchor = document.createElement('a');
  imageEmanchor.href = `${relativeUrl}#${postArticle.title}-thumbnail`;
  // imageEmanchor.textContent = `${relativeUrl}#${postArticle.title}`;
  imageEm.append(imageEmanchor);
  imagePara.append(imageEm);
  imageDiv.append(imagePara);
  renderImages(imageDiv);
  // mainDiv.appendChild(imageDiv);
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content-div');
  const button = document.createElement('p');
  button.classList.add('button-container');
  const buttonanchor = document.createElement('a');
  buttonanchor.classList.add('button', 'primary');
  buttonanchor.setAttribute('href', `${mainPageURL}`);
  buttonanchor.innerText = 'Read more';
  buttonanchor.ariaLabel = `Read more about the ${postArticle.title} article`;
  button.append(buttonanchor);
  const categoryDateDiv = document.createElement('div');
  categoryDateDiv.classList.add('date-div');
  const descriptionDiv = document.createElement('div');
  const descriptionPara = document.createElement('p');
  const heading = document.createElement('h2');
  const mainText = postArticle.text;
  let articleText;
  if (mainText?.includes('.jpg')) {
    articleText = mainText.split('.jpg');
  }
  if (mainText?.includes('.png')) {
    articleText = mainText.split('.png');
  }
  heading.append(postArticle.title);
  descriptionPara.append(articleText[1].trim());
  descriptionDiv.append(descriptionPara);
  descriptionDiv.classList.add('description');
  const dateandtime = document.createElement('p');
  const span = document.createElement('span');
  const pubDate = document.createElement('p');
  pubDate.classList.add('date');
  pubDate.textContent = postArticle.publishedDate.includes('/')
    ? postArticle.publishedDate
    : excelDateToDate(postArticle.publishedDate);
  if (postArticle.publishedDate !== '') {
    span.append(pubDate);
  }
  const articletime = document.createElement('span');
  if (postArticle.readTime !== '') {
    articletime.append(`${postArticle.readTime} min read`);
  }
  dateandtime.append(span, articletime);
  const categoryPara = document.createElement('p');
  categoryPara.classList.add('category-list');
  postArticle.tags.split(',').forEach((item) => {
    const categorySpan = document.createElement('a');
    // eslint-disable-next-line
    const url = `/${postArticle.segment}/tags/${item
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      // eslint-disable-next-line quotes
      .replaceAll("'", '')}`;
    categorySpan.href = window.location.origin + url;
    categorySpan.textContent = item.trim();
    categoryPara.append(categorySpan);
  });
  categoryDateDiv.append(dateandtime, categoryPara);
  contentDiv.append(heading, categoryDateDiv, descriptionDiv, button);
  blogHero.append(imageDiv, contentDiv);
  block.append(blogHero);
}
