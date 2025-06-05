export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const imageRightIcon = document.querySelectorAll('.image-right-icon');
  imageRightIcon.forEach((imageRight) => {
    const imageRightChild = imageRight.children[0];
    const rightText = imageRightChild.children[0];
    const rightImage = imageRightChild.children[1];
    rightText.classList.add('col-content-icon');
    rightImage.classList.add('col-image-icon');
  });

  const imageLeftIcon = document.querySelectorAll('.image-left-icon');
  imageLeftIcon.forEach((imageLeft) => {
    const imageLeftChild = imageLeft.children[0];
    const leftImage = imageLeftChild.children[0];
    const leftText = imageLeftChild.children[1];
    leftText.classList.add('col-content-icon');
    leftImage.classList.add('col-image-icon');
  });
}
