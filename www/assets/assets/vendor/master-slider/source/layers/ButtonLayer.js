/**
 * Master Slider Button Layer
 * @author Averta
 * @since 1.7.2
 * @extends {MSLayerElement}
 */
(function($){

	window.MSButtonLayer = function(){
		MSLayerElement.call(this);
		
		this.type = 'button';
	};
	
	MSButtonLayer.extend(MSLayerElement);
	
	var p = MSButtonLayer.prototype;
	var _super = MSLayerElement.prototype;
	
	var positionKies = ['top', 'left', 'bottom', 'right'];

	/*-------------- METHODS --------------*/
	
	p.create = function(){
		_super.create.call(this);
		this.$element.wrap('<div class="ms-btn-container"></div>').css('position', 'relative');
		this.$container = this.$element.parent();
	};

	p.locate = function(){
		_super.locate.call(this);
		var key, tempValue;

		for (var i=0; i<4; i++){
			key = positionKies[i];
			if ( key in this.baseStyle ) {
				tempValue = this.$element.css(key);
				this.$element.css(key, '');
				this.$container.css(key, tempValue);
			}
		}

		this.$container.width(this.$element.outerWidth(true))
					   .height(this.$element.outerHeight(true));
	};
	
})(jQuery);