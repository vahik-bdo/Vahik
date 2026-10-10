(()=>{const o=document.createElement('div');o.id='sbl';document.body.appendChild(o);
let last=scrollY,t=performance.now(),v=0,idle=0,raf=0;
function tick(){raf=0;const now=performance.now(),y=scrollY,dt=Math.max(16,now-t);v=v*.6+(Math.abs(y-last)/dt*1000)*.4;last=y;t=now;
o.style.opacity=Math.max(0,Math.min(1,(v-60)/700)).toFixed(2);clearTimeout(idle);idle=setTimeout(()=>{v=0;o.style.opacity=0},160)}
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(tick)},{passive:true})})();
document.addEventListener('click',e=>{const pf=e.target.closest&&e.target.closest('.br-preface');if(pf&&(e.target.closest('h2')||!pf.classList.contains('open')))pf.classList.toggle('open')});
