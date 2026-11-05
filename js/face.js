/* Drill Up – fúrófej előtti kőzetbontás: elágazó, növekvő repedés-hálózat a világban + „közeli nézet” kisablak (nagyított fej, kőzet, repedések, szikrák).
   Csak rajzol (nem nyúl a játékállapothoz). A repedések kőzetkeménységtől függnek: puha kőzetben rövid, sűrűn elágazó törések, keményben hosszú, egyenes hajszálrepedések.
   Beállítás: S.set.fcl (0 = a kisablak kikapcsolva). A rajz a teljesítmény-szabályozó (Gov) fokozatát követi. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('face');
const hash=n=>{const v=Math.sin(n*12.9898+78.233)*43758.5453;return v-Math.floor(v)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cache=new Map();
// elágazó törtvonal: x előre, y oldalra (egység: méter); a kisebb ágak az anyavonalból nőnek ki
function build(seed,a0,len,depth){const n=depth?5:8,pts=[[0,0]],kids=[];let x=0,y=0,a=a0;
 for(let i=1;i<=n;i++){a+=(hash(seed+i*3.1)-.5)*.85;const st=len/n*(.7+hash(seed+i*5.7)*.6);x+=Math.cos(a)*st;y+=Math.sin(a)*st;pts.push([x,y]);
  if(depth<2&&i>=2&&i<n&&hash(seed+i*7.3)<.5)kids.push({at:i/n,ox:x,oy:y,c:build(seed*1.7+i*13.1,a+(hash(seed+i)>.5?1:-1)*(.45+hash(seed+i*11)*.7),len*(.5-.12*depth),depth+1)})}
 return{pts,kids}}
function crackOf(seed,a0,len){const k=seed.toFixed(2)+'|'+a0.toFixed(2)+'|'+len.toFixed(1);let c=cache.get(k);if(!c){if(cache.size>240)cache.clear();c=build(seed,a0,len,0);cache.set(k,c)}return c}
// egy repedés rajza p (0..1) növekedési állapotban; tr: helyi→képernyő
function line(x,C,p,tr,w){const m=C.pts.length-1,f=clamp(p,0,1)*m,k=Math.floor(f);if(f<=0)return;x.beginPath();let q=tr(C.pts[0][0],C.pts[0][1]);x.moveTo(q[0],q[1]);
 for(let i=1;i<=k&&i<=m;i++){q=tr(C.pts[i][0],C.pts[i][1]);x.lineTo(q[0],q[1])}
 if(k<m){const a=C.pts[k],b=C.pts[k+1],u=f-k;q=tr(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u);x.lineTo(q[0],q[1])}x.lineWidth=w;x.stroke()}
function draw(x,C,p,tr,w,hi){ // fénycsík (a repedés pereme) + sötét mélység + elágazások
 if(hi){x.strokeStyle=hi;line(x,C,p,(a,b)=>{const q=tr(a,b);return[q[0]+.9,q[1]+.9]},Math.max(.6,w*.55))}
 x.strokeStyle='rgba(8,5,3,.92)';line(x,C,p,tr,w);
 for(const k of C.kids){const q=clamp((p-k.at)/(1.02-k.at),0,1);if(q<=0)continue;draw(x,k.c,q,(a,b)=>tr(k.ox+a,k.oy+b),w*.62,hi)}}
const FACE={cyc(i,T,hard){const cy=(.8+hash(i*5.3)*.7)*(1+hard*.8),u=T/cy+i*.173,n=Math.floor(u);return{p:u-n,n,seed:i*37.7+n*11.3}},
 active(){return S.mode==='drill'&&S.st!=='idle'&&!(W.NET&&NET.falling)},
 hard(){const i=LY.indexOf(layer(S.depth));return clamp((HR[i]||1)/1200,0,1)},
 // a világban: a fúrófej előtti kőzet – a fej felületéről induló repedések, szilánkok, por, zúzott szemcsék, szikra (a gép előtt, a törmelék-réteg fölött)
 world(V){if(!V.dr||!V.lw||!FACE.active())return;const x=V.x,K=V.K,T=V.ts/1e3,hard=FACE.hard(),q=W.Gov?Gov.q:2,N=[5,8,11][q]||8,[nx,ny]=V.lw(.3,0),[ax,ay]=V.lw(1.3,0);
  let ux=ax-nx,uy=ay-ny;const l=Math.hypot(ux,uy)||1;ux/=l;uy/=l;const hc=layer(S.depth)[4],P=(a,b)=>[nx+(ux*a-uy*b)*K,ny+(uy*a+ux*b)*K];x.save();x.lineCap='round';x.lineJoin='round';
  for(let i=0;i<N;i++){const c=FACE.cyc(i,T,hard),oy=(hash(c.seed+9)-.5)*2.5,oa=.25-.9*(oy/1.4)*(oy/1.4),sp=1.6-hard*.5,a0=(hash(c.seed)-.5)*sp+oy*.32,len=(.7+hash(c.seed+2)*1.4)*(.7+hard*.8),C=crackOf(c.seed,a0,len),fade=c.p>.82?1-(c.p-.82)/.18:1;
   const tr=(a,b)=>P(a+oa,b+oy);x.globalAlpha=clamp(fade,0,1);draw(x,C,Math.min(1,c.p*1.4),tr,1.3+(1-hard)*1.1,'rgba(255,236,205,.3)');
   if(c.p>.74&&c.p<.99){const t2=(c.p-.74)/.25,e=C.pts[C.pts.length-1],q2=tr(e[0],e[1]);x.globalAlpha=1-t2;
    for(let k=0;k<2;k++){const sd=c.seed+k*5.1,ang=hash(sd)*6.28+t2*(2+hash(sd+1)*4),sz=1.6+hash(sd+2)*2.8,px=q2[0]+ux*t2*(10+hash(sd+3)*10)+(hash(sd+4)-.5)*t2*14,py=q2[1]+uy*t2*(10+hash(sd+3)*10)+(hash(sd+4)-.5)*t2*14+t2*t2*22;
     x.fillStyle=k?mix(hc,'#000000',.5):mix(hc,'#ffffff',.18);x.beginPath();x.moveTo(px+Math.cos(ang)*sz,py+Math.sin(ang)*sz);x.lineTo(px+Math.cos(ang+2.3)*sz*.8,py+Math.sin(ang+2.3)*sz*.8);x.lineTo(px+Math.cos(ang+4.1)*sz*.6,py+Math.sin(ang+4.1)*sz*.6);x.closePath();x.fill()}}}
  x.globalAlpha=1;
  // zúzott szemcsék a fej felületén
  const ng=[10,18,26][q]||18;for(let i=0;i<ng;i++){const ph=(T*(1.4+hash(i)*1.2)+hash(i+7))%1,oy=(hash(i+3)-.5)*2.6,oa=.12-.9*(oy/1.5)*(oy/1.5)+ph*.5,p=P(oa,oy+Math.sin(T*9+i)*.05);x.globalAlpha=(1-ph)*.75;x.fillStyle=i%3?'#1c120b':mix(hc,'#ffffff',.25);x.fillRect(p[0],p[1],1.2+hash(i+11)*1.8,1.2+hash(i+13)*1.4)}
  x.globalAlpha=1;
  if(q>=1){ // por: a fej oldalán gomolyog ki
   for(let i=0;i<4;i++){const ph=(T*.8+i*.25)%1,sd=i%2?1:-1,p=P(.2+ph*.9,sd*(.5+ph*1.7)),r=5+ph*15,g=x.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${hc.length==7?[1,3,5].map(k=>parseInt(hc.substr(k,2),16)+30).join(','):'170,150,120'},${.2*(1-ph)})`);g.addColorStop(1,'rgba(150,130,100,0)');x.fillStyle=g;x.fillRect(p[0]-r,p[1]-r,r*2,r*2)}
   if(hard>.3){ // kemény kőzet: szikra a vágóéleken
    x.globalCompositeOperation='lighter';x.lineWidth=1.1;for(let i=0;i<7;i++){const ph=(T*2.6+hash(i)*3)%1;if(ph>.55)continue;const oy=(hash(i+21)-.5)*2.2,p=P(.1+ph*.2,oy),d=[ux*.8+(hash(i+5)-.5)*1.2,uy*.8+(hash(i+9)-.5)*1.2];x.strokeStyle=`rgba(255,${190-ph*140|0},80,${(1-ph*1.8)*.9})`;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0]+d[0]*(5+ph*20),p[1]+d[1]*(5+ph*20)+ph*ph*6);x.stroke()}x.globalCompositeOperation='source-over'}}
  x.restore()},
 // kisablak: nagyított fej és kőzet (mindig jobbra néz, a kőzet balra „csúszik”)
 inset(V){if(S.set.fcl===0||!FACE.active()||(W.$&&$('#mm'))||(W.PN&&!PN.vis('face')))return;if(W.ENG&&V.w<460&&(ENG.flash>0||(S.en&&!(ENG.phase==='run'&&ENG.ready()))))return;const x=V.x,sz=clamp(V.w*.25,76,104),px=6,py=44,T=V.ts/1e3,hard=FACE.hard(),q=W.Gov?Gov.q:2,L=layer(S.depth),tier=S.u.f,heat=typeof HEAT!=='undefined'?clamp(HEAT,0,1.2):0,rt=clamp((typeof rate!=='undefined'?rate:8)/14,0,1);
  if(W.PN)PN.reg('face',px,py,sz,sz);
  x.save();x.translate(px,py);x.beginPath();if(x.roundRect)x.roundRect(0,0,sz,sz,12);else x.rect(0,0,sz,sz);x.clip();
  const bg=x.createLinearGradient(0,0,0,sz);bg.addColorStop(0,mix(L[4],'#000000',.25));bg.addColorStop(1,mix(L[4],'#000000',.55));x.fillStyle=bg;x.fillRect(0,0,sz,sz);
  // kőzet-szemcsék és rétegcsíkok csúsznak a fej mellett
  const sc=T*sz*(.18+.5*rt),ns=[14,30,46][q]||30;for(let i=0;i<ns;i++){const x0=((hash(i)*sz-sc)%sz+sz)%sz,y0=hash(i+50)*sz,r=.8+hash(i+90)*2.6;x.fillStyle=i%3?'rgba(255,255,255,.07)':'rgba(0,0,0,.22)';x.beginPath();x.ellipse(x0,y0,r*1.6,r,hash(i)*3,0,7);x.fill()}
  if(q>0){x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;for(let i=0;i<4;i++){const y0=sz*(.15+i*.22);x.beginPath();for(let k=0;k<=8;k++){const xx=sz*k/8,yy=y0+Math.sin(k*1.3+i*2)*4;k?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke()}}
  const tx=sz*.72,ty=sz*.5;
  // zúzott zóna a fej előtt
  const pu=1+.08*Math.sin(T*23)*rt,cg=x.createRadialGradient(tx,ty,0,tx,ty,sz*.34*pu);cg.addColorStop(0,'rgba(10,6,4,.92)');cg.addColorStop(1,'rgba(10,6,4,0)');x.fillStyle=cg;x.fillRect(tx-sz*.4,ty-sz*.4,sz*.8,sz*.8);
  // repedés-hálózat (nagyítva)
  x.lineCap='round';x.lineJoin='round';const NC=[5,8,12][q]||8,u=sz*.21;
  for(let i=0;i<NC;i++){const c=FACE.cyc(i+40,T,hard),a0=(i/(NC-1)-.5)*2.5+(hash(c.seed)-.5)*.5,len=(1.2+hash(c.seed+2)*1.6)*(.8+hard*.7),C=crackOf(c.seed+7,a0,len),fade=c.p>.85?1-(c.p-.85)/.15:1;
   x.globalAlpha=clamp(fade,0,1);draw(x,C,Math.min(1,c.p*1.3),(a,b)=>[tx+8+a*u,ty+b*u],1.3+(1-hard)*.9,'rgba(255,236,205,.4)');
   if(c.p>.8&&c.p<.99){const t2=(c.p-.8)/.19,e=C.pts[C.pts.length-1];x.globalAlpha=1-t2;x.fillStyle=mix(L[4],'#000000',.35);const fx=tx+8+e[0]*u+t2*sz*.2,fy=ty+e[1]*u+t2*t2*sz*.25;x.beginPath();x.moveTo(fx,fy-4);x.lineTo(fx+5,fy+1);x.lineTo(fx+1,fy+5);x.lineTo(fx-4,fy+2);x.closePath();x.fill()}}
  x.globalAlpha=1;
  // a fúrófej: UGYANAZ a rajz, mint a játékbeli gépen (BG.head + pajzs), nagyítva
  const wear=clamp((S.hw||0)/100,0,1),scl=sz*.19;x.save();x.translate(tx-.5*scl,ty);x.scale(scl,scl);
  if(W.BG){BG.shield(x,S.u.h);x.fillStyle='rgba(0,0,0,.22)';x.fillRect(-4.7,-1.65,3.1,3.3);BG.head(x,{sp:T*(1.5+9*rt),heat,ht:tier,ts:V.ts})}
  x.restore();
  if(heat>.4){const hg=x.createRadialGradient(tx,ty,0,tx,ty,sz*.3);hg.addColorStop(0,`rgba(255,${160-heat*50|0},50,${.55*Math.min(1,heat)})`);hg.addColorStop(1,'rgba(255,100,20,0)');x.fillStyle=hg;x.fillRect(tx-sz*.3,ty-sz*.3,sz*.6,sz*.6)}
  // szikrák és por
  const nsp=Math.floor((q?8:3)*(.3+heat*1.4)*rt);x.strokeStyle='#ffd27a';x.lineWidth=1.3;for(let i=0;i<nsp;i++){const g=(T*3+i*.37)%1,a=(hash(i+Math.floor(T*3+i*.37))-.5)*2.2,dd=g*sz*.28;x.globalAlpha=1-g;x.beginPath();x.moveTo(tx+Math.cos(a)*dd*.4,ty+Math.sin(a)*dd*.4);x.lineTo(tx+Math.cos(a)*dd,ty+Math.sin(a)*dd+g*g*10);x.stroke()}x.globalAlpha=1;
  x.restore();
  // keret és feliratok
  x.save();x.translate(px,py);x.strokeStyle=heat>.85?'#ff5a3c':'rgba(240,160,48,.8)';x.lineWidth=1.5;x.beginPath();if(x.roundRect)x.roundRect(0,0,sz,sz,12);else x.rect(0,0,sz,sz);x.stroke();
  x.font='bold 8.5px Georgia';x.fillStyle='rgba(10,8,6,.7)';x.fillRect(0,0,sz,13);x.fillStyle='#f0c070';x.textAlign='left';x.fillText('FÚRÓFEJ · KÖZELI NÉZET',5,9.5);
  x.fillStyle='rgba(10,8,6,.7)';x.fillRect(0,sz-24,sz,24);x.fillStyle='#fff';x.font='9px Georgia';x.fillText(L[0].split(' (')[0]+' · '+HR[LY.indexOf(L)]+' MPa',5,sz-14);x.fillStyle=wear>.75?'#ff6a4a':'#bfb09a';x.fillText('kopás '+Math.round(S.hw||0)+'%  ·  '+(typeof HD!=='undefined'?HD[tier][0].replace(' fúrófej',''):''),5,sz-4);x.restore()}};
W.FACE=FACE;
if(W.on){on('world.front',V=>FACE.world(V));on('hud',V=>FACE.inset(V))}
})(typeof window!=='undefined'?window:globalThis);
