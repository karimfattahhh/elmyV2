(() => {
  'use strict';
  const nav = document.getElementById('nav');
  const syncNav = () => nav.classList.toggle('scrolled', window.scrollY > 32);
  addEventListener('scroll', syncNav, {passive:true});
  syncNav();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold:0.08});
    document.querySelectorAll('.ab-reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('ab-motion');
    reduce.addEventListener('change', event => { if (event.matches) { document.documentElement.classList.remove('ab-motion'); observer.disconnect(); } });
  }
  // Close peers explicitly for browsers without native exclusive <details> support.
  const beliefs = [...document.querySelectorAll('.ab-principles details')];
  beliefs.forEach(current => current.addEventListener('toggle', () => {
    if (current.open) beliefs.forEach(other => { if (other !== current) other.open = false; });
  }));
})();

(() => {
  const section = document.getElementById('philosophy');
  if (!section) return;
  const source = [...section.querySelectorAll('.ab-principles details')];
  const data = source.map(el => ({title:el.querySelector('h3').textContent,line:el.querySelector('.ab-principle-line').textContent,body:el.querySelector('.ab-principle-body>p:last-child').textContent}));
  const stage = document.createElement('div');
  stage.className = 'ab-wrap ab-thinking-stage';
  stage.innerHTML = '<div class="ab-thinking-head"><div><div class="ab-label">02 &nbsp; / &nbsp; Delivery principles</div><h2>Five principles of delivery.</h2></div><span class="ab-thinking-count">SCROLL TO EXPLORE / 05 PRINCIPLES</span></div><div class="ab-thinking-grid"><div class="ab-thinking-numeral" aria-hidden="true">01</div><div class="ab-thinking-content"><span class="ab-thinking-eyebrow">DELIVERY PRINCIPLE</span><h3></h3><p class="ab-thinking-line"></p><p class="ab-thinking-body"></p></div></div><div class="ab-thinking-nav" role="group" aria-label="Explore our principles"></div>';
  section.append(stage);
  const numeral = stage.querySelector('.ab-thinking-numeral'), content = stage.querySelector('.ab-thinking-content');
  const title = content.querySelector('h3'), line = content.querySelector('.ab-thinking-line'), body = content.querySelector('.ab-thinking-body');
  const buttons = data.map((item,i) => {
    const button = document.createElement('button');
    button.type='button';button.setAttribute('aria-label',`Principle ${i+1}: ${item.title}`);
    const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');
    button.append(number,document.createTextNode(item.title));stage.querySelector('.ab-thinking-nav').append(button);
    button.addEventListener('click',()=>{
      const top=scrollY+section.getBoundingClientRect().top-offset()+travel()*(i+.35)/data.length;
      if(window.elmyScroll) window.elmyScroll.scrollTo(top,{duration:1});
      else window.scrollTo({top,behavior:'smooth'});
    });return button;
  });
  const enabled=matchMedia('(min-width:901px) and (min-height:680px) and (prefers-reduced-motion:no-preference)');
  const offset=()=>innerWidth<=760?80:100;
  const travel=()=>Math.max(1,section.offsetHeight-stage.offsetHeight);
  let active=-1, frame=0, animations=[];
  function update(){
    frame=0;
    section.classList.toggle('thinking-enabled',enabled.matches);
    if(!enabled.matches)return;
    const progress=Math.max(0,Math.min(.999999,(offset()-section.getBoundingClientRect().top)/travel()));
    const index=Math.floor(progress*data.length);
    buttons.forEach((button,i)=>{
      button.style.setProperty('--fill',Math.max(0,Math.min(1,progress*data.length-i)));
      if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    });
    if(index===active)return;
    const direction=index>active?1:-1, first=active===-1;active=index;
    numeral.textContent=String(index+1).padStart(2,'0');
    title.textContent=data[index].title;line.textContent=data[index].line;body.textContent=data[index].body;
    animations.forEach(animation=>animation.cancel());
    if(!first)animations=[numeral,content].map((el,i)=>el.animate([{opacity:0,transform:`translateY(${direction*(i?22:34)}px)`,filter:'blur(5px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:550,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  function request(){if(!frame)frame=requestAnimationFrame(update);}
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);enabled.addEventListener('change',()=>{animations.forEach(a=>a.cancel());request();});update();
})();
