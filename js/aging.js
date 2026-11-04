/* Drill Up – a kifúrt járatok idővel benőnek: az idősödő szakaszok elhalványulnak, majd eltűnnek (a lámpáikkal együtt).
   Az időt a szakasz 5. eleme (g[4], utolsó fúrás/bővítés ideje) tárolja; hiányzó érték (régi mentés) = most (türelmi idő).
   Törlés csak a bázison történik, így a gép sosem reked a mélyben egy eltűnt járat miatt. Beállítás: S.set.tnl (perc; 0 = soha; alap 120). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('aging');
const OPTS=[0,30,120,720,1440],DEF=120,FADE0=.6,FMIN=.25;
const TNL={OPTS,
 life(){const v=S.set&&S.set.tnl;return(typeof v==='number'&&OPTS.includes(v)?v:DEF)*60e3},
 stamp(g){if(typeof g[4]!=='number'||!isFinite(g[4]))g[4]=Date.now();return g[4]},
 age(g){const L=TNL.life();return L>0?(Date.now()-TNL.stamp(g))/L:0}, // 0..1+ (1 = eltűnik)
 fade(g){const a=typeof g[4]==='number'&&TNL.life()>0?(Date.now()-g[4])/TNL.life():0;return a<=FADE0?1:Math.max(FMIN,1-(a-FADE0)/(1-FADE0)*(1-FMIN))},
 step(){if(TNL.life()<=0||!S.tn.length)return 0;if(!base()||S.st!=='idle')return 0;
  const keep=[];let gone=0,len=0;for(const g of S.tn){if(TNL.age(g)>=1){gone++;len+=Math.abs(g[2]-g[0])+Math.abs(g[3]-g[1])}else keep.push(g)}
  if(!gone)return 0;S.tn=keep;
  if(S.lamps&&S.lamps.length&&W.NET)S.lamps=S.lamps.filter(l=>NET.free(l[0],l[1]));
  msg('🌱 A föld benőtte a régi járatokat: '+gone+' szakasz ('+nf(len,0)+' m) eltűnt.');return gone}};
W.TNL=TNL;
if(W.on)on('tick',()=>TNL.step());
})(typeof window!=='undefined'?window:globalThis);
