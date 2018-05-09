;(function($){

    "use strict";

    window.MSBoxView = function(options){
        MSBasicView.call(this , options);
        this.$element.removeClass('ms-basic-view').addClass('ms-box-view');
        this.controller.renderCallback(this.__update , this);
    };

    MSBoxView.extend(MSFadeView);
    MSBoxView._3dreq = true;

    var p  = MSBoxView.prototype;
    var _super  = MSFadeView.prototype;

    /*-------------- METHODS --------------*/

    p.__updateSlides = function(slide , distance){
        var value =  Math.abs(distance / this[this.__dimension]),
            element = slide.$element[0];

        if(1 - value <= 0){
            //element.style.opacity = 0.5;
            element.style.visibility = 'hidden';
            element.style[window._jcsspfx + 'Transform'] = '';
        }else{
            //element.style.opacity = 0.5 + (1 - value) * 0.5;
            element.style.visibility = '';
            element.style[window._jcsspfx + 'Transform'] = 'rotate' + this._rotateDir + '('+(value* (distance < 0 ? 1 : -1)) * 90 * this._calcFactor +'deg)';
            element.style[window._jcsspfx + 'TransformOrigin'] = '50% 50% -' + ( slide[this.__dimension] / 2 ) + 'px' ;
            element.style.zIndex = Math.ceil((1 - value) * 2);
        }
    };

    p.create = function(index){
        _super.create.call(this , index);
        this.controller.options.minValidDist = 0.03;
        this._rotateDir = this.options.dir === 'h' ? 'Y' : 'X';
        this._calcFactor = this.options.dir === 'h' ? 1 :  -1;

    };

    MSSlideController.registerView('box' , MSBoxView);
})(jQuery);
