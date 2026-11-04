/* Drill Up – mérföldkövek: elért rekordmélységekhez egyszeri pénzjutalom, és gyűjtemény-jutalom a Beszámolókért.
   Állapot: S.gl = [azonosítók]. A jutalmak a meglévő gazdasághoz mérten szerények (a fejlesztések árának töredéke). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('goals');
const G=[
 {id:'d100',d:100,r:5e4,t:'Első 100 méter'},{id:'d1k',d:1e3,r:4e5,t:'Az első kilométer'},{id:'d4k',d:4e3,r:2e6,t:'4 km – a legmélyebb bánya'},
 {id:'d12k',d:12262,r:1.5e7,t:'12 262 m – megdöntötted a Kola-rekordot'},{id:'moho',d:35e3,r:6e7,t:'A Moho határán át'},
 {id:'m410',d:410e3,r:2.5e8,t:'A köpeny átmeneti zónája'},{id:'m660',d:660e3,r:6e8,t:'Alsó köpeny'},{id:'cmb',d:2890e3,r:2e9,t:'A mag határa'},
 {id:'icb',d:5150e3,r:6e9,t:'A belső mag'},{id:'ctr',d:6371e3-50,r:2e10,t:'A Föld középpontja'}];
const C=[{id:'c5',n:5,r:3e5,t:'5 beszámoló gyűjtve'},{id:'c10',n:10,r:2e6,t:'10 beszámoló gyűjtve'},{id:'c15',n:15,r:1e7,t:'15 beszámoló gyűjtve'},{id:'c22',n:22,r:6e7,t:'Teljes gyűjtemény'}];
const GL={G,C,
 st(){return Array.isArray(S.gl)?S.gl:(S.gl=[])},
 has(id){return GL.st().indexOf(id)>=0},
 fm(n){return n>=1e9?(n/1e9).toLocaleString('hu-HU',{maximumFractionDigits:1})+' Mrd Ft':n>=1e6?(n/1e6).toLocaleString('hu-HU',{maximumFractionDigits:1})+' M Ft':Math.round(n).toLocaleString('hu-HU')+' Ft'},
 pay(e){GL.st().push(e.id);S.cash+=e.r;try{msg('🏆 Mérföldkő: '+e.t+' · +'+GL.fm(e.r))}catch(x){}try{if(W.NAT)NAT.hap([20,40,20,40,60]);beep(660,.12,.05,'triangle');setTimeout(()=>beep(880,.12,.05,'triangle'),120);setTimeout(()=>beep(1320,.2,.05,'triangle'),240)}catch(x){}},
 check(){if(typeof S==='undefined')return;const mx=Math.max(S.max||0,S.depth||0),sn=Array.isArray(S.sty)?S.sty.length:0;
  for(const e of G)if(mx>=e.d&&!GL.has(e.id))GL.pay(e);for(const e of C)if(sn>=e.n&&!GL.has(e.id))GL.pay(e)},
 html(){let h=`<div class="card">🏆 <b>Mérföldkövek</b> <span class="mu">${GL.st().length}/${G.length+C.length}</span><details style="margin-top:6px"><summary class="mu">Megnyitás</summary>`;
  for(const e of G.concat(C)){const d=GL.has(e.id);h+=`<div class="stl${d?'':' lock'}">${d?'✅':'🔒'} <b>${e.t}</b> <span class="mu">· ${GL.fm(e.r)}${e.d?' · '+(e.d>=1e3?(e.d/1e3).toLocaleString('hu-HU',{maximumFractionDigits:1})+' km':e.d+' m'):''}</span></div>`}return h+'</details></div>'}};
W.GL=GL;
let acc=0;if(W.on)on('frame',dt=>{acc+=dt;if(acc<.5)return;acc=0;try{GL.check()}catch(e){DBG.err='goals: '+(e.message||e)}});
if(W.BP)BP.extras.push(()=>GL.html());
})(typeof window!=='undefined'?window:globalThis);
