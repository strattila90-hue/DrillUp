/* Drill Up – műhely: interaktív gépészeti blueprint (alkatrészenként százalék, ár, fejlesztés).
   Új alkatrészt a későbbi fázisok a BP.parts listához adnak (BP.register). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('blueprint');
const X=m=>326+24*m,Y=m=>92+24*m;
const BP={sel:'d',parts:[],
 register(p){BP.parts.push(p)},
 pick(k){BP.sel=k;view()},
 buy(){buy(BP.sel)},
 pct(p){const t=p.t();return Math.round(S.u[p.k]/(t.length-1)*100)}};
W.BP=BP;
BP.register({k:'d',n:'Meghajtás',t:()=>D,st:e=>`${e[1]} MW · η ${Math.round(e[2]*100)}% · ${F[e[3]].n}`,fx:'Fúrási és haladási teljesítmény, üzemanyagfajta.',pin:[26,40],at:[X(-10.6),Y(-2)]});
BP.register({k:'h',n:'Páncél és pajzs',t:()=>H,st:e=>`${e[1]} °C · ${e[2]} GPa · ${e[3]} t`,fx:'Mélységi hő- és nyomástűrés.',pin:[196,24],at:[X(-3.2),Y(-1.65)]});
BP.register({k:'f',n:'Fúrófej',t:()=>HD,st:e=>`kőzetszilárdság-határ ${e[1]} MPa`,fx:'Milyen kemény kőzet bontható.',pin:[322,24],at:[X(-.8),Y(-1.5)]});
BP.register({k:'t',n:'Üzemanyagtartály',t:()=>T,st:e=>fk(e[1]),fx:'Hatótáv egy tankolással.',pin:[96,158],at:[X(-10.7),Y(.9)]});
BP.register({k:'c',n:'Raktér',t:()=>C,st:e=>fk(e[1]),fx:'Egy úton hazahozható rakomány.',pin:[196,158],at:[X(-7.5),Y(.9)]});
BP.register({k:'g',n:'Áramfejlesztő (felszíni)',t:()=>W.GN||[['–']],st:e=>e[1]?`${e[1]} kW · ${F[e[3]].n} · tank ${fk(e[4])}`:'–',fx:'Világítás, a hajtómotor tehermentesítése (+~9% fúrási teljesítmény).',pin:[70,128],at:[40,150]});
const sel=k=>BP.sel===k?' sel':'';
function svg(){const tier=S.u.d,hl=S.u.h,ex=hl+2;
 let s=`<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A gép gépészeti rajza"><defs><pattern id="bpg" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#7fc8ff" stroke-opacity=".13"/></pattern></defs><rect width="360" height="200" fill="url(#bpg)"/><text x="6" y="11" class="tt">DRILL UP · DU-01 · GÉPÉSZETI RAJZ</text>`;
 // állandó váz
 s+=`<g class="ln"><rect x="${X(-12.2)}" y="${Y(-1.5)}" width="${24*6.6}" height="72" rx="4"/><rect x="${X(-4.7)}" y="${Y(-1.65)}" width="${24*3.1}" height="79" rx="4"/><path d="M${X(-5.6)} ${Y(-1.15)}H${X(-4.7)}M${X(-5.6)} ${Y(-.45)}H${X(-4.7)}M${X(-5.6)} ${Y(.45)}H${X(-4.7)}M${X(-5.6)} ${Y(1.15)}H${X(-4.7)}"/>`;
 for(let i=0;i<3;i++)s+=`<rect x="${X(-9.1+i*1.05)}" y="${Y(-1.2)}" width="22" height="20" rx="3"/>`;
 s+=`<rect x="${X(-10.8)}" y="${Y(1.1)}" width="${24*9}" height="21" rx="10"/>`;for(let i=0;i<6;i++)s+=`<circle cx="${X(-10.2+i*1.5)}" cy="${Y(1.58)}" r="6"/>`;
 s+=`<path d="M${X(-1.6)} ${Y(-1.85)}A38 44 0 0 1 ${X(-1.6)} ${Y(1.85)}Z"/><path d="M${X(-.1)} ${Y(-.35)}L${X(.5)} ${Y(0)}L${X(-.1)} ${Y(.35)}Z"/></g>`;
 // alkatrész-csoportok
 s+=`<g class="part${sel('d')}"><g class="ln">`+(tier<2?`<rect x="${X(-11.8)}" y="${Y(-2.1)}" width="58" height="26" rx="12"/><rect x="${X(-11.5)}" y="${Y(-3.4)}" width="17" height="31"/><circle cx="${X(-10.5)}" cy="${Y(-1.55)}" r="5"/>`:tier<4?`<rect x="${X(-11.8)}" y="${Y(-2)}" width="60" height="29" rx="3"/><circle cx="${X(-10.6)}" cy="${Y(-1.3)}" r="13"/><path d="M${X(-10.1)} ${Y(-2.9)}V${Y(-2)}"/>`:`<rect x="${X(-11.9)}" y="${Y(-2.2)}" width="65" height="31" rx="15"/><circle cx="${X(-10.55)}" cy="${Y(-1.55)}" r="8"/><path d="M${X(-10.55)} ${Y(-1.55)}l0-8M${X(-10.55)} ${Y(-1.55)}l7 4M${X(-10.55)} ${Y(-1.55)}l-7 4"/>`)+`</g></g>`;
 s+=`<g class="part${sel('h')}"><g class="ln">`;for(let i=0;i<ex;i++)s+=`<path d="M${X(-1.9-i*.5)} ${Y(-1.65)}V${Y(1.65)}"/>`;s+=`<path d="M${X(-8.8)} ${Y(-1.78)}H${X(-6)}M${X(-8.8)} ${Y(1.78)}H${X(-6)}"/></g></g>`;
 s+=`<g class="part${sel('f')}"><g class="ln"><path d="M${X(-1.5)} ${Y(-1.7)}Q${X(-.9)} ${Y(-.9)} ${X(-.4)} ${Y(0)}M${X(-1.5)} ${Y(1.7)}Q${X(-.9)} ${Y(.9)} ${X(-.4)} ${Y(0)}M${X(-1.5)} ${Y(-.9)}Q${X(-1)} ${Y(-.4)} ${X(-.3)} ${Y(0)}"/><circle cx="${X(-1.42)}" cy="${Y(1)}" r="4"/><circle cx="${X(-1.42)}" cy="${Y(-1)}" r="4"/></g></g>`;
 s+=`<g class="part${sel('t')}"><rect class="ln dash" x="${X(-11.8)}" y="${Y(.35)}" width="${24*2.2}" height="22" rx="10"/></g>`;
 s+=`<g class="part${sel('c')}"><rect class="ln dash" x="${X(-9.2)}" y="${Y(.35)}" width="${24*3.4}" height="22" rx="3"/><path class="ln dash" d="M${X(-9)} ${Y(1.2)}l12-12M${X(-8)} ${Y(1.2)}l12-12M${X(-7)} ${Y(1.2)}l12-12M${X(-6.2)} ${Y(1.2)}l10-10"/></g>`;
 s+=`<g class="part${sel('g')}"><rect class="ln dash" x="6" y="138" width="56" height="44" rx="4"/><rect class="ln" x="12" y="152" width="40" height="22" rx="2"/><path class="ln" d="M20 152V142h6v10M34 164h6l-3 5h5l-7 7 2-6h-5z"/><text x="8" y="136" class="tt">FELSZÍNI ÁRAMFEJLESZTŐ</text></g>`;
 s+=`<path class="dm" d="M${X(-12.2)} 193H${X(.5)}M${X(-12.2)} 189v8M${X(.5)} 189v8"/><text x="${(X(-12.2)+X(.5))/2}" y="190" class="tt" text-anchor="middle">12,7 m</text>`;
 // jelölők (nagy érintési felülettel)
 BP.parts.forEach((p,i)=>{s+=`<g class="pin${sel(p.k)}" onclick="BP.pick('${p.k}')"><path class="ld" d="M${p.pin[0]} ${p.pin[1]}L${p.at[0]} ${p.at[1]}"/><circle cx="${p.pin[0]}" cy="${p.pin[1]}" r="11"/><text x="${p.pin[0]}" y="${p.pin[1]+4}">${i+1}</text><circle class="hit" cx="${p.pin[0]}" cy="${p.pin[1]}" r="18"/></g>`});
 return s+'</svg>'}
function svc(){const b=base(),d=calc(),dis=b?'':'disabled';let h=b?'':'<div class="card bad">A fejlesztés és a szerviz csak a bázison (a felszínen) érhető el.</div>';
 h+=`<div class="card">⛽ <b>Tankolás</b> (${d.f.n}, ${ft(d.f.p)}/kg)<br><span class="mu">${fk(S.fuel)} / ${fk(tank())}</span><div class="row"><button class="b g" ${dis} onclick="fill(.25)">+25%</button><button class="b" ${dis} onclick="fill(1)">Tele</button></div></div>`;
 if(W.GEN){const g=GN[S.u.g],f=F[g[3]];h+=`<div class="card">⚡ <b>Generátor tankolás</b> (${f.n}, ${ft(f.p)}/kg)<br><span class="mu">${fk(S.gf)} / ${fk(g[4])}</span><div class="row"><button class="b g" ${dis} onclick="GEN.fill(.25)">+25%</button><button class="b" ${dis} onclick="GEN.fill(1)">Tele</button></div></div>`}
 return h+`<div class="card">🔧 <b>Páncél</b>: ${nf(S.hp,1)}%<br><button class="b" ${b&&S.hp<100?'':'disabled'} onclick="repair()">Javítás – ${ft((100-S.hp)*2e3*Math.pow(8,S.u.h))}</button></div>`}
BP.html=function(){const b=base(),p=BP.parts.find(q=>q.k===BP.sel)||BP.parts[0],t=p.t(),i=S.u[p.k]||0,mx=t.length-1,nx=t[i+1],pct=Math.round(i/mx*100),price=nx?nx.at(-1):0;
 const note=!nx?'<div class="mu" style="margin-top:8px"><b>Maximális szint ✔</b></div>':`<div style="margin-top:6px">Következő: <b>${nx[0]}</b><br><span class="mu">${p.st(nx)}</span></div><div class="mu" style="margin-top:4px">Hatás: ${p.fx}</div><button class="b" style="width:100%;margin-top:8px" ${b&&S.cash>=price?'':'disabled'} onclick="BP.buy()">Fejlesztés – ${ft(price)}</button>${!b?'<div class="mu bad">Fejleszteni csak a bázison lehet.</div>':S.cash<price?'<div class="mu bad">Nincs elég pénzed.</div>':''}`;
 return `<div class="bpw">${svg()}</div><div class="card"><b>${BP.parts.indexOf(p)+1}. ${p.n}</b> <span class="mu">· ${i+1}/${mx+1}. szint</span><div class="bar" style="margin:6px 0"><i style="width:${pct}%"></i></div><div class="mu">Fejlesztettség: <b>${pct}%</b></div><div style="margin-top:6px">Most: <b>${t[i][0]}</b><br><span class="mu">${p.st(t[i])}</span></div>${note}</div>${svc()}`};
const st=document.createElement('style');st.textContent=`.bpw{background:#0e2a47;border:1px solid #2d6a9f;border-radius:10px;padding:4px;margin-bottom:8px}.bpw svg{display:block;width:100%;height:auto}
.bpw .ln{stroke:#7fc8ff;stroke-width:1.1;fill:none}.bpw .ln.dash{stroke-dasharray:4 3}.bpw .dm{stroke:#7fc8ff88;fill:none;stroke-width:.8}.bpw .tt{fill:#9fd4ff;font:8px Georgia}
.bpw .part.sel .ln{stroke:#f0a030;stroke-width:1.8}.bpw .pin{cursor:pointer}.bpw .pin .ld{stroke:#7fc8ff88;stroke-width:.8}.bpw .pin circle{fill:#0e2a47;stroke:#7fc8ff;stroke-width:1.4}
.bpw .pin text{fill:#bfe3ff;font:bold 11px Georgia;text-anchor:middle;pointer-events:none}.bpw .pin.sel circle{fill:#f0a030;stroke:#fff}.bpw .pin.sel text{fill:#1b1208}.bpw .pin circle.hit{fill:transparent;stroke:none}`;
(document.head||document.body).appendChild(st);
})(typeof window!=='undefined'?window:globalThis);
