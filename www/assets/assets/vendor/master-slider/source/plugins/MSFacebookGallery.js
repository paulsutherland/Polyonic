/**
 * Master Slider Facebook Gallery plugin
 * @author Averta Ltd.
 * @version 1.0.0
 */
;(function($){


	window.MSFacebookGallery = function(slider, options){
		var _options = {
			count			:10,
			type			:'photostream', // album
 			/*
 			orginal/960/720/600/480/320/130
 			 */
			thumbSize	:'320',

			/*
 			orginal/960/720/600/480/320/130
 			 */
			imgSize		: 'orginal',

			https: false,
            token: ''
		};

		this.slider = slider;
		this.slider.holdOn();

		$.extend(_options , options);
		this.options = _options;

        //this.graph = this.options.https ? 'https://graph.facebook.com' : 'http://graph.facebook.com';
		this.graph = 'https://graph.facebook.com';

		var that = this;

		if(this.options.type === 'photostream'){
			$.getJSON(this.graph + '/' + this.options.username + '/photos/uploaded/?fields=source,name,link,images,from&limit=' + this.options.count + '&access_token=' + this.options.token , function(data){
				that._photosData(data);
			});
		}else{
			$.getJSON(this.graph + '/' + this.options.albumId + '/photos?fields=source,name,link,images,from&limit=' + this.options.count + '&access_token=' + this.options.token , function(data){
				that._photosData(data);
			});
		}

		// grab slide template from slider markup
		this.slideTemplate = this.slider.$element.find('.ms-slide')[0].outerHTML;
		this.slider.$element.find('.ms-slide').remove(); // remove all slides from slider markup
	};

	var p = MSFacebookGallery.prototype;

	p._photosData = function(content){

		if(content.error){
			this.errMsg('Facebook API ERROR#' + content.error.code + '(' + content.error.type + ')' + ': ' + content.error.message);
			return;
		}

		var that = this;
		var getInfo = this.options.author || this.options.desc;

		for(var i=0,l=content.data.length;i!==l;i++){

			var slide_cont = that.slideTemplate.replace(/{{[\w-]+}}/g, function(match){
				match = match.replace(/{{|}}/g, '');
				if( shortCodes[match] ) {
					return shortCodes[match](content.data[i], that);
				} else {
					return '{{'+match+'}}';
				}

			});

			$(slide_cont).appendTo(that.slider.$element);
		}

		that._initSlider();
	};

	p.errMsg = function(msg){
		this.slider.$element.css('display', 'block');
		if(!this.errEle)
			this.errEle = $('<div style="font-family:Arial; color:red; font-size:12px; position:absolute; top:10px; left:10px"></div>').appendTo(this.slider.$loading);

		this.errEle.html(msg);
	};

	p._initSlider = function(){
		this.slider.release();
	};

	var getImageSource = function(images, size){

		if( size === 'orginal' ) {
			return images[0].source;
		}

		for(var i = 0, l = images.length; i !== l; i++){
			if( images[i].source.indexOf(size + 'x' + size) !== -1 )
				return images[i].source;
		}
      //  console.log(images)
		return images[0].source;
	};

	// a list of functions that generates data from short codes
	var shortCodes = {
		'image': function(data, that){

			return getImageSource(data.images, that.options.imgSize);
		},

		'thumb': function(data, that){
			return getImageSource(data.images, that.options.thumbSize);
		},

		'name': function(data, that){
			return data.name;
		},

		'owner-name': function(data, that){
			return data.from.name;
		},

		'link': function(data, that){
			return data.link;
		}
	};

})(jQuery);
