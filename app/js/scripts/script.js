(function() {
	"use strict";

	var doc = document,
			bd = doc.body,
			classes, clsList;

	classes = {
		menuActive: "mob-menu-active",
		categoriesActive: "mob-categories-active"
	};

	clsList = function(obj) {
		var keys = [],
				str;
		for (var key in obj) {
			keys.push(obj[key]);
		}
		str = keys.join(" ");
		return str;
	}

	// CLICKS
	// =======
	$(".js-menu-btn").on("click", function() {
		$(bd).toggleClass(classes.menuActive);
	});

	$(".js-categories-btn").on("click", function() {
		$(bd).toggleClass(classes.categoriesActive)
	});

	$(".overlay").on("click", function() {
		$(bd).removeClass(clsList(classes));
	});
}());