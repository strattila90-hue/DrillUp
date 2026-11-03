/* Drill Up – 2. fázis: automatikus fényforrások az új járatokban.
   A lámpákat az S.lamps tárolja ([x, mélység, tájolás]); 8 méterenként kerülnek ki a frissen fúrt szakaszra,
   de ahol 5,5 m-en belül már van lámpa (már megvilágított szakasz), ott nem ismétli. Lámpánként 800 Ft. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('lamps');
const SP=8,GAP=5.5,COST=800,CAP=2500,CELL=8;
const cellKey=(x,d)=>Math.floor(x/CELL)+','+Math.floor(d/CELL);
const L={grid:new Map(),ref:null,n:-1,dist:0,px:null,pd:null,
 ensure(){if(L.ref===S.lamps&&L.n===S.lamps.length)return;L.grid.clear();for(const l of S.lamps){const k=cellKey(l[0],l[1]);(L.grid.get(k)||L.grid.set(k,[]).get(k)).push(l)}L.ref=S.lamps;L.n=S.lamps.length},
 near(x,d,r){L.ensure();const cx=Math.floor(x/CELL),cd=Math.floor(d/CELL);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=L.grid.get((cx+i)+','+(cd+j));if(a)for(const l of a)if(Math.hypot(l[0]-x,l[1]-d)<r)return true}return false},
 place(x,d,o){if(S.lamps.length>=CAP||L.near(x,d,GAP))return false;if(S.cash<COST)return false;S.cash-=COST;const l=[+x.toFixed(2),+d.toFixed(2),o];S.lamps.push(l);const k=cellKey(l[0],l[1]);(L.grid.get(k)||L.grid.set(k,[]).get(k)).push(l);L.n=S.lamps.length;return true},
 view(x0,x1,d0,d1,fn){L.ensure();for(let i=Math.floor(x0/CELL);i<=Math.floor(x1/CELL);i++)for(let j=Math.floor(d0/CELL);j<=Math.floor(d1/CELL);j++){const a=L.grid.get(i+','+j);if(a)for(const l of a)fn(l)}}};
W.LMP=L;
// régi mentések: a meglévő járatok kapják meg a lámpákat (ingyen, 8 méterenként)
if(W.Save)Save.addMig(3,o=>{const out=[],near=(x,d)=>out.some(l=>Math.hypot(l[0]-x,l[1]-d)<GAP);
 for(const g of (Array.isArray(o.tn)?o.tn:[])){if(!Array.isArray(g)||g.length<4)continue;const vert=g[0]===g[2],len=Math.abs(vert?g[3]-g[1]:g[2]-g[0]);
  for(let s=SP;s<=len&&out.length<CAP;s+=SP){const t=s/len,x=g[0]+(g[2]-g[0])*t,d=g[1]+(g[3]-g[1])*t;if(!near(x,d))out.push([+x.toFixed(2),+d.toFixed(2),vert?1:0])}}
 o.lamps=out;if(o.set&&typeof o.set==='object'){if(o.set.alp==null)o.set.alp=1;if(o.set.abk==null)o.set.abk=1}});
if(W.on){
 // új járat: a megtett távolság alapján lámpát helyez ki (csak fúrás közben, csak új, még nem megvilágított helyre)
 on('step',()=>{if(S.mode!=='drill'||S.set.alp===0){L.px=null;L.dist=0;return}
  if(L.px===null){L.px=S.x;L.pd=S.depth;return}
  const dx=S.x-L.px,dd=S.depth-L.pd,step=Math.abs(dx)+Math.abs(dd);L.px=S.x;L.pd=S.depth;if(step<=0)return;L.dist+=step;
  const ux=dx?Math.sign(dx):0,ud=dd?Math.sign(dd):0,o=dd?1:0;
  while(L.dist>=SP){L.dist-=SP;L.place(S.x-ux*L.dist,S.depth-ud*L.dist,o)}});
 on('world.back',V=>{if(!S.lamps.length)return;const x=V.x,gl=W.GEN?GEN.sat():1,hw=V.w/2/V.K+10,hh=V.h/2/V.K+10;
  L.view(V.rx-hw,V.rx+hw,V.ry-hh,V.ry+hh,l=>{const px=V.SX(l[0]),py=V.SY(l[1]);
   if(l[2]===1){x.fillStyle=gl>.05?'#ffe9a0':'#5a4a32';x.fillRect(px+15,py-3,4,6);if(gl>.05)V.lamp(px+12,py,62,.8*gl)}
   else{x.fillStyle=gl>.05?'#ffe9a0':'#5a4a32';x.fillRect(px-3,py-19,6,4);if(gl>.05)V.lamp(px,py-14,62,.8*gl)}})});
}
})(typeof window!=='undefined'?window:globalThis);
