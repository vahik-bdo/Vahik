(()=>{
/* Кнопка «Установить приложение»: ПК/Android — установка PWA в один клик (или .apk), iPhone уже закрывает кнопка «На весь экран» */
const APK='app/vahik.apk';
const standalone=navigator.standalone||matchMedia('(display-mode: standalone)').matches||document.referrer.startsWith('android-app://');
const ua=navigator.userAgent,ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/i.test(ua);
const dm=document.getElementById('dm');
if(standalone||ios||!dm||document.getElementById('bInst'))return;
const L={
 ru:['Установить приложение','Установите «Новый Завет» как приложение: оно откроется без адресной строки и будет работать без интернета.','Установить','Скачать .apk для Android','Чтобы установить на компьютер, нажмите значок установки в правой части адресной строки браузера (Chrome или Edge).','Закрыть'],
 en:['Install app','Install “New Testament” as an app: it opens without the browser bar and works offline.','Install','Download .apk for Android','To install on a computer, click the install icon at the right end of the browser address bar (Chrome or Edge).','Close'],
 hy:['Տեղադրել հավելվածը','Տեղադրեք «Նոր Կտակարանը» որպես հավելված․ այն կբացվի առանց հասցեագոտու և կաշխատի առանց համացանցի։','Տեղադրել','Ներբեռնել .apk Android-ի համար','Համակարգչում տեղադրելու համար սեղմեք զննարկչի հասցեագոտու աջ մասի տեղադրման պատկերակը (Chrome կամ Edge)։','Փակել'],
 de:['App installieren','Installiere das „Neue Testament“ als App: Es öffnet sich ohne Adressleiste und funktioniert offline.','Installieren','.apk für Android herunterladen','Am Computer klicke auf das Installationssymbol am rechten Rand der Adressleiste (Chrome oder Edge).','Schließen']};
const de=document.documentElement,lg=()=>L[de.lang]||L.en;
let dp=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e});
addEventListener('appinstalled',()=>{const b=document.getElementById('bInst');b&&b.remove()});
const b=document.createElement('button');b.className='btn rnd';b.id='bInst';
b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 20h14"/></svg>';
const lab=()=>{b.title=b.ariaLabel=lg()[0]};lab();new MutationObserver(lab).observe(de,{attributes:true,attributeFilter:['lang']});
dm.prepend(b);
b.onclick=()=>{const x=lg(),o=document.createElement('div');o.id='instBox';
 o.style.cssText='position:fixed;inset:0;z-index:100010;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,9,12,.72);-webkit-backdrop-filter:blur(var(--blur,12px));backdrop-filter:blur(var(--blur,12px))';
 o.innerHTML='<div style="max-width:360px;padding:1.3rem 1.2rem 1.1rem;border:1px solid var(--line,rgba(255,255,255,.2));border-radius:20px;background:var(--panel,#222);color:var(--fg,#eee);text-align:center;font:400 .95rem/1.55 var(--ff,serif)"><h4 style="margin:0 0 .5rem;color:var(--head,#f0cf7a);font:600 1.15rem var(--ff,serif)"></h4><p style="margin:0 0 1rem"></p><div class="row" style="justify-content:center;gap:.5rem;flex-wrap:wrap"></div></div>';
 o.querySelector('h4').textContent=x[0];const p=o.querySelector('p'),row=o.querySelector('.row');
 p.textContent=dp?x[1]:(android?x[1]:x[4]);
 const add=(t,fn,on)=>{const k=document.createElement('button');k.type='button';k.className='btn'+(on?' on':'');k.textContent=t;k.onclick=fn;row.appendChild(k)};
 const close=()=>o.remove();
 if(dp)add(x[2],async()=>{close();try{dp.prompt();await dp.userChoice}catch(e){}dp=null},true);
 if(android)add(x[3],()=>{close();location.href=APK});
 add(x[5],close);o.onclick=e=>{if(e.target===o)close()};document.body.appendChild(o)};
})();
