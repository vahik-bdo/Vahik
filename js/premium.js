(()=>{var R=document.documentElement,raf=0;
/* сила верхнего размытия растёт с прокруткой. Пишем прозрачность ПРЯМО в #ebT, а не переменной на <html>:
   унаследованная переменная на корне заставляла браузер пересчитывать стили всего документа на каждом кадре (5 fps, пока на экране крест).
   Значение округляем до 0.05 и пишем только когда оно изменилось. */
var ebT=null,lastV=-1;
function etp(){raf=0;ebT=ebT||document.getElementById('ebT');if(!ebT)return;var t=Math.max(0,Math.min(1,(scrollY-30)/260)),v=Math.round(t*t*(3-2*t)*20)/20;if(v!==lastV){lastV=v;ebT.style.opacity=v}}
addEventListener('scroll',function(){raf||(raf=requestAnimationFrame(etp))},{passive:true});etp();addEventListener('load',etp);
var EB={ru:['Символика','Деталь'],en:['Symbolism','Detail'],hy:['Խորհրդանշան','Մանրամասն'],de:['Symbolik','Detail']};
function eb(tp){if(!tp||tp.querySelector('.ct-eb'))return;var L=(R.lang||'ru').slice(0,2),e=EB[L]||EB.en,T=window.__crossTip,k=T&&T.cur?T.cur():-1,d=document.createElement('div');d.className='ct-eb';d.textContent=k>=0?e[1]+' · '+String(k+1).padStart(2,'0'):e[0];tp.insertBefore(d,tp.firstChild)}
function init(){var tp=document.getElementById('crossTip');if(!tp)return false;new MutationObserver(function(){eb(tp)}).observe(tp,{childList:true});eb(tp);return true}
if(!init()){var mo=new MutationObserver(function(){if(init())mo.disconnect()});mo.observe(document.body,{childList:true})}})();
