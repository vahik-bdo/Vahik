/* iPhone/iPad: звук не должен молчать из-за беззвучного режима и «уснувшего» AudioContext */
(()=>{
 try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 const ctxs=[];
 function Wrapped(...a){const c=new AC(...a);ctxs.push(c);try{c.addEventListener('statechange',()=>{if(c.state!=='running'&&c.state!=='closed')c.resume().catch(()=>{})})}catch(e){}return c}
 Wrapped.prototype=AC.prototype;
 window.AudioContext=Wrapped;window.webkitAudioContext=Wrapped;
 let a=null,started=false;
 function silent(){const n=4000,b=new ArrayBuffer(44+n),v=new DataView(b),w=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))};
  w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);new Uint8Array(b,44).fill(128);
  const el=new Audio(URL.createObjectURL(new Blob([b],{type:'audio/wav'})));el.loop=true;el.setAttribute('playsinline','');el.preload='auto';return el}
 function unlock(){
  if(!started){started=true;try{a=a||silent();const p=a.play();if(p&&p.catch)p.catch(()=>{started=false})}catch(e){started=false}}
  ctxs.forEach(c=>{if(c.state!=='running'&&c.state!=='closed')c.resume().catch(()=>{})});
 }
 ['touchend','pointerup','click','keydown'].forEach(ev=>addEventListener(ev,unlock,{passive:true,capture:true}));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){ctxs.forEach(c=>{if(c.state!=='running'&&c.state!=='closed')c.resume().catch(()=>{})});if(a&&started)a.play().catch(()=>{})}});
})();
