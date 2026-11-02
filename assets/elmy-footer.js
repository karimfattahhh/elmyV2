(()=>{
 const footer=document.querySelector('.elmy-footer');if(!footer)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 footer.querySelector('.ef-top')?.addEventListener('click',()=>{
  if(window.elmyScroll&&!reduced.matches)window.elmyScroll.scrollTo(0,{duration:.9});
  else window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
 });
 if(!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){footer.classList.toggle('ef-active',entry.isIntersecting);
   if(entry.isIntersecting)footer.classList.add('ef-entered');
  }
 },{threshold:.05});observer.observe(footer);
})();
