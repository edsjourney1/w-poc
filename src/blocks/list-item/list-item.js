export default function decorate(block) {
  const firstEl = block.querySelector('div:first-child');
  const pEl = firstEl?.querySelector('div > *');
  pEl?.setAttribute('aria-hidden', true);
}
