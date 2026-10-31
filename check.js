'use strict';
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const sources = [
  ['js/base.js', fs.readFileSync('js/base.js', 'utf8')],
  ['sw.js', fs.readFileSync('sw.js', 'utf8')],
];
const re = /<script(?:\s+src="[^"]+")?\s*>([\s\S]*?)<\/script>/g;
let m;
let i = 0;
while ((m = re.exec(html))) sources.push([`index.html#${++i}`, m[1]]);

for (const [name, code] of sources) {
  new vm.Script(code, { filename: name });
}
console.log(`Syntax OK (${sources.length} script blocks)`);
