;(function($){
	
	"use strict";
	
	window.MSSkewView = function(options){
		MSWaveView.call(this , options);
		this.$element.removeClass('ms-wave-view').addClass('ms-flow-view');
		//this.$slideCont.css(window._csspfx + 'transform-style' , 'preserve-3d');
	};
	
	MSSkewView.extend(MSWaveView);
	MSSkewView._3dreq = true;
	MSSkewView._fallback = MSFadeBasicView;
	
	var p  = MSSkewView.prototype;
	var _super  = MSWaveView.prototype;
	 
	/*-------------- METHODS --------------*/
	
	
	p.__updateSlidesHoriz = function(slide , distance){
		var value  =  Math.abs(distance * 100 / this.__width);
		var rvalue =  Math.min(value * 0.3 , 30) * (distance < 0 ? -1 : 1);
		var zvalue = distance % (this.__width / 2 ) * (distance < 0 ? -1 : 1);
		if(slide.index === 1)console.log(zvalue)
		slide.$element[0].style[window._jcsspfx + 'Transform'] = 'skewX('+ -zvalue/25 +'deg)';
	};
	
	p.__updateSlidesVertic  = function(slide , distance){
		var value  =  Math.abs(distance * 100 / this.__width);
		var rvalue =  Math.min(value * 0.3 , 30) * (distance < 0 ? -1 : 1);
		var zvalue = value * 1.2;
		slide.$element[0].style[window._jcsspfx + 'Transform'] = 'translateZ('+ -zvalue*5 +'px) rotateX(' + -rvalue + 'deg) ';
	};
		
	MSSlideController.registerView('skew' , MSSkewView);

})(jQuery);

