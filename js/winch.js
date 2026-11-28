/* DrillUp Core Quest – csörlős felhúzás (WIN).
   A föld alól a gép nem fúr / nem fordul felfelé, és nem járja végig a bejárt utat: a ⌂ (Felszín) vagy a ▲ gombra
   az indítóállás daruja leengedi a drótkötelet, a horog a gép farkát fogja meg, és a gépet függőlegesen, orral lefelé lógva
   felhúzza a kútfejhez. A felszínen a daru a hidraulikus felállítóval vízszintesre forgatja és a platformra fekteti.
   • A csörlőt a bázis hajtja: nem fogy üzemanyag; az idő a távolsággal nő (3–10 s).
   • A rakomány a gépen marad (a Depóban eladható). A bejárt alagutak megmaradnak.
   • Rajz: két szálas acélkötél a farok fölött egyenesen felfelé (a daru gerendájáig, vagy a kép tetejéig), horog, csigatest. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('winch');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const WIN={seq:null,
 on(){return !!WIN.seq},
 // indítás: true = átvette az irányítást
 start(){try{if(typeof S==='undefined'||!(S.depth>0)||WIN.seq)return !!WIN.seq;if(W.NET&&NET.falling)return false;
  const X=W.PAD?PAD.X:0,dist=Math.hypot(S.x-X,S.depth),dur=cl(3+dist/450,3,10)*1000;
  WIN.seq={t0:Date.now(),dur,x0:S.x,d0:S.depth,p:0};
  try{if(W.ARC)ARC.pl=null}catch(e){}
  // a gép a horgon orral lefelé lóg: a "D" irány képe (függőleges, a fej lent)
  S.tr=[['U',S.depth]];S.st='H';S.mode='';if(W.HYD)HYD.pose=1;
  try{aInit()}catch(e){}WIN.snd(dur/1000);
  try{toast('🪝 Csörlő: a daru drótkötele a farkánál fogva felhúzza a gépet az indítóálláshoz…')}catch(e){}
  return true}catch(e){WIN.seq=null;return false}},
 snd(d){try{if(typeof hiss==='function')hiss(.35);if(typeof clank==='function')clank(.55);if(W.MX&&MX.hum)MX.hum(70,120,Math.min(9,d),.1,9,.2)}catch(e){}},
 // a step() elején hívja: igaz = a csörlő mozgatja a gépet
 step(dt){const q=WIN.seq;if(!q)return false;q.p=cl((Date.now()-q.t0)/q.dur,0,1);const e=ease(q.p),X=W.PAD?PAD.X:0;
  S.mode='';S.depth=q.d0*(1-e);S.x=q.x0+(X-q.x0)*e;if(S.tr[0])S.tr[0][1]=S.depth;
  if(q.p>=1){WIN.seq=null;S.depth=0;S.x=X;S.tr=[];
   try{if(typeof clank==='function')clank(.6);if(typeof hiss==='function')hiss(.3)}catch(e){}
   // a daru vízszintesre forgatja és a platformra fekteti (a hidraulikus felállító visszafelé)
   if(W.HYD&&HYD.enabled()){HYD.pose=1;HYD.start(-1)}else if(W.HYD)HYD.pose=0;
   try{msg('🪝 A gép a felszínen, az indítóálláson.')}catch(e){}}
  return true},
 // rajz: kötél a farok fölött függőlegesen fel (a daru gerendájáig, ha látszik), horog a farkon
 draw(V){const q=WIN.seq;if(!q||!V.lw)return;const x=V.x,K=V.K||10,t=V.lw(-13.5,0),g=W.PAD&&PAD._g,top=g&&Math.abs(t[0]-V.SX(PAD.X))<K*12?g.top+K*.5:-20;
  x.save();x.lineCap='round';
  x.strokeStyle='#15171a';x.lineWidth=Math.max(1.2,K*.12);x.beginPath();x.moveTo(t[0]-K*.15,top);x.lineTo(t[0]-K*.15,t[1]-K*1.3);x.moveTo(t[0]+K*.15,top);x.lineTo(t[0]+K*.15,t[1]-K*1.3);x.stroke();
  x.strokeStyle='rgba(220,226,232,.55)';x.lineWidth=Math.max(.6,K*.04);x.setLineDash([K*.25,K*.2]);x.lineDashOffset=(V.ts||0)/18;x.beginPath();x.moveTo(t[0]-K*.15,top);x.lineTo(t[0]-K*.15,t[1]-K*1.3);x.stroke();x.setLineDash([]);
  // csigatest + horog a farkon
  x.fillStyle='#e0a800';x.fillRect(t[0]-K*.45,t[1]-K*1.6,K*.9,K*.55);x.fillStyle='#1a1a1a';x.fillRect(t[0]-K*.45,t[1]-K*1.25,K*.9,K*.12);
  x.strokeStyle='#2b2d31';x.lineWidth=Math.max(1,K*.14);x.beginPath();x.arc(t[0],t[1]-K*.75,K*.32,-Math.PI*.1,Math.PI*1.1);x.stroke();
  x.restore()}
};
W.WIN=WIN;
if(W.on)on('world.front',V=>{try{WIN.draw(V)}catch(e){if(W.DBG)DBG.err='winch: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
