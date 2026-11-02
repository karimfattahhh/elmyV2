(()=>{
document.getElementById('nav')?.classList.add('scrolled');
const chapters=[...document.querySelectorAll('.story-chapter')],links=[...document.querySelectorAll('.story-aside nav a')],bar=document.querySelector('.story-progress i'),article=document.querySelector('.story-prose');let queued=false;
function update(){queued=false;const rect=article.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.35-rect.top)/Math.max(1,rect.height)));bar.style.transform=`scaleX(${progress})`;let active=chapters[0]?.id;for(const section of chapters){if(section.getBoundingClientRect().top<innerHeight*.45)active=section.id;}links.forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});window.addEventListener('resize',update);update();
})();
(()=>{
const root=document.querySelector('.case-explorer');if(!root)return;
const steps=[...root.querySelectorAll('.explorer-step')],buttons=[...root.querySelectorAll('[data-step]')],caption=root.querySelector('.explorer-caption'),sticky=root.querySelector('.explorer-sticky');let pending=false,active=-1;
function select(i){if(i===active)return;active=i;root.dataset.stage=String(i);caption.firstElementChild.textContent=steps[i].dataset.caption;caption.lastElementChild.textContent=`0${i+1} / 03`;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}
function update(){pending=false;const mobile=matchMedia('(max-width:700px)').matches;const line=mobile?innerHeight*.85:innerHeight*.55;let next=0;steps.forEach((s,i)=>{if(s.getBoundingClientRect().top<line)next=i;});select(next);}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{steps[i].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});select(i);}));
window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});window.addEventListener('resize',update);update();
})();
