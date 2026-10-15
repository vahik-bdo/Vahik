(()=>{
const T={ru:['OK, я прочитал(а)','Прокрутите вниз до конца, чтобы продолжить','Показать вступление снова','Закрыть'],en:['OK, I have read it','Scroll to the end to continue','Show the preface again','Close'],hy:['Լավ, կարդացի','Ոլորեք մինչև վերջ՝ շարունակելու համար','Ցույց տալ ներածությունը նորից','Փակել'],de:['OK, ich habe es gelesen','Bis zum Ende scrollen, um fortzufahren','Vorwort erneut anzeigen','Schließen']};
const R=document.documentElement;let shown=0;
const P=window.__pf;function ack(){return !!P&&P.get()===P.v}
function build(src,rp){
 const lg=T[R.lang]||T.en,m=document.createElement('div');m.id='pfm';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="pfc"><div class="pfp"><i></i></div><div class="pfb"></div><div class="pff"><p class="pfh"></p><button id="pfok" type="button" disabled></button></div></div>';
 const b=m.querySelector('.pfb');[...src.children].forEach(c=>{if(!c.classList.contains('br-preface-cross'))b.appendChild(c.cloneNode(true))});
 m.querySelector('.pfh').textContent=lg[1];const ok=m.querySelector('#pfok');ok.textContent=rp?lg[3]:lg[0];if(rp)ok.disabled=false;
 document.body.appendChild(m);R.classList.add('pf-lock');
 const bar=m.querySelector('.pfp i');
 const upd=()=>{const max=b.scrollHeight-b.clientHeight,k=max<=4?1:b.scrollTop/max;bar.style.width=Math.min(100,k*100)+'%';if(k>=.985&&!m.classList.contains('rd')){m.classList.add('rd');ok.disabled=false}};
 b.addEventListener('scroll',upd,{passive:true});
 ok.onclick=()=>{if(!rp&&P)P.set();m.classList.remove('on');setTimeout(()=>{m.remove();R.classList.remove('pf-lock');if(!rp&&window.__tour)window.__tour()},650)};
 requestAnimationFrame(()=>requestAnimationFrame(()=>{m.classList.add('on');upd()}));
}
function show(n){if(shown)return;
 if(document.getElementById('lpk')){setTimeout(()=>show(n),400);return}
 if(ack()||R.dataset.pf!=='1'){shown=1;window.__tour&&window.__tour();return}
 const src=document.querySelector('.br-preface');
 if(!src){if(n<20)setTimeout(()=>show(n+1),300);return}shown=1;build(src)}
const pr=document.getElementById('prayer');
if(pr&&!pr.classList.contains('off')){const pb=document.getElementById('pb');if(pb)pb.addEventListener('click',()=>setTimeout(()=>show(0),700))}
else setTimeout(()=>show(0),900);

/* «Показать вступление снова»: кнопка в настройках (вкладка «Вид»), подтверждение при этом не сбрасывается */
function replay(n){if(document.getElementById('pfm'))return;const src=document.querySelector('.br-preface');if(!src){if(n<20)setTimeout(()=>replay(n+1),300);return}build(src,true)}
const view=document.querySelector('#panel [data-s="view"]');
if(view){const row=document.createElement('div');row.className='row';row.style.marginTop='.9rem';const b=document.createElement('button');b.type='button';b.className='btn';b.id='pfAgain';row.appendChild(b);view.appendChild(row);
 const lab=()=>{b.textContent=(T[R.lang]||T.en)[2]};lab();new MutationObserver(lab).observe(R,{attributes:true,attributeFilter:['lang']});
 b.onclick=()=>{const pn=document.getElementById('panel');if(pn)pn.classList.remove('open');replay(0)}}
})();
