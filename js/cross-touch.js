/* Крест: один тап = толкование; щипок двумя пальцами = на весь экран */
(function(){var D=document,cw=D.querySelector('.hero .crossw');if(!cw)return;
var fs=null,tap=null,swallow=0;
function openFs(){if(!fs){fs=D.createElement('div');fs.id='crossFs';fs.innerHTML='<div class="cross" role="img"></div>';D.body.appendChild(fs);
 fs.addEventListener('click',closeFs);var p0=0;
 fs.addEventListener('touchstart',function(e){if(e.touches.length===2)p0=dist(e.touches)},{passive:true});
 fs.addEventListener('touchmove',function(e){if(e.touches.length===2&&p0&&dist(e.touches)<p0*.7){p0=0;closeFs()}},{passive:true})}
 window.__crossTip&&window.__crossTip.hide();
 requestAnimationFrame(function(){fs.classList.add('on')});try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}
function closeFs(){fs&&fs.classList.remove('on')}
function dist(t){return Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)}
D.addEventListener('keydown',function(e){if(e.key==='Escape')closeFs()});
/* щипок */
var d0=0;
cw.addEventListener('touchstart',function(e){if(e.touches.length===2){d0=dist(e.touches);tap=null}},{passive:true});
cw.addEventListener('touchmove',function(e){if(d0&&e.touches.length===2&&dist(e.touches)>d0*1.25){d0=0;swallow=Date.now();openFs()}},{passive:true});
cw.addEventListener('touchend',function(e){if(e.touches.length<2)d0=0},{passive:true});
/* одиночный тап (на телефоне без курсора) */
cw.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;tap={x:e.clientX,y:e.clientY,t:Date.now(),el:e.target}},{passive:true});
cw.addEventListener('pointerup',function(e){if(e.pointerType==='mouse'||!tap)return;var T=window.__crossTip;
 if(Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<12&&Date.now()-tap.t<500&&T){var h=tap.el.closest&&tap.el.closest('.hs'),i=h?[].indexOf.call(cw.querySelectorAll('.hs'),h):-1;
  swallow=Date.now();e.preventDefault();
  if(T.isOn()&&T.cur()===i)T.hide();else T.show(i);
  cw.classList.remove('pulse');void cw.offsetWidth;cw.classList.add('pulse')}
 tap=null});
cw.addEventListener('click',function(e){if(Date.now()-swallow<700){e.stopImmediatePropagation();e.stopPropagation()}},true);
D.addEventListener('click',function(e){if(Date.now()-swallow<700&&e.target.closest&&e.target.closest('.hero .crossw')){e.stopImmediatePropagation()}},true);
})();
