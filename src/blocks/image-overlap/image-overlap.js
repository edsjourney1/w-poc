export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const imageRightOverlap = document.querySelectorAll('.image-right-overlap');
  imageRightOverlap.forEach((imageRight) => {
    const imageRightChild = imageRight.children[0];
    const rightText = imageRightChild.children[0];
    const rightImage = imageRightChild.children[1];

    rightText.classList.add('col-content-overlap');
    rightImage.classList.add('col-img-overlap');
  });

  const imageLeftOverlap = document.querySelectorAll('.image-left-overlap');
  imageLeftOverlap.forEach((imageLeft) => {
    const imageLeftChild = imageLeft.children[0];
    const leftImage = imageLeftChild.children[0];
    const leftText = imageLeftChild.children[1];

    leftText.classList.add('col-content-overlap');
    leftImage.classList.add('col-img-overlap');
  });
}
