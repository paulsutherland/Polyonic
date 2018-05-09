/**
 * Master Slider Scroll To Action Plugin.
 * 
 * @description This plugins adds page scrolling actions to the layer actions list.
 * @version  1.0.0
 * @author Averta
 * @package MasterSlider jQuery
 */

;(function($, document, window){

	// check if master slider is available
	if ( !window.MasterSlider ) {
		return;
	}

	var ScrollToAction = function ( slider ) {
		this.slider = slider;
		slider.api.addEventListener(MSSliderEvent.INIT, this.init, this);
	};

	ScrollToAction.name = 'MSScrollToAction';
	var p = ScrollToAction.prototype;

	/**
	 * initiate the plugin
	 */
	p.init = function (){
		var api = this.slider.api;
		
		// define actions
		api.scrollToEnd = _scrollToEnd;
		api.scrollTo = _scrollTo;
	};

	/**
	 * destroy the plugin
	 */
	p.destroy = function(){};

	/**
	 * Scroll window to the target element in page
	 * @param {Number} duration animation duration (seconds)
	 */
	var _scrollTo = function ( target, duration ) {
		var sliderEle = this.slider.$element,
			target = $(target).eq(0);

		if ( target.length === 0 ) {
			return;
		}
		console.log(target.offset().top, duration )

		if( duration == null ) {
			duration = 1.4;
		}

		$('html, body').animate({
			scrollTop: target.offset().top
		}, duration * 1000, 'easeInOutQuad');
	};

	/**
	 * Scroll window to the bottom of slider
	 * @param {Number} duration animation duration (seconds)
	 */
	var _scrollToEnd = function ( duration ) {
		var sliderEle = this.slider.$element;

		if( duration == null ) {
			duration = 1.4;
		}

		$('html, body').animate({
			scrollTop: sliderEle.offset().top + sliderEle.outerHeight(false)
		}, duration * 1000, 'easeInOutQuad');
	}

	// install plugin to master slider
	MasterSlider.registerPlugin( ScrollToAction );

})(jQuery, document, window);