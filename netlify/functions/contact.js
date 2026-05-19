// js/contact.js
// Formulaire de contact — proxy via /api/contact (Netlify Function)
// W3F_KEY n'est PLUS exposé ici

(function(){
  var CT_I18N={
    fr:{title:'Nous contacter',sub:'Une question, un problème technique ou une suggestion ? Remplissez le formulaire ci-dessous.',name:'Votre nom',email:'Votre courriel',subject:'Sujet',message:'Message',btn:'Envoyer le message',sending:'Envoi en cours…',success:'Message envoyé avec succès ! Nous vous répondrons bientôt.',error:'Erreur lors de l\'envoi. Veuillez réessayer.',optGen:'Question générale',optBug:'Signaler un problème',optLic:'Licence / Paiement',optRef:'Demande de remboursement',optSug:'Suggestion',optOth:'Autre',errName:'Veuillez entrer votre nom.',errEmail:'Veuillez entrer un courriel valide.',errMsg:'Veuillez écrire un message.'},
    en:{title:'Contact Us',sub:'Have a question, technical issue, or suggestion? Fill out the form below.',name:'Your name',email:'Your email',subject:'Subject',message:'Message',btn:'Send message',sending:'Sending…',success:'Message sent successfully! We\'ll get back to you soon.',error:'Error sending message. Please try again.',optGen:'General question',optBug:'Report a bug',optLic:'License / Payment',optRef:'Refund request',optSug:'Suggestion',optOth:'Other',errName:'Please enter your name.',errEmail:'Please enter a valid email.',errMsg:'Please write a message.'},
    es:{title:'Contactar',sub:'¿Tienes alguna pregunta, problema técnico o sugerencia? Rellena el formulario a continuación.',name:'Tu nombre',email:'Tu correo electrónico',subject:'Asunto',message:'Mensaje',btn:'Enviar el mensaje',sending:'Enviando…',success:'¡Mensaje enviado con éxito! Te responderemos pronto.',error:'Error al enviar. Por favor, inténtalo de nuevo.',optGen:'Pregunta general',optBug:'Informar de un problema',optLic:'Licencia / Pago',optRef:'Solicitud de reembolso',optSug:'Sugerencia',optOth:'Otro',errName:'Por favor, introduce tu nombre.',errEmail:'Por favor, introduce un correo válido.',errMsg:'Por favor, escribe un mensaje.'}
  };
  function ct(k){var l=(typeof currentLang!=='undefined'?currentLang:'fr');return(CT_I18N[l]&&CT_I18N[l][k])||CT_I18N.fr[k]||k;}

  /* ═══ FAQ accordion toggle ═══ */
  window.toggleFaq=function(btn){
    var item=btn.closest('.faq-item');
    if(!item)return;
    var isOpen=item.classList.contains('open');
    var all=document.querySelectorAll('.faq-item');
    for(var i=0;i<all.length;i++){
      all[i].classList.remove('open');
      var b=all[i].querySelector('.faq-q');
      if(b)b.setAttribute('aria-expanded','false');
    }
    if(!isOpen){
      item.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  };

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      var openItem=document.querySelector('.faq-item.open');
      if(openItem){
        openItem.classList.remove('open');
        var b=openItem.querySelector('.faq-q');
        if(b){b.setAttribute('aria-expanded','false');b.focus();}
      }
    }
  });

  window.openContactForm=function(presetSubject){
    var el;
    el=document.getElementById('ctTitle');if(el)el.textContent=ct('title');
    el=document.getElementById('ctSub');if(el)el.textContent=ct('sub');
    el=document.getElementById('ctLblName');if(el)el.textContent=ct('name');
    el=document.getElementById('ctLblEmail');if(el)el.textContent=ct('email');
    el=document.getElementById('ctLblSubject');if(el)el.textContent=ct('subject');
    el=document.getElementById('ctLblMsg');if(el)el.textContent=ct('message');
    el=document.getElementById('ctBtn');if(el){el.textContent=ct('btn');el.disabled=false;}
    el=document.getElementById('ctOptGen');if(el)el.textContent=ct('optGen');
    el=document.getElementById('ctOptBug');if(el)el.textContent=ct('optBug');
    el=document.getElementById('ctOptLic');if(el)el.textContent=ct('optLic');
    el=document.getElementById('ctOptRef');if(el)el.textContent=ct('optRef');
    el=document.getElementById('ctOptSug');if(el)el.textContent=ct('optSug');
    el=document.getElementById('ctOptOth');if(el)el.textContent=ct('optOth');
    el=document.getElementById('ctConfirm');if(el){el.textContent='';el.className='ct-msg';}
    document.getElementById('ctName').value='';
    document.getElementById('ctEmail').value='';
    document.getElementById('ctMessage').value='';
    el=document.getElementById('ctSubject');
    if(el)el.value=(presetSubject&&['general','bug','license','refund','suggestion','other'].includes(presetSubject))?presetSubject:'general';
    document.getElementById('contactModal').classList.add('show');
  };

  window.submitContact=async function(){
    var name=document.getElementById('ctName').value.trim();
    var email=document.getElementById('ctEmail').value.trim();
    var subject=document.getElementById('ctSubject');
    var subjectText=subject.options[subject.selectedIndex].text;
    var message=document.getElementById('ctMessage').value.trim();
    if(!name){alert(ct('errName'));return;}
    if(!email||!email.includes('@')){alert(ct('errEmail'));return;}
    if(!message){alert(ct('errMsg'));return;}

    var btn=document.getElementById('ctBtn');
    var msg=document.getElementById('ctConfirm');
    btn.disabled=true;
    btn.textContent=ct('sending');
    msg.className='ct-msg';

    try{
      var res=await fetch('/api/contact',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:name,
          email:email,
          message:'['+subjectText+'] '+message,
          // honeypot — toujours vide côté légit
          website:''
        })
      });
      var data=await res.json();
      if(data.success){
        msg.textContent=ct('success');
        msg.className='ct-msg show';
        document.getElementById('ctName').value='';
        document.getElementById('ctEmail').value='';
        document.getElementById('ctMessage').value='';
        btn.textContent='✓';
        setTimeout(function(){document.getElementById('contactModal').classList.remove('show');},2500);
      } else {
        throw new Error(data.message||'Error');
      }
    }catch(e){
      msg.textContent=ct('error');
      msg.className='ct-msg show';
      msg.style.color='#ef4444';
      btn.textContent=ct('btn');
      btn.disabled=false;
    }
  };
})();
