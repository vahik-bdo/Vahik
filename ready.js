(function(){var R=document.documentElement,n=0;function go(){if(R.classList.contains('rdy'))return;requestAnimationFrame(function(){requestAnimationFrame(function(){R.classList.add('rdy')})})}
function chk(){n++;var ok=document.querySelector('#brRoot')&&document.querySelector('.hero.in');if(ok||n>60){setTimeout(go,120)}else setTimeout(chk,25)}chk()})();
