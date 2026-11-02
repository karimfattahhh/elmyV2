(() => {
  'use strict';
  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateNav, {passive:true});
  updateNav();
  // Preview forms must never imply that an enquiry has been delivered.
  document.querySelectorAll('.copy-form').forEach(form => form.addEventListener('submit', event => event.preventDefault()));
})();
