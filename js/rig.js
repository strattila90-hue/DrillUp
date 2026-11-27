/* DrillUp – SG-3: orosz (szovjet) felszíni mélyfúró állomás a Kola-szupermély fúrás mintájára.
   Szakaszos fúrás: egy szakasz = egy gyertya (1–3 cső × 12 m). A szakasz végén új csövet kell felcsavarni a raktárból;
   a csöveket meg kell venni. Az új cső mindig a csőszál TETEJÉRE kerül (a felszínen csavarják rá), így a legrégebbi cső van legmélyen.
   Fizika (egyszerűsített, valós arányokkal):
   - csőszál-súly iszapban: m·(1 − ρiszap/ρcső) (felhajtóerő); a felső cső viseli az alatta lógó egész szálat + a fúró-szerelvényt (BHA) − a fúrófejre adott terhelést (WOB)
   - csőszilárdság a hőmérséklettel csökken (az alumínium 110 °C fölött gyorsan gyengül), a fáradás tovább gyengít
   - horogterhelés ≤ a torony teherbírása; WOB > 0,85·BHA → kihajlás (gyorsabb fáradás)
   - turbinás fúrás: a fúrófejet a lent lévő iszapturbina forgatja (fordulat ~ iszapáram); kevés iszap → furadék gyűlik → beragadás
   - hőmérséklet: T ≈ 8 + 10·z + 0,36·z² °C (z km) – Kolán 12 km-en ~180 °C volt a várt 100 °C helyett
   S.rg = {lv,d,p,inv:{a,s,t},sel,bw,fa,cu,wob,q,auto,best,core,lost,ms} – p: csőtípusok betűi felülről lefelé. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('rig');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
const L=12,MUD=1.25,WX=56;
// csőtípus: név, rövid név, tömeg 12 m-en (kg, levegőben), anyagsűrűség (g/cm³), folyáshatár-terhelés (t), ár (Ft/db), szín, [T0,T1,szorzó T1-nél]
const PT={
 a:{n:'ЛБТ alumínium (D16T)',sh:'Alu',kg:192,rho:2.78,F:150,c:1.4e4,col:'#7fd0ff',dk:'#3b86c4',hot:[110,250,.45]},
 s:{n:'Acél (G-105)',sh:'Acél',kg:348,rho:7.85,F:260,c:9e3,col:'#b8c0ca',dk:'#5d6670',hot:[200,350,.8]},
 t:{n:'Titán (Ti-6Al-4V)',sh:'Titán',kg:216,rho:4.43,F:320,c:9e4,col:'#d7a6ff',dk:'#8a52c9',hot:[300,450,.75]}};
// torony: név, horog-teherbírás (t), szivattyú max (l/s), BHA (t), cső/gyertya, alap-ROP (m/s, játékidő), tervezett mélység (m), ár (Ft)
const RIGS=[
 ['БУ-75',90,30,10,1,1.0,3000,8e5],
 ['БУ-2500',160,38,14,2,1.25,5000,1e7],
 ['БУ-5000',250,46,18,2,1.5,8000,1.2e8],
 ['Уралмаш-4Э',300,56,22,3,1.8,10000,1e9],
 ['Уралмаш-15000',400,66,26,3,2.1,15000,8e9]];
// földtani zónák (Kola, egyszerűsítve): felső, alsó (m), név, keménység, szín
const GZ=[
 [0,1500,'Pecsengai sorozat: fillit, tufa, homokkő',1.0,'#d9954e'],
 [1500,2800,'Réz-nikkel ércöv (pentlandit, kalkopirit)',1.25,'#2fbf96'],
 [2800,4900,'Metabazalt és diabáz láva',1.5,'#5b78f0'],
 [4900,6840,'Tufitok és metaüledékek',1.35,'#c862c0'],
 [6840,9000,'Archaikum: gránit-gneisz',1.85,'#ef5b5b'],
 [9000,12262,'Gneisz és amfibolit (forró, képlékeny)',2.05,'#ff9a2e'],
 [12262,15000,'Ismeretlen mélység – a Kola-rekord alatt',2.3,'#ffd84a']];
// tudományos mérföldkövek (a Kola SG-3 fúrás eredményei alapján; a mélységek kerekítettek)
const MS=[
 [1600,'⛏ Réz-nikkel érc: a Kola-fúrás 1,6–1,8 km-en ipari vastagságú ércet harántolt.'],
 [3000,'🧭 A fúrólyuk elhajlik: a kemény és puha rétegek váltakozása oldalra tereli a fúrófejet.'],
 [4500,'💧 Szabad víz a kőzetben: az ásványok kristályvizéből kipréselt víz kering a repedésekben.'],
 [6700,'🦠 Mikrofosszíliák: 6,7 km-en 24 egysejtű plankton-faj megkövesedett maradványa, szén- és nitrogénburokban.'],
 [6840,'🪨 Nincs bazalt! A szeizmikus „Conrad-határ” itt nem gránit–bazalt váltás, hanem víztől repedezett metamorf gránit.'],
 [7600,'🏗 Az Uralmas-4E határa: az eredeti berendezés kb. 7,6 km-ig jutott, a folytatáshoz Uralmas-15000 kellett.'],
 [9500,'✨ Arany nyomai: 9,5–10,5 km között kis koncentrációban aranyat mutattak ki a magmintákban.'],
 [10000,'🫧 Hidrogén: az iszap „forrt” a kőzetből felszabaduló hidrogéntől.'],
 [12000,'🌡 180 °C a várt 100 °C helyett: a kőzet képlékennyé vált, a lyuk fala befolyt.'],
 [12262,'🏆 Kola-rekord: 12 262 m (1989) – a valaha fúrt legmélyebb lyuk. Átmérő a talpon kb. 23 cm.'],
 [15000,'🚀 Az Uralmas-15000 tervezett mélysége: 15 km. Ezt a valóságban senki nem érte el.']];
// fúrófej-típusok: ár (Ft × toronyszint), sebesség- és kopásszorzó a kőzet keménysége (h) szerint
const BITS={
 t:{n:'Háromgörgős marófogas',sh:'Háromgörgős',c:2e4,r:h=>1,w:h=>1,hot:1},
 d:{n:'PDC gyémánt',sh:'PDC',c:6e4,r:h=>h<1.5?1.55:.9,w:h=>h<1.5?.55:1.8,hot:1.6}};
const temp=d=>{const z=d/1e3;return 8+10*z+.36*z*z};
const zone=d=>{for(const z of GZ)if(d<z[1])return z;return GZ[GZ.length-1]};
const hotF=(k,T)=>{const h=PT[k].hot;return T<=h[0]?1:T>=h[1]?h[2]:lerp(1,h[2],(T-h[0])/(h[1]-h[0]))};
const wB=k=>PT[k].kg*(1-MUD/PT[k].rho)/1e3; // t, iszapban
const coreVal=d=>Math.round(2e3*Math.pow(1+d/1e3,2.2));

const RIG={PT,RIGS,GZ,MS,BITS,L,temp,zone,hotF,hist:[],ht:0,isOpen:false,ph:'idle',mk:0,trip:0,tripD:0,shake:0,flash:0,fall:null,zt:0,zAuto:1,rop:0,lastMsg:'',
 st(){const g=S.rg=(S.rg&&typeof S.rg==='object')?S.rg:{};const n=(k,a,b,d)=>{g[k]=(typeof g[k]==='number'&&isFinite(g[k]))?cl(g[k],a,b):d};
  n('lv',0,RIGS.length,0);g.lv|=0;g.p=typeof g.p==='string'?g.p.replace(/[^ast]/g,'').slice(0,1400):'';n('d',0,g.p.length*L,0);
  g.inv=(g.inv&&typeof g.inv==='object')?g.inv:{};for(const k in PT)g.inv[k]=Math.floor(cl(+g.inv[k]||0,0,1e5));
  if(!PT[g.sel])g.sel='a';n('bw',0,100,0);n('fa',0,1,0);n('cu',0,1,0);n('wob',2,30,6);n('q',10,70,25);g.auto=g.auto?1:0;
  if(!BITS[g.bt])g.bt='t';if(!BITS[g.bi])g.bi='t';g.cs=typeof g.cs==='string'?g.cs.replace(/[^0-6]/g,'').slice(-16):'';n('best',0,2e4,0);n('core',0,1e6,0);n('lost',0,1e6,0);n('ms',0,MS.length,0);g.ms|=0;return g},
 rig(){const g=RIG.st();return RIGS[Math.max(0,g.lv-1)]},
 bha(){return RIG.rig()[3]*(1-MUD/7.85)},
 // terhelés: op = túlhúzás (t), bottom = a fúrófej a talpon (WOB levonódik)
 load(op=0,bottom){const g=RIG.st(),p=g.p,n=p.length;let below=RIG.bha()-(bottom?g.wob:0)+op,mu=0,mi=-1;
  for(let i=n-1;i>=0;i--){const k=p[i];below+=wB(k);const s=PT[k].F*hotF(k,temp(Math.max(0,g.d-(n-i)*L+L/2)))*(1-.35*g.fa),u=below/s;if(u>mu){mu=u;mi=i}}
  return{hook:Math.max(0,below),mu,mi}},
 need(){const g=RIG.st();return 12+g.wob*.9+g.d/1e3*1.6},
 rpm(){return RIG.st().q*9},
 // ---- műveletek
 msg(t){RIG.lastMsg=t;try{msg(t,1)}catch(e){}if(!RIG.isOpen)try{toast(t)}catch(e){}},
 build(){const g=RIG.st();if(g.lv>=RIGS.length)return false;const c=RIGS[g.lv][7];if(S.cash<c){RIG.msg('Nincs elég pénz ('+nf(c,0)+' Ft).');return false}
  S.cash-=c;g.lv++;RIG.msg(g.lv===1?'🗼 Felépült az SG-3 fúróállomás ('+RIGS[0][0]+').':'⬆ Új torony: '+RIGS[g.lv-1][0]+' – horog '+RIGS[g.lv-1][1]+' t, '+RIGS[g.lv-1][4]+' cső/gyertya.');RIG.beep(660,.15);RIG.save();return true},
 buy(k,n){const g=RIG.st();if(!PT[k]||!(n>0))return false;const c=PT[k].c*n;if(S.cash<c){RIG.msg('Nincs elég pénz ('+nf(c,0)+' Ft).');return false}S.cash-=c;g.inv[k]+=n;RIG.beep(520,.05);RIG.save();return true},
 canAdd(){const g=RIG.st(),R=RIG.rig(),k=g.sel,m=R[4];if(!g.lv)return'Előbb építsd fel a fúróállomást.';
  if(RIG.ph==='trip'||RIG.mk>0)return'Várj, a művelet folyamatban.';
  if(g.d<g.p.length*L-1e-6)return'A szakasz még nincs kifúrva.';
  if((g.p.length+m)*L>R[6]+1e-6)return'A '+R[0]+' legfeljebb '+nf(R[6],0)+' m-re tervezett – fejleszd a tornyot.';
  if(g.inv[k]<m)return'Kevés cső: '+m+' db '+PT[k].sh+' kell ('+g.inv[k]+' van). Vegyél a raktárba.';
  const p0=g.p;g.p=k.repeat(m)+p0;const ld=RIG.load(0,false);g.p=p0;
  if(ld.hook>R[1])return'A torony nem bírja: horogterhelés '+nf(ld.hook,0)+' t > '+R[1]+' t. Könnyebb cső vagy erősebb torony kell.';
  if(ld.mu>.97)return'A csőszál túlterhelődne ('+Math.round(ld.mu*100)+'%) – könnyebb vagy erősebb cső kell.';
  return''},
 add(){const why=RIG.canAdd();if(why){RIG.msg('🔩 '+why);return false}const g=RIG.st(),m=RIG.rig()[4];g.inv[g.sel]-=m;g.p=g.sel.repeat(m)+g.p;RIG.mk=1.2;RIG.beep(300,.08);RIG.save();return true},
 toggle(){const g=RIG.st();if(!g.lv)return;if(RIG.ph==='drill'){RIG.ph='idle';return}
  if(RIG.ph==='trip'||RIG.mk>0)return;if(g.bw>=100)return RIG.msg('🪨 A fúrófej elkopott – emeld ki a szálat és cseréld (⏫).');
  if(g.d>=g.p.length*L-1e-6){if(g.auto){if(RIG.add())RIG.resume=1;return}return RIG.msg(g.p.length?'🔩 A szakasz kész – csavarj fel új csövet.':'🔩 Az első csövet kell felcsavarni a fúrófejjel.')}
  RIG.ph='drill';if(RIG.zAuto)RIG.zt=Math.max(RIG.zt,.001);RIG.beep(180,.1)},
 startTrip(){const g=RIG.st();if(!g.lv||RIG.ph==='trip'||RIG.mk>0||!g.p.length)return;const c=BITS[g.bt].c*g.lv;if(S.cash<c)return RIG.msg('Nincs elég pénz az új fúrófejre ('+nf(c,0)+' Ft).');S.cash-=c;RIG.tripBit=g.bt;RIG.tripCost=c;RIG.ph='trip';RIG.rop=0;RIG.trip=0;RIG.tripD=g.d;RIG.msg('⏫ Kiemelés: '+nf(g.p.length,0)+' cső jön fel, majd új fúrófejjel vissza.')},
 brk(i,why){const g=RIG.st(),n=g.p.length;i=cl(i,0,n-1);const fallen=n-i,at=Math.max(0,g.d-fallen*L),lostN=Math.max(1,Math.ceil(fallen*.4)),rec=fallen-lostN;
  // halászat: a leszakadt szál felső része kijön (a raktárba kerül), az alsó rész a talpon marad; fölötte oldalfúrás indul
  for(const k of g.p.slice(i,i+rec))g.inv[k]++;RIG.fall={y:Math.max(0,g.d-lostN*L),len:lostN*L,t:0,k:g.p[n-1]};g.p=g.p.slice(0,i);g.d=Math.max(0,g.d-lostN*L);g.lost+=lostN;g.fa*=.6;g.cu=0;g.bw=Math.min(g.bw,60);
  RIG.ph='idle';RIG.resume=0;RIG.shake=1;RIG.flash=1;RIG.beep(90,.4,'sawtooth');try{if(W.NAT&&NAT.vib)NAT.vib(300)}catch(e){}
  RIG.msg('💥 Csőtörés '+nf(at,0)+' m-en ('+why+'): halászattal '+rec+' cső kijött, '+lostN+' a talpon maradt. Oldalfúrás '+nf(g.d,0)+' m-ről – csavarj fel csövet és fúrj újra.');RIG.save()},
 // ---- szimuláció (dt: valós másodperc)
 step(dt){const g=RIG.st();if(!g.lv)return;dt=Math.min(dt,.1);RIG.ht+=dt;if(RIG.ht>=1){RIG.ht=0;RIG.hist.push(g.d);if(RIG.hist.length>90)RIG.hist.shift()}
  RIG.shake=Math.max(0,RIG.shake-dt*2);RIG.flash=Math.max(0,RIG.flash-dt*1.5);if(RIG.fall){RIG.fall.t+=dt;if(RIG.fall.t>3)RIG.fall=null}
  RIG.zt=cl(RIG.zt+((RIG.zAuto&&(RIG.ph==='drill'||RIG.mk>0)||RIG.zMan)?1:-1)*dt*.7,0,1);
  if(RIG.mk>0){RIG.mk-=dt;if(RIG.mk<=0){RIG.mk=0;if(RIG.resume){RIG.resume=0;RIG.ph='idle';RIG.toggle()}}return}
  if(RIG.ph==='trip'){const sp=500;RIG.trip+=dt*sp/Math.max(1,RIG.tripD*2+40);if(RIG.trip>=1){RIG.trip=0;RIG.ph='idle';g.bw=0;g.fa*=.4;g.cu=0;const c=RIG.tripCost||0;g.bi=BITS[RIG.tripBit]?RIG.tripBit:g.bi;RIG.tripBit=null;RIG.tripCost=0;RIG.msg('🔁 Új fúrófej a talpon: '+BITS[g.bi].n+' (−'+nf(c,0)+' Ft). A csöveket átvizsgálták: a fáradás csökkent.');RIG.save()}return}
  if(RIG.ph!=='drill'){RIG.rop=0;g.cu=Math.max(0,g.cu-dt*.1);return}
  const R=RIG.rig(),Z=zone(g.d),T=temp(g.d),rpm=RIG.rpm(),need=RIG.need(),end=g.p.length*L;
  if(g.d>=end-1e-6){RIG.ph='idle';RIG.rop=0;const why=g.auto?RIG.canAdd():'';if(g.auto&&!why){RIG.add();RIG.resume=1}else RIG.msg(why?'🔩 '+why:'🔩 Szakasz kész ('+nf(g.d,0)+' m) – csavarj fel új csövet.');return}
  g.cu=g.q<need?cl(g.cu+(need-g.q)/need*dt*.22,0,1):Math.max(0,g.cu-dt*.15);
  const buck=g.wob>.85*RIG.bha();
  const B=BITS[g.bi];g.bw=Math.min(100,g.bw+dt*.32*Z[3]*(g.wob/12)*(rpm/300)*B.w(Z[3])*(1+Math.max(0,T-150)/60*B.hot));
  g.fa=Math.min(1,g.fa+dt*.0008*(g.wob/12)*(rpm/300)*(buck?4:1));
  RIG.rop=R[5]*Math.pow(g.wob/10,.9)*Math.pow(rpm/300,.55)/Z[3]*B.r(Z[3])*(1-.75*g.bw/100)*(g.cu>.6?.5:1);
  const d0=g.d;g.d=Math.min(end,g.d+RIG.rop*dt);
  // magminta 100 m-enként, mérföldkövek
  if(g.d>g.best&&Math.floor(g.d/100)>Math.floor(Math.max(d0,g.best)/100)){g.core++;g.cs=(g.cs+GZ.indexOf(zone(g.d))).slice(-16);const v=coreVal(g.d);S.cash+=v;RIG.lastMsg='🧪 Magminta '+nf(Math.floor(g.d/100)*100,0)+' m-ről: +'+nf(v,0)+' Ft'}
  if(g.d>g.best){if(Math.floor(g.d/1e3)>Math.floor(g.best/1e3)){const km=Math.floor(g.d/1e3),b=1e5*km*km;S.cash+=b;RIG.msg('🏁 Új rekord: '+km+' km! Akadémiai jutalom: +'+nf(b,0)+' Ft')}g.best=g.d}
  while(g.ms<MS.length&&g.d>=MS[g.ms][0]){const b=5e4*(g.ms+1)*(g.ms+1);S.cash+=b;RIG.msg(MS[g.ms][1]+' (+'+nf(b,0)+' Ft)');g.ms++}
  if(g.bw>=100){RIG.ph='idle';RIG.msg('🪨 A fúrófej elkopott – emeld ki a szálat és cseréld (⏫).');return}
  // terhelés, fáradás, beragadás
  const ld=RIG.load(0,true);
  if(ld.mu>1)return RIG.brk(ld.mi,'túlterhelés');
  if(ld.mu>.82&&Math.random()<dt*(ld.mu-.82)*2*(.5+g.fa))return RIG.brk(ld.mi,'fáradásos törés');
  if(g.cu>=1){const lo=RIG.load(35,false);if(lo.mu>1)return RIG.brk(lo.mi,'beragadás, kiszabadítás közben');g.cu=.35;RIG.ph='idle';RIG.msg('⚠ Beragadt a szál a furadéktól – 35 t túlhúzással kiszabadítva. Növeld az iszapáramot!')}},
 save(){try{save()}catch(e){}},
 beep(f,d,t){try{beep(f,d,.05,t||'triangle')}catch(e){}}};
W.RIG=RIG;

// ================= rajz: kis torony a felszíni bázison =================
RIG.hit=null;
RIG.world=function(V){if(typeof S==='undefined')return;const x=V.x,Y0=V.Ys;RIG.hit=null;if(!(Y0>-190&&Y0<V.h+260))return;const sx=V.SX(WX);if(sx<-120||sx>V.w+120)return;
 const g=RIG.st(),lv=g.lv,night=V.day<.55;
 x.fillStyle='#e9f1f7';x.fillRect(sx-40,Y0-3,120,3);
 if(!lv){x.strokeStyle='#ffb02e';x.lineWidth=2;x.setLineDash([5,4]);x.strokeRect(sx-26,Y0-60,64,57);x.setLineDash([]);
  x.fillStyle='rgba(16,18,24,.82)';x.fillRect(sx-38,Y0-84,96,20);x.fillStyle='#ffd66e';x.font='bold 8px Georgia';x.textAlign='center';x.fillText('SG-3 fúróállomás',sx+10,Y0-75);x.fillText('építhető · érintsd meg',sx+10,Y0-67);x.textAlign='left';
  RIG.hit={x:sx-40,y:Y0-90,w:110,h:90};return}
 const H=60+lv*14,bw=14+lv*2;
 // fűtött fúrócsarnok (sarkvidéki kivitel) + szivattyúház
 x.fillStyle='#c73a2c';x.fillRect(sx-30,Y0-26,60,23);x.fillStyle='#e8e2d6';x.fillRect(sx-30,Y0-28,60,3);x.fillStyle=night?'#ffe08a':'#7cc6e8';for(let i=0;i<4;i++)x.fillRect(sx-24+i*14,Y0-20,8,6);
 x.fillStyle='#3d6fa8';x.fillRect(sx+32,Y0-18,30,15);x.fillStyle='#e8e2d6';x.fillRect(sx+32,Y0-20,30,2);
 // rácsos torony piros-fehér sávokkal
 x.strokeStyle='#d8dde2';x.lineWidth=2;x.beginPath();x.moveTo(sx-bw,Y0-26);x.lineTo(sx-3,Y0-26-H);x.moveTo(sx+bw,Y0-26);x.lineTo(sx+3,Y0-26-H);x.stroke();
 x.lineWidth=1;x.strokeStyle='rgba(220,226,232,.8)';x.beginPath();for(let i=0;i<8;i++){const t0=i/8,t1=(i+1)/8,y0=Y0-26-H*t0,y1=Y0-26-H*t1,a0=lerp(bw,3,t0),a1=lerp(bw,3,t1);x.moveTo(sx-a0,y0);x.lineTo(sx+a1,y1);x.moveTo(sx+a0,y0);x.lineTo(sx-a1,y1)}x.stroke();
 for(let i=0;i<4;i++){const t=(i*2+1)/8,y=Y0-26-H*t,a=lerp(bw,3,t);x.fillStyle=i%2?'#f4f4f4':'#e2352a';x.fillRect(sx-a,y-2,a*2,4)}
 x.fillStyle='#d8392d';x.fillRect(sx-4,Y0-24,8,6);x.fillStyle='#b3261e';x.fillRect(sx-4,Y0-18,8,4);
 x.strokeStyle='rgba(30,32,36,.8)';x.lineWidth=.7;const tb=Y0-30-H*(RIG.ph==='drill'?.45+.2*Math.sin(V.ts/2000):.55);x.beginPath();x.moveTo(sx-2,Y0-28-H);x.lineTo(sx-2,tb);x.moveTo(sx+2,Y0-28-H);x.lineTo(sx+2,tb);x.stroke();x.fillStyle='#ffb02e';x.fillRect(sx-4,tb,8,6);
 x.fillStyle='rgba(120,120,130,.45)';for(let i=0;i<3;i++){const k=(V.ts/900+i/3)%1;x.beginPath();x.arc(sx+58+k*8,Y0-24-k*26,2+k*5,0,7);x.fill()}
 x.fillStyle='#555';x.fillRect(sx-6,Y0-30-H,12,5);x.fillStyle='#9aa3ad';x.beginPath();x.arc(sx-3,Y0-28-H,1.6,0,7);x.arc(sx+3,Y0-28-H,1.6,0,7);x.fill();x.fillStyle=Math.floor(V.ts/500)%2?'#ff3b30':'#7a1a14';x.beginPath();x.arc(sx,Y0-33-H,2.6,0,7);x.fill();
 if(night){V.lamp(sx,Y0-40,140,.8);V.GL.push({x:sx,y:Y0-33-H,r:26,c:'255,60,40',i:.5})}
 // felirat
 x.fillStyle='rgba(16,18,24,.82)';x.fillRect(sx-32,Y0-48-H,64,13);x.fillStyle='#ffe28a';x.font='bold 8px Georgia';x.textAlign='center';x.fillText('SG-3 · '+RIGS[lv-1][0],sx,Y0-39-H);x.textAlign='left';
 RIG.hit={x:sx-40,y:Y0-52-H,w:104,h:52+H}};

// ================= fedőréteg (állomás nézet) =================
let ov=null,cv=null,cx=null,raf=0,lt=0,dp=1,CW=0,CH=0,skyC=null,parts=[],uiKey='',hudT=0;
const $=id=>document.getElementById(id);
// tananyag: a fúrószál részei (felülről lefelé), a fúrófejek és a fúrómag – saját összefoglaló
const PARTS=[['#9aa3ad','Forgófej / felső hajtás','Ezen át jut a nagynyomású iszap a csőszálba; a felső hajtás forgatja és tartja a szálat.'],
 ['#d9dee4','Fúrócső (12 m)','Vékonyabb falú cső. A két végén menetes szerszámcsatlakozó van: kúpos „pin” és „box”, a kopás ellen keményhegesztéssel.'],
 ['#a77bf0','Nehéz fúrócső (HWDP)','Átmenet a könnyű fúrócső és a merev nehézrudak között – csökkenti a hajlítást és a fáradást.'],
 ['#3a4048','Ütőszerszám (jar)','Beragadáskor nagy rántással szabadítja ki a szálat.'],
 ['#1d2228','Nehézrudak (drill collar)','Vastag falú acélrudak: ezek adják a terhelést a fúrófejre, és feszesen tartják a fölöttük lógó csöveket.'],
 ['#c9ced6','Stabilizátor','Lapátjai a lyukfalhoz támaszkodnak, így a fúrás egyenes marad.'],
 ['#ff9a3a','Turbina (turbófúró)','Az iszapáram forgatja a fejet – Kolán így fúrtak: a csőszál nem forgott, csak a fej.'],
 ['#ffe14a','Átmenet / fejcsatlakozó','Eltérő menetű részeket köt össze; a fúrófej ebbe csavarodik.']];
function infoHTML(){return'<div class="rgIh"><b>📘 Fúrószál és fúrófejek</b><button class="rgX" id="rgInfoX" aria-label="Bezár">✕</button></div><div class="rgIb">'+
 '<h4>A fúrószál felépítése (felülről lefelé)</h4>'+PARTS.map(p=>`<div class="rgPt"><i style="background:${p[0]}"></i><div><b>${p[1]}</b><small>${p[2]}</small></div></div>`).join('')+
 '<h4>Fúrófejek</h4><div class="rgBits"><figure><img src="assets/rig/tricone0.svg" alt=""><figcaption><b>Háromgörgős</b><small>Forgó görgőkön keményfém betétek zúzzák a kőzetet. Kemény, töredezett kőzetben megbízható.</small></figcaption></figure>'+
 '<figure><img src="assets/rig/pdc0.svg" alt=""><figcaption><b>PDC gyémánt</b><small>Polikristályos gyémánt lapkák nyírják a kőzetet. Puha és közepes kőzetben gyorsabb, de a hő és a kemény kőzet koptatja.</small></figcaption></figure></div>'+
 '<h4>Mi a fúrómag?</h4><p>Magfúrással kivágott, hengeres kőzetminta. Megőrzi a harántolt kőzetek eredeti sorrendjét és szövetét, ezért pontosabb képet ad a mélyről, mint a felszíni minták.</p>'+
 '<p>Vizsgálatai: szabad szemes leírás, vékonycsiszolat mikroszkóp alatt, geokémiai mérések, nehézásványok, kőzetfizika (például áteresztőképesség). A roncsolásos vizsgálathoz levágott darab nem pótolható – ezért értékes minden mag.</p>'+
 '<p class="rgSrc">Az összefoglaló a Szegedi Tudományegyetem Földtani és Őslénytani Tanszékének ismeretterjesztő anyaga alapján készült (geosci.u-szeged.hu).</p></div>'}
RIG.info=function(){if(!ov)return;let d=$('rgInfo');if(!d){d=document.createElement('div');d.id='rgInfo';ov.appendChild(d)}d.innerHTML=infoHTML();d.style.display='flex';$('rgInfoX').onclick=()=>{d.style.display='none'}};
function ensureUI(){if(ov)return true;if(typeof document==='undefined'||!document.createElement||!document.body||!document.getElementById)return false;
 ov=document.createElement('div');ov.id='rgOv';
 ov.innerHTML='<div class="rgTop"><b>🗼 SG-3 fúróállomás</b><span id="rgLv"></span><button class="rgX" id="rgX" aria-label="Bezár">✕</button></div>'+
  '<canvas id="rgc"></canvas>'+
  '<div class="rgCtl"><button class="b" id="rgGo"></button><button class="b" id="rgAdd"></button><button class="rgB" id="rgTrip">⏫ Fejcsere</button><button class="rgB" id="rgZm">🔍</button></div>'+
  '<div class="rgCtl rgSl"><span>Terhelés</span><button class="rgB" data-a="wob-">−</button><b id="rgWob"></b><button class="rgB" data-a="wob+">+</button><span>Iszap</span><button class="rgB" data-a="q-">−</button><b id="rgQ"></b><button class="rgB" data-a="q+">+</button></div>'+
  '<div class="rgShop" id="rgShop"></div><div class="rgFoot" id="rgFoot"></div>';
 document.body.appendChild(ov);cv=$('rgc');cx=cv.getContext('2d');
 ov.addEventListener('click',e=>{const t=e.target.closest?e.target.closest('button'):e.target;if(!t||!ov.contains(t))return;try{t.blur()}catch(_){}const g=RIG.st(),a=t.dataset&&t.dataset.a,id=t.id;
  if(id==='rgX')return RIG.close();if(id==='rgGo'){if(g.lv)RIG.toggle();else RIG.build()}else if(id==='rgAdd')RIG.add();else if(id==='rgTrip')RIG.startTrip();else if(id==='rgZm'){if(RIG.zt>.5||RIG.zMan){RIG.zMan=false;RIG.zAuto=0}else RIG.zMan=true}
  else if(id==='rgUp'){if(!g.lv||confirm('Fejlesztés: '+RIGS[g.lv][0]+' – '+nf(RIGS[g.lv][7],0)+' Ft?'))RIG.build()}else if(id==='rgAuto'){g.auto=g.auto?0:1;RIG.save()}else if(id==='rgInfo2'){RIG.info();return}else if(id==='rgBit'){if(RIG.ph!=='trip'){g.bt=g.bt==='t'?'d':'t';RIG.save()}}else if(id==='rgZa'){RIG.zAuto=RIG.zAuto?0:1}
  else if(a==='wob-')g.wob=cl(g.wob-1,2,30);else if(a==='wob+')g.wob=cl(g.wob+1,2,30);else if(a==='q-')g.q=cl(g.q-2,10,RIG.rig()[2]);else if(a==='q+')g.q=cl(g.q+2,10,RIG.rig()[2]);
  else if(a&&a[0]==='S')g.sel=a[1];else if(a&&a[0]==='B')RIG.buy(a[1],+a.slice(2));
  uiKey='';syncUI()});
 document.addEventListener('keydown',e=>{if(!RIG.isOpen)return;const g=RIG.st();if(e.key===' '){e.preventDefault();RIG.toggle()}else if(e.key==='Escape')RIG.close();else if(e.key==='+'||e.key==='ArrowUp')g.wob=cl(g.wob+1,2,30);else if(e.key==='-'||e.key==='ArrowDown')g.wob=cl(g.wob-1,2,30);else if(e.key==='Enter')RIG.add();else return;uiKey='';syncUI()});
 W.addEventListener&&W.addEventListener('resize',()=>{if(RIG.isOpen)fit()});
 return true}
function fit(){const r=cv.getBoundingClientRect();dp=Math.min(W.devicePixelRatio||1,(W.Gov&&Gov.q<2)?1.25:1.75);CW=Math.max(200,r.width|0);CH=Math.max(200,r.height|0);cv.width=CW*dp|0;cv.height=CH*dp|0;skyC=null}
function setHTML(el,h){if(el&&el.innerHTML!==h)el.innerHTML=h}
function syncUI(){if(!ov)return;const g=RIG.st(),R=RIG.rig(),m=R[4];
 const key=[g.bt,g.bi,g.lv,RIG.ph,RIG.mk>0,g.p.length,g.d>=g.p.length*L-1e-6,g.sel,g.inv.a,g.inv.s,g.inv.t,g.wob,g.q,g.auto,RIG.zAuto,RIG.zMan,g.bw>=100,Math.floor(S.cash/1e3)].join('|');if(key===uiKey)return;uiKey=key;
 if(!g.lv){setHTML($('rgLv'),'nincs felépítve');setHTML($('rgGo'),'🏗 Építés · '+nf(RIGS[0][7],0)+' Ft')}
 else{setHTML($('rgLv'),R[0]+' · '+g.lv+'. szint');setHTML($('rgGo'),RIG.ph==='drill'?'⏸ Állj':'▶ Fúrás')}
 setHTML($('rgAdd'),'🔩 Felcsavar '+m+'× '+PT[g.sel].sh);const busy=RIG.ph==='trip'||RIG.mk>0;$('rgGo').disabled=!!g.lv&&busy;$('rgAdd').disabled=!g.lv||busy;$('rgTrip').disabled=!g.lv||!g.p.length||busy;
 $('rgZm').classList.toggle('on',!!RIG.zMan);
 setHTML($('rgWob'),g.wob+' t');setHTML($('rgQ'),g.q+' l/s');
 let sh='';for(const k in PT){const P=PT[k];sh+=`<div class="rgP${g.sel===k?' on':''}" style="--pc:${P.col}"><button class="rgPn" data-a="S${k}"><i></i>${P.n}<small>${P.F} t · ${P.kg} kg/cső · <b>${g.inv[k]} db</b></small></button><button class="rgB" data-a="B${k}1" ${S.cash<P.c?'disabled':''}>+1</button><button class="rgB" data-a="B${k}10" ${S.cash<P.c*10?'disabled':''}>+10</button><button class="rgB" data-a="B${k}50" ${S.cash<P.c*50?'disabled':''}>+50</button></div>`}
 sh+=`<div class="mu">Ár csövenként (12 m): Alu ${nf(PT.a.c,0)} Ft · Acél ${nf(PT.s.c,0)} Ft · Titán ${nf(PT.t.c,0)} Ft</div>`;setHTML($('rgShop'),sh);
 const nx=g.lv<RIGS.length?`<button class="b" id="rgUp" ${S.cash<RIGS[g.lv][7]?'disabled':''}>⬆ ${RIGS[g.lv][0]} · ${nf(RIGS[g.lv][7],0)} Ft</button>`:'<span class="ok">Legerősebb torony</span>';
 setHTML($('rgFoot'),(g.lv?nx:'')+(g.lv?`<button class="rgB on" id="rgBit">⛏ Fej: ${BITS[g.bt].sh}${g.bt!==g.bi?' (cserénél)':''}</button>`:'')+(g.lv>=2?`<button class="rgB${g.auto?' on':''}" id="rgAuto">🔁 Auto-felcsavarás ${g.auto?'be':'ki'}</button>`:'')+`<button class="rgB" id="rgInfo2">📘 Fúrószál</button><button class="rgB${RIG.zAuto?' on':''}" id="rgZa">🎥 Auto-zoom ${RIG.zAuto?'be':'ki'}</button>`)}
RIG.open=function(){if(!ensureUI())return;RIG.preload();RIG.isOpen=true;ov.style.display='flex';try{document.body.classList.add('rgOn')}catch(e){}fit();uiKey='';syncUI();lt=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
 const g=RIG.st();if(!g.lv)RIG.lastMsg='Építsd fel az állomást, vegyél csöveket, és csavard fel az elsőt a fúrófejjel.'};
RIG.close=function(){RIG.isOpen=false;RIG.resume=0;if(RIG.ph==='drill')RIG.ph='idle';if(ov)ov.style.display='none';try{document.body.classList.remove('rgOn')}catch(e){}cancelAnimationFrame(raf);RIG.save()};
function loop(ts){if(!RIG.isOpen)return;raf=requestAnimationFrame(loop);const dt=lt?Math.min(.05,(ts-lt)/1e3):.016;lt=ts;
 try{RIG.step(dt);if(ts-hudT>200){hudT=ts;syncUI()}draw(ts,dt)}catch(e){try{DBG.err='rig: '+(e.message||e)}catch(_){}}}

// ---- rajz segédek
const fmt=(v,d)=>nf(v,d||0);
function sky(w,h){if(skyC&&skyC.width===Math.ceil(w*dp))return skyC;skyC=document.createElement('canvas');skyC.width=Math.ceil(w*dp);skyC.height=Math.ceil(h*dp);const c=skyC.getContext('2d');c.scale(dp,dp);
 const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#071433');g.addColorStop(.55,'#123a7a');g.addColorStop(1,'#3fa0d8');c.fillStyle=g;c.fillRect(0,0,w,h);
 c.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<70;i++){const sx=(i*97.31)%w,sy=(i*41.7)%(h*.6);c.fillRect(sx,sy,i%7?1:1.6,i%7?1:1.6)}
 c.fillStyle='#24406a';c.beginPath();c.moveTo(0,h);for(let px=0;px<=w+10;px+=10)c.lineTo(px,h-18-14*Math.sin(px*.013)-8*Math.sin(px*.041));c.lineTo(w,h);c.fill();return skyC}
function bar(x,X,Y,w,v,col){x.fillStyle='rgba(255,255,255,.12)';x.fillRect(X,Y,w,5);x.fillStyle=col;x.fillRect(X,Y,w*cl(v,0,1),5)}
function uCol(u){return u<.6?'#3ee07a':u<.82?'#ffd23f':u<.95?'#ff8a2e':'#ff3b3b'}

// ---- képek (assets/rig/*.svg): egyszer betöltve, méretenként egyszer raszterizálva
const IMGS={},SPC=new Map();
function im(n){if(typeof Image==='undefined')return null;let i=IMGS[n];if(!i){i=IMGS[n]=new Image();i.src='assets/rig/'+n+'.svg'}return i.complete&&i.naturalWidth?i:null}
function spr(n,w,h){w=Math.max(4,Math.round(w/2)*2);h=Math.max(4,Math.round(h/2)*2);const k=n+'|'+w+'|'+h;let c=SPC.get(k);if(c)return c;const i=im(n);if(!i)return null;
 c=document.createElement('canvas');c.width=Math.ceil(w*dp);c.height=Math.ceil(h*dp);c.getContext('2d').drawImage(i,0,0,c.width,c.height);if(SPC.size>90)SPC.clear();SPC.set(k,c);return c}
RIG.preload=()=>{for(const n of['mast','sub','bha'])im(n);for(let f=0;f<6;f++){im('tricone'+f);im('pdc'+f)}};
// ---- felszíni modell
const SNOW=[],SMOKE=[];
function snow(x,dt,w,GY){if(SNOW.length<46)for(let i=SNOW.length;i<46;i++)SNOW.push({x:Math.random()*w,y:Math.random()*GY,v:8+Math.random()*16,r:.6+Math.random()*1.4,p:Math.random()*6});
 x.fillStyle='rgba(255,255,255,.85)';for(const f of SNOW){f.y+=f.v*dt;f.p+=dt;f.x+=Math.sin(f.p)*6*dt-4*dt;if(f.y>GY){f.y=-4;f.x=Math.random()*w}if(f.x<-4)f.x=w+4;x.fillRect(f.x,f.y,f.r,f.r)}}
function puff(x0,y0,dt,on,col){if(on&&SMOKE.length<40&&Math.random()<dt*9)SMOKE.push({x:x0,y:y0,r:2,a:.5,c:col})}
function smoke(x,dt){for(let i=SMOKE.length-1;i>=0;i--){const s=SMOKE[i];s.y-=12*dt;s.x+=7*dt;s.r+=6*dt;s.a-=.22*dt;if(s.a<=0){SMOKE.splice(i,1);continue}x.fillStyle=`rgba(${s.c},${s.a.toFixed(3)})`;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}}
function surface(x,ts,dt,w,TH,GY,HX,sm,td,g,R,n,drill){
 const lv=g.lv,FY=GY-Math.round(11*sm)-6,H=(R[4]*L+16)*sm,top=FY-H,bw=13+lv*2.5,Lg=(t,s)=>lerp(bw,5,t)*s;
 // dízel-áramfejlesztő ház kipufogóval, iszapszivattyú-ház dugattyúkkal (bal)
 const gx=Math.max(4,HX-bw-104);x.fillStyle='#2f5f8f';x.fillRect(gx,GY-26,46,26);x.fillStyle='#f1ece2';x.fillRect(gx-2,GY-29,50,4);x.fillStyle='#1d3f63';for(let i=0;i<4;i++)x.fillRect(gx+5+i*10,GY-19,6,8);
 x.fillStyle='#3a3d42';x.fillRect(gx+36,GY-44,5,16);puff(gx+38,GY-45,dt,true,drill?'70,70,78':'150,150,160');
 x.fillStyle='#fff';x.font='bold 7px Georgia';x.fillText('ДИЗЕЛЬ',gx+4,GY-3);
 const px=gx+50;x.fillStyle='#c73a2c';x.fillRect(px,GY-22,40,22);x.fillStyle='#f1ece2';x.fillRect(px-2,GY-25,44,4);x.fillStyle='#fff';x.fillText('НАСОС',px+5,GY-3);
 for(let i=0;i<3;i++){const st=drill?Math.sin(ts/90+i*2.09)*3:0;x.fillStyle='#8a929c';x.fillRect(px+6+i*11,GY-18,3,8+st);x.fillStyle='#3a3d42';x.fillRect(px+4+i*11,GY-11+st,7,3)}
 // alépítmény (fúrópadló), rácsozat
 const MW=Math.round(16+lv*1.6),SW=bw*2+40,subH=(GY-FY)*80/58,SUB=spr('sub',SW,subH),MST=spr('mast',MW,FY-top),edge=t=>MST?MW/2:Lg(t,1);
 if(!SUB){x.fillStyle='#4a4f57';x.fillRect(HX-bw-16,FY,bw*2+32,5);x.strokeStyle='#6b727c';x.lineWidth=1.5;x.beginPath();
 for(const s of[-1,1]){const a=HX+s*(bw+12),b=HX+s*(bw-2);x.moveTo(a,GY);x.lineTo(a,FY);x.moveTo(b,GY);x.lineTo(b,FY);x.moveTo(a,GY);x.lineTo(b,FY);x.moveTo(b,GY);x.lineTo(a,FY)}x.stroke()}
 // kitörésgátló (BOP) a padló alatt, fejrész és visszafolyó vezeték
 const by0=FY+5,bh=GY-by0;for(let i=0;i<3;i++){const y=by0+bh*(.08+i*.29);x.fillStyle=i===1?'#b3261e':'#d8392d';x.fillRect(HX-8,y,16,bh*.24);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(HX-8,y+bh*.2,16,2)}
 x.fillStyle='#6b727c';x.fillRect(HX-10,GY-3,20,3);
 if(SUB)x.drawImage(SUB,HX-SW/2,GY-subH,SW,subH);
 if(MST)x.drawImage(MST,HX-MW/2,top,MW,FY-top);else{
 // torony: hátsó lábak (sötétebb), első lábak, rácsozat, piros-fehér sávok, szélfal az alsó részen
 x.strokeStyle='#8f99a3';x.lineWidth=1.6;x.beginPath();x.moveTo(HX-bw*.72,FY);x.lineTo(HX-4,top);x.moveTo(HX+bw*.72,FY);x.lineTo(HX+4,top);x.stroke();
 x.fillStyle='rgba(205,222,236,.22)';x.beginPath();x.moveTo(HX-bw,FY);x.lineTo(HX+bw,FY);x.lineTo(HX+Lg(.3,1),FY-H*.3);x.lineTo(HX-Lg(.3,1),FY-H*.3);x.closePath();x.fill();
 x.strokeStyle='#e4e9ee';x.lineWidth=2.4;x.beginPath();x.moveTo(HX-bw,FY);x.lineTo(HX-5,top);x.moveTo(HX+bw,FY);x.lineTo(HX+5,top);x.stroke();
 x.lineWidth=.9;x.strokeStyle='rgba(228,233,238,.8)';x.beginPath();const seg=12;for(let i=0;i<seg;i++){const t0=i/seg,t1=(i+1)/seg,y0=lerp(FY,top,t0),y1=lerp(FY,top,t1),a0=Lg(t0,1),a1=Lg(t1,1);x.moveTo(HX-a0,y0);x.lineTo(HX+a1,y1);x.moveTo(HX+a0,y0);x.lineTo(HX-a1,y1);x.moveTo(HX-a1,y1);x.lineTo(HX+a1,y1)}x.stroke();
 for(let i=0;i<5;i++){const t=.62+i*.075,y=lerp(FY,top,t),a=Lg(t,1);x.fillStyle=i%2?'#f6f6f6':'#e5342a';x.fillRect(HX-a,y-2,a*2,4)}}
 // csigasor (crown block) és figyelmeztető fény
 x.fillStyle='#3d4148';x.fillRect(HX-11,top-7,22,8);x.fillStyle='#9aa3ad';for(const o of[-6,0,6]){x.beginPath();x.arc(HX+o,top-3,2.6,0,7);x.fill()}
 x.fillStyle=Math.floor(ts/500)%2?'#ff3b30':'#6a1610';x.beginPath();x.arc(HX,top-10,2.8,0,7);x.fill();
 // futócsiga + horog + felső hajtás (top drive) a csőszál helyzete szerint
 const tdy=Math.min(FY-4,FY+td*sm),hookY=Math.max(top+10,tdy-20);
 x.strokeStyle='rgba(30,32,36,.9)';x.lineWidth=.8;x.beginPath();for(const o of[-4.5,-1.5,1.5,4.5]){x.moveTo(HX+o,top);x.lineTo(HX+o*.8,hookY)}x.stroke();
 x.fillStyle='#ffb02e';x.fillRect(HX-7,hookY,14,8);x.fillStyle='#d48a12';x.fillRect(HX-7,hookY+6,14,2);x.fillStyle='#2b2e34';x.fillRect(HX-2,hookY+8,4,3);
 x.fillStyle='#e3a020';x.fillRect(HX-9,hookY+11,18,10);x.fillStyle='#3a3d42';x.fillRect(HX-11,hookY+13,3,6);x.fillStyle='#222';x.fillRect(HX-5,hookY+14,10,2);
 // csörlő (drawworks): a dob a futócsiga mozgásával forog; a gyorskötél a csigasorra fut
 const dwx=HX-bw-10,dwy=FY-7;x.fillStyle='#2f5f8f';x.fillRect(dwx-10,FY-12,20,12);x.strokeStyle='#d8dde2';x.lineWidth=1;const da=hookY*.35;x.beginPath();x.arc(dwx,dwy,5,0,7);for(let i=0;i<3;i++){const a=da+i*2.09;x.moveTo(dwx,dwy);x.lineTo(dwx+Math.cos(a)*5,dwy+Math.sin(a)*5)}x.stroke();
 x.strokeStyle='rgba(30,32,36,.8)';x.lineWidth=.8;x.beginPath();x.moveTo(dwx,dwy-5);x.lineTo(HX-9,top-2);x.stroke();
 // állócső + iszaptömlő a top drive-hoz
 const spx=HX+edge(0)-3,spTop=lerp(FY,top,.55);x.strokeStyle='#5d6670';x.lineWidth=2.2;x.beginPath();x.moveTo(spx,FY);x.lineTo(lerp(spx,HX+6,.55),spTop);x.stroke();
 x.strokeStyle='#26292e';x.lineWidth=2.6;x.beginPath();x.moveTo(lerp(spx,HX+6,.55),spTop);x.quadraticCurveTo(HX+bw*.9,(spTop+hookY)/2+14,HX+8,hookY+15);x.stroke();
 if(drill){x.strokeStyle='rgba(120,200,255,.9)';x.lineWidth=1;x.setLineDash([3,5]);x.lineDashOffset=-ts/30;x.beginPath();x.moveTo(spx,FY);x.lineTo(lerp(spx,HX+6,.55),spTop);x.stroke();x.setLineDash([])}
 // toronypihenő (monkey board) – kiemeléskor itt sorakoznak a gyertyák
 const mby=lerp(FY,top,Math.min(.9,(R[4]*L*sm)/H+.02)),mbx=MST?HX+MW/2+19:HX-Lg((FY-mby)/H,1);x.fillStyle='#5d6670';x.fillRect(mbx-18,mby,18,3);
 let racked=0;if(RIG.ph==='trip'){const t=RIG.trip,lift=(t<.5?t*2:(1-t)*2)*RIG.tripD;racked=Math.min(16,Math.round(lift/(R[4]*L)))}
 for(let i=0;i<racked;i++){x.fillStyle=i%2?PT[g.p[0]||'a'].dk:PT[g.p[0]||'a'].col;x.fillRect(mbx-17+i*1.7,mby+3-i*.4,1,FY-mby-3+i*.4)}
 // a padló fölé nyúló cső + ékek
 if(n){x.fillStyle=PT[g.p[0]].col;x.fillRect(HX-2,hookY+21,4,Math.max(0,FY-hookY-21)+5)}
 x.fillStyle='#34373d';x.fillRect(HX-14,FY-3,28,3);
 // rakpart (V-ajtó) és csőállvány a raktárkészlettel
 const rx=HX+bw+46,rw=Math.max(40,w-rx-6),cw3=rw/3;x.strokeStyle='#6b727c';x.lineWidth=2;x.beginPath();x.moveTo(HX+bw+4,FY+2);x.lineTo(rx,GY-6);x.stroke();
 x.fillStyle='#5a4632';x.fillRect(rx,GY-4,rw,3);x.fillRect(rx+4,GY-4,2,4);x.fillRect(rx+rw-6,GY-4,2,4);let ci=0;x.font='bold 8px Georgia';x.textAlign='center';
 for(const k in PT){const c=Math.min(12,Math.ceil(g.inv[k]/5)),bx=rx+ci*cw3+2;for(let j=0;j<c;j++){x.fillStyle=j%2?PT[k].dk:PT[k].col;x.fillRect(bx,GY-7-j*3,cw3-4,2.6)}x.fillStyle=g.sel===k?'#fff':'rgba(255,255,255,.65)';x.fillText(g.inv[k],bx+cw3/2-2,GY-11-c*3);ci++}x.textAlign='left';
 if(RIG.mk>0){const t=Math.min(1,(1-RIG.mk/1.2)*1.6),ppx=lerp(rx+20,HX,t),ang=lerp(-1.2,0,t);x.save();x.translate(ppx,lerp(GY-6,FY,t));x.rotate(ang);x.fillStyle=PT[g.p[0]].col;x.fillRect(-2,-R[4]*L*sm,4,R[4]*L*sm);x.restore()}
 // rázószita (vibrál fúráskor, hulló furadék) és iszapmedence gőzzel
 const shx=HX+bw+6,shy=GY-16,vib=drill?Math.sin(ts/25)*.8:0;x.fillStyle='#4b5560';x.fillRect(shx,GY-8,30,8);x.fillStyle='#1f6e8c';x.fillRect(shx+1,GY-7,28,5);
 x.save();x.translate(shx+15,shy+vib);x.rotate(-.12);x.fillStyle='#9aa3ad';x.fillRect(-15,-3,30,5);x.fillStyle='#5d6670';x.fillRect(-15,2,30,2);x.restore();
 x.strokeStyle='#5d6670';x.lineWidth=2;x.beginPath();x.moveTo(HX+8,GY-6);x.lineTo(shx+2,shy);x.stroke();
 if(drill){x.fillStyle=zone(g.d)[4];for(let i=0;i<4;i++){const k=((ts/400)+i/4)%1;x.fillRect(shx+28+k*3,shy+k*12,2,2)}}
 puff(shx+12,GY-8,dt,true,'225,235,245');smoke(x,dt);
 // reflektorok (fénykúp) a toronyról
 x.save();x.globalCompositeOperation='lighter';for(const[t,dir]of[[.45,-1],[.75,1]]){const ly=lerp(FY,top,t),lx=HX+dir*edge(t);const gr=x.createLinearGradient(lx,ly,lx+dir*60,GY);gr.addColorStop(0,'rgba(255,240,190,.28)');gr.addColorStop(1,'rgba(255,240,190,0)');x.fillStyle=gr;x.beginPath();x.moveTo(lx,ly);x.lineTo(lx+dir*20,GY);x.lineTo(lx+dir*95,GY);x.closePath();x.fill();x.fillStyle='#fff7d0';x.fillRect(lx-1.5,ly-1.5,3,3)}x.restore();
}
// ---- kőzetminták (32 px-es csempék, egyszer készülnek)
const PATS=[];
function pat(i){if(PATS[i]!==undefined)return PATS[i];let P=null;try{const c=document.createElement('canvas');c.width=c.height=32;const q=c.getContext('2d');q.strokeStyle='rgba(0,0,0,.24)';q.fillStyle='rgba(0,0,0,.24)';q.lineWidth=1.2;q.beginPath();
 if(i===0)for(let k=0;k<4;k++){q.moveTo(2+(k%2)*14,4+k*8);q.lineTo(12+(k%2)*14,4+k*8)}
 else if(i===1){for(let k=0;k<6;k++){q.beginPath();q.arc((k*11)%30+1,(k*17)%30+1,1.4,0,7);q.fill()}q.beginPath();q.fillStyle='rgba(255,226,120,.55)';q.fillRect(22,6,2,2);q.fillRect(8,24,2,2)}
 else if(i===2)for(let k=0;k<4;k++){const a=4+(k%2)*16,b=6+k*7;q.moveTo(a,b);q.lineTo(a+3,b+4);q.lineTo(a+6,b)}
 else if(i===3){for(let k=0;k<5;k++){q.moveTo((k*13)%28+6,(k*9)%28+3);q.arc((k*13)%28+3,(k*9)%28+3,2.4,0,7)}}
 else if(i===4)for(let k=0;k<4;k++){const a=6+(k%2)*16,b=6+Math.floor(k/2)*16;q.moveTo(a-3,b);q.lineTo(a+3,b);q.moveTo(a,b-3);q.lineTo(a,b+3)}
 else if(i===5)for(let k=0;k<3;k++){q.moveTo(0,6+k*11);for(let px=0;px<=32;px+=4)q.lineTo(px,6+k*11+Math.sin(px/32*Math.PI*2)*2.5)}
 else for(let k=-32;k<32;k+=8){q.moveTo(k,32);q.lineTo(k+32,0)}
 q.stroke();P=cx.createPattern(c,'repeat')}catch(e){P=null}PATS[i]=P;return P}
// ---- fúrószerelvény rajza
function bha(x,ts,HX,by,s,hw,cwid,g){const drill=RIG.ph==='drill',rot=drill?ts*RIG.rpm()/9550:0,br=Math.max(3,hw*.95);
 if(s<1.2){x.fillStyle='#ff8a2e';x.fillRect(HX-cwid*1.4,by-Math.max(4,30*s),cwid*2.8,Math.max(4,30*s));x.fillStyle='#ffd23f';x.fillRect(HX-br,by-2,br*2,2);return}
 const BH=spr('bha',cwid*2.8,30*s);
 if(BH){x.drawImage(BH,HX-cwid*1.4,by-30*s,cwid*2.8,30*s);const t0=by-12*s,t1=by-1.1*s,tw=cwid*1.05;x.save();x.beginPath();x.rect(HX-tw,t0,tw*2,t1-t0);x.clip();x.strokeStyle='rgba(110,35,0,.4)';x.lineWidth=2;const off=(rot*40)%10;x.beginPath();for(let y=t0-10+off;y<t1;y+=10){x.moveTo(HX-tw,y);x.lineTo(HX+tw,y+tw*.7)}x.stroke();x.restore()}
 else{
 // nehézrudak (drill collar): vastag acél, 9 m-es illesztések
 const c0=by-30*s,c1=by-13*s;x.fillStyle='#4a515b';x.fillRect(HX-cwid*1.25,c0,cwid*2.5,c1-c0);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(HX-cwid*.9,c0,cwid*.35,c1-c0);
 x.fillStyle='#2b3036';for(let m=13;m<30;m+=9)x.fillRect(HX-cwid*1.35,by-m*s-1.5,cwid*2.7,3);
 // stabilizátor: spirális lapátok
 const st0=by-13*s,st1=by-12*s;x.fillStyle='#7c8590';x.fillRect(HX-hw*.92,st0,hw*1.84,Math.max(3,st1-st0));x.fillStyle='rgba(0,0,0,.3)';for(let k=0;k<3;k++)x.fillRect(HX-hw*.92+((k*hw*.6+rot*20)%(hw*1.84)),st0,2,Math.max(3,st1-st0));
 // turbina (turbófúró): forgó csíkok a házon
 const t0=by-12*s,t1=by-.6*s,tw=cwid*1.4;x.fillStyle='#ff8a2e';x.fillRect(HX-tw,t0,tw*2,t1-t0);x.save();x.beginPath();x.rect(HX-tw,t0,tw*2,t1-t0);x.clip();x.strokeStyle='rgba(120,40,0,.45)';x.lineWidth=2;const off=(rot*40)%10;x.beginPath();for(let y=t0-10+off;y<t1;y+=10){x.moveTo(HX-tw,y);x.lineTo(HX+tw,y+tw*.7)}x.stroke();x.restore();
 x.fillStyle='rgba(255,255,255,.18)';x.fillRect(HX-tw*.7,t0,tw*.3,t1-t0)}
 // fúrófej: kép (6 forgásfázis), ha még nincs betöltve, rajzolt tartalék
 const per=g.bi==='d'?2*Math.PI/5:2*Math.PI/3,fr=((Math.floor(rot/per*6)%6)+6)%6,BW=br*2.7,BI=spr((g.bi==='d'?'pdc':'tricone')+fr,BW,BW*1.12);
 x.save();x.translate(HX,by);
 if(BI){x.drawImage(BI,-BW/2,-BW*1.12*.9,BW,BW*1.12)}
 else if(g.bi==='d'){// PDC: lapos gyémántbetétes fej, forgó vágóelemek
  x.fillStyle='#3e4650';x.beginPath();x.moveTo(-br,-br*.9);x.lineTo(br,-br*.9);x.lineTo(br,-br*.2);x.quadraticCurveTo(0,br*.25,-br,-br*.2);x.closePath();x.fill();
  for(let k=0;k<7;k++){const a=rot*1.5+k*.9,cx2=Math.sin(a)*br*.8;if(Math.cos(a)<0)continue;x.fillStyle='#dff6ff';x.beginPath();x.arc(cx2,-br*.18+Math.abs(cx2)/br*-br*.05,Math.max(1,br*.12),0,7);x.fill()}
 }else{// háromgörgős (tricone) marófogas fej
  x.fillStyle='#ffd23f';x.beginPath();x.moveTo(-br,-br*.95);x.lineTo(br,-br*.95);x.lineTo(br*.78,-br*.1);x.lineTo(-br*.78,-br*.1);x.closePath();x.fill();
  for(let j=0;j<3;j++){const a=rot+j*2.094,cxp=Math.sin(a)*br*.55;if(Math.cos(a)<-.2)continue;x.fillStyle=j===0?'#d2d6dc':j===1?'#aeb3ba':'#8f949c';x.beginPath();x.arc(cxp,-br*.12,br*.42,0,7);x.fill();x.fillStyle='#4a4d55';for(let q=0;q<6;q++){const ta=rot*3+q*1.047;x.fillRect(cxp+Math.cos(ta)*br*.32-1,-br*.12+Math.sin(ta)*br*.32-1,2,2)}}}
 if(drill){// iszapsugarak a fúvókákból + szikrák a talpon
  x.strokeStyle='rgba(140,215,255,.75)';x.lineWidth=1.2;x.beginPath();for(const o of[-.5,0,.5]){const ph=(ts/60+o*7)%6;x.moveTo(o*br,-br*.2);x.lineTo(o*br*1.4,br*.15+ph*.3)}x.stroke();
  x.fillStyle='rgba(255,240,180,.4)';x.beginPath();x.arc(0,2,br*1.35,0,Math.PI);x.fill()}
 x.restore()}
function draw(ts,dt){const x=cx,w=CW,h=CH,g=RIG.st(),R=RIG.rig(),lv=g.lv,n=g.p.length;
 x.setTransform(dp,0,0,dp,0,0);x.fillStyle='#0b0812';x.fillRect(0,0,w,h);let shx=0,shy=0;if(RIG.shake>0){shx=(Math.random()-.5)*10*RIG.shake;shy=(Math.random()-.5)*10*RIG.shake;x.translate(shx,shy)}
 const TH=Math.round(Math.min(h*.44,250)),GY=TH-20,HX=Math.round(w*.34);
 // ---------- felszín (élethű modell: alépítmény, BOP, torony, csigasor, csörlő, top drive, iszaprendszer, dízelház)
 x.drawImage(sky(w,TH),0,0,w,TH);
 x.save();x.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const ph=ts/3000+i*1.7;x.strokeStyle=i===1?'rgba(170,90,255,.16)':'rgba(60,255,160,.18)';x.lineWidth=14-i*3;x.beginPath();for(let px=-10;px<=w+10;px+=24){const y=24+i*13+Math.sin(px*.012+ph)*12+Math.sin(px*.033-ph*1.3)*6;px<0?x.moveTo(px,y):x.lineTo(px,y)}x.stroke()}x.restore();
 x.fillStyle='#eef6fb';x.fillRect(0,GY,w,TH-GY);x.fillStyle='#cfe3ee';x.fillRect(0,GY,w,3);
 const sm=(TH*.78)/78,td=lv?(g.d-n*L):0,drill=RIG.ph==='drill';
 if(lv){surface(x,ts,dt,w,TH,GY,HX,sm,td,g,R,n,drill)}
 else{x.fillStyle='#ffb02e';x.setLineDash([6,5]);x.strokeStyle='#ffb02e';x.lineWidth=2;x.strokeRect(HX-50,GY-80,100,78);x.setLineDash([]);x.fillStyle='#fff';x.font='bold 12px Georgia';x.textAlign='center';x.fillText('Építési terület',HX,GY-40);x.font='10px Georgia';x.fillText('Kola-típusú mélyfúró állomás',HX,GY-25);x.textAlign='left'}
 snow(x,dt,w,GY);
 // ---------- föld alatti nézet (kamerával)
 const BY=TH,BH=h-TH,maxD=Math.max(300,g.d*1.12,lv?Math.min(R[6],Math.max(g.d,1000)):1000);
 const sOv=BH/(maxD+20),sCu=BH/36,z=RIG.zt*RIG.zt*(3-2*RIG.zt),s=Math.exp(lerp(Math.log(sOv),Math.log(sCu),z));
 const cyOv=(maxD+20)/2-10,cyCu=Math.max(18-6,g.d-8),cy=lerp(cyOv,cyCu,z);// képernyő közepe (m)
 const Yd=d=>BY+BH/2+(d-cy)*s,dTop=cy-BH/2/s,dBot=cy+BH/2/s;
 x.save();x.beginPath();x.rect(0,BY,w,BH);x.clip();
 let PM=null;try{PM=new DOMMatrix([1,0,0,1,0,Yd(0)%32])}catch(e){}
 GZ.forEach((Z,zi)=>{if(Z[1]<dTop||Z[0]>dBot)return;const y0=Math.max(BY,Yd(Z[0])),y1=Math.min(h,Yd(Z[1]));x.fillStyle=Z[4];x.fillRect(0,y0,w,y1-y0);
  // kőzettípus-minta, a kőzettel együtt mozog
  const P=pat(zi);if(P){if(PM&&P.setTransform)P.setTransform(PM);x.fillStyle=P;x.fillRect(0,y0,w,y1-y0)}
  x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,y0,w,Math.min(4,y1-y0))});
 x.fillStyle='rgba(10,6,20,.24)';x.fillRect(0,BY,w,BH);
 // forró mélység: a kőzet vörösen izzik (T > 110 °C)
 if(dBot>7900){const gy0=Yd(7930),gy1=Yd(15000),gr=x.createLinearGradient(0,gy0,0,gy1);gr.addColorStop(0,'rgba(255,70,20,0)');gr.addColorStop(1,'rgba(255,70,20,.32)');x.fillStyle=gr;x.fillRect(0,Math.max(BY,gy0),w,h-Math.max(BY,gy0))}
 // kőzet-textúra közelnézetben (determinisztikus, csak a látható méterek)
 if(s>3){const m0=Math.floor(dTop),m1=Math.ceil(dBot);for(let m=m0;m<=m1;m++){if(m<0)continue;const hh=(m*2654435761)>>>0;for(let k=0;k<5;k++){const r=((hh>>>(k*5))&1023)/1023,r2=((hh>>>(k*3+7))&511)/511;x.fillStyle=k%2?'rgba(255,255,255,.18)':'rgba(0,0,0,.22)';x.beginPath();x.ellipse(r*w,Yd(m+r2),1.5+r2*s*.25,1+r*s*.12,r*3,0,7);x.fill()}}
  x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;for(let m=Math.floor(dTop/4)*4;m<=dBot;m+=4){if(m<0)continue;x.beginPath();x.moveTo(0,Yd(m)+Math.sin(m)*3);x.bezierCurveTo(w*.3,Yd(m)-4,w*.6,Yd(m)+5,w,Yd(m)+Math.cos(m)*3);x.stroke()}}
 // fúrólyuk
 const hw=lerp(3,20,z),cwid=Math.max(2,hw*.5); // a lyuk szélessége közelnézetben sematikusan nagyítva
 if(g.d>0){const y0=Math.max(BY,Yd(0)),y1=Math.min(h,Yd(g.d));x.fillStyle='#1b1430';x.fillRect(HX-hw,y0,hw*2,y1-y0);x.fillStyle='rgba(90,170,255,.22)';x.fillRect(HX-hw,y0,hw*2,y1-y0);
  const cs=Math.min(g.d,2000);if(Yd(0)<h){x.fillStyle='#9aa3ad';x.fillRect(HX-hw-1.5,y0,1.5,Math.max(0,Math.min(h,Yd(cs))-y0));x.fillRect(HX+hw,y0,1.5,Math.max(0,Math.min(h,Yd(cs))-y0))}}
 // csőszál (az elejétől lefelé), kiemeléskor felfelé húzva
 let lift=0;if(RIG.ph==='trip'){const t=RIG.trip;lift=(t<.5?t*2:(1-t)*2)*RIG.tripD}
 if(n){const top=td-lift;const i0=Math.max(0,Math.floor((dTop-top)/L)),i1=Math.min(n-1,Math.ceil((dBot-top)/L));
  if(s*L<3){// futamok összevonva (áttekintés)
   let a=i0;while(a<=i1){const k=g.p[a];let b=a;while(b+1<=i1&&g.p[b+1]===k)b++;const y0=Math.max(BY,Yd(top+a*L)),y1=Math.min(h,Yd(top+(b+1)*L));x.fillStyle=PT[k].col;x.fillRect(HX-cwid,y0,cwid*2,y1-y0);a=b+1}}
  else for(let i=i0;i<=i1;i++){const k=g.p[i],y0=Yd(top+i*L),y1=Yd(top+(i+1)*L);const gr=x.createLinearGradient(HX-cwid,0,HX+cwid,0);gr.addColorStop(0,PT[k].dk);gr.addColorStop(.45,PT[k].col);gr.addColorStop(1,PT[k].dk);x.fillStyle=gr;x.fillRect(HX-cwid,y0,cwid*2,y1-y0);
   x.fillStyle='#3a3d44';x.fillRect(HX-cwid*1.35,y0-Math.max(1,s*.25),cwid*2.7,Math.max(2,s*.5))}
  // fúrószerelvény alulról felfelé: fúrófej, turbina (12 m), stabilizátor, nehézrudak (18 m)
  const bb=top+n*L,by=Yd(bb);if(by>BY-60&&by<h+40)bha(x,ts,HX,by,s,hw,cwid,g);}
 // elveszett, lezuhanó szálrész
 if(RIG.fall){const f=RIG.fall,y0=Yd(f.y+f.t*f.t*20),y1=Yd(f.y+f.len+f.t*f.t*20);x.globalAlpha=Math.max(0,1-f.t/3);x.fillStyle='#ff3b3b';x.fillRect(HX-cwid,Math.max(BY,y0),cwid*2,Math.max(0,Math.min(h,y1)-Math.max(BY,y0)));x.globalAlpha=1}
 // iszapáram és furadék (közelnézet)
 if(z>.5&&RIG.ph==='drill'&&n){const by=Yd(td+n*L);x.strokeStyle='rgba(140,210,255,.8)';x.lineWidth=1.2;x.setLineDash([3,7]);x.lineDashOffset=ts/20;x.beginPath();x.moveTo(HX,BY);x.lineTo(HX,by);x.stroke();x.lineDashOffset=-ts/20*(g.q/25);x.beginPath();x.moveTo(HX-hw+1.5,by);x.lineTo(HX-hw+1.5,BY);x.moveTo(HX+hw-1.5,by);x.lineTo(HX+hw-1.5,BY);x.stroke();x.setLineDash([]);
  if(parts.length<60&&Math.random()<.9)parts.push({x:(Math.random()<.5?-1:1)*(hw*.6+Math.random()*hw*.3),y:g.d,v:.5+Math.random()*.6,c:zone(g.d)[4]});}
 if(parts.length){const up=(g.q/25)*4;for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.y-=up*p.v*dt*(1.2-g.cu);const py=Yd(p.y);if(py<BY||p.y<g.d-40||RIG.ph!=='drill'){parts.splice(i,1);continue}x.fillStyle=p.c;x.fillRect(HX+p.x-1.2,py,2.4,2.4)}}
 x.restore();
 // mélységskála (bal oldali rétegtérkép)
 {const mx=6,mw=10,my=BY+8,mh=BH-16,top=lv?R[6]:3000;for(const Z of GZ){if(Z[0]>=top)break;x.fillStyle=Z[4];x.fillRect(mx,my+Z[0]/top*mh,mw,(Math.min(Z[1],top)-Z[0])/top*mh)}x.strokeStyle='rgba(255,255,255,.6)';x.strokeRect(mx+.5,my+.5,mw,mh);
  const bb=my+g.d/top*mh;x.fillStyle='#fff';x.beginPath();x.moveTo(mx+mw+1,bb);x.lineTo(mx+mw+7,bb-4);x.lineTo(mx+mw+7,bb+4);x.fill();if(g.best>g.d){x.fillStyle='#ffd23f';x.fillRect(mx-2,my+g.best/top*mh,mw+4,1.5)}
  // ablak-jelző
  x.strokeStyle='#fff';x.lineWidth=1;x.strokeRect(mx-1.5,my+Math.max(0,dTop)/top*mh,mw+3,Math.max(2,(dBot-Math.max(0,dTop))/top*mh));
  x.font='8px Georgia';x.fillStyle='rgba(255,255,255,.8)';x.fillText('0',mx+mw+9,my+6);x.fillText(fmt(top/1e3)+' km',mx+mw+9,my+mh)}
 // mélység-jelölők a lyuk mellett
 {x.font='9px Georgia';x.fillStyle='rgba(255,255,255,.85)';const step=[1,2,5,10,25,50,100,250,500,1000,2500].find(v=>v*s>=46)||5e3;for(let m=Math.max(0,Math.ceil(dTop/step)*step);m<=dBot;m+=step){const y=Yd(m);if(y<BY+8)continue;x.fillRect(HX+hw+3,y,6,1);x.fillText(fmt(m)+' m',HX+hw+11,y+3)}}
 // ---------- műszerfal
 {const pw=Math.min(190,w*.48),px=w-pw-6,py=BY+6;x.fillStyle='rgba(8,10,20,.72)';x.fillRect(px,py,pw,188);x.strokeStyle='rgba(255,255,255,.18)';x.strokeRect(px+.5,py+.5,pw-1,187);
  const Z=zone(g.d),T=temp(g.d),ld=RIG.load(0,RIG.ph==='drill');let y=py+14;x.font='bold 10px Georgia';
  const row=(lab,val,col)=>{x.fillStyle='rgba(255,255,255,.72)';x.font='10px Georgia';x.fillText(lab,px+7,y,pw*.5);x.fillStyle=col||'#fff';x.font='bold 11px Georgia';x.textAlign='right';x.fillText(val,px+pw-7,y,pw*.5);x.textAlign='left';y+=13};
  const bar2=(v,c)=>{bar(x,px+7,y-9,pw-14,v,c);y+=5};
  row('Mélység',fmt(g.d,1)+' m','#7fe9ff');row('Rekord',fmt(g.best,0)+' m','#ffd23f');row('Talp-hőmérséklet',fmt(T,0)+' °C',T>150?'#ff7a4a':'#fff');
  row('Horogterhelés',fmt(ld.hook,0)+' / '+R[1]+' t',ld.hook>R[1]*.9?'#ff8a2e':'#fff');bar2(ld.hook/R[1],uCol(ld.hook/R[1]));
  row('Max csőterhelés',n?Math.round(ld.mu*100)+'% · '+(ld.mi+1)+'. cső':'–',uCol(ld.mu));bar2(ld.mu,uCol(ld.mu));
  row('Kopás · '+BITS[g.bi].sh,Math.round(g.bw)+'%');bar2(g.bw/100,uCol(g.bw/100));
  row('Csőfáradás',Math.round(g.fa*100)+'%');bar2(g.fa,uCol(g.fa));
  row('Furadék',Math.round(g.cu*100)+'% · kell '+fmt(RIG.need(),0)+' l/s',g.q<RIG.need()?'#ff8a2e':'#3ee07a');bar2(g.cu,uCol(g.cu));
  row('Turbina',fmt(RIG.rpm(),0)+' 1/perc');if(g.wob>.85*RIG.bha()){x.fillStyle='#ff4a3a';x.font='bold 10px Georgia';x.fillText('⚠ Kihajlás: túl nagy terhelés a BHA-hoz',px+7,py+196-24,pw-14)}row('Fúrási sebesség',fmt(RIG.rop,2)+' m/s');
  x.fillStyle='rgba(255,255,255,.55)';x.font='8px Georgia';x.fillText(Z[2],px+7,py+183,pw-14);
  // magláda (utolsó 16 minta) + mélység–idő görbe
  const qy=py+194;if(qy+58<h){x.fillStyle='rgba(8,10,20,.72)';x.fillRect(px,qy,pw,58);x.strokeStyle='rgba(255,255,255,.18)';x.strokeRect(px+.5,qy+.5,pw-1,57);
   x.fillStyle='rgba(255,255,255,.72)';x.font='9px Georgia';x.fillText('Magláda',px+7,qy+12);x.textAlign='right';x.fillText(fmt(g.core)+' minta',px+pw-7,qy+12);x.textAlign='left';
   const cw=(pw-14)/16;for(let i=0;i<16;i++){const c=g.cs[i];const bx=px+7+i*cw;x.fillStyle='rgba(255,255,255,.08)';x.fillRect(bx,qy+16,cw-2,12);if(c!==undefined){x.fillStyle=GZ[+c][4];x.fillRect(bx,qy+16,cw-2,12);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(bx,qy+16,cw-2,2);if(i===g.cs.length-1){x.strokeStyle='#fff';x.strokeRect(bx-.5,qy+15.5,cw-1,13)}}}
   const H2=RIG.hist;if(H2.length>1){const mn=Math.min(...H2),mx=Math.max(...H2,mn+1);x.strokeStyle='#7fe9ff';x.lineWidth=1.3;x.beginPath();H2.forEach((v,i)=>{const X=px+7+i/(H2.length-1)*(pw-14),Y=qy+52-(v-mn)/(mx-mn)*18;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()}
   else{x.fillStyle='rgba(255,255,255,.4)';x.fillText('mélység–idő görbe fúráskor',px+7,qy+48)}}}
 // állapotsor
 {let st=!lv?'':RIG.ph==='drill'?'▶ Fúrás':RIG.ph==='trip'?'⏫ Kiemelés / visszaengedés '+Math.round(RIG.trip*100)+'%':RIG.mk>0?'🔩 Csőcsatlakoztatás…':(n&&g.d<n*L-1e-6)?'⏸ Áll':'🔩 Új cső kell';
  const sp=Math.max(0,n*L-g.d);if(lv&&RIG.ph==='drill')st+=' · a szakaszból hátra '+fmt(sp,1)+' m';
  x.font='bold 11px Georgia';const tw=Math.min(w-12,x.measureText(st).width+16);if(st){x.fillStyle='rgba(8,10,20,.78)';x.fillRect(6,6,tw,18);x.fillStyle='#fff';x.fillText(st,14,19,w-28)}
  if(RIG.lastMsg){x.font='10px Georgia';x.fillStyle='rgba(8,10,20,.72)';x.fillRect(6,27,w-12,17);x.fillStyle='#ffe9a8';x.fillText(RIG.lastMsg,12,39,w-24)}}
 if(RIG.flash>0){x.fillStyle=`rgba(255,40,40,${RIG.flash*.35})`;x.fillRect(-20,-20,w+40,h+40)}}

// ---- bekötés a játékba
if(W.on){on('world.back',V=>{try{RIG.world(V)}catch(e){DBG.err='rig: '+(e.message||e)}});
 on('frame',()=>{try{if(typeof document==='undefined'||!document.getElementById)return;const b=document.getElementById('rgBtn');if(b){const sh=!RIG.isOpen&&RIG.vis;if(b.style.display!==(sh?'block':'none'))b.style.display=sh?'block':'none'}}catch(e){}});
 on('world.front',V=>{RIG.vis=V.Ys>-120&&V.Ys<V.h+60&&!(W.CIN&&CIN.on);try{if(RIG.vis&&!document.getElementById('rgBtn')){const st=document.getElementById('stage');if(st&&document.createElement){const b=document.createElement('button');b.id='rgBtn';b.setAttribute('aria-label','SG-3 fúróállomás');b.textContent='🗼';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();RIG.open()};st.appendChild(b)}}}catch(e){}})}
if(typeof document!=='undefined'&&document.addEventListener){let dn=null;document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv'||!RIG.hit)return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;if(W.ZM&&(ZM.t>1||ZM.z>1.02))return;
  const r=e.target.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top,H=RIG.hit;if(px>=H.x&&px<=H.x+H.w&&py>=H.y&&py<=H.y+H.h)RIG.open()},true)}
})(typeof window!=='undefined'?window:globalThis);
