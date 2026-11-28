/* Drill Up – koppintás a gépre: ránagyítás (újabb koppintás: vissza). Csak a világ nagyítódik, a HUD nem. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('zoom');
const ZM={au:1,sup:false,
 // felszínen, a bázison kívül álló, kinyílt gépre a kamera magától ránagyít (koppintás: vissza; a gép elindulásáig nem nagyít újra)
 want(){try{if(!W.TBM||!TBM.on()||(W.CIN&&CIN.on)||S.depth>0||S.st!=='idle'||(typeof base==='function'&&base())||(W.$&&$('#mm')))return 1;return TBM.u>.5?1.7:1}catch(e){return 1}},
 z:1,t:1,MAX:2.4,cx:0,cy:0,w:0,h:0,
 on(px,py){const z=ZM.z;return Math.abs(px-(ZM.w/2-50))<95&&Math.abs(py-ZM.h/2)<48*z},
 toggle(){if(ZM.au>1&&ZM.t<=1){ZM.sup=true;ZM.au=1;try{beep(420,.05,.04,'sine')}catch(e){}return}ZM.t=ZM.t>1?1:ZM.MAX;try{beep(ZM.t>1?620:420,.05,.04,'sine')}catch(e){}},
 apply(x,dp,cx,cy,w,h){ZM.w=w;ZM.h=h;const z=ZM.z;cx+=(ZM.ox||0)-50;cy+=(ZM.oy||0);if(z>1.001){let tx=cx*(1-z);if(ZM.au>1&&ZM.t<=1&&ZM.mcx!=null){const M=ZM.mcx,k=Math.min(1,(z-1)/(ZM.au-1)),S0=w*.44,Sx=M+(S0-M)*k;tx=Sx-z*M}x.setTransform(dp*z,0,0,dp*z,dp*tx,dp*cy*(1-z))}},
 reset(x,dp){x.setTransform(dp,0,0,dp,0,0)}};
W.ZM=ZM;
if(W.on)on('frame',dt=>{const w=ZM.want();if(w<=1)ZM.sup=false;ZM.au=ZM.sup?1:w;const tt=Math.max(ZM.t,ZM.au),d=tt-ZM.z;ZM.z=Math.abs(d)<.003?tt:ZM.z+d*Math.min(1,dt*(ZM.t>1||d<0?7:1.6))});
if(typeof document!=='undefined'){let dn=null;
 document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;
  const r=e.target.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;if(W.CIN&&CIN.on)return;if(W.PN&&PN.at(px,py))return;if(ZM.t>1||ZM.on(px,py))ZM.toggle()},true)}
})(typeof window!=='undefined'?window:globalThis);
