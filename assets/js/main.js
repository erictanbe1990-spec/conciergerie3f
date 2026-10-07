document.documentElement.classList.add('js');
// ===== Google Analytics (GA4) =====
(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-5JP62SBCLN';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-5JP62SBCLN');})();
// ====== EDIT HERE ======
var WHATSAPP = 'https://wa.me/33652296898?text=' + encodeURIComponent('Bonjour, je souhaite une estimation pour mon bien.');
var WEB3FORMS_KEY = '9505da6f-460b-4f72-8c2d-1ca6a26ba134'; // clé Web3Forms — demandes envoyées par email
// =======================
document.addEventListener('DOMContentLoaded', function () {
  var burger=document.querySelector('.burger'), links=document.querySelector('.nav-links');
  if(burger&&links){burger.addEventListener('click',function(){links.classList.toggle('show');});
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('show');});});}
  document.querySelectorAll('.faq-q').forEach(function(q){q.addEventListener('click',function(){
    var item=q.closest('.faq-item'), was=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
    if(!was)item.classList.add('open');});});
  var sel='.section .center, .feature, .svc, .value, .price-card, .card, .about-card, .about-grid > div, .faq-item, .zone-chip, .offer-grid > div, .contact-grid > div, .step';
  var els=[].slice.call(document.querySelectorAll(sel));
  els.forEach(function(e){e.classList.add('reveal');});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){ents.forEach(function(en){
      if(en.isIntersecting){var el=en.target;var idx=[].indexOf.call(el.parentNode.children,el);
        el.style.animationDelay=Math.min(idx,6)*0.12+'s';el.classList.add('in');io.unobserve(el);}});},{threshold:.12});
    els.forEach(function(e){io.observe(e);});
  } else { els.forEach(function(e){e.classList.add('in');}); }
  var c=document.querySelector('[data-count]');
  if(c){var target=parseInt(c.getAttribute('data-count'),10)||20,done=false;
    function run(){if(done)return;done=true;var t0=null;function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1);var e=1-Math.pow(1-p,3);c.textContent=Math.round(target*e);if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
    var io2=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)run();});},{threshold:.4});io2.observe(c);}
  var L=document.documentElement.lang||'fr';
  var T=function(fr,en,de){return L==='en'?en:L==='de'?de:fr;};
  function track(name,params){try{if(window.gtag)gtag('event',name,params||{});}catch(_){}}
  // ===== suivi des contacts (GA4) : appels, WhatsApp, e-mail =====
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('tel:')===0)track('click_phone',{link_location:a.className||'link'});
    else if(h.indexOf('wa.me')!==-1)track('click_whatsapp',{link_location:a.className||'link'});
    else if(h.indexOf('mailto:')===0)track('click_email',{link_location:a.className||'link'});
    else if(h.indexOf('#estimation')!==-1)track('click_estimation_cta',{link_location:a.className||'link'});
  });
  // ===== lead form (envoi par e-mail via Web3Forms) =====
  var form=document.getElementById('leadForm');
  if(form){
    var ok=document.getElementById('lead-ok');
    var val=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
    var started=false;
    form.addEventListener('focusin',function(){if(!started){started=true;track('form_start',{form_id:'leadForm'});}});
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      var bot=document.getElementById('lead-botcheck'); if(bot&&bot.checked)return;
      var btn=form.querySelector('button[type=submit]'), label=btn.textContent;
      var MSG=T('✓ Merci !<br><span class="big">Nous vous recontactons sous 24h</span>','✓ Thank you!<br><span class="big">We\'ll get back to you within 24h</span>','✓ Danke!<br><span class="big">Wir melden uns innerhalb von 24 Std.</span>');
      var ERR=T('Oups, l\'envoi n\'a pas fonctionné. Appelez-nous au <a href="tel:+33652296898">06 52 29 68 98</a> ou écrivez-nous sur <a href="'+WHATSAPP+'" target="_blank" rel="noopener">WhatsApp</a>.',
                'Sorry, sending failed. Call us on <a href="tel:+33652296898">+33 6 52 29 68 98</a> or message us on <a href="'+WHATSAPP+'" target="_blank" rel="noopener">WhatsApp</a>.',
                'Das Senden ist fehlgeschlagen. Rufen Sie uns an: <a href="tel:+33652296898">+33 6 52 29 68 98</a> oder schreiben Sie uns per <a href="'+WHATSAPP+'" target="_blank" rel="noopener">WhatsApp</a>.');
      var SENT=T('Demande envoyée','Request sent','Anfrage gesendet');
      var ville=val('lead-ville');
      var data={access_key:WEB3FORMS_KEY,subject:'Nouvelle demande d’estimation'+(ville?' – '+ville:'')+' – Conciergerie 3F',from_name:'Site Conciergerie 3F',
        prenom:val('lead-name'),telephone:val('lead-phone'),email:val('lead-email'),commune:ville,bien:val('lead-bien'),
        page:location.pathname,langue:L,source:document.referrer||'direct',botcheck:false};
      if(!data.email)delete data.email;
      function success(){ if(ok){ok.classList.remove('err');ok.hidden=false;ok.innerHTML=MSG;} btn.textContent=SENT;btn.disabled=true;
        track('generate_lead',{form_id:'leadForm',commune:ville||'non précisée'}); }
      function fail(){ if(ok){ok.classList.add('err');ok.hidden=false;ok.innerHTML=ERR;} btn.textContent=label;btn.disabled=false;
        track('lead_error',{form_id:'leadForm'}); }
      btn.disabled=true; btn.textContent=T('Envoi…','Sending…','Wird gesendet…');
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json();}).then(function(j){ if(j&&j.success)success(); else fail(); }).catch(fail);
    });
  }
  // ===== barre d'action fixe sur mobile =====
  if(!document.querySelector('.mobile-cta')){
    var est=document.getElementById('estimation')?'#estimation':'index.html#estimation';
    var bar=document.createElement('div'); bar.className='mobile-cta';
    bar.innerHTML='<a class="btn btn-outline" href="tel:+33652296898">'+T('📞 Appeler','📞 Call','📞 Anrufen')+'</a><a class="btn btn-gold" href="'+est+'">'+T('Estimation gratuite','Free estimate','Gratis-Einschätzung')+'</a>';
    document.body.appendChild(bar); document.body.classList.add('has-mcta');
  }
  // ===== floating WhatsApp button =====
  var stack=document.createElement('div'); stack.className='social-float';
  var a=document.createElement('a'); a.className='sf-btn sf-wa'; a.href=WHATSAPP; a.target='_blank'; a.rel='noopener'; a.setAttribute('aria-label','WhatsApp');
  a.innerHTML='<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.057 0c3.18 0 6.167 1.24 8.413 3.488a11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>';
  stack.appendChild(a); document.body.appendChild(stack);
});
