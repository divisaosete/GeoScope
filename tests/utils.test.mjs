import assert from 'node:assert/strict';
import {normalize,available,value,escapeHTML} from '../js/utils.js';
assert.equal(normalize('  JAPÃO  '),'japao');
assert.equal(normalize('África do Sul'),'africa do sul');
assert.equal(available({value:0,year:2023,status:'available'}),true);
for(const r of [null,{value:null,year:2023,status:'unavailable'},{value:NaN,year:2023,status:'available'},{value:-2,year:2023,status:'available'},{value:12,year:null,status:'available'}]){
 assert.equal(available(r),false);
 assert.equal(value(r,'population'),'Dados não disponíveis');
}
assert.equal(value({value:0,year:2023,status:'available'},'gdp'),'US$ 0');
assert.equal(escapeHTML('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');
console.log('PASS: accent/case search normalization; genuine zero; absent/invalid values; HTML escaping.');
