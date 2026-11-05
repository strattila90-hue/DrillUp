/* Drill Up – kazán és gőzrendszer (fejleszthető: Műhely → „Kazán és gőzrendszer").
   • Tűz + nyomás: a kazán tüzét kézzel kell etetni (🔥 gomb); a nyomás a tűzből és a terhelésből adódik. Túl kevés nyomás: lassabb gép,
     túl sok: a szelepet kell nyitni (♨ gomb, nyomva tartva) – különben a páncél sérül, végül a kazán megreped (szivárgás).
   • Hallható gép: a „csuffogás" üteme és hangereje a terheléssel és a nyomással változik; a szelep sípol és sziszeg.
   • Helyszíni javítás (🔧 gomb nyomva tartva): a szivárgás és a leesett lánc a mélyben is megjavítható; a kazán szintjével gyorsabban.
   • Látvány: nyomásmérő, lengőkar/lendkerék a gép tetején, gőzfelhők a szelepből, szivárgásból és a kéményből.
   Állapot: S.kz = {p: nyomás (1,0 = névleges), f: tűz 0..1, lk: szivárgás}; S.u.b = kazán-szint. Hiányzó mező pótolódik.
   Offline / hosszú szünet után (≥5 s egy lépésben) semmi sem romlik: a tűz és a nyomás biztonságos értékre áll. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('steam');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
// [név, szelep (0 kézi, 1 biztonsági túlnyomás-szelep, 2 nyomásszabályozó), adagoló (0 kézi, 1 lassú égésű, 2 automata), javítás mp, öngyógyító, ár]
W.BL=[['Kézi kazán',0,0,5,0,0],['Biztonsági szelepes kazán',1,0,4,0,4e5],['Nyomásszabályozós kazán',2,1,3,0,8e6],['Automata tüzelésű kazán',2,2,2,0,1.2e8],['Intelligens kazánvezérlő',2,2,1,1,2e9]];
const BAR=16; // 1,0 névleges nyomás = 16 bar (kijelzés)
const STM={held:0,rh:0,rp:0,vl:0,rl:0,sl:0,ch:0,pf:0,bt:0,sc:0,al:0,A:null,burst:0,
 st(){if(typeof S==='undefined'||!S)return null;let o=S.kz;if(!o||typeof o!=='object'||Array.isArray(o))o=S.kz={};
  const n=(k,v)=>{if(!isFinite(o[k]))o[k]=v};n('p',.7);n('f',.6);o.lk=o.lk?1:0;o.p=cl(o.p,0,1.5);o.f=cl(o.f,0,1);
  if(S.u&&typeof S.u==='object'&&!isFinite(S.u.b))S.u.b=0;return o},
 lv(){try{return cl((S.u&&S.u.b)|0,0,BL.length-1)}catch(e){return 0}},
 B(){return BL[STM.lv()]},
 // a hajtómotor teljesítmény-szorzója: hideg kazánnal lassabb (a calc() szorozza)
 mult(){try{const o=S&&S.kz;if(!o||!isFinite(o.p))return 1;return .75+.25*cl(o.p/.7,0,1)}catch(e){return 1}},
 chain(){try{return !!(W.DMG&&DMG.st&&DMG.st().t)}catch(e){return false}},
 faults(){const o=STM.st();return(o&&o.lk?1:0)+(STM.chain()?1:0)},
 need(){const B=STM.B(),o=STM.st();return o&&o.lk?B[3]:STM.chain()?B[3]*1.6:0},
 active(){return typeof S!=='undefined'&&S&&(S.depth>.5||S.st!=='idle'||S.en)},
 // világkoordináta a gép helyi (méteres) pontjához
 wp(a,b){const d=(typeof yaw!=='undefined'&&Math.cos(yaw)<0)?-1:1,A=typeof ang!=='undefined'?ang:0,cA=Math.cos(A),sA=Math.sin(A);
  return[(typeof rx!=='undefined'?rx:S.x)+d*a*cA-b*sA,(typeof ry!=='undefined'?ry:S.depth)+d*a*sA+b*cA]},
 puff(a,b,n,o){if(typeof pr==='undefined'||!Array.isArray(pr))return;o=o||{};for(let i=0;i<n;i++){const[x,y]=STM.wp(a+(Math.random()-.5)*.3,b);const l0=(o.l||1.3)*(.7+Math.random()*.6);
   pr.push({t:'du',x,y,vx:(o.vx||0)+(Math.random()-.5)*(o.sp||1.2),vy:(o.vy==null?-2.4:o.vy)+(Math.random()-.5)*.8,l:l0,L0:l0,r0:o.r||(3+Math.random()*3),col:o.col||'232,235,240'})}},
 spark(a,b,n){if(typeof pr==='undefined'||!Array.isArray(pr))return;for(let i=0;i<n;i++){const[x,y]=STM.wp(a,b);pr.push({t:'sp',x,y,vx:(Math.random()-.3)*5,vy:-1-Math.random()*4,l:.3+Math.random()*.4})}},
 // ---- játékos műveletek ----
 stoke(){const o=STM.st();if(!o||STM.B()[2]===2)return;if(Date.now()-STM.sc<450)return;STM.sc=Date.now();
  if(S.fuel<=1e-6){try{toast('⛽ Nincs mit a tűzre vetni – üres a tank.')}catch(e){}return}
  o.f=cl(o.f+.28,0,1);STM.spark(-6.8,.9,6);STM.puff(-11.15,-2.4,2,{col:'90,90,95',vy:-1.8,r:3,l:1.6});try{clank(.18)}catch(e){}if(W.navigator&&navigator.vibrate)try{navigator.vibrate(15)}catch(e){}},
 ventDown(){const o=STM.st();if(!o)return;STM.held=1;o.p=Math.max(0,o.p-.05);try{aInit()}catch(e){}},
 ventUp(){STM.held=0},
 repDown(){STM.rh=1;try{aInit()}catch(e){}},
 repUp(){STM.rh=0},
 // ---- fizika (valós idejű lépés) ----
 hard(){try{return W.FACE?FACE.hard():0}catch(e){return 0}},
 load(){const en=!!S.en,act=S.st!=='idle';return !en?0:!act?.1:(S.mode==='drill'?.7+.3*cl(STM.hard(),0,1):.45)},
 step(dt){const o=STM.st();if(!o)return;const B=STM.B(),en=!!S.en,L=STM.load(),hist=o.p;
  // tűz: kézi tüzelésnél fogy, automata adagolónál állandó
  if(B[2]===2){if(en)o.f+=(.74-o.f)*Math.min(1,dt*.8)}
  else if(en)o.f=Math.max(0,o.f-dt*(B[2]===1?.006:.012)*(.4+L*.9));
  const Pt=en?o.f*(1.45-.4*L):o.f*.25;o.p+=(Pt-o.p)*cl(dt*.45,0,1);
  // szivárgás: nyomás- és üzemanyag-veszteség, gőzsugár; az intelligens vezérlő magától lezárja
  if(o.lk){o.p=Math.max(0,o.p-.06*dt);if(S.fuel>0)S.fuel*=1-.0003*dt;STM.pf-=dt;if(STM.pf<=0){STM.pf=.18;STM.puff(-6.2,.6,1,{vy:-1.6,sp:1.6,r:2.5,l:.9,col:'210,215,225'})}
   if(B[4]){STM.sl+=dt;if(STM.sl>10){STM.sl=0;o.lk=0;try{msg('🤖 Az intelligens kazánvezérlő lezárta a szivárgást.',true)}catch(e){}}}else STM.sl=0}
  else STM.sl=0;
  // szelepek: kézi (nyomva tartva), biztonsági túlnyomás-szelep, nyomásszabályozó
  let vent=0;if(STM.held)vent=.7;
  if(B[1]===1){if(o.p>1.12)STM.rl=1;if(o.p<1.02)STM.rl=0;if(STM.rl)vent=Math.max(vent,.5)}
  else if(B[1]===2&&o.p>.98)vent=Math.max(vent,.35+Math.min(.4,(o.p-.98)*3));
  if(vent>0&&o.p>.05){o.p=Math.max(0,o.p-vent*dt);STM.vl+=(1-STM.vl)*Math.min(1,dt*10);if(Math.random()<dt*14)STM.puff(-9.4,-2.4,1,{vy:-3.2,sp:1.4,r:4+Math.random()*3,l:1.5})}
  else STM.vl+=(0-STM.vl)*Math.min(1,dt*6);
  // túlnyomás: figyelmeztetés, sérülés, repedés (csak biztonsági szelep nélkül lehetséges)
  if(o.p>1.05&&B[1]<1){STM.al-=dt;if(STM.al<=0){STM.al=1.4;try{beep(1100,.12,.07,'square')}catch(e){}if(!STM.warned){STM.warned=1;try{toast('♨ Túl magas a kazánnyomás – nyisd a szelepet (♨ gomb, nyomva tartva)!')}catch(e){}}}}
  if(o.p<.95)STM.warned=0;
  if(o.p>1.25&&B[1]<1&&S.hp>5)S.hp=Math.max(5,S.hp-(o.p-1.25)*6*dt);
  if(o.p>=1.4&&B[1]<1){o.p=.5;o.lk=1;if(S.hp>5)S.hp=Math.max(5,S.hp-6);STM.puff(-8,-1.5,10,{vy:-3,sp:4,r:6,l:1.6});STM.spark(-8,-1.5,12);try{msg('💥 A kazán megrepedt a túlnyomástól! Szivárog – javítsd (🔧 gomb), és tarts szelepet.',true);alarm3&&alarm3()}catch(e){}}
  // kémény: a nyomással és a terheléssel arányos füst
  if(en&&Math.random()<dt*(2+8*L*o.p)){STM.puff(-11.15,-2.4,1,{vy:-2.2,sp:.8,r:3,l:1.8,col:o.f>.5?'150,150,155':'80,80,86'})}
  // helyszíni javítás: nyomva tartva fut az idő, elengedve gyorsan visszacsúszik
  const nd=STM.need();if(STM.rh&&nd>0){STM.rp+=dt;STM.rcl=(STM.rcl||0)-dt;if(STM.rcl<=0){STM.rcl=.45;try{clank(.14)}catch(e){}STM.spark(-6.2,.6,3)}
   if(STM.rp>=nd){STM.rp=0;if(o.lk){o.lk=0;try{msg('🔧 A szivárgást elzártad a mélyben is.',true)}catch(e){}}else if(STM.chain()){try{DMG.st().t=0;msg('🔧 A láncot visszatetted – a gép újra teljes sebességgel megy.',true)}catch(e){}}}}
  else STM.rp=Math.max(0,STM.rp-dt*2)},
 // hosszú szünet / háttérben futás után: biztonságos állapot
 away(){const o=STM.st();if(!o)return;o.f=Math.max(o.f,.6);o.p=cl(o.p,.3,.95);STM.held=0;STM.rh=0;STM.rp=0},
 // ---- hang ----
 aud(dt){if(typeof AC==='undefined'||!AC||typeof NB==='undefined'||!NB)return;
  if(!STM.A){const A=STM.A={};const mk=(ty,f,q)=>{const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const fl=AC.createBiquadFilter();fl.type=ty;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(Math.random());return{fl,g}};
   A.hiss=mk('highpass',2800,.7);A.ch=mk('bandpass',260,1.1);A.wo=AC.createOscillator();A.wo.type='sine';A.wo.frequency.value=900;A.wg=AC.createGain();A.wg.gain.value=0;A.wo.connect(A.wg);A.wg.connect(AC.destination);A.wo.start()}
  const A=STM.A,t=AC.currentTime,v=(S.set.vol||0)/100,o=STM.st();if(!o)return;
  A.hiss.g.gain.setTargetAtTime(STM.vl*.13*v,t,.05);A.wg.gain.setTargetAtTime(STM.vl>.3&&v>0?.035*v*STM.vl:0,t,.05);A.wo.frequency.setTargetAtTime(820+STM.vl*260+o.p*180,t,.08);
  // csuffogás: ütem és hangerő a terheléssel; elektromos / reaktoros hajtásnál nincs
  const run=S.en&&(S.st!=='idle'||(typeof rate!=='undefined'&&rate>.3))&&S.u.d<4&&v>0;STM.ch-=dt;
  if(run&&STM.ch<=0){const L=STM.load(),pw=.4+.6*cl(o.p/.8,0,1);STM.ch=(.62-.4*L)*(S.u.d>=2?.8:1);
   A.ch.fl.frequency.setValueAtTime((S.u.d>=2?150:230)+130*L*pw,t);A.ch.g.gain.cancelScheduledValues(t);A.ch.g.gain.setValueAtTime(0,t);A.ch.g.gain.linearRampToValueAtTime((.1+.2*L)*pw*v,t+.025);A.ch.g.gain.exponentialRampToValueAtTime(.001,t+.16)}
  else if(!run&&STM.ch<=0)STM.ch=.3},
 // ---- kezelőfelület: kerek gombok a játéktér bal alsó részén (a 🎬 👁 📖 🎓 gombok után, 184 px-től) ----
 btns(){if(typeof document==='undefined'||!document.getElementById)return;const st=document.getElementById('stage');if(!st)return;
  if(!document.getElementById('stmF')){const mk=(id,ic,lab,l)=>{const b=document.createElement('button');b.id=id;b.className='stmb';b.setAttribute('aria-label',lab);b.textContent=ic;b.style.left=l+'px';st.appendChild(b);return b};
   const f=mk('stmF','🔥','Tüzelés',184),v=mk('stmV','♨','Szelep (nyomva tartva)',228),r=mk('stmR','🔧','Javítás (nyomva tartva)',272);
   const ev=(b,dn,up)=>{b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{b.setPointerCapture(e.pointerId)}catch(x){}dn()});['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,e=>{e.stopPropagation();up()}))};
   ev(f,()=>STM.stoke(),()=>{});ev(v,()=>STM.ventDown(),()=>STM.ventUp());ev(r,()=>STM.repDown(),()=>STM.repUp())}
  const on=STM.active()&&!(W.CIN&&CIN.on),o=STM.st(),B=STM.B(),f=document.getElementById('stmF'),v=document.getElementById('stmV'),r=document.getElementById('stmR');
  f.style.display=on&&B[2]<2?'':'none';v.style.display=on?'':'none';r.style.display=on&&STM.faults()?'':'none';
  if(o){v.classList.toggle('hot',o.p>1.0);v.classList.toggle('on',!!STM.held);f.classList.toggle('low',o.f<.2);const nd=STM.need();r.style.setProperty('--p',(nd>0?Math.round(100*cl(STM.rp/nd,0,1)):0)+'%')}},
 // ---- kijelző: kártya a páncél-kártya alatt ----
 hud(V){if(!STM.active()||(W.PN&&!PN.vis('kz'))||(W.CIN&&CIN.on))return;const o=STM.st();if(!o)return;const x=V.x,B=STM.B(),hr=W.PN?PN.rc('hull'):null,X=6,Y=hr?hr.y+hr.h+6:104,w=122,h=46;
  if(W.PN)PN.reg('kz',X,Y,w,h);
  const hot=o.p>1.05&&B[1]<1,bl=(hot||o.lk)&&Math.floor(V.ts/280)%2===0;x.save();x.fillStyle='rgba(8,10,12,.97)';x.strokeStyle=bl?'#ff4a3a':'rgba(255,255,255,.18)';x.lineWidth=1;x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,6):x.rect(X,Y,w,h);x.fill();x.stroke();
  x.textBaseline='alphabetic';x.textAlign='left';x.font='bold 9px Georgia';x.fillStyle='#cdbfa8';x.fillText('♨ KAZÁN',X+8,Y+12);x.textAlign='right';x.font='bold 11px Georgia';x.fillStyle=o.p>1.2?'#ff5a45':o.p>1?'#f0b83a':'#58e07c';x.fillText((o.p*BAR).toFixed(1).replace('.',',')+' bar',X+w-20,Y+12);
  const bx=X+8,bw=w-16;x.fillStyle='#2a2118';x.fillRect(bx,Y+19,bw,6);const pw=bw*cl(o.p/1.5,0,1);x.fillStyle=o.p>1.2?'#ff5a45':o.p>1?'#f0b83a':o.p<.4?'#5ab0e8':'#58e07c';x.fillRect(bx,Y+19,pw,6);
  x.fillStyle='rgba(255,255,255,.85)';x.fillRect(bx+bw/1.5-.5,Y+17,1,10); // névleges határ
  x.fillStyle='#bfb09a';x.font='9px Georgia';x.textAlign='left';x.fillText(B[2]===2?'TŰZ · AUTO':'TŰZ',bx,Y+37);x.fillStyle='#2a2118';x.fillRect(bx+(B[2]===2?52:24),Y+31,bw-(B[2]===2?52:24),6);x.fillStyle=o.f<.2?'#ff5a45':'#ff9a30';x.fillRect(bx+(B[2]===2?52:24),Y+31,(bw-(B[2]===2?52:24))*o.f,6);
  if(STM.faults()){x.textAlign='right';x.font='11px Georgia';x.fillStyle='#fff';x.fillText((o.lk?'💧':'')+(STM.chain()?'⛓':''),X+w-8,Y+38)}
  x.restore()},
 // ---- látvány a gép testén (helyi méter-koordináták): lendkerék + lengőkar + nyomásmérő ----
 mach(x,o){const k=S.kz;if(!k)return;const act=o.act,ph=o.ph||0,ts=o.ts||0,run=S.en?1:0,a=act?ph*6:(run?ts/240:0),lv=STM.lv(),p=k.p;
  x.save();x.lineCap='round';
  // lendkerék és hajtókar
  const cx=-9.6,cy=-2.38,r=.32;x.fillStyle='#2b2d31';x.strokeStyle='#8a8d92';x.lineWidth=.05;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.stroke();
  x.strokeStyle='#5a5d62';x.lineWidth=.04;for(let i=0;i<3;i++){const t=a+i*2.094;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(t)*r*.9,cy+Math.sin(t)*r*.9);x.stroke()}
  const px=cx+Math.cos(a)*r*.8,py=cy+Math.sin(a)*r*.8,hx=-8.05+Math.cos(a)*.08;x.strokeStyle='#b9bcc2';x.lineWidth=.06;x.beginPath();x.moveTo(px,py);x.lineTo(hx,-2.38);x.stroke();
  // hengerblokk + dugattyúszár
  x.fillStyle='#3a3d42';x.fillRect(-7.9,-2.55,1.0,.34);x.fillStyle='#55585e';x.fillRect(-7.9,-2.55,1.0,.05);x.fillStyle='#d0d4d8';x.fillRect(hx-.06,-2.43,.12,.1);
  // nyomásmérő: a mutató a nyomást, a piros sáv a veszélyzónát mutatja
  const gx=-6.35,gy=-2.5,gr=.3;x.fillStyle='#e8e4d8';x.beginPath();x.arc(gx,gy,gr,0,7);x.fill();x.strokeStyle='#444';x.lineWidth=.05;x.stroke();
  x.strokeStyle='#d8412f';x.lineWidth=.06;x.beginPath();x.arc(gx,gy,gr*.72,Math.PI*(.75+1.5*(1/1.5)),Math.PI*2.25);x.stroke();
  const t=Math.PI*.75+Math.PI*1.5*cl(p/1.5,0,1)+(p>1?Math.sin(ts/40)*.03:0);x.strokeStyle='#111';x.lineWidth=.05;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(t)*gr*.8,gy+Math.sin(t)*gr*.8);x.stroke();
  // szelep-kerék (a magasabb szintű kazánon biztonsági szelep: piros sapka)
  x.fillStyle=lv>=1?'#c0392b':'#8a8d92';x.beginPath();x.arc(-9.4,-2.12,.12,0,7);x.fill();
  x.restore()},
 afterBuy(k){if(k!=='b')return;try{const B=STM.B();msg('♨ Új kazán: '+B[0]+'.',true)}catch(e){}}};
W.STM=STM;
if(W.on){
 on('sim',real=>{try{if(real>=5)STM.away();else STM.step(Math.min(real,1))}catch(e){if(W.DBG)DBG.err='steam: '+(e.message||e)}});
 on('frame',dt=>{try{STM.bt+=dt;if(STM.bt>.25){STM.bt=0;STM.btns()}STM.aud(Math.min(dt,.1))}catch(e){if(W.DBG)DBG.err='steam: '+(e.message||e)}});
 on('hud',V=>{try{STM.hud(V)}catch(e){if(W.DBG)DBG.err='steam: '+(e.message||e)}});
}
if(W.setTimeout)setTimeout(()=>{try{if(W.PN&&PN.NAMES&&!PN.NAMES.kz)PN.NAMES.kz=['♨','Kazán-kijelző'];STM.st()}catch(e){}},0);
})(typeof window!=='undefined'?window:globalThis);
