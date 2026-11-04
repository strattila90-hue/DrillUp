/* Drill Up – 5/A: ásványadatbázis (Tudás fül → „Ásványtár”).
   Minden adat szabványos ásványtani / geofizikai referencia (szobahőmérséklet, légköri nyomás, ha nincs másképp jelölve).
   A mély köpenyásványok (ringwoodit, wadsleyit, bridgmanit, davemaoit) adatait külön ellenőriztem (Wikipedia/IMA, 2026-11).
   Mezők: [képlet, Mohs-keménység (szöveg), sűrűség g/cm³ (szöveg), kristályrendszer, megjegyzés]. „—” = nincs értelmezve / nem ellenőrzött. */
(function(W){
'use strict';
W.MODS=W.MODS||[];W.MODS.push('minerals');
const D={
'Kavics':['SiO₂ (kvarc-kavics)','7','2,65','trigonális','Kemény, ellenálló – a folyók legömbölyítik.'],
'Humusz':['szerves anyag','—','1,2–1,5','nem kristályos','Nem ásvány: elbomlott növényi maradék a talajban.'],
'Homok':['SiO₂ (kvarc)','7','2,65','trigonális','Kvarcszemcsék; üveg és beton alapanyaga.'],
'Agyag':['Al₂Si₂O₅(OH)₄ (kaolinit)','2–2,5','2,6','triklin','Rétegszilikát, nedvesen képlékeny.'],
'Kőszén':['C (70–90%) + szerves anyag','1–2','1,1–1,5','amorf (ásványszerű)','Nem valódi ásvány: kőzet, kövült növényi anyag.'],
'Borostyán':['kövült gyanta (C₁₀H₁₆O)','2–2,5','1,05–1,10','amorf','Vízben lebeg a sós oldatban; rovarokat zárhat be.'],
'Mészkő':['CaCO₃ (kalcit)','3','2,71','trigonális','Cementgyártás; savtól pezseg.'],
'Kősó':['NaCl (halit)','2–2,5','2,17','köbös','Lepárlódó tengerek üledéke.'],
'Vasérc':['Fe₂O₃ (hematit)','5–6','5,26','trigonális','Vörös karc; a legfontosabb vasérc.'],
'Rézérc':['CuFeS₂ (kalkopirit)','3,5–4','4,2','tetragonális','Sárgásréz-színű, a réz fő érce.'],
'Gránitzúzalék':['kvarc + földpát + csillám','6–7 (alkotók)','2,6–2,7','keverék (kőzet)','Nem egyetlen ásvány: gránit törmeléke.'],
'Ezüst':['Ag','2,5–3','10,49','köbös','A legjobb elektromos vezető fém.'],
'Arany':['Au','2,5–3','19,3','köbös','Nem oxidálódik; rendkívül képlékeny.'],
'Ón':['SnO₂ (kassziterit)','6–7','6,8–7,1','tetragonális','Az ón egyetlen jelentős érce.'],
'Wolfram':['CaWO₄ (scheelit)','4,5–5','5,9–6,1','tetragonális','UV-fényben kékesen világít; a wolfram érce.'],
'Uránérc':['UO₂ (uraninit)','5–6','8–10,9','köbös','Radioaktív; az urán fő érce.'],
'Titánérc':['FeTiO₃ (ilmenit)','5–6','4,7','trigonális','Titán-dioxid és titánfém alapanyaga.'],
'Nikkel':['Ni','4','8,9','köbös','Mágneses fém; rozsdamentes acél ötvözője.'],
'Kobalt':['Co','5','8,9','hexagonális','Mágneses; akkumulátorok katódja.'],
'Platina':['Pt','4–4,5','21,45','köbös','Kémiailag szinte támadhatatlan.'],
'Olivin (peridot)':['(Mg,Fe)₂SiO₄','6,5–7','3,2–4,4','rombos','A felső köpeny fő ásványa; ékköve a peridot.'],
'Krómit':['FeCr₂O₄','5,5','4,5–4,8','köbös','A króm egyetlen jelentős érce.'],
'Gyémánt':['C','10','3,52','köbös','A legkeményebb természetes anyag; magas nyomáson keletkezik.'],
'Platinacsoport-fémek':['Pd, Rh, Ir, Ru, Os, Pt','4,75–7 (fémenként)','12–22,6','köbös / hexagonális','Katalizátorok; igen ritkák.'],
'Ringwoodit':['γ-(Mg,Fe)₂SiO₄','—','3,90 (tiszta Mg₂SiO₄)','köbös (spinell)','Stabil ~525–660 km mélyen, ~18–23 GPa-nál; vizet köthet meg.'],
'Wadsleyit':['β-(Mg,Fe)₂SiO₄','—','3,84','rombos','Stabil ~410–520 km mélyen.'],
'Gránát':['Fe₃Al₂(SiO₄)₃ (almandin)','7–7,5','4,1–4,3','köbös','Csiszolóanyag és ékkő.'],
'Bridgmanit':['(Mg,Fe)SiO₃','—','—','rombos (perovszkit)','A köpeny leggyakoribb ásványa; ~660 km-nél (~24 GPa) képződik, 2014-ben nevezte el az IMA.'],
'Ferroperiklász':['(Mg,Fe)O','5,5–6 (periklász)','3,56 (periklász)','köbös','Az alsó köpeny második fő ásványa.'],
'Davemaoit':['CaSiO₃ (Ca-perovszkit)','—','—','perovszkit-szerkezet','Alsó köpeny; csak 2021-ben azonosították gyémánt-zárványban.'],
'Poszt-perovszkit':['MgSiO₃','—','—','rombos','A bridgmanit nagynyomású módosulata ~2700 km-től (D″ réteg).'],
'Ősi bazaltmaradék':['szilikát-keverék','—','—','keverék','A lemezmaradványok hipotetikus anyaga (a játék kitalációja).'],
'Vas–nikkel ötvözet':['Fe + Ni (+ könnyű elemek)','—','9,9–12,2 (a mag adata)','—','A külső mag folyékony; sűrűsége a PREM-modell szerint 9,9–12,2 g/cm³.'],
'Kén':['S','1,5–2,5','2,07','rombos','Vulkáni; kénsav alapanyaga.'],
'Ozmium':['Os','7','22,59','hexagonális','A legsűrűbb elem.'],
'Szilárd vas–nikkel':['Fe + Ni','—','12,8–13,1 (a mag adata)','—','A belső mag; ~5150 km-től szilárd.'],
'Irídium':['Ir','6,5','22,56','köbös','A K–Pg határréteg jellegzetes eleme.']};
const KN={D,
 get(n){return D[n]||null},
 // melyik rétegben fordul elő
 layers(n){return LY.filter(l=>l[5].some(x=>x[0]===n)).map(l=>l[0])},
 mohs(s){const m=String(s).match(/[\d,]+/);return m?parseFloat(m[0].replace(',','.')):0},
 known(){const s=new Set();for(const l of LY)if(S.max>=l[1])for(const x of l[5])s.add(x[0]);return s},
 html(){const k=KN.known(),names=[...k];let h=`<h3>Ásványtár (${names.length}/${[...new Set(LY.flatMap(l=>l[5].map(x=>x[0])))].length})</h3><div class="mu" style="margin-bottom:6px">Szabványos referenciaértékek. A kristályrendszer és a sűrűség a tiszta ásványra vonatkozik; a kőzetek és keverékek jelölve.</div>`;
  for(const l of LY){if(S.max<l[1])continue;for(const x of l[5]){const d=D[x[0]];if(!d)continue;const m=KN.mohs(d[1]);
   h+=`<div class="card" style="border-left:6px solid ${l[4]}"><b>${x[0]}</b> <span class="mu">${d[0]}</span><br><span class="mu">Keménység (Mohs): <b>${d[1]}</b>${m?` <i style="display:inline-block;vertical-align:middle;width:${Math.round(m*9)}px;height:6px;border-radius:3px;background:linear-gradient(90deg,#c9a24a,#ffe9a0)"></i>`:''} · sűrűség: <b>${d[2]}</b> g/cm³ · rendszer: <b>${d[3]}</b><br>${d[4]}<br>Réteg: ${l[0]} · ${nf(x[1]*(x[1]<1?1000:1),x[1]<1?1:0)} ${x[1]<1?'g':'kg'}/m · ${ft(x[2])}/kg</span></div>`}}
  return h}};
W.KN=KN;
})(typeof window!=='undefined'?window:globalThis);
