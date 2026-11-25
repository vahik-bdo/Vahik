/* Закрытие меню языка и левой колонки при прокрутке (как при касании вне меню).
   Колонка закрывается плавно: класс touched включает анимацию rtUp/rtDown из fixes.css. */
(function(){
  var D=document,Y=window.scrollY||0,t0=0;
  function $(s){return D.querySelector(s)}
  function inUI(t){return !!(t&&t.closest&&t.closest('#brRail,#brPop,#lm,#lb'))}
  function closeAll(){
    if(D.body.classList.contains('tour-on'))return;
    var lm=$('#lm'),R=$('#brRail'),P=$('#brPop');
    if(lm&&lm.classList.contains('open'))lm.classList.remove('open');
    if(R&&R.classList.contains('open')){R.classList.remove('open')}
    if(P&&P.classList.contains('open'))P.classList.remove('open');
  }
  function anyOpen(){var lm=$('#lm'),R=$('#brRail'),P=$('#brPop');
    return (lm&&lm.classList.contains('open'))||(R&&R.classList.contains('open'))||(P&&P.classList.contains('open'))}
  /* Плавное закрытие колонки. Любой код, снимающий .open с #brRail, перехватывается:
     .open возвращается на время анимации (до отрисовки кадра), панель медленно гаснет,
     затем .open снимается и язычок плавно уезжает на своё место (rtUp). */
  var DUR=900,closing=false,wasOpen=false;
  var st=D.createElement('style');
  st.textContent=
   '#brRail.rc-closing #brRb{animation:none!important;opacity:0!important;visibility:visible!important;pointer-events:none!important;transform:translate3d(-14px,0,0) scale(.95)!important;transition:opacity '+DUR+'ms ease,transform '+DUR+'ms cubic-bezier(.22,1,.36,1)!important}'+
   '#brRail.rc-closing #brRb>*{animation:none!important}'+
   '#brRail.rc-closing{pointer-events:none!important}'+
   '#brRail.touched:not(.open) #brRt{animation-duration:1000ms!important}';
  D.head.appendChild(st);
  function watchRail(){
    var R=$('#brRail');if(!R||R._rc)return !!R;R._rc=1;wasOpen=R.classList.contains('open');
    new MutationObserver(function(){
      var now=R.classList.contains('open');
      if(now&&!R.classList.contains('touched'))R.classList.add('touched');
      if(closing){ if(!now)R.classList.add('open'); return }
      if(wasOpen&&!now){
        closing=true;R.classList.add('rc-closing','open');
        setTimeout(function(){R.classList.remove('rc-closing');closing=false;wasOpen=false;R.classList.remove('open')},DUR+40);
        return;
      }
      wasOpen=now;
    }).observe(R,{attributes:true,attributeFilter:['class']});
    return true;
  }
  if(!watchRail()){var mo=new MutationObserver(function(){if(watchRail())mo.disconnect()});mo.observe(D.body||D.documentElement,{childList:true,subtree:true})}
  D.addEventListener('scroll',function(e){
    var y=window.scrollY||0,dy=Math.abs(y-Y);Y=y;
    if(dy>3&&anyOpen()&&!inUI(e.target&&e.target.nodeType===1?e.target:null))closeAll()
  },{capture:true,passive:true});
  var sx=0,sy=0;
  D.addEventListener('touchstart',function(e){var p=e.touches[0];if(p){sx=p.clientX;sy=p.clientY}},{capture:true,passive:true});
  D.addEventListener('touchmove',function(e){
    if(!anyOpen()||inUI(e.target))return;var p=e.touches[0];
    if(p&&Math.hypot(p.clientX-sx,p.clientY-sy)>8)closeAll()
  },{capture:true,passive:true});
  D.addEventListener('wheel',function(e){if(anyOpen()&&!inUI(e.target))closeAll()},{capture:true,passive:true});
})();
