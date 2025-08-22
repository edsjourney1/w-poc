export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const imageRightText = document.querySelectorAll('.image-right');
  imageRightText.forEach((imageRight) => {
    const imageRightChild = imageRight.children[0];
    const rightText = imageRightChild.children[0];
    const rightImage = imageRightChild.children[1];
    rightText.classList.add('col-content-text');
    rightImage.classList.add('col-img-text');
  });

  const imageLeftText = document.querySelectorAll('.image-left');
  imageLeftText.forEach((imageLeft) => {
    const imageLeftChild = imageLeft.children[0];
    const leftImage = imageLeftChild.children[0];
    const leftText = imageLeftChild.children[1];
    leftText.classList.add('col-content-text');
    leftImage.classList.add('col-img-text');
    console.log('sdf');
  });

  setTimeout(() => {
    if (block.closest('.image-content-store')) {
      const allLinks = Array.from(block.querySelectorAll('a'));
      if (allLinks[allLinks.length - 1]) {
        allLinks[allLinks.length - 1].classList.add('image-content-applink');
        allLinks[allLinks.length - 1].closest('p')?.classList.add('button-container');
      }
      if (allLinks[allLinks.length - 2]) {
        allLinks[allLinks.length - 2].classList.add('image-content-applink');
        allLinks[allLinks.length - 2].closest('p')?.classList.add('button-container');
      }
    }
  }, 1000);
}
