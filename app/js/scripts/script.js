;(function() {
	"use strict";

	var doc = document,
			wnd = window,
			bd = doc.body;

	var main = {
		init: function() {
			this.resizeTimer = null;
			this.fancyboxOpened = false;

			this.lazySizesParams();
			this.fancy();
			this.listeners();
		},

		listeners: function() {
			$(".js-menu-btn").on("click", function() {
				$(bd).toggleClass(main.menusActiveCls.menuActive);
			});
			$(".js-categories-btn").on("click", function() {
				$(bd).toggleClass(main.menusActiveCls.categoriesActive);
			});
			$(".overlay").on("click", function() {
				$(bd).removeClass(main.objToStr(main.menusActiveCls));
			});

			wnd.addEventListener("resize", function() {
				if (main.resizeTimer !== null) clearTimeout(main.resizeTimer);

				main.resizeTimer = setTimeout(function() {
					main.removeActiveCls();
				}, 200);
			});

			// fancybox. orientation change fix
			wnd.addEventListener("orientationchange", function() {
				setTimeout(function() {
					main.updateFancybox();
				}, 450);
			});
		},

		menusActiveCls: {
			menuActive: "mob-menu-active",
			categoriesActive: "mob-categories-active"
		},

		objToStr: function(obj) {
			var str = "",
					key;
			for (key in obj) {
				str += obj[key] + " ";
			}
			return str;
		},

		removeActiveCls: function() {
			var wndW = wnd.innerWidth;

			if (wndW >= 767) {
				$(bd).removeClass(this.menusActiveCls.categoriesActive);
			}
		},

		lazySizesParams: function() {
			wnd.lazySizesConfig = wnd.lazySizesConfig || {};
			lazySizesConfig.expand = 250;
		},

		fancy: function() {
			if ($.fancybox) {
				$(".js-fancybox").fancybox({
					autoCenter: true,
					padding: [0, 0, 0, 0],
					openEffect: 'none',
					closeEffect: 'none'
				});

				$(".js-fancybox-modal").fancybox({
					wrapCSS: 'fancybox-modal',
					padding: [0, 0, 0, 0],
					scrolling: 'visible',
					openEffect: 'none',
					closeEffect: 'none',
					// updates the possible incorrect position of the window
					// on devices after orientation changes
					beforeShow: function() {
						main.fancyboxOpened = true;
					},
					beforeClose: function() {
						main.fancyboxOpened = false;
					}
				});
			}
		},

		updateFancybox: function() {
			if (this.fancyboxOpened) {
				$.fancybox.update();
			}
		}
	};

	var ripples = {
		init: function() {
			this.ripplesQueue = [];
			this.clickFlag = false;
			this.tapFlag = false;
			this.rippleBox = null;
			// same as $ripple-duration in scss file
			this.remRippleTimeout = 400;

			this.checkClassList();
			this.listeners();
		},

		listeners: function() {
			doc.addEventListener("touchstart", this.delegateCls("ripple", this.newRipple));
			doc.addEventListener("mousedown", this.delegateCls("ripple", this.newRipple));
			// binding ripples obj to remove func
			doc.addEventListener("touchend", this.removeRipple.bind(this));
			doc.addEventListener("touchcancel", this.removeRipple.bind(this));
			doc.addEventListener("touchmove", this.removeRipple.bind(this));
			doc.addEventListener("mouseup", this.removeRipple.bind(this));
			doc.addEventListener("mouseout", this.delegateMouseleaveCls(this.removeRipple));
		},

		delegateCls: function(cls, func) {
			if (cls[0] === ".") cls = cls.slice(1);

			return function(e) {
				// http://stackoverflow.com/questions/7018919/how-to-bind-touchstart-and-click-events-but-not-respond-to-both
				// prevents double execution with mouse && touch
				// don't proceed if there was a click
				if (ripples.tapFlag) return;
				var target = e.target;

				while (!ripples.hasClass(target, cls)) {
					target = target.parentNode;
					// prevents classList from throwing an error
					if (target === doc) return;
				}

				func.apply(target, arguments);
			}
		},

		// https://learn.javascript.ru/mousemove-mouseover-mouseout-mouseenter-mouseleave#делегирование
		delegateMouseleaveCls: function(func) {
			return function(e) {
				// don't proceed if there wasn't a click
				if (!ripples.clickFlag) return;
				var relatedTarget = e.relatedTarget;

				while (relatedTarget) {
					if (relatedTarget === ripples.rippleBox) return;
					relatedTarget = relatedTarget.parentNode;
				}

				func.apply(ripples, arguments);
			}
		},

		// http://youmightnotneedjquery.com/#has_class
		hasClass: function(el, cls) {
			return el.classList.contains(cls);
		},

		checkClassList: function() {
			if (!doc.documentElement.classList) {
				this.hasClass = function(el, cls) {
					return new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.className);
				}
			}
		},

		// thx to https://codepen.io/pixelass/post/material-design-ripple for main idea
		newRipple: function(e) {
			// this === rippleBox
			var posBox = this.getBoundingClientRect(),
					ePageX = e.pageX || e.touches[0].pageX,
					ePageY = e.pageY || e.touches[0].pageY,
					posX = ePageX - (posBox.left + wnd.pageXOffset),
					posY = ePageY - (posBox.top + wnd.pageYOffset),
					w = this.offsetWidth,
					h = this.offsetHeight,
					// distance from the center of the element
					offsetX = Math.abs(w / 2 - posX),
					offsetY = Math.abs(h / 2 - posY),
					// ditance to the farthest side
					deltaX = w / 2 + offsetX,
					deltaY = h / 2 + offsetY;

			// ditance to the farthest corner
			var size = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) * 2;

			ripples.appendRipple({
				top: posY,
				left: posX,
				size: size
			}, this);

			ripples.tapFlag = true;
			ripples.clickFlag = true;
			ripples.rippleBox = this;
		},
		
		appendRipple: function(data, rippleBox) {
			var ripple = doc.createElement("div"),
					cssStr = "width:" + data.size + "px;" +
									 "height:" + data.size + "px;" +
									 "top:" + data.top + "px;" +
									 "left:" + data.left + "px;" +
									 "margin-top:" + -data.size / 2 + "px;" +
									 "margin-left:" + -data.size / 2 + "px;",
					rippleBg = rippleBox.getAttribute("data-ripple-color");

			ripple.style.cssText = cssStr;
			ripple.style.background = rippleBg;

			ripple.className += " ripple-effect";
			rippleBox.appendChild(ripple);
			ripples.ripplesQueue.push(ripple);
		},

		removeRipple: function() {
			// don't proceed if there wasn't a click
			if (!ripples.clickFlag) return;
			// this === ripples obj
			var remRipple = this.ripplesQueue.pop();

			remRipple.className += " ripple-effect-out";
			// a little bit hacky, but easier and there's less listeners
			// same as $ripple-duration in scss file
			setTimeout(this.rippleBox.removeChild.bind(this.rippleBox, remRipple), this.remRippleTimeout);

			ripples.clickFlag = false;
			// http://stackoverflow.com/questions/7018919/how-to-bind-touchstart-and-click-events-but-not-respond-to-both
			setTimeout(function() {ripples.tapFlag = false;}, 100);
		}
	};

	main.init();
	ripples.init();
}());