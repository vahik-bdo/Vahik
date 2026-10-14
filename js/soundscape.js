/* Живые звуки природы и атмосферы (ремастеринг).
   Всё генерируется на лету, поэтому нет зацикленного «кусочка»: дождь, камин, хор, пианино и метель каждый раз звучат немного по-разному.
   Что даёт «живость»: стерео-шум (разный в левом и правом канале), медленный дрейф громкости и тембра, случайные события
   (капли, искры, порывы, голоса) с разной громкостью и положением в пространстве, настоящая свёрточная реверберация
   (импульс помещения генерируется кодом) и мягкий компрессор на выходе.
   Верните старое звучание: удалите <script src="js/soundscape.js"> из index.html. */
(()=>{
const P=AudioController.prototype,orig=P.build,R=Math.random,rr=(a,b)=>a+R()*(b-a),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const mtof=m=>440*Math.pow(2,(m-69)/12);

/* ---------- общие заготовки (один раз на AudioContext) ---------- */
function kit(au){const c=au.c;if(au._kit&&au._kit.c===c)return au._kit;
 const sr=c.sampleRate,L=Math.floor(sr*12);
 const mk=fn=>{const b=c.createBuffer(2,L,sr);for(let h=0;h<2;h++)fn(b.getChannelData(h),L);return b};
 const pink=mk((d,n)=>{let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;for(let i=0;i<n;i++){const w=R()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926}});
 const brown=mk((d,n)=>{let l=0;for(let i=0;i<n;i++){l=(l+.02*(R()*2-1))/1.02;d[i]=l*3.5}});
 const white=mk((d,n)=>{for(let i=0;i<n;i++)d[i]=R()*2-1});
 /* импульс помещения: затухающий шум, который с течением времени темнеет (как воздух и стены поглощают верха) */
 const ir=(sec,dec,pre)=>{const n=Math.floor(sr*sec),b=c.createBuffer(2,n,sr),p=Math.floor(sr*pre);for(let h=0;h<2;h++){const d=b.getChannelData(h);let lp=0;for(let i=p;i<n;i++){const t=(i-p)/(n-p),a=.65-.6*Math.sqrt(t);lp+=((R()*2-1)-lp)*a;d[i]=lp*Math.pow(1-t,dec)*(1.6)}}return b};
 const bus=c.createGain(),comp=c.createDynamicsCompressor();
 comp.threshold.value=-20;comp.knee.value=24;comp.ratio.value=3;comp.attack.value=.02;comp.release.value=.5;
 const lim=c.createDynamicsCompressor();lim.threshold.value=-3;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.15;
 bus.connect(lim);lim.connect(c.destination);
 return au._kit={c,pink,brown,white,room:ir(.9,2.2,.008),hall:ir(4.8,2.6,.022),bus,lim,comp}}

function scene(au,o,S_TRIM){ /* набор инструментов для одной сцены; o — выход сцены (this.out) */
 const c=au.c,K=kit(au),mix=au.gain(1),comp=c.createDynamicsCompressor();
 comp.threshold.value=-18;comp.knee.value=24;comp.ratio.value=3;comp.attack.value=.02;comp.release.value=.45;
 const trim=au.gain(S_TRIM);mix.connect(comp);comp.connect(trim);trim.connect(o);
 const conv=b=>{const v=c.createConvolver();v.buffer=b;const w=au.gain(1);v.connect(w);w.connect(mix);return v};
 const room=conv(K.room),hall=conv(K.hall);
 const S={c,K,mix,room,hall,
  pan:p=>{if(c.createStereoPanner){const x=c.createStereoPanner();x.pan.value=p;return x}return au.gain(1)},
  nz(buf,gain){const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.start(0,rr(0,10));au.src.push(s);return s},
  send(node,amt,rv){const g=au.gain(amt);node.connect(g);g.connect(rv);return g},
  /* медленное «дыхание» параметра: случайные цели через случайные паузы */
  wander(param,lo,hi,tmin,tmax,tc){const go=()=>{param.setTargetAtTime(rr(lo,hi),c.currentTime,tc);au.timers.push(setTimeout(go,rr(tmin,tmax)))};go()},
  loop(fn,min,max){const go=()=>{fn();au.timers.push(setTimeout(go,typeof min==='function'?min():rr(min,max)))};au.timers.push(setTimeout(go,rr(0,200)))},
  env(g,t,peak,att,dec){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+att+dec)},
  burst(f,q,peak,att,dec,p,wet){ /* короткий щелчок/всплеск шума */
   const t=c.currentTime,s=c.createBufferSource(),b=au.filt('bandpass',f,q),g=au.gain(0),pn=S.pan(p);s.buffer=K.white;
   S.env(g,t,peak,att,dec);s.connect(b);b.connect(g);g.connect(pn);pn.connect(mix);if(wet)S.send(pn,wet,room);s.start(t,rr(0,10),att+dec+.05)},
  tone(f0,f1,dur,peak,p,wet,type){ /* мягкий тон с глиссандо */
   const t=c.currentTime,os=c.createOscillator(),g=au.gain(0),pn=S.pan(p);os.type=type||'sine';os.frequency.setValueAtTime(f0,t);os.frequency.exponentialRampToValueAtTime(f1,t+dur*.4);
   S.env(g,t,peak,.004,dur);os.connect(g);g.connect(pn);pn.connect(mix);if(wet)S.send(pn,wet,hall);os.start(t);os.stop(t+dur+.1)}};
 return S}

/* ---------- сцены ---------- */
const SC=[
/* 0 · ДОЖДЬ: широкий шум-фон, далёкая стена воды, мягкий низ, отдельные капли и плюхи, редкий далёкий гром */
function(au,S,K){const {mix,room,hall}=S,c=S.c;
 const bed=S.nz(K.pink),g1=au.gain(.12);au.chain(bed,[au.filt('highpass',480),au.filt('lowpass',7600),(()=>{const x=au.filt('peaking',3200,.8);x.gain.value=3;return x})(),g1],mix);S.send(g1,.14,room);S.wander(g1.gain,.075,.17,7000,15000,3.5);
 const wash=S.nz(K.pink),g2=au.gain(.09);au.chain(wash,[au.filt('bandpass',1300,.4),g2],mix);S.wander(g2.gain,.04,.13,5000,12000,3);
 const low=S.nz(K.brown),g3=au.gain(.22);au.chain(low,[au.filt('lowpass',210),g3],mix);S.wander(g3.gain,.14,.30,8000,18000,4);
 let heat=1;S.wander({setTargetAtTime(v){heat=v}},.45,1.7,9000,20000,0);
 S.loop(()=>{const v=rr(.03,.15)*(R()<.12?2.2:1);S.burst(rr(1800,6800),rr(3,9),v,.002,rr(.018,.065),rr(-.9,.9),.1)},()=>rr(28,110)/heat);
 S.loop(()=>{const f=rr(650,1900);S.tone(f*.72,f,rr(.07,.14),rr(.025,.06),rr(-.8,.8),.35)},1100,4200);
 const thunder=()=>{const t=c.currentTime,s=S.nz(K.brown),lp=au.filt('lowpass',rr(70,130)),g=au.gain(0),pn=S.pan(rr(-.6,.6));
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(rr(.18,.3),t+rr(1.2,2.2));g.gain.setTargetAtTime(0,t+rr(2.5,3.5),rr(1.4,2.2));
  au.chain(s,[lp,g,pn],mix);S.send(pn,.4,hall);au.timers.push(setTimeout(()=>{try{s.stop();s.disconnect()}catch(e){}},14000))};
 au.timers.push(setTimeout(function again(){thunder();au.timers.push(setTimeout(again,rr(45000,110000)))},rr(18000,50000)))},

/* 1 · КАМИН: дыхание огня, шорох пламени, россыпь трескa разной силы, редкие «осадки» поленьев */
function(au,S,K){const {mix,room}=S,c=S.c;
 const roar=S.nz(K.brown),g1=au.gain(.3);au.chain(roar,[au.filt('lowpass',380),g1],mix);S.wander(g1.gain,.22,.4,1500,4200,1.2);
 const flick=S.nz(K.pink),f2=au.filt('bandpass',720,.7),g2=au.gain(.06);au.chain(flick,[f2,g2],mix);S.wander(g2.gain,.02,.11,500,1700,.35);S.wander(f2.frequency,500,1100,700,2200,.5);
 const hiss=S.nz(K.pink),g3=au.gain(.02);au.chain(hiss,[au.filt('bandpass',2800,.6),g3],mix);S.wander(g3.gain,.008,.04,1200,3500,.9);
 let heat=1;S.wander({setTargetAtTime(v){heat=v}},.5,1.7,3500,9000,0);
 S.loop(()=>{const r=R(),p=rr(-.75,.75);
  if(r<.62)S.burst(rr(2500,8000),1.2,rr(.07,.3),.0015,rr(.006,.018),p,.08);
  else if(r<.89){S.burst(rr(900,2800),1.5,rr(.22,.55),.0015,rr(.02,.05),p,.1);S.tone(rr(100,150),60,.07,.09,p,0)}
  else{S.burst(rr(500,1400),.8,rr(.45,.8),.002,rr(.06,.12),p,.14);S.tone(rr(62,85),42,.13,.2,p,0);for(let k=0;k<1+Math.floor(R()*3);k++)au.timers.push(setTimeout(()=>S.burst(rr(1800,5200),1.3,rr(.1,.28),.0015,.012,p+rr(-.2,.2),.08),rr(15,70)*(k+1)))}},()=>rr(26,170)/heat);
 S.loop(()=>{const t=c.currentTime,s=S.nz(K.brown),g=au.gain(0),pn=S.pan(rr(-.4,.4));S.env(g,t,rr(.35,.6),.04,rr(.3,.5));au.chain(s,[au.filt('lowpass',rr(160,260)),g,pn],mix);au.timers.push(setTimeout(()=>{try{s.stop();s.disconnect()}catch(e){}},1500))},7000,20000)},

/* 2 · ХОР: живые голоса — пила + форманты (гласные «а-о-у-э» плавно переходят друг в друга), вибрато, большой зал */
function(au,S,K){const {mix,hall}=S,c=S.c;
 const V={a:[800,1150,2900],o:[450,800,2830],u:[325,700,2530],e:[400,1600,2700]},VK=Object.keys(V);
 const breath=S.nz(K.pink),bg=au.gain(.006);au.chain(breath,[au.filt('bandpass',1700,.7),bg],mix);S.wander(bg.gain,.003,.011,3000,8000,2);
 const CH=[[38,50,57,62,65,69],[34,46,53,58,62,65],[41,53,57,60,65,69],[36,48,55,60,64,67],[43,55,58,62,67,70],[38,50,57,62,65,69],[45,57,61,64,69,73],[38,50,57,62,65,69]];let k=0;
 const voice=(f,t,dur,p)=>{const m=au.gain(1),att=rr(3.2,4.6),rel=rr(4.5,6),end=t+dur;
  const o1=c.createOscillator(),o2=c.createOscillator(),lfo=c.createOscillator(),ld=au.gain(f*rr(.0035,.006));
  o1.type=o2.type='sawtooth';o1.frequency.value=f;o2.frequency.value=f*(1+rr(.002,.005));lfo.frequency.value=rr(4.6,5.8);
  lfo.connect(ld);ld.connect(o1.frequency);ld.connect(o2.frequency);const og=au.gain(.5);o1.connect(og);o2.connect(og);og.connect(m);
  const out=au.gain(0),pn=S.pan(p);out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.3,t+att);out.gain.setValueAtTime(.3,end-rel);out.gain.linearRampToValueAtTime(0,end);
  let v=V[VK[Math.floor(R()*4)]];[[0,1],[1,.6],[2,.25]].forEach(([j,w])=>{const b=au.filt('bandpass',v[j],j?9:6),g=au.gain(w);m.connect(b);b.connect(g);g.connect(out);
   for(let s=t+rr(2,5);s<end-2;s+=rr(3,6)){b.frequency.setTargetAtTime(V[VK[Math.floor(R()*4)]][j],s,rr(.6,1.4))}});
  out.connect(pn);pn.connect(mix);S.send(pn,.55,hall);[o1,o2,lfo].forEach(x=>{x.start(t);x.stop(end+.2)})};
 const chord=()=>{const t=c.currentTime+.05,ch=CH[k++%CH.length];ch.forEach((m,j)=>voice(mtof(m)*(R()<.5?1:1.001),t+rr(0,1.4),rr(13,16),(j/(ch.length-1)-.5)*1.4+rr(-.15,.15)))};
 chord();au.timers.push(setInterval(chord,11500))},

/* 3 · КЛАССИКА: пианино с настоящим спадом обертонов, стуком молоточка, педалью (зал) и живым темпом */
function(au,S,K){const {mix,hall,room}=S,c=S.c;
 const note=(f,vel,p)=>{const t=c.currentTime,T=clamp(5.6-Math.log2(f/110)*.95,1.5,5.6),lp=au.filt('lowpass',1500+vel*5200,.4),out=au.gain(1),pn=S.pan(p);
  [1,.62,.34,.2,.11].forEach((a,i)=>{const n=i+1,os=c.createOscillator(),g=au.gain(0),T2=T/(1+.85*i);os.frequency.value=f*n*Math.sqrt(1+.0003*n*n)*(1+rr(-.0006,.0006));
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a*vel*.26,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+T2);os.connect(g);g.connect(lp);os.start(t);os.stop(t+T2+.05)});
  S.burst(clamp(f*3,400,3500),.9,vel*.05,.001,.012,p,0);lp.connect(out);out.connect(pn);pn.connect(mix);S.send(pn,.5,hall);S.send(pn,.1,room)};
 const m3=[0,3,7],M3=[0,4,7],PR=[[0,m3],[-4,M3],[3,M3],[-2,M3],[5,m3],[0,m3],[7,M3],[0,m3]];let k=0;
 const bar=()=>{const [r,iv]=PR[k++%PR.length],root=38+r,tones=[];for(let o=0;o<3;o++)iv.forEach(x=>tones.push(root+12*o+x+12));
  const beat=rr(.4,.58);let t=0;note(mtof(root),.55,-.35);if(R()<.7)setTimeout(()=>note(mtof(root+12),.4,-.2),rr(40,90));
  const len=6+Math.floor(R()*3);let i=Math.floor(R()*3),dir=1;
  for(let n=0;n<len;n++){t+=beat*rr(.82,1.2)*1000;i=clamp(i+dir*(R()<.75?1:2),0,tones.length-1);if(i===tones.length-1||i===0||R()<.2)dir*=-1;
   if(R()<.12)t+=beat*1000;const m=tones[i],v=rr(.35,.7);au.timers.push(setTimeout(()=>note(mtof(m),v,clamp((m-60)/30,-.6,.6)),t))}
  if(R()<.55)au.timers.push(setTimeout(()=>note(mtof(root+12*2+iv[Math.floor(R()*3)]),.5,.3),t+beat*900));
  au.timers.push(setTimeout(bar,t+beat*1800*rr(1,1.5)))};
 bar()},

/* 4 · МЕТЕЛЬ: широкий ветер, низкий гул, порывы с перемещением слева направо, свистящие провода, звенящий снег */
function(au,S,K){const {mix,hall}=S,c=S.c;
 const bed=S.nz(K.pink),g1=au.gain(.22);au.chain(bed,[au.filt('lowpass',820),g1],mix);S.wander(g1.gain,.11,.34,3000,7000,2);
 const low=S.nz(K.brown),g2=au.gain(.34);au.chain(low,[au.filt('lowpass',150),g2],mix);S.wander(g2.gain,.22,.44,4000,9000,2.5);
 [[0,1],[1,-1]].forEach(([i,sd])=>{const gs=S.nz(K.pink),bp=au.filt('bandpass',700,.7),g=au.gain(.3),pn=S.pan(sd*.5);au.chain(gs,[bp,g,pn],mix);S.send(pn,.2,hall);
  S.wander(bp.frequency,330,1500,3500,8000,2);S.wander(g.gain,.06,.7,3500,8000,1.8);S.wander(pn.pan||{setTargetAtTime(){}},-.9,.9,4000,9000,2.4)});
 [[900,14,.17],[1500,20,.13],[2400,26,.09]].forEach(([f0,q,v])=>{const w=S.nz(K.white),b=au.filt('bandpass',f0,q),g=au.gain(v),pn=S.pan(rr(-.8,.8));au.chain(w,[b,g,pn],mix);S.send(pn,.3,hall);
  S.wander(b.frequency,f0*.6,f0*1.5,3000,7500,2.5);S.wander(g.gain,v*.15,v*1.5,3000,7500,2.6);S.wander(pn.pan||{setTargetAtTime(){}},-.9,.9,4000,9000,3)});
 S.loop(()=>S.burst(rr(4500,9000),1,rr(.008,.03),.003,rr(.01,.03),rr(-.9,.9),.2),60,240)}
];

P.build=function(i){if(i>=SC.length)return orig.call(this,i);const au=this,S=scene(au,au.out,[1.3,1,1,1,1][i]);SC[i](au,S,S.K)};

/* ---------- ремастеринг разовых звуков: ветер, птицы, гром ---------- */
function outbus(au){const c=au.c,K=kit(au);if(!K.fin){const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=20;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.3;comp.connect(K.lim);
 const mk=b=>{const v=c.createConvolver();v.buffer=b;v.connect(comp);return v};K.fin={comp,hall:mk(K.hall),room:mk(K.room)}}return K.fin}
window.NTRemaster=(au,g,k)=>{const c=au.c,F=outbus(au),wet={wind:.3,birds:.24,bolt:.38}[k]||.2;
 if(k==='bolt'){g.connect(F.comp)}
 else{const m=c.createChannelMerger(2),d=c.createDelay(.05),lp=c.createBiquadFilter();d.delayTime.value=.013;lp.type='lowpass';lp.frequency.value=9000;
  g.connect(m,0,0);g.connect(d);d.connect(lp);lp.connect(m,0,1);m.connect(F.comp)}
 const s=c.createGain();s.gain.value=wet;g.connect(s);s.connect(k==='birds'?F.room:F.hall)};
/* живой слой поверх записи: щебет птиц, дополнительный порыв ветра, длинный раскат после грома */
window.NTLive=(au,k,dur)=>{const c=au.c,K=kit(au),F=outbus(au),hall=F.hall,room=F.room;
 const out=(node,p,wet)=>{const pn=c.createStereoPanner?c.createStereoPanner():c.createGain();if(pn.pan)pn.pan.value=p;node.connect(pn);pn.connect(F.comp);const w=c.createGain();w.gain.value=wet;pn.connect(w);w.connect(room)};
 const chirp=(f0,f1,len,v,p,vib)=>{const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f1,t+len);
  if(vib){const l=c.createOscillator(),ld=c.createGain();l.frequency.value=vib;ld.gain.value=f0*.03;l.connect(ld);ld.connect(o.frequency);l.start(t);l.stop(t+len+.05)}
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);out(g,p,.35);o.start(t);o.stop(t+len+.05)};
 if(k==='birds'){const n=7+Math.floor(R()*4);for(let i=0;i<n;i++)setTimeout(()=>{const p=rr(-.85,.85),base=rr(2600,5600),ty=R();
   if(ty<.4){const m=3+Math.floor(R()*3),d=rr(.07,.12);for(let j=0;j<m;j++)setTimeout(()=>chirp(base*rr(.95,1.05),base*rr(.75,1.25),d,rr(.025,.05),p),j*d*1000*1.5)}
   else if(ty<.75){const m=10+Math.floor(R()*8);for(let j=0;j<m;j++)setTimeout(()=>chirp(base*1.1,base*1.02,.03,rr(.012,.025),p),j*42)}
   else{const f=rr(1700,2500);chirp(f,f*1.35,.32,.04,p,rr(18,26));setTimeout(()=>chirp(f*1.35,f*.9,.4,.035,p,rr(18,26)),380)}},rr(0,Math.max(.5,dur-1.5))*1000)}
 else if(k==='wind'){const t=c.currentTime,s=c.createBufferSource(),b=c.createBiquadFilter(),g=c.createGain(),pn=c.createStereoPanner?c.createStereoPanner():c.createGain();
  s.buffer=K.pink;s.loop=true;b.type='bandpass';b.Q.value=.7;b.frequency.setValueAtTime(300,t);b.frequency.linearRampToValueAtTime(900,t+dur*.45);b.frequency.linearRampToValueAtTime(380,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);if(pn.pan){pn.pan.setValueAtTime(-.7,t);pn.pan.linearRampToValueAtTime(.7,t+dur)}
  s.connect(b);b.connect(g);g.connect(pn);pn.connect(F.comp);const w=c.createGain();w.gain.value=.3;pn.connect(w);w.connect(hall);s.start(t,rr(0,10));s.stop(t+dur+.1)}
 else if(k==='bolt'){const t=c.currentTime+.5,s=c.createBufferSource(),lp=c.createBiquadFilter(),g=c.createGain();s.buffer=K.brown;s.loop=true;lp.type='lowpass';lp.frequency.value=95;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.6);g.gain.setTargetAtTime(0,t+1.4,Math.max(.8,dur*.28));s.connect(lp);lp.connect(g);g.connect(hall);g.connect(F.comp);s.start(t,rr(0,10));s.stop(t+dur+3)}};
})();
