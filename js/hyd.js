/* Drill Up – hidraulikus felállító a felszínen.
   A gép vízszintesen halad a felszínen, a fúráshoz viszont függőlegesen kell állnia. Ezt egy beépített hidraulikus berendezés oldja meg:
   kitámasztó lábak ereszkednek le, a farok alatt teleszkópos emelőoszlop tolja fel a gépet az orr (fúrófej) körül – lassan, látható hidraulikával,
   gőz- és olajfüsttel, hanggal –, majd a fúrás indul. Felszínre érve, ha a gép vízszintesen indulna tovább, ugyanez visszafelé: lefekteti magát.
   • Föld alatt (vagy ha már függőleges) nincs várakozás. A mozgás a felállítás alatt áll; a ⬛ (állj) gombbal sem szakad meg: a gép nem marad félig felállva.
   • Beállítások → „Hidraulikus felállító" (S.set.erect === 0 → a régi viselkedés: a gép azonnal, lassan billen).
   • Pose nincs mentve: a betöltött játékban a felszínen vízszintes, föld alatt függőleges. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('hyd');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,TE=3000,TL=2600;
const HYD={pose:null,seq:null,told:0,A:null,
 on(){return !!HYD.seq},
 enabled(){try{return S.set.erect!==0}catch(e){return true}},
 sync(){if(typeof S==='undefined'||!S)return;if(HYD.pose===null)HYD.pose=S.depth>1.5?1:0;if(!HYD.seq&&S.depth>1.5)HYD.pose=1},
 // az aktuális szög: 0 = vízszintes, π/2 = függőleges (lefelé néz)
 ang(){const q=HYD.seq;if(!q)return HYD.pose>=.5?Math.PI/2:0;const l=ease(cl((q.p-.2)/.7,0,1));return(q.dir>0?l:1-l)*Math.PI/2},
 // a lábak kinyúlása 0..1 (előbb ereszkednek, a végén visszahúzódnak)
 legs(){const q=HYD.seq;if(!q)return 0;const p=q.p;return q.dir>0?cl(p/.2,0,1)*(1-cl((p-.9)/.1,0,1)):cl(p/.2,0,1)*(1-cl((p-.9)/.1,0,1))},
 start(dir){HYD.seq={dir,t0:Date.now(),dur:dir>0?TE:TL,p:0,pu:0};S.mode='';
  if(!HYD.told){HYD.told=1;try{toast(dir>0?'🛠 Hidraulikus felállító: a gép függőlegesre áll fúráshoz…':'🛠 A gép lefekszik a hidraulikán…')}catch(e){}}
  try{aInit()}catch(e){}HYD.snd(true);try{clank(.3)}catch(e){}HYD.steam(6)},
 finish(){const q=HYD.seq;HYD.pose=q.dir>0?1:0;HYD.seq=null;HYD.snd(false);try{clank(.25)}catch(e){}HYD.steam(8)},
 steam(n){try{if(W.STM&&STM.puff)STM.puff(-9,1.3,n,{vy:-.8,sp:2.6,r:5,l:1.4,col:'225,228,232'})}catch(e){}},
 // a step() elején hívja: igaz = a gép áll (felállítás / lefekvés közben)
 step(dt){try{
  if(typeof S==='undefined'||!S)return false;HYD.sync();
  const q=HYD.seq;
  if(q){q.p=cl((Date.now()-q.t0)/q.dur,0,1);S.mode='';
   if(Math.random()<dt*10&&q.p<.95)HYD.steam(1);
   if(q.p>=1){HYD.finish();return false}return true}
  if(!HYD.enabled()||(W.NET&&NET.falling))return false;
  if(W.ENG&&!ENG.ready())return false;
  const st=S.st,surf=S.depth<=1;
  if(surf&&st==='D'&&HYD.pose<.5){HYD.start(1);return true}
  if(surf&&(st==='L'||st==='R'||st==='H')&&HYD.pose>=.5){HYD.start(-1);return true}
  return false}catch(e){if(W.DBG)DBG.err='hyd: '+(e.message||e);HYD.seq=null;return false}},
 // hang: halk hidraulika-zümmögés, a hangnyomással együtt emelkedik
 snd(on){try{if(typeof AC==='undefined'||!AC||!(S.set.vol>0))return;
  if(on){const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter(),t=AC.currentTime,d=(HYD.seq?HYD.seq.dur:3000)/1000,v=S.set.vol/100;o.type='sawtooth';f.type='lowpass';f.frequency.value=420;
   o.frequency.setValueAtTime(58,t);o.frequency.linearRampToValueAtTime(96,t+d*.6);o.frequency.linearRampToValueAtTime(64,t+d);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07*v,t+.3);g.gain.setValueAtTime(.07*v,t+d-.4);g.gain.linearRampToValueAtTime(0,t+d);
   o.connect(f);f.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.1);HYD.A=o}}catch(e){}},
 // kirajzolás: kitámasztók + teleszkópos emelőoszlop a gép alatt (a 'world.front' hívja)
 draw(V){const q=HYD.seq;if(!q||!V||!V.lw)return;const x=V.x,K=V.K,Ys=V.Ys,lw=V.lw,legs=HYD.legs(),fc=V.fc||1;
  x.save();x.lineCap='butt';
  const pad=(px,py,w)=>{x.fillStyle='#2b2d31';x.fillRect(px-w/2,py-3,w,3);x.fillStyle='#8a8d92';x.fillRect(px-w/2,py-3,w,1)};
  // két kitámasztó láb: egyenes hidraulikus szár a hasról a földig
  for(const a of[-2.2,-6.2]){const[sx,sy]=lw(a,1.7),ext=Math.max(0,Ys-sy)*legs;if(ext<2)continue;
   x.fillStyle='#4a4d52';x.fillRect(sx-3,sy,6,ext*.55);x.fillStyle='#b9bcc2';x.fillRect(sx-2,sy+ext*.5,4,ext*.5);pad(sx,sy+ext+3,K*.9)}
  // emelőoszlop a farok alatt: a talpa a talajon csúszik, a teteje a farokhoz kapcsolódik
  const[ax,ay]=lw(-9,1.4),top=ay,h=Math.max(0,Ys-top);
  if(h>6&&q.p>.18){const sec=3,w0=K*.75;for(let i=0;i<sec;i++){const y0=Ys-h*i/sec,y1=Ys-h*(i+1)/sec,w=w0*(1-.2*i);x.fillStyle=i%2?'#d0d4d8':'#6b6f75';x.fillRect(ax-w/2,y1,w,y0-y1);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(ax-w/2+2,y1,2,y0-y1)}
   x.fillStyle='#e2b228';x.fillRect(ax-w0/2-2,top-3,w0+4,6);pad(ax,Ys,K*1.4)}
  x.restore()}};
W.HYD=HYD;
if(W.on)on('sim',()=>{if(HYD.seq)HYD.step(0)});
if(W.on)on('world.front',V=>{try{HYD.draw(V)}catch(e){if(W.DBG)DBG.err='hyd: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
