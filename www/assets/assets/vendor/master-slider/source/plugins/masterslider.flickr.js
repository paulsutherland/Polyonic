;(function($){
	
	var getPhotosetURL = function(key , id , count){
		return 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + key + '&photoset_id='+ id +'&per_page='+ count +'&format=json&jsoncallback=?';
	};
	
	var getUserPublicURL = function(key , id , count){
		return 'https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=' + key + '&user_id='+ id +'&per_page='+ count +'&format=json&jsoncallback=?';
	};
	
	var getImgInfoURL = function(key , id){
		return 'https://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + key + '&photo_id=' + id + '&format=json&jsoncallback=?';
	};
	
	var getImageSource = function(fid , server , id , secret , size){
		return 'https://farm' + fid + '.staticflickr.com/'+ server + '/' + id + '_' + secret + size + '.jpg';
	};
	
	window.MSFlickr = function(slider , options){
		
		var _options = {
			count			:10,
			type			:'photoset',
			desc			:true,
			title			:true,
			author			:true,
			thumbs			:true,
			descEff			:'fade',
			titleEff		:'fade',
			authorEff		:'fade',
			autoplayDelay 	: 4,
			/*
			 * s small square 75x75 
			 * q large square 150x150 
			 * t thumbnail, 100 on longest side
			 */ 
			thumbSize	:'q',  
			
			/*
			 * -	medium, 500 on longest side
			 * z	medium 640, 640 on longest side
			 * c	medium 800, 800 on longest side
			 * b	large, 1024 on longest side
			 * o	original image, either a jpg, gif or png, depending on source format
			 */
			imgSize		: 'c'
		};
		
		this.count = 0;
		this.slider = slider;
		//this.slider.preventInit = true;
		slider.holdOn();
		
		if(!options.key){
			this.errMsg('Flickr API Key required. Please add it in gallery options.');
			return;
		}
		
		$.extend(_options , options);
		this.options = _options;
		
		var that = this;
		
		if(this.options.type === 'photoset'){
			$.getJSON(getPhotosetURL(this.options.key , this.options.id , this.options.count) , function(data){
				that._photosData(data);
			});
		}else{
			$.getJSON(getUserPublicURL(this.options.key , this.options.id , this.options.count) , function(data){
				that.options.type = 'photos';
				that._photosData(data);
			});
		}
		
		if(this.options.imgSize !== '') 
			this.options.imgSize = '_' + this.options.imgSize;
			
		this.options.thumbSize = '_' + this.options.thumbSize;
	};
	
	var p = MSFlickr.prototype;
	
	p._photosData = function(data){
		
		if(data.stat === 'fail'){
			this.errMsg('Flickr API ERROR#' + data.code + ': ' + data.message);
			return;
		}
		
		var that = this;
		var getInfo = this.options.author || this.options.desc;
		
		$.each(data[this.options.type].photo, function(i,item){
			var slide_cont  = '<div class="ms-slide" id="slide-'+i+'" data-delay="'+that.options.autoplayDelay+'">';
			
			var title = item.title;
			
			//image
			slide_cont += '<img src="masterslider/blank.gif" data-src="' + getImageSource(item.farm , item.server , item.id , item.secret , that.options.imgSize) + '" alt="' + title + '" />';
			
			//thumb
			if(that.options.thumbs)
				slide_cont += '<img class="ms-thumb" src="' + getImageSource(item.farm , item.server , item.id , item.secret , that.options.thumbSize) + '" alt="' + title + '" />';
				
			if(that.options.title)
				slide_cont += '<div class="ms-layer ms-fkr-title" data-effect="' + that.options.titleEff + '" data-duration = "1000"  data-ease = "easeOutQuad"  data-type = "text">' + title + '</div>';
			
			slide_cont += '</div>';
			
			if(getInfo){
				that.count ++;
				$.getJSON(getImgInfoURL(that.options.key , item.id) , function(data){
					
					if(that.options.desc)
						$('#slide-'+i).append('<div class="ms-layer ms-fkr-desc" data-effect="' + that.options.descEff + '" data-duration = "1000"  data-ease = "easeOutQuad"  data-type = "text">' + data.photo.description._content + '</div>');
					
					if(that.options.author)
						$('#slide-'+i).append('<div class="ms-layer ms-fkr-author" data-effect="' + that.options.authorEff + '" data-duration = "1000"  data-ease = "easeOutQuad"  data-type = "text">' + data.photo.owner.realname + '</div>');
					
					that.count --;
					if(that.count === 0)
						that._initSlider();
				});
			}
			
			$(slide_cont).appendTo(that.slider.$element);
		});
		
		if(this.count === 0) that._initSlider();
	};
	
	p.errMsg = function(msg){
		this.slider.$element.css('display' , 'block');
		if(!this.errEle)
			this.errEle = $('<div style="font-family:Arial; color:red; font-size:12px; position:absolute; top:10px; left:10px"></div>').appendTo(this.slider.$loading);
		
		this.errEle.html(msg);
	};
	
	p._initSlider = function(){
		this.slider.release();
	};
	
})(jQuery);
