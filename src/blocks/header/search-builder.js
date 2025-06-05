export const searchBuilder = (searchInfo, searchToggle) => {
  if (!(searchInfo && searchToggle)) {
    return '';
  }

  return `<div class='siteheader-search-wrapper'>
          <button type='button' aria-label='Toggle Search'>
            ${searchToggle.querySelector('p:first-child').innerHTML}
            ${searchToggle.querySelector('p:last-child').innerHTML}
          </button>
          <div class='siteheader-search-inner'>
            <div class='siteheader-search-content'>
              <form action='/search' id='siteheader-search-form'>
                <label for='header_search'>
                  ${searchInfo.querySelector('p:first-child em').innerHTML}
                </label>
                <div class='siteheader-search-input-wrapper'>
                  <input type='search' name='q' id='header_search'
                    autocorrect='off' autocomplete='off' autocapitalize='off' maxlength='2048'
                    placeholder='${searchInfo.querySelector('p:nth-child(2) em').innerHTML}'/>
                  <button type='submit' aria-label='Search'>
                    ${searchInfo.querySelector('p:last-child em').innerHTML}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>`;
};

/*
    const suggestionQuery = `query Suggest($term: String!, $language: LanguageEnum = EN, $limit: Int = 5, $audience: AudienceEnum = ALL_AUDIENCE) {
      suggest(term: $term, language: $language, limit: $limit, audience: $audience) {
        items {
          WELLMARK_COM {
            highlights
          }
          WELLMARK_BLUE {
            highlights
          }
        }
      }
    }`
     
    const variables = {
                term: searchData,
                limit: 5,
                audience: "ALL_AUDIENCE"
              };
     */

export const enableAutocomplete = (searchInput) => {
  if (window.autoComplete) {
    // function highlightExistingResult(query, listElm) {
    //   if (query < 3) return;
    //   console.log('---------------------------------');
    //   const items = listElm.querySelectorAll('li');
    //   items.forEach((item) => {
    //     item.textContent.includes(query) &&
    //   });
    // }
    // document.querySelector('#header_search').addEventListener('input', (e) => {
    //   const value = e.target.value.trim();
    //   const list = e.target.nextElementSibling;
    //   highlightExistingResult(value, list);
    // });
    const url = 'https://apigw-sit.wellmark.com/wellmark-com-open-search/v1/search';
    // const url = 'https://nwzqv94hr0.execute-api.us-east-1.amazonaws.com/dev/v1/search';
    const suggestionQuery = `query Suggest($term: String!, $language: LanguageEnum = EN, $limit: Int = 5, $audience: AudienceEnum = ALL_AUDIENCE) {
          suggest(term: $term, language: $language, limit: $limit, audience: $audience) {
            items {
              WELLMARK_COM {
                highlights
              }
              WELLMARK_BLUE {
                highlights
              }
            }
          }
        }`;
    // let flag = false;
    // eslint-disable-next-line no-new, new-cap
    const autoCompleteJS = new window.autoComplete({
      flag: true,
      name: searchInput,
      selector: `#${searchInput}`,
      data: {
        src: async (searchData) => {
          const resultDiv = autoCompleteJS.input.nextElementSibling;
          const loaderdiv = document.createElement('div');
          if (autoCompleteJS.flag) {
            autoCompleteJS.flag = false;
            loaderdiv.classList.add('loader');
            resultDiv.prepend(loaderdiv);
          }
          resultDiv.hidden = false;
          const variables = {
            term: searchData,
            limit: 5,
            audience: 'ALL_AUDIENCE',
          };
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: suggestionQuery, variables }),
          };
          // query
          try {
            // Fetch Data from external Source
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`Header Search Response status: ${response.status}`);
            }
            const json = await response.json();
            // await new Promise((res) => setTimeout(res, 1000));
            // const json = {
            //   data: {
            //     suggest: {
            //       items: {
            //         WELLMARK_COM: {
            //           highlights: ['<em>Wel</em>lmark', "<em>Wel</em>lmark's"],
            //         },
            //         WELLMARK_BLUE: {
            //           highlights: [
            //             '<em>Wel</em>lmark',
            //             '<em>wel</em>lness',
            //             '<em>wel</em>l-being',
            //             "<em>Wel</em>lmark's",
            //           ],
            //         },
            //       },
            //     },
            //   },
            // };

            // eslint-disable-next-line prefer-destructuring
            const items = json.data.suggest.items;
            const results = [];
            // eslint-disable-next-line
            for (const cat in items) {
              // change the for in loop later
              const highlights = items[cat].highlights || [];
              highlights.forEach((h) => {
                results.push({
                  match: h.replace('<em>', '').replace('</em>', ''),
                  cat,
                });
              });
            }
            return results;
          } catch (error) {
            return error;
          }
        },
        keys: ['match'],
      },
      query: (input) => {
        if (input.trim().length < 3) {
          document.querySelector('.siteheader-autocomplete').hidden = true;
        }
        return input.trim();
      },
      resultsList: {
        tag: 'ul',
        class: 'siteheader-autocomplete',
        noResults: true,
        maxResults: 15,
        tabSelect: true,
        element: (list, data) => {
          const info = document.createElement('p');
          if (data.results.length <= 0) {
            info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
          }
          list.prepend(info);
        },
      },
      submit: true,
      // cache: false,
      tabSelect: true,
      resultItem: {
        highlight: true,
        element: (item, data) => {
          item.style = 'display: flex; justify-content: space-between;';
          const currentCategory = data.value.cat;
          const previousItem = item.previousElementSibling;
          const prevcategory = previousItem?.getAttribute('data-cat');
          if (prevcategory !== currentCategory) {
            const heading = document.createElement('p');
            heading.textContent = currentCategory;
            heading.className = 'category-heading';
            heading.setAttribute('data-cat', currentCategory);
            item.before(heading);
          }
          // const content = document.createElement('div');
          // content.innerHTML = data.value.match;
          // item.appendChild(content);
          item.setAttribute('data-cat', currentCategory);
          // item.innerHTML = data.value.match;
          item.innerHTML = `
          <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
            ${data.match}
          </span>`;
        },
      },
      threshold: 3,
      debounce: 250,
      events: {
        input: {
          focus: () => {
            if (autoCompleteJS.input.value.length >= 3) {
              const ip = autoCompleteJS.input?.nextElementSibling;
              if (ip) {
                ip.hidden = false;
              }
              // ip && (ip.hidden = false);
              // document.querySelector('.siteheader-autocomplete').hidden = false;
              autoCompleteJS.start();
            }
          },
          blur: () => {
            const ip = autoCompleteJS.input?.nextElementSibling;
            if (ip) {
              ip.hidden = true;
            }
            // ip && (ip.hidden = true);
            // document.querySelector('.siteheader-autocomplete').hidden = true;
          },
        },
      },
    });

    autoCompleteJS.input.addEventListener('results', (event) => {
      const loader = event.target.nextElementSibling.querySelector('.loader');
      // eslint-disable-next-line
      loader && (loader.display = 'none');
    });
    autoCompleteJS.input.addEventListener('selection', (event) => {
      const feedback = event.detail;
      autoCompleteJS.input.blur();
      // Prepare User's Selected Value
      const selection = feedback.selection.value[feedback.selection.key];
      // // Replace Input value with the selected value
      autoCompleteJS.input.value = selection;
      // document.getElementById('siteheader-search-form').dispatchEvent(new Event('submit'));
      document.getElementById('siteheader-search-form').submit();
    });
  }
};

/*
     suggest - 
     suggest(term: $term, language: $language, limit: $limit, audience: $audience) {
        items {
          WELLMARK_COM {
            highlights
          }
          WELLMARK_BLUE {
            highlights
          }
        }
      }
    }
      recommend = 
    
      query Recommend(
      $language: LanguageEnum = EN
      $category: String
      $limit: Int = 10
      $offset: Int = 0
      $tags: [String]
    ) {
      recommend(
        language: $language
        category: $category
        limit: $limit
        tags: $tags
      ) {
        items {
          uuid
          title
          description
          image
          publishedDate
          readTime
          video
          tags
          category
          path
          template
          score
        }
        count
      }
    }
    
    search - 
    
    query Search(
      $q: String!
      $language: LanguageEnum = EN
      $audience: AudienceEnum = ALL_AUDIENCE
      $mediaType: MediaTypeEnum
      $sortField: String = "_score"
      $sortOption: SortOptionsEnum = DESC
      $limit: Int = 10
      $offset: Int = 0
    ) {
      search(
        q: $q
        language: $language
        audience: $audience
        mediaType: $mediaType
        sortField: $sortField
        sortOption: $sortOption
        limit: $limit
        offset: $offset
      ) {
        items {
          uuid
          title
          description
          path
          lastModified
          score
          url
          author
          template
          tags
          image
          publishedDate
          readtime
          category
          video
          text
        }
        count
      }
    }
    */
