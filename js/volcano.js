// Vulkánok a pálya két szélén (±1000 m): háttér-vulkán, lávamező, lávató-kürtő, magmavezeték + magmakamra
(function(W){
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),sm=u=>{u=cl(u,0,1);return u*u*(3-2*u)};
const rn=n=>((Math.sin(n*127.1)*43758.5)%1+1)%1;
const K=10,PAR=.12,VR=190,PIT=14,HOT=40,COND=6,CH_D=8500,CH_RX=650,CH_RY=420,TLAVA=1150,EDGE=1150;
const SITES=[
 {id:'R',x:1000,kind:'strato',name:'Tűzhegy',type:'rétegvulkán (sztratovulkán)',per:23,erup:8,off:3,wind:1},
 {id:'L',x:-1000,kind:'shield',name:'Lávapajzs',type:'pajzsvulkán',per:31,erup:12,off:11,wind:-1}];
const FACTS=[
 'A magma a felszín alatti olvadt kőzet; amint a felszínre ér, lávának nevezzük.',
 'A bazaltos láva 1100–1200 °C-os, híg és messzire folyik; a riolitos 700–850 °C-os, sűrű, ragacsos.',
 'Pajzsvulkán (pl. Mauna Loa): híg bazaltláva, lapos, széles hegy. Rétegvulkán (pl. Fuji, Vezúv): sűrű magma, meredek, robbanékony.',
 'A kitörést a magmában oldott gázok hajtják (főleg vízgőz, CO₂, SO₂): nyomáscsökkenéskor buborékokká tágulnak – mint a megrázott szénsavas üdítő.',
 'A vulkáni hamu apró üvegszilánk és kőzettörmelék; a kitörések erejét a VEI-skála méri 0-tól 8-ig.',
 'A piroklaszt-áram forró gáz és hamu keveréke, a lejtőn akár több száz km/h-val száguld – a vulkán legveszélyesebb jelensége.',
 'Lahar: vulkáni hamu és víz sárfolyama; a kitörés után még évekig veszélyes lehet.',
 'A vulkánok többsége lemezszegélyen (pl. Pacifikus Tűzgyűrű) vagy forrópont fölött (Hawaii) keletkezik.',
 'A magmakamra jellemzően 2–10 km mélyen van. Kitörés előtt földrengés-raj és a talaj kidomborodása jelezheti.',
 'Harmonikus tremor: a magma és a gázok mozgása által keltett folyamatos, szinte zümmögő talajrezgés.',
 'Magyarországon is voltak vulkánok: a Tokaj-hegyalja, a Mátra, a Börzsöny és a Balaton-felvidék (Badacsony) – ma már kihűltek.',
 'A láva felszíne gyorsan kihűl és kérget alkot; a kéreg alatt a láva lávacsőben folyhat tovább, szinte hőveszteség nélkül.',
 'Obszidián: gyorsan lehűlt, kristálytalan vulkáni üveg. A habkő gázzal teli, kis sűrűségű, ezért úszik a vízen.',
 'Az 1815-ös Tambora-kitörés (VEI 7) a légkörbe jutott kéngázok miatt az 1816-os „nyár nélküli évet” okozta.'];
const VOL={SITES,FACTS,VR,PIT,HOT,TLAVA,EDGE,t:0,vp:[],msgT:0,okShown:0,near:null,
 ens(){if(typeof S==='undefined')return{s:{}};if(!S.vl||typeof S.vl!=='object')S.vl={s:{}};if(!S.vl.s||typeof S.vl.s!=='object')S.vl.s={};return S.vl},
 gearOk(){try{return H[S.u.h][1]>=1200&&S.u.f>=3}catch(e){return false}},
 // kitörés-intenzitás 0..1 (idő alapján, determinisztikus)
 e(s,t){const p=((t||VOL.t)+s.off)%s.per;if(p>s.erup)return 0;const u=p/s.erup;return Math.pow(Math.sin(Math.PI*u),.7)},
 // helyi hőmérséklet (°C): vezeték, forró kőzet, magmakamra, lávamező sugárzása
 tm(x,d,base){let T=base||0;for(const s of SITES){const dx=Math.abs(x-s.x);
   if(d<8200){if(dx<COND)T=Math.max(T,TLAVA);else T=Math.max(T,TLAVA*Math.exp(-(dx-COND)/45)*(d<30?1:Math.min(1,(8200-d)/400)))}
   if(d<40&&dx<VR)T=Math.max(T,TLAVA*Math.exp(-Math.max(0,dx-PIT)/24));
   const r=Math.hypot((x-s.x)/CH_RX,(d-CH_D)/CH_RY);T=Math.max(T,r<1?1200:1200*Math.exp(-(r-1)*1.8))}
  return T},
 nearest(x){let b=null,bd=1e9;for(const s of SITES){const d=Math.abs(x-s.x);if(d<bd){bd=d;b=s}}return[b,bd]},
 // ---- játékszabályok: pálya széle, forró zóna belépési feltétele
 frame(dt){if(typeof S==='undefined')return;VOL.t+=dt;VOL.msgT=Math.max(0,VOL.msgT-dt);
  const[s,d]=VOL.nearest(S.x);VOL.near=d<450?s:null;
  if(VOL.near&&S.depth<5){const v=VOL.ens();if(!v.s[s.id]){v.s[s.id]=1;if(typeof msg==='function')msg('🌋 Vulkáni zóna: '+s.name+' ('+s.type+'). A Tudás fülön megtalálod a tudnivalókat.');if(typeof toast==='function')toast('🌋 '+s.name+' – '+s.type)}}
  if(S.depth<3&&Math.abs(S.x)>EDGE){S.x=Math.sign(S.x)*EDGE;if(S.st!=='idle'){S.st='idle';S.mode=''}if(VOL.msgT<=0){VOL.msgT=4;if(typeof toast==='function')toast('🏔 A pálya széle – tovább nem lehet menni a felszínen.')}}
  if(S.depth<3&&d<HOT){if(!VOL.gearOk()){const sg=Math.sign(S.x-s.x)||1;S.x=s.x+sg*(HOT+.5);if(S.st!=='idle'){S.st='idle';S.mode=''}
    if(VOL.msgT<=0){VOL.msgT=5;if(typeof msg==='function')msg('🌋 Túl forró! A láva ≈'+TLAVA+' °C. Ide csak Szintetikus gyémánt (vagy jobb) páncéllal és legalább Gyémántimpregnált fúrófejjel lehet bemenni.');if(typeof toast==='function')toast('🌋 Túl forró – jobb páncél és fúrófej kell!')}}
   else if(!VOL.okShown){VOL.okShown=1;if(typeof msg==='function')msg('🛡 A páncélod és a fúrófejed bírja a lávát – lemehetsz a vulkán kürtőjébe.')}}
  // kitöréskor és a kürtőnél: részecskék (kővel, lávabombával, hamuval)
  for(const st of SITES){const dx=Math.abs(S.x-st.x);if(dx>260||S.depth>40)continue;const e=VOL.e(st),n=dt*(8+60*e);let q=n;while(q>0){if(Math.random()<Math.min(1,q)&&VOL.vp.length<260){const a=(Math.random()-.5)*PIT*1.6,hv=12+Math.random()*(10+28*e);VOL.vp.push({x:st.x+a,y:0,vx:(Math.random()-.5)*(5+14*e),vy:-hv,l:1,t:'b',r:.25+Math.random()*(.4+.5*e)})}q--}
   if(Math.random()<dt*(5+16*e)&&VOL.vp.length<260)VOL.vp.push({x:st.x+(Math.random()-.5)*PIT,y:-1,vx:(Math.random()-.3)*(2+5*e)*st.wind,vy:-(3+Math.random()*5),l:1,t:'s',r:2+Math.random()*2})}
  for(const p of VOL.vp){if(p.t==='b'){p.vy+=9.8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*.12;if(p.y>0){p.l=0}}else{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy*=1-dt*.25;p.r+=dt*2.6;p.l-=dt*.2}}
  VOL.vp=VOL.vp.filter(p=>p.l>0)},
 // ---- háttér: a vulkán sziluettje (parallaxis), füst, kitörés, lávafolyások
 sky(V){const x=V.x,w=V.w,Ys=V.Ys,t=VOL.t,day=V.day;
  const hz=(typeof mix==='function')?mix('#101a3a','#aedcf5',day):'#8ab';
  for(const s of SITES){const dx=s.x-V.rx,prox=cl(1-Math.abs(dx)/1100,0,1),sc=.5+.7*prox,cx=V.cx+dx*K*PAR*(.6+.4*prox);
   const e=VOL.e(s,t),shield=s.kind==='shield',Hh=Math.min(Math.max(60,Ys-50),(shield?84:235)*sc),Wb=(shield?500:190)*sc;if(cx+Wb<-80||cx-Wb>w+80)continue;
   const prof=u=>{const a=Math.abs(u);if(shield)return Hh*Math.pow(1-a,1.35)*(1+.015*Math.sin(u*33));return Hh*Math.pow(1-a,1.6)*(1+.02*Math.sin(u*41)+.012*Math.sin(u*97))},cu=shield?.07:.05,cd=shield?.18:.12;
   const crY=y=>Ys-14-y;const N=70;
   x.save();x.beginPath();x.rect(0,0,w,Ys);x.clip();
   // test
   x.beginPath();x.moveTo(cx-Wb,Ys);for(let i=0;i<=N;i++){const u=-1+2*i/N,a=Math.abs(u);let h=prof(u);if(a<cu)h=Math.min(h,prof(cu))-(cu-a)/cu*Hh*cd*.5*(shield?.35:1)+Hh*.0;x.lineTo(cx+u*Wb,crY(h))}x.lineTo(cx+Wb,Ys);x.closePath();
   const gr=x.createLinearGradient(0,crY(Hh),0,Ys);const c1=(typeof mix==='function')?mix('#15111a','#3e3539',day*.7):'#322',c2=(typeof mix==='function')?mix('#221a20','#5c4e54',day*.75):'#544';
   gr.addColorStop(0,c1);gr.addColorStop(.55,c2);gr.addColorStop(1,(typeof mix==='function')?mix(c2,hz,.6):hz);x.fillStyle=gr;x.fill();
   // megvilágított oldal + árnyék
   x.save();x.clip();x.fillStyle=`rgba(255,235,200,${.07+.16*day})`;x.beginPath();x.moveTo(cx-Wb*.02,crY(Hh));x.lineTo(cx-Wb,Ys);x.lineTo(cx-Wb*.45,Ys);x.closePath();x.fill();x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.moveTo(cx+Wb*.02,crY(Hh));x.lineTo(cx+Wb,Ys);x.lineTo(cx+Wb*.4,Ys);x.closePath();x.fill();
   // rétegek és vízmosások
   x.strokeStyle='rgba(0,0,0,.22)';x.lineWidth=1;for(let i=0;i<18;i++){const u=-.95+i*.105+(rn(i+s.x)-.5)*.05,a=Math.abs(u);if(a<cu)continue;x.beginPath();x.moveTo(cx+u*Wb*.12,crY(Hh*.93));x.quadraticCurveTo(cx+u*Wb*.55+(rn(i)-.5)*10,crY(Hh*.45),cx+u*Wb,Ys);x.stroke()}
   x.strokeStyle='rgba(255,255,255,.05)';for(let i=1;i<6;i++){x.beginPath();x.moveTo(cx-Wb,crY(Hh*i/6));x.lineTo(cx+Wb,crY(Hh*i/6));x.stroke()}
   x.restore();
   // lávafolyások a lejtőn (additív izzás + áramló fényes foltok)
   const ncr=shield?3:4,kx0=cx,ky0=crY(prof(cu));for(let k=0;k<ncr;k++){const side=k%2?1:-1,ex=cx+side*Wb*((shield?.35:.18)+.2*rn(k*3+s.x)+k*.05),pts=[];for(let i=0;i<=28;i++){const f=i/28;pts.push([kx0+(ex-kx0)*Math.pow(f,1.15)+Math.sin(f*9+k*2+t*.25)*(shield?5:3)*Math.sin(f*3.14),ky0+(Ys-14-ky0)*f])}
    const inten=(shield?.75:.4)+.6*e;x.save();x.globalCompositeOperation='lighter';x.lineCap='round';x.lineJoin='round';
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle=`rgba(255,80,10,${.2*inten})`;x.lineWidth=9;x.stroke();x.strokeStyle=`rgba(255,120,20,${.55*inten})`;x.lineWidth=4;x.stroke();
    x.setLineDash([14,26]);x.lineDashOffset=-t*(30+10*k);x.strokeStyle=`rgba(255,230,120,${.75*inten})`;x.lineWidth=2.2;x.stroke();x.setLineDash([]);x.restore()}
   // kráter / kaldera izzása
   const kx=cx,ky=crY(prof(cu)),gl=x.createRadialGradient(kx,ky,0,kx,ky,(shield?48:36)*sc*(1+.5*e));gl.addColorStop(0,`rgba(255,${160+60*e|0},60,${.5+.3*e})`);gl.addColorStop(1,'rgba(255,60,0,0)');x.save();x.globalCompositeOperation='lighter';x.fillStyle=gl;x.fillRect(kx-110*sc,ky-110*sc,220*sc,220*sc);x.restore();
   if(shield){x.fillStyle=`rgba(255,${120+80*Math.abs(Math.sin(t*1.7))|0},30,.95)`;x.beginPath();x.ellipse(kx,ky-1,Wb*.07,3.2*sc,0,0,7);x.fill()}
   // füst és hamufelhő
   const wind=s.wind*(.5+.5*Math.sin(t*.05)),np=shield?14:22,spd=shield?.045:.06;
   for(let i=0;i<np;i++){const u=((t*spd+i/np)%1),hmax=(shield?170:330)*sc*(.55+.8*e),py=ky-u*hmax,px=kx+wind*u*u*(shield?160:260)*sc+Math.sin(u*7+i*1.7)*10*u*sc,r=(7+u*(shield?34:62))*sc*(1+.55*e),a=(1-u)*(.28+.62*e)*(shield?.7:1);
     const lit=sm(1-u*1.7)*(.15+.55*e);const col=(typeof mix==='function')?mix(mix('#3c3836','#8a8480',day*.5),'#ff7a2a',lit):'#555';
     const g2=x.createRadialGradient(px-r*.2,py-r*.2,0,px,py,r);g2.addColorStop(0,col);g2.addColorStop(1,'rgba(40,36,36,0)');x.globalAlpha=cl(a,0,.92);x.fillStyle=g2;x.beginPath();x.arc(px,py,r,0,7);x.fill()}
   x.globalAlpha=1;
   // villámlás a hamufelhőben (erős kitörésnél)
   if(!shield&&e>.55&&Math.sin(t*23+s.x)>.86){const bx=kx+wind*.4*200*sc,by=ky-120*sc;x.strokeStyle='rgba(255,250,210,.95)';x.lineWidth=1.6;x.beginPath();x.moveTo(bx,by);for(let i=1;i<7;i++)x.lineTo(bx+(rn(t*9+i)-.5)*26,by+i*13);x.stroke();x.fillStyle='rgba(255,255,230,.08)';x.fillRect(0,0,w,Ys)}
   x.restore()}},
 // ---- előtér: lávamező, lávató, repedések, fumarolák; föld alatt: magmavezeték és kamra
 ground(V){const x=V.x,w=V.w,h=V.h,Ys=V.Ys,t=VOL.t,day=V.day;
  for(const s of SITES){const X0=V.SX(s.x),e=VOL.e(s,t);
   if(Ys>-200&&Ys<h+40&&X0+VR*K>0&&X0-VR*K<w){
    // bazalt-talaj sáv (a fű helyett)
    for(let px=Math.max(0,Math.floor((X0-VR*K)/16)*16);px<Math.min(w,X0+VR*K);px+=16){const m=Math.abs(px+8-X0)/K,a=cl((VR-m)/70,0,1);if(a<=0)continue;x.fillStyle=`rgba(30,22,20,${a})`;x.fillRect(px,Ys-3,16,34);x.fillStyle=`rgba(10,8,8,${a*.5})`;x.fillRect(px,Ys+8,16,10)}
    // izzó repedések
    x.save();x.globalCompositeOperation='lighter';for(let i=0;i<46;i++){const m=(rn(i*3.1+s.x)-.5)*2*VR;if(Math.abs(m)<PIT+3)continue;const px=V.SX(s.x+m),a=cl((VR-Math.abs(m))/60,0,1);if(px<-20||px>w+20)continue;const fl=.55+.45*Math.sin(t*2.1+i*1.9);x.strokeStyle=`rgba(255,${70+90*fl|0},20,${a*(.35+.45*fl)})`;x.lineWidth=1.6;x.beginPath();let cx2=px,cy2=Ys-2;x.moveTo(cx2,cy2);for(let j=0;j<4;j++){cx2+=(rn(i*7+j)-.5)*14;cy2+=6+rn(i+j*9)*5;x.lineTo(cx2,cy2)}x.stroke()}x.restore();
    // kövek, szikla
    for(let i=0;i<40;i++){const m=(rn(i*5.7+s.x)-.5)*2*(VR-10);if(Math.abs(m)<PIT+4)continue;const px=V.SX(s.x+m);if(px<-20||px>w+20)continue;const r=(.35+rn(i*2.3)*.9)*K;x.fillStyle=i%3?'#2a2220':'#3a302c';x.beginPath();x.ellipse(px,Ys-2,r,r*.55,0,Math.PI,0);x.fill()}
    // lávafolyás a talajon mindkét irányba (lassan előrenyomul, kitörésnél tovább)
    const Lf=75+35*Math.sin(t*.07+s.x)+60*e;
    for(const sg of[-1,1]){const pts=[];const n=40;for(let i=0;i<=n;i++){const f=i/n,m=PIT*.8+f*Lf,hh=(1.7*(1-f*f*.9)+.22*Math.sin(m*.8-t*2.2+sg)+.15*Math.sin(m*1.9+t))*K*(f>.93?(1-f)/.07:1);pts.push([V.SX(s.x+sg*m),Ys-3-Math.max(0,hh)])}
     const xa=pts[0][0],xb=pts[n][0];if(Math.max(xa,xb)<0||Math.min(xa,xb)>w)continue;
     x.beginPath();x.moveTo(pts[0][0],Ys-3);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(pts[n][0],Ys-3);x.closePath();
     const g=x.createLinearGradient(0,Ys-3-1.9*K,0,Ys-3);g.addColorStop(0,'#2a1208');g.addColorStop(.25,'#b8380c');g.addColorStop(.7,'#ff7a1a');g.addColorStop(1,'#ffb43a');x.fillStyle=g;x.fill();
     // kéreg és áramló fényes sávok
     x.save();x.clip();x.globalCompositeOperation='lighter';for(let i=0;i<22;i++){const f=((i/22+t*.04*(.4+e))%1),px=V.SX(s.x+sg*(PIT+f*Lf)),wd=(4+rn(i)*14);x.fillStyle=`rgba(255,${150+rn(i+2)*90|0},40,${.2+.16*Math.sin(t*3+i)})`;x.beginPath();x.ellipse(px,Ys-3-(.25+rn(i+7)*1.2)*K,wd*1.4,K*(.12+.16*rn(i)),0,0,7);x.fill()}x.restore();
     x.fillStyle='rgba(20,8,4,.75)';for(let i=0;i<18;i++){const f=rn(i*4.1+sg)*.95,px=V.SX(s.x+sg*(PIT+f*Lf)+Math.sin(t*.1+i)*.8),py=Ys-3-(.5+rn(i)*1.4)*K*(1-f*.8);x.beginPath();x.ellipse(px,py,(1+rn(i+1)*2.2)*K*.5,(.25+rn(i+3)*.3)*K*.5,0,0,7);x.fill()}
     // a lávacsúcs forró fénye
     x.save();x.globalCompositeOperation='lighter';const gx=pts[n][0],gg=x.createRadialGradient(gx,Ys-8,0,gx,Ys-8,5*K);gg.addColorStop(0,'rgba(255,110,20,.4)');gg.addColorStop(1,'rgba(255,60,0,0)');x.fillStyle=gg;x.fillRect(gx-5*K,Ys-8-5*K,10*K,10*K);x.restore()}
    // lávató a kürtő fölött (a talajszint alatt nyitott gödör)
    {const a=X0-PIT*K,b=X0+PIT*K,dep=7*K,ca=X0-COND*K,cb=X0+COND*K;if(b>0&&a<w){x.save();
      // tölcsér alakú kürtő: sötét bazaltfal
      x.fillStyle='#1a1210';x.beginPath();x.moveTo(a-10,Ys-6);x.lineTo(b+10,Ys-6);x.lineTo(b+10,Ys+dep+6);x.lineTo(a-10,Ys+dep+6);x.closePath();x.fill();
      x.beginPath();x.moveTo(a,Ys+1);x.lineTo(b,Ys+1);x.lineTo(cb,Ys+dep);x.lineTo(ca,Ys+dep);x.closePath();x.save();x.clip();
      const lg=x.createLinearGradient(0,Ys,0,Ys+dep);lg.addColorStop(0,'#ffd062');lg.addColorStop(.4,'#ff8a22');lg.addColorStop(1,'#c03a0c');x.fillStyle=lg;x.fillRect(a,Ys,b-a,dep+2);
      x.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const px=a+rn(i*3.3)*(b-a),py=Ys+4+((t*(12+rn(i)*18)+i*37)%(dep-4));x.fillStyle=`rgba(255,${170+rn(i)*70|0},70,.38)`;x.beginPath();x.ellipse(px,py,6+rn(i+1)*14,1.4,0,0,7);x.fill()}
      for(let i=0;i<8;i++){const ph=((t*(.55+rn(i)*.5)+rn(i*9))%1),px=a+(.12+.76*rn(i*7.7))*(b-a),r=(.2+1.0*ph)*K*.5;x.strokeStyle=`rgba(255,240,170,${(1-ph)*.85})`;x.lineWidth=1.5;x.beginPath();x.ellipse(px,Ys+4+rn(i)*8,r,r*.4,0,0,7);x.stroke()}
      x.restore();
      // lávafelszín hullámzása
      x.fillStyle='rgba(255,210,100,.5)';x.beginPath();x.moveTo(a,Ys+2);for(let px=a;px<=b;px+=4)x.lineTo(px,Ys+2+Math.sin(px*.13+t*3.1)*1.6+Math.sin(px*.29-t*2.3)*1.1);x.lineTo(b,Ys+5);x.lineTo(a,Ys+5);x.closePath();x.fill();
      // sötét, repedezett perem
      x.fillStyle='#2e231e';x.beginPath();x.ellipse(a-3,Ys-2,9,6,0,Math.PI,0);x.ellipse(b+3,Ys-2,9,6,0,Math.PI,0);x.fill();x.fillStyle='#3a2d26';x.beginPath();x.ellipse(a-14,Ys-2,6,3.5,0,Math.PI,0);x.ellipse(b+14,Ys-2,6,3.5,0,Math.PI,0);x.fill();
      x.globalCompositeOperation='lighter';const hg=x.createRadialGradient(X0,Ys,0,X0,Ys,16*K);hg.addColorStop(0,`rgba(255,120,30,${.5+.2*e})`);hg.addColorStop(1,'rgba(255,60,0,0)');x.fillStyle=hg;x.fillRect(X0-16*K,Ys-16*K,32*K,32*K);x.restore()}}
    // fumarolák (kénkiválással)
    for(let i=0;i<7;i++){const m=(rn(i*11.3+s.x)>.5?1:-1)*(28+rn(i*2.9)*(VR-50)),px=V.SX(s.x+m);if(px<-30||px>w+30)continue;x.fillStyle='#d8c860';x.beginPath();x.ellipse(px,Ys-2,7,2.6,0,Math.PI,0);x.fill();x.fillStyle='#8a7a28';x.beginPath();x.ellipse(px+3,Ys-2,3,1.4,0,Math.PI,0);x.fill();
      for(let j=0;j<5;j++){const u=((t*.35+j/5+i*.13)%1),py=Ys-4-u*70,qx=px+Math.sin(u*5+i)*6+u*18*s.wind,r=3+u*13;x.globalAlpha=(1-u)*.34;x.fillStyle=day>.4?'#d9d6cf':'#8a8a92';x.beginPath();x.arc(qx,py,r,0,7);x.fill()}x.globalAlpha=1}
   }
   // ---- föld alatt: magmavezeték + magmakamra
   const yTop=Math.max(0,Ys),vis=V.SY(CH_D-CH_RY*1.2)>0||true;
   x.save();x.beginPath();x.rect(0,yTop,w,h-yTop);x.clip();
   const cw=COND*K,xa=X0-cw,xb=X0+cw;
   if(xb>-300&&xa<w+300){
    // forró kőzet-glória a vezeték körül
    const yb=V.SY(8100);x.save();x.globalCompositeOperation='lighter';const hg=x.createLinearGradient(xa-45*K,0,xb+45*K,0);hg.addColorStop(0,'rgba(255,70,10,0)');hg.addColorStop(.42,'rgba(255,90,20,.20)');hg.addColorStop(.5,'rgba(255,120,30,.34)');hg.addColorStop(.58,'rgba(255,90,20,.20)');hg.addColorStop(1,'rgba(255,70,10,0)');x.fillStyle=hg;x.fillRect(xa-45*K,Math.max(yTop,Ys),xb-xa+90*K,Math.min(h,yb)-Math.max(yTop,Ys));x.restore();
    // maga a vezeték
    const y0=Math.max(yTop,Ys+7*K*0),y1=Math.min(h,yb);if(y1>y0){const lg=x.createLinearGradient(xa,0,xb,0);lg.addColorStop(0,'#5a1a08');lg.addColorStop(.2,'#e0501a');lg.addColorStop(.5,'#ffb43a');lg.addColorStop(.8,'#e0501a');lg.addColorStop(1,'#5a1a08');x.fillStyle=lg;x.fillRect(xa,y0,xb-xa,y1-y0);
     x.save();x.beginPath();x.rect(xa,y0,xb-xa,y1-y0);x.clip();x.globalCompositeOperation='lighter';
     for(let i=0;i<60;i++){const px=xa+rn(i*2.7)*(xb-xa),sp=24+rn(i)*44,py=((-t*sp*(1+e)+i*131)%(y1-y0+60)+(y1-y0+60))%(y1-y0+60)+y0-30;x.fillStyle=`rgba(255,${190+rn(i+3)*60|0},90,.35)`;x.fillRect(px,py,3+rn(i+4)*5,10+rn(i+5)*26)}
     for(let i=0;i<22;i++){const f=rn(i*5.1),px=xa+f*(xb-xa),py=((-t*(20+rn(i)*30)+i*97)%(y1-y0)+(y1-y0))%(y1-y0)+y0,r=1.5+rn(i+8)*3.5;x.strokeStyle='rgba(255,245,190,.55)';x.lineWidth=1;x.beginPath();x.arc(px,py,r,0,7);x.stroke()}x.restore();
     x.fillStyle='rgba(20,8,4,.7)';x.fillRect(xa-2,y0,3,y1-y0);x.fillRect(xb-1,y0,3,y1-y0)}
    // fénypontok a sötétségi rétegbe
    for(let yy=0;yy<h+200;yy+=220){if(yy<y1+100&&yy>y0-100)V.GL.push({x:X0,y:yy,r:300,c:'255,120,30',i:.5})}}
   // magmakamra
   const cyy=V.SY(CH_D),ry=CH_RY*K,rx=CH_RX*K;if(cyy+ry>yTop&&cyy-ry<h&&X0+rx>0&&X0-rx<w){
    x.save();x.globalCompositeOperation='lighter';const og=x.createRadialGradient(X0,cyy,0,X0,cyy,rx*1.7);og.addColorStop(0,'rgba(255,120,30,.55)');og.addColorStop(.6,'rgba(255,70,10,.18)');og.addColorStop(1,'rgba(255,60,0,0)');x.save();x.translate(X0,cyy);x.scale(1,ry/rx);x.translate(-X0,-cyy);x.fillStyle=og;x.fillRect(X0-rx*1.8,cyy-rx*1.8,rx*3.6,rx*3.6);x.restore();x.restore();
    x.beginPath();for(let i=0;i<=60;i++){const a=i/60*6.2832,j=1+.04*Math.sin(a*5+.7)+.03*Math.sin(a*9);const px=X0+Math.cos(a)*rx*j,py=cyy+Math.sin(a)*ry*j;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();
    const cg=x.createRadialGradient(X0,cyy-ry*.2,0,X0,cyy,rx);cg.addColorStop(0,'#fff0a0');cg.addColorStop(.35,'#ffa030');cg.addColorStop(.8,'#e0501a');cg.addColorStop(1,'#6a1a08');x.fillStyle=cg;x.fill();
    x.save();x.clip();x.globalCompositeOperation='lighter';x.strokeStyle='rgba(255,230,140,.25)';x.lineWidth=2;for(let k=0;k<6;k++){x.beginPath();for(let i=0;i<=40;i++){const a=i/40*6.2832*1.3+t*(.12+k*.02),rr=rx*(.12+k*.14);const px=X0+Math.cos(a)*rr,py=cyy+Math.sin(a)*rr*ry/rx;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
    for(let i=0;i<40;i++){const px=X0+(rn(i*3.7)-.5)*rx*1.6,py=cyy+(rn(i*5.1)-.5)*ry*1.5-((t*(12+rn(i)*20))%(ry*.7)),r=2+rn(i+9)*7;x.strokeStyle='rgba(255,250,200,.5)';x.beginPath();x.arc(px,py,r,0,7);x.stroke()}x.restore();
    V.GL.push({x:X0,y:cyy,r:Math.min(900,rx),c:'255,110,30',i:.8})}
   x.restore()}},
 // ---- előtér részecskék (lávabombák, szikrák, kürtő-füst)
 front(V){if(!VOL.vp.length)return;const x=V.x,Ys=V.Ys;if(Ys>V.h+50||Ys<-3000)return;x.save();
  for(const p of VOL.vp){const X=V.SX(p.x),Y=V.SY(p.y);if(X<-40||X>V.w+40||Y<-60||Y>V.h+40)continue;
   if(p.t==='b'){const c=p.l;x.globalCompositeOperation='lighter';const r=p.r*K*.45;x.fillStyle=`rgba(255,${100+130*c|0},${30+50*c|0},${.12+.22*c})`;x.beginPath();x.arc(X,Y,r*1.7,0,7);x.fill();x.globalCompositeOperation='source-over';x.fillStyle=c>.45?'#ffcf5a':'#c8401a';x.beginPath();x.arc(X,Y,r,0,7);x.fill();x.strokeStyle=`rgba(255,150,40,${.35*c})`;x.lineWidth=r*.8;x.beginPath();x.moveTo(X,Y);x.lineTo(X-p.vx*K*.05,Y-p.vy*K*.05);x.stroke()}
   else{const g=x.createRadialGradient(X,Y,0,X,Y,p.r*K*.5);g.addColorStop(0,`rgba(${p.l>.6?'70,50,44':'90,86,86'},${.5*p.l})`);g.addColorStop(1,'rgba(60,56,56,0)');x.fillStyle=g;x.fillRect(X-p.r*K*.5,Y-p.r*K*.5,p.r*K,p.r*K)}}
  x.restore()},
 // ---- képernyő-kijelző: közelség, tudományos tény, belépési feltétel
 hud(V){const s=VOL.near;if(!s||typeof S==='undefined'||S.depth>40)return;const x=V.x,w=V.w,d=Math.abs(S.x-s.x),bw=Math.min(w-24,340),bx=(w-bw)/2,ok=VOL.gearOk();
  const fact=FACTS[Math.floor(VOL.t/9)%FACTS.length];
  x.save();x.font='11px Georgia';const words=fact.split(' '),lines=[];let cur='';for(const wd of words){const tt=cur?cur+' '+wd:wd;if(x.measureText(tt).width>bw-20){lines.push(cur);cur=wd}else cur=tt}lines.push(cur);const L=lines.slice(0,3);
  const bh=44+L.length*13+4,by=Math.max(40,(V.h||600)-bh-50);x.fillStyle='rgba(26,12,6,.82)';x.beginPath();if(x.roundRect)x.roundRect(bx,by,bw,bh,9);else x.rect(bx,by,bw,bh);x.fill();x.strokeStyle='rgba(255,140,40,.7)';x.lineWidth=1;x.stroke();
  x.fillStyle='#ffb050';x.font='bold 12px Georgia';x.textAlign='left';x.fillText('🌋 '+s.name+' – '+s.type,bx+9,by+16);
  x.font='11px Georgia';x.fillStyle='#e8d8c0';x.fillText('Távolság: '+Math.round(d)+' m · láva ≈ '+TLAVA+' °C',bx+9,by+31);
  x.fillStyle=ok?'#6fe08a':'#ff7a60';x.textAlign='right';x.fillText((ok?'✔ ':'✖ ')+'páncél ≥1200 °C, fej ≥ gyémánt',bx+bw-9,by+31);x.textAlign='left';
  x.fillStyle='#d8c9b0';L.forEach((l,i)=>x.fillText(l,bx+9,by+48+i*13));x.restore()},
 // ---- Tudás fül
 html(){const v=VOL.ens();const seen=Object.keys(v.s);if(!seen.length&&!(typeof S!=='undefined'&&S.max>5e3))return'<div class="card"><b>🌋 Vulkánok</b><br><span class="mu">Menj el a pálya szélére (kb. ±1000 m a felszínen), és felfedezheted őket.</span></div>';
  return`<div class="card" style="border-left:6px solid #e0501a"><b>🌋 Vulkánok</b><br><span class="mu">Két tűzhányó áll a pálya szélén: <b>Tűzhegy</b> (jobbra, +1000 m, rétegvulkán) és <b>Lávapajzs</b> (balra, −1000 m, pajzsvulkán). A kürtőjükbe csak Szintetikus gyémánt (vagy jobb) páncéllal (hőtűrés ≥ ${TLAVA+50} °C) és legalább Gyémántimpregnált fúrófejjel lehet lemenni. A kürtő ≈ 8 km mélyen magmakamrába vezet (≈ 1200 °C).</span></div>`+FACTS.map(f=>`<div class="card" style="border-left:6px solid #8a5030"><span class="mu">${f}</span></div>`).join('')}};
W.VOL=VOL;
// integráció: hőmérséklet, fúrófej-kopás
VOL.hook=()=>{if(W.BIT&&!BIT._vol){BIT._vol=1;const w=BIT.wear;BIT.wear=(d,L)=>{const T=VOL.tm(S.x,S.depth,0);return w.call(BIT,d*(T>500?1+(T-500)/600:1),L)}}};VOL.hook();
if(typeof on==='function'){on('frame',dt=>{try{VOL.hook();VOL.frame(Math.min(dt,.1))}catch(e){DBG.err='vol: '+e.message}});on('world.sky',V=>{try{VOL.sky(V)}catch(e){DBG.err='volsky: '+e.message}});on('world.back',V=>{try{VOL.ground(V)}catch(e){DBG.err='volgr: '+e.message}});on('world.front',V=>{try{VOL.front(V)}catch(e){}});on('hud',V=>{try{VOL.hud(V)}catch(e){}})}
})(typeof window!=='undefined'?window:globalThis);
