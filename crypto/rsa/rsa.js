const encode = (data, pubKey) => {

}
const decode = (data, privKey) => {

}
const createRSA = (pubKey, privKey) => ({
	encode: (data) => encode(data, pubKey),
	decode: (data) => decode(data, privKey),
})
module.exports = createRSA
