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

// ---- épületek: ambient occlusion az alapnál, fény a tetőn, hullámlemez-vonalak, vízfolyás-csíkok, nappali vetett árnyék
RZ.bld=function(V){
 if(!W.SRF||!SRF.H||!SRF.H.length)return;const x=V.x,day=cl(V.day==null?1:V.day,0,1),Y0=V.Ys;
 for(const r of SRF.H){if(!/^(ws|fu|tr|lab)$/.test(r.id)||r.w<30||r.x>V.w+20||r.x+r.w<-20)continue;
  x.save();x.beginPath();x.rect(r.x,r.y,r.w,r.h);x.clip();
  // vízszintes lemez-vonalak
  x.globalAlpha=.07;x.fillStyle='#000';for(let yy=r.y+10;yy<r.y+r.h;yy+=5)x.fillRect(r.x,yy,r.w,1);
  // függőleges, szeedelt folyás-csíkok
  x.globalAlpha=.07;for(let i=0;i<Math.floor(r.w/14);i++){const sx=r.x+((i*97+r.id.charCodeAt(0)*31)%Math.max(8,r.w-6)),len=12+((i*53)%38);x.fillStyle='#1a120a';x.fillRect(sx,r.y+r.h*.35,1.5,len)}
  // alap-sötétedés (AO) és tető-fény
  x.globalAlpha=1;let g=x.createLinearGradient(0,r.y+r.h*.7,0,r.y+r.h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=g;x.fillRect(r.x,r.y+r.h*.7,r.w,r.h*.3);
  g=x.createLinearGradient(0,r.y,0,r.y+r.h*.18);g.addColorStop(0,`rgba(255,244,220,${(.16*day).toFixed(3)})`);g.addColorStop(1,'rgba(255,244,220,0)');x.fillStyle=g;x.fillRect(r.x,r.y,r.w,r.h*.18);
  x.restore();
  // nappali, lágy vetett árnyék a talajon (a nap állásával eltolva)
  if(day>.25&&Y0>0&&Y0<V.h){const dx=cl((V.hr-12)*9,-60,60);x.save();x.globalAlpha=.3*day;const gg=x.createRadialGradient(r.x+r.w/2+dx,Y0+2,2,r.x+r.w/2+dx,Y0+2,r.w*.7);gg.addColorStop(0,'rgba(0,0,0,.55)');gg.addColorStop(1,'rgba(0,0,0,0)');x.translate(0,Y0+2);x.scale(1,.14);x.translate(0,-(Y0+2));x.fillStyle=gg;x.beginPath();x.arc(r.x+r.w/2+dx,Y0+2,r.w*.7,0,6.2832);x.fill();x.restore()}}};
// ---- teljes képes hangulat: aranyóra-szín, finom ragyogás (bloom, csak q2-n)
RZ.tmp=null;
RZ.post=function(V){
 if(!RZ.on())return;const x=V.x,w=V.w,h=V.h,q=W.Gov?Gov.q:2,day=cl(V.day==null?1:V.day,0,1),hr=V.hr||12;
 const gold=day>0&&(hr<8||hr>17)?cl(1-Math.abs(((hr<8?hr:hr-12)-6.5))/2.2,0,1)*.5:0;
 if(gold>.01){x.save();x.globalCompositeOperation='soft-light';x.fillStyle=`rgba(255,140,50,${(.32*gold).toFixed(3)})`;x.fillRect(0,0,w,h);x.restore()}
 if(q>=2&&typeof document!=='undefined'&&document.createElement&&x.canvas){const c=x.canvas,tw=Math.max(8,c.width>>3),th=Math.max(8,c.height>>3);
  if(!RZ.tmp)RZ.tmp=document.createElement('canvas');const t=RZ.tmp;if(t.width!==tw||t.height!==th){t.width=tw;t.height=th}
  const g=t.getContext('2d');g.imageSmoothingEnabled=true;g.clearRect(0,0,tw,th);g.drawImage(c,0,0,c.width,c.height,0,0,tw,th);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='screen';x.globalAlpha=.16+(day<.4?.06:0);x.imageSmoothingEnabled=true;x.drawImage(t,0,0,tw,th,0,0,c.width,c.height);x.restore()}
};
// ---- a gép: mozgó fényes visszaverődés a hengeres hátsó testen
RZ.mach=function(V){
 if(!RZ.on()||!V.lw)return;const x=V.x,day=cl(V.day==null?1:V.day,0,1),t=(V.ts||0)/2600;
 const a=V.lw(-12.1,-1.5),b=V.lw(-5.7,-1.2),c=V.lw(-5.7,-1.2);if(!a||!b)return;
 const ph=(t%1.6)/1.6,gx=a[0]+(b[0]-a[0])*ph,gy=a[1]+(b[1]-a[1])*ph,r=(Math.abs(b[0]-a[0])+4)*.1+6;
 x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(gx,gy,0,gx,gy,r);g.addColorStop(0,`rgba(255,250,235,${(.2+.1*day).toFixed(3)})`);g.addColorStop(1,'rgba(255,250,235,0)');x.fillStyle=g;x.fillRect(gx-r,gy-r,r*2,r*2);x.restore()};
// Védőháló: bármilyen hiba esetén a vászon állapota (save/clip/transzform/keverés/átlátszóság) pontosan visszaáll,
// így egy effekt-hiba soha nem rejtheti el a gépet vagy a világot.
W.SAFE=function(x,fn,tag){let d=0;const hs=Object.prototype.hasOwnProperty.call(x,'save'),hr=Object.prototype.hasOwnProperty.call(x,'restore'),os=x.save,or=x.restore,ga=x.globalAlpha,gc=x.globalCompositeOperation;
 try{x.save=function(){d++;return os.call(x)};x.restore=function(){if(d>0)d--;return or.call(x)};
  x.save();d=0;fn()}catch(e){if(typeof DBG!=='undefined')DBG.err=(tag||'fx')+': '+(e&&e.message||e)}
 finally{try{if(hs)x.save=os;else delete x.save;if(hr)x.restore=or;else delete x.restore}catch(_){}
  try{while(d-->0)or.call(x);or.call(x);x.globalAlpha=ga;x.globalCompositeOperation=gc}catch(_){}}};
W.RZ=RZ;
if(W.on){on('world.back',V=>{SAFE(V.x,()=>{RZ.world(V);RZ.bld(V)},'realism')});on('world.front',V=>{SAFE(V.x,()=>{RZ.mach(V);RZ.post(V)},'realism2')})}
})(typeof window!=='undefined'?window:globalThis);
