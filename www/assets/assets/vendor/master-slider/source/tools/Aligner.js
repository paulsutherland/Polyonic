;(function(){

	"use strict";

	window.MSAligner = function(type , $container , $img ){

		this.$container = $container;
		this.$img	    = $img;

		this.type 		= type || 'stretch'; // fill , fit , stretch , tile , center

		this.widthOnly = false;
		this.heightOnly = false;
	};

	var p = MSAligner.prototype;

	/*-------------- METHODS --------------*/

	p.init = function(w , h){

		this.baseWidth = w;
		this.baseHeight = h;
		this.imgRatio = w / h;
		this.imgRatio2 = h / w;

		switch(this.type){
			case 'tile':
				this.$container.css('background-image' , 'url('+ this.$img.attr('src') +')');
				this.$img.remove();
			break;
			case 'center':
				this.$container.css('background-image' , 'url('+ this.$img.attr('src') +')');
				this.$container.css({
					backgroundPosition 	: 'center center',
					backgroundRepeat	: 'no-repeat'
				});
				this.$img.remove();
			break;
			case 'stretch':
				this.$img.css({
					width	: 	'100%',
					height	: 	'100%'
				});
			break;
			case 'fill':
			case 'fit' :
				this.needAlign = true;
				this.align();
			break;
		}

	};

	p.align = function(){
		if(!this.needAlign) return;

		var cont_w = this.$container[0].offsetWidth;
		var cont_h = this.$container[0].offsetHeight;

		var contRatio = cont_w / cont_h;

		if(this.type == 'fill'){
			if(this.imgRatio < contRatio ){
				this.$img.width(cont_w);
				this.$img.height(cont_w * this.imgRatio2);
			}else{
				this.$img.height(cont_h);
				this.$img.width(cont_h * this.imgRatio);
			}

		}else if(this.type == 'fit'){

			if(this.imgRatio < contRatio){
				this.$img.height(cont_h);
				this.$img.width(cont_h * this.imgRatio);
			}else{
				this.$img.width(cont_w);
				this.$img.height(cont_w * this.imgRatio2);
			}
		}

		this.setMargin();

	};

	p.setMargin = function(){

		var cont_w = this.$container[0].offsetWidth;
		var cont_h = this.$container[0].offsetHeight;

		this.$img.css('margin-top' , (cont_h - this.$img[0].offsetHeight) / 2 + 'px');
		this.$img.css('margin-left', (cont_w - this.$img[0].offsetWidth ) / 2 + 'px');
	}

})();
