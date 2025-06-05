let searchBuilder=(e,t)=>e&&t?`<div class='siteheader-search-wrapper'>
          <button type='button' aria-label='Toggle Search'>
            ${t.querySelector("p:first-child").innerHTML}
            ${t.querySelector("p:last-child").innerHTML}
          </button>
          <div class='siteheader-search-inner'>
            <div class='siteheader-search-content'>
              <form action='/search' id='siteheader-search-form'>
                <label for='header_search'>
                  ${e.querySelector("p:first-child em").innerHTML}
                </label>
                <div class='siteheader-search-input-wrapper'>
                  <input type='search' name='q' id='header_search'
                    autocorrect='off' autocomplete='off' autocapitalize='off' maxlength='2048'
                    placeholder='${e.querySelector("p:nth-child(2) em").innerHTML}'/>
                  <button type='submit' aria-label='Search'>
                    ${e.querySelector("p:last-child em").innerHTML}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>`:"",enableAutocomplete=e=>{if(window.autoComplete){let i=new window.autoComplete({flag:!0,name:e,selector:"#"+e,data:{src:async e=>{var t=i.input.nextElementSibling,a=document.createElement("div"),a=(i.flag&&(i.flag=!1,a.classList.add("loader"),t.prepend(a)),t.hidden=!1,{term:e,limit:5,audience:"ALL_AUDIENCE"}),t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`query Suggest($term: String!, $language: LanguageEnum = EN, $limit: Int = 5, $audience: AudienceEnum = ALL_AUDIENCE) {
          suggest(term: $term, language: $language, limit: $limit, audience: $audience) {
            items {
              WELLMARK_COM {
                highlights
              }
              WELLMARK_BLUE {
                highlights
              }
            }
          }
        }`,variables:a})};try{var r=await fetch("https://apigw-sit.wellmark.com/wellmark-com-open-search/v1/search",t);if(!r.ok)throw new Error("Header Search Response status: "+r.status);var n=(await r.json()).data.suggest.items;let a=[];for(let t in n)(n[t].highlights||[]).forEach(e=>{a.push({match:e.replace("<em>","").replace("</em>",""),cat:t})});return a}catch(e){return e}},keys:["match"]},query:e=>(e.trim().length<3&&(document.querySelector(".siteheader-autocomplete").hidden=!0),e.trim()),resultsList:{tag:"ul",class:"siteheader-autocomplete",noResults:!0,maxResults:15,tabSelect:!0,element:(e,t)=>{var a=document.createElement("p");t.results.length<=0&&(a.innerHTML=`Found <strong>${t.matches.length}</strong> matching results for <strong>"${t.query}"</strong>`),e.prepend(a)}},submit:!0,tabSelect:!0,resultItem:{highlight:!0,element:(e,t)=>{e.style="display: flex; justify-content: space-between;";var a,r=t.value.cat;e.previousElementSibling?.getAttribute("data-cat")!==r&&((a=document.createElement("p")).textContent=r,a.className="category-heading",a.setAttribute("data-cat",r),e.before(a)),e.setAttribute("data-cat",r),e.innerHTML=`
          <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
            ${t.match}
          </span>`}},threshold:3,debounce:250,events:{input:{focus:()=>{var e;3<=i.input.value.length&&((e=i.input?.nextElementSibling)&&(e.hidden=!1),i.start())},blur:()=>{var e=i.input?.nextElementSibling;e&&(e.hidden=!0)}}}});i.input.addEventListener("results",e=>{e=e.target.nextElementSibling.querySelector(".loader");e&&(e.display="none")}),i.input.addEventListener("selection",e=>{e=e.detail,i.input.blur(),e=e.selection.value[e.selection.key];i.input.value=e,document.getElementById("siteheader-search-form").submit()})}};export{searchBuilder,enableAutocomplete};