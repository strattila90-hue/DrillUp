/* Drill Up – koppintás a gépre: ránagyítás (újabb koppintás: vissza). Csak a világ nagyítódik, a HUD nem. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('zoom');
const ZM={z:1,t:1,MAX:2.4,cx:0,cy:0,w:0,h:0,
 on(px,py){const z=ZM.z;return Math.abs(px-(ZM.w/2-50))<95&&Math.abs(py-ZM.h/2)<48*z},
 toggle(){ZM.t=ZM.t>1?1:ZM.MAX;try{beep(ZM.t>1?620:420,.05,.04,'sine')}catch(e){}},
 apply(x,dp,cx,cy,w,h){ZM.w=w;ZM.h=h;const z=ZM.z;cx+=(ZM.ox||0)-50;cy+=(ZM.oy||0);if(z>1.001)x.setTransform(dp*z,0,0,dp*z,dp*cx*(1-z),dp*cy*(1-z))},
 reset(x,dp){x.setTransform(dp,0,0,dp,0,0)}};
W.ZM=ZM;
if(W.on)on('frame',dt=>{const d=ZM.t-ZM.z;ZM.z=Math.abs(d)<.003?ZM.t:ZM.z+d*Math.min(1,dt*7)});
if(typeof document!=='undefined'){let dn=null;
 document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;
  const r=e.target.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;if(W.CIN&&CIN.on)return;if(W.PN&&PN.at(px,py))return;if(ZM.t>1||ZM.on(px,py))ZM.toggle()},true)}
})(typeof window!=='undefined'?window:globalThis);
