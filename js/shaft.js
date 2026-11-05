/* Drill Up – a járat (akna) vezeti a gépet esés közben.
   • Falvezetés: az akna 4,4 m széles, a gép ~3,7 m: a falak a gépet az akna tengelyére terelik (az x lassan a tengelyhez simul).
   • Imbolygás és súrlódás: a falhoz csapódva a gép kissé megbillen (csillapodó lengés), szikrázik és csikorog; a sebességgel nő.
   • Dugattyú-hatás: a szűk aknában a gép alatti levegő nem tud kitérni, ezért a fékező légellenállás többszörös (tunnels.js: PIS).
   Egyszerűsített modell, de a viselkedés iránya valós: szűk aknában lassabban zuhan, és a fal tartja. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('shaft');
const SH={sw:0,sv:0,t:0,cl:0,
 // a gép alatti függőleges akna tengelye (x), ha van
 axis(){if(!W.NET||typeof S==='undefined')return null;let ax=null;NET.each(S.x,S.depth,g=>{if(g[0]===g[2]&&NET.hit(g,S.x,S.depth,0)){ax=g[0];return true}return false});return ax},
 step(dt){if(!W.NET||typeof S==='undefined')return;
  const f=NET.falling,sp=f?Math.min(1,NET.vz/30):0;
  if(f){const ax=SH.axis();if(ax!==null)S.x+=(ax-S.x)*Math.min(1,dt*5);
   // lengés: csillapodó rugó + a falak lökései a sebességgel arányosan
   SH.t-=dt;if(SH.t<=0&&sp>.12){SH.t=.25+Math.random()*.5*(1.2-sp);SH.sv+=(Math.random()<.5?-1:1)*(.05+.12*sp);SH.hit(sp)}}
  SH.sv+=(-SH.sw*60-SH.sv*7)*dt;SH.sw+=SH.sv*dt;SH.sw=Math.max(-.07,Math.min(.07,SH.sw));
  if(!f&&Math.abs(SH.sw)<.001&&Math.abs(SH.sv)<.01){SH.sw=0;SH.sv=0}
  NET.sw=SH.sw;NET.sv=SH.sv},
 // egy falérintés: szikra az érintett oldalon, csikorgás
 hit(sp){try{if(typeof pr!=='undefined'&&Array.isArray(pr)&&sp>.15){const side=SH.sv>0?1:-1;for(let i=0;i<3+(sp*5|0);i++)pr.push({x:S.x+side*1.7,y:S.depth-1+Math.random()*3,vx:-side*(1+Math.random()*3),vy:(Math.random()-.5)*4,l:.3+Math.random()*.4,t:'sp'})}
   if(W.clank&&Date.now()-SH.cl>350&&sp>.3){SH.cl=Date.now();clank(.15+.25*sp)}}catch(e){}}};
W.SH=SH;
if(W.on)on('frame',dt=>{try{SH.step(Math.min(dt,.1))}catch(e){DBG.err='shaft: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
