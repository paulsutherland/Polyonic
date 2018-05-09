/**
 * File Upload wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;(function ($) {
  'use strict';

  $.HSCore.components.HSFileUpload = {
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
     * Initialization of File Upload wrapper.
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

      this.initFileUpload();

      return this.pageCollection;

    },

    initFileUpload: function () {
      //Variables
      var $self = this,
        collection = $self.pageCollection;

      //Actions
      this.collection.each(function (i, el) {
        //Variables
        var $this = $(el),
          $helper = $('<input id="hsFile" type="file" name="hs-file" style="display: none;">').insertBefore($this),
          $dataCollection = $('<input id="hsDataCollection" type="hidden" name="hs-data-collection">').insertBefore($this),
          elementClasses = $this.data('element-classes'),
          iconClasses = $this.data('icon-classes'),
          textClasses = $this.data('text-classes'),
          removeBtnClasses = $this.data('remove-btn-classes'),
          dataArray = [];

        $this.on('click', function () {
          $($helper).trigger('click');
        });

        $helper.on('change', function () {
          var thisVal = $(this).val(),
            formatedVal = thisVal.replace(/.+[\\\/]/, ''),
            template = $('<div id="hsFileItem' + i + '" class="js-file-item ' + elementClasses + '">' +
              '<i class="' + iconClasses + '"></i>' +
              '<span class="' + textClasses + '">' + formatedVal + '</span>' +
              '<i class="js-remove-file ' + removeBtnClasses + '" data-value="' + thisVal + '"></i>' +
              '</div>');

          dataArray.push({
            "file": thisVal
          });

          $dataCollection.val(JSON.stringify(dataArray));

          template.insertAfter($(this));
        });

        $('body').on('click', '.js-remove-file', function () {
          var val = $(this).data('value');

          dataArray = dataArray.filter(function(el) {
            return el.file !== val;
          });

          $(this).parent().remove();

          $dataCollection.val(JSON.stringify(dataArray));

          if(!dataArray.length) {
            $helper.val('');
          }
        });

        //Actions
        collection = collection.add($this);
      });
    }
  };
})(jQuery);
