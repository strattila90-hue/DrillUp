/* Drill Up – legrövidebb hazaút. A gép a bejárt járatokon nem fordul vissza a teljes úton, hanem a járathálózat (S.tn) pontos
   metszéspontjain át a legrövidebb úton megy a felszínre (Dijkstra). Az eredmény a visszaút-verem (S.tr) új tartalma.
   Biztonság: csak a járatok középvonalán és pontos kereszteződésein át számol; ha a gép nem a hálózaton áll, vagy a felszín nem
   elérhető (pl. a 3000 szakaszos korlát miatt elveszett a tető), a régi, bizonyítottan járható visszaút marad. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('route');
const E=.02,SNAP=2.4,OPD={D:'U',U:'D',L:'R',R:'L'};
const key=(x,d)=>Math.round(x*100)+','+Math.round(d*100);
class Heap{constructor(){this.a=[]}push(k,p){const a=this.a;a.push([p,k]);let i=a.length-1;while(i>0){const q=(i-1)>>1;if(a[q][0]<=a[i][0])break;[a[q],a[i]]=[a[i],a[q]];i=q}}
 pop(){const a=this.a;if(!a.length)return null;const t=a[0],l=a.pop();if(a.length){a[0]=l;let i=0;for(;;){let m=i;const L=2*i+1,R=L+1;if(L<a.length&&a[L][0]<a[m][0])m=L;if(R<a.length&&a[R][0]<a[m][0])m=R;if(m===i)break;[a[m],a[i]]=[a[i],a[m]];i=m}}return t}}
const RT={
 trailLen(tr){return tr.reduce((a,t)=>a+t[1],0)},
 // a járatok szakaszai: függőleges {v:1,c:x,lo,hi} és vízszintes {v:0,c:mélység,lo,hi}; pts = a szakaszon lévő csomópontok
 segs(){const out=[];for(const g of S.tn){if(!Array.isArray(g)||g.length<4)continue;const[a,b,c,d]=g;if(a===c&&b!==d)out.push({v:1,c:a,lo:Math.min(b,d),hi:Math.max(b,d)});else if(b===d&&a!==c)out.push({v:0,c:b,lo:Math.min(a,c),hi:Math.max(a,c)})}
  for(const s of out)s.pts=[s.lo,s.hi];return out},
 connect(segs){const V=segs.filter(s=>s.v),H=segs.filter(s=>!s.v);
  for(const a of V)for(const b of H)if(b.lo-E<=a.c&&a.c<=b.hi+E&&a.lo-E<=b.c&&b.c<=a.hi+E){a.pts.push(Math.min(a.hi,Math.max(a.lo,b.c)));b.pts.push(Math.min(b.hi,Math.max(b.lo,a.c)))}
  const grp=new Map();for(const s of segs){const k=s.v+'|'+Math.round(s.c*50);(grp.get(k)||grp.set(k,[]).get(k)).push(s)}
  for(const g of grp.values())if(g.length>1)for(let i=0;i<g.length;i++)for(let j=i+1;j<g.length;j++){const a=g[i],b=g[j];if(a.hi<b.lo-E||b.hi<a.lo-E)continue;for(const p of[a.lo,a.hi])if(p>=b.lo-E&&p<=b.hi+E)b.pts.push(p);for(const p of[b.lo,b.hi])if(p>=a.lo-E&&p<=a.hi+E)a.pts.push(p)}},
 // a legközelebbi szakasz-pont a géphez (a járat kapszulájában, SNAP méteren belül)
 snap(segs){let best=null,bd=SNAP;for(const s of segs){let dx,dd,px,pd;if(s.v){dx=Math.abs(S.x-s.c);pd=Math.min(s.hi,Math.max(s.lo,S.depth));dd=Math.abs(S.depth-pd);px=s.c}else{dd=Math.abs(S.depth-s.c);px=Math.min(s.hi,Math.max(s.lo,S.x));dx=Math.abs(S.x-px);pd=s.c}
   const d=Math.hypot(dx,dd);if(d<bd){bd=d;best={s,px,pd}}}return best},
 path(){ // [[irány,hossz],...] a gépről a felszínre, vagy null
  if(!S.tn.length||S.depth<=E)return null;const segs=RT.segs();if(!segs.length)return null;RT.connect(segs);const sn=RT.snap(segs);if(!sn)return null;
  sn.s.pts.push(sn.s.v?sn.pd:sn.px);
  const pos=new Map(),adj=new Map(),node=(x,d)=>{const k=key(x,d);if(!pos.has(k)){pos.set(k,[x,d]);adj.set(k,[])}return k};
  for(const s of segs){const p=[...new Set(s.pts.map(v=>Math.round(v*100)))].sort((a,b)=>a-b).map(v=>v/100);
   for(let i=0;i+1<p.length;i++){const a=s.v?node(s.c,p[i]):node(p[i],s.c),b=s.v?node(s.c,p[i+1]):node(p[i+1],s.c),l=p[i+1]-p[i];if(!(l>0))continue;
    adj.get(a).push([b,l,s.v?'D':'R']);adj.get(b).push([a,l,s.v?'U':'L'])}}
  const src=node(sn.s.v?sn.s.c:sn.px,sn.s.v?sn.pd:sn.s.c),dist=new Map([[src,0]]),prev=new Map(),h=new Heap();h.push(src,0);let goal=null;
  while(true){const t=h.pop();if(!t)break;const[dd,k]=t;if(dd>dist.get(k)+1e-9)continue;if(pos.get(k)[1]<=E){goal=k;break}
   for(const[n,l,dir]of adj.get(k)){const nd=dd+l;if(!dist.has(n)||nd<dist.get(n)-1e-9){dist.set(n,nd);prev.set(n,[k,l,dir]);h.push(n,nd)}}}
  if(goal===null)return null;
  const moves=[];for(let k=goal;k!==src;){const[p,l,dir]=prev.get(k);moves.push([dir,l]);k=p}moves.reverse(); // gép → felszín (a haladás iránya)
  const pre=[];const odd=sn.pd-S.depth,odx=sn.px-S.x;if(Math.abs(odx)>E)pre.push([odx>0?'R':'L',Math.abs(odx)]);if(Math.abs(odd)>E)pre.push([odd>0?'D':'U',Math.abs(odd)]);
  return pre.concat(moves)},
 // a visszaút-verem (S.tr): bázis → gép irányú lépések; a hazaút ennek a megfordítása
 // közvetlen akna: a gép helyétől egyenesen fel a felszínre (új járat), majd a felszínen a bázisig. Csak akkor, ha a fej minden
 // rétegen áthatol és az üzemanyag bőven elég. A becsült fúrási fogyasztás: rétegenként c.fr / fúrási sebesség.
 digPlan(){if(S.depth<=E)return null;const cap=window.BIT?BIT.cap():HD[S.u.f][1],d0=S.depth;let fuel=0,ok=true;
  try{for(let d=d0;d>0;d-=Math.min(d,60)){const dm=Math.max(0,d-30);S.depth=dm;const c=calc(),hd=HR[LY.indexOf(c.L)];if(hd>cap){ok=false;break}
   const r=hd/cap,v=Math.min(3,c.v/((.55+.9*Math.min(r,1.15))/(1+.35*S.u.f)));fuel+=Math.min(60,d)*c.fr/Math.max(.05,v)}}finally{S.depth=d0}
  if(!ok)return null;return{fuel,len:d0+Math.abs(S.x)}},
 digFpm(c){const cap=window.BIT?BIT.cap():HD[S.u.f][1],hd=HR[LY.indexOf(c.L)],r=hd/cap,v=Math.min(3,c.v/((.55+.9*Math.min(r,1.15))/(1+.35*S.u.f)));return c.fr/Math.max(.05,v)},
 markDig(x0,d0,dist,c){const g=S.tn.at(-1),x1=S.x,d1=S.depth;if(g&&g[2]==x0&&g[3]==d0&&g[0]==g[2]&&x0==x1)g[3]=d1,g[4]=Date.now();else{S.tn.push([x0,d0,x1,d1,Date.now()]);if(S.tn.length>3000)S.tn.shift()}
  if(window.BIT&&BIT.wear)BIT.wear(dist,c.L)},
 home(){const p=RT.path();let net=null;
  if(p&&p.length){const fwd=[];for(let i=p.length-1;i>=0;i--){const d=OPD[p[i][0]],l=p[i][1];if(fwd.length&&fwd[fwd.length-1][0]===d)fwd[fwd.length-1][1]+=l;else fwd.push([d,l])}
   const dv=fwd.reduce((a,t)=>a+(t[0]==='D'?t[1]:t[0]==='U'?-t[1]:0),0);const hv=fwd.reduce((a,t)=>a+(t[0]==='R'?t[1]:t[0]==='L'?-t[1]:0),0);if(Math.abs(dv-S.depth)<=.5&&Math.abs(hv-S.x)<=.5)net=fwd}
  const old=RT.trailLen(S.tr),neuN=net?RT.trailLen(net):old,best=Math.min(old,neuN);
  // közvetlen akna, ha jóval rövidebb a bejárt (vagy a hálózaton talált) útnál
  const dg=RT.digPlan();if(dg&&dg.len<best*.85&&S.fuel>dg.fuel*1.25+(window.calc?calc().fr*20:0)&&Math.abs(S.x)>=0){
   const sf=Math.abs(S.x)>E?[[S.x>0?'R':'L',Math.abs(S.x)]]:[];S.tr=sf.concat([['D',S.depth,'x']]);
   msg('🧭 Legrövidebb hazaút: egyenes akna a felszínre, '+nf(dg.len,0)+' m (a bejárt '+nf(old,0)+' m helyett).');return{old,neu:dg.len,dig:1}}
  if(net&&neuN<old-1e-6){S.tr=net;msg('🧭 Legrövidebb hazaút: '+nf(neuN,0)+' m (a bejárt '+nf(old,0)+' m helyett).');return{old,neu:neuN}}
  return null}};
W.RT=RT;
})(typeof window!=='undefined'?window:globalThis);
