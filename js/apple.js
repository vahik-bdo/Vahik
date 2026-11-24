/* apple.js: крест при прокрутке, автосворачивание левой колонки / меню «···» / панели настроек */
(function(){
var D=document,H=D.documentElement,$=function(s){return D.querySelector(s)};
/* 1. крест статичный; на время, пока он на экране, отключается полноэкранное размытие при прокрутке */
var cxOn=null;function cxChk(){var on=(window.pageYOffset||0)<Math.max(500,innerHeight*.7);if(on!==cxOn){cxOn=on;H.classList.toggle('cx',on)}}
addEventListener('scroll',cxChk,{passive:true});cxChk();

/* толкования: подписи «Стих / Толкование» (язык интерфейса) */
var LV={ru:['Стих','Толкование'],en:['Verse','Commentary'],hy:['Համար','Մեկնություն'],de:['Vers','Auslegung'],pl:['Wers','Komentarz'],hu:['Vers','Magyarázat']};
function decorate(body){
 var L=LV[(H.lang||'ru').slice(0,2)]||LV.en;
 body.querySelectorAll('.com-q:not([data-tag])').forEach(function(q){var b=q.querySelector('b');q.setAttribute('data-tag',L[0]+(b?' '+b.textContent:''))});
 body.querySelectorAll('.com-qt:not([data-tag])').forEach(function(q){q.setAttribute('data-tag',L[0])});
 body.querySelectorAll('.com-q,.com-qt').forEach(function(q){var n=q.nextElementSibling;if(!n||!/^(P|H4)$/.test(n.tagName))return;
  var w=D.createElement('div');w.className='com-body';w.setAttribute('data-tag',L[1]);q.parentNode.insertBefore(w,n);
  while(w.nextElementSibling&&/^(P|H4)$/.test(w.nextElementSibling.tagName))w.appendChild(w.nextElementSibling)})}
function comWatch(){var b=$('#brComBody');if(!b)return false;var mo=new MutationObserver(function(){mo.disconnect();decorate(b);mo.observe(b,{childList:true,subtree:true})});mo.observe(b,{childList:true,subtree:true});decorate(b);return true}
if(!comWatch()){var m=0,iv2=setInterval(function(){if(comWatch()||++m>40)clearInterval(iv2)},400)}

/* общий помощник: закрыть после паузы бездействия */
function idleClose(isOpen,close,ms,zone){
 var t=0;function stop(){clearTimeout(t);t=0}
 function arm(){stop();if(isOpen())t=setTimeout(fire,ms)}
 function fire(){t=0;if(!isOpen())return;var z=zone();if(z&&z.matches&&z.matches(':hover')&&matchMedia('(hover:hover)').matches){arm();return}
  var a=D.activeElement;if(a&&z&&z.contains(a)&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)){arm();return}
  close()}
 ['pointerdown','pointermove','keydown','wheel','touchstart'].forEach(function(e){D.addEventListener(e,function(ev){var z=zone();if(z&&ev.target&&z.contains&&z.contains(ev.target))arm()},{passive:true,capture:true})});
 return arm}

/* 4. меню «···» справа снизу: 8 с без касаний */
var dock=$('#dock');
if(dock){
 var anyPanel=function(){return !!$('#panel.open,#npanel.open,#ppanel.open,#hpanel.open,#rpanel.open,#modal.open')};
 var armD=idleClose(function(){return dock.classList.contains('open')},function(){if(anyPanel())return;var b=$('#dt');b&&b.click()},8000,function(){return dock});
 new MutationObserver(armD).observe(dock,{attributes:true,attributeFilter:['class']});
 /* панель настроек: 25 с без активности внутри неё */
 var pn=$('#panel');
 if(pn){var armP=idleClose(function(){return pn.classList.contains('open')},function(){pn.classList.remove('open')},25000,function(){return pn});
  new MutationObserver(armP).observe(pn,{attributes:true,attributeFilter:['class']})}
}

/* 2. левая колонка: сворачивается через 6 с и при прокрутке текста */
function railInit(){
 var R=$('#brRail');if(!R)return false;
 var armR=idleClose(function(){return R.classList.contains('open')},function(){if($('#brPop.open'))return;R.classList.remove('open')},6000,function(){return $('#brPop.open')||R});
 new MutationObserver(armR).observe(R,{attributes:true,attributeFilter:['class']});
 var last=window.pageYOffset;addEventListener('scroll',function(){var y=window.pageYOffset;if(Math.abs(y-last)>90){last=y;if(R.classList.contains('open')&&!$('#brPop.open'))R.classList.remove('open')}},{passive:true});
 return true}
if(!railInit()){var n=0,iv=setInterval(function(){if(railInit()||++n>40)clearInterval(iv)},250)}

/* 8. толкование креста: при наведении (на сенсорных, по касанию) */
var CT={
ru:['Православный крест',['Верхняя малая перекладина: табличка с надписью «Иисус Назорей, Царь Иудейский» (Ин. 19:19).','Средняя перекладина: распростёртые руки Распятого.','Нижняя косая перекладина: подножие. Поднятый конец указывает на покаявшегося разбойника, опущенный: на непокаявшегося.','IC XC: Иисус Христос. NIKA: «Побеждает».','Череп у подножия Голгофы: голова Адама. Христос Своей смертью победил смерть.']],
en:['The Orthodox cross',['Upper short bar: the plaque reading “Jesus of Nazareth, King of the Jews” (John 19:19).','Middle bar: the outstretched hands of the Crucified.','Lower slanted bar: the footrest. The raised end points to the repentant thief, the lowered end to the unrepentant one.','IC XC: Jesus Christ. NIKA: “He conquers”.','The skull at the foot of Golgotha: the head of Adam. By His death Christ conquered death.']],
hy:['Ուղղափառ խաչ',['Վերին փոքր խաչափայտ. տախտակը՝ «Հիսուս Նազովրեցի, Հրեից թագավոր» (Հովհ. 19:19)։','Միջին խաչափայտ. Խաչյալի տարածված ձեռքերը։','Ստորին թեք խաչափայտ. ոտքերի հենարանը։ Բարձրացած ծայրը ցույց է տալիս զղջացող ավազակին, իջածը՝ չզղջացողին։','IC XC. Հիսուս Քրիստոս։ NIKA. «Հաղթում է»։','Գանգը Գողգոթայի ստորոտին Ադամի գլուխն է։ Քրիստոսը Իր մահվամբ հաղթեց մահվանը։']],
de:['Das orthodoxe Kreuz',['Oberer kurzer Querbalken: die Tafel „Jesus von Nazaret, König der Juden“ (Joh 19,19).','Mittlerer Querbalken: die ausgestreckten Hände des Gekreuzigten.','Unterer schräger Balken: der Fußschemel. Das erhobene Ende weist auf den reuigen Schächer, das gesenkte auf den unbußfertigen.','IC XC: Jesus Christus. NIKA: „Er siegt“.','Der Schädel am Fuß Golgathas: der Kopf Adams. Durch seinen Tod hat Christus den Tod besiegt.']],
pl:['Krzyż prawosławny',['Górna krótka poprzeczka: tabliczka z napisem „Jezus Nazareński, Król Żydowski” (J 19,19).','Środkowa poprzeczka: wyciągnięte ręce Ukrzyżowanego.','Dolna ukośna poprzeczka: podnóżek. Uniesiony koniec wskazuje na skruszonego łotra, opuszczony na nieskruszonego.','IC XC: Jezus Chrystus. NIKA: „Zwycięża”.','Czaszka u stóp Golgoty: głowa Adama. Swoją śmiercią Chrystus pokonał śmierć.']],
hu:['Az ortodox kereszt',['Felső rövid gerenda: a felirat táblája: „Názáreti Jézus, a zsidók királya” (Jn 19,19).','Középső gerenda: a Megfeszített kitárt karjai.','Alsó ferde gerenda: a lábtartó. Az emelkedő vége a megtérő lator felé mutat, a lesüllyedő a megtérni nem akaró felé.','IC XC: Jézus Krisztus. NIKA: „Győz”.','A koponya a Golgota tövében Ádám feje. Halálával Krisztus legyőzte a halált.']]};
var cw=$('.hero .crossw'),tp=null,tpT=0;
function tipBuild(){var d=CT[(H.lang||'ru').slice(0,2)]||CT.en;
 tp.innerHTML='<h5>'+d[0]+'</h5>'+d[1].map(function(x){return'<p>'+x+'</p>'}).join('')}
function tipPos(){var r=cw.getBoundingClientRect(),w=tp.offsetWidth,h=tp.offsetHeight,vw=innerWidth,vh=innerHeight,x,y;
 if(vw>=820){x=r.right+28;y=Math.max(12,Math.min(vh-h-12,r.top+r.height/2-h/2))}
 else{x=(vw-w)/2;y=Math.max(12,Math.min(vh-h-12,r.bottom+12))}
 tp.style.left=Math.round(x)+'px';tp.style.top=Math.round(y)+'px'}
function tipShow(){if(!cw)return;if(!tp){tp=D.createElement('div');tp.id='crossTip';tp.setAttribute('role','tooltip');D.body.appendChild(tp)}
 clearTimeout(tpT);tipBuild();tipPos();tp.classList.add('on');cw.setAttribute('aria-expanded','true')}
function tipHide(d){clearTimeout(tpT);tpT=setTimeout(function(){tp&&tp.classList.remove('on');cw&&cw.setAttribute('aria-expanded','false')},d||0)}
if(cw){cw.setAttribute('tabindex','0');cw.setAttribute('aria-expanded','false');
 if(matchMedia('(hover:hover)').matches){cw.addEventListener('mouseenter',tipShow);cw.addEventListener('mouseleave',function(){tipHide(120)})}
 cw.addEventListener('click',function(e){e.stopPropagation();tp&&tp.classList.contains('on')?tipHide():tipShow()});
 cw.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tp&&tp.classList.contains('on')?tipHide():tipShow()}});
 D.addEventListener('click',function(e){if(tp&&tp.classList.contains('on')&&!e.target.closest('#crossTip'))tipHide()});
 D.addEventListener('keydown',function(e){if(e.key==='Escape')tipHide()});
 addEventListener('scroll',function(){if(tp&&tp.classList.contains('on'))tipHide()},{passive:true})}
})();
