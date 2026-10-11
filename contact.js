/* Связь с автором: кнопка в меню (⋯), окно с ссылкой на Telegram и ссылка внизу страницы */
(()=>{
const URL_='https://t.me/vahe100',H='@vahe100';
const T={
 ru:{t:'Связаться',p:'Вопрос, замечание или нашли ошибку в тексте? Напишите в Telegram.',go:'Написать в Telegram',cp:'Скопировать '+H,ok:'Скопировано ✓',foot:'Связаться: '+H,x:'Закрыть'},
 en:{t:'Contact',p:'A question, a remark, or found a mistake in the text? Message me on Telegram.',go:'Message on Telegram',cp:'Copy '+H,ok:'Copied ✓',foot:'Contact: '+H,x:'Close'},
 hy:{t:'Կապ',p:'Հարց ունե՞ք, դիտողություն կա՞, թե՞ տեքստում սխալ եք գտել։ Գրեք Telegram-ով։',go:'Գրել Telegram-ով',cp:'Պատճենել '+H,ok:'Պատճենվեց ✓',foot:'Կապ՝ '+H,x:'Փակել'},
 de:{t:'Kontakt',p:'Eine Frage, ein Hinweis oder einen Fehler im Text gefunden? Schreib mir auf Telegram.',go:'In Telegram schreiben',cp:H+' kopieren',ok:'Kopiert ✓',foot:'Kontakt: '+H,x:'Schließen'}
};
const L=()=>T[document.documentElement.lang]||T.ru;
const PLANE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 3.5 2.8 10.7l5.4 2 2 6.2 3-3.6 4.6 3.4z"/><path d="m8.2 12.7 8.6-5.4"/></svg>';
let m=null;

function fill(){
  const l=L();
  const b=document.getElementById('bContact'); if(b){b.title=l.t;b.setAttribute('aria-label',l.t)}
  const f=document.querySelector('[data-ct="foot"]'); if(f)f.textContent=l.foot;
  if(!m)return;
  m.querySelector('h3').textContent=l.t;
  m.querySelector('p').textContent=l.p;
  m.querySelector('.ct-go span').textContent=l.go;
  const c=m.querySelector('.ct-cp'); c.textContent=l.cp; c.classList.remove('done');
  m.querySelector('.ct-x').setAttribute('aria-label',l.x);
}
function build(){
  if(m)return;
  m=document.createElement('div'); m.id='ctm'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
  m.innerHTML='<div class="ctc"><button class="ct-x" type="button">×</button><div class="ct-ico">'+PLANE+'</div><h3></h3><p></p>'+
   '<a class="ct-go" href="'+URL_+'" target="_blank" rel="noopener noreferrer">'+PLANE+'<span></span></a><button class="ct-cp" type="button"></button></div>';
  document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.ct-x'))close()});
  m.querySelector('.ct-cp').onclick=async e=>{
    const btn=e.currentTarget;
    try{await navigator.clipboard.writeText(H)}catch(_){
      const a=document.createElement('textarea');a.value=H;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(__){}a.remove()}
    btn.textContent=L().ok; btn.classList.add('done');
    setTimeout(()=>{if(btn.classList.contains('done')){btn.textContent=L().cp;btn.classList.remove('done')}},2200)};
  fill();
}
function open(){build();fill();requestAnimationFrame(()=>m.classList.add('open'))}
function close(){if(m)m.classList.remove('open')}

const dm=document.getElementById('dm');
if(dm){
  dm.insertAdjacentHTML('afterbegin','<button class="btn rnd" id="bContact" type="button">'+PLANE+'</button>');
  document.getElementById('bContact').onclick=open;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
new MutationObserver(fill).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
fill();
})();
