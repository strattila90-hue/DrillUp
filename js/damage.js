/* Drill Up – sérülés, roncsolódás, robbanás, teljes újrakezdés és emlékhely (sírkő).
   S.dm = {t:láncleesett, c:repedt fej(ütés), m:olvadás 0..1, pend:{rec,why,t}}   S.tb = [{d:rekordmélység,t:idő,why}]
   A horpadás a páncél-állapotból (S.hp) következik, ezért javítással (hp=100) magától eltűnik.
   A robbanás: a páncél védőképessége elfogy (hő vagy ütés) → szúrólángok → detonáció → a játék NULLÁRÓL indul, csak a sírkő marad. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('damage');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),R=(a,b)=>a+Math.random()*(b-a);
const DUR={jet:1.8,end:6.2},TOMB_X=-50.5;
const DMG={P:[],B:null,fl:0,hot:0,lastHp:100,tt:0,
 st(){const d=S.dm=(S.dm&&typeof S.dm==='object')?S.dm:{};d.t=d.t?1:0;d.c=d.c?1:0;d.m=cl(+d.m||0,0,1);return d},
 dent(){return cl((100-(S.hp==null?100:S.hp))/100,0,1)},
 trk(){return !!DMG.st().t},
 spd(){return DMG.trk()?.22:1},                 // leesett lánccal csak vánszorog (vízszintesen)
 busy(){return !!DMG.B},
 gone(){return !!DMG.B&&DMG.B.t>=DUR.jet},
 // a hőterhelés (1 = a páncél határa)
 heatR(){try{const c=calc(),h=H[S.u.h];return S.depth>0?Math.max(c.Tm/h[1],c.P/h[2]):0}catch(e){return 0}},
 // ---- részecskék a gép saját (méteres) koordináta-rendszerében
 spawn(k,x,y,n){for(let i=0;i<(n||1);i++){if(DMG.P.length>260)DMG.P.shift();
  if(k==='smoke')DMG.P.push({k,x,y,vx:R(-.3,.5),vy:R(-1.4,-.7),l:0,L:R(1.4,2.6),r:R(.15,.3)});
  else if(k==='fire')DMG.P.push({k,x,y,vx:R(-.3,.3),vy:R(-2.2,-1.1),l:0,L:R(.35,.7),r:R(.18,.32)});
  else if(k==='spark')DMG.P.push({k,x,y,vx:R(-3.5,3.5),vy:R(-4.5,-.5),l:0,L:R(.25,.7),r:.05});
  else if(k==='drip')DMG.P.push({k,x,y,vx:R(-.1,.1),vy:R(.5,1.5),l:0,L:R(.6,1.2),r:R(.06,.1)})}},
 // ---- játéklogika
 step(dt){const D=DMG.st();DMG.tt+=dt;
  if(D.pend&&!DMG.B){DMG.finish();return}                          // újratöltés a robbanás közben: a végkifejlet azonnal lezajlik
  if(DMG.B){DMG.boom(dt);return}
  if(S.hp>=99.9){if(D.t||D.c||D.m){D.t=0;D.c=0;D.m=0}DMG.lastHp=100;DMG.P.length=0;return}
  const hp=S.hp,dh=DMG.lastHp-hp;DMG.lastHp=hp;
  // ütés / hirtelen sérülés: repedt fej, lehullott lánc
  if(dh>6){D.c=1;if(!D.t&&Math.random()<.5+dh/30){D.t=1;msg('⛓ Leesett a lánc! Csak vánszorogni tudsz – a műhelyben javíthatod.')}DMG.spawn('spark',R(-9,-2),R(-1.6,1.4),14)}
  const r=DMG.heatR();DMG.hot=r;
  if(r>.88){D.m=cl(D.m+(r-.88)*dt*.06,0,1)}
  // lánc: rossz állapotban mozgás közben leesik
  if(!D.t&&hp<40&&(S.st==='L'||S.st==='R')&&Math.random()<dt*.06*(1-hp/40)){D.t=1;msg('⛓ Leesett a lánc! Csak vánszorogni tudsz – a műhelyben javíthatod.');DMG.spawn('spark',-10,1.8,10)}
  // látványelemek
  const d=DMG.dent(),run=S.st!=='idle';
  if(d>.28&&Math.random()<dt*(2+d*9))DMG.spawn('smoke',R(-10.5,-3),-1.5,1);
  if(d>.45&&Math.random()<dt*(d-.35)*9)DMG.spawn('spark',R(-9.5,-3),R(-1.5,1.4),1+(Math.random()*5|0));
  if((d>.72||D.m>.35||r>1.15)&&Math.random()<dt*14)DMG.spawn('fire',R(-9,-4),-1.45,1);
  if(D.m>.25&&Math.random()<dt*D.m*8)DMG.spawn('drip',R(-11,-2),1.45,1);
  if(D.c&&run&&Math.random()<dt*5)DMG.spawn('spark',-.2,R(-.8,.8),1);
  // kritikus: figyelmeztetés
  if(hp<25&&(Math.floor(DMG.tt*1.2)!==Math.floor((DMG.tt-dt)*1.2)))try{beep(1500,.1,.1)}catch(e){}
  for(const p of DMG.P){p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='spark'||p.k==='drip')p.vy+=9*dt}
  DMG.P=DMG.P.filter(p=>p.l<p.L)},
 // ---- a gép rajza (a mach() végén, a gép méteres koordinátáiban)
 mach(x,o){const D=DMG.st(),d=DMG.dent(),m=D.m,ts=o.ts||0;
  const hc=(W.HC&&HC[S.u.h])||['#bbb','#777'];
  if(d>.04||m>.02||D.c||DMG.P.length){x.save();
   // horpadások: sötét mélyedés + fényes perem + gyűrődés-vonalak
   const n=Math.floor(d*8+(d>.02?1:0));
   for(let i=0;i<n;i++){const bx=-11+rnd(i*7+1)*8.6,top=rnd(i*7+2)>.5,by=top?-1.2:1.2,sz=.35+rnd(i*7+3)*.5+d*.35;
    const g=x.createRadialGradient(bx,by,.02,bx,by,sz);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(.65,'rgba(0,0,0,.22)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.ellipse(bx,by,sz,sz*.75,0,0,7);x.fill();
    x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=.04;x.beginPath();x.ellipse(bx,by,sz*.8,sz*.6,0,Math.PI*1.05,Math.PI*1.6);x.stroke();
    x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=.035;x.beginPath();for(let k=0;k<=5;k++){const px=bx-sz*.7+k*sz*.28,py=by+(k%2?-1:1)*sz*.26;k?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
   // meghorpadt, felgyűrődött felső lemez
   if(d>.25){x.fillStyle=hc[1];x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=.04;x.beginPath();x.moveTo(-9.4,-1.5);for(let k=0;k<=8;k++){const px=-9.4+k*.55,py=-1.5-(k%2?.07:.2)*(d-.15)*2.2*(.6+rnd(k+40)*.8);x.lineTo(px,py)}x.lineTo(-5,-1.5);x.closePath();x.fill();x.stroke()}
   // kiszakadt lemez: lyuk, benne sötét gépezet + izzás, lógó kábelek
   if(d>.5){const hx=-6.6,hy=-1.0,s=.6+(d-.5)*1.6;x.fillStyle='#0b0c0e';x.beginPath();x.moveTo(hx-s,hy+.15);x.lineTo(hx-s*.4,hy-.5);x.lineTo(hx+s*.2,hy-.35);x.lineTo(hx+s,hy-.55);x.lineTo(hx+s*.8,hy+.35);x.lineTo(hx,hy+.5);x.closePath();x.fill();
    x.strokeStyle=hc[0];x.lineWidth=.05;x.stroke();x.fillStyle='#2b2e33';x.fillRect(hx-s*.5,hy-.1,s*.5,.18);
    const fl=.5+.5*Math.sin(ts/90+1);x.save();x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,${120+fl*60|0},30,${.18+d*.3})`;x.beginPath();x.ellipse(hx,hy,s*.7,.3,0,0,7);x.fill();x.restore();
    x.strokeStyle='#14161a';x.lineWidth=.06;for(let k=0;k<3;k++){x.beginPath();x.moveTo(hx-s*.4+k*s*.35,hy+.2);x.quadraticCurveTo(hx-s*.4+k*s*.35+.2*Math.sin(ts/300+k),hy+.7,hx-s*.4+k*s*.35+.1,hy+.95+k*.12);x.stroke();x.fillStyle='#f0b020';x.beginPath();x.arc(hx-s*.4+k*s*.35+.1,hy+.95+k*.12,.04,0,7);x.fill()}}
   // égésnyomok
   if(d>.3||m>.1){const g=x.createLinearGradient(0,-1.5,0,-.3);g.addColorStop(0,`rgba(10,8,6,${.2+d*.4})`);g.addColorStop(1,'rgba(10,8,6,0)');x.fillStyle=g;x.fillRect(-10.4,-1.5,6.8,1.2)}
   // olvadás: izzó, megereszkedő burkolat, csöpögő fém
   if(m>.02){x.save();x.globalCompositeOperation='lighter';const g=x.createLinearGradient(0,-1.5,0,1.5);g.addColorStop(0,`rgba(255,90,20,${m*.55})`);g.addColorStop(.5,`rgba(255,200,90,${m*.45})`);g.addColorStop(1,`rgba(255,120,30,${m*.5})`);x.fillStyle=g;x.fillRect(-12,-1.5,10.4,3);x.restore();
    x.fillStyle=`rgba(255,150,40,${.5+.4*m})`;for(let k=0;k<Math.floor(m*7)+1;k++){const bx=-11.4+rnd(k+60)*9.2,L=.2+m*.9*(.5+.5*Math.sin(ts/700+k*1.7)),by=1.45;x.fillRect(bx-.04,by,.08,L);x.beginPath();x.arc(bx,by+L,.075,0,7);x.fill()}
    x.fillStyle='rgba(30,22,16,.75)';for(let k=0;k<Math.floor(m*9);k++){x.beginPath();x.ellipse(-11.2+rnd(k+90)*9,(rnd(k+95)-.5)*2.6,.22+rnd(k+99)*.2,.13,0,0,7);x.fill()}}
   // repedt, lekopott fúrófej: izzó repedések + hiányzó darab
   const hw=clamp01((S.hw||0)/100);const crk=cl(Math.max(D.c?.7:0,(hw-.72)/.28),0,1);
   if(crk>.05){x.save();x.beginPath();x.ellipse(-1.6,0,1.6,1.85,0,-Math.PI/2,Math.PI/2);x.closePath();x.clip();
    x.strokeStyle='rgba(8,8,10,.9)';x.lineWidth=.07;x.beginPath();x.moveTo(-.1,-.1);x.lineTo(-.7,-.55);x.lineTo(-1.0,-.45);x.lineTo(-1.6,-1.2);x.moveTo(-.7,-.55);x.lineTo(-.9,.15);x.lineTo(-1.5,.5);x.lineTo(-1.7,1.3);if(crk>.5){x.moveTo(-.1,-.1);x.lineTo(-.5,.5);x.lineTo(-.3,1.0)}x.stroke();
    x.strokeStyle=`rgba(255,${140+60*Math.sin(ts/200)|0},60,${.35+crk*.4})`;x.lineWidth=.025;x.stroke();
    if(crk>.8){x.fillStyle='#0c0d10';x.beginPath();x.moveTo(-.2,-.9);x.lineTo(-.65,-1.15);x.lineTo(-.9,-.55);x.lineTo(-.55,-.35);x.closePath();x.fill()}x.restore()}
   x.restore()}
  // részecskék (füst, láng, szikra, olvadt csepp)
  if(DMG.P.length){x.save();for(const p of DMG.P){const u=p.l/p.L;
   if(p.k==='smoke'){x.fillStyle=`rgba(40,40,44,${.5*(1-u)})`;x.beginPath();x.arc(p.x,p.y,p.r+u*.7,0,7);x.fill()}
   else if(p.k==='fire'){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,${190-u*120|0},40,${.8*(1-u)})`;x.beginPath();x.arc(p.x,p.y,p.r*(1-u*.5),0,7);x.fill();x.globalCompositeOperation='source-over'}
   else if(p.k==='spark'){x.globalCompositeOperation='lighter';x.strokeStyle=`rgba(255,${230-u*100|0},120,${1-u})`;x.lineWidth=.045;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*.05,p.y-p.vy*.05);x.stroke();x.globalCompositeOperation='source-over'}
   else{x.fillStyle=`rgba(255,160,50,${1-u})`;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}}x.restore()}},
 // ---- robbanás
 explode(why){if(DMG.B||DMG.st().pend)return;const D=DMG.st();D.pend={rec:S.max||0,why:why||'A páncél elvesztette a védőképességét.',t:Date.now(),w:S.depth};
  DMG.B={t:0,x:S.x,d:S.depth,f:(typeof hf!=='undefined'&&hf<0)?-1:1,deb:[],puf:[],sp:[],jets:[[R(-9,-3),-1.5,-1.57+R(-.5,.5)],[R(-10,-4),1.4,1.57+R(-.5,.5)],[-.4,R(-.7,.7),R(-.4,.4)]],blast:0};
  S.st='idle';S.mode='';if(W.NET){NET.falling=false;NET.vz=0}try{alarm3()}catch(e){}msg('🔥 A pajzs felmondta a szolgálatot – A GÉP ROBBAN!');try{save()}catch(e){}},
 snd(){try{if(!AC||!S.set.vol)return;const t=AC.currentTime,v=S.set.vol/100,len=2.4,b=AC.createBuffer(1,AC.sampleRate*len|0,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,2.2);
  const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(90,t+len);const g=AC.createGain();g.gain.value=.9*v;s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);
  const o=AC.createOscillator(),og=AC.createGain();o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(24,t+1.2);og.gain.setValueAtTime(.8*v,t);og.gain.exponentialRampToValueAtTime(.001,t+1.3);o.connect(og);og.connect(AC.destination);o.start(t);o.stop(t+1.4)}catch(e){}},
 boom(dt){const B=DMG.B,pt=B.t;B.t+=dt;S.st='idle';S.mode='';
  if(W.NET){NET.shake=Math.max(NET.shake||0,B.t<DUR.jet?.1+B.t/DUR.jet*.4:B.t<DUR.jet+1.2?1:.2)}
  if(pt<DUR.jet&&B.t>=DUR.jet){ // detonáció
   B.blast=1;DMG.snd();DMG.fl=1;
   const cols=['#8a949e','#5d666f','#c0c6cc','#3a3f45','#d9b84a','#7b8a95'];
   for(let i=0;i<46;i++){const a=R(0,6.283),v=R(5,26);B.deb.push({x:0,y:0,vx:Math.cos(a)*v*1.1,vy:Math.sin(a)*v-R(2,8),w:R(.25,1.3),h:R(.12,.5),a:R(0,6.28),va:R(-9,9),c:cols[i%6],hot:Math.random()<.5})}
   for(let i=0;i<34;i++){const a=R(0,6.283),v=R(1,9);B.puf.push({x:0,y:0,vx:Math.cos(a)*v,vy:Math.sin(a)*v-R(0,3),r:R(1.2,3.2),L:R(2.5,4.6),l:0})}
   for(let i=0;i<110;i++){const a=R(0,6.283),v=R(6,32);B.sp.push({x:0,y:0,vx:Math.cos(a)*v,vy:Math.sin(a)*v,L:R(.5,1.8),l:0})}}
  if(B.blast){for(const p of B.deb){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=14*dt;p.vx*=1-dt*.5;p.a+=p.va*dt}
   for(const p of B.puf){p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=1.2*dt;p.vx*=1-dt*.9;p.vy*=1-dt*.5}
   for(const p of B.sp){p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=10*dt;p.vx*=1-dt*.6}}
  DMG.fl=Math.max(0,DMG.fl-dt*1.7);
  if(B.t>=DUR.end)DMG.finish()},
 // a végleges, kíméletlen újrakezdés (a sírkő kivételével MINDENT elveszít a játékos)
 finish(){const p=(S.dm&&S.dm.pend)||{rec:S.max||0,why:'Felrobbant.',t:Date.now()};
  const tb=(Array.isArray(S.tb)?S.tb:[]).concat([{d:p.rec||0,t:p.t||Date.now(),why:p.why||'',w:p.w||0}]).slice(-8);
  DMG.B=null;DMG.P.length=0;DMG.fl=0;DMG.lastHp=100;
  S=init();S.tb=tb;S.v=window.Save?Save.VER:S.v;
  if(W.NET){NET.falling=false;NET.vz=0;NET.shake=0}try{W.BIT&&BIT.reset();W.DEP&&DEP.reset()}catch(e){}
  try{if(window.Save&&Save.fill){}}catch(e){}
  try{save()}catch(e){}try{view()}catch(e){}
  msg('🪦 Mindent elvesztettél. Új gép, nulla pénz-előny: kezdd elölről! Az emlékhelyet a műhely mellett találod (felszín, bal oldal).')},
 // ---- rajzolás a világban
 world(V){const x=V.x,tb=S.tb;
  // sírkő a műhely mellett, a felszínen
  if(Array.isArray(tb)&&tb.length){const sx=V.SX(TOMB_X);if(sx>-60&&sx<V.w+60&&V.Ys>-120&&V.Ys<V.h+60){DMG.tomb(x,sx,V.Ys,V,tb)}}
  // a robbanás a világban (a gép helyén)
  const B=DMG.B;if(B){const sx=V.SX(B.x-6*B.f),sy=V.SY(B.d),K=V.K;x.save();x.translate(sx,sy);DMG.blast(x,B,K,V);x.restore()}},
 tomb(x,sx,Y0,V,tb){const last=tb[tb.length-1],best=tb.reduce((a,b)=>Math.max(a,b.d||0),0),day=V.day==null?1:V.day;x.save();x.translate(sx,Y0);
  x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(0,1,22,4,0,0,7);x.fill();
  // föld-halom, virág, gyertya
  x.fillStyle=day>.4?'#5a4a36':'#2e2519';x.beginPath();x.ellipse(0,0,19,5,0,Math.PI,0);x.fill();
  const g=x.createLinearGradient(0,-52,0,0);g.addColorStop(0,'#aeb4ba');g.addColorStop(1,'#6e757c');x.fillStyle=g;
  x.beginPath();x.moveTo(-20,0);x.lineTo(-20,-38);x.quadraticCurveTo(-20,-58,0,-58);x.quadraticCurveTo(20,-58,20,-38);x.lineTo(20,0);x.closePath();x.fill();
  x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=1;x.stroke();x.fillStyle='rgba(255,255,255,.22)';x.fillRect(-19,-42,3,42);
  x.fillStyle='#3a3f45';x.fillRect(-1,-53,2,10);x.fillRect(-5,-50,10,2.4);   // kereszt
  x.fillStyle='#2b3036';x.font='bold 5px Georgia';x.textAlign='center';x.fillText('ITT NYUGSZIK',0,-37);x.fillText('A GÉP',0,-30);
  x.font='bold 7px Georgia';x.fillStyle='#1d2227';x.fillText(DMG.fd(best),0,-20);x.font='4px Georgia';x.fillText('rekordmélység',0,-13);
  x.fillStyle='#7a2f2f';for(const[px,c]of[[-23,'#c0463a'],[-26,'#d8b040'],[23,'#c0463a']]){x.fillStyle=c;x.beginPath();x.arc(px,-3,2.2,0,7);x.fill();x.strokeStyle='#2c6a2c';x.beginPath();x.moveTo(px,-1);x.lineTo(px,2);x.stroke()}
  const fl=.7+.3*Math.sin(V.ts/130);x.fillStyle='#e8e0d0';x.fillRect(26,-7,3,7);x.fillStyle=`rgba(255,200,80,${fl})`;x.beginPath();x.ellipse(27.5,-9,1.4,2.6,0,0,7);x.fill();
  if(day<.6){x.save();x.globalCompositeOperation='lighter';const gl=x.createRadialGradient(27.5,-9,0,27.5,-9,22);gl.addColorStop(0,'rgba(255,190,80,.35)');gl.addColorStop(1,'rgba(255,190,80,0)');x.fillStyle=gl;x.fillRect(-4,-35,50,50);x.restore()}
  // tábla az előző rekordokkal
  if(tb.length>1||true){x.fillStyle='#4a3a24';x.fillRect(34,-18,2,18);x.fillStyle='#6b5434';x.fillRect(30,-30,44,13);x.strokeStyle='#2a2013';x.lineWidth=.8;x.strokeRect(30,-30,44,13);x.fillStyle='#f0e6cc';x.font='4.4px Georgia';x.textAlign='left';
   x.fillText('Előző rekord: '+DMG.fd(last.d||0),32,-24);x.fillText('Eddig '+tb.length+'× tört össze',32,-19)}
  x.restore()},
 fd(m){m=+m||0;return m>=1000?(m/1000).toFixed(m>=1e5?0:2).replace('.',',')+' km':Math.round(m)+' m'},
 blast(x,B,K,V){const t=B.t;
  const sc=Math.max(5,K);
  if(t<DUR.jet){ // szúrólángok: vékony, forró lángnyelvek törnek ki a burkolat résein
   const u=t/DUR.jet,f=B.f;for(const j of B.jets){const L=(2+u*7+Math.sin(V.ts/40+j[0])*.8)*K,a=f>0?j[2]:Math.PI-j[2];
    x.save();x.translate((j[0]+6)*f*K,j[1]*K);x.rotate(a);x.globalCompositeOperation='lighter';
    const g=x.createLinearGradient(0,0,L,0);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.25,'rgba(150,200,255,.8)');g.addColorStop(.55,'rgba(255,170,60,.6)');g.addColorStop(1,'rgba(255,60,0,0)');
    x.fillStyle=g;x.beginPath();x.moveTo(0,-.3*K);x.lineTo(L,-.08*K*(1-u*.5));x.lineTo(L,.08*K*(1-u*.5));x.lineTo(0,.3*K);x.closePath();x.fill();x.restore()}
   x.save();x.globalCompositeOperation='lighter';const gl=x.createRadialGradient(0,0,K,0,0,K*(3+u*5));gl.addColorStop(0,`rgba(255,200,120,${.35*u})`);gl.addColorStop(1,'rgba(255,100,30,0)');x.fillStyle=gl;x.fillRect(-K*9,-K*9,K*18,K*18);x.restore();return}
  const u=t-DUR.jet;
  // lökéshullám
  x.save();for(let k=0;k<2;k++){const r=(u*20-k*5)*K;if(r>0&&u<2){x.strokeStyle=`rgba(255,235,200,${Math.max(0,.5-u*.25)/(1+k)})`;x.lineWidth=(6-k*3)*K*.2;x.beginPath();x.arc(0,0,r,0,7);x.stroke()}}x.restore();
  // tűzgömb
  if(u<3){x.save();x.globalCompositeOperation='lighter';for(let k=0;k<2;k++){const r=K*(3+Math.min(u,1)*12)*(1-Math.max(0,u-1.4)/3.2),g=x.createRadialGradient(0,0,0,0,0,Math.max(1,r));const a=Math.max(0,1-u/3);g.addColorStop(0,`rgba(255,255,235,${a})`);g.addColorStop(.35,`rgba(255,210,90,${a})`);g.addColorStop(.7,`rgba(255,110,30,${a*.8})`);g.addColorStop(1,'rgba(120,20,0,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,Math.max(1,r),0,7);x.fill()}x.restore()}
  // füst
  for(const p of B.puf){const q=p.l/p.L;if(q>=1)continue;x.fillStyle=`rgba(${30+q*30|0},${28+q*30|0},${30+q*30|0},${.62*(1-q)})`;x.beginPath();x.arc(p.x*K,p.y*K,(p.r+q*2.2)*K*.55,0,7);x.fill()}
  // törmelék
  for(const p of B.deb){x.save();x.translate(p.x*K,p.y*K);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.w*K*.5,-p.h*K*.5,p.w*K,p.h*K);x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=1;x.strokeRect(-p.w*K*.5,-p.h*K*.5,p.w*K,p.h*K);
   if(p.hot&&u<2.5){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,140,40,${Math.max(0,.6-u*.25)})`;x.fillRect(-p.w*K*.5,-p.h*K*.5,p.w*K,p.h*K)}x.restore()}
  // szikrák
  x.save();x.globalCompositeOperation='lighter';for(const p of B.sp){const q=p.l/p.L;if(q>=1)continue;x.strokeStyle=`rgba(255,${220-q*120|0},100,${1-q})`;x.lineWidth=1.6;x.beginPath();x.moveTo(p.x*K,p.y*K);x.lineTo((p.x-p.vx*.04)*K,(p.y-p.vy*.04)*K);x.stroke()}x.restore()},
 hud(V){if(DMG.fl>.01){const x=V.x;x.save();x.fillStyle=`rgba(255,248,230,${Math.min(1,DMG.fl)})`;x.fillRect(0,0,V.w,V.h);x.restore()}
  if(DMG.B&&DMG.B.t>=DUR.jet+.8){const x=V.x,a=Math.min(1,(DMG.B.t-DUR.jet-.8)/1.2);x.save();x.fillStyle=`rgba(0,0,0,${.55*a})`;x.fillRect(0,0,V.w,V.h);x.fillStyle=`rgba(255,120,90,${a})`;x.font='bold 22px Georgia';x.textAlign='center';x.fillText('A GÉP ELPUSZTULT',V.w/2,V.h*.42);x.font='13px Georgia';x.fillStyle=`rgba(240,230,210,${a})`;x.fillText('Rekordmélység: '+DMG.fd(S.dm&&S.dm.pend?S.dm.pend.rec:S.max),V.w/2,V.h*.42+26);x.fillText('Újrakezdés nulláról…',V.w/2,V.h*.42+46);x.restore()}}
};
const clamp01=v=>cl(v,0,1);
W.DMG=DMG;
// a gombok nem működnek, amíg a robbanás zajlik
if(typeof W.go==='function'){const g0=W.go;W.go=function(s){if(DMG.busy())return;return g0.apply(this,arguments)}}
if(W.on){on('frame',dt=>{try{DMG.step(Math.min(dt,.1))}catch(e){DBG.err='damage: '+(e.message||e)}});on('world.back',V=>DMG.world(V));on('hud',V=>DMG.hud(V))}
})(window);
