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
/* ПК: толкование раскрывается сбоку от креста — с той стороны и на той высоте, где находится сама деталь */
(function(){var D=document,cw=D.querySelector('.hero .crossw');if(!cw)return;var tp=null,mo=null;
function place(){if(innerWidth<820||!tp||!window.__crossTip)return;var k=window.__crossTip.cur(),r=cw.getBoundingClientRect(),w=tp.offsetWidth,h=tp.offsetHeight,x,y,cx=.5,cy=.5;
 if(k>=0){var e=cw.querySelectorAll('.hs')[k];if(e){var b=e.getBoundingClientRect();cx=(b.left+b.width/2-r.left)/r.width;cy=(b.top+b.height/2-r.top)/r.height;y=b.top+b.height/2-h/2}}
 if(y==null)y=r.top+r.height/2-h/2;
 y=Math.max(12,Math.min(innerHeight-h-12,y));
 x=cx<.42?r.left-28-w:r.right+28;
 x=Math.max(12,Math.min(innerWidth-w-12,x));x=Math.round(x);y=Math.round(y);
 if(tp.style.left!==x+'px'||tp.style.top!==y+'px'){tp.style.left=x+'px';tp.style.top=y+'px'}}
function init(){tp=D.getElementById('crossTip');if(!tp)return;mo=new MutationObserver(place);mo.observe(tp,{attributes:true,attributeFilter:['style','class']});place()}
cw.addEventListener('mouseover',function(){if(!tp)setTimeout(init,0)},{passive:true});
cw.addEventListener('focusin',function(){if(!tp)setTimeout(init,0)});
})();
