

const undoBasedNbit = (n) => (bData) => {	
	const firstNonZero = [...bData]
		.reverse()	
		.findIndex(x => x)	

	return [...bData]
		.reverse()
		.slice(firstNonZero)
		.reverse()
}

const makeBasedNbit = (n) => (data) => {	
	const based = n / 8
	const bytesToAdd = data.length % based 
	return [
		...data,
		...new Array((based - bytesToAdd) % based).fill(0)
	]
}

module.exports = {
	makeBased128bit: makeBasedNbit(128),
	undoBased128bit: undoBasedNbit(128)
}

module.exports.createEncoderDecoder = () => ({
        encode: (data) => Buffer(data).toJSON().data,
        decode: (data) => Buffer(data).toString()
})
