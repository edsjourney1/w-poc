export default function decorate(block) {
  const title = block.children[0].innerText;
  const ul = document.createElement('ul');
  const imageWrapperDiv = block.parentElement;
  const mainHeading = document.createElement('h2');
  mainHeading.textContent = `${title}`;
  mainHeading.classList.add('title');
  imageWrapperDiv.prepend(mainHeading);
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    if (index > 0) {
      while (row.firstElementChild) {
        li.append(row.firstElementChild);
        [...li.children].forEach((div) => {
          div.className = 'block-div';
          const hTags = li.querySelector(':is(h1, h2, h3, h4, h5, h6)');
          const innerText = hTags.innerText.replace(/\s+/g, '-').toLowerCase();
          hTags.id = innerText;
        });
        ul.append(li);
      }
    }
  });
  block.textContent = '';
  block.append(ul);
}
