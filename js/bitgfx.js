/* Drill Up – árnyékolt, „2D-s de térhatású” rajzok: fúrófej (kupola, kiemelkedő spirálélek, gömbszerű vágóélek, fényfolt), pajzs és a gép testének részletei.
   A fejet a játékbeli gép (mach) és a közeli nézet (face.js) UGYANEZZEL a függvénnyel rajzolja, így a kettő megegyezik.
   Koordináták a gép méter-rendszerében: a kupola középpontja (-1,6; 0), vízszintes sugara 1,6, függőleges 1,85, a csúcs x≈0,5. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('bitgfx');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mx=(a,b,t)=>mix(a,b,t);
function sphere(x,px,py,r,col,q){if(q<1){x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,7);x.fill();return}
 const g=x.createRadialGradient(px-r*.35,py-r*.4,r*.1,px,py,r*1.05);g.addColorStop(0,mx(col,'#ffffff',.7));g.addColorStop(.5,col);g.addColorStop(1,mx(col,'#000000',.6));x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill()}
const BG={sphere,
 // a fúrófej oldalnézetben. o: {sp: forgásszög, heat: 0..1.2, ht: fúrófej-szint, ts}
 head(x,o){const sp=o.sp||0,ht=o.ht|0,hx=clamp(o.heat||0,0,1),q=W.Gov?Gov.q:2,hdc=HDC[ht],wear=clamp((S.hw||0)/100,0,1);
  const dome=()=>{x.beginPath();x.ellipse(-1.6,0,1.6,1.85,0,-Math.PI/2,Math.PI/2);x.closePath()};
  let g=x.createLinearGradient(0,-1.85,0,1.85);g.addColorStop(0,hdc[0]);g.addColorStop(.45,hdc[1]);g.addColorStop(1,hdc[2]);dome();x.fillStyle=g;x.fill();
  x.save();dome();x.clip();
  if(q>=1){ // gömbölyű árnyalás: fény balról-fentről, sötét perem és alj
   g=x.createRadialGradient(-1.15,-.7,.05,-1.0,.1,2.2);g.addColorStop(0,'rgba(255,255,255,.42)');g.addColorStop(.3,'rgba(255,255,255,.06)');g.addColorStop(.62,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=g;x.fillRect(-3.3,-2,3.8,4);
   g=x.createLinearGradient(0,.2,0,1.85);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.38)');x.fillStyle=g;x.fillRect(-3.3,.2,3.8,1.7)}
  if(wear>.05){x.fillStyle=`rgba(20,16,12,${wear*.35})`;x.fillRect(-3.3,-2,3.8,4)}
  // spirálélek: kiemelkedő fogak – árnyék (jobbra-le), sötét mag, fémes él, fénycsík (balra-fel); a nézők felé fordulók vastagabbak
  const hot=mx('#e6e9ed','#ff9a3a',hx);
  for(let k=0;k<6;k++){const P=[];for(let s=0;s<=14;s++){const t=s/14*.95,r=1.85*Math.sqrt(1-t*t),a=sp+k*Math.PI/3+t*2.6;P.push([-1.6+1.6*t,r*Math.sin(a),Math.cos(a)])}
   const run=(w,col,dx,dy,fn)=>{x.strokeStyle=col;x.lineCap='round';for(let s=0;s<14;s++){const a=P[s],b=P[s+1];if(a[2]<=0&&b[2]<=0)continue;const f=fn?fn((a[2]+b[2])/2):1;x.lineWidth=w*f;x.beginPath();x.moveTo(a[0]+dx,a[1]+dy);x.lineTo(b[0]+dx,b[1]+dy);x.stroke()}};
   if(q>=1){run(.2,'rgba(0,0,0,.45)',.05,.07,c=>.6+.5*Math.max(0,c));run(.17,'#15171a',0,0,c=>.6+.5*Math.max(0,c));run(.1,hot,0,0,c=>.5+.7*Math.max(0,c));run(.035,'rgba(255,255,255,.65)',-.025,-.03,c=>Math.max(0,c))}
   else{run(.16,'#15171a',0,0);run(.05,hot,0,0)}}
  // vágóélek: gömbszerű, fénypontos betétek
  const tc=mx(mx(HT[ht],'#3a3a3a',wear*.75),'#ff8a2a',hx);
  for(let k=0;k<6;k++)[.3,.55,.78].forEach(t=>{const r=1.85*Math.sqrt(1-t*t),a=sp+k*Math.PI/3+t*2.6;if(Math.cos(a)>0){const c=Math.cos(a);x.fillStyle='rgba(0,0,0,.4)';x.beginPath();x.arc(-1.6+1.6*t+.04,r*Math.sin(a)+.05,(.1+ht*.01)*(.7+.4*c),0,7);x.fill();sphere(x,-1.6+1.6*t,r*Math.sin(a),(.1+ht*.01)*(.7+.4*c)*1.05,tc,q)}});
  // fényfolt (csillogás) a kupola tetején
  if(q>=1){x.save();x.translate(-1.15,-1.05);x.rotate(-.55);g=x.createRadialGradient(0,0,0,0,0,.65);g.addColorStop(0,'rgba(255,255,255,.34)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.ellipse(0,0,.65,.2,0,0,7);x.fill();x.restore()}
  x.restore();
  dome();x.strokeStyle=mx('#1d1f22','#ff7a1a',hx);x.lineWidth=.06+hx*.08;x.stroke();
  // hátsó gyűrű: fogaskerék-szerű pengék (gömb-csavarok)
  for(let k=0;k<6;k++){const a=sp+k*Math.PI/3+.5,yy=1.7*Math.sin(a);if(Math.cos(a)>0){const col=mx('#c4cad1','#ff8a2a',hx);sphere(x,-1.42,yy,.2,col,q);x.strokeStyle='#222';x.lineWidth=.04;x.beginPath();x.arc(-1.42,yy,.2,0,7);x.stroke();x.beginPath();x.moveTo(-1.42,yy);x.lineTo(-1.42+.17*Math.cos(sp*3),yy+.17*Math.sin(sp*3));x.stroke()}}
  // orrkúp: hengeres árnyalás + fénycsík, mozgó barázdák
  g=x.createLinearGradient(0,-.35,0,.35);g.addColorStop(0,mx('#d6dadf','#ffb870',hx));g.addColorStop(.5,mx('#9aa0a6','#ff8a2a',hx));g.addColorStop(1,mx('#3b3f45','#8a3a10',hx));x.fillStyle=g;x.beginPath();x.moveTo(-.1,-.35);x.lineTo(.5,0);x.lineTo(-.1,.35);x.closePath();x.fill();
  x.strokeStyle='#2a2c30';x.lineWidth=.05;for(let k=0;k<4;k++){const f=((sp*.15+k/4)%1);x.beginPath();x.moveTo(-.1+f*.6,-.35*(1-f));x.lineTo(-.1+f*.6,.35*(1-f));x.stroke()}
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=.035;x.beginPath();x.moveTo(-.08,-.22);x.lineTo(.36,-.02);x.stroke()},
 // az elülső pajzs (hengeres, gyűrűkkel és szegecsekkel) – a közeli nézethez
 shield(x,hl){const[c1,c2]=HC[hl];let g=x.createLinearGradient(0,-1.65,0,1.65);g.addColorStop(0,c1);g.addColorStop(.2,c1);g.addColorStop(.55,c2);g.addColorStop(1,'#1c1e22');x.fillStyle=g;x.fillRect(-4.7,-1.65,3.1,3.3);
  x.fillStyle='rgba(255,255,255,.25)';x.fillRect(-4.7,-1.3,3.1,.12);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(-4.7,1.3,3.1,.35);
  for(let k=0;k<=hl+1;k++){x.fillStyle=c1;x.fillRect(-1.9-k*.5,-1.65,.2,3.3);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(-1.7-k*.5,-1.65,.05,3.3)}
  for(let i=0;i<7;i++){x.fillStyle=i%2?'#f0b020':'#222';x.fillRect(-4.7,-1.65+i*.47,.3,.47)}
  x.fillStyle='rgba(255,255,255,.4)';for(let i=0;i<6;i++){x.fillRect(-4.2+i*.45,-1.52,.07,.07);x.fillRect(-4.2+i*.45,1.45,.07,.07)}},
 // a pajzs extra részletei (a mach pajzs-blokkjában, a stroke-eltolás után): fényléc, lemezhézagok, karcok
 shieldFx(x,o){const ts=o.ts||0,act=o.act,hl=o.hl|0;
  x.fillStyle='#1b1c1f';x.fillRect(-3.95,-1.86,1.5,.2);for(let i=0;i<3;i++){x.fillStyle=act?(Math.sin(ts/140+i*1.6)>-.2?'#fff2b0':'#b9a560'):'#4a4636';x.fillRect(-3.85+i*.45,-1.83,.3,.14)}
  x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=.03;[-3.4,-2.6].forEach(px=>{x.beginPath();x.moveTo(px,-1.62);x.lineTo(px,1.62);x.stroke()});x.strokeStyle='rgba(255,255,255,.12)';[-3.37,-2.57].forEach(px=>{x.beginPath();x.moveTo(px,-1.62);x.lineTo(px,1.62);x.stroke()});
  const hp=clamp((100-S.hp)/100,0,1);if(hp>.05){x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.025;for(let i=0;i<4+hp*10;i++){const a=((i*53.7)%7)/7,y0=-1.5+a*3,x0=-4.5+((i*29.1)%2.6);x.beginPath();x.moveTo(x0,y0);x.lineTo(x0+.35,y0+.12);x.stroke()}}},
 // a gép testének részletei (a hátsó henger és az ablakok után, a lánctalp előtt)
 body(x,o){const ts=o.ts||0,act=o.act,hl=o.hl|0,c1=HC[hl][0],q=W.Gov?Gov.q:2,dirt=clamp(S.depth/2500,0,1);
  // lemezhézagok és szegecssorok
  x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=.03;[-11.0,-9.4,-5.95].forEach(px=>{x.beginPath();x.moveTo(px,-1.5);x.lineTo(px,1.5);x.stroke()});x.strokeStyle='rgba(255,255,255,.13)';[-10.97,-9.37,-5.92].forEach(px=>{x.beginPath();x.moveTo(px,-1.5);x.lineTo(px,1.5);x.stroke()});
  // színsáv a vázon (a páncél színével) és felirat
  x.fillStyle=c1;x.fillRect(-12.15,-1.43,6.5,.1);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(-12.15,-1.33,6.5,.03);
  x.save();x.font='bold .42px Georgia';x.fillStyle='rgba(255,255,255,.78)';x.fillText('DU-01',-11.6,-.62);x.font='.2px Georgia';x.fillStyle='rgba(255,255,255,.45)';x.fillText('DRILL UP',-11.6,-.36);x.restore();
  // ellenőrző nyílás zsanérral és fogantyúval
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(-10.75,-.12,1.2,.78);x.strokeStyle='#2a2c30';x.lineWidth=.04;x.strokeRect(-10.75,-.12,1.2,.78);x.fillStyle='#9aa0a6';x.fillRect(-9.82,.18,.18,.07);x.fillRect(-10.7,-.02,.06,.15);x.fillRect(-10.7,.42,.06,.15);
  // antenna, jelzőfény (forgó) és riasztó
  {const rt=o.rt||0;x.save();x.beginPath();x.rect(-20,-6,30,4.5);x.clip();x.translate(0,rt*1.45);
  x.strokeStyle='#cfd3d8';x.lineWidth=.04;x.beginPath();x.moveTo(-5.9,-1.5);x.lineTo(-5.9,-2.75);x.stroke();x.fillStyle=Math.sin(ts/420)>0?'#ff3b2f':'#5a1a14';x.beginPath();x.arc(-5.9,-2.78,.07,0,7);x.fill();
  x.fillStyle='#303236';x.fillRect(-7.95,-1.64,.34,.16);const bo=Math.sin(ts/170),on=act&&bo>-.3;x.fillStyle=on?'#ffb020':'#6a420c';x.beginPath();x.arc(-7.78,-1.7,.16,Math.PI,0);x.fill();
  if(on&&q>=1){x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(-7.78,-1.72,0,-7.78,-1.72,1.1);g.addColorStop(0,'rgba(255,170,40,.45)');g.addColorStop(1,'rgba(255,170,40,0)');x.fillStyle=g;x.fillRect(-9,-2.9,2.5,2.4);x.restore()}
  x.restore()}
  // hűtőbordák a váz felső élén
  x.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++)x.fillRect(-9.1+i*.4,-1.5,.05,.09);
  // kormos, poros alsó rész – a mélységgel egyre piszkosabb
  if(q>=1){const g=x.createLinearGradient(0,.3,0,1.5);g.addColorStop(0,'rgba(60,42,26,0)');g.addColorStop(1,`rgba(60,42,26,${.18+.32*dirt})`);x.fillStyle=g;x.fillRect(-12.2,.3,6.6,1.2)}},
 // a gép hátulja: szerszámkészlet (csörlő, hidraulikus kalapács-kar, fúrószár-állvány, tartalék vágótárcsák, gázpalackok, szerszámláda, ásó/csákány, poroltó)
 rear(x,o){const ts=o.ts||0,act=o.act,q=W.Gov?Gov.q:2,sw=Math.sin(ts/900)*.04+(act?Math.sin(ts/130)*.03:0),m=(a,b,c,d)=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()},rc=(a,b,w,h,f,r)=>{x.fillStyle=f;x.beginPath();if(x.roundRect)x.roundRect(a,b,w,h,r||.04);else x.rect(a,b,w,h);x.fill()};
  const rt=o.rt||0;x.save();x.lineCap='round';x.beginPath();x.rect(-20,-8,7.8+(rt>0?0:8),16);x.clip();x.translate(rt*1.25,0);
  // vonószerkezet + vonóhorog
  rc(-12.62,-.95,.4,1.95,'#4a4d54',.05);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(-12.6,-.93,.05,1.9);x.strokeStyle='#b8bcc2';x.lineWidth=.07;x.beginPath();x.arc(-12.78,.05,.16,-1.2,1.2);x.stroke();rc(-12.7,-.1,.12,.3,'#b8bcc2',.03);
  // csörlődob kábellel
  const wy=-.62;rc(-13.18,wy-.22,.62,.44,'#3a3d44',.05);x.strokeStyle='#8c9199';x.lineWidth=.025;for(let i=0;i<7;i++)m(-13.12+i*.085,wy-.2,-13.12+i*.085,wy+.2);rc(-13.24,wy-.27,.07,.54,'#2a2d33',.02);rc(-12.62,wy-.27,.07,.54,'#2a2d33',.02);
  x.strokeStyle='#d0b050';x.lineWidth=.03;x.beginPath();x.moveTo(-12.9,wy+.22);x.quadraticCurveTo(-12.95,.0+sw,-12.84,.1);x.stroke();x.fillStyle='#e0a030';x.beginPath();x.arc(-12.84,.12,.05,0,7);x.fill();
  // hidraulikus kalapács-kar a váz tetején (lengés)
  x.save();x.translate(-11.9,-1.5+rt*1.3);x.strokeStyle='#e0a030';x.lineWidth=.13;x.beginPath();x.moveTo(0,0);x.lineTo(-.55,-.62+sw);x.lineTo(-1.35,-.18+sw*1.4);x.stroke();x.strokeStyle='#8c6a1c';x.lineWidth=.04;m(-.1,-.04,-.5,-.55+sw);m(-.55,-.62+sw,-1.2,-.25+sw*1.4);
  x.strokeStyle='#cfd3d8';x.lineWidth=.07;m(-.5,-.55+sw,-.15,-.12);m(-.95,-.42+sw,-1.1,-.12+sw);
  rc(-1.45,-.22+sw*1.4,.2,.34,'#555a63',.03);x.fillStyle='#14151a';x.beginPath();x.moveTo(-1.4,.12+sw*1.4);x.lineTo(-1.3,.12+sw*1.4);x.lineTo(-1.35,.4+sw*1.4);x.fill();x.fillStyle='#ffb020';x.beginPath();x.arc(0,0,.07,0,7);x.fill();x.restore();
  // fúrószár-állvány (a váz tetején: rudak + konzolok)
  for(let i=0;i<4;i++){rc(-11.75,-1.66-i*.045,2.3,.035,i%2?'#8c9199':'#b0b5bd',.015)}for(const bx of[-11.7,-10.7,-9.7])rc(bx,-1.64,.06,.2,'#2a2d33',.01);
  // tartalék vágótárcsák a hátsó lemezen
  for(let i=0;i<3;i++){const cx=-13.0-i*.0,cy=.45+i*.28;x.fillStyle='#6c7178';x.beginPath();x.arc(cx+.1,cy+.2,.16,0,7);x.fill();x.strokeStyle='#c9ced6';x.lineWidth=.03;x.beginPath();x.arc(cx+.1,cy+.2,.12,0,7);x.stroke();x.fillStyle='#2a2d33';x.beginPath();x.arc(cx+.1,cy+.2,.04,0,7);x.fill()}
  // gázpalackok (lánccal)
  rc(-12.5,.28,.14,.72,'#c43a2f',.06);rc(-12.33,.28,.14,.72,'#3a74c4',.06);x.fillStyle='#cfd3d8';x.fillRect(-12.49,.25,.1,.05);x.fillRect(-12.32,.25,.1,.05);x.strokeStyle='#2a2d33';x.lineWidth=.03;m(-12.52,.56,-12.17,.56);
  // szerszámláda a hátsó alsó élen
  rc(-12.78,.82,.55,.34,'#6a4a1e',.04);x.fillStyle='#e0a030';x.fillRect(-12.54,.88,.07,.1);x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=.025;m(-12.78,.98,-12.23,.98);
  // ásó + csákány a váz oldalán, poroltó, tömlődob
  x.strokeStyle='#8a5a28';x.lineWidth=.05;m(-6.5,-.55,-6.5,.52);m(-6.35,-.5,-6.2,.5);x.fillStyle='#9aa0a8';x.beginPath();x.moveTo(-6.6,.52);x.lineTo(-6.4,.52);x.lineTo(-6.5,.78);x.fill();x.strokeStyle='#9aa0a8';x.lineWidth=.06;x.beginPath();x.arc(-6.28,-.5,.17,3.4,6);x.stroke();
  rc(-6.0,.05,.14,.4,'#c43a2f',.05);x.fillStyle='#222';x.fillRect(-5.99,.02,.1,.05);x.strokeStyle='#222';x.lineWidth=.025;x.beginPath();x.arc(-5.86,.04,.06,0,3);x.stroke();
  x.strokeStyle='#d8a020';x.lineWidth=.045;x.beginPath();x.arc(-9.7,.78,.13,0,7);x.stroke();x.beginPath();x.arc(-9.7,.78,.07,0,7);x.stroke();
  // hátsó lámpák és prizma, forgó jelzőfény
  x.fillStyle=act?'#ff3b2f':'#6a1c16';x.fillRect(-12.28,-1.35,.07,.14);x.fillRect(-12.28,.75,.07,.14);x.fillStyle='#ffb020';x.fillRect(-12.28,-1.12,.07,.07);
  if(act&&q>=1){x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(-12.25,-1.28,0,-12.25,-1.28,.7);g.addColorStop(0,'rgba(255,60,40,.4)');g.addColorStop(1,'rgba(255,60,40,0)');x.fillStyle=g;x.fillRect(-13,-2,1.5,1.6);x.restore()}
  x.restore()}};

// ---------- a kabin kezelői: profilból látszó, ülő alakok (sisak, fejlámpa, arc, kar a kezelőszerven), pislogás, finom ringás ----------
const _rr=(x,a,b,c,d,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)};
function person(x,cx,by,k,t,o){const sway=Math.sin(t/900+k*2)*.012+(o.vib||0),hb=by-.44+sway*.6,suit=k?'#2f5aa6':'#e8742a',suit2=k?'#1f3f78':'#a84e16',hat=k?'#f1f3f6':'#ffd23c',skin=k?'#d9a17c':'#b98260',sk2=k?'#b9835f':'#946548',look=o.act?.025:0,blink=(t+k*1700)%4300<120?.15:1;
 x.fillStyle='#24211e';_rr(x,cx-.4,by-.58,.15,.6,.04);x.fill();x.fillStyle='#3a3632';x.fillRect(cx-.36,by-.56,.04,.5);
 const g=x.createLinearGradient(cx-.25,0,cx+.25,0);g.addColorStop(0,suit2);g.addColorStop(.55,suit);g.addColorStop(1,suit2);x.fillStyle=g;x.beginPath();x.moveTo(cx-.27,by+.02);x.lineTo(cx-.23,by-.3);x.quadraticCurveTo(cx-.08,by-.38+sway,cx+.13,by-.35+sway);x.lineTo(cx+.23,by-.2);x.lineTo(cx+.25,by+.02);x.closePath();x.fill();
 x.fillStyle='rgba(235,240,246,.85)';x.beginPath();x.moveTo(cx-.25,by-.15);x.lineTo(cx+.2,by-.15);x.lineTo(cx+.21,by-.125);x.lineTo(cx-.25,by-.125);x.fill();x.beginPath();x.moveTo(cx-.25,by-.095);x.lineTo(cx+.22,by-.095);x.lineTo(cx+.225,by-.07);x.lineTo(cx-.25,by-.07);x.fill();
 x.fillStyle=sk2;x.fillRect(cx-.03,hb+.09,.1,.14);
 x.fillStyle=skin;x.beginPath();x.ellipse(cx+.03+look,hb,.095,.118,.06,0,7);x.fill();x.fillStyle=sk2;x.beginPath();x.ellipse(cx-.045+look,hb+.012,.024,.04,0,0,7);x.fill();
 x.beginPath();x.moveTo(cx+.118+look,hb-.012);x.lineTo(cx+.158+look,hb+.032);x.lineTo(cx+.116+look,hb+.047);x.closePath();x.fill();
 x.fillStyle='#fff';x.beginPath();x.ellipse(cx+.078+look,hb-.018,.019,.013*blink+.002,0,0,7);x.fill();x.fillStyle='#1c1410';x.beginPath();x.arc(cx+.085+look,hb-.018,.008,0,7);x.fill();
 x.strokeStyle=sk2;x.lineWidth=.012;x.beginPath();x.moveTo(cx+.06+look,hb-.045);x.lineTo(cx+.105+look,hb-.04);x.moveTo(cx+.088+look,hb+.07);x.lineTo(cx+.118+look,hb+.066);x.stroke();
 x.fillStyle=hat;x.beginPath();x.arc(cx+.025+look,hb-.04,.128,Math.PI,0);x.fill();x.fillStyle='rgba(0,0,0,.22)';x.fillRect(cx-.1+look,hb-.052,.3,.026);x.fillStyle=hat;x.fillRect(cx-.1+look,hb-.052,.29,.02);x.fillStyle='rgba(0,0,0,.16)';x.fillRect(cx+.02+look,hb-.165,.012,.12);
 const lamp=o.lamp;x.fillStyle=lamp?'#fff7c0':'#8a8d92';x.beginPath();x.arc(cx+.145+look,hb-.075,.022,0,7);x.fill();
 if(lamp){x.save();x.globalCompositeOperation='lighter';const gl=x.createLinearGradient(cx+.15,0,cx+.7,0);gl.addColorStop(0,'rgba(255,240,170,.5)');gl.addColorStop(1,'rgba(255,240,170,0)');x.fillStyle=gl;x.beginPath();x.moveTo(cx+.15+look,hb-.075);x.lineTo(cx+.7,hb-.2);x.lineTo(cx+.7,hb+.1);x.fill();x.restore()}
 const hx=cx+.34+.012*Math.sin(t/420+k),hy=by-.075+.01*Math.cos(t/530+k);x.strokeStyle='#2a2d33';x.lineWidth=.03;x.beginPath();x.moveTo(cx+.31,by+.02);x.lineTo(hx,hy+.01);x.stroke();x.fillStyle='#c03a2a';x.beginPath();x.arc(hx,hy,.026,0,7);x.fill();
 x.strokeStyle=suit;x.lineWidth=.085;x.lineCap='round';x.beginPath();x.moveTo(cx+.13,by-.27);x.lineTo(cx+.2,by-.12);x.stroke();x.strokeStyle=suit2;x.lineWidth=.07;x.beginPath();x.moveTo(cx+.2,by-.12);x.lineTo(hx-.01,hy+.005);x.stroke();x.fillStyle='#1d1d20';x.beginPath();x.arc(hx,hy,.042,0,7);x.fill()}
BG.crew=function(x,o){const t=o.ts||0,vib=Math.sin(t/21)*.004*(o.hyd||0)+(o.act?Math.sin(t/55)*.003:0),lit=!!o.lit2,deep=S.depth>40||!lit;
 for(let i=0;i<3;i++){const wx=-9.1+i*1.05,wy=-1.2,ww=.95,wh=.9;x.save();_rr(x,wx,wy,ww,wh,.12);x.clip();
  const g=x.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,lit?'#5a4a30':'#16222c');g.addColorStop(1,lit?'#2a2218':'#0b1218');x.fillStyle=g;x.fillRect(wx,wy,ww,wh);
  x.fillStyle=lit?'rgba(255,214,140,.22)':'rgba(120,180,220,.12)';x.fillRect(wx,wy,ww,.28);
  if(i<2)person(x,wx+ww*.5-.02,wy+wh-.02,i,t,{vib,act:o.act,lamp:deep});
  else{x.fillStyle='#14181d';x.fillRect(wx+.1,wy+.18,ww-.2,.5);x.fillStyle='#0b2a18';x.fillRect(wx+.14,wy+.22,ww-.28,.3);x.strokeStyle='#38e08a';x.lineWidth=.02;x.beginPath();for(let q=0;q<=20;q++){const px=wx+.16+q*(ww-.32)/20,py=wy+.37+Math.sin(q*.9+t/200)*.05*(o.act?1.3:.4);q?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
   [[.2,'#35d06a'],[.4,'#ffb020'],[.6,'#ff5a3a']].forEach(([u,c],k)=>{x.fillStyle=Math.sin(t/(210+k*70)+k)>-.2?c:'#222';x.beginPath();x.arc(wx+ww*u+.05,wy+.6,.025,0,7);x.fill()});x.fillStyle='#2a2d33';x.fillRect(wx+.1,wy+.68,ww-.2,.2)}
  const gl=x.createLinearGradient(wx,wy,wx+ww,wy+wh);gl.addColorStop(0,'rgba(255,255,255,.2)');gl.addColorStop(.35,'rgba(255,255,255,0)');gl.addColorStop(.7,'rgba(255,255,255,.07)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(wx,wy,ww,wh);x.restore();
  x.strokeStyle='#202328';x.lineWidth=.045;_rr(x,wx,wy,ww,wh,.12);x.stroke()}};
// ---------- páncélburkolat: fúráskor körbezárja a gépet (felső kupola lefelé, alsó szoknya felfelé csúszik); s: 0 nyitva … 1 zárva ----------
BG.shell=function(x,o){const s=Math.max(0,Math.min(1,o.shell||0));if(s<=.002)return;const e=s*s*(3-2*s),hl=o.hl|0,[c1,c2]=HC[hl]||HC[0],X0=-12.55,X1=-5.35,YT=-2.0,YM=-.15,YB=1.28,oT=-(1-e)*2.7,oB=(1-e)*2.3,t=o.ts||0;
 const plate=(y0,y1,top)=>{const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,c1);g.addColorStop(.45,c2);g.addColorStop(1,'#15181c');x.fillStyle=g;x.beginPath();if(top){x.moveTo(X0,y1);x.lineTo(X0,y0+.38);x.quadraticCurveTo(X0,y0,X0+.38,y0);x.lineTo(X1-.38,y0);x.quadraticCurveTo(X1,y0,X1,y0+.38);x.lineTo(X1,y1)}else{x.moveTo(X0,y0);x.lineTo(X0,y1-.3);x.quadraticCurveTo(X0,y1,X0+.3,y1);x.lineTo(X1-.3,y1);x.quadraticCurveTo(X1,y1,X1,y1-.3);x.lineTo(X1,y0)}x.closePath();x.fill();x.strokeStyle='#14171b';x.lineWidth=.06;x.stroke()};
 // hidraulikus dugattyúk a kupola és a váz között
 if(e<.98){x.strokeStyle='#8c9199';x.lineWidth=.1;x.lineCap='butt';for(const px of[-11.6,-9.2,-6.4]){x.beginPath();x.moveTo(px,-1.5);x.lineTo(px,YM+oT+.1);x.stroke()}x.strokeStyle='#dfe4ea';x.lineWidth=.05;for(const px of[-11.6,-9.2,-6.4]){x.beginPath();x.moveTo(px,-1.5);x.lineTo(px,-1.5+(YM+oT+.1+1.5)*.55);x.stroke()}}
 x.save();x.translate(0,oT);plate(YT,YM,true);
 x.fillStyle='rgba(255,255,255,.13)';x.fillRect(X0+.4,YT+.08,X1-X0-.8,.09);x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.035;for(const px of[-11.3,-9.95,-8.6,-7.25,-6.1]){x.beginPath();x.moveTo(px,YT+.1);x.lineTo(px,YM);x.stroke()}x.fillStyle='rgba(255,255,255,.15)';for(const px of[-11.3,-9.95,-8.6,-7.25,-6.1])x.fillRect(px+.03,YT+.1,.02,YM-YT-.1);
 x.fillStyle='#d8dde4';for(let q=X0+.3;q<X1-.2;q+=.42){x.beginPath();x.arc(q,YT+.2,.035,0,7);x.arc(q,YM-.1,.035,0,7);x.fill()}
 x.fillStyle='#0b1014';for(const[sx,sw]of[[-9.0,.8],[-7.95,.8],[-6.9,.8]]){x.fillRect(sx,-.98,sw,.12)}x.fillStyle=(o.lit?'rgba(255,214,140,.7)':'rgba(120,190,230,.45)');for(const[sx,sw]of[[-9.0,.8],[-7.95,.8],[-6.9,.8]])x.fillRect(sx+.04,-.95,sw-.08,.05);
 x.save();x.font='bold .3px Georgia';x.fillStyle='rgba(255,255,255,.55)';x.fillText('DU-01',-12.2,-1.62);x.restore();
 // sárga-fekete figyelmeztető csík a kupola alsó élén
 x.save();x.beginPath();x.rect(X0,YM-.17,X1-X0,.17);x.clip();x.fillStyle='#e8b020';x.fillRect(X0,YM-.17,X1-X0,.17);x.fillStyle='#1a1a1c';for(let q=X0-.2;q<X1;q+=.36){x.beginPath();x.moveTo(q,YM);x.lineTo(q+.18,YM);x.lineTo(q+.36,YM-.17);x.lineTo(q+.18,YM-.17);x.fill()}x.restore();x.restore();
 x.save();x.translate(0,oB);plate(YM,YB,false);x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=.035;for(const px of[-11.3,-9.95,-8.6,-7.25,-6.1]){x.beginPath();x.moveTo(px,YM);x.lineTo(px,YB);x.stroke()}
 x.fillStyle='rgba(0,0,0,.45)';for(let i=0;i<5;i++)x.fillRect(-11.2+i*.1,.2,.06,.5);for(let i=0;i<5;i++)x.fillRect(-7.6+i*.1,.2,.06,.5);x.fillStyle='#d8dde4';for(let q=X0+.3;q<X1-.2;q+=.42){x.beginPath();x.arc(q,YB-.12,.035,0,7);x.fill()}
 x.fillStyle='rgba(255,255,255,.1)';x.fillRect(X0+.3,YM+.05,X1-X0-.6,.07);x.restore();
 // záró varratfény a kupola és a szoknya találkozásánál
 if(e>.95){x.fillStyle='rgba(255,255,255,'+(.2*(1-Math.abs(Math.sin(t/300))*.4))+')';x.fillRect(X0+.2,YM-.02,X1-X0-.4,.03)}};
W.BG=BG;
})(typeof window!=='undefined'?window:globalThis);
