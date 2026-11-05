/* Drill Up – kiérés a felszínre dombon/vulkánon: ha a járat vízszintesen vagy felfelé eléri a terep felszínét, a gép kiér, és a felszínen halad tovább.
   Háttér: a mélység (S.depth) a lefúrás kezdetekor befagyasztott viszonyítási szinthez (HILL.e0) tartozik; ha a gép magasabb terepről indult,
   és a terep lejjebb ereszkedik, a felszín a járat fölé „süllyedhet". Eddig ilyenkor a gép a levegőben fúrt tovább. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('terrain');
const TER={n:0,
 // a terep felszíne a mélység-koordinátában az x helyen (negatív = a viszonyítási szint fölött)
 ground(x){return (HILL.e0||0)-HILL.E(x)},
 // a gép feletti takarás méterben (0 = a felszínen)
 cover(){return S.depth-TER.ground(S.x)},
 check(){if(typeof S==='undefined'||!W.HILL)return false;if(S.depth<.5||(W.NET&&NET.falling))return false;
  if(TER.cover()>.45)return false;
  // kiért: a gép a terep felszínére kerül, a viszonyítási szint a terephez igazodik
  const d0=S.depth,x=S.x;S.depth=0;HILL.e0=HILL.E(x);S.e0=+HILL.e0.toFixed(3);HILL._fz=false;TER.n++;
  try{if(W.NET){NET.trail('U',d0);if(Array.isArray(S.tn)&&d0>.2)S.tn.push([+x.toFixed(2),+d0.toFixed(2),+x.toFixed(2),0])}}catch(e){}
  try{msg('⛰ A járat kiért a felszínre – a gép innen a terepen halad tovább.')}catch(e){}
  return true}};
W.TER=TER;
if(W.on)on('step',()=>{try{TER.check()}catch(e){DBG.err='terrain: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
