/**
 * File attachment wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;
(function($) {
	'use strict';

	$.HSCore.components.HSFileAttachment = {
		/**
		 *
		 *
		 * @var Object _baseConfig
		 */
		_baseConfig: {
			changeInput: '<div class="g-parent g-pos-rel g-height-230 g-bg-gray-light-v8--hover g-brd-around g-brd-style-dashed g-brd-gray-light-v7 g-brd-lightblue-v3--hover g-rounded-4 g-transition-0_2 g-transition--ease-in g-pa-15 g-pa-30--md g-mb-60">\
              <div class="d-md-flex align-items-center g-absolute-centered--md w-100 g-width-auto--md">\
                <div>\
                  <div class="g-pos-rel g-width-80 g-width-100--lg g-height-80 g-height-100--lg g-bg-gray-light-v8 g-bg-white--parent-hover rounded-circle g-mb-20 g-mb-0--md g-transition-0_2 g-transition--ease-in mx-auto mx-0--md">\
                    <i class="hs-admin-cloud-up g-absolute-centered g-font-size-30 g-font-size-36--lg g-color-lightblue-v3"></i>\
                  </div>\
                </div>\
                <div class="text-center text-md-left g-ml-20--md">\
                  <h3 class="g-font-weight-400 g-font-size-16 g-color-black g-mb-10">Upload Your Files</h3>\
                  <p class="g-font-weight-300 g-color-gray-dark-v6 mb-0">Drag your files here or click upload button and browse from your computer.</p>\
                </div>\
              </div>\
            </div>',
			showThumbs: true,
			templates: {
				box: '<header>\
                <h2 class="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">Manage Media</h2>\
              </header>\
              <hr class="d-flex g-brd-gray-light-v7 g-my-15 g-my-25--md">\
              <div class="js-result-list row g-mx-minus-8"></div>',
				item: '<div class="js-result-list__item col-md-3 text-center g-px-8 g-mb-15">\
	              <div class="align-items-center h-100 g-brd-around g-brd-gray-light-v7 g-rounded-2 g-pa-15">\
	                <h3 class="g-font-size-16 g-color-gray-dark-v2 g-mb-5">{{fi-name}}</h3>\
	                <p class="g-font-size-12 g-color-gray-light-v2 g-mb-5">{{fi-size2}}</p>\
	                <div class="g-mb-10">{{fi-image}}</div>\
	                <div>{{fi-progressBar}}</div>\
	              </div>\
	             </div>',
				itemAppend: '<div class="js-result-list__item col-md-3">\
	                    <div class="g-pa-10 g-brd-around g-brd-gray-light-v2">\
	                      <h3 class="g-font-size-16 g-color-gray-dark-v2 g-mb-5">{{fi-name}}</h3>\
	                      <p class="g-font-size-12 g-color-gray-light-v2 g-mb-5">{{fi-size2}}</p>\
	                      <div class="g-mb-10">{{fi-image}}</div>\
	                      <div class="text-left">{{fi-progressBar}}</div>\
	                      <div>{{fi-icon}}</div>\
	                      <div><i class="js-result-list-item-remove fa fa-close"></i></div>\
	                    </div>\
	                   </div>',
				progressBar: '<progress class="u-progress-bar-v1"></progress>',
				_selectors: {
					list: '.js-result-list',
					item: '.js-result-list__item',
					progressBar: '.u-progress-bar-v1',
					remove: '.js-result-list-item-remove'
				},
				itemAppendToEnd: false,
				removeConfirmation: true
			},
			uploadFile: {
				url: '../../../html/assets/include/php/file-upload/upload.php',
				data: {},
				type: 'POST',
				enctype: 'multipart/form-data',
				beforeSend: function() {},
				success: function(data, element) {
					var parent = element.find(".u-progress-bar-v1").parent();
					element.find(".u-progress-bar-v1").fadeOut("slow", function() {
						$("<div class=\"text-success g-px-10\"><i class=\"fa fa-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
					});
				},
				error: function(element) {
					var parent = element.find(".u-progress-bar-v1").parent();
					element.find(".u-progress-bar-v1").fadeOut("slow", function() {
						$("<div class=\"text-error g-px-10\"><i class=\"fa fa-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");
					});
				}
			}
		},

		/**
		 *
		 *
		 * @var jQuery pageCollection
		 */
		pageCollection: $(),

		/**
		 * Initialization of File attachment wrapper.
		 *
		 * @param String selector (optional)
		 * @param Object config (optional)
		 *
		 * @return jQuery pageCollection - collection of initialized items.
		 */

		init: function(selector, config) {
			if (!selector) return;

			var $collection = $(selector);

			if (!$collection.length) return;

			config = config && $.isPlainObject(config) ? $.extend(true, {}, this._baseConfig, config) : this._baseConfig;

			this.initFileAttachment(selector, config);
		},

		initFileAttachment: function(el, conf) {
			//Variables
			var $el = $(el);

			//Actions
			$el.each(function() {
				var $this = $(this);

				$this.filer($.extend(true, {}, conf, {
					dragDrop: {}
				}));
			});
		}
	};
})(jQuery);
