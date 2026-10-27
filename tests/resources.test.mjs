import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateResources,RESOURCE_KEYS,resourceObservation,resourceValue,resourceReference} from '../js/resources.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/resources.json',import.meta.url)));
const countries=JSON.parse(fs.readFileSync(new URL('../data/countries.json',import.meta.url)));
assert.equal(validateResources(data,countries),data);
assert.equal(RESOURCE_KEYS.length,5);
assert.equal(resourceValue(resourceObservation(data,'rare-earths','CAN')),'0');
assert.equal(resourceValue({value:0.00000321,year:2024,status:'available'}),'0,00000321');
assert.equal(resourceValue(resourceObservation(data,'lithium','USA')),'Dados não disponíveis');
assert.equal(resourceValue(resourceObservation(data,'uranium','BRA')),'Dados não disponíveis');
assert.equal(resourceObservation(data,'lithium','ARG').value,13800); // Superscript 5 must not become 513800.
assert.equal(resourceObservation(data,'rare-earths','USA').value,45500); // Superscript 11 excluded.
assert.equal(resourceObservation(data,'uranium','UZB').estimated,true);
assert.match(resourceReference(data,'uranium',resourceObservation(data,'uranium','UZB')),/Estimativa da fonte/);
assert.match(resourceReference(data,'gas',resourceObservation(data,'gas','USA')),/Pode incluir estimativas da EIA/);
const invalid=structuredClone(data);invalid.indicators.lithium.observations.BRA.value=-1;
assert.throws(()=>validateResources(invalid,countries),/Valor inválido/);
const wrongUnits=structuredClone(data);wrongUnits.indicators.uranium.observations.KAZ.unit='t de U3O8';
assert.throws(()=>validateResources(wrongUnits,countries),/referência inválida/);
console.log('PASS: five resource schemas; real zero vs missing/confidential; footnotes; estimate flags; unit mismatch and invalid-value rejection.');
