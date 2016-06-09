;(function() {
	"use strict";
	var doc, trigger, params, closeAllSections, acdn;
	doc = document;

	// params = {
	// 	accordionTrigger: ".js-accordion-trigger",
	// 	activeCls: "active"
	// }
	// trigger = doc.querySelector(params.accordionTrigger);

	// if (trigger) {
	// 	closeAllSections = function(el) {
	// 		el.removeClass(params.activeCls);
	// 		el.siblings().removeClass(params.activeCls);
	// 	}

	// 	$(trigger).on("click", function(e) {
	// 		var parent = $(this).parent();

	// 		if (parent.is("." + params.activeCls)) {
	// 			closeAllSections(parent);
	// 		} else {
	// 			closeAllSections(parent);
	// 			parent.addClass(params.activeCls);
	// 		}
	// 		e.preventDefault();
	// 	});
	// }

	var accdn = {
		params: {
			accordionTrigger: ".js-accordion-trigger",
			activeCls: "active"
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