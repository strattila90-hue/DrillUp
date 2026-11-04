// Fúrófej fordulatszám (RPM) – csúszka; sebesség ~ fordulat, túlpörgetés kopást okoz
window.RPM=(()=>{
 const MIN=20,MAX=120,DEF=60,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
 const ens=()=>{if(typeof S==='undefined')return DEF;if(typeof S.rp!=='number'||!isFinite(S.rp))S.rp=DEF;S.rp=Math.round(cl(S.rp,MIN,MAX));return S.rp};
 const k=()=>ens()/DEF;
 // a kőzet keménysége (HEAT≈r) csökkenti a biztonságos fordulatot
 const lim=()=>{const r=typeof HEAT==='number'?cl(HEAT,0,1.2):.5;return cl(120-45*r,66,120)};
 const ov=()=>cl((ens()-lim())/20,0,1);
 const spf=()=>Math.pow(k(),.85);
 const fuel=()=>Math.pow(k(),1.1);
 const wm=()=>Math.pow(k(),1.4)*(1+ov()*14);
 let warned=0;
 const set=v=>{S.rp=Math.round(cl(+v||DEF,MIN,MAX));ens();upd()};
 const ui=()=>`<div class="rpm" id="rpmBox" style="display:flex;align-items:center;gap:8px;margin:0 0 7px;font-size:11px"><span>⚙ Fordulat</span><input id="rpmIn" type="range" min="${MIN}" max="${MAX}" step="2" value="${ens()}" style="flex:1;min-width:0;height:22px" oninput="RPM.set(this.value)" onpointerdown="event.stopPropagation()"><b id="rpmV" style="min-width:64px;text-align:right">${ens()} rpm</b></div>`;
 const upd=()=>{if(typeof document==='undefined'||typeof document.getElementById!=='function')return;const i=document.getElementById('rpmIn'),v=document.getElementById('rpmV');if(!i||!v)return;const r=ens(),L=lim(),o=ov();if(+i.value!==r)i.value=r;
  i.style.accentColor=o>0?'#e33':(r>L-12?'#e90':'#4a9');
  v.textContent=r+' rpm'+(o>0?' ⚠':'');v.style.color=o>0?'#ff5a4a':''};
 // integráció: sebesség, üzemanyag, kopás
 const hook=()=>{if(window.BIT&&!BIT._rp){BIT._rp=1;const s=BIT.spd,w=BIT.wear;BIT.spd=()=>s.call(BIT)*spf();BIT.wear=(d,L)=>{const o=ov();if(o>0&&Date.now()-warned>6000){warned=Date.now();if(typeof msg==='function')msg('⚠ Túl nagy fordulat ebben a kőzetben – a fúrófej gyorsan kopik! Csökkentsd a fordulatot.');try{if(typeof alarm3==='function')alarm3()}catch(e){}}return w.call(BIT,d*wm(),L)}}
  if(window.ENG&&!ENG._rp){ENG._rp=1;const f=ENG.work;ENG.work=function(c,o){const r=f.apply(ENG,arguments);if(r&&o&&!o.trav)r.fuel=(r.fuel||1)*fuel();return r}}};
 hook();
 if(typeof on==='function')on('frame',()=>{hook();upd()});
 return{MIN,MAX,DEF,ens,k,lim,ov,spf,fuel,wm,set,ui,upd};
})();
