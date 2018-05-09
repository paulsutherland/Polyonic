/**
 * Multi select wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 * @requires
 *
 */
;
(function($) {
	'use strict';

	$.HSCore.components.HSMultiSelect = {
		/**
		 *
		 *
		 * @var Object _baseConfig
		 */
		_baseConfig: {},

		/**
		 *
		 *
		 * @var jQuery pageCollection
		 */
		pageCollection: $(),

		/**
		 * Initialization of Multi select wrapper.
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

			this.initMultiSelect(selector, config);
		},

		initMultiSelect: function(el, conf) {
			//Variables
			var $el = $(el);

			//Actions
			$el.each(function() {
				var $this = $(this),
					customClass = $this.data('multiselect-class'),
          divider = $this.data('multiselect-divider');

				$this.multiSelect($.extend(true, {}, conf, {
					cssClass: customClass,
					afterInit: function() {
						var $selectableItems = $($(this)[0].$selectableUl[0].children),
							$selectionItems = $($(this)[0].$selectionUl[0].children);

            $(divider).insertAfter($(this)[0].$selectableContainer[0]);

						$selectableItems.each(function() {
							var iconClasses = $(this).data('multiselect-icon');

							$(this).prepend('<i class="' + iconClasses + '"></i>');
						});

						$selectionItems.each(function() {
							var iconClasses = $(this).data('multiselect-icon');

							$(this).prepend('<i class="' + iconClasses + '"></i>');
						});
					}
				}));
			});
		}
	}

})(jQuery);
