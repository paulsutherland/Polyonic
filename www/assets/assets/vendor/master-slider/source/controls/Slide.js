/**
 * Master Slider Slide Class
 * @author averta
 * @package Master Slider jQuery
 */
;(function(window, document, $){

    "use strict";

    window.MSSlide = function(){

        this.$element = null;
        this.$loading = $('<div></div>').addClass('ms-slide-loading');

        this.view       = null;
        this.index      = -1;

        this.__width    = 0;
        this.__height   = 0;

        this.fillMode = 'fill'; // fill , fit , stretch , tile , center

        this.selected = false;
        this.pselected = false;
        this.autoAppend = true;
        this.isSleeping = true;

        this.moz = $.browser.mozilla;
    };

    var p = MSSlide.prototype;

    /**
     * on swipe start handler
     */
    p.onSwipeStart = function(){
        //this.$layers.css(window._csspfx + 'transition-duration' , '0ms');
        if ( this.link ) {
            this.linkdis = true;
        }

        if ( this.video ) {
            this.videodis = true;
        }
    };

    /**
     * on swipe move handler
     */
    p.onSwipeMove = function (e) {
        var move = Math.max(Math.abs(e.data.distanceX), Math.abs(e.data.distanceY));
        this.swipeMoved = move > 4;
    };

    /**
     * on swipe cancel handler
     */
    p.onSwipeCancel = function(e){
        if ( this.swipeMoved ) {
            this.swipeMoved = false;
            return;
        }

        if ( this.link ) {
            this.linkdis = false;
        }

        if ( this.video ) {
            this.videodis = false;
        }
        //this.$layers.css(window._csspfx + 'transition-duration' , this.view.__slideDuration + 'ms');
    };

    /* @ifdef PRO */
    /**
     * setup layer controller for the slide
     * @since 2.11.0
     */
    p.setupLayerController = function () {
        this.hasLayers = true;
        this.layerController = new MSLayerController(this);
    };
    /* @endif */

    /**
     * this method called after loading all assets related to this slide
     */
    p.assetsLoaded = function(){
        this.ready = true;
        this.slider.api._startTimer();

        /* @ifdef PRO */
        if( this.selected || (this.pselected && this.slider.options.instantStartLayers) ){

            if ( this.hasLayers ) {
                this.layerController.showLayers();
            }

            if(this.vinit){
                this.bgvideo.play();
                if( !this.autoPauseBgVid ) {
                    this.bgvideo.currentTime = 0;
                }
            }

        }
        /* @endif */
        if ( !this.isSleeping ) {
            this.setupBG();
        }

        CTween.fadeOut(this.$loading , 300 , true);

        //sequence loading
        if ( (this.slider.options.preload === 0 || this.slider.options.preload === 'all') && this.index < this.view.slideList.length - 1 ) {
            this.view.slideList[this.index + 1].loadImages();
        } else if ( this.slider.options.preload === 'all' && this.index === this.view.slideList.length - 1 ){
            this.slider._removeLoading();
        }

    };

    /**
     * adds backgroun image to the slider
     * @param {Element} img slide image element
     */
    p.setBG = function(img){
        this.hasBG = true;
        var that = this;

        this.$imgcont = $('<div></div>').addClass('ms-slide-bgcont');

        this.$element.append(this.$loading)
                     .append(this.$imgcont);

        this.$bg_img = $(img).css('visibility' , 'hidden');
        this.$imgcont.append(this.$bg_img);

        this.bgAligner = new MSAligner(that.fillMode , that.$imgcont, that.$bg_img );
        this.bgAligner.widthOnly = this.slider.options.autoHeight;

        if ( that.slider.options.autoHeight && (that.pselected || that.selected) ) {
            that.slider.setHeight(that.slider.options.height);
        }

        if ( this.$bg_img.data('src') !== undefined ) {
            this.bg_src = this.$bg_img.data('src');
            this.$bg_img.removeAttr('data-src');
        } else {
            this.$bg_img.one('load', function(event) {that._onBGLoad(event);})
                        .each($.jqLoadFix);
        }

    };

    /**
     * align and resize backgrund image over slide
     */
    p.setupBG = function(){

        //if(this.isSettedup) return;
        //this.isSettedup = true;

        if ( !this.initBG && this.bgLoaded ) {
            this.initBG = true;
            this.$bg_img.css('visibility' , '');
            this.bgWidth  = this.bgNatrualWidth  || this.$bg_img.width();
            this.bgHeight = this.bgNatrualHeight || this.$bg_img.height();

            CTween.fadeIn(this.$imgcont , 300);

            if(this.slider.options.autoHeight){
                this.$imgcont.height(this.bgHeight * this.ratio);
            }

            this.bgAligner.init(this.bgWidth  , this.bgHeight);
            this.setSize(this.__width , this.__height);

            if(this.slider.options.autoHeight && (this.pselected || this.selected))
                this.slider.setHeight(this.getHeight());
        }

    };



    /**
     * start loading images
     */
    p.loadImages = function(){
        if ( this.ls ) {
            return;
        }

        this.ls = true;

        /* @ifdef PRO */
        if ( this.bgvideo ) {
            this.bgvideo.load();
        }
        /* @endif */

        if ( this.hasBG && this.bg_src ) {
            var that = this;
            this.$bg_img.preloadImg(this.bg_src , function(event) {that._onBGLoad(event);});
        }

        /* @ifdef PRO */
        if ( this.hasLayers ) {
            this.layerController.loadLayers(this._onLayersLoad);
        }
        /* @endif */

        // There is nothing to preload? so slide is ready to show.
        if( !this.hasBG && !this.hasLayers ) {
            this.assetsLoaded();
        }

    };

    /* @ifdef PRO */
    /**
     * layerController on assets load callback
     */
    p._onLayersLoad = function () {
        this.layersLoaded = true;
        if ( !this.hasBG || this.bgLoaded ) {
            this.assetsLoaded();
        }
    };
    /* @endif */

    /**
     * on background image loaded
     * @param  {Event} event
     */
    p._onBGLoad = function(event){
        this.bgNatrualWidth = event.width;
        this.bgNatrualHeight = event.height;

        this.bgLoaded = true;

        if ( $.browser.msie ) {
            this.$bg_img.on('dragstart', function(event) { event.preventDefault(); }); // disables native dragging
        }

        if ( !this.hasLayers || this.layerController.ready ) {
            this.assetsLoaded();
        }
    };

    /* -----------------------------------------------------*/

    /* @ifdef PRO */
    /**
     * add video background to the slide
     * @param {jQuery Element} $video
     */
    p.setBGVideo = function($video){

        if ( !$video[0].play ) {
            return;
        }

        // disables video in mobile devices
        if ( window._mobile && !this.slider.options.mobileBGVideo) {
            $video.remove();
            return;
        }

        this.bgvideo  = $video[0];
        var that = this;

        $video.addClass('ms-slide-bgvideo');

        if ( $video.data('loop') !== false ) {
            this.bgvideo.addEventListener('ended' , function(){
                //that.bgvideo.currentTime = -1;
                that.bgvideo.play();
            });
        }

        if ( $video.data('mute') !== false ) {
            this.bgvideo.muted = true;
        }

        if ( $video.data('autopause') === true ) {
            this.autoPauseBgVid = true;
        }

        this.bgvideo_fillmode = $video.data('fill-mode') || 'fill'; // fill , fit , none

        if ( this.bgvideo_fillmode !== 'none' ) {
            this.bgVideoAligner = new MSAligner(this.bgvideo_fillmode , this.$element, $video );

            this.bgvideo.addEventListener('loadedmetadata' , function(){
                if(that.vinit) return;

                that.vinit = true;
                that.video_aspect = that.bgVideoAligner.baseHeight/that.bgVideoAligner.baseWidth;
                that.bgVideoAligner.init(that.bgvideo.videoWidth , that.bgvideo.videoHeight);
                that._alignBGVideo();
                CTween.fadeIn($(that.bgvideo) , 200);

                if ( that.selected ) {
                    that.bgvideo.play();
                }
            });
        }

        $video.css('opacity' , 0);

        this.$bgvideocont = $('<div></div>').addClass('ms-slide-bgvideocont').append($video);

        if ( this.hasBG ) {
            this.$imgcont.before(this.$bgvideocont);
        } else {
            this.$bgvideocont.appendTo(this.$element);
        }
    };

    /**
     * align video in slide
     */
    p._alignBGVideo = function () {
        if ( !this.bgvideo_fillmode || this.bgvideo_fillmode === 'none' ) {
            return;
        }
        this.bgVideoAligner.align();
    };

    /* -----------------------------------------------------*/

    /* @endif */

    /**
     * resize slide
     * @param {Number} width
     * @param {Number} height
     * @param {Boolean} hard   after resizing reinitializes layers
     */
    p.setSize = function(width, height, hard) {

        this.__width  = width;

        if ( this.slider.options.autoHeight ) {
            if ( this.bgLoaded ) {
                this.ratio = this.__width / this.bgWidth;
                height = Math.floor(this.ratio * this.bgHeight);
                this.$imgcont.height(height);
            } else {
                this.ratio = width / this.slider.options.width;
                height = this.slider.options.height * this.ratio;
            }
        }

        this.__height = height;
        this.$element.width(width).height(height);

        if(this.hasBG && this.bgLoaded)this.bgAligner.align();

        /* @ifdef PRO */
        this._alignBGVideo();

        if ( this.hasLayers ) {
            this.layerController.setSize(width, height, hard);
        }
        /* @endif */
    };

    /**
     * calculates slide height
     * @return {Number} slide height
     */
    p.getHeight = function(){

        if ( this.hasBG && this.bgLoaded ) {
            return this.bgHeight * this.ratio;
        }

        return Math.max(this.$element[0].clientHeight, this.slider.options.height * this.ratio);
    };

    /* -----------------------------------------------------*/
    // YouTube and Vimeo videos

    /**
     * playe embeded video
     */
    p.__playVideo = function (){

        if ( this.vplayed || this.videodis ) {
            return;
        }

        this.vplayed = true;

        if ( !this.slider.api.paused ) {
            this.slider.api.pause();
            this.roc = true; // resume on close;
        }

        this.vcbtn.css('display' , '');
        CTween.fadeOut(this.vpbtn   , 500 , false);
        CTween.fadeIn(this.vcbtn    , 500);
        CTween.fadeIn(this.vframe   , 500);
        this.vframe.css('display' , 'block').attr('src' , this.video + '&autoplay=1');
        this.view.$element.addClass('ms-def-cursor');

        // remove perspective style from view if it's Firefox.
        // it fixes video fullscreen issue in Firefox
        if ( this.moz ) {
            this.view.$element.css('perspective', 'none');
        }

        // if swipe navigation enabled
        if ( this.view.swipeControl ) {
            this.view.swipeControl.disable();
        }

        this.slider.slideController.dispatchEvent(new MSSliderEvent(MSSliderEvent.VIDEO_PLAY));
    };

    /**
     * close embeded video
     */
    p.__closeVideo = function(){

        if ( !this.vplayed ) {
            return;
        }

        this.vplayed = false;

        if(this.roc){
            this.slider.api.resume();
        }

        var that = this;

        CTween.fadeIn(this.vpbtn    , 500);
        CTween.animate(this.vcbtn   , 500 , {opacity:0} , {complete:function(){ that.vcbtn.css  ('display'  , 'none'); }});
        CTween.animate(this.vframe  , 500 , {opacity:0} , {complete:function(){ that.vframe.attr('src'  , 'about:blank').css('display'  , 'none');}});

        //  video fullscreen issue in Firefox
        if ( this.moz ) {
            this.view.$element.css('perspective', '');
        }

        // if swipe navigation enabled
        if ( this.view.swipeControl ) {
            this.view.swipeControl.enable();
        }

        this.view.$element.removeClass('ms-def-cursor');
        this.slider.slideController.dispatchEvent(new MSSliderEvent(MSSliderEvent.VIDEO_CLOSE));
    };

    /* -----------------------------------------------------*/

    /**
     * create slide - it adds requierd elements over slide
     */
    p.create = function(){
        var that = this;

        /* @ifdef PRO */
        if ( this.hasLayers ) {
            this.layerController.create();
        }
        /* @endif */

        if ( this.link ) {
            this.link.addClass('ms-slide-link').html('').click(function(e){
                if ( that.linkdis ) {
                    e.preventDefault();
                }
            });

            // this.$element.css('cursor' , 'pointer')
            //           .click(function(){ if(!that.linkdis) window.open(that.link , that.link_targ || '_self'); });
        }

        if ( this.video ) {

            if ( this.video.indexOf('?') === -1 ) {
                this.video += '?';
            }

            this.vframe = $('<iframe></iframe>')
                          .addClass('ms-slide-video')
                          .css({width:'100%' , height:'100%' , display:'none'})
                          .attr('src' , 'about:blank')
                          .attr('allowfullscreen', 'true')
                          .appendTo(this.$element);

            this.vpbtn = $('<div></div>')
                        .addClass('ms-slide-vpbtn')
                        .click(function(){that.__playVideo();})
                        .appendTo(this.$element);

            this.vcbtn = $('<div></div>')
                        .addClass('ms-slide-vcbtn')
                        .click(function(){that.__closeVideo();})
                        .appendTo(this.$element)
                        .css('display','none');

            if ( window._touch ) {
                this.vcbtn.removeClass('ms-slide-vcbtn')
                          .addClass('ms-slide-vcbtn-mobile')
                          .append('<div class="ms-vcbtn-txt">Close video</div>')
                          .appendTo(this.view.$element.parent());
            }
        }

        if ( !this.slider.options.autoHeight && this.hasBG ) {
            this.$imgcont.css('height' , '100%');

            if ( this.fillMode === 'center' || this.fillMode === 'stretch' ){
                this.fillMode = 'fill';
            }
        }

        if ( this.slider.options.autoHeight ) {
            this.$element.addClass('ms-slide-auto-height');
        }

        this.sleep(true);
    };

    /**
     * destory the slide
     */
    p.destroy = function(){
        /* @ifdef PRO */
        if ( this.hasLayers ) {
            this.layerController.destroy();
            this.layerController = null;
        }
        /* @endif */

        this.$element.remove();
        this.$element = null;
    };

    /**
     * everything require to do before selecting slide
     */
    p.prepareToSelect = function(){

        if ( this.pselected || this.selected ) {
            return;
        }

        this.pselected = true;

        if ( this.link || this.video ) {
            this.view.addEventListener(MSViewEvents.SWIPE_START  , this.onSwipeStart  , this);
            this.view.addEventListener(MSViewEvents.SWIPE_MOVE  , this.onSwipeMove  , this);
            this.view.addEventListener(MSViewEvents.SWIPE_CANCEL , this.onSwipeCancel , this);
            this.linkdis = false;
            this.swipeMoved = false;
        }

        this.loadImages();

        /* @ifdef PRO */
        if ( this.hasLayers ) {
            this.layerController.prepareToShow();
        }

        if ( this.ready ) {
            if( this.bgvideo ){
                this.bgvideo.play();
            }

            if ( this.hasLayers && this.slider.options.instantStartLayers ){
                this.layerController.showLayers();
            }
        }
        /* @endif */

        if( this.moz ){
            this.$element.css('margin-top' , '');
        }


    };

    /*p.prepareToUnselect = function(){
        if(!this.pselected || !this.selected) return;

        this.pselected = false;

    };*/

    /**
     * select slide
     */
    p.select = function(){
        if ( this.selected ) {
            return;
        }

        this.selected = true;
        this.pselected = false;
        this.$element.addClass('ms-sl-selected');

        /* @ifdef PRO */
        if(this.hasLayers){

            if ( this.slider.options.autoHeight ) {
                this.layerController.updateHeight();
            }

            if( !this.slider.options.instantStartLayers ) {
                this.layerController.showLayers();
            }

            //this.view.addEventListener(MSViewEvents.SCROLL        , this.updateLayers  , this)
        }


        if( this.ready && this.bgvideo ) {
            this.bgvideo.play();
        }
        /* @endif */

        // @since 1.8.0
        // Autoplay iframe video
        if ( this.videoAutoPlay ) {
            this.videodis = false;
            this.vpbtn.trigger('click');
        }

    };

    /**
     * remove selected status
     */
    p.unselect = function(){
        this.pselected = false;

        if ( this.moz ) {
            this.$element.css('margin-top' , '0.1px');
        }

        if ( this.link || this.video ) {
            this.view.removeEventListener(MSViewEvents.SWIPE_START   , this.onSwipeStart  , this);
            this.view.removeEventListener(MSViewEvents.SWIPE_MOVE  , this.onSwipeMove  , this);
            this.view.removeEventListener(MSViewEvents.SWIPE_CANCEL  , this.onSwipeCancel , this);
        }

        /* @ifdef PRO */
        if (this.bgvideo ) {
            this.bgvideo.pause();
            if(!this.autoPauseBgVid && this.vinit)
                this.bgvideo.currentTime = 0;
        }

        // hide layers
        if ( this.hasLayers ) {
            this.layerController.hideLayers();
        }
        /* @endif */

        if ( !this.selected ) {
            return;
        }

        this.selected = false;

        this.$element.removeClass('ms-sl-selected');
        if(this.video && this.vplayed){
            this.__closeVideo();
            this.roc = false;
        }

    };

    /**
     * remove slide from DOM
     */
    p.sleep = function(force){
        if ( this.isSleeping && !force ) {
            return;
        }

        this.isSleeping = true;

        if ( this.autoAppend ) {
            this.$element.detach();
        }

        if ( this.hasLayers ) {
            this.layerController.onSlideSleep();
        }
    };

    /**
     * add slide to the DOM
     */
    p.wakeup = function(){
        if ( !this.isSleeping ) {
            return;
        }

        this.isSleeping = false;

        if ( this.autoAppend ) {
            this.view.$slideCont.append(this.$element);
        }

        if ( this.moz ){
            this.$element.css('margin-top' , '0.1px');
        }

        this.setupBG();

        // aling bg
        if ( this.hasBG ){
            this.bgAligner.align();
        }

        if ( this.hasLayers ) {
            this.layerController.onSlideWakeup();
        }
    };

})(window, document, jQuery);
