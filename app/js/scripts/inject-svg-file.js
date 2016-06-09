// ajax for the svg sprite and inject it onto the page
;(function() {
	var params = {
		sprite: "images/svg_defs.svg",
		cls: "svg-defs"
	}

	var ajax = new XMLHttpRequest();
	ajax.open("GET", params.sprite, true);
	ajax.responseType = "document";
	ajax.onload = function(e) {
		try {
			svg = ajax.responseXML.documentElement;
			svg.setAttribute("class", params.cls);
			document.body.insertBefore(svg, document.body.childNodes[0]);
		} catch(e) { // IE9
			var div = document.createElement("div");
			div.innerHTML = ajax.responseText;
			div.setAttribute("class", params.cls);
			document.body.insertBefore(div, document.body.childNodes[0]);
		}
	}
	ajax.send();
}());