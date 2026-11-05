/* Drill Up – a jármű világítása: a lámpák a karosszérián ülnek (nem a fúrófejen).
   Elöl a motorház-orron (a fúrófej mögött) előre világító fényszórók, hátul piros-fehér tolatólámpa hátrafelé,
   a hasán és a tetején oldalsó munkalámpák, amelyek a járat falát/padlóját/mennyezetét világítják meg. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('vlight');
const VL={
 // lámpa-helyek a gép méteres koordinátáiban (x: előre +, y: lefelé +)
 P:{front:[-4.6,-1.62],frontLow:[-4.6,1.25],rear:[-12.05,-.6],sideTop:[-7.4,-1.64],sideBot:[-7.4,1.25],sideF:[-5.8,1.25],sideR:[-9.6,1.25]},
 // a rajz: lencse + fény a karosszérián (a mach() végén)
 mach(x,o){const on=!!o.lit,k=on?1:.35,P=VL.P;x.save();
  const lens=(p,w,h,col,glow)=>{x.fillStyle='#1b1c1f';x.fillRect(p[0]-w/2-.05,p[1]-h/2-.05,w+.1,h+.1);x.fillStyle=on?col:'#8d949a';x.fillRect(p[0]-w/2,p[1]-h/2,w,h);
   if(on&&glow){x.globalCompositeOperation='lighter';const g=x.createRadialGradient(p[0],p[1],0,p[0],p[1],glow);g.addColorStop(0,col==='#ff5a4a'?'rgba(255,60,40,.4)':'rgba(255,240,190,.3)');g.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=g;x.beginPath();x.arc(p[0],p[1],glow,0,7);x.fill();x.globalCompositeOperation='source-over'}};
  const pl=window.PNT?PNT.lens:(c=>c);lens(P.front,.34,.26,pl('#fff6cc'),.6);lens(P.frontLow,.3,.2,pl('#fff0b8'),.4);lens(P.rear,.2,.34,'#ff5a4a',.6);
  lens(P.sideTop,.5,.14,pl('#ffe9a8'),.45);lens(P.sideBot,.5,.14,pl('#ffe9a8'),.4);lens(P.sideF,.3,.12,pl('#ffe9a8'),.3);lens(P.sideR,.3,.12,pl('#ffe9a8'),.3);
  x.restore()},
 // a megvilágítás: kúpok + izzás (a gép képernyőn lévő pontjaival)
 light(c){const{lw,lamp,CN,GL,fc,cA,sA,dr,eL,ts}=c,P=VL.P,fl=(window.DMG&&S.hp<30)?(.55+.45*Math.abs(Math.sin(ts/170))):1,e=eL*fl;
  const hx=fc*cA,hy=fc*sA,px=hy,py=-hx;                        // haladási irány és a rá merőleges ("fent" a gép felől)
  const at=p=>lw(p[0],p[1]);
  // elöl: két fényszóró előre (egy magasabb, egy alacsonyabb), a fúrófej fölött/mögött
  let[a,b]=at(P.front);CN.push({x:a,y:b,dx:hx,dy:hy,len:(dr?60:210)*e,s:.46});lamp(a,b,dr?70:85,.6*e);GL.push({x:a,y:b,r:55,c:'255,225,150',i:.12*e});
  [a,b]=at(P.frontLow);CN.push({x:a,y:b,dx:hx,dy:hy,len:(dr?40:140)*e,s:.5});lamp(a,b,60,.4*e);
  // hátul: tolatólámpa hátrafelé
  [a,b]=at(P.rear);CN.push({x:a,y:b,dx:-hx,dy:-hy,len:(dr?45:120)*e,s:.55});lamp(a,b,70,.5*e);GL.push({x:a,y:b,r:45,c:'255,70,50',i:.12*e});
  // oldalra: munkalámpák a tetőről és a hasról – a járat falát/padlóját/mennyezetét világítják (a haladásra merőlegesen)
  [a,b]=at(P.sideTop);CN.push({x:a,y:b,dx:px,dy:py,len:38*e,s:.6});lamp(a,b,50,.4*e);
  [a,b]=at(P.sideBot);CN.push({x:a,y:b,dx:-px,dy:-py,len:34*e,s:.6});lamp(a,b,46,.35*e);
  [a,b]=at(P.sideF);lamp(a,b,40,.25*e);[a,b]=at(P.sideR);lamp(a,b,40,.25*e);
  // a test fedélzeti fénye (az ablakok és a fülke) – ez volt a régi "motortér" lámpa
  [a,b]=lw(-6.9,-.75);lamp(a,b,50,.3*e)}
};
W.VL=VL;
})(window);
