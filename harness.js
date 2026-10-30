'use strict';
/* Fejhallgatós (böngésző nélküli) tesztkörnyezet: ugyanazokat a <script> blokkokat futtatja, mint a böngésző,
   de a canvas, a hang és a tárhely kamu. LOGIKÁT és KIVÉTELEKET ellenőriz, megjelenést/érintést/hangot NEM. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
const P=()=>new Proxy(function(){},{get:(o,k)=>k=='sampleRate'?44100:k=='state'?'running':k=='length'?100:k=='currentTime'?0:k=='width'?50:k==Symbol.toPrimitive?()=>0:P(),apply:()=>P(),set:()=>true});
const NAMES=['S','go','draw','drawF','hero','showMM','hideMM','step','sim','tick','calc','DBG','pd','pu','stp','tl','pr','hold','sanitizeSave','init','EV','save','D','H','T','C','HD','HR','LY','FD','R','fd','fk','ft','layer','cargoKg','cap','tank','base','emerg','view','sheetHTML','sell','fill','buy','repair','expSave','impSave','toast','msg','HEAT','sheetT'];
function boot(o={}){
 const store=Object.assign({},o.store||{}),st={quota:false,sets:0},toasts=[];let menu=!!o.menu;
 const ls={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{if(st.quota)throw new Error('QuotaExceededError');store[k]=String(v);st.sets++},removeItem:k=>{delete store[k]}};
 const ctx2d=P(),mkc=(w,h)=>({clientWidth:w,clientHeight:h,width:0,height:0,getContext:()=>ctx2d}),cv=mkc(360,420),mc=mkc(360,740);
 const stub=()=>({innerHTML:'',textContent:'',style:{},className:'',classList:{add(){},remove(){},toggle(){}},remove(){},appendChild(){},click(){}});
 const doc={querySelector:s=>s=='#cv'?(o.noCanvas?null:cv):s=='#mc'?(menu?mc:null):s=='#mm'?(menu?{set innerHTML(v){},remove(){menu=false}}:null):s=='#toast'?{set textContent(v){toasts.push(v)},style:{}}:stub(),
  createElement:()=>Object.assign(mkc(0,0),stub()),addEventListener(){},body:{appendChild(){}},hidden:false};
 const sb={document:doc,localStorage:ls,navigator:{hardwareConcurrency:8,deviceMemory:8},devicePixelRatio:o.dpr||1,AudioContext:function(){return P()},requestAnimationFrame(){},setInterval(){return 0},
  setTimeout(f){sb.__timers.push(f);return sb.__timers.length},clearTimeout(){},addEventListener(){},location:{href:'',reload(){sb.__reloaded=1}},confirm:()=>true,
  __timers:[],__now:o.now||1.7e12,URL:{createObjectURL:()=>'blob:x',revokeObjectURL(){}},Blob:function(){},FileReader:function(){},console};
 sb.window=sb;vm.createContext(sb);vm.runInContext('Date.now=()=>__now',sb);
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8'),re=/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g;let m;
 while(m=re.exec(html)){if(m[1]&&o.skip&&o.skip.includes(m[1]))continue;vm.runInContext(m[1]?fs.readFileSync(path.join(ROOT,m[1]),'utf8'):m[2],sb,{filename:m[1]||'index.html'})}
 vm.runInContext('globalThis.__api={};'+NAMES.map(n=>`Object.defineProperty(__api,'${n}',{get(){try{return ${n}}catch(e){return undefined}},set(v){try{${n}=v}catch(e){}},configurable:true})`).join(';'),sb);
 let ts=1000;const g={T:sb.__api,sb,store,st,toasts,cv,mc,
  setMenu(v){menu=v},now:()=>sb.__now,advance(ms){sb.__now+=ms},
  frames(n,ms=16.7){const errs=[];for(let i=0;i<n;i++){sb.__now+=ms;ts+=ms;g.T.draw(ts);if(g.T.DBG.err){errs.push(g.T.DBG.err);g.T.DBG.err=''}}return errs},
  runTimers(){const t=sb.__timers.splice(0);t.forEach(f=>f())},ev:{preventDefault(){},stopPropagation(){}},ts:()=>ts};
 return g}
module.exports={boot,P,ROOT};
