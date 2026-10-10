// Keep reader text sharp while scrolling; only expand the preface on click.
document.addEventListener('click',e=>{const pf=e.target.closest&&e.target.closest('.br-preface');if(pf&&(e.target.closest('h2')||!pf.classList.contains('open')))pf.classList.toggle('open')});
