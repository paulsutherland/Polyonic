(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-faq').cubeportfolio({
        filters: '#js-filters-faq',
        defaultFilter: '*',
        animationType: 'sequentially',
        gridAdjustment: 'default',
        displayType: 'default',
        caption: 'expand',
        gapHorizontal: 0,
        gapVertical: 0,
    });
})(jQuery, window, document);