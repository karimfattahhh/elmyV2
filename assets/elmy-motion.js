(function(){
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let smoother;
function setupScroll(){if(smoother){smoother.destroy();smoother=null;}if(!reduce.matches&&matchMedia("(pointer:fine)").matches&&window.Lenis){smoother=new Lenis({autoRaf:true,lerp:.09,smoothWheel:true,syncTouch:false,anchors:false,prevent:node=>!!node.closest('[data-lenis-prevent],.sv,.pv-modal'),autoToggle:true});}window.elmyScroll=smoother;}
setupScroll();reduce.addEventListener('change',setupScroll);
// Match anchor offsets to each section, including sticky local navigation.
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
 const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
 let target;try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}if(!target)return;
 event.preventDefault();const margin=parseFloat(getComputedStyle(target).scrollMarginTop)||parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--elmy-nav-offset'))||110;
 if(smoother)smoother.scrollTo(target,{offset:-margin,duration:.85});else window.scrollTo({top:scrollY+target.getBoundingClientRect().top-margin,behavior:reduce.matches?'instant':'smooth'});
 history.pushState(null,'',url.hash);
});
new MutationObserver(()=>{if(smoother){if(document.body.style.overflow==='hidden')smoother.stop();else smoother.start();}}).observe(document.body,{attributes:true,attributeFilter:['style']});
const nav=document.getElementById('nav'),toggle=document.getElementById('solutions-toggle'),menu=document.getElementById('solutions-menu'),mobile=document.getElementById('mobile-toggle'),panel=document.getElementById('mobile-menu');
let hoverTimer;
const hoverNav=matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)');
function close(){clearTimeout(hoverTimer);menu.hidden=true;panel.hidden=true;toggle.setAttribute('aria-expanded','false');mobile.setAttribute('aria-expanded','false');mobile.setAttribute('aria-label','Open menu');nav.classList.remove('menu-open');}
function openSolutions(){clearTimeout(hoverTimer);panel.hidden=true;mobile.setAttribute('aria-expanded','false');nav.classList.remove('menu-open');menu.hidden=false;toggle.setAttribute('aria-expanded','true');}
function scheduleClose(){clearTimeout(hoverTimer);hoverTimer=setTimeout(close,180);}
[toggle,menu].forEach(el=>{el.addEventListener('pointerenter',()=>{if(hoverNav.matches)openSolutions();});el.addEventListener('pointerleave',()=>{if(hoverNav.matches)scheduleClose();});});
nav.querySelectorAll('.nav-trigs>a,.nav-right,.brand').forEach(el=>el.addEventListener('pointerenter',()=>{if(hoverNav.matches)close();}));
toggle.addEventListener('click',e=>{if(hoverNav.matches&&e.detail>0){openSolutions();return;}if(menu.hidden)openSolutions();else close();});
mobile.addEventListener('click',()=>{const open=panel.hidden;close();panel.hidden=!open;mobile.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-label',open?'Close menu':'Open menu');nav.classList.toggle('menu-open',open);});
document.addEventListener('click',e=>{if(!nav.contains(e.target)||e.target.closest('a[href]'))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const target=!menu.hidden?toggle:!panel.hidden?mobile:null;close();if(target)target.focus();}});
nav.addEventListener('focusout',()=>setTimeout(()=>{if(!nav.contains(document.activeElement))close();},0));
window.addEventListener('resize',close);
const section=document.getElementById('model');if(!section)return;
const scenes=[...section.querySelectorAll('.method-scene')],buttons=[...section.querySelectorAll('[data-method]')];
const desktop=matchMedia('(min-width:901px) and (min-height:680px) and (prefers-reduced-motion:no-preference)');
let current=-1,scheduled=false;
function update(){scheduled=false;const enabled=desktop.matches;const distance=section.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,(110-section.getBoundingClientRect().top)/Math.max(1,distance)));const idx=Math.min(4,Math.floor(p*5));section.style.setProperty('--method-progress',p);if(idx!==current||!enabled){current=idx;scenes.forEach((scene,i)=>{scene.classList.toggle('is-active',i===idx);scene.setAttribute('aria-hidden',String(enabled&&i!==idx));});buttons.forEach((button,i)=>{if(i===idx)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});}}
function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
buttons.forEach((button,i)=>button.addEventListener('click',()=>{const top=scrollY+section.getBoundingClientRect().top-110+(section.offsetHeight-innerHeight)*(i+.2)/5;if(smoother)smoother.scrollTo(top,{duration:.85});else window.scrollTo({top,behavior:reduce.matches?'instant':'smooth'});}));
document.documentElement.classList.add('motion-ready');window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);desktop.addEventListener('change',request);update();
})();
