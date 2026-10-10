(() => {
 const labels = {ru:'Связаться',en:'Contact',hy:'Կապ հաստատել',de:'Kontakt'};
 const update = () => { document.getElementById('contactLabel').textContent = labels[document.documentElement.lang] || labels.en; };
 new MutationObserver(update).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
 update();
})();
