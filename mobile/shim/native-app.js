/* DrillUp Core Quest – csak a natív appban (Android APK / iOS) betöltött kiegészítés.
   A copy-web.js illeszti be a www/index.html elejére, a weboldalra NEM kerül.
   - Frissítés gomb: a GitHub legújabb kiadásából letölti az új játék-csomagot (web-bN.zip) és újraindul vele (mentés megmarad);
     ha a játék friss, felajánlja az app (APK) frissítését is (ApkUpdater natív bővítmény → Android telepítő)
   - automatikus frissítés: induláskor és visszatéréskor (legfeljebb 30 percenként) a háttérben letölti az új csomagot,
     és amikor az app a háttérbe kerül, csendben átvált rá – nem szakítja meg a játékot
   - kényszerített frissítés: a kiadásban lévő policy-w<minWeb>-a<minApk>.txt szerint a túl régi csomag/app nem indul frissítés nélkül
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

// --- a legújabb kiadás: játékcsomag (web-bN.zip), app (CoreQuest.apk) és a kényszer-szabály (policy-w<minWeb>-a<minApk>.txt) ---
const APK=P('ApkUpdater');
const android=()=>{try{return C.getPlatform()==='android'}catch(e){return false}};
async function newest(){
 const r=await fetch('https://api.github.com/repos/'+REPO+'/releases/latest',{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});
 if(!r.ok)throw new Error('HTTP '+r.status);
 const rel=await r.json();let best=null,apk='',minWeb=0,minApk=0;const sums={};
 for(const a of rel.assets||[]){const n=a.name||'';let m;
  if(m=/^web-b(\d+)\.zip$/.exec(n)){if(!best||+m[1]>best.n)best={n:+m[1],url:a.browser_download_url}}
  else if(n==='CoreQuest.apk')apk=a.browser_download_url;
  else if(m=/^websum-b(\d+)-([0-9a-f]{64})\.txt$/.exec(n))sums[m[1]]=m[2];
  else if(m=/^policy-w(\d+)-a(\d+)\.txt$/.exec(n)){minWeb=+m[1];minApk=+m[2]}}
 return best&&Object.assign(best,{apk,minWeb,minApk,sum:sums[best.n]||''});
}
// az app (APK) saját sorszáma; régi app (a bővítmény előtti) → 0
async function nativeCode(){if(!APK||!android())return 0;try{return +(await APK.info()).versionCode||0}catch(e){return 0}}
NA.native=0;nativeCode().then(v=>NA.native=v);

// --- teljes képernyős, nem bezárható ablak a kötelező frissítéshez ---
function wall(title,body,btns){let o=document.getElementById('updWall');if(!o){o=document.createElement('div');o.id='updWall';
  o.style.cssText='position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,6,4,.94);color:#f3e7d2;font:15px Georgia,serif;text-align:center';document.body.appendChild(o)}
 o.innerHTML='<div style="max-width:340px"><div style="font-size:42px;margin-bottom:8px">⬆</div><b style="font-size:20px;color:#ffc65a">'+title+'</b><p id="updMsg" style="opacity:.9;line-height:1.45">'+body+'</p><div style="display:flex;flex-direction:column;gap:10px">'+
  (btns||[]).map((b,i)=>'<button data-i="'+i+'" style="padding:14px;border-radius:12px;border:0;font:700 15px Georgia,serif;'+(i?'background:#3a3129;color:#f3e7d2':'background:linear-gradient(#ffcd5a,#e8860f);color:#2a1604')+'">'+b[0]+'</button>').join('')+'</div></div>';
 o.querySelectorAll('button').forEach(el=>el.onclick=()=>btns[+el.dataset.i][1]());return o}
const wmsg=m=>{const e=document.getElementById('updMsg');if(e)e.textContent=m};

// --- játékcsomag: letöltés és azonnali indítás ---
let busy=false,pending=null;
// a csomag letöltése; ha ez a verzió már le van töltve (pl. az automatikus frissítés már behozta), azt használja – a frissítő a dupla letöltést elutasítja
async function getBundle(best){const v='b'+best.n;
 try{const l=await UPD.list();const ex=((l&&l.bundles)||[]).find(b=>b.version===v&&b.status!=='error'&&b.status!=='deleted');if(ex)return ex}catch(e){}
 if(!best.sum)throw new Error(t('a kiadásban nincs ellenőrzőösszeg','the release has no checksum'));
 try{return await UPD.download({url:best.url,version:v,checksum:best.sum})}
 catch(e){try{const l=await UPD.list();const ex=((l&&l.bundles)||[]).find(b=>b.version===v);if(ex)return ex}catch(_){}throw e}}
async function applyWeb(best){try{if(typeof W.save==='function')W.save()}catch(e){}const b=await getBundle(best);await UPD.set({id:b.id})}
// érthető hibaüzenet a valódi okkal
function why(e){const m=String(e&&(e.message||e.code||e)||'');if(/403|rate/i.test(m))return t('a GitHub átmenetileg korlátozza a lekérdezéseket – próbáld pár perc múlva','GitHub is rate-limiting requests – try again in a few minutes');
 if(/HTTP 404/.test(m))return t('nincs kiadás','no release found');if(!navigator.onLine)return t('nincs internetkapcsolat','no internet connection');return t('hiba: ','error: ')+m.replace(/https?:\/\/\S+/g,'').slice(0,120)}

// --- app (APK): letöltés + Android telepítő; régi appban (bővítmény nélkül) a böngésző tölti le ---
NA.apk=async(url,forced)=>{
 url=url||'https://github.com/'+REPO+'/releases/latest/download/CoreQuest.apk';
 try{if(typeof W.save==='function')W.save()}catch(e){}
 if(!APK||!android()){location.href=url;return}
 let h=null;try{h=await APK.addListener('progress',e=>wmsg(t('Letöltés: ','Downloading: ')+Math.round(e.p*100)+'%'))}catch(e){}
 wall(t('App frissítése','Updating the app'),t('Letöltés…','Downloading…'),forced?[]:[[t('Mégse','Cancel'),()=>document.getElementById('updWall').remove()]]);
 try{await APK.install({url});wmsg(t('Erősítsd meg a telepítést az Android ablakában. A mentésed megmarad.','Confirm the installation in the Android dialog. Your save is kept.'))}
 catch(e){const perm=/PERMISSION|permission/.test(String(e&&(e.code||e.message)));
  wall(t('App frissítése','Updating the app'),perm?t('Engedélyezd: „Telepítés ismeretlen forrásból” ennél az appnál, majd lépj vissza és próbáld újra.','Allow “Install unknown apps” for this app, then come back and try again.'):
   t('A telepítés nem sikerült. Ha az Android „nincs telepítve” hibát ír, a régi app más kulccsal készült: mentsd ki az állást, töröld az appot, és telepítsd az újat.','Installation failed. If Android says “app not installed”, the old app was signed with another key: export your save, uninstall, then install the new one.'),
   [[t('Újra','Retry'),()=>NA.apk(url,forced)],[t('Mentés exportálása','Export save'),()=>{try{W.expSave()}catch(_){}}]].concat(forced?[]:[[t('Később','Later'),()=>document.getElementById('updWall').remove()]]))}
 finally{try{h&&h.remove()}catch(e){}}
};

// --- kényszer: ha a kiadás szabálya szerint ez a csomag/app túl régi, nem lehet tovább játszani frissítés nélkül ---
async function enforce(rel){
 if(rel.minApk&&android()&&(NA.native=await nativeCode())<rel.minApk){
  wall(t('Kötelező app-frissítés','App update required'),t('Ehhez a verzióhoz új app (APK) kell. A mentésed megmarad.','This version needs a new app (APK). Your save is kept.'),[[t('Letöltés és telepítés','Download and install'),()=>NA.apk(rel.apk,true)],[t('Mentés exportálása','Export save'),()=>{try{W.expSave()}catch(_){}}]]);return true}
 if(rel.minWeb&&NA.build<rel.minWeb&&UPD){wall(t('Kötelező frissítés','Update required'),t('Új játékcsomag letöltése…','Downloading the new game package…'),[]);
  try{await applyWeb(rel)}catch(e){wall(t('Kötelező frissítés','Update required'),t('A letöltés nem sikerült – kapcsold be az internetet.','Download failed – please go online.'),[[t('Újra','Retry'),()=>enforce(rel)]])}return true}
 return false}

// --- Frissítés gomb: azonnal (szabály, játékcsomag, majd felajánlja az app frissítését is) ---
NA.update=async()=>{
 if(!UPD)return location.reload();
 if(busy)return;busy=true;
 try{
  say(t('Keresés…','Searching…'));
  const best=await newest();if(!best)return say(t('✔ Ez a legfrissebb verzió.','✔ You have the latest version.'));
  if(await enforce(best))return;
  if(best.n>NA.build){say(t('⬇ Új verzió letöltése…','⬇ Downloading the new version…'));await applyWeb(best);return}
  const nc=await nativeCode();
  if(nc&&best.apk&&nc<best.n&&typeof W.NAT==='object'&&W.NAT.ask)W.NAT.ask(t('A játék a legfrissebb. Az app (APK) is frissíthető (b'+nc+' → b'+best.n+'). Telepíted?','The game is up to date. The app (APK) can be updated too (b'+nc+' → b'+best.n+'). Install it?'),t('Telepítés','Install'),()=>NA.apk(best.apk));
  else say(t('✔ Ez a legfrissebb verzió.','✔ You have the latest version.'));
 }catch(e){const w=why(e);say('⚠ '+t('A frissítés nem sikerült','Update failed')+' – '+w);
  try{if(android()&&typeof W.NAT==='object'&&W.NAT.ask)W.NAT.ask(t('A gyors frissítés nem sikerült ('+w+'). Letöltöd a teljes appot (APK)? A mentésed megmarad.','The quick update failed ('+w+'). Download the full app (APK)? Your save is kept.'),t('Letöltés','Download'),()=>NA.apk())}catch(_){}}
 finally{busy=false}
};

// --- automatikus frissítés: induláskor és visszatéréskor (legfeljebb 30 percenként) ellenőriz;
//     a kötelezőt azonnal alkalmazza, a többit a háttérben letölti, és amikor az app a háttérbe kerül, csendben átvált rá ---
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
async function autoUpd(force){
 if(!UPD||busy||!navigator.onLine)return;
 const now=Date.now();if(!force&&now-(+LS.get('cq-upd-last')||0)<30*60e3)return;
 busy=true;
 try{
  LS.set('cq-upd-last',String(now));
  const best=await newest();if(!best)return;
  if(await enforce(best))return;
  if(best.n<=NA.build||(pending&&pending.n>=best.n))return;
  const b=await getBundle(best);
  await UPD.next({id:b.id});pending={n:best.n,id:b.id};
  say(t('⬇ Új verzió letöltve – amint az app a háttérbe kerül, frissül (vagy Menü → Frissítés most).','⬇ New version downloaded – it applies as soon as the app goes to the background (or Menu → Update now).'));
 }catch(e){}
 finally{busy=false}
}
setTimeout(()=>autoUpd(true),6000);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(pending&&UPD){const p=pending;pending=null;try{if(typeof W.save==='function')W.save()}catch(e){}UPD.set({id:p.id}).catch(()=>{pending=p})}}
 else setTimeout(autoUpd,3000)});

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
