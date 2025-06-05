export default function decorate(block) {
  const thisBlock = block;
  const title = thisBlock?.children[0].textContent;
  const description = thisBlock?.children[1].textContent;
  const div = document.createElement('div');
  const heading = document.createElement('h2');
  heading.append(title);
  heading.classList.add('title');
  const paragraph = document.createElement('p');
  paragraph.classList.add('description');
  paragraph.append(description);
  div.append(heading, paragraph);
  if (thisBlock) {
    thisBlock.innerHTML = '';
  }
  thisBlock?.append(div);
}
