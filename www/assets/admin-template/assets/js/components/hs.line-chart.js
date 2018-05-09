/**
 * Line chart wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;(function ($) {
  'use strict';

  $.HSCore.components.HSCharts = {
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
     * Initialization of Line chart wrapper.
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

      this.initCharts();

      return this.pageCollection;

    },

    initCharts: function () {
      //Variables
      var $self = this,
        collection = $self.pageCollection;

      //Actions
      this.collection.each(function (i, el) {
        //Variables
        var $this = el,
          data = {
            labels: ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [1000000, 2000000, 3000000, 1000000, 2000000, 4700000, 1000000, 0, 1000000, 2000000, 3000000, 1000000],
              [2000000, 1000000, 2000000, 1000000, 2500000, 1000000, 2000000, 1000000, 2500000, 1000000, 2000000, 1000000],
              [0, 0, 0, 1000000, 2000000, 2500000, 2000000, 1000000, 0, 1000000, 2000000, 2500000],
              [2500000, 2000000, 1000000, 500000, 1000000, 500000, 1000000, 2500000, 500000, 1000000, 500000, 1000000]
            ]
          },
          options = {
            height: '300px',
            high: 5000000,
            low: 0,
            showArea: true,
            showLine: false,
            showPoint: false,
            fullWidth: true,
            stackBars: true,
            axisX: {
              showGrid: false
            },
            axisY: {
              labelInterpolationFnc: function (value) {
                return (value / 1000000) + ' m';
              }
            },
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          };

        new Chartist.Line($this, data, options);

        //Actions
        collection = collection.add($this);
      });
    }
  };
})(jQuery);
