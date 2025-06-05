export default function decorate(block) {
  const htag = block.children[0].children[0].children[0];
  if (htag) {
    htag.classList.add('enrolling-heading');
  }
  const ul = document.createElement('div');
  const imageWrapperDiv = block.parentElement;
  const id = htag.innerText.replace(/\s+/g, '-').toLowerCase(); // Replace whitespace with hyphens
  htag.id = id;
  imageWrapperDiv.prepend(htag);
  [...block.children].forEach((row, index) => {
    const li = document.createElement('div');
    li.classList.add(`enrolling-${index}-column`);
    if (index > 0) {
      while (row.firstElementChild) {
        li.append(row.firstElementChild);
        [...li.children].forEach((div) => {
          div.className = 'cards-card-body';
        });
        ul.append(li);
      }
    }
  });
  block.textContent = '';
  block.append(ul);
  ul.classList.add(`column-${ul.children.length}-variation`);
}
