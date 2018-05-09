/**
 * Datatables wrapper.
 *
 * @author Htmlstream
 * @version 1.0
 *
 */
;
(function($) {
	'use strict';

	$.HSCore.components.HSDatatables = {
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
		 * Initialization of Datatables wrapper.
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

			this.initDatatables();

			return this.pageCollection;
		},

		initDatatables: function() {
			//Variables
			var $self = this,
				collection = $self.pageCollection;

			//Actions
			this.collection.each(function(i, el) {
				//Variables
				var $this = $(el),
					$info = $this.data('dt-info'),
					$search = $this.data('dt-search'),
					$entries = $this.data('dt-entries'),
					$pagination = $this.data('dt-pagination'),
					$detailsInvoker = $this.data('dt-details-invoker'),

					pageLength = $this.data('dt-page-length'),
					isResponsive = Boolean($this.data('dt-is-responsive')),
					isSelectable = Boolean($this.data('dt-is-selectable')),

					paginationClasses = $this.data('dt-pagination-classes'),
					paginationItemsClasses = $this.data('dt-pagination-items-classes'),
					paginationLinksClasses = $this.data('dt-pagination-links-classes'),
					paginationNextClasses = $this.data('dt-pagination-next-classes'),
					paginationNextLinkClasses = $this.data('dt-pagination-next-link-classes'),
					paginationNextLinkMarkup = $this.data('dt-pagination-next-link-markup'),
					paginationPrevClasses = $this.data('dt-pagination-prev-classes'),
					paginationPrevLinkClasses = $this.data('dt-pagination-prev-link-classes'),
					paginationPrevLinkMarkup = $this.data('dt-pagination-prev-link-markup'),

					table = $this.DataTable({
						pageLength: pageLength,
						responsive: isResponsive
					}),

					info = table.page.info(),
					paginationMarkup = '';

				$($info).html(
					'Showing ' + info.pages + ' of ' + info.recordsTotal + ' Entries'
				);

				$($search).on('keyup', function() {
					table.search(this.value).draw();
				});

				$($entries).on('change', function() {
					var val = $(this).val();

					table.page.len(val).draw();

					// Pagination
					$self.pagination($pagination, table, paginationClasses, paginationItemsClasses, paginationLinksClasses, paginationNextClasses, paginationNextLinkClasses, paginationNextLinkMarkup, paginationPrevClasses, paginationPrevLinkClasses, paginationPrevLinkMarkup, val);

					$($info).html(
						'Showing ' + val + ' of ' + info.recordsTotal + ' Entries'
					);
				});

				if(isSelectable == true) {
					$($this).on('change', 'input', function() {
						$(this).parents('tr').toggleClass('checked');
					})
				}

				// Pagination
				$self.pagination($pagination, table, paginationClasses, paginationItemsClasses, paginationLinksClasses, paginationNextClasses, paginationNextLinkClasses, paginationNextLinkMarkup, paginationPrevClasses, paginationPrevLinkClasses, paginationPrevLinkMarkup, info.pages);

				// Details
				$self.details($this, $detailsInvoker, table);

				//Actions
				collection = collection.add($this);
			});
		},

		pagination: function(target, table, pagiclasses, pagiitemclasses, pagilinksclasses, paginextclasses, paginextlinkclasses, paginextlinkmarkup, pagiprevclasses, pagiprevlinkclasses, pagiprevlinkmarkup, pages) {
			var info = table.page.info(),
				paginationMarkup = '';

			for (var i = 0; i < info.recordsTotal; i++) {
				if (i % pages == 0) {
					paginationMarkup += i / pages == 0 ? '<li class="' + pagiitemclasses + '"><a id="datatablePaginationPage' + (i / pages) + '" class="' + pagilinksclasses + ' active" href="#!" data-dt-page-to="' + (i / pages) + '">' + ((i / pages) + 1) + '</a></li>' : '<li class="' + pagiitemclasses + '"><a id="' + target + (i / pages) + '" class="' + pagilinksclasses + '" href="#!" data-dt-page-to="' + (i / pages) + '">' + ((i / pages) + 1) + '</a></li>';
				}
			}

			$('#' + target).html(
				'<ul class="' + pagiclasses + '">\
						<li class="' + pagiprevclasses + '">\
							<a id="' + target + 'Prev" class="' + pagiprevlinkclasses + '" href="#!" aria-label="Previous">' + pagiprevlinkmarkup + '</a>\
						</li>' +
				paginationMarkup +
				'<li class="' + paginextclasses + '">\
							<a id="' + target + 'Next" class="' + paginextlinkclasses + '" href="#!" aria-label="Next">' + paginextlinkmarkup + '</a>\
						</li>\
					</ul>'
			);

			$('#' + target + ' [data-dt-page-to]').on('click', function() {
				var $page = $(this).data('dt-page-to');

				$('#' + target + ' [data-dt-page-to]').removeClass('active');
				$(this).addClass('active');
				table.page($page).draw('page');
			});

			$('#' + target + 'Next').on('click', function() {
				var $currentPage = $('#' + target + ' [data-dt-page-to].active');

				table.page('next').draw('page');

				if ($currentPage.parent().next().find('[data-dt-page-to]').length) {
					$('#' + target + ' [data-dt-page-to]').removeClass('active');
					$currentPage.parent().next().find('[data-dt-page-to]').addClass('active');
				} else {
					return false;
				}
			});

			$('#' + target + 'Prev').on('click', function() {
				var $currentPage = $('#' + target + ' [data-dt-page-to].active');

				table.page('previous').draw('page');

				if ($currentPage.parent().prev().find('[data-dt-page-to]').length) {
					$('#' + target + ' [data-dt-page-to]').removeClass('active');
					$currentPage.parent().prev().find('[data-dt-page-to]').addClass('active');
				} else {
					return false;
				}
			});
		},

		format: function(value) {
			return value;
		},

		details: function(el, invoker, table) {
			if (!invoker) return;

			//Variables
			var $self = this;

			$(el).on('click', invoker, function() {
				var tr = $(this).closest('tr'),
					row = table.row(tr);

				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('opened');
				} else {
					row.child($self.format(tr.data('details'))).show();
					tr.addClass('opened');
				}
			});
		}
	};
})(jQuery);
