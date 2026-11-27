/* Drill Up – indítóállás (fúróplatform) a bázison, portáldaruval.
   Lefelé fúrni csak az indítóállásról lehet: ha a gép ráállt, a portáldaru horga megfogja a gép farkát, a platform közepére (a kútfejre)
   húzza, és a hidraulikus felállítóval együtt fúrási helyzetbe emeli. A felszínre is csak itt lehet kijönni (új aknán felfelé fúrva);
   a hazaút (⌂) amúgy is ide vezet, ahol a daru visszafekteti a gépet a platformra.
   A rajz: betonlap a kútfejjel, sárga-fekete szegély, „INDÍTÓÁLLÁS” tábla, két sárga daruláb, gerenda, futómacska, kötél és horog. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('pad');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const PAD={X:0,TOL:6,MIN:2,LEG:11.5,sx0:null,told:0,
 at(x){return Math.abs((x==null?S.x:x)-PAD.X)<=PAD.TOL},
 // fúrás indítása a felszínen: csak az indítóállásról
 canDrill(){return !(typeof S!=='undefined'&&S.depth<=.01&&!PAD.at(S.x))},
 refuse(){const d=PAD.X-S.x;try{toast('🏗 Fúrni csak az indítóállásról lehet: állj rá a platformra ('+(d>0?'jobbra ▶ ':'◀ balra ')+Math.round(Math.abs(d))+' m), ott a daru fúrási helyzetbe emeli a gépet.')}catch(e){}},
 noSurf(){try{if(W.ARC)ARC.pl=null}catch(e){}if(Date.now()-PAD.told<4000)return;PAD.told=Date.now();const d=PAD.X-S.x;try{toast('🏗 A felszínre csak az indítóállásnál lehet kijönni: fúrj vízszintesen a platform alá ('+(d>0?'jobbra ▶ ':'◀ balra ')+Math.round(Math.abs(d))+' m)'+(S.tr.length?', vagy menj haza (⌂).':'.'))}catch(e){}},
 // a vízszintes elmozdulás a hazaút-listába is bekerül (így a ⌂ pontosan visszatalál)
 shift(d){if(!d)return;S.x+=d;const k=d>0?'R':'L',o=d>0?'L':'R',a=Math.abs(d),tp=S.tr.at(-1);
  if(tp&&tp[0]===k)tp[1]+=a;else if(tp&&tp[0]===o){tp[1]-=a;if(tp[1]<-1e-9){S.tr.pop();S.tr.push([k,-tp[1]])}else if(tp[1]<1e-6)S.tr.pop()}else S.tr.push([k,a])},
 // felállítás közben a daru a platform közepére húzza a gépet
 sim(){const q=W.HYD&&HYD.seq;if(q&&q.dir>0&&S.depth<=.01&&PAD.at(S.x)){if(PAD.sx0===null)PAD.sx0=S.x;const tx=PAD.sx0+(PAD.X-PAD.sx0)*ease(cl(q.p/.6,0,1));PAD.shift(tx-S.x)}else PAD.sx0=null},
 // ---- rajz
 back(V){const x=V.x,Ys=V.Ys,K=V.K||10;if(!(Ys>-260&&Ys<V.h+120))return;const sx=V.SX(PAD.X),L=V.SX(PAD.X-PAD.LEG),R=V.SX(PAD.X+PAD.LEG);if(R<-60||L>V.w+60)return;
  // betonlap + sárga-fekete szegély
  x.fillStyle='#8c9096';x.fillRect(L-K*1.2,Ys,R-L+K*2.4,K*.9);x.fillStyle='#6d7176';x.fillRect(L-K*1.2,Ys+K*.9,R-L+K*2.4,K*.2);
  for(let px=L-K*1.2,i=0;px<R+K*1.2;px+=K*.8,i++){x.fillStyle=i%2?'#1a1a1a':'#f2b705';x.beginPath();x.moveTo(px,Ys);x.lineTo(px+K*.8,Ys);x.lineTo(px+K*.5,Ys+K*.3);x.lineTo(px-K*.3,Ys+K*.3);x.closePath();x.fill()}
  // kútfej (perem) a fúrási ponton
  x.fillStyle='#4b5057';x.fillRect(sx-K*.9,Ys-K*.25,K*1.8,K*.3);x.fillStyle='#c8261c';x.fillRect(sx-K*.5,Ys-K*.55,K,K*.3);x.fillStyle='#d9dde2';x.fillRect(sx-K*1.1,Ys-K*.28,K*2.2,K*.08);
  // daru: két láb (rácsos), gerenda
  const top=Ys-K*14.5;for(const lx of[L,R]){x.fillStyle='#e0a800';x.fillRect(lx-K*.45,top,K*.9,Ys-top);x.strokeStyle='#8a6a00';x.lineWidth=1;x.beginPath();for(let y=Ys;y>top;y-=K*1.4){x.moveTo(lx-K*.45,y);x.lineTo(lx+K*.45,y-K*1.4)}x.stroke();
   x.fillStyle='#5d6168';x.fillRect(lx-K*.9,Ys-K*.3,K*1.8,K*.3)}
  const bg=x.createLinearGradient(0,top-K*1.2,0,top);bg.addColorStop(0,'#ffd23f');bg.addColorStop(1,'#c99a00');x.fillStyle=bg;x.fillRect(L-K*.9,top-K*1.2,R-L+K*1.8,K*1.2);
  x.fillStyle='#1a1a1a';for(let px=L;px<R;px+=K*1.6)x.fillRect(px,top-K*1.2,K*.8,K*.25);
  x.fillStyle=(Math.floor(V.ts/600)%2)?'#ff3b2f':'#6a1410';x.beginPath();x.arc(L,top-K*1.5,K*.25,0,7);x.arc(R,top-K*1.5,K*.25,0,7);x.fill();
  // tábla
  x.fillStyle='rgba(16,18,24,.85)';x.fillRect(sx-K*3.4,top+K*.3,K*6.8,K*1.3);x.fillStyle='#ffd23f';x.font='bold '+Math.round(K*.85)+'px Georgia';x.textAlign='center';x.fillText('INDÍTÓÁLLÁS',sx,top+K*1.25);x.textAlign='left';
  PAD._g={L,R,top,K}},
 front(V){const g=PAD._g;if(!g||!V.lw)return;const x=V.x,K=g.K,q=W.HYD&&HYD.seq,on=q&&S.depth<=.01&&PAD.at(S.x);let hx,hy;
  if(on){const t=V.lw(-11.2,0);hx=cl(t[0],g.L+K,g.R-K);hy=t[1]-K*1.45}else{hx=V.SX(PAD.X)-K*3;hy=g.top+K*4}
  // futómacska + kötél + csigatest + horog
  x.fillStyle='#2b2d31';x.fillRect(hx-K*.8,g.top-K*.2,K*1.6,K*.7);x.strokeStyle='#15171a';x.lineWidth=Math.max(1,K*.1);x.beginPath();x.moveTo(hx-K*.2,g.top+K*.5);x.lineTo(hx-K*.2,hy);x.moveTo(hx+K*.2,g.top+K*.5);x.lineTo(hx+K*.2,hy);x.stroke();
  x.fillStyle='#e2b228';x.fillRect(hx-K*.5,hy,K,K*.4);x.strokeStyle='#bfc3c9';x.lineWidth=Math.max(1,K*.09);x.beginPath();x.moveTo(hx,hy+K*.4);x.lineTo(hx,hy+K*1.1);x.stroke();x.beginPath();x.arc(hx,hy+K*1.25,K*.22,0,7);x.stroke()}};
W.PAD=PAD;
if(W.on){on('sim',()=>{try{if(typeof S!=='undefined')PAD.sim()}catch(e){}});
 on('world.back',V=>{try{PAD.back(V)}catch(e){if(W.DBG)DBG.err='pad: '+(e.message||e)}});
 on('world.front',V=>{try{PAD.front(V)}catch(e){if(W.DBG)DBG.err='pad2: '+(e.message||e)}})}
})(typeof window!=='undefined'?window:globalThis);
