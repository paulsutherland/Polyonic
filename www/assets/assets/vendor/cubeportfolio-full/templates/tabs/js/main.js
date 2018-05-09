(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-tabs').cubeportfolio({
        filters: '#js-filters-tabs',
        defaultFilter: '.about',
        animationType: 'fadeOut',
        gridAdjustment: 'default',
        displayType: 'default',
        caption: '',
    });
})(jQuery, window, document);
