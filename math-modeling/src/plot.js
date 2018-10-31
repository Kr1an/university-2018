const createPlotly = require('plotly')

const plotly = createPlotly(
    process.env.PLOTLY_USERNAME,
    process.env.PLOTLY_API_TOKEN,
)

module.exports.makeHistogram = (name, x, annotations = []) => {
	const filename = 'histogram'
	const markersForAnnotations = {
		x: annotations.map(({ x }) => x),
		y: annotations.map(({ y }) => y),
		mode: "markers",
		type: "scatter",
		text: annotations.map(({ text }) => text)
	};
	const data = [{ x, type: 'histogram', name }, markersForAnnotations]
	const options = {
		title: filename,
		fileopt: 'overwrite',
		filename: filename,
		layout: {
			showlegend: false,
			annotations: annotations.map(({ x, y, text, top }) => ({
				x,
				y,
				xref: "x",
				yref: "y",
				text,
				showarrow: true,
				arrowhead: 7,
				ax: -20,
				ay: -40,
				font: {
					family: "Courier New, monospace",
					size: 12,
					color: "#ffffff"
				},
				align: "center",
				arrowhead: 0,
				arrowsize: 0,
				arrowwidth: 0,
				arrowcolor: "#ff7f0e",
				ax: 20,
				ay: 30 * (!!top ? -1 : 1),
				bordercolor: "#ff7f0e",
				borderwidth: 2,
				borderpad: 4,
				bgcolor: "#ff7f0e",
			}))
		}
	}
	return new Promise((res, rej) => {
		plotly.plot(data, options, (err, msg) => {
			if (err) return rej(err);
			res(msg);
		});
	})
}
