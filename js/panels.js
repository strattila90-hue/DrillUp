/* Drill Up – a játék közbeni kijelzők (kisablakok) bezárása kis ✕ gombbal, és könnyű előhívásuk a 👁 gombbal.
   Állapot: S.set.ph = {azonosító:1} = elrejtve. A modulok PN.vis(id)-vel kérdezik, és PN.reg(id,x,y,w,h)-val jelentik a téglalapjukat. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('panels');
const NAMES={face:['🔍','Közeli nézet a fúrófejről'],sz:['📡','Szeizmográf'],lab:['🧪','Mintamonitor'],gg:['📏','Réteg-kártya (mélységjelző)'],hull:['🛡','Páncél-kijelző'],sto:['📜','Beszámoló-kártyák']};
const PN={NAMES,R:[],H:[],L:{},bt:0,
 ph(){return(S.set.ph&&typeof S.set.ph==='object')?S.set.ph:(S.set.ph={})},
 vis(id){try{return !PN.ph()[id]}catch(e){return true}},
 nHidden(){let n=0;try{for(const k in NAMES)if(!PN.vis(k))n++}catch(e){}return n},
 set(id,v){if(!NAMES[id])return;PN.ph()[id]=v?0:1;try{beep(v?700:420,.05,.04,'sine')}catch(e){}PN.badge();PN.pop(true)},
 reg(id,x,y,w,h){PN.R.push({id,x,y,w,h});PN.L[id]={x,y,w,h,t:Date.now()}},
 rc(id){const r=PN.L[id];return r&&Date.now()-r.t<400?r:null},
 at(px,py){for(const r of PN.H)if(px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h)return r;return null},
 draw(x,V){const cin=W.CIN&&CIN.on;PN.H=[];if(!cin){x.save();for(const r of PN.R){const cx=r.x+r.w-6,cy=r.y+6;x.fillStyle='#d62f27';x.strokeStyle='#fff';x.lineWidth=1.5;x.beginPath();x.arc(cx,cy,9,0,7);x.fill();x.stroke();x.lineWidth=2;x.lineCap='round';x.beginPath();x.moveTo(cx-3.4,cy-3.4);x.lineTo(cx+3.4,cy+3.4);x.moveTo(cx+3.4,cy-3.4);x.lineTo(cx-3.4,cy+3.4);x.stroke();PN.H.push({id:r.id,x:cx-20,y:cy-20,w:40,h:40})}x.restore()}PN.R=[]},
 badge(){if(typeof document==='undefined'||!document.getElementById)return;const b=document.getElementById('pnBtn');if(!b)return;const n=PN.nHidden();b.dataset.n=n?String(n):'';},
 btn(){if(typeof document==='undefined'||!document.getElementById)return;const st=document.getElementById('stage');if(!st||document.getElementById('pnBtn'))return;
  const b=document.createElement('button');b.id='pnBtn';b.setAttribute('aria-label','Kijelzők');b.textContent='👁';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();PN.pop()};st.appendChild(b);PN.badge()},
 pop(keep){if(typeof document==='undefined'||!document.getElementById)return;const st=document.getElementById('stage');if(!st)return;let p=document.getElementById('pnPop');
  if(p&&!keep){p.remove();return}if(!p&&keep)return;if(!p){p=document.createElement('div');p.id='pnPop';st.appendChild(p)}
  let h='<div class="pnh">Kijelzők</div>';for(const k in NAMES){const on=PN.vis(k);h+=`<button class="pnr${on?' on':''}" onpointerdown="event.stopPropagation();PN.set('${k}',${on?0:1})"><span>${NAMES[k][0]} ${NAMES[k][1]}</span><i>${on?'látszik':'rejtve'}</i></button>`}
  h+=`<button class="pnr all" onpointerdown="event.stopPropagation();PN.all()">Mind látszik</button>`;p.innerHTML=h},
 all(){const o=PN.ph();for(const k in NAMES)o[k]=0;PN.badge();PN.pop(true)},
 step(dt){PN.bt+=dt;if(PN.bt>.6){PN.bt=0;PN.btn()}}
};
W.PN=PN;
if(W.on){on('frame',dt=>{try{PN.step(Math.min(dt,.1))}catch(e){}});on('hud2',V=>{try{PN.draw(V.x,V)}catch(e){DBG.err='panels: '+(e.message||e)}})}
if(typeof document!=='undefined'){let dn=null;
 document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null;const p=document.getElementById&&document.getElementById('pnPop');if(p&&!p.contains(e.target)&&!(e.target&&e.target.id==='pnBtn'))p.remove()},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;
  const r=e.target.getBoundingClientRect(),h=PN.at(e.clientX-r.left,e.clientY-r.top);if(h){e.stopPropagation();PN.set(h.id,0);const p=document.getElementById('pnPop');if(p)PN.pop(true)}},true)}
})(typeof window!=='undefined'?window:globalThis);
