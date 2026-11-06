(()=>{
'use strict';
if(document.querySelector('.elmy-tools'))return;
const script=document.currentScript,root=new URL('../',script.src),current=location.pathname.replace(root.pathname,'')||'index.html';
const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('assets/elmy-navigation.css?v=3',root);document.head.append(style);
const icon=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${p}</svg>`;
const rail=document.createElement('aside');rail.className='elmy-tools';rail.setAttribute('aria-label','Quick navigation');
rail.innerHTML=`<a class="et-demo" href="${new URL('get-started.html',root)}" aria-label="Contact Elmy">${icon('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>')}<span>Contact Elmy</span></a><button type="button" aria-label="Search pages and sections" aria-haspopup="dialog">${icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>')}<span>Search this site</span></button><button type="button" aria-label="Back to top">${icon('<path d="M12 20V4m-7 7 7-7 7 7"/>')}<span>Back to top</span></button>`;
document.body.append(rail);
const smallScreen=matchMedia('(max-width:900px)');
function syncRail(){const editing=document.activeElement?.matches('input,textarea,select');const menuOpen=document.getElementById('mobile-toggle')?.getAttribute('aria-expanded')==='true';rail.hidden=smallScreen.matches&&(editing||menuOpen);}
document.addEventListener('focusin',syncRail);document.addEventListener('focusout',()=>requestAnimationFrame(syncRail));smallScreen.addEventListener('change',syncRail);
const mobileToggle=document.getElementById('mobile-toggle');if(mobileToggle)new MutationObserver(syncRail).observe(mobileToggle,{attributes:true,attributeFilter:['aria-expanded']});
const dialog=document.createElement('dialog');dialog.className='elmy-search';dialog.setAttribute('aria-labelledby','es-title');dialog.setAttribute('data-lenis-prevent','');dialog.innerHTML='<div class="es-top"><div><span class="es-kicker">SITE SEARCH</span><h2 id="es-title">Search Elmy</h2></div><button type="button" class="es-close" aria-label="Close search">×</button></div><label class="es-label" for="es-input">Search pages and sections</label><input id="es-input" type="search" placeholder="Search Elmy…" autocomplete="off"><p class="es-context"></p><div class="es-results"></div><p class="es-status" role="status" aria-live="polite"></p><div class="es-footer">Search across Elmy <span>ESC to close</span></div>';document.body.append(dialog);
const input=dialog.querySelector('input'),results=dialog.querySelector('.es-results'),status=dialog.querySelector('.es-status');let pages=[],returnFocus,oldOverflow;
const normalize=value=>value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
let destinations=[],indexFailed=false;
function render(){
 const query=normalize(input.value),terms=query.split(' ').filter(Boolean);
 const local=pages.find(p=>p.file===current);
 let entries;
 if(!query){
  entries=destinations.filter(e=>e.file===current&&!e.page).slice(0,3);
 }else{
  const scored=destinations.map(e=>({...e,score:terms.every(t=>e.search.includes(t))?
   (normalize(e.label)===query?100:0)+(normalize(e.label).startsWith(query)?30:0)+(e.file===current?8:0)+(e.page?4:0): -1}))
   .filter(e=>e.score>=0).sort((a,b)=>b.score-a.score);
  // A single best destination per page keeps page/section matches from repeating.
  const seen=new Set(),labels=new Set();entries=scored.filter(e=>{const label=normalize(e.label);if(seen.has(e.file)||labels.has(label))return false;seen.add(e.file);labels.add(label);return true;}).slice(0,5);
 }
 dialog.querySelector('.es-context').textContent=query?'Best matches':`Quick shortcuts · ${local?.title||'this page'}`;
 const fragment=document.createDocumentFragment();
 for(const e of entries){
  const a=document.createElement('a');a.href=new URL(e.file+(e.id?'#'+e.id:''),root);
  const small=document.createElement('small');small.textContent=e.file===current?'ON THIS PAGE':e.page?'OPEN PAGE':e.title;
  const label=document.createElement('strong');label.textContent=e.label;a.append(small,label);
  a.addEventListener('click',event=>{
   if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   if(e.file===current&&e.id){event.preventDefault();dialog.close();
    if(current==='get-started.html'){location.hash=e.id;return;}
    const target=document.getElementById(e.id);if(target){
     const disclosure=target.matches('details')?target:target.querySelector('details.pl-compare-disclosure');if(disclosure)disclosure.open=true;
     target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});history.replaceState(null,'','#'+e.id);
    }
   }
  });fragment.append(a);
 }
 results.replaceChildren(fragment);
 status.textContent=entries.length?(query?`${entries.length} matching ${entries.length===1?'page':'pages'}`:'Or type to search all pages.'):
  !pages.length?(indexFailed?'Search is unavailable. Use the main navigation.':'Loading shortcuts…'):'No matches. Try “plans”, “assessment” or “contact”.';
}
function open(){if(dialog.open)return;returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();input.value='';render();input.focus();}
dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;returnFocus?.focus({preventScroll:true});});dialog.querySelector('.es-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});input.addEventListener('input',render);
dialog.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dialog.close();return;}
 if(!['ArrowDown','ArrowUp','Enter'].includes(event.key))return;
 const links=[...results.querySelectorAll('a')];if(!links.length)return;
 const active=links.indexOf(document.activeElement);
 if(event.key==='Enter'){if(document.activeElement===input){event.preventDefault();links[0].click();}return;}
 if(document.activeElement!==input&&active<0)return;
 event.preventDefault();
 if(event.key==='ArrowUp'&&active===0){input.focus();return;}
 links[event.key==='ArrowDown'?(active+1)%links.length:active<0?links.length-1:active-1].focus();
});
rail.querySelectorAll('button')[0].onclick=open;rail.querySelectorAll('button')[1].onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dialog.open?dialog.close():open();}});
fetch(new URL('assets/elmy-search-index.json?v=5',root)).then(r=>{if(!r.ok)throw Error('index');return r.json();}).then(data=>{
 pages=data;
 destinations=pages.flatMap(p=>[{file:p.file,title:p.title,label:p.title,id:'',page:true,keywords:''},...p.sections.map(s=>({...s,file:p.file,title:p.title,page:false}))])
  .map(e=>({...e,search:normalize(e.label+' '+e.title+' '+(e.keywords||''))}));
 if(dialog.open)render();
}).catch(()=>{indexFailed=true;if(dialog.open)render();});
})();
