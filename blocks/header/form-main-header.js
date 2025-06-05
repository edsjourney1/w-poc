import{addEvents,addAccountEvents}from"./add-events.js";import{enableAutocomplete,searchBuilder}from"./search-builder.js";import{getMetadata}from"../../scripts/aem.js";import{loadFragment}from"../fragment/fragment.js";import{renderImages}from"../../scripts/externalImage.js";import{structureBlogMenu}from"./form-blog-menu.js";import{windowUrlDetails}from"../../scripts/tools.js";import loginURLs from"./login-urls.js";let{authUrl,profileApiUrl,logoutApiUrl,portals,cookieApiUrl}=JSON.parse(loginURLs),navEl=document.createElement("nav"),navMaskEl=document.createElement("div"),searchMaskEl=(navMaskEl.className="siteheader-nav-mask",document.createElement("div")),loginMaskEl=(searchMaskEl.className="siteheader-search-mask",document.createElement("div")),generateLoginForm=(loginMaskEl.className="siteheader-login-mask",(e,t)=>{let a="";return e.forEach((e,r)=>{a=(a=(a+=`<div><label for='${0===r?"gn-login-user-input":"gn-login-password-input"}_${t}'>${e.querySelector("p:first-child").innerHTML}</label>`)+`<input type='${0===r?"text":"password"}'
        id='${0===r?"gn-login-user-input":"gn-login-password-input"}_${t}'
        autocomplete='on' name='${0===r?"userid":"password"}' data-errortext='${e.querySelector("p:last-child").textContent}'/>`)+`<div class='siteheader-login-error siteheader-login-error-field'
      aria-hidden="true" role="alert" aria-live="assertive" aria-atomic="true" data-error='
      ${0===r?"userid":"password"}_${t}'>
          ${e.querySelector("p:last-child").innerHTML}</div></div>`}),a}),constructLogin=async(e,r,t)=>{var a=getMetadata("/content-fragments/alert-states"),a=a?new URL(a,window.location).pathname:"/content-fragments/alert-states",a=await loadFragment(a),[n,i,o,l,d]=Array.from(e.querySelector(".siteheader.megamenu-loginnav")?.children),[e,s]=Array.from(e.querySelector(".siteheader.megamenu-registernav")?.children),l=`<form
      id="{{replace--formid}}" name="loginForm"
      action="${authUrl}"
      method="post"
      novalidate="true"><div>
      {{replace--hiddenfields}}
      {{replace--formfields}}
      </div><div><button type='submit'>
      ${l.children[0].querySelector("p").innerHTML}</button>
      ${l.children[1].querySelector("p").innerHTML}</div>
    </form>`;let c=l.replace("{{replace--formid}}","gn-loginForm"),u=l.replace("{{replace--formid}}","gn-loginForm-mobile");c=c.replace("{{replace--hiddenfields}}",`<input name="scController" type="hidden" value="Auth"/>
      <input name="scAction" type="hidden" value="Login"/>
      <input name="dsItemId" type="hidden" value="a87e419e-65f9-4368-b409-0e24e8fd565d"/>
      <input name="indexLogin" value="true" type="hidden"/>`),u=u.replace("{{replace--hiddenfields}}",`<input name="scController" type="hidden" value="Auth"/>
      <input name="scAction" type="hidden" value="Login"/>
      <input name="dsItemId" type="hidden" value="a87e419e-65f9-4368-b409-0e24e8fd565d"/>
      <input name="indexLogin" value="true" type="hidden"/>`);var l=generateLoginForm(Array.from(o?.children),0),o=generateLoginForm(Array.from(o?.children),1),l=(c=c.replace("{{replace--formfields}}",l),u=u.replace("{{replace--formfields}}",o),d?.children[0]?.querySelector("p"));let p="",m=(l&&((o=a?.querySelector("."+l.innerHTML)?.closest(".alert-wrapper"))?.querySelector(".alert > div > div:nth-child(2)")&&(o.querySelector(".alert > div > div:nth-child(2)").innerHTML=""),a=o?.querySelector(".icon").closest("div"))&&(Array.from(a?.children||[]).forEach((e,r)=>{0!==r&&e.remove()}),a.append(d?.children[1]),p=a.closest(".alert-container").innerHTML),"");i&&(m=document.createElement("div"),i.classList.add("siteheader-login-error"),i.classList.add("form-error-block"),i.classList.add("siteheader-login-error-common"),i.setAttribute("aria-hidden",!0),i.setAttribute("role","alert"),i.setAttribute("aria-live","assertive"),i.setAttribute("aria-atomic",!0),m.append(i)),t&&((l=document.createElement("div")).className="siteheader-login-wrapper",(o=document.createElement("div")).className="siteheader-login-wrapper",o.innerHTML=`<div class='siteheader-login-wrapper-grid'>
      <div>
        ${p}
        ${m.innerHTML}
        ${n.innerHTML}
        <div class='siteheader-login-fields'>
          ${u}
        </div>
      </div>
      <div>
        ${e.innerHTML}
        ${s.innerHTML}
      </div>
    </div>`,navEl.append(o),l.innerHTML=`<div class='siteheader-login-wrapper-cta'>
      <button type='button'>
          <span>${t.querySelector("p").innerHTML}</span>
      </button>
    </div>
    <div class='siteheader-login-wrapper-outer'>
      <div class='siteheader-login-wrapper-inner'>
        <div class='siteheader-login-wrapper-grid'>
          <div>
            ${p}
            ${m.innerHTML}
            ${n.innerHTML}
            <div class='siteheader-login-fields'>
              ${c}
            </div>
          </div>
          <div>
            ${e.innerHTML}
            ${s.innerHTML}
          </div>
        </div>
      </div>
    </div>`,(d=r.querySelector(".siteheader-login-placeholder"))&&d.replaceWith(l),addAccountEvents(r,navMaskEl,loginMaskEl))},constructLogout=(e,r,t,a)=>{var[n,i]=Array.from(e.querySelector(".siteheader.megamenu-logoutnav > div")?.children),e=Array.from(e.querySelector(".siteheader.megamenu-portals")?.children);let o=[];e.forEach(e=>{o.push({names:[e.querySelector("div:nth-child(1)")?.textContent.toLowerCase(),e.querySelector("div:nth-child(2)")?.textContent.toLowerCase()],label:e.querySelector("div:nth-child(3)")?.textContent})});let l,d,s;try{s=o.find(e=>e.names.includes(a.orgType.toLowerCase()))}catch(e){s={names:["not_found"],label:a.orgType.toLowerCase()},console.error("Portal Name not found")}n&&((l=document.createElement("button")).setAttribute("type","button"),l.innerHTML=n.querySelector("p")?.innerHTML+" "+s.label,l.className="siteheader-logout-wrapper-return",l.addEventListener("click",()=>{window.localStorage.setItem("landedFromExternal","true"),setTimeout(()=>{window.location.href=portals[s.names[0]]},0)})),i&&((d=document.createElement("button")).setAttribute("type","button"),d.innerHTML=""+i.querySelector("p")?.innerHTML,d.className="siteheader-logout-wrapper-logout",d.addEventListener("click",()=>{window.localStorage.setItem("landedFromExternal","true"),setTimeout(()=>{window.location.href=logoutApiUrl},0)}));e=document.createElement("div");e.className="siteheader-logout-wrapper",t&&(e.innerHTML=`<div class='siteheader-logout-wrapper-cta'>
        <button type='button'>
          <span>${t.querySelector("p")?.innerHTML}</span>
        </button>
      </div>
      <div class='siteheader-logout-wrapper-outer'>
        <div class='siteheader-logout-wrapper-inner'></div>
      </div>`,n=l.cloneNode(!0),i=d.cloneNode(!0),n.addEventListener("click",()=>{window.localStorage.setItem("landedFromExternal","true"),setTimeout(()=>{window.location.href=portals[s.names[0]]},0)}),i.addEventListener("click",()=>{window.localStorage.setItem("landedFromExternal","true"),setTimeout(()=>{window.location.href=logoutApiUrl},0)}),e.querySelector(".siteheader-logout-wrapper-inner").append(l),e.querySelector(".siteheader-logout-wrapper-inner").append(d),(t=document.createElement("div")).innerHTML=`<div class='siteheader-logout-wrapper'>
      <div class='siteheader-logout-wrapper-outer'>
        <div class='siteheader-logout-wrapper-inner'></div>
      </div>`,t.querySelector(".siteheader-logout-wrapper-inner").append(n),t.querySelector(".siteheader-logout-wrapper-inner").append(i),navEl.appendChild(t),(n=r.querySelector(".siteheader-login-placeholder"))&&n.replaceWith(e),addAccountEvents(r,navMaskEl,loginMaskEl))},fetchAccountInfo=async(r,t,a,e)=>{try{var n,i,o,l,d,s,c=await fetch(cookieApiUrl,{method:"GET",credentials:"include"});c.ok?(n=await c.json()).jwt&&(i=await fetch(profileApiUrl,{method:"GET",credentials:"include",headers:{Authorization:"Bearer "+n.jwt}})).ok?(l=(o=await i.json())?.data?.orgType,d=o?.data?.firstName,s=o?.data?.lastName,constructLogout(r,t,e,{orgType:l,firstName:d,lastName:s})):constructLogin(r,t,a):constructLogin(r,t,a)}catch(e){constructLogin(r,t,a)}},structureRemainingNav=(e,r,t,a,n,i)=>{var o=e.closest(".header-wrapper"),r=r.querySelector(".siteheader.siteheader-default")?.closest(".siteheader-container");let l=Array.from(r.querySelectorAll('[class^="siteheader megamenu-"]'));o&&(o.parentNode.insertBefore(navMaskEl,o),o.parentNode.insertBefore(searchMaskEl,o),o.parentNode.insertBefore(loginMaskEl,o)),Array.from(t.querySelectorAll(":scope > li")).forEach(e=>{let r=e.querySelector("a");var t,e=e.querySelector(".siteheader-subnav > div"),a=l.find(e=>e.classList.contains("megamenu-"+(r.textContent||"").split(" ").join("-").toLowerCase()));r&&e&&(e=e.querySelector(":scope > ul"),(t=document.createElement("li")).className="siteheader-subnav-info",Array.from(e.querySelectorAll(":scope > li")).forEach(e=>{var r=document.createElement("h3"),t=Array.from(e.querySelectorAll(":scope > strong"));r.innerHTML=t.map(e=>e.innerHTML).join(" ")||"",t[0].replaceWith(r);for(let e=1;e<t.length;e+=1)t[e].remove()}),a)&&(t.append(a.querySelector("h3")),a.children[1].classList.add("siteheader-subnav-grid"),t.append(a.children[1]),e.append(t))}),addEvents(e,navMaskEl,searchMaskEl,loginMaskEl);r=e.querySelector("#siteheader-search-form");r&&r.querySelector("#header_search")&&enableAutocomplete("header_search"),renderImages(navEl),fetchAccountInfo(a,e,n,i)},formMainNavigationL1=(e,r,t)=>{var a=document.createElement("div"),t=(a.className="siteheader-mobile-wrapper",a.innerHTML=`<button type='button'>
            <div>${t.querySelector("p:first-child").innerHTML}</div>
            <div>${t.querySelector("p:last-child").innerHTML}</div>
        </button>`,e.append(a),navEl.append(r),navEl.children[0]);Array.from(t.children).forEach(e=>{var r=e.querySelector("ul"),e=e.querySelector("a"),t=document.createElement("span");t.textContent=e.textContent,e.replaceChild(t,e.firstChild),r&&((t=document.createElement("span")).className="icon icon-solid--chevron-down",t.innerHTML='<i class="fa-solid fa-chevron-down" data-icon-name="solid--chevron-down"></i>',e.classList.add("siteheader-has-subnav"),e.append(t),(e=document.createElement("div")).className="siteheader-subnav",r.parentNode.insertBefore(e,r),t=document.createElement("div"),e.appendChild(t),t.appendChild(r))}),a.append(navEl)},structureMainHeader=(t,a,n)=>{var i=a.cloneNode(!0),a=a.querySelector(".siteheader.siteheader-default")?.closest(".siteheader-container"),o=a.cloneNode(!0),n=n?.querySelector(".siteheader-container");if(a){var[,l,d,s,c]=Array.from(a.querySelector(".siteheader.siteheader-default > div:first-child")?.children),[u,p,m]=Array.from(a.querySelector(".siteheader.siteheader-logos > div:nth-child(2)")?.children),[h]=Array.from(a.querySelector(".siteheader.siteheader-default > div:nth-child(2)").children),[v]=Array.from(a.querySelector(".siteheader.siteheader-default > div:nth-child(3)").children),v=v?.querySelector("ul"),g=(windowUrlDetails.pathname||"").split("/");let e;g.includes("providers")||g.includes("provider")&&p?([p]=p.children,e=p):g.includes("medicare-advantage")&&m?([p]=m.children,e=p):u&&([g]=u.children,e=g);m=`<div class='siteheader-logo-wrapper'>
          ${e?.innerHTML.replaceAll("<em></em>","")}
        </div>`,p=searchBuilder(l,d);a.innerHTML=`<div class="siteheader-outer"><div class="siteheader-inner">
      ${m}
      <div class="siteheader-right-section">
      ${p}
      <div class="siteheader-login-placeholder"></div></div>
    </div></div>`,t.append(a);let r=document.querySelector("header .header");v&&h&&formMainNavigationL1(t,v,h),renderImages(r,()=>{r.classList.add("header-loaded")}),n&&structureBlogMenu(n),structureRemainingNav(t,i,v,o,s,c)}};export default structureMainHeader;