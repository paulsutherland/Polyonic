/**
 * Master Slider Fade Flow View
 * @author averta
 * @extends {MSWaveView}
 * @version 1.0
 */
;(function(){
	
	window.MSFadeFlowView = function(options){
		MSWaveView.call(this , options);
		this.$element.removeClass('ms-wave-view').addClass('ms-fade-flow-view');
	};
	
	MSFadeFlowView.extend(MSWaveView);
	MSFadeFlowView._3dreq = true;

	var p = MSFadeFlowView.prototype;
	var _super = MSWaveView.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.__calculate = function(distance){
		var value = Math.min(Math.abs(distance * 100 / this.__width) , 100);
		var rvalue =  Math.min(value * 0.5 , 50) * (distance < 0 ? -1 : 1);
		return {value: value, rvalue: rvalue};
	};

	p.__updateSlidesHoriz = function(slide , distance){
		var clc = this.__calculate(distance);
		slide.$element.css('opacity' , 1-clc.value/300);
		console.log(window._jcsspfx + 'transform','translateZ('+ -clc.value +'px) rotateY(' + clc.rvalue + 'deg) ')
		slide.$element[0].style[window._jcsspfx + 'Transform'] = 'translateZ('+ -clc.value +'px) rotateY(' + clc.rvalue + 'deg) ';
	};
	
	p.__updateSlidesVertic = function(slide , distance){
		var clc = this.__calculate(distance);
		slide.$element.css('opacity' , 1-clc.value/300);
		slide.$element[0].style[window._jcsspfx + 'Transform'] = 'translateZ('+ -clc.value +'px) rotateX(' + -clc.rvalue + 'deg) ';
	};
	
	MSSlideController.registerView('fadeFlow' , MSFadeFlowView);
	
})();