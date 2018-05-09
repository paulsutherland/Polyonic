/**
 * Side Nav wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 * @requires
 *
 */

var isSideMenuMini = $.cookie('isSideMenuMini') ? true : '';

;
(function($) {
	'use strict';

	$.HSCore.components.HSSideNav = {
		/**
		 *
		 *
		 * @var Object _baseConfig
		 */
		_baseConfig: {
			afterOpen: function (){},
			afterClose: function (){}
		},

		/**
		 *
		 *
		 * @var jQuery pageCollection
		 */
		pageCollection: $(),

		/**
		 * Initialization of Side Nav wrapper.
		 *
		 * @param String selector (optional)
		 * @param Object config (optional)
		 *
		 * @return jQuery pageCollection - collection of initialized items.
		 */
		init: function(selector, config) {
			this.collection = selector && $(selector).length ? $(selector) : $();
			if (!$(selector).length) return;

			this.config = config && $.isPlainObject(config) ?
				$.extend({}, this._baseConfig, config) : this._baseConfig;

			this.config.itemSelector = selector;

			this.initSideNav();

			return this.pageCollection;
		},

		initSideNav: function() {
			//Variables
			var $self = this,
				config = $self.config,
				collection = $self.pageCollection;

			//Actions
			this.collection.each(function(i, el) {
				//Variables
				var $this = $(el),
					target = $this.data('hssm-target'),
					targetClass = $this.data('hssm-class'),
					bodyClass = $this.data('hssm-body-class'),
					isUnifyEffect = Boolean($this.data('hssm-fade-effect')),
					isShowAllExceptThis = Boolean($this.data('hssm-is-close-all-except-this')),
					$closedItems = [],
					windW = $(window).width();

				$(target).find('[data-hssm-target]').each(function(i) {
					if ($(this).parent().hasClass('u-side-nav--top-level-menu-item u-side-nav-opened')) {
						$closedItems.push($(this).data('hssm-target'));
					}
				});

				// if (isUnifyEffect) {
				// 	$this.on('click', function(e) {
				// 		e.preventDefault();
        //
				// 		if (!$(target).hasClass('toggled')) {
				// 			$self.unifyOpenEffect(target, targetClass, bodyClass);
				// 			$.cookie('isSideMenuMini', true);
				// 		} else {
				// 			$self.unifyCloseEffect(target, targetClass, bodyClass);
				// 			$.cookie('isSideMenuMini', '');
				// 		}
				// 	});
				// } else {
					$this.on('click', function(e) {
						e.preventDefault();

						if (!$(target).hasClass('toggled')) {
							$self.defaultOpenEffect(target, $closedItems, targetClass, bodyClass, config.afterOpen);
							$.cookie('isSideMenuMini', true);
						} else {
							$self.defaultCloseEffect(target, $closedItems, targetClass, bodyClass, config.afterClose);
							$.cookie('isSideMenuMini', '');
						}
					});
				// }

				$(target).find('[data-hssm-target]').on('click', function(e) {
					e.preventDefault();

					var itemTarget = $(this).data('hssm-target'),
						$itemParent = $(this).parent();

					if (isShowAllExceptThis) {
						if (!$('body').hasClass('u-side-nav-mini')) {
							$itemParent.parent().find('> li:not(".has-active") > ul:not("' + itemTarget + '")').slideUp(400, function() {
								$(this).parent().removeClass('u-side-nav-opened');
								$closedItems.push(itemTarget);
							});
						} else {
							$itemParent.parent().find('> li > ul:not("' + itemTarget + '")').slideUp(400, function() {
								$(this).parent().removeClass('u-side-nav-opened');
								$closedItems.push(itemTarget);
							});
						}
					} else {
						if (!$(this).parent().hasClass('u-side-nav-opened')) {
							$closedItems.push(itemTarget);
						} else {
							$closedItems = $.grep($closedItems, function(value) {
								return value != itemTarget;
							});
						}
					}

					// $(itemTarget).slideToggle(400, function() {
					// 	$(this).parent().toggleClass('u-side-nav-opened');
					// });
					$(itemTarget).slideToggle(400)
					.parent().toggleClass('u-side-nav-opened');
				});

				if (windW <= 992 || isSideMenuMini == true) {
					$(this).trigger('click');
				}

				$(window).on('resize', function() {
					var windW = $(window).width();

					if (windW <= 992) {
						$this.removeClass('once-opened');

						if (!$this.hasClass('is-active')) {
							if (!$this.hasClass('once-closed')) {
								$this.addClass('is-active was-opened once-closed');

								if (isUnifyEffect) {
									$self.unifyOpenEffect(target, targetClass, bodyClass);
								} else {
									$self.defaultOpenEffect(target, $closedItems, targetClass, bodyClass, config.afterOpen);
								}
							}
						}
					} else {
						$this.removeClass('once-closed');

						if ($this.hasClass('was-opened')) {
							$this.removeClass('is-active was-opened');

							if (!$this.hasClass('once-opened')) {
								$this.addClass('once-opened');

								if (isUnifyEffect) {
									$self.unifyCloseEffect(target, targetClass, bodyClass);
								} else {
									$self.defaultCloseEffect(target, $closedItems, targetClass, bodyClass, config.afterClose);
								}
							}
						}
					}
				});

				//Actions
				collection = collection.add($this);
			});
		},

		// unifyOpenEffect: function(target, targetclass, bodyclass) {
		// 	$(target).addClass('toggled u-side-nav--mini-hover-on');
		// 	$(target + '.toggled').addClass(targetclass);
		// 	$('body').addClass(bodyclass);
		// },
    //
		// unifyCloseEffect: function(target, targetclass, bodyclass) {
		// 	$(target).children().hide();
		// 	$(target).removeClass(targetclass + ' toggled');
		// 	$('body').removeClass(bodyclass);
    //
		// 	setTimeout(function() {
		// 		$(target).children().fadeIn(100);
		// 		$(target).removeClass('u-side-nav--mini-hover-on');
		// 	}, 300);
		// },

		defaultOpenEffect: function(target, closeditems, targetclass, bodyclass, funcs) {
			$(target).addClass('toggled u-side-nav--mini-hover-on');

			if (closeditems.length > 0) {
				var items = closeditems.toString();

				$(items).slideUp(400, function() {
					$(target + '.toggled').addClass(targetclass);
					$('body').addClass(bodyclass);
					$(items).parent().removeClass('u-side-nav-opened');
					funcs();
				});
			} else {
				$(target + '.toggled').addClass(targetclass);
				$('body').addClass(bodyclass);
				funcs();
			}
		},

		defaultCloseEffect: function(target, closeditems, targetclass, bodyclass, funcs) {
			$(target).removeClass('toggled u-side-nav--mini-hover-on');
			$(target).removeClass(targetclass + ' toggled');
			$('body').removeClass(bodyclass);

			if (closeditems.length > 0) {
				setTimeout(function() {
					$(closeditems.toString()).parent().addClass('u-side-nav-opened');
					$(closeditems.toString()).slideDown(400);
					funcs();
				}, 300);
			}
		}
	}

})(jQuery);
