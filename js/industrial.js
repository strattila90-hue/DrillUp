/* DrillUp Core Quest – a gép „ipari" anyaghatása (1. fázis): lemez-illesztések hegesztési varrattal, csavarfejek árnyékkal,
   éllel fény, rozsda- és olajcsíkok (a kopással nő), por a felső síkokon, nyomás alatti élek.
   A mach() végén hívódik (helyi, méteres koordinátákban), a meglévő rajz fölé rétegez; hibánál az eredeti rajz marad.
   Kikapcsolás: IND.off=true vagy az „Élethű effektek" kapcsoló (S.set.rl=0); gyenge gépen (Gov.q<1) nem fut. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('industrial');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const rn=(i,k)=>{const s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s)};
const IND={off:false,
 on(){if(IND.off)return false;try{if(S.set&&S.set.rl===0)return false;return(W.Gov?Gov.q:2)>=1}catch(e){return false}},
 wear(){try{return cl(((S.tk||0)/100)*.6+((S.hw||0)/100)*.4,0,1)}catch(e){return 0}},
 // egy hengeres szakasz részletei: x0..x1, félmagasság r
 part(x,x0,x1,r,seed,wr,dust,hole){
  x.save();x.beginPath();x.rect(x0,-r,x1-x0,2*r);if(hole)x.rect(hole[0],hole[1],hole[2],hole[3]);x.clip(hole?'evenodd':'nonzero');
  const len=x1-x0;
  // 1) lemez-illesztések: függőleges varrat (sötét + világos él), kb. 1,1 m-enként
  const n=Math.max(1,Math.round(len/1.1));
  for(let i=1;i<n;i++){const px=x0+i*len/n+(rn(seed,i)-.5)*.12;x.fillStyle='rgba(0,0,0,.34)';x.fillRect(px-.02,-r,.04,2*r);x.fillStyle='rgba(255,255,255,.14)';x.fillRect(px+.03,-r,.025,2*r);
   // hegesztési varrat-szemcsék
   x.fillStyle='rgba(255,255,255,.1)';for(let k=0;k<12;k++)x.fillRect(px-.035,-r+.12+k*(2*r-.24)/12,.07,.035)}
  // 2) vízszintes illesztés a testmagasság 1/3-ánál
  x.fillStyle='rgba(0,0,0,.26)';x.fillRect(x0,-r*.34,len,.035);x.fillStyle='rgba(255,255,255,.1)';x.fillRect(x0,-r*.34+.04,len,.02);
  x.fillStyle='rgba(0,0,0,.2)';x.fillRect(x0,r*.38,len,.035);
  // 3) hosszú fémes visszaverődés (felső negyed) + sötét él alul
  let g=x.createLinearGradient(0,-r,0,r);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.16,'rgba(255,255,255,.04)');g.addColorStop(.62,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.34)');x.fillStyle=g;x.fillRect(x0,-r,len,2*r);
  // 4) csavarfejek: kis sötét árnyék + fényes pont
  for(let i=0;i<n;i++){const cx=x0+(i+.5)*len/n;for(const yy of[-r*.78,r*.78]){x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.arc(cx+.012,yy+.016,.045,0,7);x.fill();x.fillStyle='rgba(235,240,245,.55)';x.beginPath();x.arc(cx,yy,.032,0,7);x.fill()}}
  // 5) rozsda- és olajcsíkok lefelé (a kopással erősödik)
  const a=.05+.22*wr;for(let i=0;i<Math.round(len*2);i++){if(rn(seed+3,i)>.35+.4*wr)continue;const px=x0+rn(seed,i+9)*len,top=-r+rn(seed,i+4)*r*1.1,h=.3+rn(seed,i+5)*r*1.1;
   const gg=x.createLinearGradient(0,top,0,top+h);const rust=rn(seed,i+6)>.4;gg.addColorStop(0,rust?`rgba(122,62,28,${a})`:`rgba(10,8,4,${a*1.2})`);gg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gg;x.fillRect(px,top,.05+rn(seed,i+7)*.07,h)}
  // 6) por a felső síkon (nappal fakóbb)
  if(dust>0){const dg=x.createLinearGradient(0,-r,0,-r+.22);dg.addColorStop(0,`rgba(185,160,120,${.14*dust})`);dg.addColorStop(1,'rgba(185,160,120,0)');x.fillStyle=dg;x.fillRect(x0,-r,len,.22)}
  x.restore()},
 // napelemek a gép tetején (játékmenet-jelzés: a tartalék-hajtás forrása) – minőségtől függetlenül látszik
 solar(x,o){const st=o&&o.stroke||0,sun=W.SOL?SOL.day():1,noFuel=(()=>{try{return S.fuel<=1e-6&&S.depth<=.01}catch(e){return false}})();
  x.save();x.translate(st,0);for(const[a,b]of[[-4.55,-3.2],[-3.05,-1.7]]){const w=b-a,y=-1.98,h=.3;
   x.fillStyle='#14161a';x.fillRect(a-.04,y-.02,w+.08,h+.06);
   const g=x.createLinearGradient(a,y,b,y+h);g.addColorStop(0,'#1d3c78');g.addColorStop(.5,`rgb(${30+sun*40|0},${70+sun*70|0},${140+sun*60|0})`);g.addColorStop(1,'#16295a');x.fillStyle=g;x.fillRect(a,y,w,h);
   x.strokeStyle='rgba(180,210,255,.38)';x.lineWidth=.02;for(let i=1;i<6;i++){x.beginPath();x.moveTo(a+i*w/6,y);x.lineTo(a+i*w/6,y+h);x.stroke()}x.beginPath();x.moveTo(a,y+h/2);x.lineTo(b,y+h/2);x.stroke();
   if(sun>.3){x.fillStyle=`rgba(255,255,255,${(.18*sun).toFixed(2)})`;x.fillRect(a,y,w*.45,h*.28)}
   x.fillStyle='#4a4e55';x.fillRect(a+w*.2,y+h,.07,.12);x.fillRect(a+w*.8,y+h,.07,.12)}
  if(noFuel){x.fillStyle=sun>=.35?'#3cff7a':'#ff4a3a';x.beginPath();x.arc(-1.55,-1.9,.07,0,7);x.fill()}
  x.restore()},
 finish(x,o){
  try{IND.solar(x,o)}catch(e){}
  if(!IND.on())return;const wr=IND.wear(),st=o&&o.stroke||0,dust=cl(.4+wr,0,1);
  x.save();
  IND.part(x,-12.2,-5.6,1.5,11,wr,dust,[-9.25,-1.3,3.4,1.15]);              // hátsó test
  x.save();x.translate(st,0);IND.part(x,-4.7,-1.6,1.65,23,wr,dust);x.restore(); // elülső pajzs (a löket előre tolja)
  x.restore()}
};
W.IND=IND;
})(typeof window!=='undefined'?window:globalThis);
