/* DrillUp Core Quest – csak a natív appban (Android APK / iOS) betöltött kiegészítés.
   A copy-web.js illeszti be a www/index.html elejére, a weboldalra NEM kerül.
   - Frissítés gomb: a GitHub legújabb kiadásából letölti az új játék-csomagot (web-bN.zip) és újraindul vele (mentés megmarad)
   - automatikus frissítés: induláskor (és visszatéréskor legfeljebb 6 óránként) a háttérben letölti az új csomagot,
     és a következő indításkor azzal indul – nem szakítja meg a játékot
   - rezgés (Haptics), megosztás (Share), mentés-exportálás fájlba (Filesystem + Share)
   - a böngészős teljes képernyő kikapcsolva (a WebView-ban elrontaná a képet) */
(function(W){
'use strict';
const C=W.Capacitor;if(!C||!C.registerPlugin)return;
const REPO='strattila90-hue/DrillUp';
const P=n=>{try{return C.isPluginAvailable&&!C.isPluginAvailable(n)?null:C.registerPlugin(n)}catch(e){return null}};
const UPD=P('CapacitorUpdater'),HAP=P('Haptics'),SHR=P('Share'),FSY=P('Filesystem');
const en=()=>!!(W.I18N&&W.I18N.lang==='en'),t=(hu,e)=>en()?e:hu;
const say=m=>{try{if(typeof W.toast==='function')W.toast(m)}catch(e){}};
const NA={build:+W.APPBUILD||0};W.NAPP=NA;

// a frissítő tudja: ez a csomag rendben elindult (különben 10 mp után visszaáll az előzőre)
try{UPD&&UPD.notifyAppReady().catch(()=>{})}catch(e){}

// --- a legújabb játék-csomag keresése a GitHub-kiadásban ---
async function newest(){
 const r=await fetch('https://api.github.com/repos/'+REPO+'/releases/latest',{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});
 if(!r.ok)throw new Error('HTTP '+r.status);
 const rel=await r.json();let best=null;
 for(const a of rel.assets||[]){const m=/^web-b(\d+)\.zip$/.exec(a.name||'');if(m&&(!best||+m[1]>best.n))best={n:+m[1],url:a.browser_download_url}}
 return best;
}

// --- Frissítés gomb ---
let busy=false;
NA.update=async()=>{
 if(!UPD)return location.reload();
 if(busy)return;busy=true;
 try{
  say(t('Keresés…','Searching…'));
  const best=await newest();
  if(!best||best.n<=NA.build){say(t('✔ Ez a legfrissebb verzió.','✔ You have the latest version.'));return}
  say(t('⬇ Új verzió letöltése…','⬇ Downloading the new version…'));
  try{if(typeof W.save==='function')W.save()}catch(e){}
  const b=await UPD.download({url:best.url,version:'b'+best.n});
  say(t('🔄 Telepítés…','🔄 Installing…'));
  await UPD.set({id:b.id}); // újratölti a játékot az új csomaggal
 }catch(e){say(t('⚠ A frissítés nem sikerült – van internet?','⚠ Update failed – are you online?'))}
 finally{busy=false}
};

// --- automatikus frissítés: háttérben letölti, a következő indításkor (vagy a Frissítés gombra azonnal) él ---
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
async function autoUpd(){
 if(!UPD||busy||!navigator.onLine)return;
 const now=Date.now();if(now-(+LS.get('cq-upd-last')||0)<6*3600e3)return;
 busy=true;
 try{
  LS.set('cq-upd-last',String(now));
  const best=await newest();
  if(!best||best.n<=NA.build)return;
  if(+LS.get('cq-upd-next')===best.n)return; // már letöltve, a következő indításkor él
  const b=await UPD.download({url:best.url,version:'b'+best.n});
  await UPD.next({id:b.id});
  LS.set('cq-upd-next',String(best.n));
  say(t('⬇ Új verzió letöltve – a következő indításkor él (vagy Menü → Frissítés most).','⬇ New version downloaded – it starts next time (or Menu → Update now).'));
 }catch(e){}
 finally{busy=false}
}
setTimeout(autoUpd,8000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(autoUpd,3000)});

// --- rezgés: a WebView nem rezget, a natív Haptics igen ---
if(HAP){
 const vib=p=>{try{const a=Array.isArray(p)?p:[p];let d=0;for(let i=0;i<a.length;i+=2)d+=+a[i]||0;if(d>0)HAP.vibrate({duration:Math.min(d,1000)}).catch(()=>{})}catch(e){}return true};
 try{Object.defineProperty(Navigator.prototype,'vibrate',{value:vib,configurable:true,writable:true})}catch(e){try{navigator.vibrate=vib}catch(x){}}
}

// --- megosztás: Android WebView-ban nincs navigator.share ---
if(SHR){
 const sh=d=>SHR.share({title:d&&d.title,text:d&&d.text,url:d&&d.url||undefined,dialogTitle:d&&d.title}).then(()=>undefined);
 try{Object.defineProperty(Navigator.prototype,'share',{value:sh,configurable:true,writable:true})}catch(e){try{navigator.share=sh}catch(x){}}
}

// --- mentés exportálása: a WebView nem tud blob-letöltést, ezért fájlba írjuk és felajánljuk megosztásra ---
if(FSY){
 const click=HTMLAnchorElement.prototype.click;
 HTMLAnchorElement.prototype.click=function(){
  const href=this.href||'',name=(this.download||'').replace(/[^\w.\-]/g,'_');
  if(!name||!/^blob:/.test(href))return click.call(this);
  (async()=>{try{
   const txt=await (await fetch(href)).text();
   try{await FSY.writeFile({path:'DrillUp/'+name,data:txt,directory:'DOCUMENTS',encoding:'utf8',recursive:true})}catch(e){}
   const w=await FSY.writeFile({path:name,data:txt,directory:'CACHE',encoding:'utf8'});
   if(SHR)await SHR.share({title:name,files:[w.uri],dialogTitle:t('Mentés küldése / tárolása','Send / store the save')}).catch(()=>{});
  }catch(e){}})();
 };
}

// --- teljes képernyő: a natív app már teljes ablakos; a böngészős API itt üres képet okozhat ---
try{delete Element.prototype.requestFullscreen}catch(e){}
try{delete Element.prototype.webkitRequestFullscreen}catch(e){}
})(window);
