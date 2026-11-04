// Domborzat: a vulkánokhoz vezető hegy/domb a felszínen (emelkedő-kihívás, a motor teljesítményétől függ)
(function(W){
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),sm=u=>{u=cl(u,0,1);return u*u*(3-2*u)};
const G=9.81;
const HILL={e0:0,rot:0,sl:0,
 // terep magassága (m) a vízszintes x helyen
 E(x){const a=Math.abs(x);let e=0;
  if(x>0){const t=sm((x-400)/500);e=140*t;const env=sm((x-420)/220)*(1-sm((x-860)/80));e+=env*(2.4*Math.sin(x*.043)+.8*Math.sin(x*.17)+1.4*Math.sin(x*.012+1))}
  else{const t=sm((-x-300)/600);e=75*t;const env=sm((-x-320)/220)*(1-sm((-x-880)/60));e+=env*(1.6*Math.sin(x*.05)+.6*Math.sin(x*.19))}
  return e},
 // lejtő (dE/dx), pozitív = jobbra emelkedik
 g(x){return(HILL.E(x+1.5)-HILL.E(x-1.5))/3},
 // a gép alatti átlagos lejtő (a ~8 m hosszú talpon)
 gAvg(x,face){const L=8;return(HILL.E(x)-HILL.E(x-L*face))/(L*face)},
 // látható-e valamilyen domborzat a [x0,x1] tartományban (vagy el van tolva a viszonyítási szint)
 vis(x0,x1){if(Math.abs(HILL.e0)>.05)return true;if(x1<330&&x0>-280)return false;return true},
 zone(x){return cl((Math.abs(x)-760)/160,0,1)},
 // frissítés minden képkockán: a felszínen a viszonyítási szint követi a terepet, föld alatt befagy
 frame(dt,rx,ry){if(typeof S==='undefined')return;if(S.depth<.5&&ry<.6){const t=HILL.E(rx),k=Math.min(1,dt*10);HILL.e0+=(t-HILL.e0)*k;if(Math.abs(t-HILL.e0)<.002)HILL.e0=t;S.e0=+HILL.e0.toFixed(3)}
  else if(typeof S.e0==='number'&&isFinite(S.e0)&&Math.abs(S.e0-HILL.e0)>.001&&S.depth>=.5&&!HILL._fz){HILL.e0=S.e0}
  HILL._fz=S.depth>=.5},
 // a gép dőlése és függőleges eltolása a lejtőn (pixelben K-val szorozva a hívó oldalon)
 tilt(dt,rx,face,ry,ang){const on=ry<.6?1:0,vert=Math.abs(Math.sin(ang||0));const g=HILL.gAvg(rx,face||1),target=on*(1-vert)*-Math.atan(g);HILL.rot+=(target-HILL.rot)*Math.min(1,dt*7);
  const dy=on*(1-vert)*-(HILL.E(rx-6*(face||1))-HILL.E(rx));return{rot:HILL.rot,dy}},
 // haladás a lejtőn: sebesség- és fogyasztás-szorzó (a motor teljesítménye szerint)
 drive(c,x,dx){const g=HILL.gAvg(x,1)*Math.sign(dx||1),rr=.1;let res=Math.max(.03,rr+g);const m=c.m||1e5,P=(c.d?c.d[1]:1)*1e6;
  let vNew=Math.min(5,P*.28/(m*G*res)),vh=Math.min(5,P*.28/(m*G*rr));let rv=vh>0?vNew/vh:1;
  if(g>.62)rv=0;rv=cl(rv,0,1.6);const rf=g<0?Math.max(.3,res/rr):res/rr;HILL.sl=g;return{v:rv,f:rf,g}},
 // szükséges motorteljesítmény 1 m/s-os emelkedéshez
 needMW(x,dx){const g=HILL.gAvg(x,1)*Math.sign(dx||1);if(g<=0)return 0;return massKg()*G*(.1+g)/.28/1e6},
 hud(V){if(typeof S==='undefined'||S.depth>2)return;const g=HILL.g(S.x),e=HILL.E(S.x);if(Math.abs(g)<.03&&e<3)return;const x=V.x;x.save();const t=`⛰ ${Math.round(e)} m · lejtő ${Math.round(Math.abs(g)*100)}% (${Math.round(Math.atan(Math.abs(g))*57.3)}°)`;x.font='11px Georgia';const w=x.measureText(t).width+14;x.fillStyle='rgba(0,0,0,.55)';x.fillRect(6,32,w,20);x.fillStyle=Math.abs(g)>.3?'#ffb060':'#fff';x.fillText(t,13,46);x.restore()}
};
function massKg(){try{return typeof mass==='function'?mass():1e5}catch(e){return 1e5}}
W.HILL=HILL;
if(typeof on==='function')on('hud',V=>{try{HILL.hud(V)}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
