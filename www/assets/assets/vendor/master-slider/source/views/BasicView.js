;(function($){

	"use strict";

	window.MSBasicView = function(options){

		this.options = {
			loop 			: false,
			dir  			: 'h',
			autoHeight 		: false,
			spacing			: 5,
			mouseSwipe		: true,
			swipe			: true,
			speed			: 17,
			minSlideSpeed	: 2,
			viewNum			: 20,
			critMargin		: 1
		};

		$.extend(this.options , options);

		this.dir		= this.options.dir;
		this.loop   	= this.options.loop;
		this.spacing	= this.options.spacing;

		this.__width  = 0;
		this.__height = 0;

		this.__cssProb 		= this.dir === 'h' ? 'left'    : 'top';
		this.__offset 		= this.dir === 'h' ? 'offsetLeft' : 'offsetTop';
		this.__dimension    = this.dir === 'h' ? '__width' : '__height';

		this.__translate_end	= window._css3d ? ' translateZ(0px)' : '';

		this.$slideCont	= $('<div></div>').addClass('ms-slide-container');
		this.$element 	= $('<div></div>').addClass('ms-view').addClass('ms-basic-view').append(this.$slideCont);

		this.currentSlide 	= null;
		this.index 			= -1;
		this.slidesCount	= 0;

		this.slides			= [];
		this.slideList		= []; // All of slides with added priority sort;
		this.viewSlidesList = [];

		this.css3 			= window._cssanim;
		this.start_buffer = 0;
		this.firstslide_snap = 0;

		this.slideChanged 	= false;

		this.controller 	 = new Controller(0 , 0 , {
			snapping	     : true,
			snapsize		 : 100,
			paging			 : true,
			snappingMinSpeed : this.options.minSlideSpeed,
			friction		 : (100 - this.options.speed * 0.5) / 100,
			endless			 : this.loop
		});

		this.controller.renderCallback(this.dir === 'h'? this._horizUpdate : this._vertiUpdate , this);
		this.controller.snappingCallback(this.__snapUpdate , this);
		this.controller.snapCompleteCallback(this.__snapCompelet , this);

		averta.EventDispatcher.call(this);
	};

	var p = MSBasicView.prototype;

	/*-------------- METHODS --------------*/

	p.__snapCompelet = function(snap , type){
		// if(this.loop && Math.abs(this.__contPos) > 20000){
		// 	this.__locateSlides();
		// 	this.gotoSlide(this.index , true);
		// }
		//

		if ( !this.slideChanged ) {
			return;
		}

		this.slideChanged = false;

		this.__locateSlides();
		this.start_buffer = 0;
		this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_END));
	};

	p.__snapUpdate = function(controller , snap , change){

		if(this.loop){
			var target_index = this.index + change;
			this.updateLoop(target_index);

			if(target_index >= this.slidesCount)	target_index = target_index - this.slidesCount;
			if(target_index <  0)					target_index = this.slidesCount + target_index;

			this.index = target_index;
		}else{
			if(snap < 0 ||  snap >= this.slidesCount) return
			this.index = snap;
		}

		this._checkCritMargins();

		if($.browser.mozilla){
			this.slideList[this.index].$element[0].style.marginTop 	= '0.1px';
			if(this.currentSlide){
				this.currentSlide.$element[0].style.marginTop 	= '';
			}
		}
		var new_slide = this.slideList[this.index];
		if(new_slide === this.currentSlide)return;
		this.currentSlide = new_slide;

		if ( this.autoUpdateZIndex ) {
			this.__updateSlidesZindex();
		}

		this.slideChanged = true;
		this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_START));
	};


	p._checkCritMargins = function(){
		if(this.normalMode) return;

		var hlf 	= Math.floor(this.options.viewNum / 2),
			inView 	= this.viewSlidesList.indexOf(this.slideList[this.index]),
			size 	= (this[this.__dimension] + this.spacing),
			cm 		= this.options.critMargin;

		if(this.loop){
			if(inView <= cm || inView >= this.viewSlidesList.length - cm){
				size *= (inView - hlf);
				this.__locateSlides(false ,  size + this.start_buffer );
				this.start_buffer += size;
			}

			return;
		}

		if( (inView < cm && this.index >= cm ) || (inView >= this.viewSlidesList.length - cm && this.index < this.slidesCount - cm)){
			this.__locateSlides(false);
		}

	};


	p._vertiUpdate = function(controller , value){

		this.__contPos = value;
		this.dispatchEvent(new MSViewEvents(MSViewEvents.SCROLL));

		if(this.css3){
			this.$slideCont[0].style[window._jcsspfx + 'Transform'] = 'translateY('+-value+'px)' + this.__translate_end;
			return;
		}

		this.$slideCont[0].style.top = -value + 'px';

	};

	p._horizUpdate = function(controller , value){

		this.__contPos = value;
		this.dispatchEvent(new MSViewEvents(MSViewEvents.SCROLL));

		if(this.css3) {
			this.$slideCont[0].style[window._jcsspfx + 'Transform'] = 'translateX('+-value+'px)'+ this.__translate_end;
			return;
		}

		this.$slideCont[0].style.left = -value + 'px';

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

		for (i = 0 , l = temp.length ; i !== l ; i++)
			if( this.viewSlidesList.indexOf(temp[i]) === -1)
				temp[i].sleep();

		temp = null;

		if( this.currentSlide ) {
			this.__updateSlidesZindex();
		}
	};

	p.__locateSlides = function(move , start){

		this.__updateViewList();

		start = !this.loop ? this.slides.indexOf(this.viewSlidesList[0]) * (this[this.__dimension] + this.spacing ) : start || 0;

		// old method
		/*for(i = 0; i < this.slidesCount ; ++i){
			var pos =  i * (this[this.__dimension] + this.spacing);

			this.slides[i].position = pos;
			this.slides[i].$element[0].style[this.__cssProb] =  pos + 'px';
		}*/

		var l = this.viewSlidesList.length , slide;

		for(var i = 0; i !== l ; i++){
			var pos =  start + i * (this[this.__dimension] + this.spacing );
			slide = this.viewSlidesList[i];
			slide.wakeup();
			slide.position = pos;
			slide.$element[0].style[this.__cssProb] =  pos + 'px';
		}

		if(move !== false)this.controller.changeTo( this.slideList[this.index].position , false , null , null , false);

	};

	p.__createLoopList = function(){
		var return_arr = [];
		var i = 0,
			count = this.slidesCount / 2;

		var before_count  = (this.slidesCount % 2 === 0)? count - 1	: Math.floor(count);
		var after_count	  = (this.slidesCount % 2 === 0)? count 	: Math.floor(count);

		this.currentSlideLoc = before_count;

		// before
		for(i = 1 ; i <= before_count ; ++i)
			return_arr.unshift(this.slideList[(this.index - i < 0)? this.slidesCount -  i + this.index: this.index - i]);

		// current
		return_arr.push(this.slideList[this.index]);

		// after
		for(i = 1; i <= after_count; ++i)
			return_arr.push(this.slideList[(this.index + i >= this.slidesCount)? this.index + i - this.slidesCount : this.index + i]);

		return return_arr;

	};

	/*
	 * Calculate shortest distance from index to target.
	 * It will used in loop gesture.
	 *
	 * Negative values means left direction.
	 */

	p.__getSteps = function(index , target){
		var right = (target < index)?  this.slidesCount - index + target : target - index;
		var left  = Math.abs(this.slidesCount - right);

		return (right < left)? right : -left;
	};

	p.__pushEnd = function(){
		var first_slide = this.slides.shift();
		var last_slide = this.slides[this.slidesCount - 2];

		this.slides.push(first_slide);

		if(!this.normalMode) return;

		var pos = last_slide.$element[0][this.__offset] + this.spacing + this[this.__dimension];
		first_slide.$element[0].style[this.__cssProb] = pos + 'px';
		first_slide.position = pos;
	};

	p.__pushStart = function(){
		var last_slide =  this.slides.pop();
		var first_slide = this.slides[0];

		this.slides.unshift(last_slide);

		if(!this.normalMode) return;

		var pos = first_slide.$element[0][this.__offset] - this.spacing - this[this.__dimension];
		last_slide.$element[0].style[this.__cssProb] = pos + 'px';
		last_slide.position = pos;
	};

	// @since 1.7.0
	// adds z-index to slides
	p.__updateSlidesZindex = function(){


		var slide,
			l = this.viewSlidesList.length,
			hlf = Math.floor( l/2 );

		if( this.loop ){
			var loc = this.viewSlidesList.indexOf(this.currentSlide);
			for ( var i = 0; i!==l; i++ ){
				slide = this.viewSlidesList[i];
				this.viewSlidesList[i].$element.css('z-index', i<=loc ? i+1 : l-i);
			}
		} else {

			var beforeNum = this.currentSlide.index - this.viewSlidesList[0].index,
				afterNum = l - beforeNum,
				diff = beforeNum - afterNum;

			for ( var i = 0; i!==l; i++ ){
				this.viewSlidesList[i].$element.css('z-index', i<=beforeNum ? i+1 : l-i);
			}

			this.currentSlide.$element.css('z-index', l);
		}

	};

	p.addSlide = function(slide){
		slide.view = this;
		this.slides.push(slide);
		this.slideList.push(slide);
		this.slidesCount++;
	};

	p.appendSlide = function(slide){
		this.$slideCont.append(slide.$element);
	};

	p.updateLoop = function(index){
		if(this.loop){
			var steps = this.__getSteps(this.index , index);

			for(var i = 0 , l = Math.abs(steps) ; i < l ; ++ i){
				if(steps < 0) 	this.__pushStart();
				else			this.__pushEnd();
			}
		}
	};

	p.gotoSlide = function(index , fast){
		this.updateLoop(index);
		this.index = index;

		var target_slide = this.slideList[index];

		this._checkCritMargins();

		this.controller.changeTo( target_slide.position , !fast , null , null , false);
		if(target_slide === this.currentSlide) return;
		this.slideChanged = true;
		this.currentSlide = target_slide;

		if ( this.autoUpdateZIndex ) {
			this.__updateSlidesZindex();
		}

		this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_START));
		if(fast)this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_END));
	};

	p.next = function(checkLoop){
		if ( checkLoop && !this.loop && this.index + 1 >= this.slidesCount ) {
			this.controller.bounce(10);
			return;
		}

		this.gotoSlide((this.index + 1 >= this.slidesCount)? 0 : this.index + 1);
	};

	p.previous = function(checkLoop){
		if ( checkLoop && !this.loop && this.index - 1 < 0 ) {
			this.controller.bounce(-10);
			return;
		}

		this.gotoSlide((this.index - 1 < 0)? this.slidesCount - 1 : this.index - 1);
	};

	/* --------------- Swipe control ------------------*/

	p.setupSwipe = function(){

		this.swipeControl = new averta.TouchSwipe(this.$element);
		this.swipeControl.swipeType = this.dir === 'h'? 'horizontal' : 'vertical';
		var that = this;

		if(this.dir === 'h'){
			this.swipeControl.onSwipe = function(status){
				that.horizSwipeMove(status);
			};
		}else{
			this.swipeControl.onSwipe = function(status){
				that.vertSwipeMove(status);
			};
		}

	};

	p.vertSwipeMove = function(status){
		var phase = status.phase;
		if(phase === 'start'){
			this.controller.stop();
			this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_START, status));
		}else if(phase === 'move' && (!this.loop || Math.abs(this.currentSlide.position - this.controller.value + status.moveY ) < this.cont_size / 2)){
			this.controller.drag(status.moveY);
			this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_MOVE, status));
		}else if(phase === 'end' || phase === 'cancel'){

            var speed = status.distanceY / status.duration * 50/3,
			    speedh = Math.abs( status.distanceY / status.duration * 50/3 );

			if ( Math.abs(speed) > 0.1 && Math.abs(speed) >= speedh ){
				this.controller.push(-speed);
				if(speed > this.controller.options.snappingMinSpeed)
				this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_END, status));
			}else {
				this.controller.cancel();
				this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_CANCEL, status));
			}

		}
	};

	p.horizSwipeMove = function(status){
		var phase = status.phase;

		if(phase === 'start'){
			this.controller.stop();
			this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_START, status));
		}else if(phase === 'move' && (!this.loop || Math.abs(this.currentSlide.position - this.controller.value + status.moveX ) < this.cont_size / 2)){
			this.controller.drag(status.moveX);
			this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_MOVE, status));
		}else if(phase === 'end' || phase === 'cancel'){

			var speed = status.distanceX / status.duration * 50/3,
                speedv = Math.abs( status.distanceY / status.duration * 50/3 );

			if ( Math.abs(speed) > 0.1 && Math.abs(speed) >= speedv ) {
				this.controller.push(-speed );
				if(speed > this.controller.options.snappingMinSpeed)
				this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_END, status));
			}else{
				this.controller.cancel();
				this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_CANCEL, status));
			}

		}
	};

	/* ------------------------------------------------*/

	p.setSize = function(width , height , hard){
		if(this.lastWidth === width && height === this.lastHeight && !hard) return;

		this.$element.width(width).height(height);

		for(var i = 0; i < this.slidesCount ; ++i)
				this.slides[i].setSize(width , height , hard);

		this.__width 	= width;
		this.__height 	= height;

		if(this.__created){
			this.__locateSlides();

			this.cont_size = (this.slidesCount - 1) * (this[this.__dimension] + this.spacing);
			if(!this.loop) 	this.controller._max_value = this.cont_size;

			this.controller.options.snapsize = this[this.__dimension] + this.spacing;
			this.controller.changeTo(this.currentSlide.position , false , null , null , false );
			this.controller.cancel();

			this.lastWidth = width;
			this.lastHeight = height;
		}
	};

	p.create = function(index){

		this.__created = true;

		this.index = Math.min((index || 0), this.slidesCount - 1);
		this.lastSnap = this.index; // it will be used to check snap changed or not on snap complete

		if(this.loop)
			this.slides = this.__createLoopList();

		this.normalMode = this.slidesCount <= this.options.viewNum;

		for(var i = 0; i < this.slidesCount ; ++i)
			this.slides[i].create();

		this.__locateSlides();

		this.controller.options.snapsize = this[this.__dimension] + this.spacing;
		if(!this.loop)	this.controller._max_value = (this.slidesCount - 1) * (this[this.__dimension] + this.spacing);

		this.gotoSlide(this.index , true);

		if(this.options.swipe && (window._touch || this.options.mouseSwipe))
			this.setupSwipe();

	};

	p.destroy = function(){
		if(!this.__created) return;

		for(var i = 0; i < this.slidesCount ; ++i)
			this.slides[i].destroy();

		this.slides = null;
		this.slideList = null;
		this.$element.remove();

		this.controller.destroy();
		this.controller = null;
	};

	averta.EventDispatcher.extend(p);

	MSSlideController.registerView('basic' , MSBasicView);

})(jQuery);
