/**
 * Master Slider Layer Element
 * @author Averta
 * @package Master Slider jQuery
 */

;(function($){

	/**
	 * master slider layer element constructor
	 */
	window.MSLayerElement = function(){

		// default layer start animation
		this.start_anim = {
			name		: 'fade',
			duration	: 1000,
			ease 		: 'linear',
			delay		: 0
		};

		// default layer end animation
		this.end_anim = {
			duration	: 1000,
			ease 		: 'linear'
		};

		// default layer type
		this.type = 'text'; // video , image

		//this.swipe 		= true;
		this.resizable 	= true;
		this.minWidth 	= -1;
		this.isVisible  = true;

		// list of styles which should stores initial values and changes based on screen size for resizable layers
		this.__cssConfig = [
			'margin-top' 	,      'padding-top'	,
			'margin-bottom'	,      'padding-left'	,
			'margin-right'	,      'padding-right'	,
			'margin-left'	,      'padding-bottom' ,


			'font-size' 	,  		'line-height'	,
			/*'height'		, */	'width'			,
			'left'			,       'right'			,
			'top'			,       'bottom'
		];

		this.baseStyle = {};
	};

	var p = MSLayerElement.prototype;

	/*--------------------------------------------------*\
		Public Methods
	\*--------------------------------------------------*/

	/**
	 * determine start animation for the layer
	 * @param {Objec} anim
	 */
	p.setStartAnim = function(anim){
		$.extend(this.start_anim , anim); $.extend(this.start_anim, this._parseEff(this.start_anim.name));
		this.$element.css('visibility' , 'hidden');
	};

	/**
	 * determine end/hide animation for the layer
	 * @param {Object} anim
	 */
	p.setEndAnim = function(anim){
		$.extend(this.end_anim, anim);
	};

	/**
	 * create layer object from layer element
	 */
	p.create = function(){
		this.$element.css('display', 'none');

		// resizable layer
		this.resizable = this.$element.data('resize') !== false;

		// fixed positioning
		this.fixed = this.$element.data('fixed') === true;

		// hide under parameter
		if( this.$element.data('widthlimit') !== undefined ) {
			this.minWidth = this.$element.data('widthlimit');
		}

		if( !this.end_anim.name ) {
			this.end_anim.name = this.start_anim.name;
		}

		if( this.end_anim.time ) {
			this.autoHide = true;//this.end_anim.delay = this.slide.delay * 1000 - this.end_anim.duration;
		}

		// is this layer static?
		this.staticLayer = this.$element.data('position') === 'static';
		this.fixedLayer = this.$element.data('position') === 'fixed';
		this.layersCont = this.controller.$layers;

		// make it visible if it's static
		if ( this.staticLayer ) {
			this.$element.css('display', '')
						 .css('visibility', '');
		}

		// create action event
		// @since v1.7.2
		if( this.$element.data('action') !== undefined ) {
			var slideController = this.slide.slider.slideController;
			this.$element.on( this.$element.data('action-event') || 'click' , function(event){
				slideController.runAction($(this).data('action'));
				event.preventDefault();
			}).addClass('ms-action-layer');
		}

		$.extend(this.end_anim  , this._parseEff(this.end_anim.name));
		this.slider = this.slide.slider;

        // masked layer
        if ( this.masked ) {
            this.$mask = $('<div></div>').addClass('ms-layer-mask');

            if ( this.link ) {
                this.link.wrap(this.$mask);
                this.$mask = this.link.parent();
            } else {
                this.$element.wrap(this.$mask);
                this.$mask = this.$element.parent();
            }

            if ( this.maskWidth ) {
                this.$mask.width(this.maskWidth);
            }

            if ( this.maskHeight ) {
                this.$mask.height(this.maskHeight);

                // add height to css check
                if ( this.__cssConfig.indexOf('height') === -1 ) {
                    this.__cssConfig.push('height');
                }
            }
        }

        // new alignment method
        // @since v1.6.1
        var layerOrigin = this.layerOrigin = this.$element.data('origin');

        if ( layerOrigin ){

            var vOrigin  = layerOrigin.charAt(0),
                hOrigin  = layerOrigin.charAt(1),
                offsetX  = this.$element.data('offset-x'),
                offsetY  = this.$element.data('offset-y'),
                layerEle = this.masked ? this.$mask[0] : this.$element[0];

            if( offsetY === undefined ){
                offsetY = 0;
            }

            switch ( vOrigin ){
                case 't':
                    layerEle.style.top = offsetY + 'px';
                    break;
                case 'b':
                    layerEle.style.bottom = offsetY + 'px';
                    break;
                case 'm':
                    layerEle.style.top = offsetY + 'px';
                    this.middleAlign = true;
            }

            if( offsetX === undefined ){
                offsetX = 0;
            }


            switch ( hOrigin ){
                case 'l':
                    layerEle.style.left = offsetX + 'px';
                    break;
                case 'r':
                    layerEle.style.right = offsetX + 'px';
                    break;
                case 'c':
                    layerEle.style.left = offsetX + 'px';
                    this.centerAlign = true;
            }
        }

        // parallax effect
        // @since v1.6.0
        this.parallax = this.$element.data('parallax')
        if( this.parallax != null ) {
            this.parallax /= 100;
            this.$parallaxElement = $('<div></div>').addClass('ms-parallax-layer');

            if( this.masked ) {
                this.$mask.wrap(this.$parallaxElement);
                this.$parallaxElement = this.$mask.parent();
            } else if( this.link ) { // only for image layer
                this.link.wrap(this.$parallaxElement);
                this.$parallaxElement = this.link.parent();
            } else {
                this.$element.wrap(this.$parallaxElement);
                this.$parallaxElement = this.$element.parent();
            }

            this._lastParaX = 0;
            this._lastParaY = 0;
            this._paraX = 0;
            this._paraY = 0;


            // add bottom 0 to the parallax element if layer origin specified to the bottom
            this.alignedToBot = this.layerOrigin && this.layerOrigin.indexOf('b') !== -1;
            if( this.alignedToBot ) {
                this.$parallaxElement.css('bottom', 0);
            }

            if( window._css3d ){
                this.parallaxRender = this._parallaxCSS3DRenderer;
            } else if ( window._css2d ){
                this.parallaxRender = this._parallaxCSS2DRenderer;
            } else {
                this.parallaxRender = this._parallax2DRenderer;
            }

            if( this.slider.options.parallaxMode !== 'swipe' ){ // mouse mode
                averta.Ticker.add(this.parallaxRender, this);
            }
        }

        // remove all data- attributes excluding data-src
        $.removeDataAttrs(this.$element, ['data-src']);
    };

    /**
     * initialize layer
     */
    p.init = function(){
        //if(this.initialized) return;
        this.initialized = true;

        var value;

        this.$element.css('visibility' , '');
        // store initial layer styles
        for(var i = 0 , l = this.__cssConfig.length; i < l ; i ++){
            var key = this.__cssConfig[i];
            if ( this._isPosition(key) && this.masked ) {
                value = this.$mask.css(key);
            } else if( this.type === 'text' && key === 'width' && !this.masked && !this.maskWidth ){ // in some browsers using computed style for width in text layer causes unexpected word wrapping
                value = this.$element[0].style.width;
            } else {

                value = this.$element.css(key);
                var isSize = key === 'width' || key === 'height';

                if ( isSize && this.masked ){
                    if ( this.maskWidth && key === 'width' ) {
                        value = this.maskWidth + 'px';
                    } else if ( this.maskHeight && key === 'height') {
                        value = this.maskHeight + 'px';
                    }
                }

                // fix for Google Chrome in ios, sometimes image layers over first slide not showing correctly.
                if ( isSize && value === '0px' ) {
                    value = this.$element.data(key) + 'px';
                }
            }

            // skip unnecessary positioning styles
            if ( this.layerOrigin && (
                 ( key === 'top'    && this.layerOrigin.indexOf('t') === -1 && this.layerOrigin.indexOf('m') === -1 ) ||
                 ( key === 'bottom' && this.layerOrigin.indexOf('b') === -1 ) ||
                 ( key === 'left'   && this.layerOrigin.indexOf('l') === -1 && this.layerOrigin.indexOf('c') === -1 ) ||
                 ( key === 'right'  && this.layerOrigin.indexOf('r') === -1 )  )
            ) {
                continue;
            }

            if( value != 'auto' && value != "" && value != "normal" ) {
                this.baseStyle[key] = parseInt(value);
            }
        }

        // @since v1.6.0
        if ( this.middleAlign ){
            this.baseHeight = this.$element.outerHeight(false);//this.$element.height();
        }

        if ( this.centerAlign ){
            // in some browsers using computed style for width in text layer causes unexpected word wrapping
            //if ( this.type === 'text' ){
            //  this.baseWidth = parseInt(this.$element[0].style.width);
            //} else {
                this.baseWidth = this.$element.outerWidth(false);
            //}
        }

    };

    /**
     * locate layer over slider
     */
    p.locate = function(){

        // is slide ready?
        if ( !this.slide.ready ) {
            return;
        }

        var width       = parseFloat(this.layersCont.css('width')),
            height      = parseFloat(this.layersCont.css('height')),
            factor, isPosition, isSize;

        if( !this.staticLayer && this.$element.css('display') === 'none' && this.isVisible) {
            this.$element.css('display', '')
                         .css('visibility', 'hidden');
        }

        if ( this.staticLayer ) {
            this.$element.addClass('ms-hover-active');
        }

        factor = this.resizeFactor  = width / this.slide.slider.options.width;

        var $layerEle = this.masked ? this.$mask : this.$element;

        // updated @since v1.6.1
        for (var key in this.baseStyle) {

            isPosition = this._isPosition(key);
            isSize = key === 'width' || key === 'height';

            //switch resize/position factor
            if( this.fixed && isPosition ){
                factor = 1;
            } else {
                factor = this.resizeFactor;
            }

            if( !this.resizable && !isPosition ){
                continue;
            }

            if ( key === 'top' && this.middleAlign ){
                $layerEle[0].style.top = '0px';
                this.baseHeight = $layerEle.outerHeight(false);
                $layerEle[0].style.top = this.baseStyle['top'] * factor + (height - this.baseHeight) / 2  + 'px';
            } else if ( key === 'left' && this.centerAlign ){
                $layerEle[0].style.left = '0px';
                this.baseWidth = $layerEle.outerWidth(false);
                $layerEle[0].style.left = this.baseStyle['left'] * factor + (width - this.baseWidth) / 2  + 'px';
            } else if ( isPosition && this.masked ) {
                $layerEle[0].style[key] = this.baseStyle[key] * factor + 'px';
            } else if ( isSize && ( (key === 'width' && this.maskWidth) || (key === 'height' && this.maskHeight) ) ) {
                $layerEle[0].style[key] = this.baseStyle[key] * factor + 'px';
            } else {
                this.$element.css(key , this.baseStyle[key] * factor + 'px');
            }
        }


		this.visible(this.minWidth < width);
	};

	/**
	 * start layer animation
	 */
	p.start = function(){

		// is it already showing or is it a static layer?
		if ( this.isShowing || this.staticLayer ) {
			return;
		}

		this.isShowing = true;
        this.$element.removeClass('ms-hover-active');

        var key , base;

        // reads css value form LayerEffects
        MSLayerEffects.rf = this.resizeFactor;
        var effect_css = MSLayerEffects[this.start_anim.eff_name].apply(null , this._parseEffParams(this.start_anim.eff_params));

        // checkes effect css and defines TO css values
        var start_css_eff = {};

        // set from position
        for(key in effect_css){

            // check the position key (top, left, right or bottom) for animatin
            // It mostly will be used in old browsers
            // In effect left:100, layer base style right:300 -> effect changes to right:100
            if( this._checkPosKey(key , effect_css) ){
                continue;
            }

            // set default value from Layer Effects Class
            if( MSLayerEffects.defaultValues[key] != null ){
                start_css_eff[key] = MSLayerEffects.defaultValues[key];
            }

            if( key in this.baseStyle ){
                base = this.baseStyle[key];

                // updated @since v1.6.1
                if ( this.middleAlign && key === 'top' ){
                    base += (parseInt(this.layersCont.height()) - this.$element.outerHeight(false)) / 2;
                }

                if ( this.centerAlign && key === 'left' ){
                    base += (parseInt(this.layersCont.width()) - this.$element.outerWidth(false)) / 2;
                }
                //----------------------

                effect_css[key] = base + parseFloat(effect_css[key]) + 'px';
                start_css_eff[key] = base + 'px';
            }

            this.$element.css(key , effect_css[key]);
        }

        var that = this;

        clearTimeout(this.to);
        clearTimeout(this.clHide);
        this.to = setTimeout(function(){
            //that.locate();
            that.$element.css('visibility', '');
            that._playAnimation(that.start_anim , start_css_eff);
        } , that.start_anim.delay || 0.01);


        this.clTo = setTimeout(function(){
            that.show_cl = true;
            that.$element.addClass('ms-hover-active');
        },(this.start_anim.delay || 0.01) + this.start_anim.duration + 1);

        if( this.autoHide ){
            clearTimeout(this.hto);
            this.hto = setTimeout(function(){that.hide();} , that.end_anim.time );
        }

    };

    /**
     * starts hide animation
     */
    p.hide = function(){

        // static layers doesn't support animations
        if ( this.staticLayer ) {
            return;
        }

        this.$element.removeClass('ms-hover-active');

        this.isShowing = false;

        // reads css value form LayerEffects
        var effect_css = MSLayerEffects[this.end_anim.eff_name].apply(null , this._parseEffParams(this.end_anim.eff_params));

        for(key in effect_css){

            if(this._checkPosKey(key , effect_css)) continue;

            if( key === window._jcsspfx + 'TransformOrigin' ){
                this.$element.css(key , effect_css[key]);
            }

            if(key in this.baseStyle){
                effect_css[key] = this.baseStyle[key] + parseFloat(effect_css[key]) +  'px';
            }

        }

        this._playAnimation(this.end_anim , effect_css);

        clearTimeout(this.clHide);

        if ( effect_css.opacity === 0 ) {
            this.clHide = setTimeout( function(){ this.$element.css('visibility', 'hidden'); }.bind(this), this.end_anim.duration + 1 );
        }

		clearTimeout(this.to);
		clearTimeout(this.hto);
		clearTimeout(this.clTo);
	};

	/**
	 * reset layer
	 */
	p.reset = function(){
		if ( this.staticLayer ) {
			return;
		}

		this.isShowing = false;
		//this.$element.css(window._csspfx + 'animation-name', ''	);
		this.$element[0].style.display = 'none';
		this.$element.css('opacity', '');
		this.$element[0].style['transitionDuration'] = '';

		if(this.show_tween)
			this.show_tween.stop(true);

		clearTimeout(this.to);
		clearTimeout(this.hto);
	};

	/**
	 * destroy layer
	 */
	p.destroy = function(){
		this.reset();
		this.$element.remove();
	};

	/**
	 * change the visibility status
	 * @param  {Boolean} value
	 */
	p.visible = function(value){
		if(this.isVisible == value) return;

		this.isVisible = value;

		this.$element.css('display' , (value ? '' : 'none'));
	};

	/**
	 * Change the detestation of parallax position
	 * @param  {Number} x
	 * @param  {Number} y
	 * @since  1.6.0
	 */
	p.moveParallax = function(x, y , fast){
		this._paraX = x;
		this._paraY = y;
		if( fast ){
			this._lastParaX = x;
			this._lastParaY = y;
			this.parallaxRender();
		}
	};

	/*------------------------------------*\
		Private Methods
	\*------------------------------------*/

	/**
	 * play layer animation
	 * @param  {Obeject} animation layer animation object
	 * @param  {Object} css       animation css object
	 */
	p._playAnimation = function(animation , css){
		var options = {};

		if(animation.ease){
			options.ease = animation.ease;
		}

		options.transProperty = window._csspfx + 'transform,opacity';

        if( this.show_tween ) {
            this.show_tween.stop(true);
        }

		this.show_tween = CTween.animate(this.$element, animation.duration , css , options);
	};

	/**
	 * generate random value
	 * @param  {String} value the pattern value min|max
	 * @return {Number}
	 */
	p._randomParam = function(value){
		var min = Number(value.slice(0,value.indexOf('|')));
		var max = Number(value.slice(value.indexOf('|')+1));

		return min + Math.random() * (max - min);
	};

	/**
	 * parse effect function
	 * @param  {String} eff_name effect function
	 * @return {Object}
	 */
	p._parseEff = function(eff_name){

		var eff_params = [];

		if ( eff_name.indexOf('(') !== -1 ) {
			var temp   = eff_name.slice(0 , eff_name.indexOf('(')).toLowerCase();
			var	value;

			eff_params = eff_name.slice(eff_name.indexOf('(') + 1 , -1).replace(/\"|\'|\s/g , '').split(',');
			eff_name   = temp;

			for ( var i = 0, l = eff_params.length; i < l; ++i) {
				value = eff_params[i];

				if ( value in MSLayerEffects.presetEffParams) {
					value = MSLayerEffects.presetEffParams[value];
				}

				eff_params[i] = value;
			}
		}

		return {eff_name:eff_name , eff_params:eff_params};
	};

	/**
	 * parse effect function parameters
	 * @param  {Aarray} params effect parameters
	 * @return {Array}
	 */
	p._parseEffParams = function(params){
		var eff_params = [];
		for(var i = 0 , l = params.length; i < l ; ++i){
			var value = params[i];
			if(typeof value === 'string' && value.indexOf('|') !== -1) value = this._randomParam(value);

			eff_params[i] = value;
		}

		return eff_params;
	};

	/**
	 * calculates layer position based on initial positioning style and layer effect
	 * @param  {string} key   positioning key
	 * @param  {Object} style style object
	 * @return {Boolean}
	 */
	p._checkPosKey = function(key , style){
		if(key === 'left' && !(key in this.baseStyle) && 'right' in this.baseStyle){
			 style.right = -parseInt(style.left) + 'px';
			 delete style.left;
			 return true;
		}

		if(key === 'top'  && !(key in this.baseStyle) && 'bottom' in this.baseStyle){
			style.bottom = -parseInt(style.top) + 'px';
			delete style.top;
			return true;
		}

		return false;
	};

    /**
     * checks for position key
     * @param  {String}  key
     * @return {Boolean}     [description]
     */
    p._isPosition = function( key ) {
        return  key === 'top' || key === 'left' || key === 'bottom' || key === 'right';
    };

	/**
	 * calculate parallax position
	 */
	p._parallaxCalc = function(){
		var x_def = this._paraX - this._lastParaX,
			y_def = this._paraY - this._lastParaY;

		this._lastParaX += x_def / 12;
		this._lastParaY += y_def / 12;

		if( Math.abs( x_def ) < 0.019 ) {
			this._lastParaX = this._paraX;
		}

		if( Math.abs( y_def ) < 0.019 ) {
			this._lastParaY = this._paraY;
		}

	}

	/**
	 * Parallax move ticker function
	 */
	p._parallaxCSS3DRenderer = function(){
		this._parallaxCalc();
		this.$parallaxElement[0].style[window._jcsspfx + 'Transform'] = 'translateX(' + this._lastParaX * this.parallax + 'px) translateY(' + this._lastParaY * this.parallax + 'px) translateZ(0)';
	};

	/**
	 * parallax move ticker for CSS2 browsers
	 * @return {[type]} [description]
	 */
	p._parallaxCSS2DRenderer = function(){
		this._parallaxCalc();
		this.$parallaxElement[0].style[window._jcsspfx + 'Transform'] = 'translateX(' + this._lastParaX * this.parallax + 'px) translateY(' + this._lastParaY * this.parallax + 'px)';
	};

	/**
	 * parallax move ticker for zombie browsers
	 */
	p._parallax2DRenderer = function(){
		this._parallaxCalc();

		// change bottom instead of top if layer aligned to the bottom (origin)
		if( this.alignedToBot ) {
			this.$parallaxElement[0].style.bottom  = this._lastParaY * this.parallax + 'px';
		} else {
			this.$parallaxElement[0].style.top  = this._lastParaY * this.parallax + 'px';
		}

		this.$parallaxElement[0].style.left = this._lastParaX * this.parallax + 'px';
	};

})(jQuery);
