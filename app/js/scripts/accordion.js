;(function() {
	"use strict";

	var doc = document,
			accdn;

	accdn = {
		params: {
			accordionTrigger: ".js-accordion-trigger",
			activeCls: "is-active"
		},

		init: function() {
			this.listeners();
		},

		listeners: function() {
			$(accdn.params.accordionTrigger).on("click", function(e) {
				accdn.checkSection($(this));
				e.preventDefault();
			});
		},

		checkSection: function(el) {
			var parent = el.parent();

			if (parent.is("." + accdn.params.activeCls)) {
				accdn.closeAllSections(parent);
			} else {
				accdn.closeAllSections(parent);
				parent.addClass(accdn.params.activeCls);
			}
		},

		closeAllSections: function(el) {
			el.removeClass(accdn.params.activeCls);
			el.siblings().removeClass(accdn.params.activeCls);
		}
	};

	accdn.init();
}());