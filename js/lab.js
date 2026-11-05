/* Drill Up – 5/D: mobil geológiai labor + mintamonitor.
   1. szint: kőzet, hőmérséklet, nyomás, szilárdság.  2. szint: + ásványösszetétel (tömegarány a réteg kitermelési adataiból) és sűrűségek.
   3. szint: + szénhidrogén-szimat (1,5 km-en belüli mező iránya/távolsága; 250 m-en belül megerősíti a mezőt).
   Mintavétel ára: 20 000 Ft. A minta a gép aktuális mélységéből való; a monitor szemcsés „vékonycsiszolat”-képet rajzol. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('lab');
const COST=[0,8e5,1.2e7,2e8],SAMPLE=2e4;
const col=(n,l)=>{let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))%360;return `hsl(${h},${l?55:45}%,${l?62:48}%)`};
const LAB={busy:0,t:0,
 lv(){return GEO.ens().lab.lv},
 take(){const g=GEO.ens(),L=g.lab;if(L.lv<1)return toast('Nincs labor.');if(S.depth<1)return toast('Mintát a föld alatt lehet venni.');if(LAB.busy>0)return;if(!GEO.pay(SAMPLE))return toast('Egy minta '+ft(SAMPLE)+'.');
  const li=Math.max(0,LY.findIndex(l=>S.depth<l[2])),l=LY[li]||LY.at(-1),pw=l[5].reduce((a,x)=>a+x[1],0);
  const comp=l[5].map(x=>({n:x[0],p:x[1]/pw*100,kg:x[1]})).sort((a,b)=>b.p-a.p);
  const s={li,d:S.depth,x:S.x,seed:Math.floor(Math.random()*1e9),T:lerp(TT,S.depth),P:lerp(PT,S.depth),hr:HR[li],lv:L.lv,comp:L.lv>=2?comp.map(c=>({n:c.n,p:c.p})):null,t:Date.now()};
  if(L.lv>=3){const fs=HY.near(S.x,1500).map(f=>({f,dd:GEO.dist(S.x,S.depth,f.x,f.d)})).filter(o=>o.dd<=1500).sort((a,b)=>a.dd-b.dd);
   if(fs.length){const o=fs[0];s.hc={gas:o.f.gas,dd:Math.round(o.dd),right:o.f.x>=S.x,deeper:o.f.d>=S.depth};if(o.dd<=250)HY.found(o.f,'labor-minta')}}
  HY.confirm(S.x,S.depth,L.lv>=3?250:80);
  L.last=s;L.n++;LAB.busy=1.4;LAB.t=0;msg('🔬 Mintavétel: '+l[0]+' ('+nf(S.depth)+' m).',1);if(tab===1)view()},
 buy(){const g=GEO.ens(),l=g.lab.lv;if(l>=3)return;if(!base())return toast('Csak a bázison.');if(!GEO.pay(COST[l+1]))return toast('Nincs elég pénz.');g.lab.lv=l+1;msg('🔬 Geológiai labor '+g.lab.lv+'. szint.');view()},
 // mintakép: szemcsés textúra az ásványok arányában
 paintSample(x,w,h,s,scan){x.fillStyle='#0b0f14';x.fillRect(0,0,w,h);if(!s){x.fillStyle='#5c6a7a';x.font='11px Georgia';x.textAlign='center';x.fillText('Nincs minta',w/2,h/2);x.textAlign='left';return}
  const r=GEO.rng(s.seed),l=LY[s.li]||LY[0],mins=s.comp||l[5].map(c=>({n:c[0],p:100/l[5].length}));let tot=0;const wt=mins.map(m=>Math.max(.6,Math.sqrt(m.p)));wt.forEach(v=>tot+=v);
  x.fillStyle=l[4];x.globalAlpha=.55;x.fillRect(0,0,w,h);x.globalAlpha=1;
  for(let i=0;i<150;i++){let u=r()*tot,k=0;while(k<wt.length-1&&u>wt[k]){u-=wt[k];k++}const cx=r()*w,cy=r()*h,rx=3+r()*12,ry=3+r()*10,a=r()*3.14;x.fillStyle=col(mins[k].n,r()>.5);x.beginPath();x.ellipse(cx,cy,rx,ry,a,0,7);x.fill();x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=1;x.stroke()}
  const g=x.createRadialGradient(w/2,h/2,h*.25,w/2,h/2,h*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');x.fillStyle=g;x.fillRect(0,0,w,h);
  if(scan>0){const yy=(1-scan/1.4)*h;x.fillStyle='rgba(80,255,170,.22)';x.fillRect(0,yy-6,w,12);x.fillStyle='#5bffb0';x.fillRect(0,yy-1,w,2)}},
 html(){const g=GEO.ens(),L=g.lab,l=L.lv,b=base(),nx=l<3?COST[l+1]:0,s=L.last;
  let h=`<div class="card">🔬 <b>Mobil geológiai labor</b> <span class="mu">${l}/3</span><div class="mu">${l?['','Kőzet, hőmérséklet, nyomás, szilárdság.','+ ásványösszetétel és sűrűségek.','+ szénhidrogén-szimat 1,5 km-ig; 250 m-en belül megerősíti a mezőt.'][l]:'Mintát vesz a gép aktuális mélységéből, és elemzi a kőzetet.'}</div>`;
  if(l){h+=`<canvas id="labc" style="width:100%;height:120px;display:block;border-radius:10px;margin:8px 0;background:#0b0f14"></canvas><button class="b" style="width:100%" ${S.depth>=1&&S.cash>=SAMPLE?'':'disabled'} onclick="LAB.take()">🔬 Mintavétel itt (${nf(S.depth)} m) – ${ft(SAMPLE)}</button>`;
   if(s){const ly=LY[s.li];h+=`<div class="mu" style="margin-top:6px"><b>${ly[0]}</b> · ${nf(s.d)} m<br>🌡 ${nf(s.T)} °C · nyomás ${nf(s.P,s.P<10?2:1)} GPa · kőzetszilárdság ${nf(s.hr)} MPa`;
    if(s.comp)h+='<br>'+s.comp.slice(0,6).map(c=>{const d=KN.get(c.n);return `<span style="color:${col(c.n,1)}">■</span> ${c.n}: ${c.p>=1?nf(c.p,1)+'%':c.p>=1e-3?nf(c.p*1e4)+' ppm':nf(c.p*1e7)+' ppb'}${d?' · '+d[2]+' g/cm³':''}`}).join('<br>');
    if(s.lv>=3)h+='<br>'+(s.hc?`${s.hc.gas?'💨 Gáz':'🛢 Olaj'}-jelzés: ${nf(s.hc.dd)} m-re, ${s.hc.right?'jobbra':'balra'}, ${s.hc.deeper?'mélyebben':'feljebb'}.`:'Nincs szénhidrogén-jel 1,5 km-en belül.');
    h+='</div>'}}
  if(l<3)h+=`<button class="b g" style="width:100%;margin-top:6px" ${b&&S.cash>=nx?'':'disabled'} onclick="LAB.buy()">${l?'Fejlesztés':'Labor beszerzése'} – ${ft(nx)}</button>`;
  return h+'</div>'},
 frame(dt){if(LAB.busy>0)LAB.busy=Math.max(0,LAB.busy-dt);if(typeof tab!=='undefined'&&tab===1){const c=$('#labc');if(!c||!c.getContext)return;const w=c.clientWidth|0,h=c.clientHeight|0;if(w<20)return;const d=W.Gov?Gov.dpr(W.devicePixelRatio||1):1;if(c.width!==(w*d|0)){c.width=w*d|0;c.height=h*d|0;LAB.drawn=0}
   if(LAB.busy>0||!LAB.drawn){const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);LAB.paintSample(x,w,h,GEO.ens().lab.last,LAB.busy);LAB.drawn=LAB.busy>0?0:1}}},
 hud(V){const L=GEO.ens().lab,s=L.last;if(!L.lv||!s||Date.now()-s.t>9e4||(W.PN&&!PN.vis('lab')))return;const x=V.x,w=120,h=36,px=V.w-w-32,py=44+(GEO.ens().sz.lv&&(!W.PN||PN.vis('sz'))?44:0);if(W.PN)PN.reg('lab',px,py,w,h);x.save();x.fillStyle='rgba(10,12,18,.84)';GEO.rr(x,px,py,w,h,7);x.fill();x.strokeStyle=LY[s.li][4];x.lineWidth=1.2;x.stroke();
  x.font='bold 8px Georgia';x.fillStyle='#9fc4ff';x.fillText('MINTAMONITOR · '+nf(s.d)+' m',px+6,py+10);x.font='9px Georgia';x.fillStyle='#dfe6f2';
  x.fillText(LY[s.li][0].split(' (')[0].slice(0,20),px+6,py+21);const top=s.comp?s.comp.slice(0,2).map(c=>c.n).join(', '):'🌡 '+nf(s.T)+' °C';x.fillStyle='#9aa7b8';x.fillText(top.slice(0,22),px+6,py+31);x.restore()}};
W.LAB=LAB;
if(W.on){on('frame',dt=>{try{LAB.frame(dt)}catch(e){}});on('hud',V=>LAB.hud(V))}
if(W.BP)BP.extras.push(()=>LAB.html());
})(typeof window!=='undefined'?window:globalThis);
