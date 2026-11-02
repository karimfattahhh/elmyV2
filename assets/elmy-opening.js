(function(){
const stage=document.querySelector('.hero-dashboard-stage'),visual=stage?.querySelector('.hero-dashboard'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:760px)');let queued=false,last=-1;
function update(){queued=false;if(!visual)return;const distance=Math.max(300,innerHeight*.85),p=(reduce.matches||mobile.matches)?1:Math.max(0,Math.min(1,scrollY/distance));if(p===last)return;last=p;visual.style.transform=`translate3d(0,${18*(1-p)}px,0) scale(${.88+.12*p})`;}
function request(){if(!queued){queued=true;requestAnimationFrame(update);}}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduce.addEventListener('change',request);mobile.addEventListener('change',request);update();
const story=document.querySelector('.story-white');if(story){const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){story.classList.add('story-visible');io.disconnect();}},{threshold:.15});io.observe(story);}
})();
