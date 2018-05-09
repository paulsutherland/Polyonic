;(function($){
	
	"use strict";
	
	var MSTimerbar = function(options){
		BaseControl.call(this);

		this.options.autohide = false;
		this.options.width 		= 4;
		this.options.color 		= '#FFFFFF';
		this.options.inset 		= true;
		this.options.margin 	= 0;

		$.extend(this.options , options);
	};
	
	MSTimerbar.extend(BaseControl);
	
	var p = MSTimerbar.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		var that = this;
		_super.setup.call(this);
		
		this.$element = $('<div></div>')
					.addClass(this.options.prefix + 'timerbar');
		
		_super.setup.call(this);
	
		if( this.slider.$controlsCont === this.cont ){
			this.$element.appendTo(this.slider.$element);
		}else{
			this.$element.appendTo(this.cont);
		}

		this.$bar = $('<div></div>')
					.addClass('ms-time-bar')
					.appendTo(this.$element);

		// change width 
		if( this.options.dir === 'v' ){
			this.$bar.width(this.options.width);
			this.$element.width(this.options.width);
		} else {
			this.$bar.height(this.options.width);
			this.$element.height(this.options.width);
		}

		// change color
		this.$bar.css('background-color', this.options.color);
		
		if( !this.options.insetTo && this.options.align ){
			
			this.$element.css({
				top:'auto',
				bottom:'auto'
			});

			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin );
			}else if( align === 'top' ){
				this.$element.prependTo(this.slider.$element).css({
					'margin-bottom': this.options.margin,
					'position': 'relative'
				});
			}else if( align === 'bottom' ){
				this.$element.css({
					'margin-top': this.options.margin,
					'position': 'relative'
				});
			}else{
				this.slider.api.addEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
				this.align();
			}
		}

		this.checkHideUnder(); // super method
		
	};

	/**
	 * calls by "RESERVED_SPACE_CHGANE" realigns the control in slider
	 * @since 1.5.7
	 */
	p.align = function(event){
		if( this.detached ){
			return;
		}

		var align = this.options.align;
		var pos = this.slider.reserveSpace(align, this.options.margin * 2 + this.options.width);
		this.$element.css(align, -pos - this.options.margin - this.options.width);
	};
	
	p.create = function(){
		_super.create.call(this);
		this.slider.api.addEventListener(MSSliderEvent.WAITING , this._update , this);
		this._update();
	};
	
	p._update = function(){
		this.$bar[0].style.width = this.slider.api._delayProgress  + '%';
	};
	
	p.destroy = function(){
		_super.destroy();
		this.slider.api.removeEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
		this.slider.api.removeEventListener(MSSliderEvent.WAITING , this._update , this);
		this.$element.remove();
	};
	
	window.MSTimerbar = MSTimerbar;
	MSSlideController.registerControl('timebar' , MSTimerbar);
})(jQuery);
