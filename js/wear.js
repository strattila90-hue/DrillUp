/* Drill Up – lánctalp-kopás. A megtett vízszintes úttól kopik (meredek lejtőn gyorsabban), és rontja a tapadást (HILL.mu),
   így a domb/vulkán megmászása kopott lánctalppal nehezebb. A bázison felújítható (a műhely-kedvezménnyel).
   Állapot: S.tk = kopás 0–100%. Hiányzó mező = 0 (a régi mentések változatlanul működnek). Nem blokkolja a játékot: a tapadás legfeljebb 35%-ot romlik. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('wear');
const LIFE=20000,MAXLOSS=.35; // m sík terepen; a tapadásveszteség teljes kopásnál
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const WEAR={prevX:null,
 tk(){return typeof S!=='undefined'&&isFinite(S.tk)?cl(S.tk,0,100):0},
 // tapadási szorzó: 1 új lánctalpnál, 1-MAXLOSS teljesen kopottnál
 mf(){return 1-MAXLOSS*Math.pow(WEAR.tk()/100,1.2)},
 slopeF(){let g=0;try{if(W.HILL&&S.depth<2)g=Math.abs(HILL.g(S.x))}catch(e){}return 1+6*g},
 add(dx){if(!(dx>0)||typeof S==='undefined')return;try{if(W.ST){const o=ST.ss();o.hm=(o.hm||0)+dx}}catch(e){}const b=WEAR.tk();S.tk=Math.min(100,b+dx*WEAR.slopeF()*100/LIFE);
  const a=S.tk;if(b<75&&a>=75){try{msg('🛞 A lánctalp 75%-ban kopott – a bázison felújíthatod (Műhely).')}catch(e){}}
  if(b<90&&a>=90){try{msg('⚠ A lánctalp 90%-ban kopott: a tapadás érezhetően romlik.')}catch(e){}}},
 step(){if(typeof S==='undefined')return;const x=S.x;if(WEAR.prevX!=null&&isFinite(x)){const d=Math.abs(x-WEAR.prevX);if(d<50)WEAR.add(d)}WEAR.prevX=isFinite(x)?x:null},
 cost(){const t=WEAR.tk(),k=W.SRF?SRF.disc('ws'):1;return Math.round(t*1500*Math.pow(4,S.u.d||0)*k)},
 repair(){let b=false;try{b=!!base()}catch(e){}if(!b)return toast('🛞 A lánctalpat csak a bázison lehet felújítani.');
  const c=WEAR.cost();if(WEAR.tk()<=0)return;if(S.cash<c)return toast('Nincs elég pénzed.');S.cash-=c;S.tk=0;try{msg('🛞 Lánctalp felújítva ('+c.toLocaleString('hu-HU')+' Ft).')}catch(e){}if(W.clank)clank(.5);try{view()}catch(e){}},
 html(){const t=WEAR.tk(),c=WEAR.cost(),b=(()=>{try{return!!base()}catch(e){return false}})();
  return`<div class="card">🛞 <b>Lánctalp</b><div class="mu">Kopás <b class="${t>=90?'bad':''}">${t.toFixed(1).replace('.',',')}%</b> · tapadás ${Math.round(WEAR.mf()*100)}%-a az újnak</div><div class="lad">${typeof lad==='function'?lad(1-t/100,0):''}</div>
  <button class="b g" style="width:100%" ${b&&t>0&&S.cash>=c?'':'disabled'} onclick="WEAR.repair()">Felújítás – ${c.toLocaleString('hu-HU')} Ft</button>${b?'':'<div class="mu">Csak a bázison.</div>'}</div>`}};
W.WEAR=WEAR;
if(W.on)on('step',()=>{try{WEAR.step()}catch(e){DBG.err='wear: '+(e.message||e)}});
// a tapadás a meglévő HILL.mu-n át hat; a HILL a modulok után tölthet be, ezért lazán kötünk
function hook(){if(W.HILL&&!HILL.mu._w){const o=HILL.mu;const f=function(){return o()*WEAR.mf()};f._w=1;HILL.mu=f;return true}return !!(W.HILL&&HILL.mu._w)}
if(!hook()&&W.setTimeout)setTimeout(hook,0);
if(W.BP)BP.extras.push(()=>WEAR.html());
})(typeof window!=='undefined'?window:globalThis);
