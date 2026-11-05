/* DrillUp Core Quest – adatvédelmi hibajelentés: a JS hibákat csak a készüléken tárolja (localStorage, max. 20),
   semmit nem küld sehová. A Beállításokban a felhasználó kimásolhatja/megoszthatja a jelentést (nincs benne mentés). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('errlog');
const K='du_errs',en=()=>{try{return W.I18N&&I18N.lang==='en'}catch(e){return false}};
const ERRLOG={
 list(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}},
 add(m){try{m=String(m||'').slice(0,200);if(!m)return;const a=ERRLOG.list(),l=a[a.length-1];if(l&&l.m===m){l.n=(l.n||1)+1}else a.push({t:new Date().toISOString(),m,n:1});while(a.length>20)a.shift();localStorage.setItem(K,JSON.stringify(a))}catch(e){}},
 clear(){try{localStorage.removeItem(K)}catch(e){}},
 report(){const a=ERRLOG.list(),n=typeof navigator!=='undefined'?navigator:{};let v='';try{v=VER}catch(e){}
  return['DrillUp Core Quest error report','version: '+v,'lang: '+(en()?'en':'hu'),'ua: '+(n.userAgent||'?'),'fps: '+(W.DBG?Math.round(DBG.fps):'?'),'errors: '+a.length].concat(a.map(x=>x.t+'  '+x.m+(x.n>1?'  ×'+x.n:''))).join('\n')},
 send(){const r=ERRLOG.report(),n=typeof navigator!=='undefined'?navigator:{};
  const done=()=>{try{toast(en()?'Error report copied – nothing was sent anywhere.':'Hibajelentés kimásolva – sehová nem lett elküldve.')}catch(e){}};
  try{if(n.clipboard&&n.clipboard.writeText){n.clipboard.writeText(r).then(done,()=>{if(n.share)n.share({text:r})});return r}if(n.share){n.share({text:r});return r}}catch(e){}done();return r},
 setHtml(){return`<button class="b g" style="width:100%" onclick="ERRLOG.send()">📋 ${en()?'Copy error report (stays on device)':'Hibajelentés másolása (csak az eszközön marad)'}</button>`}
};
W.ERRLOG=ERRLOG;
if(typeof addEventListener==='function'){addEventListener('error',e=>ERRLOG.add((e.message||'')+' '+((e.filename||'').split('/').pop())+':'+e.lineno));addEventListener('unhandledrejection',e=>ERRLOG.add('promise: '+e.reason))}
if(W.on){let a=0,last='';on('frame',dt=>{a+=dt;if(a>3){a=0;try{if(W.DBG&&DBG.err&&DBG.err!==last){last=DBG.err;ERRLOG.add(last)}}catch(e){}}})}
})(typeof window!=='undefined'?window:globalThis);
