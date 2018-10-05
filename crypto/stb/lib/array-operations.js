module.exports.groupByCnt = (arr, groupSize) => {
	const grouped = arr.reduce((acc, cur, idx) => {
		if (acc[acc.length - 1].length >= groupSize) {
			acc.push([])
		}
		acc[acc.length - 1].push(cur)
		return acc
	}, [[]])
	if (!grouped[0].length) {
		return []
	}
	return grouped
}
