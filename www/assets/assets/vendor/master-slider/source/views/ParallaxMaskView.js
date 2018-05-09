;(function($){
	
	"use strict";
	
	window.MSParallaxMaskView = function(options){
		MSMaskView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-parallax-mask-view');
		
	};
	
	MSParallaxMaskView.extend(MSMaskView);
	MSParallaxMaskView.parallaxAmount = 0.5;

	var p  = MSParallaxMaskView.prototype;
	var _super  = MSBasicView.prototype;
		
	/*-------------- METHODS --------------*/
	
	p._horizUpdate = function(controller , value){
		_super._horizUpdate.call(this , controller , value);
		
		var i = 0;
		
		if(this.css3) {
			for(i = 0 ; i < this.slidesCount ; ++i){
				this.slideList[i].$element[0].style[window._jcsspfx + 'Transform'] = 'translateX('+(value - this.slideList[i].position) * MSParallaxMaskView.parallaxAmount +'px)'+ this.__translate_end;
			}
			return;
		}
		
		for(i = 0 ; i < this.slidesCount ; ++i){
			this.slideList[i].$element[0].style.left = (value - this.slideList[i].position) * MSParallaxMaskView.parallaxAmount  + 'px';	
		}
			
	};
	
	p._vertiUpdate = function(controller , value){
		
		_super._vertiUpdate.call(this , controller , value);
		
		var i = 0;
		
		if(this.css3) {
			for(i = 0 ; i < this.slidesCount ; ++i){
				this.slideList[i].$element[0].style[window._jcsspfx + 'Transform'] = 'translateY('+(value - this.slideList[i].position) * MSParallaxMaskView.parallaxAmount +'px)'+ this.__translate_end;
			}
			return;
		}
		
		for(i = 0 ; i < this.slidesCount ; ++i){
			this.slideList[i].$element[0].style.top = (value - this.slideList[i].position) * MSParallaxMaskView.parallaxAmount  + 'px';	
		}
			
	};
	
	
	MSSlideController.registerView('parallaxMask' , MSParallaxMaskView);
})(jQuery);
