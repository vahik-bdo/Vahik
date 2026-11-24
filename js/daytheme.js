/* Живая тема под время суток (тест): плавная тёплая/тёмная подсветка поверх страницы по местному часу.
   Проверка: добавьте ?h=7 (час суток) к адресу. Выключить: localStorage.dayTint='0' (включить: удалить/'1'). */
(function(){
var D=document,off;try{off=localStorage.getItem('dayTint')==='0'}catch(e){}if(off)return;
var q=/[?&]h=(\d+(?:\.\d+)?)/.exec(location.search),el=D.createElement('div');el.id='dayTint';D.body.appendChild(el);
/* час → [r,g,b,альфа заливки, альфа тёплого свечения сверху, альфа тёмной виньетки] */
var S=[[0,[6,10,30,.2,0,.26]],[5,[28,22,52,.13,0,.18]],[7,[255,176,106,.09,.14,0]],[10,[255,236,205,.04,.06,0]],[13,[255,248,232,.03,.03,0]],[17,[255,190,120,.07,.1,0]],[20,[22,26,64,.14,0,.18]],[24,[6,10,30,.2,0,.26]]];
function at(h){for(var i=1;i<S.length;i++)if(h<=S[i][0]){var a=S[i-1],b=S[i],k=(h-a[0])/(b[0]-a[0]);k=k*k*(3-2*k);return a[1].map(function(x,j){return x+(b[1][j]-x)*k})}return S[0][1]}
function paint(){var n=new Date(),h=q?+q[1]%24:n.getHours()+n.getMinutes()/60,c=at(h),r=Math.round;
 el.style.background='radial-gradient(ellipse 80% 55% at 50% 0%,rgba(255,205,140,'+c[4].toFixed(3)+'),transparent 70%),radial-gradient(ellipse 90% 80% at 50% 45%,transparent 45%,rgba(0,4,20,'+c[5].toFixed(3)+')),rgba('+r(c[0])+','+r(c[1])+','+r(c[2])+','+c[3].toFixed(3)+')';el.style.opacity=1}
paint();setInterval(paint,30000)
})();
