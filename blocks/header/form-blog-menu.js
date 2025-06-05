import{renderImages}from"../../scripts/externalImage.js";import{slideUp,slideDown}from"../../scripts/tools.js";import popupDataAnalytics from"./popup-analytics.js";let liBlogMenuArr=[],activeClsMain="siteheader-active",activeCls="siteheader-blog-has-subnav-active",bodyEl=document.querySelector("body"),openSubnavCount=0,openBlogNavCount=0,closeAllBlogMenuItems=()=>{liBlogMenuArr.forEach(e=>{e.subnav&&(e.isActive=!1,e.link.classList.remove(activeCls),e.ariaExpanded=!1,slideUp(e.subnav,175),e.link.closest("nav .siteheader-blog-menu > ul").classList.remove(activeCls))})},initiateBlogSubnav=()=>{liBlogMenuArr.forEach(s=>{s.link.addEventListener("click",e=>{s.subnav&&(e.preventDefault(),s.isActive?(popupDataAnalytics("close","blog_menu_subnav",openSubnavCount),closeAllBlogMenuItems()):(liBlogMenuArr.forEach(e=>{e.subnav&&(e.index===s.index?(openSubnavCount+=1,e.isActive=!0,e.link.classList.add(activeCls),slideDown(e.subnav,175),popupDataAnalytics("open","blog_menu_subnav",openSubnavCount)):(e.isActive=!1,e.link.classList.remove(activeCls),slideUp(e.subnav,175)))}),s.link.closest("nav .siteheader-blog-menu > ul").classList.add(activeCls)))}),s.link.addEventListener("keyup",e=>{if("Tab"===e.key){let t=!1;for(let e=0;e<liBlogMenuArr.length;e+=1){var l=liBlogMenuArr[e].subnav;if(liBlogMenuArr[e].index!==s.index&&l&&"block"===getComputedStyle(l).display){t=!0;break}}t&&setTimeout(()=>{s.link.dispatchEvent(new Event("click"))},300),s.subnav||closeAllBlogMenuItems()}})})},attachBlogMenuEvents=t=>{let l=t.querySelector(".siteheader-blog-nav-toggle > button"),e=t.querySelector(".siteheader-blog-menu");var s=Array.from(t.querySelectorAll("nav > div > ul > li"));t.querySelector(".subscribe-btn")?.addEventListener("click",()=>{setTimeout(()=>{var e=document.querySelector("main > .marketo-form-fragment-container")?.getBoundingClientRect().top;closeAllBlogMenuItems(),t.classList.contains("siteheader-blog-menu-active")&&l.dispatchEvent(new Event("click")),e&&window.scrollTo({behavior:"smooth",top:e+window.scrollY-160})},250)}),s.forEach((e,t)=>{var l=e.querySelector(":scope > a"),s=document.createElement("span");e.querySelector("ul")&&(s.className="icon icon-solid--chevron-down",s.innerHTML='<i class="fa-solid fa-chevron-down" data-icon-name="solid--chevron-down"></i>',l?.append(s),l?.classList.add("siteheader-blog-has-subnav"),l?.setAttribute("aria-haspopup","listbox")),liBlogMenuArr.push({link:l,subnav:e.querySelector(":scope > ul"),index:t,isActive:!1})}),initiateBlogSubnav();let a=Array.from(t.querySelectorAll("*"));l&&e&&s.length&&l.addEventListener("click",()=>{t.classList.contains("siteheader-blog-menu-active")?(t.classList.remove("siteheader-blog-menu-active"),slideUp(e,175),bodyEl.classList.remove("siteheader-blog-nav-active"),popupDataAnalytics("close","blog_menu",openBlogNavCount),setTimeout(()=>{a.forEach(e=>{0<e.getAttribute("style")?.length&&(e.style.display="")})},300)):(openBlogNavCount+=1,t.classList.add("siteheader-blog-menu-active"),bodyEl.classList.add("siteheader-blog-nav-active"),slideDown(e,175),popupDataAnalytics("open","blog_menu",openBlogNavCount))})},structureBlogMenu=e=>{let t=document.createElement("section");t.className=e.className;let l,s,a;e?.querySelector(".siteheader")&&([l,s,a]=e.querySelector(".siteheader").children);var e=l?.children[1]?.querySelector("p"),i=l?.children[2]?.querySelector("p"),o=(t.classList.add("siteheader-blog"),t.innerHTML=`<div class='siteheader-blog-top-wrapper'>
      <div class='siteheader-blog-header-top'>
        <div class='siteheader-blog-header-row'>
            <div class='siteheader-blog-header-col'></div>
            <div class='siteheader-blog-header-col'></div>
        </div>
      </div>
    </div>
    <div class='siteheader-blog-bottom-wrapper'>
      <div class='siteheader-blog-header-bottom'>
        <div class='siteheader-blog-nav'>
          <nav></nav>
        </div>
      </div>
    </div>`,l?.children[0]&&([o,n]=l.children[0].children,t.querySelector(".siteheader-blog-header-col:first-child").innerHTML=`
      <div class="siteheader-blog-logo-wrap">
        <div class="siteheader-blog-logo-img">
          ${o.innerHTML.replaceAll("<em></em>","")}
        </div>
        ${0<n?.textContent.length?`<div class="siteheader-blog-logo-tagline">
                ${n.textContent}
              </div>`:""}
      </div>
    `),l?.children[4]&&(t.querySelector(".siteheader-blog-header-col:last-child").innerHTML=`
          <button type='button' class='subscribe-btn'>${l.children[4]?.querySelector("p").innerHTML}</button>
    `),s&&a&&(t.querySelector(".siteheader-blog-nav nav").innerHTML=`
      <div class='siteheader-blog-nav-toggle'>
        <button type='button'>${s.querySelector("p")?.innerHTML}</button>
      </div>
      ${a.innerHTML}
    `,t.querySelector("nav > div:last-child").classList.add("siteheader-blog-menu"),attachBlogMenuEvents(t)),e.innerHTML.length&&t.querySelector(".siteheader-blog-top-wrapper").classList.add(e.innerHTML),i.innerHTML.length&&t.querySelector(".siteheader-blog-bottom-wrapper").classList.add(i.innerHTML),document.querySelector("header")),n=document.querySelector("main");o.classList.add("header-has-blogmenu"),n.insertBefore(t,n.firstChild),renderImages(document.querySelector(".siteheader-blog"),()=>{setTimeout(()=>{t.classList.add(activeClsMain)},100)})};export{closeAllBlogMenuItems,structureBlogMenu};