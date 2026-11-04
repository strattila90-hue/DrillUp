/* Drill Up – beépített diagnosztika: valós eszközön futtatva megmutatja a képkockasebességet, a minőségfokozatot és az eszköz képességeit.
   Beállítások → „Diagnosztika futtatása”. A jelentés másolható (a hibakereséshez). Nem módosítja a játékállapotot. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('diag');
const DIAG={busy:false,last:null,
 caps(){const n=W.navigator||{},o={};try{o.ua=(n.userAgent||'').replace(/\s+/g,' ').slice(0,90)}catch(e){}
  o.dpr=W.devicePixelRatio||1;o.scr=(W.innerWidth||0)+'×'+(W.innerHeight||0);o.mem=n.deviceMemory||'?';o.cores=n.hardwareConcurrency||'?';
  o.standalone=!!(W.NAT&&NAT.app);o.vibrate=!!n.vibrate;o.wake=!!(n.wakeLock);o.sw=!!(n.serviceWorker&&n.serviceWorker.controller);o.audio=!!(W.AudioContext||W.webkitAudioContext);
  o.q=W.Gov?Gov.q:'?';o.mode=W.Gov?Gov.mode:'?';o.persisted=(W.NAT&&NAT.persisted)===true;return o},
 // 6 mp-es mérés valódi képkockákból
 run(cb){if(DIAG.busy||typeof requestAnimationFrame==='undefined')return;DIAG.busy=true;const T=[];let last=0,t0=0;const q0=W.Gov?Gov.q:'?';
  const step=ts=>{if(!t0)t0=ts;if(last)T.push(ts-last);last=ts;if(ts-t0<6000)requestAnimationFrame(step);else{DIAG.busy=false;T.sort((a,b)=>a-b);const n=T.length||1,avg=T.reduce((a,b)=>a+b,0)/n,p95=T[Math.floor(n*.95)]||0,mx=T[n-1]||0;
    const r=Object.assign(DIAG.caps(),{frames:T.length,fps:Math.round(1000/Math.max(1,avg)*10)/10,avgMs:Math.round(avg*10)/10,p95Ms:Math.round(p95*10)/10,maxMs:Math.round(mx),qStart:q0,ver:typeof VER!=='undefined'?VER:'?',depth:typeof S!=='undefined'?Math.round(S.depth):0,save:(()=>{try{return Math.round((localStorage.getItem('drillup1')||'').length/1024)}catch(e){return -1}})()});
    r.verdict=r.fps>=55?'Kiváló – sima 60 fps':r.fps>=40?'Jó':r.fps>=28?'Elfogadható – érdemes a Grafikát Alacsonyra állítani':'Lassú – állítsd a Grafikát Alacsonyra';DIAG.last=r;cb&&cb(r)}};
  requestAnimationFrame(step)},
 text(r){r=r||DIAG.last;if(!r)return'';return`Drill Up v${r.ver} diagnosztika\nFPS: ${r.fps} (átlag ${r.avgMs} ms, 95%: ${r.p95Ms} ms, max ${r.maxMs} ms, ${r.frames} képkocka)\nMinőség: ${r.qStart} (mód: ${r.mode}) · DPR ${r.dpr} · kijelző ${r.scr}\nEszköz: ${r.cores} mag, ${r.mem} GB · ${r.ua}\nTelepített app: ${r.standalone?'igen':'nem'} · offline (SW): ${r.sw?'igen':'nem'} · rezgés: ${r.vibrate?'igen':'nem'} · képernyő-ébrentartás: ${r.wake?'igen':'nem'} · hang: ${r.audio?'igen':'nem'} · védett tároló: ${r.persisted?'igen':'nem'}\nMélység: ${r.depth} m · mentés: ${r.save} kB\nÉrtékelés: ${r.verdict}`},
 show(){if(typeof document==='undefined'||!document.body||!document.createElement||!document.getElementById)return;if(DIAG.busy)return;let m=document.getElementById('diagDlg');if(m)m.remove();m=document.createElement('div');m.id='natDlg';m.innerHTML='<div class="nd"><div class="nm" id="dgT">⏱ Mérés folyamatban (6 mp)… közben játssz vagy fúrj, hogy valós terhelést mérjen.</div><div class="nb"><button class="b g" data-c>Bezár</button><button class="b" data-o disabled>📋 Másolás</button></div></div>';document.body.appendChild(m);
  const T=m.querySelector('#dgT');m.querySelector('[data-c]').onclick=()=>m.remove();
  DIAG.run(r=>{if(!m.isConnected)return;T.style.whiteSpace='pre-wrap';T.style.fontSize='12px';T.textContent=DIAG.text(r);const b=m.querySelector('[data-o]');b.disabled=false;b.onclick=async()=>{try{await navigator.clipboard.writeText(DIAG.text(r));b.textContent='✓ Másolva'}catch(e){b.textContent='Nem másolható'}}})}
};
W.DIAG=DIAG;
})(typeof window!=='undefined'?window:globalThis);
