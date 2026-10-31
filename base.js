/* Drill Up – alapok: eseménykampók, mentésvédelem, teljesítmény-szabályozó.
   Csak window.* kiterjesztéseket ad; a játék magja ettől függetlenül is elindul (tartalék ágakkal). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('base');
// ---------- eseménykampók ----------
W.HK=W.HK||{};
W.on=(e,f)=>{(W.HK[e]=W.HK[e]||[]).push(f)};
W.off=(e,f)=>{const h=W.HK[e];if(h){const i=h.indexOf(f);if(i>=0)h.splice(i,1)}};
// ---------- mentés ----------
const KEY='drillup1',BAK='drillup1_bak',BAK2='drillup1_bak2',VER=3;
const ls={get(k){try{return W.localStorage.getItem(k)}catch(e){return null}},set(k,v){try{W.localStorage.setItem(k,v);return true}catch(e){return false}},del(k){try{W.localStorage.removeItem(k)}catch(e){}}};
const isObj=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const clone=v=>v==null||typeof v!=='object'?v:JSON.parse(JSON.stringify(v));
// hiányzó kulcsok pótlása; a meglévő érték sosem íródik felül
function fill(t,d){for(const k in d){if(t[k]===undefined||t[k]===null)t[k]=clone(d[k]);else if(isObj(d[k])&&isObj(t[k]))fill(t[k],d[k])}return t}
// migrációk: MIG[n] az n. verzióról az n+1-edikre emel (idempotens)
const MIG={1:o=>{o.u=isObj(o.u)?o.u:{};if(o.u.f==null)o.u.f=0;if(typeof o.st!=='string'||o.st.length>1)o.st='idle';if(!Array.isArray(o.tr))o.tr=[];if(!Array.isArray(o.tn))o.tn=[];if(o.depth>0&&!o.tr.length)o.tr=[['D',o.depth]]}};
function addMig(from,fn){const prev=MIG[from];MIG[from]=prev?o=>{prev(o);fn(o)}:fn}
function migrate(o,from){for(let v=from;v<VER;v++)if(MIG[v])MIG[v](o)}
const Save={VER,KEY,addMig,lastBak:0,err:null,info:null,
 load(init,san){let raw=ls.get(KEY),obj=null,src='new';
  if(raw!==null){try{obj=JSON.parse(raw);if(!isObj(obj))throw 0;src='main'}catch(e){ls.set('drillup1_corrupt',raw);obj=null}}
  if(!obj){for(const b of [BAK,BAK2]){const s=ls.get(b);if(!s)continue;try{const o=JSON.parse(s);if(isObj(o)){obj=o;src=b;break}}catch(e){}}}
  const rv=obj?(obj.v||1):VER;
  if(obj&&rv<VER){const pk=KEY+'_pre_v'+rv;if(ls.get(pk)===null)ls.set(pk,raw!==null&&src==='main'?raw:JSON.stringify(obj));migrate(obj,rv)}
  const S=fill(obj||{},init());S.v=VER;if(san)san(S,init);Save.info={src,from:rv};return S},
 save(S){if(!S||!isFinite(S.cash)||!isFinite(S.depth)||!isFinite(S.fuel)){Save.err='Sérült játékállapot – a mentést kihagytam';return false}
  let str;try{str=JSON.stringify(S)}catch(e){Save.err='A mentés nem készíthető el';return false}
  if(!ls.set(KEY,str)){ls.del(BAK2);ls.del(BAK);ls.del('drillup1_corrupt');if(!ls.set(KEY,str)){Save.err='A mentés nem sikerült (elfogyott a tárhely)';return false}}
  const now=Date.now();if(now-Save.lastBak>6e5){Save.lastBak=now;const old=ls.get(BAK);if(old)ls.set(BAK2,old);ls.set(BAK,str)}
  Save.err=null;return true},
 exportStr(S){return JSON.stringify({app:'drillup',v:VER,at:Date.now(),data:S})},
 importStr(str,san,init){let o;try{o=JSON.parse(str)}catch(e){return 'Érvénytelen fájl (nem JSON).'}
  const d=isObj(o)&&o.app==='drillup'?o.data:o;if(!isObj(d)||typeof d.cash!=='number')return 'Ez nem Drill Up mentés.';
  const cur=ls.get(KEY);if(cur!==null)ls.set('drillup1_pre_import',cur);
  migrate(d,d.v||1);const S=fill(d,init());S.v=VER;if(san)san(S,init);
  if(!ls.set(KEY,JSON.stringify(S)))return 'Nem sikerült menteni (elfogyott a tárhely).';return null}};
W.Save=Save;
// ---------- teljesítmény-szabályozó ----------
const Gov={mode:'a',q:2,ema:16.7,lowT:0,highT:0,cool:0,
 init(m){Gov.setMode(m==null?'a':m)},
 setMode(m){Gov.mode=(m==='a'||m==null)?'a':+m;Gov.lowT=Gov.highT=0;Gov.q=Gov.mode==='a'?Gov.guess():Math.min(2,Math.max(0,Gov.mode))},
 guess(){const n=W.navigator||{};return ((n.deviceMemory||4)<=2||(n.hardwareConcurrency||4)<=4)?1:2},
 frame(ms){if(Gov.mode!=='a')return;Gov.ema+=(ms-Gov.ema)*.05;if(Gov.cool>0)Gov.cool-=ms;
  if(Gov.ema>26){Gov.lowT+=ms;Gov.highT=0}else if(Gov.ema<19){Gov.highT+=ms;Gov.lowT=0}else{Gov.lowT=Gov.highT=0}
  if(Gov.lowT>2500&&Gov.q>0){Gov.q--;Gov.lowT=0;Gov.ema=16.7;Gov.cool=6e4}
  else if(Gov.highT>12000&&Gov.q<2&&Gov.cool<=0){Gov.q++;Gov.highT=0}},
 parts(){return [90,160,260][Gov.q]},rate(){return [.4,.7,1][Gov.q]},dust(){return Gov.q>0},
 dpr(d){return Math.min(d,[1,1.5,2][Gov.q])}};
W.Gov=Gov;
})(typeof window!=='undefined'?window:globalThis);
