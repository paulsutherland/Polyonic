/**
 * CSS pointer-events polyfill
 * Adds support for `pointer-events: none;` for browsers not supporting this property
 * Requires jQuery@~1.9
 *
 * @copyright Sebastian Langer 2016
 * @license MIT
 * @author Sebastian Langer <sl@scn.cx>
 */
(function($){
    /**
     * Polyfill main-method
     * @param  {object} userOptions override default options
     */
    var Polyfill = function(userOptions){
        this.options = $.extend({}, Polyfill.defaultOptions, userOptions);

        this.isEnabled = false;

        if(this.options.forcePolyfill || !this.supportsPointerEvents()){
            this.registerEvents();
            this.isEnabled = true;
        }
    };

    Polyfill.defaultOptions = {
        forcePolyfill: false,
        selector: '*',
        listenOn: ['click', 'dblclick', 'mousedown', 'mouseup'],
        pointerEventsNoneClass: null,
        pointerEventsAllClass: null,
        eventNamespace: 'pointer-events-polyfill'
    };

    /**
     * registers events needed for the polyfill to work properly
     */
    Polyfill.prototype.registerEvents = function(){
        $(document).on(this.getEventNames(), this.options.selector, $.proxy(this.onElementClick, this));
    };

    /**
     * get all events as a jquery-compatible event string
     * @return {String} namespaced jquery-events
     */
    Polyfill.prototype.getEventNames = function(){
        var eventNamespace = this.options.eventNamespace ? '.' + this.options.eventNamespace : '';
        return this.options.listenOn.join(eventNamespace + ' ') + eventNamespace;
    };

    /**
     * detects support for css pointer-events
     * stolen from modernizr - https://github.com/Modernizr/Modernizr/blob/1f8af59/feature-detects/css/pointerevents.js
     * @return {boolean} indicates support
     */
    Polyfill.prototype.supportsPointerEvents = function(){
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        return style.pointerEvents === 'auto';
    };

    /**
     * recursively checks parent nodes if they have a pointer-events css-property
     * @param  {jQuery} $el element to test
     * @return {boolean}    indicates click-through-ability of the given element
     */
    Polyfill.prototype.isClickThrough = function($el){
        var elPointerEventsCss = $el.css('pointer-events');
        if($el.length === 0 || elPointerEventsCss === 'all' || $el.is(':root') || $el.hasClass(this.options.pointerEventsAllClass)){
            return false;
        }
        if(elPointerEventsCss === 'none' || $el.hasClass(this.options.pointerEventsNoneClass) || this.isClickThrough($el.parent())){
            return true;
        }
        return false;
    };

    /**
     * proxies click-through to underlying element if necessary
     * @param  {Event} e click-event
     * @return {boolean} preventDefault
     */
    Polyfill.prototype.onElementClick = function(e){
        var $elOrg = $(e.target);

        if(!this.isClickThrough($elOrg)){
            return true;
        }

        // retrieve element below the clicked one
        $elOrg.hide();
        var elBelow = document.elementFromPoint(e.clientX, e.clientY);

        // trigger the original element on the one below
        e.target = elBelow;
        $(elBelow).trigger(e);

        // open links
        if(elBelow.tagName === 'A') {
            // middle click (sometimes the browser blocks it as popup)
            if(e.which === 2) {
                window.open(elBelow.getAttribute('href'), '_blank');
            } else {
                elBelow.click();
            }
        }

        // restore clicked element
        $elOrg.show();

        return false;
    };

    /**
     * destroys the plugin - removes listeners and data
     */
    Polyfill.prototype.destroy = function(){
        $(document).off(this.getEventNames());
        this.isEnabled = false;
    };

    /**
     * make polyfill available globally
     * @param  {object} userOptions override default options
     * @return {Polyfill}           polyfill-object
     */
    window.pointerEventsPolyfill = function(userOptions){
        return new Polyfill(userOptions);
    };
})(jQuery);
