// Domborzat: a vulkánokhoz vezető hegy/domb a felszínen (emelkedő-kihívás, a motor teljesítményétől függ)
(function(W){
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),sm=u=>{u=cl(u,0,1);return u*u*(3-2*u)};
const G=9.81;
const HILL={e0:0,rot:0,sl:0,
 // terep magassága (m) a vízszintes x helyen
 E(x){const a=Math.abs(x);let e=0;
  if(x>0){const t=sm((x-400)/520);e=180*t;const env=sm((x-420)/220)*(1-sm((x-860)/80));e+=env*(1.4*Math.sin(x*.043)+.4*Math.sin(x*.17)+.9*Math.sin(x*.012+1))}
  else{const t=sm((-x-300)/600);e=90*t;const env=sm((-x-320)/220)*(1-sm((-x-880)/60));e+=env*(1.6*Math.sin(x*.05)+.6*Math.sin(x*.19))}
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
 tilt(dt,wx,face,ry,ang){const on=ry<.6?1:0,vert=Math.abs(Math.sin(ang||0)),f=face||1;
  // a lánctalp két támaszpontja (-10,4 és -2,2 m a fúrófej csúcsától): a gép e két pontra, a köztes terepre pedig fölé ül
  const xa=wx-10.4*f,xb=wx-2.2*f,s0=Math.min(xa,xb),s1=Math.max(xa,xb),y0=HILL.E(s0),y1=HILL.E(s1),sl=(y1-y0)/(s1-s0);
  let lift=0;for(let k=1;k<8;k++){const xs=s0+(s1-s0)*k/8;lift=Math.max(lift,HILL.E(xs)-(y0+sl*(xs-s0)))}
  const target=on*(1-vert)*-Math.atan(sl);HILL.rot+=(target-HILL.rot)*Math.min(1,dt*9);
  const dy=on*(1-vert)*-((y0+y1)/2+lift-HILL.e0);return{rot:HILL.rot,dy}},
 // haladás a lejtőn: sebesség- és fogyasztás-szorzó (a motor teljesítménye szerint)
 // lánctalp tapadása (μ): a meghajtás szintje szerint (nagyobb gép, szélesebb, mélyebb talpú lánctalp)
 mu(){let d=0;try{d=S.u.d|0}catch(e){}return Math.min(.95,.48+.06*d)},
 // haladás a lejtőn: sebesség- és fogyasztás-szorzó, tapadási határ, visszacsúszás
 // v: a sík talajon elérhető sebesség (m/s); a lejtőn a teljesítmény (P·η/(m·g·ellenállás)) és a tapadás korlátoz
 drive(c,x,dx,v0){const g=HILL.gAvg(x,1)*Math.sign(dx||1),rr=.1,mu=HILL.mu();let res=Math.max(.03,rr+g);const m=c.m||1e5,P=(c.d?c.d[1]:1)*1e6,eta=.28;
  const vflat=Math.min(v0||5,P*eta/(m*G*rr)),vNew=Math.min(vflat,P*eta/(m*G*res));let rv=vflat>0?vNew/vflat:1;
  // tapadás: a határ közelében kúszik, fölötte megcsúszik
  let sl=0;if(g>0){const lim=mu*.72;if(g>lim){rv*=cl((mu-g)/(mu-lim),0,1)}if(g>mu)sl=cl((g-mu)*9,.2,3)}
  rv=cl(rv,0,1.6);const rf=g<0?Math.max(.3,res/rr):res/rr;HILL.sl=g;HILL.mu_=mu;return{v:rv,f:rf,g,s:sl,mu}},
 // szükséges motorteljesítmény 1 m/s-os emelkedéshez
 needMW(x,dx){const g=HILL.gAvg(x,1)*Math.sign(dx||1);if(g<=0)return 0;return massKg()*G*(.1+g)/.28/1e6},
 hud(V){if(typeof S==='undefined'||S.depth>2)return;const g=HILL.g(S.x),e=HILL.E(S.x);if(Math.abs(g)<.03&&e<3)return;const x=V.x;x.save();const t=`⛰ ${Math.round(e)} m · lejtő ${Math.round(Math.abs(g)*100)}% (${Math.round(Math.atan(Math.abs(g))*57.3)}°) · tapadás ${Math.round(HILL.mu()*100)}%`;x.font='11px Georgia';const w=x.measureText(t).width+14;x.fillStyle='rgba(0,0,0,.55)';x.fillRect(6,32,w,20);x.fillStyle=Math.abs(g)>.3?'#ffb060':'#fff';x.fillText(t,13,46);x.restore()}
};
function massKg(){try{return typeof mass==='function'?mass():1e5}catch(e){return 1e5}}
W.HILL=HILL;
if(typeof on==='function')on('hud',V=>{try{HILL.hud(V)}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
