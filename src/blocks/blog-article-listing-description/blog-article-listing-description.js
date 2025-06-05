import { renderImages } from '../../scripts/externalImage.js';
import { excelDateToDate } from '../../scripts/tools.js';

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
    categoryBasedJson = json.data.filter((article) => article.tags.split(',').map((s)=>s.toLowerCase().trim()).includes(tagByauthor.toLowerCase()));
  }
  const heading = block.children[0].children[0].innerText;
  const itemsPerPage = Number(block.children[0].children[1].innerText);
  const headingSpam = document.createElement('h2');
  headingSpam.classList.add('title');
  headingSpam.append(heading);
  const headDiv = document.createElement('div');
  headDiv.classList.add('heading-div');
  headDiv.append(headingSpam);
  block.innerHTML = '';
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('cards-div');
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('pagination');
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-container');
  const countList = document.createElement('div');
  countList.classList.add('count-list');
  const countResult = document.createElement('div');
  countResult.classList.add('count-result');
  paginationContainer.append(countList, countResult);
  paginationDiv.append(paginationContainer);
  block.append(headDiv, blockDiv, paginationDiv);
  let currentPage = 1;
  const mainURL = window.location.href;
  let segmentFilter;
  if (mainURL.includes('blue-at-work')) {
    segmentFilter = 'blue-at-work';
  } else if (mainURL.includes('blue')) {
    segmentFilter = 'blue';
  }
  const segmentFilterJSON = categoryBasedJson.filter((item) => item.segment === segmentFilter);
  function renderItems() {
    blockDiv.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const jsonVar = segmentFilterJSON.slice(startIndex, endIndex);
    const sortedJSON = jsonVar.sort((a, b) => {
      const dateA = new Date(a.publishedDate?.split('/').reverse().join('/'));
      const dateB = new Date(b.publishedDate?.split('/').reverse().join('/'));
      return dateA - dateB;
    });
    sortedJSON.forEach(
      ({ image, tags, publishedDate, readTime, title, description, url, segment }) => {
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

        const cardDesc = document.createElement('p');
        cardDesc.classList.add('description');
        cardDesc.innerHTML = description;
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
          // eslint-disable-next-line
          const mainUrl = `/${segment}/tags/${item
            .trim()
            .toLowerCase()
            .replaceAll(' ', '-')
            // eslint-disable-next-line quotes
            .replaceAll("'", '')}`;
          anchor.href = window.location.origin + mainUrl;
          anchor.textContent = item.trim();
          anchor.title = item.trim();
          categoryPara.appendChild(anchor);
        });

        blockDiv.appendChild(mainDiv);
      },
    );
    countList.innerHTML = '';
    const showingText = document.createElement('p');
    showingText.textContent = 'Showing';
    countList.appendChild(showingText);
    const showingSpan = document.createElement('span');
    showingSpan.textContent = `${startIndex + 1} - ${Math.min(endIndex, segmentFilterJSON.length)}`;
    countList.appendChild(showingSpan);
    const ofText = document.createElement('p');
    ofText.textContent = 'of';
    countList.appendChild(ofText);
    const ofSpan = document.createElement('span');
    ofSpan.textContent = segmentFilterJSON.length;
    countList.appendChild(ofSpan);
  }

  function renderPagination() {
    const totalPages = Math.ceil(segmentFilterJSON.length / itemsPerPage);
    countResult.innerHTML = '';

    // Function to create a pagination button
    function createButton(text, page) {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', () => {
        currentPage = page;
        renderItems();
        renderPagination();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
      if (page === currentPage) {
        button.classList.add('active');
      }
      return button;
    }

    // Function to create an ellipsis button
    function createEllipsis() {
      const ellipsis = document.createElement('button');
      ellipsis.textContent = '...';
      ellipsis.disabled = true;
      return ellipsis;
    }

    // Create previous page button
    const previousPageButton = document.createElement('p');
    previousPageButton.innerHTML = '<i class="fa-regular fa-chevrons-left"></i>';
    previousPageButton.tabIndex = 0;
    previousPageButton.role = 'button';
    previousPageButton.ariaLabel = 'Go to first page';
    previousPageButton.addEventListener('click', () => {
      currentPage = 1;
      renderItems();
      renderPagination();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
    previousPageButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        previousPageButton.click();
      }
    });
    countResult.appendChild(previousPageButton);

    // Create first page button
    const firstPageButton = document.createElement('p');
    firstPageButton.innerHTML = '<i class="fa-regular fa-chevron-left"></i>';
    firstPageButton.tabIndex = 0;
    firstPageButton.role = 'button';
    firstPageButton.ariaLabel = 'Go to previous page';
    firstPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderItems();
        renderPagination();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
    firstPageButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        firstPageButton.click();
      }
    });
    countResult.appendChild(firstPageButton);

    // Create pagination buttons
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) {
        countResult.appendChild(createButton(i, i));
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 3; i += 1) {
        countResult.appendChild(createButton(i, i));
      }
      countResult.appendChild(createEllipsis());
      countResult.appendChild(createButton(totalPages, totalPages));
    } else if (currentPage >= totalPages - 2) {
      countResult.appendChild(createButton(1, 1));
      countResult.appendChild(createEllipsis());
      for (let i = totalPages - 2; i <= totalPages; i += 1) {
        countResult.appendChild(createButton(i, i));
      }
    } else {
      countResult.appendChild(createButton(1, 1));
      countResult.appendChild(createEllipsis());
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
        countResult.appendChild(createButton(i, i));
      }
      countResult.appendChild(createEllipsis());
      countResult.appendChild(createButton(totalPages, totalPages));
    }

    // Create next page button
    const nextPageButton = document.createElement('p');
    nextPageButton.innerHTML = '<i class="fa-regular fa-chevron-right"></i>';
    nextPageButton.tabIndex = 0;
    nextPageButton.role = 'button';
    nextPageButton.ariaLabel = 'Go to next page';
    nextPageButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        renderItems();
        renderPagination();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
    nextPageButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        nextPageButton.click();
      }
    });
    countResult.appendChild(nextPageButton);

    // Create last page button
    const lastPageButton = document.createElement('p');
    lastPageButton.innerHTML = '<i class="fa-regular fa-chevrons-right"></i>';
    lastPageButton.tabIndex = 0;
    lastPageButton.role = 'button';
    lastPageButton.ariaLabel = 'Go to last page';
    lastPageButton.addEventListener('click', () => {
      currentPage = totalPages;
      renderItems();
      renderPagination();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
    lastPageButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        lastPageButton.click();
      }
    });
    countResult.appendChild(lastPageButton);

    renderItems();
    // Get the p tag with the i tag that has the class "fa-chevrons-left"
    const doublePreviousPageButton = block.querySelector(
      '.count-result p i.fa-chevrons-left',
    ).parentElement;
    const doubleforwardPageButton = block.querySelector(
      '.count-result p i.fa-chevrons-right',
    ).parentElement;
    const PreviousPageButton = block.querySelector(
      '.count-result p i.fa-chevron-left',
    ).parentElement;
    const forwardPageButton = block.querySelector(
      '.count-result p i.fa-chevron-right',
    ).parentElement;

    // Get the first button
    const firstButton = block.querySelector('.count-result button');
    // Get all buttons
    const buttons = block.querySelectorAll('.count-result button');
    // get last button
    const lastButton = block.querySelector('.count-result button:last-of-type');
    // get the second & last before button
    const secondButton = buttons[1];
    const lastButtonBeforeLast = buttons[buttons.length - 2];

    // Check if the first button has the class "active"
    if (firstButton.classList.contains('active')) {
      // Add the class "dp-blur" to the p tag
      PreviousPageButton.classList.add('dp-blur');
      PreviousPageButton.tabIndex = -1;
    } else {
      // Remove the class "dp-blur" from the p tag
      PreviousPageButton.classList.remove('dp-blur');
      PreviousPageButton.tabIndex = 0;
    }

    // Check if the first button has the class "active"
    if (firstButton.classList.contains('active') || secondButton.classList.contains('active')) {
      // Add the class "dp-none" to the p tag
      doublePreviousPageButton.classList.add('dp-none');
      doublePreviousPageButton.tabIndex = -1;
    } else {
      // Remove the class "dp-none" from the p tag
      doublePreviousPageButton.classList.remove('dp-none');
      doublePreviousPageButton.tabIndex = 0;
    }
    // Check if the last button has the class "active"
    if (lastButton.classList.contains('active')) {
      // Add the class "dp-blur" to the p tag
      forwardPageButton.classList.add('dp-blur');
      forwardPageButton.tabIndex = -1;
    } else {
      // Remove the class "dp-blur" from the p tag
      forwardPageButton.classList.remove('dp-blur');
      forwardPageButton.tabIndex = 0;
    }

    // Check if the first button has the class "active"
    if (
      lastButton.classList.contains('active') ||
      lastButtonBeforeLast.classList.contains('active')
    ) {
      // Add the class "dp-none" to the p tag
      doubleforwardPageButton.classList.add('dp-none');
      doubleforwardPageButton.tabIndex = -1;
    } else {
      // Remove the class "dp-none" from the p tag
      doubleforwardPageButton.classList.remove('dp-none');
      doubleforwardPageButton.tabIndex = 0;
    }
  }
  if (segmentFilterJSON.length > 10) {
    renderPagination();
  } else {
    renderItems();
  }
}
