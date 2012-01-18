$(function() {
	var canvas = $("#c");
	var canvasHeight;
	var canvasWidth;
	var ctx;
	var dt = 0.1;
	
	var pointCollection;
	
	function init() {
		updateCanvasDimensions();
		
		var g = [
		//F
		new Point(20, 5, 0.0, 9, "#507bf2"),
				
		new Point(38,5 , 0.0, 7, "#507bf2"),
		new Point(58,5, 0.0, 8, "#507bf2"),
		new Point(78, 5, 0.0, 7, "#507bf2"),
		new Point(98,5 , 0.0, 5, "#507bf2"),
		
		new Point(20, 25, 0.0, 7, "#507bf2"), 
		new Point(20, 45, 0.0, 8, "#507bf2"), 
		new Point(20, 63, 0.0, 6, "#507bf2"),
		
		new Point(35, 63, 0.0, 5, "#507bf2"),
		new Point(50, 63, 0.0, 6, "#507bf2"),
		new Point(65, 63, 0.0, 5, "#507bf2"),
		new Point(78, 63, 0.0, 6, "#507bf2"),
				
		new Point(20, 80, 0.0, 7, "#507bf2"), 
		new Point(20, 100, 0.0, 7, "#507bf2"),
		new Point(20, 120, 0.0, 8, "#507bf2"),
		
		//O
		new Point(140, 60, 0.0, 7, "#507bf2"),
		new Point(120, 70, 0.0, 6, "#507bf2"),
		new Point(160, 70, 0.0, 7, "#507bf2"),
		new Point(110, 88, 0.0, 6, "#507bf2"),
		new Point(170, 85, 0.0, 7, "#507bf2"),
		new Point(116, 108, 0.0, 6, "#507bf2"),
		new Point(165, 105, 0.0, 7, "#507bf2"),
		new Point(128, 120, 0.0, 6, "#507bf2"),
		new Point(150, 120, 0.0, 7, "#507bf2"),

		
		//R
		new Point(200, 60, 0.0, 6, "#507bf2"),
		new Point(200, 80, 0.0, 7, "#507bf2"),
		
		new Point(215, 70, 0.0, 5, "#507bf2"),
		new Point(228, 65, 0.0, 6, "#507bf2"),
		new Point(242, 68, 0.0, 4, "#507bf2"),
		new Point(250, 75, 0.0, 5, "#507bf2"),
		
		new Point(200, 100, 0.0, 6, "#507bf2"),
		new Point(200, 120, 0.0, 6, "#507bf2"),
		


		//t
		new Point(300, 5, 0.0, 8, "#507bf2"),
		
		new Point(300, 25, 0.0, 7, "#507bf2"), 
		new Point(300, 45, 0.0, 6, "#507bf2"), 
		new Point(300, 63, 0.0, 6, "#507bf2"),
		
		//new Point(270, 63, 0.0, 5, "#507bf2"),
		new Point(284, 63, 0.0, 7, "#507bf2"),
		new Point(315, 63, 0.0, 6, "#507bf2"),
		new Point(330, 63, 0.0, 5, "#507bf2"),

				
		new Point(300, 80, 0.0, 7, "#507bf2"), 
		new Point(300, 100, 0.0, 7, "#507bf2"),
		new Point(305, 115, 0.0, 6, "#507bf2"),
		new Point(315, 125, 0.0, 6, "#507bf2"),
		new Point(330, 115, 0.0, 6, "#507bf2"),
		
		
		//new Point(400, 100, 0.0, 7, "#eb676f"),
		
		//new Point(400, 50, 0.0, 9, "#507bf2"),
		 ];
		
		gLength = g.length;
		for (var i = 0; i < gLength; i++) {
			g[i].curPos.x = (canvasWidth/2 - 180) + g[i].curPos.x;
			g[i].curPos.y = (canvasHeight/2 - 65) + g[i].curPos.y;
			
			g[i].originalPos.x = (canvasWidth/2 - 180) + g[i].originalPos.x;
			g[i].originalPos.y = (canvasHeight/2 - 65) + g[i].originalPos.y;
		};
		
		pointCollection = new PointCollection();
		pointCollection.points = g;
		
		initEventListeners();
		timeout();
	};
	
	function initEventListeners() {
		$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);
		
		canvas.get(0).ontouchmove = function(e) {
			e.preventDefault();
			onTouchMove(e);
		};
		
		canvas.get(0).ontouchstart = function(e) {
			e.preventDefault();
		};
	};
	
	function updateCanvasDimensions() {
		canvas.attr({height: $(window).height(), width: $(window).width()});
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();

		draw();
	};
	
	function onMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.pageX, e.pageY);
	};
	
	function onTouchMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
	};
	
	function timeout() {
		draw();
		update();
		
		setTimeout(function() { timeout() }, 30);
	};
	
	function draw() {
		var tmpCanvas = canvas.get(0);

		if (tmpCanvas.getContext == null) {
			return; 
		};
		
		ctx = tmpCanvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		if (pointCollection)
			pointCollection.draw();
	};
	
	function update() {		
		if (pointCollection)
			pointCollection.update();
	};
	
	function Vector(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
 
		this.addX = function(x) {
			this.x += x;
		};
		
		this.addY = function(y) {
			this.y += y;
		};
		
		this.addZ = function(z) {
			this.z += z;
		};
 
		this.set = function(x, y, z) {
			this.x = x; 
			this.y = y;
			this.z = z;
		};
	};
	
	function PointCollection() {
		this.mousePos = new Vector(0, 0);
		this.points = new Array();
		
		this.newPoint = function(x, y, z) {
			var point = new Point(x, y, z);
			this.points.push(point);
			return point;
		};
		
		this.update = function() {		
			var pointsLength = this.points.length;
			
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;
				
				var dx = this.mousePos.x - point.curPos.x;
				var dy = this.mousePos.y - point.curPos.y;
				var dd = (dx * dx) + (dy * dy);
				var d = Math.sqrt(dd);
				
				if (d < 150) {
					point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
					point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
				} else {
					point.targetPos.x = point.originalPos.x;
					point.targetPos.y = point.originalPos.y;
				};
				
				point.update();
			};
		};
		
		this.draw = function() {
			var pointsLength = this.points.length;
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;

				point.draw();
			};
		};
	};
	
	function Point(x, y, z, size, colour) {
		this.colour = colour;
		this.curPos = new Vector(x, y, z);
		this.friction = 0.8;
		this.originalPos = new Vector(x, y, z);
		this.radius = size;
		this.size = size;
		this.springStrength = 0.1;
		this.targetPos = new Vector(x, y, z);
		this.velocity = new Vector(0.0, 0.0, 0.0);
		
		this.update = function() {
			var dx = this.targetPos.x - this.curPos.x;
			var ax = dx * this.springStrength;
			this.velocity.x += ax;
			this.velocity.x *= this.friction;
			this.curPos.x += this.velocity.x;
			
			var dy = this.targetPos.y - this.curPos.y;
			var ay = dy * this.springStrength;
			this.velocity.y += ay;
			this.velocity.y *= this.friction;
			this.curPos.y += this.velocity.y;
			
			var dox = this.originalPos.x - this.curPos.x;
			var doy = this.originalPos.y - this.curPos.y;
			var dd = (dox * dox) + (doy * doy);
			var d = Math.sqrt(dd);
			
			this.targetPos.z = d/100 + 1;
			var dz = this.targetPos.z - this.curPos.z;
			var az = dz * this.springStrength;
			this.velocity.z += az;
			this.velocity.z *= this.friction;
			this.curPos.z += this.velocity.z;
			
			this.radius = this.size*this.curPos.z;
			if (this.radius < 1) this.radius = 1;
		};
		
		this.draw = function() {
			ctx.fillStyle = this.colour;
			ctx.beginPath();
			ctx.arc(this.curPos.x, this.curPos.y, this.radius, 0, Math.PI*2, true);
			ctx.fill();
		};
	};
	
	init();
});