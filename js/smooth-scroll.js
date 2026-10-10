(()=>{
/* 1) плавная прокрутка колесом во всех внутренних окнах (панели, предисловие, поиск, история, списки) */
if(!matchMedia('(pointer:coarse)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
const K=.18,S=new WeakMap();
const scroller=el=>{for(;el&&el!==document.body&&el!==document.documentElement;el=el.parentElement){const o=getComputedStyle(el).overflowY;if((o==='auto'||o==='scroll')&&el.scrollHeight>el.clientHeight+1)return el}return null};
function step(el,s){s.c+=(s.t-s.c)*K;if(Math.abs(s.t-s.c)<.4){s.c=s.t;s.run=0}el.scrollTop=s.c;if(s.run)requestAnimationFrame(()=>step(el,s))}
addEventListener('wheel',e=>{if(e.ctrlKey||e.defaultPrevented)return;const el=scroller(e.target);if(!el)return;
 e.preventDefault();e.stopPropagation();let s=S.get(el);if(!s){s={t:el.scrollTop,c:el.scrollTop,run:0};S.set(el,s);el.addEventListener('scroll',()=>{if(!s.run)s.t=s.c=el.scrollTop},{passive:true})}
 if(!s.run){s.t=s.c=el.scrollTop}
 s.t=Math.max(0,Math.min(el.scrollHeight-el.clientHeight,s.t+e.deltaY*(e.deltaMode?32:1)));
 if(!s.run){s.run=1;requestAnimationFrame(()=>step(el,s))}},{passive:false,capture:true});
/* клавиатура: PageUp/PageDown/Space/Home/End/стрелки на главной странице — плавно */
addEventListener('keydown',e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;
 const a=document.activeElement,tg=a&&a.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT'||tg==='BUTTON'||(a&&a.isContentEditable))return;
 if(e.target.closest&&e.target.closest('#pfm,#panel,#npanel,#ppanel,#hpanel,#modal,#brSearch,#brHist,#brPop'))return;
 const h=innerHeight,k=e.key;let d=null,abs=null;
 if(k==='PageDown'||(k===' '&&!e.shiftKey))d=h*.88;else if(k==='PageUp'||(k===' '&&e.shiftKey))d=-h*.88;
 else if(k==='ArrowDown')d=70;else if(k==='ArrowUp')d=-70;else if(k==='Home')abs=0;else if(k==='End')abs=document.documentElement.scrollHeight;else return;
 e.preventDefault();scrollTo({top:abs!==null?abs:scrollY+d,behavior:'smooth'})});
}
/* 2) iPhone: у Safari нет Fullscreen API, поэтому показываем кнопку с подсказкой (из «Домой» сайт откроется без панелей) */
const de=document.documentElement,hasFs=de.requestFullscreen||de.webkitRequestFullscreen,standalone=navigator.standalone||matchMedia('(display-mode: standalone)').matches;
const dm=document.getElementById('dm');
if(dm&&!hasFs&&!standalone&&!document.getElementById('bFs')){
 const L={ru:['На весь экран','Safari на iPhone не умеет открывать сайты на весь экран. Нажмите «Поделиться» → «На экран “Домой”» и открывайте сайт с иконки: он запустится без адресной строки и панелей.','Понятно'],
  en:['Full screen','Safari on iPhone can’t show a page in full screen. Tap Share → Add to Home Screen, then open the site from its icon: it will launch without the browser bars.','Got it'],
  hy:['Լիաէկրան','iPhone-ի Safari-ն չի կարող կայքը բացել լիաէկրան։ Սեղմեք «Կիսվել» → «Ավելացնել հիմնական էկրանին» և բացեք կայքը պատկերակից. այն կբացվի առանց զննարկչի վահանակների։','Հասկանալի է'],
  de:['Vollbild','Safari auf dem iPhone kann Seiten nicht im Vollbild anzeigen. Tippe auf Teilen → „Zum Home-Bildschirm“ und öffne die Seite über das Symbol: Sie startet ohne Browserleisten.','Verstanden']};
 const lg=()=>L[de.lang]||L.en;
 const b=document.createElement('button');b.className='btn rnd';b.id='bFs';
 b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
 const lab=()=>{b.title=b.ariaLabel=lg()[0]};lab();new MutationObserver(lab).observe(de,{attributes:true,attributeFilter:['lang']});
 dm.insertAdjacentHTML('afterbegin','');dm.prepend(b);
 b.onclick=()=>{const o=document.createElement('div');o.id='fsHint';o.style.cssText='position:fixed;inset:0;z-index:100010;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,9,12,.72);-webkit-backdrop-filter:blur(var(--blur,12px));backdrop-filter:blur(var(--blur,12px))';
  o.innerHTML='<div style="max-width:340px;padding:1.3rem 1.2rem 1.1rem;border:1px solid var(--line,rgba(255,255,255,.2));border-radius:20px;background:var(--panel,#222);color:var(--fg,#eee);text-align:center;font:400 .95rem/1.55 var(--ff,serif)"><h4 style="margin:0 0 .5rem;color:var(--head,#f0cf7a);font:600 1.15rem var(--ff,serif)"></h4><p style="margin:0 0 1rem"></p><button class="btn on" type="button"></button></div>';
  const x=lg();o.querySelector('h4').textContent=x[0];o.querySelector('p').textContent=x[1];const ok=o.querySelector('button');ok.textContent=x[2];
  const close=()=>o.remove();ok.onclick=close;o.onclick=e=>{if(e.target===o)close()};document.body.appendChild(o)}}
})();
