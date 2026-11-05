/* Drill Up – zuhanófék karok: négy hidraulikus kar feszül a járat falának, a fékezés erejével arányosan.
   Csak megjelenítés + hang (a fékerőt a tunnels.js számolja: AB, hőterhelés). A karok két párban, a gép két oldalán ülnek, a nyomás a NET.bk-tól függ. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('brakearms');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const ARM={e:0,pe:0,
 // a, a gép hossztengelye menti hely (méter, a faroktól az orr felé negatív), b: oldal
 AT:[-2.2,-5.6],
 upd(dt){const t=W.NET?cl(NET.bk*1.15,0,1):0;ARM.pe=ARM.e;ARM.e+=(t-ARM.e)*Math.min(1,dt*9);
  if(ARM.pe<.35&&ARM.e>=.35){try{clank(.5)}catch(e){}}},
 draw(V){const e=ARM.e;if(e<.03||!V||!V.lw)return;const x=V.x,lw=V.lw,hot=W.NET?cl((NET.bkT||0)/1.5,0,1):0;
  x.save();x.lineCap='round';x.lineJoin='round';
  for(const sg of[-1,1])for(const a0 of ARM.AT){
   const h=lw(a0,sg*1.05),                                  // csukló a gép oldalán
         p=lw(a0-.9*e,sg*(1.05+1.25*e)),                    // a kar vége (a fal felé tolódik; a farok felé dől)
         m=lw(a0+.5*(1-e),sg*(1.05+.55*e)),                // könyök
         s=lw(a0+1.5,sg*1.15);                             // a munkahenger beágyazása
   // munkahenger (fényes dugattyú)
   x.strokeStyle='#2f3236';x.lineWidth=5;x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(m[0],m[1]);x.stroke();
   x.strokeStyle='#cfd3d8';x.lineWidth=2;x.beginPath();x.moveTo((s[0]*.4+m[0]*.6),(s[1]*.4+m[1]*.6));x.lineTo(m[0],m[1]);x.stroke();
   // kar: két szár
   x.strokeStyle='#4f535a';x.lineWidth=6;x.beginPath();x.moveTo(h[0],h[1]);x.lineTo(m[0],m[1]);x.lineTo(p[0],p[1]);x.stroke();
   x.strokeStyle='#e2b228';x.lineWidth=1.6;x.beginPath();x.moveTo(h[0],h[1]);x.lineTo(m[0],m[1]);x.lineTo(p[0],p[1]);x.stroke();
   // fékpofa: a végén, kormosodik/izzik a hőtől
   const dx=p[0]-m[0],dy=p[1]-m[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,w=6;
   x.strokeStyle=hot>.25?`rgb(${Math.round(120+135*hot)},${Math.round(70+40*(1-hot))},40)`:'#2b2d31';x.lineWidth=7;x.beginPath();x.moveTo(p[0]-nx*w,p[1]-ny*w);x.lineTo(p[0]+nx*w,p[1]+ny*w);x.stroke();
   x.fillStyle='#e2b228';x.beginPath();x.arc(h[0],h[1],2.4,0,7);x.fill();x.beginPath();x.arc(m[0],m[1],2,0,7);x.fill()}
  x.restore()}};
W.ARM=ARM;
if(W.on){on('frame',dt=>{try{ARM.upd(dt)}catch(e){}});on('world.front',V=>{try{ARM.draw(V)}catch(e){if(W.DBG)DBG.err='kar: '+(e.message||e)}})}
})(typeof window!=='undefined'?window:globalThis);
