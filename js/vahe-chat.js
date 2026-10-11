/* Помощник «Вахе»: заметная кнопка и окно чата. Ответы приходят с сервера агента (папка vahe-backend). */
(()=>{
/* Адрес сервера агента (Cloud Run). Если оставить пустым, кнопка чата не появится. */
const API_URL='https://vahe-agent-482224308223.us-central1.run.app';

const T={
 ru:{t:'Vahe',sub:'Помощник по тексту Нового Завета',hi:'Здравствуйте! Спросите о том, что читаете: трудное место, смысл слов, события и люди.',tip:'Есть вопрос по тексту?',
  ph:'Ваш вопрос…',send:'Отправить',x:'Закрыть',nw:'Начать заново',open:'Спросить Vahe',
  note:'Это ИИ, он может ошибаться. Сверяйтесь с текстом.',
  err:'Не удалось получить ответ. Попробуйте ещё раз чуть позже.',off:'Нет подключения к интернету. Помощнику нужна сеть.',lim:'Слишком много вопросов подряд. Подождите несколько минут.',lng:'Разговор стал длинным. Нажмите круговую стрелку вверху и начните заново.',day:'На сегодня вопросов больше нет. Загляните завтра.',
  s:['О чём Евангелие от Иоанна?','Что значит «Слово стало плотию»?','Как понимать Нагорную проповедь?']},
 en:{t:'Vahe',sub:'Helper for reading the New Testament',hi:'Hello! Ask about what you are reading: a hard passage, the meaning of words, events and people.',tip:'A question about the text?',
  ph:'Your question…',send:'Send',x:'Close',nw:'Start over',open:'Ask Vahe',
  note:'This is an AI and can make mistakes. Check it against the text.',
  err:'Could not get an answer. Please try again a little later.',off:'No internet connection. The helper needs a network.',lim:'Too many questions in a row. Please wait a few minutes.',lng:'This conversation has grown long. Tap the circular arrow at the top to start over.',day:'No more questions for today. Please come back tomorrow.',
  s:['What is the Gospel of John about?','What does “the Word became flesh” mean?','How should I read the Sermon on the Mount?']},
 hy:{t:'Vahe',sub:'Նոր Կտակարանի ընթերցման օգնական',hi:'Բարև ձեզ։ Հարցրեք ընթերցածի մասին՝ դժվար հատված, բառերի իմաստ, դեպքեր և մարդիկ։',tip:'Հարց ունե՞ք տեքստի մասին',
  ph:'Ձեր հարցը…',send:'Ուղարկել',x:'Փակել',nw:'Սկսել նորից',open:'Հարցնել Vahe-ին',
  note:'Սա արհեստական բանականություն է և կարող է սխալվել։ Ստուգեք տեքստի հետ։',
  err:'Չհաջողվեց պատասխան ստանալ։ Փորձեք մի փոքր ուշ։',off:'Ինտերնետ կապ չկա։ Օգնականին ցանց է պետք։',lim:'Շատ հարցեր հաջորդաբար։ Սպասեք մի քանի րոպե։',lng:'Զրույցը երկարել է։ Սեղմեք վերևի շրջանաձև սլաքը՝ նորից սկսելու համար։',day:'Այսօրվա համար հարցերը սպառվել են։ Այցելեք վաղը։',
  s:['Ինչի՞ մասին է Հովհաննեսի Ավետարանը','Ի՞նչ է նշանակում «Բանը մարմին եղավ»','Ինչպե՞ս հասկանալ Լեռան քարոզը']},
 de:{t:'Vahe',sub:'Lesehilfe zum Neuen Testament',hi:'Hallo! Frag nach dem, was du liest: eine schwierige Stelle, die Bedeutung von Worten, Ereignisse und Personen.',tip:'Frage zum Text?',
  ph:'Deine Frage…',send:'Senden',x:'Schließen',nw:'Neu beginnen',open:'Vahe fragen',
  note:'Das ist eine KI und kann sich irren. Prüfe es am Text.',
  err:'Keine Antwort erhalten. Bitte versuche es etwas später noch einmal.',off:'Keine Internetverbindung. Die Lesehilfe braucht ein Netz.',lim:'Zu viele Fragen hintereinander. Bitte warte ein paar Minuten.',lng:'Das Gespräch ist lang geworden. Tippe oben auf den Kreispfeil, um neu zu beginnen.',day:'Für heute sind keine Fragen mehr möglich. Komm morgen wieder.',
  s:['Worum geht es im Johannesevangelium?','Was bedeutet „das Wort wurde Fleisch“?','Wie ist die Bergpredigt zu verstehen?']}
};
const L=()=>T[document.documentElement.lang]||T.ru;
const SEND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
const NEW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.5 5.8M4 19v-4.5h4.5"/></svg>';
const CROSS='<i class="vc-cross" aria-hidden="true"></i>';
const BUBBLE='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="vcg1" x1="12" y1="8" x2="86" y2="92" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1f7bff"/><stop offset=".55" stop-color="#3d98ff"/><stop offset="1" stop-color="#7cc4ff"/></linearGradient><radialGradient id="vcg2" cx="30" cy="22" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><path class="vc-bb" d="M50 8C75 8 91 20 91 44c0 14-4 23-11 28v20L50 80C24 80 9 66 9 44 9 20 25 8 50 8Z" fill="url(#vcg1)"/><path d="M50 8C75 8 91 20 91 44c0 14-4 23-11 28v20L50 80C24 80 9 66 9 44 9 20 25 8 50 8Z" fill="url(#vcg2)"/><rect class="vc-ey" x="29" y="32" width="10" height="23" rx="5" fill="#fff"/><rect class="vc-ey" x="61" y="32" width="10" height="23" rx="5" fill="#fff"/></svg>';
const MQ='(max-width:600px),(pointer:coarse) and (max-height:520px)';
const mob=()=>matchMedia(MQ).matches;
const canType=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;

if(!API_URL||!document.body)return;

let box=null,msgs,ta,go,busy=false,sid='';
const ss={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const newSid=()=>{const a=new Uint8Array(12);(crypto.getRandomValues?crypto.getRandomValues(a):a.forEach((_,i)=>a[i]=Math.random()*256));return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('')};
sid=ss.get('vcSid')||newSid();ss.set('vcSid',sid);

const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ссылки на места Писания (Ин 3:16, 1 Кор 13:4–7, John 3:16) подсвечиваем */
const REF=/(^|[\s(«>])((?:[1-3]\s?)?\p{Lu}\p{L}{1,5}\.?\s\d{1,3}:\d{1,3}(?:[–-]\d{1,3}(?::\d{1,3})?)?)/gu;
/* безопасная мини-разметка: сначала экранируем всё, потом только **жирный**, *курсив*, списки и абзацы */
function md(s){
 const inl=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[\s(«])\*(?!\s)(.+?)\*(?=[\s).,;:!?»]|$)/g,'$1<i>$2</i>').replace(REF,'$1<span class="vc-ref">$2</span>');
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
function greet(){
 msgs.innerHTML='';
 const h=document.createElement('div');h.className='vc-hello';
 h.innerHTML='<div class="vc-hc">'+CROSS+'</div><p></p>';
 h.querySelector('p').textContent=L().hi;
 msgs.appendChild(h);
}

async function ask(q){
 q=(q||'').trim();if(!q||busy)return;
 const l=L();
 msgs.querySelectorAll('.vc-hello').forEach(e=>e.remove());
 bubble('me','<p>'+esc(q)+'</p>');ta.value='';fit();if(!canType())ta.blur();
 if(!navigator.onLine){bubble('bot err','<p>'+esc(l.off)+'</p>');return}
 busy=true;go.disabled=true;
 const wait=bubble('bot','<span class="vc-dots"><i></i><i></i><i></i></span>');
 try{
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),60000);
  const r=await fetch(API_URL.replace(/\/$/,'')+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q.slice(0,1000),session_id:sid}),signal:ctl.signal});
  clearTimeout(to);
  if(r.status===429){let c='';try{c=(await r.json()).error}catch(e){}wait.className='vc-b bot err';wait.innerHTML='<p>'+esc(c==='session_limit'?l.lng:c==='daily_limit'?l.day:l.lim)+'</p>'}
  else if(!r.ok)throw new Error(r.status);
  else{const j=await r.json();wait.innerHTML=md(String(j.reply||''));reveal(wait)}
 }catch(e){wait.className='vc-b bot err';wait.innerHTML='<p>'+esc(l.err)+'</p>'}
 busy=false;go.disabled=!ta.value.trim();
 /* длинный ответ показываем с начала, чтобы слова проявлялись в порядке чтения */
 if(!wait.classList.contains('err')&&wait.offsetHeight>msgs.clientHeight-24)msgs.scrollTop=Math.max(0,wait.offsetTop-12);else msgs.scrollTop=msgs.scrollHeight;
}

/* плавное проявление ответа по словам */
function reveal(el){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
 while(w.nextNode())nodes.push(w.currentNode);
 let n=0;nodes.forEach(t=>{n+=(t.nodeValue.match(/\S+/g)||[]).length});
 const step=Math.max(12,Math.min(45,3200/Math.max(n,1)));let i=0;
 nodes.forEach(t=>{
  const f=document.createDocumentFragment();
  t.nodeValue.split(/(\s+)/).forEach(p=>{
   if(!p)return;
   if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}
   const s=document.createElement('span');s.className='vc-wd';s.style.animationDelay=(i++*step)+'ms';s.textContent=p;f.appendChild(s);
  });
  t.parentNode.replaceChild(f,t);
 });
}
function fit(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,112)+'px';go.disabled=busy||!ta.value.trim()}

const fab=document.createElement('button');fab.type='button';fab.className='vc-fab';fab.id='vcFab';fab.innerHTML=BUBBLE;
const tip=document.createElement('div');tip.className='vc-tip';tip.id='vcTip';
document.body.append(tip,fab);

function fill(){
 const l=L();
 fab.title=l.open;fab.setAttribute('aria-label',l.open);tip.textContent=l.tip;
 if(!box)return;
 box.querySelector('b').textContent=l.t;box.querySelector('small').textContent=l.sub;
 ta.placeholder=l.ph;go.setAttribute('aria-label',l.send);
 box.querySelector('.vc-x').setAttribute('aria-label',l.x);
 const n=box.querySelector('.vc-new');n.setAttribute('aria-label',l.nw);n.title=l.nw;
 box.querySelector('.vc-n').textContent=l.note;
 /* пока разговор не начат, обновляем приветствие на выбранном языке */
 if(!msgs.querySelector('.vc-b')&&!busy)greet();
}
function build(){
 if(box)return;
 box=document.createElement('section');box.id='vc';box.setAttribute('role','dialog');box.setAttribute('aria-label','Vahe');
 box.innerHTML='<div class="vc-h"><span class="vc-av">'+CROSS+'</span><div><b></b><small></small></div><button class="vc-new" type="button">'+NEW+'</button><button class="vc-x" type="button">×</button></div>'+
  '<div class="vc-w"><div class="vc-m" aria-live="polite"></div></div>'+
  '<form class="vc-f"><textarea rows="1" maxlength="1000"></textarea><button class="vc-go" type="submit" disabled>'+SEND+'</button></form><p class="vc-n"></p>';
 document.body.appendChild(box);
 msgs=box.querySelector('.vc-m');ta=box.querySelector('textarea');go=box.querySelector('.vc-go');
 box.querySelector('.vc-x').onclick=close;
 box.querySelector('.vc-new').onclick=()=>{if(busy)return;sid=newSid();ss.set('vcSid',sid);greet()};
 box.querySelector('form').onsubmit=e=>{e.preventDefault();ask(ta.value)};
 ta.addEventListener('input',fit);
 ta.addEventListener('focus',()=>box.classList.add('kb'));ta.addEventListener('blur',()=>box.classList.remove('kb'));
 ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask(ta.value)}});
 greet();fill();
}
const isOpen=()=>box&&box.classList.contains('open');
const vv=window.visualViewport;
function vfit(){
 if(!box)return;
 if(isOpen()&&mob()&&vv){box.style.setProperty('--vch',vv.height+'px');box.style.setProperty('--vct',vv.offsetTop+'px');if(document.activeElement===ta)msgs.scrollTop=msgs.scrollHeight}
 else{box.style.removeProperty('--vch');box.style.removeProperty('--vct')}
}
if(vv){vv.addEventListener('resize',vfit);vv.addEventListener('scroll',vfit)}
addEventListener('orientationchange',()=>setTimeout(vfit,250));
/* клавиатура открывается только когда человек сам нажал на поле ввода (на телефоне автофокуса нет) */
function open(){build();fill();tip.classList.remove('show');fab.classList.add('hide');box.classList.add('open');
 if(mob())document.documentElement.classList.add('vc-lock');vfit();
 if(canType())setTimeout(()=>{try{ta.focus({preventScroll:true})}catch(e){}},350)}
function close(){if(box){box.classList.remove('open','kb');if(document.activeElement===ta)ta.blur()}fab.classList.remove('hide');document.documentElement.classList.remove('vc-lock');vfit()}

fab.onclick=open;tip.onclick=open;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen())close()});
new MutationObserver(fill).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
fill();

/* всплывающая подсказка: первые три визита, один раз за сессию */
try{
 const n=+ls.get('vcTipN')||0;
 if(n<3&&!ss.get('vcTipS')){
  ss.set('vcTipS','1');ls.set('vcTipN',String(n+1));
  setTimeout(()=>{if(!isOpen())tip.classList.add('show')},4500);
  setTimeout(()=>tip.classList.remove('show'),14000);
 }
}catch(e){}
})();
