/* Drill Up – hidraulikus felállító a felszínen.
   A gép vízszintesen halad a felszínen, a fúráshoz viszont függőlegesen kell állnia. Ezt egy beépített hidraulikus berendezés oldja meg:
   szállító-felállító (mint a rakétáknál és fúrótornyoknál): az orr (fúrófej) csapágyblokkban csuklik, két hidraulikus munkahenger a gép közepét tolja, egy megjelenő ipari daru kötele a farkat húzza – lassan, látható hidraulikával,
   gőz- és olajfüsttel, hanggal –, majd a fúrás indul. Felszínre érve, ha a gép vízszintesen indulna tovább, ugyanez visszafelé: lefekteti magát.
   • Föld alatt (vagy ha már függőleges) nincs várakozás. A mozgás a felállítás alatt áll; a ⬛ (állj) gombbal sem szakad meg: a gép nem marad félig felállva.
   • Beállítások → „Hidraulikus felállító" (S.set.erect === 0 → a régi viselkedés: a gép azonnal, lassan billen).
   • Pose nincs mentve: a betöltött játékban a felszínen vízszintes, föld alatt függőleges. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('hyd');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,TE=3000,TL=2600;
const HYD={pose:null,seq:null,told:0,A:null,
 on(){return !!HYD.seq},
 enabled(){try{return S.set.erect!==0}catch(e){return true}},
 sync(){if(typeof S==='undefined'||!S)return;if(HYD.pose===null)HYD.pose=S.depth>1.5?1:0;if(!HYD.seq&&S.depth>1.5)HYD.pose=1},
 // az aktuális szög: 0 = vízszintes, π/2 = függőleges (lefelé néz)
 // a szekvencia a gép tényleges (éppen látható) szögéből indul, így a kép sosem ugrik
 ang(){const q=HYD.seq;if(!q)return HYD.pose>=.5?Math.PI/2:0;const l=ease(cl((q.p-.2)/.7,0,1)),a0=q.a0||0,a1=q.dir>0?Math.PI/2:0;return a0+(a1-a0)*l},
 cur(){try{const a=Math.abs(ang);return isFinite(a)?cl(a,0,Math.PI/2):(HYD.pose>=.5?Math.PI/2:0)}catch(e){return HYD.pose>=.5?Math.PI/2:0}},
 // a lábak kinyúlása 0..1 (előbb ereszkednek, a végén visszahúzódnak)
 legs(){const q=HYD.seq;if(!q)return 0;const p=q.p;return q.dir>0?cl(p/.2,0,1)*(1-cl((p-.9)/.1,0,1)):cl(p/.2,0,1)*(1-cl((p-.9)/.1,0,1))},
 start(dir){const a0=HYD.cur();HYD.seq={dir,a0,t0:Date.now(),dur:(dir>0?TE:TL)*(.35+.65*(dir>0?1-a0/(Math.PI/2):a0/(Math.PI/2))),p:0,pu:0};S.mode='';
  if(!HYD.told){HYD.told=1;try{toast(dir>0?'🛠 Hidraulikus felállító: a gép függőlegesre áll fúráshoz…':'🛠 A gép lefekszik a hidraulikán…')}catch(e){}}
  try{aInit()}catch(e){}HYD.snd(true);try{clank(.3)}catch(e){}HYD.steam(6)},
 finish(){const q=HYD.seq;HYD.pose=q.dir>0?1:0;HYD.seq=null;HYD.snd(false);try{clank(.25)}catch(e){}HYD.steam(8)},
 steam(n){try{if(W.STM&&STM.puff)STM.puff(-9,1.3,n,{vy:-.8,sp:2.6,r:5,l:1.4,col:'225,228,232'})}catch(e){}},
 // a step() elején hívja: igaz = a gép áll (felállítás / lefekvés közben)
 step(dt){try{
  if(typeof S==='undefined'||!S)return false;HYD.sync();
  const q=HYD.seq;
  if(q){q.p=cl((Date.now()-q.t0)/q.dur,0,1);S.mode='';
   if(Math.random()<dt*10&&q.p<.95)HYD.steam(1);
   if(q.p>=1){HYD.finish();return false}return true}
  if(!HYD.enabled()||(W.NET&&NET.falling))return false;
  if(W.ENG&&!ENG.ready())return false;
  const st=S.st,surf=S.depth<=1;
  if(surf&&st==='D'&&HYD.pose<.5){HYD.start(1);return true}
  // lefekvés: csak ha a gép már nem fordul (a fordulás közben a szög nem ugorhat); a haza-úton is megvárja a fordulás végét
  let turning=false;try{turning=!!(tl&&Date.now()-ldt<400)}catch(e){}
  if(surf&&(st==='L'||st==='R'||st==='H')&&HYD.pose>=.5&&!turning){HYD.start(-1);return true}
  return false}catch(e){if(W.DBG)DBG.err='hyd: '+(e.message||e);HYD.seq=null;return false}},
 // hang: halk hidraulika-zümmögés, a hangnyomással együtt emelkedik
 snd(on){try{if(typeof AC==='undefined'||!AC||!(S.set.vol>0))return;
  if(on){const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter(),t=AC.currentTime,d=(HYD.seq?HYD.seq.dur:3000)/1000,v=S.set.vol/100;o.type='sawtooth';f.type='lowpass';f.frequency.value=420;
   o.frequency.setValueAtTime(58,t);o.frequency.linearRampToValueAtTime(96,t+d*.6);o.frequency.linearRampToValueAtTime(64,t+d);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07*v,t+.3);g.gain.setValueAtTime(.07*v,t+d-.4);g.gain.linearRampToValueAtTime(0,t+d);
   o.connect(f);f.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.1);HYD.A=o}}catch(e){}},
 // kirajzolás: szállító-felállító + ipari daru. A gép a talpkeretre fekszik, az orra (fúrófej) csapágyblokkban csuklik; két hidraulikus munkahenger
 // a gép közepét tolja, közben a megjelenő ipari daru kötele a farki emelőfület húzza felfelé. A hossz/szögek a geometriából adódnak (a kötél a gémcsúcs és a fül között feszül).
 draw(V){const q=HYD.seq;if(!q||!V||!V.lw)return;const x=V.x,Ys=V.Ys,lw=V.lw,T=Date.now()/1000;
  const o=lw(0,1.4),o1=lw(-1,1.4),m=Math.hypot(o1[0]-o[0],o1[1]-o[1])||10,fadeIn=cl(q.p/.1,0,1),fadeOut=1-cl((q.p-.9)/.1,0,1),al=Math.min(fadeIn,fadeOut);
  if(al<=0.01)return;const dirx=(V.fc||1)>0?-1:1,e=ease(al),dr=q.dir>0?1:-1;
  const ST=(c0,c1)=>LGx(x,c0,c1);
  x.save();x.lineCap='butt';x.lineJoin='miter';
  const ax=o[0]+dirx*m*7.8,ay=Ys;
  // ---------- talpkeret: I-gerenda, keresztbordák, kitámasztó talpak ----------
  const bx0=Math.min(o[0],ax)-m*.6,bw=Math.abs(ax-o[0])+m*1.2;
  x.fillStyle='#23262a';x.fillRect(bx0,Ys-m*.55,bw,m*.55);x.fillStyle='#3b4047';x.fillRect(bx0,Ys-m*.55,bw,m*.12);x.fillStyle='#e2b228';x.fillRect(bx0,Ys-m*.1,bw,m*.1);
  x.strokeStyle='#14161a';x.lineWidth=1;for(let i=0;i<=8;i++){const px=bx0+bw*i/8;x.beginPath();x.moveTo(px,Ys-m*.55);x.lineTo(px,Ys-m*.1);x.stroke()}
  for(const px of[bx0+m*.3,bx0+bw-m*.3]){x.fillStyle='#4a4e55';x.fillRect(px-m*.9,Ys-m*.14,m*1.8,m*.14);x.fillStyle='#8d9299';x.fillRect(px-m*.9,Ys-m*.14,m*1.8,2)}
  // ---------- csapágyblokk az orrnál (csuklópont) ----------
  {const hx=o[0],hy=Math.min(o[1],Ys-m*.5);x.beginPath();x.moveTo(hx-m*1.1,Ys-m*.55);x.lineTo(hx-m*.55,hy-m*.5);x.lineTo(hx+m*.55,hy-m*.5);x.lineTo(hx+m*1.1,Ys-m*.55);x.closePath();x.fillStyle=ST(hy-m*.5,Ys);x.fill();x.strokeStyle='#14161a';x.lineWidth=1.2;x.stroke();
   x.fillStyle='#d6d9de';x.beginPath();x.arc(hx,hy,m*.34,0,7);x.fill();x.strokeStyle='#14161a';x.stroke();x.fillStyle='#e2b228';x.beginPath();x.arc(hx,hy,m*.16,0,7);x.fill();
   for(const bx of[-.8,.8]){x.fillStyle='#bfc3c9';x.beginPath();x.arc(hx+bx*m*.62,Ys-m*.78,m*.1,0,7);x.fill()}}
  // ---------- hidraulikus erőcsomag a keret végén (motor, tartály, nyomásmérő) ----------
  {const px=ax+dirx*m*.2,w=m*1.9,h=m*1.25,lx=dirx>0?px:px-w;x.fillStyle=ST(Ys-m*.55-h,Ys-m*.55);x.fillRect(lx,Ys-m*.55-h,w,h);x.strokeStyle='#14161a';x.lineWidth=1.2;x.strokeRect(lx,Ys-m*.55-h,w,h);
   x.fillStyle='#e2b228';x.fillRect(lx,Ys-m*.55-h,w,m*.17);x.fillStyle='#1a1d21';x.fillRect(lx+w*.1,Ys-m*.55-h+m*.3,w*.5,h*.55);for(let i=0;i<4;i++){x.fillStyle='rgba(255,255,255,.08)';x.fillRect(lx+w*.1,Ys-m*.55-h+m*.35+i*m*.17,w*.5,2)}
   const gx=lx+w*.8,gy=Ys-m*.55-h+m*.62;x.fillStyle='#f2f2f2';x.beginPath();x.arc(gx,gy,m*.25,0,7);x.fill();x.strokeStyle='#222';x.stroke();const ga=-2.3+Math.sin(Math.min(1,q.p*1.4)*Math.PI)*3.2;x.strokeStyle='#c02020';x.lineWidth=1.4;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(ga)*m*.2,gy+Math.sin(ga)*m*.2);x.stroke();
   x.fillStyle=(Math.floor(T*4)%2)?'#59ff7a':'#1a5a2a';x.beginPath();x.arc(lx+w*.8,Ys-m*.55-h+m*.28,m*.08,0,7);x.fill()}
  // ---------- két munkahenger: henger (bordázott), krómozott dugattyúrúd, villás csuklók, tömlők ----------
  const t=lw(-4.6,1.1),dx=t[0]-ax,dy=t[1]-(Ys-m*.9),L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux,bar=Math.min(L*.56,m*5.4),rod=L-bar;
  for(const off of[-1,1]){const ox=nx*off*m*.28*0,oy=0,k=off<0?.55:1,bx=ax+ox,by=Ys-m*.9+oy;x.save();x.globalAlpha*=k;
   x.strokeStyle='#1c1f23';x.lineWidth=m*.62;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+ux*bar,by+uy*bar);x.stroke();
   x.strokeStyle='#41474f';x.lineWidth=m*.5;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+ux*bar,by+uy*bar);x.stroke();
   x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=m*.1;x.beginPath();x.moveTo(bx+nx*m*.14,by+ny*m*.14);x.lineTo(bx+ux*bar+nx*m*.14,by+uy*bar+ny*m*.14);x.stroke();
   x.strokeStyle='#e2b228';x.lineWidth=m*.54;for(const f of[.05,.5,.96]){x.beginPath();x.moveTo(bx+ux*bar*f-ux*m*.08,by+uy*bar*f-uy*m*.08);x.lineTo(bx+ux*bar*f+ux*m*.08,by+uy*bar*f+uy*m*.08);x.stroke()}
   x.strokeStyle='#d9dde3';x.lineWidth=m*.26;x.beginPath();x.moveTo(bx+ux*bar,by+uy*bar);x.lineTo(t[0],t[1]);x.stroke();x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=m*.06;x.beginPath();x.moveTo(bx+ux*bar+nx*m*.06,by+uy*bar+ny*m*.06);x.lineTo(t[0]+nx*m*.06,t[1]+ny*m*.06);x.stroke();
   x.restore()}
  // tömlők (lógó ívek) a henger végétől az erőcsomagig
  x.strokeStyle='#111';x.lineWidth=m*.13;for(const d of[0,1]){x.beginPath();x.moveTo(ax+dirx*m*.5,Ys-m*1.5);x.bezierCurveTo(ax+dirx*m*(1.2+d*.5),Ys-m*(2.7+d*.5),ax-dirx*m*(.5-d*.4),Ys-m*(2.3-d*.2),ax+ux*bar*.14,Ys-m*.9+uy*bar*.14);x.stroke()}
  // csuklós nyereg a gép testén + a henger felső csapja
  x.fillStyle='#e2b228';x.beginPath();x.arc(t[0],t[1],m*.3,0,7);x.fill();x.strokeStyle='#14161a';x.lineWidth=1.2;x.stroke();x.fillStyle='#14161a';x.beginPath();x.arc(t[0],t[1],m*.12,0,7);x.fill();
  x.beginPath();x.arc(ax,Ys-m*.9,m*.32,0,7);x.fillStyle='#e2b228';x.fill();x.stroke();
  // ---------- ipari daru: torony, forgó fej, gém, ellensúly, trolly, kötél ----------
  {const th=m*19*e,tw=m*1.5,cxs=o[0]+dirx*m*13.2,top=Ys-th;
   // betonalap + kitámasztók
   x.fillStyle='#8c8f94';x.fillRect(cxs-m*2.4,Ys-m*.8,m*4.8,m*.8);x.fillStyle='#6b6e73';x.fillRect(cxs-m*2.4,Ys-m*.8,m*4.8,m*.18);
   // rácsos torony: két övrúd + X rácsozás
   x.strokeStyle='#e2b228';x.lineWidth=m*.16;x.beginPath();x.moveTo(cxs-tw/2,Ys-m*.8);x.lineTo(cxs-tw/2,top);x.moveTo(cxs+tw/2,Ys-m*.8);x.lineTo(cxs+tw/2,top);x.stroke();
   x.strokeStyle='#c99a1a';x.lineWidth=m*.07;const seg=Math.max(2,Math.round(th/(m*1.5)));for(let i=0;i<seg;i++){const y0=Ys-m*.8-(th-m*.8)*i/seg,y1=Ys-m*.8-(th-m*.8)*(i+1)/seg;x.beginPath();x.moveTo(cxs-tw/2,y0);x.lineTo(cxs+tw/2,y1);x.moveTo(cxs+tw/2,y0);x.lineTo(cxs-tw/2,y1);x.moveTo(cxs-tw/2,y1);x.lineTo(cxs+tw/2,y1);x.stroke()}
   if(e>.55){const jl=m*13.2,cj=m*5.2,jy=top;
    // forgó fej + vezetőfülke
    x.fillStyle=ST(jy-m*.6,jy+m*.6);x.fillRect(cxs-m*1.1,jy-m*.5,m*2.2,m*1.1);x.fillStyle='#e2b228';x.fillRect(cxs-m*1.1,jy-m*.5,m*2.2,m*.15);
    x.fillStyle='#2b3a46';x.fillRect(cxs+dirx*m*.2-(dirx>0?0:m*1.3),jy-m*1.55,m*1.3,m*1.05);x.fillStyle='rgba(190,235,255,.75)';x.fillRect(cxs+dirx*m*.2-(dirx>0?0:m*1.3)+m*.15,jy-m*1.4,m*1.0,m*.6);x.strokeStyle='#14161a';x.lineWidth=1;x.strokeRect(cxs+dirx*m*.2-(dirx>0?0:m*1.3),jy-m*1.55,m*1.3,m*1.05);
    // gém (előre, a gép fölé), ellengém
    const jx=cxs-dirx*jl,cx2=cxs+dirx*cj;x.strokeStyle='#e2b228';x.lineWidth=m*.13;x.beginPath();x.moveTo(cx2,jy+m*.18);x.lineTo(jx,jy+m*.18);x.moveTo(cx2,jy-m*.28);x.lineTo(jx,jy+m*.18);x.stroke();
    x.strokeStyle='#c99a1a';x.lineWidth=m*.06;const js=Math.round(jl/(m*1.1));x.beginPath();for(let i=0;i<=js;i++){const px=cxs-dirx*jl*i/js,py=jy+m*.18-(i%2?0:m*.4)*(1-i/js*.6);x.lineTo(px,py)}x.stroke();
    // ellensúly-tömbök
    for(let i=0;i<3;i++){x.fillStyle=i%2?'#6b6e73':'#8c8f94';x.fillRect(cx2-(dirx>0?m*(.9+i*.25):-m*i*.25)-(dirx>0?0:m*.9),jy-m*.15,m*.9,m*1.0);}
    // csúcs + merevítő kötelek
    const ay2=jy-m*3.2;x.strokeStyle='#e2b228';x.lineWidth=m*.14;x.beginPath();x.moveTo(cxs-m*.5,jy-m*.5);x.lineTo(cxs,ay2);x.lineTo(cxs+m*.5,jy-m*.5);x.stroke();x.strokeStyle='#111';x.lineWidth=1.2;x.beginPath();x.moveTo(cxs,ay2);x.lineTo(jx,jy+m*.1);x.moveTo(cxs,ay2);x.lineTo(cx2,jy-m*.2);x.stroke();
    x.fillStyle=(Math.floor(T*2)%2)?'#ff3b2f':'#6a1410';x.beginPath();x.arc(cxs,ay2-m*.22,m*.2,0,7);x.fill();
    // trolly és emelőkötél a farki fülhöz
    const tr=lw(-11.2,0),ty=jy+m*.45;x.fillStyle='#2b2d31';x.fillRect(jx-m*.6,jy+m*.1,m*1.2,m*.5);
    x.strokeStyle='#15171a';x.lineWidth=m*.1;x.beginPath();x.moveTo(jx-m*.18,ty);x.lineTo(tr[0],tr[1]-m*1.1);x.moveTo(jx+m*.18,ty);x.lineTo(tr[0],tr[1]-m*1.1);x.stroke();
    // csigatest + horog + hevederek
    x.fillStyle='#e2b228';x.fillRect(tr[0]-m*.45,tr[1]-m*1.45,m*.9,m*.38);x.strokeStyle='#14161a';x.lineWidth=1;x.strokeRect(tr[0]-m*.45,tr[1]-m*1.45,m*.9,m*.38);
    x.strokeStyle='#bfc3c9';x.lineWidth=m*.08;x.beginPath();x.moveTo(tr[0],tr[1]-m*1.07);x.lineTo(tr[0],tr[1]-m*.3);x.stroke();x.beginPath();x.arc(tr[0],tr[1]-m*.2,m*.2,0,7);x.stroke()}}
  x.restore()}};
const LGx=(x,a,b)=>{const g=x.createLinearGradient(0,a,0,b);g.addColorStop(0,'#8d9299');g.addColorStop(.5,'#5a5f66');g.addColorStop(1,'#2b2e33');return g};
W.HYD=HYD;
if(W.on)on('sim',()=>{if(HYD.seq)HYD.step(0)});
if(W.on)on('world.front',V=>{try{HYD.draw(V)}catch(e){if(W.DBG)DBG.err='hyd: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
