(function (window) {
	window.Triangles = (function () {
		var Point = function (x, y) {
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
			Triangle = function ( initialPoint, width, randomGray, type ){
				var points = [],
					color = randomGray(initialPoint.getX(), initialPoint.getY());
				if ( !type ){
					type = 1;
				}
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
					case 4:
						points.push(initialPoint);
						points.push( new Point( initialPoint.getX(), initialPoint.getY() - width ));
						points.push( new Point( initialPoint.getX() + width, initialPoint.getY() ));
					break;
				}

				return {
					draw: function (ctx) {
						ctx.fillStyle = color;
						ctx.beginPath();
						ctx.moveTo(points[0].getX(), points[0].getY());
						ctx.lineTo(points[1].getX(), points[1].getY());
						ctx.lineTo(points[2].getX(), points[2].getY());
						ctx.lineTo(points[0].getX(), points[0].getY());
						ctx.closePath();
						ctx.fill();
						return this;
					},
					redraw: function (ctx) {
						color = randomGray(initialPoint.getX(), initialPoint.getY());
						return this.draw(ctx);
					}
				};
			},
			Gradient = function ( initial, end, width, height, jumps ) {
				var middleX = width / 2,
					middleY = height / 2,
					widthInTriangles = Math.ceil( width / jumps ),
					heightInTriangles = Math.ceil( height / jumps ),
					colorsX = [], colorsY = [],
					initialX, initialY,
					endX, endY,
					aux = [], i;

				initialX = initialY = initial;
				endX = endY = end;

				// For width

				// If there are more colors than triangles
				if ( widthInTriangles / 2 + 1 < endX - initialX ) {
					while ( widthInTriangles / 2 + 1 < endX - initialX ) {
						endX --;
						if ( widthInTriangles / 2 + 1 < endX - initialX ) {
							initialX ++;
						}
					}

					for ( i = initialX; i < endX; i++ ){
						colorsX.push(i);
					}
				// there are more triangles than colors
				} else {
					for ( i = initialX; i < endX; i++ ){
						colorsX.push(i);
					}

					while ( colorsX.length < Math.ceil( widthInTriangles / 2 )) {
						colorsX.push(colorsX[Math.floor(Math.random() * 8)]);
					}
				}

				// For height

				// If there are more colors than triangles
				if ( heightInTriangles / 2 + 1 < endY - initialY ) {
					while ( heightInTriangles / 2 + 1 < endY - initialY ) {
						endY --;
						if ( heightInTriangles / 2 + 1 < endY - initialY ) {
							initialY ++;
						}
					}

					for ( i = initialY; i < endY; i++ ){
						colorsY.push(i);
					}
				// there are more triangles than colors
				} else {
					for ( i = initialY; i < endY; i++ ){
						colorsY.push(i);
					}

					while ( colorsY.length < Math.ceil( heightInTriangles / 2)) {
						colorsY.push(colorsY[Math.floor(Math.random() * 8)]);
					}
				}

				colorsX.sort(function (a, b) { return a - b; } );
				colorsY.sort(function (a, b) { return a - b; } );

				aux = colorsX.slice();
				aux.reverse();
				colorsX = colorsX.concat(aux);

				aux = colorsY.slice();
				aux.reverse();
				colorsY = colorsY.concat(aux);

				return {
					randomGray: function (x, y) {
						var spaceX = x / jumps,
							spaceY = y / jumps,
							color = Math.floor((colorsX[spaceX] + colorsY[spaceY]) / 2) - 1,
							randomColor;

						// Color difference between shades
						if ( x < middleX * 0.1 || width - x < middleX * 0.1) {
							randomColor = Math.floor(Math.random() * 12);
						}else if ( x < middleX * 0.2 || width - x < middleX * 0.2) {
							randomColor = Math.floor(Math.random() * 11);
						}else if ( x < middleX * 0.25 || width - x < middleX * 0.25) {
							randomColor = Math.floor(Math.random() * 10);
						}else if ( x < middleX * 0.35 || width - x < middleX * 0.35) {
							randomColor = Math.floor(Math.random() * 9);
						}else if ( x < middleX * 0.5 || width - x < middleX * 0.5) {
							randomColor = Math.floor(Math.random() * 6);
						}else if ( x < middleX * 0.6 || width - x < middleX * 0.6) {
							randomColor = Math.floor(Math.random() * 5);
						}else if ( x < middleX * 0.7 || width - x < middleX * 0.7) {
							randomColor = Math.floor(Math.random() * 4);
						}else if ( x < middleX * 0.75 || width - x < middleX * 0.75) {
							if ( y < middleY * 0.8 || height - y < middleY * 0.8 ) {
								randomColor = Math.floor(Math.random() * 8);
							}else{
								randomColor = Math.floor(Math.random() * 2);
							}
						}else{
							if ( y < middleY * 0.5 || height - y < middleY * 0.5 ) {
								randomColor = Math.floor(Math.random() * 6);
							}else{
								randomColor = Math.floor(Math.random() * 1);
							}
						}

						if ( Math.random() > 0.5 ) {
							color = color - randomColor;
						} else {
							color = color + randomColor;
						}

						color += 11;
						return 'rgb(' + [color, color, color].join(',') + ')';
					}
				};
			};

		return function (id) {
			var canvas = document.getElementById(id),
				container = canvas.parentNode,
				dark = 12,
				light = 38,
				size = 25,
				triangles,
				w, h, i, j,
				gray, ctx,
				gradient, resize,
				paint, interval;

			paint = function () {
				triangles = [];

				if 	(interval) {
					clearInterval(interval);
				}
				gradient = new Gradient(dark, light, w, h, size);

				ctx = canvas.getContext('2d');
				new Rectangle( w, h, 'rgb(' + [light, light, light].join(',') + ')').draw(ctx);

				for( i = 0; i < w + size; i += size) {
					for ( j = 0; j < h + size; j += size) {
						randomType = Math.floor( Math.random() * 5 );
						triangles.push(new Triangle( new Point(i, j), size, gradient.randomGray, randomType ).draw(ctx));
					}
				}
				for( i = 0; i < w + size; i += size) {
					for ( j = 0; j < h + size; j += size) {
						randomType = Math.floor( Math.random() * 5 );
						triangles.push(new Triangle( new Point(i, j), size, gradient.randomGray, randomType ).draw(ctx));
					}
				}
				for( i = 0; i < w + size; i += size) {
					for ( j = 0; j < h + size; j += size) {
						randomType = Math.floor( Math.random() * 5 );
						triangles.push(new Triangle( new Point(i, j), size, gradient.randomGray, randomType ).draw(ctx));
					}
				}

				interval = setInterval(function(){
					triangles[Math.floor(Math.random() * triangles.length)].redraw(ctx);
					triangles[Math.floor(Math.random() * triangles.length)].redraw(ctx);
					triangles[Math.floor(Math.random() * triangles.length)].redraw(ctx);
					triangles[Math.floor(Math.random() * triangles.length)].redraw(ctx);
				}, 0.5);
			};

			(resize = function () {
				canvas.setAttribute('width', w = container.clientWidth - 1);
				canvas.setAttribute('height', h = container.clientHeight - 1);
				paint();
			}).call();

			if (window.attachEvent) {
				window.attachEvent('onresize', resize);
			} else if (window.addEventListener) {
				window.addEventListener('resize', resize, true);
			}
		};
	})();
})(this);