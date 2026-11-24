/* apple.js: крест при прокрутке, автосворачивание левой колонки / меню «···» / панели настроек */
(function(){
var D=document,H=D.documentElement,$=function(s){return D.querySelector(s)};
/* 1. крест статичный; на время, пока он на экране, отключается полноэкранное размытие при прокрутке */
var cxOn=null;function cxChk(){var on=(window.pageYOffset||0)<Math.max(500,innerHeight*.7);if(on!==cxOn){cxOn=on;H.classList.toggle('cx',on)}}
addEventListener('scroll',cxChk,{passive:true});cxChk();

/* толкования: подписи «Стих / Толкование» (язык интерфейса) */
var LV={ru:['Стих','Толкование'],en:['Verse','Commentary'],hy:['Համար','Մեկնություն'],de:['Vers','Auslegung'],pl:['Wers','Komentarz'],hu:['Vers','Magyarázat']};
function decorate(body){
 var L=LV[(H.lang||'ru').slice(0,2)]||LV.en;
 body.querySelectorAll('.com-q:not([data-tag])').forEach(function(q){var b=q.querySelector('b');q.setAttribute('data-tag',L[0]+(b?' '+b.textContent:''))});
 body.querySelectorAll('.com-qt:not([data-tag])').forEach(function(q){q.setAttribute('data-tag',L[0])});
 body.querySelectorAll('.com-q,.com-qt').forEach(function(q){var n=q.nextElementSibling;if(!n||!/^(P|H4)$/.test(n.tagName))return;
  var w=D.createElement('div');w.className='com-body';w.setAttribute('data-tag',L[1]);q.parentNode.insertBefore(w,n);
  while(w.nextElementSibling&&/^(P|H4)$/.test(w.nextElementSibling.tagName))w.appendChild(w.nextElementSibling)})}
function comWatch(){var b=$('#brComBody');if(!b)return false;var mo=new MutationObserver(function(){mo.disconnect();decorate(b);mo.observe(b,{childList:true,subtree:true})});mo.observe(b,{childList:true,subtree:true});decorate(b);return true}
if(!comWatch()){var m=0,iv2=setInterval(function(){if(comWatch()||++m>40)clearInterval(iv2)},400)}

/* общий помощник: закрыть после паузы бездействия */
function idleClose(isOpen,close,ms,zone){
 var t=0;function stop(){clearTimeout(t);t=0}
 function arm(){stop();if(isOpen())t=setTimeout(fire,ms)}
 function fire(){t=0;if(!isOpen())return;var z=zone();if(z&&z.matches&&z.matches(':hover')&&matchMedia('(hover:hover)').matches){arm();return}
  var a=D.activeElement;if(a&&z&&z.contains(a)&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)){arm();return}
  close()}
 ['pointerdown','pointermove','keydown','wheel','touchstart'].forEach(function(e){D.addEventListener(e,function(ev){var z=zone();if(z&&ev.target&&z.contains&&z.contains(ev.target))arm()},{passive:true,capture:true})});
 return arm}

/* 4. меню «···» справа снизу: 8 с без касаний */
var dock=$('#dock');
if(dock){
 var anyPanel=function(){return !!$('#panel.open,#npanel.open,#ppanel.open,#hpanel.open,#rpanel.open,#modal.open')};
 var armD=idleClose(function(){return dock.classList.contains('open')},function(){if(anyPanel())return;var b=$('#dt');b&&b.click()},8000,function(){return dock});
 new MutationObserver(armD).observe(dock,{attributes:true,attributeFilter:['class']});
 /* панель настроек: 25 с без активности внутри неё */
 var pn=$('#panel');
 if(pn){var armP=idleClose(function(){return pn.classList.contains('open')},function(){pn.classList.remove('open')},25000,function(){return pn});
  new MutationObserver(armP).observe(pn,{attributes:true,attributeFilter:['class']})}
}

/* 2. левая колонка: сворачивается через 6 с и при прокрутке текста */
function railInit(){
 var R=$('#brRail');if(!R)return false;
 var armR=idleClose(function(){return R.classList.contains('open')},function(){if($('#brPop.open'))return;R.classList.remove('open')},6000,function(){return $('#brPop.open')||R});
 new MutationObserver(armR).observe(R,{attributes:true,attributeFilter:['class']});
 var last=window.pageYOffset;addEventListener('scroll',function(){var y=window.pageYOffset;if(Math.abs(y-last)>90){last=y;if(R.classList.contains('open')&&!$('#brPop.open'))R.classList.remove('open')}},{passive:true});
 return true}
if(!railInit()){var n=0,iv=setInterval(function(){if(railInit()||++n>40)clearInterval(iv)},250)}

/* 8. толкование креста: при наведении (на сенсорных, по касанию) */
var CT={
ru:['Православный крест',['Верхняя малая перекладина: табличка с надписью «Иисус Назорей, Царь Иудейский» (Ин. 19:19).','Средняя перекладина: распростёртые руки Распятого.','Нижняя косая перекладина: подножие. Поднятый конец указывает на покаявшегося разбойника, опущенный: на непокаявшегося.','IC XC: Иисус Христос. NIKA: «Побеждает».','Череп у подножия Голгофы: голова Адама. Христос Своей смертью победил смерть.']],
en:['The Orthodox cross',['Upper short bar: the plaque reading “Jesus of Nazareth, King of the Jews” (John 19:19).','Middle bar: the outstretched hands of the Crucified.','Lower slanted bar: the footrest. The raised end points to the repentant thief, the lowered end to the unrepentant one.','IC XC: Jesus Christ. NIKA: “He conquers”.','The skull at the foot of Golgotha: the head of Adam. By His death Christ conquered death.']],
hy:['Ուղղափառ խաչ',['Վերին փոքր խաչափայտ. տախտակը՝ «Հիսուս Նազովրեցի, Հրեից թագավոր» (Հովհ. 19:19)։','Միջին խաչափայտ. Խաչյալի տարածված ձեռքերը։','Ստորին թեք խաչափայտ. ոտքերի հենարանը։ Բարձրացած ծայրը ցույց է տալիս զղջացող ավազակին, իջածը՝ չզղջացողին։','IC XC. Հիսուս Քրիստոս։ NIKA. «Հաղթում է»։','Գանգը Գողգոթայի ստորոտին Ադամի գլուխն է։ Քրիստոսը Իր մահվամբ հաղթեց մահվանը։']],
de:['Das orthodoxe Kreuz',['Oberer kurzer Querbalken: die Tafel „Jesus von Nazaret, König der Juden“ (Joh 19,19).','Mittlerer Querbalken: die ausgestreckten Hände des Gekreuzigten.','Unterer schräger Balken: der Fußschemel. Das erhobene Ende weist auf den reuigen Schächer, das gesenkte auf den unbußfertigen.','IC XC: Jesus Christus. NIKA: „Er siegt“.','Der Schädel am Fuß Golgathas: der Kopf Adams. Durch seinen Tod hat Christus den Tod besiegt.']],
pl:['Krzyż prawosławny',['Górna krótka poprzeczka: tabliczka z napisem „Jezus Nazareński, Król Żydowski” (J 19,19).','Środkowa poprzeczka: wyciągnięte ręce Ukrzyżowanego.','Dolna ukośna poprzeczka: podnóżek. Uniesiony koniec wskazuje na skruszonego łotra, opuszczony na nieskruszonego.','IC XC: Jezus Chrystus. NIKA: „Zwycięża”.','Czaszka u stóp Golgoty: głowa Adama. Swoją śmiercią Chrystus pokonał śmierć.']],
hu:['Az ortodox kereszt',['Felső rövid gerenda: a felirat táblája: „Názáreti Jézus, a zsidók királya” (Jn 19,19).','Középső gerenda: a Megfeszített kitárt karjai.','Alsó ferde gerenda: a lábtartó. Az emelkedő vége a megtérő lator felé mutat, a lesüllyedő a megtérni nem akaró felé.','IC XC: Jézus Krisztus. NIKA: „Győz”.','A koponya a Golgota tövében Ádám feje. Halálával Krisztus legyőzte a halált.']]};
var HS=[
{b:[148,14,90,72],ru:["Нерукотворный образ","Лик Христа на плате (убрусе). По преданию, Господь отпечатал Свой образ на плате и послал его эдесскому царю Авгарю. Вверху креста он напоминает: распятый — Господь и Бог."],en:["Image Not Made by Hands","The face of Christ on a cloth. Tradition says the Lord imprinted His likeness on a cloth and sent it to King Abgar of Edessa. At the top of the cross it declares that the Crucified is Lord and God."]},
{b:[84,70,72,82],ru:["Ангелы","Ангельские силы предстоят Распятому Владыке со страхом и благоговением."],en:["Angels","The angelic hosts stand before the crucified Master in fear and reverence."]},
{b:[225,70,72,82],ru:["Ангелы","Ангельские силы предстоят Распятому Владыке со страхом и благоговением."],en:["Angels","The angelic hosts stand before the crucified Master in fear and reverence."]},
{b:[152,94,76,32],o:["LUX MUNDI"],ru:["Свет миру","Латинская надпись «Lux mundi» — «Свет мира». Слова Христа: «Я свет миру» (Ин. 8:12)."],en:["Light of the world","Latin “Lux mundi”, “Light of the world”. The words of Christ: “I am the light of the world” (John 8:12)."]},
{b:[150,144,72,42],o:["INBI","І.Н.Ц.І.","Ἰησοῦς ὁ Ναζωραῖος ὁ βασιλεὺς τῶν Ἰουδαίων"],ru:["Надпись на кресте","Латинское «Iesus Nazarenus Rex Iudaeorum» — «Иисус Назорей, Царь Иудейский». Пилат велел написать её на еврейском, греческом и латинском языках и прибить над головой Распятого (Ин. 19:19–20). Греческая строка — текст евангелия; церковнославянская — «І.Н.Ц.І.»."],en:["The inscription on the cross","Latin “Iesus Nazarenus Rex Iudaeorum”: “Jesus of Nazareth, King of the Jews”. Pilate had it written in Hebrew, Greek and Latin and fixed above the head of the Crucified (John 19:19–20). The Greek line is the Gospel text; the Church Slavonic form is “І.Н.Ц.І.”."]},
{b:[38,194,304,32],o:["Сн҃ъ Бж҃ій","Іс Хс"],ru:["Сын Божий · Иисус Христос","«Сын Божий» и «Иисус Христос». Слова написаны сокращённо, под знаком титла (~). «ІС ХС» — греческое сокращение ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ: первая и последняя буквы каждого слова."],en:["Son of God · Jesus Christ","“Son of God” and “Jesus Christ”, written in abbreviation under the titlo mark (~). “IC XC” is the Greek abbreviation of ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ, the first and last letters of each word."]},
{b:[153,195,60,42],o:["Ὁ ὬΝ"],ru:["Крестчатый нимб: «Сущий»","В нимбе Христа всегда стоят греческие буквы Ὁ ὬΝ — «Сущий». Это имя, которое Бог открыл Моисею в Неопалимой Купине: «Я есмь Сущий» (Исх. 3:14)."],en:["The cruciform nimbus: “He Who Is”","The nimbus of Christ always carries the Greek letters Ὁ ὬΝ, “He Who Is”. This is the name God revealed to Moses at the Burning Bush: “I AM WHO I AM” (Exodus 3:14)."]},
{b:[10,198,32,30],ru:["Солнце","При крестной смерти Господа «померкло солнце» (Лк. 23:45), и «от шестого часа тьма была по всей земле до часа девятого» (Мф. 27:45). Солнце и луна по сторонам Креста — тварь, скорбящая о своём Творце."],en:["The Sun","At the Lord’s death “the sun was darkened” (Luke 23:45) and “from the sixth hour there was darkness over all the land until the ninth hour” (Matthew 27:45). The sun and moon beside the Cross: creation mourning its Creator."]},
{b:[346,198,32,30],ru:["Луна","Солнце и луна по сторонам Креста — тварь, скорбящая о своём Творце; тьма при Распятии (Мф. 27:45)."],en:["The Moon","The sun and moon beside the Cross: creation mourning its Creator; the darkness at the Crucifixion (Matthew 27:45)."]},
{b:[8,232,26,34],o:["NI","Νίκα"],ru:["НИ КА: «Побеждает»","Греческое Νίκα — «побеждает». Надпись разделена надвое: «НИ» слева и «КА» справа от Распятого. Полностью: «Иисус Христос побеждает» (Ἰησοῦς Χριστὸς νικᾷ)."],en:["NI KA: “conquers”","Greek Νίκα, “conquers”. The word is split: “NI” on the left and “KA” on the right of the Crucified. In full: “Jesus Christ conquers” (Ἰησοῦς Χριστὸς νικᾷ)."]},
{b:[346,232,26,34],o:["KA","Ἰησοῦς Χριστὸς νικᾷ"],ru:["НИ КА: «Побеждает»","Вторая половина слова Νίκα — «побеждает». Полностью: «Иисус Христос побеждает» (Ἰησοῦς Χριστὸς νικᾷ)."],en:["NI KA: “conquers”","The second half of the word Νίκα, “conquers”. In full: “Jesus Christ conquers” (Ἰησοῦς Χριστὸς νικᾷ)."]},
{b:[12,266,356,26],o:["Кресту Твоему покланяемся, Владыко, и святое воскресение Твое славим.","Τὸν σταυρόν σου προσκυνοῦμεν, Δέσποτα, καὶ τὴν ἁγίαν σου ἀνάστασιν δοξάζομεν."],ru:["Песнь Кресту","Припев церковной песни, которую поют при поклонении Кресту (в Неделю Крестопоклонную и на Воздвижение). Греческий текст — оригинал песни."],en:["The hymn to the Cross","The refrain of the church hymn sung at the veneration of the Cross (the Sunday of the Veneration of the Cross and the Exaltation). The Greek is the original text."]},
{b:[141,434,16,18],o:["К — Копие"],ru:["«К»: Копие","Копьё воина, которым был прободён бок Господа (Ин. 19:34)."],en:["“К”: the Spear","The soldier’s spear that pierced the Lord’s side (John 19:34)."]},
{b:[222,456,16,18],o:["Т — Трость"],ru:["«Т»: Трость","Трость с губкой, на которой Господу подали уксус (Мф. 27:48)."],en:["“Т”: the Reed","The reed with the sponge on which vinegar was offered to the Lord (Matthew 27:48)."]},
{b:[148,466,86,40],ru:["Подножие","Косая нижняя перекладина. Поднятый конец указывает на мудрого разбойника, который покаялся и услышал: «Ныне же будешь со Мною в раю» (Лк. 23:43), опущенный — на разбойника, который хулил Господа."],en:["The footrest","The slanted lower bar. The raised end points to the wise thief who repented and heard: “Today you will be with Me in Paradise” (Luke 23:43); the lowered end to the thief who blasphemed."]},
{b:[180,514,20,46],o:["МЛ  РБ","ГГ"],ru:["МЛ РБ · ГГ","«МЛ РБ» — «Место Лобное, Рай Бысть». «ГГ» — «Гора Голгофа». Голгофа — по-арамейски «лобное место» (Мф. 27:33). Слова «Рай бысть» говорят, что крестная жертва вновь открыла людям рай."],en:["МЛ РБ · ГГ","“МЛ РБ”: “the Place of the Skull, it became Paradise”. “ГГ”: “Mount Golgotha”. Golgotha means “the place of a skull” (Matthew 27:33). “It became Paradise” says that the sacrifice of the Cross opened Paradise to men again."]},
{b:[100,455,54,80],ru:["Град Иерусалим","Господь пострадал вне городских стен: «Иисус… вне врат пострадал» (Евр. 13:12)."],en:["The city of Jerusalem","The Lord suffered outside the city walls: “Jesus… suffered outside the gate” (Hebrews 13:12)."]},
{b:[226,475,58,100],ru:["Град Иерусалим","Господь пострадал вне городских стен: «Иисус… вне врат пострадал» (Евр. 13:12)."],en:["The city of Jerusalem","The Lord suffered outside the city walls: “Jesus… suffered outside the gate” (Hebrews 13:12)."]},
{b:[150,556,86,56],ru:["Гора Голгофа","Холм за стенами Иерусалима, место казни. Расселина в камне напоминает: «земля потряслась, и камни расселись» (Мф. 27:51)."],en:["Mount Golgotha","The hill outside Jerusalem’s walls where executions took place. The cleft in the rock recalls: “the earth shook, and the rocks were split” (Matthew 27:51)."]},
{b:[158,626,76,52],o:["Г  А","Глава Адамова"],ru:["Глава Адамова","«Г А» — «Глава Адамова», то есть голова Адама. По древнему преданию, Адам погребён на Голгофе, и Кровь Христа, стекая на череп, смыла грех праотца. Христос Своей смертью победил смерть и воскресил падших."],en:["The head of Adam","“Г А”: “the head of Adam”. By ancient tradition Adam was buried at Golgotha, and the Blood of Christ flowing down upon the skull washed away the sin of the forefather. By His death Christ conquered death and raised the fallen."]}
];
var cw=$('.hero .crossw'),tp=null,tpT=0,cur=-1;
function ctT(t){var w=String(t).split(/\s+/);return w.length<2?'<b>'+t+'</b>':'<b>'+w[0]+'</b> <em>'+w.slice(1).join(' ')+'</em>'}
function tipBuild(k){var L=(H.lang||'ru').slice(0,2);
 if(k>=0){var h=HS[k],d=h[L]||h.en;
  tp.innerHTML='<h5>'+ctT(d[0])+'</h5>'+(h.o?'<div class="ct-o">'+h.o.map(function(x){return'<div>'+x+'</div>'}).join('')+'</div>':'')+'<p>'+d[1]+'</p>'+'<i class="ct-n" aria-hidden="true">'+String(k+1).padStart(2,'0')+'</i>';tp.classList.add('det')}
 else{var g=CT[L]||CT.en;tp.innerHTML='<h5>'+ctT(g[0])+'</h5>'+g[1].map(function(x){return'<p>'+x+'</p>'}).join('');tp.classList.remove('det')}}
function tipPos(){var r=cw.getBoundingClientRect(),w=tp.offsetWidth,h=tp.offsetHeight,vw=innerWidth,vh=innerHeight,x,y;
 if(vw>=820){x=r.right+28;y=Math.max(12,Math.min(vh-h-12,r.top+r.height/2-h/2))}
 else{x=(vw-w)/2;y=r.bottom+12;if(y+h>vh-12)y=Math.max(12,vh-h-12)}
 tp.style.left=Math.round(x)+'px';tp.style.top=Math.round(y)+'px'}
function tipShow(k){if(!cw)return;k=(k==null)?-1:k;if(!tp){tp=D.createElement('div');tp.id='crossTip';tp.setAttribute('role','tooltip');D.body.appendChild(tp)}
 clearTimeout(tpT);if(k!==cur||!tp.classList.contains('on')){cur=k;tipBuild(k);tipPos()}tp.classList.add('on');cw.setAttribute('aria-expanded','true');
 cw.querySelectorAll('.hs').forEach(function(e,i){e.classList.toggle('on',i===k)})}
function tipHide(d){clearTimeout(tpT);tpT=setTimeout(function(){tp&&tp.classList.remove('on');cur=-1;cw&&(cw.setAttribute('aria-expanded','false'),cw.querySelectorAll('.hs.on').forEach(function(e){e.classList.remove('on')}))},d||0)}
if(cw){cw.setAttribute('tabindex','0');cw.setAttribute('aria-expanded','false');
 var hov=matchMedia('(hover:hover)').matches;
 HS.forEach(function(h,i){var e=D.createElement('span');e.className='hs';e.tabIndex=0;e.setAttribute('role','button');e.setAttribute('aria-label',(h[(H.lang||'ru').slice(0,2)]||h.en)[0]);
  e.style.cssText='left:'+(h.b[0]/3.8).toFixed(2)+'%;top:'+(h.b[1]/6.96).toFixed(2)+'%;width:'+(h.b[2]/3.8).toFixed(2)+'%;height:'+(h.b[3]/6.96).toFixed(2)+'%';
  if(hov){e.addEventListener('mouseenter',function(){tipShow(i)});e.addEventListener('mouseleave',function(){tipShow(-1)})}
  e.addEventListener('focus',function(){tipShow(i)});
  e.addEventListener('click',function(ev){ev.stopPropagation();cur===i&&tp&&tp.classList.contains('on')&&!hov?tipHide():tipShow(i)});
  cw.appendChild(e)});
 if(hov){cw.addEventListener('mouseenter',function(){tipShow(-1)});cw.addEventListener('mouseleave',function(){tipHide(120)})}
 cw.addEventListener('click',function(e){e.stopPropagation();tp&&tp.classList.contains('on')&&cur===-1?tipHide():tipShow(-1)});
 cw.addEventListener('keydown',function(e){if(e.target===cw&&(e.key==='Enter'||e.key===' ')){e.preventDefault();tp&&tp.classList.contains('on')?tipHide():tipShow(-1)}});
 D.addEventListener('click',function(e){if(tp&&tp.classList.contains('on')&&!e.target.closest('#crossTip'))tipHide()});
 D.addEventListener('keydown',function(e){if(e.key==='Escape')tipHide()});
 var sy0=0;addEventListener('scroll',function(){if(tp&&tp.classList.contains('on')&&Math.abs(scrollY-sy0)>60){sy0=scrollY;tipHide()}},{passive:true});window.__crossTip={show:tipShow,hide:tipHide,isOn:function(){return !!(tp&&tp.classList.contains('on'))},cur:function(){return cur}}}
})();
