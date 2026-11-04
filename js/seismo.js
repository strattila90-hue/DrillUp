/* Drill Up – 5/C: szeizmográf (élő kijelző) + kihelyezhető szenzorok.
   Érzékelési sugár: 1. szint 2 km, 2. szint 4 km, 3. szint 6 km (a gépen és minden kihelyezett szenzoron).
   A rengések Gutenberg–Richter-eloszlásúak (b=1). A hullámsebességet a játék lelassítja, hogy legyen idő reagálni:
   P: 1 km/s, S: 0,57 km/s (a valóságban kb. 6 és 3,5 km/s a kéregben). Hatás a gépen: intenzitás I = M − 2,6·log10(1+r[km]);
   I ≥ 2,4 rázkódás, I ≥ 3,6 járatban sérülés (a páncél csökkenti). Rengés csak a föld alatt (>50 m) keletkezik. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('seismo');
const VP=1,VS=.57,COST=[0,1.2e6,2.5e7,4e8],SCOST=2.5e6,N=150,RNG=[0,2,4,6];
const SZ={buf:new Float32Array(N),t:0,acc:0,nq:60,ev:[],flash:0,
 lv(){return GEO.ens().sz.lv},
 range(){return RNG[SZ.lv()]*1000},
 intensity(M,r){return M-2.6*Math.log10(1+r/1000)},
 // rengés létrehozása (tesztelhető: pontos hely és magnitúdó megadható)
 spawn(M,ex,ed){const g=GEO.ens();if(M==null)M=Math.min(7,2+(-Math.log10(1-Math.random())));
  if(ex==null){const a=Math.random()*6.283,rad=9000*Math.sqrt(Math.random());ex=S.x+Math.cos(a)*rad;ed=Math.max(300,S.depth+Math.sin(a)*rad)}
  const r=GEO.dist(S.x,S.depth,ex,ed),e={M,x:ex,d:ed,r,t0:SZ.t,done:0,seen:0,I:SZ.intensity(M,r)};SZ.ev.push(e);if(SZ.ev.length>12)SZ.ev.shift();
  // észlelés: a gép vagy bármely szenzor sugarán belül
  let best=null;for(const s of GEO.sources()){const rr=GEO.dist(s.x,s.d,ex,ed);if(rr<=s.r&&(!best||rr<best.r))best={r:rr,n:s.n}}
  if(best){e.seen=1;e.src=best.n;e.sr=best.r;g.sz.cnt++;g.sz.log.unshift({t:Date.now(),M:Math.round(M*10)/10,r:Math.round(best.r),n:best.n,I:Math.round(e.I*10)/10});g.sz.log.length=Math.min(12,g.sz.log.length);
   if(best.n==='gép'){msg('📡 Rengés érkezik: M'+M.toFixed(1)+' · '+nf(best.r/1000,1)+' km · S-hullám ~'+Math.ceil(best.r/1000/VS)+' mp múlva',1)}else msg('📡 '+best.n+': M'+M.toFixed(1)+' rengés '+nf(best.r/1000,1)+' km-re',1)}
  return e},
 // a rengés hatása a gépre, amikor az S-hullám megérkezik
 hit(e){e.done=1;if(S.depth<50)return;const I=e.I;if(I<2.4)return;
  if(window.NET)NET.shake=Math.max(NET.shake,Math.min(.6,(I-2.4)/3+.15));SZ.flash=1;
  let dmg=0;if(I>=3.6&&window.NET&&NET.free(S.x,S.depth)){dmg=Math.min(25,(I-3.6)*6)*(1-.1*S.u.h);S.hp=Math.max(1,S.hp-dmg)}if(dmg<.1)dmg=0;
  msg('🌍 Rengés! M'+e.M.toFixed(1)+' · '+nf(e.r/1000,1)+' km'+(dmg>0?' – a gép '+nf(dmg,1)+'%-ot sérült':''),dmg>0?0:1)},
 step(dt){SZ.t+=dt;
  if(S.depth>50){SZ.nq-=dt;if(SZ.nq<=0){SZ.nq=70+Math.random()*150;SZ.spawn()}}
  for(const e of SZ.ev)if(!e.done&&SZ.t>=e.t0+e.r/1000/VS)SZ.hit(e);
  SZ.flash=Math.max(0,SZ.flash-dt*1.5);
  // oszcilloszkóp-minta 30 Hz
  SZ.acc+=dt;while(SZ.acc>=1/30){SZ.acc-=1/30;SZ.push()}},
 push(){let a=(Math.random()-.5)*.07;if(S.st==='D'||S.st==='L'||S.st==='R')a+=(Math.random()-.5)*.1;
  if(SZ.lv()>0)for(const e of SZ.ev){if(!e.seen||e.src!=='gép')continue;const rk=e.sr/1000,tp=SZ.t-e.t0-rk/VP,ts=SZ.t-e.t0-rk/VS,A=Math.min(1,.15+e.I/5);
   if(tp>0&&tp<14)a+=A*.3*Math.exp(-tp*.5)*Math.sin(tp*38)*Math.min(1,tp*4);
   if(ts>0&&ts<20)a+=A*Math.exp(-ts*.28)*Math.sin(ts*21)*Math.min(1,ts*3)}
  SZ.buf.copyWithin(0,1);SZ.buf[N-1]=Math.max(-1,Math.min(1,a))},
 // a legközelebbi, még meg nem érkezett észlelt hullám ETA-ja (mp)
 eta(){let p=null,s=null;for(const e of SZ.ev){if(!e.seen||e.src!=='gép'||e.done)continue;const rk=e.sr/1000,tp=e.t0+rk/VP-SZ.t,ts=e.t0+rk/VS-SZ.t;if(tp>0&&(p===null||tp<p))p=tp;if(ts>0&&(s===null||ts<s))s=ts}return{p,s}},
 buy(){const g=GEO.ens(),l=g.sz.lv;if(l>=3)return;if(!base())return toast('Csak a bázison.');const c=COST[l+1];if(!GEO.pay(c))return toast('Nincs elég pénz.');g.sz.lv=l+1;msg('📡 Szeizmográf '+g.sz.lv+'. szint – érzékelési sugár '+RNG[g.sz.lv]+' km.');view()},
 buySensor(){const g=GEO.ens();if(g.sz.lv<1)return toast('Előbb szeizmográf kell.');if(!base())return toast('Csak a bázison.');if(g.sz.stock+g.sz.sens.length>=8)return toast('Legfeljebb 8 szenzor lehet.');if(!GEO.pay(SCOST))return toast('Nincs elég pénz.');g.sz.stock++;view()},
 place(){if(window.SP&&!SP.fin)return SP.deploy();const g=GEO.ens();if(g.sz.stock<1)return toast('Nincs készleten szenzor.');if(S.depth<10)return toast('Szenzort csak a föld alatt lehet kihelyezni.');g.sz.stock--;const pp=window.SP&&SP.fin?[SP.fin.x,SP.fin.d]:[S.x,S.depth];g.sz.sens.push(pp);msg('📍 Szonda a földben: '+nf(pp[1])+' m mélyen – örökre ott marad ebben a játékmenetben.');view()},
 pickup(i){return toast('A szonda véglegesen a talajban marad.');const g=GEO.ens(),s=g.sz.sens[i];if(!s)return;if(GEO.dist(S.x,S.depth,s[0],s[1])>60)return toast('Menj a szenzor 60 m-es közelébe!');g.sz.sens.splice(i,1);g.sz.stock++;msg('📍 Szenzor felvéve.');view()},
 html(){const g=GEO.ens(),l=g.sz.lv,b=base(),nx=l<3?COST[l+1]:0;
  let h=`<div class="card">📡 <b>Szeizmográf</b> <span class="mu">${l}/3</span><div class="mu">${l?`Érzékelési sugár: <b>${RNG[l]} km</b> (a gépnél és a szenzoroknál). Az élő görbe a fúrónézet jobb felső sarkában látható.`:'Rengéseket észlel, és előre jelzi az érkezésüket – a hullámsebesség a játékban lelassított (P: 1 km/s, S: 0,57 km/s).'}</div>
  ${l<3?`<button class="b" style="width:100%" ${b&&S.cash>=nx?'':'disabled'} onclick="SZ.buy()">${l?'Fejlesztés ('+RNG[l+1]+' km)':'Telepítés (2 km)'} – ${ft(nx)}</button>`:'<div class="mu">Maximális szint.</div>'}`;
  if(l){h+=`<div class="mu" style="margin-top:8px">Szenzorok: <b>${g.sz.sens.length}</b> kihelyezve · <b>${g.sz.stock}</b> készleten</div><button class="b g" style="width:100%" ${b&&S.cash>=SCOST?'':'disabled'} onclick="SZ.buySensor()">Szenzor vásárlása – ${ft(SCOST)}</button><button class="b g" style="width:100%" ${g.sz.stock&&S.depth>=10?'':'disabled'} onclick="SZ.place()">📍 Szonda kihelyezése (a gép karjával)</button>`;
   g.sz.sens.forEach((s,i)=>{const d=GEO.dist(S.x,S.depth,s[0],s[1]);h+=`<div class="mu">#${i+1}: ${nf(s[1])} m mélyen · ${nf(d/1000,2)} km-re</div>`});
   h+=g.sz.log.length?`<div class="mu" style="margin-top:8px"><b>Utolsó rengések</b> (összesen ${g.sz.cnt})</div>`+g.sz.log.map(e=>`<div class="mu">M${e.M.toFixed(1)} · ${nf(e.r/1000,1)} km · ${e.n} · intenzitás ${e.I.toFixed(1)}</div>`).join(''):'<div class="mu">Még nem volt rengés.</div>'}
  return h+'</div>'},
 rect(V){const l=SZ.lv();return l&&(!W.PN||PN.vis('sz'))?{x:V.w-150-32,y:46,w:150,h:46}:null},
 hud(V){const l=SZ.lv();if(!l||(W.PN&&!PN.vis('sz')))return;const x=V.x,w=150,h=46,px=V.w-w-32,py=46;if(W.PN)PN.reg('sz',px,py,w,h);x.save();x.globalAlpha=.92;x.fillStyle='rgba(8,14,12,.82)';GEO.rr(x,px,py,w,h,7);x.fill();x.strokeStyle='#2f6b4a';x.lineWidth=1;x.stroke();
  x.beginPath();x.rect(px+3,py+11,w-6,h-14);x.clip();x.strokeStyle='#3ee08a';x.lineWidth=1.3;x.beginPath();const sx=(w-6)/(N-1),cy=py+11+(h-14)/2,am=(h-14)/2-1;
  for(let i=0;i<N;i++){const X=px+3+i*sx,Y=cy-SZ.buf[i]*am;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();x.restore();
  x.save();x.font='bold 8px Georgia';x.fillStyle='#7fe0a8';x.textAlign='left';x.fillText('SZEIZMOGRÁF · '+RNG[l]+' km',px+6,py+9);
  const e=SZ.eta();if(e.s!==null||e.p!==null){x.textAlign='right';x.fillStyle=e.p!==null?'#ffd23c':'#ff7a5a';x.fillText(e.p!==null?'P '+e.p.toFixed(1)+' mp':'S '+e.s.toFixed(1)+' mp',px+w-5,py+9)}
  x.restore()}};
W.SZ=SZ;
if(W.on){on('frame',dt=>{try{SZ.step(Math.min(dt,.5))}catch(e){}});on('hud',V=>SZ.hud(V))}
if(W.BP)BP.extras.push(()=>SZ.html());
})(typeof window!=='undefined'?window:globalThis);
