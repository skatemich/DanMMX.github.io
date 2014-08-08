(function (window) {
	window.Triangles = (function () {
		var distance = function ( a, b ){
				var xs = 0;
				var ys = 0;

				xs = b.getX() - a.getX();
				xs = xs * xs;

				ys = b.getY() - a.getY();
				ys = ys * ys;

				return Math.sqrt( xs + ys );
			},
			Point = function (x, y) {
				var pointObj = {
					x: x,
					y: y
				};
				return {
					getX: function () {
						return pointObj.x;
					},
					getY: function () {
						return pointObj.y;
					},
					setX: function ( x ) {
						pointObj.x = x;
						return this;
					},
					setY: function ( y ) {
						pointObj.y = y;
						return this;
					},
					setObj: function ( point ) {
						pointObj.x = point.x;
						pointObj.y = point.y;
						return this;
					}
				};
			},
			Rectangle = function ( width, height, color ){
				return {
					draw: function (ctx) {
						ctx.fillStyle = color;
						ctx.fillRect(0, 0, width, height);
					}
				};
			},
			Triangle = function ( initialPoint, width, gradient, colorDark, colorLight ){
				var color = gradient.randomGray(initialPoint.getX(), initialPoint.getY()),
					getPoints, types = [],
					type, points, colored;

				(this.getPoints = function () {
					points = [];

					switch( type ){
						case 1:
							points.push(initialPoint);
							points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
							points.push( new Point( initialPoint.getX(), initialPoint.getY() + width ));
						break;
						case 2:
							points.push( new Point(initialPoint.getX(), initialPoint.getY() + width));
							points.push( new Point( points[0].getX() + width, points[0].getY() - width ));
							points.push( new Point( points[0].getX() + width, points[0].getY()));
						break;
						case 3:
							points.push(initialPoint);
							points.push( new Point( initialPoint.getX() + width, initialPoint.getY() + width ));
							points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
						break;
						default:
							points.push(initialPoint);
							points.push( new Point( initialPoint.getX(), initialPoint.getY() + width ));
							points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
						break;
					}
				}).call();

				this.draw = function (ctx) {
					ctx.fillStyle = color;
					if ( color.toString().indexOf("NaN") >= 0){
						return;
					}
					ctx.beginPath();
					ctx.moveTo(points[0].getX(), points[0].getY());
					ctx.lineTo(points[1].getX(), points[1].getY());
					ctx.lineTo(points[2].getX(), points[2].getY());
					ctx.lineTo(points[0].getX(), points[0].getY());
					ctx.closePath();
					ctx.fill();
					return this;
				};

				this.redraw = function (ctx) {
					type = Math.floor( Math.random() * 4 );
					this.getPoints();
					if ( colored  ) {
						switch(type){							
							case 1:
								points.push(initialPoint);
								points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
								points.push( new Point( initialPoint.getX(), initialPoint.getY() + width ));
							break;
							case 2:
								points.push( new Point(initialPoint.getX(), initialPoint.getY() + width));
								points.push( new Point( points[0].getX() + width, points[0].getY() - width ));
								points.push( new Point( points[0].getX() + width, points[0].getY()));
							break;
							case 3:
								points.push(initialPoint);
								points.push( new Point( initialPoint.getX() + width, initialPoint.getY() + width ));
								points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
							break;
							default:
								points.push(initialPoint);
								points.push( new Point( initialPoint.getX(), initialPoint.getY() + width ));
								points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
							break;
						}
						color = ctx.createLinearGradient(initialPoint.getX(), initialPoint.getY(), initialPoint.getX() + width, initialPoint.getY() + width);
						color.addColorStop(0, colorDark);
						color.addColorStop(1, colorLight);
					} else {
						color = gradient.randomGray(initialPoint.getX(), initialPoint.getY());
					}
					return this.draw(ctx);
				};

				this.init = function (ctx) {
					types = [ 1, 2, 3, 4];
					while ( types.length > 1 ){
						type = types.splice( Math.floor(Math.random() * types.length ), 1)[0];
						color = gradient.randomGray(initialPoint.getX(), initialPoint.getY());
						this.getPoints();
						this.draw(ctx);
					}

					color = gradient.randomGray(initialPoint.getX(), initialPoint.getY());
					type = types.pop();
					this.getPoints();

					this.draw(ctx);

					return this;
				};

				this.colorRedraw = function () {
					colored = true;
					return this;
				};

				this.grayRedraw = function (ctx) {
					colored = false;
					
					this.init(ctx);

					return this.init(ctx);
				};

				return this;
			},
			Gradient = function ( initial, end, width, height, jumps ) {
				var widthInTriangles = Math.ceil( width / jumps ),
					heightInTriangles = Math.ceil( height / jumps ),
					radial = Math.round( Math.sqrt( widthInTriangles * widthInTriangles + heightInTriangles * heightInTriangles)),
					colors = [], center,
					cache = {}, i;
				center = new Point(widthInTriangles / 2, heightInTriangles / 2 - 1.5);

				// If there are more colors than triangles
				if ( radial / 2 + 1 < end - initial ) {
					while ( radial / 2 + 1 < end - initial ) {
						end --;
						if ( radial / 2 + 1 < end - initial ) {
							initial ++;
						}
					}

					for ( i = initial; i < end; i++ ){
						colors.push(i);
					}
				// there are more triangles than colors
				} else {
					for ( i = initial; i < end; i++ ){
						colors.push(i);
					}

					while ( colors.length < Math.ceil( radial / 2 )) {
						colors.push(colors[Math.floor(Math.random() * 8)]);
					}
				}
				colors.sort(function (a, b) { return a - b; } ).reverse();
				return {
					randomGray: function (x, y) {
						var spaceX = x / jumps,
							spaceY = y / jumps,
							distFromCenter = cache[x] && cache[x][y] || Math.floor( distance(center, new Point(spaceX, spaceY))),
							color = colors[distFromCenter] || colors[colors.length + 1],
							random = 0;

						if (!cache[x]) {
							cache[x] = {};
						}

						if (!cache[x][y]) {
							cache[x][y] = distFromCenter;
						}

						if (distFromCenter > colors.length * 0.7) {
							random = Math.ceil( Math.random() * 2 ) * (Math.random() < 0.5 ? -1 : 1) * 1;
						} else if (distFromCenter > colors.length * 0.6) {
							random = Math.ceil( Math.random() * 2 ) * (Math.random() < 0.5 ? -1 : 1) * 2;
						} else if (distFromCenter > colors.length * 0.4) {
							random = Math.ceil( Math.random() * 2 ) * (Math.random() < 0.5 ? -1 : 1) * 3;
						} else if (distFromCenter > colors.length * 0.2) {
							random = Math.ceil( Math.random() * 2 ) * (Math.random() < 0.5 ? -1 : 1) * 2;
						} else {
							random = Math.ceil( Math.random() * 2 ) * (Math.random() < 0.5 ? -1 : 1) * 1;
						}

						color += random;

						return 'rgb(' + [color, color, color].join(',') + ')';
					},
					setCenter: function ( x, y ) {
						center = new Point( x / jumps, y / jumps );
						cache = {};
					}
				};
			};

		return function (id) {
			var canvas = document.getElementById(id),
				container = canvas.parentNode,
				dark = 20, light = 45,
				colorDark = 'rgba(255, 122, 5, 0.3)',
				colorLight = 'rgba(246, 90, 90, 0.3)',
				mouseCount = 0, size = 25,
				prevMousePos, triangles,
				mousePos, gray, ctx,
				w, h, i, j, k, l,
				gradient, colorGradient,
				resize, paint, interval;

			paint = function () {
				triangles = {};

				if 	(interval) {
					clearInterval(interval);
				}
				gradient = new Gradient(dark, light, w, h, size);

				ctx = canvas.getContext('2d');
				window.ctx = ctx;
				new Rectangle( w, h, 'rgb(' + [light, light, light].join(',') + ')').draw(ctx);

				for ( i = 0; i < w / size + size; i ++ ) {
					triangles[i] = {};
					for ( j = 0; j < h / size + size; j ++ ) {
						triangles[i][j] = new Triangle( new Point(i * size, j * size), size, gradient, colorDark, colorLight ).init(ctx);
					}
				}

				interval = setInterval(function () {
					for ( i = 0; i < w * 0.2 / size; i++) {
						for ( j = 0; j < h * 0.2 / size; j++) {
							triangles[Math.floor(Math.random() * w / size)][Math.floor(Math.random() * h / size)].redraw(ctx);
						}
					}
				}, 50);
			};

			(resize = function () {
				canvas.setAttribute('width', w = container.clientWidth - 1);
				canvas.setAttribute('height', h = container.clientHeight - 1);
				paint();
			}).call();

			canvas.addEventListener('mousemove', function(evt) {
				var rect = canvas.getBoundingClientRect(),
					interval, toRedraw = [];
				mousePos = {
					x: Math.floor((evt.clientX - rect.left) / size),
					y: Math.floor((evt.clientY - rect.top) / size)
				};
				toRedraw.push(triangles[mousePos.x][mousePos.y].colorRedraw());

				if(triangles[mousePos.x + 1] && triangles[mousePos.x + 1][mousePos.y + 1]){
					toRedraw.push(triangles[mousePos.x + 1][mousePos.y + 1].colorRedraw());
				}

				if(triangles[mousePos.x - 1] && triangles[mousePos.x - 1][mousePos.y + 1]){
					toRedraw.push(triangles[mousePos.x - 1][mousePos.y + 1].colorRedraw());
				}

				if(triangles[mousePos.x + 1] && triangles[mousePos.x + 1][mousePos.y - 1]){
					toRedraw.push(triangles[mousePos.x + 1][mousePos.y - 1].colorRedraw());
				}

				if(triangles[mousePos.x - 1] && triangles[mousePos.x - 1][mousePos.y - 1]){
					toRedraw.push(triangles[mousePos.x - 1][mousePos.y - 1].colorRedraw());
				}

				if(triangles[mousePos.x][mousePos.y + 1]){
					toRedraw.push(triangles[mousePos.x][mousePos.y + 1].colorRedraw());
				}

				if(triangles[mousePos.x][mousePos.y - 1]){
					toRedraw.push(triangles[mousePos.x][mousePos.y - 1].colorRedraw());
				}

				if(triangles[mousePos.x][mousePos.y - 1]){
					toRedraw.push(triangles[mousePos.x][mousePos.y - 1].colorRedraw());
				}

				if(triangles[mousePos.x][mousePos.y + 1]){
					toRedraw.push(triangles[mousePos.x][mousePos.y + 1].colorRedraw());
				}

				interval = (function(auxMousePos){
					return setInterval(function(){
						toRedraw[Math.floor(Math.random() * toRedraw.length)].redraw(ctx);
					}, 200);
				})(mousePos);

				setTimeout(function(){
					clearInterval(interval);
					while ( toRedraw.length > 0 ) {
						toRedraw.pop().grayRedraw(ctx);
					}
				}, 1000);

			}, false);

			if (window.attachEvent) {
				window.attachEvent('onresize', resize);
			} else if (window.addEventListener) {
				window.addEventListener('resize', resize, true);
			}
		};
	})();
})(this);
// Analytics
(function(i,s,o,g,r,a,m){
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function () {
            (i[r].q = i[r].q||[]).push(arguments);
      };
      i[r].l = 1 * new Date();
      a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// Full Size Div, to remove when future releases
var redraw;
(redraw = function () {
      var myWidth = 0, myHeight = 0;
      if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
      }
      myWidth += 1;
      myHeight += 1;
      var contenedor = document.getElementById('contenedor');
      contenedor.setAttribute('style', 'width:'+myWidth+'px; height:'+myHeight+'px;');
}).call();

if (window.attachEvent) {
      window.attachEvent('onresize', redraw);
} else if (window.addEventListener) {
      window.addEventListener('resize', redraw, true);
}

// Activate canvas fun
Triangles('triangles');