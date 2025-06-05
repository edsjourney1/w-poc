import{readBlockConfig}from"../../scripts/aem.js";import{init,renderAssetSelectorWithImsFlow,logoutImsFlow,copyAssetWithRapi}from"./aem-asset-selector-util.js";let LOGIN_TIMEOUT=2e3;export default async function decorate(t){let e=!1,s=!1,o=readBlockConfig(t),i=(t.textContent="",t.innerHTML=`
    <div class="asset-overlay loading">
      <img id="loading" src="${o.loading}" />
      <div id="login">
        <p>Welcome to the Asset Selector. Please sign in to view your assets.</p>
        <button id="as-login">Sign In</button>
      </div>
    </div>
    <div class="action-container">
        <div><img src="${o.logo}" /></div>
        <button id="as-copy" class="disabled">Copy</button>
        <button id="as-cancel">Sign Out</button>
    </div>
    <div id="asset-selector">
    </div>
  `,t.querySelector("#as-login").addEventListener("click",e=>{e.preventDefault(),renderAssetSelectorWithImsFlow(o)}),t.querySelector("#as-copy"));i.addEventListener("click",async e=>{e.preventDefault(),s&&(i.classList.add("disabled"),i.innerText="Copying...",e=await copyAssetWithRapi(s),i.innerText=e?"Copied!":"Error!",i.classList.remove("disabled"))}),t.querySelector("#as-cancel").addEventListener("click",e=>{e.preventDefault(),logoutImsFlow()}),setTimeout(()=>{var e=t.querySelector(".asset-overlay");"none"!==e.style.display&&(e.classList.remove("loading"),t.querySelector("#loading").style.display="none",t.querySelector("#login").style.display="flex")},LOGIN_TIMEOUT),o.onAccessTokenReceived=()=>{t.querySelector(".asset-overlay").style.display="none",t.querySelectorAll(".action-container button").forEach(e=>{e.style.display="block"}),e||(e=!0,renderAssetSelectorWithImsFlow(o))},o.onAssetSelected=e=>{s=e,i.classList.remove("disabled"),i.innerText="Copy"},o.onAssetDeselected=()=>{s=!1,i.classList.add("disabled"),i.innerText="Copy"},init(o)}