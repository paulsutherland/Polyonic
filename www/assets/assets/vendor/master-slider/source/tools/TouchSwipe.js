;(function($){

    "use strict";

    var isTouch     = 'ontouchstart' in document,
        isPointer   = window.navigator.pointerEnabled,
        isMSPoiner  = !isPointer && window.navigator.msPointerEnabled,
        usePointer  = isPointer || isMSPoiner,
    // Events
        ev_start  = (isPointer ? 'pointerdown ' : '' ) + (isMSPoiner ? 'MSPointerDown ' : '' ) + (isTouch ? 'touchstart ' : '' ) + 'mousedown',
        ev_move   = (isPointer ? 'pointermove ' : '' ) + (isMSPoiner ? 'MSPointerMove ' : '' ) + (isTouch ? 'touchmove '  : '' ) + 'mousemove',
        ev_end    = (isPointer ? 'pointerup '   : '' ) + (isMSPoiner ? 'MSPointerUp '   : '' ) + (isTouch ? 'touchend '   : '' ) + 'mouseup',
        ev_cancel = (isPointer ? 'pointercancel '   : '' ) + (isMSPoiner ? 'MSPointerCancel ': '' ) + 'touchcancel';


    averta.TouchSwipe = function($element){
        this.$element = $element;
        this.enabled = true;

        $element.bind(ev_start  , {target: this} , this.__touchStart);

        $element[0].swipe = this;

        this.onSwipe    = null;
        this.swipeType  = 'horizontal';
        this.noSwipeSelector = 'input, textarea, button, .no-swipe, .ms-no-swipe';

        this.lastStatus = {};

    };

    var p = averta.TouchSwipe.prototype;

    /*-------------- METHODS --------------*/

    p.getDirection = function(new_x , new_y){
        switch(this.swipeType){
            case 'horizontal':
                return new_x <= this.start_x ? 'left' : 'right';
            break;
            case 'vertical':
                return new_y <= this.start_y ? 'up' : 'down';
            break;
            case 'all':
                if(Math.abs(new_x - this.start_x) > Math.abs(new_y - this.start_y))
                    return new_x <= this.start_x ? 'left' : 'right';
                else
                    return new_y <= this.start_y ? 'up' : 'down';
            break;
        }
    };

    p.priventDefultEvent = function(new_x , new_y){
        //if(this.priventEvt != null) return this.priventEvt;
        var dx = Math.abs(new_x - this.start_x);
        var dy = Math.abs(new_y - this.start_y);

        var horiz =  dx > dy;

        return (this.swipeType === 'horizontal' && horiz) ||
               (this.swipeType === 'vertical' && !horiz);

        //return this.priventEvt;
    };

    p.createStatusObject = function(evt){
        var status_data = {} , temp_x , temp_y;

        temp_x = this.lastStatus.distanceX || 0;
        temp_y = this.lastStatus.distanceY || 0;

        status_data.distanceX = evt.pageX - this.start_x;
        status_data.distanceY = evt.pageY - this.start_y;
        status_data.moveX = status_data.distanceX - temp_x;
        status_data.moveY = status_data.distanceY - temp_y;

        status_data.distance  = parseInt( Math.sqrt(Math.pow(status_data.distanceX , 2) + Math.pow(status_data.distanceY , 2)) );

        status_data.duration  = new Date().getTime() - this.start_time;
        status_data.direction = this.getDirection(evt.pageX , evt.pageY);

        return status_data;
    };


    p.__reset = function(event , jqevt){
        this.reset = false;
        this.lastStatus = {};
        this.start_time = new Date().getTime();

        var point = this.__getPoint( event, jqevt );
        this.start_x = point.pageX;
        this.start_y = point.pageY;
    };

    p.__touchStart = function(event){

        var swipe = event.data.target;
        var jqevt = event;
        if(!swipe.enabled) return;

        if ( $(event.target).closest(swipe.noSwipeSelector, swipe.$element).length > 0 ) {
            return;
        }

        event = event.originalEvent;

        if( usePointer ) {
            $(this).css('-ms-touch-action', swipe.swipeType === 'horizontal' ? 'pan-y' : 'pan-x');
        }

        if(!swipe.onSwipe) {
            $.error('Swipe listener is undefined');
            return;
        }

        // don't catch the touch start again, also don't go further if the delay between touchstart and mousedown is small
        // if ( swipe.touchStarted ) {
        if ( swipe.touchStarted || isTouch && swipe.start_time && event.type === 'mousedown' &&  new Date().getTime() - swipe.start_time < 600 ) {
            return;
        }

        var point = swipe.__getPoint( event, jqevt );
        swipe.start_x = point.pageX;
        swipe.start_y = point.pageY;

        swipe.start_time = new Date().getTime();

        $(document).bind(ev_end    , {target: swipe} , swipe.__touchEnd).
                    bind(ev_move   , {target: swipe} , swipe.__touchMove).
                    bind(ev_cancel , {target: swipe} , swipe.__touchCancel);

        var status = swipe.createStatusObject(point);
        status.phase = 'start';

        swipe.onSwipe.call(null , status);

        if(!isTouch)
            jqevt.preventDefault();

        swipe.lastStatus = status;
        swipe.touchStarted = true;
    };

    p.__touchMove = function(event){
        var swipe = event.data.target;
        var jqevt = event;
        event = event.originalEvent;

        if(!swipe.touchStarted) return;

        clearTimeout(swipe.timo);
        swipe.timo = setTimeout(function(){swipe.__reset(event , jqevt);} , 60);

        var point = swipe.__getPoint( event, jqevt );

        var status = swipe.createStatusObject(point);

        if(swipe.priventDefultEvent(point.pageX , point.pageY))
            jqevt.preventDefault();

        status.phase = 'move';

        //if(swipe.lastStatus.direction !== status.direction) swipe.__reset(event , jqevt);

        swipe.lastStatus = status;

        swipe.onSwipe.call(null , status);
    };

    p.__touchEnd = function(event){

        var swipe = event.data.target;
        var jqevt = event;
        event = event.originalEvent;

        clearTimeout(swipe.timo);

        var status = swipe.lastStatus;

        if(!isTouch)
            jqevt.preventDefault();

        status.phase = 'end';

        swipe.touchStarted = false;
        swipe.priventEvt   = null;

        $(document).unbind(ev_end     , swipe.__touchEnd).
                    unbind(ev_move    , swipe.__touchMove).
                    unbind(ev_cancel  , swipe.__touchCancel);

        status.speed = status.distance / status.duration;

        swipe.onSwipe.call(null , status);

    };

    p.__touchCancel = function(event){
        var swipe = event.data.target;
        swipe.__touchEnd(event);
    };

    p.__getPoint = function( event, jqEvent ) {
        if ( isTouch && event.type.indexOf('mouse') === -1 ) {
            return event.touches[0];
        } else if ( usePointer ) {
            return event;
        } else {
            return jqEvent;
        }
    };

    p.enable = function(){
        if(this.enabled) return;
        this.enabled = true;
    };

    p.disable = function(){
        if(!this.enabled) return;
        this.enabled = false;
    };

})(jQuery);
