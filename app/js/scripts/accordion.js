(function() {
	"use strict";
	var doc, trigger, params, closeSection;
	doc = document;

	params = {
		accordionTrigger: ".js-accordion-trigger",
		activeCls: "active",
	}
	trigger = doc.querySelector(params.accordionTrigger);

	if (trigger) {
		closeSection = function(el) {
			$(el).removeClass(params.activeCls);
			$(el).siblings().removeClass(params.activeCls);
		}

		$(params.accordionTrigger).on("click", function(e) {
			var parent = $(this).parent();

			if ($(parent).is("." + params.activeCls)) {
				closeSection(parent);
			} else {
				closeSection(parent);
				$(parent).addClass(params.activeCls);
			}
			e.preventDefault();
		});
	}
}());