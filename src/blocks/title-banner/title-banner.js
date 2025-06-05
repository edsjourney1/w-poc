export default function decorate(block) {
  // Check if block and its parent elements exist
  if (!block || !block.parentElement || !block.parentElement.parentElement) {
    return;
  }

  const parentEle = block.parentElement.parentElement;

  // Check if the parent element has the class 'one-btn-banner'
  if (parentEle.classList.contains('one-btn-banner')) {
    // Remove the class 'blue-550' if 'one-btn-banner' is present
    parentEle.classList.remove('blue-550');
  } else {
    // Add the class 'blue-550' if 'one-btn-banner' is not present
    parentEle.classList.add('blue-550');
  }

  // Get the title and description
  const titleElement = block.children[1]?.children[0];
  const titleClass = titleElement ? titleElement.querySelector('h1, p:first-child') : null;
  const descrElement = block.children[1]?.children[1];
  const descrClass = descrElement ? descrElement.querySelectorAll('p') : null;
  const listClass = block.children[1] && block.children[1].querySelector('ul, ol');

  // Create the main div
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('tbnr-maindiv');

  // Create the text container div
  const textContDiv = document.createElement('div');
  textContDiv.classList.add('tbnr-textcont');

  if (titleClass) {
    titleClass.classList.add('title');
    textContDiv.prepend(titleClass);
  }
  if (descrClass && descrClass.length > 0) {
    descrClass.forEach((p) => {
      p.classList.add('description');
      textContDiv.append(p); // Append each <p> to the text container div
    });
  }

  // Append the ul to the text container div
  if (listClass) {
    textContDiv.appendChild(listClass);
  }

  // Check if buttons is not empty
  const buttons =
    block.children[2] && block.children[2].children[0] && block.children[2].children[0].innerHTML;
  if (buttons && buttons.trim() !== '') {
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('tbnr-btn');
    btnDiv.innerHTML = buttons;
    textContDiv.append(btnDiv);
  }

  // Append the text container div to the main div
  mainDiv.prepend(textContDiv);

  // Get the picture div
  const pictureDiv = document.querySelector('.title-banner > div > div > p');
  if (pictureDiv) {
    const link = pictureDiv.querySelector('a');
    if (link) {
      const imgUrl = link.href;
      const picDiv = document.createElement('div');
      picDiv.classList.add('tbnr-pic');
      const p = document.createElement('p');
      const picture = document.createElement('picture');
      picture.classList.add('eds-asset-image');
      const source = document.createElement('source');
      source.media = '(max-width:1200px)';
      source.srcset = `${imgUrl}?smartcrop=Large&height=720&width=1260&format=png`;
      const img = document.createElement('img');
      img.src = `${imgUrl}?smartcrop=Medium&height=525&width=700&format=png`;
      // adding alt text to the image
      const altText = imgUrl.substring(imgUrl.lastIndexOf('#') + 1);
      img.alt = altText;
      picture.appendChild(source);
      picture.appendChild(img);
      p.appendChild(picture);
      picDiv.appendChild(p);
      mainDiv.append(picDiv);
    }
  }

  // Clear the block's inner HTML and append the main div
  block.innerHTML = '';
  block.append(mainDiv);

  // Replace P tag with H1 tag if necessary
  const hTag = block.querySelector('.title');
  if (hTag && hTag.nodeName === 'P') {
    const newH1Tag = document.createElement('h1');
    newH1Tag.className = hTag.className;
    newH1Tag.innerHTML = hTag.innerHTML;
    hTag.parentNode.replaceChild(newH1Tag, hTag);
  }
}
