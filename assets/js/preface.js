(()=>{
const T={ru:['OK, я прочитал(а)','Прокрутите вниз до конца, чтобы продолжить'],en:['OK, I have read it','Scroll to the end to continue'],hy:['Լավ, կարդացի','Ոլորեք մինչև վերջ՝ շարունակելու համար'],de:['OK, ich habe es gelesen','Bis zum Ende scrollen, um fortzufahren']};
const R=document.documentElement;let shown=0;
function ack(){try{return sessionStorage.getItem('pfAck')}catch(e){return 1}}
function build(src){
 const lg=T[R.lang]||T.en,m=document.createElement('div');m.id='pfm';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="pfc"><div class="pfp"><i></i></div><div class="pfb"></div><div class="pff"><p class="pfh"></p><button id="pfok" type="button" disabled></button></div></div>';
 const b=m.querySelector('.pfb');[...src.children].forEach(c=>{if(!c.classList.contains('br-preface-cross'))b.appendChild(c.cloneNode(true))});
 m.querySelector('.pfh').textContent=lg[1];const ok=m.querySelector('#pfok');ok.textContent=lg[0];
 document.body.appendChild(m);R.classList.add('pf-lock');
 const bar=m.querySelector('.pfp i');
 const upd=()=>{const max=b.scrollHeight-b.clientHeight,k=max<=4?1:b.scrollTop/max;bar.style.width=Math.min(100,k*100)+'%';if(k>=.985&&!m.classList.contains('rd')){m.classList.add('rd');ok.disabled=false}};
 b.addEventListener('scroll',upd,{passive:true});
 ok.onclick=()=>{try{sessionStorage.setItem('pfAck','1')}catch(e){}m.classList.remove('on');setTimeout(()=>{m.remove();R.classList.remove('pf-lock');window.__tour&&window.__tour()},650)};
 requestAnimationFrame(()=>requestAnimationFrame(()=>{m.classList.add('on');upd()}));
}
function show(n){if(shown)return;
 if(document.getElementById('lpk')){setTimeout(()=>show(n),400);return}
 if(ack()||R.dataset.pf!=='1'){shown=1;window.__tour&&window.__tour();return}
 const src=document.querySelector('.br-preface');
 if(!src){if(n<20)setTimeout(()=>show(n+1),300);return}shown=1;build(src)}
window.addEventListener('readerready',()=>{const prayer=document.getElementById('prayer');if(!prayer||prayer.classList.contains('off'))show(0)});
const pr=document.getElementById('prayer');
if(pr&&!pr.classList.contains('off')){const pb=document.getElementById('pb');if(pb)pb.addEventListener('click',()=>setTimeout(()=>show(0),700))}
else setTimeout(()=>show(0),900);
})();
