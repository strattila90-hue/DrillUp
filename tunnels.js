/* Drill Up – 2. fázis: járathálózat-felismerés, szabadesés, becsapódási sérülés, fék.
   Modell: a gép "orrpontja" (S.x, S.depth) mozog; a meglévő járatok 4,4 m széles kapszulák (S.tn szakaszok).
   Ahol az orrpont szabad térben van, nem fúr (nincs hozam, olcsó haladás); függőlegesen lefelé szabadon esik. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('tunnels');
const HW=2.2,G=9.81,AB=22,A=Math.PI*1.85*1.85,VTOL=[10,14,20,28,40,60];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const NET={hw:HW,falling:false,vz:0,bk:0,bkIn:0,bkT:0,shake:0,alarmT:0,idx:null,
 // ---------- gyors keresés: a függőleges szakaszok x szerint, a vízszintesek mélység szerint rendezve ----------
 build(){const V=[],Hh=[];for(const g of S.tn){if(g[0]===g[2])V.push(g);else if(g[1]===g[3])Hh.push(g)}V.sort((a,b)=>a[0]-b[0]);Hh.sort((a,b)=>a[1]-b[1]);NET.idx={ref:S.tn,n:S.tn.length,V,H:Hh}},
 ensure(){const I=NET.idx;if(!I||I.ref!==S.tn||I.n!==S.tn.length)NET.build()},
 q(arr,k,key,cb){let lo=0,hi=arr.length;const t=k-HW;while(lo<hi){const m=(lo+hi)>>1;if(arr[m][key]<t)lo=m+1;else hi=m}
  for(let i=lo;i<arr.length&&arr[i][key]<=k+HW;i++)if(cb(arr[i])===true)return true;return false},
 free(x,d){NET.ensure();const I=NET.idx;
  return NET.q(I.V,x,0,g=>d>=Math.min(g[1],g[3])-1e-9&&d<=Math.max(g[1],g[3])+1e-9)||NET.q(I.H,d,1,g=>x>=Math.min(g[0],g[2])-1e-9&&x<=Math.max(g[0],g[2])+1e-9)},
 // a szabad téren belül egy irányban megtehető távolság (összefüggő járatok láncán át)
 reach(x,d,dx,dd){NET.ensure();const I=NET.idx;let cx=x,cd=d,total=0;
  for(let it=0;it<64;it++){let best=0;
   NET.q(I.V,cx,0,g=>{const lo=Math.min(g[1],g[3]),hi=Math.max(g[1],g[3]);if(cd<lo-1e-9||cd>hi+1e-9)return false;const p=dd>0?hi-cd:dd<0?cd-lo:(dx>0?g[0]+HW-cx:cx-(g[0]-HW));if(p>best)best=p;return false});
   NET.q(I.H,cd,1,g=>{const lo=Math.min(g[0],g[2]),hi=Math.max(g[0],g[2]);if(cx<lo-1e-9||cx>hi+1e-9)return false;const p=dx>0?hi-cx:dx<0?cx-lo:(dd>0?g[1]+HW-cd:cd-(g[1]-HW));if(p>best)best=p;return false});
   if(best<=1e-9)break;total+=best;cx+=dx*best;cd+=dd*best}
  return total},
 floor(x,d){return d+NET.reach(x,d,0,1)},
 openBelow(x,d){return NET.free(x,d+.05)},
 // a mozgás irányában mennyi szabad tér van közvetlenül előtte (0 = kőzet: fúrni kell)
 ahead(x,d,dx,dd){const nx=x+dx*.05,nd=d+dd*.05;if(!NET.free(nx,nd))return 0;return .05+NET.reach(nx,nd,dx,dd)},
 // ---------- a megtett út beírása a visszaút-vermébe ----------
 trail(m,dist){const tr=S.tr,op={D:'U',U:'D',L:'R',R:'L'}[m];let left=dist;
  while(left>1e-9&&tr.length&&tr.at(-1)[0]===op){const t=tr.at(-1),use=Math.min(t[1],left);t[1]-=use;left-=use;if(t[1]<1e-6)tr.pop()}
  if(left>1e-9){const t=tr.at(-1);if(t&&t[0]===m)t[1]+=left;else tr.push([m,left])}},
 // vízszintes járatban a gép a járat tengelyére "felül" (az esés után a padlón áll)
 settle(dt){if(S.st!=='L'&&S.st!=='R')return;NET.ensure();const I=NET.idx;let ds=null;
  NET.q(I.H,S.depth,1,g=>{if(S.x>=Math.min(g[0],g[2])-1e-9&&S.x<=Math.max(g[0],g[2])+1e-9){ds=g[1];return true}return false});
  if(ds===null||Math.abs(S.depth-ds)<.02)return;
  if(NET.q(I.V,S.x,0,g=>S.depth>=Math.min(g[1],g[3])-1e-9&&S.depth<=Math.max(g[1],g[3])+1e-9))return;
  const dd=clamp(ds-S.depth,-4*dt,4*dt);S.depth+=dd;NET.trail(dd>0?'D':'U',Math.abs(dd))},
 hcap(){return 1.2e8*(1+S.u.h)},
 begin(){if(NET.falling)return;NET.falling=true;S.mode='';NET.alarmT=0;
  msg(S.set.abk?'⚠ Szabadesés! Az automata fékasszisztens lassít a talaj közelében (a FÉK gombbal te is fékezhetsz).':'⚠ SZABADESÉS! Tartsd nyomva a FÉK gombot!');if(W.alarm3)alarm3()},
 slip(){if(!NET.falling&&NET.openBelow(S.x,S.depth)&&(S.st==='U'||S.st==='H')){S.st='idle';NET.begin()}},
 crash(v){const tol=VTOL[S.u.h],dmg=Math.max(0,Math.pow(v/tol,2)-.36)*55;NET.shake=clamp(v/tol,0,1);
  if(dmg>0){S.hp=Math.max(0,S.hp-dmg);msg('💥 Becsapódás '+v.toFixed(1)+' m/s sebességgel – a váz '+dmg.toFixed(0)+'%-ot sérült.');if(W.clank){clank(1);scr(.5,200,50,.8)}}
  else if(v>2){msg('⬇ Landolás '+v.toFixed(1)+' m/s sebességgel – sérülés nélkül.');if(W.clank)clank(.4)}
  if(S.hp<=0)strand('A gép a becsapódástól összeroppant.')},
 // a szimuláció lépése előtt hívódik; igaz, ha a lépést a szabadesés fizikája elvégezte
 physics(dt){if(!S)return false;
  if(!NET.falling){if(S.st==='D'&&S.depth<R-1&&NET.openBelow(S.x,S.depth))NET.begin();else{NET.settle(dt);return false}}
  const m=mass(),k=.6*A/m,d0=S.depth;let left=dt;
  while(left>1e-9&&NET.falling){const h=Math.min(left,.02);left-=h;
   const fl=NET.floor(S.x,S.depth),dist=fl-S.depth;let tgt=NET.bkIn?1:0;
   if(S.set.abk&&NET.vz>1){const vl=Math.min(6,VTOL[S.u.h]*.5);if(NET.vz>vl){const need=(NET.vz*NET.vz-vl*vl)/(2*Math.max(.3,dist));if(dist<NET.vz*NET.vz/(2*AB*.5)+8)tgt=Math.max(tgt,clamp(need/(AB*.85),0,1))}}
   NET.bk+=(tgt-NET.bk)*Math.min(1,h/.25);
   const eff=NET.bkT<1?1:Math.max(.4,1-(NET.bkT-1)*.5),ab=NET.bk*AB*eff;let a=G-k*NET.vz*NET.vz-ab;if(NET.vz<=0&&a<0)a=0;
   const vN=Math.max(0,NET.vz+a*h),dd=(NET.vz+vN)/2*h;
   NET.bkT=Math.max(0,NET.bkT+m*ab*(NET.vz+vN)/2*h/NET.hcap()-.04*h);
   if(S.depth+dd>=fl-1e-9){S.depth=fl;NET.falling=false;NET.vz=0;NET.crash(vN);break}
   S.depth+=dd;NET.vz=vN;
   if(NET.vz<.05&&NET.bk>.3){NET.falling=false;NET.vz=0;if(S.st==='D')S.st='idle';msg('A gép megállt a járatban (rögzítőfék).');break}}
  const fell=S.depth-d0;if(fell>1e-9){S.max=Math.max(S.max,S.depth);NET.trail('D',fell)}
  return true}};
W.NET=NET;
// ---------- fék ----------
const BK={held:false,
 btn(){return `<button id="bBK" class="pb brk sm" style="--lc:#ffb020" onpointerdown="BK.down(event)"><b>🛑</b></button>`},
 down(e){if(e){e.preventDefault();e.stopPropagation()}aInit();BK.held=true;NET.bkIn=1;if(W.clk)clk(300);if(navigator.vibrate)navigator.vibrate(20)},
 up(){if(!BK.held)return;BK.held=false;NET.bkIn=0}};
W.BK=BK;
const st=document.createElement('style');st.textContent=`.pb.brk{background:linear-gradient(#6a4a12,#3a2808)}.pb.brk.on{box-shadow:0 5px 0 #14120f,0 0 14px #ffb020,inset 0 0 12px #ffb020}`;(document.head||document.body).appendChild(st);
// ---------- hangok: fékcsikorgás, szél ----------
let AU=null;
function aud(){if(typeof AC==='undefined'||!AC)return;if(!AU){AU={};AU.so=AC.createOscillator();AU.so.type='sawtooth';AU.sf=AC.createBiquadFilter();AU.sf.type='bandpass';AU.sf.frequency.value=1800;AU.sf.Q.value=6;AU.sg=AC.createGain();AU.sg.gain.value=0;AU.so.connect(AU.sf);AU.sf.connect(AU.sg);AU.sg.connect(AC.destination);AU.so.start()}
 if(!AU.fg&&typeof NB!=='undefined'&&NB){const mk=(ty,f,q)=>{const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const fl=AC.createBiquadFilter();fl.type=ty;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(Math.random());return{fl,g}};const a=mk('bandpass',1500,1.2),b=mk('highpass',900,.7);AU.fb=a.fl;AU.fg=a.g;AU.wg=b.g}
 const t=AC.currentTime,v=(S.set.vol||0)/100,sp=Math.min(1,NET.vz/30),b=NET.bk;
 if(AU.fg){AU.fg.gain.setTargetAtTime(v>0?b*sp*.35*v*(Math.random()<.6?1:.5):0,t,.04);AU.fb.frequency.setTargetAtTime(900+NET.vz*25+Math.random()*300,t,.05);AU.wg.gain.setTargetAtTime(v>0&&NET.falling?clamp(NET.vz/70,0,1)*.28*v:0,t,.1)}
 AU.so.frequency.setTargetAtTime(900+NET.vz*35+Math.random()*80,t,.04);AU.sg.gain.setTargetAtTime(v>0?b*sp*.07*v:0,t,.05)}
const rr=(x,a,b,c,d,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,c,d,r);else x.rect(a,b,c,d)};
if(W.on){
 // nem eséskor: a fék nyomása és hűlése valós időben, rázkódás lecsengése, riasztás
 on('frame',dt=>{if(!NET.falling){NET.bk+=((NET.bkIn?1:0)-NET.bk)*Math.min(1,dt/.25);NET.bkT=Math.max(0,NET.bkT-.05*dt)}
  NET.shake=Math.max(0,NET.shake-dt/.8);
  if(NET.falling&&NET.vz>12&&NET.bk<.5){NET.alarmT+=dt;if(NET.alarmT>.35){NET.alarmT=0;if(W.beep)beep(1500,.1,.1)}}
  NET.t=(NET.t||0)+dt;if(NET.t>=.08){NET.t=0;try{aud()}catch(e){}}});
 on('world.front',V=>{if(NET.bk>.2&&NET.vz>4&&V.lw){const n=V.dt*60*NET.bk*Math.min(1,NET.vz/30);for(let i=0;i<n+Math.random();i++)[-1,1].forEach(sg=>{const[a,b]=V.lw(-7.4,sg*1.95);pr.push({x:V.rx+(a-V.cx)/V.K,y:V.ry+(b-V.cy)/V.K,vx:(Math.random()-.5)*5,vy:(Math.random()-.3)*5,l:.3+Math.random()*.4,t:'sp'})});
   if(NET.bkT>1&&Math.random()<V.dt*8){const[a,b]=V.lw(-7.4,1.9);pr.push({x:V.rx+(a-V.cx)/V.K,y:V.ry+(b-V.cy)/V.K,vx:0,vy:-1.5,l:2,t:'k'})}}});
 on('hud',V=>{if(!NET.falling&&NET.bk<.05&&NET.shake<.02)return;const x=V.x,w=V.w;x.save();
  if(NET.falling){x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=1.5;const sp=NET.vz;for(let i=0;i<26;i++){const px=(i*47.3)%w,q=((V.ts*sp*.0012*(.7+i%4*.15)+i*.37)%1),py=V.h*(1-q);x.beginPath();x.moveTo(px,py);x.lineTo(px,py+Math.min(60,6+sp*.8));x.stroke()}
   x.fillStyle='rgba(10,8,6,.88)';rr(x,w/2-112,66,224,50,8);x.fill();x.strokeStyle=Math.sin(V.ts/110)>0?'#ff3b2f':'#7a1a12';x.lineWidth=1.6;x.stroke();
   x.font='bold 11px Georgia';x.fillStyle='#ff6a4a';x.textAlign='left';x.fillText('⚠ SZABADESÉS',w/2-104,80);x.fillStyle='#fff';x.textAlign='right';x.fillText(Math.round(NET.vz)+' m/s · talajig '+fd(Math.max(0,NET.floor(S.x,S.depth)-S.depth)),w/2+104,80);
   x.textAlign='left';x.font='9px Georgia';x.fillStyle='#bfb09a';x.fillText('FÉK',w/2-104,96);x.fillText('HŐ',w/2-104,108);
   x.fillStyle='#2a2118';x.fillRect(w/2-76,90,180,6);x.fillRect(w/2-76,102,180,6);x.fillStyle='#ffb020';x.fillRect(w/2-76,90,180*NET.bk,6);x.fillStyle=NET.bkT>1?'#ff3b2f':'#f0a030';x.fillRect(w/2-76,102,180*Math.min(1,NET.bkT),6)}
  if(NET.shake>.02){x.fillStyle=`rgba(255,60,30,${NET.shake*.35})`;x.fillRect(0,0,V.w,V.h)}
  x.restore()});
}
})(typeof window!=='undefined'?window:globalThis);
