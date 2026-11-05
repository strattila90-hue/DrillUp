/* Drill Up – teljes képernyő: elrejti az Android állapotsorát (óra, hálózat, akku) és a navigációs sávot, hogy a játék natív appként töltse ki a képernyőt.
   A böngésző csak felhasználói érintésre engedi, ezért az első érintéskor (és ha kiléptek belőle, a következőnél) kéri. Kikapcsolható: S.set.fs = 0.
   iPhone/iPad nem engedi az állapotsor elrejtését weboldalnál; ott a kezdőképernyőre tett app a legteljesebb nézet. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('fullscreen');
const FS={tries:0,
 want(){return typeof S==='undefined'||!S.set||S.set.fs!==0},
 can(){const d=W.document;return !!(d&&d.documentElement&&d.documentElement.requestFullscreen)},
 is(){const d=W.document;return !!(d&&d.fullscreenElement)},
 req(){if(!FS.want()||!FS.can()||FS.is())return false;
  try{const p=W.document.documentElement.requestFullscreen({navigationUI:'hide'});FS.tries++;if(p&&p.catch)p.catch(()=>{});return true}catch(e){return false}},
 off(){try{if(FS.is()&&W.document.exitFullscreen)W.document.exitFullscreen().catch(()=>{})}catch(e){}},
 set(v){if(typeof S!=='undefined'&&S.set)S.set.fs=v?1:0;if(v)FS.req();else FS.off()}};
W.FS=FS;
const d=W.document;
if(d&&d.addEventListener){
 // csak érintés/kattintás felengedésekor lehet kérni (felhasználói művelet)
 ['pointerup','touchend','click'].forEach(n=>d.addEventListener(n,()=>{try{FS.req()}catch(e){}},{passive:true}));
 d.addEventListener('visibilitychange',()=>{});
}
})(typeof window!=='undefined'?window:globalThis);
