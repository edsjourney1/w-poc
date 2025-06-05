import{decorateMain}from"../../scripts/scripts.js";import{loadSections}from"../../scripts/aem.js";async function loadFragment(a){if(a&&a.startsWith("/")){var t=await fetch(a+".plain.html");if(t.ok){let r=document.createElement("main");r.innerHTML=await t.text();t=(t,e)=>{r.querySelectorAll(t+`[${e}^="./media_"]`).forEach(t=>{t[e]=new URL(t.getAttribute(e),new URL(a,window.location)).href})};return t("img","src"),t("source","srcset"),decorateMain(r),await loadSections(r),r}}return null}export default async function decorate(t){var e,r;document.body.classList.contains("sidekick-library")?t.innerHTML=`<div class='eds-fragment-sidekick-table'><table>
      <tr>
        <th>fragment</th>
      </tr>
      <tr>
        <td><strong>&lt;Relative URL of the Fragment&gt;</strong></td>
      </tr>
    </table></div>`:(e=await loadFragment((e=t.querySelector("a"))?e.getAttribute("href"):t.textContent.trim()))&&(r=e.querySelector(":scope .section"))&&(t.closest(".section").classList.add(...r.classList),t.closest(".fragment").replaceWith(...e.childNodes))}export{loadFragment};