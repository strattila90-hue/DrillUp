/* DrillUp Core Quest – nyelv (HU/EN). A játék szövegei magyarul íródtak; az angol változatot fordítási réteg adja:
   a megjelenő szöveget (DOM-szöveg, címkék, rajzra írt feliratok) a js/i18n_en.js szótára alapján cseréli.
   A nyelv a böngésző tárolójában van (du_lang), NEM a mentésben; váltáskor az oldal újratölt. A szótárban nem szereplő szöveg magyarul marad. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('i18n');
const KEY='du_lang';let L='hu';
try{L=localStorage.getItem(KEY)||'en'}catch(e){L='en'}
if(L!=='hu'&&L!=='en')L='en';
const I={lang:L,miss:new Set(),
 set(l){try{localStorage.setItem(KEY,l)}catch(e){}try{if(typeof save==='function')save()}catch(e){}location.reload()},
 toggle(){I.set(L==='hu'?'en':'hu')},
 tr:s=>s};
// ---- fordító ----
const UNITS=[[/(\d[\d.,\u00a0]*)\s*Mrd\s*Ft\b/g,'$$$1 B'],[/(\d[\d.,\u00a0]*)\s*Ft\b/g,'$$$1'],[/\bFt\b/g,'$$'],[/\bmp\/kör\b/g,'s/lap'],[/\bkg\/út\b/g,'kg/trip'],[/\bt\/út\b/g,'t/trip'],[/(\d)\s*mp\b/g,'$1 s'],[/(\d)\s*db\b/g,'$1 pcs'],[/(\d)\s*perc\b/g,'$1 min'],[/(\d)\s*óra\b/g,'$1 h'],[/(\d)\s*nap\b/g,'$1 d'],[/(\d)\s*ó\b/g,'$1 h']];
const WORDS={'Depó':'Depot','Műhely':'Workshop','Raktár':'Hold','Szén':'Coal','Gép':'Machine','kopás':'wear','határ':'limit','tapadás':'traction','sűrűség':'density','vastagság':'thickness','váz és hajtás':'frame and drive','páncél':'armor','üzemanyag':'fuel','rakomány':'cargo','Fúrj':'Drill','kijelző':'display','az újnak':'of new','kezdődik':'starts','Gyűjts bevételt':'Earn income','Vezess':'Drive','Hatás':'Effect','Erősség':'Strength','Fűtőérték':'Heating value','Fúrás':'Drilling','mélyen':'deep','felszínen':'on the surface','fúrófej':'drill bit','műhelyben':'in the workshop','Következő':'Next','Hő':'Heat','nyomás':'pressure','Sebesség':'Speed','Vízszintes':'Horizontal','Visszaút ára':'Return trip cost','kitalált film':'fictional film','kitalált némafilm':'fictional silent film','forgatási rekvizitum':'film prop','valódi lelet':'real find','késő kréta':'Late Cretaceous','fúrás':'drilling','javítás':'repair','öngyógyító':'self-healing','haladás':'progress','tört össze':'collapsed','eltűnt':'vanished','feltételezett':'presumed','Kősó':'Rock salt','Ón':'Tin','kövült gyanta':'fossil resin','hematit':'hematite','uraninit':'uraninite','kassziterit':'cassiterite','pénzed':'your money','Arany':'Gold','Ezüst':'Silver','Vas':'Iron','Réz':'Copper'};
let WRX;try{WRX=new RegExp('(?<![\\p{L}\\p{N}])(?:'+Object.keys(WORDS).sort((a,b)=>b.length-a.length).join('|')+')(?![\\p{L}\\p{N}])','gu')}catch(e){WRX=null};
const PATS=[[/„([^”]+)”/g,'"$1"'],[/fúrás ([\d.,]+) · fel ([\d.,]+) m\/h/,'drilling $1 · up $2 m/h'],[/([\d.,]+ kg) · ([\d.,]+) kg\/ó/,'$1 · $2 kg/h'],[/\bbe · terhelés/,'on · load'],[/\bhatás: /g,'effect: '],[/(.+?) között keresd/,'look between $1'],[/(\d+)-nál:/,'at $1:'],[/(\d+\s*(?:min|h|d|perc|óra|nap)) után/,'after $1'],[/([\d.,]+) hráig elég/,'enough for $1 h'],[/(\d[\d.,]*\s*[a-z%]+)\s+tapadás/,'traction $1']];
const HU=/[A-Za-zÁ-ű]/;let dict=null,rx=null,cache=new Map();
function build(){dict=W.I18N_DICT||{};const keys=Object.keys(dict).filter(k=>k.length>=5&&!(k.length<9&&/^[a-záéíóöőúüű]/.test(k))).sort((a,b)=>b.length-a.length);
 const esc=k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 try{rx=keys.length?new RegExp('(?<![\\p{L}\\p{N}])(?:'+keys.map(esc).join('|')+')(?![\\p{L}\\p{N}])','gu'):null}catch(e){rx=null}}
function tr(s){
 if(L==='hu'||typeof s!=='string'||s.length<2)return s;
 let c=cache.get(s);if(c!==undefined)return c;
 if(!dict)build();
 const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s),core=m[2];let out=core;
 if(core){const ex=dict[core];if(ex!==undefined)out=ex;
  else if(core.length<=140){if(rx)out=out.replace(rx,k=>dict[k]);for(const[r,t]of UNITS)out=out.replace(r,t);for(const[r,t]of PATS)out=out.replace(r,t);if(WRX)out=out.replace(WRX,w=>WORDS[w])}}
 out=m[1]+out+m[3];
 if(cache.size>6000)cache.clear();cache.set(s,out);return out}
if(L==='en'){I.tr=tr;
 // ---- rajzra írt feliratok (canvas) ----
 try{const P=W.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;if(P)for(const f of['fillText','strokeText','measureText']){const o=P[f];P[f]=function(t,...a){return o.call(this,typeof t==='string'?tr(t):t,...a)}}}catch(e){}
 // ---- DOM ----
 const skip=new Set(['SCRIPT','STYLE','CANVAS','TEXTAREA']);
 function node(n){
  if(n.nodeType===3){const v=n.data;if(n.__t===v||!HU.test(v))return;const t=tr(v);if(t!==v){n.__t=t;n.data=t}else n.__t=v;return}
  if(n.nodeType!==1||skip.has(n.tagName))return;
  for(const a of['title','aria-label','placeholder','alt']){const v=n.getAttribute&&n.getAttribute(a);if(v&&HU.test(v)){const t=tr(v);if(t!==v)n.setAttribute(a,t)}}
  for(let c=n.firstChild;c;c=c.nextSibling)node(c)}
 let q=new Set(),sched=0;
 const flush=()=>{sched=0;const a=[...q];q=new Set();for(const n of a){try{node(n)}catch(e){}}};
 const add=n=>{q.add(n);if(!sched){sched=1;(W.requestAnimationFrame||setTimeout)(flush)}};
 const start=()=>{try{document.documentElement.lang='en';if(document.title)document.title=tr(document.title);node(document.body);
  new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')add(m.target);else if(m.type==='attributes')add(m.target);else for(const n of m.addedNodes)add(n)}}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']})}catch(e){}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
}
W.I18N=I;W.T=s=>I.tr(s);
})(typeof window!=='undefined'?window:globalThis);
