(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-agency').cubeportfolio({
        filters: '#js-filters-agency',
        layoutMode: 'grid',
        defaultFilter: '*',
        animationType: 'slideLeft',
        gapHorizontal: 35,
        gapVertical: 15,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1500,
            cols: 5,
        }, {
            width: 1100,
            cols: 4,
        }, {
            width: 800,
            cols: 3,
        }, {
            width: 480,
            cols: 2,
        }],
        caption: 'zoom',
        displayType: 'fadeIn',
        displayTypeSpeed: 100,

        plugins: {
            loadMore: {
                element: '#js-loadMore-agency',
                action: 'click',
                loadItems: 3,
            },
            sort: {
                element: '#js-sort-agency'
            }
        },
    });
})(jQuery, window, document);