(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-clients').cubeportfolio({
        layoutMode: 'slider',
        drag: true,
        auto: true,
        autoTimeout: 3000,
        autoPauseOnHover: true,
        showNavigation: false,
        showPagination: true,
        rewindNav: true,
        scrollByPage: false,
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
        gapHorizontal: 0,
        gapVertical: 5,
        caption: 'opacity',
        displayType: 'fadeIn',
        displayTypeSpeed: 100,
    });
})(jQuery, window, document);