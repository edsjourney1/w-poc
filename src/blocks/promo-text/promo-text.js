export default function decorate(block) {
  const title = block.children[0].children[0].children[0].innerHTML;
  const description = block.children[1].children[0].children[0].innerHTML;
  const div = document.createElement('div');
  const heading = document.createElement('h2');
  heading.innerHTML = title;
  heading.classList.add('title');
  const paragraph = document.createElement('p');
  paragraph.classList.add('description');
  paragraph.innerHTML = description;
  div.append(heading, paragraph);
  if (block.children[2]?.children[0]?.children[0]?.children[0] !== undefined) {
    const button = block.children[2]?.children[0]?.children[0]?.children[0];
    button.classList.add('button', 'primary');
    div.append(heading, paragraph, button);
  }
  block.innerHTML = '';
  block.append(div);
}
