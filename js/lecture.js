/* Drill Up – Tanterem: pihenő gépnél egy gombbal induló előadás-mód (a cinematic mód felirataival és kamera-fókuszával).
   Tartalom: a gép részei a saját, aktuális adataiddal, lejtő- és tapadás-fizika, a Föld rétegei, vulkánok, a megtalált valós beszámolók.
   Csak megjelenít, a játékállapotot nem módosítja. Kilépés: koppintás (vagy vissza-gomb). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('lecture');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const LEC={on:false,i:-1,list:[],bt:0,
 safe(f){try{return f()}catch(e){return null}},
 build(){const L=[],add=(e)=>{if(e&&e.t&&e.s){e.dur=e.dur||cl(8+e.s.length*.04,9,22);L.push(e)}};
  const mach=[],earth=[],story=[];
  mach.push(LEC.safe(()=>{const i=S.u.d,d=D[i],m=typeof mass==='function'?mass():1e5;return{k:'⚙',sub:'A gép · Meghajtás',t:d[0],s:`Teljesítmény: ${d[1].toLocaleString('hu-HU')} MW, hatásfok ${Math.round(d[2]*100)}%. A gép tömege kb. ${Math.round(m/1000).toLocaleString('hu-HU')} tonna. Lejtőn a szükséges erő F = m·g·(gördülési ellenállás + meredekség): minél nehezebb a gép és minél meredekebb a lejtő, annál több teljesítmény kell – ezért lassul a gyengébb gép a dombon.`,f:[-30,0,2]}}));
  mach.push(LEC.safe(()=>{const i=S.u.f;return{k:'⛏',sub:'A gép · Fúrófej',t:HD[i][0],s:`Ez a fej ${HD[i][1]} egység kőzetkeménységig bírja. Ha a kőzet keményebb, a fej felforrósodik és kopik; mélyebben a kőzet egyre keményebb, ezért kell a jobb fej. A fej előtt a kőzet nyomásra és repedésekre törik, a szilánkokat a gép hátrahordja.`,f:[75,0,2.4]}}));
  mach.push(LEC.safe(()=>{const i=S.u.h;return{k:'🛡',sub:'A gép · Páncél',t:H[i][0],s:`A páncél kb. ${H[i][1]} °C-ig véd. A Föld hőmérséklete a kéregben kilométerenként mintegy 25–30 °C-kal nő, a magnál több ezer fok van – a mélység határát gyakran a hő szabja meg, nem a kőzet.`,f:[-10,-8,2]}}));
  mach.push(LEC.safe(()=>{const mu=W.HILL?HILL.mu():.5;return{k:'🚜',sub:'A gép · Lánctalp és tapadás',t:`Tapadás: ${Math.round(mu*100)}%`,s:`A lánctalp súrlódási tényezője (μ) most ${mu.toFixed(2).replace('.',',')}. Ha a lejtő meredeksége (tg α) nagyobb ennél, a gép megcsúszik és visszacsúszik. A vulkán kúpja kb. 30°-os (tg α ≈ 0,6), ehhez nagyobb gép és szélesebb lánctalp kell.`,f:[-20,24,2.4]}}));
  mach.push(LEC.safe(()=>({k:'📦',sub:'A gép · Tank és raktér',t:'Üzemanyag és rakomány',s:`A tankban ${Math.round(tank()).toLocaleString('hu-HU')} kg üzemanyag fér el, a raktérben ${Math.round(cap()).toLocaleString('hu-HU')} kg anyag. Lejtőn és fúrás közben a fogyasztás nő; a szállított anyagot a bázison, a depóban lehet eladni.`,f:[-70,0,1.9]})));
  if(LEC.safe(()=>GEO.ens().sz.lv>0))mach.push({k:'📡',sub:'A gép · Szeizmográf',t:'Földrengés-hullámok',s:'A P-hullám (nyomás) gyorsabb, az S-hullám (nyírás) lassabb, és folyadékon nem megy át. Ebből derítették ki a 20. század elején, hogy a Föld magja folyékony, belül szilárd maggal.',f:[0,0,1.5]});
  for(let i=0;i<LY.length;i++){const l=LY[i];if(typeof LE!=='undefined'&&LE[i])earth.push({k:'🌍',sub:'A Föld rétegei · '+STO.fd(l[1]*1)+' – '+STO.fd(l[2]),t:l[0].split(' (')[0],s:LE[i],f:[0,0,1.25]})}
  if(W.VOL)for(const f of VOL.FACTS)earth.push({k:'🌋',sub:'Vulkánok',t:'Tudtad?',s:f,f:[0,0,1.25]});
  if(W.STO)for(const e of STO.DB)if(STO.has(e.id))story.push({k:e.k,sub:e.y+' · '+STO.fd(e.d),t:e.t,s:e.s,f:[0,0,1.25],id:0});
  // sorrend: bevezető, a gép, majd a rétegek, a vulkánok és a megtalált történetek váltakozva
  const intro={k:'🎓',sub:'Tanterem',t:'A Drill Up gép és a Föld',s:'Rövid előadás a gépedről, a lejtők fizikájáról, a Föld rétegeiről, a vulkánokról és a lejátszott valós eseményekről. Koppints bárhová a kilépéshez.',f:[-30,0,1.3],dur:8};
  add(intro);for(const e of mach)add(e);const mx=Math.max(earth.length,story.length);for(let i=0;i<mx;i++){if(earth[i])add(earth[i]);if(story[i])add(story[i])}
  return L},
 start(){if(LEC.on||!W.CIN||typeof S==='undefined')return;if(S.st!=='idle'){try{toast('Az előadás csak álló gépnél indul.')}catch(e){}return}
  LEC.list=LEC.build();if(!LEC.list.length)return;LEC.i=-1;LEC.on=true;CIN.lec=true;CIN.enter();CIN.hint=1;LEC.next()},
 next(){if(!LEC.list.length)return;LEC.i=(LEC.i+1)%LEC.list.length;CIN.caption(LEC.list[LEC.i])},
 step(dt){if(!LEC.on)return;if(!CIN.on){LEC.on=false;return}if(!CIN.cap)LEC.next()},
 btn(){if(typeof document==='undefined'||!document.getElementById)return;const st=document.getElementById('stage');if(!st)return;let b=document.getElementById('lecBtn');
  const show=typeof S!=='undefined'&&S.st==='idle'&&!(W.CIN&&CIN.on);if(!b&&show){b=document.createElement('button');b.id='lecBtn';b.setAttribute('aria-label','Tanterem – előadás');b.textContent='🎓';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();LEC.start()};st.appendChild(b)}if(b)b.style.display=show?'block':'none'}
};
W.LEC=LEC;
if(W.on)on('frame',dt=>{try{LEC.bt+=dt;if(LEC.bt>.5){LEC.bt=0;LEC.btn()}LEC.step(Math.min(dt,.1))}catch(e){DBG.err='lecture: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
