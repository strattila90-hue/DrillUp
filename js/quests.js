/* Drill Up – napi és heti kihívások. A haladás a pályafutás-számlálókból (S.ss) számolódik: a kihívás kiadásakor felvett
   alapértékhez képest. Teljesítéskor automatikusan jár a jutalom (a játékos haladásához mérten szerény).
   Állapot: S.qs = {dk, wk, d:[{k,t,b,r,d}], w:[...]}. A napot/hetet a helyi idő adja; ugyanarra a napra mindig ugyanaz a három kihívás készül. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('quests');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const KIND={
 dm:{ic:'⛏',n:'Fúrj',u:'m',m:o=>o.dm},
 ce:{ic:'💰',n:'Gyűjts bevételt:',u:'Ft',m:o=>o.ce},
 tr:{ic:'🏠',n:'Térj vissza a bázisra',u:'×',m:o=>o.tr},
 hm:{ic:'🛞',n:'Vezess a felszínen/járatokban',u:'m',m:o=>o.hm||0}};
const nice=v=>{if(v<=0)return 0;const p=Math.pow(10,Math.floor(Math.log10(v))-1);return Math.round(v/p)*p};
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const QS={KIND,
 keys(){const d=new Date(),dk=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),days=Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5);return{dk,wk:'w'+Math.floor((days+3)/7)}},
 st(){if(typeof S==='undefined')return{d:[],w:[]};let o=S.qs;if(!o||typeof o!=='object'||Array.isArray(o))o=S.qs={};if(!Array.isArray(o.d))o.d=[];if(!Array.isArray(o.w))o.w=[];return o},
 met(k){const o=W.ST?ST.ss():{};return KIND[k]?KIND[k].m(o)||0:0},
 // a kihívás nagysága a játékos haladásához igazodik
 target(k,week){const o=W.ST?ST.ss():{},mx=Math.max(S.max||0,S.depth||0),f=week?5:1;
  if(k==='dm')return nice(cl(mx*.1,30,5e5)*f);
  if(k==='ce')return nice(Math.max(2e4,(o.ce||0)*.03)*f);
  if(k==='tr')return week?8:2;
  return week?3000:400},
 reward(week){const o=W.ST?ST.ss():{};return nice(Math.max(25e3,(o.ce||0)*.015)*(week?4:1))},
 make(key,week,n){const R=rng(hash(key+(week?'W':'D'))),ks=Object.keys(KIND),out=[];
  while(out.length<n&&ks.length){const k=ks.splice((R()*ks.length)|0,1)[0];out.push({k,t:QS.target(k,week),b:QS.met(k),r:QS.reward(week),d:0})}return out},
 roll(){if(typeof S==='undefined')return;const o=QS.st(),K=QS.keys();
  if(o.dk!==K.dk){o.dk=K.dk;o.d=QS.make(K.dk,false,3)}
  if(o.wk!==K.wk){o.wk=K.wk;o.w=QS.make(K.wk,true,2)}},
 prog(q){return cl(QS.met(q.k)-q.b,0,q.t)},
 check(){QS.roll();const o=QS.st();for(const q of o.d.concat(o.w)){if(!q.d&&QS.met(q.k)-q.b>=q.t){q.d=1;S.cash+=q.r;
   try{msg('🎯 Kihívás teljesítve: '+QS.txt(q)+' · +'+(W.GL?GL.fm(q.r):q.r+' Ft'))}catch(e){}try{if(W.NAT)NAT.hap([20,40,30]);beep(660,.1,.05,'triangle');setTimeout(()=>beep(990,.15,.05,'triangle'),110)}catch(e){}}}},
 num(n){return Math.round(n).toLocaleString('hu-HU')},
 txt(q){const k=KIND[q.k];return k.ic+' '+k.n+' '+QS.num(q.t)+(k.u==='×'?'-szer':' '+k.u)},
 row(q){const p=QS.prog(q),f=q.t?p/q.t:0;return`<div class="stl${q.d?'':''}">${q.d?'✅':'🎯'} <b>${QS.txt(q)}</b><div style="height:6px;border-radius:3px;background:#3a2c20;margin:5px 0 3px"><div style="height:100%;width:${Math.round(f*100)}%;border-radius:3px;background:${q.d?'#59d65a':'#e8b84a'}"></div></div><span class="mu">${QS.num(p)} / ${QS.num(q.t)} · jutalom ${W.GL?GL.fm(q.r):q.r+' Ft'}</span></div>`},
 html(){QS.roll();const o=QS.st(),dn=o.d.filter(q=>q.d).length,wn=o.w.filter(q=>q.d).length;
  return`<div class="card">🎯 <b>Kihívások</b> <span class="mu">napi ${dn}/${o.d.length} · heti ${wn}/${o.w.length}</span><details style="margin-top:6px" open><summary class="mu">Megnyitás</summary><div class="mu" style="margin-top:4px"><b>Mai</b></div>${o.d.map(QS.row).join('')}<div class="mu" style="margin-top:8px"><b>Heti</b></div>${o.w.map(QS.row).join('')}<div class="mu" style="margin-top:6px">Új napi kihívások éjfélkor, újak hétfőn jönnek.</div></details></div>`}};
W.QS=QS;
let acc=0;if(W.on)on('frame',dt=>{acc+=dt;if(acc<1)return;acc=0;try{QS.check()}catch(e){DBG.err='quests: '+(e.message||e)}});
if(W.BP)BP.extras.push(()=>QS.html());
})(typeof window!=='undefined'?window:globalThis);
