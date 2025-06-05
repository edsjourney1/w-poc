const promodropdown = [
  {
    title: 'Medicare plan for myself',
    href: '#',
  },
  {
    title: 'Medicare plan for a family member',
    href: '#',
  },
  {
    title: 'Health plan for my family and/or myself',
    href: '#',
  },
  {
    title: 'Business health insurance plan',
    href: '#',
  },
  {
    title: 'I’m a member and have a question about my plan',
    href: '#',
  },
];

export default function decorate(block) {
  const { parentElement } = block.parentElement;
  parentElement.classList.add('blue-550');

  // Banner append
  const backgroundbanner = block.children[0].innerText;
  const focusbanner = block.parentElement;
  focusbanner.style.backgroundImage = `url(${backgroundbanner})`;
  focusbanner.style.backgroundSize = 'cover';
  focusbanner.style.backgroundRepeat = 'no-repeat';

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // Picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Division append
  const promotextfocus = document.querySelector('.promo-text-focus-dropdown');
  const innerdiv = promotextfocus.children[1];
  const promotextdiv = document.createElement('div');
  promotextdiv.className = 'promo-focus-block';
  promotextdiv.append(innerdiv);
  promotextfocus.textContent = '';
  promotextfocus.append(promotextdiv);

  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.className = 'drop-down-block';

  // Create and append dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'promo-drop-down';

  const dropdownbtn = document.createElement('button');
  dropdownbtn.className = 'drop-down-btn';
  dropdownbtn.textContent = 'Select an option';
  dropdown.append(dropdownbtn);

  const dropdownul = document.createElement('ul');
  dropdownul.className = 'drop-down-ul';
  dropdown.append(dropdownul);

  promodropdown.forEach((item) => {
    const dropdownli = document.createElement('li');
    dropdownli.className = 'drop-down-li';
    dropdownli.setAttribute('data-value', item.title);

    const dropdownanchor = document.createElement('a');
    dropdownanchor.setAttribute('href', item.href);
    dropdownanchor.classList.add('drop-down-anchor');
    dropdownanchor.innerText = item.title;
    dropdownli.append(dropdownanchor);
    dropdownul.appendChild(dropdownli);
  });

  dropdownbtn.addEventListener('click', () => {
    dropdownul.style.display = dropdownul.style.display === 'block' ? 'none' : 'block';
  });

  dropdownul.querySelectorAll('a').forEach((option) => {
    option.addEventListener('click', () => {
      dropdownbtn.textContent = option.textContent;
      dropdownul.style.display = 'none';
    });
  });

  // Create the dropdown icon
  const dropdownicon = document.createElement('img');
  dropdownicon.classList.add('drop-down-icon');
  dropdownicon.src = '/icons/dropdown.svg';
  dropdownicon.setAttribute('data-icon-name', 'dropdown-arrow');

  dropdownWrapper.appendChild(dropdown);
  dropdownWrapper.appendChild(dropdownicon);

  const promoselecttag = promotextfocus.querySelector('p');
  promoselecttag.insertAdjacentElement('afterend', dropdownWrapper);
}
