const wrapperDiv = document.querySelector('.quiz-question-container');

const allDetails = document.querySelectorAll('.quiz-question');

const allDetailsArr = [];
const validateForm = (e) => {
  e.preventDefault();
  const questionwrapper = document.querySelectorAll('.quiz-question-wrapper');
  let isValid = true;
  const errorDiv = document.querySelector('.error-div');
  const errorUl = document.querySelector('.error-div ul');
  errorUl.innerHTML = '';
  const winnerMeta = wrapperDiv.getAttribute('data-caseone');
  const loserMeta = wrapperDiv.getAttribute('data-casetwo');
  const caseOne = winnerMeta.split('}}')[0].split('{{')[1];
  // eslint-disable-next-line
  const caseTwo = loserMeta.split('}}')[0].split('{{')[1];
  const inputRes = { win: 0, loss: 0 };
  questionwrapper.forEach((item) => {
    const input = item.querySelectorAll('input[type="radio"]');
    const allquestions = item.querySelectorAll('h3');
    const questionsQuantity = allquestions.length;
    let checkedqauntity = 0;
    const errorMsgs = item.querySelectorAll('.error-msg');
    const title = item.querySelector('.title');
    // eslint-disable-next-line
    const isChecked = Array.from(input).some((radio) => {
      if (radio.checked) {
        // eslint-disable-next-line
        checkedqauntity++;
        // eslint-disable-next-line
        radio.id.includes(caseOne) ? (inputRes.win += 1) : (inputRes.loss += 1);
      }

      if (checkedqauntity === questionsQuantity) {
        return radio.checked;
      }
    });
    // console.log(inputRes);

    if (!isChecked) {
      errorMsgs.forEach((err) => {
        console.log(err.textContent);
        // console.log('----------------');
        const anycheck = Array.from(err.parentElement.querySelectorAll('input[type="radio"]')).some(
          // eslint-disable-next-line
          (ip) => {
            return ip.checked;
          },
        );
        // err.parentElement.querySelectorAll('input[type="radio"]')
        // eslint-disable-next-line
        !anycheck && (err.style.display = 'block');
        // eslint-disable-next-line
        anycheck && (err.style.display = 'none');
        const li = document.createElement('a');
        console.log('appending li ', li);
        errorUl.append(li);
        isValid = false;
        li.href = `#${title.textContent.toLowerCase()}`;

        if (!anycheck) li.textContent = err.textContent;
        // eslint-disable-next-line
        li.addEventListener('click', (e) => {
          e.preventDefault();
          const elementPosition = title.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 180;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        });
      });
      errorDiv.style.display = 'block';

      // errorDiv.scrollIntoView({behavior: 'smooth'});
      const elementPosition = errorDiv.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 180;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      // eslint-disable-next-line
      errorMsgs.forEach((e) => (e.style.display = 'none'));
      // eslint-disable-next-line
      [...errorUl.children].length <= 0 && (errorDiv.style.display = 'none');
    }
  });
  if (!isValid) {
    console.log('not valid');
    return;
  }
  console.log(inputRes);
  if (inputRes) {
    if (inputRes.win >= inputRes.loss) {
      window.location.href = `${window.origin}${winnerMeta.split('}}')[1]}`;
      // console.log(winnerMeta.split('}}')[1]);
    } else {
      window.location.href = `${window.origin}${loserMeta.split('}}')[1]}`;
      // console.log(loserMeta.split('}}')[1]);
    }
  }
};

const init = () => {
  const formEl = document.createElement('form');
  const errorDiv = document.createElement('div');
  const ul = document.createElement('ul');
  const headingError = document.createElement('h4');
  headingError.innerHTML =
    '<span class="icon"> <i class="fa-solid fa-triangle-exclamation"></i> </span> Please correct the following error(s):';
  ul.prepend(headingError);
  errorDiv.append(headingError, ul);
  errorDiv.classList.add('error-div');
  errorDiv.style.display = 'none';
  formEl.prepend(errorDiv);
  formEl.setAttribute('id', 'quiz-form-2');
  formEl.action = '/';
  formEl.setAttribute('validate', 'novalidate');
  formEl.onsubmit = (e) => {
    validateForm(e);
  };

  allDetailsArr.forEach((item, a) => {
    const parentEl = item.closest('.quiz-question-wrapper');
    const headings = item.children[0].children[0].children[0];
    headings.classList.add('title');
    const optionalText = item.children[1].children[0].children[0];
    if (optionalText !== undefined && optionalText !== '') {
      optionalText.classList.add('option-text');
    }
    const question = item.children[2].children[0].children[0];
    question.classList.add('question');
    const error = document.createElement('span');
    error.classList.add('error-msg');
    error.innerHTML = `<span class="icon"> <i class="fa-solid fa-triangle-exclamation"></i> </span> ${question.textContent} required!`;
    error.style.display = 'none';
    parentEl.children[0].children[3].append(error);
    formEl.append(parentEl);
    item.children[3].setAttribute('aria-labelledby', `${headings.textContent}-question1-group`);
    item.children[3].setAttribute('role', 'radiogroup');
    let para = item.children[3].querySelectorAll('div p');
    para.forEach((p) => {
      const radio = document.createElement('input');
      const label = document.createElement('label');
      const idValue = p.textContent.split('}');
      const id = idValue[0].split('{')[1];
      label.id = `${id}${a}-${headings.textContent}-question1`;
      // eslint-disable-next-line
      label.textContent = idValue[1];
      // console.log(id, idValue);
      radio.type = 'radio';
      radio.name = `radio-${headings.textContent.toLowerCase()}-question1`;
      radio.id = `${id}${a}-${headings.textContent}-question1`;
      radio.setAttribute('aria-labelledby', label.id);
      radio.setAttribute('aria-required' , true);
      label.setAttribute('for', radio.getAttribute('id'));
      radio.value = p.textContent.trim();
      p.replaceWith(radio, label);
    });

    let question2;

    if (
      item?.children[4]?.children[0]?.children[0] !== undefined &&
      item?.children[4]?.children[0]?.children[0] !== '' &&
      item.children[4].tagName === 'DIV'
    ) {
      // eslint-disable-next-line
      question2 = item.children[4].children[0].children[0];
      question2.classList.add('question');
      question2.classList.add('padding-24');
      // eslint-disable-next-line
      const error = document.createElement('span');
      error.classList.add('error-msg');
      error.innerHTML = `<span class="icon"> <i class="fa-solid fa-triangle-exclamation"></i> </span> ${question2.textContent} required!`;
      error.style.display = 'none';
      parentEl.children[0].children[5].append(error);
      formEl.append(parentEl);
    }
    if (
      item?.children[5]?.children[0]?.children[0] !== undefined &&
      item?.children[5]?.children[0]?.children[0] !== ''
    ) {
      item.children[5].setAttribute('aria-labelledby', `${headings.textContent}-question2-group`);
      item.children[5].setAttribute('role', 'radiogroup');
      para = item.children[5].querySelectorAll('div p');
      para.forEach((p) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `radio-${headings.textContent.toLowerCase()}-question2`;
        const label = document.createElement('label');
        const idValue = p.textContent.split('}');
        const id = idValue[0].split('{')[1];
        label.id = `${id}${a}-${headings.textContent}-question1`;
        // eslint-disable-next-line
        label.textContent = idValue[1];
        radio.id = `${id}${a}-${headings.textContent}-question2`;
        radio.setAttribute('aria-labelledby', label.id);
        radio.setAttribute('aria-required' , true);
        label.setAttribute('for', radio.getAttribute('id'));
        radio.value = p.textContent.trim();
        label.setAttribute('for', radio.id);
        p.replaceWith(radio, label);
      });
    }
  });

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('quiz-button-wrapper');
  const submit = document.createElement('button');
  submit.textContent = 'Get results';
  submit.classList.add('primary', 'button');
  buttonWrapper.append(submit);
  formEl.append(buttonWrapper);
  wrapperDiv.append(formEl);
};

export default function decorate(block) {
  allDetailsArr.push(block);
  if (allDetailsArr.length === allDetails.length) {
    init();
  }
}
