(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-mosaic-projects').cubeportfolio({
        filters: '#js-filters-mosaic-projects1,#js-filters-mosaic-projects2',
        layoutMode: 'mosaic',
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 35,
        gapVertical: 30,
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
            options: {
                gapHorizontal: 30,
                gapVertical: 10,
            }
        }],
        caption: 'zoom',
        displayType: 'sequentially',
        displayTypeSpeed: 80,

        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    });
})(jQuery, window, document);