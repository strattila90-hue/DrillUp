/* Drill Up – M.E.D.V.E. ipari komplexum (2. szakasz): Személyzeti épület és Energetikai központ.
   Személyzet (S.crew = {m,f,g}: 0/1): egyszeri felvételi díj, tartós hatás –
     Gépész: páncéljavítás −20%; Üzemanyag-mester: üzemanyagár −10%; Geológus: az SG-3 magminták értéke +25%.
   Energetikai központ: a bázis energiarendszere – generátor be/ki, trafó-fejlesztés, minden világítás egyszerre. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('complex2');
const ST={x:143,w:15,h:8.6},EN={x:161,w:22,h:10.5};
const CREW={
 DEF:{m:{n:'Gépész',e:'🔧',c:5e5,fx:'páncéljavítás −20%'},f:{n:'Üzemanyag-mester',e:'⛽',c:4e5,fx:'üzemanyagár −10%'},g:{n:'Geológus',e:'🪨',c:1.5e6,fx:'SG-3 magminták +25%'}},
 st(){const c=S.crew=(S.crew&&typeof S.crew==='object')?S.crew:{};for(const k in CREW.DEF)c[k]=c[k]?1:0;return c},
 has(k){try{return !!CREW.st()[k]}catch(e){return false}},
 mul(id){return id==='ws'&&CREW.has('m')?.8:id==='fu'&&CREW.has('f')?.9:1},
 core(){return CREW.has('g')?1.25:1},
 hire(k){const d=CREW.DEF[k];if(!d||CREW.has(k))return false;if(typeof base==='function'&&!base()){toast('Felvenni csak a bázison lehet.');return false}if(S.cash<d.c){toast('Nincs elég pénz ('+nf(d.c,0)+' Ft).');return false}
  S.cash-=d.c;CREW.st()[k]=1;try{msg(d.e+' Felvetted: '+d.n+' – '+d.fx+'.')}catch(e){}try{save()}catch(e){}return true}};
W.CREW=CREW;
// a kedvezmények a felszíni épületek kedvezményével szorzódnak
function hook(){if(W.SRF&&!SRF._crew){const od=SRF.disc;SRF.disc=id=>od(id)*CREW.mul(id);SRF._crew=1}}
hook();

// ---------- rajz ----------
function stStatic(c){const L=W.CX.lib,{R,hazard}=L,w=ST.w,h=ST.h;
 R(c,-.4,-.6,w+.8,.6,'#5b5f66');
 // kétszintes, vakolt-panelos épület, lapostető korláttal
 R(c,0,-h,w,h,'#7d6a55');c.fillStyle='rgba(255,255,255,.07)';c.fillRect(0,-h,.5,h);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(w-1,-h,1,h);
 R(c,-.2,-4.4,w+.4,.35,'#4a5059');R(c,-.25,-h-.35,w+.5,.4,'#4a5059');c.strokeStyle='#c9ced3';c.lineWidth=.07;c.beginPath();for(let x=0;x<=w;x+=.8){c.moveTo(x,-h-.35);c.lineTo(x,-h-1.1)}c.moveTo(0,-h-1.1);c.lineTo(w,-h-1.1);c.stroke();
 // földszint: öltöző (szekrénysor), étkező (asztalok), bejárat
 R(c,.6,-3.9,4.6,3.2,'#1c2228');for(let i=0;i<6;i++){R(c,.75+i*.72,-3.7,.62,2.7,i%2?'#4f6a7a':'#5d7a8a',.04);c.fillStyle='#222';c.fillRect(.95+i*.72,-2.6,.2,.05)}
 R(c,5.6,-3.9,2.6,3.3,'#2b3139');R(c,5.75,-3.75,1.1,3.05,'#a9d6ff',.05);R(c,6.95,-3.75,1.1,3.05,'#a9d6ff',.05);
 R(c,8.6,-3.9,5.8,3.2,'#2a221c');for(let i=0;i<3;i++){R(c,9+i*1.8,-1.9,1.4,.15,'#8a6a3a',.04);c.fillStyle='#3a2e24';c.fillRect(9.1+i*1.8,-1.75,.12,1.05);c.fillRect(10.2+i*1.8,-1.75,.12,1.05)}
 R(c,9.2,-3.6,4.6,.5,'#3a3f46',.04);c.fillStyle='#e8c38a';c.font='bold .34px Georgia';c.textAlign='center';c.fillText('ÉTKEZŐ',11.5,-3.25);
 // emelet: pihenő (kanapé, lámpa) + irodák (asztalok, monitorok)
 R(c,.6,-8,6.6,3.3,'#22282f');R(c,1.2,-5.9,3.6,.8,'#8a3a2a',.05);R(c,1.2,-6.4,.35,1.3,'#8a3a2a',.04);R(c,5.4,-7.4,.12,2.5,'#2b3139',0);c.fillStyle='#ffd98a';c.beginPath();c.moveTo(5.1,-7.4);c.lineTo(5.8,-7.4);c.lineTo(5.6,-7.9);c.lineTo(5.3,-7.9);c.fill();
 R(c,7.8,-8,6.6,3.3,'#1b2430');for(let i=0;i<2;i++){R(c,8.3+i*3.1,-5.9,2.4,.15,'#5d6670',.04);R(c,8.8+i*3.1,-6.9,1.1,.8,'#0f1a26',.05)}
 c.strokeStyle='#8a939d';c.lineWidth=.1;for(const[x0,x1]of[[.6,7.2],[7.8,14.4]]){c.strokeRect(x0,-8,x1-x0,3.3);for(let x=x0+1.65;x<x1;x+=1.65){c.beginPath();c.moveTo(x,-8);c.lineTo(x,-4.7);c.stroke()}}
 // tábla
 R(c,2.4,-h+.15,10.2,.6,'#2f6fb0');c.fillStyle='#fff';c.font='bold .46px Georgia';c.textAlign='center';c.fillText('SZEMÉLYZETI ÉPÜLET',7.5,-h+.6);
 // parkoló: két autó + jelzés
 R(c,w+.6,-.15,6,.15,'#6d7176',0);for(const[ox,col]of[[w+.9,'#c9562a'],[w+3.6,'#2f6fb0']]){c.fillStyle=col;c.beginPath();c.moveTo(ox,-.5);c.lineTo(ox+.4,-1.2);c.lineTo(ox+1.9,-1.2);c.lineTo(ox+2.4,-.5);c.closePath();c.fill();c.fillStyle='#a9d6ff';c.fillRect(ox+.55,-1.1,1.2,.4);c.fillStyle='#15171a';c.beginPath();c.arc(ox+.55,-.45,.25,0,7);c.arc(ox+1.85,-.45,.25,0,7);c.fill()}
 R(c,w+5.5,-2.6,.12,2.6,'#3a3f46',0);R(c,w+5.1,-2.9,.9,.6,'#2f6fb0',.04);c.fillStyle='#fff';c.font='bold .4px Georgia';c.fillText('P',w+5.55,-2.45)}
function enStatic(c){const L=W.CX.lib,{R,hazard,rivets}=L,w=EN.w,h=EN.h;
 R(c,-.4,-.7,w+.8,.7,'#5b5f66');hazard(c,-.4,-.25,w+.8,.25);
 // generátorház (bal): magas csarnok, belátható gépteremmel
 R(c,0,-h,10,h,'#4a3f36');c.fillStyle='rgba(0,0,0,.25)';c.fillRect(9,-h,1,h);
 R(c,.6,-8.6,8.8,7.8,'#1a1d21');
 for(const gx of[1.2,5.2]){R(c,gx,-3.4,3.4,2.6,'#c9562a');c.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++)c.fillRect(gx+.3+i*.5,-3.1,.25,2);R(c,gx+.4,-4.1,1.2,.7,'#6b727c',.05);R(c,gx+2,-3.9,1,.5,'#3a3f46',.04)}
 R(c,.6,-8.6,8.8,.35,'#d8a400');rivets(c,.9,9.1,-8.42,.8);
 R(c,0,-h-.4,10,.45,'#3a3f46');R(c,2,-h-3.2,.9,2.8,'#5d6670');R(c,6.5,-h-4.2,.9,3.8,'#5d6670'); // kipufogók
 R(c,.8,-h+.3,8.4,.7,'#c9562a');c.fillStyle='#fff';c.font='bold .44px Georgia';c.textAlign='center';c.fillText('ENERGETIKAI KÖZPONT',5,-h+.82);c.font='.26px Georgia';c.fillStyle='#ffe0c8';c.fillText('ЭНЕРГОБЛОК',5,-h+.5);
 // trafóudvar (jobb): két nagy transzformátor, szigetelők, gyűjtősín, kerítés
 for(const[tx,sc]of[[11.5,1],[16.5,.85]]){c.save();c.translate(tx,-.7);c.scale(sc,sc);R(c,0,-4,4,4,'#4f6a5a');c.fillStyle='#3e5547';for(let i=0;i<7;i++)c.fillRect(4.05+i*.18,-3.6,.1,3.2);R(c,0,-4.2,4,.3,'#5f7d6b',.05);
  for(let i=0;i<3;i++){const px=.8+i*1.2;R(c,px-.15,-6,.3,1.8,'#b9622f',.04);for(let j=0;j<4;j++){c.fillStyle='#8a4a2a';c.fillRect(px-.3,-5.8+j*.4,.6,.15)}}c.restore()}
 c.strokeStyle='#9aa1aa';c.lineWidth=.12;c.beginPath();c.moveTo(11.5,-7.4);c.lineTo(21.6,-7.4);c.stroke();for(const px of[12.3,13.5,14.7,17.2,18.2,19.2]){c.beginPath();c.moveTo(px,-6.7);c.lineTo(px,-7.4);c.stroke()}
 c.strokeStyle='rgba(150,160,170,.7)';c.lineWidth=.05;c.beginPath();for(let x=10.6;x<w;x+=.5){c.moveTo(x,-.7);c.lineTo(x+.5,-2.6);c.moveTo(x+.5,-.7);c.lineTo(x,-2.6)}c.stroke();
 // csővezeték (gőz) a generátorháztól a trafóudvarig + szellőzőrács
 R(c,9.6,-6.2,1.6,.4,'#9aa1aa');R(c,9.6,-5.6,1.6,.3,'#c9562a');R(c,3.2,-9.6,3.6,.7,'#2b3036');c.strokeStyle='#5d6670';c.lineWidth=.05;c.beginPath();for(let x=3.4;x<6.8;x+=.3){c.moveTo(x,-9.55);c.lineTo(x,-8.95)}c.stroke()}
function stDyn(x,V,sx,Y0,K){const ts=V.ts,night=V.day<.55,X=v=>sx+v*K,Y=v=>Y0+v*K;
 // szellőző a tetőn + mozgó alak az étkezőben
 const a=ts/150,fx=X(12.8),fy=Y(-ST.h-.7);x.strokeStyle='#1a1d21';x.lineWidth=1.2;x.beginPath();for(let b=0;b<3;b++){const q=a+b*2.09;x.moveTo(fx,fy);x.lineTo(fx+Math.cos(q)*K*.4,fy+Math.sin(q)*K*.15)}x.stroke();
 const px=X(9.4+((Math.sin(ts/2600)+1)/2)*4);x.fillStyle='#14161a';x.beginPath();x.arc(px,Y(-2.6),K*.22,0,7);x.fill();x.fillRect(px-K*.2,Y(-2.4),K*.4,K*.9);
 for(let i=0;i<2;i++)if(Math.floor(ts/700+i)%3){x.fillStyle='#35d06a';x.fillRect(X(9+i*3.1),Y(-6.75),2,2)}
 if(night){V.lamp(X(4),Y(-6.3),K*7,.7);V.lamp(X(11),Y(-2.4),K*6,.65);V.lamp(X(ST.w+3),Y(-2.8),K*5,.5)}}
function enDyn(x,V,sx,Y0,K){const ts=V.ts,night=V.day<.55,X=v=>sx+v*K,Y=v=>Y0+v*K,gen=W.GEN&&GEN.running&&GEN.running();
 // kipufogófüst (erősebb, ha jár a generátor), gőzkifúvás, trafózúgás-villanás, figyelmeztető fény
 for(const[ex,ey]of[[2.45,-EN.h-3.2],[6.95,-EN.h-4.2]])for(let k=0;k<4;k++){const ph=((ts/(gen?2200:3600))+k/4+ex)%1;x.fillStyle=`rgba(${gen?'70,70,78':'170,170,178'},${(.4*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(X(ex)+ph*K*2,Y(ey)-ph*K*3.4,K*(.3+ph*1.1),0,7);x.fill()}
 if(Math.floor(ts/2400)%4===0){const ph=(ts%2400)/2400;x.fillStyle=`rgba(235,240,245,${(.5*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(X(11.2),Y(-6)-ph*K*2,K*(.4+ph),0,7);x.fill()}
 if(gen&&Math.random()<.08){x.strokeStyle='rgba(160,200,255,.9)';x.lineWidth=1;x.beginPath();x.moveTo(X(12.3),Y(-6.8));x.lineTo(X(12.5),Y(-7.3));x.stroke()}
 x.fillStyle=gen?(Math.floor(ts/400)%2?'#35d06a':'#1a5a2a'):'#7a1a14';x.beginPath();x.arc(X(9.6),Y(-EN.h+1.6),K*.2,0,7);x.fill();
 if(night){V.lamp(X(5),Y(-5),K*7,.7);V.GL.push({x:X(5),y:Y(-2.5),r:K*4,c:'255,150,70',i:gen?.3:.12})}}
// ---------- világ ----------
const hits=[];
function world(V){if(typeof S==='undefined'||!W.CX||!CX.lib||typeof document==='undefined'||!document.createElement)return;const x=V.x,Ys=V.Ys,K=V.K||10,L=CX.lib;hits.length=0;if(!(Ys>-300&&Ys<V.h+200))return;
 const s=V.SX(ST.x),e=V.SX(EN.x);
 if(s<V.w+40&&s+(ST.w+8)*K>-40){L.blit(x,V,L.sprite('st',ST.w+7,ST.h+1.3,1,stStatic),ST.x);stDyn(x,V,s,Ys,K);hits.push({id:'st',x:s,y:Ys-ST.h*K,w:ST.w*K,h:ST.h*K})}
 if(e<V.w+40&&e+EN.w*K>-40){L.blit(x,V,L.sprite('en',EN.w,EN.h+4.4,1,enStatic),EN.x);enDyn(x,V,e,Ys,K);hits.push({id:'en',x:e,y:Ys-EN.h*K,w:EN.w*K,h:EN.h*K})}}
function card(id){if(typeof document==='undefined'||!document.getElementById)return;let c=document.getElementById('cxCard');if(!c){c=document.createElement('div');c.id='cxCard';document.body.appendChild(c)}
 const X='<button class="srx" aria-label="Bezár" onclick="document.getElementById(\'cxCard\').style.display=\'none\'">✕</button>';let h='';
 if(id==='st'){h=`<div class="srh"><b>👷 Személyzeti épület</b>${X}</div><div class="mu">Öltözők, pihenő, étkező és irodák. Itt veszed fel a szakembereket – egyszeri díj, tartós előny.</div>`;
  for(const k in CREW.DEF){const d=CREW.DEF[k],has=CREW.has(k);h+=`<div class="cxr"><span><b>${d.e} ${d.n}</b><small>${d.fx}</small></span>${has?'<em class="ok">✔ felvéve</em>':`<button class="b" ${S.cash>=d.c?'':'disabled'} onclick="CREW.hire('${k}')&&CX2.card('st')">Felvétel · ${nf(d.c,0)} Ft</button>`}</div>`}}
 else{const g=W.GN&&GN[S.u.g],gon=!!S.gon,tl=W.SRF?SRF.lv('tr'):1;h=`<div class="srh"><b>⚡ Energetikai központ</b>${X}</div><div class="mu">Generátorház, transzformátorok, tartalék energia: a bázis áramellátása és világítása.</div>
  <div class="cxr"><span><b>🔌 Generátor</b><small>${g?g[0]+' · '+g[1]+' kW':'–'} · tank ${W.GN?Math.round(S.gf/Math.max(1,g[4])*100):0}%</small></span><button class="b" onclick="PW.toggleGen();CX2.card('en')">${gon?'Leállítás':'Indítás'}</button></div>
  <div class="cxr"><span><b>🗼 Trafóállomás</b><small>${tl}. szint ${'★'.repeat(tl)}</small></span>${tl<3?`<button class="b" onclick="SRF.up('tr');CX2.card('en')">Fejlesztés · ${nf(SRF.cost('tr'),0)} Ft</button>`:'<em class="ok">max</em>'}</div>
  <div class="cxr"><span><b>💡 Bázisvilágítás</b><small>minden lámpa és épület</small></span><button class="b" onclick="SRF.all();CX2.card('en')">Be / ki</button></div>`}
 c.innerHTML=h;c.style.display='block';try{beep(560,.05,.05,'triangle')}catch(e){}}
const CX2={card,ST,EN};W.CX2=CX2;
if(W.on)on('world.back',V=>{hook();try{world(V)}catch(e){if(W.DBG)DBG.err='complex2: '+(e.message||e)}});
if(typeof document!=='undefined'&&document.addEventListener){let dn=null;document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;if(W.ZM&&(ZM.t>1||ZM.z>1.02))return;
  const r=e.target.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;for(const H of hits)if(px>=H.x&&px<=H.x+H.w&&py>=H.y&&py<=H.y+H.h){card(H.id);break}},true)}
})(typeof window!=='undefined'?window:globalThis);
