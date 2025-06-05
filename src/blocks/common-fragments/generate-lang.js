const generateLangs = () => {
  Array.from(document.querySelectorAll('.language-helper')).forEach((item) => {
    const [first] = item.children;
    const [, lang, dir, font] = first.children;
    const pTag = document.createElement('p');
    let str = '';

    for (let i = 1; i < item.children.length; i += 1) {
      const [type, text] = item.children[i].children;
      if (text.querySelector('p')) {
        if (type.querySelector('p').textContent === 'custom') {
          str += `<span class='fontfamily-${font.querySelector('p')?.innerHTML}'>${text.querySelector('p')?.innerHTML}</span>`;
        } else {
          str += `<span class='fontfamily-roboto'>${text.querySelector('p')?.innerHTML}</span>`;
        }
      } else {
        str += '<span class="fontfamily-roboto">&nbsp;</span>';
      }
    }
    pTag.innerHTML = str;
    pTag.setAttribute('lang', lang.querySelector('p')?.textContent);
    pTag.setAttribute('dir', dir.querySelector('p')?.textContent);
    item.replaceWith(pTag);
  });
};

export default generateLangs;
