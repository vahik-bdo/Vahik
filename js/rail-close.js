/* Меню языка и левая колонка: закрываются при прокрутке и при касании вне меню.
   Колонка сворачивается так же мягко, как список книг/глав: плавно гаснет и чуть уходит влево,
   затем так же плавно появляется свёрнутый язычок. */
(function(){
  var D=document,Y=window.scrollY||0;
  var OUT=520,IN=620;
  function $(s){return D.querySelector(s)}
  function inUI(t){return !!(t&&t.closest&&t.closest('#brRail,#brPop,#lm,#lb'))}
  var st=D.createElement('style');
  st.textContent=
   'html body #brRail.rc-closing.open{opacity:0!important;translate:-16px -50%!important;pointer-events:none!important;transition:opacity '+OUT+'ms cubic-bezier(.4,0,.2,1),translate '+OUT+'ms cubic-bezier(.22,1,.36,1)!important}'+
   'html body #brRail.rc-closing.open #brRb{animation:none!important;opacity:1!important;visibility:visible!important;transform:none!important;transition:none!important}'+
   'html body #brRail.rc-hold{opacity:0!important;transition:none!important}'+
   'html body #brRail.rc-fadein{transition:opacity '+IN+'ms ease!important}';
  D.head.appendChild(st);

  var closing=false,wasOpen=false;
  function watch(){
    var R=$('#brRail');if(!R||R._rc)return !!R;R._rc=1;wasOpen=R.classList.contains('open');
    new MutationObserver(function(){
      var now=R.classList.contains('open');
      if(closing){if(!now)R.classList.add('open');return}
      if(wasOpen&&!now){
        /* закрытие: возвращаем .open на время анимации (до отрисовки кадра) */
        closing=true;R.classList.add('rc-closing','open');
        setTimeout(function(){
          R.classList.add('rc-hold');R.classList.remove('rc-closing');closing=false;wasOpen=false;R.classList.remove('open');
          requestAnimationFrame(function(){requestAnimationFrame(function(){
            R.classList.add('rc-fadein');R.classList.remove('rc-hold');
            setTimeout(function(){R.classList.remove('rc-fadein')},IN+60)
          })})
        },OUT+30);
        return;
      }
      wasOpen=now;
    }).observe(R,{attributes:true,attributeFilter:['class']});
    return true;
  }
  if(!watch()){var mo=new MutationObserver(function(){if(watch())mo.disconnect()});mo.observe(D.body||D.documentElement,{childList:true,subtree:true})}

  function anyOpen(){var lm=$('#lm'),R=$('#brRail'),P=$('#brPop');
    return (lm&&lm.classList.contains('open'))||(R&&R.classList.contains('open')&&!R.classList.contains('rc-closing'))||(P&&P.classList.contains('open'))}
  function closeAll(){
    if(D.body.classList.contains('tour-on'))return;
    var lm=$('#lm'),R=$('#brRail'),P=$('#brPop');
    if(lm)lm.classList.remove('open');
    if(P)P.classList.remove('open');
    if(R&&R.classList.contains('open'))R.classList.remove('open');
  }
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
