/**
 * Toastr wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 * @requires
 *
 */
;(function ($) {
  'use strict';

  $.HSCore.components.HSToastr = {
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
     * Initialization of Toastr wrapper.
     *
     * @param String selector (optional)
     * @param Object config (optional)
     *
     * @return jQuery pageCollection - collection of initialized items.
     */
    init: function (selector, config) {
      this.collection = selector && $(selector).length ? $(selector) : $();
      if (!$(selector).length) return;

      this.config = config && $.isPlainObject(config) ?
        $.extend({}, this._baseConfig, config) : this._baseConfig;

      this.config.itemSelector = selector;

      this.initToastr();

      return this.pageCollection;
    },

    initToastr: function () {
      //Variables
      var $self = this,
        collection = $self.pageCollection;

      //Actions
      this.collection.each(function (i, el) {
        //Variables
        var $this = $(el),
          opts = {
            type: type,
            layout: layout,
            timeout: isProgressBar == true ? timeOut : false,
            animation: {
              open: 'animated ' + animationIn,
              close: 'animated ' + animationOut
            },
            closeWith: isCloseButton == true ? ['click', 'button'] : ['click'],
            text: resultMarkup(),
            theme: theme != '' ? theme : 'unify--v1'
          };

        var newNoty = new Noty(opts).show();

        //Actions
        collection = collection.add($this);
      });
    }
  }

})(jQuery);
