;(function($){
	
	"use strict";
	
	window.MSScaleView = function(options){
		MSBasicView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-scale-view');
		this.controller.renderCallback(this.__update , this);
	};
	
	MSScaleView.extend(MSFadeView);
	
	var p  = MSScaleView.prototype;
	var _super  = MSFadeView.prototype;
	 
	/*-------------- METHODS --------------*/

	p.__updateSlides = function(slide , distance){
		var value =  Math.abs(distance / this[this.__dimension]),
			element = slide.$element[0]; 

		if(1 - value <= 0){
			element.style.opacity = 0;
			element.style.visibility = 'hidden';
			element.style[window._jcsspfx + 'Transform'] = '';
		}else{
			element.style.opacity = 1 - value;
			element.style.visibility = '';
			element.style[window._jcsspfx + 'Transform'] = 'perspective(2000px) translateZ('+(value* (distance < 0 ? -0.5 : 0.5)) * 300+'px)';
		}
		
	};
	
	p.create = function(index){
		_super.create.call(this , index);
		this.controller.options.minValidDist = 0.03;
	};
	
	MSSlideController.registerView('scale' , MSScaleView);
})(jQuery);