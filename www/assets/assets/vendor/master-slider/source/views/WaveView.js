;(function($){

	"use strict";

	window.MSWaveView = function(options){
		MSBasicView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-wave-view');
		this.$slideCont.css(window._csspfx + 'transform-style' , 'preserve-3d');

		// Auto update z index of slides
		// @since 1.7
		this.autoUpdateZIndex = true;
	};

	MSWaveView.extend(MSBasicView);
	MSWaveView._3dreq = true;
	MSWaveView._fallback = MSBasicView;

	var p  = MSWaveView.prototype;
	var _super  = MSBasicView.prototype;

	/*-------------- METHODS --------------*/

	/*p.__setSlideTransDuration = function(value){
		for(var i=0; i<this.slidesCount; ++i)
			this.slides[i].$element.css(window._csspfx + 'transition-duration' , value + 'ms');
	};*/

	p._horizUpdate = function(controller , value){

		_super._horizUpdate.call(this, controller , value);

		var cont_scroll = -value;
		var slide_pos , slide , distance;

		for(var i = 0; i < this.slidesCount; ++i){
			slide = this.slideList[i];
			//slide_pos = parseInt(slide.$element.css('left'));
			distance = -cont_scroll - slide.position;
			this.__updateSlidesHoriz(slide , distance);
		}

	};

	p._vertiUpdate = function(controller , value){

		_super._vertiUpdate.call(this, controller , value);

		var cont_scroll = -value;
		var slide_pos , slide , distance;

		for(var i = 0; i < this.slidesCount; ++i){
			slide = this.slideList[i];
			//slide_pos = parseInt(slide.$element.css('left'));
			distance = -cont_scroll - slide.position;
			this.__updateSlidesVertic(slide , distance);
		}

	};


	p.__updateSlidesHoriz = function(slide , distance){
		var value =  Math.abs(distance * 100 / this.__width);
		//var value2 = Math.min(value , 100);
	//	var sp = Math.min(100 , )
		//slide.$bg_img.css('opacity' , (100 -  Math.abs(distance * 120 / this.__width / 3)) / 100);
		slide.$element[0].style[window._csspfx + 'transform'] = 'translateZ('+ -value * 3 +'px) rotateY(0.01deg)'/* translateX('+(distance < 0 ? 1 : -1) * -value * 5+'px)'*/;
	};

	p.__updateSlidesVertic = function(slide , distance){
		this.__updateSlidesHoriz(slide , distance);
	};

	/*
	p.swipeMove = function(status){

		if(status.phase == 'start'){
			this.__setSlideTransDuration(0);
		}else if(status.phase == 'end'){
			this.__setSlideTransDuration(this.__slideDuration);
		}

		_super.swipeMove.call(this , status);
	};

	p.create = function(index){
		_super.create.call(this , index);

		for(var i = 0; i<this.slidesCount ; ++i){
			this.slides[i].$element.css(window._csspfx + 'transition-property' , window._csspfx 		+ 'transform');
			this.slides[i].$element.css(window._csspfx + 'transition-duration' , this.slideDuration + 'ms');
		}
	};
	*/
	MSSlideController.registerView('wave' , MSWaveView);
})(jQuery);

