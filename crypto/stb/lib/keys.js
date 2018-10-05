module.exports.extendKey = (bKey) => {
	if (bKey.length === 32) {
		return bKey
	}
	if (bKey.length === 16) {
		return [
			...bKey,
			...bKey.slice(0, 4),
			...bKey.slice(4, 8),
			...bKey.slice(8, 12),
			...bKey.slice(12, 16)
		]
	}
	if (bKey.length === 24) {
		return [
			...bKey,
			...new Array(4).fill(null).map((_, i) => bKey[0 + i] | bKey[4 + i] | bKey[8 + i]),
			...new Array(4).fill(null).map((_, i) => bKey[12 + i] | bkey[16 + i] | bKey[20 + i])
		]
	}
	throw new Error('key is not valid. Should be 256, 192 or 128 bit long. Provided key is ' + bKey.length * 8 + ' bits')
}

