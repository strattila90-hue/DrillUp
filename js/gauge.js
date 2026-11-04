/* Drill Up – jobb szélső mélységjelző: réteg-létra (minden réteg látható, rétegen belül logaritmikus), valós arányú csík,
   és egy felirat arról, melyik rétegben vagyunk (név, mélység, hőmérséklet, nyomás, a réteg alja). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('gauge');
const SHORT=['Talaj','Üledék','Üledékes kőzet','Gránit-kéreg','Bazalt-kéreg','Felső köpeny','Átmeneti zóna','Alsó köpeny','D″ réteg','Külső mag','Belső mag'];
const TICK=['3 m','400 m','4 km','20 km','35 km','410 km','660 km','2700 km','2890 km','5150 km'];
const GG={
 pos(d){const n=LY.length;let i=0;for(;i<n-1;i++)if(d<LY[i][2])break;const l=LY[i],t=Math.log1p(Math.max(0,d-l[1]))/Math.log1p(l[2]-l[1]);return{i,p:(i+Math.min(1,Math.max(0,t)))/n}},
 fd(m){return m>=1e6?(m/1e3).toFixed(0).replace(/\B(?=(\d{3})+$)/g,' ')+' km':m>=1e3?(m/1e3).toFixed(m>=1e5?0:1).replace('.',',')+' km':Math.round(m)+' m'},
 draw(V){const x=V.x,w=V.w,h=V.h;if(typeof S==='undefined'||typeof LY==='undefined')return;const d=Math.max(0,typeof ry==='number'?ry:S.depth),R6=6371e3;
  const y0=50,y1=h-64,H=y1-y0;if(H<160)return;const bx=w-26,bw=14,n=LY.length,lh=H/n,ps=GG.pos(d);
  x.save();x.fillStyle='rgba(8,10,12,.5)';x.beginPath();x.roundRect?x.roundRect(bx-4,y0-14,bw+24,H+28,7):x.rect(bx-4,y0-14,bw+24,H+28);x.fill();
  // a létra: minden réteg a saját színével, az aktuális fénylik
  for(let i=0;i<n;i++){const l=LY[i];x.fillStyle=l[4];x.globalAlpha=i===ps.i?1:.78;x.fillRect(bx,y0+i*lh,bw,lh-1);if(i===ps.i){x.globalAlpha=.35;x.fillStyle='#fff';x.fillRect(bx,y0+i*lh,bw,lh-1);x.globalAlpha=1;x.strokeStyle='#fff';x.lineWidth=1.2;x.strokeRect(bx+.5,y0+i*lh+.5,bw-1,lh-2)}}
  x.globalAlpha=1;
  // a réteghatárok mélysége (a létra bal oldalán)
  x.font='7px Georgia';x.textAlign='right';x.fillStyle='rgba(235,225,205,.7)';for(let i=0;i<TICK.length&&i<n-1;i++)x.fillText(TICK[i],bx-2,y0+(i+1)*lh+2.5);
  x.fillText('0',bx-2,y0+7);x.fillText('6371 km',w-6,y1+11);
  // valós arányú csík: a teljes Föld, lineárisan – látszik, mennyire kevés a kéreg
  const rx=bx+bw+3,rw=4;x.fillStyle='rgba(255,255,255,.12)';x.fillRect(rx,y0,rw,H);for(const l of LY){x.fillStyle=l[4];x.fillRect(rx,y0+l[1]/R6*H,rw,Math.max(.6,(l[2]-l[1])/R6*H))}
  const ry2=y0+Math.min(1,d/R6)*H;x.fillStyle='#fff';x.fillRect(rx-2,ry2-.6,rw+4,1.4);
  // mutató
  const my=y0+ps.p*H;x.fillStyle='#fff';x.beginPath();x.moveTo(bx-1,my);x.lineTo(bx-8,my-5);x.lineTo(bx-8,my+5);x.closePath();x.fill();
  // felirat: melyik rétegben vagyunk
  const L=LY[ps.i],T=window.VOL?VOL.tm(S.x,d,lerp(TT,d)):lerp(TT,d),Pg=lerp(PT,d),name=SHORT[ps.i]||L[0];
  const lines=[[name,'bold 11px Georgia','#ffffff'],[d<1?'Felszín':GG.fd(d)+' mélyen','11px Georgia','#f2eadb'],['🌡 '+Math.round(T)+' °C · '+(Pg<1?Math.round(Pg*1000)+' MPa':Pg.toFixed(Pg<10?1:0).replace('.',',')+' GPa'),'9px Georgia','#ffcf9a'],['réteg alja: '+GG.fd(L[2])+(L[2]-d>0?' (még '+GG.fd(L[2]-d)+')':''),'8px Georgia','#b8ab96']];
  x.font='bold 11px Georgia';let bw2=0;for(const t of lines){x.font=t[1];bw2=Math.max(bw2,x.measureText(t[0]).width)}bw2+=14;const bh=lines.length*13+8;
  let by=Math.min(Math.max(my-bh/2,y0-10),y1+14-bh),bxx=bx-12-bw2;{const q=window.SZ&&SZ.rect?SZ.rect(V):null;if(q&&bxx<q.x+q.w+4&&bxx+bw2>q.x-4&&by<q.y+q.h+4&&by+bh>q.y-4){const dn=q.y+q.h+6;by=dn+bh<=y1+14?dn:Math.max(y0-10,q.y-bh-6)}}
  if(window.PN&&!PN.vis('gg')){x.restore();return}if(window.PN)PN.reg('gg',bxx,by,bw2,bh);
  x.fillStyle='rgba(10,12,14,.82)';x.strokeStyle=L[4];x.lineWidth=1.2;x.beginPath();x.roundRect?x.roundRect(bxx,by,bw2,bh,6):x.rect(bxx,by,bw2,bh);x.fill();x.stroke();
  x.fillStyle='rgba(10,12,14,.82)';x.beginPath();x.moveTo(bxx+bw2,my-4);x.lineTo(bxx+bw2+4,my);x.lineTo(bxx+bw2,my+4);x.fill();
  x.textAlign='left';lines.forEach((t,i)=>{x.font=t[1];x.fillStyle=t[2];x.fillText(t[0],bxx+7,by+14+i*13)});
  x.restore()}
};
W.GG=GG;
if(typeof W.on==='function')on('hud',V=>{try{GG.draw(V)}catch(e){DBG.err='gauge: '+(e.message||e)}});
})(window);
