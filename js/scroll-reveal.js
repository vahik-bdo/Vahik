(()=>{
const SEL='.br-preface,.br-guide,.br-head,.br-verse,.br-empty,.br-nav,.br-sources';
/* прогрессивное размытие: N слоёв, блюр каждого вдвое сильнее предыдущего, маски с плавным (smoothstep) спадом и перекрытием */
const COARSE=matchMedia('(hover:none) and (pointer:coarse)').matches,N=COARSE?5:6,EASE=[1,.92,.74,.5,.26,.08,0];
function edge(id,dir){const d=document.createElement('div');d.id=id;d.className='eb';const R=100/N;
 for(let k=1;k<=N;k++){const P=(N-k)*R;let g='rgba(0,0,0,1) 0%,rgba(0,0,0,1) '+P.toFixed(2)+'%';
  for(let s=1;s<=6;s++)g+=',rgba(0,0,0,'+EASE[s]+') '+(P+R*s/6).toFixed(2)+'%';
  g+=',rgba(0,0,0,0) 100%';const m='linear-gradient('+dir+','+g+')',i=document.createElement('i');
  i.style.setProperty('--f',Math.pow(2,k-N).toFixed(4));i.style.webkitMaskImage=m;i.style.maskImage=m;d.appendChild(i)}
 document.body.appendChild(d)}
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
