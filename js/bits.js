/* Drill Up – 3. fázis: fúrófej-kopás, javítás, csere, tartalék fúrófejek raktára.
   Állapot: S.hw = a felszerelt fej kopása (0–100%), S.hf = a felszerelt fej szintje (= S.u.f), S.hs = raktár [[szint, kopás], ...]. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('bits');
const MAXS=8,LIFE=[3000,8000,25000,80000,3e5,1e6]; // egy új fej élettartama méterben, kényelmes (r≈0,3) terhelésnél
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
if(W.Save)Save.addMig(4,o=>{o.u=o.u&&typeof o.u==='object'?o.u:{};o.hf=Number.isInteger(o.u.f)?o.u.f:0;if(typeof o.hw!=='number')o.hw=0;if(!Array.isArray(o.hs))o.hs=[]});
const price=t=>Math.max(15000,Math.round((HD[t][2]||0)*.5));
const repairPrice=(t,w)=>Math.round(price(t)*.6*w/100);
const BIT={
 cap(){return HD[S.u.f][1]*(1-.35*Math.pow(S.hw/100,1.5))},
 spd(){return 1-.45*Math.pow(S.hw/100,1.5)},
 broken(){return S.hw>=100},
 life(t){return LIFE[t]},
 // kopás: kemény kőzetben (r közel 1) ~9x gyorsabb, mint r=0,3-nál (ott az élettartam = LIFE); puha kőzetben ~0,45x
 wear(dist,L){const r=Math.min(1.2,HR[LY.indexOf(L)]/HD[S.u.f][1]),before=S.hw;S.hw=Math.min(100,S.hw+dist*100/LIFE[S.u.f]*(.12+1.6*r*r)/.264);
  if(before<75&&S.hw>=75){msg('🔩 A fúrófej 75%-ban kopott – cseréld vagy javítsd a bázison.');if(W.beep)beep(900,.15,.1)}
  if(before<90&&S.hw>=90){msg('⚠ A fúrófej 90%-ban kopott! Hamarosan eltörik.');if(W.alarm3)alarm3()}
  if(S.hw>=100&&before<100)msg('🔩 A fúrófej elkopott – a fúrás leáll. Menj haza cserélni (⌂).')},
 stop(){S.st='idle';S.mode='';if(W.scr)scr(.4,900,200,.5);if(!S.log[0]||!/elkopott/.test(S.log[0]))msg('🔩 Elkopott fúrófej: fúrni nem lehet. Haladni a kész járatokban és a ⌂ hazatérés még működik.')},
 line(){const w=S.hw;return`<div class="mu">Kopás: <b class="${w>=90?'bad':''}">${nf(w,1)}%</b> · hatás: határ ${Math.round(BIT.cap())} MPa, sebesség ${Math.round(BIT.spd()*100)}%</div><div class="lad">${lad(1-w/100,0)}</div>`},
 // ---------- műhely ----------
 ok(){if(!base()){toast('🔩 A fúrófejet csak a bázison lehet cserélni.');return false}return true},
 buy(t){if(!BIT.ok())return;if(S.hs.length>=MAXS)return toast('A fúrófej-raktár tele van ('+MAXS+').');const p=price(t);if(S.cash<p)return toast('Nincs elég pénzed.');S.cash-=p;S.hs.push([t,0]);view()},
 install(i){if(!BIT.ok())return;const b=S.hs[i];if(!b)return;S.hs[i]=[S.hf,S.hw];S.u.f=b[0];S.hf=b[0];S.hw=b[1];msg('🔩 Fúrófej cserélve: '+HD[S.u.f][0]+' ('+nf(S.hw,0)+'% kopás).');if(W.clank)clank(.6);view()},
 repair(i){if(!BIT.ok())return;const b=i<0?[S.hf,S.hw]:S.hs[i];if(!b||b[1]<=0)return;const c=repairPrice(b[0],b[1]);if(S.cash<c)return toast('Nincs elég pénzed.');S.cash-=c;if(i<0)S.hw=0;else b[1]=0;if(W.hiss)hiss(.2);view()},
 sell(i){if(!BIT.ok())return;const b=S.hs[i];if(!b)return;S.cash+=Math.round(price(b[0])*.4*(1-b[1]/100));S.hs.splice(i,1);view()},
 afterBuy(k){if(k!=='f')return;if(S.hs.length<MAXS)S.hs.push([S.hf,S.hw]);S.hf=S.u.f;S.hw=0}, // a régi fej a raktárba kerül
 reset(){S.hf=0;S.hw=0},
 html(){const b=base(),dis=b?'':'disabled',t=S.hf,w=S.hw;
  let h=`<div class="card">🔩 <b>Fúrófej-raktár</b> <span class="mu">(${S.hs.length}/${MAXS})</span>${b?'':'<div class="mu bad">Csere, javítás és vásárlás csak a bázison.</div>'}
  <div style="margin-top:8px"><b>Felszerelve:</b> ${HD[t][0]}<div class="mu">Kopás ${nf(w,1)}% · határ ${Math.round(BIT.cap())} MPa</div><div class="lad">${lad(1-w/100,0)}</div>
  <button class="b g" style="width:100%" ${b&&w>0&&S.cash>=repairPrice(t,w)?'':'disabled'} onclick="BIT.repair(-1)">Javítás – ${ft(repairPrice(t,w))}</button></div>`;
  S.hs.forEach((e,i)=>{h+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #3a2c20"><b>${HD[e[0]][0]}</b><div class="mu">Kopás ${nf(e[1],0)}% · ${e[1]<=0?'új':'használt'}</div><div class="row"><button class="b" ${dis} onclick="BIT.install(${i})">Felszerel</button><button class="b g" ${b&&e[1]>0&&S.cash>=repairPrice(e[0],e[1])?'':'disabled'} onclick="BIT.repair(${i})">Javít ${ft(repairPrice(e[0],e[1]))}</button><button class="b g" ${dis} onclick="BIT.sell(${i})">Elad</button></div></div>`});
  h+=`<div style="margin-top:10px"><b>Új tartalék fúrófej vásárlása</b><div class="mu">Csak már birtokolt szintű fejek vehetők.</div>`;
  for(let k=0;k<=S.u.f;k++)h+=`<button class="b g" style="width:100%" ${b&&S.hs.length<MAXS&&S.cash>=price(k)?'':'disabled'} onclick="BIT.buy(${k})">${HD[k][0]} – ${ft(price(k))}</button>`;
  return h+'</div></div>'}};
W.BIT=BIT;
if(W.BP)BP.extras.push(()=>BIT.html());
})(typeof window!=='undefined'?window:globalThis);
