export default function decorate(block) {
  const svgIcon = block.children[0].children[0].children[0];
  const title = block.children[0].textContent;
  const description = block.children[1].textContent;
  const button = block.children[2].children[0].children[0].children[0].children[0];
  button.classList.add('button', 'primary');
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const svg = svgIcon;
  const heading = document.createElement('h2');
  heading.append(title);
  heading.textContent = heading.textContent.trim(); // Use the trimmed content
  const id = heading.innerText.replace(/\s+/g, '-').toLowerCase(); // Replace whitespace with hyphens
  heading.id = id;
  heading.classList.add('title');
  div2.append(svg, heading);
  const paragraph = document.createElement('p');
  paragraph.classList.add('description');
  paragraph.append(description);
  div.append(div2, paragraph, button);
  block.innerHTML = '';
  block.append(div);
}
