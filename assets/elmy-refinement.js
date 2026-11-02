(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
// Preserve native touch scrolling; the shared smoother remains desktop-only.
if(matchMedia('(pointer:coarse)').matches&&window.elmyScroll){window.elmyScroll.destroy();window.elmyScroll=null;}
const film=document.getElementById('methodology-video');
if(film){film.setAttribute('aria-describedby','platform-film-description');const caption=document.querySelector('.audit-caption');if(caption)caption.id='platform-film-description';if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)film.pause();},{threshold:0}).observe(film);}
// Only a short entrance on the process graphic; no pinned or hidden content.
if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:.45,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:450,easing:'ease-out'});observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.audit-process li,.audit-handoff li').forEach(el=>observer.observe(el));}
})();
