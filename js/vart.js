/* Drill Up – a M.E.D.V.E. jármű kézzel rajzolt illusztrációja (assets/veh/*.svg), a referenciakép stílusában.
   A statikus test (hajótest, ablakkeretek, sárga-fekete panel, hátsó daru horoggal, lámpák, poroltó) és a gőzkazán kéménnyel képből jön;
   a mozgó részeket (lánctalp, fúrófej, legénység, füst, fények, fogaskerék, tolólapok) továbbra is a játék rajzolja.
   A képek az aktuális nagyításhoz igazodva, egyszer raszterizálódnak (méretenként gyorsítótárazva). Amíg nincsenek betöltve, a régi rajz látszik. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('vart');
const IMG={},CACHE=new Map();
const ART={hull:{f:'hull',x0:-13.65,y0:-1.85,w:8.2,h:3.7},body:{f:'body',x0:-13.9,y0:-2.9,w:8.45,h:4.22},boiler:{f:'boiler',x0:-12.45,y0:-4.6,w:3.2,h:3.15}};
function im(n){if(typeof Image==='undefined')return null;let i=IMG[n];if(!i){i=IMG[n]=new Image();i.src='assets/veh/'+n+'.svg'}return i.complete&&i.naturalWidth?i:null}
function spr(f,w,h,scale){const i=im(f);if(!i||typeof document==='undefined')return null;const pw=Math.max(8,Math.round(w*scale/8)*8),ph=Math.max(8,Math.round(pw*h/w)),k=f+'|'+pw;
 let c=CACHE.get(k);if(c)return c;c=document.createElement('canvas');c.width=pw;c.height=ph;const g=c.getContext('2d');if(!g)return null;g.drawImage(i,0,0,pw,ph);if(CACHE.size>140)CACHE.clear();CACHE.set(k,c);return c}
function scl(x){try{const m=x.getTransform();return Math.hypot(m.a,m.b)||40}catch(e){return 40}}
function draw(x,a){const c=spr(a.f,a.w,a.h,Math.min(160,Math.max(8,scl(x))));if(!c)return false;x.drawImage(c,a.x0,a.y0,a.w,a.h);return true}
// forgatott alkatrész: a kép (box: -b..b) középpontja (cx,cy), méret 2·R méterben
function rot(x,f,cx,cy,R,ang){const c=spr(f,2*R,2*R,Math.min(160,Math.max(8,scl(x))));if(!c)return false;x.save();x.translate(cx,cy);if(ang)x.rotate(ang);x.drawImage(c,-R,-R,2*R,2*R);x.restore();return true}
const cl=(v,a,b)=>v<a?a:v>b?b:v;
function hot(a,scale,hb){const b=spr(a.f,a.w,a.h,scale);if(!b)return null;const k=a.f+'|'+b.width+'|h'+hb;let c=CACHE.get(k);if(c)return c;
 c=document.createElement('canvas');c.width=b.width;c.height=b.height;const g=c.getContext('2d');if(!g)return b;g.drawImage(b,0,0);g.globalCompositeOperation='source-atop';
 const u=hb/8,tx=(.55-a.x0)/a.w*c.width,ty=c.height/2,R=c.width*(.35+u*.5),gr=g.createRadialGradient(tx,ty,0,tx,ty,R);
 gr.addColorStop(0,`rgba(255,${90+u*150|0},${20+u*120|0},${(.35+u*.5).toFixed(3)})`);gr.addColorStop(.45,`rgba(230,${50+u*70|0},10,${(.22+u*.3).toFixed(3)})`);gr.addColorStop(1,'rgba(140,20,0,0)');
 g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);CACHE.set(k,c);return c}
const COMP=['wheel','sprocket','roller','link','gear','light','shield','diesel','turbine','reactor','head0','head1','head2','head3','head4','head5','head6','head7'];
const OL='#1a1712';
const VART={
 ok(){return !!(im('body')&&im('boiler'))},
 body(x,o){draw(x,ART.body);
  // éjjel / a mélyben a kabin ablakai meleg fénnyel világítanak; a legénységet a meglévő modul rajzolja az ablakokba
  if(o.lit2){x.fillStyle='rgba(255,214,140,.32)';for(let i=0;i<3;i++)x.fillRect(-9.1+i*1.05,-1.2,.95,.9)}
  if(W.BG&&BG.crew)BG.crew(x,{ts:o.ts,act:o.act,hyd:o.hyd,lit2:o.lit2})},
 ok2(){for(const n of COMP)if(!im(n))return false;return true},
 ok3(){return VART.ok2()&&!!im('hull')&&!!im('boiler')},
 // pajzsos (TBM) hajótest: hengeres, a fúrófejnél kisebb átmérő; a kabin ablakaiban a legénység
 hull(x,o){if(!draw(x,ART.hull))return false;
  if(o.lit2){x.fillStyle='rgba(255,214,140,.32)';for(let i=0;i<3;i++)x.fillRect(-9.1+i*1.05,-1.2,.95,.9)}
  if(W.BG&&BG.crew)BG.crew(x,{ts:o.ts,act:o.act,hyd:o.hyd,lit2:o.lit2});return true},
 shield(x){return draw(x,{f:'shield',x0:-4.8,y0:-1.8,w:3.35,h:3.6})},
 light(x,ox,oy){return draw(x,{f:'light',x0:ox-.05,y0:oy-.05,w:.9,h:.85})},
 // fúrófej: 8 előre rajzolt fázis egy 60°-os (6 vágóél) periódusra
 head(x,o){const P=Math.PI/3,ph=(((o.sp||0)%P)+P)%P,f=Math.floor(ph/P*8)%8,a={f:'head'+f,x0:-1.75,y0:-2,w:2.45,h:4};
  // izzó fém: a hő szerint a csúcs felől sötétvörös → narancs → sárgás fehér (feketetest-sugárzás), csak a fej festett pixelein
  const hb=Math.round(cl((o.heat||0)-.3,0,.9)/.9*8);const c=hb>0?hot(a,Math.min(160,Math.max(8,scl(x))),hb):spr(a.f,a.w,a.h,Math.min(160,Math.max(8,scl(x))));if(!c)return false;x.drawImage(c,a.x0,a.y0,a.w,a.h);
  const ht=o.ht||0;if(ht>0&&typeof HDC!=='undefined'&&HDC[ht]){x.save();x.globalAlpha=.16;x.globalCompositeOperation='source-atop';x.fillStyle=HDC[ht][0]||HDC[ht];x.beginPath();x.ellipse(-1.6,0,1.6,1.85,0,-Math.PI/2,Math.PI/2);x.fill();x.restore()}
  return true},
 gear(x,sp){return rot(x,'gear',-11.4,.8,.75*.85,sp*.3)},
 // meghajtás: 2–3 dízel, 4 gázturbina (forgó szívótorok), 5–6 reaktor (pulzáló izzás)
 engine(x,o){const t=o.tier,ts=o.ts||0;
  if(t<4){if(!draw(x,{f:'diesel',x0:-12.45,y0:-3.4,w:3.15,h:2}))return false;
   // kipufogó füst
   for(let k=0;k<3;k++){const ph=(ts/1000*.8+k/3)%1;x.fillStyle=`rgba(70,72,76,${(.45*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(-9.95-ph*.9,-3.4-ph*1.6,.15+ph*.5,0,7);x.fill()}
   return true}
  if(t===4){if(!draw(x,{f:'turbine',x0:-12.5,y0:-2.65,w:3.4,h:1.3}))return false;
   x.save();x.translate(-12.0,-1.95);x.rotate((o.sp||0)*1.4+ts/90);x.fillStyle='rgba(30,32,36,.75)';for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(0,0);x.lineTo(.36,-.07);x.lineTo(.36,.07);x.closePath();x.fill()}x.fillStyle='#c9ced4';x.beginPath();x.arc(0,0,.08,0,7);x.fill();x.restore();return true}
  if(!draw(x,{f:'reactor',x0:-12.5,y0:-3.0,w:3.5,h:1.6}))return false;
  const c=t===6?'190,140,255':'90,200,255',pu=.5+.5*Math.sin(ts/400);x.fillStyle=`rgba(${c},${(.18+.18*pu).toFixed(3)})`;x.beginPath();x.ellipse(-10.75,-2.2,1.2,.5,0,0,7);x.fill();
  if(o.lw&&o.GL){const[a,b]=o.lw(-10.75,-2.2);o.GL.push({x:a,y:b,r:80,c,i:.3+.15*pu});if(o.lamp)o.lamp(a,b,55,.5)}return true},
 // lánctalp: illusztrált lánctagok, hajtó- és vezetőkerék, tartógörgők, futógörgők rugós-lengéscsillapítós felfüggesztéssel
 track(x,o){if(W.DMG&&DMG.trk())return false;const{dep,trk,pv}=o,xr=-10.9,xf=-1.9,r=.45,cyT=1.55,L2=xf-xr,Pm=2*L2+2*Math.PI*r,N=48,sp=Pm/N;
  const s=Math.min(160,Math.max(8,scl(x))),lk=spr('link',1.2,.8,s*sp);if(!lk)return false;
  const pos=s0=>{let q=((s0%Pm)+Pm)%Pm;if(q<L2)return[xr+q,cyT-r,0,q];q-=L2;if(q<Math.PI*r){const a=-Math.PI/2+q/r;return[xf+r*Math.cos(a),cyT+r*Math.sin(a),a+Math.PI/2,-1]}q-=Math.PI*r;if(q<L2)return[xf-q,cyT+r,Math.PI,-1];q-=L2;const a=Math.PI/2+q/r;return[xr+r*Math.cos(a),cyT+r*Math.sin(a),a+Math.PI/2,-1]};
  const clamp=(v,a,b)=>v<a?a:v>b?b:v;
  x.save();x.beginPath();x.rect(-13,-9+10.5*clamp(dep*4,0,1),16,12);x.clip();x.translate(0,-dep*1.0);
  const mv=Math.min(1,Math.abs(pv||0)),sag=q=>q>=0?.05*Math.sin(Math.PI*q/L2):0;
  // alváz-gerenda
  x.fillStyle='#24221f';x.beginPath();x.rect(xr,cyT-.32,L2,.64);x.fill();x.strokeStyle=OL;x.lineWidth=.05;x.stroke();
  x.fillStyle='#4a4741';x.fillRect(xr+.3,cyT-.24,L2-.6,.1);
  // tartógörgők
  [xr+2.4,xr+4.6,xr+6.8].forEach(wx=>{x.strokeStyle=OL;x.lineWidth=.07;x.beginPath();x.moveTo(wx,cyT-r+.18);x.lineTo(wx,cyT-.3);x.stroke();rot(x,'roller',wx,cyT-r+.2,.17,trk/.17)});
  // futógörgők + lengőkar + tekercsrugó + lengéscsillapító
  const bob=i=>.06*Math.sin(trk*1.7+i*2.1)*(1-dep)*mv,wy0=cyT+.2,xs=[0,1,2,3,4,5].map(i=>xr+1.05+i*(L2-2.1)/5);
  for(let i=0;i<6;i++){const wx=xs[i],wy=wy0+bob(i),px=wx-.42,py=cyT-.18,top=cyT-.3;
   // lengőkar (csukló az alvázon, hátrafelé)
   x.lineCap='round';x.strokeStyle=OL;x.lineWidth=.14;x.beginPath();x.moveTo(px,py);x.lineTo(wx,wy);x.stroke();x.strokeStyle='#6b675e';x.lineWidth=.08;x.beginPath();x.moveTo(px,py);x.lineTo(wx,wy);x.stroke();
   // lengéscsillapító (gátló): henger + dugattyúrúd, a kar közepére
   const mx=(px+wx)/2+.06,my=(py+wy)/2,hx=mx+.22,hy=top-.02;x.strokeStyle=OL;x.lineWidth=.11;x.beginPath();x.moveTo(mx,my);x.lineTo(hx,hy);x.stroke();
   x.strokeStyle='#c9a227';x.lineWidth=.07;x.beginPath();x.moveTo(hx,hy);x.lineTo(hx+(mx-hx)*.55,hy+(my-hy)*.55);x.stroke();
   x.strokeStyle='#d8dde2';x.lineWidth=.03;x.beginPath();x.moveTo(hx+(mx-hx)*.55,hy+(my-hy)*.55);x.lineTo(mx,my);x.stroke();
   // tekercsrugó a kerék fölött: összenyomódik, ha a kerék felfelé mozdul
   const sy0=top,sy1=wy-.3,n=6;x.strokeStyle=OL;x.lineWidth=.07;x.beginPath();for(let k=0;k<=n;k++){const yy=sy0+(sy1-sy0)*k/n,xx=wx+(k%2?.11:-.11);k?x.lineTo(xx,yy):x.moveTo(wx,yy)}x.stroke();
   x.strokeStyle='#b8432a';x.lineWidth=.035;x.stroke();
   x.fillStyle='#3a3834';x.beginPath();x.arc(px,py,.07,0,7);x.fill()}
  // lánctagok
  for(let i=0;i<N;i++){const[px,py0,th,q]=pos(i*sp+trk);const py=py0+sag(q);x.save();x.translate(px,py);x.rotate(th);x.drawImage(lk,-.6*sp,-.4*sp,1.2*sp,.8*sp);x.restore()}
  // futógörgők a lánc belső oldalán
  for(let i=0;i<6;i++)rot(x,'wheel',xs[i],wy0+bob(i),.34,trk/.31);
  // hajtókerék (hátul) és vezetőkerék (elöl) feszítőrugóval
  rot(x,'sprocket',xr,cyT,.54,trk/.45);
  x.strokeStyle=OL;x.lineWidth=.06;x.beginPath();for(let i=0;i<=14;i++){const qx=xf-1.05+i*.06,qy=cyT+(i%2?.07:-.07);i?x.lineTo(qx,qy):x.moveTo(qx,qy)}x.stroke();x.strokeStyle='#b8432a';x.lineWidth=.03;x.stroke();
  rot(x,'wheel',xf,cyT,.5,trk/.46);
  x.restore();return true},
 boiler(x,o){draw(x,ART.boiler);
  // füst a kémény tetejéből
  const t=(o.ts||0)/1000;for(let k=0;k<5;k++){const ph=(t*.55+k/5)%1;x.fillStyle=`rgba(225,228,232,${(.5*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(-10.96-ph*1.2,-4.5-ph*2.2,.22+ph*.7,0,7);x.fill()}}};
W.VART=VART;
VART.preload=()=>{im('body');im('boiler');COMP.forEach(im)};VART.preload();
})(typeof window!=='undefined'?window:globalThis);
