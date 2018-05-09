/**
 * Master Slider Partial Wave View
 * @version 1.0
 * @author averta
 * @extends {MSWaveView}
 */

;(function(){
	
	window.MSPartialWaveView = function(options){
		MSWaveView.call(this , options);
		this.$element.removeClass('ms-wave-view').addClass('ms-partial-wave-view');
	};
	
	MSPartialWaveView.extend(MSWaveView);
	MSPartialWaveView._3dreq = true;
	MSPartialWaveView._fallback = MSFadeBasicView;
	
	var p = MSPartialWaveView.prototype;
	var _super = MSWaveView.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.__updateSlidesHoriz = function(slide , distance){
		var value =  Math.abs(distance * 100 / this.__width);
		if( slide.hasBG ){
			slide.$bg_img.css('opacity' , (100 -  Math.abs(distance * 120 / this.__width / 3)) / 100);	
		}
		slide.$element.css(window._csspfx + 'transform' , 'translateZ('+ -value * 3 +'px) rotateY(0.01deg) translateX('+distance*0.75+'px)');
	};
	
	p.__updateSlidesVertic = function(slide , distance){
		var value =  Math.abs(distance * 100 / this.__width);
		if( slide.hasBG ){
			slide.$bg_img.css('opacity' , (100 -  Math.abs(distance * 120 / this.__width / 3)) / 100);
		}
		slide.$element.css(window._csspfx + 'transform' , 'translateZ('+ -value * 3 +'px) rotateY(0.01deg) translateY('+distance*0.75+'px)');
	};
	
	MSSlideController.registerView('partialWave' , MSPartialWaveView);
	
})();