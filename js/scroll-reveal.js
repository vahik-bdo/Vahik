(()=>{
const SEL='.br-preface,.br-guide,.br-head,.br-verse,.br-empty,.br-nav,.br-sources';
['ebT','ebB'].forEach(id=>{const d=document.createElement('div');d.id=id;d.className='eb';document.body.appendChild(d)});
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
