/* Two entry points; reuse the existing reader, audio and storage state. */
(()=>{
'use strict';
const q=s=>document.querySelector(s), R=document.documentElement;
const WORDS={
 ru:{script:'Армянское письмо',arm:'Армянские буквы',latin:'Латинские буквы',reading:'Чтение',settings:'Настройки',close:'Закрыть',book:'Книга',chapter:'Глава',search:'Поиск',commentary:'Толкования',compare:'Сравнение переводов',favorites:'Избранное',notes:'Заметки',newNote:'Новая заметка',prayers:'Молитвы',prayer:'Открыть молитву',about:'О проекте и предисловие',look:'Оформление',language:'Язык',atmosphere:'Атмосфера',sound:'Звук',effects:'Визуальные эффекты',stop:'Отключить все звуки',stopped:'Все звуки отключены',emptyFavorites:'Сохраните стих кнопкой ♥ рядом с текстом.',emptyNotes:'Здесь будут ваши заметки.',extras:'Приложение и связь',fullscreen:'Во весь экран',install:'Установить приложение',contact:'Связаться',soundHint:'Выберите звук, чтобы включить его. Повторное нажатие выключит фон.',read:'Перейти к тексту',themeNames:['Тёмно-синяя','Чёрная','Серая','Пергамент','Лес','Бордо','Сумерки','Лёд']},
 en:{script:'Armenian script',arm:'Armenian letters',latin:'Latin letters',reading:'Reading',settings:'Settings',close:'Close',book:'Book',chapter:'Chapter',search:'Search',commentary:'Commentary',compare:'Compare translations',favorites:'Favorites',notes:'Notes',newNote:'New note',prayers:'Prayers',prayer:'Open prayer',about:'About and preface',look:'Appearance',language:'Language',atmosphere:'Atmosphere',sound:'Sound',effects:'Visual effects',stop:'Stop all sounds',stopped:'All sounds stopped',emptyFavorites:'Save a verse with the ♥ button beside the text.',emptyNotes:'Your notes will appear here.',extras:'App and contact',fullscreen:'Full screen',install:'Install app',contact:'Contact',soundHint:'Select a sound to play it. Select it again to stop the background.',read:'Go to text',themeNames:['Dark blue','Black','Grey','Parchment','Forest','Bordeaux','Dusk','Ice']},
 hy:{script:'Հայերեն գրություն',arm:'Հայերեն տառեր',latin:'Լատինատառ',reading:'Ընթերցում',settings:'Կարգավորումներ',close:'Փակել',book:'Գիրք',chapter:'Գլուխ',search:'Որոնում',commentary:'Մեկնություններ',compare:'Թարգմանությունների համեմատում',favorites:'Ընտրյալներ',notes:'Նշումներ',newNote:'Նոր նշում',prayers:'Աղոթքներ',prayer:'Բացել աղոթքը',about:'Նախագծի մասին և նախաբան',look:'Ձևավորում',language:'Լեզու',atmosphere:'Մթնոլորտ',sound:'Ձայն',effects:'Տեսողական էֆեկտներ',stop:'Անջատել բոլոր ձայները',stopped:'Բոլոր ձայներն անջատված են',emptyFavorites:'Պահպանեք համարը՝ տեքստի կողքի ♥ կոճակով։',emptyNotes:'Այստեղ կլինեն ձեր նշումները։',extras:'Հավելված և կապ',fullscreen:'Լիաէկրան',install:'Տեղադրել հավելվածը',contact:'Կապ',soundHint:'Ընտրեք ձայնը՝ միացնելու համար։ Կրկին սեղմեք՝ ֆոնային ձայնն անջատելու համար։',read:'Անցնել տեքստին',themeNames:['Մուգ կապույտ','Սև','Մոխրագույն','Մագաղաթ','Անտառ','Բորդո','Մթնշաղ','Սառույց']},
 de:{script:'Armenische Schrift',arm:'Armenische Buchstaben',latin:'Lateinische Buchstaben',reading:'Lesen',settings:'Einstellungen',close:'Schließen',book:'Buch',chapter:'Kapitel',search:'Suche',commentary:'Kommentare',compare:'Übersetzungen vergleichen',favorites:'Favoriten',notes:'Notizen',newNote:'Neue Notiz',prayers:'Gebete',prayer:'Gebet öffnen',about:'Über das Projekt und Vorwort',look:'Darstellung',language:'Sprache',atmosphere:'Atmosphäre',sound:'Klang',effects:'Visuelle Effekte',stop:'Alle Klänge ausschalten',stopped:'Alle Klänge ausgeschaltet',emptyFavorites:'Speichere einen Vers mit ♥ neben dem Text.',emptyNotes:'Hier erscheinen deine Notizen.',extras:'App und Kontakt',fullscreen:'Vollbild',install:'App installieren',contact:'Kontakt',soundHint:'Wähle einen Klang zum Abspielen. Erneutes Antippen stoppt den Hintergrund.',read:'Zum Text',themeNames:['Dunkelblau','Schwarz','Grau','Pergament','Wald','Bordeaux','Dämmerung','Eis']}
};
const t=k=>(WORDS[R.lang]||WORDS.ru)[k];
const icon=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const bookIcon=icon('<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1z"/><path d="M12 5v15"/>');
const settingsIcon=icon('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>');
const button=(id,key)=>`<button id="${id}" type="button" class="btn" data-simple="${key}"></button>`;
const details=(id,key,body)=>`<details id="${id}" class="menu-group"><summary data-simple="${key}"></summary>${body}</details>`;
document.body.insertAdjacentHTML('beforeend',`
 <nav id="simpleNav" class="simple-nav" aria-label="${t('reading')} / ${t('settings')}">
  <button id="readingMenu" type="button" aria-haspopup="dialog" aria-controls="menuDialog" aria-expanded="false">${bookIcon}<span data-simple="reading"></span></button>
  <button id="settingsMenu" type="button" aria-haspopup="dialog" aria-controls="menuDialog" aria-expanded="false">${settingsIcon}<span data-simple="settings"></span></button>
 </nav>
 <dialog id="menuDialog" aria-labelledby="menuTitle">
  <header class="menu-header"><h2 id="menuTitle"></h2><button type="button" id="menuClose">×</button></header>
  <div class="menu-tabs" role="tablist">
   <button id="readingTab" type="button" role="tab" aria-controls="readingPane" data-simple="reading"></button>
   <button id="settingsTab" type="button" role="tab" aria-controls="settingsPane" data-simple="settings"></button>
  </div>
  <div class="menu-body">
   <section id="readingPane" role="tabpanel" aria-labelledby="readingTab">
    <div id="readerFields"></div>
    <div class="menu-actions">${button('menuRead','read')}${button('menuSearch','search')}${button('menuCommentary','commentary')}</div>
    ${details('comparisonGroup','compare','<div id="menuComparison"></div>')}
    ${details('favoritesGroup','favorites','<div id="favoriteContent"></div><p class="menu-hint" id="favoritesEmpty" data-simple="emptyFavorites"></p>')}
    ${details('notesGroup','notes','<div id="noteContent"></div><p class="menu-hint" id="notesEmpty" data-simple="emptyNotes"></p>')}
    ${details('prayersGroup','prayers','<div id="prayerContent"></div>')}
    ${details('aboutGroup','about','<div id="projectInfo"></div>')}
   </section>
   <section id="settingsPane" role="tabpanel" aria-labelledby="settingsTab" hidden>
    <label class="menu-field" for="menuLanguage"><span data-simple="language"></span><select id="menuLanguage"><option value="ru">Русский</option><option value="en">English</option><option value="hy">Հայերեն</option><option value="de">Deutsch</option></select></label>
    <div id="settingsContent"></div>
    ${details('extrasGroup','extras','<div class="menu-actions" id="menuExtras"></div>')}
   </section>
  </div>
 </dialog>`);
const dialog=q('#menuDialog');let pane='reading',opener=null;
function selectPane(value){
 pane=value;
 for(const key of ['reading','settings']){
  const selected=key===pane;
  q('#'+key+'Pane').hidden=!selected;
  q('#'+key+'Tab').setAttribute('aria-selected',selected);
  q('#'+key+'Tab').tabIndex=selected?0:-1;
  q('#'+key+'Menu').setAttribute('aria-expanded',dialog.open&&selected);
 }
 q('#menuTitle').textContent=t(pane);q('.menu-body').scrollTop=0;
}
function closeMenu(){if(dialog.open)dialog.close()}
function openMenu(value){
 NTReader.closeOverlays();
 if(dialog.open&&pane===value){closeMenu();return}
 opener=q('#'+value+'Menu');selectPane(value);
 if(!dialog.open){dialog.showModal();document.body.classList.add('menu-open')}
 q('#'+value+'Menu').setAttribute('aria-expanded','true');q('#menuClose').focus();
 refreshLists();
}
dialog.addEventListener('close',()=>{document.body.classList.remove('menu-open');['reading','settings'].forEach(k=>q('#'+k+'Menu').setAttribute('aria-expanded','false'));opener?.focus()});
dialog.addEventListener('click',e=>{if(e.target===dialog)closeMenu()});
q('#menuClose').onclick=closeMenu;
for(const key of ['reading','settings']){q('#'+key+'Menu').onclick=()=>openMenu(key);q('#'+key+'Tab').onclick=()=>selectPane(key)}
q('.menu-tabs').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
 selectPane(e.key==='Home'?'reading':e.key==='End'?'settings':pane==='reading'?'settings':'reading');q('#'+pane+'Tab').focus();
});
q('#menuRead').onclick=()=>{closeMenu();q('#brReader').scrollIntoView({block:'start',behavior:'smooth'})};
q('#menuSearch').onclick=()=>{closeMenu();NTReader.search()};
q('#menuCommentary').onclick=()=>{closeMenu();NTReader.commentary()};
q('#menuLanguage').onchange=e=>{
 const position=scrollY;state.set('lang',e.target.value);ui.i18n();scrollTo({top:position,behavior:'instant'});
 // The anchor can be inside the dialog; restore the document's reading position after relabeling.
 label();
};
function compareMarkup(){
 q('#menuComparison').innerHTML=NTReader.comparison();
 q('#menuComparison').querySelectorAll('[data-x]').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('on')));
}
q('#menuComparison').onclick=e=>{
 const b=e.target.closest('[data-x]');if(!b)return;
 NTReader.compare(b.dataset.x,b.dataset.v);compareMarkup();
 q('#menuComparison [data-x="'+b.dataset.x+'"]'+(b.dataset.v?'[data-v="'+b.dataset.v+'"]':'')).focus();
};
function refreshLists(){NTReader.favorites();q('#favoritesEmpty').hidden=!!q('#hlist .hv');q('#notesEmpty').hidden=!!state.d.notes.length}
q('#favoritesGroup').addEventListener('toggle',refreshLists);
q('#hlist').addEventListener('click',e=>{if(e.target.closest('.hv-go'))closeMenu();setTimeout(refreshLists,0)});
function move(id,to){const node=q('#'+id);if(node)q(to).append(node);return node}
move('hlist','#favoriteContent');move('bNew','#noteContent');move('notes','#noteContent');move('plist','#prayerContent');move('pr','#prayerContent');
q('#bNew').addEventListener('click',closeMenu);q('#pr').addEventListener('click',closeMenu);
new MutationObserver(refreshLists).observe(q('#notes'),{childList:true,subtree:true});
const scriptSwitch=q('#hyx');scriptSwitch.classList.remove('ui');q('#menuLanguage').closest('label').after(scriptSwitch);
const panel=move('panel','#settingsContent');panel.removeAttribute('data-ta');panel.querySelector('.tabs').remove();
const view=q('[data-s="view"]'),atm=q('[data-s="atm"]'),snd=q('[data-s="snd"]');
panel.insertAdjacentHTML('afterbegin',details('lookGroup','look','')+details('atmosphereGroup','atmosphere',''));
q('#lookGroup').open=false;q('#lookGroup').append(view);
q('#atmosphereGroup').insertAdjacentHTML('beforeend',`<h3 data-simple="sound"></h3><p class="menu-hint" data-simple="soundHint"></p><div class="stop-sounds">${button('stopSounds','stop')}<p id="soundStatus" role="status" aria-live="polite"></p></div>`);
q('#atmosphereGroup').append(snd);
q('#atmosphereGroup').insertAdjacentHTML('beforeend','<h3 data-simple="effects"></h3>');q('#atmosphereGroup').append(atm);move('cm','#atmosphereGroup');
q('#stopSounds').onclick=()=>{audio.stopAll();q('#soundStatus').textContent=t('stopped')};
snd.addEventListener('click',e=>{if(e.target.closest('#tracks,#xsnd,#play,#clk'))q('#soundStatus').textContent=''});
// Use the real one-shot buttons in Atmosphere instead of their duplicate shortcuts.
const shortcuts=q('#xsnd');shortcuts.querySelectorAll('button').forEach(b=>b.remove());
for(const id of ['wind','birds','bolt','lSea','lBell']){const b=move(id,'#xsnd');b.classList.remove('rnd');b.removeAttribute('style');b.dataset.sound=id;b.dataset.src='#'+id;b.dataset.k=({wind:'wind',birds:'birds',bolt:'thunder',lSea:'sea',lBell:'bell'})[id]}
for(const [id,key] of [['bFs','fullscreen'],['bInst','install'],['bContact','contact']]){
 const b=move(id,'#menuExtras');if(b){b.classList.remove('rnd');b.dataset.simple=key;b.addEventListener('click',closeMenu)}
}
// Theme swatches already have click handlers; make keyboard activation equivalent.
q('#menuDialog').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.sw[role="button"]')){e.preventDefault();e.target.click()}});
function relinkReader(){
 const fields=q('#readerFields');fields.replaceChildren();
 for(const [id,key] of [['brBook','book'],['brChapter','chapter']]){
  const select=q('#'+id),label=document.createElement('label');label.className='menu-field';label.htmlFor=id;
  const span=document.createElement('span');span.dataset.simple=key;label.append(span,select);fields.append(label);
 }
 const info=q('#projectInfo');info.replaceChildren();
 for(const selector of ['.br-preface','.br-guide','.br-sources']){
  const node=q('#brRoot>'+selector);if(node){if(selector==='.br-preface')node.classList.add('open');info.append(node)}
 }
 info.insertAdjacentHTML('beforeend','<div class="project-history">'+NTReader.history()+'</div>');
 compareMarkup();label();
}
// Language and search navigation rebuild the reader; remove old moved nodes before new IDs are created.
document.addEventListener('nt:before-mount',()=>{q('#readerFields').replaceChildren();q('#projectInfo').replaceChildren()});
document.addEventListener('nt:mount',relinkReader);
function label(){
 document.querySelectorAll('[data-simple]').forEach(e=>e.textContent=t(e.dataset.simple));
 q('#menuTitle').textContent=t(pane);q('#menuClose').setAttribute('aria-label',t('close'));
 q('#simpleNav').setAttribute('aria-label',t('reading')+' / '+t('settings'));
 q('#menuLanguage').value=state.d.lang;
 scriptSwitch.ariaLabel=t('script');scriptSwitch.querySelector('[data-m="arm"]').textContent=t('arm');scriptSwitch.querySelector('[data-m="lat"]').textContent=t('latin');
 for(const [id,key] of [['bNew','newNote'],['pr','prayer']]){const b=q('#'+id);b.textContent=t(key);b.setAttribute('aria-label',t(key))}
 for(const [id,key] of [['wind','wind'],['birds','birds'],['bolt','thunder'],['lSea','sea'],['lBell','bell']]){
  const b=q('#'+id);b.textContent=xl(key);b.title=b.ariaLabel=xl(key);
 }
 q('#themes').querySelectorAll('.sw').forEach((b,i)=>{b.title=t('themeNames')[i];b.ariaLabel=t('themeNames')[i]});
 q('#brSearchClose').ariaLabel=q('#brComClose').ariaLabel=t('close');
 for(const [id,key] of [['fs','size'],['vol','vol'],['ls','lsize']])q('#'+id).ariaLabel=tr(key);
 q('#brSearchInput').ariaLabel=t('search');q('#brComFrame').title=t('commentary');
 q('#brReader').querySelectorAll('.br-like').forEach(b=>b.ariaLabel=t('favorites'));
 refreshLists();
}
document.addEventListener('fullscreenchange',label);document.addEventListener('webkitfullscreenchange',label);
new MutationObserver(label).observe(R,{attributes:true,attributeFilter:['lang']});
relinkReader();
// Favorites are rendered after async chapter loads, so label their new buttons too.
new MutationObserver(()=>q('#brReader').querySelectorAll('.br-like').forEach(b=>b.ariaLabel=t('favorites'))).observe(q('#bookBody'),{childList:true,subtree:true});
})();
