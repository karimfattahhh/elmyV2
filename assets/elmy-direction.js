(()=>{'use strict';
// Same-site contextual links remain local in this isolated preview.
const path=location.pathname;
document.querySelectorAll('a').forEach(a=>{
 const href=a.getAttribute('href')||'';
 if(href.includes('learn.html')&&a.textContent.trim()==='Explore resources and insights')a.setAttribute('href',href.replace('learn.html','resources.html'));
 if(a.textContent.trim()==='Discuss your requirements')a.href='get-started.html#resources';
});
})();
