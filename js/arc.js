/* Drill Up – íves forduló a föld alatt.
   Eddig: föld alatt irányt váltani csak kifúrt forgókamrában lehetett (a gép megállt, kamrát fúrt, ott megfordult).
   Most: a merőleges irányváltás (fel/le ↔ jobbra/balra) ívben történik: a gép a megadott sugarú negyedkört fúrja végig,
   közben folyamatosan fordul – a kanyar a járat része marad, és a gép teste az ív érintője szerint áll.
   • Az ív a meglévő, tengely-irányú adatmodellen fut: az ív sok rövid vízszintes/függőleges szakaszra van bontva (lépcsőzetesen),
     ezért a mentések, a visszaút (S.tr), a járathálózat és az esés-fizika változatlanul működnek; a 4,4 m széles járatban a lépcső simának látszik.
   • Megfordulás (balra↔jobbra, fel↔le) továbbra is forgókamrát kíván (chamber.js), a meglévő kamrák és járatok érvényesek.
   • Ha a gép előtt már kész járat van (szabad haladás), vagy kamrában áll, vagy a felszín közelében van, a régi viselkedés marad.
   • Alapból KI (a játék a régi, függőleges fúrást használja); Beállítások → „Íves forduló és merülés" (S.set.arc === 1) kapcsolja be. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('arc');
const VEC={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]},ax=d=>d==='L'||d==='R'?0:1,N=16,MINDEPTH=2.5;
const ARC={R:12,N,RD:30,ND:24,pl:null,hv:null,pp:null,told:0,
 on(){try{return S.set.arc===1}catch(e){return false}},
 dir(){try{if(S.st.length===1&&'LRUD'.includes(S.st))return S.st;if(S.st==='idle'){if(S.ahd&&'LRUD'.includes(S.ahd))return S.ahd;if(S.depth<=MINDEPTH&&typeof lastD!=='undefined'&&(lastD==='L'||lastD==='R'))return lastD}}catch(e){}return null},
 // a tervezett ív szakaszai: [irány, hossz] – az ív kezdőirányában mindig előbb halad, majd az új irányban
 legs(cur,s,R,n){const out=[];for(let k=1;k<=n;k++){const p0=(k-1)/n*Math.PI/2,p1=k/n*Math.PI/2;out.push([cur,R*(Math.sin(p1)-Math.sin(p0))],[s,R*(Math.cos(p0)-Math.cos(p1))])}return out},
 // a go() hívja: ha ívben kell fordulni, az első szakasz irányát adja vissza, különben null (a régi viselkedés)
 go(s){try{
  if(typeof S==='undefined'||!S)return null;
  if(s==='idle'||s==='H'||!VEC[s]){ARC.pl=null;return null}
  const pl=ARC.pl;
  if(pl){if(s===pl.tgt)return pl.legs[pl.i][0];S.ahd=pl.legs[pl.i][0];ARC.pl=null}
  const cur=ARC.dir();S.ahd=s;
  if(!ARC.on()||!cur||cur===s||ax(cur)===ax(s)||S.st==='H')return null;
  const dive=S.depth<=MINDEPTH;                                                       // felszínről lefelé: merülés ívben
  if(dive&&s!=='D')return null;
  if(W.NET&&(NET.falling||NET.ahead(S.x,S.depth,VEC[s][0],VEC[s][1])>NET.hw+.1))return null; // kész járat folytatódik: szabad haladás (a járat saját végének lekerekítése még nem járat)
  if(W.CH&&CH.at(S.x,S.depth))return null;                                           // kamrában a régi gyors fordulás
  const legs=dive?ARC.legs(cur,s,ARC.RD,ARC.ND):ARC.legs(cur,s,ARC.R,ARC.N);let up=0;for(const l of legs)if(l[0]==='U')up+=l[1];
  if(up>0&&up>S.depth-1.5)return null;                                                     // a felszín közelében nincs hely az ívre
  ARC.pl={legs,i:0,rem:legs[0][1],tgt:s,cur};
  if(!ARC.told){ARC.told=1;try{msg(dive?'↪ A gép ívben merül a földbe – a hátulja nem emelkedik fel.':'↪ Íves forduló: a gép '+ARC.R+' m sugarú ívben fúrja át magát a kanyaron – nem kell forgókamra.',true)}catch(e){}}
  return legs[0][0]}catch(e){if(W.DBG)DBG.err='arc: '+(e.message||e);ARC.pl=null;return null}},
 // a step() a lépéshossz korlátozására hívja (egy szakasz végén megáll, hogy az ív pontos legyen)
 cap(d){const p=ARC.pl;return p?Math.min(d,Math.max(1e-6,p.rem)):d},
 // egy megtett lépés után: szakasz-váltás
 after(d){const p=ARC.pl;if(!p||!(d>0))return;p.rem-=d;
  if(p.rem<=1e-6){p.i++;if(p.i>=p.legs.length){S.st=p.tgt;S.ahd=p.tgt;ARC.pl=null;ARC.hv=VEC[p.tgt].slice();ARC.hk=1}else{S.st=p.legs[p.i][0];p.rem=p.legs[p.i][1]}}},
 // a gép irányvektora (simított): az ív érintőjét közelíti
 upd(){if(typeof S==='undefined'||!S)return;const x=S.x,d=S.depth,pp=ARC.pp;ARC.pp=[x,d];
  const axv=()=>{const c=ARC.dir();return c&&VEC[c]?{v:VEC[c].slice(),k:1}:{v:[1,0],k:0}};
  if(S.depth<=MINDEPTH&&!ARC.pl){const a=axv();ARC.hv=a.v;ARC.hk=a.k;return}
  if(!ARC.hv||!pp){const a=axv();ARC.hv=a.v;ARC.hk=a.k;return}
  // ív közben a tájolás az ív geometriájából jön (gyorsított futásnál is sima): érintő = h0·cosφ + h1·sinφ
  const P=ARC.pl;if(P){const h0=VEC[P.cur],h1=VEC[P.tgt],ph=(P.i+1-Math.max(0,P.rem)/Math.max(1e-9,P.legs[P.i][1])*.5)/P.legs.length*Math.PI/2;ARC.hv=[h0[0]*Math.cos(ph)+h1[0]*Math.sin(ph),h0[1]*Math.cos(ph)+h1[1]*Math.sin(ph)];ARC.hk=1;return}
  const dx=x-pp[0],dy=d-pp[1],m=Math.hypot(dx,dy);if(m<1e-9)return;
  // ha az irány nem ismert (pl. betöltés után), az első elmozdulás adja; nagy ugrásnál (gyorsított futás) is az elmozdulás iránya
  if(!ARC.hk||m>=6){ARC.hv=[dx/m,dy/m];ARC.hk=1;return}
  const a=1-Math.exp(-m/2.2),h=ARC.hv,nx=h[0]*(1-a)+dx/m*a,ny=h[1]*(1-a)+dy/m*a,l=Math.hypot(nx,ny)||1;ARC.hv=[nx/l,ny/l]},
 // a kirajzoláshoz: ha a gép ívben halad, a test szöge és tájolása; egyenes szakaszon null (a régi tájolás él)
 hd(){const h=ARC.hv;if(!h||typeof S==='undefined'||!S||(S.depth<=MINDEPTH&&!ARC.pl)||(W.NET&&NET.falling))return null;if(Math.abs(h[0]*h[1])<.02)return null;
  return h[0]>=0?{ang:Math.atan2(h[1],h[0]),fc:1}:{ang:Math.atan2(-h[1],-h[0]),fc:-1}}};
W.ARC=ARC;
if(W.on)on('step',()=>{try{ARC.upd()}catch(e){if(W.DBG)DBG.err='arc: '+(e.message||e)}});
})(typeof window!=='undefined'?window:globalThis);
