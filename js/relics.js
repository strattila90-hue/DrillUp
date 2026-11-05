/* Drill Up – Filmes relikviák és a Dicsőségfal.
   Fúrás közben (ritkán, a megfelelő mélységtartományban) kitalált filmek rekvizitumai kerülnek elő a földből: időgép-kupé, óraműves automata,
   teherűrhajó, segéd-drón, sugárpisztoly, drágaköves bálvány, sárkánykard, némafilm-kamera, űrsisak, kristálytojás, filmtekercs – és egy óriás ragadozó dinoszaurusz-koponya.
   • A relikviák SAJÁT tervezésű, kitalált filmekből valók (a nevek és a formák eredetiek, nem utalnak létező filmes tárgyakra); a leletek egyediek.
   • Egy relikvia csak egyszer kerül elő; a Tudás fülön a Dicsőségfalra kerül, a gyűjtési mérföldkövekért (3/6/9/12) jutalom jár.
   • Mentés: S.rel = {id: időbélyeg}. Az ismeretlen kulcsokat a betöltés megtartja; hibás értékeket itt szűrjük. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('relics');
const CW=240,CH=170,PI2=Math.PI*2;
const LG=(x,a,b,c,d,st)=>{const g=x.createLinearGradient(a,b,c,d);for(const[o,k]of st)g.addColorStop(o,k);return g};
const RG=(x,cx,cy,r0,r1,st)=>{const g=x.createRadialGradient(cx,cy,r0,cx,cy,r1);for(const[o,k]of st)g.addColorStop(o,k);return g};
const P=(x,pts,fill,stroke,lw)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1;x.stroke()}};
const C=(x,cx,cy,r,fill,stroke,lw)=>{x.beginPath();x.arc(cx,cy,r,0,PI2);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1;x.stroke()}};
const E=(x,cx,cy,rx,ry,fill,stroke,lw,rot)=>{x.beginPath();x.ellipse(cx,cy,rx,ry,rot||0,0,PI2);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1;x.stroke()}};
const rv=(x,cx,cy,r)=>{C(x,cx,cy,r,RG(x,cx-r*.3,cy-r*.3,0,r*1.2,[[0,'#fff'],[1,'#555']]))};
const shadow=(x,cx,cy,rx,ry)=>E(x,cx,cy,rx,ry,RG(x,cx,cy,0,rx,[[0,'rgba(0,0,0,.55)'],[1,'rgba(0,0,0,0)']]));
const gear=(x,cx,cy,r,n,fill,hole)=>{x.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*PI2,rr=i%2?r*.82:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath();x.fillStyle=fill;x.fill();x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=1;x.stroke();C(x,cx,cy,r*.5,'rgba(0,0,0,.25)');C(x,cx,cy,hole||r*.22,'#2a1d10')};
let sd=7;const rnd=()=>(sd=(sd*1664525+1013904223)>>>0)/4294967296;
// háttér: múzeumi spotlámpa
const bg=(x,c1,c2)=>{x.fillStyle=RG(x,CW/2,CH*.42,6,CW*.72,[[0,c1||'#3a3128'],[1,c2||'#0e0b08']]);x.fillRect(0,0,CW,CH);x.fillStyle='rgba(255,255,255,.04)';x.fillRect(0,CH-26,CW,26);x.fillStyle=LG(x,0,CH-26,0,CH,[[0,'rgba(255,255,255,.08)'],[1,'rgba(0,0,0,.35)']]);x.fillRect(0,CH-26,CW,26)};
const rock=(x,y0,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,CH);let px=0;x.lineTo(0,y0);while(px<CW){px+=8+rnd()*12;x.lineTo(px,y0+(rnd()-.5)*10)}x.lineTo(CW,CH);x.closePath();x.fill();for(let i=0;i<60;i++){x.fillStyle=`rgba(${rnd()>.5?'255,255,255':'0,0,0'},${.04+rnd()*.07})`;x.fillRect(rnd()*CW,y0+rnd()*(CH-y0),2+rnd()*10,1+rnd()*2)}};
const D={
 // 1) Időgép-kupé (retro-futurista, kerekített hatvanas sportkocsi sárgaréz „kronogyűrűvel” a tetején)
 kupe(x){bg(x,'#2a3a40');shadow(x,122,146,100,9);
  const body=LG(x,0,62,0,126,[[0,'#7fd8d0'],[.45,'#2b9a9a'],[1,'#0f4f56']]);
  x.beginPath();x.moveTo(24,122);x.bezierCurveTo(22,106,36,100,62,98);x.lineTo(90,80);x.bezierCurveTo(102,70,114,66,130,66);x.lineTo(160,66);x.bezierCurveTo(176,66,188,78,198,94);x.lineTo(208,100);x.bezierCurveTo(218,102,222,110,222,120);x.lineTo(222,128);x.lineTo(24,128);x.closePath();x.fillStyle=body;x.fill();x.strokeStyle='#08282c';x.lineWidth=1.4;x.stroke();
  x.fillStyle=LG(x,0,96,0,128,[[0,'#f2e8c8'],[1,'#b9a46a']]);x.fillRect(26,110,194,4);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(36,104,150,1.6);
  x.beginPath();x.moveTo(96,95);x.lineTo(108,78);x.bezierCurveTo(113,73,119,71,126,71);x.lineTo(150,71);x.lineTo(152,95);x.closePath();x.fillStyle=LG(x,0,70,0,96,[[0,'#bfe9ff'],[1,'#3a6a86']]);x.fill();x.stroke();
  x.beginPath();x.moveTo(156,71);x.lineTo(162,71);x.bezierCurveTo(171,75,180,86,186,95);x.lineTo(156,95);x.closePath();x.fillStyle=LG(x,0,70,0,96,[[0,'#bfe9ff'],[1,'#3a6a86']]);x.fill();x.stroke();
  x.strokeStyle='#08282c';x.lineWidth=1;x.beginPath();x.moveTo(154,71);x.lineTo(154,112);x.moveTo(106,98);x.lineTo(106,118);x.stroke();x.fillStyle='#e8d8a0';x.fillRect(132,99,12,3);
  // kronogyűrű a tetőn
  for(const px of[116,146]){x.fillStyle='#a07a28';x.fillRect(px-1.5,52,3,16)}
  E(x,131,52,30,8,null,'#d9b24a',3.2);E(x,131,52,30,8,null,'#fff3b8',1);x.save();x.globalCompositeOperation='lighter';C(x,131,50,16,RG(x,131,50,0,16,[[0,'rgba(120,230,255,.95)'],[1,'rgba(120,230,255,0)']]));x.restore();E(x,131,50,6,2.5,'#e8fbff');
  // kerekek
  for(const[wx,wy]of[[62,128],[180,128]]){C(x,wx,wy,19,'#111');C(x,wx,wy,19,null,'#2a2a2a',3);C(x,wx,wy,13,LG(x,wx-12,wy-12,wx+12,wy+12,[[0,'#fff'],[.5,'#9aa0a6'],[1,'#50565c']]),'#222',1);for(let i=0;i<6;i++){const a=i/6*PI2;x.strokeStyle='#30363a';x.lineWidth=2;x.beginPath();x.moveTo(wx,wy);x.lineTo(wx+Math.cos(a)*12,wy+Math.sin(a)*12);x.stroke()}C(x,wx,wy,3.5,'#d9b24a','#222')}
  x.save();x.globalCompositeOperation='lighter';C(x,218,108,10,RG(x,218,108,0,10,[[0,'rgba(255,240,180,1)'],[1,'rgba(255,240,180,0)']]));x.restore();E(x,217,108,3.4,5,'#fff6c8');
  P(x,[[24,116],[18,112],[18,124],[24,126]],'#d9b24a','#6b5518',1)},
 // 2) Óriás ragadozó dinoszaurusz-koponya (valódi állat, kőzetbe ágyazva)
 koponya(x){bg(x,'#4a4033');rock(x,128,'#6b5b46');
  const bone=LG(x,0,40,0,130,[[0,'#f3ead2'],[.6,'#d0bf98'],[1,'#8f7d58']]);
  x.beginPath();x.moveTo(24,98);x.bezierCurveTo(30,70,70,50,112,44);x.bezierCurveTo(150,38,190,44,214,60);x.bezierCurveTo(222,68,220,84,208,92);x.lineTo(196,100);x.lineTo(176,102);x.lineTo(60,112);x.bezierCurveTo(42,114,28,108,24,98);x.closePath();x.fillStyle=bone;x.fill();x.strokeStyle='#5a4a30';x.lineWidth=1.6;x.stroke();
  // állkapocs
  x.beginPath();x.moveTo(34,110);x.lineTo(176,108);x.bezierCurveTo(196,108,206,114,214,124);x.bezierCurveTo(190,134,120,136,64,128);x.bezierCurveTo(44,126,34,120,34,110);x.closePath();x.fillStyle=LG(x,0,106,0,136,[[0,'#e4d6b4'],[1,'#8f7d58']]);x.fill();x.stroke();
  // fogak
  for(let i=0;i<11;i++){const px=36+i*13.5,h=8+Math.sin(i*.9)*2.5;P(x,[[px,102],[px+10,102],[px+6,102+h+ (i<3?3:0)]],'#fbf6e6','#6b5a3a',.8)}
  for(let i=0;i<10;i++){const px=46+i*14.5;P(x,[[px,109],[px+8,109],[px+4,102-4]],'#f6f0dc','#6b5a3a',.7)}
  // koponyaablakok, szemüreg
  E(x,160,62,17,13,'#1a140c','#4a3a22',2,-.15);E(x,160,62,17,13,null,'rgba(255,255,255,.1)',1,-.15);E(x,100,70,22,11,'#2a2014','#5a4a30',1.6,-.1);E(x,50,84,3,2,'#2a2014');E(x,196,70,6,13,'#2a2014','#5a4a30',1.4,.3);
  x.strokeStyle='rgba(90,70,40,.5)';x.lineWidth=1;for(let i=0;i<14;i++){x.beginPath();const sx=60+rnd()*140,sy=52+rnd()*40;x.moveTo(sx,sy);x.lineTo(sx+rnd()*14-7,sy+rnd()*10);x.stroke()}
  x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.ellipse(110,52,60,4,-.06,0,PI2);x.fill()},
 // 3) Óraműves automata feje (sárgaréz fej, porcelán arc, fogaskerekes fülek)
 automata(x){bg(x,'#3b2f22');shadow(x,120,152,70,8);
  // nyakrugó
  for(let i=0;i<7;i++)E(x,120,128+i*3.6,24-i*.3,5,null,'#7a5a22',2);
  x.fillStyle=LG(x,90,0,150,0,[[0,'#6b4a1c'],[.5,'#d7b25c'],[1,'#6b4a1c']]);x.fillRect(96,122,48,10);
  // fej
  E(x,120,72,54,60,LG(x,60,20,180,130,[[0,'#f0d68a'],[.4,'#b98d3a'],[1,'#5c3f14']]),'#3a2810',2);
  E(x,120,76,40,48,LG(x,90,40,150,120,[[0,'#fffaf0'],[1,'#d9d0bc']]),'#8a7a5a',1.5);
  x.strokeStyle='rgba(90,70,40,.5)';x.lineWidth=.7;x.beginPath();x.moveTo(108,40);x.lineTo(114,56);x.lineTo(108,70);x.moveTo(140,60);x.lineTo(132,74);x.stroke();
  // szemek
  for(const sx of[104,136]){E(x,sx,66,9,7,'#f8f0dc','#5a4a30',1);C(x,sx,66,5.2,RG(x,sx-1,65,0,5.5,[[0,'#ffd36a'],[.6,'#c27a10'],[1,'#5a3205']]));C(x,sx,66,2,'#140a02');C(x,sx-1.6,64.4,1.1,'#fff')}
  x.strokeStyle='#4a2f14';x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(94,54);x.quadraticCurveTo(104,49,113,54);x.moveTo(127,54);x.quadraticCurveTo(136,48,146,53);x.stroke();
  P(x,[[119,70],[114,86],[126,86]],'#e8dcc4','#8a7a5a',.8);
  // szájrés és állkapocsléc
  x.fillStyle='#2a1a0c';x.fillRect(102,96,36,8);x.strokeStyle='#8a7a5a';x.lineWidth=.8;for(let i=0;i<7;i++){x.beginPath();x.moveTo(105+i*5,96);x.lineTo(105+i*5,104);x.stroke()}
  // fülek: fogaskerekek, tetőn felhúzókulcs
  gear(x,66,78,15,10,LG(x,50,60,82,96,[[0,'#f2d68a'],[1,'#7a5420']]),4);gear(x,174,78,15,10,LG(x,160,60,190,96,[[0,'#f2d68a'],[1,'#7a5420']]),4);gear(x,150,26,9,8,'#c79a42',3);
  x.fillStyle='#8a5e22';x.fillRect(118,6,4,16);x.beginPath();x.ellipse(120,6,14,5,0,0,PI2);x.fillStyle=LG(x,106,0,134,0,[[0,'#6b4a1c'],[.5,'#e6c36e'],[1,'#6b4a1c']]);x.fill();x.strokeStyle='#3a2810';x.stroke();
  for(const[rx,ry]of[[80,40],[160,40],[72,100],[168,100],[92,24],[148,26]])rv(x,rx,ry,2.1)},
 // 4) Teherűrhajó (hosszú gerinc, konténerek, két hajtómű, kinyúló pilótafülke)
 hajo(x){bg(x,'#1c2230','#05070c');for(let i=0;i<40;i++){x.fillStyle=`rgba(255,255,255,${.2+rnd()*.6})`;x.fillRect(rnd()*CW,rnd()*CH*.8,1,1)}
  shadow(x,120,152,90,6);
  // gerinc
  x.fillStyle=LG(x,0,80,0,104,[[0,'#8d95a0'],[1,'#3a414b']]);x.fillRect(40,82,150,16);x.strokeStyle='#14181e';x.lineWidth=1;x.strokeRect(40,82,150,16);
  // konténerek
  const cc=['#b5482e','#c9a23c','#3d7aa8','#6a8f4a','#9a5a8c','#d4cfc4'];for(let i=0;i<5;i++){const cx=48+i*28,cy=56;x.fillStyle=LG(x,cx,cy,cx,cy+26,[[0,cc[i]],[1,'rgba(0,0,0,.55)']]);x.fillRect(cx,cy,25,26);x.strokeStyle='rgba(0,0,0,.6)';x.strokeRect(cx,cy,25,26);x.strokeStyle='rgba(0,0,0,.3)';for(let j=1;j<5;j++){x.beginPath();x.moveTo(cx+j*5,cy+1);x.lineTo(cx+j*5,cy+25);x.stroke()}x.fillStyle='rgba(255,255,255,.25)';x.fillRect(cx+2,cy+2,21,2)}
  for(let i=0;i<4;i++){const cx=62+i*28,cy=106;x.fillStyle=LG(x,cx,cy,cx,cy+20,[[0,cc[(i+2)%6]],[1,'rgba(0,0,0,.6)']]);x.fillRect(cx,cy,25,20);x.strokeStyle='rgba(0,0,0,.6)';x.strokeRect(cx,cy,25,20)}
  // pilótafülke a gém végén
  x.fillStyle='#5b6470';x.fillRect(190,86,24,6);x.beginPath();x.moveTo(212,74);x.lineTo(236,86);x.lineTo(212,104);x.closePath();x.fillStyle=LG(x,212,74,236,104,[[0,'#b8c0cc'],[1,'#4a525e']]);x.fill();x.stroke();P(x,[[218,82],[230,87],[218,93]],LG(x,218,82,230,93,[[0,'#ffe9a8'],[1,'#c97a1a']]),'#222',.8);
  // hajtóművek
  for(const ey of[64,112]){x.fillStyle=LG(x,0,ey,0,ey+22,[[0,'#7d8692'],[1,'#2e343c']]);x.fillRect(14,ey,34,22);x.strokeStyle='#14181e';x.strokeRect(14,ey,34,22);x.fillStyle='#14181e';x.fillRect(10,ey+3,6,16);x.save();x.globalCompositeOperation='lighter';x.fillStyle=LG(x,10,0,-24,0,[[0,'rgba(120,200,255,.95)'],[1,'rgba(120,200,255,0)']]);x.beginPath();x.moveTo(10,ey+4);x.lineTo(-26,ey+11);x.lineTo(10,ey+18);x.fill();x.restore();x.strokeStyle='#14181e';x.beginPath();x.moveTo(30,ey+22);x.lineTo(44,98-(ey<90?0:-0));x.stroke()}
  x.font='bold 8px Georgia';x.fillStyle='#d4cfc4';x.fillText('VK-7',120,95);x.fillStyle='#e8b84a';C(x,198,96,1.6,'#e8b84a')},
 // 5) Segéd-drón „Pötty” (gömb test, nagy objektív, lebegő hajtómű)
 dron(x){bg(x,'#2e3a3a');shadow(x,120,150,40,5);
  x.save();x.globalCompositeOperation='lighter';x.fillStyle=RG(x,120,138,0,40,[[0,'rgba(120,220,255,.6)'],[1,'rgba(120,220,255,0)']]);x.fillRect(70,100,100,70);x.restore();
  E(x,120,132,24,5,'#14262c','#7ad8ee',1.5);
  C(x,120,76,48,RG(x,102,56,4,60,[[0,'#fff6e6'],[.35,'#d9d0c0'],[1,'#6a6256']]),'#2a2418',2);
  x.strokeStyle='rgba(60,50,40,.6)';x.lineWidth=1;x.beginPath();x.arc(120,76,48,.2,2.9);x.stroke();x.beginPath();x.moveTo(74,88);x.quadraticCurveTo(120,100,166,88);x.stroke();
  // objektív
  C(x,120,70,24,'#17191c','#555',3);C(x,120,70,19,RG(x,120,70,2,19,[[0,'#7fd0ff'],[.4,'#2255aa'],[1,'#0a1a3a']]));C(x,120,70,8,'#050a14');C(x,113,63,3.2,'rgba(255,255,255,.85)');x.strokeStyle='#8a8f96';x.lineWidth=1;for(let i=0;i<8;i++){const a=i/8*PI2;x.beginPath();x.moveTo(120+Math.cos(a)*19,70+Math.sin(a)*19);x.lineTo(120+Math.cos(a)*24,70+Math.sin(a)*24);x.stroke()}
  // karok
  for(const sg of[-1,1]){x.strokeStyle='#6a6256';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(120+sg*46,90);x.quadraticCurveTo(120+sg*62,104,120+sg*54,118);x.stroke();C(x,120+sg*54,120,5,'#b8b0a0','#3a3428',1.5)}
  // antenna + jelzőfény
  x.strokeStyle='#3a3428';x.lineWidth=2;x.beginPath();x.moveTo(140,32);x.lineTo(152,10);x.stroke();C(x,153,9,3.6,'#ff4a3a');x.save();x.globalCompositeOperation='lighter';C(x,153,9,10,RG(x,153,9,0,10,[[0,'rgba(255,90,70,.8)'],[1,'rgba(255,90,70,0)']]));x.restore();
  x.fillStyle='rgba(60,40,20,.5)';x.beginPath();x.ellipse(98,106,6,3,.5,0,PI2);x.fill();x.fillStyle='#c4552a';x.fillRect(86,86,16,5);x.font='bold 5px Georgia';x.fillStyle='#fff';x.fillText('P-07',88,90.4)},
 // 6) Atom-pisztoly (art deco sugárpisztoly üvegcsöves tekerccsel)
 pisztoly(x){bg(x,'#3a2a2a');shadow(x,120,148,80,6);x.save();x.translate(120,92);x.rotate(-.08);x.translate(-120,-92);
  // markolat
  x.beginPath();x.moveTo(78,100);x.lineTo(100,100);x.lineTo(96,146);x.bezierCurveTo(94,152,76,152,72,146);x.closePath();x.fillStyle=LG(x,70,0,100,0,[[0,'#3a1d12'],[.5,'#7a4426'],[1,'#2a140a']]);x.fill();x.strokeStyle='#120804';x.lineWidth=1.4;x.stroke();x.strokeStyle='rgba(0,0,0,.45)';for(let i=0;i<6;i++){x.beginPath();x.moveTo(76,108+i*7);x.lineTo(97,108+i*7);x.stroke()}
  // test
  x.beginPath();x.moveTo(52,78);x.bezierCurveTo(52,66,66,62,84,62);x.lineTo(150,66);x.lineTo(176,76);x.lineTo(176,92);x.lineTo(150,100);x.lineTo(84,102);x.bezierCurveTo(64,102,52,96,52,78);x.closePath();x.fillStyle=LG(x,0,62,0,102,[[0,'#f2f4f6'],[.5,'#a9afb6'],[1,'#4c525a']]);x.fill();x.strokeStyle='#14181c';x.lineWidth=1.6;x.stroke();
  // uszonyok
  for(let i=0;i<4;i++){const fx=100+i*14;P(x,[[fx,64],[fx+12,64],[fx+6,50-(i%2)*4]],LG(x,fx,50,fx,64,[[0,'#d24a3a'],[1,'#7a2218']]),'#14181c',1)}
  // csöves tekercs
  x.fillStyle='#1a2b2e';x.fillRect(110,78,52,12);x.strokeStyle='#111';x.strokeRect(110,78,52,12);x.save();x.globalCompositeOperation='lighter';x.fillStyle=LG(x,110,0,162,0,[[0,'rgba(80,255,200,.9)'],[1,'rgba(80,255,200,.2)']]);x.fillRect(112,81,48,6);x.restore();x.strokeStyle='#d8b24a';x.lineWidth=1.6;for(let i=0;i<9;i++){x.beginPath();x.moveTo(113+i*5.5,77);x.lineTo(116+i*5.5,91);x.stroke()}
  // csőszáj
  x.fillStyle=LG(x,0,72,0,98,[[0,'#d9dde2'],[1,'#50565c']]);x.fillRect(176,74,34,16);x.strokeStyle='#14181c';x.strokeRect(176,74,34,16);for(let i=0;i<4;i++)x.fillRect(182+i*7,70,3,24);C(x,212,82,6,'#0a1a14','#222',1.5);x.save();x.globalCompositeOperation='lighter';C(x,212,82,12,RG(x,212,82,0,12,[[0,'rgba(120,255,200,.8)'],[1,'rgba(120,255,200,0)']]));x.restore();
  // ravasz, gombok
  x.strokeStyle='#2a2e34';x.lineWidth=3;x.beginPath();x.arc(104,108,10,.1,Math.PI-.4);x.stroke();for(const[bx,by]of[[70,86],[84,76]])rv(x,bx,by,2.6);C(x,66,82,5,'#d24a3a','#14181c',1);x.restore()},
 // 7) Holdisten-bálvány: faragott kőfej, zöld drágakő-szemekkel
 balvany(x){bg(x,'#2c3a2a');rock(x,132,'#4a4a3a');shadow(x,120,134,68,7);
  x.beginPath();x.moveTo(70,128);x.lineTo(66,70);x.bezierCurveTo(66,38,92,22,120,22);x.bezierCurveTo(148,22,174,38,174,70);x.lineTo(170,128);x.closePath();x.fillStyle=LG(x,66,0,174,0,[[0,'#7b7a68'],[.45,'#b3b19a'],[1,'#53523f']]);x.fill();x.strokeStyle='#26261c';x.lineWidth=2;x.stroke();
  // fejdísz
  for(let i=0;i<7;i++){const a=-Math.PI+(i+.5)/7*Math.PI;P(x,[[120+Math.cos(a)*44,40+Math.sin(a)*22],[120+Math.cos(a-.12)*66,34+Math.sin(a-.12)*34],[120+Math.cos(a+.12)*66,34+Math.sin(a+.12)*34]],LG(x,100,0,140,40,[[0,'#cfcdb2'],[1,'#6b6a52']]),'#26261c',1.2)}
  // szemek
  for(const sx of[98,142]){E(x,sx,68,15,10,'#1e1e16','#26261c',1.5);E(x,sx,68,11,7,RG(x,sx-2,66,0,12,[[0,'#d8ffd0'],[.4,'#22c070'],[1,'#0a4a28']]));x.save();x.globalCompositeOperation='lighter';C(x,sx,68,18,RG(x,sx,68,0,18,[[0,'rgba(80,255,160,.5)'],[1,'rgba(80,255,160,0)']]));x.restore();C(x,sx-3,65,2,'#fff')}
  // orr, száj
  P(x,[[120,68],[110,96],[130,96]],'rgba(0,0,0,.18)','#26261c',1.2);x.fillStyle='#1c1c14';x.fillRect(92,108,56,10);x.strokeStyle='#8a8870';x.lineWidth=1.2;for(let i=0;i<8;i++){x.beginPath();x.moveTo(94+i*7,108);x.lineTo(94+i*7,118);x.stroke()}
  x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=1.2;x.beginPath();x.moveTo(150,36);x.lineTo(142,52);x.lineTo(148,64);x.moveTo(84,90);x.lineTo(90,104);x.stroke();
  x.fillStyle='rgba(70,120,50,.5)';for(let i=0;i<26;i++){x.beginPath();x.ellipse(70+rnd()*100,100+rnd()*28,3+rnd()*6,2+rnd()*3,0,0,PI2);x.fill()}},
 // 8) Sárkánycsont-kard (kőbe ágyazva)
 kard(x){bg(x,'#34283a');rock(x,138,'#5a5a66');x.save();x.translate(122,84);x.scale(.84,.84);x.rotate(-.42);x.translate(-120,-92);
  // penge
  x.beginPath();x.moveTo(113,10);x.lineTo(127,10);x.lineTo(129,100);x.lineTo(120,110);x.lineTo(111,100);x.closePath();x.fillStyle=LG(x,111,0,129,0,[[0,'#8a96a6'],[.48,'#f2f6fa'],[.52,'#c6ced8'],[1,'#566072']]);x.fill();x.strokeStyle='#202632';x.lineWidth=1.3;x.stroke();x.strokeStyle='rgba(30,40,60,.55)';x.lineWidth=1;x.beginPath();x.moveTo(120,16);x.lineTo(120,98);x.stroke();
  x.save();x.globalCompositeOperation='lighter';x.strokeStyle='rgba(150,200,255,.5)';x.lineWidth=2;x.beginPath();x.moveTo(116,20);x.lineTo(116,96);x.stroke();x.restore();
  // keresztvas: sárkányszárnyak
  for(const sg of[-1,1]){x.beginPath();x.moveTo(120+sg*6,108);x.bezierCurveTo(120+sg*30,96,120+sg*52,98,120+sg*60,116);x.bezierCurveTo(120+sg*44,112,120+sg*34,118,120+sg*28,128);x.bezierCurveTo(120+sg*20,116,120+sg*10,118,120+sg*6,116);x.closePath();x.fillStyle=LG(x,0,96,0,128,[[0,'#f0e6c8'],[1,'#a08a58']]);x.fill();x.strokeStyle='#3a2e18';x.lineWidth=1.3;x.stroke()}
  // markolat + gomb
  x.fillStyle=LG(x,114,0,126,0,[[0,'#2a1a10'],[.5,'#6a4426'],[1,'#2a1a10']]);x.fillRect(114,116,12,34);x.strokeStyle='#e8d8a0';x.lineWidth=1.2;for(let i=0;i<6;i++){x.beginPath();x.moveTo(114,118+i*5.5);x.lineTo(126,123+i*5.5);x.stroke()}
  C(x,120,155,8,RG(x,117,152,0,10,[[0,'#ffb0c0'],[.5,'#d02a50'],[1,'#50081a']]),'#3a2e18',1.5);C(x,120,112,4,RG(x,119,111,0,5,[[0,'#bfe8ff'],[1,'#2a6aa8']]),'#3a2e18',1);x.restore()},
 // 9) Némafilm-kamera (fa doboz, két tekercsmagazin, kézi hajtókar)
 kamera(x){bg(x,'#3a3024');shadow(x,120,152,60,6);
  // állvány
  x.strokeStyle='#4a3218';x.lineWidth=5;x.lineCap='round';for(const[a,b]of[[120,100,70,150],[120,100,120,152],[120,100,170,150]].map(v=>[[v[0],v[1]],[v[2],v[3]]])){x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}
  x.fillStyle='#262626';x.fillRect(104,92,32,10);
  // magazinok
  for(const mx of[96,132]){x.fillStyle=LG(x,mx-14,0,mx+14,0,[[0,'#1a1a1a'],[.5,'#4a4a4a'],[1,'#1a1a1a']]);x.fillRect(mx-14,24,28,24);x.strokeStyle='#000';x.strokeRect(mx-14,24,28,24);for(let i=0;i<4;i++)rv(x,mx-10+i*7,28,1.4)}
  // doboz
  x.fillStyle=LG(x,0,48,0,96,[[0,'#8a5a30'],[.5,'#6a4222'],[1,'#3e2410']]);x.fillRect(80,48,80,46);x.strokeStyle='#1a0e06';x.lineWidth=1.6;x.strokeRect(80,48,80,46);x.strokeStyle='rgba(255,220,160,.25)';x.lineWidth=1;for(let i=0;i<6;i++){x.beginPath();x.moveTo(80,54+i*7);x.lineTo(160,54+i*7);x.stroke()}
  x.fillStyle='#b8902a';for(const[cx,cy]of[[80,48],[160,48],[80,94],[160,94]])P(x,[[cx-5,cy-5],[cx+5,cy-5],[cx+5,cy+5],[cx-5,cy+5]],'#b8902a','#5a420c',1);
  // objektív + fújtató
  x.fillStyle=LG(x,160,0,190,0,[[0,'#2a2a2a'],[1,'#0a0a0a']]);x.fillRect(160,60,22,22);for(let i=0;i<6;i++){x.strokeStyle=i%2?'#5a5a5a':'#222';x.beginPath();x.moveTo(160+i*3.6,60);x.lineTo(160+i*3.6,82);x.stroke()}x.fillStyle=LG(x,182,0,210,0,[[0,'#6a6a70'],[.5,'#d8dce0'],[1,'#44464c']]);x.fillRect(182,56,28,30);x.strokeStyle='#111';x.strokeRect(182,56,28,30);C(x,210,71,12,RG(x,206,66,0,13,[[0,'#bfe0ff'],[.5,'#3a64a0'],[1,'#0a1428']]),'#222',2);
  // hajtókar
  C(x,80,72,7,'#2a2a2a','#000',1);x.strokeStyle='#b8902a';x.lineWidth=3;x.beginPath();x.moveTo(80,72);x.lineTo(60,60);x.stroke();C(x,57,58,4,'#5a3a18','#2a1a08',1)},
 // 10) Űrsisak (retro halszem, aranytükrös napellenző)
 sisak(x){bg(x,'#242a38');for(let i=0;i<30;i++){x.fillStyle=`rgba(255,255,255,${.2+rnd()*.5})`;x.fillRect(rnd()*CW,rnd()*CH*.7,1,1)}shadow(x,120,152,64,6);
  x.fillStyle=LG(x,0,112,0,144,[[0,'#c8ccd2'],[1,'#50565e']]);x.beginPath();x.ellipse(120,130,56,18,0,0,PI2);x.fill();x.strokeStyle='#1a1e24';x.lineWidth=1.4;x.stroke();
  C(x,120,78,56,RG(x,98,52,4,76,[[0,'#ffffff'],[.45,'#d4d8de'],[1,'#6a727e']]),'#1a1e24',2);
  E(x,120,80,40,32,RG(x,110,66,2,44,[[0,'#ffe9a8'],[.4,'#d4a02e'],[1,'#5a3a08']]),'#2a1e08',2.5);
  x.save();x.beginPath();x.ellipse(120,80,40,32,0,0,PI2);x.clip();x.fillStyle=LG(x,80,0,160,0,[[0,'rgba(120,180,255,.5)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(255,120,180,.35)']]);x.fillRect(80,48,80,64);x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(106,64,13,6,-.6,0,PI2);x.fill();x.restore();
  x.fillStyle='#c8ccd2';for(const sg of[-1,1]){x.fillRect(120+sg*58-5,72,10,18);rv(x,120+sg*58,76,2)}
  x.strokeStyle='#e8e8e8';x.lineWidth=4;x.beginPath();x.moveTo(168,34);x.lineTo(178,14);x.stroke();C(x,179,12,3.5,'#d24a3a');
  x.fillStyle='#d24a3a';x.fillRect(80,100,18,8);x.fillStyle='#fff';x.font='bold 6px Georgia';x.fillText('ORBIT',82,106)},
 // 11) Kristálytojás (ismeretlen eredetű, belső fénnyel, gyökér-karmok közt)
 tojas(x){bg(x,'#2a2038');x.fillStyle=RG(x,120,86,4,90,[[0,'rgba(120,255,230,.35)'],[1,'rgba(120,255,230,0)']]);x.fillRect(0,0,CW,CH);shadow(x,120,150,50,6);
  for(const sg of[-1,1])for(let i=0;i<3;i++){x.strokeStyle=`rgba(${40+i*10},${30+i*8},${20},1)`;x.lineWidth=7-i*1.6;x.lineCap='round';x.beginPath();x.moveTo(120+sg*(20+i*14),150);x.bezierCurveTo(120+sg*(48+i*10),128-i*8,120+sg*(54+i*6),96-i*10,120+sg*(30+i*4),82-i*14);x.stroke()}
  // tojás
  x.beginPath();x.moveTo(120,24);x.bezierCurveTo(158,24,176,78,166,108);x.bezierCurveTo(158,138,82,138,74,108);x.bezierCurveTo(64,78,82,24,120,24);x.closePath();x.fillStyle=RG(x,108,56,4,90,[[0,'#eafffb'],[.35,'#7fe8d4'],[.7,'#3a7ac8'],[1,'#3a1a78']]);x.fill();x.strokeStyle='rgba(220,255,250,.8)';x.lineWidth=1.6;x.stroke();
  // csiszolat-lapok
  x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1;for(const[a,b,c,d]of[[120,24,120,128],[84,60,156,60],[76,92,164,92],[120,24,84,92],[120,24,156,92],[84,92,120,128],[156,92,120,128],[96,40,96,110],[144,40,144,110]]){x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
  x.save();x.globalCompositeOperation='lighter';C(x,120,84,22,RG(x,120,84,0,22,[[0,'rgba(255,255,255,.95)'],[.4,'rgba(160,255,235,.6)'],[1,'rgba(160,255,235,0)']]));x.restore();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(98,50,6,12,.5,0,PI2);x.fill()},
 // 12) Filmtekercs + csapótábla (a „Kincses Barlang” forgatásáról)
 tekercs(x){bg(x,'#34302a');shadow(x,122,152,84,6);
  // csapótábla
  x.save();x.translate(152,114);x.rotate(.08);x.fillStyle='#161616';x.fillRect(-52,-4,104,52);x.strokeStyle='#000';x.strokeRect(-52,-4,104,52);x.fillStyle='#e8e4d8';x.font='bold 8px Georgia';x.fillText('FELVÉTEL 27',-46,12);x.font='7px Georgia';x.fillText('RENDEZŐ: A. VÁRADI',-46,26);x.fillText('OPERATŐR: L. MÉSZÁROS',-46,38);
  x.save();x.rotate(-.34);x.translate(-52,-24);x.fillStyle='#161616';x.fillRect(0,0,104,16);x.beginPath();for(let i=0;i<8;i++){const bx=i*13;x.fillStyle=i%2?'#161616':'#f2f2f2';x.beginPath();x.moveTo(bx,0);x.lineTo(bx+13,0);x.lineTo(bx+8,16);x.lineTo(bx-5,16);x.closePath();x.fill()}x.strokeStyle='#000';x.strokeRect(0,0,104,16);x.restore();x.restore();
  // tekercs
  C(x,70,76,52,LG(x,24,24,116,128,[[0,'#d8dce0'],[.5,'#7e858c'],[1,'#3a4046']]),'#14181c',2);C(x,70,76,42,'#1a1e22');for(let i=0;i<6;i++){const a=i/6*PI2+.3;C(x,70+Math.cos(a)*24,76+Math.sin(a)*24,10,'#7a8088','#14181c',1.2);C(x,70+Math.cos(a)*24,76+Math.sin(a)*24,7,'#0a0c0e')}C(x,70,76,10,LG(x,60,66,80,86,[[0,'#fff'],[1,'#5a6066']]),'#14181c',1.5);C(x,70,76,3.5,'#14181c');
  x.strokeStyle='#2a1e12';x.lineWidth=2;x.beginPath();x.arc(70,76,40,-.4,.9);x.stroke();
  // kicsorgó filmszalag
  x.beginPath();x.moveTo(110,102);x.bezierCurveTo(130,126,100,142,70,140);x.lineTo(70,126);x.bezierCurveTo(96,128,118,118,104,108);x.closePath();x.fillStyle='#241a10';x.fill();x.fillStyle='rgba(255,230,160,.6)';for(let i=0;i<7;i++){const t=i/6;x.fillRect(108-t*30+(1-t)*0,106+t*28-Math.sin(t*3)*4,3,3)}}
};
const REL=[
 {id:'kupe',n:'Kronosz-kupé',film:'„Tegnap holnap” (1987, kitalált film)',z:[3,400],p:7e-4,v:2.5e6,t:'A hatvanas évek formájú sportkocsi, tetején sárgaréz kronogyűrűvel. A forgatás után a kocsit „elásták az időben” – a gyűrű belsejében ma is halványan világít valami.'},
 {id:'koponya',n:'Óriás ragadozó-koponya',film:'valódi lelet · késő kréta',z:[40,300],p:8e-4,v:4e6,t:'Egy tyrannosaurus-szerű ragadozó koponyája kőzetbe ágyazva: bicikli-kerék méretű, banán-nagyságú fogakkal. A filmes „ősvilág-kalandok” klasszikus főszereplője ilyen volt.'},
 {id:'automata',n:'Az óraműves feje',film:'„A Gépész és a Hold” (1927, kitalált némafilm)',z:[3,120],p:7e-4,v:1.8e6,t:'Sárgaréz fej porcelán arccal, borostyánszínű üvegszemekkel és fogaskerék-fülekkel. A hűlt óraszerkezete még felhúzható.'},
 {id:'hajo',n:'Vándor-kalapács teherűrhajó',film:'„Vasút a csillagok közt” (1992, kitalált film)',z:[400,4e3],p:2.5e-4,v:6e6,t:'Hosszú gerincű vontatóhajó, hat konténerrel és két hajtóművel. Egy kisebb forgatási modell – 1:12 léptékű, de minden szegecs a helyén.'},
 {id:'dron',n:'Pötty, a segéd-drón',film:'„A Kis Szerelő” (2004, kitalált film)',z:[3,400],p:6e-4,v:1.5e6,t:'Gömb testű, egyszemű lebegő drón, bal oldalán égésnyommal. A film közönségkedvence volt: sosem beszélt, csak villogott.'},
 {id:'pisztoly',n:'Atom-pisztoly',film:'„Rakéták a hold felé” (1954, kitalált film)',z:[3,400],p:7e-4,v:9e5,t:'Art deco sugárpisztoly üvegcsöves tekerccsel és három uszonnyal. A gyerekek a kilencvenes években még pótolták a hiányzó szikra-effekteket.'},
 {id:'balvany',n:'A Holdisten feje',film:'„A Zöld Szem átka” (1961, kitalált film)',z:[400,4e3],p:3e-4,v:3.2e6,t:'Faragott kőfej két zöld drágakő-szemmel. Aki a nyakába teszi a lámpát, azt mondják, a szemek visszanéznek.'},
 {id:'kard',n:'Sárkánycsont-kard',film:'„A Hamu Lovagja” (1983, kitalált film)',z:[400,4e3],p:3e-4,v:5e6,t:'Fehér, sárkányszárny-keresztvasú kard, vörös markolatgombbal. A penge a kőből nem akart kijönni – a rekvizitesek mindenféle tréfát megengedtek maguknak.'},
 {id:'kamera',n:'Némafilm-kamera',film:'forgatási rekvizitum · 1919',z:[3,400],p:6e-4,v:1.1e6,t:'Fa dobozos, kézi hajtókás kamera két magazinnal. Egyetlen kocka sem veszett el belőle: a tekercs még bent van.'},
 {id:'sisak',n:'Orbit-1 űrsisak',film:'„Az első lépés” (1969, kitalált film)',z:[3,400],p:5e-4,v:2e6,t:'Halszem-ablakú sisak aranyozott napellenzővel. A visszatükröződő csillagok nem festettek – az ablaküveg valódi tükörbevonat.'},
 {id:'tojas',n:'Kristálytojás',film:'„A Mélység Fészke” (1998, kitalált film)',z:[4e3,3.5e4],p:2e-4,v:8e6,t:'Fényes, csiszolt, belülről világító kristálytojás gyökérszerű tartóban. Melegebb, mint ahogy egy kődarabnak lennie kellene.'},
 {id:'tekercs',n:'Filmtekercs és csapótábla',film:'„Kincses Barlang” (1976, kitalált film)',z:[3,4e3],p:6e-4,v:1.3e6,t:'Fémdobozos filmtekercs és hozzátartozó csapótábla: a rendező kézírásával. A film utolsó jelenete nincs meg – talán ez az.'}];
const MS=[[3,2e6],[6,1.2e7],[9,6e7],[12,3e8]];
const IMG={};
const R={list:REL,
 got(){try{return(S.rel&&typeof S.rel==='object')?S.rel:(S.rel={})}catch(e){return{}}},
 has(id){return!!R.got()[id]},count(){return REL.filter(r=>R.has(r.id)).length},
 img(id){if(IMG[id])return IMG[id];try{const c=document.createElement('canvas');c.width=CW*2;c.height=CH*2;const x=c.getContext('2d');x.scale(2,2);sd=REL.findIndex(r=>r.id===id)*131+7;D[id](x);
  // vignetta + vékony keret
  x.fillStyle=RG(x,CW/2,CH/2,CW*.35,CW*.75,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.5)']]);x.fillRect(0,0,CW,CH);x.strokeStyle='rgba(255,220,150,.35)';x.lineWidth=1.5;x.strokeRect(1,1,CW-2,CH-2);
  return IMG[id]=c.toDataURL('image/jpeg',.9)}catch(e){return IMG[id]=''}},
 // fúrás közben, a megtett új távolsággal hívódik
 drill(dist){try{if(!(dist>0)||typeof S==='undefined'||!S||S.depth<=0)return;const d=S.depth;
  for(const r of REL){if(d<r.z[0]||d>r.z[1]||R.has(r.id))continue;if(Math.random()<r.p*dist){R.find(r.id);break}}}catch(e){}},
 find(id){const r=REL.find(q=>q.id===id);if(!r||R.has(id))return false;R.got()[id]=Date.now();
  try{ding&&ding()}catch(e){}try{msg('🎬 FILMES RELIKVIA: '+r.n+' – a Dicsőségfalra került!',true)}catch(e){}
  const n=R.count();for(const[k,rw]of MS)if(n===k){S.cash+=rw;try{msg('🏆 '+k+' relikvia a falon! Jutalom: '+ft(rw),true)}catch(e){}}
  R.card(id);return true},
 card(id){try{const r=REL.find(q=>q.id===id);if(!r||typeof document==='undefined'||!document.body)return;let c=document.getElementById('relCard');if(!c){c=document.createElement('div');c.id='relCard';document.body.appendChild(c)}
  c.innerHTML=`<div class="rcIn"><div class="rcK">🎬 ÚJ RELIKVIA · ${R.count()}/${REL.length}</div><img src="${R.img(id)}" alt=""><b>${r.n}</b><div class="rcF">${r.film}</div><p>${r.t}</p><div class="rcB"><button class="b g" onclick="REL.close()">Tovább fúrok</button><button class="b" onclick="REL.close();tab=4;view()">🏛 Dicsőségfal</button></div></div>`;c.style.display='flex'}catch(e){}},
 close(){const c=document.getElementById('relCard');if(c)c.style.display='none'},
 open(id){R.card(id)},
 give(id){return R.find(id)},
 html(){try{const n=R.count(),next=MS.find(m=>m[0]>n);
  let h=`<h3>🏛 Dicsőségfal – filmes relikviák</h3><div class="card relHd"><b>${n} / ${REL.length}</b> relikvia a falon${next?` · következő jutalom ${next[0]}-nál: <b>${ft(next[1])}</b>`:' · <b>a fal teljes!</b>'}<div class="bar"><i style="width:${n/REL.length*100}%"></i></div><div class="mu">Fúrás közben ritkán kerülnek elő a földből kitalált filmek rekvizitumai. Mindegyik egyedi: egyszer lehet megtalálni.</div></div><div class="relWall">`;
  for(const r of REL){const f=R.has(r.id);h+=f?`<button class="relFr" onclick="REL.open('${r.id}')"><img src="${R.img(r.id)}" alt=""><b>${r.n}</b><small>${r.film.split(' (')[0]}</small></button>`:`<div class="relFr lk"><div class="relQ">?</div><b>Ismeretlen relikvia</b><small>${fd(r.z[0])} – ${fd(r.z[1])} között keresd</small></div>`}
  return h+'</div>'}catch(e){return''}}};
W.REL=R;
})(typeof window!=='undefined'?window:globalThis);
