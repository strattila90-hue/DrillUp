/* Drill Up – elrendezés-segéd: méri, mennyi hely van a képernyő alján a vezérlőpult/fülsor felett (--dk), és jelzi az aktív fület (body[data-tab]).
   Ezt használják a felugró kártyák (Beszámoló, bázis-kártya, „Távollétedben"), hogy alulról, a vezérlők felett jelenjenek meg, és ne takarják a játékteret. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('layout');
const LAY={dk:-1,tab:-1,
 measure(){const d=W.document;if(!d||!d.querySelector||!d.documentElement||!d.documentElement.style)return false;
  const el=d.querySelector('.dock')||d.getElementById&&d.getElementById('nv');if(!el||!el.getBoundingClientRect)return false;
  const top=el.getBoundingClientRect().top,v=Math.round(Math.max(0,(W.innerHeight||0)-top));
  if(v>0&&v!==LAY.dk){LAY.dk=v;d.documentElement.style.setProperty('--dk',v+'px')}
  {const mm=d.getElementById&&d.getElementById('mm'),o=mm&&mm.style.display!=='none'&&mm.getBoundingClientRect().width>0?'1':'0';if(d.body&&d.body.getAttribute('data-mm')!==o)d.body.setAttribute('data-mm',o)}
  if(d.body&&typeof tab!=='undefined'&&tab!==LAY.tab){LAY.tab=tab;d.body.setAttribute('data-tab',String(tab))}return true},
 t:0};
W.LAY=LAY;
if(W.on)on('frame',dt=>{LAY.t+=dt;if(LAY.t<.4)return;LAY.t=0;try{LAY.measure()}catch(e){}});
if(W.addEventListener)W.addEventListener('resize',()=>{try{LAY.measure()}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
