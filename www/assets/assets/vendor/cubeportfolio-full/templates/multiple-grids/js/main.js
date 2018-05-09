/* juicy-projects */
(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-juicy-projects').cubeportfolio({
        filters: '#js-filters-juicy-projects',
        layoutMode: 'grid',
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
                caption: '',
            }
        }],
        caption: 'overlayBottomReveal',
        displayType: 'sequentially',
        displayTypeSpeed: 80,

        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

        // singlePage popup
        singlePageDelegate: '.cbp-singlePage',
        singlePageDeeplinking: true,
        singlePageStickyNavigation: true,
        singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageCallback: function(url, element) {
            // to update singlePage content use the following method: this.updateSinglePage(yourContent)
            var t = this;

            $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    timeout: 30000
                })
                .done(function(result) {
                    t.updateSinglePage(result);
                })
                .fail(function() {
                    t.updateSinglePage('AJAX Error! Please refresh the page!');
                });
        },

        plugins: {
            loadMore: {
                element: '#js-loadMore-juicy-projects',
                action: 'click',
                loadItems: 3,
            }
        },
    });
})(jQuery, window, document);

/* masonry */
(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-masonry').cubeportfolio({
        filters: '#js-filters-masonry',
        layoutMode: 'grid',
        defaultFilter: '*',
        animationType: 'slideDelay',
        gapHorizontal: 20,
        gapVertical: 20,
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
                caption: '',
            }
        }],
        caption: 'overlayBottomAlong',
        displayType: 'bottomToTop',
        displayTypeSpeed: 100,

        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    });
})(jQuery, window, document);

/* slider-testimonials */
(function($, window, document, undefined) {
    'use strict';

    // init cubeportfolio
    $('#js-grid-slider-testimonials').cubeportfolio({
        layoutMode: 'slider',
        drag: true,
        auto: false,
        autoTimeout: 5000,
        autoPauseOnHover: true,
        showNavigation: true,
        showPagination: true,
        rewindNav: true,
        scrollByPage: false,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 0,
            cols: 1,
        }],
        gapHorizontal: 0,
        gapVertical: 0,
        caption: '',
        displayType: 'default',
    });
})(jQuery, window, document);

/* slider-team */
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
        }],
        gapHorizontal: 0,
        gapVertical: 45,
        caption: '',
        displayType: 'fadeIn',
        displayTypeSpeed: 400,
    });
})(jQuery, window, document);