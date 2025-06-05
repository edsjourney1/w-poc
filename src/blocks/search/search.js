import sampleData from './sample-data.js';
import { searchFilters, searchQuery, searchURL } from './search-config.js';
import { enableAutocomplete } from './search-auto-complete.js';

const searchParent = document.querySelector('.search-container');
const allSearchItems = Array.from(document.querySelectorAll('.search-wrapper'));
const allSearchBlocks = [];
let searchWrap;
let searchGrid;
let searchLeftCol;
let searchRightCol;
let dialogContent;
let searchHeadTermStr;
// let searchFootTermStr;
let searchHeadTerm;
// eslint-disable-next-line
let searchFootTerm;
let filterLabels;
let modalLabels;
let bannerParent;
const bodyElem = document.querySelector('body');

const generateFacetId = (key1, num1, key2, num2, count) => {
  let str = key1.split(' ').join('_').split('-').join('_');
  if (key2) {
    str += `_${key2.split(' ').join('_').split('-').join('_')}`;
  }
  if (num1) {
    str += `_${num1}_${count}`;
  }
  if (num2) {
    str += `_${num2}_${count}`;
  }
  return str;
};

const updateModalHeight = () => {
  setTimeout(() => {
    if (dialogContent && bannerParent) {
      dialogContent.style.height = `${
        window.outerHeight - bannerParent.clientHeight - 60 - 64 - 42 - 43
      }px`;
    }
  }, 2000);
};

const updateTextHeights = () => {
  let pTag;
  let hiddenTag;
  Array.from(searchRightCol.querySelectorAll('ul > li')).forEach((liTag) => {
    pTag = liTag.querySelector('p');
    hiddenTag = liTag.querySelector('input[type=hidden');
    if (pTag && hiddenTag) {
      pTag.innerHTML = hiddenTag.value;
      if (pTag.clientHeight > 50) {
        while (pTag.clientHeight > 50) {
          pTag.innerHTML = pTag.innerHTML.substr(0, pTag.innerHTML.length - 1);
        }
        pTag.innerHTML = `${pTag.innerHTML.substr(0, pTag.innerHTML.length - 5)}...`;
      }
    }
  });
};

const updateFacetElements = (category, i1, count) => {
  const ul = document.createElement('ul');
  const isAnyFacetSelected = (category.facets || []).find((facet) => facet.selected);
  ul.innerHTML = `
    <li><h3>${category.title}</h3></li>
    <li><input id='${generateFacetId(category.key, i1 + 1, null, null, count)}'
      type='checkbox' name='${category.key}' data-value='all' ${
        isAnyFacetSelected ? '' : 'checked'
      }>
      <label for='${generateFacetId(category.key, i1 + 1, null, null, count)}'>
        All
        <i class="fa-solid fa-check"></i>
      </label>
    </li>`;
  (category.facets || []).forEach((facet, i2) => {
    ul.innerHTML += `<li>
      <input id='${generateFacetId(category.key, i1 + 1, facet.value, i2 + 1, count)}'
        type='checkbox' name='${category.key}' data-value='${facet.value}' ${
          facet.selected ? 'checked' : ''
        }>
        <label for='${generateFacetId(category.key, i1 + 1, facet.value, i2 + 1, count)}'>
          ${facet.title}
          <i class="fa-solid fa-check"></i>
        </label>
    </li>`;
  });

  return ul;
};

export const searchResultAPI = (searchterm, currentPage = 1) => {
  const variables = {
    q: searchterm || 'test',
    language: 'EN',
    sort: ['BEST_MATCH', 'DISPLAYDATE_ASC'],
    offset: 10 * currentPage,
    limit: 10,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchQuery, variables }),
  };

  fetch(searchURL, requestOptions)
    // fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('=============================GraphQL-Data:', data);
      // Process the returned data here
      // eslint-disable-next-line
      buildSearchGrid(data);
    })
    .catch((error) => {
      console.error('Error fetching GraphQL data:', error);
    });
};
searchResultAPI('test', 1);
const buildSearchGrid = (data) => {
  if (searchGrid && searchLeftCol && searchRightCol) {
    (searchFilters || []).forEach((category, i1) => {
      searchLeftCol.append(updateFacetElements(category, i1, 0));
      dialogContent.append(updateFacetElements(category, i1, 1));
    });

    const { currentPage, pageSize, totalSize } = sampleData;

    searchHeadTermStr = searchHeadTermStr.replaceAll('{{1}}', (currentPage - 1) * pageSize + 1);
    searchHeadTermStr = searchHeadTermStr.replaceAll(
      '{{2}}',
      currentPage * pageSize > totalSize ? totalSize : currentPage * pageSize,
    );
    searchHeadTermStr = searchHeadTermStr.replaceAll('{{3}}', totalSize);
    searchHeadTermStr = searchHeadTermStr.replaceAll('{{4}}', `<strong>"${sampleData.q}"</strong>`);

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
    let currentPages = 1;
    const itemsPerPage = 10;
    // eslint-disable-next-line
    function renderItems() {
      blockDiv.innerHTML = '';
      const startIndex = (currentPages - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      countList.innerHTML = '';
      const showingText = document.createElement('p');
      showingText.textContent = 'showing';
      countList.appendChild(showingText);
      const showingSpan = document.createElement('span');
      showingSpan.textContent = `${startIndex + 1} - ${Math.min(endIndex, data.data.search.count)}`;
      countList.appendChild(showingSpan);
      const ofText = document.createElement('p');
      ofText.textContent = 'of';
      countList.appendChild(ofText);
      const ofSpan = document.createElement('span');
      ofSpan.textContent = data.data.search.count;
      countList.appendChild(ofSpan);
    }
    // eslint-disable-next-line
    function renderPagination() {
      const totalPages = Math.ceil(data.data.search.count / itemsPerPage);
      countResult.innerHTML = '';

      // Function to create a pagination button
      function createButton(text, page) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
          currentPages = page;
          renderItems();
          searchResultAPI('test', currentPages);
          renderPagination();
        });
        if (page === currentPages) {
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
        currentPages = 1;
        renderPagination();
        searchResultAPI('test', currentPages);
        renderItems();
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
        if (currentPages > 1) {
          currentPages -= 1;
          renderItems();
          renderPagination();
          searchResultAPI('test', currentPages);
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
      } else if (currentPages <= 3) {
        for (let i = 1; i <= 3; i += 1) {
          countResult.appendChild(createButton(i, i));
        }
        countResult.appendChild(createEllipsis());
        countResult.appendChild(createButton(totalPages, totalPages));
      } else if (currentPages >= totalPages - 2) {
        countResult.appendChild(createButton(1, 1));
        countResult.appendChild(createEllipsis());
        for (let i = totalPages - 2; i <= totalPages; i += 1) {
          countResult.appendChild(createButton(i, i));
        }
      } else {
        countResult.appendChild(createButton(1, 1));
        countResult.appendChild(createEllipsis());
        for (let i = currentPages - 1; i <= currentPages + 1; i += 1) {
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
        if (currentPages < totalPages) {
          currentPages += 1;
          renderItems();
          renderPagination();
          searchResultAPI('test', currentPages);
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
        currentPages = totalPages;
        renderItems();
        renderPagination();
        searchResultAPI('test', currentPages);
      });
      lastPageButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          lastPageButton.click();
        }
      });
      countResult.appendChild(lastPageButton);

      renderItems();
      searchResultAPI('test', currentPages);
      // Get the p tag with the i tag that has the class "fa-chevrons-left"
      // const doublePreviousPageButton = searchRightCol.querySelector(
      //   '.count-result p i.fa-chevrons-left',
      // ).parentElement;
      // const doubleforwardPageButton = searchRightCol.querySelector(
      //   '.count-result p i.fa-chevrons-right',
      // ).parentElement;
      // const PreviousPageButton = searchRightCol.querySelector(
      //   '.count-result p i.fa-chevron-left',
      // ).parentElement;
      // const forwardPageButton = searchRightCol.querySelector(
      //   '.count-result p i.fa-chevron-right',
      // ).parentElement;

      // Get the first button
      // const firstButton = searchRightCol.querySelector('.count-result button');
      // // Get all buttons
      // const buttons = searchRightCol.querySelectorAll('.count-result button');
      // // get last button
      // const lastButton = searchRightCol.querySelector('.count-result button:last-of-type');
      // // get the second & last before button
      // const secondButton = buttons[1];
      // const lastButtonBeforeLast = buttons[buttons.length - 2];

      // Check if the first button has the class "active"
      // if (firstButton.classList.contains('active')) {
      //   // Add the class "dp-blur" to the p tag
      //   PreviousPageButton.classList.add('dp-blur');
      //   PreviousPageButton.tabIndex = -1;
      // } else {
      //   // Remove the class "dp-blur" from the p tag
      //   PreviousPageButton.classList.remove('dp-blur');
      //   PreviousPageButton.tabIndex = 0;
      // }

      // // Check if the first button has the class "active"
      // if (firstButton.classList.contains('active') || secondButton.classList.contains('active')) {
      //   // Add the class "dp-none" to the p tag
      //   doublePreviousPageButton.classList.add('dp-none');
      //   doublePreviousPageButton.tabIndex = -1;
      // } else {
      //   // Remove the class "dp-none" from the p tag
      //   doublePreviousPageButton.classList.remove('dp-none');
      //   doublePreviousPageButton.tabIndex = 0;
      // }
      // // Check if the last button has the class "active"
      // if (lastButton.classList.contains('active')) {
      //   // Add the class "dp-blur" to the p tag
      //   forwardPageButton.classList.add('dp-blur');
      //   forwardPageButton.tabIndex = -1;
      // } else {
      //   // Remove the class "dp-blur" from the p tag
      //   forwardPageButton.classList.remove('dp-blur');
      //   forwardPageButton.tabIndex = 0;
      // }

      // // Check if the first button has the class "active"
      // if (
      //   lastButton.classList.contains('active') ||
      //   lastButtonBeforeLast.classList.contains('active')
      // ) {
      //   Add the class "dp-none" to the p tag
      //   doubleforwardPageButton.classList.add('dp-none');
      //   doubleforwardPageButton.tabIndex = -1;
      // } else {
      //   // Remove the class "dp-none" from the p tag
      //   doubleforwardPageButton.classList.remove('dp-none');
      //   doubleforwardPageButton.tabIndex = 0;
      // }
    }
    renderPagination();
    const searchList = document.createElement('ul');
    let str = '';
    let pdfStr = '';
    (data.data.search.items || []).forEach((item) => {
      pdfStr = '';
      if (item.isPDF) {
        pdfStr = `<span class='icon icon-regular--file-pdf'>
          <i class='fa-regular fa-file-pdf' data-icon-name='regular--file-pdf'></i>
        </span>`;
      }
      str += `<li>
        <a href='${window.origin}${item.path}'><h3>${item.title} ${pdfStr}</h3></a>
        <input type='hidden' value='${item.description}'/>
        <div class='search-results-desc'><p>${item.description}</p></div>
        <cite>${item.url}</cite>
      </li>`;
    });
    searchList.innerHTML = str;

    searchRightCol.append(searchHeadTerm);
    searchRightCol.append(searchList);
    searchRightCol.append(paginationDiv);
    // searchRightCol.append(searchFootTerm);
    // render pagination
    // renderPagination()
    updateModalHeight();
    updateTextHeights();
  }
};

const buildSearchBanner = (bannerBlock) => {
  // bannerBlock, bannerEl, searchGrid
  bannerParent = document.querySelector('.search-container');
  const searchFormParent = document.createElement('div');
  const searchLabelWrapper = bannerBlock.querySelector(':scope > div:nth-child(2)');
  if (searchLabelWrapper) {
    const [searchLabel, ctaLabel] = searchLabelWrapper.children;
    searchFormParent.innerHTML = `<form><div class='search-form-grid'>
      <div class='search-form-col'>
        <div class='search-form-input'>
          <i class='fa-solid fa-magnifying-glass'></i>
          <label for='search_term'>${searchLabel.querySelector('p').innerHTML}</label>
          <input id='search_term' placeholder='${
            searchLabel.querySelector('p').innerHTML
          }' type='search'/>
        </div>
      </div>
      <div class='search-form-col'>
        <button type='submit'><span>${
          ctaLabel.querySelector('p').innerHTML
        }</span><i class='fa-solid fa-magnifying-glass'></i></button>
      </div>
    </div></form>`;
    bannerBlock.append(searchFormParent);
  }
};

const initSearch = () => {
  searchWrap = document.createElement('section');
  searchGrid = document.createElement('div');
  searchLeftCol = document.createElement('div');
  searchRightCol = document.createElement('div');
  searchWrap.classList.add('search-grid-wrapper');
  searchGrid.classList.add('search-grid');

  searchLeftCol.classList.add('search-filters');
  searchRightCol.classList.add('search-results');

  buildSearchBanner(allSearchBlocks[0], searchGrid);

  searchGrid.append(searchLeftCol);
  searchGrid.append(searchRightCol);
  searchWrap.append(searchGrid);

  searchParent.parentElement.append(searchWrap);

  [searchHeadTerm, searchFootTerm, filterLabels, modalLabels] = allSearchBlocks[1].children;

  const filterToggleBtn = document.createElement('div');
  const [searchCTALabel, searchFilterModalLabel] = filterLabels.children;
  filterToggleBtn.innerHTML = `<button type="button"><i class="fa-solid fa-filter"></i><span>${searchCTALabel.textContent}</span></button>`;
  filterToggleBtn.className = 'search-filters-toggle';

  searchWrap.insertBefore(filterToggleBtn, searchGrid);

  searchHeadTermStr = searchHeadTerm.querySelector('p')?.innerHTML || '';
  // searchFootTermStr = searchFootTerm.querySelector('p')?.innerHTML || '';

  const searchDialog = document.createElement('dialog');
  searchDialog.classList.add('search-filters-dialog');
  searchDialog.innerHTML = `<div class='search-filters-dialog-header'>
    <h4>${searchFilterModalLabel.textContent}</h4>
    <button type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
  </div>
  <div class='search-filters-dialog-content search-filters'>
  </div>
  <div class='search-filters-dialog-footer'>
    <button type="button">${modalLabels.children[0].textContent}</button>
    <button type="button">${modalLabels.children[1].textContent}</button>
  </div>
  `;
  bodyElem.append(searchDialog);

  filterToggleBtn.addEventListener('click', () => {
    bodyElem.classList.add('search-filters-open');
    searchDialog.showModal();
  });
  searchDialog
    .querySelector('.search-filters-dialog-header button')
    ?.addEventListener('click', () => {
      bodyElem.classList.remove('search-filters-open');
      searchDialog.close();
    });

  dialogContent = searchDialog.querySelector('.search-filters-dialog-content');
};

export default async function decorate(block) {
  const thisBlock = block;
  if (!thisBlock.classList.contains('search-banner')) {
    thisBlock.classList.add('search-hidden');
    thisBlock.setAttribute('aria-hidden', true);
  } else {
    thisBlock.querySelector(':scope > div:nth-child(2)')?.classList.add('search-hidden');
    thisBlock.querySelector(':scope > div:last-child')?.classList.add('search-hidden');
    thisBlock.querySelector(':scope > div:last-child')?.setAttribute('aria-hidden', true);
  }
  allSearchBlocks.push(thisBlock);

  if (allSearchItems.length === allSearchBlocks.length) {
    initSearch();
    enableAutocomplete(searchResultAPI, 'test');
  }
}

const debounceResize = (func) => {
  let timer;
  return (event) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, 100, event);
  };
};

window.addEventListener(
  'resize',
  debounceResize(() => {
    updateModalHeight();
  }),
);
