// equal height
(function() {
	"use strict";

	function equalHeight(el, bp) {
		var doc, wnd,
				col, setHeight, resizeTimer;
		doc = document;
		wnd = window;
		col = doc.getElementsByClassName(el);

		if (col.length) {
			setHeight = function() {
				var i, maxHeight, breakpoint,	cols, wWidth;
				maxHeight = 0;
				breakpoint = bp || 0;
				cols = col.length;
				wWidth = wnd.innerWidth;
				// console.log(col);

				if (wWidth >= breakpoint) {
					// get max height
					for (i = 0; i < cols; i++) {
						var colHeight;
						// remove old value before compare
						col[i].style.height = "";
						colHeight = col[i].offsetHeight;
						// console.log(colHeight);
						if (maxHeight < colHeight) {
							maxHeight = colHeight;
						}
					}

					// set max height to every col
					for (i = 0; i < cols; i++) {
						col[i].style.height = maxHeight + "px";
					}
				// console.log(maxHeight);
				} else {
					// remove style.height attr if breakpoint doesn't match
					for (var i = 0; i < cols; i++) {
						col[i].style.height = "";
					}
				}
			}

			// check if orientationchange exists
			if ("onorientationchange" in wnd) {
				wnd.addEventListener("orientationchange", setHeight);
			} else {
				wnd.addEventListener("resize", function() {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(setHeight, 200);
				});
			}

			wnd.addEventListener("load", setHeight);
		}
	}

	equalHeight("js-equal-height", 500);
}());