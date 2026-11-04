/* Drill Up – szeizmikus szonda kihelyezése: dedikált gomb (a gombon a készlet), kar-animáció, örök szonda.
   A gép hasából teleszkópos kar nyúl ki, fúrófejjel a talajba fúrja a szondát, majd visszahúzódik. A szonda az adott játékmenetben
   véglegesen ott marad (nem szedhető fel). A tényleges nyilvántartás a SZ/GEO modulban van (S.geo.sz.sens, .stock). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('sensor');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),R=(a,b)=>a+Math.random()*(b-a),OFF=-7.2,FLOOR=1.75,PL=1.5,DUR=3.4;
const sm=u=>{u=cl(u,0,1);return u*u*(3-2*u)};
const SP={A:null,fin:null,P:[],bt:0,
 n(){try{return GEO.ens().sz.stock|0}catch(e){return 0}},
 busy(){return !!SP.A},
 btn(){const n=SP.n();return`<button id="bSP" class="pb sm${n?'':' dim'}" style="--lc:#3ee08a" onpointerdown="SP.deploy(event)" aria-label="Szeizmikus szonda kihelyezése"><b>📍</b><span class="spl">Szonda</span><u id="spN">${n}</u></button>`},
 upd(){const e=document.getElementById&&document.getElementById('spN');if(e){const n=String(SP.n());if(e.textContent!==n)e.textContent=n;const b=document.getElementById('bSP');if(b)b.classList.toggle('dim',!SP.n())}},
 deploy(e){if(e){e.preventDefault&&e.preventDefault();e.stopPropagation&&e.stopPropagation()}
  if(SP.A)return;if(W.DMG&&DMG.busy())return;
  let g;try{g=GEO.ens()}catch(x){return}
  if(g.sz.lv<1)return toast('Előbb szeizmográf kell (Tudás → Szeizmográf, a bázison).');
  if(g.sz.stock<1)return toast('Nincs szonda a készletben – vásárolj a bázison (Tudás → Szeizmográf).');
  if(S.depth<10)return toast('Szondát csak a föld alatt lehet kihelyezni.');
  if(g.sz.sens.length>=8)return toast('Legfeljebb 8 szonda lehet a talajban.');
  if(W.NET&&NET.falling)return toast('Szabadesés közben nem lehet.');
  try{stp()}catch(x){}S.st='idle';S.mode='';
  const f=(typeof hf!=='undefined'&&hf<0)?-1:1;
  SP.A={t:0,f,x:S.x+OFF*f,d:S.depth+FLOOR+PL*.5+.2,hum:0};SP.P.length=0;try{beep(70,.5,.05,'sine')}catch(x){}},
 step(dt){const A=SP.A;SP.bt+=dt;if(Math.floor(SP.bt)!==Math.floor(SP.bt-dt))SP.upd();
  for(const p of SP.P){p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.k==='dust'?1.5:9)*dt}SP.P=SP.P.filter(p=>p.l<p.L);
  if(!A)return;S.st='idle';S.mode='';A.t+=dt;
  if(A.t>.8&&A.t<2.1){A.hum+=dt;if(A.hum>.09){A.hum=0;try{beep(R(95,130),.1,.045,'sawtooth')}catch(x){}}
   for(let i=0;i<3;i++)if(Math.random()<dt*60){SP.P.push({k:Math.random()<.45?'spark':'dust',x:OFF+R(-.35,.35),y:FLOOR+.05,vx:R(-2.2,2.2),vy:R(-3,-.6),l:0,L:R(.25,.8)})}}
  if(A.t>=DUR){SP.fin={x:A.x,d:A.d};SP.A=null;try{SZ.place()}catch(x){DBG.err='szonda: '+(x.message||x)}SP.fin=null;SP.upd()}},
 // a kar rajza a gép méteres koordinátáiban (a mach() végén)
 mach(x,o){const A=SP.A,ts=o.ts||0;
  if(A){const t=A.t,e1=sm(t/.8),e2=sm((t-.8)/1.3),ret=sm((t-2.5)/.9),ext=.5*e1+1.45*e2,tip=1.5+ext,top=tip-PL,drilling=t>.8&&t<2.1;
   x.fillStyle='#30343a';x.fillRect(OFF-.5,1.38,1,.26);x.fillStyle='#e6b92e';x.fillRect(OFF-.5,1.38,1,.07);
   x.save();x.beginPath();x.rect(OFF-3,1.5,6,7);x.clip();
   const rodEnd=t<2.5?top+.1:top+.1+(1.5-top-.1)*ret;
   if(rodEnd>1.52){const L=rodEnd-1.5,w=[.34,.27,.2];let y0=1.5;for(let k=0;k<3;k++){const l=L/3;x.fillStyle=k%2?'#9aa0a8':'#6c727a';x.fillRect(OFF-w[k]/2,y0,w[k],l+.01);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(OFF-w[k]/2,y0,.05,l);y0+=l}
    x.strokeStyle='#d8dce0';x.lineWidth=.04;x.beginPath();x.moveTo(OFF+.27,1.45);x.lineTo(OFF+.27,1.5+L*.66);x.stroke();
    x.fillStyle='#41454c';x.fillRect(OFF-.27,rodEnd-.08,.54,.18)}
   const cy=t<2.5?top+PL*.5:2.7;SP.probe(x,OFF,cy,ts,1);
   if(drilling){x.save();x.beginPath();x.rect(OFF-.2,tip-.7,.4,.8);x.clip();x.strokeStyle='rgba(40,44,50,.85)';x.lineWidth=.045;for(let q=0;q<6;q++){const yy=tip-.7+((q*.14+ts/240)%.84);x.beginPath();x.moveTo(OFF-.2,yy);x.lineTo(OFF+.2,yy+.1);x.stroke()}x.restore()}
   x.restore()}
  if(SP.P.length){x.save();for(const p of SP.P){const u=p.l/p.L;if(p.k==='spark'){x.globalCompositeOperation='lighter';x.strokeStyle=`rgba(255,${220-u*100|0},110,${1-u})`;x.lineWidth=.04;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*.04,p.y-p.vy*.04);x.stroke();x.globalCompositeOperation='source-over'}
   else{x.fillStyle=`rgba(120,96,70,${.55*(1-u)})`;x.beginPath();x.arc(p.x,p.y,.07+u*.16,0,7);x.fill()}}x.restore()}},
 // egy földbe fúrt szonda: henger, antenna, pulzáló LED
 probe(x,cx,cy,ts,m){x.save();const w=.34,L=PL;x.fillStyle='rgba(0,0,0,.3)';x.fillRect(cx-w/2-.03,cy-L/2,w+.06,L);
  const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,'#e8ecef');g.addColorStop(.5,'#a9afb6');g.addColorStop(1,'#5a6068');x.fillStyle=g;x.fillRect(cx-w/2,cy-L/2,w,L*.78);
  x.fillStyle='#2f353c';x.fillRect(cx-w/2,cy-L/2+.22,w,.09);x.fillRect(cx-w/2,cy-L/2+.5,w,.05);
  x.fillStyle='#b9bec4';x.beginPath();x.moveTo(cx-w/2,cy+L*.28);x.lineTo(cx+w/2,cy+L*.28);x.lineTo(cx,cy+L/2+.1);x.closePath();x.fill();
  x.strokeStyle='#8a9098';x.lineWidth=.03;x.beginPath();x.moveTo(cx,cy-L/2);x.lineTo(cx,cy-L/2-.28);x.stroke();
  const pl=.5+.5*Math.sin(ts/380);x.fillStyle=`rgba(62,224,138,${.55+.45*pl})`;x.beginPath();x.arc(cx,cy-L/2-.3,.05,0,7);x.fill();
  x.globalCompositeOperation='lighter';const rg=x.createRadialGradient(cx,cy-L/2-.3,0,cx,cy-L/2-.3,.6);rg.addColorStop(0,`rgba(62,224,138,${.35*pl})`);rg.addColorStop(1,'rgba(62,224,138,0)');x.fillStyle=rg;x.beginPath();x.arc(cx,cy-L/2-.3,.6,0,7);x.fill();x.restore()},
 // a már kihelyezett szondák a világban
 world(V){let sz;try{sz=GEO.ens().sz}catch(e){return}if(!sz||!sz.sens||!sz.sens.length)return;const x=V.x,K=V.K;
  for(let i=0;i<sz.sens.length;i++){const s=sz.sens[i],sx=V.SX(s[0]),sy=V.SY(s[1]);if(sx<-30||sx>V.w+30||sy<-40||sy>V.h+40)continue;
   x.save();x.translate(sx,sy);x.scale(K,K);SP.probe(x,0,0,V.ts+i*517,1);x.restore();
   // lüktető hullám-gyűrű (érzékelési jelzés)
   const ph=((V.ts/2600)+i*.31)%1;x.save();x.strokeStyle=`rgba(62,224,138,${.35*(1-ph)})`;x.lineWidth=1.4;x.beginPath();x.arc(sx,sy-PL*K*.5,ph*K*2.6,0,7);x.stroke();x.restore()}}
};
W.SP=SP;
if(typeof W.go==='function'){const g0=W.go;W.go=function(s){if(SP.busy()&&s!=='idle')return;return g0.apply(this,arguments)}}
if(W.on){on('frame',dt=>{try{SP.step(Math.min(dt,.1))}catch(e){DBG.err='sensor: '+(e.message||e)}});on('world.back',V=>SP.world(V))}
})(window);
