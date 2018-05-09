;(function($){
	
	"use strict";
	
	window.MSFadeView = function(options){
		MSBasicView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-fade-view');
		this.controller.renderCallback(this.__update , this);
	};
	
	MSFadeView.extend(MSBasicView);
	
	var p  = MSFadeView.prototype;
	var _super  = MSBasicView.prototype;
	 
	/*-------------- METHODS --------------*/
	
	p.__update = function(controller , value){
		var cont_scroll = -value;
		var slide_pos , slide , distance;
		
		for(var i = 0; i < this.slidesCount; ++i){
			slide = this.slideList[i];
			distance = -cont_scroll - slide.position;
			this.__updateSlides(slide , distance);
		}
	};
	
	p.__updateSlides = function(slide , distance){
		var value =  Math.abs(distance / this[this.__dimension]);
		if(1 - value <= 0){
			slide.$element.fadeTo(0 , 0).css('visibility' , 'hidden');	
		}else{
			slide.$element.fadeTo(0 , 1 - value).css('visibility' , '');
		}
	};
	
	p.__locateSlides = function(move , start){

		this.__updateViewList();

		// Old method
		// for(var i = 0; i < this.slidesCount ; ++i){
		// 	this.slides[i].position = i * this[this.__dimension];
		// }

		start = !this.loop ? this.slides.indexOf(this.viewSlidesList[0]) * (this[this.__dimension] + this.spacing ) : start || 0; 

		var l = this.viewSlidesList.length , slide;
		
		for(var i = 0; i !== l ; i++){
			var pos =  start + i * this[this.__dimension];
			slide = this.viewSlidesList[i];
			slide.wakeup();
			slide.position = pos;
		}

		if(move !== false)this.controller.changeTo( this.slideList[this.index].position , false , null , null , false);

	};
	
	p.__pushEnd = function(){
		var first_slide = this.slides.shift();
		var last_slide = this.slides[this.slidesCount - 2];
		this.slides.push(first_slide);
		first_slide.position = last_slide.position + this[this.__dimension];
	};
	
	p.__pushStart = function(){
		var last_slide =  this.slides.pop();
		var first_slide = this.slides[0];
		this.slides.unshift(last_slide);		
		last_slide.position = first_slide.position - this[this.__dimension];
	};
	
	p.create = function(index){
		_super.create.call(this , index);
		this.spacing = 0;
		this.controller.options.minValidDist = 10;
	};
	
	MSSlideController.registerView('fade' , MSFadeView);
})(jQuery);