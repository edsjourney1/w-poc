import{marketoFn}from"../../scripts/tools.js";export default function decorate(r){document.body.classList.contains("sidekick-library")?r.innerHTML=`<div class='eds-mkto-sidekick-table'><table>
      <tr>
        <th>marketo-form</th>
      </tr>
      <tr>
        <td>mktoForm_<strong>&lt;Enter Marketo Form ID here&gt;</strong></td>
      </tr>
    </table></div>`:marketoFn&&[...r.children].forEach(t=>{t=t.querySelector("p");marketoFn(r,t)})}