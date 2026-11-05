/* DrillUp Core Quest – kompatibilitási kiegészítések régebbi WebView/böngészők alá (Chrome 80+ / Safari 13.1+ a szintaxis miatt).
   Az Array/String .at() csak Chrome 92+/Safari 15.4+ óta van meg – itt pótoljuk. */
(function(){
 function at(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;if(n<0||n>=this.length)return undefined;return this[n]}
 for(const C of[Array,String,Uint8Array,Uint16Array,Uint32Array,Int8Array,Int16Array,Int32Array,Float32Array,Float64Array]){if(C&&!C.prototype.at)Object.defineProperty(C.prototype,'at',{value:at,writable:true,configurable:true})}
 if(!Array.prototype.flat)Object.defineProperty(Array.prototype,'flat',{value:function(d){d=d===undefined?1:d;return d<1?this.slice():this.reduce((a,v)=>a.concat(Array.isArray(v)?v.flat(d-1):v),[])},writable:true,configurable:true});
 if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{value:function(f,t){return this.map(f,t).flat(1)},writable:true,configurable:true});
 if(!Object.fromEntries)Object.fromEntries=function(it){const o={};for(const[k,v]of it)o[k]=v;return o};
 if(!String.prototype.replaceAll)String.prototype.replaceAll=function(a,b){return typeof a==='string'?this.split(a).join(b):this.replace(a,b)};
 if(!window.requestAnimationFrame)window.requestAnimationFrame=function(f){return setTimeout(function(){f(Date.now())},16)};
})();
