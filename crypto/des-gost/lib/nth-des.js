const { DES, enc } = require('crypto-js');

function encrypt(data, keys) {
	const reducer = (acc, cur) => DES.encrypt(acc, cur).toString();
	const encryptedData = keys.reduce(reducer, data);
	return encryptedData;
}

function decrypt(data, keys) {
	const reducer = (acc, cur) => DES.decrypt(acc, cur).toString(enc.Utf8);
	const decryptedData = keys
		.reverse()
		.reduce(reducer, data);
	return decryptedData;
}

module.exports = {
	encrypt,
	decrypt,
};
