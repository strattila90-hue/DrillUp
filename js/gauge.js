/* Drill Up – jobb szélső mélységjelző: réteg-létra (minden réteg látható, rétegen belül logaritmikus), valós arányú csík,
   és egy felirat arról, melyik rétegben vagyunk (név, mélység, hőmérséklet, nyomás, a réteg alja). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('gauge');
const SHORT=['Talaj','Üledék','Üledékes kőzet','Gránit-kéreg','Bazalt-kéreg','Felső köpeny','Átmeneti zóna','Alsó köpeny','D″ réteg','Külső mag','Belső mag'];
const TICK=['3 m','400 m','4 km','20 km','35 km','410 km','660 km','2700 km','2890 km','5150 km'];
const GG={
 // a rétegek magassága a valós vastagsággal arányos (a vékony kéregrétegek legalább MINH képpont magasak, a maradék helyet a valós vastagság osztja el)
 lay(H){const n=LY.length,MINH=11,R=6371e3,th=LY.map(l=>l[2]-l[1]);let fixed=0,real=0;const small=th.map(t=>t/R*H<MINH);th.forEach((t,i)=>{if(small[i])fixed+=MINH;else real+=t});
  const hs=th.map((t,i)=>small[i]?MINH:t/real*(H-fixed));const off=[0];for(let i=0;i<n;i++)off.push(off[i]+hs[i]);return{hs,off,small}},
 pos(d,H){H=H||600;const n=LY.length;let i=0;for(;i<n-1;i++)if(d<LY[i][2])break;const L=GG.lay(H),l=LY[i],t=L.small[i]?Math.log1p(Math.max(0,d-l[1]))/Math.log1p(l[2]-l[1]):Math.max(0,d-l[1])/(l[2]-l[1]);return{i,p:(L.off[i]+L.hs[i]*Math.min(1,Math.max(0,t)))/H,L}},
 fd(m){return m>=1e6?(m/1e3).toFixed(0).replace(/\B(?=(\d{3})+$)/g,' ')+' km':m>=1e3?(m/1e3).toFixed(m>=1e5?0:1).replace('.',',')+' km':Math.round(m)+' m'},
 draw(V){const x=V.x,w=V.w,h=V.h;if(typeof S==='undefined'||typeof LY==='undefined')return;const d=Math.max(0,typeof ry==='number'?ry:S.depth),R6=6371e3;
  const y0=50,y1=h-64,H=y1-y0;if(H<160)return;const bx=w-26,bw=14,n=LY.length,ps=GG.pos(d,H),LAY=ps.L,ly=i=>y0+LAY.off[i],lh=0;
  x.save();x.fillStyle='rgba(8,10,12,.5)';x.beginPath();x.roundRect?x.roundRect(bx-4,y0-14,bw+24,H+28,7):x.rect(bx-4,y0-14,bw+24,H+28);x.fill();
  // a létra: minden réteg a saját színével, az aktuális fénylik
  for(let i=0;i<n;i++){const l=LY[i],yy=ly(i),hh=LAY.hs[i];x.fillStyle=l[4];x.globalAlpha=i===ps.i?1:.78;x.fillRect(bx,yy,bw,hh-1);if(i===ps.i){x.globalAlpha=.35;x.fillStyle='#fff';x.fillRect(bx,yy,bw,hh-1);x.globalAlpha=1;x.strokeStyle='#fff';x.lineWidth=1.2;x.strokeRect(bx+.5,yy+.5,bw-1,hh-2)}}
  x.globalAlpha=1;
  // a réteghatárok mélysége (a létra bal oldalán)
  x.font='7px Georgia';x.textAlign='right';x.fillStyle='rgba(235,225,205,.7)';let lastY=-9;for(let i=0;i<TICK.length&&i<n-1;i++){const ty=ly(i+1)+2.5;if(ty-lastY<7.5)continue;lastY=ty;x.fillText(TICK[i],bx-2,ty)}
  x.fillText('0',bx-2,y0+7);x.fillText('6371 km',w-6,y1+11);
  // valós arányú csík: a teljes Föld, lineárisan – látszik, mennyire kevés a kéreg
  const rx=bx+bw+3,rw=4;x.fillStyle='rgba(255,255,255,.12)';x.fillRect(rx,y0,rw,H);for(const l of LY){x.fillStyle=l[4];x.fillRect(rx,y0+l[1]/R6*H,rw,Math.max(.6,(l[2]-l[1])/R6*H))}
  const ry2=y0+Math.min(1,d/R6)*H;x.fillStyle='#fff';x.fillRect(rx-2,ry2-.6,rw+4,1.4);
  // mutató
  const my=y0+ps.p*H;x.fillStyle='#fff';x.beginPath();x.moveTo(bx-1,my);x.lineTo(bx-8,my-5);x.lineTo(bx-8,my+5);x.closePath();x.fill();
  // felirat: melyik rétegben vagyunk
  const L=LY[ps.i],T=window.VOL?VOL.tm(S.x,d,lerp(TT,d)):lerp(TT,d),Pg=lerp(PT,d),name=SHORT[ps.i]||L[0];
  const lines=[[name,'bold 11px Georgia','#ffffff'],[d<1?'Felszín':GG.fd(d)+' mélyen','11px Georgia','#f2eadb'],['🌡 '+Math.round(T)+' °C · '+(Pg<1?Math.round(Pg*1000)+' MPa':Pg.toFixed(Pg<10?1:0).replace('.',',')+' GPa'),'9px Georgia','#ffcf9a']];
  x.font='bold 11px Georgia';let bw2=0;for(const t of lines){x.font=t[1];bw2=Math.max(bw2,x.measureText(t[0]).width)}bw2+=14;const bh=lines.length*13+8;
  let by=Math.min(Math.max(my-bh/2,y0-10),y1+14-bh),bxx=bx-40-bw2;for(const id of['sz','lab']){const q=window.PN?PN.rc(id):(id==='sz'&&window.SZ&&SZ.rect?SZ.rect(V):null);if(q&&bxx<q.x+q.w+4&&bxx+bw2>q.x-4&&by<q.y+q.h+4&&by+bh>q.y-4){const dn=q.y+q.h+6;by=dn+bh<=y1+14?dn:Math.max(y0-10,q.y-bh-6)}}
  if(window.PN&&!PN.vis('gg')){x.restore();return}if(window.PN)PN.reg('gg',bxx,by,bw2,bh);
  x.fillStyle='rgba(10,12,14,.66)';x.strokeStyle=L[4];x.lineWidth=1.2;x.beginPath();x.roundRect?x.roundRect(bxx,by,bw2,bh,6):x.rect(bxx,by,bw2,bh);x.fill();x.stroke();
  x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1;x.beginPath();x.moveTo(bxx+bw2,Math.min(Math.max(my,by+6),by+bh-6));x.lineTo(bxx+bw2+6,Math.min(Math.max(my,by+6),by+bh-6));x.lineTo(bx-10,my);x.stroke();
  x.textAlign='left';lines.forEach((t,i)=>{x.font=t[1];x.fillStyle=t[2];x.fillText(t[0],bxx+7,by+14+i*13)});
  x.restore()}
};
W.GG=GG;
if(typeof W.on==='function')on('hud',V=>{try{GG.draw(V)}catch(e){DBG.err='gauge: '+(e.message||e)}});
})(window);
