/* Drill Up – a M.E.D.V.E. jármű kézzel rajzolt illusztrációja (assets/veh/*.svg), a referenciakép stílusában.
   A statikus test (hajótest, ablakkeretek, sárga-fekete panel, hátsó daru horoggal, lámpák, poroltó) és a gőzkazán kéménnyel képből jön;
   a mozgó részeket (lánctalp, fúrófej, legénység, füst, fények, fogaskerék, tolólapok) továbbra is a játék rajzolja.
   A képek az aktuális nagyításhoz igazodva, egyszer raszterizálódnak (méretenként gyorsítótárazva). Amíg nincsenek betöltve, a régi rajz látszik. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('vart');
const IMG={},CACHE=new Map();
const ART={body:{f:'body',x0:-13.9,y0:-2.9,w:8.45,h:4.22},boiler:{f:'boiler',x0:-12.45,y0:-4.6,w:3.2,h:3.15}};
function im(n){if(typeof Image==='undefined')return null;let i=IMG[n];if(!i){i=IMG[n]=new Image();i.src='assets/veh/'+n+'.svg'}return i.complete&&i.naturalWidth?i:null}
function spr(a,scale){const i=im(a.f);if(!i||typeof document==='undefined')return null;const pw=Math.max(8,Math.round(a.w*scale/8)*8),ph=Math.max(8,Math.round(pw*a.h/a.w)),k=a.f+'|'+pw;
 let c=CACHE.get(k);if(c)return c;c=document.createElement('canvas');c.width=pw;c.height=ph;const g=c.getContext('2d');if(!g)return null;g.drawImage(i,0,0,pw,ph);if(CACHE.size>12)CACHE.clear();CACHE.set(k,c);return c}
function draw(x,a){let s=40;try{const m=x.getTransform();s=Math.hypot(m.a,m.b)}catch(e){}const c=spr(a,Math.min(160,Math.max(8,s)));if(!c)return false;x.drawImage(c,a.x0,a.y0,a.w,a.h);return true}
const VART={
 ok(){return !!(im('body')&&im('boiler'))},
 body(x,o){draw(x,ART.body);
  // éjjel / a mélyben a kabin ablakai meleg fénnyel világítanak; a legénységet a meglévő modul rajzolja az ablakokba
  if(o.lit2){x.fillStyle='rgba(255,214,140,.32)';for(let i=0;i<3;i++)x.fillRect(-9.1+i*1.05,-1.2,.95,.9)}
  if(W.BG&&BG.crew)BG.crew(x,{ts:o.ts,act:o.act,hyd:o.hyd,lit2:o.lit2})},
 boiler(x,o){draw(x,ART.boiler);
  // füst a kémény tetejéből
  const t=(o.ts||0)/1000;for(let k=0;k<5;k++){const ph=(t*.55+k/5)%1;x.fillStyle=`rgba(225,228,232,${(.5*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(-10.96-ph*1.2,-4.5-ph*2.2,.22+ph*.7,0,7);x.fill()}}};
W.VART=VART;
VART.preload=()=>{im('body');im('boiler')};VART.preload();
})(typeof window!=='undefined'?window:globalThis);
