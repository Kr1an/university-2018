#!/bin/node
const { DES, enc } = require('crypto-js');
const fs = require('fs');

const encrypt = (data, key1, key2) => {
	const encryptedOnce = DES.encrypt(data, key1).toString();
	const encryptedTwice = DES.encrypt(encryptedOnce, key2).toString();
	
	return encryptedTwice
}

const decrypt = (data, key1, key2) => {
	const decryptedOnce = DES.decrypt(data, key2).toString(enc.Utf8);
	const decryptedTwice = DES.decrypt(decryptedOnce, key1).toString(enc.Utf8);

	return decryptedTwice
}

const createDDos = (key1, key2) => {
	return {
		encrypt: data => encrypt(data, key1, key2),
		decrypt: data => decrypt(data, key1, key2)
	}

}

const tryReadFromFile = (filePath, otherwhiseValue) => {
	if (!fs.existsSync(filePath)) {
		return otherwhiseValue
	}
	return fs.readFileSync(filePath).toString()
}

function main() {
	const key1 = tryReadFromFile('key1.txt') || 'Secret Key 1'
	const key2 = tryReadFromFile('key2.txt') || 'Secret Key 2'
	const data = tryReadFromFile('input.txt') || 'Not Encrypted Message'

	console.log('double des')

	console.log('keys:', [key1, key2])
	console.log('data:', data)

	const ddos = createDDos(key1, key2)

	const encrypted = ddos.encrypt(data)
	const decrypted = ddos.decrypt(encrypted)

	console.log('encrypted:', encrypted)
	console.log('decrypted:', decrypted)

	fs.writeFileSync('encrypted.txt', encrypted)
	fs.writeFileSync('decrypted.txt', decrypted)
}
main()

module.exports = createDDos
