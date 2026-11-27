/* Drill Up – orosz (szovjet) típusú, masszív mechanikus műszerfal a kezelőpulton.
   Saját rajz (nem kép): csavarozott acél- és sárgaréz peremű kerek órák, olívzöld négyzetes műszer, üvegcsöves szintjelző, jelzőlámpák.
   Üzemanyag (szintjelző cső), nyomás, hőmérséklet, raktár, motor (fordulat), generátor (terhelés). A számlapok egyszer, előre rajzolódnak
   (méretváltáskor újra), képkockánként csak a mutató mozog – rugózva, mechanikusan, járó motornál enyhe remegéssel.
   Érintés: motor → be/ki, generátor → be/ki, üzemanyag → tankolás a bázison, raktár → Raktár panel, nyomás/hőmérséklet → Adatok panel. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('gauges');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),TAU=Math.PI*2;
const lg=(v,mx)=>Math.log10(1+Math.max(0,v))/Math.log10(1+mx);
const safe=f=>{try{const v=f();return isFinite(v)?v:0}catch(e){return 0}};
// műszerek: típus, felirat, értékfüggvény (0..1), skála-feliratok, piros zóna kezdete (0..1), kijelzett érték szövege
const DEF=[
 {k:'fuel',t:'tube',lab:'ÜZEMANYAG',v:()=>safe(()=>S.fuel/Math.max(1e-9,tank())),warnLow:.15},
 {k:'pres',t:'round',rim:'steel',lab:'NYOMÁS',unit:'MPa',v:()=>safe(()=>lg(lerp(PT,Math.max(0,S.depth))*1000,360000)),sc:['0','10','1k','100k'],sp:[0,lg(10,360000),lg(1000,360000),lg(1e5,360000)],red:.82},
 {k:'temp',t:'round',rim:'brass',lab:'HŐMÉRSÉKLET',unit:'°C',v:()=>safe(()=>{const d=Math.max(0,S.depth);const T=W.VOL?VOL.tm(S.x,d,lerp(TT,d)):lerp(TT,d);return Math.sqrt(Math.max(0,T)/6000)}),sc:['0','200','1500','6000'],sp:[0,Math.sqrt(200/6000),Math.sqrt(1500/6000),1],red:.78},
 {k:'cargo',t:'olive',lab:'RAKTÁR',v:()=>safe(()=>{const c=W.DEP&&DEP.room?1-DEP.room()/Math.max(1,cap()):cargoKg()/Math.max(1,cap());return c}),red:.88},
 {k:'eng',t:'round',rim:'steel',lab:'MOTOR',unit:'×1000/p',v:()=>safe(()=>W.ENG?ENG.rpm/1.25:0),sc:['0','1','2','3'],red:.84,tap:()=>W.PW&&PW.toggleEng()},
 {k:'bit',t:'olive',lab:'FÚRÓFEJ',v:()=>safe(()=>(S.hw||0)/100),red:.8,tap:()=>{try{shT('head')}catch(e){}}},
 {k:'gen',t:'olive',lab:'GENERÁTOR',v:()=>safe(()=>W.GEN&&GEN.running()?cl(GEN.lf,0,1):0),red:.9,lamp:()=>safe(()=>W.GEN&&GEN.running()?1:0),tap:()=>W.PW&&PW.toggleGen()}];
DEF[0].tap=()=>{try{if(typeof base==='function'&&base())fill(1);else toast('⛽ Tankolni a bázison lehet (⌂).')}catch(e){}};
DEF[3].tap=()=>{try{shT('store')}catch(e){}};DEF[1].tap=DEF[2].tap=()=>{try{shT('info')}catch(e){}};
const GAU={DEF,val:{},vel:{},faces:{},key:'',
 ui(keys,cls){const L=keys?keys.map(k=>DEF.find(d=>d.k===k)).filter(Boolean):DEF;return`<div class="gauges ${cls||''}">`+L.map(d=>`<canvas class="gi gi-${d.t}" data-k="${d.k}" role="button" aria-label="${d.lab}"></canvas>`).join('')+'</div>'}};
W.GAU=GAU;

// ---------- számlapok (előre rajzolva) ----------
function screws(x,pts,r){for(const[px,py]of pts){const g=x.createRadialGradient(px-r*.3,py-r*.3,0,px,py,r);g.addColorStop(0,'#f2f2ee');g.addColorStop(1,'#55534e');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,TAU);x.fill();x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=r*.35;x.beginPath();x.moveTo(px-r*.6,py);x.lineTo(px+r*.6,py);x.moveTo(px,py-r*.6);x.lineTo(px,py+r*.6);x.stroke()}}
function grime(x,cx,cy,r,seed){for(let i=0;i<14;i++){const a=(seed*13+i*2.4)%TAU,d=r*((i*37%100)/100)*.9;x.fillStyle=`rgba(120,90,40,${.05+(i%4)*.025})`;x.beginPath();x.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,r*(.05+(i%3)*.04),0,TAU);x.fill()}}
const A0=Math.PI*.75,A1=Math.PI*2.25; // kerek óra: 270°-os ív
function roundFace(x,w,h,d){const cx=w/2,cy=h*.47,R=Math.min(w,h*1.05)*.47;
 // perem
 let g=x.createLinearGradient(0,cy-R,0,cy+R);if(d.rim==='brass'){g.addColorStop(0,'#f3d48a');g.addColorStop(.5,'#a77a2a');g.addColorStop(1,'#5a3e12')}else{g.addColorStop(0,'#e4e6e8');g.addColorStop(.5,'#7d8288');g.addColorStop(1,'#33363a')}
 x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,TAU);x.fill();x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=1;x.stroke();
 const sp=[];for(let i=0;i<6;i++){const a=i/6*TAU+.5;sp.push([cx+Math.cos(a)*R*.86,cy+Math.sin(a)*R*.86])}screws(x,sp,R*.065);
 // számlap
 const r=R*.74;g=x.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g.addColorStop(0,'#fbf5e4');g.addColorStop(1,'#d9cba6');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();x.strokeStyle='#2a2622';x.lineWidth=1.2;x.stroke();grime(x,cx,cy,r,d.k.length);
 // piros zóna
 if(d.red){x.strokeStyle='#c8261c';x.lineWidth=r*.16;x.beginPath();x.arc(cx,cy,r*.8,A0+(A1-A0)*d.red,A1);x.stroke()}
 // osztás
 x.strokeStyle='#1d1a16';for(let i=0;i<=30;i++){const a=A0+(A1-A0)*i/30,big=i%10===0,l=big?r*.2:i%5===0?r*.13:r*.08;x.lineWidth=big?1.3:.7;x.beginPath();x.moveTo(cx+Math.cos(a)*r*.88,cy+Math.sin(a)*r*.88);x.lineTo(cx+Math.cos(a)*(r*.88-l),cy+Math.sin(a)*(r*.88-l));x.stroke()}
 x.fillStyle='#1d1a16';x.font=`bold ${Math.max(6,r*.2)}px Georgia`;x.textAlign='center';x.textBaseline='middle';
 (d.sc||[]).forEach((s,i)=>{const a=A0+(A1-A0)*(d.sp?d.sp[i]:i/3);x.fillText(s,cx+Math.cos(a)*r*.52,cy+Math.sin(a)*r*.52)});
 x.font=`${Math.max(5,r*.17)}px Georgia`;x.fillStyle='#3a332a';if(d.unit)x.fillText(d.unit,cx,cy-r*.36);
 labelPlate(x,w,h,d)}
function oliveFace(x,w,h,d){const pad=2,cx=w/2,top=pad,bh=h*.86;
 const g=x.createLinearGradient(0,0,0,bh);g.addColorStop(0,'#6b7448');g.addColorStop(1,'#3d4428');x.fillStyle=g;rr(x,pad,top,w-pad*2,bh-pad,6);x.fill();x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=1;x.stroke();
 screws(x,[[pad+5,top+5],[w-pad-5,top+5],[pad+5,bh-6],[w-pad-5,bh-6]],2.2);
 const R=Math.min(w*.4,bh*.42),cy=top+bh*.5;x.fillStyle='#9aa0a6';x.beginPath();x.arc(cx,cy,R+2.5,0,TAU);x.fill();x.fillStyle='#4a512f';x.beginPath();x.arc(cx,cy,R,0,TAU);x.fill();
 // felső, krémszínű skála-félkör
 x.save();x.beginPath();x.arc(cx,cy,R,Math.PI,TAU);x.closePath();x.clip();x.fillStyle='#efe5c8';x.fillRect(cx-R,cy-R,R*2,R);grime(x,cx,cy-R*.4,R*.8,d.k.length+3);x.restore();
 x.strokeStyle='#c8261c';x.lineWidth=R*.2;x.beginPath();x.arc(cx,cy,R*.78,Math.PI+Math.PI*d.red,TAU-.02);x.stroke();
 x.strokeStyle='#1d1a16';for(let i=0;i<=10;i++){const a=Math.PI+Math.PI*i/10,l=i%5?R*.1:R*.18;x.lineWidth=i%5?.7:1.2;x.beginPath();x.moveTo(cx+Math.cos(a)*R*.95,cy+Math.sin(a)*R*.95);x.lineTo(cx+Math.cos(a)*(R*.95-l),cy+Math.sin(a)*(R*.95-l));x.stroke()}
 x.strokeStyle='#1d1a16';x.lineWidth=1;x.beginPath();x.moveTo(cx-R,cy);x.lineTo(cx+R,cy);x.stroke();
 labelPlate(x,w,h,d)}
function tubeFace(x,w,h,d){const cx=w/2,tw=Math.max(8,w*.34),t0=h*.1,t1=h*.76;
 // sárgaréz kupakok
 for(const y of[t0-5,t1]){const g=x.createLinearGradient(cx-tw,0,cx+tw,0);g.addColorStop(0,'#5a3e12');g.addColorStop(.5,'#f0cf80');g.addColorStop(1,'#5a3e12');x.fillStyle=g;rr(x,cx-tw*.85,y,tw*1.7,6,2);x.fill()}
 // tartórudak + skála
 x.fillStyle='#6b6f75';x.fillRect(cx-tw*.85,t0,2,t1-t0);x.fillStyle='#b9bec4';x.fillRect(cx+tw*.55,t0,w*.3,t1-t0);
 x.strokeStyle='#1d1a16';x.fillStyle='#1d1a16';x.font='5.5px Georgia';x.textAlign='left';x.textBaseline='middle';
 for(let i=0;i<=10;i++){const y=t1-(t1-t0)*i/10;x.lineWidth=i%5?.6:1;x.beginPath();x.moveTo(cx+tw*.55,y);x.lineTo(cx+tw*.55+(i%5?3:6),y);x.stroke()}
 // üveg
 x.fillStyle='rgba(200,225,235,.25)';rr(x,cx-tw*.45,t0,tw*.9,t1-t0,3);x.fill();x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1;x.stroke();
 labelPlate(x,w,h,d)}
function labelPlate(x,w,h,d){x.fillStyle='rgba(15,13,11,.85)';rr(x,1,h*.86,w-2,h*.14-1,2);x.fill();x.fillStyle='#e9dfc6';x.font=`bold ${Math.max(5.5,Math.min(8,w*.13))}px Georgia`;x.textAlign='center';x.textBaseline='middle';x.fillText(d.lab,w/2,h*.93,w-4)}
function rr(x,a,b,w,h,r){x.beginPath();if(x.roundRect)x.roundRect(a,b,w,h,r);else x.rect(a,b,w,h)}

// ---------- mutatók (képkockánként) ----------
function needle(x,cx,cy,a,len,col,w){x.save();x.translate(cx,cy);x.rotate(a);x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.moveTo(-len*.18,w*.9+1);x.lineTo(len+1,1);x.lineTo(-len*.18,-w*.9+1);x.fill();
 x.fillStyle=col;x.beginPath();x.moveTo(-len*.2,w);x.lineTo(len,0);x.lineTo(-len*.2,-w);x.closePath();x.fill();x.restore();
 const g=x.createRadialGradient(cx-1,cy-1,0,cx,cy,w*2.2);g.addColorStop(0,'#eee');g.addColorStop(1,'#2a2a2a');x.fillStyle=g;x.beginPath();x.arc(cx,cy,w*2,0,TAU);x.fill();x.fillStyle='#b8261c';x.beginPath();x.arc(cx,cy,w*.8,0,TAU);x.fill()}
function lamp(x,px,py,r,on,col){const g=x.createRadialGradient(px-r*.3,py-r*.3,0,px,py,r);g.addColorStop(0,on?'#fff':'#bbb');g.addColorStop(.35,on?col:'#3a3a3a');g.addColorStop(1,on?'#3a0a05':'#111');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,TAU);x.fill();x.strokeStyle='#888';x.lineWidth=.8;x.stroke();
 if(on){x.fillStyle=col.replace('rgb','rgba').replace(')',',.25)');x.beginPath();x.arc(px,py,r*2.2,0,TAU);x.fill()}}
function draw(cv,d,ts){const w=cv.clientWidth,h=cv.clientHeight;if(w<10||h<10)return;const dp=Math.min(2,W.devicePixelRatio||1),key=w+'x'+h+'@'+dp;
 if(cv._k!==key){cv._k=key;cv.width=Math.round(w*dp);cv.height=Math.round(h*dp);const f=document.createElement('canvas');f.width=cv.width;f.height=cv.height;const fx=f.getContext('2d');fx.scale(dp,dp);
  (d.t==='round'?roundFace:d.t==='olive'?oliveFace:tubeFace)(fx,w,h,d);cv._f=f}
 const x=cv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.drawImage(cv._f,0,0);x.setTransform(dp,0,0,dp,0,0);
 // rugózott mutató + remegés járó motornál
 const tgt=cl(d.v(),0,1.08),v0=GAU.val[d.k]??tgt,vv=GAU.vel[d.k]||0,acc=(tgt-v0)*60-vv*11,nv=vv+acc/60,nval=v0+nv/60;GAU.vel[d.k]=nv;GAU.val[d.k]=nval;
 const shake=W.ENG&&S.en&&ENG.rpm>.1?Math.sin(ts/23+d.k.length)*.006*ENG.rpm:0,v=cl(nval+shake,0,1.08);
 const red=d.warnLow?v<d.warnLow:v>=(d.red||2),blink=Math.floor(ts/350)%2===0;
 if(d.t==='round'){const cx=w/2,cy=h*.47,R=Math.min(w,h*1.05)*.47,r=R*.74;needle(x,cx,cy,A0+(A1-A0)*v,r*.82,'#141210',Math.max(1.2,r*.07));
  lamp(x,cx,cy+r*.72,Math.max(2,r*.1),red&&blink,'rgb(255,60,40)')}
 else if(d.t==='olive'){const cx=w/2,bh=h*.86,R=Math.min(w*.4,bh*.42),cy=2+bh*.5;needle(x,cx,cy,Math.PI+Math.PI*cl(v,0,1),R*.86,'#141210',Math.max(1.1,R*.07));
  lamp(x,cx,cy+R*.55,Math.max(2,R*.12),d.lamp?d.lamp()>0:red&&blink,d.lamp?'rgb(70,230,90)':'rgb(255,60,40)');if(d.lamp&&red&&blink)lamp(x,cx+R*.45,cy+R*.55,Math.max(2,R*.1),true,'rgb(255,60,40)')}
 else{const cx=w/2,tw=Math.max(8,w*.34),t0=h*.1,t1=h*.76,lv=t1-(t1-t0)*cl(v,0,1),g=x.createLinearGradient(cx-tw*.45,0,cx+tw*.45,0);g.addColorStop(0,'#7a3d06');g.addColorStop(.5,'#ffb43a');g.addColorStop(1,'#7a3d06');
  x.fillStyle=g;x.fillRect(cx-tw*.4,lv,tw*.8,t1-lv);x.fillStyle='rgba(255,240,200,.7)';x.fillRect(cx-tw*.4,lv,tw*.8,1.2);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(cx-tw*.25,t0+2,1.5,t1-t0-4);
  lamp(x,cx,h*.81,Math.max(2,w*.08),red&&blink,'rgb(255,60,40)')}}
let last=0;
if(W.on)on('frame',()=>{if(typeof document==='undefined'||!document.getElementById)return;const ts=performance.now();if(ts-last<30)return;last=ts;
 try{document.querySelectorAll('.gauges canvas').forEach(cv=>{if(!cv.offsetParent)return;const d=DEF.find(q=>q.k===cv.dataset.k);if(d)draw(cv,d,ts)})}catch(e){if(W.DBG)DBG.err='gauges: '+(e.message||e)}});
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('click',e=>{const c=e.target&&e.target.closest&&e.target.closest('.gauges canvas');if(!c)return;const d=DEF.find(q=>q.k===c.dataset.k);if(d&&d.tap){try{d.tap()}catch(_){}try{beep(300,.04,.05,'square')}catch(_){}}});
})(typeof window!=='undefined'?window:globalThis);
