
// /**
//  * Generate 6 digit random seed
//  */
// const generateSeed = () => Math.floor(10**5*(1+Math.random()*9))+''

// /**
//  * Generate random value by raising passed value to power 2 and extracting
//  * central 6 digits
//  * @param {number} n 
//  */
// const middleSquareStep = n => {
//     const result = ((+n)**2)+''
//     const withCorrectLength = new Array(12 - result.length).fill('0').join('') + result
//     return withCorrectLength.slice(3, 9)
// }


// const extractNumber = () {
//     if index == 0 {
//         generate_numbers()
//     }
//     int y := MT[index]
//     y := y xor (right shift by 11 bits(y))
//     y := y xor (left shift by 7 bits(y) and (2636928640))
//     y := y xor (left shift by 15 bits(y) and (4022730752))
//     y := y xor (right shift by 18 bits(y))
//     index := (index + 1) mod 624      return y
// }

// function generate_numbers() {
//     for (size_t i = 0; i < 624; ++i) {
//         y = numbers[i];
//         y ^= y >> 11;
//         y ^= y << 7  & 0x9d2c5680;
//         y ^= y << 15 & 0xefc60000;
//         y ^= y >> 18;
//         state.MT_TEMPERED[i] = y;
//       }
// }


// function* createRandomGenerator(seed) {
//     const numbers = new Array(624).fill(0)
//     numbers[0] = seed
//     for (let i = 1; i < 624; i++) {
//         numbers[i] = 0x6c078965*(numbers[i-1] ^ numbers[i-1]>>30) + i;
//     }

// }

// const SIZE = 624
class Rand {
    constructor(seed, precision = 6) {
        this.index = 0
        this.precision = precision
        this.state = new Array(624)
            .fill(0)
            .reduce((acc, cur, idx) => {
                if (idx === 0) {
                    return [...acc, seed]
                }
                const prev = acc[idx - 1]
                return [
                    ...acc,
                    0xFFFFFFFF & (1812433253 * (prev ^ (prev >> 30)) + idx)
                ]
            }, [])
    }
    twist() {
        this.state = this.state.map((i, idx) => {
            const res = 0xFFFFFFFF & ((i & (1 << 31))+(this.state[(idx + 1) % 624] & ((1 << 31) - 1)))
            let resWithShift = res >> 1
            if (res % 2 !== 0) {
                resWithShift = resWithShift ^ 0x9908b0df
            }
            return this.state[(i + 397) % 624] ^ resWithShift
        })
        this.index = 0

    }
    get() {
        if (this.index >= 624) {
            this.twist()
        }
        let r = this.state[this.index]
        r = r ^ (r >> 11)
        r = r ^ ((r << 7) & 0x9D2C5680)
        r = r ^ ((r << 15) & 0xEFC60000)
        r = r ^ (r >> 18)
        this.index += 1
        return Number.parseFloat((0xFFFFFFFF & r) / (2 ** 32)).toPrecision(this.precision) * 2
    }
}

module.exports = Rand
