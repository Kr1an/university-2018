const {
    table
} = require('./constants')

const transformByte = (byte) => table[byte >> 4][byte & 0xF]
const transformWord = (bWord) => bWord.map(transformByte)
module.exports.nTransformWord = (bWord, n) => new Array(n).fill(null).reduce((acc) => transformWord(acc), bWord)