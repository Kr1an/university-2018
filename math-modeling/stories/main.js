const {
	makeHistogram
} = require('../src/plot')


async function main() {
    const UniformRandom = require('../src/uniform-random')

    const random = new UniformRandom(12345) 
    const total = 1000
    const rands = new Array(total)
        .fill(0)
        .map(() => random.get())
    
    const groupedStep = 0.1
    const grouped = rands.reduce((acc, cur, idx) => {
        const index = Math.ceil(cur / groupedStep) - 1
        acc[index] += 1
        return acc
    }, new Array(1 / groupedStep).fill(0))
    const probabilities = grouped.map(n => n / total)
    const xValues = new Array(Math.round(1 / groupedStep)).fill(0).map((i, idx) => idx * groupedStep)
    console.log(probabilities)
    const practicalMean = probabilities.map((i, idx) => i * idx * groupedStep).reduce((sum, cur) => sum + cur, 0)
    console.log(practicalMean)

    const practicalVariance = probabilities.map((i, idx) => i * ((idx * groupedStep) ** 2)).reduce((sum, cur) => sum + cur, 0) - practicalMean ** 2
    console.log(1/12)
    console.log(practicalVariance)

    // console.log(grouped)

    const top = true

    const result = await makeHistogram(
        'Uniform Distribution Histogram range [0-1]',
        rands,
        [
            { x: 0.5, y: 0, text: 'Teoretical Mean' },
            { x: practicalMean, y: 0, text: 'Practical Mean', top },
            { x: 1 / 12, y: 0, text: 'Theoretical Variance' },
            { x: practicalVariance, y: 0, text: 'Practical Variance', top },
        ]
    )
}

module.exports = main

