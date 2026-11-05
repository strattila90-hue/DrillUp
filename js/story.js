/* Drill Up – Beszámolók: valós történelmi események és tudásmorzsák, amik az adott mélység elérésekor jelennek meg.
   Csak ellenőrizhető tényeket tartalmaz (a bizonytalan adatok „kb.”-vel). A megtalált beszámolók: S.sty (azonosítók).
   Egy kártya jelenik meg egyszerre; ha a gép egyszerre több mélységet ugrik át, csak a legmélyebbet mutatja, a többi a gyűjteménybe kerül.
   Kategóriák: ⛏ bányászat · 🛢 fúrás · 🌋 geológia · 🔬 kutatás · 📖 irodalom */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('story');
// d = mélység (m), k = ikon, y = év, t = cím, s = szöveg
const DB=[
 {d:20,k:'⛏',y:'1780-as évek',t:'A párizsi katakombák',s:'Az utcák alatt kb. 20 m mélyen régi mészkőbányák húzódnak. A 18. század végén ide költöztették át a túlzsúfolt temetők csontjait, így lett a bányából hatalmas altemplom-sír.'},
 {d:30,k:'🛢',y:'1971',t:'Darvaza – a „Pokol kapuja”',s:'Türkmenisztán sivatagában a hagyomány szerint szovjet fúrók egy földgázzal teli üregbe törtek be, a talaj beomlott. A gázt meggyújtották, hogy elégjen – és a kráter azóta is ég.'},
 {d:73,k:'⛏',y:'2002',t:'Quecreek – kilenc ember a víz alatt',s:'Pennsylvaniában egy bánya áttört egy régi, elárasztott tárnába, és kilenc bányász rekedt kb. 73 m mélyen. Egy mentőfúrással kb. 77 óra után mind a kilencet kimentették.'},
 {d:183,k:'🛢',y:'1961',t:'Mohole-program – az első mélytengeri fúrás',s:'Mexikó partjainál, kb. 3500 m mély víz alatt az amerikai kutatók 183 m-t fúrtak a tengerfenékbe. Cél a Föld köpenyének elérése volt; a program túl drága lett, de megszületett belőle a modern óceáni fúrásos kutatás.'},
 {d:215,k:'⛏',y:'1871–1914',t:'A kimberley-i „Nagy Lyuk”',s:'Dél-Afrikában gyémántkeresők kézi szerszámokkal ástak egy több mint 200 m mély gödröt – gyakran a világ legnagyobb kézzel ásott gödreként emlegetik. A gyémánt a felszínre törő, mély köpenyből származó kimberlit-csövekben található.'},
 {d:327,k:'⛏',y:'13. század',t:'Wieliczka sóbánya',s:'Lengyelországban a sót a 13. századtól bányászták, a legmélyebb szint kb. 327 m. A sóból faragott kápolnák és szobrok miatt 1978-ban az UNESCO az elsők között védte meg világörökségként.'},
 {d:688,k:'⛏',y:'2010',t:'A 33 chilei bányász',s:'A San José-bánya 2010. augusztus 5-én beomlott, 33 bányász rekedt kb. 688 m mélyen. 69 nap után mind kijutott egy mentőkapszulán – a történelem leghosszabb ideig föld alatt túlélt csapata.'},
 {d:970,k:'🛢',y:'1870-es évek',t:'Zsigmondy Vilmos fúrása a Városligetben',s:'A magyar bányamérnök mintegy 970 m mély kutat fúrt Budapesten, és közel 74 fokos termálvizet hozott fel. A kút vize később a Széchenyi fürdőt táplálta, ami 1913-ban nyílt meg.'},
 {d:1090,k:'🛢',y:'1925',t:'Hajdúszoboszló – olaj helyett gyógyvíz',s:'A kb. 1100 m-es fúrás olajat keresett, de 70 fok körüli, forró gyógyvizet talált. A kudarcnak szánt kút nyomán lett az ország egyik legismertebb fürdővárosa.'},
 {d:1335,k:'🔬',y:'2016',t:'Chicxulub – a dinoszauruszok vége',s:'Nemzetközi csapat a Yucatán-félsziget alatti becsapódási kráter szélét fúrta át kb. 1335 m mélyen a tengerfenék alatt. A kőzetminták igazolják: az aszteroida kb. 66 millió éve ütött be, és a központi gyűrűhegység a becsapódáskor szinte folyékonyan viselkedő kőzetből emelkedett ki.'},
 {d:2212,k:'🔬',y:'2010-es évek',t:'Veriovkina – a Föld legmélyebb ismert barlangja',s:'A Kaukázusban, Abháziában a barlangászok kb. 2200 m mélyre jutottak le a felszíntől. Víz, jég és szűk átjárók: ez az ember által elért legmélyebb természetes üreg.'},
 {d:2300,k:'⛏',y:'2016',t:'Szent Gotthárd-alagút',s:'A svájci Alpokban az 57 km-es bázisalagút fölött a hegy vastagsága a legmagasabb pontján kb. 2300 m. A kőzet hője itt is gondot okozott: szellőztetni és hűteni kellett.'},
 {d:3900,k:'⛏',y:'1980-as évek óta',t:'Mponeng – a legmélyebb aranybánya',s:'Dél-Afrikában a bányászok kb. 4 km mélyen dolgoznak. A kőzet hőmérséklete 60 °C fölé is emelkedik, ezért jeges vizes hűtőrendszerek nélkül nem lehetne ott dolgozni.'},
 {d:9583,k:'🛢',y:'1974',t:'A Bertha Rogers kút',s:'Oklahomában ezt a kutat kb. 9583 m-re fúrták le földgázért – korában a világ legmélyebb kútja. Ilyen mélységben a nyomás és a hőmérséklet már a berendezéseket is a végsőkig terheli.'},
 {d:10685,k:'🛢',y:'2009',t:'Tiber-kút a Mexikói-öbölben',s:'Tengeri fúrótorony kb. 10 685 m összmélységig fúrt: több mint egy kilométer víz és még sok kilométer kőzet alatt kereste a kőolajat. Ez az olajipar egyik rekordkútja.'},
 {d:10911,k:'🔬',y:'1960',t:'A Trieste a Challenger-árokban',s:'Jacques Piccard és Don Walsh a mélytengeri batiszkáffal a Mariana-árok fenekére, kb. 10 900 m-re merült. Alattuk még kilométerek kőzete húzódik.'},
 {d:12262,k:'🛢',y:'1970–1989',t:'A Kola szuper-mélyfúrás',s:'Az orosz Kola-félszigeten a szovjet tudósok 1970-től fúrtak, és 1989-ben 12 262 m-ig jutottak – ez az ember által fúrt legmélyebb pont. A fenéken a kőzet kb. 180 °C-os volt, így a fúrás 1990-es évek elején leállt, a furat átmérője mindössze 23 cm volt.'},
 {d:12376,k:'🛢',y:'2012',t:'Z-44 Csajvo – hosszúság-rekord',s:'A Szahalin melletti olajkút kb. 12 376 m hosszú. De a fúrás nagy része vízszintes irányba vezetett, ezért a kút függőleges mélysége sokkal kisebb, mint a Kola-fúrásé.'},
 {d:35e3,k:'🔬',y:'1909',t:'Mohorovičić és a kéreg határa',s:'A horvát Andrija Mohorovičić a zágrábi földrengés hullámait elemezve észrevette, hogy a hullámok kb. 30–50 km mélyen hirtelen felgyorsulnak. Ez a kéreg és a köpeny határa – ma Moho-nak hívjuk.'},
 {d:150e3,k:'🌋',y:'ősidők óta',t:'Honnan jön a gyémánt?',s:'A természetes gyémánt jellemzően kb. 150–200 km mélyen, óriási nyomáson és hőségben keletkezik. Gyors, robbanásszerű vulkáni kitörések (kimberlit-csövek) hozták a felszínre – lassabb út esetén grafittá alakulna.'},
 {d:600e3,k:'🔬',y:'2014',t:'Víz a köpenyben egy gyémántban',s:'Egy brazíliai gyémántban apró zárványt találtak: ringwooditot, ami a köpeny átmeneti zónájában keletkezik, és vizet is tartalmaz. Egyes kutatók szerint ott akár az óceánokéval vetekedő mennyiségű víz is lehet.'},
 {d:2890e3,k:'🔬',y:'1913',t:'Gutenberg és a mag határa',s:'Beno Gutenberg földrengéshullámok árnyékából kb. 2900 km mélyen kimutatta a köpeny és a folyékony külső mag határát. Az S-hullámok nem mennek át a folyadékon.'},
 {d:5150e3,k:'🔬',y:'1936',t:'Inge Lehmann és a belső mag',s:'A dán szeizmológus a földrengéshullámok furcsa visszaverődéseiből kimutatta, hogy a folyékony magban egy szilárd belső mag van. A Föld legbelsejében kb. 5000 °C feletti hőmérséklet és hatalmas nyomás miatt a vas szilárd.'},
 {d:6e6,k:'📖',y:'1864',t:'Jules Verne: Utazás a Föld középpontja felé',s:'A regény hősei egy izlandi vulkán kráterén át ereszkednek le a Föld mélyébe. Ez szépirodalom – a valóságban az ottani hőség és nyomás miatt ilyen utazás lehetetlen.'}
];
const BYID=DB.map((e,i)=>(e.id=i+1,e));
const STO={DB:BYID,cur:null,Q:[],gap:0,show:true,
 seen(){return Array.isArray(S.sty)?S.sty:(S.sty=[])},
 has(id){return STO.seen().indexOf(id)>=0},
 fd(d){return d>=1e3?(d/1e3).toLocaleString('hu-HU',{maximumFractionDigits:1})+' km':Math.round(d)+' m'},
 // a frame-enként hívott ellenőrzés
 check(dt){if(typeof S==='undefined'||!isFinite(S.depth))return;STO.gap=Math.max(0,STO.gap-dt);const sn=STO.seen();let top=null;
  for(const e of DB){if(S.depth>=e.d&&sn.indexOf(e.id)<0){sn.push(e.id);top=e}}
  if(top){STO.Q.push(top);if(STO.Q.length>1)STO.Q.splice(0,STO.Q.length-1)}
  if(STO.Q.length&&STO.gap<=0&&!STO.cur&&!(typeof sheetT!=='undefined'&&sheetT)&&!(W.NET&&NET.falling)&&!(W.DMG&&DMG.busy&&DMG.busy())){STO.open(STO.Q.shift())}},
 open(e){if(W.PN&&!PN.vis('sto'))return;STO.cur=e;STO.gap=25;try{beep(520,.1,.04,'sine');setTimeout(()=>beep(780,.16,.04,'sine'),110)}catch(x){}
  if(W.CIN&&CIN.on){if(!CIN.lec)CIN.caption(e);return}
  if(typeof document==='undefined'||!document.body||!document.createElement||!document.getElementById){return}
  let c=document.getElementById('stoCard');if(!c){c=document.createElement('div');c.id='stoCard';document.body.appendChild(c)}
  c.innerHTML=`<div class="sth"><span class="stk">${e.k}</span><div><div class="stm">📜 Beszámoló · ${e.y} · ${STO.fd(e.d)}</div><b>${e.t}</b></div><button class="srx" aria-label="Bezár" onclick="STO.close()">✕</button></div><div class="stb">${e.s}</div>`;
  c.style.display='block';c.classList.remove('out');clearTimeout(STO._t);STO._t=setTimeout(STO.close,Math.min(22000,8000+e.s.length*45))},
 close(){STO.cur=null;if(typeof document==='undefined'||!document.getElementById)return;const c=document.getElementById('stoCard');if(c)c.style.display='none'},
 // gyűjtemény kártya a Tudás/Műhely fülön
 html(){const sn=STO.seen(),n=sn.length;let h=`<div class="card">📜 <b>Beszámolók</b> <span class="mu">${n}/${DB.length}</span><div class="mu">Valós események és tudásmorzsák – fúrás közben, az adott mélység elérésekor jelennek meg.</div><div class="bar"><i style="width:${n/DB.length*100}%"></i></div><details style="margin-top:6px"><summary class="mu">Gyűjtemény megnyitása</summary>`;
  for(const e of DB){const f=STO.has(e.id);h+=f?`<div class="stl"><b>${e.k} ${e.t}</b> <span class="mu">${e.y} · ${STO.fd(e.d)}</span><div class="mu">${e.s}</div></div>`:`<div class="stl lock">🔒 ??? <span class="mu">· ${STO.fd(e.d)}</span></div>`}
  return h+'</details></div>'}
};
W.STO=STO;
if(W.on)on('frame',dt=>{try{STO.check(Math.min(dt,.1))}catch(e){DBG.err='story: '+(e.message||e)}});
if(W.BP)BP.extras.push(()=>STO.html());
})(typeof window!=='undefined'?window:globalThis);
