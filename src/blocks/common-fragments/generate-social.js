const generateSocial = (fragment) => {
  const isArticlePage = document.querySelector('body').classList.contains('article-page');
  if (isArticlePage) {
    const lastElem = document.querySelector('.blog-article-listing-curated-wrapper');
    const mainElem = document.querySelector('main');
    const socialEl = fragment?.querySelector('.blog-social-links');
    const tempElem = document.createElement('div');
    tempElem.className = 'content-block';

    if (socialEl) {
      socialEl.setAttribute('role', 'region');
      socialEl.setAttribute('aria-label', 'Social Links');
      socialEl.classList.add('blog-social-links');

      const [socialDiv] = Array.from(socialEl.querySelectorAll(':scope > div:first-child > div'));
      socialDiv.parentNode.insertBefore(tempElem, socialDiv);
      [...socialDiv.querySelectorAll('p')].forEach((pTag) => {
        let btnEl = document.createElement('a');
        if (pTag.innerHTML.indexOf('facebook') !== -1) {
          btnEl.href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
          btnEl.target = '_blank';
        }
        if (pTag.innerHTML.indexOf('twitter') !== -1) {
          btnEl.href = `https://twitter.com/intent/tweet?url=${window.location.href}`;
          btnEl.target = '_blank';
        }
        if (pTag.innerHTML.indexOf('linkedin') !== -1) {
          btnEl.href = `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`;
          btnEl.target = '_blank';
        }
        if (pTag.innerHTML.indexOf('Email') !== -1 || pTag.innerHTML.indexOf('email') !== -1) {
          let h1Str = '';
          if (document.querySelector('h1')) {
            h1Str = document.querySelector('h1').innerHTML;
          }
          btnEl.href = `mailto:?subject=${h1Str}&body=${window.location.href}`;
        }
        if (pTag.innerHTML.indexOf('print') !== -1) {
          btnEl = document.createElement('button');
          btnEl.type = 'button';
          btnEl.addEventListener('click', (event) => {
            event.preventDefault();
            window.print();
          });
        }

        btnEl.append(pTag.querySelector('span'));
        btnEl.setAttribute('title', pTag.querySelector('em').innerHTML);

        pTag.replaceWith(btnEl);
      });

      // emEl.forEach((el) => {
      //   el.setAttribute('aria-hidden', true);
      // });

      if (lastElem) {
        lastElem.parentNode.insertBefore(socialEl, lastElem);
      } else {
        mainElem.append(socialEl);
      }
    }
  }
};

export default generateSocial;
