/* Зажать палец на книге/главе в меню → скользить по списку → отпустить на пункте = выбрать.
   Увёл палец за пределы меню (или жест отменён системой) = отмена, ничего не выбирается.
   Обычный короткий тап работает как раньше. */
(function(){
var HOLD_MS=320,SLOP=10,S=null,swallow=0;
function pop(){return document.getElementById('brPop')}
function item(x,y){var e=document.elementFromPoint(x,y);return e&&e.closest?e.closest('#brPop .bp-i,#brPop .bp-n'):null}
function inside(x,y){var p=pop();if(!p)return false;var r=p.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
function mark(el){var p=pop();if(!p)return;[].forEach.call(p.querySelectorAll('.hold'),function(n){if(n!==el)n.classList.remove('hold')});
 if(el&&!el.classList.contains('hold')){el.classList.add('hold');try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}}}
function end(){if(!S)return;clearTimeout(S.t);var p=pop();if(p){p.classList.remove('drag');mark(null)}S=null}
document.addEventListener('pointerdown',function(e){
 if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;
 var b=item(e.clientX,e.clientY);if(!b||!e.target.closest('#brPop'))return;
 end();S={b:b,x:e.clientX,y:e.clientY,drag:0,out:0,id:e.pointerId};
 S.t=setTimeout(function(){if(!S||S.out)return;S.drag=1;pop().classList.add('drag');mark(S.b)},HOLD_MS)},{passive:true});
document.addEventListener('pointermove',function(e){
 if(!S||e.pointerId!==S.id)return;
 if(!S.drag){if(Math.hypot(e.clientX-S.x,e.clientY-S.y)>SLOP){clearTimeout(S.t);S.out=1}return} /* до удержания палец сдвинулся = это прокрутка */
 if(!inside(e.clientX,e.clientY)){S.cur=null;mark(null);return}   /* вне меню: пункт не выбран */
 var b=item(e.clientX,e.clientY);S.cur=b;mark(b)},{passive:true});
document.addEventListener('pointerup',function(e){
 if(!S||e.pointerId!==S.id)return;
 var s=S,pick=s.drag&&inside(e.clientX,e.clientY)?item(e.clientX,e.clientY):null;
 if(s.drag){swallow=performance.now();end();if(pick)pick.click()}else end()},{passive:true});
document.addEventListener('pointercancel',function(e){if(S&&e.pointerId===S.id){swallow=performance.now();end()}},{passive:true});
/* после удержания браузер может послать лишний click — гасим */
document.addEventListener('click',function(e){if(performance.now()-swallow<450&&e.target.closest&&e.target.closest('#brPop')&&e.isTrusted){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#brPop'))e.preventDefault()});
})();
