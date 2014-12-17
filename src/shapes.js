var defaultPhysics = {
	dx: function(d, r) { return r; },
	dy: function(d, r) { return r; },
	x: function(d, w, h) { return d.x; },
	y: function(d, w, h) { return d.y; },
	rx: function(d, w, h) { return (Math.PI - d.angle) % (2 * Math.PI); },
	ry: function(d, w, h) { return 2 * Math.PI - d.angle; },
	xx: function(d, v, r) { return v / 10 * Math.cos(d.angle); },
	yy: function(d, v, r) { return v / 10 * Math.sin(d.angle); }
}, ghostPhysics = {
	dx: function(d, r) { return 0; },
	dy: function(d, r) { return 0; },
	x: function(d, w, h) { return (d.x + w) % w; },
	y: function(d, w, h) { return (d.y + h) % h; },
	rx: function(d, w, h) { return d.angle; },
	ry: function(d, w, h) { return d.angle; },
	xx: function(d, v, r) { return v * Math.cos(d.angle); },
	yy: function(d, v, r) { return v * Math.sin(d.angle); }
};

$(function() {
	start({
		count: 100,
		momentum: 20
	});
})

var defaults = {
	count: 10,
	radius: 10,
	spines: 10,
	spineSize: 5,
	velocity: 1,
	rotation: 10
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
			velocity: opts.velocity,
			angle: 2 * Math.PI * Math.random(),
			rotation: opts.rotation,
			rotated: 0
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
	});
	
	var start;
	
	function step(timestamp) {
		if (!start) {
			start = timestamp;
		}
		var progress = timestamp - start;
		
		refresh(progress);
		
		start = timestamp;
		requestAnimationFrame(step)
	}
	
	function refresh(progress) {
		shapes.forEach(function(d) {
			var r = d.radius + d.spineSize;
			var v = d.velocity;
			var physics = defaultPhysics;
			if ((d.y >= innerHeight - physics.dy(d, r) && Math.sin(d.angle) > 0) || (d.y <= physics.dy(d, r) && Math.sin(d.angle) < 0)) {
				d.y = physics.y(d, innerWidth, innerHeight);
				d.angle = physics.ry(d, innerWidth, innerHeight);
			}
			if ((d.x >= innerWidth - physics.dx(d, r) && Math.cos(d.angle) > 0) || (d.x <= physics.dx(d, r) && Math.cos(d.angle) < 0)) {
				d.x = physics.x(d, innerWidth, innerHeight);
				d.angle = physics.rx(d, innerWidth, innerHeight);
			}
			d.x += physics.xx(d, v, r) * progress;
			d.y += physics.yy(d, v, r) * progress;
			d.rotated += d.rotation * progress / 100;
		});
		svgShapes.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')rotate(' + d.rotated + ')'; });
	}
	
	requestAnimationFrame(step);
}