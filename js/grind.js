/* Drill Up – élethű kőzetbontás a fúrófej előtt (a régi „lebegő sokszög” front helyett).
   • A fej kúpos kontúrja mentén vékony, sötét zúzott sáv; benne apró, árnyalt kőzetszemcsék, amelyek a vágóélek
     forgásával a fej oldala felé, majd a fal mentén hátrafelé áramlanak (ahogy a fúrási iszap/forgács távozik).
   • A fej előtti ép kőzetben hajszálrepedések nőnek, kisebb lapok pattannak le (spalling), és beleesnek az áramba.
   • Rétegszínű por gomolyog a fej két oldalán.
   • Súrlódási izzás a vágóéleken (hő szerint), kemény kőzetben / túlhevülésnél ívelt, izzó szikrák a vágóélekről.
   Minden determinisztikus (idő + hash), nincs új részecske-állapot, így nem villog és nem lassul. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('grind');
const h=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const rgb=c=>{if(typeof c!=='string'||c[0]!=='#'||c.length<7)return[150,130,105];return[1,3,5].map(k=>parseInt(c.substr(k,2),16))};
const sh=(c,f)=>{const[r,g,b]=c;return f<0?`rgb(${r*(1+f)|0},${g*(1+f)|0},${b*(1+f)|0})`:`rgb(${r+(255-r)*f|0},${g+(255-g)*f|0},${b+(255-b)*f|0})`};
// a fúrófej elülső kontúrja (gép-lokális méter): s∈[-1,1] a két oldal között, s=0 a csúcs
const HX=.62,BX=-1.55,BY=1.9;
function cont(s){const a=Math.min(1,Math.abs(s)),sg=s<0?-1:1;
 if(Math.abs(s)<=1){const x=BX+(HX-BX)*(1-Math.pow(a,1.25)),y=sg*BY*a;const dx=-(HX-BX)*1.25*Math.pow(Math.max(a,.02),.25),dy=BY;let nx=dy,ny=-sg*dx;const l=Math.hypot(nx,ny)||1;return[x,y,nx/l,ny/l]}
 // a fej mögött: a fal mentén hátra
 const e=Math.abs(s)-1;return[BX-e*3.2,sg*BY,0,sg]}
const DUST=new Map();
function puff(col){let c=DUST.get(col);if(c)return c;if(typeof document==='undefined')return null;c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');if(!g)return null;
 const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,`rgba(${col},.55)`);r.addColorStop(.5,`rgba(${col},.22)`);r.addColorStop(1,`rgba(${col},0)`);g.fillStyle=r;g.fillRect(0,0,64,64);if(DUST.size>16)DUST.clear();DUST.set(col,c);return c}
const GRD={st:0,
 on(){return true},
 // V.grd (opcionális, pl. a főmenü jelenete): {hard,heat,rt,col,so} – ekkor a játékállapottól függetlenül rajzol
 world(V){const F=V.grd;if(!V.dr||!V.lw||!(F||(W.FACE&&FACE.active())))return;const x=V.x,K=V.K||10,T=(V.ts||0)/1e3,q=W.Gov?Gov.q:2;
  const hard=F?F.hard:FACE.hard(),heat=F?F.heat:typeof HEAT!=='undefined'?cl(HEAT,0,1.3):0,rt=F?F.rt:cl((typeof rate!=='undefined'?rate:8)/14,0,1),stall=!F&&typeof STALL!=='undefined'&&Date.now()-STALL<500;
  const L=F?null:typeof layer==='function'?layer(S.depth):null,base=rgb(F?F.col:L?L[4]:'#8a7558');
  const so=F?(F.so||0):GRD.st||0,P=(a,b)=>V.lw(a+so,b),px=Math.max(.6,K/30);
  x.save();x.lineCap='round';x.lineJoin='round';
  // 1) zúzott sáv a kontúr előtt (sötét, szemcsés „kerf”)
  {x.beginPath();const n=24;for(let i=0;i<=n;i++){const s=-1+2*i/n,[a,b,nx,ny]=cont(s),bw=.38+.4*(1-Math.min(1,Math.abs(s)))*(1+.08*Math.sin(T*5+i)),p=P(a+nx*bw,b+ny*bw);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}
   for(let i=n;i>=0;i--){const s=-1+2*i/n,[a,b]=cont(s),p=P(a,b);x.lineTo(p[0],p[1])}x.closePath();x.fillStyle=`rgba(${base[0]*.25|0},${base[1]*.22|0},${base[2]*.2|0},.62)`;x.fill()}
  // 2) hajszálrepedések az ép kőzetben
  const NC=[4,7,10][q]||7;x.lineWidth=Math.max(1,K*.025);
  for(let i=0;i<NC;i++){const per=2.2+h(i)*2,cy=Math.floor(T/per+h(i+3)),ph=(T/per+h(i+3))%1,sd=i*91+cy*17,s0=(h(sd)-.5)*1.7,[a,b,nx,ny]=cont(s0),len=(.5+h(sd+1)*1.1)*(.6+hard*.9)*Math.min(1,ph*2.2),al=ph<.8?.7:.7*(1-(ph-.8)/.2);
   let ca=a+nx*.4,cb=b+ny*.4,dx=nx,dy=ny;const pts=[P(ca,cb)];for(let j=1;j<=5;j++){const tw=(h(sd+j*7)-.5)*1.1;const c=Math.cos(tw),sn=Math.sin(tw);[dx,dy]=[dx*c-dy*sn,dx*sn+dy*c];ca+=dx*len/5;cb+=dy*len/5;pts.push(P(ca,cb))}
   x.strokeStyle=`rgba(12,8,5,${al.toFixed(3)})`;x.beginPath();pts.forEach((p,k)=>k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
   x.strokeStyle=`rgba(255,238,210,${(al*.18).toFixed(3)})`;x.beginPath();pts.forEach((p,k)=>k?x.lineTo(p[0]+px,p[1]+px):x.moveTo(p[0]+px,p[1]+px));x.stroke()}
  // 3) leváló kőzetlapok (spalling): a fej előtt kipattannak, majd beesnek az áramba
  const NS=[3,6,9][q]||6;for(let i=0;i<NS;i++){const per=1.6+h(i+40)*1.4,ph=(T/per+h(i+41))%1,cy=Math.floor(T/per+h(i+41)),sd=i*53+cy*29,s0=(h(sd)-.5)*1.6,sg=s0<0?-1:1;
   const s=ph<.3?s0:s0+sg*(ph-.3)/.7*(1.35-Math.abs(s0)+.8),[a,b,nx,ny]=cont(s),d=ph<.3?.42+ph*.25:.5-(ph-.3)*.4,p=P(a+nx*d,b+ny*d),z=(.09+h(sd+2)*.16)*K,rot=h(sd+3)*6.28+ph*(3+h(sd+4)*6)*sg;
   x.globalAlpha=ph>.85?(1-ph)/.15:1;stone(x,p[0],p[1],Math.max(1.6,z),sd,base,rot)}
  x.globalAlpha=1;
  // 4) a vágóélek által elhordott forgács: apró, árnyalt szemcsék, a csúcstól oldalra, majd a fal mentén hátra
  const NG=[45,95,150][q]||95,spd=.35+rt*1.1+(stall?0:0);
  for(let i=0;i<NG;i++){const ph=(T*spd*(.7+h(i)*.6)+h(i+1))%1,sg=h(i+2)<.5?-1:1,s0=h(i+3)*.35,s=sg*(s0+ph*(1.9-s0)),[a,b,nx,ny]=cont(s),d=.04+h(i+4)*(.3+.38*(1-Math.min(1,Math.abs(s))))+Math.sin(T*7+i)*.015,p=P(a+nx*d,b+ny*d),r=Math.max(.7,(.025+h(i+5)*h(i+6)*.09)*K),f=h(i+7);
   x.globalAlpha=ph>.9?(1-ph)*10:1;x.fillStyle=sh(base,f<.35?-.55:f<.7?-.25:.18);
   if(r<1.3){x.fillRect(p[0]-r,p[1]-r,r*2,r*2);if(r>1.1){x.fillStyle='rgba(255,245,225,.35)';x.fillRect(p[0]-r,p[1]-r,r,r*.8)}}
   else{x.beginPath();x.arc(p[0],p[1],r,0,6.283);x.fill();x.fillStyle='rgba(255,245,225,.3)';x.beginPath();x.arc(p[0]-r*.35,p[1]-r*.35,r*.45,0,6.283);x.fill();x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.arc(p[0]+r*.3,p[1]+r*.35,r*.5,0,6.283);x.fill()}}
  x.globalAlpha=1;
  // 5) por a fej két oldalán (előre renderelt, rétegszínű folt)
  {const lt=GRD.lt||0;GRD.lt=V.ts;GRD.ph=((GRD.ph||0)+(lt?cl((V.ts-lt)/1e3,0,.1):0)*(.35+rt*.3))%1}const GPH=GRD.ph;
  if(q>0){const pc=puff(`${Math.min(255,base[0]+40)},${Math.min(255,base[1]+34)},${Math.min(255,base[2]+28)}`);if(pc){for(let i=0;i<6;i++){const ph=(GPH+i/6)%1,sg=i%2?1:-1,[a,b,nx,ny]=cont(sg*(.7+ph*1.3)),d=.3+ph*.9,p=P(a+nx*d,b+ny*d),r=(.6+ph*1.6)*K;x.globalAlpha=(.55*(1-ph)*(.4+rt*.6));x.drawImage(pc,p[0]-r,p[1]-r,r*2,r*2)}x.globalAlpha=1}}
  // 6) súrlódási izzás a vágóéleken + szikrák (additív)
  const glow=cl((heat-.3)/.8,0,1),spk=cl(Math.max(hard*1.4-.2,glow*1.2,stall?1:0),0,1)*(.4+rt*.6);
  x.globalCompositeOperation='lighter';
  if(glow>0){x.beginPath();const n=20;for(let i=0;i<=n;i++){const s=-.95+1.9*i/n,[a,b,nx,ny]=cont(s),p=P(a+nx*.06,b+ny*.06);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}
   const fl=.8+.2*Math.sin(T*31)*Math.sin(T*17);x.strokeStyle=`rgba(255,${70+glow*90|0},20,${(.35*glow*fl).toFixed(3)})`;x.lineWidth=Math.max(2,K*.22);x.stroke();x.strokeStyle=`rgba(255,${170+glow*70|0},${60+glow*90|0},${(.55*glow*fl).toFixed(3)})`;x.lineWidth=Math.max(1,K*.06);x.stroke()}
  if(spk>.05){const NSP=Math.round(([8,16,26][q]||16)*spk),g=9.5*K;
   for(let i=0;i<NSP;i++){const per=.32+h(i+70)*.35,ph=(T/per+h(i+71))%1,cy=Math.floor(T/per+h(i+71)),sd=i*37+cy*13,s0=(h(sd)-.5)*1.8,sg=s0<0?-1:1,[a,b,nx,ny]=cont(s0);
    // kirepülés: a vágóél érintője mentén, oldalra-hátra, kis szórással
    const tx=-ny*sg,ty=nx*sg,mix2=.55+h(sd+1)*.4,dx=nx*(1-mix2)+(-nx*.2+tx)*mix2,dy=ny*(1-mix2)+(-ny*.2+ty)*mix2,o=P(a+nx*.05,b+ny*.05),o2=P(a+nx*.05+dx,b+ny*.05+dy),vx=(o2[0]-o[0]),vy=(o2[1]-o[1]),sp=(4+h(sd+2)*7),t=ph*per*1.6,t0=Math.max(0,t-.035);
    const X=u=>o[0]+vx*sp*u,Y=u=>o[1]+vy*sp*u+.5*g*u*u,al=(1-ph)*(1-ph);
    x.strokeStyle=`rgba(255,${110+h(sd+3)*60|0},25,${(.35*al).toFixed(3)})`;x.lineWidth=Math.max(2,K*.07);x.beginPath();x.moveTo(X(t0),Y(t0));x.lineTo(X(t),Y(t));x.stroke();
    x.strokeStyle=`rgba(255,${235-ph*80|0},${170-ph*110|0},${al.toFixed(3)})`;x.lineWidth=Math.max(.8,K*.025);x.beginPath();x.moveTo(X(t0),Y(t0));x.lineTo(X(t),Y(t));x.stroke()}}
  x.globalCompositeOperation='source-over';x.restore()}};
// árnyalt, szögletes kőzetdarab (fény balról-felülről)
function stone(x,cx,cy,z,sd,base,rot){const n=5+(h(sd+9)*3|0),pts=[];for(let i=0;i<n;i++){const a=rot+(i+h(sd+i*3)*.5)/n*6.283,r=z*(.65+h(sd+i*5+1)*.5);pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r*.82])}
 x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=sh(base,-.3+h(sd+11)*.35);x.fill();
 x.save();x.clip();x.fillStyle='rgba(0,0,0,.38)';x.beginPath();x.arc(cx+z*.45,cy+z*.5,z*.95,0,6.283);x.fill();x.fillStyle='rgba(255,246,228,.28)';x.beginPath();x.arc(cx-z*.55,cy-z*.55,z*.6,0,6.283);x.fill();x.restore();
 x.strokeStyle='rgba(10,7,4,.75)';x.lineWidth=Math.max(.8,z*.12);x.stroke()}
GRD.stone=stone;
W.GRD=GRD;
if(W.on)on('world.front',V=>{try{GRD.world(V)}catch(e){if(W.DBG)DBG.err='grind: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
