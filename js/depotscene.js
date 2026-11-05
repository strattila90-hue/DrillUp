// Drill Up – depó: realisztikus dízelmozdony, teherkikötő kis darukkal, vasúti jelzők,
// kattintható épületek (szintjelzők) és a korlátlan szintű fejlesztések felülete.
// Önálló modul: a depotgfx.js csak a DX.diesel / DX.post hívásokat használja (hiba esetén az eredeti rajz marad).
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('depotscene');
const NAMES={s:'Raktártelep',b:'Szállítószalag',v:'Vagonok',m:'Mozdony'},ICON={s:'🏗',b:'⚙',v:'🚃',m:'🚂'};
const rr=(x,a,b,c,d,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)};
const lg=(x,y0,y1,c0,c1,c2)=>{const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,c0);if(c2)g.addColorStop(.5,c2);g.addColorStop(1,c1);return g};
const money=v=>{try{return ft(v)}catch(e){return String(Math.round(v))+' Ft'}};
const num=v=>{try{return nf(v)}catch(e){return String(Math.round(v))}};
const vt=(k,v)=>{try{return k==='s'?fk(v):k==='v'?fk(v)+'/út':k==='b'?nf(v)+' kg/s':nf(v)+' mp/kör'}catch(e){return String(v)}};
const DX={hits:[],err:null,openK:null,t:0};

// ---------- realisztikus Co'Co' dízelmozdony (oldalnézet, orr jobbra; a talppont y=0) ----------
function wheel(x,cx,cy,r,a){
 x.fillStyle='#0f1013';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();
 x.fillStyle='#6f757e';x.beginPath();x.arc(cx,cy,r*.82,0,7);x.fill();
 x.fillStyle='#2a2d33';x.beginPath();x.arc(cx,cy,r*.62,0,7);x.fill();
 x.strokeStyle='#9aa0a8';x.lineWidth=.7;for(let i=0;i<5;i++){const q=a+i*1.2566;x.beginPath();x.moveTo(cx+Math.cos(q)*r*.18,cy+Math.sin(q)*r*.18);x.lineTo(cx+Math.cos(q)*r*.6,cy+Math.sin(q)*r*.6);x.stroke()}
 x.fillStyle='#b5bac2';x.beginPath();x.arc(cx,cy,r*.2,0,7);x.fill()}
function bogie(x,c,a){ // háromtengelyes forgóváz
 x.fillStyle='#17181c';rr(x,c-12.4,-7.6,24.8,3.6,1.2);x.fill();                        // oldalkeret
 x.fillStyle='#2b2e34';rr(x,c-11,-8.4,22,1.6,.8);x.fill();
 x.fillStyle='#33363d';for(const dx of[-7.5,0,7.5]){rr(x,c+dx-2.4,-6.2,4.8,3.1,.8);x.fill()}   // vontatómotor-házak
 x.strokeStyle='#4b4f58';x.lineWidth=.6;x.beginPath();x.moveTo(c-9,-5);x.lineTo(c+9,-5);x.stroke();
 x.strokeStyle='#6d727b';x.lineWidth=.9;for(const dx of[-9,9]){x.beginPath();x.moveTo(c+dx,-9);x.lineTo(c+dx,-6.6);x.stroke();x.beginPath();x.arc(c+dx,-8.6,1.2,0,7);x.stroke()}   // rugók
 for(const dx of[-7.5,0,7.5])wheel(x,c+dx,-3.35,3.35,a)}
DX.diesel=function(x,t,ph,mv,dk,rev,ty){
 try{
  const night=dk>.2,a=ph*.2*(rev?-1:1),run=mv||(W.DEP&&DEP.job),vib=run?Math.sin(t*38)*.18:Math.sin(t*14)*.06;
  const body=ty>=2?['#b53a2c','#6e1d15']:['#3d7a4c','#1f4a2c'],roof='#cfd4da';
  x.save();x.translate(0,vib);
  // főkeret, üzemanyagtartály, akkumulátor-szekrény, légtartályok
  x.fillStyle='#202227';x.fillRect(-61,-10.8,62,3.2);
  x.fillStyle='#15171a';rr(x,-42,-9,24,4.4,1.6);x.fill();x.fillStyle='rgba(255,255,255,.1)';x.fillRect(-41,-8.7,22,.6);
  x.fillStyle='#2b2e34';rr(x,-33,-7.6,6,2.6,.6);x.fill();
  x.fillStyle='#1a1c20';rr(x,-12,-9.4,7,3.4,.8);x.fill();rr(x,-58,-9.4,7,3.4,.8);x.fill();
  bogie(x,-45.5,a);bogie(x,-14.5,a);
  // lépcsők a fülke felé
  x.fillStyle='#8a8f98';x.fillRect(-12.5,-9.6,5.5,.8);x.fillRect(-12.5,-12.4,5.5,.8);x.fillStyle='#2a2d33';x.fillRect(-12.9,-12.4,.6,3.6);x.fillRect(-7.1,-12.4,.6,3.6);
  // hosszú motorház
  x.fillStyle=lg(x,-25,-11,body[0],body[1],ty>=2?'#c9473a':'#468a58');x.fillRect(-60,-24,47,13.4);
  x.fillStyle='rgba(255,255,255,.14)';x.fillRect(-60,-24,47,.9);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(-60,-12,47,1.4);
  // fedlap-varratok, szellőzőrácsok, szervizajtók
  x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=.45;for(const sx of[-47,-34,-21]){x.beginPath();x.moveTo(sx,-24);x.lineTo(sx,-11.6);x.stroke()}
  for(const sx of[-57,-44,-31]){x.fillStyle='rgba(0,0,0,.34)';rr(x,sx,-21.8,9,6.8,.8);x.fill();x.fillStyle='rgba(255,255,255,.1)';for(let i=0;i<6;i++)x.fillRect(sx+.8,-21.2+i*1.05,7.4,.45)}
  x.fillStyle='rgba(255,255,255,.55)';for(const sx of[-59,-46,-33,-20])x.fillRect(sx,-17.4,.8,.8);       // csavarok/szegecsek
  // sárga figyelmeztető sáv az orrán, fehér csík
  x.fillStyle='#e6b92e';x.fillRect(-60,-13.8,47,1.7);x.fillStyle='#f2f3f5';x.fillRect(-60,-15.4,47,.5);
  // tető: világos fedél, hűtőventilátorok (forgó lapátok), kipufogó
  x.fillStyle=roof;x.fillRect(-61,-26,48,2.4);x.fillStyle='#9ea4ac';x.fillRect(-61,-26,48,.6);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(-61,-23.9,48,.5);
  for(const fx of[-54,-43]){x.fillStyle='#14161a';x.beginPath();x.ellipse(fx,-26.4,4.6,1.5,0,0,7);x.fill();
   const sw=Math.sin(t*(run?30:9)+fx);x.strokeStyle='#5b616a';x.lineWidth=.9;x.beginPath();x.moveTo(fx-4*Math.abs(sw),-26.4);x.lineTo(fx+4*Math.abs(sw),-26.4);x.stroke();
   x.strokeStyle='#3a3e45';x.lineWidth=.5;x.beginPath();x.ellipse(fx,-26.4,4.6,1.5,0,0,7);x.stroke()}
  x.fillStyle='#22252a';x.fillRect(-32,-30,3.6,4);x.fillStyle='#15161a';x.fillRect(-32.8,-31.2,5.2,1.5);          // kipufogócső
  x.fillStyle='#363a41';x.fillRect(-24,-28.2,7,2.4);x.fillStyle='#4b5059';x.fillRect(-23,-29.6,5,1.4);               // motor-szellőző
  // fülke
  x.fillStyle=lg(x,-33,-11,body[0],body[1],ty>=2?'#c9473a':'#468a58');rr(x,-13,-32,14,21.4,1.2);x.fill();
  x.fillStyle=roof;rr(x,-14.4,-34.4,17,3,1);x.fill();x.fillStyle='#9ea4ac';x.fillRect(-14,-34.4,16,.6);
  x.fillStyle='#e6b92e';x.fillRect(-13,-14.2,14,1.6);
  const gl=night?'rgba(255,226,150,.78)':'rgba(176,214,244,.72)';
  x.fillStyle='#16191e';rr(x,-2.9,-29.4,5.6,10,.8);x.fill();x.fillStyle=gl;rr(x,-2.3,-28.8,4.5,8.6,.6);x.fill();   // szélvédő
  x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.moveTo(-1.8,-28.8);x.lineTo(0,-28.8);x.lineTo(-1.6,-20.2);x.lineTo(-2.3,-20.2);x.fill();
  x.fillStyle='#16191e';rr(x,-11.8,-29,8.6,8.4,.8);x.fill();x.fillStyle=gl;rr(x,-11.2,-28.4,7.4,7.2,.6);x.fill();     // oldalablak
  x.strokeStyle='#16191e';x.lineWidth=.5;x.beginPath();x.moveTo(-7.5,-28.4);x.lineTo(-7.5,-21.2);x.stroke();
  if(night){x.fillStyle='rgba(255,230,150,.25)';x.fillRect(-11.2,-28.4,7.4,7.2)}
  x.fillStyle='#1d2025';x.fillRect(-11.6,-19.4,.5,7);x.fillRect(-4.4,-19.4,.5,7);x.fillStyle='#7d838c';x.fillRect(-11.1,-17.6,.6,2.4);   // ajtó, kilincs
  x.fillStyle='#e9eaed';rr(x,-10.2,-13.2,6,2.6,.5);x.fill();x.fillStyle='#173a24';x.font='bold 2.2px sans-serif';x.fillText('M62',-9.6,-11.2);   // pályaszám-tábla
  // fogódzók a motorház mentén és a fülkén
  x.strokeStyle='#d7dbe0';x.lineWidth=.55;x.beginPath();x.moveTo(-60,-27.4);x.lineTo(-60,-24.6);x.moveTo(-60,-26.6);x.lineTo(-14,-26.6);x.stroke();
  x.beginPath();x.moveTo(-13,-24.4);x.lineTo(-13,-12);x.moveTo(1,-24.4);x.lineTo(1,-12);x.stroke();
  // homlokfal: lámpák, ütközők, kuplung, légtömlők, sárhányó
  x.fillStyle='#2e3238';x.fillRect(1,-27,1.6,15.8);x.fillStyle='#4a4f58';x.fillRect(1,-27,.5,15.8);
  x.fillStyle=night?'#fff6c4':'#e7dfae';x.beginPath();x.arc(2.2,-24,1.3,0,7);x.fill();x.beginPath();x.arc(2.2,-14.6,1.3,0,7);x.fill();
  x.fillStyle=night?'#ffb0a0':'#7b2a22';x.beginPath();x.arc(2.2,-19,.8,0,7);x.fill();
  x.fillStyle='#2a2d33';rr(x,-1,-11.4,5,2.6,.6);x.fill();x.fillStyle='#d3d6db';x.fillRect(3.2,-11.1,1.4,2);x.fillRect(-62.4,-11.1,1.4,2);   // ütközőtányér
  x.strokeStyle='#8f959e';x.lineWidth=.9;x.beginPath();x.moveTo(4.8,-9.5);x.lineTo(1.6,-9.5);x.stroke();                                 // kuplungfej
  x.strokeStyle='#c9382c';x.lineWidth=.6;x.beginPath();x.moveTo(.6,-10.4);x.quadraticCurveTo(-.6,-7.2,.8,-6.6);x.stroke();               // légtömlő
  x.fillStyle='#2a2d33';x.fillRect(-62,-10.8,1.4,4);
  // időjárás: enyhe szennyeződés a hűtőrácsok alatt, a talpkeretnél
  x.fillStyle='rgba(30,22,14,.22)';for(const sx of[-55,-42,-29])x.fillRect(sx,-15,6,3.2);x.fillStyle='rgba(0,0,0,.16)';x.fillRect(-60,-12.8,60,1);
  x.restore();
  // fényszóró-kúp éjszaka
  if(night){x.save();x.globalCompositeOperation='lighter';const g=x.createLinearGradient(2,0,78,0);g.addColorStop(0,'rgba(255,240,170,.5)');g.addColorStop(1,'rgba(255,240,170,0)');x.fillStyle=g;x.beginPath();x.moveTo(2.4,-24.4);x.lineTo(78,-33);x.lineTo(78,3);x.lineTo(2.4,-14);x.closePath();x.fill();x.restore()}
  return true
 }catch(e){DX.err='diesel: '+e.message;return false}};

// ---------- teherkikötő a sín mentén: konténerek, kis kapudaruk, targonca ----------
const CCOL=['#b8432f','#2f6aa8','#d6a21f','#3f8a54','#8a5a9a','#cf6a2a','#4d8ea0','#9aa0a8'];
function container(x,cx,y,c,dk){ // 12×6 kocka-konténer, függőleges bordákkal
 x.fillStyle=CCOL[c%CCOL.length];x.fillRect(cx,y,12,6);x.fillStyle='rgba(0,0,0,.22)';for(let i=1;i<9;i++)x.fillRect(cx+i*1.35,y+.6,.4,4.8);
 x.fillStyle='rgba(255,255,255,.18)';x.fillRect(cx,y,12,.8);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(cx,y+5.2,12,.8);x.fillStyle='#2a2d33';x.fillRect(cx,y,.8,6);x.fillRect(cx+11.2,y,.8,6)}
function gantry(x,gx,gy,H,span,tt,job,dk,lvl){ // kis kapudaru: két láb + gerenda + futómacska + konténer-megfogó
 const top=gy-H,L=gx-span/2,R=gx+span/2;
 x.strokeStyle='#d99a2a';x.lineWidth=1.6;x.beginPath();x.moveTo(L,gy);x.lineTo(L,top);x.moveTo(R,gy);x.lineTo(R,top);x.stroke();
 x.lineWidth=.6;x.strokeStyle='#a87418';for(let q=0;q<5;q++){const y0=gy-q*H/5;x.beginPath();x.moveTo(L-.8,y0);x.lineTo(L+.8,y0-H/5);x.moveTo(R-.8,y0);x.lineTo(R+.8,y0-H/5);x.stroke()}
 x.fillStyle='#e0a030';x.fillRect(L-3,top-2.4,span+6,3.2);x.fillStyle='#8a5c10';x.fillRect(L-3,top+.4,span+6,.6);
 x.fillStyle='#2a2d33';x.fillRect(L-1.8,gy-1.4,3.6,1.4);x.fillRect(R-1.8,gy-1.4,3.6,1.4);                    // kerekek
 const ph=(Math.sin(tt)+1)/2,tx=L+4+ph*(span-8),lo=job?(Math.sin(tt*.5)+1)/2:.25,hy=top+3+lo*(H-12);
 x.fillStyle='#22252a';x.fillRect(tx-3,top-3.8,6,3);x.fillStyle='#c8ccd2';x.fillRect(tx-2,top-4.6,4,1);
 x.strokeStyle='#cfd3d8';x.lineWidth=.5;x.beginPath();x.moveTo(tx-2,top+.8);x.lineTo(tx-2,hy);x.moveTo(tx+2,top+.8);x.lineTo(tx+2,hy);x.stroke();
 x.fillStyle='#20232a';x.fillRect(tx-5,hy,10,1.6);
 if(lo>.45&&job)container(x,tx-6,hy+1.6,(gx|0)+lvl,dk);
 const bk=Math.sin(tt*3)>0;x.fillStyle=bk?'#ff4a3a':'#5a1a14';x.beginPath();x.arc(L,top-3.4,1,0,7);x.fill()}
function stacks(x,x0,x1,gy,n,seed){ // konténerhalmok (1–3 magas), balról jobbra
 let i=0;for(let px=x0;px+12<=x1;px+=13.4,i++){const h=((seed+i*7)%3)+1;if(i%5===4)continue;for(let k=0;k<Math.min(h,n);k++)container(x,px,gy-6*(k+1),seed+i+k)}}
function forklift(x,fx,gy,dk,mv,t){ // kicsi homlokrakodó/konténer-targonca
 x.save();x.translate(fx,gy);x.fillStyle='#e6b92e';rr(x,-8,-8,14,5.6,1);x.fill();x.fillStyle='#2a2d33';x.fillRect(-8,-3.2,14,1.2);
 x.fillStyle='#d9a826';rr(x,-3,-13,7,5,1);x.fill();x.fillStyle=dk>.2?'rgba(255,226,150,.8)':'rgba(176,214,244,.8)';x.fillRect(-2,-12,5,3);
 x.fillStyle='#3a3d44';x.fillRect(5.6,-16,1.4,13);x.fillRect(5.6,-11+Math.sin(t*.8)*2,5,1.1);
 x.fillStyle='#14151a';for(const wx of[-4.5,3])x.beginPath(),x.arc(wx,-1.6,2.2,0,7),x.fill();x.restore()}
DX.port=function(x,E){
 const{w,h,ry,dk,t,job,lowq,ls,lv,lb}=E,gy=h-1,base=ry+9,pad=h-base;      // a sín előtti sáv
 if(pad<14)return;
 // betonozott rakodótér, burkolati jelek, kerítés
 x.fillStyle=dk>.5?'#2a2c31':'#7c7f86';x.fillRect(w*.02,base,w*.66,pad);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(w*.02,base,w*.66,1.5);
 x.fillStyle='rgba(255,214,90,.55)';for(let q=w*.03;q<w*.67;q+=18)x.fillRect(q,h-6,9,1.4);
 const n=Math.min(6,1+Math.floor(ls/2)+Math.floor(lv/2)),lvl=(ls+lv+lb);
 // hátsó sor és első sor
 stacks(x,w*.035,w*.66,h-1,n,3+lvl);
 const cranes=Math.min(3,1+(lvl>5)+(lvl>10)),spans=[w*.17,w*.12,w*.14],xs=[w*.16,w*.34,w*.52];
 for(let i=0;i<cranes;i++)gantry(x,xs[i],h-1,Math.min(pad+8,34),spans[i],t*(.35+i*.11)+i*2,job||(E.T&&E.T.away),dk,lvl+i);
 forklift(x,w*.665,h-1,dk,job,t);
 // rakodótér-lámpa
 x.fillStyle='#2a2d33';x.fillRect(w*.04,h-pad-4,1.6,pad+3);x.fillStyle=dk>.2?'#ffe9a0':'#8a9098';x.beginPath();x.arc(w*.04+.8,h-pad-4,2,0,7);x.fill();
 if(dk>.3&&!lowq){x.fillStyle='rgba(255,226,150,.14)';x.beginPath();x.moveTo(w*.04-2,h-pad-3);x.lineTo(w*.04+4,h-pad-3);x.lineTo(w*.04+30,h-1);x.lineTo(w*.04-26,h-1);x.fill()}
};

// ---------- vasúti jelzők a pálya mellett ----------
function signal(x,sx,by,col,dk,flip,t){ // 3 fényű fényjelző: piros / sárga / zöld
 x.save();x.translate(sx,by);if(flip)x.scale(-1,1);
 x.fillStyle='#2c2f35';x.fillRect(-.8,-26,1.6,26);x.fillStyle='#e8e8ea';for(let i=0;i<4;i++)if(i%2===0)x.fillRect(-.8,-26+i*6,1.6,3);   // csíkos oszlop
 x.fillStyle='#17181c';rr(x,-3.4,-34,6.8,12.6,1.6);x.fill();x.fillStyle='#4a4e57';rr(x,-3.4,-34,6.8,1,.5);x.fill();
 const on=['#ff3a2a','#ffc22a','#3fe070'],off=['#3a1612','#3a2f12','#123a1c'],idx={R:0,Y:1,G:2}[col];
 for(let i=0;i<3;i++){const act=i===idx,blink=col==='Y'&&Math.sin(t*5)>0;x.fillStyle=act&&(col!=='Y'||blink||true)?on[i]:off[i];x.beginPath();x.arc(0,-31.2+i*3.6,1.35,0,7);x.fill();
  if(act&&dk>.1){x.fillStyle=on[i]+'55';x.beginPath();x.arc(0,-31.2+i*3.6,3.8,0,7);x.fill()}}
 x.fillStyle='#d8dce2';x.fillRect(-1.6,-21.4,3.2,1.5);                       // jelzőtábla
 x.restore()}
function crossbuck(x,sx,by){x.fillStyle='#2c2f35';x.fillRect(sx-.6,by-14,1.2,14);x.strokeStyle='#e8e8ea';x.lineWidth=1.8;x.beginPath();x.moveTo(sx-5,by-19);x.lineTo(sx+5,by-12);x.moveTo(sx+5,by-19);x.lineTo(sx-5,by-12);x.stroke();x.strokeStyle='#c9382c';x.lineWidth=.9;x.stroke()}
DX.signals=function(x,E){
 const{w,ry,dk,t,T,mv,rev,bx,bw}=E,by=ry+6;
 // állapot: áll a vonat → piros; kifelé indul → zöld; visszatér → sárga (lassít)
 const st=T.f<=0&&!T.away?'R':(T.away&&!rev?'G':'Y');
 signal(x,bx+bw+w*.11,by,st,dk,false,t);
 signal(x,w*.93,by,st==='G'?'G':st==='Y'?'Y':'R',dk,true,t);
 // törpe (tolatási) jelző és váltó-lámpa a hallnál
 x.fillStyle='#2c2f35';x.fillRect(bx+bw+w*.05-.7,by-7,1.4,7);x.fillStyle='#17181c';rr(x,bx+bw+w*.05-2.6,by-12,5.2,5,1);x.fill();
 x.fillStyle=st==='R'?'#ff5a4a':'#e8eef6';x.beginPath();x.arc(bx+bw+w*.05-.9,by-9.5,1,0,7);x.arc(bx+bw+w*.05+.9,by-9.5,1,0,7);x.fill();
 // (átjáró-tábla elhagyva: takarta a mozdonyt)
 // távjelző tábla a kocsisor mögött
 x.fillStyle='#2c2f35';x.fillRect(w*.86-.5,by-12,1,12);x.fillStyle='#f1f2f4';x.beginPath();x.moveTo(w*.86-4,by-18);x.lineTo(w*.86+4,by-18);x.lineTo(w*.86,by-12);x.fill();x.strokeStyle='#d6a21f';x.lineWidth=.6;x.stroke()};

// ---------- szintjelzők (kattintható épületek) ----------
function price(k){const l=DEP.lvl(k);return DEP.pAt(k,l+1)}
function badge(x,k,cx,cy,E){
 const l=DEP.lvl(k)+1,can=DEP.gain(k)&&W.S&&S.cash>=price(k),txt='Lv '+l,pulse=can?(Math.sin(E.t*5)+1)/2:0;
 x.save();x.font='bold 9.5px sans-serif';const tw=x.measureText(txt).width+(can?12:6),bw2=tw+10,bh2=15;
 x.translate(cx,cy);
 x.fillStyle='rgba(12,14,18,.82)';rr(x,-bw2/2,-bh2/2,bw2,bh2,7.5);x.fill();
 x.strokeStyle=can?'rgba(110,235,140,'+(.55+.4*pulse)+')':'rgba(255,214,120,.7)';x.lineWidth=1.2;x.stroke();
 x.fillStyle=can?'#8ff0a8':'#ffe3a0';x.textBaseline='middle';x.textAlign='left';x.fillText(txt,-bw2/2+5,.5);
 if(can){x.fillStyle='#6eeb8c';const ax=bw2/2-9;x.beginPath();x.moveTo(ax,-4.2-pulse);x.lineTo(ax+4,.4-pulse);x.lineTo(ax-4,.4-pulse);x.fill();x.fillRect(ax-1.2,.4-pulse,2.4,3.6)}
 x.restore();
 DX.hits.push({k,x:cx-Math.max(bw2/2,22),y:cy-Math.max(bh2/2,16),w:Math.max(bw2,44),h:Math.max(bh2,32),z:2})}
DX.post=function(x,E){
 DX.t=E.t;DX.hits.length=0;
 DX.port(x,E);DX.signals(x,E);
 // kattintható területek: szilók, szalag/csarnok, mozdony, kocsik, kikötő
 const{u,ry,pos,Lm,ND,wl,sx,sy,silW,sH,bx,bw,by,bh,h,w}=E;
 DX.hits.push({k:'s',x:sx-6,y:sy,w:silW+12,h:sH,z:0},{k:'b',x:bx,y:by-8,w:bw,h:bh+8,z:0},
  {k:'m',x:pos-Lm*u,y:ry-44*u,w:Lm*u,h:46*u,z:0},{k:'v',x:pos-(Lm+ND*(wl+2))*u,y:ry-30*u,w:ND*(wl+2)*u-2,h:32*u,z:0},{k:'v',x:w*.02,y:ry+9,w:w*.66,h:h-ry-9,z:0});
 badge(x,'s',sx+silW/2,Math.max(10,sy-9),E);
 badge(x,'b',bx+bw/2,Math.max(10,by-18),E);
 badge(x,'m',pos-Lm*u*.45,ry-48*u,E);
 badge(x,'v',Math.max(26,pos-(Lm+ND*(wl+2)*.55)*u),ry-34*u,E);
};
DX.hit=function(px,py){let best=null;for(const r of DX.hits){if(px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h&&(!best||r.z>best.z))best=r}return best&&best.k};
// koppintás a vászonra
document.addEventListener('click',e=>{const c=e.target;if(!c||c.id!=='dpc')return;const r=c.getBoundingClientRect(),k=DX.hit(e.clientX-r.left,e.clientY-r.top);if(k)DX.open(k)},false);

// ---------- fejlesztő felület: látható csempesor + előugró ablak ----------
function tile(k){const l=DEP.lvl(k),B=DEP.BLD[k],p=price(k),can=DEP.gain(k),ok=can&&S.cash>=p;
 return`<button class="upT${ok?' ok':''}" onclick="DX.open('${k}')"><span class="ic">${ICON[k]}</span><b>${NAMES[k]}</b><i>Lv ${l+1}</i><span class="vv">${vt(k,DEP.vAt(k,l))}</span><span class="pp">${can?(ok?'⬆ ':'')+money(p):'maximum'}</span></button>`}
DX.strip=function(){try{return`<div class="upS" id="upS">${['s','b','v','m'].map(tile).join('')}</div>`}catch(e){return''}};
function modal(k){
 const l=DEP.lvl(k),B=DEP.BLD[k],can=DEP.gain(k),p=price(k),ok=can&&S.cash>=p,atBase=typeof base==='function'?base():true;
 let pre='';for(let i=1;i<=3;i++){const n=l+i;if(n>=999)break;pre+=`<div class="upR"><span>Lv ${n+1}</span><b>${vt(k,DEP.vAt(k,n))}</b><span>${money(DEP.pAt(k,n))}</span></div>`}
 return`<div class="upBox"><button class="upX" onclick="DX.close()">✕</button><div class="upH">${ICON[k]} <b>${NAMES[k]}</b> <u>Lv ${l+1}</u></div><div class="mu">${B.d}</div>
 <div class="upV"><div><small>Most</small><b>${vt(k,DEP.vAt(k,l))}</b></div><div class="arr">➜</div><div class="nx"><small>Lv ${l+2}</small><b>${can?vt(k,DEP.vAt(k,l+1)):'–'}</b></div></div>
 <div class="mu">Ár: <b>${can?money(p):'–'}</b> · pénzed: ${money(S.cash)}</div>
 <div class="row"><button class="b" ${ok&&atBase?'':'disabled'} onclick="DEP.upgrade('${k}')">⬆ +1 szint</button><button class="b g" ${ok&&atBase?'':'disabled'} onclick="DEP.upgradeMax('${k}',100)">⬆⬆ Amennyire telik</button></div>
 ${!atBase?'<div class="mu bad">Fejleszteni csak a bázison lehet (🏠).</div>':!can?'<div class="mu">Ennél magasabb szinten már nincs további hatás.</div>':ok?'':'<div class="mu bad">Nincs elég pénzed a következő szinthez.</div>'}
 ${pre?`<div class="upP"><small>Következő szintek</small>${pre}</div>`:''}</div>`}
const byId=id=>{try{return document.getElementById?document.getElementById(id):document.querySelector('#'+id)}catch(e){return null}};
DX.open=function(k){if(!DEP.BLD[k])return;DX.openK=k;try{let m=byId('upM');if(!m&&document.createElement){m=document.createElement('div');m.id='upM';m.className='upM';if(m.addEventListener)m.addEventListener('click',e=>{if(e.target===m)DX.close()});document.body.appendChild(m)}if(m){m.innerHTML=modal(k);m.style.display='flex'}}catch(e){DX.err='open: '+e.message}};
DX.close=function(){DX.openK=null;try{const m=byId('upM');if(m)m.style.display='none'}catch(e){}};
DX.refresh=function(){try{if(DX.openK){const m=byId('upM');if(m&&m.style.display!=='none')m.innerHTML=modal(DX.openK)}const s=byId('upS');if(s)s.outerHTML=DX.strip()}catch(e){}};
W.DX=DX;
})(typeof window!=='undefined'?window:globalThis);
