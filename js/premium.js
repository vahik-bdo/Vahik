(()=>{var R=document.documentElement,raf=0;
/* сила верхнего размытия растёт с прокруткой. Пишем прозрачность ПРЯМО в #ebT, а не переменной на <html>:
   унаследованная переменная на корне заставляла браузер пересчитывать стили всего документа на каждом кадре (5 fps, пока на экране крест).
   Значение округляем до 0.05 и пишем только когда оно изменилось. */
var ebT=null,lastV=-1;
function etp(){raf=0;ebT=ebT||document.getElementById('ebT');if(!ebT)return;var t=Math.max(0,Math.min(1,(scrollY-30)/260)),v=Math.round(t*t*(3-2*t)*20)/20;if(v!==lastV){lastV=v;ebT.style.opacity=v}}
addEventListener('scroll',function(){raf||(raf=requestAnimationFrame(etp))},{passive:true});etp();addEventListener('load',etp);
var EB={ru:['Символика','Деталь'],en:['Symbolism','Detail'],hy:['Խորհրդանշան','Մանրամասն'],de:['Symbolik','Detail']};
var AR={ru:['Предыдущая деталь','Следующая деталь'],en:['Previous detail','Next detail'],hy:['Նախորդ մանրամասն','Հաջորդ մանրամասն'],de:['Vorheriges Detail','Nächstes Detail']};
var CH='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function eb(tp){if(!tp||tp.querySelector('.ct-eb'))return;var L=(R.lang||'ru').slice(0,2),e=EB[L]||EB.en,a=AR[L]||AR.en,T=window.__crossTip,k=T&&T.cur?T.cur():-1,n=T&&T.count?T.count():0,row=document.createElement('div'),t=k>=0?e[1]+' \u00b7 '+String(T.pos?T.pos():k+1).padStart(2,'0')+(n?' / '+n:''):e[0];
 row.className='ct-nav';
 /* стрелки листают толкования по кругу: «листай дальше» без возврата курсора на крест */
 row.innerHTML=(T&&T.step?'<button type="button" class="ct-ar" data-d="-1" aria-label="'+a[0]+'">'+CH+'</button>':'')+'<div class="ct-eb">'+t+'</div>'+(T&&T.step?'<button type="button" class="ct-ar ct-nx" data-d="1" aria-label="'+a[1]+'">'+CH+'</button>':'');
 tp.insertBefore(row,tp.firstChild)}
function init(){var tp=document.getElementById('crossTip');if(!tp)return false;new MutationObserver(function(){eb(tp)}).observe(tp,{childList:true});eb(tp);return true}
if(!init()){var mo=new MutationObserver(function(){if(init())mo.disconnect()});mo.observe(document.body,{childList:true})}})();
