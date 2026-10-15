/* Офлайн-чтение: отдельный модуль. Вкладка «Офлайн» в настройках (панель #panel).
   Скачивание и хранение делает service worker (sw.js), здесь только интерфейс. */
(()=>{
if(!('serviceWorker' in navigator)||location.protocol==='file:')return;
const R=document.documentElement,panel=document.getElementById('panel');if(!panel)return;
const L={
 ru:{tab:'Офлайн',title:'Чтение без интернета',note:'Интерфейс сайта доступен офлайн всегда. Ниже выберите, что ещё сохранить на устройство.',core:'Интерфейс и тексты сайта',always:'всегда',
  tr:{cass:'Кассиан',rbo:'РБО',arar:'Нор Арарат 2018',nasb:'NASB',elb:'Elberfelder 1905'},audio:'Звуки природы',fonts:'Шрифты',
  save:'Сохранить для чтения без интернета',upd:'Обновить сохранённое',retry:'Повторить',del:'Удалить сохранённое',saved:'Сохранено',notsaved:'не сохранено',saving:'Сохраняю…',
  done:'Готово. Можно читать без интернета.',upToDate:'Сохранено',update:'Есть обновление сайта: нажмите «Обновить сохранённое».',err:'Не удалось сохранить: ',offline:'Нет подключения. Скачать можно только при интернете.',
  used:'Занято на устройстве',persist:'Хранилище защищено от автоочистки',nopersist:'Браузер может очистить хранилище при нехватке места',offpill:'Офлайн',mb:'МБ',confirm:'Удалить сохранённые тексты, звуки и шрифты? Интерфейс останется.',nosw:'Офлайн-режим пока не готов: обновите страницу.'},
 en:{tab:'Offline',title:'Reading without internet',note:'The site interface always works offline. Choose below what else to keep on this device.',core:'Site interface and texts',always:'always',
  tr:{cass:'Cassian',rbo:'RBO',arar:'Nor Ararat 2018',nasb:'NASB',elb:'Elberfelder 1905'},audio:'Nature sounds',fonts:'Fonts',
  save:'Save for offline reading',upd:'Update saved files',retry:'Try again',del:'Delete saved files',saved:'Saved',notsaved:'not saved',saving:'Saving…',
  done:'Done. You can read without internet.',upToDate:'Saved',update:'A site update is available: tap “Update saved files”.',err:'Could not save: ',offline:'No connection. Downloading needs internet.',
  used:'Used on this device',persist:'Storage is protected from auto-cleanup',nopersist:'The browser may clear storage when space runs low',offpill:'Offline',mb:'MB',confirm:'Delete saved texts, sounds and fonts? The interface will stay.',nosw:'Offline mode is not ready yet: reload the page.'},
 hy:{tab:'Օֆլայն',title:'Ընթերցում առանց ինտերնետի',note:'Կայքի ինտերֆեյսը միշտ հասանելի է օֆլայն։ Ընտրեք, թե էլ ինչ պահել սարքում։',core:'Կայքի ինտերֆեյսը և տեքստերը',always:'միշտ',
  tr:{cass:'Կասիան',rbo:'ՌԲՕ',arar:'Նոր Արարատ 2018',nasb:'NASB',elb:'Elberfelder 1905'},audio:'Բնության ձայներ',fonts:'Տառատեսակներ',
  save:'Պահել առանց ինտերնետի ընթերցելու համար',upd:'Թարմացնել պահվածը',retry:'Կրկնել',del:'Ջնջել պահվածը',saved:'Պահված է',notsaved:'չի պահված',saving:'Պահում եմ…',
  done:'Պատրաստ է։ Կարող եք կարդալ առանց ինտերնետի։',upToDate:'Պահված է',update:'Կայքի թարմացում կա․ սեղմեք «Թարմացնել պահվածը»։',err:'Չհաջողվեց պահել․ ',offline:'Կապ չկա։ Ներբեռնելու համար ինտերնետ է պետք։',
  used:'Զբաղված է սարքում',persist:'Պահոցը պաշտպանված է ինքնաշխատ մաքրումից',nopersist:'Բրաուզերը կարող է մաքրել պահոցը տեղի պակասի դեպքում',offpill:'Օֆլայն',mb:'ՄԲ',confirm:'Ջնջե՞լ պահված տեքստերը, ձայները և տառատեսակները։ Ինտերֆեյսը կմնա։',nosw:'Օֆլայն ռեժիմը դեռ պատրաստ չէ․ թարմացրեք էջը։'},
 de:{tab:'Offline',title:'Lesen ohne Internet',note:'Die Oberfläche der Seite funktioniert immer offline. Wählen Sie unten, was noch gespeichert werden soll.',core:'Oberfläche und Texte der Seite',always:'immer',
  tr:{cass:'Cassian',rbo:'RBO',arar:'Nor Ararat 2018',nasb:'NASB',elb:'Elberfelder 1905'},audio:'Naturklänge',fonts:'Schriften',
  save:'Für Offline-Lesen speichern',upd:'Gespeichertes aktualisieren',retry:'Erneut versuchen',del:'Gespeichertes löschen',saved:'Gespeichert',notsaved:'nicht gespeichert',saving:'Speichere…',
  done:'Fertig. Sie können ohne Internet lesen.',upToDate:'Gespeichert',update:'Ein Update der Seite ist verfügbar: „Gespeichertes aktualisieren“ tippen.',err:'Speichern fehlgeschlagen: ',offline:'Keine Verbindung. Zum Herunterladen ist Internet nötig.',
  used:'Belegt auf diesem Gerät',persist:'Speicher ist vor automatischer Bereinigung geschützt',nopersist:'Der Browser kann den Speicher bei Platzmangel leeren',offpill:'Offline',mb:'MB',confirm:'Gespeicherte Texte, Klänge und Schriften löschen? Die Oberfläche bleibt.',nosw:'Offline-Modus ist noch nicht bereit: Seite neu laden.'}
};
const GROUPS=['cass','rbo','arar','nasb','elb','audio','fonts'];
/*GEN:sizes*/const SIZES={"arar":1562292,"cass":1468401,"elb":1150810,"nasb":1015567,"rbo":6324341};/*GEN:end*/
const lg=()=>L[R.lang]||L.en;
let st=null,busy=0,sizes={},msg='',err='';

/* вкладка и раздел */
const nav=panel.querySelector('.tabs'),tabBtn=document.createElement('button');tabBtn.dataset.tab='off';nav.appendChild(tabBtn);
const sec=document.createElement('section');sec.dataset.s='off';sec.id='offSec';panel.insertBefore(sec,panel.querySelector('div[hidden]')||null);
tabBtn.onclick=()=>{panel.querySelectorAll('[data-s]').forEach(e=>e.classList.toggle('on',e.dataset.s==='off'));nav.querySelectorAll('button').forEach(e=>e.classList.toggle('on',e===tabBtn));refresh();loadSizes()};
const pill=document.createElement('div');pill.id='off-pill';pill.hidden=navigator.onLine;document.body.appendChild(pill);
const setPill=()=>{pill.textContent=lg().offpill;pill.hidden=navigator.onLine};
addEventListener('online',()=>{setPill();render()});addEventListener('offline',()=>{setPill();render()});

const fmt=n=>n?(n/1048576).toFixed(n<1048576*10?1:0)+' '+lg().mb:'';
const checked=()=>[...sec.querySelectorAll('input[data-g]:checked')].map(i=>i.dataset.g);
function rowSt(g){const s=st&&st.groups[g],t=lg();if(!s)return '';return s.saved?'✓ '+t.saved+(s.date?', '+new Date(s.date).toLocaleDateString(R.lang||undefined):''):t.notsaved}
function render(){
 const t=lg(),keep=checked(),first=!sec.firstChild;tabBtn.textContent=t.tab;
 const outdated=st&&st.savedBuild&&st.savedBuild!==st.build&&GROUPS.some(g=>st.groups[g]&&st.groups[g].saved);
 const anySaved=st&&GROUPS.some(g=>st.groups[g]&&st.groups[g].saved);
 sec.innerHTML='<h4>'+t.title+'</h4><p class="off-note">'+t.note+'</p><div class="off-list">'
  +'<div class="off-row"><span class="off-n">'+t.core+'</span><span class="off-s">✓ '+t.always+'</span></div>'
  +GROUPS.map(g=>'<label class="off-row"><input type="checkbox" data-g="'+g+'"'+(first||keep.includes(g)?' checked':'')+(busy?' disabled':'')+'><span class="off-n">'+(t.tr[g]||t[g])+(sizes[g]?' <small>'+fmt(sizes[g])+'</small>':'')+'</span><span class="off-s">'+rowSt(g)+'</span></label>').join('')
  +'</div><div class="off-bar"'+(busy?'':' hidden')+'><i id="off-i"></i></div>'
  +'<div class="row"><button class="btn on" id="off-save"'+(busy?' disabled':'')+'>'+(err?t.retry:outdated?t.upd:t.save)+'</button>'+(anySaved?'<button class="btn" id="off-del"'+(busy?' disabled':'')+'>'+t.del+'</button>':'')+'</div>'
  +'<p class="off-msg" id="off-msg">'+(busy?t.saving:err?t.err+err:!navigator.onLine?t.offline:outdated?t.update:msg)+'</p><p class="off-note" id="off-store"></p>';
 sec.querySelector('#off-save').onclick=save;const d=sec.querySelector('#off-del');if(d)d.onclick=del;storage();
}
async function storage(){
 const el=sec.querySelector('#off-store');if(!el)return;const t=lg();
 try{const e=await navigator.storage.estimate(),p=navigator.storage.persisted?await navigator.storage.persisted():false;
  el.textContent=t.used+': '+fmt(e.usage||0)+(e.quota?' / '+fmt(e.quota):'')+'. '+(p?t.persist:t.nopersist)+'.'}catch(_){}
}
async function sw(){const r=await navigator.serviceWorker.ready;return r.active}
async function cmd(o){const a=await sw();if(a)a.postMessage(o);else{err=lg().nosw;render()}}
function refresh(){cmd({cmd:'status'}).catch(()=>{})}
async function loadSizes(){
 if(!navigator.onLine||Object.keys(sizes).length)return;
 sizes=Object.assign({},SIZES);
 render();
}
async function save(){
 const gs=checked();if(!gs.length)return;
 if(!navigator.onLine){err='';msg=lg().offline;render();return}
 err='';msg='';busy=1;render();
 try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(_){}
 cmd({cmd:'save',groups:gs});
}
function del(){if(!confirm(lg().confirm))return;msg='';err='';cmd({cmd:'remove',groups:GROUPS})}
navigator.serviceWorker.addEventListener('message',e=>{
 const d=e.data;if(!d||d.nz!=='offline')return;
 if(d.type==='progress'){const i=sec.querySelector('#off-i');if(i)i.style.width=(d.total?Math.round(d.done/d.total*100):100)+'%'}
 else if(d.type==='done'){busy=0;st=d.status;err=d.failed&&d.failed.length?d.failed.map(g=>lg().tr[g]||lg()[g]).join(', '):'';msg=err?'':lg().done;render()}
 else if(d.type==='status'){st=d.status;render()}
 else if(d.type==='error'){busy=0;err=d.message;render()}
});
new MutationObserver(()=>{render();setPill()}).observe(R,{attributes:true,attributeFilter:['lang']});
setPill();render();
})();
