/**
 * Overlaye layer controller extends layer controller
 * @since 2.50.0
 */
;(function ( $, window, document, undefined ) {
    "use strict";


    window.MSOverlayLayerController = function( slide ){
        MSLayerController.apply( this, arguments );
    }

    /* ------------------------------------------------------------------------------ */
    MSOverlayLayerController.extend(MSLayerController);
    var p = MSOverlayLayerController.prototype;
    var _super = MSLayerController.prototype;
    /* ------------------------------------------------------------------------------ */

    /**
     * @override
     */
    p.addLayer = function (layer) {
        var showOnSlides = layer.$element.data('show-on'),
            hideOnSlides = layer.$element.data('hide-on');

        if (hideOnSlides ) {
            layer.hideOnSlides = hideOnSlides.replace(/\s+/g, '').split(',');
        }

        if (showOnSlides ) {
            layer.showOnSlides = showOnSlides.replace(/\s+/g, '').split(',');
        }

        _super.addLayer.apply( this, arguments );
    };

    /**
     * @override
     */
    p.create = function () {
        _super.create.apply( this, arguments );
        this.slider.api.addEventListener( MSSliderEvent.CHANGE_START, this.checkLayers.bind(this) );
    };

    p.checkLayers = function(){
        if ( !this.ready ) {
            return;
        }

        for(var i = 0; i !== this.layersCount; ++i){
            var layer = this.layers[i];
            if ( !layer.waitForAction ) {
                if ( this._checkForShow( layer ) ) {
                    layer.start();
                } else {
                    layer.hide();
                }
            }
        }
    };

    /**
     * enable parallax effect, overlay layars doesn't support swipe parallax
     */
    p._enableParallaxEffect = function(){
        this.slider.view.$element.on('mousemove' , {that:this}, this._mouseParallaxMove)
                                 .on('mouseleave', {that:this}, this._resetParalax);
    };

    /**
     * disable parallax effect
     * overlay layers doesn't support swipe parallax
     */
    p._disableParallaxEffect = function(){
        this.slider.view.$element.off('mousemove', this._mouseParallaxMove)
                                 .off('mouseleave', this._resetParalax);
    };

    /* ------------------------------------------------------------------------------ */
    /**
     * start layer effect
     */
    p._startLayers = function(){
        for(var i = 0; i !== this.layersCount; ++i){
            var layer = this.layers[i];

            if ( this._checkForShow( layer ) && !layer.waitForAction ) {
                layer.start();
            }
        }
    };

    p._checkForShow = function( layer ) {
        var slideId = this.slider.api.currentSlide.id,
            layerHideOn = layer.hideOnSlides,
            layerShowOn = layer.showOnSlides;

        if ( layerShowOn ) {
            return !!slideId && layerShowOn.indexOf( slideId ) !== -1;
        }

        return !slideId || !layerHideOn || ( layerHideOn.length && layerHideOn.indexOf( slideId ) === -1 );
    };

})(jQuery, window, document);
