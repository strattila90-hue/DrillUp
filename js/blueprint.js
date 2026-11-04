/* Drill Up – műhely: interaktív gépészeti blueprint (alkatrészenként százalék, ár, fejlesztés).
   Új alkatrészt a későbbi fázisok a BP.parts listához adnak (BP.register). */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('blueprint');
const X=m=>326+24*m,Y=m=>92+24*m;
const BP={sel:'d',parts:[],extras:[],
 register(p){BP.parts.push(p)},
 pick(k){BP.sel=k;view()},
 buy(){buy(BP.sel)},
 pct(p){const t=p.t();return Math.round(S.u[p.k]/(t.length-1)*100)}};
W.BP=BP;
BP.register({k:'d',n:'Meghajtás',t:()=>D,st:e=>`${e[1]} MW · η ${Math.round(e[2]*100)}% · ${F[e[3]].n}`,fx:'Fúrási és haladási teljesítmény, üzemanyagfajta.',s:'Meghajtás',c:'#ff9a3c',u:'MW',v:e=>e[1],cond:()=>null,pin:[26,40],at:[X(-10.6),Y(-1.9)]});
BP.register({k:'h',n:'Páncél és pajzs',t:()=>H,st:e=>`${e[1]} °C · ${e[2]} GPa · ${e[3]} t`,fx:'Mélységi hő- és nyomástűrés.',s:'Páncél',c:'#6fb4ff',u:'°C',v:e=>e[1],cond:()=>({l:'Páncél állapota',p:S.hp}),pin:[196,24],at:[X(-3.2),Y(-1.6)]});
BP.register({k:'f',n:'Fúrófej',t:()=>HD,st:e=>`kőzetszilárdság-határ ${e[1]} MPa`,fx:'Milyen kemény kőzet bontható.',s:'Fúrófej',c:'#ff5f6d',u:'MPa',v:e=>e[1],cond:()=>({l:'Fúrófej élessége',p:W.BIT?100-S.hw:100}),pin:[322,24],at:[X(-.8),Y(-1.5)]});
BP.register({k:'t',n:'Üzemanyagtartály',t:()=>T,st:e=>fk(e[1]),fx:'Hatótáv egy tankolással.',s:'Tank',c:'#ffd23c',u:'kg',v:e=>e[1],cond:()=>({l:'Tank töltöttsége',p:S.fuel/tank()*100}),pin:[96,158],at:[X(-10.7),Y(.9)]});
BP.register({k:'c',n:'Raktér',t:()=>C,st:e=>fk(e[1]),fx:'Egy úton hazahozható rakomány.',s:'Raktér',c:'#5fd68a',u:'kg',v:e=>e[1],cond:()=>({l:'Raktér telítettsége',p:(W.DEP?DEP.used():cargoKg())/cap()*100}),pin:[196,158],at:[X(-7.5),Y(.9)]});
BP.register({k:'g',n:'Áramfejlesztő (felszíni)',t:()=>W.GN||[['–']],st:e=>e[1]?`${e[1]} kW · ${F[e[3]].n} · tank ${fk(e[4])}`:'–',fx:'Világítás, a hajtómotor tehermentesítése (+~9% fúrási teljesítmény).',s:'Generátor',c:'#c78bff',u:'kW',v:e=>e[1]||0,cond:()=>{const g=W.GN&&GN[S.u.g];return g&&g[4]?{l:'Generátor-tank',p:S.gf/g[4]*100}:null},pin:[150,172],at:[62,160]});
const sel=k=>BP.sel===k?' sel':'',col=k=>(BP.parts.find(p=>p.k===k)||{}).c||'#7fc8ff';
function svg(){const tier=S.u.d,hl=S.u.h,ex=hl+2,tk=Math.max(0,Math.min(1,S.fuel/tank())),cg=Math.max(0,Math.min(1,(W.DEP?DEP.used():cargoKg())/cap()));
 const R=(m,n,w,h,r=2)=>`<rect x="${X(m).toFixed(1)}" y="${Y(n).toFixed(1)}" width="${(w*24).toFixed(1)}" height="${(h*24).toFixed(1)}" rx="${r}"/>`,C=(m,n,r)=>`<circle cx="${X(m).toFixed(1)}" cy="${Y(n).toFixed(1)}" r="${r}"/>`,L=(a,b,c,d)=>`M${X(a).toFixed(1)} ${Y(b).toFixed(1)}L${X(c).toFixed(1)} ${Y(d).toFixed(1)}`;
 let s=`<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A gép gépészeti rajza"><defs><pattern id="bpg" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#7fc8ff" stroke-opacity=".13"/></pattern></defs><rect width="360" height="200" fill="url(#bpg)"/><text x="6" y="11" class="tt">DRILL UP · DU-01 · GÉPÉSZETI RAJZ</text>`;
 // ---- állandó váz: hátsó henger, karimák, ablakok, nyílás, korlát, antenna, tömlők, csuklós szakasz ----
 s+=`<g class="ln">${R(-12.2,-1.5,6.6,3,4)}<path d="${L(-12.2,-1.58,-12.2,1.58)}${L(-9.6,-1.58,-9.6,1.58)}${L(-5.7,-1.58,-5.7,1.58)}"/><path class="dash" d="${L(-12,-1.38,-5.8,-1.38)}${L(-12,1.31,-5.8,1.31)}" stroke-dasharray="1 5"/>`;
 for(let i=0;i<3;i++)s+=R(-9.1+i*1.05,-1.2,.95,.9,3)+`<path class="glass" d="${L(-9.1+i*1.05+.15,-.35,-9.1+i*1.05+.5,-1.1)}"/>`;
 s+=R(-9.1,.35,3.1,.6,2)+`<path d="${L(-9,.95,-8.7,.35)}${L(-8.4,.95,-8.1,.35)}${L(-7.8,.95,-7.5,.35)}${L(-7.2,.95,-6.9,.35)}"/>`+R(-10.75,-.12,1.2,.78,2)+`<path d="${L(-9.82,.2,-9.64,.2)}"/>`+R(-10,.1,.7,.8,2)+C(-9.7,-.65,5.8);
 s+=`<path d="${L(-9.2,-1.95,-6,-1.95)}${L(-9.2,-1.5,-9.2,-1.95)}${L(-8.1,-1.5,-8.1,-1.95)}${L(-7,-1.5,-7,-1.95)}${L(-6,-1.5,-6,-1.95)}${L(-5.9,-1.5,-5.9,-2.75)}"/>${C(-5.9,-2.78,2)}<path d="M${X(-7.95)} ${Y(-1.5)}a8 8 0 0 1 ${(.34*24).toFixed(1)} 0"/>`;
 s+=`<path d="M${X(-9.9)} ${Y(-1.62)}C${X(-9.6)} ${Y(-2.3)} ${X(-8.5)} ${Y(-2.3)} ${X(-8.2)} ${Y(-1.8)}M${X(-9.9)} ${Y(-1.62)}C${X(-9.6)} ${Y(-2.5)} ${X(-6.8)} ${Y(-2.5)} ${X(-6.5)} ${Y(-1.8)}"/>`;
 // stabilizátor-lapok (behúzva): dugattyúk + csuklós lap
 for(const sg of[-1,1]){s+=R(-8.78,sg<0?-1.9:1.76,2.8,.28,2)+`<path d="${L(-8.2,sg*1.78,-8.2,sg*1.55)}${L(-6.5,sg*1.78,-6.5,sg*1.55)}"/>`}
 // csuklós szakasz: nyomóhengerek + harmonika
 s+=R(-5.6,-1.5,.9,3,1)+`<path d="${L(-5.15,-1.5,-5.15,1.5)}${L(-4.9,-1.5,-4.9,1.5)}"/>`;for(const yy of[-1.15,-.45,.45,1.15])s+=R(-6.3,yy-.13,.8,.26,1);
 // lánctalp: ovális, láncszemek, hajtókerék (fogak), útgörgők, feszítőkerék
 s+=R(-10.85,1.1,9.1,.9,10.8)+`<path class="dash" d="${L(-10.4,1.1,-2.2,1.1)}${L(-10.4,2,-2.2,2)}" stroke-dasharray="2 2.4"/>`;
 for(let i=0;i<4;i++)s+=C(-10.4+1.6+i*1.95,1.72,6.2);
 s+=C(-10.4,1.55,7.6)+C(-10.4,1.55,3)+C(-2.2,1.55,7.7);let tp='';for(let k=0;k<9;k++){const a=k*Math.PI*2/9;tp+=`M${(X(-10.4)+7.6*Math.cos(a)).toFixed(1)} ${(Y(1.55)+7.6*Math.sin(a)).toFixed(1)}l${(3.4*Math.cos(a)).toFixed(1)} ${(3.4*Math.sin(a)).toFixed(1)}`}s+=`<path d="${tp}"/></g>`;
 // hátsó szerszámkészlet: vonóhorog, csörlő, kalapács-kar, szár-állvány, tartalék tárcsák, gázpalackok, láda
 s+=`<g class="ln">${R(-12.62,-.95,.4,1.95,2)}<path d="M${X(-12.78)} ${Y(-.1)}a4 4 0 0 0 0 ${(.3*24).toFixed(1)}"/>${R(-13.18,-.84,.62,.44,2)}<path d="${L(-13.05,-.84,-13.05,-.4)}${L(-12.9,-.84,-12.9,-.4)}${L(-12.75,-.84,-12.75,-.4)}"/>`+
  `<path d="${L(-11.9,-1.5,-12.45,-2.12)}${L(-12.45,-2.12,-13.25,-1.68)}"/>${R(-13.35,-1.72,.2,.34,1)}<path d="${L(-13.3,-1.38,-13.2,-1.1)}"/>`+
  [0,1,2,3].map(i=>`<path d="${L(-11.75,-1.66-i*.045,-9.45,-1.66-i*.045)}"/>`).join('')+
  [0,1,2].map(i=>C(-12.9,.65+i*.28,4)).join('')+R(-12.5,.28,.14,.72,2)+R(-12.33,.28,.14,.72,2)+R(-12.78,.82,.55,.34,2)+R(-6.0,.05,.14,.4,2)+`<path d="${L(-6.5,-.55,-6.5,.52)}"/></g>`;
 // ---- alkatrész-csoportok (színesek; a kijelölt kiemelve) ----
 s+=`<g class="part${sel('d')}" style="--c:${col('d')}"><g class="ln">`+(tier<2?R(-11.8,-2.1,2.4,1.1,12)+R(-11.5,-3.4,.7,1.3,1)+C(-10.5,-1.55,5)+`<path d="${L(-11.2,-2.1,-11.2,-1)}${L(-10.2,-2.1,-10.2,-1)}"/>`:tier<4?R(-11.8,-2,2.5,1.2,3)+(tier==3?C(-10.6,-1.3,13):'')+`<path d="${L(-11.5,-1.95,-11.5,-.85)}${L(-11,-1.95,-11,-.85)}${L(-10.5,-1.95,-10.5,-.85)}${L(-9.9,-2.9,-9.9,-2)}"/>`:R(-11.9,-2.2,2.7,1.3,15.6)+C(-10.55,-1.55,8)+`<path d="${L(-10.55,-1.55,-10.55,-2.1)}${L(-10.55,-1.55,-10,-1.2)}${L(-10.55,-1.55,-11.1,-1.2)}"/>`+(tier>4?`<ellipse cx="${X(-11.3)}" cy="${Y(-1.55)}" rx="3" ry="15"/><ellipse cx="${X(-9.7)}" cy="${Y(-1.55)}" rx="3" ry="15"/>`:''))
  +C(-11.4,.8,11)+C(-11.4,.8,4)+`<path d="${L(-11.7,.1,-10.6,.1)}${L(-11.7,.27,-10.6,.27)}${L(-11.7,.44,-10.6,.44)}${L(-11.7,.61,-10.6,.61)}"/></g></g>`;
 s+=`<g class="part${sel('h')}" style="--c:${col('h')}"><g class="ln">`+R(-4.7,-1.65,3.1,3.3,3);for(let i=0;i<ex;i++)s+=`<path d="${L(-1.9-i*.5,-1.65,-1.9-i*.5,1.65)}"/>`;
 for(let i=0;i<7;i+=2)s+=R(-4.7,-1.65+i*.47,.3,.47,0);s+=R(-4.2,-1.2,1.2,2.4,2)+R(-4,-1.05,.3,2.1,0)+R(-3.5,-1.05,.3,2.1,0)+C(-1.9,-1.33,4)+C(-1.9,1.32,4)+`<path class="dash" d="${L(-4.2,-1.52,-1.7,-1.52)}${L(-4.2,1.45,-1.7,1.45)}" stroke-dasharray="1 4"/></g></g>`;
 s+=`<g class="part${sel('f')}" style="--c:${col('f')}"><g class="ln"><path class="fl" d="M${X(-1.6)} ${Y(-1.85)}A38.4 44.4 0 0 1 ${X(-1.6)} ${Y(1.85)}Z"/>`;
 for(const sg of[-1,1]){let sp0='';for(let k=0;k<3;k++){const a0=(k-1)*.9*sg;sp0+=`M${X(-1.6)} ${Y(1.7*Math.sin(a0+sg*.4))}Q${X(-.9)} ${Y(1.1*Math.sin(a0+sg*.4))} ${X(-.15)} ${Y(.12*sg*(k-1)||0)}`}s+=`<path d="${sp0}"/>`}
 for(const[t,yy]of[[.3,-1.5],[.3,1.5],[.55,-1.05],[.55,1.05],[.78,-.65],[.78,.65]])s+=C(-1.6+1.6*t,yy,2.6);
 for(const yy of[-1.2,-.4,.4,1.2])s+=C(-1.42,yy,3.4);
 s+=`<path d="M${X(-.1)} ${Y(-.35)}L${X(.5)} ${Y(0)}L${X(-.1)} ${Y(.35)}Z"/></g></g>`;
 s+=`<g class="part${sel('t')}" style="--c:${col('t')}"><rect class="ln dash" x="${X(-11.8).toFixed(1)}" y="${Y(.35).toFixed(1)}" width="${(2.2*24).toFixed(1)}" height="22" rx="10"/><rect class="lv" x="${(X(-11.8)+2).toFixed(1)}" y="${(Y(.35)+3).toFixed(1)}" width="${((2.2*24-4)*tk).toFixed(1)}" height="16" rx="7"/></g>`;
 s+=`<g class="part${sel('c')}" style="--c:${col('c')}"><rect class="ln dash" x="${X(-9.2).toFixed(1)}" y="${Y(.97).toFixed(1)}" width="${(3.4*24).toFixed(1)}" height="14" rx="3"/><rect class="lv" x="${(X(-9.2)+2).toFixed(1)}" y="${(Y(.97)+2.5).toFixed(1)}" width="${((3.4*24-4)*cg).toFixed(1)}" height="9" rx="2"/><path class="ln dash" d="${L(-9,1.3,-8.6,.98)}${L(-8,1.3,-7.6,.98)}${L(-7,1.3,-6.6,.98)}"/></g>`;
 s+=`<g class="part${sel('g')}" style="--c:${col('g')}"><rect class="ln dash" x="6" y="138" width="56" height="44" rx="4"/><rect class="ln" x="12" y="152" width="40" height="22" rx="2"/><path class="ln" d="M20 152V142h6v10M34 164h6l-3 5h5l-7 7 2-6h-5z"/><text x="8" y="136" class="tt">FELSZÍNI ÁRAMFEJLESZTŐ</text></g>`;
 s+=`<path class="dm" d="M${X(-12.2)} 193H${X(.5)}M${X(-12.2)} 189v8M${X(.5)} 189v8"/><text x="${(X(-12.2)+X(.5))/2}" y="190" class="tt" text-anchor="middle">12,7 m</text>`;
 BP.parts.forEach((p,i)=>{s+=`<g class="pin${sel(p.k)}" style="--c:${p.c}" onclick="BP.pick('${p.k}')"><path class="ld" d="M${p.pin[0]} ${p.pin[1]}L${p.at[0]} ${p.at[1]}"/><circle cx="${p.pin[0]}" cy="${p.pin[1]}" r="11"/><text x="${p.pin[0]}" y="${p.pin[1]+4}">${i+1}</text><circle class="hit" cx="${p.pin[0]}" cy="${p.pin[1]}" r="18"/></g>`});
 return s+'</svg>'}
function svc(){const b=base(),d=calc(),dis=b?'':'disabled';let h=b?'':'<div class="card bad">A fejlesztés és a szerviz csak a bázison (a felszínen) érhető el.</div>';
 h+=`<div class="card">⛽ <b>Tankolás</b> (${d.f.n}, ${ft(d.f.p)}/kg)<br><span class="mu">${fk(S.fuel)} / ${fk(tank())}</span><div class="row"><button class="b g" ${dis} onclick="fill(.25)">+25%</button><button class="b" ${dis} onclick="fill(1)">Tele</button></div></div>`;
 if(W.GEN){const g=GN[S.u.g],f=F[g[3]];h+=`<div class="card">⚡ <b>Generátor tankolás</b> (${f.n}, ${ft(f.p)}/kg)<br><span class="mu">${fk(S.gf)} / ${fk(g[4])}</span><div class="row"><button class="b g" ${dis} onclick="GEN.fill(.25)">+25%</button><button class="b" ${dis} onclick="GEN.fill(1)">Tele</button></div></div>`}
 return h+`<div class="card">🔧 <b>Páncél</b>: ${nf(S.hp,1)}%<br><button class="b" ${b&&S.hp<100?'':'disabled'} onclick="repair()">Javítás – ${ft((100-S.hp)*2e3*Math.pow(8,S.u.h))}</button></div>`}
const pips=(i,mx)=>{let o='';for(let n=0;n<=mx;n++)o+=`<s class="${n<=i?'on':''}${n===i?' cur':''}"></s>`;return o};
const dl=(a,b,u)=>{const d=b-a,p=a>0?Math.round(d/a*100):null;return `<b>${nf(a)}</b> → <b style="color:var(--c)">${nf(b)}</b> ${u}${d>0?` <span class="ok">(+${nf(d)}${p!==null?' · +'+p+'%':''})</span>`:''}`};
BP.html=function(){const b=base(),p=BP.parts.find(q=>q.k===BP.sel)||BP.parts[0],t=p.t(),i=S.u[p.k]||0,mx=t.length-1,nx=t[i+1],pct=Math.round(i/mx*100),price=nx?nx.at(-1):0,tot=Math.round(BP.parts.reduce((a,q)=>a+(S.u[q.k]||0)/(q.t().length-1),0)/BP.parts.length*100),cd=p.cond?p.cond():null;
 const chips=BP.parts.map((q,n)=>`<button class="bpc${q.k===p.k?' sel':''}" style="--c:${q.c}" onclick="BP.pick('${q.k}')"><i></i><b>${n+1}</b>${q.s}<small>${(S.u[q.k]||0)+1}/${q.t().length}</small></button>`).join('');
 const stack=BP.parts.map(q=>`<i title="${q.n}" style="width:${100/BP.parts.length}%;background:linear-gradient(90deg,${q.c} ${Math.round((S.u[q.k]||0)/(q.t().length-1)*100)}%,#1d2a38 0)"></i>`).join('');
 const cmp=nx?`<div class="bpr">${dl(p.v(t[i]),p.v(nx),p.u)}</div>`:'';
 const note=!nx?'<div class="mu" style="margin-top:8px"><b>Maximális szint ✔</b></div>':`<div style="margin-top:6px">Következő: <b>${nx[0]}</b><br><span class="mu">${p.st(nx)}</span></div>${cmp}<div class="mu" style="margin-top:4px">Hatás: ${p.fx}</div><button class="b bpbuy" style="width:100%;margin-top:8px" ${b&&S.cash>=price?'':'disabled'} onclick="BP.buy()">Fejlesztés – ${ft(price)}</button>${!b?'<div class="mu bad">Fejleszteni csak a bázison lehet.</div>':S.cash<price?'<div class="mu bad">Nincs elég pénzed.</div>':''}`;
 return `<div class="bpw">${svg()}</div><div class="bpo"><div class="mu">Gép fejlettsége: <b>${tot}%</b></div><div class="bps">${stack}</div></div><div class="bpcs">${chips}</div>
 <div class="card bpd" style="--c:${p.c}"><b style="color:var(--c)">${BP.parts.indexOf(p)+1}. ${p.n}</b> <span class="mu">· ${i+1}/${mx+1}. szint</span><div class="bpp">${pips(i,mx)}</div><div class="mu">Fejlesztettség: <b>${pct}%</b></div>
 ${cd?`<div class="mu" style="margin-top:6px">${cd.l}: <b>${Math.round(cd.p)}%</b></div><div class="bar bpb"><i style="width:${Math.max(0,Math.min(100,cd.p))}%"></i></div>`:''}
 <div style="margin-top:6px">Most: <b>${t[i][0]}</b><br><span class="mu">${p.st(t[i])}</span></div>${note}</div>${svc()}${BP.extras.map(f=>f()).join('')}`};
const st=document.createElement('style');st.textContent=`.bpw{background:#0e2a47;border:1px solid #2d6a9f;border-radius:10px;padding:4px;margin-bottom:8px}.bpw svg{display:block;width:100%;height:auto}
.bpw .ln{stroke:#7fc8ff;stroke-width:1.1;fill:none}.bpw .ln.dash{stroke-dasharray:4 3}.bpw .dm{stroke:#7fc8ff88;fill:none;stroke-width:.8}.bpw .tt{fill:#9fd4ff;font:8px Georgia}
.bpw .part .ln{stroke:var(--c);stroke-width:1.5}.bpw .part .ln rect,.bpw .part .ln circle,.bpw .part rect.ln,.bpw .part circle.ln{fill:var(--c);fill-opacity:.13}
.bpw .ln .glass{fill:#7fc8ff;fill-opacity:.08;stroke-opacity:.5}.bpw .part path.fl{fill:var(--c);fill-opacity:.14}.bpw .part .lv{fill:var(--c);fill-opacity:.45;stroke:none}.bpw .ln rect{fill:#7fc8ff;fill-opacity:.04}
.bpw .part.sel .ln{stroke-width:2.4;filter:drop-shadow(0 0 3px var(--c))}.bpw .part.sel .ln rect,.bpw .part.sel .ln circle,.bpw .part.sel rect.ln{fill-opacity:.3}
.bpw .pin{cursor:pointer}.bpw .pin .ld{stroke:var(--c);stroke-opacity:.6;stroke-width:.9}.bpw .pin circle{fill:#0e2a47;stroke:var(--c);stroke-width:1.6}
.bpw .pin text{fill:var(--c);font:bold 11px Georgia;text-anchor:middle;pointer-events:none}.bpw .pin.sel circle{fill:var(--c);stroke:#fff}.bpw .pin.sel text{fill:#10151c}.bpw .pin circle.hit{fill:transparent;stroke:none}
.bpo{margin:0 0 6px}.bps{display:flex;height:9px;border-radius:5px;overflow:hidden;background:#1d2a38;gap:2px}.bps i{display:block;height:100%}
.bpcs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}.bpc{flex:1 1 30%;min-width:96px;display:flex;align-items:center;gap:5px;padding:7px 6px;border-radius:9px;border:1px solid color-mix(in srgb,var(--c) 45%,#1b2631);background:#111a24;color:#cfe3f5;font:600 11px Georgia;text-align:left;white-space:nowrap;overflow:hidden}
.bpc i{width:10px;height:10px;border-radius:3px;background:var(--c);flex:none}.bpc b{color:var(--c)}.bpc small{margin-left:auto;opacity:.7;font-size:10px}.bpc.sel{background:color-mix(in srgb,var(--c) 22%,#111a24);border-color:var(--c);box-shadow:0 0 0 1px var(--c) inset}
.bpd{border-left:5px solid var(--c)}.bpp{display:flex;gap:3px;margin:6px 0}.bpp s{flex:1;height:8px;border-radius:3px;background:#27323f}.bpp s.on{background:var(--c)}.bpp s.cur{box-shadow:0 0 6px var(--c)}
.bpb i{background:var(--c)!important}.bpr{margin-top:6px;padding:6px 8px;border-radius:8px;background:#0f1822}.bpbuy{background:var(--c)!important;color:#10151c!important}.bpbuy:disabled{opacity:.45}`;
(document.head||document.body).appendChild(st);
})(typeof window!=='undefined'?window:globalThis);
