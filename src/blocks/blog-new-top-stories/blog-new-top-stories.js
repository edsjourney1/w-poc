export default async function decorate(block) {
  const firstchild = block.children[0];
  const secondchild = block.children[1];
  if (firstchild) {
    firstchild.remove();
    secondchild.remove();
  }
  block.innerHtml = '';
  const maindiv = document.createElement('div');
  maindiv.classList.add('blog-wrapper');
  block.prepend(maindiv);
  const newstories = document.querySelector('.blog-new-stories-wrapper');
  const topstories = document.querySelector('.blog-top-stories-wrapper');
  if (newstories) {
    maindiv.append(newstories);
  }
  if (topstories) {
    maindiv.append(topstories);
  }
}
