;(function($){

	"use strict";
	
	window.MSHotspotLayer = function(){
		MSLayerElement.call(this);
		
		this.__cssConfig = [
			'margin-top' 	,      'padding-top'	,
			'margin-bottom'	,      'padding-left'	,
			'margin-right'	,      'padding-right'	,
			'margin-left'	,      'padding-bottom' ,
			
			'left'			,       'right'			, 
			'top'			,       'bottom'		
		];
		
		
		this.ease = 'Expo'; 
		this.hide_start = true;
		this.type = 'hotspot';
	};
	
	MSHotspotLayer.extend(MSLayerElement);
	
	var p = MSHotspotLayer.prototype;
	var _super = MSLayerElement.prototype;
	
	/*-------------- METHODS --------------*/
	
	p._showTT = function(){
		if(!this.show_cl)  return;
		
		clearTimeout(this.hto);
		if(this._tween)	this._tween.stop(true);	
		
		if( this.hide_start ){
			this.align = this._orgAlign;
			this._locateTT();
			
			this.tt.css({display:'block'});
			this._tween = CTween.animate(this.tt , 900 , this.to , {ease:'easeOut'+this.ease});
			this.hide_start = false;
		}

	};
	
	p._hideTT = function(){
		if(!this.show_cl)  return;
		if(this._tween)	this._tween.stop(true);
		
		var that = this;
		
		clearTimeout(this.hto);
		this.hto = setTimeout(function(){
			that.hide_start = true;
			that._tween = CTween.animate(that.tt , 900 , that.from , {ease:'easeOut'+that.ease , complete:function(){that.tt.css('display' , 'none');}} );
		} , 200);
	};
	
	p._updateClassName = function(name){
		if(this._lastClass)	this.tt.removeClass(this._lastClass);
		this.tt.addClass(name);
		this._lastClass = name;
	}
	
	p._alignPolicy = function(){
		var h = this.tt.outerHeight(false),
		    w = Math.max(this.tt.outerWidth(false) , parseInt(this.tt.css('max-width'))),
		 	ww = window.innerWidth,
		 	wh = window.innerHeight;
		 	
		switch(this.align){
			case 'top':
				if(this.base_t < 0 )
					return 'bottom';
			break;
			case 'right':
				if(this.base_l + w > ww || this.base_t < 0)
					return 'bottom';
			break;
			case 'left':
				if(this.base_l < 0 || this.base_t < 0)
					return 'bottom';
			break;
		}
		
		return null;	
	};
		
	p._locateTT = function(){
		var os = this.$element.offset(),
		os2 = this.slide.slider.$element.offset();
		
		var dist = 50,
			space = 15 //* this.factor;
		
		this.pos_x = os.left - os2.left - this.slide.slider.$element.scrollLeft();
		this.pos_y = os.top - os2.top - this.slide.slider.$element.scrollTop();
		
		this.from = {opacity:0};
		this.to = {opacity:1};
		
		this._updateClassName('ms-tooltip-'+this.align);
		this.tt_arrow.css('margin-left' , '');
		
		var arrow_w = 15,//parseInt(this.tt_arrow.css('border-left')) + parseInt(this.tt_arrow.css('border-right')),
			arrow_h = 15;//parseInt(this.tt_arrow.css('border-top'))  + parseInt(this.tt_arrow.css('border-bottom'));
			
			//console.log(arrow_h,arrow_w);
		//
		switch(this.align){
			case 'top':
				var w = Math.min(this.tt.outerWidth(false) , parseInt(this.tt.css('max-width')));
				this.base_t = this.pos_y - this.tt.outerHeight(false) - arrow_h - space;
				this.base_l = this.pos_x - w/2;
				
				if(this.base_l + w > window.innerWidth){
					this.tt_arrow.css('margin-left' , -arrow_w/2 + this.base_l + w -window.innerWidth + 'px');
					this.base_l = window.innerWidth - w;
				}
				
				if(this.base_l < 0){
					this.base_l = 0;
					this.tt_arrow.css('margin-left' , -arrow_w/2 + this.pos_x - this.tt.outerWidth(false) / 2 + 'px');
				}
				
				if(window._css3d){
					this.from[window._jcsspfx+'Transform'] = 'translateY(-'+dist+'px)';
					this.to[window._jcsspfx+'Transform']   = '';
				}else{	
					this.from.top = (this.base_t - dist) + 'px';
					this.to.top = this.base_t + 'px';
				}

			break;
			case 'bottom':
				var w = Math.min(this.tt.outerWidth(false) , parseInt(this.tt.css('max-width')));
				
				this.base_t = this.pos_y + arrow_h + space;
				this.base_l = this.pos_x - w/2;
				
				if(this.base_l + w > window.innerWidth){
					this.tt_arrow.css('margin-left' , -arrow_w/2 + this.base_l + w -window.innerWidth + 'px');
					this.base_l = window.innerWidth - w;
				}
				
				if(this.base_l < 0){
					this.base_l = 0;
					this.tt_arrow.css('margin-left' , -arrow_w/2 + this.pos_x - this.tt.outerWidth(false) / 2 + 'px');
				}
				
				if(window._css3d){
					this.from[window._jcsspfx+'Transform'] = 'translateY('+dist+'px)';
					this.to[window._jcsspfx+'Transform'] = '';
				}else{
					this.from.top = (this.base_t + dist) + 'px';
					this.to.top = this.base_t + 'px';
				}
				
			break;
			
			case 'right':
				this.base_l = this.pos_x + arrow_w + space;
				this.base_t = this.pos_y - this.tt.outerHeight(false) / 2;
				
				if(window._css3d){
					this.from[window._jcsspfx+'Transform'] = 'translateX('+dist+'px)';
					this.to[window._jcsspfx+'Transform'] = '';
				}else{
					this.from.left = (this.base_l + dist) + 'px';
					this.to.left = this.base_l + 'px';
				}
				
			break;
			case 'left':
				this.base_l = this.pos_x - arrow_w - this.tt.outerWidth(false) - space;
				this.base_t = this.pos_y - this.tt.outerHeight(false) / 2;
				
				if(window._css3d){
					this.from[window._jcsspfx+'Transform'] = 'translateX(-'+dist+'px)';
					this.to[window._jcsspfx+'Transform'] = '';
				}else{
					this.from.left = (this.base_l - dist) + 'px';
					this.to.left = this.base_l + 'px';
				}
				
			break;
		}
		
		
		
		var policyAlign = this._alignPolicy();
		if(policyAlign !== null){
			this.align = policyAlign;
			this._locateTT();
			return;
		}
		
		this.tt.css('top'  ,parseInt(this.base_t)+'px').
				css('left' ,parseInt(this.base_l)+'px');
		
		this.tt.css(this.from);		
		
	};
	
	p.start = function(){
		_super.start.call(this);
		this.tt.appendTo(this.slide.slider.$element);
		//this._locateTT();
		this.tt.css('display' , 'none');
	};
	
	p.reset = function(){
		_super.reset.call(this);
		this.tt.detach();
	};
	
	/**
	 * locate hotspot over slide
	 * @override LayerElement.locate
	 * @since 2.2.0
	 */
/*	p.locate = function(){
		_super.locate.call(this);

		if ( this.relativeToBG ) {
			console.log(this.baseOffsetX , this.slide.$bg_img.width()  , this.slide.bgWidth)
			this.$element[0].style.left = this.baseOffsetX * this.slide.$bg_img.width()  / this.slide.bgWidth + 'px';
			this.$element[0].style.top  = this.baseOffsetY * this.slide.$bg_img.height() / this.slide.bgHeight + 'px';
		} 

	};
*/
	p.create = function(){
		var that = this;
		
		//@since 2.2.0
		//chnage offset progin to top left
	/*	this.relativeToBG = this.$element.data('relative') && (this.slide.fillMode === 'fill' || this.slide.fillMode === 'fit');
		if ( this.relativeToBG ) {

			var origin = this.$element.data('origin'),
				osy = this.$element.data('offset-y'), 
				osx = this.$element.data('offset-x');

			if ( origin ) {
				if ( origin.charAt(0) === 'b' ){
					osy = this.slide.slider.options.height - this.$element.data('offset-y');
					this.$element.data('offset-y',  osy);
				}

				if ( origin.charAt(1) === 'r' ){
					osx = this.slide.slider.options.width - this.$element.data('offset-x');
					this.$element.data('offset-x', osx);
				}

			}

			this.$element.data('origin', 'tl');

			this.baseOffsetX = osx;
			this.baseOffsetY = osy;
		}*/

		
		this._orgAlign = this.align = this.$element.data('align') !== undefined ? this.$element.data('align') : 'top';
		
		this.data = this.$element.html();
		
		this.$element.html('').on('mouseenter' , function(){that._showTT();}).on('mouseleave',function(){that._hideTT();});
		
		this.point = $('<div><div class="ms-point-center"></div><div class="ms-point-border"></div></div>')
					.addClass('ms-tooltip-point')
					.appendTo(this.$element);

		var link = this.$element.data('link'),
			target = this.$element.data('target');

		if( link ){
			this.point.on('click', function(){window.open(link , target || '_self');});
		}

		this.tt =  $('<div></div>')
					.addClass('ms-tooltip')
					//.addClass('ms-tooltip-'+this.align)
					.css('display','hidden')
					.css('opacity' , 0);

		// @since v1.6.1
		if( this.$element.data('width') !== undefined ){
			this.tt.css('width', this.$element.data('width'))
				   .css('max-width', this.$element.data('width'));
		}
		
		this.tt_arrow = $('<div></div>')
						.addClass('ms-tooltip-arrow')
						.appendTo(this.tt);
		
		this._updateClassName('ms-tooltip-'+this.align);
		
		this.ttcont = $('<div></div>')
					  .addClass('ms-tooltip-cont')
					  .html(this.data)
					  .appendTo(this.tt)


		if( this.$element.data('stay-hover') === true ) {
			this.tt.on('mouseenter' , function(){
				if( that.hide_start ){
					return
				}
				clearTimeout(that.hto);
				that._tween.stop(true);
				that._showTT();
			}).on('mouseleave', function(){
				that._hideTT();
			});
		}

		_super.create.call(this);
	};

})(jQuery);
