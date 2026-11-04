/* Drill Up – 5/B: olaj- és gázmezők.
   Geológia: szénhidrogén csak üledékes medencékben van. Olajablak ~1–4 km (60–120 °C), gázablak mélyebben, a játékban 1,8–6,6 km-ig.
   A mezők a mentés magjából (S.geo.seed) determinisztikusan adódnak: 1200 m-es oszlopokra osztott x tengelyen oszloponként
   legfeljebb 1 olaj- és 1 gázmező (35–35% esély). Felfedezés: (1) átfúrás, (2) szeizmikus anomália a gép/szenzorok sugarán belül
   (csak „gyanús szerkezet”, becsült mélység ±15%), (3) labor-minta a mező 250 m-es közelében (3. szintű labor kiterjesztett).
   Kút: bázison építhető; a termelés 0,04%/óra a készletből, legfeljebb 24 óra gyűlik fel, begyűjtés bázison, 15% működési költség. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('hydro');
const CELL=1200,PO=150,PG=60,NET_=.85,RATE=.0004/3600e3,CAPH=24;
const HY={
 cache:new Map(),
 field(c,k,seed){const key=seed+':'+c+':'+k;let f=HY.cache.get(key);if(f!==undefined)return f;
  const r=GEO.rng(GEO.hash(seed+k*7919,c));const has=r()<.35,a=r(),b=r(),w=r(),t=r(),u=r();
  f=null;if(has){const gas=k===1,d=gas?1800+a*4800:700+a*2800,th=gas?40+t*260:30+t*150,wd=200+w*700;
   f={id:c+':'+k,gas,x:c*CELL+b*CELL,d,th,wd,res:wd*th*(gas?500:900),n:gas?'Gázmező':'Olajmező',q:u}}
  if(HY.cache.size>3000)HY.cache.clear();HY.cache.set(key,f);return f},
 near(x,rad){const g=GEO.ens(),c0=Math.floor((x-rad)/CELL),c1=Math.floor((x+rad)/CELL),a=[];for(let c=c0;c<=c1;c++)for(let k=0;k<2;k++){const f=HY.field(c,k,g.seed);if(f)a.push(f)}return a},
 byId(id){const g=GEO.ens(),[c,k]=id.split(':').map(Number);return HY.field(c,k,g.seed)},
 inside(f,x,d){return Math.abs(x-f.x)<=f.wd/2&&Math.abs(d-f.d)<=f.th/2},
 price(f){const n=f.gas?'Földgáz':'Kőolaj',b=f.gas?PG:PO;return typeof price==='function'?price(n,b):b},
 found(f,how){const h=GEO.ens().hy;if(h.found[f.id])return false;h.found[f.id]=1;delete h.sus[f.id];if(W.ding)try{ding()}catch(e){}
  msg('🛢 '+f.n+' felfedezve ('+how+'): '+nf(f.d)+' m mélyen, becsült készlet '+fk(f.res)+'.');if(f.gas&&window.NET)NET.shake=Math.max(NET.shake,.3);return true},
 // kút
 cost(f){return 1.5e6+f.d*2500},
 build(id){const g=GEO.ens(),f=HY.byId(id);if(!f||!g.hy.found[id]||g.hy.w[id])return;if(!base())return toast('Kutat csak a bázison lehet építeni.');if(!GEO.pay(HY.cost(f)))return toast('Nincs elég pénz.');g.hy.w[id]={t0:Date.now(),rem:f.res};msg('🛢 Kút épült: '+f.n+' ('+nf(f.d)+' m).');view()},
 acc(id){const g=GEO.ens(),w=g.hy.w[id],f=HY.byId(id);if(!w||!f)return 0;const h=Math.max(0,Math.min(CAPH,(Date.now()-w.t0)/3600e3));return Math.min(w.rem,f.res*RATE*3600e3*h)},
 collect(){if(!base())return toast('Begyűjtés csak a bázison.');const g=GEO.ens();let kg=0,cash=0;for(const id in g.hy.w){const f=HY.byId(id),a=HY.acc(id);if(!f||a<=0)continue;const w=g.hy.w[id];w.rem-=a;w.t0=Date.now();kg+=a;cash+=a*HY.price(f)*NET_}
  if(cash<=0)return toast('Még nincs begyűjthető termelés.');S.cash+=cash;msg('🛢 Begyűjtve: '+fk(kg)+' → '+ft(cash)+' (15% működési költség levonva).');view()},
 tick(){if(S.depth<=0)return;const g=GEO.ens();
  for(const f of HY.near(S.x,500))if(HY.inside(f,S.x,S.depth))HY.found(f,'átfúrva');
  for(const s of GEO.sources())for(const f of HY.near(s.x,s.r)){if(g.hy.found[f.id]||g.hy.sus[f.id])continue;if(GEO.dist(s.x,s.d,f.x,f.d)<=s.r){g.hy.sus[f.id]=1;msg('📡 Szeizmikus anomália ('+s.n+'): feltételezett '+(f.gas?'gáz':'olaj')+'tároló ~'+nf(Math.round(f.d*(.9+f.q*.2)/100)*100)+' m mélyen.',1)}}},
 // a labor-minta megerősít
 confirm(x,d,rad){for(const f of HY.near(x,rad))if(GEO.dist(x,d,f.x,f.d)<=rad)HY.found(f,'labor-minta')},
 html(){const g=GEO.ens(),h=g.hy,b=base();let o=`<div class="card">🛢 <b>Olaj- és gázmezők</b><div class="mu">Fúrj át egy mezőn, vagy szeizmikus anomália / labor-minta jelzi. Megtalált mezőre kutat építhetsz: passzív termelés (24 órányi gyűlik fel), a bázison gyűjthető be.</div>`;
  const ids=Object.keys(h.found),sus=Object.keys(h.sus);
  for(const id of ids){const f=HY.byId(id);if(!f)continue;const w=h.w[id],a=w?HY.acc(id):0,dx=f.x-S.x;
   o+=`<div class="mu" style="margin-top:6px">${f.gas?'💨':'🛢'} <b>${f.n}</b> · ${nf(f.d)} m mélyen (${nf(f.th)} m vastag) · ${dx>=0?'+':''}${nf(dx)} m a géptől<br>Készlet: ${fk(w?w.rem:f.res)} · ${ft(HY.price(f))}/kg${w?`<br>Kút: felgyűlt ${fk(a)} ≈ ${ft(a*HY.price(f)*NET_)}`:''}</div>`+(w?'':`<button class="b g" style="width:100%" ${b&&S.cash>=HY.cost(f)?'':'disabled'} onclick="HY.build('${id}')">Kút építése – ${ft(HY.cost(f))}</button>`)}
  if(Object.keys(h.w).length)o+=`<button class="b" style="width:100%;margin-top:6px" ${b?'':'disabled'} onclick="HY.collect()">⛽ Begyűjtés és eladás</button>`;
  for(const id of sus){const f=HY.byId(id);if(f)o+=`<div class="mu">❓ Gyanús szerkezet: ~${nf(Math.round(f.d*(.9+f.q*.2)/100)*100)} m mélyen, ${nf(Math.abs(f.x-S.x))} m-re ${f.x>=S.x?'jobbra':'balra'} – fúrj oda vagy vegyél labor-mintát!</div>`}
  if(!ids.length&&!sus.length)o+='<div class="mu" style="margin-top:6px">Még nincs ismert mező. Fúrj vízszintesen 1–6 km mélyen, szeizmográffal és szenzorokkal.</div>';
  return o+'</div>'}};
W.HY=HY;
if(W.on){on('tick',()=>{try{HY.tick()}catch(e){}})}
if(W.BP)BP.extras.push(()=>HY.html());
})(typeof window!=='undefined'?window:globalThis);
