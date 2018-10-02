const { DES, enc } = require('crypto-js');
const fs = require('fs');

const encrypt = (data, key1, key2) => {
	const encryptedOnce = DES.encrypt(data, key1).toString();
	const encryptedTwice = DES.encrypt(encryptedOnce, key2).toString();
	const encryptedThird = DES.encrypt(encryptedTwice, key1).toString();

	return encryptedThird
}

const decrypt = (data, key1, key2) => {
	const decryptedOnce = DES.decrypt(data, key1).toString(enc.Utf8);
	const decryptedTwice = DES.decrypt(decryptedOnce, key2).toString(enc.Utf8);
	const decryptedThird = DES.decrypt(decryptedTwice, key1).toString(enc.Utf8);

	return decryptedThird
}

const createTDes = (key1, key2) => {
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

	console.log('triple des')

	console.log('keys:', [key1, key2])
	console.log('data:', data)

	const ddes = createTDes(key1, key2)

	const encrypted = ddes.encrypt(data)
	const decrypted = ddes.decrypt(encrypted)

	console.log('encrypted:', encrypted)
	console.log('decrypted:', decrypted)

	fs.writeFileSync('encrypted.txt', encrypted)
	fs.writeFileSync('decrypted.txt', decrypted)
}
main()

module.exports = createTDes
