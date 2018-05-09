;(function($){

	window.MSImageLayerElement = function(){
		MSLayerElement.call(this);
		this.needPreload = true;

		this.__cssConfig = [
			'width'			,		'height'		,
			'margin-top' 	,      'padding-top'	,
			'margin-bottom'	,      'padding-left'	,
			'margin-right'	,      'padding-right'	,
			'margin-left'	,      'padding-bottom' ,

			'left'			,       'right'			,
			'top'			,       'bottom'
		];

		this.type = 'image';
	};

	MSImageLayerElement.extend(MSLayerElement);

	var p = MSImageLayerElement.prototype;
	var _super = MSLayerElement.prototype;

	/*-------------- METHODS --------------*/

	p.create = function(){

		if(this.link){
			var p = this.$element.parent();
			p.append(this.link);
			this.link.append(this.$element);
			this.link.removeClass('ms-layer');
			this.$element.addClass('ms-layer');
			p = null;
		}

		_super.create.call(this);

		if(this.$element.data('src') != undefined){
			this.img_src = this.$element.data('src');
			this.$element.removeAttr('data-src');
		}else{
			var that = this;
			this.$element.on('load', function(event){
				that.controller.preloadCount--;
				if(that.controller.preloadCount === 0)
					that.controller._onlayersReady();
			}).each($.jqLoadFix);
		}

		if($.browser.msie)
			this.$element.on('dragstart', function(event) { event.preventDefault(); }); // disable native dragging
	};

	p.loadImage = function(){
		var that = this;

		this.$element.preloadImg(this.img_src , function(event){
			//this.$element.width(event.width).height(event.height);
			that.controller.preloadCount--;
			if(that.controller.preloadCount === 0) that.controller._onlayersReady();
		});
	};

})(jQuery);
