;(function($){
	
	window.MSVideoLayerElement = function(){
		MSLayerElement.call(this);
		
		this.__cssConfig.push(
				'height'
		);
	
		this.type = 'video';
	};
	
	MSVideoLayerElement.extend(MSLayerElement);
	
	var p  = MSVideoLayerElement.prototype;
	var _super  = MSLayerElement.prototype;
	
	/*-------------- METHODS --------------*/
	p.__playVideo = function(){
		if(this.img)CTween.fadeOut(this.img , 500 , 2);
		CTween.fadeOut(this.video_btn , 500 , 2);
		this.video_frame.attr('src' , 'about:blank').css('display' , 'block');
		if(this.video_url.indexOf('?') == -1) this.video_url += '?';
		this.video_frame.attr('src' , this.video_url + '&autoplay=1');
	};

	p.start = function(){
		_super.start.call(this);

		if ( this.$element.data('autoplay') ) {
			this.__playVideo();
		}
	};

	p.reset = function(){
		_super.reset.call(this);
		
		if(this.needPreload || this.$element.data('btn')){
			this.video_btn.css('opacity' , 1).css('display', 'block');
			this.video_frame.attr('src' , 'about:blank').css('display' , 'none');
		}
		
		if(this.needPreload){
			this.img.css('opacity' , 1).css('display', 'block');	
			return;
		}
		
		this.video_frame.attr('src' , this.video_url);
	};

	p.create = function(){
		_super.create.call(this);

		this.video_frame = this.$element.find('iframe').css({width:'100%' , height:'100%'});
		this.video_url   = this.video_frame.attr('src');
		
		var has_img = this.$element.has('img').length != 0;
		
		if(!has_img && !this.$element.data('btn')) return;
		
		this.video_frame.attr('src' , 'about:blank').css('display' , 'none');
		
		var that = this;
		
		this.video_btn = $('<div></div>').appendTo(this.$element).addClass('ms-video-btn').click(function() {
			that.__playVideo();
		});
		
		//this.video_frame.attr('src' , 'about:blank');
		
		if(!has_img) return;
		
		this.needPreload = true;
		this.img = this.$element.find('img:first').addClass('ms-video-img');
		
		if(this.img.data('src') !== undefined){
			this.img_src = this.img.data('src');
			this.img.removeAttr('data-src');
		}else{
			var that = this;
			this.img.attr('src' , this.img_src).on('load', function(event) {
				that.controller.preloadCount--;
				if(that.controller.preloadCount === 0)
					that.controller._onlayersReady();
			}).each($.jqLoadFix);
		}
		
		if($.browser.msie)
			this.img.on('dragstart', function(event) { event.preventDefault(); }); // disables native dragging
	};
	
	p.loadImage = function(){
		var that = this;
		this.img.preloadImg(this.img_src, function(event) {
			that.controller.preloadCount--;
			if(that.controller.preloadCount === 0) that.controller._onlayersReady();
		});
	};
	
})(jQuery);
