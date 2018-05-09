/**
 * Icon's Demo.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;(function($){
	'use strict';

  $('.js-icons-demo-item__value').each(function() {
    var IconsValue = $(this).siblings('.u-icon-v1').children().attr('class');
    $(this).val(IconsValue);
  });

    $('.js-icons-demo-item__value-2').each(function() {
    var IconsValue = $(this).siblings('.u-icon-v1').children().text();
    $(this).val(IconsValue);
  });

})(jQuery);