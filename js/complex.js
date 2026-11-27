/* Drill Up – M.E.D.V.E. ipari komplexum (1. szakasz): parallax háttér, összefüggő kültér, Irányítóközpont és Alkatrészraktár.
   Stílus: oldalnézeti 2D, erős kontúr, cel-shading (sík szín + árnyék- és fénysáv), acél–beton–rozsda, sárga-fekete jelölés,
   hideg kék éjszaka, meleg ipari fények. Az épületek statikus része egyszer, gyorsítótárba rajzolódik (méterben, px/m skálán);
   képkockánként csak a mozgó elemek: radar, monitorok, futódaru, targonca, villogók, füst, ventilátorok.
   Funkció: Irányítóközpont → küldetések (napi/heti kihívások); Alkatrészraktár → Raktár nézet. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('complex');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),OL='#0b0d10';
const CC={x:68,w:16,h:13.6},WH={x:92,w:30,h:11},YARD={x:124,w:16};
const CX={hit:[],cache:{},tiles:{}};
// ---------- segédek (méterben rajzolunk) ----------
function R(c,x,y,w,h,f,lw){c.fillStyle=f;c.fillRect(x,y,w,h);if(lw!==0){c.lineWidth=lw||.12;c.strokeStyle=OL;c.strokeRect(x,y,w,h)}}
function hazard(c,x,y,w,h){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle='#f2b705';c.fillRect(x,y,w,h);c.fillStyle='#16181b';for(let i=-2;i<w/h*2+2;i++){c.beginPath();c.moveTo(x+i*h,y+h);c.lineTo(x+i*h+h*.5,y+h);c.lineTo(x+i*h+h*1.5,y);c.lineTo(x+i*h+h,y);c.closePath();c.fill()}c.restore();c.lineWidth=.08;c.strokeStyle=OL;c.strokeRect(x,y,w,h)}
function rivets(c,x0,x1,y,step){c.fillStyle='rgba(255,255,255,.35)';for(let x=x0;x<=x1;x+=step){c.beginPath();c.arc(x,y,.06,0,7);c.fill()}}
function sprite(key,wm,hm,pad,fn){const K=10,dp=Math.min(2,W.devicePixelRatio||1),k=key+'@'+dp;let s=CX.cache[k];if(s)return s;
 s=document.createElement('canvas');s.width=Math.ceil((wm+pad*2)*K*dp);s.height=Math.ceil((hm+pad)*K*dp);const c=s.getContext('2d');c.scale(K*dp,K*dp);c.translate(pad,hm);c.lineJoin='round';fn(c);s.pad=pad;s.hm=hm;s.wm=wm;CX.cache[k]=s;return s}
function blit(x,V,s,wx){const K=V.K||10,sx=V.SX(wx)-s.pad*K;x.drawImage(s,sx,V.Ys-s.hm*K,(s.wm+s.pad*2)*K,(s.hm+s.pad)*K)}

// ---------- IRÁNYÍTÓKÖZPONT (statikus) ----------
function ccStatic(c){const w=CC.w,h=CC.h;
 R(c,-.4,-.7,w+.8,.7,'#5b5f66');hazard(c,-.4,-.25,w+.8,.25);
 // váz és homlokzat
 R(c,0,-h,w,h,'#2e343c');c.fillStyle='rgba(255,255,255,.07)';c.fillRect(0,-h,.6,h);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(w-1.3,-h,1.3,h);
 // födémek
 for(const y of[-4.4,-9])R(c,-.25,y-.4,w+.5,.4,'#4a5059');
 // földszint: bejárat, recepció, tábla
 R(c,1.2,-3.6,2.6,3.6-.7,'#17202b');R(c,1.35,-3.45,1.1,2.75,'#a9d6ff',.06);R(c,2.55,-3.45,1.1,2.75,'#a9d6ff',.06);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(1.45,-3.35,.2,2.5);
 R(c,5,-3.4,9.6,2.2,'#0e1621');for(let i=0;i<4;i++){R(c,5.3+i*2.35,-3.15,2,1.7,'#1c2a3a',.06)}
 R(c,4.6,-4.3,10.4,.75,'#1d4f9a');c.fillStyle='#fff';c.font='bold .52px Georgia';c.textAlign='center';c.fillText('IRÁNYÍTÓKÖZPONT',9.8,-3.75);c.font='.3px Georgia';c.fillStyle='#bfe1ff';c.fillText('ДИСПЕТЧЕРСКАЯ',2.5,-3.85);
 // 1. emelet: irányítóterem (belső tér az ablaksávon át)
 R(c,.7,-8.6,w-1.4,3.9,'#0c1420');R(c,.7,-8.6,w-1.4,.25,'#1a2533',0);
 R(c,1.4,-8.2,13.2,2.2,'#111b29',.06); // monitorfal kerete (a tartalom animált)
 for(let i=0;i<5;i++){R(c,1.2+i*2.85,-5.6,2.3,.55,'#39424e',.08);R(c,1.4+i*2.85,-5.05,.2,.4,'#2b3139',0);R(c,3.1+i*2.85,-5.05,.2,.4,'#2b3139',0)}
 c.fillStyle='#0a0d12';for(const px of[2.4,5.3,8.1,11,13.8]){c.beginPath();c.arc(px,-6.05,.28,0,7);c.fill();c.fillRect(px-.32,-5.85,.64,.55)}
 // ablakosztás
 c.strokeStyle='#5d6670';c.lineWidth=.16;for(let i=0;i<=6;i++){const px=.7+i*(w-1.4)/6;c.beginPath();c.moveTo(px,-8.6);c.lineTo(px,-4.7);c.stroke()}c.strokeRect(.7,-8.6,w-1.4,3.9);
 // 2. emelet: üvegezett megfigyelő
 R(c,1.4,-12.9,w-2.8,3.6,'#13243a');c.fillStyle='rgba(160,210,255,.18)';c.beginPath();c.moveTo(1.4,-12.9);c.lineTo(4,-12.9);c.lineTo(1.4,-10.4);c.fill();
 R(c,2.2,-10.6,4,.5,'#39424e',.07);R(c,9.5,-10.6,4,.5,'#39424e',.07);
 c.strokeStyle='#8a939d';c.lineWidth=.12;for(let i=0;i<=8;i++){const px=1.4+i*(w-2.8)/8;c.beginPath();c.moveTo(px,-12.9);c.lineTo(px,-9.3);c.stroke()}c.strokeRect(1.4,-12.9,w-2.8,3.6);
 // tető: párkány, klíma, árbocok talpa
 R(c,-.2,-h-.4,w+.4,.45,'#4a5059');R(c,10.8,-h-1.7,3.6,1.3,'#6b727c');for(let i=0;i<3;i++){c.strokeStyle=OL;c.lineWidth=.06;c.beginPath();c.arc(11.6+i*1.05,-h-1.05,.42,0,7);c.stroke()}
 R(c,2.4,-h-1,.35,1,'#3a3f46');R(c,7.2,-h-.8,1.4,.4,'#3a3f46');
 // külső lépcsőtorony + korlát a jobb oldalon
 R(c,w,-9,1.6,9-.7,'#3b4148');c.strokeStyle='#f2b705';c.lineWidth=.1;for(let y=-1;y>-9;y-=1.4){c.beginPath();c.moveTo(w,y);c.lineTo(w+1.6,y-1.4);c.stroke()}
 rivets(c,.3,w-.3,-4.55,.8);rivets(c,.3,w-.3,-9.15,.8)}
// ---------- ALKATRÉSZRAKTÁR (statikus) ----------
function whStatic(c){const w=WH.w,h=WH.h,cut=12;
 R(c,-.5,-.6,w+1,.6,'#5b5f66');
 // fűrészfogas tető (bevilágító üvegsávokkal)
 for(let i=0;i<5;i++){const x0=i*w/5,x1=(i+1)*w/5;c.fillStyle='#3f454d';c.beginPath();c.moveTo(x0,-h);c.lineTo(x1,-h);c.lineTo(x1,-h-2.2);c.closePath();c.fill();c.strokeStyle=OL;c.lineWidth=.12;c.stroke();
  c.fillStyle='#9fd0f0';c.fillRect(x1-.35,-h-2.1,.3,2.05)}
 // hátsó fal (a belső térben) + zárt homlokzat balra
 R(c,cut,-h,w-cut,h,'#1f242a');c.fillStyle='rgba(255,210,120,.06)';c.fillRect(cut,-h,w-cut,h);
 R(c,0,-h,cut,h,'#59606a');c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.05;for(let x=.4;x<cut;x+=.4){c.beginPath();c.moveTo(x,-h);c.lineTo(x,-.6);c.stroke()}
 c.fillStyle='rgba(140,70,30,.35)';for(let i=0;i<8;i++){c.fillRect((i*1.37)%cut,-1.4-(i%3)*.5,.25,.9+(i%2)*.6)} // rozsdafolyások
 c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,-h,.5,h);
 // gördülőkapu (félig nyitva, mögötte sötét belső)
 R(c,1.6,-7.2,8,6.6,'#0d1014');c.fillStyle='#7a828c';c.fillRect(1.6,-7.2,8,3.6);c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=.06;for(let y=-7.1;y<-3.6;y+=.3){c.beginPath();c.moveTo(1.6,y);c.lineTo(9.6,y);c.stroke()}c.lineWidth=.12;c.strokeStyle=OL;c.strokeRect(1.6,-7.2,8,6.6);
 hazard(c,1.6,-3.75,8,.18);R(c,1.3,-7.6,8.6,.4,'#3a3f46');
 R(c,.8,-10.2,10.4,1.2,'#e07a1a');c.fillStyle='#16181b';c.font='bold .62px Georgia';c.textAlign='center';c.fillText('ALKATRÉSZRAKTÁR',6,-9.4);c.font='.3px Georgia';c.fillStyle='#2a1a08';c.fillText('СКЛАД ЗАПЧАСТЕЙ',6,-9.05);
 // belső: magas polcrendszer ládákkal, raklapok
 const cols=['#c7742a','#3c6e9e','#7b8a3a','#a33a2a','#c9a24a','#5d6670'];
 for(let r=0;r<3;r++){const y=-1-r*3.1;for(let b=0;b<3;b++){const bx=cut+1+b*5.6;R(c,bx,y-.2,5,.2,'#f2b705',.06);
   for(let k=0;k<4;k++){const ci=(r*7+b*3+k)%cols.length,bh=1.2+((r+b+k)%3)*.35;R(c,bx+.2+k*1.2,y-.2-bh,1,bh,cols[ci],.07);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(bx+.2+k*1.2,y-.2-bh,1,.12)}}}
 for(let b=0;b<=3;b++){R(c,cut+.8+b*5.6,-10,.22,9.4,'#2f6fb0',.06)}
 // darupálya (sín a tető alatt)
 R(c,cut,-10.2,w-cut,.35,'#d8a400');rivets(c,cut+.3,w-.3,-10.02,.9);
 // padlójelölés
 c.fillStyle='#f2b705';for(let x=cut+.3;x<w;x+=1.2)c.fillRect(x,-.62,.6,.06);
 // a vágás éle: vastag acél profil + kontúr
 R(c,cut-.2,-h,.4,h,'#2b3036');c.lineWidth=.14;c.strokeStyle=OL;c.strokeRect(0,-h,w,h-.6);
 // tetőventilátorok házai
 for(const vx of[4,8])R(c,vx-.7,-h-2.9,1.4,.7,'#6b727c')}
// ---------- konténerudvar + rakodórámpa (statikus) ----------
function yardStatic(c){const cs=[['#c9562a','МЕДВЕ'],['#2f6fb0','M.E.D.V.E.'],['#6b7448',''],['#9aa1aa','СГ-3']];
 R(c,-.3,-1.1,6.5,1.1,'#5b5f66');hazard(c,-.3,-1.1,6.5,.2);for(let i=0;i<3;i++)R(c,.3+i*2,-2.4,1.6,1.3,'#8a6a3a',.07); // rámpa + raklapok
 const box=(x,y,w,h,col,t)=>{R(c,x,y,w,h,col);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.05;for(let px=x+.25;px<x+w;px+=.35){c.beginPath();c.moveTo(px,y+.15);c.lineTo(px,y+h-.15);c.stroke()}
  c.fillStyle='rgba(255,255,255,.15)';c.fillRect(x,y,w,.15);if(t){c.fillStyle='rgba(255,255,255,.85)';c.font='bold .42px Georgia';c.textAlign='center';c.fillText(t,x+w/2,y+h/2+.15)}};
 box(7,-2.6,6.1,2.6,cs[0][0],cs[0][1]);box(13.3,-2.6,6.1,2.6,cs[1][0],cs[1][1]);box(9.5,-5.2,6.1,2.6,cs[2][0],cs[2][1]);box(14.8,-5.2,1.5+3.4,2.6,cs[3][0],cs[3][1])}

// ---------- parallax háttér (csempék, napszak szerint) ----------
const mixC=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
function tile(layer,day,hgt){const db=Math.round(day*8)/8,key=layer+'|'+db+'|'+hgt;let t=CX.tiles[key];if(t)return t;for(const k in CX.tiles)if(k.startsWith(layer+'|'))delete CX.tiles[k];
 const TW=1200,dp=Math.min(1.5,W.devicePixelRatio||1);t=document.createElement('canvas');t.width=TW*dp;t.height=hgt*dp;const c=t.getContext('2d');c.scale(dp,dp);t.tw=TW;t.th=hgt;
 if(layer==='mt'){c.fillStyle=mixC('#0c1428','#5a6f8c',db);c.beginPath();c.moveTo(0,hgt);for(let x=0;x<=TW;x+=20){const y=hgt*(.28+.22*Math.sin(x*.009)+.12*Math.sin(x*.023+1)+.05*Math.sin(x*.07));c.lineTo(x,y)}c.lineTo(TW,hgt);c.fill();
  c.fillStyle=mixC('#2a3448','#eef4fa',db);for(let x=0;x<=TW;x+=20){const y=hgt*(.28+.22*Math.sin(x*.009)+.12*Math.sin(x*.023+1)+.05*Math.sin(x*.07));if(y<hgt*.3){c.beginPath();c.moveTo(x-9,y+8);c.lineTo(x,y);c.lineTo(x+9,y+8);c.fill()}}}
 else if(layer==='fo'){c.fillStyle=mixC('#07120d','#2f5a34',db);c.fillRect(0,hgt*.72,TW,hgt*.28);for(let x=0;x<TW;x+=7){const th=hgt*(.18+.22*((Math.sin(x*1.7)+1)/2));c.beginPath();c.moveTo(x-5,hgt*.78);c.lineTo(x,hgt*.78-th);c.lineTo(x+5,hgt*.78);c.fill()}}
 else{ // ipari sziluettek: kémények, hűtőtorony, daru, gyárcsarnokok
  c.fillStyle=mixC('#0b0e14','#4b5563',db);const G=hgt;
  for(let i=0;i<6;i++){const bx=40+i*200;c.fillRect(bx,G*.62,120,G*.38);for(let s=0;s<4;s++){c.beginPath();c.moveTo(bx+s*30,G*.62);c.lineTo(bx+s*30+30,G*.62);c.lineTo(bx+s*30+30,G*.54);c.fill()}
   c.fillRect(bx+130,G*.2,9,G*.8);if(i%2===0){c.beginPath();c.moveTo(bx+150,G);c.quadraticCurveTo(bx+160,G*.6,bx+156,G*.38);c.lineTo(bx+186,G*.38);c.quadraticCurveTo(bx+182,G*.6,bx+192,G);c.fill()}
   if(i%3===1){c.fillRect(bx-20,G*.15,4,G*.85);c.fillRect(bx-60,G*.15,70,3)}}}
 CX.tiles[key]=t;return t}
function para(V){const x=V.x,w=V.w,Ys=V.Ys,K=V.K||10,day=V.day;if(Ys<40)return;
 const layers=[['mt',.08,Math.min(170,Ys*.7)],['ind',.22,Math.min(110,Ys*.45)],['fo',.38,Math.min(60,Ys*.3)]];
 for(const[l,f,hgt]of layers){if(hgt<12)continue;const t=tile(l,day,Math.round(hgt));let off=-((V.rx*K*f)%t.tw);if(off>0)off-=t.tw;for(let ox=off;ox<w;ox+=t.tw)x.drawImage(t,ox,Ys-t.th,t.tw,t.th)}
 // ipari füst és légiakadály-fények a sziluett kéményein
 const f=.22,hI=Math.min(110,Ys*.45),tw=1200,base=-((V.rx*K*f)%tw);
 for(let ox=base-tw;ox<w+tw;ox+=tw)for(let i=0;i<6;i++){const cxp=ox+40+i*200+134,cy=Ys-hI+hI*.2;if(cxp<-40||cxp>w+40)continue;
  for(let k=0;k<4;k++){const ph=((V.ts/5200)+k/4+i*.13)%1;x.fillStyle=`rgba(${day>.5?'200,200,205':'90,92,100'},${(.35*(1-ph)).toFixed(3)})`;x.beginPath();x.arc(cxp+ph*26,cy-ph*34,3+ph*11,0,7);x.fill()}
  if(Math.floor(V.ts/700+i)%2===0){x.fillStyle='#ff3b2f';x.fillRect(cxp+3,cy-2,2.4,2.4)}}}

// ---------- dinamikus elemek ----------
function ccDyn(x,V,sx,Y0,K){const ts=V.ts,night=V.day<.55,m=v=>v*K,X=v=>sx+v*K,Y=v=>Y0+v*K;
 // monitorfal: térkép, görbék, villogó pontok
 const mx=X(1.4),my=Y(-8.2),mw=m(13.2),mh=m(2.2);x.save();x.beginPath();x.rect(mx+1,my+1,mw-2,mh-2);x.clip();
 x.fillStyle='#08283a';x.fillRect(mx,my,mw,mh);x.strokeStyle='rgba(80,220,255,.55)';x.lineWidth=1;
 for(let p=0;p<3;p++){const px0=mx+p*mw/3+4,pw=mw/3-8;x.beginPath();for(let i=0;i<=24;i++){const t=i/24,v=Math.sin(t*9+ts/600+p*2)*.3+Math.sin(t*23+ts/300+p)*.12;const yy=my+mh*.55+v*mh*.6;i?x.lineTo(px0+t*pw,yy):x.moveTo(px0,yy)}x.stroke()}
 x.fillStyle='rgba(255,170,40,.9)';for(let i=0;i<6;i++){if(Math.floor(ts/400+i*1.7)%3)x.fillRect(mx+((i*61)%Math.max(1,mw-6))+3,my+mh*.2+((i*37)%Math.max(1,mh*.5)),2.5,2.5)}
 x.restore();
 // konzol-LED-ek
 for(let i=0;i<5;i++){x.fillStyle=Math.floor(ts/300+i)%3?'#35d06a':'#ffb020';x.fillRect(X(1.6+i*2.85),Y(-5.45),2,2)}
 // radar (forgó tányér) + antennaárboc villogóval
 const ra=ts/900,rx=X(4.2),ry=Y(-CC.h-1.6);x.strokeStyle='#3a3f46';x.lineWidth=m(.18);x.beginPath();x.moveTo(rx,Y(-CC.h));x.lineTo(rx,ry);x.stroke();
 x.fillStyle='#d9dee4';x.save();x.translate(rx,ry);x.scale(Math.cos(ra),1);x.beginPath();x.ellipse(0,0,m(1.1),m(.45),0,0,7);x.fill();x.strokeStyle=OL;x.lineWidth=1;x.stroke();x.restore();
 const ax=X(2.6);x.strokeStyle='#5d6670';x.lineWidth=m(.1);x.beginPath();x.moveTo(ax,Y(-CC.h-1));x.lineTo(ax,Y(-CC.h-5.5));x.stroke();for(let i=1;i<4;i++){x.beginPath();x.moveTo(ax-m(.4),Y(-CC.h-1-i*1.2));x.lineTo(ax+m(.4),Y(-CC.h-1-i*1.2));x.stroke()}
 if(Math.floor(ts/600)%2){x.fillStyle='#ff3b2f';x.beginPath();x.arc(ax,Y(-CC.h-5.7),m(.18),0,7);x.fill();if(night)V.GL.push({x:ax,y:Y(-CC.h-5.7),r:m(2),c:'255,60,40',i:.5})}
 // klíma ventilátorok
 for(let i=0;i<3;i++){const fx=X(11.6+i*1.05),fy=Y(-CC.h-1.05),a=ts/120+i;x.strokeStyle='#1a1d21';x.lineWidth=1.2;x.beginPath();for(let b=0;b<3;b++){const q=a+b*2.09;x.moveTo(fx,fy);x.lineTo(fx+Math.cos(q)*m(.35),fy+Math.sin(q)*m(.35))}x.stroke()}
 // éjjel: meleg ablakfény, hideg monitorfény
 if(night){V.lamp(X(8),Y(-6.6),m(9),.75);V.lamp(X(8),Y(-11),m(8),.6);V.lamp(X(2.5),Y(-2),m(4),.6);V.GL.push({x:X(8),y:Y(-7.1),r:m(7),c:'80,200,255',i:.18})}}
function whDyn(x,V,sx,Y0,K){const ts=V.ts,night=V.day<.55,m=v=>v*K,X=v=>sx+v*K,Y=v=>Y0+v*K,cut=12;
 // futódaru-híd a darupályán, kötél, horog, láda
 const t=(Math.sin(ts/4200)+1)/2,bx=X(cut+1+t*(WH.w-cut-4)),dropT=(Math.sin(ts/1900)+1)/2,hy=Y(-9.6+dropT*4.2);
 x.fillStyle='#e0a800';x.fillRect(bx-m(1.4),Y(-10.6),m(2.8),m(.5));x.strokeStyle=OL;x.lineWidth=1;x.strokeRect(bx-m(1.4),Y(-10.6),m(2.8),m(.5));
 x.fillStyle=Math.floor(ts/250)%2?'#ffb020':'#7a4a08';x.fillRect(bx-m(.2),Y(-10.9),m(.4),m(.3));
 x.strokeStyle='#15171a';x.lineWidth=1;x.beginPath();x.moveTo(bx-m(.15),Y(-10.1));x.lineTo(bx-m(.15),hy);x.moveTo(bx+m(.15),Y(-10.1));x.lineTo(bx+m(.15),hy);x.stroke();
 x.fillStyle='#3a3f46';x.fillRect(bx-m(.35),hy,m(.7),m(.3));x.fillStyle='#c7742a';x.fillRect(bx-m(.6),hy+m(.35),m(1.2),m(.9));x.strokeStyle=OL;x.strokeRect(bx-m(.6),hy+m(.35),m(1.2),m(.9));
 // targonca a padlón (oda-vissza), emelő villa
 const ft=(Math.sin(ts/3100+1)+1)/2,fx=X(cut+1.5+ft*(WH.w-cut-6)),fy=Y(-.6),dir=Math.cos(ts/3100+1)>0?1:-1;
 x.fillStyle='#f2b705';x.fillRect(fx-m(.9),fy-m(1.1),m(1.8),m(.8));x.fillStyle='#2b2e33';x.fillRect(fx-m(.6),fy-m(2),m(.9),m(.9));x.fillStyle='rgba(170,220,255,.7)';x.fillRect(fx-m(.5),fy-m(1.9),m(.7),m(.6));
 x.fillStyle='#15171a';x.beginPath();x.arc(fx-m(.55),fy-m(.25),m(.28),0,7);x.arc(fx+m(.55),fy-m(.25),m(.28),0,7);x.fill();
 const lift=(Math.sin(ts/900)+1)/2*m(.8);x.fillStyle='#5d6670';x.fillRect(fx+dir*m(.95),fy-m(2.1),m(.12)*dir,m(2));x.fillRect(fx+dir*m(.95),fy-m(.35)-lift,dir*m(.8),m(.1));
 // tetőventilátorok
 for(const vx of[4,8]){const cxp=X(vx),cyp=Y(-WH.h-2.55),a=ts/90+vx;x.strokeStyle='#1a1d21';x.lineWidth=1.4;x.beginPath();for(let b=0;b<4;b++){const q=a+b*1.57;x.moveTo(cxp,cyp);x.lineTo(cxp+Math.cos(q)*m(.45),cyp+Math.sin(q)*m(.18))}x.stroke()}
 if(night){V.lamp(X(20),Y(-6),m(10),.7);V.lamp(X(5.6),Y(-2),m(5),.5)}}
function outdoor(x,V){const K=V.K||10,Ys=V.Ys,X=v=>V.SX(v),ts=V.ts,night=V.day<.55;
 // betonút a komplexum előtt
 const a=X(64),b=X(200);if(b<-20||a>V.w+20)return;x.fillStyle='#6d7176';x.fillRect(a,Ys-K*.12,b-a,K*.5);x.fillStyle='#8c9096';x.fillRect(a,Ys-K*.12,b-a,K*.1);
 x.fillStyle='#f2b705';for(let v=64;v<200;v+=3){const p=X(v);if(p>-10&&p<V.w+10)x.fillRect(p,Ys+K*.12,K*1.4,K*.06)}
 // iparvasút a raktár előtt (sín + talpfák)
 const r0=X(86),r1=X(148);x.fillStyle='#3a2e24';for(let v=86;v<148;v+=.9){const p=X(v);if(p>-10&&p<V.w+10)x.fillRect(p,Ys+K*.28,K*.45,K*.18)}x.fillStyle='#9aa3ad';x.fillRect(r0,Ys+K*.22,r1-r0,K*.09);
 // csőhíd az irányítóközpont és a raktár között
 const p0=X(CC.x+CC.w+1.6),p1=X(WH.x);if(p1>p0){x.fillStyle='#4b5057';x.fillRect(p0,Ys-K*8.2,p1-p0,K*.25);for(const[o,col]of[[-.55,'#c9562a'],[-.95,'#2f6fb0'],[-1.3,'#9aa1aa']]){x.fillStyle=col;x.fillRect(p0,Ys-K*(8.2-o*-1),p1-p0,K*.28)}
  for(const v of[CC.x+CC.w+2.2,WH.x-.6]){x.fillStyle='#3a3f46';x.fillRect(X(v)-K*.15,Ys-K*8,K*.3,K*8)}}
 // reflektoroszlopok
 for(const v of[64.5,89,159.6,185]){const p=X(v);if(p<-40||p>V.w+40)continue;x.fillStyle='#2e3033';x.fillRect(p-K*.12,Ys-K*12,K*.24,K*12);x.fillRect(p-K*.9,Ys-K*12.2,K*1.8,K*.35);
  for(let i=0;i<3;i++){x.fillStyle=night?'#fff3c0':'#9aa3ad';x.fillRect(p-K*.8+i*K*.6,Ys-K*12.6,K*.45,K*.4)}if(night){V.lamp(p,Ys-K*12,K*16,.85);V.GL.push({x:p,y:Ys-K*12.4,r:K*3,c:'255,235,170',i:.35})}}
 // biztonsági kerítés (dróthálós szakaszok) az udvar mögött
 const f0=X(187),f1=X(204);if(f1>f0){x.strokeStyle='rgba(150,160,170,.7)';x.lineWidth=1;x.beginPath();for(let v=187;v<204;v+=.6){const p=X(v);x.moveTo(p,Ys);x.lineTo(p+K*.6,Ys-K*2.2);x.moveTo(p+K*.6,Ys);x.lineTo(p,Ys-K*2.2)}x.stroke();x.fillStyle='#5d6670';for(let v=187;v<=204;v+=3)x.fillRect(X(v)-1,Ys-K*2.4,2,K*2.4);x.fillRect(f0,Ys-K*2.4,f1-f0,2)}}

CX.world=function(V){if(typeof S==='undefined'||typeof document==='undefined'||!document.createElement)return;const x=V.x,Ys=V.Ys,K=V.K||10;CX.hit=[];if(!(Ys>-300&&Ys<V.h+200))return;
 outdoor(x,V);
 const cc=V.SX(CC.x),wh=V.SX(WH.x),yd=V.SX(YARD.x);
 if(cc<V.w+40&&cc+(CC.w+3)*K>-40){blit(x,V,sprite('cc',CC.w+2,CC.h+6.2,1,ccStatic),CC.x);ccDyn(x,V,cc,Ys,K);CX.hit.push({id:'cc',x:cc,y:Ys-CC.h*K,w:CC.w*K,h:CC.h*K})}
 if(wh<V.w+40&&wh+WH.w*K>-40){blit(x,V,sprite('wh',WH.w,WH.h+3,1,whStatic),WH.x);whDyn(x,V,wh,Ys,K);CX.hit.push({id:'wh',x:wh,y:Ys-WH.h*K,w:WH.w*K,h:WH.h*K})}
 if(yd<V.w+40&&yd+YARD.w*K>-40)blit(x,V,sprite('yd',YARD.w+5,5.4,1,yardStatic),YARD.x)};

// ---------- funkció: kártya ----------
function card(id){if(typeof document==='undefined'||!document.getElementById)return;let c=document.getElementById('cxCard');if(!c){c=document.createElement('div');c.id='cxCard';document.body.appendChild(c)}
 let h='';if(id==='cc'){const q=W.QS&&QS.html?QS.html():'';h=`<div class="srh"><b>🛰 Irányítóközpont</b><button class="srx" aria-label="Bezár" onclick="document.getElementById('cxCard').style.display='none'">✕</button></div><div class="mu">Küldetések és feladatok: a napi és heti kihívások állása. Teljesítéskor a jutalom automatikusan jár.</div><div class="cxq">${q}</div>`}
 else{h=`<div class="srh"><b>📦 Alkatrészraktár</b><button class="srx" aria-label="Bezár" onclick="document.getElementById('cxCard').style.display='none'">✕</button></div><div class="mu">Alkatrészek és nyersanyagok: a rakomány, a készletek és az eladás.</div><div class="row" style="margin-top:8px"><button class="b" onclick="document.getElementById('cxCard').style.display='none';tab=2;view()">📦 Raktár megnyitása</button></div>`}
 c.innerHTML=h;c.style.display='block';try{beep(560,.05,.05,'triangle')}catch(e){}}
CX.card=card;CX.lib={R,hazard,rivets,sprite,blit,OL,mixC};W.CX=CX;
if(W.on){on('world.sky',V=>{try{para(V)}catch(e){if(W.DBG)DBG.err='complex-sky: '+(e.message||e)}});on('world.back',V=>{try{CX.world(V)}catch(e){if(W.DBG)DBG.err='complex: '+(e.message||e)}})}
if(typeof document!=='undefined'&&document.addEventListener){let dn=null;document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;if(W.ZM&&(ZM.t>1||ZM.z>1.02))return;
  const r=e.target.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;for(const H of CX.hit)if(px>=H.x&&px<=H.x+H.w&&py>=H.y&&py<=H.y+H.h){card(H.id);break}},true)}
})(typeof window!=='undefined'?window:globalThis);
