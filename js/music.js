/* DrillUp Core Quest – háttérzene: eredeti, generatív kalandfilm-/kutatóállomás-hangulatú zene (Web Audio, nincs hangfájl).
   Rétegek: vonós pad, tekergő basszusriff, timpani + shaker, marimba-arpeggiók, rézfúvós-szerű motívumok.
   A zene a játék állapotát követi: a felszínen/álló gépnél szelíd, fúrásnál lendületes, mélyen sötétebb és lassabban lüktet.
   Önálló Zene-hangerő (S.set.mus, 0–100); a hangmotor (AC) és a zajpuffer (NB) a játéké. Nincs hangkörnyezet / ki van kapcsolva → nem csinál semmit.
   A zenei terv (MUS.plan) tiszta függvény: ugyanabból a magból ugyanaz a ütem – tesztelhető. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('music');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const hz=m=>440*Math.pow(2,(m-69)/12);
// kis, determinisztikus véletlen (mulberry32)
const rng=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
// ---- zenei anyag (A-moll / frígiai-dominás ízű, eredeti fordulatok) ----
// akkordok: gyökér (MIDI), hangok a gyökértől
const CH={Am:[45,[0,7,12,15]],F:[41,[0,7,12,16]],G:[43,[0,7,12,16]],Em:[40,[0,7,12,15]],E7:[40,[0,7,12,16]],Dm:[38,[0,7,12,15]],C:[48,[0,7,12,16]],Bb:[46,[0,7,12,16]]};
const PROG=[['Am','F','G','Em'],['Am','G','F','E7'],['Dm','F','G','E7'],['Am','C','G','E7'],['Am','Am','F','E7']];
// A-moll hangsor fokai (A=0): 0 2 3 5 7 8 10 (természetes) + 11 (E7 felett)
const SCALE=[0,2,3,5,7,8,10,12,14,15,17,19];
// motívum-könyvtár: [lépések 16-odokban, skálafok-index]; 8 hangos, szinkópás, "felfelé törekvő" fordulatok
const MOT=[
 [[0,4],[3,4],[6,6],[8,5],[11,4],[12,2]],
 [[0,2],[2,4],[4,6],[8,7],[11,6],[12,4]],
 [[0,4],[4,4],[6,5],[8,6],[12,8],[14,6]],
 [[0,0],[3,2],[6,4],[8,4],[10,5],[12,4]],
 [[0,6],[3,5],[6,4],[8,2],[11,4],[14,5]]];
const STEP_BPM=112;
function chordAt(bar,prog){const p=PROG[prog%PROG.length];return CH[p[bar%4]]}
// egy ütem terve: események {s: lépés 0..15, k: hangszer, m: MIDI, d: hossz (lépés), v: erő 0..1}
function plan(bar,intensity,seed,deep){
 const r=rng((seed|0)*7919+bar*104729),I=cl(intensity,0,1),prog=((bar/4)|0)+(seed|0)&7,ch=chordAt(bar,prog),root=ch[0]+(deep?-12:0),ev=[];
 const tones=ch[1].map(x=>root+x);
 // pad: az egész ütemre (mindig)
 for(const x of[0,7,12])ev.push({s:0,k:'pad',m:root+x+12,d:16,v:.5});
 // mély drón az ütem elején
 ev.push({s:0,k:'drone',m:root-12,d:16,v:.5});
 if(I>=.18){ // marimba-arpeggio: ritka, véletlen elhagyásokkal
  const dens=.25+.5*I;let k=0;for(let s=0;s<16;s+=2){if(r()<dens){const t=tones[(k++)%tones.length]+(r()<.25?12:24);ev.push({s,k:'mar',m:t,d:2,v:.35+.4*r()})}}}
 if(I>=.35){ // basszusriff (pengetett)
  const pat=I>.7?[0,3,6,8,10,12,14]:[0,3,8,11];for(const s of pat){const o=s===8?7:s===12?12:0;ev.push({s,k:'bass',m:root+o,d:2,v:.55+.3*I})}}
 if(I>=.3){ // timpani: ütem eleje + szinkóp, intenzíven több
  ev.push({s:0,k:'timp',m:0,d:2,v:.7});ev.push({s:10,k:'timp',m:0,d:2,v:.55});if(I>.65)ev.push({s:6,k:'timp',m:0,d:2,v:.45});if(I>.85)ev.push({s:14,k:'timp',m:0,d:2,v:.4})}
 if(I>=.45){ // shaker/clave
  for(let s=0;s<16;s+=2)ev.push({s,k:'shk',m:0,d:1,v:(s%4===0?.5:.3)*(.6+.4*I)});
  if(I>.6){ev.push({s:3,k:'clv',m:0,d:1,v:.5});ev.push({s:11,k:'clv',m:0,d:1,v:.45})}}
 // dallam: kétütemenként, 2 ütemből az első; mélyen nincs rézfúvós, helyette lassú, sötét fordulat
 if(bar%2===0&&I>=.4&&r()<.8){const m=MOT[(r()*MOT.length)|0],base=57+(deep?-12:0);
  for(const[s,deg]of m){const sc=SCALE[deg%SCALE.length]+(deg>=SCALE.length?12:0);ev.push({s,k:deep?'mar':'brs',m:base+sc,d:deep?2:3,v:.55+.35*I})}}
 return ev}
// ---- hangszerek (Web Audio) ----
function env(g,t,a,d,s,rel,v){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.linearRampToValueAtTime(v*s,t+a+d);g.gain.setTargetAtTime(0,t+a+d+Math.max(0,rel-.2),.08)}
const MUS={on:false,run:false,I:.25,deep:false,seed:((Date.now()/864e5)|0)%97,bar:0,nextT:0,timer:0,out:null,plan,hz,
 vol(){const v=typeof S!=='undefined'&&S.set&&S.set.mus!=null?S.set.mus:45;return cl(+v||0,0,100)/100},
 // célintenzitás a játék állapotából: 0 szelíd … 1 feszült
 target(){if(typeof S==='undefined')return .25;const act=S.st&&S.st!=='idle',d=S.depth||0;let t=act?.72:.22;if(d<8&&!act)t=.2;if(W.NET&&NET.falling)t=1;if(d>2890e3)t=Math.min(t,.6);return t},
 ensure(){if(MUS.out)return true;if(typeof AC==='undefined'||!AC||typeof NB==='undefined')return false;
  try{const g=AC.createGain();g.gain.value=0;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=5200;g.connect(f);f.connect(AC.destination);MUS.out=g;MUS.flt=f;return true}catch(e){MUS.out=null;return false}},
 note(k,m,t,dur,v){const o=MUS.out;if(!o)return;const AC_=AC,sv=v;
  const mk=(type,f,detune)=>{const x=AC_.createOscillator();x.type=type;x.frequency.value=f;if(detune)x.detune.value=detune;return x};
  const stop=(nodes,t1)=>{for(const n of nodes){try{n.stop(t1)}catch(e){}}};
  if(k==='pad'){const g=AC_.createGain(),fl=AC_.createBiquadFilter();fl.type='lowpass';fl.frequency.value=900;fl.Q.value=.4;const a=[mk('sawtooth',hz(m),-7),mk('sawtooth',hz(m),6)];a.forEach(x=>{x.connect(fl);x.start(t)});fl.connect(g);g.connect(o);env(g,t,.7,.6,.7,dur+.9,.05*sv);stop(a,t+dur+1.6)}
  else if(k==='drone'){const g=AC_.createGain(),x=mk('sine',hz(m));x.connect(g);g.connect(o);env(g,t,.5,.5,.8,dur+.8,.09*sv);x.start(t);x.stop(t+dur+1.4)}
  else if(k==='mar'){const g=AC_.createGain(),a=mk('sine',hz(m)),b=mk('triangle',hz(m)*4);const gb=AC_.createGain();gb.gain.value=.08;a.connect(g);b.connect(gb);gb.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16*sv,t+.006);g.gain.setTargetAtTime(0,t+.02,.11);a.start(t);b.start(t);stop([a,b],t+.9)}
  else if(k==='bass'){const g=AC_.createGain(),fl=AC_.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(240,t+.18);const a=mk('sawtooth',hz(m)),b=mk('sine',hz(m));a.connect(fl);fl.connect(g);b.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2*sv,t+.01);g.gain.setTargetAtTime(0,t+.05,.09);a.start(t);b.start(t);stop([a,b],t+.7)}
  else if(k==='brs'){const g=AC_.createGain(),fl=AC_.createBiquadFilter();fl.type='lowpass';fl.Q.value=1.4;fl.frequency.setValueAtTime(500,t);fl.frequency.linearRampToValueAtTime(2300,t+.07);fl.frequency.setTargetAtTime(1100,t+.12,.2);
   const a=[mk('sawtooth',hz(m),-8),mk('sawtooth',hz(m),8),mk('square',hz(m)/2)];const lf=mk('sine',5.2),lg=AC_.createGain();lg.gain.value=hz(m)*.006;lf.connect(lg);a.forEach(x=>{lg.connect(x.frequency);x.connect(fl)});fl.connect(g);g.connect(o);
   const d=Math.max(.18,dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*sv,t+.04);g.gain.setValueAtTime(.09*sv,t+d*.8);g.gain.setTargetAtTime(0,t+d,.07);a.forEach(x=>x.start(t));lf.start(t);stop(a.concat([lf]),t+d+.5)}
  else if(k==='timp'){const g=AC_.createGain(),x=mk('sine',112);x.frequency.setValueAtTime(112,t);x.frequency.exponentialRampToValueAtTime(52,t+.28);x.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42*sv,t+.01);g.gain.setTargetAtTime(0,t+.05,.16);x.start(t);x.stop(t+1.1);
   const s=AC_.createBufferSource();s.buffer=NB;const fl=AC_.createBiquadFilter();fl.type='lowpass';fl.frequency.value=380;const ng=AC_.createGain();ng.gain.setValueAtTime(.3*sv,t);ng.gain.setTargetAtTime(0,t+.01,.04);s.connect(fl);fl.connect(ng);ng.connect(o);s.start(t,Math.random()*1.5,.25)}
  else if(k==='shk'||k==='clv'){if(k==='shk'){const s=AC_.createBufferSource();s.buffer=NB;const fl=AC_.createBiquadFilter();fl.type='highpass';fl.frequency.value=6200;const g=AC_.createGain();g.gain.setValueAtTime(.13*sv,t);g.gain.setTargetAtTime(0,t+.005,.025);s.connect(fl);fl.connect(g);g.connect(o);s.start(t,Math.random()*1.5,.12)}
   else{const x=mk('sine',1180),g=AC_.createGain();x.connect(g);g.connect(o);g.gain.setValueAtTime(.12*sv,t);g.gain.setTargetAtTime(0,t+.004,.03);x.start(t);x.stop(t+.25)}}},
 // egy ütem lejátszása
 playBar(t0){const stepT=60/STEP_BPM/4,ev=plan(MUS.bar,MUS.I,MUS.seed,MUS.deep);for(const e of ev){try{MUS.note(e.k,e.m,t0+e.s*stepT,e.d*stepT,e.v)}catch(x){}}MUS.bar++},
 tick(){try{if(!MUS.run||!MUS.out||AC.state!=='running')return;const barT=60/STEP_BPM*4,now=AC.currentTime;
   MUS.I+=(MUS.target()-MUS.I)*.25;MUS.deep=(S.depth||0)>35000;
   if(MUS.nextT<now)MUS.nextT=now+.08;
   while(MUS.nextT<now+.5){MUS.playBar(MUS.nextT);MUS.nextT+=barT}}catch(e){if(W.DBG)DBG.err='music: '+(e.message||e)}},
 start(){if(MUS.run||!MUS.ensure())return;MUS.run=true;MUS.nextT=0;MUS.timer=setInterval(MUS.tick,120)},
 stop(){MUS.run=false;if(MUS.timer){clearInterval(MUS.timer);MUS.timer=0}if(MUS.out&&typeof AC!=='undefined'&&AC)try{MUS.out.gain.setTargetAtTime(0,AC.currentTime,.3)}catch(e){}},
 // ~1 mp-enként: be/ki a hangerő, a lap láthatósága és a hangkörnyezet állapota szerint
 update(){try{const v=MUS.vol(),on=v>0&&S.set&&S.set.vol>0&&typeof AC!=='undefined'&&AC&&AC.state==='running'&&!(W.document&&W.document.hidden);
   if(!on){if(MUS.run)MUS.stop();return}
   if(!MUS.run)MUS.start();if(MUS.out)MUS.out.gain.setTargetAtTime(cl(.9*v*(S.set.vol/100)*1.25,0,1),AC.currentTime,.4)}catch(e){if(W.DBG)DBG.err='music: '+(e.message||e)}},
 last:0};
W.MUS=MUS;
if(W.document&&document.addEventListener)document.addEventListener('visibilitychange',()=>{try{MUS.update()}catch(e){}});
if(W.on)on('frame',dt=>{MUS.last+=dt;if(MUS.last<1)return;MUS.last=0;MUS.update()});
})(typeof window!=='undefined'?window:globalThis);
