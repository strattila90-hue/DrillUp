/* Drill Up – gép-testreszabás (csak kozmetika): festés, díszcsík, fényszóró-szín. A műhelyben, a bázison vehető meg és váltható.
   Állapot: S.pt = {c, s, l, own:[...]}. Nem érinti a játék fizikáját; az alap kinézet mindig ingyenes és visszaváltható. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('paint');
const COL=[['alap','Gyári (a páncélszint színe)',0,null],['sarga','Építőipari sárga',40e3,['#f0c040','#9a7418']],['piros','Mentő-piros',40e3,['#e0503f','#8a2418']],['kek','Óceánkék',40e3,['#5a9ae0','#25508a']],['zold','Erdőzöld',40e3,['#6aaa5a','#2f6428']],['narancs','Szafari-narancs',60e3,['#f09a40','#a8541a']],['fekete','Matt fekete',90e3,['#4a4d55','#1e2024']],['feher','Sarkvidéki fehér',90e3,['#f2f5f8','#98a6b6']]];
const STR=[['nincs','Nincs díszcsík',0],['sarga','Sárga csík',15e3,'#f0c040'],['piros','Piros csík',15e3,'#e0503f'],['feher','Fehér csík',15e3,'#f2f5f8'],['figy','Figyelmeztető sáv',30e3,'hazard']];
const LNS=[['alap','Meleg fehér (gyári)',0],['hideg','Hideg fehér',20e3,{f:'#eaf4ff',f2:'#dcecff',s:'#d8eaff'}],['boros','Borostyán',20e3,{f:'#ffd27a',f2:'#ffc860',s:'#ffbf50'}]];
const T={c:COL,s:STR,l:LNS};
const PNT={T,
 st(){if(typeof S==='undefined')return{c:'alap',s:'nincs',l:'alap',own:[]};let o=S.pt;if(!o||typeof o!=='object'||Array.isArray(o))o=S.pt={};
  if(typeof o.c!=='string')o.c='alap';if(typeof o.s!=='string')o.s='nincs';if(typeof o.l!=='string')o.l='alap';if(!Array.isArray(o.own))o.own=[];return o},
 find(g,id){return T[g].find(e=>e[0]===id)||T[g][0]},
 has(g,id){const e=PNT.find(g,id);return !e[2]||PNT.st().own.indexOf(g+':'+e[0])>=0},
 // a gép törzsének színe (a meglévő páncél-színpár felülírása, ha van festés)
 hc(def){try{const e=PNT.find('c',PNT.st().c);return e[3]&&PNT.has('c',e[0])?e[3]:def}catch(x){return def}},
 lens(col){try{const e=PNT.find('l',PNT.st().l);if(!e[3]||!PNT.has('l',e[0]))return col;return {'#fff6cc':e[3].f,'#fff0b8':e[3].f2,'#ffe9a8':e[3].s}[col]||col}catch(x){return col}},
 // a díszcsík a hátsó törzsön (a gép méteres koordinátáiban)
 mach(x){try{const e=PNT.find('s',PNT.st().s);if(e[0]==='nincs'||!PNT.has('s',e[0]))return;const y=-.22,h=.12,x0=-12.2,x1=-5.6;x.save();
  if(e[3]==='hazard'){x.fillStyle='#1b1c1f';x.fillRect(x0,y,x1-x0,h);x.fillStyle='#f0c040';for(let px=x0;px<x1;px+=.5){x.beginPath();x.moveTo(px,y+h);x.lineTo(px+.14,y);x.lineTo(Math.min(px+.3,x1),y);x.lineTo(Math.min(px+.16,x1),y+h);x.closePath();x.fill()}}
  else{x.fillStyle=e[3];x.fillRect(x0,y,x1-x0,h)}x.restore()}catch(x_){}},
 buy(g,id){let b=false;try{b=!!base()}catch(e){}if(!b)return toast('🎨 A műhely csak a bázison érhető el.');const e=PNT.find(g,id),o=PNT.st(),key=g+':'+e[0];
  if(e[2]&&o.own.indexOf(key)<0){if(S.cash<e[2])return toast('Nincs elég pénzed.');S.cash-=e[2];o.own.push(key);try{msg('🎨 Megvetted: '+e[1])}catch(x){}}
  o[g]=e[0];try{view()}catch(x){}},
 html(){const o=PNT.st(),b=(()=>{try{return!!base()}catch(e){return false}})();
  const grp=(g,tt)=>`<div class="mu" style="margin-top:8px"><b>${tt}</b></div>`+T[g].map(e=>{const sel=o[g]===e[0],own=!e[2]||o.own.indexOf(g+':'+e[0])>=0,
   lab=e[1]+(e[2]&&!own?' – '+e[2].toLocaleString('hu-HU')+' Ft':'');
   return`<button class="b" style="width:100%;margin-top:4px;${sel?'':'background:#2a211a;color:#e8dcc6;text-shadow:none;box-shadow:none;border:1px solid #4a3a2a'}" ${b?'':'disabled'} onclick="PNT.buy('${g}','${e[0]}')">${sel?'✔ ':''}${lab}</button>`}).join('');
  return`<div class="card">🎨 <b>Testreszabás</b><details style="margin-top:6px"><summary class="mu">Megnyitás</summary>${b?'':'<div class="mu bad">Csak a bázison.</div>'}${grp('c','Festés')}${grp('s','Díszcsík')}${grp('l','Fényszóró színe')}</details></div>`}};
W.PNT=PNT;
if(W.BP)BP.extras.push(()=>PNT.html());
})(typeof window!=='undefined'?window:globalThis);
