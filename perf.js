/* Авто-облегчение: если во время прокрутки кадры идут медленно (<~35 кадров/с), сайт сам переходит в режим «lite»
   (без блюра по краям, без размытия появления текста, меньше капель дождя) и запоминает выбор на этом устройстве.
   Принудительно: добавьте к адресу ?lite=1 (включить) или ?lite=0 (сбросить и снова измерять). */
(()=>{const R=document.documentElement,N=navigator,cn=N.connection||{};
let lite=false,forced=null;
try{const q=new URLSearchParams(location.search).get('lite');if(q==='1'||q==='0'){forced=q;localStorage.setItem('nzLite',q)}lite=localStorage.getItem('nzLite')==='1'}catch(e){}
if(forced===null&&((N.deviceMemory&&N.deviceMemory<=3)||(N.hardwareConcurrency&&N.hardwareConcurrency<=4)||cn.saveData))lite=true;
function set(v,save){lite=v;R.classList.toggle('lite',v);if(save)try{localStorage.setItem('nzLite',v?'1':'0')}catch(e){}
 try{if(typeof fx!=='undefined'){fx.q=v?.5:1;fx.seed()}}catch(e){}}
set(lite,false);
if(forced==='1')return;
let scrolled=0,run=0,last=0,n=0,bad=0,strikes=0;const t0=performance.now();
function f(t){if(lite){run=0;return}
 if(t-scrolled>=250){run=0;n=bad=0;return}
 if(last){const d=t-last;if(d<300){n++;if(d>28)bad++}}last=t;
 if(n>=45){if(bad/n>.35){if(++strikes>=2){set(true,true);run=0;return}}else strikes=0;n=bad=0}
 requestAnimationFrame(f)}
addEventListener('scroll',()=>{scrolled=performance.now();if(!run&&performance.now()-t0>3500){run=1;last=0;requestAnimationFrame(f)}},{passive:true});
})();
