/* Drill Up – teljesítmény-figyelő: kapcsolható FPS-kijelző, és értesítés, ha a minőségváltó (Gov) lassúság miatt visszavett az effektekből.
   A visszavételt a meglévő Gov végzi (mérés alapján, automatikusan); ez a modul csak láthatóvá teszi és számolja (S.ss.pd). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('perf');
const PF={ema:16.7,t:0,q:null,lastWarn:0,
 fps(){return PF.ema>0?Math.round(1000/PF.ema):0},
 frame(dt){const ms=dt*1000;if(ms>0&&ms<400)PF.ema+=(ms-PF.ema)*.1;
  const q=W.Gov?Gov.q:2;
  if(PF.q!==null&&q<PF.q){const o=W.ST?ST.ss():null;if(o)o.pd=(o.pd||0)+1;const n=Date.now();
   if(n-PF.lastWarn>6e4&&typeof S!=='undefined'&&S.set&&S.set.fps!==0){PF.lastWarn=n;try{toast('⚙ Lassúságot észleltem – automatikusan csökkentettem az effekteket (minőség: '+['alap','közepes','teljes'][q]+').')}catch(e){}}}
  PF.q=q;PF.t+=dt;if(PF.t<.5)return;PF.t=0;PF.show()},
 show(){const d=W.document;if(!d||!d.getElementById||!d.createElement||!d.body)return;
  const on=typeof S!=='undefined'&&S.set&&S.set.fpsb===1;let e=d.getElementById('fpsB');
  if(!on){if(e)e.style.display='none';return}
  if(!e){e=d.createElement('div');e.id='fpsB';d.body.appendChild(e)}
  e.style.display='block';const q=W.Gov?Gov.q:2;e.textContent=PF.fps()+' fps · Q'+q+(W.Gov&&Gov.mode==='a'?' (auto)':'')}};
W.PF=PF;
if(W.on)on('frame',dt=>{try{PF.frame(Math.min(dt,.5))}catch(e){DBG.err='perf: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
