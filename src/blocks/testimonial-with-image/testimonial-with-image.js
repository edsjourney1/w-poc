export default function decorate(block) {
  // Get the parent element and create a new unordered list
  const { parentElement } = block;
  const ul = document.createElement('ul');

  // Get the title from the first child and prepend it
  const title = block.children[0]?.innerText || '';
  const mainHeading = document.createElement('h2');
  mainHeading.classList.add('testimonial-heading');
  mainHeading.textContent = title;
  parentElement.prepend(mainHeading);

  // Get the link from the last child
  const lastChildIndex = block.children.length - 1;
  const lastChild = block.children[lastChildIndex];
  const linkDiv = document.createElement('div');

  // Check if the last child has content
  if (lastChild && lastChild.innerText.trim() !== '') {
    const link = lastChild.innerText;
    const hyperLink = document.createElement('a');
    const Href = lastChild.children[0].children[0].children[0].href;
    hyperLink.classList.add('testimonial-link');
    hyperLink.textContent = link;
    hyperLink.href = Href;
    linkDiv.prepend(hyperLink);
    const Icon = lastChild.children[0].children[0].children[1];
    if (Icon) {
      Icon.classList.add('link-img');
      linkDiv.append(Icon);
    }

    // Get the image for the link
    const linkImg = document.createElement('img');
    linkImg.src = '/icons/right-arrow.svg';
    linkImg.setAttribute('data-icon-name', 'right-arrow');
    linkImg.className = 'link-img';
    linkDiv.append(linkImg);
  }
  parentElement.append(linkDiv);

  // Create a static array of children to avoid live collection issues
  const childrenArray = Array.from(block.children);

  const testimonialFlag = block.closest('.section');
  if (testimonialFlag.classList.contains('testimonial-with-image-container')) {
    // Process the remaining children to create list items
    childrenArray.forEach((row, index) => {
      if (index < childrenArray.length - 1 && index > 0) {
        const li = document.createElement('li');
        while (row.firstElementChild) li.append(row.firstElementChild);

        // Set class for the list item
        li.className = 'testimonial-card';

        // Get the image from the icon and append it to the list
        const imgTag = document.createElement('img');
        imgTag.src = '/icons/quote.svg';
        imgTag.setAttribute('data-icon-name', 'quote');

        const pTag = li.querySelector('p');
        if (pTag) {
          pTag.className = 'testimonial-description';
        }
        // Check for h3 and p tags before setting class
        const hTag = li.querySelector('h3');
        if (hTag) {
          hTag.className = 'testimonial-title';
          hTag.parentElement.prepend(imgTag);
        } else if (pTag) {
          pTag.parentElement.prepend(imgTag);
        }

        ul.append(li);
      }
    });
  } else {
    childrenArray.forEach((row, index) => {
      if (index < childrenArray.length - 1 && index > 0) {
        const li = document.createElement('li');
        while (row.firstElementChild) li.append(row.firstElementChild);

        // Set class for the list item
        li.className = 'testimonial-card';

        // Get the image from the icon and append it to the list
        const imgTag = document.createElement('img');
        imgTag.src = '/icons/quote.svg';
        imgTag.setAttribute('data-icon-name', 'quote');

        const pTag = li.querySelector('p');
        if (pTag) {
          pTag.className = 'testimonial-description';
        }
        // Check for h3 and p tags before setting class
        const hTag = li.querySelector('h3');
        if (hTag) {
          hTag.className = 'testimonial-title';
          hTag.parentElement.prepend(imgTag);
        } else if (pTag) {
          pTag.parentElement.prepend(imgTag);
        }
        ul.append(li);
      }
    });
  }
  // Clear the original block content and append the new list
  block.textContent = '';
  block.append(ul);
}
