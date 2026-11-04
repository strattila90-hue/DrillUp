/* Drill Up – natív-app érzet: mentés védelme, saját párbeszédablak (nincs böngésző-felugró), vissza-gomb a kártyákhoz/cinematichoz,
   rezgés eseményekre, iOS telepítési tipp, leállított hang háttérben, csökkentett mozgás tiszteletben tartása. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('appshell');
const d=typeof document!=='undefined'?document:null;
const NAT=W.NAT=W.NAT||{app:false};
// ---- rezgés (Beállítások: S.set.hap === 0 → ki)
NAT.hap=p=>{try{if(typeof S!=='undefined'&&S.set&&S.set.hap===0)return;if(navigator.vibrate)navigator.vibrate(p)}catch(e){}};
// ---- saját párbeszédablak
NAT.ask=(msg,ok,fn,cancel)=>{if(!d||!d.body||!d.getElementById||!d.createElement){return fn&&fn()}
 let m=d.getElementById('natDlg');if(m)m.remove();m=d.createElement('div');m.id='natDlg';
 m.innerHTML=`<div class="nd" role="dialog" aria-modal="true"><div class="nm"></div><div class="nb"><button class="b g" data-c>${cancel||'Mégse'}</button><button class="b" data-o>${ok||'Rendben'}</button></div></div>`;
 m.querySelector('.nm').textContent=msg;d.body.appendChild(m);
 const close=()=>m.remove();m.querySelector('[data-c]').onclick=close;m.querySelector('[data-o]').onclick=()=>{close();try{fn&&fn()}catch(e){}};
 m.addEventListener('pointerdown',e=>{if(e.target===m)close()});NAT.hap(12)};
// ---- mentés védelme a böngészőtől (tároló-ürítés ellen)
NAT.persist=async()=>{try{if(navigator.storage&&navigator.storage.persist&&!(await navigator.storage.persisted()))NAT.persisted=await navigator.storage.persist();else NAT.persisted=true}catch(e){}};
if(d){let once=false;const first=()=>{if(once)return;once=true;NAT.persist()};['pointerup','touchend','keydown'].forEach(n=>d.addEventListener(n,first,{passive:true}))}
// ---- vissza-gomb: előbb a nyitott kártya/cinematic/lista záródik, a menü csak utána nyílik
NAT.back=()=>{try{if(W.CIN&&CIN.on){CIN.exit();return true}
 if(!d||!d.getElementById)return false;
 const dlg=d.getElementById('natDlg');if(dlg){dlg.remove();return true}
 const pp=d.getElementById('pnPop');if(pp){pp.remove();return true}
 for(const id of['srfCard','stoCard']){const c=d.getElementById(id);if(c&&c.style.display==='block'){c.style.display='none';if(id==='stoCard'&&W.STO)STO.cur=null;return true}}
 if(W.ZM&&ZM.t>1){ZM.t=1;return true}}catch(e){}return false};
// ---- iOS: nincs beforeinstallprompt, ezért rövid tipp (egyszer)
NAT.iosHint=()=>{try{const ua=navigator.userAgent||'',ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);if(!ios||NAT.app||navigator.standalone)return;if(localStorage.getItem('du_ios_hint'))return;
 localStorage.setItem('du_ios_hint','1');const b=d.createElement('div');b.id='iosHint';b.innerHTML='📲 Telepítéshez: <b>Megosztás ⎋ → Főképernyőhöz adás</b><button aria-label="Bezár">✕</button>';b.querySelector('button').onclick=()=>b.remove();d.body.appendChild(b);setTimeout(()=>b.remove(),14000)}catch(e){}};
if(d)setTimeout(NAT.iosHint,5000);
W.addEventListener&&W.addEventListener('appinstalled',()=>{try{NAT.app=true;if(typeof ip!=='undefined')ip=null}catch(e){}});
// ---- háttérben: a hang áll (akku), visszatéréskor folytatódik (a játék saját visibilitychange-e a többit intézi)
if(d)d.addEventListener('visibilitychange',()=>{try{if(typeof AC!=='undefined'&&AC){if(d.hidden){if(AC.state==='running'&&AC.suspend)AC.suspend()}else if(AC.state!=='running'&&AC.resume)AC.resume()}}catch(e){}});
// ---- csökkentett mozgás
NAT.reduced=()=>{try{return W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
// ---- esemény-rezgések
if(W.on)on('frame',()=>{});
const wrap=(o,k,pat)=>{if(o&&typeof o[k]==='function'&&!o[k].__h){const f=o[k];o[k]=function(){NAT.hap(pat);return f.apply(this,arguments)};o[k].__h=1}};
W.addEventListener&&W.addEventListener('load',()=>{setTimeout(()=>{wrap(W.DMG,'explode',[80,40,160]);wrap(W.DEP,'ship',[25,40,25]);wrap(W.STO,'open',[12,30,12]);wrap(W.SRF,'up',[15,30,25]);wrap(W.SRF,'toggle',8);wrap(W.ZM,'toggle',10);wrap(W.PN,'set',8);wrap(W.CIN,'enter',[20,30,20])},0)});
})(typeof window!=='undefined'?window:globalThis);
