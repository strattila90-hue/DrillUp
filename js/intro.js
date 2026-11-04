/* Drill Up – 5/D: fúrás előtti animáció. Amikor a gép a bázisról (0 m) elindul lefelé, ~2,6 mp-es bevezető fut:
   daru leereszti a gépet a fúrt aknába, ellenőrzőlista (üzemanyag, páncél, fúrófej-élesség), visszaszámlálás.
   Bárhol érintve átugorható; beállítás: S.set.intro=0 kikapcsolja. Az animáció csak vizuális, a játékállapotot nem változtatja. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('intro');
const DUR=2.6;
const INTRO={off:false,on:false,last:0,
 want(s){return !INTRO.off&&!INTRO.skip&&!INTRO.on&&s==='D'&&S.depth<1&&S.st==='idle'&&S.set.intro!==0&&Date.now()-INTRO.last>45e3&&typeof W.requestAnimationFrame==='function'&&W.document&&W.document.body},
 play(done){INTRO.on=true;const doc=W.document,c=doc.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:90;background:#000;touch-action:none';doc.body.appendChild(c);
  const w=c.clientWidth||W.innerWidth||360,h=c.clientHeight||W.innerHeight||640,d=Math.min(W.devicePixelRatio||1,1.5);c.width=w*d|0;c.height=h*d|0;const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);
  let t=0,last=0,fin=false;const finish=()=>{if(fin)return;fin=true;INTRO.on=false;INTRO.last=Date.now();try{c.remove()}catch(e){}try{done()}catch(e){}};
  if(c.addEventListener)c.addEventListener('pointerdown',finish);
  const fuel=Math.round(100*S.fuel/Math.max(1,tank())),hp=Math.round(S.hp),bit=Math.round(100-(S.hw||0));
  const chk=[['ÜZEMANYAG',fuel+'%',fuel>10],['PÁNCÉL',hp+'%',hp>25],['FÚRÓFEJ',bit+'%',bit>15],['HIDRAULIKA','OK',1]];
  const frame=ts=>{if(fin)return;if(!last)last=ts;t+=Math.min(.1,(ts-last)/1e3);last=ts;const u=Math.min(1,t/DUR);
   const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#16243a');g.addColorStop(.55,'#5a6f86');g.addColorStop(.56,'#3d6b34');g.addColorStop(1,'#241a12');x.fillStyle=g;x.fillRect(0,0,w,h);
   const gy=h*.56,cx=w/2;x.fillStyle='#2a2118';x.fillRect(0,gy,w,h-gy);
   // akna
   const open=Math.min(1,Math.max(0,(u-.55)/.25));x.fillStyle='#000';x.beginPath();x.ellipse(cx,gy+4,w*.16,10,0,0,7);x.fill();x.fillRect(cx-w*.16,gy+4,w*.32,h*.4*open+6);
   // daru
   x.strokeStyle='#e0a030';x.lineWidth=5;x.beginPath();x.moveTo(w*.12,gy);x.lineTo(w*.12,gy-h*.32);x.lineTo(cx,gy-h*.32);x.stroke();x.lineWidth=2;x.strokeStyle='#bbb';
   const my=gy-h*.18+Math.min(1,Math.max(0,(u-.35)/.45))*(h*.3);x.beginPath();x.moveTo(cx,gy-h*.32);x.lineTo(cx,my-14);x.stroke();
   // gép (egyszerű, de a játék színeivel)
   x.save();x.translate(cx,my);x.fillStyle='#8a8f98';x.fillRect(-46,-12,64,26);x.fillStyle='#3a3d44';x.fillRect(-46,8,64,8);x.fillStyle='#5a5e66';x.beginPath();x.ellipse(18,1,22,16,0,-1.57,1.57);x.fill();x.fillStyle='#e0a030';x.fillRect(-36,-6,10,8);x.restore();
   // ellenőrzőlista
   x.font='bold 13px Georgia';x.fillStyle='#f0a030';x.textAlign='center';x.fillText('FÚRÁS ELŐTTI ELLENŐRZÉS',cx,h*.1);x.font='12px Georgia';x.textAlign='left';
   chk.forEach((r,i)=>{if(u<.1+i*.12)return;const y=h*.14+i*20;x.fillStyle='#bfb09a';x.fillText(r[0],cx-90,y);x.textAlign='right';x.fillStyle=r[2]?'#35d06a':'#ff7a5a';x.fillText((r[2]?'✔ ':'⚠ ')+r[1],cx+90,y);x.textAlign='left'});
   const cd=3-Math.floor(Math.min(2.99,Math.max(0,(u-.55)/.45*3)));if(u>.55){x.font='bold 54px Georgia';x.textAlign='center';x.fillStyle='rgba(240,160,48,'+(1-((u-.55)/.45*3)%1*.6)+')';x.fillText(cd,cx,h*.78);x.textAlign='left'}
   x.font='10px Georgia';x.fillStyle='#888';x.textAlign='center';x.fillText('érintésre átugorható',cx,h-18);x.textAlign='left';
   x.fillStyle='rgba(0,0,0,'+Math.max(0,1-t/.35,(u-.93)/.07)+')';x.fillRect(0,0,w,h);
   if(t>=DUR)finish();else W.requestAnimationFrame(frame)};
  W.requestAnimationFrame(frame)}};
W.INTRO=INTRO;
INTRO.gate=function(s){if(!INTRO.want(s))return false;if(S.fuel<=0&&!(S.set.auto&&base()))return false;INTRO.play(()=>{INTRO.skip=1;try{go(s)}finally{INTRO.skip=0}});return true};
})(typeof window!=='undefined'?window:globalThis);
