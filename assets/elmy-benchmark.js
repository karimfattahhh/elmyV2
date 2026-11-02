(()=>{
 const tabs=[...document.querySelectorAll('.bm-tabs [role="tab"]')];
 const panels=[...document.querySelectorAll('.bm-panels [role="tabpanel"]')];
 function select(index,focus=false){
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
  if(focus)tabs[index].focus();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){panels[index].getAnimations().forEach(a=>a.cancel());panels[index].animate([{opacity:.65},{opacity:1}],{duration:180});}
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next,true);});});
})();
