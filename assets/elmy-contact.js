(()=>{'use strict';
const types={
 resources:{title:'Resource and support requirements',description:'Tell us about your learners, program and the level of resources, reporting or academic guidance you need.',field:'Which level interests you?',options:['Elmy Access','Elmy Insight','Elmy Impact','Help me choose'],message:'What subjects, learner levels and academic priorities should we consider?',placeholder:'Describe your program, resource needs and any reporting, expert-support or demonstration requirements.'},
 benchmarking:{title:'Assessment & Insights',description:'Institutional Assessment & Insights is under development and validation. Tell us about your institution and assessment priorities. Registration does not guarantee access, participation or a pilot.',field:'Would you be open to discussing future validation activities? (optional)',optional:true,options:['Yes','Possibly, I would like more information','Not at this stage'],message:'What would you like to understand about learning across your institution?',placeholder:'Tell us about your assessment priorities and the questions you want to answer.'},
 discovery:{title:'Institutional project requirements',description:'Describe the objectives, deliverables and operational requirements. Elmy will review the expertise and implementation scope required.',message:'What should the project address?',placeholder:'Describe the challenge, intended users, timeline and any operational requirements.'},
 general:{title:'Other institutional inquiry',description:'Share your question or a requirement that does not fit the other categories.',message:'Inquiry details',placeholder:'Include enough context for our team to direct your inquiry.'}
};
const form=document.getElementById('contact-form'),selector=document.getElementById('enquiry-type'),remainder=document.getElementById('contact-remainder'),fields=document.getElementById('tailored-fields'),selection=document.getElementById('contact-selection'),drafts={};let active='';
const params=new URLSearchParams(location.search),tier=params.get('tier'),tierNames={access:'Elmy Access',insight:'Elmy Insight',impact:'Elmy Impact'};
let selectedTier=tierNames[tier]||'',legacy=params.get('plan')||params.get('model')||'';
const aliases={demo:'resources',pricing:'resources',expert:'general',pilot:'discovery',foundation:'general'};
function update(){
 if(active)drafts[active]={focus:form.elements.focus?.value||'',message:form.elements.message.value};
 active=selector.value;const config=types[active];remainder.hidden=!config;fields.replaceChildren();if(!config)return;
 document.getElementById('context-title').textContent=config.title;document.getElementById('context-description').textContent=config.description;document.getElementById('message-label').textContent=config.message;
 form.elements.message.placeholder=config.placeholder;form.elements.message.value=drafts[active]?.message||'';
 form.elements.selected_plan.value=active==='resources'?selectedTier:'';form.elements.selected_resource_model.value=legacy;
 selection.hidden=!((active==='resources'&&selectedTier)||legacy);selection.querySelector('span').textContent=selectedTier?'Selected: '+selectedTier:legacy?'Previous inquiry context: '+legacy:'';
 if(config.field){const label=document.createElement('label');label.textContent=config.field;const select=document.createElement('select');select.name='focus';select.required=!config.optional;select.add(new Option('Select an option',''));config.options.forEach(t=>select.add(new Option(t,t)));select.value=drafts[active]?.focus||(active==='resources'?selectedTier:'');label.append(select);fields.append(label);}
 document.getElementById('contact-update').textContent='Questions updated for: '+selector.selectedOptions[0].text;
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches)remainder.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:250,easing:'ease-out'});
}
selection.querySelector('button').onclick=()=>{selectedTier='';legacy='';if(drafts.resources)drafts.resources.focus='';if(form.elements.focus)form.elements.focus.value='';const url=new URL(location.href);['tier','plan','model'].forEach(k=>url.searchParams.delete(k));history.replaceState(null,'',url.pathname+url.search+url.hash);update();};
selector.addEventListener('change',()=>{update();history.replaceState(null,'',location.pathname+location.search+(active?'#'+active:''));});
function fromLink(){const key=location.hash.slice(1);selector.value=types[key]?key:aliases[key]||(selectedTier?'resources':'');update();}
window.addEventListener('hashchange',fromLink);fromLink();form.addEventListener('submit',event=>event.preventDefault());
})();
