/* Drill Up – gépi mozgások és hangok:
   • fúráskor/induláskor a kilógó tartozékok (antenna, jelzőfény, kalapács-kar, csörlő, szerszámok) behúzódnak, majd páncélburkolat zárja körbe a gépet
     (kupola lefelé, szoknya felfelé, hidraulikus dugattyúkkal); megálláskor a bázison a burkolat kinyílik és a tartozékok kitolódnak
   • búgó, hidraulikus motorindítás a hajtómű szintje szerint (gőz / dízel / villany), járó motornál finom remegés
   MX.cl: 0 nyitva … 1 zárva. Fázisok: 0–0,5 a tartozékok behúzódása, 0,4–1 a burkolat zárása. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('mechfx');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const MX={cl:0,pc:0,snd:{},
 want(){return (S.st!=='idle'||S.depth>5)?1:0},
 rt(){return cl(MX.cl/.5,0,1)},
 sh(){return cl((MX.cl-.4)/.6,0,1)},
 step(dt){const tg=MX.want(),old=MX.cl,rate=tg?1/2.4:1/2;MX.cl=cl(MX.cl+Math.sign(tg-MX.cl)*Math.min(Math.abs(tg-MX.cl),dt*rate),0,1);const c=MX.cl;
  // hangok a határátlépéseknél
  if(tg&&old<.001&&c>=.001)MX.sound('retract');
  if(tg&&old<.4&&c>=.4)MX.sound('close');
  if(tg&&old<1&&c>=.9999)MX.sound('locked');
  if(!tg&&old>.999&&c<.999)MX.sound('unlock');
  if(!tg&&old>.4&&c<=.4)MX.sound('retr-out')},
 // finom, a motor fordulatától és a szinttől függő remegés (méterben)
 jit(ts){if(!W.ENG||ENG.rpm<.15)return[0,0];const A=.03*ENG.rpm*(1+.6*ENG.ld)*[1.6,1.35,1.1,1,.7,.5,.4][Math.min(6,S.u.d)]*(S.st==='idle'?.55:1);
  return[(Math.sin(ts/23)*.6+Math.sin(ts/37+1)*.4)*A,(Math.sin(ts/19+2)*.5+Math.sin(ts/41)*.5)*A*.7]},
 // ---------- hangok (WebAudio; a játék saját AC/NB csomópontjaival) ----------
 ok(){return typeof AC!=='undefined'&&AC&&S.set.vol>0},
 tone(type,f0,f1,dur,g,lp,delay){if(!MX.ok())return;const t=AC.currentTime+(delay||0),v=S.set.vol/100,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);
  let n=o;if(lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f}gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g*v,t+Math.min(.06,dur*.3));gn.gain.setValueAtTime(g*v,t+dur*.7);gn.gain.exponentialRampToValueAtTime(.0008,t+dur);n.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+dur+.05)},
 // tremolo-s búgás (hidraulika-szivattyú) – az LFO a „búgó” jelleg
 hum(f0,f1,dur,g,lfo,delay){if(!MX.ok())return;const t=AC.currentTime+(delay||0),v=S.set.vol/100,o=AC.createOscillator(),o2=AC.createOscillator(),gn=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain(),f=AC.createBiquadFilter();
  o.type='sawtooth';o2.type='sine';f.type='lowpass';f.frequency.setValueAtTime(180,t);f.frequency.linearRampToValueAtTime(420,t+dur);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f1,t+dur);o2.frequency.setValueAtTime(f0*2.01,t);o2.frequency.linearRampToValueAtTime(f1*2.01,t+dur);
  l.frequency.value=lfo||12;lg.gain.value=g*v*.45;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g*v*.55,t+dur*.25);gn.gain.setValueAtTime(g*v*.55,t+dur*.8);gn.gain.exponentialRampToValueAtTime(.0008,t+dur);
  l.connect(lg);lg.connect(gn.gain);o.connect(f);o2.connect(f);f.connect(gn);gn.connect(AC.destination);o.start(t);o2.start(t);l.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05);l.stop(t+dur+.05)},
 // zaj-sáv (szivárgó nyomású levegő, hidraulika-bugyogás)
 noise(f0,f1,dur,g,q,delay,burble){if(!MX.ok()||typeof NB==='undefined'||!NB)return;const t=AC.currentTime+(delay||0),v=S.set.vol/100,s=AC.createBufferSource();s.buffer=NB;s.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=q||1;bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);const gn=AC.createGain();gn.gain.setValueAtTime(0,t);
  if(burble){for(let i=0;i<dur*14;i++){gn.gain.linearRampToValueAtTime(g*v*(.3+Math.random()*.9),t+i/14)}}else{gn.gain.linearRampToValueAtTime(g*v,t+Math.min(.08,dur*.2));gn.gain.setValueAtTime(g*v,t+dur*.6)}gn.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(bp);bp.connect(gn);gn.connect(AC.destination);s.start(t);s.stop(t+dur+.05)},
 thud(g,f,delay){MX.tone('sine',f||90,38,.32,g,400,delay);MX.noise(500,120,.18,g*.7,.8,delay);MX.tone('triangle',1700,900,.09,g*.18,null,delay)},
 sound(k){try{
  if(k==='retract'){MX.hum(140,210,.9,.05,16);MX.tone('sawtooth',320,170,.8,.03,900);MX.noise(5200,2600,.5,.06,1.2,.1);MX.thud(.2,120,.9)}
  else if(k==='close'){MX.hum(70,150,1.35,.1,9);MX.noise(300,160,1.3,.1,.7,0,true);MX.noise(7000,3500,.6,.08,1.1,.05);MX.tone('sawtooth',110,60,1.2,.04,300)}
  else if(k==='locked'){MX.thud(.45,80);MX.noise(7500,3000,.55,.12,1.1,.12);MX.tone('square',900,700,.07,.05,2200,.04)}
  else if(k==='unlock'){MX.thud(.3,100);MX.noise(7000,3200,.45,.1,1.1,.05);MX.hum(150,70,1.2,.09,9,.15)}
  else if(k==='retr-out'){MX.hum(200,150,.9,.05,16);MX.tone('sawtooth',170,330,.8,.03,900);MX.noise(5200,2400,.4,.06,1.2);MX.thud(.18,110,.85)}
 }catch(e){}},
 // motorindítás: búgó hidraulika + a hajtómű szintjének megfelelő karakter
 engine(k){if(!MX.ok())return;const tier=S.u.d,tg=tier<2?0:tier<4?1:2;try{
  if(k==='crank'){MX.hum(38,118,.85,.14,13);MX.noise(260,520,.85,.1,.8,0,true);
   if(tg===0){MX.noise(6500,2800,.8,.07,1);for(let i=0;i<5;i++)MX.tone('square',200+i*20,120,.05,.05,700,.1+i*.14)}
   else if(tg===1){MX.tone('square',180,330,.8,.05,1200);for(let i=0;i<8;i++)MX.thud(.09,70,i*.1)}
   else{MX.tone('sine',120,420,.8,.07,null);MX.tone('sine',240,840,.8,.03)}}
  else if(k==='ignite'){
   if(tg===0){for(let i=0;i<3;i++){MX.noise(1600,500,.14,.12,.9,i*.19);MX.thud(.18,70,i*.19)}MX.noise(7000,2600,.5,.07,1,.55)}
   else if(tg===1){MX.thud(.4,60);MX.tone('sawtooth',55,38,.7,.09,260);MX.noise(300,120,.5,.1,.7)}
   else{MX.tone('sine',200,880,.55,.08);MX.tone('triangle',100,440,.55,.04,900);MX.tone('square',1500,1100,.04,.04,3000,.52)}}
  else if(k==='ready'){MX.tone('sine',620,940,.12,.07);MX.noise(7000,3500,.3,.05,1,.08)}
  else if(k==='stop'){MX.hum(110,28,.9,.1,9);MX.noise(7000,2500,.5,.07,1)}
 }catch(e){}}};
W.MX=MX;
if(W.on)on('frame',dt=>{try{MX.step(Math.min(dt,.1))}catch(e){}});
// a meglévő motorhangokhoz hozzáfűzzük a hidraulikus réteget
if(W.ENG&&ENG.snd){const o=ENG.snd;ENG.snd=function(k){o.apply(this,arguments);if(S.set.vol>0)MX.engine(k)}}
})(typeof window!=='undefined'?window:globalThis);
