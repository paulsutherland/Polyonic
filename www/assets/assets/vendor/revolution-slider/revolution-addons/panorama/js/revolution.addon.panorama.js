/* 
 * @author    ThemePunch <info@themepunch.com>
 * @link      http://www.themepunch.com/
 * @copyright 2017 ThemePunch
*/

;(function() {
	
	var $, 
		engine,
	    requestFrame = window.requestAnimationFrame;

		 
	window.RsAddonPanorama = function(_$, slider) {
		
		if(!engine) {
			
			engine = webGL();
			if(!engine) {
				
				slider.addClass('pano-no-webgl');
				return;
				
			}
			
		}
		
		if(!_$ || !slider || typeof THREE === 'undefined' || !requestFrame) return;
		if(!slider.find('li[data-panorama]').length) return;
		
		$ = _$;
		$.event.special.rsPanoramaDestroyed = {remove: function(evt) {evt.handler();}};
		
		return new Panorama(slider);
		
	};
	
	function Panorama(slider) {
		
		this.slider = slider;	
		this.slides = [];
		this.panos = slider.find('li[data-panorama]').each(function(i) {
			
			if(i === 0) this.setAttribute('data-fstransition', 'notransition');
			this.setAttribute('data-transition', 'fade');
			
		});
		
		slider.one('revolution.slide.onloaded', this.onLoaded.bind(this))
			  .one('rsPanoramaDestroyed', this.destroy.bind(this));
		
	}
	
	Panorama.prototype = {
		
		onLoaded: function() {
			
			this.slider.one('revolution.slide.onchange', this.onReady.bind(this));
			jQuery(window).on('blur.rsaddonpanorama', this.onBlur.bind(this));
			
		},
		
		onReady: function(e, data) {
			
			this.resize();
			var $this = this;
			this.panos.each(function(i) {
				
				$this.slides[i] = new PanoramaSlide($(this), $this.slider, $this.width, $this.height);
				
			});
			
			this.slider.on('revolution.slide.afterdraw', this.resize.bind(this))
			           .on('revolution.slide.onbeforeswap', this.beforeSwap.bind(this))
					   .on('revolution.slide.onafterswap', this.afterSwap.bind(this))
					   .on('layeraction', this.layerAction.bind(this));
					   
			var slide = $.data(data.currentslide[0], 'rsaddonpanorama');
			if(slide) slide.onReset();
			this.panos = null;
			
		},
		
		beforeSwap: function(e, data) {
			
			var slide = $.data(data.currentslide[0], 'rsaddonpanorama');
			if(slide && slide.controls) slide.removeEvents();
			
			slide = $.data(data.nextslide[0], 'rsaddonpanorama');
			if(slide) slide.onReset();
			
		},
		
		afterSwap: function(e, data) {
			
			this.currentSlide = $.data(data.currentslide[0], 'rsaddonpanorama');
			if(!data.prevslide.length) return;
			
			var slide = $.data(data.prevslide[0], 'rsaddonpanorama');
			if(slide) slide.paused = true;
			
		},
		
		resize: function() {
			
			this.width = this.slider.width();
			this.height = this.slider.height();
			
			var i = this.slides.length,
			    slide;
				
			while(i--) {
				
				slide = this.slides[i];
				slide.resize(this.width, this.height);
				
			}
			
		},
		
		onBlur: function() {
			
			var i = this.slides.length,
			    slide;
				
			while(i--) {
				
				slide = this.slides[i];
				slide.clear();
				slide.canvas.trigger('mouseup').trigger('mouseleave').trigger('touchend');
				
			}
			
		},
		
		layerAction: function(e, data) {
			
			data = data.event;
			var action = data.action;
			
			if(action && action.search('panorama') !== -1 && this.currentSlide) {
				
				var perc = data.hasOwnProperty('percentage') ? data.percentage * 0.01 : false;
				this.currentSlide.action(action.replace('panorama_', ''), perc);
				
			}
			
		},
		
		destroy: function() {
			
			if(this.slides) {
			
				while(this.slides.length) {
					
					this.slides[0].destroy();
					this.slides.shift();
					
				}
				
			}
			
			for(var prop in this) if(this.hasOwnProperty(prop)) delete this[prop];
			
		}
	
	};
	
	function PanoramaSlide(slide, slider, width, height) {
		
		var options = JSON.parse(slide.attr('data-panorama'));
		
		this.x = 0;
		this.y = 0;
		this.zoomVal = 1;
		this.width = width;
		this.height = height;
		this.slide = slide;
		this.slider = slider;
		this.distX = false;
		this.distY = false;
		
		this.image = options.image;
		this.controls = options.controls;
		this.drag = this.controls === 'drag';
		this.thrw = this.controls === 'throw';
		this.move = this.drag || this.thrw;
		this.mouse = this.controls === 'mouse';
		this.click = this.controls === 'click';
		this.autoplay = options.autoplay == 'true';
		this.zoom = options.mousewheelZoom == 'true';
		this.smoothZoom = options.smoothZoom == 'true';
		
		var direction = options.autoplayDirection === 'forward' ? 1 : -1;
		this.autoplaySpeed = parseInt(options.autoplaySpeed, 10) * 0.001;
		this.speed = this.autoplaySpeed * direction;
		
		this.throwSpeed = parseInt(options.throwSpeed, 10) * 0.001;
		this.zoomMax = 2 - (parseInt(options.zoomMax, 10) * 0.01);
		this.zoomMin = 2 - (parseInt(options.zoomMin, 10) * 0.01);
		this.fov = parseInt(options.cameraFov, 10);
		
		this.onStart = this.start.bind(this);
		this.onZoom = this.zooming.bind(this);
		this.inZoom = this.zoomIn.bind(this);
		this.outZoom = this.zoomOut.bind(this);
		this.onRender = this.render.bind(this);
		this.onMouse = this.mouseEvent.bind(this);
		this.onImgChange = this.imgChange.bind(this);
		this.fireAction = this.onAction.bind(this);
		
		this.renderer = new THREE[engine]();
		this.renderer.setSize(width, height);
		
		this.camera = new THREE.PerspectiveCamera(this.fov, width / height, 1, parseInt(options.cameraFar, 10));
		this.camera.target = new THREE.Vector3(0, 0, 0);
		
		var sphere = new THREE.SphereGeometry(parseInt(options.sphereRadius, 10), parseInt(options.sphereWsegments, 10), parseInt(options.sphereHsegments, 10));
		this.texture = new THREE.TextureLoader();
		this.texture.minFilter = THREE.LinearFilter;
			
		sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
		this.material = new THREE.MeshBasicMaterial();
		
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.Mesh(sphere, this.material));
		
		$.data(slide[0], 'rsaddonpanorama', this);
		this.canvas = $(this.renderer.domElement).addClass('rsaddon-panorama').appendTo(slide.find('.slotholder'));
		
		slide.on('mouseleave', this.onLeave.bind(this)).find('.tp-withaction').each(setActions);
		
	}
	
	PanoramaSlide.prototype = {
		
		start: function() {
			
			if(!this.imgLoaded) this.imgLoaded = true;
			if(!this.currentSlide) return;
			
			if(this.newImage) {
			
				this.x = 0;
				this.y = 0;
				this.zoomVal = 1;
				this.camera.fov = this.fov;
				this.camera.updateProjectionMatrix();
				this.newImage = false;
				
			}
			
			this.controller = false;
			this.paused = false;
			
			// this.slider.removeClass('rsaddon-panorama-loading');
			requestFrame(this.onRender);
			
			this.addEvents();
			this.running = true;
			this.slider.addClass('rsaddon-pano');
			
		},
		
		render: function() {
			
			if(this.paused || !this.camera) return;
			this.y = Math.max(-85, Math.min(85, this.y));
			
			if(this.distX !== false || this.distY !== false) {
				
				if(this.distX !== false) {
				
					this.x += (this.distX - this.x) * 0.05;
					if(Math.abs(this.distX - this.x) < 1) {
						
						this.distX = false;
						clearInterval(this.actionTimer);
						
					}
					
				}
				else if(this.distY !== false) {
					
					this.y += (this.distY - this.y) * 0.05;
					if(Math.abs(this.distY - this.y) < 1) {
						
						this.distY = false;
						clearInterval(this.actionTimer);
						
					}
					
				}
				
			}
			else if(!this.controller) {

				if(this.autoplay) this.x += this.speed;
				
			}
			else if(!this.move) {

				var xx = (this.mouseX - this.left) / this.width,
				    yy = (this.mouseY - this.top) / this.height;
				
				xx = xx <= 0.5 ? (1 - (xx * 2)) * -180 : ((xx - 0.5) * 2) * 180;
				yy = yy <= 0.5 ? (1 - (yy * 2)) * 85 : ((yy - 0.5) * 2) * -85;
				yy = Math.max(-85, Math.min(85, yy));
				
				this.x += (xx - this.x) * 0.05;
				this.y += (yy - this.y) * 0.05;
				
				if((this.click || this.mouse) && Math.abs(xx - this.x) < 1 && Math.abs(yy - this.y) < 1) this.controller = false;
				
			}
			else if(this.thrw) {

				if(this.mousedown) {
					
					this.vx = this.x - this.oldX;
					this.vy = this.y - this.oldY;
					this.oldX = this.x;
					this.oldY = this.y;
					
				}
				else {
					
					var vx = Math.abs(this.vx),
					    vy = Math.abs(this.vy);
					
					if(vx > 0.01) this.x += this.vx;
					if(vy > 0.01) this.y += this.vy;
					
					this.vx *= this.throwSpeed;
					this.vy *= this.throwSpeed;
					
					if(vx <= 0.01 && vy <= 0.01) this.controller = false;
				
				}
					
			}
			
			var x = THREE.Math.degToRad(this.x),
			    y = THREE.Math.degToRad(90 - this.y);
			
			this.camera.target.x = Math.sin(y) * Math.cos(x);
			this.camera.target.z = Math.sin(y) * Math.sin(x);
			this.camera.target.y = Math.cos(y);
			this.camera.lookAt(this.camera.target);
			
			if(this.smoothZoom) { 
			
				this.camera.fov += ((this.fov * this.zoomVal) - this.camera.fov) * 0.05;
				this.camera.updateProjectionMatrix();
				
			}
			
			this.renderer.render(this.scene, this.camera);
			requestFrame(this.onRender);
			
		},
		
		onLeave: function() {
			
			clearInterval(this.actionTimer);
			clearInterval(this.zoomTimer);
			
		},
		
		clear: function() {
			
			clearInterval(this.actionTimer);
			clearInterval(this.zoomTimer);
			
			this.distX = false;
			this.distY = false;
			
		},
		
		onAction: function() {
			
			this.action(this.actionType, this.actionPerc);
			
		},
		
		action: function(tpe, perc) {
			
			var actionType,
				dist;
				
			switch(tpe) {
				
				case 'left':
					
					this.distX = this.x + (-180 * perc);
				
				break;
				
				case 'right':
					
					this.distX = this.x + (180 * perc);
				
				break;
				
				case 'up':
					
					dist = this.y + (85 * perc);
					this.distY = Math.max(-85, Math.min(85, dist));
				
				break;
				
				case 'down':
					
					dist = this.y + (-85 * perc);
					this.distY = Math.max(-85, Math.min(85, dist));
				
				break;
				
				case 'leftstart':
					
					actionType = 'left';
				
				break;
				
				case 'rightstart':
					
					actionType = 'right';
				
				break;
				
				case 'upstart':
					
					actionType = 'up';
				
				break;
				
				case 'downstart':
					
					actionType = 'down';
				
				break;
				
				case 'leftend':
				case 'rightend':
				case 'upend':
				case 'downend':
				
					clearInterval(this.actionTimer);
				
				break;
				
				case 'zoomin':
					
					clearInterval(this.zoomTimer);
					this.zooming('gestureend', 0.5);
				
				break;
				
				case 'zoomout':
					
					clearInterval(this.zoomTimer);
					this.zooming('gestureend', 1.5);
				
				break;
				
				case 'zoominstart':
					
					clearInterval(this.zoomTimer);
					this.inZoom();
					this.zoomTimer = setInterval(this.inZoom, 100);
				
				break;
				
				case 'zoomoutstart':
					
					clearInterval(this.zoomTimer);
					this.outZoom();
					this.zoomTimer = setInterval(this.outZoom, 100);
				
				break;
				
				case 'zoominend':
				case 'zoomoutend':
				
					clearInterval(this.zoomTimer);
				
				break;
				
			}
			
			if(actionType) {
				
				this.clear();
				this.actionPerc = perc;
				this.actionType = actionType;
				this.fireAction();
				this.actionTimer = setInterval(this.fireAction, 100);
				
			}
			
		},
		
		zooming: function(e, scale) {
			
			var tpe;
			this.prevZoom = this.zoomVal;
			
			if(e !== 'gestureend') {
				
				tpe = e.type;
				scale = e.scale;
				
			}
			else {	
			
				tpe = e;
				
			}
			
			if(tpe !== 'gestureend') {
			
				if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) this.zoomVal -= 0.05;
				else this.zoomVal += 0.05;
				
			}
			else {
				
				
				if(scale < 1) this.zoomVal -= 0.05;
				else this.zoomVal += 0.05;
				
			}
			
			this.zoomVal = Math.max(this.zoomMax, Math.min(this.zoomMin, this.zoomVal));
			if(this.zoomVal === this.zoomMax || this.zoomVal === this.zoomMin) clearInterval(this.zoomTimer);
			
			if(!this.smoothZoom) {
				
				this.camera.fov = this.fov * this.zoomVal;
				this.camera.updateProjectionMatrix();
				
			}

			return false;
			
		},
		
		zoomIn: function() {
			
			this.zooming('gestureend', 0.5);
			
		},
		
		zoomOut: function() {
			
			this.zooming('gestureend', 1.5);
			
		},
		
		imgChange: function() {
			
			this.timer = setTimeout(this.onStart, 500);
			
		},
		
		update: function(prop, val, callback) {
			
			clearTimeout(this.timer);
			
			this.removeEvents();
			this.paused = true;
			
			switch(prop) {
				
				case 'image':
					
					// this.slider.addClass('rsaddon-panorama-loading');
					this.newImage = true;
					this.material.map = this.texture.load(val, this.onImgChange);
				
				break;
				
				case 'controls':
					
					this.controls = val;
					if(val !== 'none') {
					
						this.drag = val === 'drag';
						this.thrw = val === 'throw';
						this.mouse = val === 'mouse';
						this.click = val === 'click';
						this.move = this.drag || this.thrw;
						
					}
					else {
						
						this.x = 0;
						this.y = 0;
						
					}
				
				break;
				
				case 'autoplay':
				
					this.autoplay = val == 'true';
				
				break;
				
				case 'direction':
				
					var direction = val === 'forward' ? 1 : -1;
					this.speed = this.autoplaySpeed * direction;
				
				break;
				
				case 'zoom':
					
					if(val == 'false') {
						
						delete this.zoom;
						this.zoomVal = 1;
						this.camera.fov = this.fov;
						this.camera.updateProjectionMatrix();
						
					}
					else {
					
						this.zoom = true;
						
					}
				
				break;
				
				case 'smooth':
				
					this.smoothZoom = val == 'true';
				
				break;
			
			}
			
			if(prop !== 'image') this.timer = setTimeout(this.onStart, 500);
			
		},
		
		resize: function(width, height) {
			
			this.width = width;
			this.height = height;
			this.renderer.setSize(width, height);
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			
		},
		
		onReset: function() {
			
			this.paused = true;
			this.currentSlide = true;
			
			this.x = 0;
			this.y = 0;
			this.distX = false;
			this.distY = false;
				
			this.zoomVal = 1;
			this.camera.fov = this.fov;
			this.camera.updateProjectionMatrix();
			
			if(!this.imgLoaded) this.material.map = this.texture.load(this.image, this.onStart);
			else this.start();
			
		},
		
		enterMouse: function(e, triggered) {
			
			if(this.move) this.canvas.removeClass('rsaddon-panorama-drag').addClass('rsaddon-panorama-dragging');
			
			this.clear();
			this.controller = true;
			this.mousedown = true;
			
			var offset = this.slider.offset();
			this.left = offset.left;
			this.top = offset.top;
			
			if(!triggered) {
				
				var touch = e.originalEvent.touches;
				if(touch) e = touch[0];
				
				this.startX = e.pageX - this.left;
				this.startY = e.pageY - this.top;
			
				this.prevX = this.x;
				this.prevY = this.y;
				
				this.oldX = this.x;
				this.oldY = this.y;
				
				this.canvas.on('mousemove.rsaddonpanorama touchmove.rsaddonpanorama', this.onMouse); 
				
			}
			
		},
		
		mouseEvent: function(e) {
			
			this.onLeave();
			if(e.type.search(/move|click/) !== -1) {
				 
				if(this.move) {	
					if(!this.controller || !this.mousedown) return;
				}
				else if(!this.controller) {
					this.enterMouse(e, true);
				}
				
				var touch = e.originalEvent.touches;
				if(touch) e = touch[0];
				
				if(!this.move) {
					
					this.mouseX = e.pageX;
					this.mouseY = e.pageY;
					
				}
				else {
				
					this.x = this.prevX + ((this.startX - (e.pageX - this.left)) * 0.1);
					this.y = this.prevY + (((e.pageY - this.top) - this.startY) * 0.1);
					
				}
				
			}
			else if(e.type.search(/down|enter|start/) !== -1) {
				
				this.enterMouse(e);
				
			}
			else {

				this.canvas.off('mousemove.rsaddonpanorama touchmove.rsaddonpanorama'); 
				if(this.drag) this.controller = false;
				
				this.mousedown = false;
				if(this.move) this.canvas.removeClass('rsaddon-panorama-dragging').addClass('rsaddon-panorama-drag');
					
			}
			
		},
		
		addEvents: function() {
			
			switch(this.controls) {
				
				case 'drag':
				case 'throw':
					
					this.canvas.on(
					
						'mousedown.rsaddonpanorama ' + 
						'mouseup.rsaddonpanorama ' + 
						'mouseleave.rsaddonpanorama ' + 
						'touchstart.rsaddonpanorama ' + 
						'touchend.rsaddonpanorama ' + 
						'touchcancel.rsaddonpanorama', 
						
					this.onMouse);
				
				break;
				
				case 'click':
					
					this.slide.on('click.rsaddonpanorama', this.onMouse);
				
				break;
				
				case 'mouse':

					this.slide.on('mousemove.rsaddonpanorama touchmove.rsaddonpanorama', this.onMouse);
				
				break;
				
			}
			
			if(this.zoom) this.slider.on('mousewheel.rsaddonpanorama DOMMouseScroll.rsaddonpanorama gestureend.rsaddonpanorama', this.onZoom);
			if(this.controls !== 'none') {
				
				if(this.move) this.canvas.addClass('rsaddon-panorama-drag');
				else if(this.click) this.slide.addClass('rsaddon-panorama-click');
				
			}
			
		},
		
		removeEvents: function() {
			
			this.clear();
			this.mousedown = false;
			this.controller = false;
			this.currentSlide = false;
			
			switch(this.controls) {
				
				case 'drag':
				case 'throw':
				
					this.canvas.off('.rsaddonpanorama');
				
				break;
				
				case 'mouse':
				case 'click':
				
					this.slide.off('.rsaddonpanorama');
				
				break;
				
			}
				
			this.slider.off('.rsaddonpanorama');
			this.slide.removeClass('rsaddon-panorama-click');
			this.canvas.removeClass('rsaddon-panorama-drag rsaddon-panorama-dragging');
			
		},
		
		destroy: function() {
			
			for(var prop in this) if(this.hasOwnProperty(prop)) delete this[prop];
			
		}
		
	};
	
	function stopBubble(e) {
		
		e.stopPropagation();
		
	}
	
	function setActions() {
		
		var $this = jQuery(this),
			actions = $this.data().actions;
			
		if($this.hasClass('rspanoaction') || !Array.isArray(actions)) return;
		
		var i = actions.length,
			action;
			
		while(i--) {
			
			action = actions[i];
			if(action.action.search('panorama') !== -1) $this.addClass('rspanoaction').on('mousedown click mousemove touchmove', stopBubble);
			
		}
		
	}
	
	function webGL() {
		
		var canvas;
		try {

			canvas = document.createElement('canvas'); 
			canvas = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
			if(canvas) canvas = 'WebGLRenderer';

		} 
		catch(e) {}
		
		if(!canvas) {
			
			canvas = window.CanvasRenderingContext2D;
			if(canvas) canvas = 'CanvasRenderer';
			
		}
		
		return canvas;
		
	}
	
})();











