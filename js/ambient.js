/* Drill Up – mélységi háttérhang: a mélységgel mélyülő zúgás, a hőséggel erősödő sistergés, a magnál lassú lüktetés.
   A meglévő hangmotor (AC) mellé, külön csomópontokkal épül; a hangerő a beállított hangerőből és az „Ambiens hang" kapcsolóból (S.set.amb) jön.
   Ha nincs hangkörnyezet (AC), vagy a hang ki van kapcsolva, nem csinál semmit. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('ambient');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const AMB={n:null,on:false,
 // a mélységhez tartozó rétegerősségek (0..1) – tiszta függvény, tesztelhető
 mix(d){d=Math.max(0,d||0);
  const deep=cl(Math.log10(d+10)/Math.log10(6371e3),0,1);               // 0 felszín … 1 középpont (logaritmikus)
  return{
   hum:d<5?0:cl(.25+.6*deep,0,1),                                        // mély zúgás (alapfrekvencia mélyül)
   f:cl(70-50*deep,18,70),                                               // a zúgás frekvenciája (Hz)
   hiss:cl((d-3e4)/9e5,0,1)*.9+cl((d-100)/3e4,0,1)*.15,                  // hőség-sistergés a mélyebb részeken
   thump:d>2890e3?cl((d-2890e3)/1e6,.3,1):0,                              // a magnál lassú lüktetés
   wind:d<8?.35:0}},                                                      // a felszínen halk szél
 ensure(){if(AMB.n||typeof AC==='undefined'||!AC||!NB)return !!AMB.n;
  try{const mk=(ty,f,q)=>{const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const fl=AC.createBiquadFilter();fl.type=ty;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start();return{g,fl}};
   const o1=AC.createOscillator(),o2=AC.createOscillator(),og=AC.createGain(),of=AC.createBiquadFilter();o1.type='sine';o2.type='triangle';of.type='lowpass';of.frequency.value=140;og.gain.value=0;o1.connect(of);o2.connect(of);of.connect(og);og.connect(AC.destination);o1.start();o2.start();
   const lf=AC.createOscillator(),lg=AC.createGain(),tg=AC.createGain();lf.frequency.value=.9;lg.gain.value=0;tg.gain.value=0;lf.connect(lg);lg.connect(tg.gain);const to=AC.createOscillator();to.type='sine';to.frequency.value=34;to.connect(tg);tg.connect(AC.destination);lf.start();to.start();
   AMB.n={o1,o2,og,of,hiss:mk('highpass',3500,.7),wind:mk('bandpass',420,.5),tg,lg,to,lf}}catch(e){AMB.n=null;return false}
  return true},
 update(){if(typeof S==='undefined'||typeof AC==='undefined'||!AC)return;
  const vol=(S.set&&S.set.vol||0)/100,off=!S.set||S.set.amb===0||vol<=0||AC.state!=='running'||(W.document&&W.document.hidden);
  if(off&&!AMB.n)return;if(!off&&!AMB.ensure())return;const n=AMB.n;if(!n)return;
  const m=AMB.mix(S.depth),t=AC.currentTime,v=off?0:vol,k=.5; // k: általános ambiens szint a gép hangjához képest
  n.og.gain.setTargetAtTime(m.hum*.05*v*k*2,t,.8);n.o1.frequency.setTargetAtTime(m.f,t,1.5);n.o2.frequency.setTargetAtTime(m.f*1.5,t,1.5);n.of.frequency.setTargetAtTime(90+m.f*2,t,1.5);
  n.hiss.g.gain.setTargetAtTime(m.hiss*.06*v*k,t,1);n.wind.g.gain.setTargetAtTime(m.wind*.05*v*k,t,1.2);
  // lüktetés a magnál: az lf a mélyhang hangerejét 0 és a szint között járatja (alap = fél szint, lüktetés = fél szint)
  const lv=m.thump>0&&!off?.06*m.thump*v:0;n.tg.gain.setTargetAtTime(lv/2,t,.8);n.lg.gain.setTargetAtTime(lv/2,t,.8);n.to.frequency.setTargetAtTime(30+m.thump*8,t,1)},
 last:0};
W.AMB=AMB;
if(W.on)on('frame',dt=>{AMB.last+=dt;if(AMB.last<.5)return;AMB.last=0;try{AMB.update()}catch(e){DBG.err='ambient: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
