/* Помощник «Вахе»: кнопка в меню (⋯) и окно чата. Ответы приходят с сервера агента (папка vahe-backend). */
(()=>{
/* Адрес сервера агента (Cloud Run). Пока пусто, кнопка чата скрыта. Пример: 'https://vahe-agent-xxxx-uc.a.run.app' */
const API_URL='';

const T={
 ru:{t:'Вахе',sub:'Помощник по тексту Нового Завета',hi:'Здравствуйте! Спросите о том, что читаете: трудное место, контекст, параллельные места.',
  ph:'Ваш вопрос…',send:'Отправить',x:'Закрыть',nw:'Начать заново',
  note:'Это ИИ, он может ошибаться. Сверяйтесь с текстом.',
  err:'Не удалось получить ответ. Попробуйте ещё раз чуть позже.',off:'Нет подключения к интернету. Помощнику нужна сеть.',lim:'Слишком много вопросов подряд. Подождите несколько минут.',
  s:['О чём Евангелие от Иоанна?','Что значит «Слово стало плотию»?','Как понимать Нагорную проповедь?']},
 en:{t:'Vahe',sub:'Helper for reading the New Testament',hi:'Hello! Ask about what you are reading: a hard passage, the context, parallel places.',
  ph:'Your question…',send:'Send',x:'Close',nw:'Start over',
  note:'This is an AI and can make mistakes. Check it against the text.',
  err:'Could not get an answer. Please try again a little later.',off:'No internet connection. The helper needs a network.',lim:'Too many questions in a row. Please wait a few minutes.',
  s:['What is the Gospel of John about?','What does “the Word became flesh” mean?','How should I read the Sermon on the Mount?']},
 hy:{t:'Վահե',sub:'Նոր Կտակարանի ընթերցման օգնական',hi:'Բարև ձեզ։ Հարցրեք ընթերցածի մասին՝ դժվար հատված, համատեքստ, զուգահեռ վայրեր։',
  ph:'Ձեր հարցը…',send:'Ուղարկել',x:'Փակել',nw:'Սկսել նորից',
  note:'Սա արհեստական բանականություն է և կարող է սխալվել։ Ստուգեք տեքստի հետ։',
  err:'Չհաջողվեց պատասխան ստանալ։ Փորձեք մի փոքր ուշ։',off:'Ինտերնետ կապ չկա։ Օգնականին ցանց է պետք։',lim:'Շատ հարցեր հաջորդաբար։ Սպասեք մի քանի րոպե։',
  s:['Ինչի՞ մասին է Հովհաննեսի Ավետարանը','Ի՞նչ է նշանակում «Բանը մարմին եղավ»','Ինչպե՞ս հասկանալ Լեռան քարոզը']},
 de:{t:'Vahe',sub:'Lesehilfe zum Neuen Testament',hi:'Hallo! Frag nach dem, was du liest: eine schwierige Stelle, den Hintergrund, Parallelstellen.',
  ph:'Deine Frage…',send:'Senden',x:'Schließen',nw:'Neu beginnen',
  note:'Das ist eine KI und kann sich irren. Prüfe es am Text.',
  err:'Keine Antwort erhalten. Bitte versuche es etwas später noch einmal.',off:'Keine Internetverbindung. Die Lesehilfe braucht ein Netz.',lim:'Zu viele Fragen hintereinander. Bitte warte ein paar Minuten.',
  s:['Worum geht es im Johannesevangelium?','Was bedeutet „das Wort wurde Fleisch“?','Wie ist die Bergpredigt zu verstehen?']}
};
const L=()=>T[document.documentElement.lang]||T.ru;
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.4-4.8A8 8 0 1 1 21 12z"/><path d="M12 8v6M9.5 10.5h5"/></svg>';
const SEND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
const NEW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.5 5.8M4 19v-4.5h4.5"/></svg>';

const dm=document.getElementById('dm');
if(!API_URL||!dm)return;

let box=null,msgs,ta,go,busy=false,sid='',started=false;
const store={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del(k){try{sessionStorage.removeItem(k)}catch(e){}}};
const newSid=()=>{const a=new Uint8Array(12);(crypto.getRandomValues?crypto.getRandomValues(a):a.forEach((_,i)=>a[i]=Math.random()*256));return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('')};
sid=store.get('vcSid')||newSid();store.set('vcSid',sid);

const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* безопасная мини-разметка: сначала экранируем всё, потом только **жирный**, *курсив*, списки и абзацы */
function md(s){
 const inl=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[\s(«])\*(?!\s)(.+?)\*(?=[\s).,;:!?»]|$)/g,'$1<i>$2</i>');
 const out=[];let list=false;
 for(const raw of s.replace(/\r/g,'').split('\n')){
  const m=raw.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
  if(m){if(!list){out.push('<ul>');list=true}out.push('<li>'+inl(m[1])+'</li>');continue}
  if(list){out.push('</ul>');list=false}
  if(raw.trim())out.push('<p>'+inl(raw.trim().replace(/^#+\s*/,''))+'</p>');
 }
 if(list)out.push('</ul>');
 return out.join('');
}

function bubble(cls,html){const b=document.createElement('div');b.className='vc-b '+cls;b.innerHTML=html;msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight;return b}
function suggestions(){
 const w=document.createElement('div');w.className='vc-s';
 L().s.forEach(q=>{const b=document.createElement('button');b.type='button';b.textContent=q;b.onclick=()=>{w.remove();ask(q)};w.appendChild(b)});
 msgs.appendChild(w);
}
function greet(){msgs.innerHTML='';bubble('bot','<p>'+esc(L().hi)+'</p>');suggestions();started=true}

async function ask(q){
 q=(q||'').trim();if(!q||busy)return;
 const l=L();
 msgs.querySelectorAll('.vc-s').forEach(e=>e.remove());
 bubble('me','<p>'+esc(q)+'</p>');ta.value='';fit();
 if(!navigator.onLine){bubble('bot err','<p>'+esc(l.off)+'</p>');return}
 busy=true;go.disabled=true;
 const wait=bubble('bot','<span class="vc-dots"><i></i><i></i><i></i></span>');
 try{
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),60000);
  const r=await fetch(API_URL.replace(/\/$/,'')+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q.slice(0,1000),session_id:sid}),signal:ctl.signal});
  clearTimeout(to);
  if(r.status===429){wait.className='vc-b bot err';wait.innerHTML='<p>'+esc(l.lim)+'</p>'}
  else if(!r.ok)throw new Error(r.status);
  else{const j=await r.json();wait.innerHTML=md(String(j.reply||''))}
 }catch(e){wait.className='vc-b bot err';wait.innerHTML='<p>'+esc(l.err)+'</p>'}
 busy=false;go.disabled=!ta.value.trim();msgs.scrollTop=msgs.scrollHeight;
}
function fit(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,112)+'px';go.disabled=busy||!ta.value.trim()}

function fill(){
 const l=L();
 const b=document.getElementById('bChat');if(b){b.title=l.t;b.setAttribute('aria-label',l.t)}
 if(!box)return;
 box.querySelector('b').textContent=l.t;box.querySelector('small').textContent=l.sub;
 ta.placeholder=l.ph;go.setAttribute('aria-label',l.send);
 box.querySelector('.vc-x').setAttribute('aria-label',l.x);
 const n=box.querySelector('.vc-new');n.setAttribute('aria-label',l.nw);n.title=l.nw;
 box.querySelector('.vc-n').textContent=l.note;
 /* если разговор ещё не начат, обновляем приветствие на новом языке */
 if(!msgs.querySelector('.vc-b.me')&&!busy)greet();
}
function build(){
 if(box)return;
 box=document.createElement('section');box.id='vc';box.setAttribute('role','dialog');box.setAttribute('aria-label','Vahe');
 box.innerHTML='<div class="vc-h"><span class="vc-av">'+ICON+'</span><div><b></b><small></small></div><button class="vc-new" type="button">'+NEW+'</button><button class="vc-x" type="button">×</button></div>'+
  '<div class="vc-m" aria-live="polite"></div>'+
  '<form class="vc-f"><textarea rows="1" maxlength="1000"></textarea><button class="vc-go" type="submit" disabled>'+SEND+'</button></form><p class="vc-n"></p>';
 document.body.appendChild(box);
 msgs=box.querySelector('.vc-m');ta=box.querySelector('textarea');go=box.querySelector('.vc-go');
 box.querySelector('.vc-x').onclick=close;
 box.querySelector('.vc-new').onclick=()=>{if(busy)return;sid=newSid();store.set('vcSid',sid);greet()};
 box.querySelector('form').onsubmit=e=>{e.preventDefault();ask(ta.value)};
 ta.addEventListener('input',fit);
 ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask(ta.value)}});
 greet();fill();
}
function open(){build();fill();box.classList.add('open');setTimeout(()=>{try{ta.focus({preventScroll:true})}catch(e){}},300)}
function close(){if(box)box.classList.remove('open')}
const isOpen=()=>box&&box.classList.contains('open');

dm.insertAdjacentHTML('afterbegin','<button class="btn rnd" id="bChat" type="button">'+ICON+'</button>');
document.getElementById('bChat').onclick=()=>isOpen()?close():open();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen())close()});
new MutationObserver(fill).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
fill();
})();
