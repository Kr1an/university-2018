#!/bin/node
const crypto = require('crypto');
const fs = require('fs');
const nthDes = require('./lib/nth-des');



(function main() {
	const keys = new Array(2).fill(null).map(x => crypto.randomBytes(32).toString('hex'))
	console.log('### KEYS generated:');
	console.log(...keys);
	const fileContent = fs.readFileSync('input.txt').toString();
	console.log('### FILE content(input.txt):');
	console.log(fileContent);
	const encrypted = nthDes.encrypt(fileContent, keys);
	fs.writeFileSync('encrypted.txt', encrypted);
	console.log('### ENCRYPTED content. Written to file(encrypted.txt)');
	console.log(encrypted);
	const decrypted = nthDes.decrypt(encrypted, keys);
	fs.writeFileSync('decrypted.txt', decrypted);
	console.log('### DECRYPTED content. Written to file(decrypted.txt)');
	console.log(decrypted);
})()
