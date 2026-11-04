/* Drill Up – 5. fázis közös alap: S.geo állapot (mentésbe kerül), segédek.
   S.geo = { seed, sz:{lv,sens:[[x,d]],stock,cnt,log:[…]}, hy:{sus:{id:1},found:{id:1},w:{id:{t0,rem}}}, lab:{lv,n,last} } */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('geo');
const isO=o=>o&&typeof o==='object'&&!Array.isArray(o),num=(v,a,b,d)=>typeof v==='number'&&isFinite(v)?Math.min(b,Math.max(a,v)):d;
const GEO={
 ens(){const g=S.geo=isO(S.geo)?S.geo:{};
  g.seed=Number.isInteger(g.seed)?g.seed:(Math.random()*2147483647|0);
  const z=g.sz=isO(g.sz)?g.sz:{};z.lv=Math.min(3,Math.max(0,z.lv|0));z.stock=Math.min(99,Math.max(0,z.stock|0));z.cnt=Math.max(0,z.cnt|0);
  z.sens=Array.isArray(z.sens)?z.sens.filter(a=>Array.isArray(a)&&isFinite(a[0])&&isFinite(a[1])).slice(0,8).map(a=>[+a[0],+a[1]]):[];
  z.log=Array.isArray(z.log)?z.log.filter(e=>isO(e)&&isFinite(e.M)).slice(0,12):[];
  const h=g.hy=isO(g.hy)?g.hy:{};h.sus=isO(h.sus)?h.sus:{};h.found=isO(h.found)?h.found:{};h.w=isO(h.w)?h.w:{};
  for(const k in h.w){const w=h.w[k];if(!isO(w)||!isFinite(w.t0)||!isFinite(w.rem)||w.rem<0)delete h.w[k];else w.t0=Math.min(w.t0,Date.now())}
  const l=g.lab=isO(g.lab)?g.lab:{};l.lv=Math.min(3,Math.max(0,l.lv|0));l.n=Math.max(0,l.n|0);if(!isO(l.last))l.last=null;
  return g},
 // determinisztikus véletlen (mulberry32) egész magból
 rng(a){a|=0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}},
 hash(a,b){let h=(a|0)^Math.imul(b|0,0x9E3779B1);h=Math.imul(h^h>>>16,0x85EBCA6B);h=Math.imul(h^h>>>13,0xC2B2AE35);return h^h>>>16},
 rr(x,a,b,c,d,r){x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)},
 cash(n){return S.cash>=n},
 pay(n){if(S.cash<n)return false;S.cash-=n;return true},
 // az orr (a gép) és az elhelyezett szenzorok = „hallgató pontok”
 sources(){const g=GEO.ens(),a=[];if(g.sz.lv>0)a.push({x:S.x,d:S.depth,r:[0,2,4,6][g.sz.lv]*1000,n:'gép'});g.sz.sens.forEach((s,i)=>a.push({x:s[0],d:s[1],r:[0,2,4,6][Math.max(1,g.sz.lv)]*1000,n:'szenzor '+(i+1)}));return a},
 dist(x1,d1,x2,d2){return Math.hypot(x1-x2,d1-d2)}};
W.GEO=GEO;
if(W.Save&&Save.addMig){/* nincs verzióváltás: az S.geo a fill()/ens() révén pótlódik */}
})(typeof window!=='undefined'?window:globalThis);
