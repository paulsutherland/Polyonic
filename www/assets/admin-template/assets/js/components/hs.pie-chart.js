/**
 * Line chart wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;(function ($) {
  'use strict';

  $.HSCore.components.HSPieChart = {
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
        var optFillColors = JSON.parse(el.getAttribute('data-fill-colors'));

        $(el).attr('id', 'pieCharts' + i);

        $('<style id="pieChartsStyle'+ i +'"></style>').insertAfter($(el));

        //Variables
        var pieChartStyles = '',
          optSeries = JSON.parse(el.getAttribute('data-series')),
          optStartAngle = $(el).data('start-angle'),
          data = {
            series: optSeries
          },
          options = {
            showLabel: false,
            chartPadding: 0,
            startAngle: optStartAngle
          };

        var chart = new Chartist.Pie(el, data, options),
          isOnceCreatedTrue = 1;

        chart.on('created', function(){
          if (isOnceCreatedTrue == 1) {
            $(el).find('.ct-series').each(function(i2) {
              pieChartStyles += '#pieCharts' + i +' .ct-series:nth-child('+ (i2 + 1) +') .ct-slice-pie {fill: ' + optFillColors[i2] +'}';
            });

            $('#pieChartsStyle' + i).text(pieChartStyles);
          }

          isOnceCreatedTrue++;
        });

        //Actions
        collection = collection.add($(el));
      });
    }
  };
})(jQuery);
