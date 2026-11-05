/* Drill Up – pályafutás-statisztika, „távollétedben" összegzés, mentési emlékeztető.
   Állapot: S.ss = {t0, pt, dm, ce, cs, tr, bs, exp, aw}. Csak megfigyel (a játékállást nem módosítja), hiányzó mező pótolódik.
   A statisztika a játék saját eseményeiből (sim/frame) számol; semmit sem talál ki. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('stats');
const DAY=864e5,AWAY_MIN=180; // ennyi másodperc fölött számít „távollétnek"
const ST={
 ss(){if(typeof S==='undefined')return{};let o=S.ss;if(!o||typeof o!=='object'||Array.isArray(o))o=S.ss={};
  const n=(k,v)=>{if(!isFinite(o[k]))o[k]=v};n('t0',Date.now());n('pt',0);n('dm',0);n('ce',0);n('cs',0);n('tr',0);n('bs',0);n('exp',0);return o},
 prev:null,wasB:null,
 snap(){return{d:S.depth,c:S.cash,f:S.fuel,h:S.hp,x:S.x,m:Math.max(S.max||0,S.depth||0),k:ST.kg()}},
 kg(){let t=0;for(const n in (S.cg||{}))t+=+S.cg[n]||0;return t},
 // egy szimulációs lépés után: a változásokból gyűjt
 onSim(real){if(typeof S==='undefined')return;const o=ST.ss(),p=ST.prev,q=ST.snap();
  if(p){const dd=q.d-p.d,dc=q.c-p.c;
   if(dd>0&&(S.st==='D'||real>=AWAY_MIN))o.dm+=dd;
   if(dc>0){o.ce+=dc;if(dc>o.bs)o.bs=dc}else o.cs-=dc;
   if(real>=AWAY_MIN&&(Math.abs(dd)>.5||Math.abs(dc)>1||Math.abs(q.k-p.k)>1))ST.away(real,p,q)}
  let b=false;try{b=!!base()}catch(e){}
  if(ST.wasB===false&&b)o.tr++;ST.wasB=b;ST.prev=q},
 away(real,p,q){const o=ST.ss();o.aw={s:Math.round(real),dd:q.d-p.d,dc:q.c-p.c,df:q.f-p.f,dh:q.h-p.h,dk:q.k-p.k,mx:q.m-p.m,at:Date.now()};
  try{msg('🌙 Távollétedben '+ST.dur(real)+' telt el: '+(o.aw.dd>=0?'+':'')+ST.num(o.aw.dd)+' m mélység, '+(o.aw.dc>=0?'+':'')+ST.num(o.aw.dc)+' Ft',true)}catch(e){}
  ST.card()},
 num(n){return Math.round(n).toLocaleString(window.I18N&&I18N.lang==='en'?'en-US':'hu-HU')},
 dur(s){s=Math.round(s);if(s<90)return s+' mp';if(s<5400)return Math.round(s/60)+' perc';if(s<172800)return (s/3600).toFixed(1).replace('.',',')+' óra';return Math.round(s/86400)+' nap'},
 awayHtml(a){if(!a)return'';
  const r=[['⏱ Eltelt',ST.dur(a.s)],['⬇ Mélység változása',(a.dd>=0?'+':'')+ST.num(a.dd)+' m'],['💰 Pénz',(a.dc>=0?'+':'')+ST.num(a.dc)+' Ft'],['⛽ Üzemanyag',(a.df>=0?'+':'')+ST.num(a.df)+' kg'],['📦 Rakomány',(a.dk>=0?'+':'')+ST.num(a.dk)+' kg']];
  if(Math.abs(a.dh)>=.5)r.push(['🛡 Páncél',(a.dh>=0?'+':'')+a.dh.toFixed(1).replace('.',',')+'%']);
  if(a.mx>0)r.push(['🏁 Új rekordmélység','+'+ST.num(a.mx)+' m']);
  return r.map(x=>`<div class="stl"><span class="mu">${x[0]}</span> <b>${x[1]}</b></div>`).join('')},
 card(){const d=W.document;if(!d||!d.body||!d.createElement||!d.getElementById)return;const a=ST.ss().aw;if(!a)return;
  let c=d.getElementById('awCard');if(!c){c=d.createElement('div');c.id='awCard';d.body.appendChild(c)}
  c.innerHTML=`<div class="srh"><span>🌙</span><b>Távollétedben</b><button class="srx" aria-label="Bezár" onclick="ST.closeCard()">✕</button></div>${ST.awayHtml(a)}<button class="b g" style="width:100%;margin-top:8px" onclick="ST.closeCard()">Rendben</button>`;
  c.style.display='block'},
 closeCard(){const d=W.document;const c=d&&d.getElementById&&d.getElementById('awCard');if(c)c.style.display='none'},
 days(t){return Math.floor((Date.now()-t)/DAY)},
 // mentési emlékeztető: ha 7 napnál régebben volt export, és van mit elveszíteni
 needsBackup(){const o=ST.ss();return(S.max||0)>=100&&Date.now()-(o.exp||o.t0)>7*DAY},
 nudged:false,
 nudge(){if(ST.nudged||!ST.needsBackup())return;ST.nudged=true;try{toast('💾 Régen mentettél kívülre – a Beállításokban a „Mentés exportálása" véd az adatvesztéstől.')}catch(e){}},
 markExport(){ST.ss().exp=Date.now()},
 html(){const o=ST.ss(),mx=Math.max(S.max||0,S.depth||0),pt=o.pt,nb=ST.needsBackup();
  const row=(a,b)=>`<div class="stl"><span class="mu">${a}</span> <b>${b}</b></div>`;
  const km=m=>m>=1e3?(m/1e3).toLocaleString(window.I18N&&I18N.lang==='en'?'en-US':'hu-HU',{maximumFractionDigits:1})+' km':Math.round(m)+' m';
  return`<div class="card">📊 <b>Pályafutás</b><details style="margin-top:6px"><summary class="mu">Megnyitás</summary>`+
   row('Rekordmélység',km(mx))+row('Összes fúrt mélység',km(o.dm))+row('Összes bevétel',GLfm(o.ce))+row('Összes kiadás',GLfm(o.cs))+row('Legnagyobb egyszeri bevétel',GLfm(o.bs))+
   row('Bázisra visszatérések',ST.num(o.tr))+row('Játékidő (aktív)',ST.dur(pt))+row('Gyűjtött beszámolók',(Array.isArray(S.sty)?S.sty.length:0)+(W.STO?'/'+STO.DB.length:''))+row('Játék kezdete',ST.days(o.t0)+' napja')+
   row('Utolsó mentés-export',o.exp?ST.days(o.exp)+' napja':'még nem volt')+
   (nb?`<div class="mu" style="color:#e8b84a;margin-top:4px">⚠ Érdemes exportálni a mentést (Beállítások).</div>`:'')+
   (o.aw?`<div style="margin-top:8px"><b>Utolsó távollét</b>${ST.awayHtml(o.aw)}</div>`:'')+`</details></div>`}};
function GLfm(n){return W.GL?GL.fm(n):Math.round(n).toLocaleString(window.I18N&&I18N.lang==='en'?'en-US':'hu-HU')+' Ft'}
W.ST=ST;
if(W.on){
 on('sim',real=>{try{ST.onSim(real)}catch(e){DBG.err='stats: '+(e.message||e)}});
 on('frame',dt=>{try{ST.ss().pt+=Math.min(dt,.1)}catch(e){}});
}
// az S és az expSave a modulok után jön létre: az első időzítésnél (az első szimuláció előtt) köt be
ST.init=function(){try{if(typeof S==='undefined')return;ST.ss();ST.prev=ST.snap();
  if(typeof W.expSave==='function'&&!W.expSave._st){const o=W.expSave;W.expSave=function(){try{ST.markExport()}catch(e){}return o.apply(this,arguments)};W.expSave._st=1}}catch(e){}};
if(W.setTimeout){setTimeout(ST.init,0);setTimeout(()=>{try{ST.nudge()}catch(e){}},8000)}
if(W.BP)BP.extras.push(()=>ST.html());
})(typeof window!=='undefined'?window:globalThis);
