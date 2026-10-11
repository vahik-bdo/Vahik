(()=>{
const R=document.documentElement;
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return v===undefined?'1':0}};
const NAMES={ru:'Русский',en:'English',hy:'Հայերեն',de:'Deutsch'};
function picker(){
 if(LS('langChosen'))return;
 const m=document.createElement('div');m.id='lpk';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="lpc"><div class="lpt">Выберите язык<small>Choose your language · Ընտրեք լեզուն · Sprache wählen</small></div><div class="lpl"></div></div>';
 const box=m.querySelector('.lpl');
 Object.keys(NAMES).forEach(l=>{const b=document.createElement('button');b.type='button';b.textContent=NAMES[l];if(R.lang===l)b.className='cur';
  const lit=(e)=>{const r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px');b.classList.add('lit')},unlit=()=>b.classList.remove('lit');
  b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')lit(e)});
  b.addEventListener('pointermove',e=>{if(b.classList.contains('lit'))lit(e)});
  b.addEventListener('pointerdown',lit);
  b.addEventListener('pointerleave',unlit);b.addEventListener('pointercancel',unlit);
  b.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')unlit()});
  b.addEventListener('contextmenu',e=>e.preventDefault());
  b.onclick=()=>{if(m.dataset.busy)return;m.dataset.busy='1';box.querySelectorAll('button').forEach(x=>{if(x!==b)x.classList.add('dim')});b.classList.add('lit','pick');const t=document.querySelector('#lm button[data-l="'+l+'"]');setTimeout(()=>{if(t)t.click();LS('langChosen','1');window.dispatchEvent(new Event('langchosen'));m.classList.remove('on');setTimeout(()=>m.remove(),650)},520)};box.appendChild(b)});
 document.body.appendChild(m);requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('on')));setTimeout(()=>m.classList.add('ready'),1100);
}
const TT={
 ru:{s:[['Язык','Здесь можно в любой момент сменить язык сайта.'],['Звуки природы','Нажмите на лампочку: ветер, птицы и гроза создадут атмосферу для чтения.'],['История','Эта вкладка слева рассказывает, как был написан Новый Завет и как он дошёл до нас.'],['Избранные стихи','Дважды коснитесь стиха, чтобы поставить сердце. Все сохранённые стихи собраны в меню ⋯ под значком ♥.'],['Меню','Эта кнопка открывает заметки, молитвы и настройки.'],['Тема и шрифт','В «Настройках» меняются цветовая тема, шрифт и размер текста.']],b:['Далее','Открыть настройки','Пропустить','Позже']},
 en:{s:[['Language','You can change the site language here at any time.'],['Sounds of nature','Tap the lamp: wind, birds and thunder set the mood for reading.'],['History','This tab on the left tells how the New Testament was written and how it reached us.'],['Favorite verses','Double-tap a verse to give it a heart. All saved verses are in the ⋯ menu under the ♥ icon.'],['Menu','This button opens your notes, prayers and settings.'],['Theme and font','In Settings you can change the color theme, the font and the text size.']],b:['Next','Open settings','Skip','Later']},
 hy:{s:[['Լեզու','Այստեղ կարող եք ցանկացած պահի փոխել կայքի լեզուն։'],['Բնության ձայներ','Սեղմեք լամպի վրա՝ քամի, թռչուններ և ամպրոպ՝ ընթերցանության մթնոլորտի համար։'],['Պատմություն','Ձախ կողմի այս ներդիրը պատմում է, թե ինչպես է գրվել Նոր Կտակարանը և ինչպես է հասել մեզ։'],['Ընտրյալ համարներ','Կրկնակի հպեք համարին՝ սիրտ դնելու համար։ Բոլոր պահված համարները ⋯ ընտրացանկում են՝ ♥ պատկերակի տակ։'],['Ընտրացանկ','Այս կոճակը բացում է գրառումները, աղոթքները և կարգավորումները։'],['Թեմա և տառատեսակ','Կարգավորումներում փոխվում են գունային թեման, տառատեսակը և տեքստի չափը։']],b:['Հաջորդը','Բացել կարգավորումները','Բաց թողնել','Հետո']},
 de:{s:[['Sprache','Hier können Sie die Sprache der Seite jederzeit ändern.'],['Naturklänge','Tippen Sie auf die Glühbirne: Wind, Vögel und Gewitter schaffen Atmosphäre zum Lesen.'],['Geschichte','Dieser Tab links erzählt, wie das Neue Testament entstand und zu uns kam.'],['Lieblingsverse','Tippen Sie doppelt auf einen Vers, um ihm ein Herz zu geben. Alle gespeicherten Verse finden Sie im ⋯-Menü unter dem ♥-Symbol.'],['Menü','Hier öffnen Sie Notizen, Gebete und Einstellungen.'],['Thema und Schrift','In den Einstellungen ändern Sie Farbthema, Schriftart und Textgröße.']],b:['Weiter','Einstellungen öffnen','Überspringen','Später']}
};
const SELS=['#lb','#bulb','#brRail .br-rb[data-a="hist"]','#brReader .br-verse','#dt','#bSet'];
let started=0;
window.__tour=function(){if(started||LS('tourDone'))return;started=1;setTimeout(run,800)};
function run(){
 const lg=TT[R.lang]||TT.en,B=document.body;let cur=0,opened=false,railOpen=false;
 B.classList.add('tour-on');
 const q=document.createElement('div');q.id='tq';const ring=document.createElement('div');ring.id='tr';const bub=document.createElement('div');bub.id='tb';
 bub.innerHTML='<div class="tbn"></div><h4></h4><p></p><div class="tbf"><button class="tbs" type="button"></button><button class="tbx" type="button"></button></div>';
 B.append(q,ring,bub);
 const dockEl=()=>document.getElementById('dock');
 const railSet=on=>{const rl=document.getElementById('brRail');if(!rl)return;if(on&&!rl.classList.contains('open')){rl.classList.add('open');railOpen=true}else if(!on&&railOpen){rl.classList.remove('open');railOpen=false}};
 const nodes=[q,ring,bub];
 function finish(openSettings){
  LS('tourDone','1');railSet(false);ring.classList.remove('on');bub.classList.remove('on');
  const d=dockEl();
  if(openSettings){const s=document.getElementById('bSet');if(s)s.click()}
  else if(opened&&d.classList.contains('open'))document.getElementById('dt').click();
  B.classList.remove('tour-on');window.removeEventListener('resize',re);
  setTimeout(()=>nodes.forEach(n=>n.remove()),600);
 }
 function place(el){
  const r=el.getBoundingClientRect(),pd=8,w=Math.min(300,innerWidth-24);
  ring.style.left=(r.left-pd)+'px';ring.style.top=(r.top-pd)+'px';ring.style.width=(r.width+pd*2)+'px';ring.style.height=(r.height+pd*2)+'px';
  bub.style.width=w+'px';const bh=bub.offsetHeight;
  let t=r.bottom+pd+14;if(t+bh>innerHeight-12)t=r.top-pd-14-bh;if(t<12)t=12;
  bub.style.top=t+'px';bub.style.left=Math.min(innerWidth-w-12,Math.max(12,r.left+r.width/2-w/2))+'px';
 }
 function re(){const el=document.querySelector(SELS[cur]);if(el&&el.getBoundingClientRect().width)place(el)}
 window.addEventListener('resize',re);
 function step(n){
  cur=n;
  if(n!==2)railSet(false);
  if(n===5&&!dockEl().classList.contains('open')){document.getElementById('dt').click();opened=true}
  setTimeout(()=>{
   if(n===2)railSet(true);
   const el=document.querySelector(SELS[n]);
   if(!el||!el.getBoundingClientRect().width){if(n<5)return step(n+1);return finish(false)}
   const last=n===5;
   bub.querySelector('.tbn').textContent=(n+1)+' / 6';
   bub.querySelector('h4').textContent=lg.s[n][0];bub.querySelector('p').textContent=lg.s[n][1];
   const px=bub.querySelector('.tbx'),sk=bub.querySelector('.tbs');
   px.textContent=last?lg.b[1]:lg.b[0];sk.textContent=last?lg.b[3]:lg.b[2];
   px.onclick=()=>last?finish(true):step(n+1);sk.onclick=()=>finish(false);
   place(el);ring.classList.add('on');bub.classList.add('on');
  },n===5?550:n===2?350:80);
 }
 step(0);
}
setTimeout(picker,250);
})();
