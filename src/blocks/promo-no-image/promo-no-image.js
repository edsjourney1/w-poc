export default function decorate(block) {
  const imageWrapperDiv = block.parentElement;
  let title;
  // eslint-disable-next-line
  if (block.children[0].children[0].children[0]) {
    // eslint-disable-next-line prefer-destructuring
    title = block.children[0].children[0].children[0];
    title.classList.add('promo-no-image-heading');
    imageWrapperDiv.prepend(title);
  }
  const mainDiv = document.createElement('div');
  const promoClass = `promo-no-image-${block.children.length - 1}-column`;
  mainDiv.classList.add(promoClass);
  [...block.children].forEach((row, index) => {
    if (index > 0) {
      const containerDiv = document.createElement('div');
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cards-card-image');
      const image = block.children[index].children[0].children[0];
      imageDiv.append(image);
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('cards-card-body');
      const content = block.children[index].children[1];
      contentDiv.append(content);
      containerDiv.append(imageDiv, contentDiv);
      mainDiv.append(containerDiv);
    }
  });
  block.innerHTML = '';
  block.append(mainDiv);
}
