// Forgókamra: föld alatt a gép csak kifúrt üregben tud megfordulni – a keskeny furat fizikai akadály
(function(W){
const CH={g:0,cx:0,cd:0,act:0,MAXN:60,
 list(){if(typeof S==='undefined')return[];if(!Array.isArray(S.ch))S.ch=[];if(S.ch.length>CH.MAXN)S.ch.length=CH.MAXN;S.ch=S.ch.filter(c=>Array.isArray(c)&&isFinite(c[0])&&isFinite(c[1]));return S.ch},
 // van-e kamra a gép közelében (a kamra 26 m széles, 6 m magas)
 at(x,d){return CH.list().some(c=>Math.abs(c[0]-x)<5&&Math.abs(c[1]-d)<3.5)},
 // visszaadja a fordulási sebesség-szorzót (0..1)
 gate(dt,turning){if(typeof S==='undefined')return 1;const under=S.depth>2.5&&S.st!=='H';
  if(!under){CH.g=0;CH.act=0;return 1}
  if(CH.at(S.x,S.depth)){CH.g=1;CH.act=0;return 1}
  if(!turning){if(CH.act&&CH.g<1)CH.g=Math.max(0,CH.g-dt*.5);if(CH.g<=0)CH.act=0;return CH.g>=.999?1:0}
  if(!CH.act||Math.abs(CH.cx-S.x)>3||Math.abs(CH.cd-S.depth)>3){CH.act=1;CH.cx=S.x;CH.cd=S.depth;CH.g=0}
  CH.g=Math.min(1,CH.g+dt/2.6);
  if(CH.g>=1){CH.list().push([+S.x.toFixed(2),+S.depth.toFixed(2)]);if(typeof msg==='function')msg('⛏ Forgókamra kifúrva – itt a gép meg tud fordulni.');CH.act=0}
  const a=(CH.g-.3)/.7;return a<=0?0:a>=1?1:a*a*(3-2*a)},
 draw(V){if(typeof S==='undefined')return;const x=V.x,K=V.K,L=CH.list(),vis=[];
  for(const c of L){const X=V.SX(c[0]),Y=V.SY(c[1]);if(X>-14*K&&X<V.w+14*K&&Y>-6*K&&Y<V.h+6*K)vis.push([X,Y,1,c[0],c[1]])}
  if(CH.act&&CH.g>0)vis.push([V.SX(CH.cx),V.SY(CH.cd),CH.g,CH.cx,CH.cd]);
  if(!vis.length)return;const lc=typeof layer==='function'?layer(V.ry)[4]:'#5a4030';
  x.save();x.beginPath();x.rect(0,Math.max(0,V.Ys),V.w,V.h);x.clip();
  for(const[X,Y,g]of vis){const rx=13.2*K*g,ry=3.2*K*g,n=44;x.beginPath();for(let i=0;i<=n;i++){const a=i/n*6.2832,j=1+.07*Math.sin(a*7+X*.013)+.05*Math.sin(a*13+Y*.021),px=X+Math.cos(a)*rx*j,py=Y+Math.sin(a)*ry*j;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();
   const gr=x.createRadialGradient(X,Y,0,X,Y,rx);gr.addColorStop(0,'#0c0907');gr.addColorStop(.75,'#17110c');gr.addColorStop(1,'#241a12');x.fillStyle=gr;x.fill();x.lineWidth=Math.max(2,K*.28);x.strokeStyle='rgba(0,0,0,.55)';x.stroke();x.lineWidth=Math.max(1,K*.12);x.strokeStyle=lc;x.globalAlpha=.55;x.stroke();x.globalAlpha=1}
  x.restore();
  // por és omló kő a kifúrás alatt
  if(CH.act&&CH.g<1&&typeof pr!=='undefined'&&Math.random()<V.dt*26){const a=Math.random()*6.283,g=CH.g;pr.push({x:CH.cx+Math.cos(a)*13.2*g,y:CH.cd+Math.sin(a)*3.2*g,vx:(Math.random()-.5)*1.5,vy:-.2,l:1.3,L0:1.3,r0:3+Math.random()*3,col:typeof hexRgb==='function'?hexRgb(typeof mix==='function'?mix(lc,'#d8c8b0',.4):'#b09878'):'176,152,120',t:'du'})}}};
W.CH=CH;
if(typeof on==='function')on('world.back',V=>{try{CH.draw(V)}catch(e){}});
})(typeof window!=='undefined'?window:globalThis);
