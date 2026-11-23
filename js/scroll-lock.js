/* Фон не двигается, пока открыт список книг/глав/настроек и т.п.
   Жест прокрутки внутри окна не «протекает» на текст под ним (в т.ч. на краях списка и при скольжении пальцем по списку). */
(function(){
var OPEN='#panel.open,#npanel.open,#ppanel.open,#hpanel.open,#xp.open,#brSearch.open,#brHist.open,#brCommentary.open,#modal.open,#brPop.open,#pfm,#lpk';
var BOX='#brPop,#panel,#npanel,#ppanel,#hpanel,#xp,#brSearch,#brHist,#brCommentary,.br-com-body,#modal,.br-search-results,.bh-card,.br-guide-scroll';
var y0=0,lastY=0;
function locked(){try{return !!document.querySelector(OPEN)}catch(e){return false}}
function scroller(t){for(var e=t&&t.nodeType===1?t:t&&t.parentElement;e&&e!==document.body;e=e.parentElement){
 if(e.matches&&e.matches(BOX)&&e.scrollHeight>e.clientHeight+1){var o=getComputedStyle(e).overflowY;if(o==='auto'||o==='scroll')return e}}return null}
document.addEventListener('touchstart',function(e){y0=lastY=e.touches[0].clientY},{passive:true,capture:true});
document.addEventListener('touchmove',function(e){
 if(!locked()||e.touches.length>1)return;
 var t=e.target,y=e.touches[0].clientY,dy=y-lastY;lastY=y;
 var pop=t.closest&&t.closest('#brPop.drag');
 if(pop){e.preventDefault();return}                 /* скольжение пальцем по списку: страница стоит */
 var s=scroller(t);
 if(!s){e.preventDefault();return}                  /* жест вне прокручиваемого окна */
 var atTop=s.scrollTop<=0,atBot=s.scrollTop+s.clientHeight>=s.scrollHeight-1;
 if((atTop&&dy>0)||(atBot&&dy<0))e.preventDefault(); /* край списка: не передаём странице */
},{passive:false,capture:true});
})();
