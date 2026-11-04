/* Párhuzamos futtatás: node tests/par.js [N]  – a tesztcsoportokat N folyamatra osztja, az eredményt összegzi. */
'use strict';
const {spawn}=require('child_process'),os=require('os');
const N=Math.max(1,+process.argv[2]||Math.min(4,os.cpus().length||2));let done=0,pass=0,fail=0,out='';const t0=Date.now();
for(let i=0;i<N;i++){const p=spawn(process.execPath,[__dirname+'/run.js'],{env:Object.assign({},process.env,{SHARD:i+'/'+N})});let b='';
 p.stdout.on('data',d=>b+=d);p.stderr.on('data',d=>b+=d);
 p.on('close',()=>{const m=b.match(/Összesen: (\d+) sikeres, (\d+) sikertelen/);if(m){pass+=+m[1];fail+=+m[2]}else{fail++}out+=b.split('\n').filter(l=>/✗/.test(l)).join('\n')+(m?'':'\n[shard '+i+' nem fejeződött be]\n');
  if(++done===N){if(out.trim())console.log(out.trim());console.log(`Összesen: ${pass} sikeres, ${fail} sikertelen (${N} folyamat, ${Math.round((Date.now()-t0)/1e3)} mp)`);process.exit(fail?1:0)}})}
