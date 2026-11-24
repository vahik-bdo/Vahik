/* Финальная полировка интерфейса: без конфликтов с существующими обработчиками.
   1) браузерные подсказки (title) убираются, доступное имя остаётся в aria-label;
   2) боковые панели закрываются по клику вне их, не мешая друг другу и толкованиям;
   3) несохранённая заметка не теряется от случайного Escape / клика по фону. */
(function(){'use strict';
var D=document,PANELS=['panel','npanel','ppanel','hpanel','rpanel'];

/* ---------- 1. title → aria-label ---------- */
function strip(el){
  if(!el||el.nodeType!==1||!el.hasAttribute('title'))return;
  var t=el.getAttribute('title');
  if(t&&!el.hasAttribute('aria-label')&&!el.hasAttribute('aria-labelledby'))el.setAttribute('aria-label',t);
  el.removeAttribute('title');
}
function sweep(root){
  if(!root||root.nodeType!==1)return;
  strip(root);
  var n=root.querySelectorAll?root.querySelectorAll('[title]'):[];
  for(var i=0;i<n.length;i++)strip(n[i]);
}
sweep(D.documentElement);
new MutationObserver(function(ms){
  for(var i=0;i<ms.length;i++){var m=ms[i];
    if(m.type==='attributes')strip(m.target);
    else for(var j=0;j<m.addedNodes.length;j++)sweep(m.addedNodes[j]);
  }
}).observe(D.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['title']});

/* ---------- 2. единая логика панелей ---------- */
function openPanels(){return PANELS.map(function(id){return D.getElementById(id)}).filter(function(p){return p&&p.classList.contains('open')})}
function closePanels(){openPanels().forEach(function(p){p.classList.remove('open')})}
D.addEventListener('click',function(e){
  var t=e.target;
  if(!t||!t.closest||!t.isConnected)return;               /* элемент мог быть перерисован обработчиком — не считаем это кликом «снаружи» */
  if(!openPanels().length)return;
  if(t.closest('#panel,#npanel,#ppanel,#hpanel,#rpanel,#dock,#fold,#bar,#modal,#lm,#brCommentary,#brSearch,#brScrim,#brInfo,[role="dialog"],[aria-modal="true"],.tour,#tour,.br-pop,#brPop'))return;
  closePanels();
});
/* толкования/поиск и боковая панель не бывают открыты одновременно */
function sync(){
  var c=D.getElementById('brCommentary'),s=D.getElementById('brSearch');
  var ov=(c&&c.classList.contains('open'))||(s&&s.classList.contains('open'));
  /* пока открыто окно поверх страницы, фоновые эффекты ставятся на паузу (меньше нагрузка, стабильные 60 fps) */
  D.documentElement.classList.toggle('ov-open',!!(ov||openPanels().length));
  if(ov){
    closePanels();
    var f=D.getElementById('fold');if(f&&f.classList.contains('open')){f.classList.remove('open');var b=D.getElementById('fb');if(b)b.setAttribute('aria-expanded','false')}
  }
}
D.addEventListener('click',function(){setTimeout(sync,40)},true);
D.addEventListener('keydown',function(){setTimeout(sync,40)},true);

/* ---------- 3. защита несохранённой заметки ---------- */
var md=D.getElementById('modal'),mt=D.getElementById('mt'),base='';
function dirty(){return !!(md&&md.classList.contains('open')&&mt&&mt.value.trim()&&mt.value.trim()!==base.trim())}
function nudge(){var b=D.getElementById('ms');if(!b)return;b.classList.remove('nudge');void b.offsetWidth;b.classList.add('nudge');try{mt.focus()}catch(x){}}
if(md&&mt){
  new MutationObserver(function(){if(md.classList.contains('open'))setTimeout(function(){base=mt.value},0)}).observe(md,{attributes:true,attributeFilter:['class']});
  D.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&dirty()){e.stopImmediatePropagation();e.preventDefault();nudge()}
  },true);
  md.addEventListener('click',function(e){
    if(e.target===md&&dirty()){e.stopImmediatePropagation();nudge()}
  },true);
}
})();
