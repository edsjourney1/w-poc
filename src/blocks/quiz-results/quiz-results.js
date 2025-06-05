import { marketoFn } from '../../scripts/tools.js';

export default function decorate(block) {
  const quizResultContainer = document.createElement('div');
  quizResultContainer.classList.add('quiz-result-container');
  document.querySelector('.quiz-results-container').appendChild(quizResultContainer);

  const formcontainer = document.createElement('div');
  const staticcontainer = document.createElement('div');
  staticcontainer.classList.add('static-container');

  quizResultContainer.append(formcontainer);
  quizResultContainer.append(staticcontainer);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index) => {
      if (index === 0) {
        const section = col.querySelector('p');
        if (marketoFn) {
          marketoFn(formcontainer, section);
        }
      } else {
        staticcontainer.appendChild(col);
      }
    });
  });
}
// import { marketoFn } from '../../scripts/tools.js';
// export default function decorate(block) {
//   const quizResultContainer = document.createElement('div');
//   quizResultContainer.classList.add('quiz-result-container');
//   document.querySelector('.quiz-results-container').appendChild(quizResultContainer);

//   const formcontainer = document.createElement('div');
//   const staticcontainer = document.createElement('div');
//   staticcontainer.classList.add('static-container');

//   quizResultContainer.append(formcontainer);
//   quizResultContainer.append(staticcontainer);

//   [...block.children].forEach((row) => {
//     [...row.children].forEach((col, index) => {
//       if (index === 0) {
//         const section = col.querySelector('p');
//         if (marketoFn) {
//           marketoFn(formcontainer, section);
//         }
//       } else {
//         staticcontainer.appendChild(col);
//       }
//     });
//   });
// }
