export default async function decorate(block) {
  const thisBlock = block;
  const [blogCtaBody, blogCtaBtn] = Array.from(thisBlock.children);

  blogCtaBtn?.classList.add('blog-cta-btn');
  blogCtaBody?.classList.add('blog-cta-body');
}
