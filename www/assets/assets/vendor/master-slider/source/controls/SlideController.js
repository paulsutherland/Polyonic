;(function($){

	"use strict";

	var SliderViewList = {};

	window.MSSlideController = function(slider){

		this._delayProgress		= 0;

		this._timer 			= new averta.Timer(100);
		this._timer.onTimer 	= this.onTimer;
		this._timer.refrence 	= this;

		this.currentSlide		= null;

		this.slider 	= slider;
		this.so 		= slider.options;

		averta.EventDispatcher.call(this);

	};

	MSSlideController.registerView = function(name , _class){
		if(name in SliderViewList){
			 throw new Error( name + ', is already registered.');
			 return;
		}

		SliderViewList[name] = _class;
	};

	MSSlideController.SliderControlList = {};
	MSSlideController.registerControl = function(name , _class){
		if(name in MSSlideController.SliderControlList){
			 throw new Error( name + ', is already registered.');
			 return;
		}

		MSSlideController.SliderControlList[name] = _class;
	};

	var p = MSSlideController.prototype;

	/*-------------- METHODS --------------*/


	p.setupView = function(){

		var that = this;
		this.resize_listener = function(){that.__resize();};

		// in @version 1.5.7 it will be added in Masterslider.js _setupSliderLayout function
		//$(window).bind('resize', this.resize_listener);

		//if(this.so.smoothHeight) this.so.autoHeight = true;

		var viewOptions = {
			spacing: 		this.so.space,
			mouseSwipe:		this.so.mouse,
			loop:			this.so.loop,
			autoHeight:		this.so.autoHeight,
			swipe:			this.so.swipe,
			speed:			this.so.speed,
			dir:			this.so.dir,
			viewNum: 		this.so.inView,
			critMargin: 	this.so.critMargin
		};

		if(this.so.viewOptions)
			$.extend(viewOptions , this.so.viewOptions);

		if(this.so.autoHeight) this.so.heightLimit = false;

		//this.view.slideDuration = this.so.duration;

		var viewClass = SliderViewList[this.slider.options.view] || MSBasicView;
		if(viewClass._3dreq && (!window._css3d || $.browser.msie) ) viewClass = viewClass._fallback || MSBasicView;

		this.view = new viewClass(viewOptions);

		if(this.so.overPause){
			var that = this;
			this.slider.$element.mouseenter(function(){
				that.is_over = true;
				that._stopTimer();
			}).mouseleave(function(){
				that.is_over = false;
				that._startTimer();
			});
		}
	};

	p.onChangeStart = function(){

		this.change_started = true;

		if(this.currentSlide) this.currentSlide.unselect();
		this.currentSlide = this.view.currentSlide;
		this.currentSlide.prepareToSelect();
		//this.__appendSlides();
		if(this.so.endPause && this.currentSlide.index === this.slider.slides.length - 1){
			this.pause();
			//this._timer.reset();
			this.skipTimer();
		}

		if(this.so.autoHeight){
			this.slider.setHeight(this.currentSlide.getHeight());
		}

		if ( this.so.deepLink ) {
			this.__updateWindowHash();
		}

		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.CHANGE_START));
	};

	p.onChangeEnd = function(){
		//if(!this.currentSlide.selected)
		//	this._timer.reset();
		this.change_started = false;

		this._startTimer();
		this.currentSlide.select();

		if(this.so.preload > 1){
			var loc ,i , l = this.so.preload - 1, slide;

			// next slides
			for(i=1;i<=l;++i){
				loc = this.view.index + i;

				if(loc >= this.view.slideList.length) {
					if(this.so.loop){
						loc = loc - this.view.slideList.length;
					}else{
						i = l;
						continue;
					}
				}

				slide = this.view.slideList[loc];
				if ( slide ) {
					slide.loadImages();
				}

			}

			// previous slides
			if(l > this.view.slideList.length/2)
				l = Math.floor(this.view.slideList.length/2);

			for(i=1;i<=l;++i){

				loc = this.view.index - i;

				if(loc < 0){
					if(this.so.loop){
						loc = this.view.slideList.length + loc;
					}else{
						i = l;
						continue;
					}
				}

				slide = this.view.slideList[loc];
				if ( slide ) {
					slide.loadImages();
				}

			}
		}

		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.CHANGE_END));

	};

	p.onSwipeStart = function(){
		//this._timer.reset();
		this.skipTimer();
	};

	p.skipTimer = function(){
		this._timer.reset();
		this._delayProgress  = 0;
		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.WAITING));
	};

	p.onTimer = function(time) {

		if(this._timer.getTime() >= this.view.currentSlide.delay * 1000){
			//this._timer.reset();
			this.skipTimer();
			this.view.next();
			this.hideCalled = false;
		}
		this._delayProgress = this._timer.getTime() / (this.view.currentSlide.delay * 10);

		if(this.so.hideLayers && !this.hideCalled && this.view.currentSlide.delay * 1000 - this._timer.getTime() <= 300){
			var currentSlide = this.view.currentSlide;
			if ( currentSlide.hasLayers ) {
				currentSlide.layerController.animHideLayers();
			}
			this.hideCalled = true;
		}

		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.WAITING));
	};

	p._stopTimer = function(){
		if(this._timer)
			this._timer.stop();
	};

	p._startTimer = function(){
		if(!this.paused && !this.is_over && this.currentSlide && this.currentSlide.ready && !this.change_started)
			this._timer.start();
	};

	p.__appendSlides = function(){
		var slide , loc , i = 0 , l = this.view.slideList.length -1;

		// detach all
		for ( i ; i < l ; ++i){
			slide = this.view.slideList[i];
			if(!slide.detached){
			 	slide.$element.detach();
			 	slide.detached = true;
			}
		}

		// append current slide
		this.view.appendSlide(this.view.slideList[this.view.index]);

		l = 3;

		// next slides
		for(i=1;i<=l;++i){
			loc = this.view.index + i;

			if(loc >= this.view.slideList.length) {
				if(this.so.loop){
					loc = loc - this.view.slideList.length;
				}else{
					i = l;
					continue;
				}
			}

			slide = this.view.slideList[loc];
			slide.detached = false;
			this.view.appendSlide(slide);

		}

		// previous slides
		if(l > this.view.slideList.length/2)
			l = Math.floor(this.view.slideList.length/2);

		for(i=1;i<=l;++i){

			loc = this.view.index - i;

			if(loc < 0){
				if(this.so.loop){
					loc = this.view.slideList.length + loc;
				}else{
					i = l;
					continue;
				}
			}

			slide = this.view.slideList[loc];
			slide.detached = false;
			this.view.appendSlide(slide);
		}

	}

	p.__resize = function(hard){
		if(!this.created) return;

		this.width = this.slider.$element[0].clientWidth || this.so.width;

		if(!this.so.fullwidth){
			this.width = Math.min(this.width , this.so.width);
			//this.view.$element.css('left' , (this.slider.$element[0].clientWidth - this.width) / 2 + 'px');
		}

		/* @ifdef PRO */
		if( this.so.fullheight ){
			this.so.heightLimit = false;
			this.so.autoHeight = false;
			this.height = this.slider.$element[0].clientHeight;
		} else {
			this.height = this.width / this.slider.aspect;
		}
		/* @endif */

		/* @ifdef LITE */
		this.height = this.width / this.slider.aspect;
		/* @endif */


		if( this.so.autoHeight ){
			this.currentSlide.setSize(this.width , null , hard);
			this.view.setSize(this.width , this.currentSlide.getHeight() , hard);
		} else {
			this.view.setSize(this.width , ( Math.max( this.so.minHeight, ( this.so.heightLimit ? Math.min(this.height , this.so.height) :  this.height ) ) ) , hard);
		}

		if(this.slider.$controlsCont){
			if(this.so.centerControls && this.so.fullwidth) {
				this.view.$element.css('left' , Math.min(0,-(this.slider.$element[0].clientWidth - this.so.width) / 2) + 'px');
			}
		}

		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.RESIZE));
	};

	p.__dispatchInit = function(){
		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.INIT));
	};

	/* @ifdef PRO */

	/**
	 * used by deep link feature, uptades window hash value on slide changes
	 * @since 2.1.0
	 */
	p.__updateWindowHash = function(){
		var hash = window.location.hash,
			dl = this.so.deepLink,
			dlt = this.so.deepLinkType,
			eq = dlt === 'path' ? '\/' : '=',
			sep = dlt === 'path' ? '\/' : '&',
			sliderHash = dl + eq + (this.view.index + 1),
			regTest = new RegExp( dl + eq + '[0-9]+', 'g');

		if ( hash === '' ) {
			window.location.hash = sep + sliderHash;
		} else if( regTest.test(hash) ) {
			window.location.hash = hash.replace(regTest, sliderHash);
		} else {
			window.location.hash = hash + sep + sliderHash;
		}
	};

	p.__curentSlideInHash = function(){
		var hash = window.location.hash,
			dl = this.so.deepLink,
			dlt = this.so.deepLinkType,
			eq = dlt === 'path' ? '\/' : '=',
			regTest = new RegExp( dl + eq + '[0-9]+', 'g' );

		if ( regTest.test(hash) ) {
			var index = Number(hash.match(regTest)[0].match(/[0-9]+/g).pop());
			if ( !isNaN(index) ) {
				return index - 1;
			}
		}

		return -1;
	};

	p.__onHashChanged = function(){
		var index = this.__curentSlideInHash();
		if ( index !== -1 ){
			this.gotoSlide(index);
		}
	};

    p.__findLayerById = function( layerId ) {

        if ( !this.currentSlide) {
            return null;
        }
        var layer;

        if ( this.currentSlide.layerController ) {
            layer = this.currentSlide.layerController.getLayerById( layerId );
        }

        if ( !layer && this.slider.overlayLayers ) {
            return this.slider.overlayLayers.layerController.getLayerById( layerId );
        }

        return layer;
    };

	/* @endif */

	p.setup = function(){

		this.created = true;
		this.paused = !this.so.autoplay;

		//this.slider.$element.append(this.view.$element);
		this.view.addEventListener(MSViewEvents.CHANGE_START , this.onChangeStart , this);
		this.view.addEventListener(MSViewEvents.CHANGE_END   , this.onChangeEnd   , this);
		this.view.addEventListener(MSViewEvents.SWIPE_START  , this.onSwipeStart  , this);

		//this.currentSlide = this.view.slides[this.so.start - 1];
		this.currentSlide = this.view.slideList[this.so.start - 1];
		this.__resize();

		/* @ifdef PRO */
		var slideInHash = this.__curentSlideInHash(),
			startSlide = slideInHash !== -1 ? slideInHash : this.so.start - 1;
		/* @endif */
		/* @ifdef LITE */
		var startSlide = this.so.start - 1;
		/* @endif */

		this.view.create(startSlide);

		if(this.so.preload === 0){
			this.view.slideList[0].loadImages();
		}

		this.scroller = this.view.controller;

		if(this.so.wheel){
			var that = this;
			var last_time = new Date().getTime();
			this.wheellistener = function(event){

				var e = window.event || event.orginalEvent || event;
				e.preventDefault();

				var current_time = new Date().getTime();
				if(current_time - last_time < 400) return;
				last_time = current_time;

				var delta = Math.abs(e.detail || e.wheelDelta);

				if ( $.browser.mozilla ) {
					delta *= 100;
				}

				var scrollThreshold = 15;

				// --- Scrolling up ---
				if (e.detail < 0 || e.wheelDelta > 0) {
					if ( delta >= scrollThreshold) {
						that.previous(true);
					}
				}
				// --- Scrolling down ---
				else {
					if (delta >= scrollThreshold) {
						that.next(true);
					}
				}

				return false;
			};

			if($.browser.mozilla) this.slider.$element[0].addEventListener('DOMMouseScroll' , this.wheellistener);
			else this.slider.$element.bind('mousewheel', this.wheellistener);
		}

		// if(this.so.wheel){
		// 	var that = this;
		// 	var last_time = new Date().getTime();
		// 	this.wheellistener = function(event){
		// 		var current_time = new Date().getTime();
		// 		if(current_time - last_time < 550) return;
		// 		last_time = current_time;
		// 		var e = window.event || event.orginalEvent || event;
		// 		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		// 		if(delta < 0)		that.next();
		// 		else if(delta > 0)	that.previous();
		// 		return false;
		// 	};

		// 	if($.browser.mozilla) this.slider.$element[0].addEventListener('DOMMouseScroll' , this.wheellistener);
		// 	else this.slider.$element.bind('mousewheel', this.wheellistener);
		// }

		if(this.slider.$element[0].clientWidth === 0)
			this.slider.init_safemode = true;

		this.__resize();

		/* @ifdef PRO */
		var that = this;
		if( this.so.deepLink ) {
			$(window).on('hashchange', function() {
			  that.__onHashChanged();
			});
		}
		/* @endif */
	};

	p.index = function(){
		return this.view.index;
	};

	p.count = function(){
		return this.view.slidesCount;
	};

	p.next = function(checkLoop){
		this.skipTimer();
		this.view.next(checkLoop);
	};

	p.previous = function(checkLoop){
		this.skipTimer();
		this.view.previous(checkLoop);
	};

	p.gotoSlide = function(index) {
		index = Math.min(index, this.count()-1);
		this.skipTimer();
		this.view.gotoSlide(index);
	};

	p.destroy = function(reset){
		this.dispatchEvent(new MSSliderEvent(MSSliderEvent.DESTROY));
		this.slider.destroy(reset);
	};

	p._destroy = function(){
		this._timer.reset();
		this._timer = null;

		$(window).unbind('resize', this.resize_listener);
		this.view.destroy();
		this.view = null;

		if(this.so.wheel){
			if($.browser.mozilla) this.slider.$element[0].removeEventListener('DOMMouseScroll' , this.wheellistener);
			else this.slider.$element.unbind('mousewheel', this.wheellistener);
			this.wheellistener = null;
		}

		this.so = null;
	};

	/**
	 * run layer actions like next, previous,...
	 * @param  {String} action
	 * @since v1.7.2
	 */
	p.runAction = function(action){
		var actionParams = [];

		if( action.indexOf('(') !== -1 ){
			var temp = action.slice(0 , action.indexOf('('));
			actionParams = action.slice(action.indexOf('(') + 1 , -1).replace(/\"|\'|\s/g , '').split(',');
			action   = temp;
		}

		if ( action in this ){
			this[action].apply(this, actionParams);
		} else if ( console ){
			console.log('Master Slider Error: Action "'+action+'" not found.');
		}
	};

	p.update = function(hard){
		if(this.slider.init_safemode && hard)
			this.slider.init_safemode = false;
		this.__resize(hard);

		if ( hard ) {
			this.dispatchEvent(new MSSliderEvent(MSSliderEvent.HARD_UPDATE));
		}

	};

	p.locate = function(){
		this.__resize();
	};

	p.resume = function(){
		if(!this.paused) return;
		this.paused = false;
		this._startTimer();
	};

	p.pause = function(){
		if(this.paused) return;
		this.paused = true;
		this._stopTimer();
	};

	p.currentTime = function(){
		return this._delayProgress;
	};


    /* @ifdef PRO */

    p.showLayer = function( layerId, delay ) {
        var layer = this.__findLayerById( layerId );
        if ( layer ) {
            if ( !delay ) {
                    layer.start();
            } else {
                clearTimeout( layer.actionTimeout );
                layer.actionTimeout = setTimeout( this.showLayer, delay , layerId , 0 );
            }
        }
    };

    p.hideLayer = function( layerId, delay ) {
        var layer = this.__findLayerById( layerId );
        if ( layer ) {
            if ( !delay ) {
                    layer.hide();
            } else {
                clearTimeout( layer.actionTimeout );
                layer.actionTimeout = setTimeout( this.hideLayer, delay , layerId , 0 );
            }
        }
    }

    p.toggleLayer = function( layerId, delay ) {
        var layer = this.__findLayerById( layerId );
        if ( layer ) {
            if ( !delay ) {
                    layer.isShowing ? layer.hide() : layer.start();
            } else {
                clearTimeout( layer.actionTimeout );
                layer.actionTimeout = setTimeout( this.toggleLayer, delay , layerId , 0 );
            }
        }
    }

    p.showLayers = function( layerIds, delay ) {
        var self = this;
        $.each( layerIds.replace( /\s+/g , '' ).split('|'), function( index, layerId ) {
            self.showLayer(layerId, delay);
        });
    };


    p.hideLayers = function( layerIds, delay ) {
        var self = this;
        $.each( layerIds.replace( /\s+/g , '' ).split('|'), function( index, layerId ) {
            self.hideLayer(layerId, delay);
        });
    };

    p.toggleLayers = function( layerIds, delay ) {
        var self = this;
        $.each( layerIds.replace( /\s+/g , '' ).split('|'), function( index, layerId ) {
            self.toggleLayer(layerId, delay);
        });
    };

    /* @endif */

	averta.EventDispatcher.extend(p);
})(jQuery);
