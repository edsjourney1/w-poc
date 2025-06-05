import { renderImages } from '../../scripts/externalImage.js';
import { excelDateToDate } from '../../scripts/tools.js';

export default async function decorate(block) {
  const data = await fetch('/query-index.json');
  const json = await data.json();
  const heading = block.children[0].children[0].textContent;
  const inlinewithIcon = block.children[0].children[1].innerHTML;

  const headingSpam = document.createElement('h2');
  headingSpam.classList.add('stories-title');
  headingSpam.textContent = heading;

  const iconwithtext = document.createElement('span');
  iconwithtext.classList.add('line-icon');
  iconwithtext.innerHTML = inlinewithIcon;

  const headDiv = document.createElement('div');
  headDiv.classList.add('new-heading');
  headDiv.append(headingSpam, iconwithtext);

  block.innerHTML = '';
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('new-cards');
  block.append(headDiv, blockDiv);

  function renderItems() {
    json.data.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const latestArticles = json.data.slice(0, 3);

    latestArticles.forEach(
      ({ image, tags, publishedDate, readTime, title, url, segment, description }) => {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('new-card-div');
        // const relativeUrl = new URL(url).pathname;
        // const imageDiv = document.createElement('div');
        // imageDiv.classList.add('image-div');
        // const imageAnchor = document.createElement('a');
        // const imageSrc = document.createElement('img');
        // imageSrc.src = image;
        // const imageAlt = image.split('#');
        // // eslint-disable-next-line prefer-destructuring
        // imageSrc.src = imageAlt[0];
        // imageSrc.alt = imageAlt[1] || '';
        // imageAnchor.append(imageSrc);
        // imageAnchor.href = `${relativeUrl}`;
        // imageDiv.append(imageAnchor);
        // mainDiv.appendChild(imageDiv);
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
        imageEmanchor.href = `${relativeUrl}`;
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

        const cardDesc = document.createElement('p');
        cardDesc.classList.add('description');
        cardDesc.textContent = description;
        contentDiv.appendChild(cardDesc);

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
          const mainUrl = `/${segment}/tags/${item
            .trim()
            .toLowerCase()
            .replaceAll(' ', '-')
            // eslint-disable-next-line quotes
            .replaceAll("'", '')}`;
          anchor.href = window.location.origin + mainUrl;
          anchor.innerText = item.trim();
          anchor.title = item;
          categoryPara.appendChild(anchor);
        });
        blockDiv.appendChild(mainDiv);
      },
    );
  }
  renderItems();
}
