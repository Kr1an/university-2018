const bytes = require('utf8-bytes')
const { extendKey } = require('./lib/keys')
const {
	createEncoderDecoder,
	makeBased128bit,
	undoBased128bit
} = require('./lib/text-operations')
const {
	groupByCnt,
} = require('./lib/array-operations')

const {
	table
} = require('./lib/constants')
const {
	nTransformWord
} = require('./lib/table-operations')

const composeDataInBlocks = (bData) => groupByCnt(bData, 4)
const floatArray = (arr) => arr.reduce((acc, cur) => {
	if (Array.isArray(cur)) {
		return [...acc, ...cur]
	}
	return [...acc, cur]
}, [])

const composeKeysArray = (bKey) => new Array(7).fill(groupByCnt(bKey, 4)).reduce((acc, cur) => [...acc, ...cur], [])

const sum = (bWordA, bWordB) => {
	if (bWordA.length !== bWordB.length) {
		throw new Error('can not sum words with different length')
	}
	const len = bWordA.length
	return new Array(len).fill(null).map((_, idx) => (bWordA[idx] + bWordB[idx]) % 2 ** 8)
}
const sub = (bWordA, bWordB) => {
	if (bWordA.length !== bWordB.length) {
		throw new Error('can not sub words with different length')
	}
	const len = bWordA.length
	return new Array(len).fill(null).map((_, idx) => {
		const m = (bWordA[idx] - bWordB[idx]) % 2 ** 8
		if (m < 0) {
			return 2 ** 8 - m
		}
		return m
	})
}

const or = (bWordA, bWordB) => {
	if (bWordA.length !== bWordB.length) {
		throw new Error('can not or words with different length')
	}
	const len = bWordA.length
	return new Array(len).fill(null).map((_, idx) => bWordA[idx] ^ bWordB[idx])
}

const encryptWord = (word, key) => {
	const encoder = createEncoderDecoder()
	const bKeysArray = composeKeysArray(
		extendKey(
			encoder.encode(
				key
			)
		)
	)
	for (let i = 0; i < 8; i++) {
		// word[1] = or(word[1], nTransformWord(bKeysArray[7 * i]))
		// word[2] = or(word[2], bKeysArray[7 * i])
		// word[1] = or(word[1], nTransformWord(sum(word[0], bKeysArray[7 * i]), 5))
		// word[2] = or(word[2], nTransformWord(sum(word[3], bKeysArray[7 * i + 1]), 21))
		// word[0] = sub(word[0], nTransformWord(sum(word[1], bKeysArray[7 * i + 2]), 13))
		// const e = or(nTransformWord(sum(sum(word[1], word[2]), bKeysArray[7 * i + 3]), 21), [0, 0, 0, i + 1])
		// word[1] = sum(word[1], e)
		// word[2] = sub(word[2], e)
		// word[3] = sum(word[3], nTransformWord(sum(word[2], bKeysArray[7 * i + 4]), 13))
		// word[1] = or(word[1], nTransformWord(sum(word[0], bKeysArray[7 * i + 5]), 21))
		word[2] = or(word[2], nTransformWord(word[2], 5))

		word = [
			word[1],
			word[3],
			word[0],
			word[2],
		]
	}
	return [
		word[1],
		word[3],
		word[0],
		word[2]
	]
}
const encrypt = (data, key) => {
	const encoder = createEncoderDecoder()

	const bData = groupByCnt(composeDataInBlocks(
		makeBased128bit(
			encoder.encode(
				data
			)
		)
	), 4)
	const result = bData.map((word) => encryptWord(word, key))
	const floated = floatArray(floatArray(result))

	return encoder.decode(floated)
}
const decrypt = (data, key) => {
	const encoder = createEncoderDecoder()

	const bData = groupByCnt(composeDataInBlocks(
		makeBased128bit(
			encoder.encode(
				data
			)
		)
	), 4)
	const result = bData.map((word) => decryptWord(word, key))
	console.log(result)
	const floated = floatArray(floatArray(result))
	return encoder.decode(floated)
}
const decryptWord = (word, key) => {
	const encoder = createEncoderDecoder()
	const bKeysArray = composeKeysArray(
		extendKey(
			encoder.encode(
				key
			)
		)
	)
	for (let i = 7; i >= 0; i--) {
		// word[1] = or(word[1], nTransformWord(bKeysArray[7 * i]))
		// word[2] = or(word[2], bKeysArray[7 * i])
		// word[1] = or(word[1], nTransformWord(sum(word[0], bKeysArray[7 * i - 1]), 5))
		// word[1] = or(word[1], bKeysArray[7 * i])
		// word[1] = or(word[1], bKeysArray[7 * (i + 1) - 1])
		// word[1] = or(word[1], nTransformWord(sum(word[0], bKeysArray[7 * (i + 1) - 1]), 5))
		// word[2] = or(word[2], nTransformWord(sum(word[3], bKeysArray[7 * (i + 1) - 2]), 21))
		// word[0] = sub(word[0], nTransformWord(sum(word[1], bKeysArray[7 * (i + 1) - 3]), 13))
		// const e = or(nTransformWord(sum(sum(word[1], word[2]), bKeysArray[7 * (i + 1) - 4]), 21), [0, 0, 0, i + 1])
		// word[1] = sum(word[1], e)
		// word[2] = sub(word[2], e)
		// word[3] = sum(word[3], nTransformWord(sum(word[2], bKeysArray[7 * (i + 1) - 5]), 13))
		// word[1] = or(word[1], nTransformWord(sum(word[0], bKeysArray[7 * (i + 1) - 6]), 21))
		// word[2] = or(word[2], nTransformWord(sum(word[3], bKeysArray[7 * (i + 1) - 7]), 5))
		word[3] = or(word[3], nTransformWord(word[3], 5))
		word = [
			word[2],
			word[0],
			word[3],
			word[1]
		]
	}
	return [
		word[2],
		word[0],
		word[3],
		word[1]
	]
}

const createStb = (key) => {
	return {
		encrypt: (data) => encrypt(data, key),
		decrypt: (data) => decrypt(data, key)
	}
}

function main() {
	const key = "qwerthdgbvndkejr"
	const encrypted = encrypt("not encrypted text", key)
	// console.log(encrypted)
	const decrypted = decrypt(encrypted, key)
	console.log(decrypted)
}
main()
