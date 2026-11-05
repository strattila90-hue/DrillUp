/* Drill Up – teljes képernyő: elrejti az Android állapotsorát (óra, hálózat, akku) és a navigációs sávot, hogy a játék natív appként töltse ki a képernyőt.
   Alapból KI van kapcsolva (a rendszer minden belépéskor üzenetet mutat, és az átméretezés újrarajzolást okoz); a Beállításokban kapcsolható be (S.set.fs = 1). Ha a játékos kilép belőle, magától kikapcsol.
   iPhone/iPad nem engedi az állapotsor elrejtését weboldalnál; ott a kezdőképernyőre tett app a legteljesebb nézet. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('fullscreen');
const FS={tries:0,last:0,
 want(){return typeof S!=='undefined'&&!!S.set&&S.set.fs===1},
 can(){const d=W.document;return !!(d&&d.documentElement&&d.documentElement.requestFullscreen)},
 is(){const d=W.document;return !!(d&&d.fullscreenElement)},
 req(){if(!FS.want()||!FS.can()||FS.is())return false;
  const n=Date.now();if(n-FS.last<3000)return false;FS.last=n;
  try{const p=W.document.documentElement.requestFullscreen({navigationUI:'hide'});FS.tries++;if(p&&p.catch)p.catch(()=>{});return true}catch(e){return false}},
 off(){try{if(FS.is()&&W.document.exitFullscreen)W.document.exitFullscreen().catch(()=>{})}catch(e){}},
 set(v){if(typeof S!=='undefined'&&S.set)S.set.fs=v?1:0;if(v)FS.req();else FS.off()}};
W.FS=FS;
const d=W.document;
if(d&&d.addEventListener){
 // csak érintés/kattintás felengedésekor lehet kérni (felhasználói művelet)
 ['pointerup','touchend','click'].forEach(n=>d.addEventListener(n,()=>{try{FS.req()}catch(e){}},{passive:true}));
 // ha a játékos maga lép ki (lehúzás), nem kérjük újra: kikapcsoljuk, így nincs ismétlődő rendszerüzenet és újrarajzolás
 d.addEventListener('fullscreenchange',()=>{try{if(!FS.is()&&FS.want()&&Date.now()-FS.last>800&&typeof S!=='undefined'&&S.set)S.set.fs=0}catch(e){}});
}
})(typeof window!=='undefined'?window:globalThis);
