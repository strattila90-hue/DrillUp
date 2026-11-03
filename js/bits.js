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
// ---------- fúrófej-katalógus: grafikus kártyák (rajz, keménységi határ, fúrható rétegek) ----------
const PAL=[{body:'#9aa5b1',edge:'#dfe6ee',ins:'#c3ccd6',acc:'#6b7683'},{body:'#59616d',edge:'#9aa5b1',ins:'#1b1f26',acc:'#aeb9c6'},{body:'#6b6f77',edge:'#e8c25a',ins:'#f6e9b8',acc:'#e8c25a'},{body:'#7c6a46',edge:'#d9c08a',ins:'#fff6d8',acc:'#ffe9a8'},{body:'#cfd7e3',edge:'#8fd3ff',ins:'#8fd3ff',acc:'#bfe9ff'},{body:'#1b1030',edge:'#c78bff',ins:'#c78bff',acc:'#ff8be6'}];
const hh=x=>26*(1-(x-16)/62),hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function bitSVG(t){const c=PAL[t]||PAL[0];let o=`<svg viewBox="0 0 84 64" class="bgs${t===5?' glow':''}"><rect x="1" y="22" width="16" height="20" rx="3" fill="#39414b" stroke="${c.acc}" stroke-width="1"/><path d="M16 6L78 32L16 58Z" fill="${c.body}" stroke="${c.edge}" stroke-width="1.6" stroke-linejoin="round"/>`;
 const n=3+(t>>1);for(let i=0;i<n;i++){const x=20+i*11;o+=`<path d="M${x} ${32-hh(x)}L${x+13} ${32+hh(x+13)}" stroke="${c.acc}" stroke-opacity=".55" stroke-width="${t>=2?2.2:1.4}" fill="none"/>`}
 if(t===2)for(const a of[-1,0,1])o+=`<path d="M17 32L77 ${32+a*7}" stroke="${c.edge}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`;
 if(t===3)for(let i=0;i<22;i++){const x=22+hash(i)*50,y=32+(hash(i+40)-.5)*2*hh(x)*.8;o+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.7+hash(i+9)*.9).toFixed(1)}" fill="${c.ins}" opacity=".9"/>`}
 if(t===4)o+=`<path d="M20 20L74 31" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><path d="M20 44L74 33" stroke="${c.edge}" stroke-opacity=".6" stroke-width="1.4"/>`;
 if(t===5)o+=`<path d="M18 32H80M24 14L60 30M24 50L60 34" stroke="${c.acc}" stroke-width="1.2" opacity=".85" fill="none"/>`;
 const m=5+t;for(let k=0;k<m;k++){const x=22+k*(50/m),r=t>=2?2.3:1.8;for(const sg of[-1,1])o+=`<circle cx="${x.toFixed(1)}" cy="${(32+sg*hh(x)*.9).toFixed(1)}" r="${r}" fill="${c.ins}" stroke="${c.edge}" stroke-width=".6"/>`}
 return o+`<circle cx="77" cy="32" r="3.2" fill="${c.ins}" stroke="${c.edge}" stroke-width="1"/></svg>`}
BIT.gallery=function(){const mxL=Math.log(HD[HD.length-1][1]);
 const cards=HD.map((h,t)=>{const can=LY.map((l,i)=>HR[i]<=h[1]),n=can.filter(Boolean).length,inst=S.hf===t,sp=S.hs.filter(e=>e[0]===t).length,lock=t>S.u.f,c=PAL[t].edge;
  const strip=LY.map((l,i)=>`<s title="${l[0].split(' (')[0]}: ${HR[i]} MPa${can[i]?' ✔':' ✖'}" style="background:${l[4]};opacity:${can[i]?1:.18}"></s>`).join('');
  const state=inst?'<b style="color:#7be07b">Felszerelve</b>':lock?(t===S.u.f+1?'Következő szint':'Zárolt'):'Birtokolt'+(sp?' · raktár ×'+sp:'');
  return `<div class="bgc${inst?' cur':''}${lock?' lock':''}" style="--c:${c}">${bitSVG(t)}<div class="bgn">${h[0].replace(' fúrófej','')}</div><div class="mu">${state}</div>
  <div class="mu">Határ: <b>${h[1]} MPa</b></div><div class="bgb"><i style="width:${Math.max(4,Math.log(h[1])/mxL*100)}%"></i></div>
  <div class="mu">Fúrható rétegek: <b>${n}/${LY.length}</b></div><div class="bgl">${strip}</div></div>`}).join('');
 return `<div class="card">🔩 <b>Fúrófej-katalógus</b><div class="mu">Erősség (keménységi határ) és képesség (melyik rétegeket bontja) szerint. A sáv színei a rétegek, a halvány négyzet: még nem fúrható.</div><div class="bg">${cards}</div></div>`};
const sty=document.createElement('style');sty.textContent=`.bg{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:8px}.bgc{background:#0e1620;border:1px solid color-mix(in srgb,var(--c) 40%,#222c38);border-radius:10px;padding:6px;text-align:center}
.bgc.cur{box-shadow:0 0 0 2px #59d65a inset}.bgc.lock{opacity:.55}.bgs{width:100%;height:auto;max-height:70px}.bgs.glow{filter:drop-shadow(0 0 4px #c78bff)}.bgn{font:700 11px Georgia;color:var(--c);margin:2px 0}
.bgb{height:6px;border-radius:3px;background:#1d2a38;margin:3px 0;overflow:hidden}.bgb i{display:block;height:100%;background:var(--c)}.bgl{display:flex;gap:1px;margin-top:3px}.bgl s{flex:1;height:8px;border-radius:1px}`;
(document.head||document.body).appendChild(sty);
BIT.pal=PAL;W.BIT=BIT;
if(W.BP)BP.extras.push(()=>BIT.gallery()+BIT.html());
})(typeof window!=='undefined'?window:globalThis);
