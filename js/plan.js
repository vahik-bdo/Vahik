/* План чтения: кнопка в «…» справа внизу → панель #rpanel.
   Хранится только на устройстве (localStorage 'theo-plan-v1'): {id, start, done, log:[даты отметок]}.
   Прогресс идёт по порядку дней плана, а не по календарю: пропустил день — ничего не «горит», читаешь следующую порцию.
   Переход к главе — через window.__planAPI из js/reader.js. */
(()=>{
const K='theo-plan-v1',$=s=>document.querySelector(s);
const PLANS=[
 {id:'nt90',g:['gospels','acts','catholic','paul','rev'],d:90},
 {id:'nt180',g:['gospels','acts','catholic','paul','rev'],d:180},
 {id:'gos30',g:['gospels'],d:30},
 {id:'act60',g:['acts','catholic','paul'],d:60}
];
const L={
 ru:{title:'План чтения',pick:'Выберите план',hint:'Читайте понемногу каждый день. Отмечайте прочитанное — серия дней растёт. Пропустили день — не страшно, план просто ждёт вас.',today:'Сегодня',next:'Дальше',dayOf:'День {a} из {b}',read:'Читать',done:'Прочитано',doneToday:'На сегодня всё прочитано',nextRead:'Следующее чтение',streak:'{n} дн. подряд',undo:'Отменить отметку',change:'Сменить план',confirm:'Сменить план? Прогресс будет сброшен.',fin:'План завершён. Слава Богу!',again:'Начать заново',desc:'{c} глав · ≈{p} в день',days:'дн.',names:{nt90:'Новый Завет за 90 дней',nt180:'Новый Завет за 180 дней',gos30:'Евангелия за 30 дней',act60:'Деяния и Послания за 60 дней'}},
 en:{title:'Reading plan',pick:'Choose a plan',hint:'Read a little every day. Tick off what you read and your streak grows. Missed a day? No worries, the plan simply waits for you.',today:'Today',next:'Up next',dayOf:'Day {a} of {b}',read:'Read',done:'Done reading',doneToday:'All read for today',nextRead:'Next reading',streak:'{n}-day streak',undo:'Undo last tick',change:'Change plan',confirm:'Change plan? Your progress will be reset.',fin:'Plan complete. Glory to God!',again:'Start over',desc:'{c} chapters · ≈{p} a day',days:'days',names:{nt90:'New Testament in 90 days',nt180:'New Testament in 180 days',gos30:'The Gospels in 30 days',act60:'Acts and Epistles in 60 days'}},
 hy:{title:'Ընթերցանության պլան',pick:'Ընտրեք պլան',hint:'Կարդացեք քիչ-քիչ ամեն օր։ Նշեք կարդացածը՝ օրերի շարքը կաճի։ Օր բաց թողնելը վտանգավոր չէ՝ պլանը սպասում է ձեզ։',today:'Այսօր',next:'Հաջորդը',dayOf:'Օր {a}՝ {b}-ից',read:'Կարդալ',done:'Կարդացել եմ',doneToday:'Այսօրվա ընթերցումն ավարտված է',nextRead:'Հաջորդ ընթերցումը',streak:'{n} օր անընդմեջ',undo:'Չեղարկել նշումը',change:'Փոխել պլանը',confirm:'Փոխե՞լ պլանը։ Առաջընթացը կզրոյացվի։',fin:'Պլանն ավարտված է։ Փառք Աստծո։',again:'Սկսել նորից',desc:'{c} գլուխ · ≈{p} օրական',days:'օր',names:{nt90:'Նոր Կտակարանը 90 օրում',nt180:'Նոր Կտակարանը 180 օրում',gos30:'Ավետարանները 30 օրում',act60:'Գործք և Թղթեր՝ 60 օրում'}},
 de:{title:'Leseplan',pick:'Plan wählen',hint:'Lies jeden Tag ein wenig. Hake Gelesenes ab – die Serie wächst. Einen Tag verpasst? Kein Problem, der Plan wartet auf dich.',today:'Heute',next:'Als Nächstes',dayOf:'Tag {a} von {b}',read:'Lesen',done:'Gelesen',doneToday:'Für heute ist alles gelesen',nextRead:'Nächste Lesung',streak:'{n} Tage in Folge',undo:'Haken zurücknehmen',change:'Plan wechseln',confirm:'Plan wechseln? Der Fortschritt wird zurückgesetzt.',fin:'Plan abgeschlossen. Gott sei Dank!',again:'Neu beginnen',desc:'{c} Kapitel · ≈{p} pro Tag',days:'Tage',names:{nt90:'Neues Testament in 90 Tagen',nt180:'Neues Testament in 180 Tagen',gos30:'Die Evangelien in 30 Tagen',act60:'Apostelgeschichte und Briefe in 60 Tagen'}}
};
const lg=()=>L[document.documentElement.lang]?document.documentElement.lang:'en';
const T=(k,v)=>{let s=L[lg()][k];if(s==null)s=L.en[k];if(v)for(const x in v)s=s.replace('{'+x+'}',v[x]);return s};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ico=d=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const I={cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2.2 2.2L15.5 13"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',book:'<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 2.5 1.8 2.5C11 8.5 11.5 5.5 12 3z"/>'};

let S=null;try{S=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}
if(S&&(!PLANS.some(p=>p.id===S.id)||!Array.isArray(S.log)||!(S.done>=0)))S=null;
const save=()=>{try{S?localStorage.setItem(K,JSON.stringify(S)):localStorage.removeItem(K)}catch(e){}};
const API=()=>window.__planAPI;
const key=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>key(new Date());
const plan=id=>PLANS.find(p=>p.id===id);

const cache={};
function flat(p){if(cache[p.id])return cache[p.id];const a=API();if(!a)return [];const out=[];a.books().forEach(b=>{if(p.g.includes(b.group))for(let c=1;c<=b.n;c++)out.push([b.k,c])});return cache[p.id]=out}
function dayGroups(p,i){const f=flat(p),n=f.length,s=f.slice(Math.floor(i*n/p.d),Math.floor((i+1)*n/p.d)),g=[];
 s.forEach(([b,c])=>{const l=g[g.length-1];if(l&&l.b===b&&l.to===c-1)l.to=c;else g.push({b,from:c,to:c})});return g}
const lab=x=>{const nm=API().name(x.b);return nm+' '+(x.from===x.to?x.from:x.from+'–'+x.to)};
const fmt=n=>{let s=(Math.round(n*10)/10).toFixed(1).replace(/\.0$/,'');return lg()==='en'?s:s.replace('.',',')};
function streak(){const set=new Set(S.log);const d=new Date();if(!set.has(key(d)))d.setDate(d.getDate()-1);let n=0;while(set.has(key(d))){n++;d.setDate(d.getDate()-1)}return n}

function render(){const box=$('#rlist');if(!box||!API())return;
 let h='<h4>'+ico(I.cal)+esc(T('title'))+'</h4>';
 if(!S){
  h+='<div class="pl-pick">'+PLANS.map(p=>{const c=flat(p).length;return '<button type="button" class="pl-card" data-act="pick" data-id="'+p.id+'"><span class="pl-n">'+p.d+'<small>'+esc(T('days'))+'</small></span><span><b>'+esc(T('names')[p.id]||L.en.names[p.id])+'</b><span class="pl-d">'+esc(T('desc',{c:c,p:fmt(c/p.d)}))+'</span></span></button>'}).join('')+'</div><p class="pl-hint">'+esc(T('hint'))+'</p>';
 }else{
  const p=plan(S.id),D=p.d,done=Math.min(S.done,D),fin=done>=D,pct=Math.round(done/D*100),td=today(),dt=S.log.includes(td),st=streak(),cur=Math.min(done,D-1);
  const names=L[lg()].names||L.en.names;
  h+='<div class="pl-top"><span class="pl-t">'+esc(names[p.id])+'</span><span class="pl-streak'+(st?'':' off')+'">'+ico(I.flame)+esc(st?T('streak',{n:st}):'0')+'</span></div>';
  h+='<div class="pl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div><div class="pl-meta"><span>'+esc(fin?T('fin'):T('dayOf',{a:cur+1,b:D}))+'</span><span>'+pct+'%</span></div>';
  if(fin){
   h+='<div class="pl-today is-done"><div class="pl-ok">'+ico(I.check)+esc(T('fin'))+'</div><div class="pl-btns"><button type="button" class="pl-btn main" data-act="again">'+esc(T('again'))+'</button></div></div>';
  }else{
   const g=dayGroups(p,cur);
   h+='<div class="pl-today'+(dt?' is-done':'')+'">';
   if(dt)h+='<div class="pl-ok">'+ico(I.check)+esc(T('doneToday'))+'</div>';
   h+='<div class="pl-lab"><span>'+esc(dt?T('nextRead'):T('today'))+'</span><em>'+esc(T('dayOf',{a:cur+1,b:D}))+'</em></div><div class="pl-chips">'+g.map(x=>'<button type="button" class="pl-chip" data-act="go" data-b="'+esc(x.b)+'" data-c="'+x.from+'">'+esc(lab(x))+'</button>').join('')+'</div>';
   h+='<div class="pl-btns"><button type="button" class="pl-btn" data-act="read">'+ico(I.book)+esc(T('read'))+'</button><button type="button" class="pl-btn main" data-act="done">'+ico(I.check)+esc(T('done'))+'</button></div>';
   if(cur+1<D&&!dt){const nx=dayGroups(p,cur+1);h+='<p class="pl-next">'+esc(T('next'))+': <b>'+esc(nx.map(lab).join(' · '))+'</b></p>'}
   h+='</div>';
  }
  const set=new Set(S.log),dots=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dots.push('<i class="'+(set.has(key(d))?'on':'')+(i===0?' now':'')+'"></i>')}
  h+='<div class="pl-dots" aria-hidden="true">'+dots.join('')+'</div>';
  h+='<div class="pl-foot"><button type="button" class="pl-link" data-act="undo"'+(S.done>0?'':' style="visibility:hidden"')+'>'+esc(T('undo'))+'</button><button type="button" class="pl-link" data-act="change">'+esc(T('change'))+'</button></div>';
 }
 box.innerHTML=h}

function due(){const on=!!(S&&S.done<plan(S.id).d&&!S.log.includes(today()));const b=$('#bPlan'),t=$('#dt');b&&b.classList.toggle('due',on);t&&t.classList.toggle('plandue',on)}
function titles(){const b=$('#bPlan');if(b)b.title=b.ariaLabel=T('title')}
const close=()=>{const p=$('#rpanel');p&&p.classList.remove('open')};

function init(){
 const heart=$('#bHeart'),panel=$('#rpanel');if(!heart||!panel||$('#bPlan'))return;
 heart.insertAdjacentHTML('afterend','<button class="btn rnd" id="bPlan" type="button">'+ico(I.cal)+'</button>');
 const b=$('#bPlan');
 b.onclick=()=>{const op=!panel.classList.contains('open');['panel','npanel','ppanel','hpanel'].forEach(k=>{const e=$('#'+k);e&&e.classList.remove('open')});const xp=$('#xp');xp&&xp.classList.remove('open');if(op)render();panel.classList.toggle('open',op)};
 panel.addEventListener('click',e=>{const x=e.target.closest('[data-act]');if(!x)return;const a=x.dataset.act,A=API();
  if(a==='pick'){S={id:x.dataset.id,start:today(),done:0,log:[]};save();render()}
  else if(a==='go'){A.go(x.dataset.b,x.dataset.c);close()}
  else if(a==='read'){const p=plan(S.id),g=dayGroups(p,Math.min(S.done,p.d-1))[0];if(g){A.go(g.b,g.from);close()}}
  else if(a==='done'){const p=plan(S.id);if(S.done<p.d){S.done++;S.log.push(today());save();try{navigator.vibrate&&navigator.vibrate(18)}catch(_){}panel.classList.remove('pl-pop');void panel.offsetWidth;panel.classList.add('pl-pop');render()}}
  else if(a==='undo'){if(S.done>0){S.done--;S.log.pop();save();render()}}
  else if(a==='again'){S={id:S.id,start:today(),done:0,log:[]};save();render()}
  else if(a==='change'){if(confirm(T('confirm'))){S=null;save();render()}}
  due()});
 new MutationObserver(()=>{titles();if(panel.classList.contains('open'))render()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){due();if(panel.classList.contains('open'))render()}});
 titles();due()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
