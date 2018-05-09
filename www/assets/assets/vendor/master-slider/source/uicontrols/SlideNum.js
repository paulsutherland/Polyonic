;(function($){
	
	"use strict";
	
	var MSSlideNum = function(options){
		BaseControl.call(this);
		
		this.options.splitchar = "/";
		
		$.extend(this.options , options);
	};
	
	MSSlideNum.extend(BaseControl);
	
	var p = MSSlideNum.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		_super.setup.call(this);
		this.$element = $('<div></div>')
						.addClass(this.options.prefix + 'slide-num')
						.appendTo(this.cont);	

		this.checkHideUnder(); // super method	
	};
	
	p.create = function(){
		_super.create.call(this);
		var that = this;
									
		this.slider.api.addEventListener(MSSliderEvent.CHANGE_START , this.update , this);
		this.total = this.slider.api.count();  
		this.update();
	};
	
	p.update = function(){
		this.$element.html( (this.slider.api.index() + 1) + this.options.splitchar  + this.total);
	};

	p.destroy = function(){
		_super.destroy();
		this.slider.api.removeEventListener(MSSliderEvent.CHANGE_START , this.update , this);
		this.$element.remove();
	};
	
	window.MSBulltes = MSBulltes;
	
	MSSlideController.registerControl('slidenum' , MSSlideNum);
	
})(jQuery);
