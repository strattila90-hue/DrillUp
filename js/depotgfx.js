/* Drill Up – depó-rajz (4. fázis kinézet-bővítés): szintfüggő épületek, portáldaru, burkolt/dupla szállítószalag,
   gőz-/dízel-/villany-/modern mozdony és háromféle vagon (kerekek a megtett úttal forognak). Csak rajzol, állapotot nem változtat.
   Szintek: s Raktártelep → silók száma/anyaga, b Szalag → szalag típusa, v Vagonok → hossz és vagontípus, m Mozdony → mozdonytípus. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('depotgfx');
const L=k=>Math.min(6,Math.max(0,(S.bd&&S.bd[k])|0)),TAU=6.2832;
const mixc=(a,b,u)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*u)).join(',')+')';
const rrect=(x,a,b,c,d,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)};
const grad=(x,y0,y1,c0,c1)=>{const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,c0);g.addColorStop(1,c1);return g};
function wheel(x,cx,cy,r,ang,sp){x.fillStyle='#14151a';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='#9097a0';x.lineWidth=Math.max(.7,r*.16);x.beginPath();x.arc(cx,cy,r*.8,0,7);x.stroke();
 x.lineWidth=Math.max(.6,r*.13);x.beginPath();for(let i=0;i<(sp||6);i++){const a=ang+i*TAU/(sp||6);x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*r*.78,cy+Math.sin(a)*r*.78)}x.stroke();x.fillStyle='#c2c6cc';x.beginPath();x.arc(cx,cy,r*.2,0,7);x.fill()}
// ---------- mozdonyok (az eleje x=0, jobbra néz, a sín felső éle y=0) ----------
const LOCO=[{n:'gőz',len:66},{n:'dízel',len:52},{n:'dízel',len:52},{n:'villany',len:54},{n:'villany',len:54},{n:'modern',len:64},{n:'modern',len:64}];
function loco(x,t,k,ph,mv,dk,rev){const ty=Math.min(6,k),dist=ph*.9*(rev?-1:1);
 if(ty===0){ // gőzmozdony + széntender
  x.fillStyle='#1c1e23';rrect(x,-66,-18,20,9,1);x.fill();x.fillStyle='#34363c';x.fillRect(-66,-20,20,3);x.fillStyle='#111';x.beginPath();x.moveTo(-64,-20);x.quadraticCurveTo(-56,-27,-48,-20);x.fill();x.fillStyle='#14151a';x.fillRect(-66,-9,22,4);
  x.fillStyle='#26292f';x.fillRect(-46,-30,13,22);x.fillStyle='#34373d';x.fillRect(-48,-32,17,3);x.fillStyle=dk>.3?'#ffd66b':'#a9c8e0';x.fillRect(-43,-26,6,6);x.strokeStyle='#111';x.lineWidth=.8;x.strokeRect(-43,-26,6,6);
  x.fillStyle=grad(x,-27,-9,'#3a3d44','#17181c');rrect(x,-33,-27,29,17,7);x.fill();x.fillStyle='#b88a3c';[-27,-19,-11].forEach(b=>x.fillRect(b,-27,1.6,17));
  x.fillStyle='#16171a';x.fillRect(-6,-27,6,17);x.fillStyle='#2b2d33';x.beginPath();x.arc(0,-18.5,8.4,-1.57,1.57);x.fill();
  x.fillStyle='#111214';x.beginPath();x.moveTo(-14,-27);x.lineTo(-17,-37);x.lineTo(-8,-37);x.lineTo(-11,-27);x.fill();x.fillStyle='#b88a3c';x.fillRect(-18,-38,11,2);
  x.fillStyle='#d2a64a';x.beginPath();x.arc(-24,-27,4,Math.PI,0);x.fill();x.fillStyle='#e8c46a';x.beginPath();x.arc(-3,-20,2.4,0,7);x.fill();x.fillStyle='#34363c';x.beginPath();x.moveTo(0,-8);x.lineTo(7,0);x.lineTo(0,0);x.fill();
  x.fillStyle='#2a2d33';x.fillRect(-44,-10,44,3);x.fillStyle='#8c2a20';x.fillRect(-44,-8,44,1.2);
  const a=ph*.16*(rev?-1:1);for(const cx of[-38,-26,-14]){wheel(x,cx,-6.4,6.4,a,8)}x.strokeStyle='#a9aeb5';x.lineWidth=1.6;x.beginPath();const px=Math.cos(a)*2.6,py=Math.sin(a)*2.6;x.moveTo(-38+px,-6.4+py);x.lineTo(-14+px,-6.4+py);x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(-14+px,-6.4+py);x.lineTo(-3,-10);x.stroke();
  wheel(x,-58,-3.6,3.6,a*1.6,6)}
 else if(ty<3){ // dízel
  x.fillStyle=grad(x,-27,-7,'#b13a2e','#6e1f19');rrect(x,-52,-26,28,19,2);x.fill();rrect(x,-26,-18,26,11,3);x.fill();x.fillStyle='#e0b43a';x.fillRect(-52,-13,52,2.2);x.fillStyle='#1e2229';x.fillRect(-49,-23,10,8);x.fillStyle='rgba(180,220,255,.5)';x.fillRect(-48,-22,8,3);x.fillStyle='#16191f';x.fillRect(-23,-16,18,6);for(let i=0;i<5;i++){x.fillStyle='#2e333b';x.fillRect(-22+i*3.5,-16,1.4,6)}
  x.fillStyle='#2a2d33';x.fillRect(-52,-28,28,2.5);x.fillStyle='#16171a';for(const fx of[-44,-34]){x.beginPath();x.arc(fx,-29,3.3,Math.PI,0);x.fill();x.strokeStyle='#555';x.lineWidth=.6;x.beginPath();x.moveTo(fx-3,-29);x.lineTo(fx+3,-29);x.stroke()}
  x.fillStyle=dk>.2?'#fff4b8':'#e8dca0';x.beginPath();x.arc(-.5,-13,2.2,0,7);x.fill();x.fillStyle='#3a3d44';x.fillRect(-52,-8,52,3);
  const a=ph*.2*(rev?-1:1);for(const bx of[-8,-17,-37,-46])wheel(x,bx,-4.2,4.2,a,6);x.fillStyle='#222';x.fillRect(-20,-6,14,1.5);x.fillRect(-49,-6,14,1.5)}
 else if(ty<5){ // villanymozdony
  x.fillStyle=grad(x,-28,-7,'#3b78b8','#1d3d68');x.beginPath();x.moveTo(-54,-26);x.lineTo(-6,-26);x.quadraticCurveTo(0,-26,0,-18);x.lineTo(0,-8);x.lineTo(-54,-8);x.closePath();x.fill();x.fillStyle='#f0f2f5';x.fillRect(-54,-17,54,2.4);x.fillStyle='#16202c';x.fillRect(-52,-24,10,8);x.fillRect(-9,-24,8,8);x.fillStyle='rgba(180,220,255,.45)';x.fillRect(-51,-23,8,3);
  for(let i=0;i<6;i++){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(-38+i*5,-24,1.2,6)}
  x.fillStyle=dk>.2?'#fff4b8':'#e8dca0';x.beginPath();x.arc(-1,-13,2,0,7);x.fill();x.fillStyle='#2a2d33';x.fillRect(-54,-8,54,3);
  x.strokeStyle='#cfd3d8';x.lineWidth=1.3;x.beginPath();x.moveTo(-34,-26);x.lineTo(-27,-38);x.lineTo(-20,-47);x.moveTo(-20,-47);x.lineTo(-13,-38);x.lineTo(-20,-26);x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(-26,-47.5);x.lineTo(-14,-47.5);x.stroke();
  const a=ph*.2*(rev?-1:1);for(const bx of[-8,-17,-37,-46])wheel(x,bx,-4.2,4.2,a,6)}
 else { // modern, áramvonalas
  x.fillStyle=grad(x,-28,-6,'#f4f6fa','#b9c2d0');x.beginPath();x.moveTo(-64,-25);x.lineTo(-24,-26);x.quadraticCurveTo(-4,-25,2,-13);x.quadraticCurveTo(1,-8,-6,-7);x.lineTo(-64,-7);x.closePath();x.fill();
  x.fillStyle='#c4352b';x.beginPath();x.moveTo(-64,-12);x.lineTo(-3,-12);x.lineTo(-6,-7);x.lineTo(-64,-7);x.fill();x.fillStyle='#10161e';x.beginPath();x.moveTo(-18,-23.5);x.quadraticCurveTo(-5,-23,-1.5,-15);x.lineTo(-18,-15);x.fill();x.fillStyle='rgba(150,210,255,.35)';x.fillRect(-16,-22,10,2.5);
  for(let i=0;i<7;i++){x.fillStyle='#1b2430';x.fillRect(-60+i*6,-22,4,5)}
  x.fillStyle='#e6ecf5';x.beginPath();x.arc(.5,-12,1.8,0,7);x.fill();x.fillStyle='#2a2d33';x.fillRect(-64,-7,64,2.5);
  const a=ph*.22*(rev?-1:1);for(const bx of[-10,-18,-48,-56])wheel(x,bx,-3.8,3.8,a,6);
  if(mv){x.fillStyle='rgba(120,200,255,.35)';x.fillRect(-64,-6.5,64,1)}}
 if(dk>.25){x.save();x.globalCompositeOperation='lighter';const g=x.createLinearGradient(0,0,70,0);g.addColorStop(0,'rgba(255,240,170,.45)');g.addColorStop(1,'rgba(255,240,170,0)');x.fillStyle=g;x.beginPath();x.moveTo(1,-13);x.lineTo(70,-22);x.lineTo(70,2);x.closePath();x.fill();x.restore()}}
// ---------- vagonok ----------
function wagon(x,wl,ty,ph,loaded,fillU,rev){const a=ph*.2*(rev?-1:1),bh=ty===0?15:ty===1?13:16;
 x.fillStyle='#2c2f35';x.fillRect(-wl,-8,wl,3);
 if(ty===0){ // nyitott garat
  x.fillStyle=grad(x,-8-bh,-8,'#6b707a','#3a3d44');x.beginPath();x.moveTo(-wl+1,-8-bh);x.lineTo(-1,-8-bh);x.lineTo(-4,-8);x.lineTo(-wl+4,-8);x.closePath();x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.7;for(let i=1;i<5;i++){const u=-wl+i*wl/5;x.beginPath();x.moveTo(u,-8-bh);x.lineTo(u+(i-2.5)*.4,-8);x.stroke()}x.fillStyle='#8c9199';x.fillRect(-wl,-9-bh,wl,2)}
 else if(ty===1){ // nyitott kocsi (gondola)
  x.fillStyle=grad(x,-8-bh,-8,'#7a5a3a','#43301e');x.fillRect(-wl+1,-8-bh,wl-2,bh);x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=.8;for(let i=1;i<7;i++){x.beginPath();x.moveTo(-wl+i*wl/7,-8-bh);x.lineTo(-wl+i*wl/7,-8);x.stroke()}x.fillStyle='#9aa0a8';x.fillRect(-wl,-9-bh,wl,2)}
 else { // fedett garatkocsi
  x.fillStyle=grad(x,-8-bh,-8,'#cfd4db','#8c929c');rrect(x,-wl+1,-8-bh,wl-2,bh,3);x.fill();x.fillStyle='#4a5260';for(const hx of[.25,.55,.85]){rrect(x,-wl*hx-3,-9-bh,6,3,1);x.fill()}x.fillStyle='#c4352b';x.fillRect(-wl+1,-12,wl-2,2);x.fillStyle='#555d6a';x.fillRect(-wl+2,-8-bh+3,wl-4,1)}
 if(loaded&&ty<2){x.fillStyle='#7a5c30';x.beginPath();x.moveTo(-wl+3,-8-bh);x.quadraticCurveTo(-wl/2,-8-bh-5-6*fillU,-3,-8-bh);x.fill();x.fillStyle='rgba(255,255,255,.1)';x.fillRect(-wl*.6,-8-bh-3,wl*.2,1.5)}
 wheel(x,-wl*.22,-3.8,3.8,a,6);wheel(x,-wl*.34,-3.8,3.8,a,6);wheel(x,-wl*.7,-3.8,3.8,a,6);wheel(x,-wl*.82,-3.8,3.8,a,6);x.strokeStyle='#14151a';x.lineWidth=1;x.beginPath();x.moveTo(0,-6);x.lineTo(2,-6);x.stroke()}
// ---------- a jelenet ----------
const DG={t:0,ph:0,pp:0,
 paint(dt){const cv=$('#dpc');if(!cv||!cv.getContext)return;const w=cv.clientWidth|0,h=cv.clientHeight|0;if(w<20||h<20)return;
  const d=W.Gov&&Gov.dpr?Gov.dpr(W.devicePixelRatio||1):1;if(cv.width!==(w*d|0)){cv.width=w*d|0;cv.height=h*d|0}
  const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);const t=DG.t+=(dt||.016),job=!!DEP.job,lowq=W.Gov&&Gov.q===0,u=Math.max(.75,Math.min(1.3,w/390));
  // ég
  const dayP=(t/90)%1,sun=Math.sin(dayP*TAU),dk=Math.max(0,Math.min(1,.5-sun*.7));
  x.fillStyle=grad(x,0,h,mixc([38,92,150],[8,14,34],dk),mixc([150,196,222],[44,50,84],dk));x.fillRect(0,0,w,h);
  const ang=dayP*TAU,cx=w*.5+Math.cos(ang+Math.PI)*w*.42,cy=h*.55-Math.sin(ang)*h*.45;
  if(sun>-.15){x.fillStyle='rgba(255,224,140,.25)';x.beginPath();x.arc(cx,cy,16,0,7);x.fill();x.fillStyle='#ffe08a';x.beginPath();x.arc(cx,cy,8,0,7);x.fill()}
  if(dk>.3){x.fillStyle='rgba(255,255,255,'+dk*.8+')';for(let i=0;i<16;i++)x.fillRect((i*97.3)%w,(i*41.7)%(h*.45),1.5,1.5)}
  x.fillStyle='rgba(255,255,255,'+(.5-dk*.32)+')';for(let i=0;i<4;i++){const px=((t*(5+i*2)+i*w*.3)%(w+120))-60,py=h*.08+i*h*.055;for(const[ex,ey,er,eh]of[[0,0,26,7],[14,-4,16,7],[-14,-2,14,6]]){x.beginPath();x.ellipse(px+ex,py+ey,er,eh,0,0,7);x.fill()}}
  const gy=h*.72;for(const[a,s,k,c]of[[.4,.006,1,[45,74,88]],[.25,.011,2,[47,90,58]]]){x.fillStyle=mixc(c,[10,16,26],dk*.8);x.beginPath();x.moveTo(0,gy);for(let i=0;i<=w;i+=12)x.lineTo(i,gy-h*(a*.3+.05*Math.sin(i*s*k+k*2)+.025*Math.sin(i*s*3.1)));x.lineTo(w,gy);x.fill()}
  x.fillStyle=mixc([61,107,52],[16,30,24],dk*.8);x.fillRect(0,gy,w,h-gy);x.fillStyle=mixc([120,104,84],[34,30,28],dk*.7);x.fillRect(0,gy+2,w,(h-gy)*.34);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,gy,w,3);
  const ry=gy+(h-gy)*.62,lb=L('b'),ls=L('s'),lm=L('m'),lv=L('v');
  // ---- szintek ----
  const ND=3+lv,Lm=LOCO[lm].len,wl=Math.max(20,Math.min(36,(w*.8-Lm)/ND-2)),trainL=Lm+ND*(wl+2),homeX=Math.min(w*.97,Math.max(trainL+8,w*.74)),T=DEP.trainPhase(),pos=homeX+T.f*(trainL+w*.12+Math.max(0,w-homeX)),mv=T.f>0&&T.f<1,rev=T.p>=.6;
  // ---- gépcsarnok + portáldaru ----
  const bx=w*.02,bw=w*.2,bh=h*.3,by=gy-bh,cr=by-14*u,xi=bx+bw+w*.07;
  x.fillStyle=grad(x,by,gy,'#8a8f98','#5a5e66');x.fillRect(bx,by,bw,bh);x.fillStyle='rgba(0,0,0,.2)';for(let i=1;i<14;i++)x.fillRect(bx+i*bw/14,by,1,bh);x.fillStyle='#3a3d44';x.beginPath();x.moveTo(bx-4,by);x.lineTo(bx+bw/2,by-10*u);x.lineTo(bx+bw+4,by);x.fill();
  x.fillStyle='#16181c';x.fillRect(bx+bw*.14,gy-bh*.62,bw*.5,bh*.62);x.fillStyle='rgba(255,226,150,'+(.25+dk*.5)+')';x.fillRect(bx+bw*.14,gy-bh*.62,bw*.5,bh*.62);
  // a csarnokban álló fúrógép (profil)
  const mx=bx+bw*.17,my=gy-bh*.12;x.fillStyle='#6e737c';rrect(x,mx,my-bh*.22,bw*.34,bh*.17,2);x.fill();x.fillStyle='#3a3d44';rrect(x,mx-1,my-bh*.05,bw*.36,bh*.06,3);x.fill();x.fillStyle='#8a8f98';x.beginPath();x.moveTo(mx+bw*.34,my-bh*.22);x.lineTo(mx+bw*.45,my-bh*.14);x.lineTo(mx+bw*.34,my-bh*.05);x.fill();x.fillStyle='#e0a030';x.fillRect(mx+3,my-bh*.2,4,3);
  x.fillStyle='#e8ecf5';x.font='11px sans-serif';x.fillText('Gép',bx+4,by-14*u-4);
  // daru: két láb + gerenda, a futómacska ritmikusan jár (kirakodáskor ércesvödörrel)
  x.strokeStyle='#e0a030';x.lineWidth=3;x.beginPath();x.moveTo(bx+bw*.05,gy);x.lineTo(bx+bw*.05,cr);x.lineTo(xi+10,cr);x.moveTo(xi+10,cr);x.lineTo(xi+10,gy);x.stroke();x.lineWidth=1;x.strokeStyle='#c28820';for(let q=bx+bw*.05;q<xi+8;q+=10){x.beginPath();x.moveTo(q,cr);x.lineTo(q+5,cr+5);x.lineTo(q+10,cr);x.stroke()}
  const cyc=(t*(job?.16:.05))%1,tp=job?(cyc<.25?0:cyc<.5?(cyc-.25)/.25:cyc<.75?1:1-(cyc-.75)/.25):.5+.45*Math.sin(t*.4),tx=bx+bw*.3+(xi-bx-bw*.3)*tp,low=job?(cyc<.12||(cyc>=.5&&cyc<.62)?1:cyc<.25?1-(cyc-.12)/.13:cyc>=.62&&cyc<.75?(cyc-.62)/.13:0):.1,hy=cr+6+low*(gy-cr-34),carry=job&&cyc>=.12&&cyc<.62&&hy<gy-12;
  x.fillStyle='#2a2d33';x.fillRect(tx-6,cr-3,12,6);x.strokeStyle='#bbb';x.lineWidth=1;x.beginPath();x.moveTo(tx,cr+3);x.lineTo(tx+Math.sin(t*2)*.8,hy);x.stroke();x.fillStyle='#d8d8d8';x.fillRect(tx-3+Math.sin(t*2)*.8,hy,6,3);
  if(carry||(job&&cyc<.12)){x.fillStyle='#4a4d54';x.beginPath();x.moveTo(tx-9,hy+3);x.lineTo(tx+9,hy+3);x.lineTo(tx+6,hy+14);x.lineTo(tx-6,hy+14);x.fill();x.fillStyle='#7a5c30';x.beginPath();x.moveTo(tx-9,hy+3);x.quadraticCurveTo(tx,hy-3,tx+9,hy+3);x.fill()}
  // ---- szállítószalag (szinttől függően) ----
  const sx=w*.5,sw=Math.min(34*u,w*.1),nS=[1,1,2,2,3,3,4][ls],sH=h*(.4+ls*.014),sy=gy-sH,silW=nS*sw+(nS-1)*4,x0=xi+4,y0=gy-16*u,x1=sx+sw*.5,y1=sy-6*u;
  x.fillStyle='#4a4d54';x.beginPath();x.moveTo(xi-6,gy-26*u);x.lineTo(xi+16,gy-26*u);x.lineTo(xi+10,gy-14*u);x.lineTo(xi,gy-14*u);x.closePath();x.fill();x.fillStyle='#303338';x.fillRect(xi-8,gy-28*u,26,3);
  const n=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/n,uy=(y1-y0)/n,ang2=Math.atan2(y1-y0,x1-x0);
  x.strokeStyle='#5a5e66';x.lineWidth=1.4;for(let q=0;q<=n;q+=Math.max(26,n/7)){const px=x0+ux*q,py=y0+uy*q;x.beginPath();x.moveTo(px,py+4);x.lineTo(px,gy);x.moveTo(px-5,gy);x.lineTo(px,py+8);x.lineTo(px+5,gy);x.stroke()}
  const bw2=[9,10,12,12,14,14,16][lb],dbl=lb>=4;
  const belt=(off)=>{x.save();x.translate(x0,y0+off);x.rotate(ang2);x.fillStyle='#202226';rrect(x,-6,-bw2*.5,n+12,bw2,bw2*.5);x.fill();x.strokeStyle='#454950';x.lineWidth=bw2*.55;x.setLineDash([5,5]);x.lineDashOffset=-DEP.ph*(26+lb*6);x.beginPath();x.moveTo(0,0);x.lineTo(n,0);x.stroke();x.setLineDash([]);
   x.fillStyle='#8c9199';for(let q=8;q<n;q+=Math.max(14,n/10)){x.beginPath();x.arc(q,bw2*.5+1,2,0,7);x.fill()}
   if(lb>=2){x.fillStyle='rgba(120,128,140,.55)';rrect(x,6,-bw2*.5-5,n-12,5,2);x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.7;for(let q=10;q<n-10;q+=12){x.beginPath();x.moveTo(q,-bw2*.5-5);x.lineTo(q,-bw2*.5)}x.stroke()}
   if(job){x.fillStyle='#8a6a3a';for(let i=0;i<10;i++){const s=((i/10)+DEP.ph*(.16+lb*.02))%1;x.beginPath();x.arc(s*n,-bw2*.25-Math.abs(Math.sin(s*30+i))*1.2,2+(i%3)*.8,0,7);x.fill()}}x.restore()};
  belt(0);if(dbl)belt(7*u);
  x.fillStyle='#2a2d33';x.beginPath();x.arc(x0-4,y0,bw2*.7,0,7);x.fill();x.save();x.translate(x0-4,y0);x.rotate(DEP.ph*3);x.strokeStyle='#8c9199';x.lineWidth=1;x.beginPath();x.moveTo(-bw2*.5,0);x.lineTo(bw2*.5,0);x.moveTo(0,-bw2*.5);x.lineTo(0,bw2*.5);x.stroke();x.restore();
  if(lb>=3){for(let i=0;i<4;i++){const q=n*(i+.5)/4,px=x0+ux*q,py=y0+uy*q-12*u;x.fillStyle='#303338';x.fillRect(px-1,py,2,10*u);x.fillStyle=dk>.2?'#ffd66b':'#9aa4b0';x.beginPath();x.arc(px,py,2.5,0,7);x.fill();if(dk>.3){x.fillStyle='rgba(255,220,120,.18)';x.beginPath();x.arc(px,py,12,0,7);x.fill()}}}
  // ---- silók (szintenként több és szebb) ----
  const fill=Math.min(1,DEP.stock()/DEP.BLD.s.v[ls]);
  const wood=ls===0,conc=ls>=4;
  x.fillStyle=conc?'#8d9097':'#6b6f78';x.fillRect(sx-4,sy+sH*.88,silW+8,sH*.12);
  for(let i=0;i<nS;i++){const px=sx+i*(sw+4);const g=x.createLinearGradient(px,0,px+sw,0);if(wood){g.addColorStop(0,'#7a5a38');g.addColorStop(.5,'#9a7448');g.addColorStop(1,'#5a4128')}else if(conc){g.addColorStop(0,'#b4b7bd');g.addColorStop(.5,'#9a9da4');g.addColorStop(1,'#72757c')}else{g.addColorStop(0,'#9ba0aa');g.addColorStop(.5,'#7a7f89');g.addColorStop(1,'#545861')}
   x.fillStyle=g;x.fillRect(px,sy,sw,sH*.88);x.fillStyle='rgba(0,0,0,.16)';for(let q=1;q<(wood?7:5);q++)x.fillRect(px,sy+q*sH*.88/(wood?7:5),sw,1.2);
   x.fillStyle=conc?'#5a5e66':'#3d4047';x.beginPath();x.moveTo(px-2,sy);x.lineTo(px+sw/2,sy-10*u);x.lineTo(px+sw+2,sy);x.fill();
   x.fillStyle='#14161a';x.fillRect(px+sw*.4,sy+sH*.2,sw*.2,sH*.5);x.fillStyle=fill>.02?'#8a6a3a':'#2a2c30';const fh=sH*.5*fill;x.fillRect(px+sw*.4,sy+sH*.2+sH*.5-fh,sw*.2,fh);
   if(ls>=2){x.strokeStyle='#d0d3d8';x.lineWidth=.8;x.beginPath();x.moveTo(px+sw-3,sy+3);x.lineTo(px+sw-3,sy+sH*.88);x.stroke();for(let q=sy+6;q<sy+sH*.88;q+=5){x.beginPath();x.moveTo(px+sw-5,q);x.lineTo(px+sw-1,q);x.stroke()}}
   x.fillStyle='#3a3d44';x.beginPath();x.moveTo(px+sw*.3,sy+sH*.88);x.lineTo(px+sw*.7,sy+sH*.88);x.lineTo(px+sw*.58,sy+sH*.88+8*u);x.lineTo(px+sw*.42,sy+sH*.88+8*u);x.fill()}
  if(ls>=3){x.fillStyle='#4a4e57';x.fillRect(sx-2,sy-2,silW+4,4);x.strokeStyle='#d0d3d8';x.lineWidth=1;x.beginPath();x.moveTo(sx-2,sy-6);x.lineTo(sx+silW+2,sy-6);x.stroke()}
  x.fillStyle=job?'#ff4a3a':'#d33';x.beginPath();x.arc(sx+silW/2,sy-14*u,2+(job?Math.abs(Math.sin(t*6)):Math.abs(Math.sin(t*2)))*1.2,0,7);x.fill();x.fillStyle='#e8ecf5';x.fillText('Depó '+(ls+1)+'/7',sx,sy-20*u);
  if(job&&!lowq){x.fillStyle='rgba(150,120,80,.3)';for(let i=0;i<6;i++){const s=(t*.8+i/6)%1;x.beginPath();x.arc(x1+Math.sin(i*3+t*3)*6,y1+s*14,2+s*5,0,7);x.fill()}}
  // ---- sín, felsővezeték, vonat ----
  x.fillStyle='#4c4a46';x.fillRect(0,ry,w,5);x.fillStyle='#5a4630';const off=mv?(pos%14):0;for(let q=-off;q<w;q+=14)x.fillRect(q,ry,6,5);x.fillStyle='#8a8f98';x.fillRect(0,ry-.5,w,1.6);
  if(lm>=3){x.strokeStyle='#555a63';x.lineWidth=1.4;for(let q=40;q<w;q+=120){x.beginPath();x.moveTo(q,ry);x.lineTo(q,ry-56);x.lineTo(q+10,ry-54);x.stroke()}x.strokeStyle='rgba(180,185,195,.7)';x.lineWidth=.8;x.beginPath();x.moveTo(0,ry-47.5);x.lineTo(w,ry-47.5);x.stroke()}
  const tph=pos/ (u*1) *.9;
  x.save();x.translate(pos,ry);x.scale(u,u);x.translate(0,0);
  const loadedAmt=T.loaded?1:(DEP.job?0:0);
  loco(x,t,lm,tph/ .9,mv,dk,rev);let ox=-Lm-2;for(let i=0;i<ND;i++){x.save();x.translate(ox,0);wagon(x,wl/u,lv<2?0:lv<4?1:2,tph/.9,T.loaded||(!T.away&&DEP.stock()>0&&false),1,rev);x.restore();ox-=wl/u+2}x.restore();
  // gőz / füst
  if(!lowq&&lm<3){for(let i=0;i<6;i++){const s=((t*(mv?1.1:.45)+i/6)%1),sxp=pos-(lm===0?10:36)*u+(mv?(rev?1:-1)*40*s:8*s),spy=ry-(lm===0?38:30)*u-s*h*.2;x.fillStyle=lm===0?'rgba(235,235,240,'+.5*(1-s)+')':'rgba(70,70,76,'+.4*(1-s)+')';x.beginPath();x.arc(sxp,spy,3+s*7,0,7);x.fill()}}
  if(lm>=3&&mv&&!lowq&&Math.sin(t*37)>.6){x.fillStyle='rgba(160,210,255,.8)';x.beginPath();x.arc(pos-20*u,ry-47*u,2.2,0,7);x.fill()}
 }};
W.DG=DG;
// a depó nézete ezt a rajzot használja (hiba esetén az eredeti marad)
(function hook(){if(!W.DEP||!DEP.paint)return;const old=DEP.paint;DEP.paint=function(dt){try{DG.paint(dt)}catch(e){DG.err=e.message;try{old.call(DEP,dt)}catch(e2){}}}})();
})(typeof window!=='undefined'?window:globalThis);
