import { marketoFn } from '../../scripts/tools.js';

// creation of block for marketo form
export default function decorate(block) {
  if (document.body.classList.contains('sidekick-library')) {
    block.innerHTML = `<div class='eds-mkto-sidekick-table'><table>
      <tr>
        <th>marketo-form</th>
      </tr>
      <tr>
        <td>mktoForm_<strong>&lt;Enter Marketo Form ID here&gt;</strong></td>
      </tr>
    </table></div>`;
  } else if (marketoFn) {
    [...block.children].forEach((row) => {
      const section = row.querySelector('p');
      marketoFn(block, section);
    });
  }
}
