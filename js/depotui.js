/* Drill Up – Depó-felület: átfolyó „tartályok” (gép → depó → vonat) és anyagsorok.
   A gép raktára csúszkaszerűen ürül, miközben a depó tartálya megtelik; a csövek csak akkor mozognak, amikor tényleg folyik az anyag.
   Csak megjelenítés: a depó logikáját (DEP) nem változtatja; ha hibázik, a Depó fül a régi módon is használható. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('depotui');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const hue=n=>{let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return h};
const col=n=>'hsl('+hue(n)+',55%,52%)';
const DUI={sig:'',last:{},
 // a gép rakományának anyagai érték szerint rendezve (a kirakodás is így halad)
 names(){try{return Object.keys(S.cg).filter(n=>S.cg[n]>1e-6).sort((a,b)=>{const pa=DEP.bp(a),pb=DEP.bp(b);return(pb||0)-(pa||0)||S.cg[b]-S.cg[a]}).slice(0,7)}catch(e){return[]}},
 fr(){const c=DEP.used()/Math.max(1,cap()),s=DEP.stock()/Math.max(1,DEP.val('s')),T=DEP.trainPhase();return{m:cl(c,0,1),d:cl(s,0,1),t:T.away?(T.loaded?1-T.f*.0:0):0,tl:T.loaded,away:T.away,tf:T.f}},
 tank(id,ic,ttl,cls,pct,txt){return`<div class="dtk ${cls}"><div class="dtv"><i id="${id}" style="height:${(pct*100).toFixed(1)}%"></i><s></s><em>${Math.round(pct*100)}%</em></div><b>${ic} ${ttl}</b><span id="${id}t">${txt}</span></div>`},
 // a felső „átfolyó” panel
 tanks(){const f=DUI.fr(),away=f.away,left=away?Math.max(0,Math.ceil((S.tw.t1-Date.now())/1e3)):0;
  return`<div class="dtx" id="dtx">${DUI.tank('dtM','📦','Gép','m',f.m,fk(DEP.used())+' / '+fk(cap()))}<div class="dpipe${DEP.job?' on':''}" id="dtP1"><u></u><u></u><u></u><small id="dtR">${DEP.job?nf(DEP.val('b'))+' kg/s':'⬇'}</small></div>${DUI.tank('dtD','🏗','Depó','d',f.d,fk(DEP.stock())+' / '+fk(DEP.val('s')))}<div class="dpipe${away?' on':''}" id="dtP2"><u></u><u></u><u></u><small id="dtS">${away?left+' mp':'🚂'}</small></div>${DUI.tank('dtT','🚂','Vonat','t',away&&f.tl?1:away?0:0,away?(f.tl?'tele · úton':'üresen vissza'):'otthon')}</div>`},
 // a gép rakományának anyagsorai (fogynak, ahogy a kirakodás halad)
 rows(){const L=DUI.names();DUI.sig=L.join('|');if(!L.length)return'<div class="mu">A gép üres.</div>';const mx=Math.max(...L.map(n=>S.cg[n]));
  return'<div class="mrs">'+L.map(n=>`<div class="mrow" data-n="${n}"><span class="mn"><i style="background:${col(n)}"></i>${n}</span><div class="mbar"><b style="width:${(S.cg[n]/mx*100).toFixed(1)}%;background:${col(n)}"></b></div><span class="mk">${fk(S.cg[n])}</span></div>`).join('')+'</div>'},
 // minden képkockán: csak a méretek és a számok (olcsó); ha az anyagok halmaza változik, újrarajzoltatja a fület
 update(){try{
  const tb=typeof tab!=='undefined'?tab:-1;if(tb!==3&&tb!==2)return;const f=DUI.fr(),q=id=>document.getElementById(id);
  const set=(id,pct)=>{const e=q(id);if(!e)return;const v=(pct*100).toFixed(1);if(DUI.last[id]!==v){DUI.last[id]=v;e.style.height=v+'%';const p=e.parentNode&&e.parentNode.querySelector('em');if(p)p.textContent=Math.round(pct*100)+'%'}};
  const txt=(id,t)=>{const e=q(id);if(e&&DUI.last[id]!==t){DUI.last[id]=t;e.textContent=t}};
  set('dtM',f.m);set('dtD',f.d);set('dtT',f.away&&f.tl?1:0);
  txt('dtUse',fk(DEP.used())+' / '+fk(cap()));txt('dtMt',fk(DEP.used())+' / '+fk(cap()));txt('dtDt',fk(DEP.stock())+' / '+fk(DEP.val('s')));
  const left=f.away?Math.max(0,Math.ceil((S.tw.t1-Date.now())/1e3)):0;txt('dtTt',f.away?(f.tl?'tele · úton':'üresen vissza'):'otthon');txt('dtS',f.away?left+' mp':'🚂');txt('dtR',DEP.job?nf(DEP.val('b'))+' kg/s':'⬇');
  const p1=q('dtP1'),p2=q('dtP2');if(p1&&p1.classList.contains('on')!==!!DEP.job)p1.classList.toggle('on',!!DEP.job);if(p2&&p2.classList.contains('on')!==!!f.away)p2.classList.toggle('on',!!f.away);
  const L=DUI.names();if(L.join('|')!==DUI.sig&&q('dtx')){DUI.sig=L.join('|');DEP.refresh();return}
  if(L.length){const mx=Math.max(...L.map(n=>S.cg[n]));for(const n of L){const r=document.querySelector('.mrow[data-n="'+n+'"]');if(!r)continue;const b=r.querySelector('b'),k=r.querySelector('.mk'),v=(S.cg[n]/mx*100).toFixed(1),id='r'+n;if(DUI.last[id]!==v){DUI.last[id]=v;if(b)b.style.width=v+'%';if(k)k.textContent=fk(S.cg[n])}}}
 }catch(e){}}};
W.DUI=DUI;
if(W.on)on('frame',()=>DUI.update());
})(typeof window!=='undefined'?window:globalThis);
