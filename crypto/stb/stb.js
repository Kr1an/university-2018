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

const composeDataInBlocks = (bData) => groupByCnt(bData, 4)

const composeKeysArray = (bKey) => new Array(7).fill(groupByCnt(bKey, 4)).reduce((acc, cur) => [...acc, ...cur], [])

const encrypt = (data, key) => {
	const tran = createCharToBytes()

	const bKey = tran.encode(key)
	const bData = tran.encode(data)
	
	const extKey = extendKey(bKey)
	const extData = extendData(bData)
	
	validate
}
const decrypt = (data, key) => {

}

const createStb = (key) => {
	return {
		encrypt: (data) => encrypt(data, key),
		decrypt: (data) => decrypt(data, key)
	}
}

function main() {
	const charToBytes = createEncoderDecoder()
	
	const arr = charToBytes.encode('hello world 1234')
	console.log(arr)
	console.log(extendKey(arr))
	
	const data = "1"
	const dData = charToBytes.encode(data)

	const based128 = makeBased128bit(dData)
	console.log(JSON.stringify(based128))
	const undone128 = undoBased128bit(based128)
	console.log(JSON.stringify(undone128))
	
	const inBlocks = composeDataInBlocks(based128)
	console.log(JSON.stringify(inBlocks))
	console.log(composeKeysArray(extendKey(arr)))
}
main()
