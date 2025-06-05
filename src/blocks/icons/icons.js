export default async function decorate(block) {
  // const iconblock = document.querySelector(".icons");

  [...block.children].forEach((row) => {
    row.classList.add('row');
    [...row.children].forEach((col) => {
      const para = col.querySelector('p');
      const codeelm = document.createElement('button');
      codeelm.classList.add('copy');
      const spn = col.querySelector('span');
      const classes = Array.from(spn.classList);
      // replace the string 'icon' at begining with ':' and add ':' at end
      const code = classes[1].replace(/^icon-/, ':').concat(':');
      codeelm.textContent = code;
      para.appendChild(codeelm);
    });
  });

  const cpybtn = document.querySelectorAll('.copy');

  cpybtn.forEach((btn) => {
    btn.addEventListener('click', function () {
      const text = this.textContent;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log(text);
          alert('copied');
        })
        .catch((e) => {
          alert('cant copy');
          console.log(e);
        });
    });
  });
}
