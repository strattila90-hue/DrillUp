/* DrillUp Core Quest – rövid, kihagyható bevezető (tutorial). Az állapot (du_tut) a böngésző tárában van, nem a mentésben.
   Első indításkor automatikusan megjelenik; bármikor kihagyható (Kihagyás), és a Beállításokból újraindítható. HU + EN. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('tutorial');
const en=()=>{try{return W.I18N&&I18N.lang==='en'}catch(e){return false}};
const ST=[
 ['⛏ Üdv a Core Questben!','⛏ Welcome to Core Quest!','Egy lánctalpas fúrógépet irányítasz a Föld rétegein át. Fúrj mélyre, hozz fel ásványokat, add el őket, és fejleszd a gépet.','You steer a tracked drilling machine down through the real layers of the Earth. Drill deep, bring up minerals, sell them and upgrade your machine.'],
 ['⚙ Fordulatszám','⚙ Drill speed','A csúszkával állítod a fúró fordulatát. Gyorsabban halad, de jobban melegszik és kopik – figyeld a páncél- és hő-kijelzőt.','Use the slider to set the drill speed. Faster means quicker progress but more heat and wear – watch the armor and heat gauges.'],
 ['🎮 Irányítás','🎮 Controls','A nyilakkal mozgatod a gépet, a ▲ gomb visszafelé visz, a 🏠 hazaküld a felszínre. Kifogyó üzemanyagnál mindig indulj haza!','Use the arrows to move the machine, ▲ goes back up and 🏠 sends you home. Head home before the fuel runs out!'],
 ['💰 Pénz és fejlesztés','💰 Money and upgrades','A felszínen eladod a kinyert anyagot. A pénzből a Műhelyben jobb gépet és fúrófejet, a Depóban nagyobb tárolókat vehetsz (legfeljebb 20. szintig).','Sell your haul on the surface. Spend the money in the Workshop on a better machine and drill bit, and in the Depot on bigger storage (up to level 20).'],
 ['🔴 Kisablakok','🔴 Small windows','A játék közbeni kisablakokat a piros ✕ gombbal bezárhatod, a 👁 gombbal bármikor visszahozhatod őket.','Close any in-game window with its red ✕; bring them back any time with the 👁 button.'],
 ['☰ Menü','☰ Menu','A Menüben találod a beállításokat (nyelv, hang, zene), és itt újra megnézheted ezt a bemutatót. Jó fúrást!','The Menu holds the settings (language, sound, music) and lets you replay this guide. Happy drilling!']];
const TUT={i:0,on:false,
 done(){try{return localStorage.getItem('du_tut')==='1'}catch(e){return true}},
 mark(){try{localStorage.setItem('du_tut','1')}catch(e){}},
 ok(){return typeof document!=='undefined'&&document.body&&document.createElement&&document.getElementById},
 start(){if(!TUT.ok())return;TUT.i=0;TUT.on=true;TUT.draw()},
 draw(){if(!TUT.ok())return;let b=document.getElementById('tutBox');if(!b){b=document.createElement('div');b.id='tutBox';document.body.appendChild(b)}
  const s=ST[TUT.i],e=en(),last=TUT.i===ST.length-1;
  b.innerHTML=`<div class="tth"><b>${e?s[1]:s[0]}</b><small>${TUT.i+1}/${ST.length}</small></div><div class="ttb">${e?s[3]:s[2]}</div><div class="ttr"><button class="tts" onclick="TUT.skip()">${e?'Skip':'Kihagyás'}</button><button class="ttn" onclick="TUT.next()">${last?(e?'Done':'Kész'):(e?'Next ▶':'Tovább ▶')}</button></div>`;b.style.display='block'},
 next(){if(TUT.i>=ST.length-1)return TUT.skip();TUT.i++;TUT.draw()},
 skip(){TUT.on=false;TUT.mark();try{const b=document.getElementById('tutBox');if(b)b.style.display='none'}catch(e){}},
 steps:ST.length,
 setHtml(){return`<button class="b g" style="width:100%" onclick="TUT.start()">🎓 ${en()?'Replay the tutorial':'Bemutató újra'}</button>`},
 tick(){if(TUT.on||TUT.done()||!TUT.ok())return;if(document.getElementById('mm')||!document.getElementById('cv'))return;TUT.start()}
};
W.TUT=TUT;
if(W.on){let a=0;on('frame',dt=>{a+=dt;if(a>1.5){a=0;try{TUT.tick()}catch(e){}}})}
})(typeof window!=='undefined'?window:globalThis);
