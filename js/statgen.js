/* DrillUp Core Quest – statikus porszemcse-generátor (SPG): beépített végső tartalék a gép tetején.
   Ha MINDEN üzemanyag elfogyott (üres tank, a raktárban nincs elégethető anyag, és a bázison sem lehet tankolni),
   a generátor elektrosztatikusan magába szívja a levegő / a járat porszemcséit, és nagyon kevés üzemanyagot állít elő belőlük.
   Így a gép soha nem ragad be végleg: rövid szakaszokban (töltés → kis mozgás → töltés) haza lehet vánszorogni.
   • Töltés: a tank 1,5%-áig (RES), kb. 0,06%/s valós időben – lassú, de biztos.
   • Ha a gép menet közben fogy ki, a generátor megállítja (nem vész el a mélyben), és feltöltés után magától folytatja az utat.
   • Rajz: kis henger a gép tetején; működés közben a környező por spirálban beáramlik, a tekercs kéken derengve izzik.
   Nem nyúl a mentés szerkezetéhez (csak S.fuel-t növeli). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('statgen');
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const h=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const SPG={RES:.015,RATE:.0006,res:null,told:0,glow:0,
 tk(){try{return Math.max(1,tank())}catch(e){return 800}},
 // a töltési cél (kg)
 goal(){return SPG.tk()*SPG.RES},
 // van-e más üzemanyag-forrás (raktár, bázisi tankolás pénzből)
 other(){try{if(typeof emStock==='function'&&emStock()>1e-6)return true;if(typeof base==='function'&&base()){const p=calc().f.p*(W.SRF?SRF.disc('fu'):1);if(S.cash>=p*SPG.goal())return true}}catch(e){}return false},
 // működik-e most (minden más forrás kimerült és a tank a tartalék alatt van)
 need(){try{return S.fuel<SPG.goal()-1e-6&&!SPG.other()}catch(e){return false}},
 on(){return SPG.need()},
 // a gép menet közben kifogyott: megállítja, és megjegyzi az irányt (feltöltés után folytatja). true = lekezelte (nincs elveszés)
 hold(m){if(SPG.other())return false;SPG.res=m&&m!=='idle'?m:SPG.res;S.st='idle';S.mode='';
  if(!SPG.told||Date.now()-SPG.told>20000){SPG.told=Date.now();try{msg('🌀 Elfogyott minden üzemanyag – a statikus porszemcse-generátor a levegő porából gyűjt egy kevés üzemanyagot. Töltés után a gép magától továbbindul.',true)}catch(e){}}
  return true},
 // gombnyomás üres tankkal: ha a generátor dolgozik, elfogadja az irányt (töltés után indul)
 queue(s){if(!SPG.need())return false;SPG.res=s;const p=Math.round(cl(S.fuel/SPG.goal(),0,1)*100);try{toast('🌀 Porszemcse-generátor tölt: '+p+'% – utána indul a gép.')}catch(e){}return true},
 // valós idejű lépés: termelés + folytatás
 sim(real){if(!(real>0))return;real=Math.min(real,3600);
  if(SPG.need()){const g=SPG.goal();S.fuel=Math.min(g,S.fuel+SPG.tk()*SPG.RATE*real);SPG.glow=1}else SPG.glow=Math.max(0,SPG.glow-real*.8);
  if(SPG.res&&S.st==='idle'&&S.fuel>=SPG.goal()-1e-6){const s=SPG.res;SPG.res=null;SPG.resuming=1;try{go(s)}catch(e){}SPG.resuming=0}
  if(SPG.res&&S.st!=='idle')SPG.res=null},
 // eszköz a gép tetején (gép-lokális méter: a előre, b lefelé)
 draw(V){if(!V.lw)return;const x=V.x,K=V.K||10,T=(V.ts||0)/1e3,a0=-3.3,b0=-1.6,P=(a,b)=>V.lw(a,b),on=SPG.glow;
  const r=Math.max(2,K*.34),[cx,cy]=P(a0,b0-.5);
  x.save();
  // talp + henger
  const [bx,by]=P(a0,b0);x.fillStyle='#2b2d31';x.fillRect(bx-r*1.15,by-r*.35,r*2.3,r*.45);
  const g=x.createLinearGradient(cx-r,0,cx+r,0);g.addColorStop(0,'#4a4e55');g.addColorStop(.45,'#b9c0c8');g.addColorStop(1,'#3a3d42');
  x.fillStyle=g;x.fillRect(cx-r*.8,cy-r*.9,r*1.6,r*1.5);
  // tekercs-bordák
  x.strokeStyle=on>.05?`rgba(120,200,255,${.45+.45*on})`:'#7a5a2a';x.lineWidth=Math.max(.6,r*.13);
  for(let i=0;i<4;i++){const yy=cy-r*.7+i*r*.36;x.beginPath();x.moveTo(cx-r*.8,yy);x.lineTo(cx+r*.8,yy);x.stroke()}
  // tölcsér-fej (szívó rács)
  x.fillStyle='#55595f';x.beginPath();x.moveTo(cx-r*1.1,cy-r*.9);x.lineTo(cx+r*1.1,cy-r*.9);x.lineTo(cx+r*.75,cy-r*1.35);x.lineTo(cx-r*.75,cy-r*1.35);x.closePath();x.fill();
  x.strokeStyle='#1d1f22';x.lineWidth=Math.max(.5,r*.08);for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*r*.32,cy-r*.92);x.lineTo(cx+i*r*.24,cy-r*1.33);x.stroke()}
  const top=[cx,cy-r*1.35];
  if(on>.02){const q=W.Gov?Gov.q:2,n=[10,18,28][q];
   x.globalCompositeOperation='lighter';
   const gl=x.createRadialGradient(top[0],top[1],0,top[0],top[1],r*3);gl.addColorStop(0,`rgba(140,210,255,${.5*on})`);gl.addColorStop(1,'rgba(140,210,255,0)');x.fillStyle=gl;x.beginPath();x.arc(top[0],top[1],r*3,0,7);x.fill();
   // beáramló por: spirálpályán a szívófej felé
   for(let i=0;i<n;i++){const ph=(T*.55+h(i))%1,ang=h(i+7)*6.283+ph*5,rad=r*(1.2+5*(1-ph)),px=top[0]+Math.cos(ang)*rad,py=top[1]-r*.4+Math.sin(ang)*rad*.55,al=on*Math.min(1,ph*3)*(1-ph*.3);
    x.fillStyle=i%3?`rgba(225,205,170,${.75*al})`:`rgba(170,225,255,${.9*al})`;const s=Math.max(.7,r*.12*(1.3-ph));x.fillRect(px-s/2,py-s/2,s,s)}
   // apró kisülés
   if(Math.sin(T*23)>.6){x.strokeStyle=`rgba(190,235,255,${.8*on})`;x.lineWidth=Math.max(.5,r*.07);x.beginPath();x.moveTo(top[0]-r*.3,top[1]);x.lineTo(top[0]+r*.05,top[1]-r*.35);x.lineTo(top[0]-r*.05,top[1]-r*.5);x.lineTo(top[0]+r*.3,top[1]-r*.85);x.stroke()}}
  x.restore()},
 // Műhely → Karbantartás kártya
 card(){const p=Math.round(cl(S.fuel/SPG.goal(),0,1)*100);return`<div class="card">🌀 <b>Statikus porszemcse-generátor</b> (beépített tartalék)<br><span class="mu">Ha minden üzemanyag elfogyott, a levegő porszemcséiből nagyon kevés üzemanyagot gyűjt (a tank ${Math.round(SPG.RES*100*10)/10}%-áig), így a gép sosem ragad be. ${SPG.need()?'Most dolgozik: '+p+'%':'Most pihen.'}</span></div>`}
};
W.SPG=SPG;
if(W.on){on('sim',r=>{try{SPG.sim(r)}catch(e){}});on('world.front',V=>{try{if(!V.menu)SPG.draw(V)}catch(e){}})}
if(W.BP&&BP.extras)BP.extras.push(()=>SPG.card());
})(typeof window!=='undefined'?window:globalThis);
