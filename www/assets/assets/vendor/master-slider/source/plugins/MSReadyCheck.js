;(function ( $, window, document, undefined ) {
    "use strict";

    // sample of using MSReady
    // ( window.MSReady = MSReady || [] ).push( function( jQuery ) {

    // });

    if ( window.MSReady ) {
        for ( var i = 0, l = MSReady.length; i !== l; i++ ) {
            MSReady[i].call( null, $ );
        }
    }
})(jQuery, window, document);
