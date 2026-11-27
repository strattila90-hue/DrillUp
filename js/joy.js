/* Drill Up – joystick a mozgáshoz (a négy iránygomb és az ÁLLJ helyett).
   Húzd a gombot: az uralkodó irányba (▲▼◀▶) indul a gép. Elengedve visszaugrik középre és megáll –
   kivéve, ha végállásba (ütközésig) tolod: ott marad (reteszel), a gép megy tovább. A gomb megérintése: állj, középre.
   Ha a gép magától megáll (üzemanyag, kemény kőzet, megtelt raktár…), a reteszelt gomb is visszaáll. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('joy');
const DIRS={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]},COL={U:'#4fd0ff',D:'#ff9a1a',L:'#7cff6a',R:'#7cff6a'};
const JOY={dir:null,lat:false,drag:null,
 ui(){return`<div class="joy" id="joy" role="application" aria-label="Joystick: húzd az irányba; végállásban marad">
  <i class="jA jU">▲</i><i class="jA jD">▼</i><i class="jA jL">◀</i><i class="jA jR">▶</i><b class="jK" id="joyK"><span>■</span></b></div>`},
 el(){return typeof document!=='undefined'&&document.getElementById?document.getElementById('joy'):null},
 put(dx,dy,lat){const k=document.getElementById('joyK'),j=JOY.el();if(!k||!j)return;k.style.transform=`translate(${dx}px,${dy}px)`;j.classList.toggle('lat',!!lat);
  for(const d in DIRS){const a=j.querySelector('.j'+d);if(a)a.classList.toggle('on',JOY.dir===d)}},
 center(){JOY.dir=null;JOY.lat=false;JOY.put(0,0,false)},
 go(d){if(d===JOY.dir)return;JOY.dir=d;try{if(d)go(d);else stp()}catch(e){}},
 down(e){const j=JOY.el();if(!j)return;e.preventDefault();e.stopPropagation();const r=j.getBoundingClientRect();
  JOY.drag={cx:r.left+r.width/2,cy:r.top+r.height/2,R:r.width*.34,id:e.pointerId,t:Date.now(),moved:false,was:JOY.lat,sx:e.clientX,sy:e.clientY};try{j.setPointerCapture(e.pointerId)}catch(_){}
  // reteszelt gombnál előbb mozdulni kell (különben ez koppintás = állj); szabad gombnál azonnal követi az ujjat
  if(!JOY.lat){const k=Math.hypot(e.clientX-JOY.drag.cx,e.clientY-JOY.drag.cy);if(k>JOY.drag.R*.35){JOY.drag.moved=true;JOY.move(e)}}},
 move(e){const g=JOY.drag;if(!g||e.pointerId!==g.id)return;if(!g.moved){if(Math.hypot(e.clientX-g.sx,e.clientY-g.sy)<7)return;g.moved=true}let dx=e.clientX-g.cx,dy=e.clientY-g.cy;const m=Math.hypot(dx,dy);if(m>g.R){dx*=g.R/m;dy*=g.R/m}
  const f=Math.min(1,m/g.R);
  if(f<.35){JOY.put(dx,dy,false);if(!g.was)JOY.go(null);return}
  const d=Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U');g.was=false;JOY.lat=false;
  // a gomb a választott tengelyre ugrik (egyértelmű irány)
  const v=DIRS[d],s=Math.min(g.R,m);JOY.go(d);JOY.put(v[0]*s,v[1]*s,f>=.92);g.f=f},
 up(e){const g=JOY.drag;if(!g||e.pointerId!==g.id)return;JOY.drag=null;
  // érintés mozgás nélkül: állj
  if(!g.moved&&Date.now()-g.t<350){JOY.go(null);return JOY.center()}
  if(JOY.dir&&(g.f||0)>=.92){JOY.lat=true;const v=DIRS[JOY.dir];JOY.put(v[0]*g.R,v[1]*g.R,true);try{beep(520,.04,.05,'square')}catch(_){}}
  else{JOY.go(null);JOY.center()}}};
W.JOY=JOY;
if(typeof document!=='undefined'&&document.addEventListener){
 document.addEventListener('pointerdown',e=>{if(e.target&&e.target.closest&&e.target.closest('#joy'))JOY.down(e)},true);
 document.addEventListener('pointermove',e=>{if(JOY.drag)JOY.move(e)},true);
 document.addEventListener('pointerup',e=>{if(JOY.drag)JOY.up(e)},true);
 document.addEventListener('pointercancel',e=>{if(JOY.drag)JOY.up(e)},true)}
// ha a gép magától megállt, a reteszelt joystick is középre áll; a nézet újrarajzolása után visszaáll a gomb helyzete
if(W.on)on('frame',()=>{try{if(typeof S==='undefined'||JOY.drag)return;if(JOY.dir&&S.st==='idle'&&!(W.HYD&&HYD.on())){JOY.center();return}
 if(JOY.lat&&JOY.dir){const k=document.getElementById('joyK');if(k&&!k.style.transform){const j=JOY.el(),R=j?j.getBoundingClientRect().width*.34:30,v=DIRS[JOY.dir];JOY.put(v[0]*R,v[1]*R,true)}}}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
