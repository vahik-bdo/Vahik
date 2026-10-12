/* Армянский латиницей: переключатель AM / ENG и транскрипция всего, что показано на сайте.
   В данных остаётся оригинальный армянский текст, латиница строится на лету, поэтому AM всегда возвращает армянские буквы.
   Стиль: как армяне пишут латиницей в чатах (ը = @, ք = q, խ = x). Все правила в таблице ниже. */
(()=>{
/* ---------- настройки ---------- */
const PERSIST=false;      /* false: при каждом новом визите стартует AM; true: запоминать выбор навсегда */
const E_AS_A=false;       /* true: «է» писать как «a» (разговорное ереванское: havatum a), false: «e» */
const KEY='hyLatin';

/* ---------- таблица букв ---------- */
const MAP={'ա':'a','բ':'b','գ':'g','դ':'d','ե':'e','զ':'z','է':E_AS_A?'a':'e','ը':'@','թ':'t','ժ':'zh','ի':'i','լ':'l','խ':'x','ծ':'c','կ':'k','հ':'h','ձ':'dz','ղ':'gh','ճ':'ch','մ':'m','յ':'y','ն':'n','շ':'sh','ո':'o','չ':'ch','պ':'p','ջ':'j','ռ':'r','ս':'s','վ':'v','տ':'t','ր':'r','ց':'c','ւ':'v','փ':'p','ք':'q','օ':'o','ֆ':'f'};
const UP='ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ',LOW='աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆ';
const lower=ch=>{const i=UP.indexOf(ch);return i>=0?LOW[i]:ch};
const isUp=ch=>UP.indexOf(ch)>=0;
const isArm=ch=>ch&&((ch>='Ա'&&ch<='Ֆ')||(ch>='ա'&&ch<='և'));
const isLetter=ch=>!!ch&&(isArm(ch)||/\p{L}/u.test(ch));
const MARKS='՛՜՞՟՚';
const TEST=/[Ա-Ֆա-և՚-՟։֊]/;

const cache=new Map();
function conv(src){
 if(!TEST.test(src))return src;
 const hit=cache.get(src);if(hit!==undefined)return hit;
 let s=src;
 s=s.replace(/(աշխար)հ/gi,'$1');            /* աշխարհ → ashxar: «հ» в конце не произносят */
 let out='',q=false;
 for(let i=0;i<s.length;i++){
  const ch=s[i],lo=lower(ch),prev=i?s[i-1]:'',next=s[i+1]||'';
  if(ch==='՞'){q=true;continue}
  if(ch==='՛'||ch==='՜'||ch==='՟'||ch==='՚')continue;   /* знаки ударения и восклицания над словом опускаем */
  if(ch==='։'||(ch==='.'&&!/\d/.test(prev))){out+=q?'?':'.';q=false;continue}
  if(ch==='՝'){out+=',';continue}
  if(ch==='֊'){out+='-';continue}
  if(ch==='և'){out+='ev';continue}
  if(!(lo in MAP)){out+=ch;continue}
  /* ու (в т.ч. с ударением между буквами: ո՞ւ) */
  if(lo==='ո'){
   let j=i+1;while(j<s.length&&MARKS.includes(s[j]))j++;
   if(s[j]==='ւ'||s[j]==='Ւ'){
    const marks=s.slice(i+1,j);
    if(marks.includes('՞'))q=true;
    out+=isUp(ch)?'U':'u';i=j;continue;
   }
  }
  const word0=!isLetter(prev);
  let t=MAP[lo];
  if(lo==='ե'&&word0)t='ye';
  else if(lo==='ո')t=word0&&lower(next)!=='վ'?'vo':'o';
  else if(lo==='յ'&&word0)t='h';
  else if((lo==='ծ'||lo==='ց')&&word0)t='ts';
  if(isUp(ch)){
   const allCaps=isUp(next)||(isArm(prev)&&isUp(prev));
   t=allCaps?t.toUpperCase():t[0].toUpperCase()+t.slice(1);
  }
  out+=t;
 }
 if(q&&/\s/.test(src.trim()))out+='?';   /* отдельное слово с «՞» (текст разбит по словам) вопросительный знак не получает */
 if(cache.size>20000)cache.clear();
 cache.set(src,out);
 return out;
}

/* ---------- состояние ---------- */
const root=document.documentElement;
const store={get(){try{return(PERSIST?localStorage:sessionStorage).getItem(KEY)}catch(e){return null}},set(v){try{(PERSIST?localStorage:sessionStorage).setItem(KEY,v)}catch(e){}}};
let mode=store.get()==='lat'?'lat':'arm';
const isHy=()=>root.lang==='hy';
let active=false;
const on=()=>active;

/* ---------- замена в странице ---------- */
const SKIP='script,style,textarea,input,select,option,code,pre,[contenteditable],[contenteditable] *,[data-no-translit]';
const ATTRS=['placeholder','title','aria-label','alt'];
const origText=new Map(),origAttr=new Map();
let obs=null;

function convText(n){
 const v=n.nodeValue;if(!v||!TEST.test(v))return;
 const p=n.parentElement;if(p&&p.closest(SKIP))return;
 origText.set(n,v);n.nodeValue=conv(v);
}
function convAttrs(el){
 for(const a of ATTRS){
  const v=el.getAttribute&&el.getAttribute(a);
  if(v&&TEST.test(v)){let m=origAttr.get(el);if(!m){m={};origAttr.set(el,m)}m[a]=v;el.setAttribute(a,conv(v))}
 }
}
function walk(node){
 if(node.nodeType===3){convText(node);return}
 if(node.nodeType!==1)return;
 if(node.matches&&node.matches(SKIP))return;
 if(node.closest&&node.closest(SKIP)&&node!==document.body)return;
 convAttrs(node);
 node.querySelectorAll&&node.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(convAttrs);
 const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
 const list=[];for(let n;(n=w.nextNode());)list.push(n);
 list.forEach(convText);
}
function onMut(recs){
 if(!active)return;
 for(const r of recs){
  if(r.type==='characterData')convText(r.target);
  else if(r.type==='attributes')convAttrs(r.target);
  else r.addedNodes.forEach(walk);
 }
 obs.takeRecords();   /* свои же правки не разбираем повторно */
}
function start(){
 if(!obs)obs=new MutationObserver(onMut);
 walk(document.body);
 const t=document.querySelector('title');if(t&&t.firstChild)convText(t.firstChild);
 obs.takeRecords();
 obs.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
}
function stop(){
 if(obs){obs.disconnect()}
 origText.forEach((v,n)=>{if(n.isConnected)n.nodeValue=v});origText.clear();
 origAttr.forEach((m,el)=>{if(el.isConnected)for(const a in m)el.setAttribute(a,m[a])});origAttr.clear();
}

/* ---------- переключатель ---------- */
let ui=null;
function label(){
 if(!ui)return;
 ui.querySelector('[data-m="arm"]').classList.toggle('on',mode==='arm');
 ui.querySelector('[data-m="lat"]').classList.toggle('on',mode==='lat');
 ui.querySelector('[data-m="arm"]').setAttribute('aria-pressed',mode==='arm');
 ui.querySelector('[data-m="lat"]').setAttribute('aria-pressed',mode==='lat');
}
function buildUI(){
 if(ui||!document.body)return;
 ui=document.createElement('div');ui.id='hyx';ui.className='ui';ui.setAttribute('role','group');ui.setAttribute('data-no-translit','');ui.setAttribute('aria-label','Armenian script / Latin letters');
 ui.innerHTML='<button type="button" data-m="arm" title="Հայերեն տառերով">AM</button><button type="button" data-m="lat" title="Latin letters">ENG</button>';
 ui.addEventListener('click',e=>{const b=e.target.closest('button');if(b)set(b.dataset.m)});
 document.body.appendChild(ui);label();
}
function apply(){
 const want=isHy()&&mode==='lat';
 if(want===active){label();return}
 active=want;
 root.toggleAttribute('data-latn',active);
 if(active)start();else stop();
 label();
 window.dispatchEvent(new Event('hylatin'));
}
function set(m){
 mode=m==='lat'?'lat':'arm';store.set(mode);apply();
}

window.HyLatin={on,conv,set,get mode(){return mode}};

function init(){
 buildUI();apply();
 new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['lang']});
}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
