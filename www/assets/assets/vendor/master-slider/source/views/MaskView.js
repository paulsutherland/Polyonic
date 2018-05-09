;(function($){
	
	"use strict";
	
	window.MSMaskView = function(options){
		MSBasicView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-mask-view');
		
	};
	
	MSMaskView.extend(MSBasicView);
	
	var p  = MSMaskView.prototype;
	var _super  = MSBasicView.prototype;
		
	/*-------------- METHODS --------------*/
	
	p.addSlide = function(slide){ // OK
		slide.view = this;
		
		slide.$frame = $('<div></div>').addClass('ms-mask-frame').append(slide.$element);
		slide.$element[0].style.position = 'relative';
		//this.$slideCont.append(slide.$frame);
		slide.autoAppend = false;

		this.slides.push(slide);
		this.slideList.push(slide);
		
		this.slidesCount++;
	};
	
	p.setSize = function(width , height){
		var slider = this.slides[0].slider;
		
		for(var i = 0; i < this.slidesCount ; ++i){
			this.slides[i].$frame[0].style.width  = width  + 'px';
			if(!slider.options.autoHeight)
				this.slides[i].$frame[0].style.height = height + 'px';
		}
		
		_super.setSize.call(this , width , height);
	};
	
	// p.__snapUpdate = function(controller , snap , change){
		
	// 	if(this.loop){
	// 		var target_index = this.index + change;
	// 		this.updateLoop(target_index);

	// 		if(target_index >= this.slidesCount)	target_index = target_index - this.slidesCount;
	// 		if(target_index <  0)					target_index = this.slidesCount + target_index;
		
	// 		this.index = target_index;
	// 	}else{
	// 		if(snap < 0 ||  snap >= this.slidesCount) return
	// 		this.index = snap;
	// 	}
		
		
	// 	this._checkCritMargins();

	// 	if($.browser.mozilla){
			
	// 		this.slideList[this.index].$frame[0].style.marginTop 	= '0.1px';
	// 		this.slideList[this.index].$element[0].style.marginTop 	= '0.1px';
			
	// 		if(this.currentSlide){
	// 			this.currentSlide.$frame[0].style.marginTop 	= '';
	// 			this.currentSlide.$element[0].style.marginTop 	= '';
	// 		}
	// 	}
		
	// 		var new_slide = this.slideList[this.index];
	// 	if(new_slide === this.currentSlide)return;
		
	// 	this.currentSlide = new_slide;
	// 	this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_START));		
	// };
	
	p._horizUpdate = function(controller , value){
		
		_super._horizUpdate.call(this , controller , value);
		
		var i = 0;
		
		if(this.css3) {
			for(i = 0 ; i < this.slidesCount ; ++i){
				this.slideList[i].$element[0].style[window._jcsspfx + 'Transform'] = 'translateX('+(value - this.slideList[i].position)+'px)'+ this.__translate_end;
			}
			return;
		}
		
		for(i = 0 ; i < this.slidesCount ; ++i){
			this.slideList[i].$element[0].style.left = (value - this.slideList[i].position) + 'px';	
		}
			
	};
	
	p._vertiUpdate = function(controller , value){
		
		_super._vertiUpdate.call(this , controller , value);
		
		var i = 0;
		
		if(this.css3) {
			for(i = 0 ; i < this.slidesCount ; ++i){
				this.slideList[i].$element[0].style[window._jcsspfx + 'Transform'] = 'translateY('+(value - this.slideList[i].position)+'px)'+ this.__translate_end;
			}
			return;
		}
		
		for(i = 0 ; i < this.slidesCount ; ++i){
			this.slideList[i].$element[0].style.top = (value - this.slideList[i].position) + 'px';	
		}
			
	};
	
	p.__pushEnd = function(){ // OK
		var first_slide = this.slides.shift();
		var last_slide = this.slides[this.slidesCount - 2];
		
		this.slides.push(first_slide);
		if(!this.normalMode) return;

		var pos = last_slide.$frame[0][this.__offset] + this.spacing + this[this.__dimension];
		first_slide.$frame[0].style[this.__cssProb] = pos + 'px';
		first_slide.position = pos;
	};
	
	p.__pushStart = function(){ // OK
		
		var last_slide =  this.slides.pop();
		var first_slide = this.slides[0];
		
		this.slides.unshift(last_slide);
		
		if(!this.normalMode) return;
		
		var pos = first_slide.$frame[0][this.__offset] - this.spacing - this[this.__dimension];
		last_slide.$frame[0].style[this.__cssProb] = pos + 'px';
		last_slide.position = pos;
	};
	
	p.__updateViewList = function(){

			if(this.normalMode) {
			this.viewSlidesList = this.slides;
			return;
		}

		var temp = this.viewSlidesList.slice();

		// update view list 
		this.viewSlidesList = [];	
		var i = 0 , hlf = Math.floor(this.options.viewNum / 2) , l;

		if(this.loop){
			for(; i !== this.options.viewNum ; i++)
				this.viewSlidesList.push(this.slides[this.currentSlideLoc - hlf + i]);
		}else{
			// before
			for(i = 0 ; i !== hlf && this.index - i !== -1 ; i++)
				this.viewSlidesList.unshift(this.slideList[this.index - i]);	
			// after
			for(i = 1; i !== hlf && this.index + i !== this.slidesCount; i++)
				this.viewSlidesList.push(this.slideList[this.index + i]);
		}

		for (i = 0 , l = temp.length ; i !== l ; i++){
			if( this.viewSlidesList.indexOf(temp[i]) === -1){
				temp[i].sleep();
				temp[i].$frame.detach();
			}
		}

		temp = null;
	};


	p.__locateSlides = function(move , start){ // OK

		this.__updateViewList();

		start = !this.loop ? this.slides.indexOf(this.viewSlidesList[0]) * (this[this.__dimension] + this.spacing ) : start || 0; 

		// Old method
		// for(var i = 0; i < this.slidesCount ; ++i){
		// 	var pos =  i * (this[this.__dimension] + this.spacing);
			
		// 	this.slides[i].position = pos;
		// 	this.slides[i].$frame[0].style[this.__cssProb] =  pos + 'px';
		// }

		var l = this.viewSlidesList.length , slide;
		
		for(var i = 0; i !== l ; i++){
			var pos =  start + i * (this[this.__dimension] + this.spacing );
			slide = this.viewSlidesList[i];

			this.$slideCont.append(slide.$frame);
			slide.wakeup(false);
			slide.position = pos;

			if ( slide.selected && slide.bgvideo ) {
				try{
					slide.bgvideo.play();
				} catch (e) {}
			}

			slide.$frame[0].style[this.__cssProb] =  pos + 'px';
		}

		if(move !== false)this.controller.changeTo( this.slideList[this.index].position , false , null , null , false);

	};
	
	MSSlideController.registerView('mask' , MSMaskView);
})(jQuery);
