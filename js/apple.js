/* apple.js: крест при прокрутке, автосворачивание левой колонки / меню «···» / панели настроек */
(function(){
var D=document,H=D.documentElement,$=function(s){return D.querySelector(s)};
/* 1. крест: --cp от 0 (виден) до 1 (скрыт) */
var cp=-1,tk=0;
function cross(){tk=0;var y=window.pageYOffset||H.scrollTop||0,p=Math.min(1,Math.max(0,y/Math.max(160,innerHeight*.28)));p=Math.round(p*100)/100;if(p!==cp){cp=p;H.style.setProperty('--cp',p)}}
addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(cross)},{passive:true});cross();

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
