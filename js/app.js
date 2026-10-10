'use strict';
/* lazy-load of sound files: assets/audio/*.js (works from file:// and from a server) */
const NTAudioSrc=(k,src)=>/^data:/.test(src)?Promise.resolve(src):new Promise((ok,no)=>{window.NTAUDIO=window.NTAUDIO||{};if(NTAUDIO[k])return ok(NTAUDIO[k]);const s=document.createElement('script');s.src=src;s.onload=()=>NTAUDIO[k]?ok(NTAUDIO[k]):no();s.onerror=no;document.head.appendChild(s)});
const $=s=>document.querySelector(s);

class State{
  static KEY='theo-reader-v1';
  static def={theme:'dark-black',font:'Literata',size:20,particles:'rain',track:0,vol:.4,click:true,mode:'full',notes:[],secs:0,lsize:340,lcolor:'',bg:'glow',lang:/^hy/.test(navigator.language)?'hy':/^ru/.test(navigator.language)?'ru':/^de/.test(navigator.language)?'de':'en',color:'',head:'#8fd3c8',light:false,calm:false,candle:false};
  constructor(){let s={};try{s=JSON.parse(localStorage.getItem(State.KEY))||{}}catch(e){}this.d={...State.def,...s}}
  set(k,v){this.d[k]=v;this.save()}
  save(){try{localStorage.setItem(State.KEY,JSON.stringify(this.d))}catch(e){}}
}

class ParticleEngine{
  constructor(c){this.c=c;this.x=c.getContext('2d');this.mode='off';this.p=[];this.s=[];this.t=0;addEventListener('resize',()=>this.fit());this.fit();requestAnimationFrame(t=>this.loop(t))}
  fit(){const r=Math.min(devicePixelRatio||1,2);this.W=innerWidth;this.H=innerHeight;this.c.width=this.W*r;this.c.height=this.H*r;this.x.setTransform(r,0,0,r,0,0);this.seed()}
  seed(){const n=(({snow:170,rain:130,incense:70}[this.mode]||0)*(this.q||1))|0;this.p=Array.from({length:n},()=>this.make(true))}
  sprite(dark){this.sc=this.sc||{};const k=dark?1:0;if(this.sc[k])return this.sc[k];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32),col=dark?'235,243,255':'110,130,165';[[0,1],[.25,.75],[.6,.18],[1,0]].forEach(([o,a])=>gr.addColorStop(o,`rgba(${col},${a})`));g.fillStyle=gr;g.fillRect(0,0,64,64);return this.sc[k]=c}
  spark(x,y){if(this.s.length<80)this.s.push({x:x+Math.random()*10-5,y,vx:(Math.random()-.5)*.6,vy:-.4-Math.random()*.9,l:1,r:.8+Math.random()*1.6})}
  setMode(m){this.mode=m;this.seed()}
  make(init){const W=this.W,H=this.H,r=Math.random;
    if(this.mode==='snow'){const z=r(),L=z<.5?0:z<.85?1:2,P=[[.8,1.6,.35,.7,.3,.6],[1.8,3.2,.8,1.4,.55,.85],[4,8,1.8,2.6,.25,.5]][L];return{L,x:r()*(W+200)-100,y:init?r()*H:-14,s:P[0]+r()*(P[1]-P[0]),v:P[2]+r()*(P[3]-P[2]),a:P[4]+r()*(P[5]-P[4]),ph:r()*6.28,d:.5+r()*1.2,sw:.2+r()*.5}}
    if(this.mode==='rain')return{x:r()*(W+200),y:init?r()*H:-40,l:14+r()*22,v:14+r()*10,a:.15+r()*.3};
    return{x:r()*W,y:init?r()*H:H+10,s:.8+r()*2.2,v:.25+r()*.6,ph:r()*6.28,f:.5+r()*2}}
  loop(t){const x=this.x,W=this.W,H=this.H,dark=!['warm-parchment','ice'].includes(document.documentElement.dataset.theme);
    x.clearRect(0,0,W,H);this.t=t/1000;
    this.fr=(this.fr||0)+1;if(this.fr%60===1)this.gold=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();const gold=this.gold;
    for(const q of this.p){
      if(this.mode==='snow'){const wd=(Math.sin(this.t*.13)*.7+Math.sin(this.t*.41)*.35+.15)*(.5+q.L*.5);q.y+=q.v;q.x+=wd+Math.sin(this.t*q.d+q.ph)*q.sw*(q.L+1)*.5;x.globalAlpha=q.a;const R=q.s*2.4;x.drawImage(this.sprite(dark),q.x-R,q.y-R,R*2,R*2);x.globalAlpha=1;if(q.y>H+20||q.x>W+120||q.x<-120)Object.assign(q,this.make())}
      else if(this.mode==='rain'){q.y+=q.v;q.x-=q.v*.22;x.strokeStyle=dark?`rgba(170,195,235,${q.a})`:`rgba(70,90,130,${q.a+.1})`;x.lineWidth=1;x.beginPath();x.moveTo(q.x,q.y);x.lineTo(q.x+q.l*.22,q.y-q.l);x.stroke();if(q.y>H+40)Object.assign(q,this.make())}
      else if(this.mode==='incense'){q.y-=q.v;q.x+=Math.sin(this.t*.7+q.ph+q.y*.01)*.6;const a=.35+.55*Math.abs(Math.sin(this.t*q.f+q.ph)),g=x.createRadialGradient(q.x,q.y,0,q.x,q.y,q.s*5);x.globalAlpha=a*(q.y<H*.25?q.y/(H*.25):1);g.addColorStop(0,gold);g.addColorStop(1,'transparent');x.fillStyle=g;x.beginPath();x.arc(q.x,q.y,q.s*5,0,6.28);x.fill();x.globalAlpha=1;if(q.y<-10)Object.assign(q,this.make())}
    }
    for(let i=this.s.length-1;i>=0;i--){const q=this.s[i];q.x+=q.vx+Math.sin(this.t*3+i)*.2;q.y+=q.vy;q.l-=.014;if(q.l<=0){this.s.splice(i,1);continue}x.globalAlpha=q.l*.85;x.fillStyle=gold;x.beginPath();x.arc(q.x,q.y,q.r,0,6.28);x.fill()}x.globalAlpha=1;
    requestAnimationFrame(t=>this.loop(t))}
}

class AudioController{
  static TRACKS=[{n:'Дождь'},{n:'Камин'},{n:'Хор'},{n:'Классика'},{n:'Метель'},{n:'Свой трек'}];
  constructor(st){this.st=st;this.ctx=null;this.timers=[];this.src=[];this.out=null;this.playing=false}
  get c(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.st.d.vol;this.master.connect(this.ctx.destination)}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx}
  noise(brown){const c=this.c,n=c.sampleRate*4,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(brown){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w}const s=c.createBufferSource();s.buffer=b;s.loop=true;s.start();this.src.push(s);return s}
  chain(src,nodes,dest){let p=src;for(const n of nodes){p.connect(n);p=n}p.connect(dest);return p}
  filt(t,f,q=.7){const x=this.c.createBiquadFilter();x.type=t;x.frequency.value=f;x.Q.value=q;return x}
  gain(v){const g=this.c.createGain();g.gain.value=v;return g}
  every(fn,min,max){const go=()=>{fn();this.timers.push(setTimeout(go,min+Math.random()*(max-min)))};go()}
  reverb(dest){const c=this.c,i=this.gain(1),d=c.createDelay(1),fb=this.gain(.42),lp=this.filt('lowpass',1800),w=this.gain(.5);d.delayTime.value=.37;i.connect(dest);i.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(w);w.connect(dest);return i}
  note(f,dur,v,dest,type='sine'){const c=this.c,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.1)}
  build(i){const c=this.c,o=this.out;
    if(i===0){ // дождь
      this.chain(this.noise(),[this.filt('highpass',900),this.filt('lowpass',7000),this.gain(.16)],o);
      this.chain(this.noise(1),[this.filt('lowpass',300),this.gain(.35)],o);
      this.every(()=>this.note(1400+Math.random()*1800,.12,.025,o),250,900)}
    else if(i===1){ // камин
      this.chain(this.noise(1),[this.filt('lowpass',420),this.gain(.7)],o);
      this.every(()=>{const t=c.currentTime,b=this.noise(),g=this.gain(0),h=this.filt('bandpass',1500+Math.random()*2500,1.5);b.connect(h);h.connect(g);g.connect(o);g.gain.setValueAtTime(.2+Math.random()*.3,t);g.gain.exponentialRampToValueAtTime(.0001,t+.04+Math.random()*.05);setTimeout(()=>{try{b.stop();b.disconnect()}catch(e){}},300)},90,520)}
    else if(i===2){ // хор / эмбиент-пад
      const rv=this.reverb(o),lp=this.filt('lowpass',1100);lp.connect(rv);
      const ch=[[146.8,220,293.7,349.2],[116.5,174.6,233.1,293.7],[174.6,261.6,349.2,440],[130.8,196,261.6,329.6]];let k=0;
      const pad=()=>{const t=c.currentTime;ch[k++%4].forEach((f,j)=>{[0,.4,-.4].forEach(dt=>{const os=c.createOscillator(),g=c.createGain();os.type=j%2?'triangle':'sine';os.frequency.value=f*(1+dt/100);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025,t+3);g.gain.linearRampToValueAtTime(.0001,t+8.5);os.connect(g);g.connect(lp);os.start(t);os.stop(t+9)})})};
      pad();this.timers.push(setInterval(pad,7000))}
    else if(i===4){ // метель со свистом ветра
      this.chain(this.noise(),[this.filt('lowpass',900),this.gain(.4)],o);this.chain(this.noise(1),[this.filt('lowpass',160),this.gain(.55)],o);
      const gust=this.gain(.6),wf=this.filt('bandpass',500,.6),wn=this.noise();gust.connect(o);wn.connect(wf);wf.connect(gust);
      const whistle=(f0,q,v)=>{const w=this.noise(),b=this.filt('bandpass',f0,q),g=this.gain(v);w.connect(b);b.connect(g);g.connect(o);const go=()=>{const t=c.currentTime;b.frequency.setTargetAtTime(f0*(.6+Math.random()*1.3),t,2+Math.random()*2);g.gain.setTargetAtTime(v*(.2+Math.random()*1.4),t,2.5)};go();this.timers.push(setInterval(go,3500+Math.random()*3000))};
      whistle(900,14,.2);whistle(1500,20,.15);whistle(2400,26,.1);
      const gu=()=>{const t=c.currentTime;gust.gain.setTargetAtTime(.15+Math.random()*1.1,t,1.8);wf.frequency.setTargetAtTime(350+Math.random()*900,t,2.2)};gu();this.timers.push(setInterval(gu,4000))}
    else if(i===5){ // свой файл (например, Seeing Is Believing)
      if(!this.file)return;const a=new Audio(URL.createObjectURL(this.file));a.loop=true;this.c.createMediaElementSource(a).connect(o);a.play();this.src.push({stop(){a.pause()}})}
    else{ // классика: тихое пианино-арпеджио
      const rv=this.reverb(o),sc=[146.8,174.6,220,261.6,293.7,349.2,440,523.3];let n=2;
      this.every(()=>{n=Math.max(0,Math.min(7,n+Math.round(Math.random()*4-2)));const f=sc[n];this.note(f,2.4,.07,rv);this.note(f*2,1.2,.015,rv);if(Math.random()<.2)this.note(sc[0]/2,3,.06,rv)},650,1500)}}
  start(i){this.stop();const c=this.c;this.out=c.createGain();this.out.gain.value=0;this.out.connect(this.master);this.out.gain.setTargetAtTime(1,c.currentTime,1.6);this.build(i);this.playing=true}
  stop(){this.timers.forEach(t=>{clearTimeout(t);clearInterval(t)});this.timers=[];const o=this.out,s=this.src;this.out=null;this.src=[];this.playing=false;if(!o)return;o.gain.cancelScheduledValues(0);o.gain.setTargetAtTime(0,this.c.currentTime,1.3);setTimeout(()=>{s.forEach(x=>{try{x.stop()}catch(e){}});o.disconnect()},8000)}
  load(i){this.st.set('track',i);this.start(i)}
  toggle(){this.playing?this.stop():this.start(this.st.d.track);return this.playing}
  vol(v){this.st.set('vol',v);if(this.master)this.master.gain.value=v}
  click(){ // очень мягкая капля: низкий синус, плавная атака, быстрое затухание
    if(!this.st.d.click)return;
    const c=this.c,t=c.currentTime,o=c.createOscillator(),g=c.createGain(),f=this.filt('lowpass',650,.3),b=360+Math.random()*60;
    o.type='sine';o.frequency.setValueAtTime(b,t);o.frequency.exponentialRampToValueAtTime(b*.6,t+.25);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.4);
    o.connect(f);f.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.45)}
}

class LightController{
  constructor(st,fx){this.st=st;this.fx=fx;this.el=$('#light');this.vs=$('#veil').style;this.x=this.tx=innerWidth/2;this.y=this.ty=innerHeight/3;this.on=st.d.light!==false;
    addEventListener('pointermove',e=>{this.tx=e.clientX;this.ty=e.clientY;if(this.on){this.el.style.opacity=1;if(Math.random()<.3)fx.spark(e.clientX,e.clientY)}},{passive:true});
    document.documentElement.addEventListener('mouseleave',()=>this.el.style.opacity=0);
    $('#lt').onclick=()=>this.toggle();this.cd=!!st.d.candle;$('#cd').onclick=()=>{this.cd=!this.cd;this.st.set('candle',this.cd);this.apply()};this.apply();requestAnimationFrame(t=>this.loop(t))}
  loop(t){this.x+=(this.tx-this.x)*.1;this.y+=(this.ty-this.y)*.1;const f=1+Math.sin(t/230)*.03+Math.sin(t/97)*.02;this.el.style.transform=`translate3d(${this.x}px,${this.y}px,0) translate(-50%,-50%) scale(${f})`;if(this.cd){const V=this.vs;V.setProperty('--lx',this.x+'px');V.setProperty('--ly',this.y+'px');V.setProperty('--lr',(this.st.d.lsize*.8*f)+'px')}requestAnimationFrame(t=>this.loop(t))}
  toggle(){this.on=!this.on;this.st.set('light',this.on);this.apply()}
  apply(){this.el.style.display=this.on?'block':'none';$('#lt').classList.toggle('on',this.on);$('#lt').textContent=tr('light')+': '+tr(this.on?'on':'off');document.body.classList.toggle('candle',this.cd);$('#cd').classList.toggle('on',this.cd);$('#cd').textContent=tr('candle')+': '+tr(this.cd?'on':'off')}
}

class SelectionHandler{
  constructor(st,ui){this.st=st;this.ui=ui;this.btn=$('#sel');this.range=null;
    const chk=()=>setTimeout(()=>this.check(),10);
    $('#text').addEventListener('mouseup',chk);$('#text').addEventListener('touchend',chk);
    document.addEventListener('selectionchange',()=>{if(getSelection().isCollapsed)this.btn.style.display='none'});
    this.btn.addEventListener('mousedown',e=>e.preventDefault());
    this.btn.addEventListener('click',()=>this.open());
    $('#mc').onclick=()=>$('#modal').classList.remove('open');
    $('#ms').onclick=()=>this.save();}
  check(){const s=getSelection();if(s.isCollapsed||s.toString().trim().length<3)return;
    this.range=s.getRangeAt(0);this.text=s.toString().trim();
    const r=this.range.getBoundingClientRect();
    this.btn.style.display='block';this.btn.style.left=(r.left+r.width/2+scrollX)+'px';this.btn.style.top=(r.top+scrollY)+'px'}
  newNote(){this.text='';this.open()}
  open(){$('#mq').textContent=this.text?'«'+this.text+'»':'';$('#mt').value='';$('#modal').classList.add('open');this.btn.style.display='none';setTimeout(()=>$('#mt').focus(),50)}
  save(){const body=$('#mt').value.trim();if(!body)return;
    this.st.d.notes.push({id:Date.now(),q:this.text,t:body});this.st.save();
    $('#modal').classList.remove('open');getSelection().removeAllRanges();this.ui.renderNotes();this.ui.toast&&0}
}

class UIManager{
  constructor(st,fx,au){this.st=st;this.fx=fx;this.au=au;this.idleT=null;this.init()}
  init(){
    const d=this.st.d,R=document.documentElement;
    const themes=[['blue-dark','#070b14'],['dark-black','#000'],['nardo-grey','#4a4c50'],['warm-parchment','#f4ebd8'],['forest','#08130e'],['bordeaux','#16080d'],['dusk','#120d1f'],['ice','#e3ecf3']];
    $('#themes').innerHTML=themes.map(([k,c])=>`<div class="sw" role="button" tabindex="0" aria-label="${k}" data-th="${k}" style="background:${c}"></div>`).join('');
    $('#themes').onclick=e=>{const t=e.target.dataset.th;if(t)this.theme(t)};
    $('#parts').onclick=e=>{const p=e.target.dataset.p;if(p)this.part(p)};
    $('#tracks').onclick=e=>{const i=e.target.dataset.i;if(+i===5&&!this.au.file){$('#af').click();return}if(i!==undefined){this.au.load(+i);this.sync();this.mark()}};
    const mk=(id,key,list)=>{const el=$(id);el.innerHTML=list.map(v=>v?`<div class="sw" role="button" tabindex="0" aria-label="${v}" data-c="${v}" style="background:${v}"></div>`:'<button class="btn" data-c="" data-t="auto">Авто</button>').join('')+'<input type="color" value="#e0c27a" data-ta="a_cc">';el.onclick=e=>{if(e.target.dataset.c!==undefined)this.color(key,e.target.dataset.c)};el.querySelector('input').oninput=e=>this.color(key,e.target.value)};
    mk('#colors','color',['','#f1e9d2','#e0c27a','#bcd4f5','#b9cdb0','#e3b9b3','#2e2518']);
    mk('#heads','head',['','#f0cf7a','#c9a0dc','#8fd3c8','#e8836b','#9fb8ff','#8c5a1c']);
    mk('#lcolors','lcolor',['','#ffd27a','#ffffff','#8fb8ff','#ff9a76','#b08cff']);
    $('#bgs').onclick=e=>{const b=e.target.dataset.b;if(b)this.bg(b)};$('#ls').oninput=e=>this.lsize(+e.target.value);
    document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>this.tab(b.dataset.tab));
    $('#lb').onclick=e=>{e.stopPropagation();$('#lm').classList.toggle('open')};document.addEventListener('click',()=>$('#lm').classList.remove('open'));
    $('#lm').onclick=e=>{const l=e.target.dataset.l;if(l){this.st.set('lang',l);this.i18n()}};
    $('#cm').onclick=()=>this.calm(!this.st.d.calm);
    $('#af').onchange=e=>{const f=e.target.files[0];if(f){this.au.file=f;this.au.load(5);this.sync();this.mark()}};
    const pr=$('#prayer');wr($('#pt'));wr($('#bl'));
    let prayed=false;try{prayed=!!sessionStorage.getItem('prayed')}catch(e){}const startPrayer=()=>setTimeout(()=>{$('#pt').classList.add('in');pr.classList.add('go')},700);let needLang=false;try{needLang=!localStorage.getItem('langChosen')}catch(e){}if(prayed)pr.classList.add('off');else if(needLang)addEventListener('langchosen',startPrayer,{once:true});else startPrayer();
    $('#pb').onclick=()=>{pr.classList.add('off');try{sessionStorage.setItem('prayed',1)}catch(e){}};$('#pr').onclick=()=>{$('#panel').classList.remove('open');pr.classList.remove('off')};
    $('#fonts').innerHTML=Object.keys(FONTS).map(k=>`<button class="btn" data-font="${k}" style="font-family:${FONTS[k]}">${k}</button>`).join('');$('#fonts').onclick=e=>{const b=e.target.closest('[data-font]');if(b)this.font(b.dataset.font)};
    $('#fs').oninput=e=>this.size(+e.target.value);
    $('#vol').oninput=e=>this.au.vol(+e.target.value);
    $('#play').onclick=()=>{this.au.toggle();this.sync()};
    $('#clk').onclick=()=>{this.st.set('click',!this.st.d.click);this.mark()};
    const tg=id=>['panel','npanel','ppanel','hpanel'].forEach(k=>{const e=$('#'+k);e.classList.toggle('open',k===id&&!e.classList.contains('open'))});$('#bSet').onclick=()=>tg('panel');$('#bNotes').onclick=()=>tg('npanel');$('#bPr').onclick=()=>tg('ppanel');$('#bHeart').onclick=()=>tg('hpanel');$('#dt').onclick=()=>{const o=$('#dock').classList.toggle('open');if(!o)['panel','npanel','ppanel','hpanel'].forEach(k=>$('#'+k).classList.remove('open'))};$('#fb').onclick=e=>{e.stopPropagation();const o=$('#fold').classList.toggle('open');$('#fb').setAttribute('aria-expanded',o)};document.addEventListener('click',e=>{const f=$('#fold');if(f.classList.contains('open')&&!f.contains(e.target)){f.classList.remove('open');$('#fb').setAttribute('aria-expanded',false)}});
    this.color('lcolor',d.lcolor);this.bg(d.bg);this.lsize(d.lsize);this.tab('view');this.color('color',d.color);this.color('head',d.head);this.calm(!!d.calm);this.theme(d.theme);this.font(d.font);this.size(d.size);this.part(d.particles);this.mode('full');document.querySelectorAll('.mode button').forEach(b=>b.onclick=()=>this.mode(b.dataset.m));this.mark();
    $('#vol').value=d.vol;this.renderNotes();
    // Появление глав
    this.io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');this.io.unobserve(e.target);if(e.target.id==='end')setTimeout(()=>$('#bl').classList.add('in'),3200)}}),{threshold:.12});
    document.querySelectorAll('.hero,.end').forEach(n=>this.io.observe(n));
    // Ripple + клик
    addEventListener('pointerdown',e=>{if(e.target.closest('#modal textarea'))return;this.au.click()});
    // Zen
    const wake=()=>{document.body.classList.remove('idle');clearTimeout(this.idleT);this.idleT=setTimeout(()=>document.body.classList.add('idle'),3000)};
    ['mousemove','touchstart','scroll','keydown'].forEach(ev=>addEventListener(ev,wake,{passive:true}));wake();
    // Позиция чтения
    let pos=0;try{pos=+localStorage.getItem('theo-pos')||0}catch(e){}if(pos)setTimeout(()=>scrollTo({top:pos}),300);
    let pt;addEventListener('scroll',()=>{clearTimeout(pt);pt=setTimeout(()=>{try{localStorage.setItem('theo-pos',scrollY)}catch(e){}},250)},{passive:true});
  }
  mode(m){document.body.dataset.mode=m;this.st.set('mode',m);document.querySelectorAll('.mode button').forEach(b=>b.classList.toggle('on',b.dataset.m===m))}
  ripple(x,y){for(let i=0;i<2;i++){const r=document.createElement('div');r.className='rip'+(i?' b':'');r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);r.addEventListener('animationend',()=>r.remove())}}
  sync(){const on=this.au.playing;$('#play').classList.toggle('on',on);$('#play').textContent=tr(on?'pause':'play')}
  color(k,c){const R=document.documentElement.style,v={color:'--fg',head:'--head',lcolor:'--lc'}[k],id={color:'colors',head:'heads',lcolor:'lcolors'}[k];c?R.setProperty(v,c):R.removeProperty(v);this.st.set(k,c);document.querySelectorAll('#'+id+' [data-c]').forEach(e=>e.classList.toggle('on',e.dataset.c===c))}
  bg(b){document.documentElement.dataset.bg=b;this.st.set('bg',b);this.mark()}
  lsize(v){document.documentElement.style.setProperty('--ls',v+'px');$('#ls').value=v;this.st.set('lsize',v)}
  tab(k){document.querySelectorAll('[data-s]').forEach(e=>e.classList.toggle('on',e.dataset.s===k));document.querySelectorAll('.tabs button').forEach(e=>e.classList.toggle('on',e.dataset.tab===k))}
  labels(){$('#parts').innerHTML=[['off','p0'],['snow','p1'],['rain','p2'],['incense','p3']].map(([k,n])=>`<button class="btn" data-p="${k}">${tr(n)}</button>`).join('');
    $('#tracks').innerHTML=['rain','fire','choir','classic','storm','own'].map((n,i)=>`<button class="btn" data-i="${i}">${tr('s_'+n)}</button>`).join('');
    $('#bgs').innerHTML=['none','glow','fog','stars'].map(k=>`<button class="btn" data-b="${k}">${tr('bg_'+k)}</button>`).join('');this.mark()}
  i18n(){const supported=['ru','en','hy','de'],l=supported.includes(this.st.d.lang)?this.st.d.lang:'ru',langIndex={ru:0,en:1,hy:2,de:4};if(this.st.d.lang!==l){this.st.d.lang=l;this.st.save()}
    const anchor=document.elementFromPoint(innerWidth/2,Math.min(innerHeight*.45,420));const anchorTop=anchor?anchor.getBoundingClientRect().top:0,anchorId=anchor&&anchor.closest('[id]')?anchor.closest('[id]').id:null;
    LANG=langIndex[l]??0;document.documentElement.lang=l;
    document.querySelectorAll('[data-t]').forEach(e=>{const v=D[e.dataset.t];if(v)e.textContent=v[LANG]});xLabels();
    $('#plist').innerHTML=PR.map(p=>`<details><summary>${p.title[l]||p.title.ru}</summary><p>${p.text[l]||p.text.ru}</p></details>`).join('');document.querySelectorAll('[data-ta]').forEach(e=>{const v=D[e.dataset.ta];if(v)e.setAttribute('aria-label',v[LANG])});$('#mt').placeholder=tr('ph');
    [['#pt','prayer'],['#bl','bless']].forEach(([q,k])=>{const e=$(q),w=e.classList.contains('in');e.classList.remove('in');e.textContent=tr(k);wr(e);if(w)e.classList.add('in')});
    this.observeBook();
    if(anchorId&&document.getElementById(anchorId))document.getElementById(anchorId).scrollIntoView({block:'start'});
    this.labels();this.sync();this.calm(this.st.d.calm);this.renderNotes();if(LC)LC.apply();
    $('#fold').dataset.label=tr('a_camp');document.querySelectorAll('#lm button').forEach(b=>b.classList.toggle('on',b.dataset.l===l))}
  observeBook(){if(!this.io)this.io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');this.io.unobserve(e.target);if(e.target.id==='end')setTimeout(()=>$('#bl').classList.add('in'),3200)}}),{threshold:.12});document.querySelectorAll('#bookBody .rv,#bookBody h2').forEach(n=>this.io.observe(n))}
  calm(v){document.body.classList.toggle('calm',v);this.st.set('calm',v);$('#cm').classList.toggle('on',!v);$('#cm').textContent=tr('anim')+': '+tr(v?'off':'on')}
  theme(t){document.documentElement.dataset.theme=t;this.st.set('theme',t);this.mark()}
  font(f){if(!FONTS[f])f='Lora';document.documentElement.style.setProperty('--ff',FONTS[f]);document.body.style.fontFamily=FONTS[f];this.st.set('font',f);this.mark()}
  size(n){document.documentElement.style.setProperty('--base-font-size',n+'px');$('#fs').value=n;$('#fsv').textContent=n;this.st.set('size',n)}
  part(p){this.fx.setMode(p);this.st.set('particles',p);this.mark()}
  mark(){const d=this.st.d;
    document.querySelectorAll('.sw').forEach(e=>e.classList.toggle('on',e.dataset.th===d.theme));
    document.querySelectorAll('[data-font]').forEach(e=>e.classList.toggle('on',e.dataset.font===d.font));
    document.querySelectorAll('[data-p]').forEach(e=>e.classList.toggle('on',e.dataset.p===d.particles));
    document.querySelectorAll('[data-i]').forEach(e=>e.classList.toggle('on',+e.dataset.i===d.track));
    $('#clk').classList.toggle('on',d.click);$('#clk').textContent=tr('click')+': '+tr(d.click?'on':'off');document.querySelectorAll('[data-b]').forEach(e=>e.classList.toggle('on',e.dataset.b===d.bg))}
  renderNotes(){const n=this.st.d.notes;$('#nc').textContent=n.length;
    $('#notes').innerHTML='<h4>'+tr('refl')+'</h4>'+(n.length?n.map(x=>`<div class="note">${x.q?`<q>«${esc(x.q.slice(0,120))}»</q>`:''}${esc(x.t)}<br><button data-del="${x.id}">${tr('del')}</button></div>`).join(''):'');
    $('#notes').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{this.st.d.notes=this.st.d.notes.filter(x=>x.id!=b.dataset.del);this.st.save();this.renderNotes()})}
}
const wr=el=>{el.classList.add('wr');el.innerHTML=el.textContent.split(' ').map((w,i)=>`<span style="--i:${i}">${w}</span>`).join(' ')};
const D={"title":["АНТРОПОЛОГИЯ ТРОИЧНОГО ОБРАЗА","ANTHROPOLOGY OF THE TRINITARIAN IMAGE","ԵՌԱՄԻԱՍՆԱԿԱՆ ՊԱՏԿԵՐԻ ՄԱՐԴԱԲԱՆՈՒԹՅՈՒՆ","ANTROPOLOGIA OBRAZU TRYNITARNEGO","ANTHROPOLOGIE DES TRINITARISCHEN BILDES","A SZENTHÁROMSÁGOS KÉPMÁS ANTROPOLÓGIÁJA"],"sub":["ТРОИЧНАЯ АРХИТЕКТОНИКА ЧЕЛОВЕКА","THE THREEFOLD ARCHITECTURE OF THE HUMAN PERSON","ՄԱՐԴՈՒ ԵՌԱԿԻ ԿԱՌՈՒՑՎԱԾՔԸ","TRÓJDZIELNA ARCHITEKTONIKA CZŁOWIEKA","DIE DREIFACHE ARCHITEKTONIK DES MENSCHEN","AZ EMBER HÁRMAS ARCHITEKTONIKÁJA"],"prayer":["Господи Иисусе Христе, Сыне Божий, помилуй меня, грешного.","Lord Jesus Christ, Son of God, have mercy on me, a sinner.","Տեր Հիսուս Քրիստոս, Աստծո Որդի, ողորմիր ինձ՝ մեղավորիս։","Panie Jezu Chryste, Synu Boży, zmiłuj się nade mną, grzesznym.","Herr Jesus Christus, Sohn Gottes, erbarme Dich meiner, des Sünders.","Uram, Jézus Krisztus, Isten Fia, könyörülj rajtam, bűnösön."],"amen":["Аминь","Amen","Ամեն","Amen","Amen","Ámen"],"bless":["Да благословит каждого, читающего это, Господь Бог наш Иисус Христос. Аминь.","May our Lord God Jesus Christ bless everyone who reads this. Amen.","Թող մեր Տեր Աստված Հիսուս Քրիստոսը օրհնի յուրաքանչյուրին, ով կարդում է սա։ Ամեն։","Niech Pan, nasz Bóg Jezus Chrystus, błogosławi każdemu, kto to czyta. Amen.","Möge unser Herr und Gott Jesus Christus jeden segnen, der dies liest. Amen.","Áldjon meg minden olvasót a mi Urunk és Istenünk, Jézus Krisztus. Ámen."],"t_view":["Вид","Look","Տեսք","Wygląd","Ansicht","Megjelenés"],"t_atm":["Атмосфера","Atmosphere","Մթնոլորտ","Atmosfera","Atmosphäre","Hangulat"],"t_snd":["Звук","Sound","Ձայն","Dźwięk","Klang","Hang"],"t_more":["Ещё","More","Ավելին","Więcej","Mehr","Továbbiak"],"theme":["Тема","Theme","Թեմա","Motyw","Thema","Téma"],"bg":["Фон","Background","Ֆոն","Tło","Hintergrund","Háttér"],"font":["Шрифт","Font","Տառատեսակ","Krój pisma","Schrift","Betűtípus"],"serif":["С засечками","Serif","Սերիֆ","Szeryfowy","Serif","Talpas"],"sans":["Без засечек","Sans","Առանց սերիֆի","Bezszeryfowy","Sans","Talpatlan"],"ctext":["Цвет текста","Text color","Տեքստի գույն","Kolor tekstu","Textfarbe","Szöveg színe"],"chead":["Цвет заголовков и креста","Headings & cross color","Վերնագրերի և խաչի գույն","Kolor nagłówków i krzyża","Farbe von Überschriften und Kreuz","Címek és kereszt színe"],"size":["Размер","Size","Չափ","Rozmiar","Größe","Méret"],"auto":["Авто","Auto","Ավտո","Auto","Auto","Automatikus"],"parts":["Частицы","Particles","Մասնիկներ","Cząsteczki","Partikel","Részecskék"],"p0":["Нет","None","Չկա","Brak","Keine","Nincs"],"p1":["Снег","Snow","Ձյուն","Śnieg","Schnee","Hó"],"p2":["Дождь","Rain","Անձրև","Deszcz","Regen","Eső"],"p3":["Фимиам","Incense","Խունկ","Kadzidło","Weihrauch","Tömjén"],"light":["Свет курсора","Cursor light","Կուրսորի լույս","Światło kursora","Cursor-Licht","Kurzor fénye"],"lsize":["Размер света","Light size","Լույսի չափ","Rozmiar światła","Lichtgröße","Fény mérete"],"lcolor":["Цвет света","Light color","Լույսի գույն","Kolor światła","Lichtfarbe","Fény színe"],"on":["вкл","on","միաց.","wł.","an","be"],"off":["выкл","off","անջ.","wył.","aus","ki"],"candle":["Свеча","Candle","Մոմ","Świeca","Kerze","Gyertya"],"bg_none":["Чистый","Plain","Մաքուր","Czyste","Schlicht","Tiszta"],"bg_glow":["Сияние","Glow","Փայլ","Blask","Schein","Ragyogás"],"bg_fog":["Туман","Fog","Մառախուղ","Mgła","Nebel","Köd"],"bg_stars":["Звёзды","Stars","Աստղեր","Gwiazdy","Sterne","Csillagok"],"s_rain":["Дождь","Rain","Անձրև","Deszcz","Regen","Eső"],"s_fire":["Камин","Fireplace","Բուխարի","Kominek","Kamin","Kandalló"],"s_choir":["Хор","Choir","Երգչախումբ","Chór","Chor","Kórus"],"s_classic":["Классика","Classical","Դասական","Klasyka","Klassik","Klasszikus"],"s_storm":["Метель","Blizzard","Բուք","Zamieć","Schneesturm","Hóvihar"],"s_own":["Свой трек","Custom track","Սեփական թրեկ","Własny utwór","Eigener Track","Saját zene"],"play":["Играть","Play","Նվագել","Odtwórz","Abspielen","Lejátszás"],"pause":["Пауза","Pause","Դադար","Pauza","Pause","Szünet"],"click":["Клик","Click","Կտտոց","Klik","Klick","Kattintás"],"vol":["Громкость","Volume","Ձայնի ուժգնություն","Głośność","Lautstärke","Hangerő"],"anim":["Анимации","Animations","Անիմացիաներ","Animacje","Animationen","Animációk"],"prayerbtn":["Молитва","Prayer","Աղոթք","Modlitwa","Gebet","Ima"],"notes":["Заметки","Notes","Նշումներ","Notatki","Notizen","Jegyzetek"],"settings":["Настройки","Settings","Կարգավորումներ","Ustawienia","Einstellungen","Beállítások"],"refl":["Размышления","Reflections","Խորհրդածություններ","Refleksje","Gedanken","Elmélkedések"],"empty":["Выделите фрагмент текста, чтобы добавить размышление.","Select a passage to add a reflection.","Ընտրեք հատված՝ խորհրդածություն ավելացնելու համար։","Zaznacz fragment tekstu, aby dodać refleksję.","Markiere eine Textstelle, um einen Gedanken hinzuzufügen.","Jelölj ki egy szövegrészletet elmélkedés hozzáadásához."],"addn":["Добавить размышление","Add reflection","Ավելացնել խորհրդածություն","Dodaj refleksję","Gedanken hinzufügen","Elmélkedés hozzáadása"],"ph":["Ваше размышление…","Your reflection…","Ձեր խորհրդածությունը…","Twoja refleksja…","Dein Gedanke…","Az elmélkedésed…"],"cancel":["Отмена","Cancel","Չեղարկել","Anuluj","Abbrechen","Mégse"],"save":["Сохранить","Save","Պահպանել","Zapisz","Speichern","Mentés"],"del":["удалить","delete","ջնջել","usuń","löschen","törlés"],"m_full":["Развернуто","Expanded","Ընդլայնված","Rozszerzony","Erweitert","Részletes"],"prayers":["Молитвы","Prayers","Աղոթքներ","Modlitwy","Gebete","Imák"],"a_camp":["Звуки природы","Sounds of nature","Բնության ձայներ","Dźwięki natury","Naturklänge","Természet hangjai"],"a_menu":["Меню","Menu","Ընտրացանկ","Menu","Menü","Menü"],"figcap":["Крестом радость пришла всему миру.","Through the Cross joy has come to all the world.","Խաչով ուրախություն եկավ ամբողջ աշխարհին։","Przez Krzyż radość przyszła na cały świat.","Durch das Kreuz kam Freude in die ganze Welt.","A Kereszt által öröm jött az egész világra."],"figcap2":["Сын Божий стал Человеком, чтобы коснуться нас и исцелить.","The Son of God became Man to touch and heal us.","Աստծո Որդին մարդ դարձավ, որպեսզի դիպչի մեզ և բժշկի։","Syn Boży stał się Człowiekiem, aby nas dotknąć i uzdrowić.","Der Sohn Gottes wurde Mensch, um uns zu berühren und zu heilen.","Isten Fia emberré lett, hogy megérinthessen és meggyógyítson minket."],"m_min":["Минимализм","Minimal","Մինիմալ","Minimalnie","Minimal","Minimalista"],"a_cross":["Православный крест","Orthodox cross","Ուղղափառ խաչ","Krzyż prawosławny","Orthodoxes Kreuz","Ortodox kereszt"],"a_wind":["Ветер","Wind","Քամի","Wiatr","Wind","Szél"],"a_birds":["Пение птиц","Birdsong","Թռչունների երգ","Śpiew ptaków","Vogelgesang","Madárdal"],"a_bolt":["Гроза","Thunderstorm","Ամպրոպ","Burza","Gewitter","Zivatar"],"a_note":["Новая заметка","New note","Նոր նշում","Nowa notatka","Neue Notiz","Új jegyzet"],"a_lang":["Язык","Language","Լեզու","Język","Sprache","Nyelv"],"a_cc":["Свой цвет","Custom color","Սեփական գույն","Własny kolor","Eigene Farbe","Egyéni szín"]};
const TH='assets/audio/bolt.js';
const PR=[{"title": {"ru": "Отче наш", "en": "Our Father", "de": "Vaterunser", "hy": "Հայր մեր"}, "text": {"ru": "Отче наш, Который на небесах!<br>Да святится имя Твоё.<br>Да придёт Царство Твоё.<br>Да будет воля Твоя и на земле, как на небе.<br>Хлеб наш насущный дай нам сегодня.<br>И прости нам долги наши, как и мы прощаем должникам нашим.<br>И не введи нас в искушение,<br>но избавь нас от лукавого.", "en": "Our Father, who art in heaven,<br>hallowed be thy name.<br>Thy kingdom come,<br>thy will be done, on earth as it is in heaven.<br>Give us this day our daily bread;<br>and forgive us our trespasses,<br>as we forgive those who trespass against us;<br>and lead us not into temptation,<br>but deliver us from evil.", "de": "Vater unser im Himmel,<br>geheiligt werde dein Name.<br>Dein Reich komme.<br>Dein Wille geschehe, wie im Himmel so auf Erden.<br>Unser tägliches Brot gib uns heute.<br>Und vergib uns unsere Schuld,<br>wie auch wir vergeben unseren Schuldigern.<br>Und führe uns nicht in Versuchung,<br>sondern erlöse uns von dem Bösen.", "hy": "Հայր մեր, որ յերկինս ես,<br>սուրբ եղիցի անուն քո.<br>Եկեսցէ արքայութիւն քո.<br>Եղիցին կամք քո,<br>որպէս յերկինս և յերկրի.<br>Զհաց մեր հանապազորդ տուր մեզ այսօր.<br>և թող մեզ զպարտիս մեր,<br>որպէս և մեք թողումք մերոց պարտապանաց.<br>և մի տանիր զմեզ ի փորձութիւն,<br>այլ փրկեա զմեզ ի չարէն։"}}, {"title": {"ru": "Иисусова молитва", "en": "The Jesus Prayer", "de": "Jesusgebet", "hy": "Հիսուսի աղոթք"}, "text": {"ru": "Господи Иисусе Христе, Сын Божий, помилуй меня.", "en": "Lord Jesus Christ, Son of God, have mercy on me, a sinner.", "de": "Herr Jesus Christus, Sohn Gottes, erbarme dich meiner, des Sünders.", "hy": "Տեր Հիսուս Քրիստոս, Աստծո Որդի, ողորմիր ինձ՝ մեղավորիս։"}}, {"title": {"ru": "«Господи, не оставь меня»", "en": "“Lord, do not forsake me”", "de": "„Herr, verlass mich nicht“", "hy": "«Տե՛ր, մի՛ լքիր ինձ»"}, "text": {"ru": "Господи, не оставь меня. Будь со мной, укрепи меня и направь на путь Твой.", "en": "Lord, do not forsake me. Be with me, strengthen me, and guide me on Your path.", "de": "Herr, verlass mich nicht. Sei bei mir, stärke mich und leite mich auf deinem Weg.", "hy": "Տե՛ր, մի՛ լքիր ինձ։ Եղիր ինձ հետ, ամրացրու ինձ և առաջնորդիր ինձ քո ճանապարհով։"}}, {"title": {"ru": "«Да будет воля Твоя, а не моя»", "en": "“Your will be done, not mine”", "de": "„Dein Wille geschehe, nicht meiner“", "hy": "«Թող քո կամքը լինի, ոչ թե իմը»"}, "text": {"ru": "Господи, да будет воля Твоя, а не моя. Помоги мне принять её с верой и доверием к Тебе.", "en": "Lord, may Your will be done, not mine. Help me to accept it with faith and trust in You.", "de": "Herr, dein Wille geschehe, nicht meiner. Hilf mir, ihn mit Glauben und Vertrauen auf dich anzunehmen.", "hy": "Տե՛ր, թող քո կամքը լինի, ոչ թե իմը։ Օգնիր ինձ ընդունել այն հավատքով և քեզ ապավինելով։"}}];
let LC=null,LANG=0;const tr=k=>D[k][LANG];
const FONTS={"Lora":"'Lora','Noto Serif Armenian',serif","Cormorant":"'Cormorant Garamond','Noto Serif Armenian',serif","EB Garamond":"'EB Garamond','Noto Serif Armenian',serif","Playfair":"'Playfair Display','Noto Serif Armenian',serif","Literata":"'Literata','Noto Serif Armenian','PT Serif',Georgia,'Times New Roman',serif","PT Serif":"'PT Serif','Noto Serif Armenian',serif","Spectral":"'Spectral','Noto Serif Armenian',serif","Alegreya":"'Alegreya','Noto Serif Armenian',serif","Philosopher":"'Philosopher','Noto Serif Armenian',serif","Old Standard":"'Old Standard TT','Noto Serif Armenian',serif","Marck Script":"'Marck Script','Noto Serif Armenian',serif","Inter":"'Inter','Noto Sans Armenian',sans-serif","Manrope":"'Manrope','Noto Sans Armenian',sans-serif"};
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

class Flame{constructor(){this.b=$('#bf');this.t=0;const u=()=>{const h=document.documentElement.scrollHeight-innerHeight;this.t=h>0?Math.min(1,Math.max(0,scrollY/h)):0};addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();this.cur=this.t;const f=()=>{this.cur+=(this.t-this.cur)*.12;this.b.style.transform=`scaleX(${this.cur})`;requestAnimationFrame(f)};f()}}
const WN='assets/audio/wind.js',BD='assets/audio/birds.js';
class Weather{
constructor(au){this.au=au;this.c=$('#fx2');this.x=this.c.getContext('2d');this.w=[];this.b=null;this.run=0;const f=()=>{const r=Math.min(devicePixelRatio||1,2);this.W=innerWidth;this.H=innerHeight;this.c.width=this.W*r;this.c.height=this.H*r;this.x.setTransform(r,0,0,r,0,0)};f();addEventListener('resize',f);$('#wind').onclick=()=>this.windPlay();$('#bolt').onclick=()=>this.stormPlay();$('#birds').onclick=()=>this.birdsPlay()}
go(){if(this.run)return;this.run=1;const f=()=>{this.draw();if(this.w.length||this.b)requestAnimationFrame(f);else{this.run=0;this.x.clearRect(0,0,this.W,this.H)}};requestAnimationFrame(f)}
nz(d){const c=this.au.c,n=c.sampleRate*d|0,b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;return s}
snd(d,type,f0,f1,t0,v,q=.7,att=.05){const c=this.au.c,s=this.nz(d+.2),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+t0;f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+d*att);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t);s.stop(t+d+.2)}
gust(){const R=Math.random,H=this.H,d=2.6+R()*2.2;for(let i=0,n=22+R()*14|0;i<n;i++)this.w.push({x:-R()*500,y:H*(.1+.8*R()),v:7+R()*9,l:160+R()*340,m:14+R()*60,f:.01+R()*.03,ph:R()*6.28,s:1+R()*3.5,a:.08+R()*.22});this.go();
 $('#text').animate([{transform:'none'},{transform:`translateX(${5+R()*7}px) skewX(-.8deg)`,offset:.3},{transform:'none'}],{duration:2800,easing:'ease-out'})}
async windPlay(){const d=await this.oneShot('wind',WN,.32);if(!d)return;this.gust();this.windUntil=performance.now()+d*1000;this.windVisualLoop()}
windVisualLoop(){clearTimeout(this.wt);if(!this.windUntil||performance.now()>=this.windUntil)return;this.wt=setTimeout(()=>{if(performance.now()<this.windUntil){this.gust();this.windVisualLoop()}},6500+Math.random()*7000)}
async birdsPlay(){await this.oneShot('birds',BD,.42)}
async stormPlay(){const d=await this.oneShot('bolt',TH,.9);if(d)this.strike(false);else this.strike(true)}
foldState(){const on=!!(this.a&&Object.values(this.a).some(Boolean));$('#fold').classList.toggle('atmo-active',on);this.ring()}
ring(){const A=this.a||{};let b=null;for(const k in A){const o=A[k];if(o&&(!b||o.start+o.dur>b.start+b.dur))b=o}const e=$('#bulb');if(!e)return;const p=b?Math.max(0,Math.min(1,(this.au.c.currentTime-b.start)/b.dur)):0;e.style.setProperty('--prog',(p*360).toFixed(1)+'deg')}
progress(k){const A=this.a||{},o=A[k],b=$('#'+k);if(!o||!b)return;const tick=()=>{const cur=(this.a||{})[k];if(!cur||cur!==o)return;const p=Math.max(0,Math.min(1,(this.au.c.currentTime-o.start)/o.dur));b.style.setProperty('--prog',(p*360).toFixed(1)+'deg');this.ring();if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}
async oneShot(k,src,vol){const c=this.au.c,A=this.a=this.a||{},btn=$('#'+k);if(A[k])return 0;this.bu=this.bu||{};try{if(!this.bu[k]){const q=await fetch(await NTAudioSrc(k,src));this.bu[k]=await c.decodeAudioData(await q.arrayBuffer())}}catch(e){return 0}
const s=c.createBufferSource(),g=c.createGain();s.buffer=this.bu[k];s.loop=false;g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(vol,c.currentTime+.18);s.connect(g);g.connect(c.destination);const start=c.currentTime,dur=Math.max(.01,s.buffer.duration);A[k]={s,g,start,dur};btn.classList.add('on','playing');btn.disabled=true;btn.style.setProperty('--prog','0deg');s.onended=()=>{const cur=(this.a||{})[k];if(cur&&cur.s===s){A[k]=null;btn.classList.remove('on','playing');btn.disabled=false;btn.style.setProperty('--prog','0deg');this.foldState()}};const fo=Math.min(4,dur*.4),T=start+dur;g.gain.setValueAtTime(vol,Math.max(start+.3,T-fo));g.gain.linearRampToValueAtTime(0,T);s.start();this.progress(k);this.foldState();return dur}
nb(){if(!this._nb){const c=this.au.c,n=c.sampleRate*8,b=c.createBuffer(2,n,c.sampleRate);for(let h=0;h<2;h++){const d=b.getChannelData(h);let l=0;for(let i=0;i<n;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}}this._nb=b}return this._nb}
ir(){if(!this._ir){const c=this.au.c,n=c.sampleRate*3.5|0,b=c.createBuffer(2,n,c.sampleRate);for(let h=0;h<2;h++){const d=b.getChannelData(h);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3)}this._ir=b}return this._ir}
thunder(){const c=this.au.c,r=Math.random,dist=r(),t0=c.currentTime+.06+dist*1.8,D=4+dist*3+r()*2,air=1-dist*.7,out=c.createGain(),cv=c.createConvolver(),wet=c.createGain(),dry=c.createGain(),end=c.createGain(),cp=c.createDynamicsCompressor(),pan=c.createStereoPanner?c.createStereoPanner():null;
cv.buffer=this.ir();wet.gain.value=.35+dist*.4;dry.gain.value=.75;out.connect(dry);out.connect(cv);cv.connect(wet);dry.connect(end);wet.connect(end);let n=end;if(pan){pan.pan.value=r()*1.2-.6;n.connect(pan);n=pan}n.connect(cp);cp.connect(c.destination);
const env=(g,a,pk,ti,len)=>{g.gain.setValueAtTime(0,ti);g.gain.linearRampToValueAtTime(pk,ti+a);g.gain.exponentialRampToValueAtTime(.001,ti+len)};
if(dist<.6){const k=this.nz(.9),b=c.createBiquadFilter(),g=c.createGain();b.type='bandpass';b.Q.value=.6;b.frequency.setValueAtTime(5000*air,t0);b.frequency.exponentialRampToValueAtTime(500,t0+.35);env(g,.002,(1-dist)*1.2,t0,.4);k.connect(b);b.connect(g);g.connect(out);k.start(t0);k.stop(t0+.9);
const sn=c.sampleRate*2|0,sb=c.createBuffer(1,sn,c.sampleRate),sd=sb.getChannelData(0);for(let i=0;i<sn;i++)sd[i]=r()<.005*(1-i/sn)?r()*2-1:0;const ss=c.createBufferSource(),sf=c.createBiquadFilter(),sg=c.createGain();ss.buffer=sb;sf.type='bandpass';sf.frequency.value=1800;sf.Q.value=.8;env(sg,.01,(1-dist)*1.3,t0,1.7);ss.connect(sf);sf.connect(sg);sg.connect(out);ss.start(t0)}
if(dist<.8){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(58,t0);o.frequency.exponentialRampToValueAtTime(32,t0+1.6);env(g,.01,1.1,t0,1.8);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+2)}
const B=(ti,len,amp,f0)=>{const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.nb();s.loop=true;f.type='lowpass';f.Q.value=.8;f.frequency.setValueAtTime(f0,ti);f.frequency.exponentialRampToValueAtTime(48,ti+len);env(g,.03+r()*.25,amp,ti,len);s.connect(f);f.connect(g);g.connect(out);s.start(ti,r()*5);s.stop(ti+len+.1)};
B(t0,D,1.6,300*air+80);for(let i=0,m=4+r()*5|0;i<m;i++)B(t0+.1+i/m*D*.85+r()*.4,1.2+r()*2.2,(1.4-i/m*.8)*(.5+r()*.5)*2*(1.1-dist*.5),(380+r()*260)*air+60)}
seg(a,b,c,d,j,o){if(j<5){o.push([a,b,c,d]);return}const R=Math.random,mx=(a+c)/2+(R()-.5)*j,my=(b+d)/2+(R()-.5)*j*.3;this.seg(a,b,mx,my,j/2,o);this.seg(mx,my,c,d,j/2,o)}
strike(sound=true){const R=Math.random,W=this.W,H=this.H,s=[],r=[],x0=W*(.12+.76*R());this.seg(x0,0,x0+(R()-.5)*W*.4,H*(.5+R()*.45),H*.22,s);s.forEach(g=>{if(R()<.15)this.seg(g[2],g[3],g[2]+(R()-.5)*340,g[3]+70+R()*230,70,r)});
 this.b={s,r,t:performance.now(),d:380+R()*450,fl:1+R()*3,w:1.4+R()*2.2,c:['#e8f0ff','#dcd2ff','#fff4d6','#cfe8ff'][R()*4|0]};this.go();
 if(sound)this.clap()}
draw(){const x=this.x,W=this.W,H=this.H;x.clearRect(0,0,W,H);x.lineCap='round';x.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--fg').trim()||'#fff';
 for(let i=this.w.length-1;i>=0;i--){const q=this.w[i];q.x+=q.v;q.ph+=q.f;if(q.x-q.l>W+40){this.w.splice(i,1);continue}
  for(let k=0;k<14;k++){const a=q.x-q.l*k/14,b=q.x-q.l*(k+1)/14;x.globalAlpha=Math.max(0,q.a*(1-k/14)*Math.min(1,q.x/300));x.lineWidth=q.s*(1-k/20);x.beginPath();x.moveTo(a,q.y+Math.sin(a*.012+q.ph)*q.m);x.lineTo(b,q.y+Math.sin(b*.012+q.ph)*q.m);x.stroke()}}
 const B=this.b;if(B){const age=performance.now()-B.t;if(age>B.d)this.b=null;else{const a=(1-age/B.d)*(.55+.45*Math.abs(Math.sin(age/55*B.fl)));x.globalAlpha=a*.22;x.fillStyle=B.c;x.fillRect(0,0,W,H);x.globalAlpha=a;x.strokeStyle=B.c;x.shadowColor=B.c;x.shadowBlur=22;[[B.s,B.w],[B.r,B.w*.5]].forEach(([L,w])=>{x.lineWidth=w;x.beginPath();L.forEach(g=>{x.moveTo(g[0],g[1]);x.lineTo(g[2],g[3])});x.stroke()});x.shadowBlur=0}}x.globalAlpha=1}
}
['copy','cut','contextmenu','dragstart','selectstart'].forEach(ev=>document.addEventListener(ev,e=>{const t=e.target.nodeType===1?e.target:e.target.parentElement;if(!t||!t.closest('textarea'))e.preventDefault()}));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&'cxaspu'.includes(e.key.toLowerCase())&&!(e.target.closest&&e.target.closest('textarea')))e.preventDefault()});
(()=>{if(matchMedia('(pointer:coarse)').matches)return;let t=scrollY,c=scrollY,run=0;const mx=()=>document.documentElement.scrollHeight-innerHeight,f=()=>{c+=(t-c)*(window.__smk||.085);if(Math.abs(t-c)<.4){c=t;run=0}scrollTo(0,c);if(run)requestAnimationFrame(f)};
addEventListener('wheel',e=>{if(e.ctrlKey||e.target.closest('#panel,#npanel,#ppanel,#hpanel,#modal,#xp,#brSearch,#brCommentary,#brHist,#brPop,#pfm,.br-guide-scroll,select'))return;e.preventDefault();t=Math.max(0,Math.min(mx(),t+e.deltaY*(e.deltaMode?32:1)));if(!run){run=1;c=scrollY;requestAnimationFrame(f)}},{passive:false});
addEventListener('scroll',()=>{if(!run)t=c=scrollY},{passive:true})})();
$('#bulb').onclick=e=>{e.stopPropagation();$('#fb').click()};
{const P=ParticleEngine.prototype,L=P.loop,mob=matchMedia('(pointer:coarse)').matches||innerWidth<700,low=(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4;let last=0,slow=0;
P.loop=function(t){if(this.q===undefined){this.q=(mob?.6:1)*(low?.6:1);this.seed()}if(last){const d=t-last;slow=d>30?slow+1:Math.max(0,slow-1);if(slow>40&&this.q>.25){this.q*=.6;slow=0;this.seed()}}last=t;return L.call(this,t)};
if(matchMedia('(prefers-reduced-motion:reduce)').matches)document.body.classList.add('calm')}

var XT={"find": ["Поиск", "Search", "Որոնում", "Szukaj", "Suche", "Keresés"], "ph": ["Найти в книге…", "Search the book…", "Որոնել գրքում…", "Szukaj w książce…", "Im Buch suchen…", "Keresés a könyvben…"], "res": ["Продолжить чтение", "Continue reading", "Շարունակել ընթերցումը", "Wróć do czytania", "Weiterlesen", "Olvasás folytatása"], "none": ["Ничего не найдено", "Nothing found", "Ոչինչ չի գտնվել", "Nic nie znaleziono", "Nichts gefunden", "Nincs találat"], "sea": ["Море", "Sea", "Ծով", "Morze", "Meer", "Tenger"], "bell": ["Колокол", "Bell", "Զանգ", "Dzwon", "Glocke", "Harang"]},XS=null;
function xl(k){const a=XT[k];return a?(a[LI()]||a[1]):''}
function LI(){return ({ru:0,en:1,hy:2,de:4}[state.d.lang]??0)}
function xLabels(){const t=(i,k)=>{const e=document.getElementById(i);if(e)e.title=e.ariaLabel=xl(k)};t('bFind','find');t('lSea','sea');t('lBell','bell');t('lCandle','candle');t('bNotes','notes');t('bPr','prayers');t('bSet','settings');t('bNew','newnote');t('bFs','fs');const q=document.getElementById('xq');if(q)q.placeholder=xl('ph');document.querySelectorAll('#xsnd .btn').forEach(b=>{b.textContent=xl(b.dataset.k)});[['lClassic','classic'],['lStorm','storm'],['lOwn','own'],['lRain','rain'],['lFire','fire'],['lChoir','choir']].forEach(([i,n])=>{const e=document.getElementById(i);if(e)try{e.title=e.ariaLabel=tr('s_'+n)}catch(x){}})}
function xSea(btn){const c=audio.c;if(XS){const s=XS;XS=null;s.g.gain.setTargetAtTime(0,c.currentTime,1.6);setTimeout(()=>{try{s.n.stop();s.l.stop()}catch(e){}},9000);return}
const n=c.createBufferSource(),len=c.sampleRate*6,bf=c.createBuffer(2,len,c.sampleRate);for(let h=0;h<2;h++){const d=bf.getChannelData(h);let l=0;for(let i=0;i<len;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.2}}
n.buffer=bf;n.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=900;const w=c.createGain(),g=c.createGain(),l=c.createOscillator(),ld=c.createGain();w.gain.value=.55;l.frequency.value=.11;ld.gain.value=.4;l.connect(ld);ld.connect(w.gain);l.start();n.connect(f);f.connect(w);w.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(.6,c.currentTime+3);n.start();XS={n,l,g}}
function xBell(btn){const c=audio.c;btn.classList.add('on');[0,2.6,5.2].forEach((t0,k)=>[[1,1],[2.01,.45],[2.76,.35],[4.07,.2],[5.4,.12]].forEach(([r,a])=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.frequency.value=174.6*r;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a*.2*.88*(1-k*.2),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+7-r*.5);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+7)}));setTimeout(()=>btn.classList.remove('on'),11000)}
function xInit(){const $$=s=>document.querySelector(s);
$$('#bSet').insertAdjacentHTML('beforebegin','<button class="btn rnd" id="bFind"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg></button>');
document.body.insertAdjacentHTML('beforeend','<aside id="xp" class="xp ui"><input id="xq" type="search" autocomplete="off"><div id="xl"></div></aside>');
$$('#fm').insertAdjacentHTML('beforeend','<button class="btn rnd" id="lRain" style="--i:3">\u{1F327}</button><button class="btn rnd" id="lFire" style="--i:4">\u{1F525}</button><button class="btn rnd" id="lChoir" style="--i:5">\u{1F3B6}</button><button class="btn rnd" id="lSea" style="--i:6">\u{1F30A}</button><button class="btn rnd" id="lBell" style="--i:7">\u{1F514}</button>');
const xp=$$('#xq').parentNode,list=$$('#xl'),mode={m:'find'};
const close=()=>xp.classList.remove('open'),sync=()=>{try{ui.sync();ui.mark()}catch(e){}};
[['#lRain',0],['#lFire',1],['#lChoir',2]].forEach(([q,i])=>$$(q).onclick=e=>{e.stopPropagation();audio.playing&&state.d.track===i?audio.stop():audio.load(i);sync()});
$$('#lSea').onclick=e=>{e.stopPropagation();xSea()};$$('#lBell').onclick=e=>{e.stopPropagation();xBell($$('#lBell'))};
setInterval(()=>{[['#lRain',0],['#lFire',1],['#lChoir',2]].forEach(([q,i])=>$$(q).classList.toggle('on',!!audio.playing&&state.d.track===i));$$('#lSea').classList.toggle('on',!!XS);$$('#fold').classList.toggle('xon',!!XS||!!audio.playing)},700);
const go=(el,blk)=>{close();el.scrollIntoView({behavior:'smooth',block:blk});el.classList.add('xf');setTimeout(()=>el.classList.remove('xf'),2600)};
function find(){const q=$$('#xq').value.trim().toLowerCase();list.textContent='';if(q.length<2)return;let n=0;for(const el of document.querySelectorAll('#bookBody p,#bookBody li,#bookBody blockquote,#bookBody h3,#bookBody td')){const t=el.textContent,i=t.toLowerCase().indexOf(q);if(i<0)continue;const b=document.createElement('button'),s=Math.max(0,i-30);b.className='xi';b.append((s?'…':'')+t.slice(s,i));const m=document.createElement('b');m.textContent=t.slice(i,i+q.length);b.append(m,t.slice(i+q.length,i+q.length+50)+'…');b.onclick=()=>go(el,'center');list.append(b);if(++n>=40)break}if(!n){const d=document.createElement('div');d.className='xe';d.textContent=xl('none');list.append(d)}}
const open=m=>{if(xp.classList.contains('open')&&mode.m===m){close();return}mode.m=m;['panel','npanel','ppanel','hpanel'].forEach(k=>$$('#'+k).classList.remove('open'));$$('#fold').classList.remove('open');xp.classList.add('open');$$('#xq').style.display='block';$$('#xq').value='';list.textContent='';setTimeout(()=>$$('#xq').focus(),60)};
$$('#bFind').onclick=e=>{e.stopPropagation();open('find')};let dt;$$('#xq').oninput=()=>{clearTimeout(dt);dt=setTimeout(find,180)};
['#bSet','#bNotes','#bPr','#dt'].forEach(q=>$$(q).addEventListener('click',close));
document.addEventListener('click',e=>{if(xp.classList.contains('open')&&!e.target.closest('#xp,#bFind'))close()});
let wl=null;const lock=async()=>{try{if(navigator.wakeLock&&!wl&&document.visibilityState==='visible'){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}}catch(e){wl=null}};lock();['click','touchstart','keydown'].forEach(ev=>addEventListener(ev,lock,{passive:true}));document.addEventListener('visibilitychange',lock);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};document.addEventListener('click',e=>{if(e.target.closest('#pb'))vib([30,70,30]);else if(e.target.closest('#ms'))vib([18,50,18]);else if(e.target.closest('.btn,#bulb,.sw'))vib(10)});
const K='xr_'+state.d.lang;let sv;addEventListener('scroll',()=>{clearTimeout(sv);sv=setTimeout(()=>{const m=document.documentElement.scrollHeight-innerHeight;if(m>0&&scrollY>300)try{localStorage.setItem('xr_'+state.d.lang,(scrollY/m).toFixed(4))}catch(e){}},500)},{passive:true});
let r=0;try{r=+localStorage.getItem(K)||0}catch(e){}
xLabels()}

LightController.prototype.loop=function(t){if(this.cd&&matchMedia('(pointer:coarse)').matches){this.tx=innerWidth/2;this.ty=innerHeight*.42}
this.x+=(this.tx-this.x)*.1;this.y+=(this.ty-this.y)*.1;const f=1+Math.sin(t/230)*.03+Math.sin(t/97)*.02;
this.el.style.transform=`translate3d(${this.x}px,${this.y}px,0) translate(-50%,-50%) scale(${f})`;
if(this.cd){if(!this.nt||t>this.nt){this.fT=.9+Math.random()*.16;this.nt=t+70+Math.random()*180}this.fl=(this.fl||1)+(this.fT-(this.fl||1))*.18;
const V=this.vs;V.setProperty('--lx',this.x+'px');V.setProperty('--ly',this.y+'px');V.setProperty('--lr',(this.st.d.lsize*.8*f*this.fl)+'px');V.setProperty('--vo',(.9+(1-this.fl)*.4).toFixed(3));
if(!this.wk)this.wk=document.getElementById('wick');if(this.wk)this.wk.style.translate=this.x+'px '+this.y+'px'}
requestAnimationFrame(t=>this.loop(t))};
var PN=null,CT=null;
function pgNoise(){const c=audio.ctx;if(!PN){const n=c.sampleRate*1.2|0;PN=c.createBuffer(1,n,c.sampleRate);const d=PN.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.35+(Math.random()*2-1)*.65;d[i]=l}}return PN}
function candleSnd(on){clearTimeout(CT);if(!on)return;const tick=()=>{if(audio.ctx&&audio.ctx.state==='running'){const c=audio.ctx,t=c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),d=.015+Math.random()*.03;s.buffer=pgNoise();f.type='highpass';f.frequency.value=2500+Math.random()*3000;g.gain.setValueAtTime(.4*(.05+Math.random()*.1),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t,Math.random());s.stop(t+d+.02)}CT=setTimeout(tick,300+Math.random()*2200)};tick()}
var XC=false;
(()=>{const og=Object.getOwnPropertyDescriptor(AudioController.prototype,'c').get,ov=AudioController.prototype.vol;
Object.defineProperty(AudioController.prototype,'c',{configurable:true,get(){const had=!!this.ctx,c=og.call(this);if(!had){const bus=c.createGain();bus.connect(c.destination);Object.defineProperty(c,'destination',{value:bus,configurable:true});this.bus=bus;this.busv()}return c}});
AudioController.prototype.busv=function(){if(this.bus)this.bus.gain.value=this.st.d.vol/.4};
AudioController.prototype.vol=function(v){ov.call(this,v);this.busv()}})();
function xInit2(){const $$=s=>document.querySelector(s);
Object.assign(XT,{candle:['Свеча','Candle','Մոմ','Świeca','Kerze','Gyertya'],wind:['Ветер','Wind','Քամի','Wiatr','Wind','Szél'],birds:['Птицы','Birds','Թռչուններ','Ptaki','Vögel','Madarak'],thunder:['Удар грома','Thunderclap','Որոտ','Grzmot','Donner','Mennydörgés']});
$$('#fm').insertAdjacentHTML('beforeend','<button class="btn rnd" id="lCandle" style="--i:8">\u{1F56F}</button><button class="btn rnd" id="lClassic" style="--i:9">\u{1F3BC}</button><button class="btn rnd" id="lStorm" style="--i:10">\u26C8\uFE0F</button><button class="btn rnd" id="lOwn" style="--i:11">\u{1F4C1}</button>');
$$('#lCandle').onclick=e=>{e.stopPropagation();try{audio.c}catch(x){}LC.cd=!LC.cd;LC.st.set('candle',LC.cd);LC.apply()};
const TR=[['#lRain',0],['#lFire',1],['#lChoir',2],['#lClassic',3],['#lStorm',4],['#lOwn',5]],same=i=>audio.playing&&state.d.track===i&&!(i===5&&!audio.file),sy=()=>{try{ui.sync();ui.mark()}catch(x){}};
TR.forEach(([q,i])=>$$(q).onclick=e=>{e.stopPropagation();if(same(i))audio.stop();else{const b=document.querySelector('#tracks [data-i="'+i+'"]');b&&b.click()}sy()});
$$('#tracks').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b&&same(+b.dataset.i)){e.stopImmediatePropagation();audio.stop();sy()}},true);
const row=document.createElement('div');row.className='row';row.id='xsnd';row.style.marginTop='.7rem';
[['wind','#wind'],['birds','#birds'],['thunder','#bolt'],['sea','#lSea'],['bell','#lBell']].forEach(([k,sel])=>{const b=document.createElement('button');b.className='btn';b.dataset.k=k;b.dataset.src=sel;b.onclick=()=>{try{audio.c}catch(x){}$$(sel).click()};row.append(b)});$$('#tracks').after(row);
const wake=()=>{try{audio.c}catch(e){}};['pointerup','touchend','keydown','click'].forEach(ev=>addEventListener(ev,wake,{passive:true}));
new MutationObserver(()=>{const on=document.body.classList.contains('candle');if(on!==XC){XC=on;candleSnd(on)}}).observe(document.body,{attributes:true,attributeFilter:['class']});if(document.body.classList.contains('candle')){XC=true;candleSnd(true)}
setInterval(()=>{TR.forEach(([q,i])=>$$(q).classList.toggle('on',!!same(i)));$$('#lSea').classList.toggle('on',!!XS);$$('#lCandle').classList.toggle('on',!!LC.cd);$$('#fold').classList.toggle('xon',!!XS||!!audio.playing);document.querySelectorAll('#xsnd .btn').forEach(b=>{const e=$$(b.dataset.src);b.classList.toggle('on',e.classList.contains('on'));b.disabled=!!e.disabled})},500);xLabels()}

function xInit3(){const $$=s=>document.querySelector(s),ic=d=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
Object.assign(XT,{notes:['Заметки','Notes','Նշումներ','Notatki','Notizen','Jegyzetek'],prayers:['Молитвы','Prayers','Աղոթքներ','Modlitwy','Gebete','Imák'],settings:['Настройки','Settings','Կարգավորումներ','Ustawienia','Einstellungen','Beállítások'],newnote:['Новая заметка','New note','Նոր նշում','Nowa notatka','Neue Notiz','Új jegyzet'],fs:['Во весь экран','Fullscreen','Ամբողջ էկրան','Pełny ekran','Vollbild','Teljes képernyő']});
const n0=($$('#nc')||{}).textContent||'0',bn=$$('#bNotes');bn.classList.add('rnd');bn.innerHTML=ic('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>')+'<i id="nc">'+n0+'</i>';
const nc=$$('#nc'),vis=()=>{nc.style.display=nc.textContent.trim()==='0'?'none':''};vis();new MutationObserver(vis).observe(nc,{childList:true,characterData:true,subtree:true});
const bp=$$('#bPr');bp.removeAttribute('data-t');bp.classList.add('rnd');bp.innerHTML=ic('<path d="M12 3v18M7.5 8.5h9"/>');
const bs=$$('#bSet');bs.removeAttribute('data-t');bs.classList.add('rnd');bs.innerHTML=ic('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>');
$$('#bFind').classList.add('rnd');$$('#npanel').prepend($$('#bNew'));
const de=document.documentElement,rq=de.requestFullscreen||de.webkitRequestFullscreen,ex=document.exitFullscreen||document.webkitExitFullscreen;
if(rq){$$('#dm').insertAdjacentHTML('afterbegin','<button class="btn rnd" id="bFs"></button>');const b=$$('#bFs'),E=ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),X=ic('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),up=()=>{b.innerHTML=(document.fullscreenElement||document.webkitFullscreenElement)?X:E};up();
b.onclick=()=>{try{(document.fullscreenElement||document.webkitFullscreenElement)?ex.call(document):rq.call(de,{navigationUI:'hide'})}catch(e){}};document.addEventListener('fullscreenchange',up);document.addEventListener('webkitfullscreenchange',up)}
const pr=$$('#prayer'),lock=on=>{[...document.body.children].forEach(e=>{if(e.id==='prayer'||e.id==='lpk'||e.id==='pfm'||e.id==='tq'||e.id==='tr'||e.id==='tb'||e.tagName==='SCRIPT')return;on?e.setAttribute('inert',''):e.removeAttribute('inert')});de.style.overflow=document.body.style.overflow=on?'hidden':''},st=()=>{lock(!pr.classList.contains('off'));if(pr.classList.contains('go')&&!pr.classList.contains('ready'))setTimeout(()=>pr.classList.add('ready'),5000)};
new MutationObserver(st).observe(pr,{attributes:true,attributeFilter:['class']});st();
const tt=(i,k)=>{const e=$$('#'+i);if(e)e.title=e.ariaLabel=xl(k)};tt('bNotes','notes');tt('bPr','prayers');tt('bSet','settings');tt('bNew','newnote');tt('bFs','fs');tt('bFind','find')}
const state=new State(),fx=new ParticleEngine($('#fx')),audio=new AudioController(state),ui=new UIManager(state,fx,audio);
const sh=new SelectionHandler(state,ui);$('#bNew').onclick=()=>sh.newNote();new Weather(audio);new Flame();LC=new LightController(state,fx);ui.i18n();xInit();xInit2();xInit3();
