/* Drill Up – 1. fázis: hajtómotor (kapcsoló, indítás, terhelés), áramfejlesztő, indítási animáció, dock-kapcsolók.
   A játék magja ettől függetlenül is fut (minden hívás window.ENG/GEN/PW-ellenőrzéssel történik). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('power');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// áramfejlesztő szintek: [név, villamos kW, hatásfok, üzemanyag, tank kg, ár]  (az ár az utolsó elem, mint a többi fejlesztési táblában)
W.GN=[['Gőzdinamó',30,.10,'coal',150,0],['Dízel aggregátor',120,.30,'diesel',400,2.5e5],['Ipari dízelgenerátor',400,.35,'diesel',1200,3e6],['Gázturbinás generátor',1500,.38,'diesel',4000,6e7],['Kompakt reaktor-generátor',6000,.33,'uran',8,1.5e9]];
// régi mentések: semleges kezdőérték (az eddigi világítás megmarad: induló üzemanyaggal bekapcsolt generátor)
if(W.Save)Save.addMig(2,o=>{o.u=o.u&&typeof o.u==='object'?o.u:{};if(o.u.g==null)o.u.g=0;if(o.gf==null)o.gf=60;if(o.gon==null)o.gon=1;o.en=0});

// ================= HAJTÓMOTOR =================
const ENG={rpm:0,hyd:0,ld:0,cr:0,phase:'off',idleT:0,flash:0,burst:0,inited:false,wasReady:0,
 init(){if(ENG.inited)return;ENG.inited=true;if(S.en){ENG.rpm=1;ENG.hyd=1;ENG.phase='run';ENG.wasReady=1}},
 ready(){ENG.init();return S.en==1&&ENG.phase==='run'&&ENG.rpm>=.85&&ENG.hyd>=.7},
 start(){ENG.init();if(S.en)return true;if(S.fuel<=1e-6&&!emerg())return false;
  S.en=1;ENG.phase='crank';ENG.cr=0;ENG.rpm=0;ENG.hyd=0;ENG.idleT=0;ENG.wasReady=0;ENG.snd('crank');return true},
 stop(){ENG.init();if(!S.en)return;S.en=0;ENG.phase='stop';ENG.wasReady=0;ENG.snd('stop');if(S.st!=='idle')go('idle')},
 pre(){return{m:clamp(ENG.rpm/.85,0,1),h:clamp(ENG.hyd/.7,0,1),f:clamp((ENG.rpm-.35)/.5,0,1)}},
 // valós idejű (nem időgyorsított) frissítés a szimuláció elején
 update(real){ENG.init();
  if(!S.en){if(ENG.rpm>0){ENG.rpm=Math.max(0,ENG.rpm-real/1.6);ENG.hyd=Math.max(0,ENG.hyd-real/1.2);ENG.phase=ENG.rpm>0?'stop':'off'}else ENG.phase='off';ENG.ld*=Math.pow(.2,Math.min(real,5));return}
  if(S.fuel<=1e-6&&!emerg()){S.en=0;ENG.phase='stop';msg('⚙ A motor leállt: nincs üzemanyag.');alarm3();return}
  if(ENG.phase==='crank'){ENG.cr+=real;ENG.rpm=Math.min(.18,ENG.cr*.3);if(ENG.cr>=.8){ENG.phase='run';ENG.burst=1;ENG.snd('ignite')}}
  else{ENG.phase='run';const tgt=1-.12*Math.max(0,ENG.ld-.8);ENG.rpm+=(tgt-ENG.rpm)*(1-Math.exp(-real*1.1));ENG.hyd+=((ENG.rpm>.5?1:0)-ENG.hyd)*(1-Math.exp(-real*1.3))}
  if(ENG.phase==='run'&&!ENG.wasReady&&ENG.ready()){ENG.wasReady=1;ENG.flash=1;ENG.snd('ready')}
  if(S.st==='idle'){ // üresjárat: kis fogyasztás, majd automatikus leállás
   const before=ENG.idleT;ENG.idleT+=real;const t=Math.max(0,Math.min(real,120-before));
   if(t>0)S.fuel=Math.max(0,S.fuel-calc().fr*.04*t);
   ENG.ld+=(.08-ENG.ld)*Math.min(1,real*2);
   if(ENG.idleT>120){S.en=0;ENG.phase='stop';ENG.wasReady=0;msg('⚙ A motor leállt (üresjárati időkorlát).');ENG.snd('stop')}
  }else ENG.idleT=0},
 // terhelés: a munka növeli; az üzemanyag-szorzó csak fúrásnál módosít (a haladás fogyasztása fizikai, azt nem szorozzuk)
 work(c,o){const cf=clamp(cargoKg()/cap(),0,1);let ld,fuel=1;
  if(o.trav)ld=o.vert?(o.dd<0?.45+.5*cf:.2):.3+.2*cf;
  else{ld=.55+.45*Math.min(1.3,o.r)+.1*cf;fuel=.4+.6*Math.min(ld,1.3)}
  ENG.ld+=(ld-ENG.ld)*.25;const dr=ENG.ld>.9?1-.35*(ENG.ld-.9):1;
  return{spd:clamp(dr*Math.min(1,ENG.rpm),.3,1),fuel}},
 snd(k){if(!(S.set.vol>0))return;
  if(k==='crank'){scr(.7,260,120,.25,0);clk(520)}
  else if(k==='ignite'){clank(.55);hiss(.25);scr(.6,500,90,.45)}
  else if(k==='ready'){beep(1400,.12,.1)}
  else if(k==='stop'){scr(.5,300,80,.3,0);hiss(.3)}}};
W.ENG=ENG;

// ================= ÁRAMFEJLESZTŐ =================
const GEN={lf:.2,idleT:0,stepped:false,
 g(){return GN[S.u.g]},
 running(){return !!S.gon&&S.gf>1e-6},
 demand(){return 25+(S.mode==='drill'?40:0)+(S.depth>2?15:0)}, // kW – a későbbi fázisok további fogyasztókkal bővítik
 sat(){return GEN.running()?Math.min(1,GN[S.u.g][1]/GEN.demand()):0},
 mult(){return 1-.10*(1-.85*GEN.sat())}, // a hajtómotor teljesítmény-szorzója: generátor nélkül a segédberendezések a motort terhelik
 step(dg){if(!GEN.running())return;const g=GN[S.u.g];GEN.lf=clamp(GEN.demand()/g[1],.2,1);
  S.gf-=g[1]*GEN.lf/(g[2]*F[g[3]].e*1000)*dg;
  if(S.gf<=1e-6){S.gf=0;S.gon=0;msg('⚡ A generátor üzemanyaga elfogyott – leállt.');alarm3()}},
 toggle(){aInit();if(!S.gon){if(S.gf<=1e-6)return toast('⚡ Üres a generátor tankja – tankold a Műhelyben.');S.gon=1;GEN.idleT=0;msg('⚡ Generátor bekapcsolva.');clank(.25);hiss(.15)}else{S.gon=0;msg('⚡ Generátor kikapcsolva.');clank(.2)}PW.live()},
 fill(p){if(!base())return;const g=GN[S.u.g],f=F[g[3]],add=Math.min(g[4]-S.gf,g[4]*p),x=Math.min(add,S.cash/f.p);if(x<=0)return;S.gf+=x;S.cash-=x*f.p;view()},
 afterBuy(k){if(k!=='g')return;const o=GN[S.u.g-1],n=GN[S.u.g];if(o&&o[3]!==n[3]){S.cash+=S.gf*F[o[3]].p*.8;S.gf=0;S.gon=0;msg('⚡ Új generátor-üzemanyag ('+F[n[3]].n+'): tankold újra.')}if(S.gf>n[4])S.gf=n[4]}};
W.GEN=GEN;

// ================= KEZELŐFELÜLET =================
const PW={t:0,
 dock(){return `<button id="swM" class="tb sw" style="font-size:11px;padding:8px 0" onclick="PW.toggleEng()"><i class="led"></i>⚙ Motor</button><button id="swG" class="tb sw" style="font-size:11px;padding:8px 0" onclick="PW.toggleGen()"><i class="led"></i>⚡ Gen.</button>`},
 toggleEng(){aInit();if(S.en){ENG.stop()}else if(!ENG.start())toast('⛽ Nincs üzemanyag a motor indításához.');PW.live()},
 toggleGen(){GEN.toggle()},
 live(){const m=$('#swM'),g=$('#swG');
  if(m){m.className='tb sw '+(!S.en?'':(ENG.ready()?'run':'start'));m.style.setProperty('--p',Math.round(clamp(ENG.rpm,0,1)*100)+'%')}
  if(g){const cap=GN[S.u.g][4],bad=S.gon&&S.gf<=1e-6;g.className='tb sw '+(bad?'bad':GEN.running()?(GEN.sat()<.7?'start':'run'):'');g.style.setProperty('--p',Math.round(clamp(S.gf/cap,0,1)*100)+'%')}},
 info(it){return it('Motor',S.en?(ENG.ready()?'be · terhelés '+Math.round(ENG.ld*100)+'%':'indul…'):'ki')+it('Generátor',(S.gon?(S.gf>1e-6?'be · '+Math.round(GEN.sat()*100)+'% ell.':'üres'):'ki')+' · '+fk(S.gf))}};
W.PW=PW;
const st=document.createElement('style');st.textContent=`.tb.sw{position:relative;overflow:hidden;white-space:nowrap}.tb.sw .led{display:inline-block;width:8px;height:8px;border-radius:50%;background:#555;margin-right:4px;box-shadow:inset 0 0 2px #000}
.tb.sw.run .led{background:#35d06a;box-shadow:0 0 6px #35d06a}.tb.sw.start .led{background:#ffb020;box-shadow:0 0 6px #ffb020;animation:swb .45s infinite}.tb.sw.bad .led{background:#ff3b2f;box-shadow:0 0 6px #ff3b2f}
.tb.sw::after{content:'';position:absolute;left:0;bottom:0;height:3px;width:var(--p,0%);background:#35d06a;opacity:.85}@keyframes swb{50%{opacity:.25}}`;
(document.head||document.body).appendChild(st);

// ================= HANGOK (lustán létrehozott, saját csomópontok) =================
let AU=null,wasLit=false;
function audioInit(){if(AU||typeof AC==='undefined'||!AC)return;AU={};
 AU.eo=AC.createOscillator();AU.eo.type='sawtooth';AU.ef=AC.createBiquadFilter();AU.ef.type='lowpass';AU.ef.frequency.value=160;AU.eg=AC.createGain();AU.eg.gain.value=0;AU.eo.connect(AU.ef);AU.ef.connect(AU.eg);AU.eg.connect(AC.destination);AU.eo.start();
 AU.so=AC.createOscillator();AU.so.type='square';AU.sf=AC.createBiquadFilter();AU.sf.type='bandpass';AU.sf.frequency.value=700;AU.sf.Q.value=2;AU.sg=AC.createGain();AU.sg.gain.value=0;AU.so.connect(AU.sf);AU.sf.connect(AU.sg);AU.sg.connect(AC.destination);AU.so.start();
 AU.go=AC.createOscillator();AU.go.type='sawtooth';AU.gfl=AC.createBiquadFilter();AU.gfl.type='lowpass';AU.gfl.frequency.value=240;AU.gg=AC.createGain();AU.gg.gain.value=0;AU.go.connect(AU.gfl);AU.gfl.connect(AU.gg);AU.gg.connect(AC.destination);AU.go.start();
 if(typeof NB!=='undefined'&&NB){const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=.9;AU.nzg=AC.createGain();AU.nzg.gain.value=0;s.connect(f);f.connect(AU.nzg);AU.nzg.connect(AC.destination);s.start();AU.nz=1}}
function audio(){if(typeof AC==='undefined'||!AC)return;if(!AU)audioInit();if(!AU)return;
 const t=AC.currentTime,v=(S.set.vol||0)/100,tier=S.u.d,rpm=ENG.rpm,prox=S.depth<4?1:.4,f0=[22,24,32,40,48,56,60][tier],run=rpm>.02&&v>0;
 AU.eo.type=tier>=4?'sine':'sawtooth';AU.eo.frequency.setTargetAtTime(f0*(.35+.9*rpm)*(1+(Math.random()-.5)*.03),t,.05);AU.ef.frequency.setTargetAtTime(110+rpm*140,t,.1);
 AU.eg.gain.setTargetAtTime(run?(.04+.08*ENG.ld)*v*(tier>=4?.7:1):0,t,.08);
 AU.so.frequency.setTargetAtTime(90+260*clamp(ENG.cr/.8,0,1)+Math.random()*30,t,.04);AU.sg.gain.setTargetAtTime(ENG.phase==='crank'&&v>0?.06*v:0,t,.05);
 const gr=GEN.running()&&v>0;AU.go.frequency.setTargetAtTime(50*(.97+.06*GEN.sat()),t,.2);AU.gg.gain.setTargetAtTime(gr?(.03+.035*GEN.lf)*v*prox:0,t,.2);
 if(AU.nz)AU.nzg.gain.setTargetAtTime(gr&&GN[S.u.g][3]!=='uran'?(.04+.05*GEN.lf)*v*prox*(Math.random()<.6?1:.4):0,t,.05)}

// ================= RAJZOLÁS ÉS KAMPÓK =================
const rr=(x,a,b,c,d,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)};
function drawGen(V){const x=V.x,Y0=V.Ys;if(Y0<-200||Y0>V.h+200)return;const lv=S.u.g,g=GN[lv],Wm=6+1.2*lv,x0=V.SX(-64),W2=Wm*10;if(x0>V.w+40||x0+W2<-40)return;
 const run=GEN.running(),sh=run?Math.sin(V.ts/37)*.5*GEN.lf:0;
 x.fillStyle='#4a4742';x.fillRect(x0-6,Y0-3,W2+12,5);
 x.fillStyle=['#5b6b4f','#4f6a7a','#6b5b4f','#4a5560','#dfe3e8'][lv];x.fillRect(x0,Y0-28+sh,W2,25);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(x0,Y0-8+sh,W2,5);
 x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;for(let i=1;i<Math.floor(W2/9);i++){x.beginPath();x.moveTo(x0+i*9,Y0-27+sh);x.lineTo(x0+i*9,Y0-4+sh);x.stroke()}
 const fx=x0+W2-14,fy=Y0-16+sh,fa=run?V.ts/40*(.4+GEN.lf):0;x.fillStyle='#222';x.beginPath();x.arc(fx,fy,8,0,7);x.fill();x.strokeStyle='#8a8e95';x.lineWidth=2;for(let i=0;i<3;i++){const a=fa+i*2.094;x.beginPath();x.moveTo(fx,fy);x.lineTo(fx+7*Math.cos(a),fy+7*Math.sin(a));x.stroke()}
 if(g[3]==='uran'){x.fillStyle='#e8ecef';x.beginPath();x.arc(x0+W2*.35,Y0-28+sh,W2*.22,Math.PI,0);x.fill();if(run)V.GL.push({x:x0+W2*.35,y:Y0-34,r:60,c:'90,200,255',i:.25})}
 else{x.fillStyle='#2c2c2c';x.fillRect(x0+W2*.3,Y0-50+sh,6,24);x.fillRect(x0+W2*.3-2,Y0-52+sh,10,3)}
 x.fillStyle='#8c9aa5';rr(x,x0+4,Y0-13,W2*.24,10,3);x.fill();
 const led=!S.gon?'#777':S.gf<=1e-6?'#ff3b2f':GEN.sat()<.7?'#ffb020':'#35d06a';x.fillStyle=led;x.beginPath();x.arc(x0+8,Y0-22+sh,2.5,0,7);x.fill();
 x.strokeStyle='#1b1b1d';x.lineWidth=2;x.beginPath();x.moveTo(x0+W2,Y0-20);x.quadraticCurveTo((x0+W2+V.SX(-46))/2,Y0+6,V.SX(-46),Y0-10);x.stroke();
 if(run&&V.dt>0&&g[3]!=='uran'&&Math.random()<V.dt*7*GEN.lf)pr.push({x:-64+Wm*.3+.3,y:-5.2,vx:.5,vy:-1.6,l:2.4,t:g[3]==='coal'?'s':'k'});
 if(run&&V.day<.6)V.lamp(x0+8,Y0-22,50,.6)}
function drawHud(V){const starting=S.en&&!(ENG.phase==='run'&&ENG.ready());if(!starting&&ENG.flash<=0)return;
 const x=V.x,p=ENG.pre(),cx=V.w/2,y0=44;x.save();x.globalAlpha=starting?1:clamp(ENG.flash,0,1);
 x.fillStyle='rgba(10,8,6,.86)';rr(x,cx-104,y0,208,starting?56:28,8);x.fill();x.strokeStyle='#f0a030';x.lineWidth=1;x.stroke();
 x.font='bold 10px Georgia';x.textAlign='left';
 if(starting){x.fillStyle='#f0a030';x.fillText('INDÍTÁSI ELLENŐRZÉS',cx-96,y0+13);
  [['MOTOR',p.m],['HIDR.',p.h],['FÚRÓ',p.f]].forEach(([n,v],i)=>{const yy=y0+25+i*10;x.fillStyle='#bfb09a';x.font='9px Georgia';x.fillText(n,cx-96,yy+6);x.fillStyle='#2a2118';x.fillRect(cx-56,yy,120,6);x.fillStyle=v>=1?'#35d06a':'#f0a030';x.fillRect(cx-56,yy,120*v,6);x.fillStyle=v>=1?'#35d06a':'#7a6a55';x.fillText(v>=1?'✔':Math.round(v*100)+'%',cx+70,yy+6)})}
 else{x.fillStyle='#35d06a';x.textAlign='center';x.fillText('✔ KÉSZ – FÚRÁS',cx,y0+18)}
 x.restore()}
if(W.on){
 on('world.back',V=>{try{drawGen(V)}catch(e){}});
 on('hud',V=>{drawHud(V)});
 on('world.front',V=>{if(ENG.burst){ENG.burst=0;if(S.u.d<4&&V.lw){const[a,b]=S.u.d<2?V.lw(-11.15,-2.1-V.sk):V.lw(-10,-2.9);for(let i=0;i<16;i++)pr.push({x:V.rx+(a-V.cx)/V.K,y:V.ry+(b-V.cy)/V.K,vx:(Math.random()-.5)*1.6,vy:-1.2-Math.random()*2.2,l:1.6+Math.random()*1.4,t:S.u.d<2?'s':'k'})}}});
 on('step',dg=>{GEN.stepped=true;GEN.step(dg)});
 on('sim',real=>{if(S.st==='idle'&&!GEN.stepped)GEN.step(Math.min(real,900));GEN.stepped=false;
  if(S.st==='idle'&&S.depth<2&&S.gon){GEN.idleT+=real;if(GEN.idleT>300){S.gon=0;msg('⚡ A generátor leállt (a bázison hosszan tétlen volt).')}}else GEN.idleT=0});
 on('frame',dt=>{ENG.flash=Math.max(0,ENG.flash-dt/.9);PW.t+=dt;if(PW.t>=.08){PW.t=0;try{audio()}catch(e){}}});
}
})(typeof window!=='undefined'?window:globalThis);
