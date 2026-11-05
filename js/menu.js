/* Drill Up – Beállítások-menü: csoportosított, görgethető lista kapcsolókkal.
   A meglévő setBody() tartalmát (minden vezérlő, minden onchange) alakítja át: a vezérlők maradnak, csak a megjelenés és a csoportosítás új.
   Hiba esetén a régi menü jelenik meg. A lista saját görgetősávban van (a menü háttere nem görög), a „Vissza” gomb fent rögzített. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('menu');
const GROUPS=[
 ['🌐','Language / Nyelv',['lang']],
 ['🔊','Hang és rezgés',['vol','mus','amb','hap']],
 ['⚙','Játékmenet',['sc','auto','abk','alp','tnl']],
 ['🛠','Gép és irányítás',['snap','arc','erect']],
 ['🖥','Kijelző és grafika',['q','fcl','rl','fs','fpsb']],
 ['💾','Adatok és hibakeresés',['dbg','DIAG','save']]];
const keyOf=h=>{if(/I18N\.set/.test(h))return'lang';if(/DIAG\.show|TUT\.|ERRLOG\./.test(h))return'DIAG';if(/expSave|impSave/.test(h))return'save';if(/FS\.set/.test(h))return'fs';const m=/S\.set\.(\w+)/.exec(h);return m?m[1]:'?'};
const conv=h=>{h=h.trim();let m;
 if(m=/^<label>\s*<input type="checkbox"([^>]*)>\s*([\s\S]*?)<\/label>$/.exec(h)){const t=m[2].trim(),i=t.search(/\s/),ic=/^[^\wÁ-ű]/.test(t)&&i>0?t.slice(0,i):'',tx=ic?t.slice(i).trim():t,k=/^(.*?)(?:[:–(]|$)/.exec(tx),title=(k&&k[1]||tx).trim(),rest=tx.slice(title.length).replace(/^[:–\s]+/,'');
  return`<label class="mrw"><span class="mtx">${ic?'<em>'+ic+'</em>':''}<b>${title}</b>${rest?'<small>'+rest.replace(/^\(|\)$/g,'')+'</small>':''}</span><input type="checkbox"${m[1]}><i class="msw"></i></label>`}
 if(m=/^([\s\S]*?)(<select[\s\S]*<\/select>)$/.exec(h))return`<div class="mrw sel"><span class="mtx"><b>${m[1].trim()}</b></span>${m[2]}</div>`;
 if(m=/^([\s\S]*?)(<input type="range"[^>]*>)$/.exec(h))return`<div class="mrw col"><span class="mtx"><b>${m[1].trim()}</b></span>${m[2]}</div>`;
 return`<div class="mrw col">${h}</div>`};
const MNU={
 set(raw){try{
  let body=raw.replace(/^<div class="card"[^>]*>/,'').replace(/<button class="mb pri" onclick="showMM\(\)">[^<]*<\/button>\s*$/,'');body=body.replace(/<\/div>\s*$/,'');
  const items=body.split(/<br><br>/).filter(x=>x.trim());const by={};
  for(const h of items){const k=keyOf(h);(by[k]=by[k]||[]).push(h)}
  const used=new Set();let out='';
  for(const[ic,ti,keys]of GROUPS){let g='';for(const k of keys)for(const h of by[k]||[]){used.add(h);g+=conv(h)}if(g)out+=`<section class="msec"><h4><span>${ic}</span>${ti}</h4>${g}</section>`}
  const rest=items.filter(h=>!used.has(h));if(rest.length)out+=`<section class="msec"><h4><span>⋯</span>Egyéb</h4>${rest.map(conv).join('')}</section>`;
  return`<div class="mset"><div class="mhd"><button class="mbk" onclick="showMM()" aria-label="Vissza">◀</button><b>Beállítások</b><small>v${typeof VER!=='undefined'?VER:''}</small></div><div class="msc">${out}<div class="mfoot">Drill Up</div></div></div>`}catch(e){return raw}}};
W.MNU=MNU;
})(typeof window!=='undefined'?window:globalThis);
