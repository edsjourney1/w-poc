export default function decorate(block) {
  const parentEle = block.parentElement.parentElement;
  parentEle.classList.add('blue-550');
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('tbnr-maindiv');
  const textContDiv = document.createElement('div');
  textContDiv.classList.add('tbnr-textcont');
  const titleClass = block.children[0].children[0].querySelector('p, h1');
  if (titleClass) {
    titleClass.classList.add('title');
    textContDiv.append(titleClass);
  }
  const descrElement = block.children[0]?.children[1];
  const descrClass = descrElement ? descrElement.querySelectorAll('p') : null;
  if (descrClass && descrClass.length > 0) {
    descrClass.forEach((p) => {
      p.classList.add('description');
      textContDiv.append(p); // Append each <p> to the text container div
    });
  }
  const listClass = block.children[0].children[1].querySelector('ul, ol');
  // Append the ul to the text container div
  if (listClass) {
    textContDiv.append(listClass);
  }
  const buttonDiv = block.children[1].children[0].querySelectorAll('p');
  if (buttonDiv.length > 0) {
    const btnDiv = document.createElement('div');
    btnDiv.classList.add('tbnr-btn');
    // Iterate over the NodeList and check/add the class
    buttonDiv.forEach((button) => {
      if (!button.classList.contains('button-container')) {
        button.classList.add('button-container');
      }
      btnDiv.append(button);
    });
    textContDiv.appendChild(btnDiv);
  }
  mainDiv.append(textContDiv);
  block.innerHTML = '';
  block.append(mainDiv);
  const hTag = block.querySelector('.title');
  if (hTag.nodeName === 'P') {
    // If the tag is a P tag, replace it with an H1 tag
    const newH1Tag = document.createElement('h1');
    newH1Tag.className = hTag.className;
    newH1Tag.innerHTML = hTag.innerHTML;
    hTag.parentNode.replaceChild(newH1Tag, hTag);
  }
}
