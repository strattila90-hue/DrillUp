/* Drill Up – 4. fázis: felszíni depó (ITT történik minden eladás), szállítószalag, tehervonat, ürítés, tömörítés, fejleszthető épületek.
   Állapot (mind a mentésben):
     S.dp  {ásvány: kg}   a depó készlete          S.dq {ásvány: 0..1}  a készlet minőségi tényezője (ár-szorzó)
     S.dpf {lelet: db}    a depóba kirakott leletek S.cq {ásvány: kg}    a gép raktárának TÖMÖRÍTETT része (S.cg része)
     S.bd  {s,b,v,m}      épületszintek             S.tw {t0,t1,kg,cash} a vonat útja (időbélyegekből számolt, a háttérben is fut)
     S.dT  utolsó öregítés időbélyege
   A raktér-korlátot az eredeti fúrási lépés érvényesíti (megtelt raktér → a fúrás leáll); a tömörítés a DEP.room()-on keresztül helyet szabadít.
   Tömörítés: a tömörített rész a hely 65%-át foglalja, de az értéke 12%-kal kisebb. Tárolás: a depóban a minőség naponta 1,5%-ot
   romlik (valós idő, 75%-ig). Eladáskor az ár = napi ár × minőség. A vonat indulásakor fizet. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('depot');
const ROOM=.65,CVAL=.88,DECAY=.015,QMIN=.75,MAXL=19,TBL=6,CLAMP=1e13;
// épületek: szintenként érték és ár (a 0. szint ingyenes alap)
const BLD={
 s:{n:'Raktártelep',ic:'🏗',u:'kg',v:[5e3,2e4,1e5,5e5,3e6,2e7,1e8],p:[0,2e5,2e6,3e7,4e8,5e9,6e10],d:'a depóban tárolható nyersanyag'},
 b:{n:'Szállítószalag',ic:'⚙',u:'kg/s',v:[60,180,600,2500,1e4,5e4,2e5],p:[0,3e5,3e6,4e7,5e8,6e9,7e10],d:'kirakodási sebesség'},
 v:{n:'Vagonok',ic:'🚃',u:'kg/út',v:[3e3,1.5e4,8e4,4e5,2.5e6,1.5e7,1e8],p:[0,4e5,4e6,5e7,6e8,7e9,8e10],d:'egy vonat rakománya'},
 m:{n:'Mozdony',ic:'🚂',u:'mp/kör',v:[90,70,55,40,30,22,15],p:[0,5e5,5e6,6e7,7e8,8e9,9e10],d:'a vonat körének ideje'}};
// szintek: a 0–6. a táblázatból, fölötte képletből a 20. szintig (MAXL=19 → megjelenített Lv 20 a plafon); a 0. szint (Lv 1) ingyenes alap
const GROW={s:2.2,b:2.1,v:2.2,m:.92},PGROW=3.5;
const vAt=(k,l)=>{const B=BLD[k];if(l<=TBL)return B.v[l];const g=GROW[k],b=B.v[TBL]*Math.pow(g,l-TBL);return k==='m'?Math.max(3,b):Math.min(CLAMP,b)};
const pAt=(k,l)=>{const B=BLD[k];if(l<=TBL)return B.p[l];return Math.min(1e30,B.p[TBL]*Math.pow(PGROW,l-TBL))};
const lv=k=>Math.min(MAXL,Math.max(0,(S.bd&&S.bd[k])|0)),val=k=>vAt(k,lv(k));
const num=(v,a,b,d)=>typeof v==='number'&&isFinite(v)?Math.min(b,Math.max(a,v)):d;
let BASEP=null;const bp=n=>{if(!BASEP){BASEP=new Map();for(const l of LY)for(const x of l[5])BASEP.set(x[0],x[2])}return BASEP.get(n)};
const sum=o=>{let t=0;for(const n in o)t+=o[n];return t};
const kgf=n=>{const f=FD.find(x=>x[0]==n);return f?f[4]:0};
const now=()=>Date.now();
const DEP={job:false,jobT:0,ph:0,tk:0,uiT:0,warned:false,BLD,
 // ---------- rakomány: hely, korlát, tömörítés ----------
 saved(){let t=0;for(const n in S.cq)t+=S.cq[n];return t*(1-ROOM)},
 used(){return Math.max(0,cargoKg()-DEP.saved())},
 room(){return cap()-DEP.used()},
 clampCq(){for(const n in S.cq){const c=S.cg[n]||0;if(!(c>1e-9)||!(S.cq[n]>0))delete S.cq[n];else if(S.cq[n]>c)S.cq[n]=c}},
 add(n,a){S.cg[n]=(S.cg[n]||0)+a}, // fúrás közben ide érkezik minden kitermelt ásvány
 compress(){
  if(S.st!=='idle')return toast('Tömörítés csak álló gépnél lehetséges.');
  DEP.clampCq();let fresh=0;for(const n in S.cg)if(S.cg[n]>0){fresh+=S.cg[n]-(S.cq[n]||0);S.cq[n]=S.cg[n]}
  if(fresh<=1e-6)return toast('Nincs mit tömöríteni.');
  const f=DEP.room();msg('🗜 Raktár tömörítve – szabad hely: '+fk(Math.max(0,f))+' (a tömörített anyag ára −'+Math.round((1-CVAL)*100)+'%).');
  if(W.hiss)hiss(.35);if(W.clank)clank(.5);DEP.refresh()},
 // ---------- depó: készlet, öregedés ----------
 stock(){return sum(S.dp)},
 age(){const t=now();if(!(S.dT>0)||S.dT>t+864e5){S.dT=t;return}const days=(t-S.dT)/864e5;if(days<1/1440)return;S.dT=t;
  for(const n in S.dq){const q=S.dq[n];if(q>QMIN)S.dq[n]=Math.max(QMIN,q-DECAY*days)}},
 q(n){return S.dq[n]==null?1:S.dq[n]},
 // ---------- ürítés (szalag) ----------
 start(){
  if(!base())return toast('Kirakodni csak a bázison lehet.');if(S.st!=='idle')return toast('Állítsd meg a gépet.');
  if(DEP.job)return;
  const any=sum(S.cg)>1e-6||sum(S.fin)>0;if(!any)return toast('A gép raktára üres.');
  if(DEP.stock()>=val('s')-1e-6&&sum(S.cg)>1e-6)return toast('A raktártelep tele van – adj el vonattal vagy fejleszd.');
  DEP.job=true;DEP.jobT=0;DEP.refresh()},
 stop(){if(!DEP.job)return;DEP.job=false;DEP.refresh()},
 step(dt){ // a szalag: kg/s sebességgel viszi át a rakományt a gépből a depóba
  if(!DEP.job)return;if(!base()||S.st!=='idle'){DEP.job=false;DEP.refresh();return}
  DEP.age();DEP.clampCq();let budget=val('b')*dt,space=Math.max(0,val('s')-DEP.stock());
  const val1=n=>{const b0=bp(n);return(b0!=null?price(n,b0):0)};const names=Object.keys(S.cg).filter(n=>S.cg[n]>0).sort((a,b)=>val1(b)-val1(a)||S.cg[b]-S.cg[a]);
  for(const n of names){if(budget<=0||space<=0)break;const have=S.cg[n],m=Math.min(have,budget,space),fr=m/have,cm=(S.cq[n]||0)*fr,qin=((m-cm)+cm*CVAL)/m,old=S.dp[n]||0;
   S.dq[n]=(old*DEP.q(n)+m*qin)/(old+m);S.dp[n]=old+m;S.cg[n]=have-m;if(S.cg[n]<1e-9)delete S.cg[n];if(S.cq[n])S.cq[n]-=cm;budget-=m;space-=m}
  DEP.clampCq();
  const left=sum(S.cg);DEP.jobT+=dt;
  if(left<=1e-6){for(const n in S.fin){S.dpf[n]=(S.dpf[n]||0)+S.fin[n]}S.fin={};S.cg={};S.cq={};DEP.job=false;if(W.ding)ding();msg('🏗 Kirakodás kész – a nyersanyag a depóban van.');DEP.autoEnd();DEP.refresh();return}
  if(space<=0){if(DEP.auto&&!DEP.trainAway()&&DEP.plan().out.length){msg('🚂 A raktártelep megtelt – a vonat elviszi a készletet, a kirakodás folytatódik.');DEP.ship();return}DEP.auto=false;DEP.job=false;msg('🏗 A raktártelep megtelt – a maradék a gépen marad. '+(DEP.trainAway()?'A vonat úton van: ha visszaért, adj el és ürítsd újra.':'Adj el vonattal, majd ürítsd újra.'));DEP.refresh()}},
 // „Kirakodás és eladás” egy gombnyomásra: kirakodik, a végén (és ha közben megtelik a depó) a vonat elviszi a készletet
 auto:false,
 all(){DEP.auto=true;DEP.start();if(!DEP.job)DEP.auto=false},
 autoEnd(){if(!DEP.auto)return;DEP.auto=false;if(DEP.trainAway())return msg('🚂 A vonat úton van – ha visszaért, nyomd meg az Eladás gombot.');if(DEP.plan().out.length)DEP.ship()},
 // a fő gomb: mindig a következő logikus lépés (a képernyő aljára rögzített sávban)
 primary(){const a=DEP.act();if(a.dis)return;a.fn()},
 act(){const b=base(),away=DEP.trainAway(),has=sum(S.cg)>1e-6||sum(S.fin)>0,p=DEP.plan();
  if(!b)return{t:'🏠 Menj a bázisra',dis:1,k:'x'};
  if(S.st!=='idle'&&!DEP.job)return{t:'✋ Állítsd meg a gépet',dis:1,k:'x'};
  if(DEP.job)return{t:'■ Megállít – '+fk(sum(S.cg))+' maradt',dis:0,k:'stop',fn:()=>{DEP.auto=false;DEP.stop()}};
  if(has)return{t:'⬇ Kirakodás – '+fk(sum(S.cg)),dis:0,k:'start',fn:()=>DEP.start()};
  if(away)return{t:'🚂 Úton… '+Math.max(0,Math.ceil((S.tw.t1-now())/1e3))+' mp',dis:1,k:'away'};
  if(p.out.length)return{t:'🚂 Eladás – '+ft(p.cash)+' ('+fk(p.kg)+')',dis:0,k:'sell',fn:()=>DEP.ship()};
  return{t:'Nincs mit kirakodni vagy eladni',dis:1,k:'none'}},
 allOk(){return base()&&S.st==='idle'&&!DEP.job&&(sum(S.cg)>1e-6||sum(S.fin)>0)},
 bar(){const a=DEP.act(),al=DEP.allOk();return`<div class="dpBar">${al?'<button class="b g" id="dpAll" onclick="DEP.all()">⬇🚂 Kirakodás és eladás</button>':''}<button class="b ${a.k==='sell'||a.k==='start'?'':'g'}" id="dpAct" ${a.dis?'disabled':''} onclick="DEP.primary()">${a.t}</button></div>`},
 // ---------- eladás: vonat ----------
 trainAway(){return !!S.tw&&now()<S.tw.t1},
 plan(){ // a vonat a legértékesebb (Ft/kg) anyagot viszi előre, a kapacitásig
  DEP.age();const capK=val('v'),it=[];
  for(const n in S.dpf){const c=S.dpf[n],f=FD.find(x=>x[0]==n);if(f&&c>0)it.push({k:'f',n,c,m:f[4],u:f[5]/Math.max(f[4],1e-9),p:f[5]})}
  for(const n in S.dp){const kg=S.dp[n],b=bp(n);if(kg>0&&b!=null){const p=price(n,b)*DEP.q(n);it.push({k:'m',n,c:kg,m:1,u:p,p})}}
  it.sort((a,b)=>b.u-a.u);let left=capK,cash=0,kg=0;const out=[];
  for(const e of it){if(left<=0)break;let take=e.k==='f'?Math.min(e.c,Math.floor(left/Math.max(e.m,1e-9))):Math.min(e.c,left);if(!(take>0))continue;const m=take*e.m;out.push({k:e.k,n:e.n,take});cash+=take*e.p;kg+=m;left-=m}
  return{out,cash,kg}},
 ship(){
  if(!base())return toast('A vonatot a bázison lehet megrakni.');if(DEP.trainAway())return toast('A vonat úton van.');
  const p=DEP.plan();if(!p.out.length)return toast('Nincs mit eladni – előbb ürítsd ki a gépet a depóba.');
  for(const e of p.out){if(e.k==='f'){S.dpf[e.n]-=e.take;if(S.dpf[e.n]<=0)delete S.dpf[e.n]}else{S.dp[e.n]-=e.take;if(S.dp[e.n]<1e-6){delete S.dp[e.n];delete S.dq[e.n]}}}
  S.cash+=p.cash;S.tw={t0:now(),t1:now()+val('m')*1e3,kg:p.kg,cash:p.cash};
  msg('🚂 A vonat elindult ('+fk(p.kg)+') – kifizetve: '+ft(p.cash));toast('🚂 Eladva: '+ft(p.cash));if(W.beep){beep(180,.5,.18,'sawtooth');setTimeout(()=>beep(240,.4,.14,'sawtooth'),280)}
  DEP.refresh()},
 // ---------- épületek ----------
 upgrade(k){const B=BLD[k];if(!B)return;if(!base())return toast('Fejleszteni csak a bázison lehet.');const l=lv(k);if(l>=MAXL)return;if(!DEP.gain(k))return toast('Maximális szint (Lv 20).');const p=pAt(k,l+1);if(S.cash<p)return toast('Nincs elég pénzed.');
  S.cash-=p;S.bd[k]=l+1;msg('🏗 '+B.n+' fejlesztve: Lv '+(l+2)+' – '+nf(vAt(k,l+1))+' '+B.u);if(W.clank)clank(.6);DEP.refresh();DEP.upRefresh()},
 // annyi szint, amennyire telik (legfeljebb n)
 upgradeMax(k,n){let c=0;while(c<(n||50)&&lv(k)<MAXL&&base()&&DEP.gain(k)&&S.cash>=pAt(k,lv(k)+1)){const l=lv(k),p=pAt(k,l+1);S.cash-=p;S.bd[k]=l+1;c++}if(c){const B=BLD[k];msg('🏗 '+B.n+': +'+c+' szint → Lv '+(lv(k)+1)+' – '+nf(val(k))+' '+B.u);if(W.clank)clank(.6);DEP.refresh();DEP.upRefresh()}else if(!base())toast('Fejleszteni csak a bázison lehet.');else toast('Nincs elég pénzed.')},
 vAt,pAt,lvl:lv,gain(k){const l=lv(k);if(l>=MAXL)return false;const a=vAt(k,l),b=vAt(k,l+1);return k==='m'?b<a-1e-9:b>a},upRefresh(){if(W.DX&&DX.refresh)DX.refresh()},
 // ---------- reset, mentés ----------
 reset(){S.cq={}; DEP.job=false}, // a gép elvesztésekor a rakomány (és tömörítése) elvész; a depó, a vonat, az épületek megmaradnak
 sanitize(o){
  const known=new Set(LY.flatMap(l=>l[5].map(x=>x[0])));
  const map=k=>{const s=o[k],r={};if(s&&typeof s==='object'&&!Array.isArray(s))for(const n in s)if(known.has(n)&&typeof s[n]==='number'&&isFinite(s[n])&&s[n]>0)r[n]=Math.min(s[n],CLAMP);o[k]=r};
  map('dp');map('cq');
  const dq={};for(const n in o.dp)dq[n]=num(o.dq&&o.dq[n],.3,1,1);o.dq=dq;
  const f={};if(o.dpf&&typeof o.dpf==='object'&&!Array.isArray(o.dpf))for(const n in o.dpf)if(FD.some(x=>x[0]==n)&&Number.isFinite(o.dpf[n])&&o.dpf[n]>0)f[n]=Math.min(1e9,Math.floor(o.dpf[n]));o.dpf=f;
  for(const n in o.cq){const c=o.cg&&o.cg[n]||0;if(!(c>0))delete o.cq[n];else if(o.cq[n]>c)o.cq[n]=c}
  const bd={},ob=o.bd&&typeof o.bd==='object'?o.bd:{};for(const k in BLD)bd[k]=Number.isInteger(ob[k])?Math.min(MAXL,Math.max(0,ob[k])):0;o.bd=bd;
  const w=o.tw;o.tw=(w&&typeof w==='object'&&[w.t0,w.t1,w.kg,w.cash].every(v=>typeof v==='number'&&isFinite(v))&&w.t1<=Date.now()+36e5&&w.t1>=w.t0)?{t0:w.t0,t1:w.t1,kg:Math.max(0,w.kg),cash:Math.max(0,w.cash)}:null;
  o.dT=num(o.dT,0,1e15,0);if(o.dT>Date.now()+864e5)o.dT=Date.now();},
 // ---------- felület ----------
 refresh(){try{if(tab==2||tab==3)view()}catch(e){}},
 trainPhase(){ // 0..1 = a vonat távolsága az otthonától (0 itthon, 1 eltűnt); loaded: tele van-e
  const w=S.tw,t=now();if(!w||t>=w.t1)return{f:0,loaded:false,away:false,p:1};
  const p=(t-w.t0)/Math.max(1,w.t1-w.t0),e=u=>u*u*(3-2*u);
  if(p<.4)return{f:e(p/.4),loaded:true,away:true,p};if(p<.6)return{f:1,loaded:false,away:true,p};return{f:e(1-(p-.6)/.4),loaded:false,away:true,p}},
 holdCard(){const u=DEP.used(),c=cap(),cz=sum(S.cq),b=base(),has=sum(S.cg)>1e-6||sum(S.fin)>0;
  return`<div class="card">📦 <b>A gép raktára</b><div class="mu">Foglalt hely: <span id="dtUse">${fk(u)} / ${fk(c)}</span>${cz>0?` · tömörítve: ${fk(cz)} (−${Math.round((1-CVAL)*100)}% érték)`:''}</div>${W.DUI&&tab==3?DUI.rows():`<div class="bar"><i style="width:${Math.min(100,u/c*100)}%"></i></div>`}
  <div class="row"><button class="b" ${b&&S.st==='idle'&&has?'':'disabled'} onclick="DEP.${DEP.job?'stop':'start'}()">${DEP.job?'■ Megállít':'⬇ Kirakodás'}</button><button class="b g" style="flex:.6" ${S.st==='idle'&&sum(S.cg)>sum(S.cq)+1e-6?'':'disabled'} onclick="DEP.compress()">🗜 Tömörítés</button></div>${b?'':'<div class="mu">Kirakodás csak a bázison. Tömöríteni bárhol lehet, álló gépnél.</div>'}</div>`},
 html(){
  DEP.age();const b=base(),sk=DEP.stock(),cs=val('s'),away=DEP.trainAway(),p=DEP.plan();let rows='',tot=0;
  for(const n in S.dp){const kg=S.dp[n];if(kg<=0)continue;const bb=bp(n);if(bb==null)continue;const q=DEP.q(n),u=price(n,bb)*q;tot+=kg*u;rows+=`<tr><td>${W.DUI?'<i class="dtc" style="background:hsl('+[...n].reduce((h,c)=>(h*31+c.charCodeAt(0))%360,0)+',55%,52%)"></i>':''}${n}</td><td>${fk(kg)}</td><td>${Math.round(q*100)}%</td><td>${ft(u)}/kg</td><td>${ft(kg*u)}</td></tr>`}
  for(const n in S.dpf){const f=FD.find(x=>x[0]==n),c=S.dpf[n];if(!f)continue;tot+=c*f[5];rows+=`<tr><td>${n} ×${c}</td><td>${fk(c*f[4])}</td><td>–</td><td>${ft(f[5])}/db</td><td>${ft(c*f[5])}</td></tr>`}
  const w=S.tw,left=away?Math.max(0,Math.ceil((w.t1-now())/1e3)):0;
  let h=`<h3>Depó</h3>${W.DUI?DUI.tanks():DEP.flow(b,sk,cs,away,left)}<canvas id="dpc" style="width:100%;height:236px;display:block;border-radius:12px;background:#10161e;touch-action:manipulation"></canvas>${W.DX?DX.strip():''}`;
  h+=`<div class="stp">① Kirakodás a gépből</div>`+DEP.holdCard();
  h+=`<div class="stp">② Depó készlet</div><div class="card">🏗 <b>Raktártelep</b><div class="mu" id="dpj">${DEP.job?'Kirakodás folyamatban…':'Kirakodás: '+nf(val('b'))+' kg/s'}</div><div class="mu">Készlet: ${fk(sk)} / ${fk(cs)}</div>
  ${rows?`<table>${rows}</table>`:'<div class="mu">A depó üres. Ürítsd ki a gépet!</div>'}<div class="mu">A tárolt anyag minősége napi ${DECAY*100}%-ot romlik (legfeljebb ${Math.round((1-QMIN)*100)}%-ig). Az árak naponta ±15%-ot ingadoznak; a leleteket múzeum veszi meg.</div></div>`;
  h+=`<div class="stp">③ Eladás vonattal</div><div class="card">🚂 <b>Tehervonat</b><div class="mu" id="dpt">${away?'Úton… visszaér: '+left+' mp':'Várakozik a depónál'} · ${nf(val('v'))} kg/út · ${val('m')} mp/kör</div>${tot>p.cash+1?`<div class="mu">A vonat a legdrágább anyagot viszi előre; a maradék ${ft(tot-p.cash)} értékű készlet a következő útra vár.</div>`:''}<div class="mu">A pénz a vonat indulásakor megérkezik. Úton lévő vonat mellett is bányászhatsz.</div></div>`;

  if(!b)h+='<div class="card bad">Kirakodás, eladás és fejlesztés csak a bázison lehetséges. Térj vissza a 🏠 gombbal.</div>';
  return h+DEP.bar()},
 // állapotsor: hol tart a folyamat
 flow(b,sk,cs,away,left){const g=sum(S.cg)+0,pct=Math.round(sk/cs*100);return`<div class="dpFlow"><span>📦 gép <b>${fk(g)}</b></span><span>➜</span><span>🏗 depó <b>${fk(sk)}</b> <i class="mu">${pct}%</i></span><span>➜</span><span>🚂 ${away?'úton <b>'+left+' mp</b>':'otthon'}</span></div>`},
 // ---------- rajz: a depó nézet vászna ----------
 paint(dt){
  const cv=$('#dpc');if(!cv||!cv.getContext)return;const w=cv.clientWidth|0,h=cv.clientHeight|0;if(w<20||h<20)return;
  const d=W.Gov&&W.Gov.dpr?W.Gov.dpr(W.devicePixelRatio||1):Math.min(W.devicePixelRatio||1,1.5);if(cv.width!==(w*d|0)){cv.width=w*d|0;cv.height=h*d|0}
  const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);
  const t=DEP.tt=(DEP.tt||0)+(dt||.016),lowq=W.Gov&&W.Gov.q===0,job=!!DEP.job;
  // ég: lassú napszak-váltás, nap/hold, felhők, madarak
  const dayP=(t/90)%1,sun=Math.sin(dayP*Math.PI*2),dk=Math.max(0,Math.min(1,.5-sun*.7));
  const mixc=(a,b,u)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*u)).join(',')+')';
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,mixc([38,92,150],[8,14,34],dk));g.addColorStop(1,mixc([150,196,222],[44,50,84],dk));x.fillStyle=g;x.fillRect(0,0,w,h);
  const ang=dayP*Math.PI*2,cx=w*.5+Math.cos(ang+Math.PI)*w*.42,cy=h*.62-Math.sin(ang)*h*.5;
  if(sun>-.15){x.fillStyle='rgba(255,224,140,.25)';x.beginPath();x.arc(cx,cy,16,0,7);x.fill();x.fillStyle='#ffe08a';x.beginPath();x.arc(cx,cy,8,0,7);x.fill()}
  if(dk>.3){x.fillStyle='rgba(255,255,255,'+(dk*.8)+')';for(let i=0;i<14;i++)x.fillRect((i*97.3)%w,(i*41.7)%(h*.5),1.5,1.5)}
  x.fillStyle='rgba(255,255,255,'+(.55-dk*.35)+')';
  for(let i=0;i<4;i++){const px=((t*(5+i*2)+i*w*.3)%(w+120))-60,py=h*.1+i*h*.07;for(const[ex,ey,er,eh]of[[0,0,26,7],[14,-4,16,7],[-14,-2,14,6]]){x.beginPath();x.ellipse(px+ex,py+ey,er,eh,0,0,7);x.fill()}}
  if(!lowq&&dk<.6){x.strokeStyle='rgba(20,20,30,.6)';x.lineWidth=1.2;for(let i=0;i<2;i++){const bx=((t*22+i*70)%(w+80))-40,by=h*.2+Math.sin(t*2+i)*6,fl=Math.sin(t*14+i*2)*3;x.beginPath();x.moveTo(bx-6,by+fl);x.quadraticCurveTo(bx-3,by-3,bx,by);x.quadraticCurveTo(bx+3,by-3,bx+6,by+fl);x.stroke()}}
  // dombok (parallax)
  const gy=h*.78;for(const[c,a,s,k]of[['#2d4a58',.4,.006,1],['#2f5a3a',.25,.011,2]]){x.fillStyle=mixc(c==='#2d4a58'?[45,74,88]:[47,90,58],[10,16,26],dk*.8);x.beginPath();x.moveTo(0,gy);for(let i=0;i<=w;i+=12)x.lineTo(i,gy-h*(a*.3+.06*Math.sin(i*s*k+k*2)+.03*Math.sin(i*s*3.1)));x.lineTo(w,gy);x.fill()}
  x.fillStyle=mixc([61,107,52],[16,30,24],dk*.8);x.fillRect(0,gy,w,h-gy);x.fillStyle=mixc([42,74,36],[10,20,16],dk*.8);x.fillRect(0,gy,w,4);
  // gép-garat a bal oldalon + a kirakodó gép
  const bx=w*.04,bw=w*.18,bh=h*.34,by=gy-bh,used=Math.min(1,DEP.used()/cap());
  x.fillStyle='#575b63';x.fillRect(bx,by,bw,bh);x.fillStyle='#3b3d42';x.fillRect(bx,by,bw,8);x.fillStyle='#6a6e77';for(let i=1;i<4;i++)x.fillRect(bx+i*bw/4-1,by+8,2,bh-8);
  x.fillStyle='#8a6a3a';const fh=(bh-14)*used;x.fillRect(bx+4,by+10+(bh-14)-fh,bw-8,fh);
  x.fillStyle='rgba(255,236,160,'+(.25+dk*.5)+')';x.fillRect(bx+bw*.15,by+bh*.28,bw*.2,6);x.fillStyle='#e8ecf5';x.font='11px sans-serif';x.fillText('Gép',bx+6,by-5);
  // szalag + vödrök + por
  const x0=bx+bw,y0=gy-h*.06,x1=w*.52,y1=gy-h*.34;x.save();x.strokeStyle='#26282c';x.lineWidth=11;x.lineCap='round';x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();
  x.strokeStyle='#4a4d54';x.lineWidth=7;x.setLineDash([6,6]);x.lineDashOffset=-DEP.ph*40;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();x.setLineDash([]);
  x.fillStyle='#1c1d20';const L=Math.hypot(x1-x0,y1-y0),an=Math.atan2(y1-y0,x1-x0);for(let i=0;i<5;i++){const u=i/4;x.save();x.translate(x0+(x1-x0)*u,y0+(y1-y0)*u+6);x.rotate(an);x.fillRect(-2,0,4,gy-(y0+(y1-y0)*u)-4);x.restore()}
  if(job){x.fillStyle='#8a6a3a';for(let i=0;i<9;i++){const u=((i/9)+DEP.ph*.25)%1;x.beginPath();x.arc(x0+(x1-x0)*u,y0+(y1-y0)*u-7-Math.sin(u*9+t*6)*.8,3+(i%3),0,7);x.fill()}
   if(!lowq){x.fillStyle='rgba(150,120,80,.35)';for(let i=0;i<7;i++){const u=((t*.9+i*.14)%1);x.beginPath();x.arc(x1-4+Math.sin(i*3+t*3)*8,y1+4+u*(gy-y1-h*.22),2+u*5,0,7);x.fill()}}}
  x.restore();
  // siló
  const sx=w*.52,sw=w*.2,sy=gy-h*.5,sh=h*.5,fill=Math.min(1,DEP.stock()/val('s'));
  const sg=x.createLinearGradient(sx,0,sx+sw,0);sg.addColorStop(0,'#868b95');sg.addColorStop(.5,'#6b6f78');sg.addColorStop(1,'#4c5058');x.fillStyle=sg;x.fillRect(sx,sy,sw,sh);
  x.fillStyle='rgba(0,0,0,.18)';for(let i=1;i<5;i++)x.fillRect(sx,sy+i*sh/5,sw,1.5);
  x.fillStyle='#8a6a3a';x.fillRect(sx+4,sy+sh-4-(sh-8)*fill,sw-8,(sh-8)*fill);x.fillStyle='rgba(255,255,255,.14)';x.fillRect(sx+6,sy+sh-4-(sh-8)*fill,3,(sh-8)*fill);
  x.fillStyle='#4a4d54';x.beginPath();x.moveTo(sx-4,sy);x.lineTo(sx+sw/2,sy-16);x.lineTo(sx+sw+4,sy);x.fill();
  x.fillStyle=dk>.3?'#ffd66b':'#9fb4c8';x.fillRect(sx+sw*.42,sy+sh*.12,sw*.16,7);
  x.fillStyle='#d33';x.beginPath();x.arc(sx+sw/2,sy-20,2.2+(job?Math.abs(Math.sin(t*6)):Math.abs(Math.sin(t*2)))*1.2,0,7);x.fill();
  x.fillStyle='#e8ecf5';x.fillText('Depó',sx+6,sy-26);
  // sín + vonat
  const ry=gy+(h-gy)*.45;x.fillStyle='#2b2b2e';x.fillRect(0,ry,w,3);x.fillStyle='#5a4630';const T=DEP.trainPhase(),N=3+lv('v'),wl=Math.min(34,(w*.7)/(N+1)),home=sx+sw*.1+N*wl+wl*1.2,pos=home+T.f*(w-home+N*wl+wl*2),mv=T.f>0&&T.f<1;
  for(let q=(-(mv?pos:0)%14);q<w;q+=14)x.fillRect(q,ry-2,5,7);
  for(let i=0;i<=N;i++){const lx=pos-wl*1.3-i*(wl+2);if(lx>w||lx+wl<0)continue;const bw2=i===0?wl*1.3:wl;
   x.fillStyle=i===0?'#9a2b24':'#44484f';x.fillRect(lx,ry-wl*.55,bw2,wl*.5);x.fillStyle='rgba(255,255,255,.15)';x.fillRect(lx,ry-wl*.55,bw2,3);
   if(i>0&&T.loaded){x.fillStyle='#8a6a3a';x.beginPath();x.moveTo(lx+2,ry-wl*.55);x.quadraticCurveTo(lx+bw2/2,ry-wl*.8,lx+bw2-2,ry-wl*.55);x.fill()}
   x.fillStyle='#16171a';for(const wx of[lx+7,lx+bw2-7]){x.beginPath();x.arc(wx,ry,4,0,7);x.fill();x.strokeStyle='#888';x.lineWidth=1;x.beginPath();const a=(mv?pos:0)*.3;x.moveTo(wx,ry);x.lineTo(wx+Math.cos(a)*3.5,ry+Math.sin(a)*3.5);x.stroke()}}
  x.fillStyle='#9a2b24';x.fillRect(pos-wl*1.3,ry-wl*.55,wl*1.3,wl*.5);x.fillStyle='#2a2b30';x.fillRect(pos-wl*.35,ry-wl*.85,wl*.22,wl*.3);x.fillStyle='#ffe9a0';x.fillRect(pos-4,ry-wl*.4,4,5);
  if(mv){x.fillStyle='rgba(255,236,160,.12)';x.beginPath();x.moveTo(pos,ry-wl*.38);x.lineTo(pos+60,ry-wl*.9);x.lineTo(pos+60,ry+wl*.2);x.fill()}
  // gőz a mozdony kéményéből (állva is pöfög, menet közben erősebben)
  if(!lowq){for(let i=0;i<6;i++){const u=((t*(mv?1.1:.45)+i/6)%1),px=pos-wl*.24-u*(mv?44:8),py=ry-wl*.88-u*h*.2;x.fillStyle='rgba(235,235,240,'+(.5*(1-u))+')';x.beginPath();x.arc(px,py,3+u*7,0,7);x.fill()}}
 },
 sync(dt){DEP.ph+=dt*(DEP.job?1:0);DEP.step(dt);
  if(DEP.job){DEP.tk-=dt;if(DEP.tk<=0){DEP.tk=.38;if(W.clank)clank(.1)}}
  DEP.uiT-=dt;if(DEP.uiT<=0){DEP.uiT=.25;const a=$('#dpj'),t=$('#dpt');
   {const sb=$('#dpAct');if(sb){const x=DEP.act();if(sb.disabled!==!!x.dis)sb.disabled=!!x.dis;if(sb.textContent!==x.t)sb.textContent=x.t;if(DEP._k!==x.k){DEP._k=x.k;DEP.refresh()}}}
   if(a&&DEP.job)a.textContent='Kirakodás: '+fk(sum(S.cg))+' maradt · '+fk(DEP.stock())+' / '+fk(val('s'));
   if(t){const aw=DEP.trainAway();t.textContent=(aw?'Úton… visszaér: '+Math.max(0,Math.ceil((S.tw.t1-now())/1e3))+' mp':'Várakozik a depónál')+' · '+nf(val('v'))+' kg/út · '+val('m')+' mp/kör';
    if(!aw&&DEP.wasAway){DEP.wasAway=false;DEP.refresh()}if(aw)DEP.wasAway=true}}
  if(typeof tab!=='undefined'&&tab==3)DEP.paint(dt)}};
DEP.val=val;DEP.lv=lv;DEP.bp=bp;W.DEP=DEP;
// régi mentések (4→5 után): a depó mezői, a rakomány-korlát alapból be
if(W.Save)Save.addMig(5,o=>{o.dp=o.dp||{};o.dq=o.dq||{};o.dpf=o.dpf||{};o.cq=o.cq||{};o.bd=o.bd||{s:0,b:0,v:0,m:0};if(o.tw===undefined)o.tw=null;o.dT=o.dT||0});
if(W.on){
 on('frame',dt=>DEP.sync(dt));
 on('tick',()=>{DEP.clampCq();DEP.age()});
 // a felszíni jelenetben: raktár-épület, sín és a vonat (csak díszlet, a játékmenetet nem terheli)
 on('world.back',V=>{const Ys=V.Ys;if(Ys<-60||Ys>V.h+80)return;const K=V.K,x=V.x,X=V.SX;
  const N=3+lv('v'),wl=3.4,home=30+(N+1)*wl,T=DEP.trainPhase(),pos=home+T.f*620;
  // sín
  const a=Math.max(-20,X(10)),b=Math.min(V.w+20,X(700));if(b>a){x.fillStyle='#2b2b2e';x.fillRect(a,Ys-4,b-a,3);x.fillStyle='#5a4630';for(let m=Math.ceil((V.rx+(a-V.cx)/K)/1.6)*1.6;X(m)<b;m+=1.6)x.fillRect(X(m),Ys-5,4,6)}
  // depó-épület
  const dx=X(22);if(dx>-200&&dx<V.w+60){x.fillStyle='#6b6f78';x.fillRect(dx,Ys-58,110,54);x.fillStyle='#4a4d54';x.beginPath();x.moveTo(dx-6,Ys-58);x.lineTo(dx+55,Ys-74);x.lineTo(dx+116,Ys-58);x.fill();x.fillStyle='#8a6a3a';const f=Math.min(1,DEP.stock()/val('s'));x.fillRect(dx+8,Ys-12-40*f,94,40*f+8)}
  // vonat
  const px=X(pos);if(px>-wl*K*(N+3)&&px<V.w+40){for(let i=0;i<=N;i++){const lx=px-(1.3+i*(wl+.15))*K,ww=(i===0?1.3*wl:wl)*K;if(lx>V.w||lx+ww<0)continue;x.fillStyle=i===0?'#9a2b24':'#44484f';x.fillRect(lx,Ys-26,ww,18);if(i>0&&T.loaded){x.fillStyle='#8a6a3a';x.fillRect(lx+2,Ys-30,ww-4,5)}x.fillStyle='#16171a';x.fillRect(lx+4,Ys-8,7,7);x.fillRect(lx+ww-11,Ys-8,7,7)}x.fillStyle='#9a2b24';x.fillRect(px-1.3*wl*K,Ys-26,1.3*wl*K,18);x.fillStyle='#ffe9a0';x.fillRect(px-5,Ys-20,5,6)}});
}
})(typeof window!=='undefined'?window:globalThis);
