(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-slider-team').cubeportfolio({
        layoutMode: 'slider',
        drag: true,
        auto: false,
        autoTimeout: 5000,
        autoPauseOnHover: true,
        showNavigation: false,
        showPagination: true,
        rewindNav: true,
        scrollByPage: true,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1680,
            cols: 5,
        }, {
            width: 1350,
            cols: 4,
        }, {
            width: 800,
            cols: 3,
        }, {
            width: 480,
            cols: 2,
            options: {
                gapVertical: 20,
            }
        }],
        gapHorizontal: 0,
        gapVertical: 45,
        caption: '',
        displayType: 'fadeIn',
        displayTypeSpeed: 400,
    });
})(jQuery, window, document);