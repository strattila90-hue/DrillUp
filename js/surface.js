/* Drill Up – a felszíni bázis: utcalámpák, trafóállomás, vizsgálati központ (mobil geológiai labor), fejleszthető épületek.
   Érintés az épületen/lámpán: éjszakai világítás ki-be. A szint-címkére (★) érintve megnyílik a fejlesztő kártya.
   S.bl = {tr,ws,fu: 1..3 szint, on:{ws,fu,tr,lab,lp0,lp1,lp2: 0/1}}; a labor szintje a meglévő GEO.ens().lab.lv (1–3), 0 = építés alatt.
   Hatások: műhely → javítás olcsóbb; tartály → üzemanyag olcsóbb; trafó → tunnel-lámpa olcsóbb + erősebb bázisfény. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('surface');
const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const UP={tr:[0,4e5,6e6,1e8],ws:[0,6e5,9e6,1.5e8],fu:[0,3e5,5e6,8e7]};
const INFO={
 ws:{n:'Műhely',e:'🔧',eff:l=>`javítás −${(l-1)*15}%`,ds:'Itt javítod a páncélt és cseréled a fúrófejet. Magasabb szinten olcsóbb a javítás.'},
 fu:{n:'Üzemanyag-tároló',e:'⛽',eff:l=>`üzemanyagár −${(l-1)*10}%`,ds:'Nagyobb tartály, tömeges beszerzés: olcsóbb tankolás.'},
 tr:{n:'Trafóállomás',e:'⚡',eff:l=>`járat-lámpa −${(l-1)*20}%, erősebb bázisfény`,ds:'Kisfeszültségű hálózat a bázisnak: olcsóbb lámpatelepítés és erősebb világítás.'},
 lab:{n:'Vizsgálati központ',e:'🔬',eff:l=>l?['','kőzet, hőmérséklet, nyomás, szilárdság','+ ásványösszetétel és sűrűség','+ teljes elemzés, távérzékelés'][l]:'még nincs felépítve',ds:'Mobil geológiai labor: mintavétel és elemzés. A szint a labor fejlesztése (Tudás → Labor).'}};
const SRF={Q:[],H:[],pills:[],card:null,seen:0,
 st(){const b=S.bl=(S.bl&&typeof S.bl==='object')?S.bl:{};for(const k of['tr','ws','fu'])b[k]=cl(b[k]|0||1,1,3);b.on=(b.on&&typeof b.on==='object')?b.on:{};return b},
 lv(id){if(id==='lab'){try{return GEO.ens().lab.lv|0}catch(e){return 0}}return SRF.st()[id]},
 on(id){return !!SRF.st().on[id]},
 disc(id){return id==='ws'?1-.15*(SRF.lv('ws')-1):id==='fu'?1-.1*(SRF.lv('fu')-1):id==='tr'?1-.2*(SRF.lv('tr')-1):1},
 cost(id){if(id==='lab'){try{return window.LAB&&SRF.lv('lab')<3?[0,8e5,1.2e7,2e8][SRF.lv('lab')+1]:0}catch(e){return 0}}const l=SRF.lv(id);return l<3?UP[id][l]:0},
 toggle(id){const o=SRF.st().on;o[id]=o[id]?0:1;try{beep(o[id]?880:520,.06,.05,'square')}catch(e){}toast((o[id]?'💡 Világítás be: ':'🌑 Világítás ki: ')+(INFO[id]?INFO[id].n:'utcai lámpa'));try{save()}catch(e){}},
 up(id){if(typeof base==='function'&&!base())return toast('Fejleszteni csak a bázison lehet.');
  if(id==='lab'){if(window.LAB)LAB.buy();SRF.card=null;SRF.showCard(id);return}
  const l=SRF.lv(id),c=SRF.cost(id);if(!c)return;if(S.cash<c)return toast('Nincs elég pénz ('+nf(c,0)+' Ft).');S.cash-=c;SRF.st()[id]=l+1;msg((INFO[id].e)+' '+INFO[id].n+' fejlesztve: '+(l+1)+'. szint – '+INFO[id].eff(l+1));try{beep(660,.12,.06,'triangle');setTimeout(()=>beep(990,.18,.06,'triangle'),110)}catch(e){}try{save()}catch(e){}SRF.showCard(id)},
 showCard(id){if(typeof document==='undefined'||!document.getElementById||!document.body||!document.createElement)return;let c=document.getElementById('srfCard');if(!c){c=document.createElement('div');c.id='srfCard';document.body.appendChild(c)}
  const I=INFO[id],l=SRF.lv(id),cs=SRF.cost(id),on=SRF.on(id),stars='★'.repeat(l)+'☆'.repeat(3-l);
  const nx=l<3?`<div class="mu">Következő szint: ${I.eff(l+1)}</div>`:'<div class="mu ok">Maximális szint</div>';
  c.innerHTML=`<div class="srh"><b>${I.e} ${I.n}</b><span class="srs">${stars}</span><button class="srx" aria-label="Bezár" onclick="SRF.close()">✕</button></div><div class="mu">${I.ds}</div><div class="srv">Most: <b>${I.eff(l)}</b></div>${nx}
   <div class="row" style="margin-top:8px"><button class="b" onclick="SRF.toggle('${id}');SRF.showCard('${id}')">${on?'🌑 Világítás ki':'💡 Világítás be'}</button>${l<3||id==='lab'&&cs?`<button class="b g" ${S.cash>=cs&&cs?'':'disabled'} onclick="SRF.up('${id}')">⬆ Fejlesztés${cs?' · '+nf(cs,0)+' Ft':''}</button>`:''}</div>`;
  c.style.display='block';SRF.card=id;clearTimeout(SRF._ct);SRF._ct=setTimeout(SRF.close,14000)},
 close(){if(typeof document==='undefined'||!document.getElementById)return;const c=document.getElementById('srfCard');if(c)c.style.display='none';SRF.card=null},
 hit(id,x,y,w,h,k){SRF.H.push({id,x,y,w,h,k})},
 tap(px,py){if(window.PN&&PN.at(px,py))return false;if(window.ZM&&(ZM.t>1||ZM.z>1.02||ZM.on(px,py)))return false;for(let i=SRF.H.length-1;i>=0;i--){const r=SRF.H[i];if(px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h){if(r.k==='pill')SRF.showCard(r.id);else SRF.toggle(r.id);return true}}return false},
 // ---- rajz
 pill(x,V,id,px,py){const l=SRF.lv(id),t=INFO[id].e+' '+INFO[id].n+' '+'★'.repeat(Math.max(l,0))+(l<3?' ⬆':'');x.save();x.font='bold 9px Georgia';const w=x.measureText(t).width+12;x.restore();py=Math.max(py,18);SRF.Q.push({t,w,px,py,max:l>=3});SRF.hit(id,px-w/2-2,py-12,w+4,24,'pill')},
 drawPills(x){if(window.ZM&&ZM.z>1.02){SRF.Q=[];return}for(const q of SRF.Q){x.save();x.font='bold 9px Georgia';x.fillStyle='rgba(12,14,16,.78)';x.strokeStyle=q.max?'#e8b84a':'rgba(255,255,255,.4)';x.lineWidth=1;x.beginPath();x.roundRect?x.roundRect(q.px-q.w/2,q.py-8,q.w,16,8):x.rect(q.px-q.w/2,q.py-8,q.w,16);x.fill();x.stroke();x.fillStyle='#f4ecd8';x.textAlign='center';x.fillText(q.t,q.px,q.py+3.5);x.restore()}SRF.Q=[]},
 lampPost(x,V,id,wx,night){const sx=V.SX(wx),Y0=V.Ys;if(sx<-60||sx>V.w+60)return;const lit=night&&SRF.on(id),k=1+.12*(SRF.lv('tr')-1);
  x.fillStyle='#2e3033';x.fillRect(sx-1.5,Y0-78,3,78);x.fillRect(sx-4,Y0,8,3);x.fillRect(sx-1.5,Y0-79,18,3);x.fillStyle=lit?'#fff3b0':'#8a8f93';x.fillRect(sx+10,Y0-76,10,4);
  if(lit){V.lamp(sx+15,Y0-72,190*k,.95);V.GL.push({x:sx+15,y:Y0-72,r:130*k,c:'255,225,150',i:.3});const g=x.createLinearGradient(0,Y0-72,0,Y0);g.addColorStop(0,'rgba(255,235,170,.22)');g.addColorStop(1,'rgba(255,235,170,0)');x.fillStyle=g;x.beginPath();x.moveTo(sx+12,Y0-72);x.lineTo(sx+18,Y0-72);x.lineTo(sx+60,Y0);x.lineTo(sx-30,Y0);x.fill()}
  else if(night&&Math.floor(V.ts/700)%2===0){x.fillStyle='rgba(255,230,140,.7)';x.beginPath();x.arc(sx+15,Y0-84,2.2,0,7);x.fill()}
  SRF.hit(id,sx-14,Y0-84,48,84)},
 trafo(x,V,night){const wx=14,sx=V.SX(wx),Y0=V.Ys;if(sx<-120||sx>V.w+60)return;const L=SRF.lv('tr'),lit=night&&SRF.on('tr'),k=1+.12*(L-1);
  // kerítéses terület + beton alap
  x.fillStyle='#6b6e70';x.fillRect(sx-4,Y0-3,92,3);x.strokeStyle='#9aa0a4';x.lineWidth=1;x.beginPath();for(let i=0;i<=9;i++){x.moveTo(sx-2+i*10,Y0-3);x.lineTo(sx-2+i*10,Y0-26)}x.moveTo(sx-2,Y0-26);x.lineTo(sx+88,Y0-26);x.moveTo(sx-2,Y0-14);x.lineTo(sx+88,Y0-14);x.stroke();
  // transzformátor(ok)
  const tf=(ox,sc)=>{x.save();x.translate(ox,Y0-3);x.scale(sc,sc);x.fillStyle='#4f6a5a';x.fillRect(0,-26,30,24);x.fillStyle='#3e5547';for(let i=0;i<7;i++)x.fillRect(31+i*2.4,-24,1.4,20);x.fillStyle='#5f7d6b';x.fillRect(0,-26,30,3);
   x.fillStyle='#46596b';x.beginPath();x.ellipse(15,-33,13,5,0,0,7);x.fill();x.fillRect(2,-33,26,5);
   for(let i=0;i<3;i++){const px=5+i*10;x.fillStyle='#8a4a2a';x.fillRect(px-1.5,-46,3,14);x.fillStyle='#b9622f';for(let j=0;j<3;j++)x.fillRect(px-3,-45+j*4,6,2);x.fillStyle='#222';x.fillRect(px-2,-48,4,3);if(lit&&Math.sin(V.ts/60+i*2)>.7){x.fillStyle='rgba(160,200,255,.8)';x.fillRect(px-.5,-52,1,4)}}
   x.restore()};
  tf(sx+4,1);if(L>=2)tf(sx+52,.85);
  // figyelmeztető tábla
  x.fillStyle='#f0c020';x.beginPath();x.moveTo(sx+40,Y0-34);x.lineTo(sx+48,Y0-20);x.lineTo(sx+32,Y0-20);x.closePath();x.fill();x.fillStyle='#111';x.font='bold 9px Georgia';x.textAlign='center';x.fillText('⚡',sx+40,Y0-22);x.textAlign='left';
  // rácsos tartóoszlop + kereszttartó + szigetelők
  const tx=sx+96;x.strokeStyle='#5b6166';x.lineWidth=2;x.beginPath();x.moveTo(tx-5,Y0);x.lineTo(tx-1.5,Y0-92);x.moveTo(tx+5,Y0);x.lineTo(tx+1.5,Y0-92);x.stroke();x.lineWidth=1;x.beginPath();for(let i=0;i<9;i++){const y=Y0-i*10;x.moveTo(tx-5+i*.35,y);x.lineTo(tx+5-i*.35,y-10);x.moveTo(tx+5-i*.35,y);x.lineTo(tx-5+i*.35,y-10)}x.stroke();
  x.fillStyle='#4b5055';x.fillRect(tx-14,Y0-94,28,3);x.fillStyle='#d7dde0';for(const o of[-12,0,12])x.fillRect(tx+o-1.5,Y0-91,3,6);
  if(L>=3){x.fillStyle='#c33';x.beginPath();x.arc(tx,Y0-98,2.4*(.6+.4*(Math.floor(V.ts/600)%2)),0,7);x.fill()}
  // fényszóró a terület fölött
  x.fillStyle='#2e3033';x.fillRect(sx+18,Y0-62,2,36);x.fillRect(sx+13,Y0-64,12,3);x.fillStyle=lit?'#fff7c8':'#7d8286';x.fillRect(sx+14,Y0-62,10,3);
  if(lit){V.lamp(sx+19,Y0-58,150*k,.9);V.GL.push({x:sx+19,y:Y0-58,r:110*k,c:'255,240,190',i:.28})}
  SRF.hit('tr',sx-6,Y0-100,112,100);SRF.pill(x,V,'tr',sx+50,Y0-112);
  SRF._pole={x:tx,y:Y0-93}},
 lab(x,V,night){const wx=26,sx=V.SX(wx),Y0=V.Ys;if(sx<-200||sx>V.w+40)return;const l=SRF.lv('lab'),lit=night&&SRF.on('lab'),k=1+.12*(SRF.lv('tr')-1);
  // beton alap + két sarokkonzol
  x.fillStyle='#74777a';x.fillRect(sx-6,Y0-4,196,4);
  if(l<1){ // építés alatt
   x.strokeStyle='#caa24a';x.lineWidth=2;x.beginPath();x.rect(sx+10,Y0-46,120,42);x.moveTo(sx+10,Y0-46);x.lineTo(sx+130,Y0-4);x.moveTo(sx+130,Y0-46);x.lineTo(sx+10,Y0-4);x.stroke();
   x.fillStyle='#f08a1a';for(let i=0;i<3;i++){x.beginPath();x.moveTo(sx+150+i*10,Y0-4);x.lineTo(sx+153+i*10,Y0-18);x.lineTo(sx+156+i*10,Y0-4);x.fill()}
   x.fillStyle='rgba(20,20,20,.75)';x.fillRect(sx+14,Y0-70,112,18);x.fillStyle='#ffd66e';x.font='bold 8px Georgia';x.textAlign='center';x.fillText('VIZSGÁLATI KÖZPONT – építés alatt',sx+70,Y0-58);x.textAlign='left'}
  else{
   // utánfutó-kabin: kiemelő lábak, kerekek, vonószerkezet
   const bw=130,bh=44,bx=sx+8,by=Y0-14-bh;
   x.fillStyle='#2b2d30';for(const o of[8,bw-14])x.fillRect(bx+o,Y0-14,5,10),x.fillRect(bx+o-3,Y0-5,11,2);
   x.fillStyle='#232427';x.beginPath();x.arc(bx+bw-30,Y0-11,8,0,7);x.arc(bx+bw-44,Y0-11,8,0,7);x.fill();x.fillStyle='#666b70';x.beginPath();x.arc(bx+bw-30,Y0-11,3.5,0,7);x.arc(bx+bw-44,Y0-11,3.5,0,7);x.fill();
   x.fillStyle='#3a3d40';x.fillRect(bx-14,Y0-12,16,3);x.fillRect(bx-16,Y0-14,3,8);
   // test: fehér panel, kék sáv, felső él
   let g=x.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,'#f0f3f5');g.addColorStop(1,'#c4cbd0');x.fillStyle=g;x.fillRect(bx,by,bw,bh);x.fillStyle='#2f6fb0';x.fillRect(bx,by+bh-12,bw,4);x.fillStyle='#e3a82a';x.fillRect(bx,by+bh-7,bw,2);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;x.strokeRect(bx+.5,by+.5,bw-1,bh-1);
   for(let i=1;i<6;i++){x.beginPath();x.moveTo(bx+i*bw/6,by);x.lineTo(bx+i*bw/6,by+bh-12);x.stroke()}
   // ablakok
   for(let i=0;i<4;i++){const wx2=bx+30+i*24;x.fillStyle='#222';x.fillRect(wx2-1,by+8,20,16);x.fillStyle=lit?'#ffe28a':'#8ec3dc';x.fillRect(wx2,by+9,18,14);if(lit)V.lamp(wx2+9,by+16,60*k,.7)}
   // ajtó + lépcső
   x.fillStyle='#4c5a66';x.fillRect(bx+6,by+10,16,bh-12);x.fillStyle='#d8dde0';x.fillRect(bx+16,by+26,3,2);x.fillStyle='#3a3d40';for(let i=0;i<3;i++)x.fillRect(bx-2-i*5,Y0-14+i*4,6,2);
   // tető: klíma, antenna, jelzőfény
   x.fillStyle='#8d9499';x.fillRect(bx+70,by-9,26,9);x.fillStyle='#5b6166';for(let i=0;i<4;i++)x.fillRect(bx+73+i*6,by-7,3,5);x.strokeStyle='#4a4f54';x.lineWidth=1.5;x.beginPath();x.moveTo(bx+112,by);x.lineTo(bx+112,by-26);x.stroke();x.fillStyle=(window.LAB&&LAB.busy>0&&Math.floor(V.ts/200)%2)?'#6bff8a':'#456';x.beginPath();x.arc(bx+112,by-27,2.4,0,7);x.fill();
   // felirat
   x.fillStyle='#17446f';x.fillRect(bx+26,by-17,92,12);x.fillStyle='#fff';x.font='bold 7.5px Georgia';x.textAlign='center';x.fillText('VIZSGÁLATI KÖZPONT',bx+72,by-8.5);x.textAlign='left';
   // 2. szint: ráépített modul + napelemek
   if(l>=2){const mx=bx+16,my=by-30;x.fillStyle='#e9edf0';x.fillRect(mx,my,80,30);x.fillStyle='#2f6fb0';x.fillRect(mx,my+26,80,4);for(let i=0;i<3;i++){x.fillStyle='#222';x.fillRect(mx+8+i*24-1,my+6,18,14);x.fillStyle=lit?'#ffe28a':'#8ec3dc';x.fillRect(mx+8+i*24,my+7,16,12)}x.fillStyle='#1d3a63';for(let i=0;i<3;i++){x.save();x.translate(mx+6+i*26,my-5);x.rotate(-.3);x.fillRect(0,0,22,4);x.restore()}x.fillStyle='#17446f';x.fillRect(bx+26,by-17,0,0)}
   // 3. szint: parabolaantenna + szeizmikus árboc
   if(l>=3){const dx=bx+bw-12,dy=by-34;x.strokeStyle='#4a4f54';x.lineWidth=2;x.beginPath();x.moveTo(dx,by-2);x.lineTo(dx,dy);x.stroke();x.fillStyle='#dfe3e6';x.beginPath();x.ellipse(dx+2,dy-6,13,8,-.6+.2*Math.sin(V.ts/2500),0,7);x.fill();x.strokeStyle='#8c9399';x.lineWidth=1;x.stroke();x.strokeStyle='#4a4f54';x.beginPath();x.moveTo(dx+2,dy-6);x.lineTo(dx+8,dy-18);x.stroke();x.fillStyle='#e33';x.beginPath();x.arc(dx+8,dy-19,2,0,7);x.fill()}
   // mintatároló állvány a ház mellett
   const rx=sx+150;x.fillStyle='#6a5236';x.fillRect(rx,Y0-26,34,3);x.fillRect(rx,Y0-14,34,3);x.fillRect(rx+1,Y0-26,2,26);x.fillRect(rx+31,Y0-26,2,26);const cc=['#a88a55','#9a9a88','#b06a6a','#4a4f5a','#3f6f3a'];for(let r=0;r<2;r++)for(let i=0;i<4;i++){x.fillStyle=cc[(i+r*2)%5];x.fillRect(rx+4+i*7,Y0-23+r*12-0,5,7)}
   SRF.hit('lab',sx-14,Y0-72,196,72);SRF.pill(x,V,'lab',sx+78,Y0-(l>=3?98:l>=2?92:68))}
  if(l<1){SRF.hit('lab',sx+8,Y0-72,150,72);SRF.pill(x,V,'lab',sx+70,Y0-84)}},
 frame(V){if(typeof S==='undefined')return;SRF.H=[];SRF.Q=[];
  // naplemente: egyszeri útmutató
  if(V.day<.55&&!SRF.seen&&V.Ys>-100){SRF.seen=1;toast('🌙 Beesteledett – érintsd meg az épületet vagy a lámpát a világításhoz.')}
  const x=V.x,Y0=V.Ys;if(!(Y0>-190&&Y0<V.h+190))return;const night=V.day<.55;
  SRF.lampPost(x,V,'lp1',9,night);SRF.lampPost(x,V,'lp2',47,night);
  SRF.trafo(x,V,night);SRF.lab(x,V,night);
  // légvezeték: trafó → lámpák, labor
  if(SRF._pole){const p=SRF._pole,pts=[V.SX(9)+16,V.SX(47)+16];x.strokeStyle='rgba(20,20,22,.8)';x.lineWidth=1;for(const q of pts){const ex=q,ey=Y0-76;x.beginPath();x.moveTo(p.x,p.y+2);x.quadraticCurveTo((p.x+ex)/2,Math.max(p.y,ey)+10,ex,ey);x.stroke()}}SRF._pole=null}
};
SRF.front=function(V){const x=V.x,Y0=V.Ys;if(!(Y0>-190&&Y0<V.h+190))return;
  // a meglévő épületek találati területei (rajzuk az index.html-ben van)
  const wsx=V.SX(-46),tx=V.SX(-21),lp=V.SX(-13);
  if(wsx<V.w+40&&wsx+240>-40){SRF.hit('lp0',lp-8,Y0-82,34,82);SRF.hit('fu',tx,Y0-36,60,36);SRF.hit('ws',wsx,Y0-112,226,112);SRF.pill(x,V,'ws',wsx+110,Y0-132);SRF.pill(x,V,'fu',tx+28,Y0-48);
   // a műhely szintjei: napelemek (2.), második kémény és antenna (3.)
   const L=SRF.lv('ws');if(L>=2){x.fillStyle='#1d3a63';for(let i=0;i<4;i++){x.save();x.translate(wsx+100+i*22,Y0-112);x.rotate(-.18);x.fillRect(0,0,18,4);x.restore()}}
   if(L>=3){x.strokeStyle='#555';x.lineWidth=1.5;x.beginPath();x.moveTo(wsx+196,Y0-90);x.lineTo(wsx+196,Y0-132);x.stroke();x.fillStyle='#d44';x.beginPath();x.arc(wsx+196,Y0-133,2,0,7);x.fill()}
   if(SRF.lv('fu')>=2){x.fillStyle='#8c9aa5';x.beginPath();x.ellipse(tx+28,Y0-38,18,5,0,0,7);x.fill()}}
};
W.SRF=SRF;
if(W.on){
 on('world.back',V=>{try{SRF.frame(V)}catch(e){DBG.err='surface: '+(e.message||e)}});
 on('world.front',V=>{try{SRF.front(V)}catch(e){DBG.err='surface2: '+(e.message||e)}});
 on('hud',V=>{try{if(SRF.Q.length)SRF.drawPills(V.x)}catch(e){DBG.err='surface3: '+(e.message||e)}});
}
// érintés a vásznon: világítás kapcsolás / szint-kártya
if(typeof document!=='undefined'){let dn=null;document.addEventListener('pointerdown',e=>{dn=e.target&&e.target.id==='cv'?{x:e.clientX,y:e.clientY,t:Date.now()}:null},true);
 document.addEventListener('pointerup',e=>{if(!dn||!e.target||e.target.id!=='cv')return;const d=dn;dn=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>9||Date.now()-d.t>600)return;const r=e.target.getBoundingClientRect();SRF.tap(e.clientX-r.left,e.clientY-r.top)},true);
 document.addEventListener('pointerdown',e=>{const c=document.getElementById('srfCard');if(c&&c.style.display==='block'&&!c.contains(e.target)&&!(e.target&&e.target.id==='cv'))SRF.close()},true)}
})(typeof window!=='undefined'?window:globalThis);
