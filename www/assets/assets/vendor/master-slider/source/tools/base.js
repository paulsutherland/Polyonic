window.averta = {};

;(function($){

	//"use strict";

	window.package = function(name){
		if(!window[name]) window[name] = {};
	};

	var extend = function(target , object){
		for(var key in object)	target[key] = object[key];
	};

	Function.prototype.extend = function(superclass){
		if(typeof superclass.prototype.constructor === "function"){
			extend(this.prototype , superclass.prototype);
			this.prototype.constructor = this;
		}else{
			this.prototype.extend(superclass);
			this.prototype.constructor = this;
		}
	};

	// Converts JS prefix to CSS prefix
	var trans = {
		'Moz'    : '-moz-',
		'Webkit' : '-webkit-',
		'Khtml'  : '-khtml-' ,
		'O'		 : '-o-',
		'ms'	 : '-ms-',
		'Icab'   : '-icab-'
	};

	window._mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	window._touch  = 'ontouchstart' in document;
	$(document).ready(function(){
		window._jcsspfx 		= getVendorPrefix();	   // JS CSS VendorPrefix
		window._csspfx 			= trans[window._jcsspfx];  // CSS VendorPrefix
		window._cssanim 		= supportsTransitions();
		window._css3d   		= supports3DTransforms();
		window._css2d   		= supportsTransforms();
	});


	// Thanks to LEA VEROU
	// http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
	function getVendorPrefix() {

		if('result' in arguments.callee) return arguments.callee.result;

		var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

		var someScript = document.getElementsByTagName('script')[0];

		for(var prop in someScript.style){
			if(regex.test(prop)){
				return arguments.callee.result = prop.match(regex)[0];
			}
		}

		if('WebkitOpacity' in someScript.style) return arguments.callee.result = 'Webkit';
		if('KhtmlOpacity' in someScript.style) return arguments.callee.result = 'Khtml';

		return arguments.callee.result = '';
	}


	// Thanks to Steven Benner.
	// http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
	window.parseQueryString = function(url){
		var queryString = {};
		url.replace(
		    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		    function($0, $1, $2, $3) { queryString[$1] = $3; }
		);

		return queryString;
	};

	function checkStyleValue(prop){
		 var b = document.body || document.documentElement;
	    var s = b.style;
	    var p = prop;
	    if(typeof s[p] == 'string') {return true; }

	    // Tests for vendor specific prop
	    v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
	    p = p.charAt(0).toUpperCase() + p.substr(1);
	    for(var i=0; i<v.length; i++) {
	      if(typeof s[v[i] + p] == 'string') { return true; }
	    }
	    return false;
	}

	function supportsTransitions() {
	   return checkStyleValue('transition');
	}

	function supportsTransforms(){
	   return checkStyleValue('transform');
	}

	function supports3DTransforms(){
		if(!supportsTransforms()) return false;
	    var el = document.createElement('i'),
	    has3d,
	    transforms = {
	        'WebkitTransform':'-webkit-transform',
	        'OTransform':'-o-transform',
	        'MSTransform':'-ms-transform',
	        'msTransform':'-ms-transform',
	        'MozTransform':'-moz-transform',
	        'Transform':'transform',
	        'transform':'transform'
	    };

		el.style.display = 'block';

	    // Add it to the body to get the computed style
	    document.body.insertBefore(el, null);

	    for(var t in transforms){
	        if( el.style[t] !== undefined ){
	            el.style[t] = 'translate3d(1px,1px,1px)';
	            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
	        }
	    }

	    document.body.removeChild(el);

	    return (has3d != null && has3d.length > 0 && has3d !== "none");
	}

	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 * @author paulirish / http://paulirish.com/
	 */
	var fps60 = 50/3;

	if ( !window.requestAnimationFrame ) {

		window.requestAnimationFrame = ( function() {

			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

				window.setTimeout( callback, fps60 );

			};

		} )();

	}

	if (!window.getComputedStyle) {
	    window.getComputedStyle = function(el, pseudo) {
	        this.el = el;
	        this.getPropertyValue = function(prop) {
	            var re = /(\-([a-z]){1})/g;
	            if (prop == 'float') prop = 'styleFloat';
	            if (re.test(prop)) {
	                prop = prop.replace(re, function () {
	                    return arguments[2].toUpperCase();
	                });
	            }
	            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	        };
	        return el.currentStyle;
	    };
	}

	// IE8 Array indexOf fix
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function(elt /*, from*/) {
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}


	/**
	 * check ie browser
	 * @param  {Number | string}  version
	 * @return {Boolean}
	 */
	window.isMSIE = function ( version ) {
		if ( !$.browser.msie ) {
			return false;
		} else if ( !version ) {
			return true;
		}
		var ieVer = $.browser.version.slice(0 , $.browser.version.indexOf('.'));
		if ( typeof version === 'string' ) {
			if ( version.indexOf('<') !== -1  || version.indexOf('>') !== -1) {
				return eval( ieVer + version );
			} else {
				return eval( version + '==' + ieVer );
			}
		} else {
			return version == ieVer;
		}
	}

	$.removeDataAttrs = function($target, exclude) {
	    var i,
	        attrName,
	        dataAttrsToDelete = [],
	        dataAttrs = $target[0].attributes,
	        dataAttrsLen = dataAttrs.length;

	    exclude = exclude || [];

	    // loop through attributes and make a list of those
	    // that begin with 'data-'
	    for (i=0; i<dataAttrsLen; i++) {
	    	attrName = dataAttrs[i].name;
	        if ( 'data-' === attrName.substring(0,5) && exclude.indexOf(attrName) === -1 ) {
	            // Why don't you just delete the attributes here?
	            // Deleting an attribute changes the indices of the
	            // others wreaking havoc on the loop we are inside
	            // b/c dataAttrs is a NamedNodeMap (not an array or obj)
	            dataAttrsToDelete.push(dataAttrs[i].name);
	        }
	    }
	    // delete each of the attributes we found above
	    // i.e. those that start with "data-"
	    $.each( dataAttrsToDelete, function( index, attrName ) {
	        $target.removeAttr( attrName );
	    })
	};

	if(jQuery){
		$.jqLoadFix = function(){
			if(this.complete){
				var that = this;
				setTimeout(function(){$(that).trigger('load');} , 1);
			}
		};

		jQuery.uaMatch = jQuery.uaMatch || function( ua ) {
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
				[];

			return {
				browser: match[ 1 ] || "",
				version: match[ 2 ] || "0"
			};
		};

		// Don't clobber any existing jQuery.browser in case it's different
		//if ( !jQuery.browser ) {
			matched = jQuery.uaMatch( navigator.userAgent );
			browser = {};

			if ( matched.browser ) {
				browser[ matched.browser ] = true;
				browser.version = matched.version;
			}

			// Chrome is Webkit, but Webkit is also Safari.
			if ( browser.chrome ) {
				browser.webkit = true;
			} else if ( browser.webkit ) {
				browser.safari = true;
			}

			// hofix for IE11 detection
			var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
			if (isIE11) {
				browser.msie = "true";
				delete browser.mozilla;
			}

			jQuery.browser = browser;

		//}

		$.fn.preloadImg = function(src , _event){
			this.each(function(){
				var $this = $(this);
				var self  = this;
				var img = new Image();
				img.onload = function(event){
					if(event == null) event = {}; // IE8
					$this.attr('src' , src);
					event.width = img.width;
					event.height = img.height;
					$this.data('width', img.width);
					$this.data('height', img.height);
					setTimeout(function(){_event.call(self , event);},50);
					img = null;
				};
				img.src = src;
			});
			return this;
		};
	}
})(jQuery);
