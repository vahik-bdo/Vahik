(()=>{
const SEL='.br-preface,.br-guide,.br-head,.br-verse,.br-empty,.br-nav,.br-sources';
/* края экрана: N слоёв блюра (каждый сильнее предыдущего в RATIO раз), маски перекрываются на две полосы и спадают по smoothstep;
   сверху — слой b: текст плавно растворяется в цвет фона (var(--bg)), поэтому нет ни «каши», ни резкой границы */
const COARSE=matchMedia('(hover:none) and (pointer:coarse)').matches,N=COARSE?5:7,RATIO=COARSE?1.9:1.75;
const EASE=[1,.926,.741,.5,.259,.074,0],FADE=[.95,.88,.70,.475,.246,.07,0];
const ramp=(v,a,b)=>EASE.map((e,s)=>'rgba(0,0,0,'+(v?v[s]:e)+') '+(a+(b-a)*s/6).toFixed(2)+'%').join(',');
function edge(id,dir){const d=document.createElement('div');d.id=id;d.className='eb';const R=100/(N+1);
 for(let k=1;k<=N;k++){const a=(N-k)*R,b=Math.min(100,(N-k+2)*R);
  const m='linear-gradient('+dir+',rgba(0,0,0,1) 0%,rgba(0,0,0,1) '+a.toFixed(2)+'%,'+ramp(null,a,b)+',rgba(0,0,0,0) 100%)',i=document.createElement('i');
  i.style.setProperty('--f',Math.pow(RATIO,k-N).toFixed(4));i.style.webkitMaskImage=m;i.style.maskImage=m;d.appendChild(i)}
 const f=document.createElement('b'),fm='linear-gradient('+dir+','+FADE.map((v,s)=>'rgba(0,0,0,'+v+') '+(s*100/6).toFixed(2)+'%').join(',')+')';
 f.style.webkitMaskImage=fm;f.style.maskImage=fm;d.appendChild(f);document.body.appendChild(d)}
edge('ebT','to bottom');edge('ebB','to top');
const io=new IntersectionObserver(es=>es.forEach(e=>{const t=e.target;
 if(e.isIntersecting){t.classList.remove('sv-up');t.classList.add('sv-in');if(t.__sd){t.__sd=0;setTimeout(()=>t.style.removeProperty('--sd'),1600)}}
 else{t.classList.remove('sv-in','sv-done');t.classList.toggle('sv-up',e.boundingClientRect.top<innerHeight/2)}}),{rootMargin:'-9% 0px -9% 0px',threshold:0});
let raf=0;
function arm(){raf=0;let i=0;document.querySelectorAll(SEL).forEach(n=>{if(n.__sv)return;n.__sv=1;n.__sd=1;n.classList.add('sv');n.style.setProperty('--sd',(Math.min(i++,6)*.07).toFixed(2)+'s');io.observe(n)})}
const sched=()=>{if(!raf)raf=requestAnimationFrame(arm)};
new MutationObserver(sched).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('transitionend',e=>{const t=e.target;if(e.propertyName==='filter'&&t.classList&&t.classList.contains('sv-in'))t.classList.add('sv-done')},true);
arm();
})();
