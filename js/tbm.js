/* DrillUp Core Quest – pajzsos fúrógép (TBM-elrendezés) mozgó részei.
   Fizikailag hihető felépítés: elöl a legnagyobb átmérőjű forgó vágófej, mögötte a pajzs, a tolóhengerek és a fej
   átmérőjénél kisebb hengeres hajótest (kabin, motortér, támasztótalpak, törmelékszállító csiga, kiürítő garat).
   A tetőn semmi nem lóg ki a furat-szelvényből; a lánctalp a föld alatt behúzódik.
   • A felszínen (álló vagy haladó gépnél) minden hidraulikusan kinyílik: a motortér csapóajtói felnyílnak, a motor emelőn
     kiemelkedik és „lélegzik”, a műszerárboc kitolódik (forgó radar, élő mutatós műszer, szélmérő, villogó jelzőfény),
     a pajzs páncéllemezei felemelkednek, alattuk forog a fej hajtóműve.
   • Fúrás közben a pajzs oldalsó fékező/támasztó hidraulikája ütemesen a falnak feszül, a csiga hátrafelé hordja
     a kőzetet, és a farok garatából kihull.
   Minden determinisztikus (idő + hash): nincs részecske-állapot, nem villog. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('tbm');
const OL='#1a1712',cl=(v,a,b)=>v<a?a:v>b?b:v,h=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const TBM={u:1,cu:1,lt:0,
 on(){try{return S.set.tbm!==0&&!!(W.VART&&VART.ok3())}catch(e){return false}},
 // kinyitottság (0 = behúzva / fúrás, 1 = a felszínen minden kinyitva) – simítva
 upd(o){try{if(o.lw&&W.ZM){const a=o.lw(-6.8,0);ZM.mcx=a[0]}}catch(e){}const ts=o.ts||0,dt=TBM.lt?cl((ts-TBM.lt)/1000,0,.1):.016;TBM.lt=ts;
  let tg=1;try{if(o.menu)tg=0;else if((o.dep||0)>.5||S.mode==='drill'||(W.HYD&&HYD.on()))tg=0}catch(e){}
  const u0=TBM.u;TBM.u+=(tg-TBM.u)*Math.min(1,dt*1.6);if(Math.abs(tg-TBM.u)<.002)TBM.u=tg;
  if(o.main){const e=TBM.u*TBM.u*(3-2*TBM.u);TBM.L=e*TBM.LIFT;TBM.snd(tg,u0,TBM.u)}return TBM.u},
 // a felszínen a futómű hidraulikusan kiereszkedik: a test ennyivel (m) emelkedik a lánctalp fölé
 LIFT:1.6,L:0,tg0:-1,mv:0,
 // hidraulika-hangok: indításkor szelepnyitás-sziszegés + szivattyú-búgás (kinyitáskor emelkedő, behúzáskor ereszkedő), a végén reteszelő csattanás
 snd(tg,u0,u){try{const now=Date.now();if(TBM.tg0<0){TBM.tg0=tg;return}
  if(tg!==TBM.tg0){TBM.tg0=tg;if(Math.abs(tg-u)>.05){TBM.mv=1;if(typeof hiss==='function')hiss(.45);if(W.MX&&MX.hum)MX.hum(tg?48:96,tg?104:46,1.8,.11,7);if(W.MX&&MX.tone)MX.tone('sine',tg?180:260,tg?260:150,.5,.05,900,.15)}}
  else if(TBM.mv&&u===tg){TBM.mv=0;if(typeof clank==='function')clank(.5);if(typeof hiss==='function')setTimeout(()=>{try{hiss(.22)}catch(e){}},120)}}catch(e){}},
 // a kiereszkedő futómű hidraulikus lábai (a test koordinátáiban; L = kiemelés m-ben)
 legs(x,o,L){if(!(L>.01))return;const ts=o.ts||0;
  for(const lx of[-9.7,-6.5,-3.3]){const top=1.62,bot=1.22+L,bl=Math.min(.7,(bot-top)*.5);
   // csuklós felső tartó a hajótesten
   x.fillStyle='#2a2d32';x.beginPath();if(x.roundRect)x.roundRect(lx-.34,top-.12,.68,.26,.06);else x.rect(lx-.34,top-.12,.68,.26);x.fill();
   // henger (barrel) + krómozott dugattyúrúd
   x.fillStyle=TBM.steel(x,top,top+bl);x.fillRect(lx-.26,top,.52,bl);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(lx+.1,top,.16,bl);x.fillStyle='#f0b020';x.fillRect(lx-.26,top+bl*.35,.52,.06);
   x.fillStyle='#3a3f46';x.fillRect(lx-.3,top+bl-.08,.6,.12);
   const g=x.createLinearGradient(lx-.1,0,lx+.1,0);g.addColorStop(0,'#8e979f');g.addColorStop(.4,'#ffffff');g.addColorStop(1,'#6d757d');x.fillStyle=g;x.fillRect(lx-.12,top+bl,.24,Math.max(0,bot-top-bl));
   // alsó csukló a lánctalp-kereten
   x.fillStyle='#1e2024';x.beginPath();x.arc(lx,bot,.16,0,7);x.fill();x.fillStyle='#6a7079';x.beginPath();x.arc(lx,bot,.07,0,7);x.fill();
   // nyomótömlő (a mozgás alatt áramló olaj)
   x.strokeStyle='#141416';x.lineWidth=.07;x.beginPath();x.moveTo(lx+.22,top+.05);x.quadraticCurveTo(lx+.45,top+bl*.5,lx+.22,top+bl-.05);x.stroke();
   if(TBM.mv){x.setLineDash([.08,.16]);x.lineDashOffset=-ts/160;x.strokeStyle='rgba(255,170,40,.75)';x.lineWidth=.035;x.stroke();x.setLineDash([])}}},
 steel(x,y0,y1){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#eef2f5');g.addColorStop(.2,'#c3cbd2');g.addColorStop(.6,'#8e98a1');g.addColorStop(1,'#3a4148');return g},
 box(x,a,b,w,hh,f,lw){x.fillStyle=f;x.beginPath();if(x.roundRect)x.roundRect(a,b,w,hh,Math.min(.06,w/3,hh/3));else x.rect(a,b,w,hh);x.fill();x.strokeStyle=OL;x.lineWidth=lw||.045;x.stroke()},
 rod(x,a,b,c,d,w,col){x.strokeStyle=OL;x.lineWidth=w+.05;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();x.strokeStyle=col||'#e3e7eb';x.lineWidth=w;x.stroke()},
 cog(x,cx,cy,r,ang,n){x.save();x.translate(cx,cy);x.rotate(ang);x.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283,rr=i%2?r*.8:r;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.closePath();
  x.fillStyle='#9aa4ad';x.fill();x.strokeStyle=OL;x.lineWidth=.04;x.stroke();x.fillStyle='#3a4047';x.beginPath();x.arc(0,0,r*.35,0,7);x.fill();x.stroke();x.restore()},
 // hajótest + csiga (a mach() a régi test helyett hívja)
 body(x,o){TBM.cu=o.main?TBM.upd(o):(o.dr?0:1);if(!VART.hull(x,o))return false;TBM.screw(x,o);return true},
 // törmelékszállító csiga a test alsó csatornájában: fúráskor hátrafelé forog, kőzetdarabokkal
 screw(x,o){const ts=o.ts||0,run=o.dr&&o.act,off=run?(ts/1000*1.4)%.45:0;
  x.save();x.beginPath();x.rect(-13.0,.65,7.3,.52);x.clip();
  let col='#8a7558';try{if(typeof layer==='function')col=layer(S.depth)[4]||col}catch(e){}
  if(run)for(let i=0;i<26;i++){const px=-5.8-((i*.29+ts/1000*1.4+h(i)*.2)%7.2),py=.72+h(i+3)*.38;x.fillStyle=col;x.fillRect(px,py,.09+h(i+5)*.07,.07+h(i+8)*.06)}
  x.strokeStyle='#b9a27a';x.lineWidth=.07;for(let k=0;k<18;k++){const px=-5.75-k*.45+off;x.beginPath();x.moveTo(px,.66);x.lineTo(px-.24,1.16);x.stroke()}
  x.strokeStyle='#5a4a34';x.lineWidth=.05;x.beginPath();x.moveTo(-13,.91);x.lineTo(-5.7,.91);x.stroke();x.restore();
  // kiürítő garat: fúráskor kihulló kőzet a farokból
  if(run){for(let i=0;i<10;i++){const t=((ts/1000*1.1+h(i)*1.7)%1),px=-13.5-t*1.3,py=.78+t*t*.9+(h(i+2)-.5)*.25;x.globalAlpha=1-t*.7;x.fillStyle=i%3?col:'#4a3c2c';const z=.08+h(i+4)*.1;x.fillRect(px-z/2,py-z/2,z,z)}x.globalAlpha=1}},
 // motortér: behúzva a test belsejében (rács mögött), a felszínen hidraulikus emelőn kiemelkedik és „lélegzik”
 engine(x,o){const u=TBM.cu,ts=o.ts||0,tier=S.u.d,br=u*.05*Math.sin(ts/520),rise=u*1.7+br,s=.62,top=-1.35-u*3.6;
  x.save();x.beginPath();x.rect(-12.15,top,2.55,.15-top);x.clip();
  if(u>.02){x.lineCap='round';[-11.7,-10.05].forEach((ax,i)=>{TBM.rod(x,ax,.1,ax,.1-rise+.05,.16,'#5a626b');TBM.rod(x,ax,.1-rise*.45,ax,.1-rise+.05,.09,'#eef2f5')});
   // ollós emelő
   x.strokeStyle='#d8a020';x.lineWidth=.06;const n=3,hh=rise/n;for(let k=0;k<n;k++){const y=.1-k*hh;x.beginPath();x.moveTo(-11.4,y);x.lineTo(-10.35,y-hh);x.moveTo(-10.35,y);x.lineTo(-11.4,y-hh);x.stroke()}}
  x.translate(-10.875,.12-rise);x.scale(s,s);x.translate(10.9,1.42);
  const lw2=o.lw?(a,b)=>o.lw(-10.875+(a+10.9)*s,.12-rise+(b+1.42)*s):null;
  try{if(tier<2)VART.boiler(x,{ts,sk:o.sk});else VART.engine(x,{tier,ts,sp:o.sp,lw:lw2,GL:o.GL||[],lamp:o.lamp||(()=>{})})}catch(e){}
  x.restore();
  // rács a behúzott motor előtt
  if(u<.6){x.globalAlpha=1-u/.6;x.strokeStyle='#2a2f35';x.lineWidth=.06;for(let i=0;i<9;i++){const px=-12.05+i*.29;x.beginPath();x.moveTo(px,-1.3);x.lineTo(px,.1);x.stroke()}x.globalAlpha=1}
  // csapóajtók (a tetőn, kifelé nyílnak)
  const door=(hx,dir)=>{x.save();x.translate(hx,-1.72);x.rotate(-dir*u*1.75);TBM.box(x,dir>0?0:-1.27,-.09,1.27,.12,TBM.steel(x,-.09,.03));x.fillStyle='#e9eef2';for(let i=0;i<4;i++)x.fillRect((dir>0?.12:-1.15)+i*.3,-.06,.05,.05);x.restore()};
  door(-12.15,1);door(-9.6,-1)},
 // műszerárboc a kabin tetején
 mast(x,o){const u=TBM.cu;if(u<.03)return;const ts=o.ts||0,br=.04*Math.sin(ts/650),H=u*1.65+br*u,bx=-7.55,by=-1.72;
  // tető-fedél
  x.save();x.translate(bx-.32,by);x.rotate(-u*1.4);TBM.box(x,-.0,-.08,.32,.1,TBM.steel(x,-.08,.02));x.restore();
  const seg=[.16,.12,.085];seg.forEach((w,i)=>{const y0=by-H*(i/3),y1=by-H*((i+1)/3)-.08;TBM.rod(x,bx,y0,bx,y1,w,i?'#e3e7eb':'#9aa4ad')});
  const ty=by-H;
  // platform
  TBM.box(x,bx-.42,ty-.06,.84,.1,'#5a626b');
  // radar (forgó)
  const ra=ts/700,cw=Math.cos(ra);x.save();x.translate(bx-.22,ty-.32);TBM.rod(x,0,.26,0,.02,.04,'#c9d1d8');x.fillStyle=cw>0?'#dfe5ea':'#8e98a1';x.beginPath();x.ellipse(0,0,Math.max(.03,.26*Math.abs(cw)),.17,0,0,7);x.fill();x.strokeStyle=OL;x.lineWidth=.035;x.stroke();x.fillStyle='#3a4047';x.beginPath();x.arc(.0,0,.04,0,7);x.fill();x.restore();
  // mutatós műszer
  const gx=bx+.2,gy=ty-.24,gr=.16;x.fillStyle='#f3ecd8';x.beginPath();x.arc(gx,gy,gr,0,7);x.fill();x.strokeStyle=OL;x.lineWidth=.04;x.stroke();
  x.strokeStyle='#c0392b';x.lineWidth=.03;x.beginPath();x.arc(gx,gy,gr*.78,-.5,.2);x.stroke();
  const na=-2.4+1.9*(.5+.35*Math.sin(ts/900)+.1*Math.sin(ts/170));x.strokeStyle='#111';x.lineWidth=.025;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(na)*gr*.8,gy+Math.sin(na)*gr*.8);x.stroke();
  // szélmérő
  const wx=bx+.36,wy=ty-.62;TBM.rod(x,wx,ty-.06,wx,wy,.03,'#c9d1d8');for(let k=0;k<3;k++){const a=ts/180+k*2.094,c=Math.cos(a);x.fillStyle=c>0?'#e9eef2':'#7d8892';x.beginPath();x.arc(wx+c*.14,wy,.045,0,7);x.fill();x.strokeStyle=OL;x.lineWidth=.02;x.stroke()}
  // antenna + jelzőfény
  TBM.rod(x,bx-.36,ty-.06,bx-.36,ty-.75,.025,'#c9d1d8');const bl=Math.sin(ts/260)>.4;x.fillStyle=bl?'#ff3b2f':'#5a1a14';x.beginPath();x.arc(bx-.36,ty-.78,.05,0,7);x.fill();
  if(bl&&o.lw&&o.GL){const[a,b]=o.lw(bx-.36,ty-.78);o.GL.push({x:a,y:b,r:26,c:'255,60,40',i:.35})}},
 // pajzs: fúráskor az oldalsó fékező hidraulika a falnak feszül; a felszínen a páncéllemezek felnyílnak, alattuk forog a hajtómű
 shield(x,o){const u=TBM.cu,ts=o.ts||0,run=o.dr&&o.act,dep=o.dep||0;
  // hajtómű a lemezek alatt (csak nyitva látszik)
  if(u>.03){[-1,1].forEach(sg=>{TBM.cog(x,-3.55,sg*1.25,.32,(o.sp||0)*.4*sg+ts/900,10);TBM.cog(x,-2.95,sg*1.38,.2,-(o.sp||0)*.64*sg-ts/560,8)});
   [-1,1].forEach(sg=>{x.save();x.translate(-4.3,sg*1.66);x.rotate(-sg*u*.42);TBM.box(x,0,sg>0?-.12:0,2.05,.12,TBM.steel(x,-.12,.12));x.fillStyle='#f2b705';x.fillRect(1.7,sg>0?-.11:.01,.3,.1);x.restore();
    // emelőhenger
    const ex=-3.3,ey0=sg*1.5,ang=u*.42,ey1=sg*(1.66+Math.sin(ang)*1.0);TBM.rod(x,ex,ey0,ex,ey1,.09,'#e3e7eb')})}
  // oldalsó fékező/támasztó hidraulika (fúrás közben ütemesen dolgozik, a föld alatt kitolva tart)
  const e=run?.12+.12*(.5+.5*Math.sin(ts/280)):dep*.1;
  [-1,1].forEach(sg=>{const y0=sg*1.6,y1=sg*(1.78+e);[-3.75,-2.55].forEach(px=>{TBM.box(x,px-.12,sg>0?1.5:-1.72,.24,.22,'#3a4047',.035);TBM.rod(x,px,y0,px,y1,.08,'#eef2f5')});
   TBM.box(x,-3.95,sg>0?y1:y1-.13,1.6,.13,run&&Math.sin(ts/280)>.6?'#6a5a3a':'#2f3136',.04);
   x.setLineDash([.1,.2]);x.lineDashOffset=-ts/220;x.strokeStyle=`rgba(255,170,40,${run?.7:.25})`;x.lineWidth=.04;x.beginPath();x.moveTo(-4.4,sg*1.45);x.lineTo(-3.75,y0);x.stroke();x.setLineDash([])})},
 post(x,o){TBM.mast(x,o)}
};
W.TBM=TBM;
})(typeof window!=='undefined'?window:globalThis);
