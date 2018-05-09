/**
 * Master Slider overlay layers
 *
 */
;(function ( $, window, document, undefined ) {
    "use strict";

    window.MSOverlayLayers = function( slider ){
        this.slider = slider;
    };

    /* ------------------------------------------------------------------------------ */
    var p = MSOverlayLayers.prototype;

    p.setupLayerController = function(){
        this.layerController = new MSOverlayLayerController(this);
        this.slider.api.addEventListener( MSSliderEvent.RESIZE, this.setSize.bind(this) );
        this.slider.api.addEventListener( MSSliderEvent.CHANGE_START, this.setSize.bind(this) );
        this.setSize();
    };

    p.setSize = function(){
        this.__width = this.$element.width();
        this.__height = this.$element.height();

        this.layerController.setSize( this.__width, this.__height );
    };

    p.create = function(){
        this.layerController.create();
        this.layerController.loadLayers(this._onLayersLoad);
        this.layerController.prepareToShow();

        if ( window.pointerEventsPolyfill ) {
            window.pointerEventsPolyfill( {selector: '#' + this.slider.$element.attr('id') + ' ' + '.ms-overlay-layers', forcePolyfill:false } );
        }
    };

    p.getHeight = function() {
        return this.slider.api.currentSlide.getHeight();
    };

    p.destroy = function(){
        this.layerController.destroy();
    };

    /* ------------------------------------------------------------------------------ */

    p._onLayersLoad = function () {
        this.ready = true;
        this.selected = true;
        this.layersLoaded = true;
        this.setSize();
        this.layerController.showLayers();
    };

})(jQuery, window, document);
