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
const LOCO=[{n:'gőz',len:66},{n:'dízel',len:62},{n:'dízel',len:62},{n:'villany',len:54},{n:'villany',len:54},{n:'modern',len:64},{n:'modern',len:64}];
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
 else if(ty<3){ if(W.DX&&DX.diesel&&DX.diesel(x,t,ph,mv,dk,rev,ty))return; // M62 "Szergej"-szerű Co'Co' dízelmozdony: sötétzöld test, világosszürke tető, sárga sáv
  const gk=dk>.2;
  x.fillStyle='#23262b';x.fillRect(-60,-9,60,3.4);                                   // főkeret
  x.fillStyle='#1b1d21';x.fillRect(-40,-7,22,3.2);x.fillStyle='#4a4d54';x.fillRect(-40,-7,22,.6);   // üzemanyagtartály
  x.fillStyle=grad(x,-23,-9,'#3d7a4c','#1f4a2c');x.fillRect(-60,-22,46,13);          // hosszú motorház
  x.fillStyle=grad(x,-29,-9,'#3f7d50','#1f4a2c');rrect(x,-14,-29,14,20,1.5);x.fill();   // fülke (magasabb)
  x.fillStyle='#d9dde2';x.fillRect(-61,-24.2,47,2.4);x.fillStyle='#c3c8ce';rrect(x,-15,-31,16,2.6,1);x.fill();   // világosszürke tető
  x.fillStyle='#9aa0a8';x.fillRect(-61,-24.2,47,.6);
  x.fillStyle='#e6b92e';x.fillRect(-60,-13.4,60,1.8);                                // sárga sáv
  x.fillStyle='rgba(0,0,0,.28)';for(let i=0;i<10;i++)x.fillRect(-57+i*4.3,-21,1.1,6.6);   // hűtőrácsok / szellőzők
  x.fillStyle='rgba(255,255,255,.12)';x.fillRect(-60,-22,46,1);
  x.fillStyle='#1f2229';x.fillRect(-10,-27,9,8);x.fillStyle=gk?'rgba(255,230,150,.55)':'rgba(170,215,250,.55)';x.fillRect(-9.2,-26.4,7.4,2.6);   // fülkeablak
  x.fillStyle='#1f2229';x.fillRect(-13.3,-26,2.6,6);                                  // oldalablak
  x.fillStyle='#14161a';x.beginPath();x.arc(-52,-25.2,3,Math.PI,0);x.fill();x.beginPath();x.arc(-42,-25.2,3,Math.PI,0);x.fill();   // tetőventilátorok
  x.strokeStyle='#555a63';x.lineWidth=.5;[-52,-42].forEach(fx=>{x.beginPath();x.moveTo(fx-2.6,-25.4);x.lineTo(fx+2.6,-25.4);x.moveTo(fx,-28);x.lineTo(fx,-25.4);x.stroke()});
  x.fillStyle='#22252a';x.fillRect(-33,-27.5,4,3.4);x.fillStyle='#16171a';x.fillRect(-33.6,-28.6,5.2,1.3);   // kipufogó
  x.fillStyle='#f1f2f4';rrect(x,-9,-17.8,8,3.4,.6);x.fill();x.fillStyle='#1b3d26';x.font='bold 3px sans-serif';x.textAlign='center';x.fillText('M62',-5,-15.2);x.textAlign='start';   // pályaszámtábla
  x.fillStyle=gk?'#fff6c4':'#ece2a8';x.beginPath();x.arc(-1.2,-24,1.6,0,7);x.fill();x.beginPath();x.arc(-1.2,-11,1.4,0,7);x.fill();x.beginPath();x.arc(-1.2,-9.4,1.1,0,7);x.fill();   // lámpák
  x.strokeStyle='#d8dce0';x.lineWidth=.55;x.beginPath();x.moveTo(-60,-9.5);x.lineTo(-60,-12.5);x.lineTo(-14,-12.5);x.moveTo(-3,-9.5);x.lineTo(-3,-12.5);x.stroke();   // korlát
  x.fillStyle='#3a3d44';x.fillRect(-62,-8,2,2);x.fillRect(0,-8,2,2);                  // ütközők
  const a=ph*.2*(rev?-1:1);
  for(const bc of[-14.5,-45.5]){x.fillStyle='#16171a';rrect(x,bc-9.5,-6.4,19,3,1);x.fill();for(const dx of[-6.5,0,6.5])wheel(x,bc+dx,-3.5,3.5,a,6)}   // két 3 tengelyes forgóvázas
  }
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
const DG={t:0,ph:0,pp:0,sp:0,bph:0,cph:0,fs:0,
 paint(dt){const cv=$('#dpc');if(!cv||!cv.getContext)return;const w=cv.clientWidth|0,h=cv.clientHeight|0;if(w<20||h<20)return;
  const d=W.Gov&&Gov.dpr?Gov.dpr(W.devicePixelRatio||1):1;if(cv.width!==(w*d|0)){cv.width=w*d|0;cv.height=h*d|0}
  const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);dt=Math.min(dt||.016,.1);const t=DG.t+=dt,job=!!DEP.job,lowq=W.Gov&&Gov.q===0,u=Math.max(.75,Math.min(1.3,w/390));
  // a játék órája = a valós helyi idő (ugyanaz, mint a fúrónézetben): nappal/éjjel, napkelte/napnyugta
  const now=new Date(),hr=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600,el=Math.sin((hr-6)/12*Math.PI),dk=1-Math.max(0,Math.min(1,el*3+.35)),twil=Math.max(0,1-Math.abs(el)*2.6);
  DG.sp+=((job?1:0)-DG.sp)*Math.min(1,dt*3.2);DG.bph+=DG.sp*dt;DG.cph=(DG.cph+dt*.07*DG.sp)%1;
  const top=mixc(mixc([38,92,150],[8,14,34],dk).match(/\d+/g).map(Number),[196,98,58],twil*.35),bot=mixc(mixc([150,196,222],[44,50,84],dk).match(/\d+/g).map(Number),[255,160,84],twil*.75);
  x.fillStyle=grad(x,0,h,top,bot);x.fillRect(0,0,w,h);
  const dayU=(hr-6)/12,nightU=((hr+6)%24)/12,isDay=hr>=5.5&&hr<=18.5,uu=isDay?Math.min(1,Math.max(0,dayU)):Math.min(1,Math.max(0,nightU)),cx=w*(.08+.84*uu),cy=h*.62-Math.sin(uu*Math.PI)*h*.5;
  if(isDay){x.fillStyle='rgba(255,224,140,.25)';x.beginPath();x.arc(cx,cy,17,0,7);x.fill();x.fillStyle='#ffe08a';x.beginPath();x.arc(cx,cy,8,0,7);x.fill()}
  else{x.fillStyle='rgba(210,225,255,.18)';x.beginPath();x.arc(cx,cy,15,0,7);x.fill();x.fillStyle='#e6edf8';x.beginPath();x.arc(cx,cy,7.5,0,7);x.fill();x.fillStyle=top;x.beginPath();x.arc(cx+3.5,cy-1.5,6.3,0,7);x.fill()}
  if(dk>.3){x.fillStyle='rgba(255,255,255,'+dk*.8+')';for(let i=0;i<16;i++)x.fillRect((i*97.3)%w,(i*41.7)%(h*.45),1.5,1.5)}
  x.fillStyle='rgba(255,255,255,'+(.5-dk*.32)+')';for(let i=0;i<4;i++){const px=((t*(5+i*2)+i*w*.3)%(w+120))-60,py=h*.08+i*h*.055;for(const[ex,ey,er,eh]of[[0,0,26,7],[14,-4,16,7],[-14,-2,14,6]]){x.beginPath();x.ellipse(px+ex,py+ey,er,eh,0,0,7);x.fill()}}
  const gy=h*.72;for(const[a,s,k,c]of[[.4,.006,1,[45,74,88]],[.25,.011,2,[47,90,58]]]){x.fillStyle=mixc(c,[10,16,26],dk*.8);x.beginPath();x.moveTo(0,gy);for(let i=0;i<=w;i+=12)x.lineTo(i,gy-h*(a*.3+.05*Math.sin(i*s*k+k*2)+.025*Math.sin(i*s*3.1)));x.lineTo(w,gy);x.fill()}
  x.fillStyle=mixc([61,107,52],[16,30,24],dk*.8);x.fillRect(0,gy,w,h-gy);x.fillStyle=mixc([120,104,84],[34,30,28],dk*.7);x.fillRect(0,gy+2,w,(h-gy)*.34);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,gy,w,3);
  const ry=gy+(h-gy)*.36,lb=L('b'),ls=L('s'),lm=L('m'),lv=L('v');
  // ---- szintek ----
  const ND=3+lv,Lm=LOCO[lm].len,wl=Math.max(20,Math.min(36,(w*.8-Lm)/ND-2)),trainL=Lm+ND*(wl+2),homeX=Math.min(w*.97,Math.max(trainL+8,w*.74)),T=DEP.trainPhase(),pos=homeX+T.f*(trainL+w*.12+Math.max(0,w-homeX)),mv=T.f>0&&T.f<1,rev=T.p>=.6;
  // ---- nyitott gépcsarnok, benne a TÉNYLEGES fúrógép (a játék saját mach() rajza), portáldaru ----
  const bx=w*.012,bw=w*.3,bh=h*.34,by=gy-bh,cr=by-22*u,xi=bx+bw+w*.045,kM=(bw-8)/14.8,noseX=bx+bw-4,myG=gy-2.0*kM+1,pickY=myG-1.75*kM,pickX=noseX-7.4*kM;
  x.fillStyle=grad(x,by,gy,mixc([130,135,144],[40,44,52],dk*.8),mixc([84,88,96],[24,26,32],dk*.8));x.fillRect(bx,by,bw,bh);x.fillStyle='rgba(0,0,0,.16)';for(let i=1;i<bw/6;i++)x.fillRect(bx+i*6,by,1,bh);
  x.fillStyle=mixc([150,150,150],[56,58,66],dk*.8);x.fillRect(bx-6,gy-2,bw+12,4);
  // tető + oszlopok + lámpák
  x.fillStyle='#3a3d44';x.beginPath();x.moveTo(bx-6,by+3);x.lineTo(bx+bw/2,by-12*u);x.lineTo(bx+bw+6,by+3);x.lineTo(bx+bw+6,by+8);x.lineTo(bx-6,by+8);x.fill();x.fillStyle='#2a2d33';x.fillRect(bx-3,by+6,4,bh-4);x.fillRect(bx+bw-1,by+6,4,bh-4);
  for(let i=0;i<4;i++){const lx=bx+bw*(.14+i*.24);x.fillStyle='#22252a';x.fillRect(lx-1,by+8,2,4);x.fillStyle=dk>.2?'#ffe9a0':'#8a9098';x.beginPath();x.arc(lx,by+13,2.6,0,7);x.fill();if(dk>.25){x.fillStyle='rgba(255,226,150,'+(.1+dk*.1)+')';x.beginPath();x.moveTo(lx-3,by+14);x.lineTo(lx+3,by+14);x.lineTo(lx+bw*.12,gy-2);x.lineTo(lx-bw*.12,gy-2);x.fill()}}
  x.save();x.translate(noseX,myG);x.scale(kM,kM);try{mach(x,{ts:t*1000,ph:0,sp:0,sk:0,dr:false,act:job,lit2:dk>.3,lw:()=>[0,0],GL:[],lamp:()=>{},dep:0,heat:0,ht:S.u.f,stroke:0,trk:0,grip:1,hyd:job?.55:0,alarm:false})}catch(e){DG.err='mach: '+e.message}x.restore();
  x.fillStyle='#e8ecf5';x.font='11px sans-serif';x.fillText('Gép',bx+4,by-14*u);
  // portáldaru: lábak + rácsos gerenda; a futómacska folyamatosan, simított mozgással hordja a vödröt a gépről a garatba
  const ease=q=>q*q*(3-2*q),seg=(c,a,b)=>Math.min(1,Math.max(0,(c-a)/(b-a))),cph=DG.cph;
  let tpn,lowN,tgt,fillB;
  if(cph<.18){tpn=0;lowN=ease(seg(cph,0,.18));tgt=pickY;fillB=0}else if(cph<.26){tpn=0;lowN=1;tgt=pickY;fillB=ease(seg(cph,.18,.26))}else if(cph<.44){tpn=0;lowN=1-ease(seg(cph,.26,.44));tgt=pickY;fillB=1}
  else if(cph<.68){tpn=ease(seg(cph,.44,.68));lowN=0;tgt=pickY;fillB=1}else if(cph<.76){tpn=1;lowN=ease(seg(cph,.68,.76));tgt=gy-34*u;fillB=1}else if(cph<.82){tpn=1;lowN=1;tgt=gy-34*u;fillB=1-ease(seg(cph,.76,.82))}
  else if(cph<.9){tpn=1;lowN=1-ease(seg(cph,.82,.9));tgt=gy-34*u;fillB=0}else{tpn=1-ease(seg(cph,.9,1));lowN=0;tgt=pickY;fillB=0}
  const idleTp=.5+.12*Math.sin(t*.35),spd=DG.sp,tpF=idleTp+(tpn-idleTp)*spd,lowF=lowN*spd,txA=pickX,txB=xi+8,tx=txA+(txB-txA)*tpF,hy=cr+7+lowF*(tgt-cr-7-6),sway=Math.sin(t*1.7+tpF*3)*(.6+(1-lowF)*1.4)*(.3+.7*spd);
  x.strokeStyle='#e0a030';x.lineWidth=3.2;x.beginPath();x.moveTo(bx+3,gy);x.lineTo(bx+3,cr);x.lineTo(xi+14,cr);x.moveTo(xi+14,cr);x.lineTo(xi+14,gy);x.stroke();x.fillStyle='#e0a030';x.fillRect(bx-1,cr-2,xi+19-bx,4);x.lineWidth=1;x.strokeStyle='#c28820';for(let q=bx+3;q<xi+12;q+=9){x.beginPath();x.moveTo(q,cr+2);x.lineTo(q+4.5,cr+7);x.lineTo(q+9,cr+2);x.stroke()}
  x.fillStyle='#2a2d33';x.fillRect(tx-7,cr-3,14,7);x.fillStyle='#9aa0a8';x.beginPath();x.arc(tx-4,cr+4,2,0,7);x.arc(tx+4,cr+4,2,0,7);x.fill();
  x.strokeStyle='#cfd3d8';x.lineWidth=1.1;x.beginPath();x.moveTo(tx,cr+4);x.lineTo(tx+sway,hy);x.stroke();x.fillStyle='#d8d8d8';x.fillRect(tx+sway-3,hy,6,3);
  x.save();x.globalAlpha=Math.max(.35,spd);x.translate(tx+sway,hy+3);x.fillStyle='#4a4d54';x.beginPath();x.moveTo(-9,0);x.lineTo(9,0);x.lineTo(6,12);x.lineTo(-6,12);x.fill();x.strokeStyle='#2a2d33';x.lineWidth=1;x.stroke();x.fillStyle='#7a5c30';x.beginPath();x.moveTo(-8,1);x.quadraticCurveTo(0,1-9*fillB,8,1);x.lineTo(7,2+(12-2)*(1-fillB)*.0+1);x.fill();
  if(fillB>0&&fillB<1&&cph>.76){x.fillStyle='#7a5c30';for(let i=0;i<5;i++){const f=(t*3+i*.2)%1;x.beginPath();x.arc((i-2)*2.2,12+f*(Math.max(0,gy-34*u-hy)+8),1.5,0,7);x.fill()}}x.restore();
  // ---- szállítószalag (szinttől függően) ----
  const sx=w*.56,sw=Math.min(34*u,w*.1),nS=[1,1,2,2,3,3,4][ls],sH=h*(.4+ls*.014),sy=gy-sH,silW=nS*sw+(nS-1)*4,x0=xi+4,y0=gy-16*u,x1=sx+sw*.5,y1=sy-6*u;
  x.fillStyle='#4a4d54';x.beginPath();x.moveTo(xi-6,gy-26*u);x.lineTo(xi+16,gy-26*u);x.lineTo(xi+10,gy-14*u);x.lineTo(xi,gy-14*u);x.closePath();x.fill();x.fillStyle='#303338';x.fillRect(xi-8,gy-28*u,26,3);
  const n=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/n,uy=(y1-y0)/n,ang2=Math.atan2(y1-y0,x1-x0);
  x.strokeStyle='#5a5e66';x.lineWidth=1.4;for(let q=0;q<=n;q+=Math.max(26,n/7)){const px=x0+ux*q,py=y0+uy*q;x.beginPath();x.moveTo(px,py+4);x.lineTo(px,gy);x.moveTo(px-5,gy);x.lineTo(px,py+8);x.lineTo(px+5,gy);x.stroke()}
  const bw2=[9,10,12,12,14,14,16][lb],dbl=lb>=4;
  const belt=(off)=>{x.save();x.translate(x0,y0+off);x.rotate(ang2);x.fillStyle='#202226';rrect(x,-6,-bw2*.5,n+12,bw2,bw2*.5);x.fill();x.strokeStyle='#454950';x.lineWidth=bw2*.55;x.setLineDash([5,5]);x.lineDashOffset=-DG.bph*(26+lb*6);x.beginPath();x.moveTo(0,0);x.lineTo(n,0);x.stroke();x.setLineDash([]);
   x.fillStyle='#8c9199';for(let q=8;q<n;q+=Math.max(14,n/10)){x.beginPath();x.arc(q,bw2*.5+1,2,0,7);x.fill()}
   if(lb>=2){x.fillStyle='rgba(120,128,140,.55)';rrect(x,6,-bw2*.5-5,n-12,5,2);x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.7;for(let q=10;q<n-10;q+=12){x.beginPath();x.moveTo(q,-bw2*.5-5);x.lineTo(q,-bw2*.5)}x.stroke()}
   if(DG.sp>.03){x.globalAlpha=Math.min(1,DG.sp*1.5);x.fillStyle='#8a6a3a';for(let i=0;i<10;i++){const s=((i/10)+DG.bph*(.16+lb*.02))%1;x.beginPath();x.arc(s*n,-bw2*.25-Math.abs(Math.sin(s*30+i))*1.2,2+(i%3)*.8,0,7);x.fill()}x.globalAlpha=1}x.restore()};
  belt(0);if(dbl)belt(7*u);
  x.fillStyle='#2a2d33';x.beginPath();x.arc(x0-4,y0,bw2*.7,0,7);x.fill();x.save();x.translate(x0-4,y0);x.rotate(DG.bph*3);x.strokeStyle='#8c9199';x.lineWidth=1;x.beginPath();x.moveTo(-bw2*.5,0);x.lineTo(bw2*.5,0);x.moveTo(0,-bw2*.5);x.lineTo(0,bw2*.5);x.stroke();x.restore();
  if(lb>=3){for(let i=0;i<4;i++){const q=n*(i+.5)/4,px=x0+ux*q,py=y0+uy*q-12*u;x.fillStyle='#303338';x.fillRect(px-1,py,2,10*u);x.fillStyle=dk>.2?'#ffd66b':'#9aa4b0';x.beginPath();x.arc(px,py,2.5,0,7);x.fill();if(dk>.3){x.fillStyle='rgba(255,220,120,.18)';x.beginPath();x.arc(px,py,12,0,7);x.fill()}}}
  // ---- silók (szintenként több és szebb) ----
  DG.fs+=(Math.min(1,DEP.stock()/Math.max(1,DEP.val('s')))-DG.fs)*Math.min(1,dt*2.5);const fill=DG.fs;
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
  if(DG.sp>.1&&!lowq){x.fillStyle='rgba(150,120,80,'+.3*DG.sp+')';for(let i=0;i<6;i++){const s=(t*.8+i/6)%1;x.beginPath();x.arc(x1+Math.sin(i*3+t*3)*6,y1+s*14,2+s*5,0,7);x.fill()}}
  // ---- sín, felsővezeték, vonat ----
  x.fillStyle='#4c4a46';x.fillRect(0,ry,w,5);x.fillStyle='#5a4630';const off=mv?(pos%14):0;for(let q=-off;q<w;q+=14)x.fillRect(q,ry,6,5);x.fillStyle='#8a8f98';x.fillRect(0,ry-.5,w,1.6);
  if(lm>=3){x.strokeStyle='#555a63';x.lineWidth=1.4;const wx=bx+bw+w*.06;for(let q=wx;q<w;q+=110){x.beginPath();x.moveTo(q,ry);x.lineTo(q,ry-56);x.lineTo(q+10,ry-54);x.stroke()}x.strokeStyle='rgba(180,185,195,.7)';x.lineWidth=.8;x.beginPath();x.moveTo(wx,ry-47.5);x.lineTo(w,ry-47.5);x.stroke()}
  const tph=pos/ (u*1) *.9;
  x.save();x.translate(pos,ry);x.scale(u,u);x.translate(0,0);
  const loadedAmt=T.loaded?1:(DEP.job?0:0);
  loco(x,t,lm,tph/ .9,mv,dk,rev);let ox=-Lm-2;for(let i=0;i<ND;i++){x.save();x.translate(ox,0);wagon(x,wl/u,lv<2?0:lv<4?1:2,tph/.9,T.loaded||(!T.away&&DEP.stock()>0&&false),1,rev);x.restore();ox-=wl/u+2}x.restore();
  // gőz / füst
  if(!lowq&&lm<3){for(let i=0;i<6;i++){const s=((t*(mv?1.1:.45)+i/6)%1),sxp=pos-(lm===0?10:36)*u+(mv?(rev?1:-1)*40*s:8*s),spy=ry-(lm===0?38:30)*u-s*h*.2;x.fillStyle=lm===0?'rgba(235,235,240,'+.5*(1-s)+')':'rgba(70,70,76,'+.4*(1-s)+')';x.beginPath();x.arc(sxp,spy,3+s*7,0,7);x.fill()}}
  if(lm>=3&&mv&&!lowq&&Math.sin(t*37)>.6){x.fillStyle='rgba(160,210,255,.8)';x.beginPath();x.arc(pos-20*u,ry-47*u,2.2,0,7);x.fill()}
  try{if(W.DX)DX.post(x,{w,h,u,gy,ry,dk,t,lowq,T,mv,rev,pos,homeX,job,bx,bw,by,bh,sx,sy,silW,sH,Lm,ND,wl,lm,ls,lb,lv,trainL})}catch(e){DG.err='dx: '+e.message}
  if(dk>.05){x.fillStyle='rgba(6,10,30,'+(dk*.2)+')';x.fillRect(0,0,w,h)}
 }};
W.DG=DG;
// a depó nézete ezt a rajzot használja (hiba esetén az eredeti marad)
(function hook(){if(!W.DEP||!DEP.paint)return;const old=DEP.paint;DEP.paint=function(dt){try{DG.paint(dt)}catch(e){DG.err=e.message;try{old.call(DEP,dt)}catch(e2){}}}})();
})(typeof window!=='undefined'?window:globalThis);
