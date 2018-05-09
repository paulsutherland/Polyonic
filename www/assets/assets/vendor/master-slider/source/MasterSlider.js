/**
 * Master Slider Main JavaScript File
 */

;(function($){

	"use strict";

	/* @ifdef PRO */
	var LayerTypes = {
		'image' 	: MSImageLayerElement,
		'text'  	: MSLayerElement,
		'video' 	: MSVideoLayerElement,
		'hotspot'	: MSHotspotLayer,
		'button'	: MSButtonLayer
	};
	/* @endif */

	window.MasterSlider = function(){

		// Default Options
		this.options = {
            forceInit           : true,       // Force calling init even an error occurs in jQuery's dom ready method.
			autoplay 			: false,      // Enables the autoplay slideshow.
			loop 				: false,	  // Enables the continuous sliding mode.
			mouse				: true,		  // Whether the user can use mouse drag navigation.
			swipe				: true,		  // Whether the drag/swipe navigation is enabled.
			grabCursor			: true,		  // Whether the slider uses grab mouse cursor.
			space  				: 0,		  // The spacing value between slides in pixels.
			fillMode			: 'fill',  	  // Specifies the slide background scaling method. Its acceptable values are "fill", "fit", "stretch", "center" and "tile".
			start				: 1,		  // The slider starting slide number.
			view				: 'basic',	  // The slide changing transition.
			width				: 300,		  // The base width of slides. It helps the slider to resize in correct ratio.
			height				: 150,		  // The base height of slides, It helps the slider to resize in correct ratio.
			inView				: 15, 		  // Specifies number of slides which will be added at a same time in DOM.
            critMargin          : 1,          //
			mobileBGVideo       : false,	  // Whether show background videos in mobile devices.
			heightLimit			: true,		  // It force the slide to use max height value as its base specified height value.
			smoothHeight		: true,		  // Whether the slider uses smooth animation while its height changes.
			autoHeight			: false,      // Whether the slider adapts its height to each slide height or not. It overrides heightLimit option.
			minHeight 			: -1,		  // @since 2.13.0, Specifies min height value for the slider, it prevents slider to shows too narrow in small screens.
			fullwidth			: false,	  // It enables the slider to adapt width to its parent element. It's very useful for creating full-width sliders. In default it takes max width as its base width value.
			fullheight			: false,	  // It enables the slider to adapt height to its parent element.
			autofill			: false,	  // It enables the slider to adapt width and height to its parent element, It's very useful for creating fullscreen or fullwindow slider.
			layersMode			: 'center',	  // It accepts two values "center" and "full". The "center" value indicates that the slider aligns layers to the center. This option is only effective in full width mode.
			hideLayers			: false,	  // Whether the slider hides all layers before changing slide.
			endPause			: false,	  // Whether the slider pauses slideshow when it stays at the last slide.
			centerControls 		: true,		  // Whether the slider aligns UI controls to center. This option is only effective in full width mode.
			overPause			: true,		  // Whether the slider pauses slideshow on hover.
			shuffle				: false,	  // Enables the shuffle slide order.
			speed				: 17, 		  // Specifies slide changing speed. It accepts float values between 0 and 100.
			dir					: 'h',		  // Specifies slide changing direction. It accepts two values "h" (horizontal) and "v" (vertical).
			preload				: 0,		  // Specifies number of slides which will be loaded by slider. 0 value means the slider loads slides in sequence.
			wheel				: false,	  // Whether slider uses mouse wheel for navigation.
			layout				: 'boxed',	  // It accepts 'fullwidth', 'fullscreen', 'fillwidth', 'autofill', 'partialview', 'boxed'. It overrides 'fullwidth' and 'autofill' (added in v1.5.6)
			autofillTarget 		: null,		  // @since 2.13.0, Specifies the parent element of slider width jQuery selector, it used for sizing slider with autofill layout. Default value is the first parent element of slider.
			fullscreenMargin	: 0,		  // Specifies margin amount to the bottom of slider, it's only effective on fullscreen slider.
			instantStartLayers	: false, 	  // @since 1.5.0, Whether instantly shows slide layers.
			parallaxMode 		: 'mouse',	  // @since 1.6.0, Specifies mode of parallax effect accepts: "mouse", "mouse:x-only", "mouse:y-only" and "swipe"
			rtl 				: false,	  // @since 1.8.0, Whether Right-to-left direction slider.
			deepLink			: null,       // @since 2.1.0, null value disables slider deep-linking any string values identifies the slider in page's url like /#msslider-1
			deepLinkType 		: 'path', 	  // @since 2.1.0, type of hash value in page's url possible values, path and query (  #gallery/1 || #gallery=4 )
			disablePlugins      : []		  // @since 2.9.6, list of disabled Master Slider plugin names for this instance.
		};

		this.slides = [];
		this.activePlugins = [];
		this.$element = null;

		// used by new layout method. to force fullwidth or fullscreen
		this.lastMargin = 0;

		// Reserved side spaces of slider
		this.leftSpace = 0;
		this.topSpace = 0;
		this.rightSpace = 0;
		this.bottomSpace = 0;

		// hold on stack
		this._holdOn = 0;

		var that = this;
		this.resize_listener = function(){that._resize();};
		$(window).bind('resize', this.resize_listener);

	};

	MasterSlider.author  		= 'Averta Ltd. (www.averta.net)';
	MasterSlider.version 		= '/*@echo VERSION */';
	MasterSlider.releaseDate 	= '/*@echo DATE */';

	// Master Slider plugins.
	MasterSlider._plugins = []
	var MS = MasterSlider;
	MS.registerPlugin = function ( plugin ) {
		if ( MS._plugins.indexOf(plugin) === -1 ) {
			MS._plugins.push(plugin);
		}
	};

	var p = MasterSlider.prototype;

	/*-------------- METHODS --------------*/

	/**
	 * create one slide object for each slide and add it to slide controller
	 * @since 1.0
	 * @private
	 */
	p.__setupSlides = function(){
		var that = this,
			new_slide,
			ind = 0;

		this.$element.children('.ms-slide').each(function(index) {

			var $slide_ele = $(this);

			new_slide 			= new MSSlide();
			new_slide.$element 	= $slide_ele;
			new_slide.slider 	= that;
			new_slide.delay  	= $slide_ele.data('delay') 		!== undefined ? $slide_ele.data('delay') 		: 3;
			new_slide.fillMode 	= $slide_ele.data('fill-mode')	!== undefined ? $slide_ele.data('fill-mode') 	: that.options.fillMode;
			new_slide.index 	= ind++;
            new_slide.id        = $slide_ele.data('id');

			// Slide Background Image
			var slide_img = $slide_ele.children('img:not(.ms-layer)');
			if( slide_img.length > 0 ){
				new_slide.setBG(slide_img[0]);
			}

			/* @ifdef PRO */
			// Slide Video Background
			var slide_video = $slide_ele.children('video');
			if( slide_video.length > 0 ) new_slide.setBGVideo(slide_video);
			/* @endif */

			// controls
			if(that.controls){
				for(var i = 0 , l = that.controls.length; i<l ; ++i)
					that.controls[i].slideAction(new_slide);
			}

			// Slide Link and Video
			var slide_link = $slide_ele.children('a').each(function(index) {
			  var $this = $(this);
			  if(this.getAttribute('data-type') === 'video'){
				new_slide.video = this.getAttribute('href');

				new_slide.videoAutoPlay = $this.data('autoplay');

				$this.remove();
			  }else if(!$this.hasClass('ms-layer')) {
				new_slide.link  = $(this);
				//new_slide.link_targ = this.getAttribute('target');
				//$this.remove();
			  }
			});//.remove();

			/* @ifdef PRO */
			// Slide Layers
            that.__createSlideLayers(new_slide , $slide_ele.find('.ms-layer'));
            /* @endif */

            that.slides.push(new_slide);
            that.slideController.view.addSlide(new_slide);

        });
    };

    /**
     * Setups the overlay layers to the slider
     * @since 2.50
     */
    p._setupOverlayLayers = function() {
        var self = this,
            $ollayers = this.$element.children( '.ms-overlay-layers' ).eq(0);

        if ( !$ollayers.length ) {
            return;
        }

        var overlayLayers = new MSOverlayLayers( this );
        overlayLayers.$element = $ollayers;
        self.__createSlideLayers(overlayLayers , $ollayers.find('.ms-layer'));

        this.view.$element.prepend( $ollayers );
        this.overlayLayers = overlayLayers;
        overlayLayers.create();
    };

	/* @ifdef PRO */
	/**
	 * Creates layers of specified layer
	 * @param  {MSSlide} slide
	 * @param  {Array} layers
	 * @since 1.0
	 * @private
	 */
	p.__createSlideLayers = function(slide , layers) {
		if(layers.length == 0) return;
		slide.setupLayerController();

		layers.each(function(index , domEle){
			var $layer_element = $(this),
				$parent_ele;

			if( domEle.nodeName === 'A' && $layer_element.find('>img').data('type') === 'image' ) {
				$parent_ele = $(this);
				$layer_element = $parent_ele.find('img');
			}

			var layer = new (LayerTypes[$layer_element.data('type') || 'text']) ();
			layer.$element      = $layer_element;
			layer.link          = $parent_ele;
            layer.id            = layer.$element.data('id');
            layer.waitForAction = layer.$element.data('wait');
            layer.masked        = layer.$element.data('masked');
            layer.maskWidth     = layer.$element.data('mask-width');
            layer.maskHeight    = layer.$element.data('mask-height');

            var eff_parameters = {},
                end_eff_parameters = {};

            if($layer_element.data('effect')    !== undefined)      eff_parameters.name             = $layer_element.data('effect');
            if($layer_element.data('ease')      !== undefined)      eff_parameters.ease             = $layer_element.data('ease');
            if($layer_element.data('duration')  !== undefined)      eff_parameters.duration         = $layer_element.data('duration');
            if($layer_element.data('delay')     !== undefined)      eff_parameters.delay            = $layer_element.data('delay');

            if($layer_element.data('hide-effect'))                  end_eff_parameters.name         = $layer_element.data('hide-effect');
            if($layer_element.data('hide-ease'))                    end_eff_parameters.ease         = $layer_element.data('hide-ease');
            if($layer_element.data('hide-duration') !== undefined)  end_eff_parameters.duration     = $layer_element.data('hide-duration');
            if($layer_element.data('hide-time')     !== undefined)  end_eff_parameters.time         = $layer_element.data('hide-time');


			layer.setStartAnim(eff_parameters);
			layer.setEndAnim(end_eff_parameters);

			slide.layerController.addLayer(layer);

		});

	};
	/* @endif */

	/**
	 * remove slider initialize loading
	 * @since 1.0
	 * @private
	 */
	p._removeLoading = function(){
		$(window).unbind('resize', this.resize_listener);
		this.$element.removeClass('before-init')
					.css('visibility', 'visible')
					.css('height','')
					.css('opacity' , 0);
		CTween.fadeIn(this.$element);
		this.$loading.remove();

		if(this.slideController)
			this.slideController.__resize();
	};

	/**
	 * resize listener, it only used for aligning slider loading and after slider init it will be removed
	 * @param  {Event} e
	 * @since 1.0
	 * @private
	 */
	p._resize = function(e){
		if(this.$loading){
			var h = this.$loading[0].clientWidth / this.aspect;
			h = this.options.heightLimit ? Math.min(h , this.options.height) : h;

			this.$loading.height(h);
			this.$element.height(h);
		}
	};

	/**
	 * changes the order of slides element before setup slides
	 * @since 1.0
	 * @private
	 */
	p._shuffleSlides = function(){
		var slides = this.$element.children('.ms-slide') , r;

		for(var i = 0 , l = slides.length; i < l ; ++i){
			r = Math.floor(Math.random() * (l - 1));
			if(i != r){
				this.$element[0].insertBefore(slides[i] , slides[r]);
				slides = this.$element.children('.ms-slide');
			}
		}
	};

	/**
	 * New method of setting up the layout of slider
	 * @since 1.5.6
	 */
	p._setupSliderLayout = function(){

		// create side spaces
		this._updateSideMargins();
		this.lastMargin = this.leftSpace;

		var lo = this.options.layout;


		if( lo !== 'boxed' && lo !== 'partialview' ){
			this.options.fullwidth = true;  // enable slider fullscreen for fullwidth, fillwidth, autofill and fullscreen layouts.
		}
		/* @ifdef PRO */
		if( lo === 'fullscreen' || lo === 'autofill' ){
			this.options.fullheight = true;

			if ( lo === 'autofill' ) {
				this.$autofillTarget = $(this.options.autofillTarget);
				if ( this.$autofillTarget.length === 0 ) {
					this.$autofillTarget = this.$element.parent();
				}
			}

		}

		// partial view
		if ( lo === 'partialview' ){
			this.$element.addClass('ms-layout-partialview');
		}
		/* @endif */

		if( lo === 'fullscreen' ||  lo === 'fullwidth' || lo === 'autofill' ){
			$(window).bind('resize', {that:this}, this._updateLayout);
			this._updateLayout();
		}

		// bind resize handler of slidecontroller __resize
		$(window).bind('resize', this.slideController.resize_listener);
	};

	/**
	 * updates layout of slider based on window size
	 * @param  {Event} event
	 * @since 1.5.6
	 */
	p._updateLayout = function(event){
		var that = event? event.data.that : this,
			lo = that.options.layout,
			$element = that.$element,
			$win = $(window);

		/* @ifdef PRO */
		// height
		if( lo === 'fullscreen' ){
			document.body.style.overflow = 'hidden';
			$element.height( $win.height() - that.options.fullscreenMargin - that.topSpace - that.bottomSpace);
			document.body.style.overflow = '';
		} else if ( lo === 'autofill' ) {
			$element.height(that.$autofillTarget.height() - that.options.fullscreenMargin - that.topSpace - that.bottomSpace)
					.width(that.$autofillTarget.width() - that.leftSpace - that.rightSpace);
			return;
		}
		/* @endif */

		// width
		$element.width($win.width() - that.leftSpace - that.rightSpace);
		var margin = -$element.offset().left + that.leftSpace + that.lastMargin;
		$element.css('margin-left', margin );
		that.lastMargin = margin;
//
	};


	/**
	 * initialize the slider, called by document ready
	 * <code>holdOn</code> property prevents auto initialize slider after document ready it used by plugins of slider like Flickr
	 * @since 1.0
	 * @protected
	 */
	p._init = function(){

		if ( this._holdOn > 0 || !this._docReady ) {
			return;
		}

		this.initialized = true;

		if(this.options.preload !== 'all'){
			this._removeLoading();
		}
		//else
		//	this.$element.css('width' , this.$loading[0].clientWidth);

		if(this.options.shuffle) 	this._shuffleSlides();

		/* @ifdef PRO */
		MSLayerEffects.setup();
		/* @endif */

		this.slideController.setupView();
		this.view = this.slideController.view;

		this.$controlsCont = $('<div></div>').addClass('ms-inner-controls-cont');//.appendTo(this.$element);
		if(this.options.centerControls){
			this.$controlsCont.css('max-width' , this.options.width + 'px');
		}

		this.$controlsCont.prepend(this.view.$element);

		this.$msContainer = $('<div></div>').addClass('ms-container').prependTo(this.$element).append(this.$controlsCont);

		if(this.controls){
			for(var i = 0 , l = this.controls.length; i<l ; ++i){
				this.controls[i].setup();
			}
		}
		/*else{
			this.$element.append(this.view.$element);
		}*/

		this._setupSliderLayout();
		this.__setupSlides();
		this.slideController.setup();
        this._setupOverlayLayers();

		if(this.controls){
			for(i = 0 , l = this.controls.length; i<l ; ++i)
				this.controls[i].create();
		}

		if(this.options.autoHeight){
			this.slideController.view.$element.height(this.slideController.currentSlide.getHeight());
		}

		// add grab cursor
		if(this.options.swipe && !window._touch && this.options.grabCursor && this.options.mouse){
			var $view = this.view.$element;

			$view.mousedown(function(){
				$view.removeClass('ms-grab-cursor');
				$view.addClass('ms-grabbing-cursor');

				if ( $.browser.msie && window.ms_grabbing_curosr ) {
					$view[0].style.cursor = 'url(' + window.ms_grabbing_curosr + '), move';
				}

			}).addClass('ms-grab-cursor');

			$(document).mouseup(function(){
				$view.removeClass('ms-grabbing-cursor');
				$view.addClass('ms-grab-cursor');

				if ( $.browser.msie && window.ms_grab_curosr ) {
					$view[0].style.cursor = 'url(' + window.ms_grab_curosr + '), move';
				}

			});
		}

		this.slideController.__dispatchInit();
	};

	/**
	 * changes the height of slider, it used in autoheight slider
	 * @param {Number} value
	 * @since 1.0
	 * @public
	 */
	p.setHeight = function(value){
		if(this.options.smoothHeight){
			if(this.htween){
				if(this.htween.reset)this.htween.reset();
				else	 			 this.htween.stop(true);
			}
			this.htween = CTween.animate(this.slideController.view.$element , 500 , {height:value} , {ease:'easeOutQuart'});
		}else
			this.slideController.view.$element.height(value);
	};

	/**
	 * reserves white space in sides of slider, it used by controls
	 * @param  {String} side  left|right|top|bottom
	 * @param  {Number} space
	 * @returns {Number} start position in space.
	 * @since 1.5.7
	 * @public
	 */
	p.reserveSpace = function(side, space){
		var sideSpace = side+'Space',
			pos = this[sideSpace];

		this[sideSpace] += space;

		this._updateSideMargins();

		return pos;
	};

	/**
	 * returns the reserved space, it used by controls and called when aligned control hides
	 * @param  {String} side
	 * @param  {Number} space
	 * @since 1.5.7
	 * @public
	 */
	/*p.returnSpace = function(side, space){
		var sideSpace = side+'Space';
		this[sideSpace] = Math.max(0 , this[sideSpace] - space);

		this.api.dispatchEvent(new MSSliderEvent(MSSliderEvent.RESERVED_SPACE_CHANGE));
		this._updateSideMargins();
	};*/

	p._updateSideMargins = function(){
		this.$element.css('margin', this.topSpace + 'px ' + this.rightSpace + 'px ' + this.bottomSpace + 'px ' + this.leftSpace + 'px');
	}

	p._realignControls = function(){
		this.rightSpace = this.leftSpace = this.topSpace = this.bottomSpace = 0;
		this._updateSideMargins();
		this.api.dispatchEvent(new MSSliderEvent(MSSliderEvent.RESERVED_SPACE_CHANGE));
	};

	/*------------------------- Public Methods -----------------------*/

	/**
	 * Adds new control to the slider
	 * @param  {String} control
	 * @param  {Object} options [description]
	 * @since 1.0
	 * @public
	 */
	p.control = function(control , options){
		if(!(control in MSSlideController.SliderControlList)) return;
		if(!this.controls) this.controls = [];
		var ins = new MSSlideController.SliderControlList[control](options);
		ins.slider = this;
		this.controls.push(ins);

		return this;
	};

	/**
	 * Hold on slider from initialization
	 * @since 2.9.6
	 * @public
	 */
	p.holdOn = function () {
		this._holdOn ++;
	};

	/**
	 * Let the slider to initialize
	 * @since 2.9.6
	 */
	p.release = function () {
		this._holdOn --;
		this._init();
	};

	/**
	 * setup slider
	 * @param  {String|jQuery object} id
	 * @param  {Object} options
	 * @since 1.0
	 * @public
	 */
	p.setup = function(target , options){
		if(typeof target === 'string'){
			this.$element = $('#' + target);
		} else {
			this.$element = target.eq(0);
		}

		//create a copy from slider markup, it will be used in destroy method.
		this.setupMarkup = this.$element.html();

		if( this.$element.length === 0 ){
			//if(console) console.log('Master Slider Error: #'+id+' not found.');
			return;
		}

		this.$element.addClass('master-slider').addClass('before-init');

		// IE prefix class
		// add browser prefix class name
		if($.browser.msie){
			this.$element.addClass('ms-ie')
						 .addClass('ms-ie' + $.browser.version.slice(0 , $.browser.version.indexOf('.')));
		} else if ( $.browser.webkit ) {
			this.$element.addClass('ms-wk');
		} else if ( $.browser.mozilla ) {
			this.$element.addClass('ms-moz');
		}


		// Android prefix class
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1;
		if(isAndroid) {
		  this.$element.addClass('ms-android');
		}

		var that = this;
		$.extend(this.options, options);

		this.aspect = this.options.width / this.options.height;

		this.$loading = $('<div></div>').
						addClass('ms-loading-container').
						insertBefore(this.$element).
						append($('<div></div>').addClass('ms-loading'));

		this.$loading.parent().css('position' , 'relative');

		// old methods
		if(this.options.autofill){
			this.options.fullwidth = true;
			this.options.fullheight = true;
		}

		if(this.options.fullheight){
			this.$element.addClass('ms-fullheight');
		}

		//this._setupSliderLayout();
		this._resize();

		// define slide controller and api
		this.slideController = new MSSlideController(this);
		this.api = this.slideController;

		// setup plugins
		for ( var i = 0, l = MS._plugins.length; i !== l; i++ ) {
			var plugin = MS._plugins[i];

			if ( this.options.disablePlugins.indexOf(plugin.name) === -1 ) {
				this.activePlugins.push(new plugin(this));
			}
		}

        if ( this.options.forceInit ) {
            MasterSlider.addJQReadyErrorCheck( this );
        }

		$(document).ready(function(){
            if ( !that.initialized ) {
    			that._docReady = true;
    			that._init();
            }
		});

		return this;
	};

	/**
	 * destroy the slider instance
	 * @param  {Boolean} insertMarkup	 whether add slider markup after destroy.
	 * @since 1.4
	 * @public
	 */
	p.destroy = function(insertMarkup){

		// destroy active plugins
		for ( var i = 0, l = this.activePlugins.length; i !== l; i++ ) {
			this.activePlugins[i].destroy();
		}

		if(this.controls){
			for( i = 0, l = this.controls.length; i !== l; i++ )
				this.controls[i].destroy();
		}

		if(this.slideController) this.slideController._destroy();

		if(this.$loading) this.$loading.remove();

		if ( insertMarkup ) {
			this.$element.html(this.setupMarkup).css('visibility' , 'hidden');
		} else {
			this.$element.remove();
		}

		var lo = this.options.layout;
		if( lo === 'fullscreen' ||  lo === 'fullwidth' ){
			$(window).unbind('resize', this._updateLayout);
		}

		this.view = null;
		this.slides = null;
		this.options = null;
		this.slideController = null;
		this.api = null;
		this.resize_listener = null;


		this.activePlugins = null;
	};

})(jQuery);

/**
 * Master Slider jQuery Plugin
 * @author Averta
 */
(function ( $, window, document, undefined ) {

		var pluginName = "masterslider",
			defaults = {
				controls:{}
			};

		function MasterSliderPlugin ( element, options ) {
			this.element = element;
			this.$element = $(element);
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		$.extend(MasterSliderPlugin.prototype, {
			init : function () {

				var self = this;

				// create new instance form Master Slider
				this._slider = new MasterSlider();

				// add controls
				for ( var control in this.settings.controls ){
					this._slider.control(control, this.settings.controls[control]);
				}

				this._slider.setup(this.$element, this.settings);

				// override api eventdisaptcher method
				var _superDispatch = this._slider.api.dispatchEvent;
				this._slider.api.dispatchEvent = function(event){
					self.$element.trigger(event.type);
					_superDispatch.call(this, event);
				};

			},

			api : function() {
				return this._slider.api;
			},

			slider : function() {
				return this._slider;
			}

		});

		$.fn[pluginName] = function ( options ) {
			var args = arguments,
				plugin = 'plugin_' + pluginName;

			// Is the first parameter an object (options), or was omitted,
			// instantiate a new instance of the plugin.
			if (options === undefined || typeof options === 'object') {
				return this.each(function () {

					// Only allow the plugin to be instantiated once,
					// so we check that the element has no plugin instantiation yet
					if (!$.data(this, plugin)) {
						$.data(this, plugin, new MasterSliderPlugin( this, options ));
					}
				});

			// If the first parameter is a string and it doesn't start
			// with an underscore or "contains" the `init`-function,
			// treat this as a call to a public method.
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

				// Cache the method call
				// to make it possible
				// to return a value
				var returns;

				this.each(function () {
					var instance = $.data(this, plugin);

					// Tests that there's already a plugin-instance
					// and checks that the requested public method exists
					if (instance instanceof MasterSliderPlugin && typeof instance[options] === 'function') {

						// Call the method of our plugin instance,
						// and pass it the supplied arguments.
						returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
					}

					// Map slider api functions to slider jq plugin
					if ( instance instanceof MasterSliderPlugin && typeof instance._slider.api[options] === 'function' ) {
						returns = instance._slider.api[options].apply( instance._slider.api, Array.prototype.slice.call( args, 1 ) );
					}

					// Allow instances to be destroyed via the 'destroy' method
					if (options === 'destroy') {
					  $.data(this, plugin, null);
					}
				});

				// If the earlier cached method
				// gives a value back return the value,
				// otherwise return this to preserve chainability.
				return returns !== undefined ? returns : this;
			}
		};

})( jQuery, window, document );

;(function ( $, window, document, undefined ) {
    "use strict";

    /* ------------------------------------------------------------------------------ */

    var sliderInstances = [];
    MasterSlider.addJQReadyErrorCheck = function ( slider ) {
        sliderInstances.push( slider );
    };

    var _ready = $.fn.ready,
        _onerror = window.onerror;

    // override jQuery ready
    $.fn.ready = function() {

        // override window on load event
        window.onerror = function() {

            if ( sliderInstances.length !== 0 ) {
                for ( var i = 0, l = sliderInstances.length; i !== l; i++ ) {
                    var slider = sliderInstances[i];
                    if ( !slider.initialized ) {
                        slider._docReady = true;
                        slider._init();
                    }
                }
            }

            if ( _onerror ) {
                return _onerror.apply( this, arguments );
            }

            return false;
        }

        return _ready.apply( this, arguments );
    };

})(jQuery, window, document);


