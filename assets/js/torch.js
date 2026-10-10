(()=>{
const CW=440,CH=720,HX=220,HY=300,DP=Math.min(devicePixelRatio||1,2),S=10,rnd=Math.random;
const coarse=matchMedia('(pointer:coarse)').matches,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const mk=id=>{const c=document.createElement('canvas');c.id=id;c.width=CW*DP;c.height=CH*DP;document.body.appendChild(c);return c};
const dot=document.createElement('div');dot.id='torchDot';document.body.appendChild(dot);
const cH=mk('torchH'),cF=mk('torchF');if(!rm)cF.style.filter='url(#tHeat)';
const gF=cF.getContext('2d'),gH=cH.getContext('2d');
const lg=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,k])=>g.addColorStop(o,k));return g};

/* sprites: soft glow discs, white-hot -> yellow -> orange -> red -> dark ember */
const cols=[[255,252,235],[255,226,150],[255,168,62],[228,84,26],[120,26,14]];
const col=u=>{const f=u*(cols.length-1),i=Math.min(cols.length-2,f|0),k=f-i,a=cols[i],b=cols[i+1];return a.map((v,j)=>(v+(b[j]-v)*k)|0)};
const spr=[...Array(S)].map((_,i)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),[r,gg,b]=col(i/(S-1)),gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,`rgba(${r},${gg},${b},1)`);gr.addColorStop(.35,`rgba(${r},${gg},${b},.45)`);gr.addColorStop(1,`rgba(${r},${gg},${b},0)`);g.fillStyle=gr;g.fillRect(0,0,64,64);return c});

let P=[],E=[],ac=[0,0,0,0,0],ang=0,om=0,lx=0,ly=0,vx=0,vy=0,ign=0,boost=0,vis=1,last=0,wasOn=false;
const M=[...Array(coarse?16:40)].map(()=>({x:rnd()*innerWidth,y:rnd()*innerHeight,z:rnd(),p:rnd()*6}));
addEventListener('pointerdown',()=>{boost=1.3},{passive:true});
addEventListener('pointermove',()=>{vis=1},{passive:true});
document.documentElement.addEventListener('mouseleave',()=>{vis=0});
document.documentElement.addEventListener('mouseenter',()=>{vis=1});

function drawHandle(h,Lf,fl,t,BY){
  h.setTransform(DP,0,0,DP,0,0);h.clearRect(0,0,CW,CH);
  h.save();h.translate(HX,BY);h.rotate(ang);
  const c=(r,g,b,a=1)=>`rgba(${r*Lf|0},${g*Lf|0},${b*Lf|0},${a})`;
  /* staff: wood, carved rings, grain, fades into darkness */
  const len=coarse?60:150;
  h.fillStyle=lg(h,-5,0,5,0,[[0,c(30,15,6)],[.4,c(130,78,38)],[1,c(34,17,8)]]);h.fillRect(-5,88,10,len);
  h.fillStyle=c(20,10,4,.85);[96,101,112,186].forEach(y=>h.fillRect(-5.5,y,11,1.6));
  h.strokeStyle=c(20,10,4,.5);h.lineWidth=.6;[-2.5,0,2.2].forEach(x=>{h.beginPath();h.moveTo(x,90);h.lineTo(x+(x>0?.6:-.6),88+len);h.stroke()});
  h.fillStyle=lg(h,0,88,0,88+len,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.92)']]);h.fillRect(-6,88,12,len);
  /* ornate bronze knob with ribs */
  const kn=h.createRadialGradient(-3,62,2,0,66,17);kn.addColorStop(0,c(235,175,85));kn.addColorStop(.5,c(140,88,34));kn.addColorStop(1,c(40,22,8));
  h.fillStyle=kn;h.beginPath();h.ellipse(0,66,11,17,0,0,7);h.fill();
  h.strokeStyle=c(30,16,6,.9);h.lineWidth=1;
  for(let i=-3;i<=3;i++){const y=66+i*4.2,r=11*Math.sqrt(1-(i*4.2/17)**2);h.beginPath();h.ellipse(0,y,r,2.2,0,0,Math.PI);h.stroke()}
  [[38,13,10],[84,9,5]].forEach(([y,w,hh])=>{h.fillStyle=lg(h,-w,0,w,0,[[0,c(50,28,10)],[.35,c(225,165,72)],[1,c(48,26,10)]]);h.fillRect(-w,y,w*2,hh)});
  h.fillStyle=`rgba(255,${60+Math.sin(t/230)*25|0},50,.95)`;h.beginPath();h.arc(0,43,2.4,0,7);h.fill();
  /* charred, wrapped head with glowing cracks */
  h.fillStyle=lg(h,0,-10,0,40,[[0,c(70,30,12)],[.5,c(34,18,10)],[1,c(16,9,6)]]);
  h.beginPath();h.moveTo(-9,40);h.bezierCurveTo(-18,24,-17,6,-12,-4);h.lineTo(-6,-10);h.lineTo(-2,-3);h.lineTo(3,-12);h.lineTo(8,-4);h.lineTo(13,-2);h.bezierCurveTo(17,8,18,26,9,40);h.closePath();h.fill();
  h.strokeStyle=c(95,60,30,.8);h.lineWidth=1.6;[8,17,26,34].forEach(y=>{h.beginPath();h.moveTo(-15,y);h.quadraticCurveTo(0,y+5,15,y-1);h.stroke()});
  h.globalCompositeOperation='lighter';
  const eg=h.createRadialGradient(0,-6,1,0,-4,24);eg.addColorStop(0,`rgba(255,170,60,${.9*ign*fl})`);eg.addColorStop(1,'rgba(255,60,10,0)');h.fillStyle=eg;h.fillRect(-26,-28,52,54);
  h.lineWidth=1.2;[[-8,6,-3,13],[4,2,9,10],[-2,18,3,26],[-10,24,-6,31]].forEach((q,i)=>{h.strokeStyle=`rgba(255,110,30,${(.35+.4*Math.sin(t/190+i*2))*ign})`;h.beginPath();h.moveTo(q[0],q[1]);h.lineTo(q[2],q[3]);h.stroke()});
  h.globalCompositeOperation='source-over';
  if(!coarse){
    /* crimson cloak sleeve fading into the dark */
    const A=.2+.28*Lf;
    h.fillStyle=lg(h,0,150,-120,330,[[0,`rgba(140,20,22,${A})`],[.4,`rgba(80,8,12,${A*.5})`],[.75,'rgba(40,4,8,0)']]);
    h.beginPath();h.moveTo(-15,148);h.bezierCurveTo(-42,190,-92,250,-150,335);h.lineTo(-84,350);h.bezierCurveTo(-30,272,12,214,22,156);h.closePath();h.fill();
    h.strokeStyle='rgba(30,0,2,.5)';h.lineWidth=1.4;
    [[-6,166,-48,236,-100,318],[4,172,-20,246,-62,330],[12,176,6,236,-24,300]].forEach(([a,b,cx,cy,x,y])=>{h.beginPath();h.moveTo(a,b);h.quadraticCurveTo(cx,cy,x,y);h.stroke()});
    h.strokeStyle=`rgba(255,100,80,${.18*Lf})`;h.beginPath();h.moveTo(18,170);h.quadraticCurveTo(0,240,-40,300);h.stroke();
    /* gripping hand: back of hand, four fingers, thumb */
    const m=Lf*.7,sk=(k=1)=>`rgb(${215*m*k|0},${160*m*k|0},${128*m*k|0})`;
    h.fillStyle=sk(.8);h.beginPath();h.ellipse(11,142,9,19,.05,0,7);h.fill();
    for(let i=0;i<4;i++){const y=124+i*9.2,k=1-i*.14;h.fillStyle=lg(h,-8,y,14,y,[[0,sk(.55*k)],[.5,sk(k)],[1,sk(.7*k)]]);h.beginPath();h.ellipse(3,y+4,12.5,5.4,0,0,7);h.fill();h.strokeStyle=sk(.3);h.lineWidth=.9;h.stroke()}
    h.fillStyle=sk(1.05);h.beginPath();h.ellipse(-7,121,4.4,8,.5,0,7);h.fill();
  }
  h.restore();
}

function loop(t){
  requestAnimationFrame(loop);
  if(document.hidden)return;
  const L=(typeof LC!=='undefined'?LC:null),on=L&&document.body.classList.contains('candle');
  if(!on){wasOn=false;return}
  const dt=Math.min(.05,(t-last)/1000||.016);last=t;
  if(!wasOn){wasOn=true;ign=0;P=[];E=[];lx=L.x;ly=L.y;boost=1.2}
  /* torch motion: speed, swinging handle, flame sputters when swung hard */
  vx+=((L.x-lx)/dt-vx)*.2;vy+=((L.y-ly)/dt-vy)*.2;lx=L.x;ly=L.y;
  const sp=Math.hypot(vx,vy),tgt=vis*Math.max(.3,1-sp/3600);
  ign+=(tgt-ign)*Math.min(1,dt*(tgt>ign?1.6:6));boost=Math.max(0,boost-dt*1.4);
  const fl=L.fl||1,k=ign*(1+boost*.9),sz=(coarse?.85:1.15)*(.6+.4*ign)*(1+boost*.25)*fl;
  ang+=(om+=(-(ang-(Math.max(-.7,Math.min(.7,vx*.00045))+.05))*38-om*5.5)*dt)*dt;
  const wind=40+26*Math.sin(t/1300)+14*Math.sin(t/410),BY=HY+58,BASE=ly+58,ox=lx-HX,oy=ly-HY;
  const tr=`translate3d(${ox}px,${oy}px,0)`;cF.style.transform=cH.style.transform=tr;dot.style.transform=`translate3d(${L.tx}px,${L.ty}px,0)`;dot.style.opacity=vis;
  cF.style.opacity=cH.style.opacity=(.3+.7*Math.min(1,ign*1.2)).toFixed(2);

  /* emitters: white-hot core, red wisps, fine sparks, embers, burning drips */
  const em=(i,rate,f)=>{ac[i]+=rate*k*dt;while(ac[i]>=1){ac[i]--;f()}};
  em(0,95,()=>P.push({x:lx+(rnd()-.5)*12*sz,y:BASE-2+rnd()*6,vy:-(90+rnd()*70)*sz,life:.45+rnd()*.4,s:(14+rnd()*12)*sz,a:.6,cs:1.15,c0:0,f:5+rnd()*5,ph:rnd()*6,amp:14+rnd()*14,t:0,ty:0}));
  em(1,55,()=>P.push({x:lx+(rnd()-.5)*16*sz,y:BASE-8,vy:-(55+rnd()*55)*sz,life:1+rnd(),s:(16+rnd()*14)*sz,a:.24,cs:.9,c0:2,f:2+rnd()*3,ph:rnd()*6,amp:20+rnd()*26,t:0,ty:1}));
  em(2,130,()=>P.push({x:lx+(rnd()-.5)*14*sz,y:BASE-4,vy:-(100+rnd()*90)*sz,life:.3+rnd()*.5,s:(3+rnd()*5)*sz,a:.55,cs:1.4,c0:0,f:7+rnd()*6,ph:rnd()*6,amp:8+rnd()*10,t:0,ty:0}));
  em(3,7,()=>E.push({x:lx+(rnd()-.5)*20,y:BASE-20-rnd()*60,vx:(rnd()-.2)*40+wind*.6,vy:-(30+rnd()*70),life:1.2+rnd()*1.8,t:0,s:.8+rnd()*1.4,d:0}));
  em(4,.35,()=>E.push({x:lx+(rnd()-.5)*10,y:BASE+4,vx:(rnd()-.5)*20,vy:20,life:1.4,t:0,s:2,d:1}));

  gF.setTransform(DP,0,0,DP,0,0);gF.clearRect(0,0,CW,CH);gF.globalCompositeOperation='lighter';
  /* bloom + white-hot root */
  gF.globalAlpha=.16*ign*fl;gF.drawImage(spr[2],HX-210,HY-190,420,420);
  gF.globalAlpha=.2*ign*fl;gF.drawImage(spr[1],HX-80,HY-85,160,160);
  gF.globalAlpha=Math.min(1,.5*ign);const rs=(20+Math.sin(t/55)*3)*sz;gF.drawImage(spr[0],HX-rs,BY-8-rs*1.3,rs*2,rs*2.6);
  /* flame particles */
  P=P.filter(p=>{p.t+=dt;const u=p.t/p.life;if(u>=1)return false;
    p.y+=p.vy*dt;p.x+=(Math.sin(p.t*p.f+p.ph)*p.amp*(.3+u*1.6)+wind*(.25+u*1.5))*dt;
    const s=p.ty?p.s*(.55+u*.9):p.s*(1-u*.7),a=p.a*Math.pow(1-u,1.3)*Math.min(1,p.t*10)*(.85+.15*Math.sin(t/37+p.ph)),i=Math.min(S-1,Math.floor(p.c0+u*p.cs*(S-1-p.c0)));
    gF.globalAlpha=Math.min(1,a);gF.drawImage(spr[i],p.x-ox-s,p.y-oy-s,s*2,s*2);return true});
  /* embers (streaks) and drips (fall under gravity) */
  E=E.filter(e=>{e.t+=dt;const u=e.t/e.life;if(u>=1)return false;
    if(e.d)e.vy+=520*dt;else{e.vx+=(wind*1.2-e.vx)*dt*.8;e.vy-=8*dt}
    e.x+=e.vx*dt;e.y+=e.vy*dt;const X=e.x-ox,Y=e.y-oy,a=(1-u)*(.6+.4*Math.sin(t/60+e.s*9));
    if(e.d){gF.globalAlpha=a;gF.drawImage(spr[2],X-4,Y-7,8,14)}
    else{gF.globalAlpha=1;gF.strokeStyle=`rgba(255,${150+rnd()*80|0},70,${a})`;gF.lineWidth=e.s;gF.beginPath();gF.moveTo(X-e.vx*.03,Y-e.vy*.03);gF.lineTo(X,Y);gF.stroke()}
    return true});
  /* dust motes drifting in the torchlight */
  M.forEach(m=>{m.x+=(Math.sin(t/3000+m.p)*6+3)*dt;m.y-=(2+m.z*4)*dt;if(m.y<0)m.y=innerHeight;if(m.x>innerWidth)m.x=0;
    const d=Math.hypot(m.x-lx,m.y-(ly-30)),a=Math.max(0,1-d/200)*.55*ign*(.5+.5*Math.sin(t/900+m.p*3));
    if(a>.01){gF.globalAlpha=a;const s=3+m.z*3;gF.drawImage(spr[1],m.x-ox-s,m.y-oy-s,s*2,s*2)}});
  gF.globalAlpha=1;gF.globalCompositeOperation='source-over';
  drawHandle(gH,.35+.65*Math.min(1,fl*ign),fl,t,BY);
}
requestAnimationFrame(loop);
})();
