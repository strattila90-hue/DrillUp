/* DrillUp Core Quest – élethűbb látvány: kőzet-textúra (parallaxszal), horizont-pára, kontakt-árnyék a gép alatt.
   A meglévő rajzra rárakódó, halvány réteg; a minőségváltót (Gov.q ≥ 1) és az „Élethű effektek" kapcsolót (S.set.rl) követi,
   RZ.off=true-val kikapcsolható. Nem módosítja a játékmenetet, nem tárol semmit a mentésben. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('realism');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const RZ={off:false,tile:null,pat:null,
 on(){if(RZ.off)return false;try{if(S.set&&S.set.rl===0)return false;if(W.CIN&&CIN.on&&0)return false;return(W.Gov?Gov.q:2)>=1}catch(e){return false}},
 // 160×160-as kőzet-szemcse csempe (seedelt, ismétlődés nélküli látszatú, közép-szürke → „overlay" módban nem változtatja a fényerőt)
 mk(){if(RZ.tile||typeof document==='undefined'||!document.createElement)return RZ.tile;const N=160,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext&&c.getContext('2d');if(!g)return null;
  const d=g.createImageData(N,N);let s=1234567;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
  const base=new Float32Array(N*N);for(let i=0;i<N*N;i++)base[i]=r();
  // háromszintű zaj: finom szemcse + közepes foltok + kis repedés-csíkok
  const at=(x,y)=>base[((y+N)%N)*N+((x+N)%N)];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=at(x,y)*.5;let a=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++)a+=at(x+i*3,y+j*3);v+=a/25*.9;
   const crack=Math.abs(Math.sin((x*.19+at(x>>2,y>>2)*6)+(y*.07)))<.05?-.22:0;
   const k=cl(128+(v-.95)*150+crack*120,40,215)|0,o=(y*N+x)*4;d.data[o]=d.data[o+1]=d.data[o+2]=k;d.data[o+3]=255}
  g.putImageData(d,0,0);RZ.tile=c;return c},
 world(V){
  if(!RZ.on())return;const x=V.x,w=V.w,h=V.h,Ys=V.Ys,K=V.K||20,q=W.Gov?Gov.q:2;
  const top=Math.max(0,Ys);
  // 1) kőzet-textúra a föld alatt (két rétegben, eltérő parallaxszal)
  const t=RZ.mk();
  if(t&&h-top>4){if(!RZ.pat)RZ.pat=x.createPattern(t,'repeat');
   if(RZ.pat){x.save();x.beginPath();x.rect(0,top,w,h-top);x.clip();x.globalCompositeOperation='overlay';
    const px=-(V.rx||0)*K,py=(V.ry||0)*K;
    x.globalAlpha=.55;x.save();x.translate(px%160,py%160);x.scale(1,1);x.fillStyle=RZ.pat;x.fillRect(-160,-160+0,w+320,h+320);x.restore();
    if(q>=2){x.globalAlpha=.32;x.save();x.translate((px*.6)%160,(py*.6)%160);x.scale(2.2,2.2);x.fillStyle=RZ.pat;x.fillRect(-160,-160,(w+320)/2.2,(h+320)/2.2);x.restore()}
    x.restore()}}
  // 2) horizont-pára a felszín fölött: nappal világos, éjjel sötétkék
  if(Ys>8&&Ys<h){const day=cl(V.day==null?1:V.day,0,1),H=Math.min(90,Ys);
   const col=day>.5?'205,218,232':'28,38,70',a=day>.5?.1+.16*day:.07;
   const g=x.createLinearGradient(0,Ys-H,0,Ys);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${a.toFixed(3)})`);
   x.save();x.fillStyle=g;x.fillRect(0,Ys-H,w,H);x.restore()}
  // 3) kontakt-árnyék a gép alatt, ha a felszínen áll
  if((V.ry||0)<2.5&&Ys>0&&Ys<h-10){const cx=V.cx,rr=9*K,g=x.createRadialGradient(cx,Ys+3,1,cx,Ys+3,rr);g.addColorStop(0,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');
   x.save();x.translate(0,Ys+3);x.scale(1,.18);x.translate(0,-(Ys+3));x.fillStyle=g;x.beginPath();x.arc(cx,Ys+3,rr,0,6.2832);x.fill();x.restore()}
 }};
W.RZ=RZ;
if(W.on)on('world.back',V=>{try{RZ.world(V)}catch(e){if(W.DBG)DBG.err='realism: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
