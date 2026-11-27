/* DrillUp Core Quest – saját rajzolású ikonkészlet (24×24 rács, 2 px vonal, currentColor).
   ICN(név[, osztály]) → inline SVG szöveg. Az emoji-ikonokat váltja: minden eszközön egyforma, éles, a szövegszínt követi.
   A lebegő vásznon lévő gombokat (filmes mód, kijelzők, fúróállomás, világítás, tanterem) is ez rendezi sorba, hogy ne takarják egymást. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('icons');
const P={
 play:'<path class="f" d="M8 4.5v15l12-7.5z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/>',
 refresh:'<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>',
 share:'<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
 install:'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7M9 11.5l3 3 3-3M10.5 19h3"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
 trash:'<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
 star:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1-4.5-4.2 6.1-.8z"/>',
 drill:'<path d="M8 3h8M9 3v4h6V3"/><path d="M9 7l3 14 3-14"/><path d="M9.8 10.6l4.6-1.4M10.6 14.2l3-.9M11.3 17.6l1.5-.5"/>',
 wrench:'<path d="M14.7 6.3a4.2 4.2 0 0 0-5.5 5.5L3.5 17.5a2.1 2.1 0 0 0 3 3l5.7-5.7a4.2 4.2 0 0 0 5.5-5.5l-2.6 2.6-2.4-.6-.6-2.4z"/>',
 box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.2l9 4.6"/>',
 train:'<rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 10h16M8 6.5h8"/><circle class="f" cx="8.5" cy="13" r="1"/><circle class="f" cx="15.5" cy="13" r="1"/><path d="M8 16l-2.5 5M16 16l2.5 5"/>',
 book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2.5 2 2 0 0 0 2 1.5h14"/><path d="M8.5 7.5h7M8.5 11h5"/>',
 menu:'<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
 chart:'<path d="M3 20.5h18M6 20V12M11 20V5M16 20v-9M20.5 20v-5"/>',
 engine:'<rect x="5.5" y="8" width="11" height="9" rx="1.5"/><path d="M8.5 8V5h5v3M16.5 10.5h3v4h-3M5.5 11H3v3h2.5M9 12.5h4"/>',
 bolt:'<path class="f" d="M13.5 2 4.5 13.5h6.5L10 22l9.5-12.5H13z"/>',
 up:'<path d="M5.5 15.5 12 9l6.5 6.5"/>',
 down:'<path d="M5.5 8.5 12 15l6.5-6.5"/>',
 left:'<path d="M15.5 5.5 9 12l6.5 6.5"/>',
 right:'<path d="M8.5 5.5 15 12l-6.5 6.5"/>',
 home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
 stop:'<rect class="f" x="6" y="6" width="12" height="12" rx="2"/>',
 rig:'<path d="M12 2.5 7.5 21M12 2.5 16.5 21M8.7 16h6.6M9.8 11.3h4.4M10.9 6.8h2.2M3.5 21h17"/>',
 film:'<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
 eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 cap:'<path d="M2 9.5 12 4.5l10 5-10 5z"/><path d="M6.5 11.8V16c3 2.4 8 2.4 11 0v-4.2M21 10v5"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
 pin:'<path d="M12 21.5s6.5-6.3 6.5-11.5a6.5 6.5 0 0 0-13 0c0 5.2 6.5 11.5 6.5 11.5z"/><circle cx="12" cy="10" r="2.4"/>',
 brake:'<path d="M8.3 2.5h7.4l5.8 5.8v7.4l-5.8 5.8H8.3l-5.8-5.8V8.3z"/><path d="M8 12h8"/>',
 depth:'<path d="M12 3v14M7 12.5l5 5 5-5M4 21h16"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M14.6 9.4c-.5-.9-1.5-1.4-2.6-1.4-1.6 0-2.8.9-2.8 2 0 2.7 5.8 1.3 5.8 4 0 1.1-1.2 2-2.9 2-1.2 0-2.3-.6-2.8-1.5M12 6.3V8M12 16v1.7"/>',
 core:'<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="6"/><circle class="f" cx="12" cy="12" r="2.6"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 github:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1-4.5-4.2 6.1-.8z"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>'};
const ICN=(n,c)=>'<svg class="icn'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||P.core)+'</svg>';
ICN.P=P;W.ICN=ICN;

// ---- lebegő vászon-gombok: ikon + automatikus sorba rendezés (balról, 46 px-enként, csak a láthatók)
const RAIL=[['cinBtn','film'],['pnBtn','eye'],['rgBtn','rig'],['lgBtn','bulb'],['lecBtn','cap']];
let lastT=0;
function rail(){if(typeof document==='undefined'||!document.getElementById||!W.getComputedStyle)return;let i=0;
 for(const[id,ic]of RAIL){const b=document.getElementById(id);if(!b)continue;
  if(b.dataset.ic!==ic){b.dataset.ic=ic;b.innerHTML=ICN(ic)}
  const vis=getComputedStyle(b).display!=='none';if(!vis)continue;const l=(8+i*46)+'px';if(b.style.left!==l)b.style.left=l;i++}}
if(W.on)on('frame',()=>{const t=Date.now();if(t-lastT<250)return;lastT=t;try{rail()}catch(e){}});
W.ICNrail=rail;
})(typeof window!=='undefined'?window:globalThis);
