$(function() {
	start({count: 20});
})

var defaults = {
	count: 10,
	radius: 10,
	spines: 10,
	spineSize: 5,
	velocity: 10
};

function start(options) {
	var opts = $.extend({}, defaults, options);
	var width = window.innerWidth - 4;
	var height = window.innerHeight - 4;
	var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
	var colors = d3.scale.category10();
	var shapes = d3.range(opts.count).map(function(d) {
		var radius = opts.radius;
		var spineSize = opts.spineSize;
		return {
			radius: radius,
			spines: opts.spines,
			spineSize: spineSize,
			color: colors(d),
			x: Math.random() * (width - 2 * (radius + spineSize)) + radius + spineSize,
			y: Math.random() * (height - 2 * (radius + spineSize)) + radius + spineSize,
			v: opts.velocity,
			angle: 2 * Math.PI * Math.random()
		}
	});
	var svgShapes = svg.selectAll('.shape').data(shapes).enter()
		.append('g').attr('class', 'shape')
		.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
		.style('stroke', function(d) { return d.color; });
	svgShapes.append('circle')
		.attr('r', function(d) { return d.radius; })
		.style('fill', 'none');
	svgShapes[0].forEach(function(d) {
		var data = d3.select(d).data()[0];
		d3.range(data.spines).forEach(function(s) {
			var angle = 2 * Math.PI * s / data.spines;
			d3.select(d).append('line')
				.attr('x1', Math.cos(angle) * data.radius)
				.attr('x2', Math.cos(angle) * (data.radius + data.spineSize))
				.attr('y1', Math.sin(angle) * data.radius)
				.attr('y2', Math.sin(angle) * (data.radius + data.spineSize));
		});
	})
}