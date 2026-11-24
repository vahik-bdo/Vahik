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
})();
