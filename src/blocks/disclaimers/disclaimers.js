export default async function decorate(block) {
  const thisBlock = block;
  console.log(thisBlock.children);
  const [disclaimersBody] = Array.from(thisBlock.children);

  disclaimersBody?.classList.add('disclaimers-body');
}
