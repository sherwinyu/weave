/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*!
 * jQuery UI Core 1.10.0
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.10.0",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
/*!
 * jQuery UI Widget 1.10.0
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
/*!
 * jQuery UI Position 1.10.0
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowX ? $.position.scrollbarWidth() : 0,
			height: hasOverflowY ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );




/*!
 * jQuery UI Menu 1.10.0
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */

(function( $, undefined ) {

$.widget( "ui.menu", {
	version: "1.10.0",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;
		// flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			})
			// need to catch all clicks on disabled menu
			// not possible through _on
			.bind( "click" + this.eventNamespace, $.proxy(function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this ));

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-state-disabled > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item:has(a)": function( event ) {
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.mouseHandled = true;

					this.select( event );
					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) ) {
						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.children( "a" )
				.removeUniqueId()
				.removeClass( "ui-corner-all ui-state-hover" )
				.removeAttr( "tabIndex" )
				.removeAttr( "role" )
				.removeAttr( "aria-haspopup" )
				.children().each( function() {
					var elem = $( this );
					if ( elem.data( "ui-menu-submenu-carat" ) ) {
						elem.remove();
					}
				});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		/*jshint maxcomplexity:20*/
		var match, prev, character, skip, regex,
			preventDefault = true;

		function escape( value ) {
			return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			regex = new RegExp( "^" + escape( character ), "i" );
			match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
				return regex.test( $( this ).children( "a" ).text() );
			});
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				regex = new RegExp( "^" + escape( character ), "i" );
				match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
					return regex.test( $( this ).children( "a" ).text() );
				});
			}

			if ( match.length ) {
				this.focus( event, match );
				if ( match.length > 1 ) {
					this.previousFilter = character;
					this.filterTimer = this._delay(function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.prev( "a" ),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );

		// Don't refresh list items that are already adapted
		menus.children( ":not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.uniqueId()
				.addClass( "ui-corner-all" )
				.attr({
					tabIndex: -1,
					role: this._itemRole()
				});

		// Initialize unlinked menu-items containing spaces and/or dashes only as dividers
		menus.children( ":not(.ui-menu-item)" ).each(function() {
			var item = $( this );
			// hyphen, em dash, en dash
			if ( !/[^\-—–\s]/.test( item.text() ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Add aria-disabled attribute to any disabled menu item
		menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.children( "a" ).addClass( "ui-state-focus" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.children( "a:first" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.children( "a" ).removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
				.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.children( ".ui-menu-item" )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));





/*!
 * jQuery UI Autocomplete 1.10.0
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.menu.js
 */


(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
	version: "1.10.0",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput;

		this.isMultiLine = this._isMultiLine();
		this.valueMethod = this.element[ this.element.is( "input,textarea" ) ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				/*jshint maxcomplexity:15*/
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.term );
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					event.preventDefault();
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete" )
			.appendTo( this._appendTo() )
			.menu({
				// custom key handling for now
				input: $(),
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.zIndex( this.element.zIndex() + 1 )
			.hide()
			.data( "ui-menu" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				// #7024 - Prevent accidental activation of menu items in Firefox
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				var item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				} else {
					// Normally the input is populated with the item's value as the
					// menu is navigated, causing screen readers to notice a change and
					// announce the item. Since the focus event was canceled, this doesn't
					// happen, so we update the live region so that screen readers can
					// still notice the change and announce it.
					this.liveRegion.text( item.value );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertAfter( this.element );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[0].body;
		}

		return element;
	},

	_isMultiLine: function() {
		// Textareas are always multi-line
		if ( this.element.is( "textarea" ) ) {
			return true;
		}
		// Inputs are always single-line, even if inside a contentEditable element
		// IE also treats inputs as contentEditable
		if ( this.element.is( "input" ) ) {
			return false;
		}
		// All other element types are determined by whether or not they're contentEditable
		return this.element.prop( "isContentEditable" );
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {
			// only search if the value has changed
			if ( this.term !== this._value() ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var that = this,
			index = ++requestIndex;

		return function( content ) {
			if ( index === requestIndex ) {
				that.__response( content );
			}

			that.pending--;
			if ( !that.pending ) {
				that.element.removeClass( "ui-autocomplete-loading" );
			}
		};
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
          console.log('sup bitches');
		// this.cancelSearch = true;
		// this._close( event );
	},
        zug: function ( event ) {
          console.log('closnig down bitches');
		this.cancelSearch = true;
		this._close( event );
        },

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element
			.empty()
			.zIndex( this.element.zIndex() + 1 );
		this._renderMenu( ul, items );
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {
			this._value( this.term );
			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.text( message );
	}
});

}( jQuery ));
/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/browser-prefix.js
var Handlebars = {};

(function(Handlebars, undefined) {
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0-rc.3";
Handlebars.COMPILER_REVISION = 2;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '>= 1.0.0-rc.3'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  return Handlebars.helpers['if'].call(this, context, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"simpleInverse":6,"statements":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"partialName":25,"params":26,"hash":27,"DATA":28,"param":29,"STRING":30,"INTEGER":31,"BOOLEAN":32,"hashSegments":33,"hashSegment":34,"ID":35,"EQUALS":36,"PARTIAL_NAME":37,"pathSegments":38,"SEP":39,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"DATA",30:"STRING",31:"INTEGER",32:"BOOLEAN",35:"ID",36:"EQUALS",37:"PARTIAL_NAME",39:"SEP"},
productions_: [0,[3,2],[4,2],[4,3],[4,2],[4,1],[4,1],[4,0],[7,1],[7,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[6,2],[17,3],[17,2],[17,2],[17,1],[17,1],[26,2],[26,1],[29,1],[29,1],[29,1],[29,1],[29,1],[27,1],[33,2],[33,1],[34,3],[34,3],[34,3],[34,3],[34,3],[25,1],[21,1],[38,3],[38,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode([], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode($$[$0-1], []); 
break;
case 5: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 6: this.$ = new yy.ProgramNode([], []); 
break;
case 7: this.$ = new yy.ProgramNode([]); 
break;
case 8: this.$ = [$$[$0]]; 
break;
case 9: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 10: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 11: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 12: this.$ = $$[$0]; 
break;
case 13: this.$ = $$[$0]; 
break;
case 14: this.$ = new yy.ContentNode($$[$0]); 
break;
case 15: this.$ = new yy.CommentNode($$[$0]); 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 18: this.$ = $$[$0-1]; 
break;
case 19: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 20: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 21: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 22: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 23: 
break;
case 24: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 25: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 26: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 27: this.$ = [[$$[$0]], null]; 
break;
case 28: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 29: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 30: this.$ = [$$[$0]]; 
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = new yy.StringNode($$[$0]); 
break;
case 33: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 34: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 35: this.$ = new yy.DataNode($$[$0]); 
break;
case 36: this.$ = new yy.HashNode($$[$0]); 
break;
case 37: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 38: this.$ = [$$[$0]]; 
break;
case 39: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 40: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 41: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 42: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 43: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 44: this.$ = new yy.PartialNameNode($$[$0]); 
break;
case 45: this.$ = new yy.IdNode($$[$0]); 
break;
case 46: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 47: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:2,5:[2,7],6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],22:[1,14],23:[1,15],24:[1,16]},{1:[3]},{5:[1,17]},{5:[2,6],7:18,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,6],22:[1,14],23:[1,15],24:[1,16]},{5:[2,5],6:20,8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,5],22:[1,14],23:[1,15],24:[1,16]},{17:23,18:[1,22],21:24,28:[1,25],35:[1,27],38:26},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{4:28,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{4:29,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{17:30,21:24,28:[1,25],35:[1,27],38:26},{17:31,21:24,28:[1,25],35:[1,27],38:26},{17:32,21:24,28:[1,25],35:[1,27],38:26},{25:33,37:[1,34]},{1:[2,1]},{5:[2,2],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,2],22:[1,14],23:[1,15],24:[1,16]},{17:23,21:24,28:[1,25],35:[1,27],38:26},{5:[2,4],7:35,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,4],22:[1,14],23:[1,15],24:[1,16]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],24:[2,23]},{18:[1,36]},{18:[2,27],21:41,26:37,27:38,28:[1,45],29:39,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,28]},{18:[2,45],28:[2,45],30:[2,45],31:[2,45],32:[2,45],35:[2,45],39:[1,48]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],39:[2,47]},{10:49,20:[1,50]},{10:51,20:[1,50]},{18:[1,52]},{18:[1,53]},{18:[1,54]},{18:[1,55],21:56,35:[1,27],38:26},{18:[2,44],35:[2,44]},{5:[2,3],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,3],22:[1,14],23:[1,15],24:[1,16]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{18:[2,25],21:41,27:57,28:[1,45],29:58,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,26]},{18:[2,30],28:[2,30],30:[2,30],31:[2,30],32:[2,30],35:[2,30]},{18:[2,36],34:59,35:[1,60]},{18:[2,31],28:[2,31],30:[2,31],31:[2,31],32:[2,31],35:[2,31]},{18:[2,32],28:[2,32],30:[2,32],31:[2,32],32:[2,32],35:[2,32]},{18:[2,33],28:[2,33],30:[2,33],31:[2,33],32:[2,33],35:[2,33]},{18:[2,34],28:[2,34],30:[2,34],31:[2,34],32:[2,34],35:[2,34]},{18:[2,35],28:[2,35],30:[2,35],31:[2,35],32:[2,35],35:[2,35]},{18:[2,38],35:[2,38]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],36:[1,61],39:[2,47]},{35:[1,62]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{21:63,35:[1,27],38:26},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],24:[2,21]},{18:[1,64]},{18:[2,24]},{18:[2,29],28:[2,29],30:[2,29],31:[2,29],32:[2,29],35:[2,29]},{18:[2,37],35:[2,37]},{36:[1,61]},{21:65,28:[1,69],30:[1,66],31:[1,67],32:[1,68],35:[1,27],38:26},{18:[2,46],28:[2,46],30:[2,46],31:[2,46],32:[2,46],35:[2,46],39:[2,46]},{18:[1,70]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],24:[2,22]},{18:[2,39],35:[2,39]},{18:[2,40],35:[2,40]},{18:[2,41],35:[2,41]},{18:[2,42],35:[2,42]},{18:[2,43],35:[2,43]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]}],
defaultActions: {17:[2,1],25:[2,28],38:[2,26],57:[2,24]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-4); this.popState(); return 15; 
break;
case 4: this.begin("par"); return 24; 
break;
case 5: return 16; 
break;
case 6: return 20; 
break;
case 7: return 19; 
break;
case 8: return 19; 
break;
case 9: return 23; 
break;
case 10: return 23; 
break;
case 11: this.popState(); this.begin('com'); 
break;
case 12: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 13: return 22; 
break;
case 14: return 36; 
break;
case 15: return 35; 
break;
case 16: return 35; 
break;
case 17: return 39; 
break;
case 18: /*ignore whitespace*/ 
break;
case 19: this.popState(); return 18; 
break;
case 20: this.popState(); return 18; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 30; 
break;
case 22: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\'/g,"'"); return 30; 
break;
case 23: yy_.yytext = yy_.yytext.substr(1); return 28; 
break;
case 24: return 32; 
break;
case 25: return 32; 
break;
case 26: return 31; 
break;
case 27: return 35; 
break;
case 28: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 35; 
break;
case 29: return 'INVALID'; 
break;
case 30: /*ignore whitespace*/ 
break;
case 31: this.popState(); return 37; 
break;
case 32: return 5; 
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:-?[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:\s+)/,/^(?:[a-zA-Z0-9_$-/]+)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"par":{"rules":[30,31],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;
// lib/handlebars/compiler/base.js

Handlebars.Parser = handlebars;

Handlebars.parse = function(input) {

  // Just return if an already-compile AST was passed in.
  if(input.constructor === Handlebars.AST.ProgramNode) { return input; }

  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(input);
};
;
// lib/handlebars/compiler/ast.js
Handlebars.AST = {};

Handlebars.AST.ProgramNode = function(statements, inverse) {
  this.type = "program";
  this.statements = statements;
  if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
};

Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
  this.type = "mustache";
  this.escaped = !unescaped;
  this.hash = hash;

  var id = this.id = rawParams[0];
  var params = this.params = rawParams.slice(1);

  // a mustache is an eligible helper if:
  // * its id is simple (a single part, not `this` or `..`)
  var eligibleHelper = this.eligibleHelper = id.isSimple;

  // a mustache is definitely a helper if:
  // * it is an eligible helper, and
  // * it has at least one parameter or hash segment
  this.isHelper = eligibleHelper && (params.length || hash);

  // if a mustache is an eligible helper but not a definite
  // helper, it is ambiguous, and will be resolved in a later
  // pass or at runtime.
};

Handlebars.AST.PartialNode = function(partialName, context) {
  this.type         = "partial";
  this.partialName  = partialName;
  this.context      = context;
};

Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  verifyMatch(mustache.id, close);
  this.type = "block";
  this.mustache = mustache;
  this.program  = program;
  this.inverse  = inverse;

  if (this.inverse && !this.program) {
    this.isInverse = true;
  }
};

Handlebars.AST.ContentNode = function(string) {
  this.type = "content";
  this.string = string;
};

Handlebars.AST.HashNode = function(pairs) {
  this.type = "hash";
  this.pairs = pairs;
};

Handlebars.AST.IdNode = function(parts) {
  this.type = "ID";
  this.original = parts.join(".");

  var dig = [], depth = 0;

  for(var i=0,l=parts.length; i<l; i++) {
    var part = parts[i];

    if (part === ".." || part === "." || part === "this") {
      if (dig.length > 0) { throw new Handlebars.Exception("Invalid path: " + this.original); }
      else if (part === "..") { depth++; }
      else { this.isScoped = true; }
    }
    else { dig.push(part); }
  }

  this.parts    = dig;
  this.string   = dig.join('.');
  this.depth    = depth;

  // an ID is simple if it only has one part, and that part is not
  // `..` or `this`.
  this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

  this.stringModeValue = this.string;
};

Handlebars.AST.PartialNameNode = function(name) {
  this.type = "PARTIAL_NAME";
  this.name = name;
};

Handlebars.AST.DataNode = function(id) {
  this.type = "DATA";
  this.id = id;
};

Handlebars.AST.StringNode = function(string) {
  this.type = "STRING";
  this.string = string;
  this.stringModeValue = string;
};

Handlebars.AST.IntegerNode = function(integer) {
  this.type = "INTEGER";
  this.integer = integer;
  this.stringModeValue = Number(integer);
};

Handlebars.AST.BooleanNode = function(bool) {
  this.type = "BOOLEAN";
  this.bool = bool;
  this.stringModeValue = bool === "true";
};

Handlebars.AST.CommentNode = function(comment) {
  this.type = "comment";
  this.comment = comment;
};
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
var Compiler = Handlebars.Compiler = function() {};
var JavaScriptCompiler = Handlebars.JavaScriptCompiler = function() {};

// the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.

Compiler.prototype = {
  compiler: Compiler,

  disassemble: function() {
    var opcodes = this.opcodes, opcode, out = [], params, param;

    for (var i=0, l=opcodes.length; i<l; i++) {
      opcode = opcodes[i];

      if (opcode.opcode === 'DECLARE') {
        out.push("DECLARE " + opcode.name + "=" + opcode.value);
      } else {
        params = [];
        for (var j=0; j<opcode.args.length; j++) {
          param = opcode.args[j];
          if (typeof param === "string") {
            param = "\"" + param.replace("\n", "\\n") + "\"";
          }
          params.push(param);
        }
        out.push(opcode.opcode + " " + params.join(" "));
      }
    }

    return out.join("\n");
  },
  equals: function(other) {
    var len = this.opcodes.length;
    if (other.opcodes.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var opcode = this.opcodes[i],
          otherOpcode = other.opcodes[i];
      if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
        return false;
      }
      for (var j = 0; j < opcode.args.length; j++) {
        if (opcode.args[j] !== otherOpcode.args[j]) {
          return false;
        }
      }
    }

    len = this.children.length;
    if (other.children.length !== len) {
      return false;
    }
    for (i = 0; i < len; i++) {
      if (!this.children[i].equals(other.children[i])) {
        return false;
      }
    }

    return true;
  },

  guid: 0,

  compile: function(program, options) {
    this.children = [];
    this.depths = {list: []};
    this.options = options;

    // These changes will propagate to the other compiler components
    var knownHelpers = this.options.knownHelpers;
    this.options.knownHelpers = {
      'helperMissing': true,
      'blockHelperMissing': true,
      'each': true,
      'if': true,
      'unless': true,
      'with': true,
      'log': true
    };
    if (knownHelpers) {
      for (var name in knownHelpers) {
        this.options.knownHelpers[name] = knownHelpers[name];
      }
    }

    return this.program(program);
  },

  accept: function(node) {
    return this[node.type](node);
  },

  program: function(program) {
    var statements = program.statements, statement;
    this.opcodes = [];

    for(var i=0, l=statements.length; i<l; i++) {
      statement = statements[i];
      this[statement.type](statement);
    }
    this.isSimple = l === 1;

    this.depths.list = this.depths.list.sort(function(a, b) {
      return a - b;
    });

    return this;
  },

  compileProgram: function(program) {
    var result = new this.compiler().compile(program, this.options);
    var guid = this.guid++, depth;

    this.usePartial = this.usePartial || result.usePartial;

    this.children[guid] = result;

    for(var i=0, l=result.depths.list.length; i<l; i++) {
      depth = result.depths.list[i];

      if(depth < 2) { continue; }
      else { this.addDepth(depth - 1); }
    }

    return guid;
  },

  block: function(block) {
    var mustache = block.mustache,
        program = block.program,
        inverse = block.inverse;

    if (program) {
      program = this.compileProgram(program);
    }

    if (inverse) {
      inverse = this.compileProgram(inverse);
    }

    var type = this.classifyMustache(mustache);

    if (type === "helper") {
      this.helperMustache(mustache, program, inverse);
    } else if (type === "simple") {
      this.simpleMustache(mustache);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue');
    } else {
      this.ambiguousMustache(mustache, program, inverse);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  hash: function(hash) {
    var pairs = hash.pairs, pair, val;

    this.opcode('pushHash');

    for(var i=0, l=pairs.length; i<l; i++) {
      pair = pairs[i];
      val  = pair[1];

      if (this.options.stringParams) {
        this.opcode('pushStringParam', val.stringModeValue, val.type);
      } else {
        this.accept(val);
      }

      this.opcode('assignToHash', pair[0]);
    }
    this.opcode('popHash');
  },

  partial: function(partial) {
    var partialName = partial.partialName;
    this.usePartial = true;

    if(partial.context) {
      this.ID(partial.context);
    } else {
      this.opcode('push', 'depth0');
    }

    this.opcode('invokePartial', partialName.name);
    this.opcode('append');
  },

  content: function(content) {
    this.opcode('appendContent', content.string);
  },

  mustache: function(mustache) {
    var options = this.options;
    var type = this.classifyMustache(mustache);

    if (type === "simple") {
      this.simpleMustache(mustache);
    } else if (type === "helper") {
      this.helperMustache(mustache);
    } else {
      this.ambiguousMustache(mustache);
    }

    if(mustache.escaped && !options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },

  ambiguousMustache: function(mustache, program, inverse) {
    var id = mustache.id,
        name = id.parts[0],
        isBlock = program != null || inverse != null;

    this.opcode('getContext', id.depth);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    this.opcode('invokeAmbiguous', name, isBlock);
  },

  simpleMustache: function(mustache) {
    var id = mustache.id;

    if (id.type === 'DATA') {
      this.DATA(id);
    } else if (id.parts.length) {
      this.ID(id);
    } else {
      // Simplified ID for `this`
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);
      this.opcode('pushContext');
    }

    this.opcode('resolvePossibleLambda');
  },

  helperMustache: function(mustache, program, inverse) {
    var params = this.setupFullMustacheParams(mustache, program, inverse),
        name = mustache.id.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.knownHelpersOnly) {
      throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
    } else {
      this.opcode('invokeHelper', params.length, name);
    }
  },

  ID: function(id) {
    this.addDepth(id.depth);
    this.opcode('getContext', id.depth);

    var name = id.parts[0];
    if (!name) {
      this.opcode('pushContext');
    } else {
      this.opcode('lookupOnContext', id.parts[0]);
    }

    for(var i=1, l=id.parts.length; i<l; i++) {
      this.opcode('lookup', id.parts[i]);
    }
  },

  DATA: function(data) {
    this.options.data = true;
    this.opcode('lookupData', data.id);
  },

  STRING: function(string) {
    this.opcode('pushString', string.string);
  },

  INTEGER: function(integer) {
    this.opcode('pushLiteral', integer.integer);
  },

  BOOLEAN: function(bool) {
    this.opcode('pushLiteral', bool.bool);
  },

  comment: function() {},

  // HELPERS
  opcode: function(name) {
    this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
  },

  declare: function(name, value) {
    this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
  },

  addDepth: function(depth) {
    if(isNaN(depth)) { throw new Error("EWOT"); }
    if(depth === 0) { return; }

    if(!this.depths[depth]) {
      this.depths[depth] = true;
      this.depths.list.push(depth);
    }
  },

  classifyMustache: function(mustache) {
    var isHelper   = mustache.isHelper;
    var isEligible = mustache.eligibleHelper;
    var options    = this.options;

    // if ambiguous, we can possibly resolve the ambiguity now
    if (isEligible && !isHelper) {
      var name = mustache.id.parts[0];

      if (options.knownHelpers[name]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) { return "helper"; }
    else if (isEligible) { return "ambiguous"; }
    else { return "simple"; }
  },

  pushParams: function(params) {
    var i = params.length, param;

    while(i--) {
      param = params[i];

      if(this.options.stringParams) {
        if(param.depth) {
          this.addDepth(param.depth);
        }

        this.opcode('getContext', param.depth || 0);
        this.opcode('pushStringParam', param.stringModeValue, param.type);
      } else {
        this[param.type](param);
      }
    }
  },

  setupMustacheParams: function(mustache) {
    var params = mustache.params;
    this.pushParams(params);

    if(mustache.hash) {
      this.hash(mustache.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  },

  // this will replace setupMustacheParams when we're done
  setupFullMustacheParams: function(mustache, program, inverse) {
    var params = mustache.params;
    this.pushParams(params);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if(mustache.hash) {
      this.hash(mustache.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  }
};

var Literal = function(value) {
  this.value = value;
};

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function(parent, name /* , type*/) {
    if (/^[0-9]+$/.test(name)) {
      return parent + "[" + name + "]";
    } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
      return parent + "." + name;
    }
    else {
      return parent + "['" + name + "']";
    }
  },

  appendToBuffer: function(string) {
    if (this.environment.isSimple) {
      return "return " + string + ";";
    } else {
      return {
        appendToBuffer: true,
        content: string,
        toString: function() { return "buffer += " + string + ";"; }
      };
    }
  },

  initializeBuffer: function() {
    return this.quotedString("");
  },

  namespace: "Handlebars",
  // END PUBLIC API

  compile: function(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options || {};

    Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      programs: [],
      environments: [],
      aliases: { }
    };

    this.preamble();

    this.stackSlot = 0;
    this.stackVars = [];
    this.registers = { list: [] };
    this.compileStack = [];
    this.inlineStack = [];

    this.compileChildren(environment, options);

    var opcodes = environment.opcodes, opcode;

    this.i = 0;

    for(l=opcodes.length; this.i<l; this.i++) {
      opcode = opcodes[this.i];

      if(opcode.opcode === 'DECLARE') {
        this[opcode.name] = opcode.value;
      } else {
        this[opcode.opcode].apply(this, opcode.args);
      }
    }

    return this.createFunctionContext(asObject);
  },

  nextOpcode: function() {
    var opcodes = this.environment.opcodes;
    return opcodes[this.i + 1];
  },

  eat: function() {
    this.i = this.i + 1;
  },

  preamble: function() {
    var out = [];

    if (!this.isChild) {
      var namespace = this.namespace;
      var copies = "helpers = helpers || " + namespace + ".helpers;";
      if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
      if (this.options.data) { copies = copies + " data = data || {};"; }
      out.push(copies);
    } else {
      out.push('');
    }

    if (!this.environment.isSimple) {
      out.push(", buffer = " + this.initializeBuffer());
    } else {
      out.push("");
    }

    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = out;
  },

  createFunctionContext: function(asObject) {
    var locals = this.stackVars.concat(this.registers.list);

    if(locals.length > 0) {
      this.source[1] = this.source[1] + ", " + locals.join(", ");
    }

    // Generate minimizer alias mappings
    if (!this.isChild) {
      for (var alias in this.context.aliases) {
        this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
      }
    }

    if (this.source[1]) {
      this.source[1] = "var " + this.source[1].substring(2) + ";";
    }

    // Merge children
    if (!this.isChild) {
      this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
    }

    if (!this.environment.isSimple) {
      this.source.push("return buffer;");
    }

    var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

    for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
      params.push("depth" + this.environment.depths.list[i]);
    }

    // Perform a second pass over the output to merge content when possible
    var source = this.mergeSource();

    if (!this.isChild) {
      var revision = Handlebars.COMPILER_REVISION,
          versions = Handlebars.REVISION_CHANGES[revision];
      source = "this.compilerInfo = ["+revision+",'"+versions+"'];\n"+source;
    }

    if (asObject) {
      params.push(source);

      return Function.apply(this, params);
    } else {
      var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
      Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
      return functionSource;
    }
  },
  mergeSource: function() {
    // WARN: We are not handling the case where buffer is still populated as the source should
    // not have buffer append operations as their final action.
    var source = '',
        buffer;
    for (var i = 0, len = this.source.length; i < len; i++) {
      var line = this.source[i];
      if (line.appendToBuffer) {
        if (buffer) {
          buffer = buffer + '\n    + ' + line.content;
        } else {
          buffer = line.content;
        }
      } else {
        if (buffer) {
          source += 'buffer += ' + buffer + ';\n  ';
          buffer = undefined;
        }
        source += line + '\n  ';
      }
    }
    return source;
  },

  // [blockValue]
  //
  // On stack, before: hash, inverse, program, value
  // On stack, after: return value of blockHelperMissing
  //
  // The purpose of this opcode is to take a block of the form
  // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
  // replace it on the stack with the result of properly
  // invoking blockHelperMissing.
  blockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    this.replaceStack(function(current) {
      params.splice(1, 0, current);
      return "blockHelperMissing.call(" + params.join(", ") + ")";
    });
  },

  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    var current = this.topStack();
    params.splice(1, 0, current);

    // Use the options value generated from the invocation
    params[params.length-1] = 'options';

    this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
  },

  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function(content) {
    this.source.push(this.appendToBuffer(this.quotedString(content)));
  },

  // [append]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Coerces `value` to a String and appends it to the current buffer.
  //
  // If `value` is truthy, or 0, it is coerced into a string and appended
  // Otherwise, the empty string is appended
  append: function() {
    // Force anything that is inlined onto the stack so we don't have duplication
    // when we examine local
    this.flushInline();
    var local = this.popStack();
    this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    if (this.environment.isSimple) {
      this.source.push("else { " + this.appendToBuffer("''") + " }");
    }
  },

  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function() {
    this.context.aliases.escapeExpression = 'this.escapeExpression';

    this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
  },

  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function(depth) {
    if(this.lastContext !== depth) {
      this.lastContext = depth;
    }
  },

  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function(name) {
    this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
  },

  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function() {
    this.pushStackLiteral('depth' + this.lastContext);
  },

  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function() {
    this.context.aliases.functionType = '"function"';

    this.replaceStack(function(current) {
      return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
    });
  },

  // [lookup]
  //
  // On stack, before: value, ...
  // On stack, after: value[name], ...
  //
  // Replace the value on the stack with the result of looking
  // up `name` on `value`
  lookup: function(name) {
    this.replaceStack(function(current) {
      return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
    });
  },

  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data[id], ...
  //
  // Push the result of looking up `id` on the current data
  lookupData: function(id) {
    this.push(this.nameLookup('data', id, 'data'));
  },

  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function(string, type) {
    this.pushStackLiteral('depth' + this.lastContext);

    this.pushString(type);

    if (typeof string === 'string') {
      this.pushString(string);
    } else {
      this.pushStackLiteral(string);
    }
  },

  emptyHash: function() {
    this.pushStackLiteral('{}');

    if (this.options.stringParams) {
      this.register('hashTypes', '{}');
    }
  },
  pushHash: function() {
    this.hash = {values: [], types: []};
  },
  popHash: function() {
    var hash = this.hash;
    this.hash = undefined;

    if (this.options.stringParams) {
      this.register('hashTypes', '{' + hash.types.join(',') + '}');
    }
    this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
  },

  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function(string) {
    this.pushStackLiteral(this.quotedString(string));
  },

  // [push]
  //
  // On stack, before: ...
  // On stack, after: expr, ...
  //
  // Push an expression onto the stack
  push: function(expr) {
    this.inlineStack.push(expr);
    return expr;
  },

  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function(value) {
    this.pushStackLiteral(value);
  },

  // [pushProgram]
  //
  // On stack, before: ...
  // On stack, after: program(guid), ...
  //
  // Push a program expression onto the stack. This takes
  // a compile-time guid and converts it into a runtime-accessible
  // expression.
  pushProgram: function(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  // [invokeHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // Pops off the helper's parameters, invokes the helper,
  // and pushes the helper's return value onto the stack.
  //
  // If the helper is not found, `helperMissing` is called.
  invokeHelper: function(paramSize, name) {
    this.context.aliases.helperMissing = 'helpers.helperMissing';

    var helper = this.lastHelper = this.setupHelper(paramSize, name, true);

    this.push(helper.name);
    this.replaceStack(function(name) {
      return name + ' ? ' + name + '.call(' +
          helper.callParams + ") " + ": helperMissing.call(" +
          helper.helperMissingParams + ")";
    });
  },

  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(helper.name + ".call(" + helper.callParams + ")");
  },

  // [invokeAmbiguous]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of disambiguation
  //
  // This operation is used when an expression like `{{foo}}`
  // is provided, but we don't know at compile-time whether it
  // is a helper or a path.
  //
  // This operation emits more code than the other options,
  // and can be avoided by passing the `knownHelpers` and
  // `knownHelpersOnly` flags at compile-time.
  invokeAmbiguous: function(name, helperCall) {
    this.context.aliases.functionType = '"function"';

    this.pushStackLiteral('{}');    // Hash value
    var helper = this.setupHelper(0, name, helperCall);

    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

    var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
    var nextStack = this.nextStack();

    this.source.push('if (' + nextStack + ' = ' + helperName + ') { ' + nextStack + ' = ' + nextStack + '.call(' + helper.callParams + '); }');
    this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '.apply(depth0) : ' + nextStack + '; }');
  },

  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function(name) {
    var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

    if (this.options.data) {
      params.push("data");
    }

    this.context.aliases.self = "this";
    this.push("self.invokePartial(" + params.join(", ") + ")");
  },

  // [assignToHash]
  //
  // On stack, before: value, hash, ...
  // On stack, after: hash, ...
  //
  // Pops a value and hash off the stack, assigns `hash[key] = value`
  // and pushes the hash back onto the stack.
  assignToHash: function(key) {
    var value = this.popStack(),
        type;

    if (this.options.stringParams) {
      type = this.popStack();
      this.popStack();
    }

    var hash = this.hash;
    if (type) {
      hash.types.push("'" + key + "': " + type);
    }
    hash.values.push("'" + key + "': (" + value + ")");
  },

  // HELPERS

  compiler: JavaScriptCompiler,

  compileChildren: function(environment, options) {
    var children = environment.children, child, compiler;

    for(var i=0, l=children.length; i<l; i++) {
      child = children[i];
      compiler = new this.compiler();

      var index = this.matchExistingProgram(child);

      if (index == null) {
        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
        this.context.environments[index] = child;
      } else {
        child.index = index;
        child.name = 'program' + index;
      }
    }
  },
  matchExistingProgram: function(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];
      if (environment && environment.equals(child)) {
        return i;
      }
    }
  },

  programExpression: function(guid) {
    this.context.aliases.self = "this";

    if(guid == null) {
      return "self.noop";
    }

    var child = this.environment.children[guid],
        depths = child.depths.list, depth;

    var programParams = [child.index, child.name, "data"];

    for(var i=0, l = depths.length; i<l; i++) {
      depth = depths[i];

      if(depth === 1) { programParams.push("depth0"); }
      else { programParams.push("depth" + (depth - 1)); }
    }

    if(depths.length === 0) {
      return "self.program(" + programParams.join(", ") + ")";
    } else {
      programParams.shift();
      return "self.programWithDepth(" + programParams.join(", ") + ")";
    }
  },

  register: function(name, val) {
    this.useRegister(name);
    this.source.push(name + " = " + val + ";");
  },

  useRegister: function(name) {
    if(!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },

  pushStackLiteral: function(item) {
    return this.push(new Literal(item));
  },

  pushStack: function(item) {
    this.flushInline();

    var stack = this.incrStack();
    if (item) {
      this.source.push(stack + " = " + item + ";");
    }
    this.compileStack.push(stack);
    return stack;
  },

  replaceStack: function(callback) {
    var prefix = '',
        inline = this.isInline(),
        stack;

    // If we are currently inline then we want to merge the inline statement into the
    // replacement statement via ','
    if (inline) {
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        stack = top.value;
      } else {
        // Get or create the current stack name for use by the inline
        var name = this.stackSlot ? this.topStackName() : this.incrStack();

        prefix = '(' + this.push(name) + ' = ' + top + '),';
        stack = this.topStack();
      }
    } else {
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (inline) {
      if (this.inlineStack.length || this.compileStack.length) {
        this.popStack();
      }
      this.push('(' + prefix + item + ')');
    } else {
      // Prevent modification of the context depth variable. Through replaceStack
      if (!/^stack/.test(stack)) {
        stack = this.nextStack();
      }

      this.source.push(stack + " = (" + prefix + item + ");");
    }
    return stack;
  },

  nextStack: function() {
    return this.pushStack();
  },

  incrStack: function() {
    this.stackSlot++;
    if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
    return this.topStackName();
  },
  topStackName: function() {
    return "stack" + this.stackSlot;
  },
  flushInline: function() {
    var inlineStack = this.inlineStack;
    if (inlineStack.length) {
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          this.pushStack(entry);
        }
      }
    }
  },
  isInline: function() {
    return this.inlineStack.length;
  },

  popStack: function(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      if (!inline) {
        this.stackSlot--;
      }
      return item;
    }
  },

  topStack: function(wrapped) {
    var stack = (this.isInline() ? this.inlineStack : this.compileStack),
        item = stack[stack.length - 1];

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      return item;
    }
  },

  quotedString: function(str) {
    return '"' + str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r') + '"';
  },

  setupHelper: function(paramSize, name, missingParams) {
    var params = [];
    this.setupParams(paramSize, params, missingParams);
    var foundHelper = this.nameLookup('helpers', name, 'helper');

    return {
      params: params,
      name: foundHelper,
      callParams: ["depth0"].concat(params).join(", "),
      helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
    };
  },

  // the params and contexts arguments are passed in arrays
  // to fill in
  setupParams: function(paramSize, params, useRegister) {
    var options = [], contexts = [], types = [], param, inverse, program;

    options.push("hash:" + this.popStack());

    inverse = this.popStack();
    program = this.popStack();

    // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`
    if (program || inverse) {
      if (!program) {
        this.context.aliases.self = "this";
        program = "self.noop";
      }

      if (!inverse) {
       this.context.aliases.self = "this";
        inverse = "self.noop";
      }

      options.push("inverse:" + inverse);
      options.push("fn:" + program);
    }

    for(var i=0; i<paramSize; i++) {
      param = this.popStack();
      params.push(param);

      if(this.options.stringParams) {
        types.push(this.popStack());
        contexts.push(this.popStack());
      }
    }

    if (this.options.stringParams) {
      options.push("contexts:[" + contexts.join(",") + "]");
      options.push("types:[" + types.join(",") + "]");
      options.push("hashTypes:hashTypes");
    }

    if(this.options.data) {
      options.push("data:data");
    }

    options = "{" + options.join(",") + "}";
    if (useRegister) {
      this.register('options', options);
      params.push('options');
    } else {
      params.push(options);
    }
    return params.join(", ");
  }
};

var reservedWords = (
  "break else new var" +
  " case finally return void" +
  " catch for switch while" +
  " continue function this with" +
  " default if throw" +
  " delete in try" +
  " do instanceof typeof" +
  " abstract enum int short" +
  " boolean export interface static" +
  " byte extends long super" +
  " char final native synchronized" +
  " class float package throws" +
  " const goto private transient" +
  " debugger implements protected volatile" +
  " double import public let yield"
).split(" ");

var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

for(var i=0, l=reservedWords.length; i<l; i++) {
  compilerWords[reservedWords[i]] = true;
}

JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
  if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
    return true;
  }
  return false;
};

Handlebars.precompile = function(input, options) {
  if (!input || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var ast = Handlebars.parse(input);
  var environment = new Compiler().compile(ast, options);
  return new JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(input, options) {
  if (!input || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var compiled;
  function compile() {
    var ast = Handlebars.parse(input);
    var environment = new Compiler().compile(ast, options);
    var templateSpec = new JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};

;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
})(Handlebars);
;
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2011-2013 Tilde Inc. and contributors
//            Portions ©2006-2011 Strobe Inc.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license
//            See https://raw.github.com/emberjs/ember.js/master/LICENSE
// ==========================================================================


// Version: v1.0.0-rc.3-187-ga8b6e30
// Last commit: a8b6e30 (2013-05-09 18:28:11 -0700)


(function(){var e,t;(function(){var r={},n={};e=function(e,t,n){r[e]={deps:t,callback:n}},t=function(e){if(n[e])return n[e];n[e]={};for(var i,o=r[e],s=o.deps,a=o.callback,u=[],c=0,l=s.length;l>c;c++)"exports"===s[c]?u.push(i={}):u.push(t(s[c]));var h=a.apply(this,u);return n[e]=i||h}})(),function(){function e(e){return t.console&&t.console[e]?t.console[e].apply?function(){t.console[e].apply(t.console,arguments)}:function(){var r=Array.prototype.join.call(arguments,", ");t.console[e](r)}:void 0}"undefined"==typeof Ember&&(Ember={});var t=Ember.imports=Ember.imports||this,r=Ember.exports=Ember.exports||this;Ember.lookup=Ember.lookup||this,r.Em=r.Ember=Em=Ember,Ember.isNamespace=!0,Ember.toString=function(){return"Ember"},Ember.VERSION="1.0.0-rc.3",Ember.ENV=Ember.ENV||("undefined"==typeof ENV?{}:ENV),Ember.config=Ember.config||{},Ember.EXTEND_PROTOTYPES=Ember.ENV.EXTEND_PROTOTYPES,"undefined"==typeof Ember.EXTEND_PROTOTYPES&&(Ember.EXTEND_PROTOTYPES=!0),Ember.LOG_STACKTRACE_ON_DEPRECATION=Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION!==!1,Ember.SHIM_ES5=Ember.ENV.SHIM_ES5===!1?!1:Ember.EXTEND_PROTOTYPES,Ember.LOG_VERSION=Ember.ENV.LOG_VERSION===!1?!1:!0,Ember.K=function(){return this},"undefined"==typeof Ember.assert&&(Ember.assert=Ember.K),"undefined"==typeof Ember.warn&&(Ember.warn=Ember.K),"undefined"==typeof Ember.debug&&(Ember.debug=Ember.K),"undefined"==typeof Ember.deprecate&&(Ember.deprecate=Ember.K),"undefined"==typeof Ember.deprecateFunc&&(Ember.deprecateFunc=function(e,t){return t}),Ember.uuid=0,Ember.Logger={log:e("log")||Ember.K,warn:e("warn")||Ember.K,error:e("error")||Ember.K,info:e("info")||Ember.K,debug:e("debug")||e("info")||Ember.K},Ember.onerror=null,Ember.handleErrors=function(e,t){if("function"!=typeof Ember.onerror)return e.call(t||this);try{return e.call(t||this)}catch(r){Ember.onerror(r)}},Ember.merge=function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e},Ember.isNone=function(e){return null===e||void 0===e},Ember.none=Ember.deprecateFunc("Ember.none is deprecated. Please use Ember.isNone instead.",Ember.isNone),Ember.isEmpty=function(e){return Ember.isNone(e)||0===e.length&&"function"!=typeof e||"object"==typeof e&&0===Ember.get(e,"length")},Ember.empty=Ember.deprecateFunc("Ember.empty is deprecated. Please use Ember.isEmpty instead.",Ember.isEmpty)}(),function(){var e=Ember.platform={};if(Ember.create=Object.create,Ember.create&&2!==Ember.create({a:1},{a:{value:2}}).a&&(Ember.create=null),!Ember.create||Ember.ENV.STUB_OBJECT_CREATE){var t=function(){};Ember.create=function(e,r){if(t.prototype=e,e=new t,r){t.prototype=e;for(var n in r)t.prototype[n]=r[n].value;e=new t}return t.prototype=null,e},Ember.create.isSimulated=!0}var r,n,i=Object.defineProperty;if(i)try{i({},"a",{get:function(){}})}catch(o){i=null}i&&(r=function(){var e={};return i(e,"a",{configurable:!0,enumerable:!0,get:function(){},set:function(){}}),i(e,"a",{configurable:!0,enumerable:!0,writable:!0,value:!0}),e.a===!0}(),n=function(){try{return i(document.createElement("div"),"definePropertyOnDOM",{}),!0}catch(e){}return!1}(),r?n||(i=function(e,t,r){var n;return n="object"==typeof Node?e instanceof Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName,n?e[t]=r.value:Object.defineProperty(e,t,r)}):i=null),e.defineProperty=i,e.hasPropertyAccessors=!0,e.defineProperty||(e.hasPropertyAccessors=!1,e.defineProperty=function(e,t,r){r.get||(e[t]=r.value)},e.defineProperty.isSimulated=!0),Ember.ENV.MANDATORY_SETTER&&!e.hasPropertyAccessors&&(Ember.ENV.MANDATORY_SETTER=!1)}(),function(){var e=function(e){return e&&Function.prototype.toString.call(e).indexOf("[native code]")>-1},t=e(Array.prototype.map)?Array.prototype.map:function(e){if(void 0===this||null===this)throw new TypeError;var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var n=new Array(r),i=arguments[1],o=0;r>o;o++)o in t&&(n[o]=e.call(i,t[o],o,t));return n},r=e(Array.prototype.forEach)?Array.prototype.forEach:function(e){if(void 0===this||null===this)throw new TypeError;var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var n=arguments[1],i=0;r>i;i++)i in t&&e.call(n,t[i],i,t)},n=e(Array.prototype.indexOf)?Array.prototype.indexOf:function(e,t){null===t||void 0===t?t=0:0>t&&(t=Math.max(0,this.length+t));for(var r=t,n=this.length;n>r;r++)if(this[r]===e)return r;return-1};Ember.ArrayPolyfills={map:t,forEach:r,indexOf:n},Ember.SHIM_ES5&&(Array.prototype.map||(Array.prototype.map=t),Array.prototype.forEach||(Array.prototype.forEach=r),Array.prototype.indexOf||(Array.prototype.indexOf=n))}(),function(){function e(e){this.descs={},this.watching={},this.cache={},this.source=e}function t(e,t){return!(!e||"function"!=typeof e[t])}var r=Ember.platform.defineProperty,n=Ember.create,i="__ember"+ +new Date,o=0,s=[],a={},u=Ember.ENV.MANDATORY_SETTER;Ember.GUID_KEY=i;var c={writable:!1,configurable:!1,enumerable:!1,value:null};Ember.generateGuid=function(e,t){t||(t="ember");var n=t+o++;return e&&(c.value=n,r(e,i,c)),n},Ember.guidFor=function(e){if(void 0===e)return"(undefined)";if(null===e)return"(null)";var t,n=typeof e;switch(n){case"number":return t=s[e],t||(t=s[e]="nu"+e),t;case"string":return t=a[e],t||(t=a[e]="st"+o++),t;case"boolean":return e?"(true)":"(false)";default:return e[i]?e[i]:e===Object?"(Object)":e===Array?"(Array)":(t="ember"+o++,c.value=t,r(e,i,c),t)}};var l={writable:!0,configurable:!1,enumerable:!1,value:null},h=Ember.GUID_KEY+"_meta";Ember.META_KEY=h;var m={descs:{},watching:{}};u&&(m.values={}),Ember.EMPTY_META=m,Object.freeze&&Object.freeze(m);var f=Ember.platform.defineProperty.isSimulated;f&&(e.prototype.__preventPlainObject__=!0,e.prototype.toJSON=function(){}),Ember.meta=function(t,i){var o=t[h];return i===!1?o||m:(o?o.source!==t&&(f||r(t,h,l),o=n(o),o.descs=n(o.descs),o.watching=n(o.watching),o.cache={},o.source=t,u&&(o.values=n(o.values)),t[h]=o):(f||r(t,h,l),o=new e(t),u&&(o.values={}),t[h]=o,o.descs.constructor=null),o)},Ember.getMeta=function(e,t){var r=Ember.meta(e,!1);return r[t]},Ember.setMeta=function(e,t,r){var n=Ember.meta(e,!0);return n[t]=r,r},Ember.metaPath=function(e,t,r){for(var i,o,s=Ember.meta(e,r),a=0,u=t.length;u>a;a++){if(i=t[a],o=s[i]){if(o.__ember_source__!==e){if(!r)return void 0;o=s[i]=n(o),o.__ember_source__=e}}else{if(!r)return void 0;o=s[i]={__ember_source__:e}}s=o}return o},Ember.wrap=function(e,t){function r(){}function n(){var n,i=this._super;return this._super=t||r,n=e.apply(this,arguments),this._super=i,n}return n.wrappedFunction=e,n.__ember_observes__=e.__ember_observes__,n.__ember_observesBefore__=e.__ember_observesBefore__,n},Ember.isArray=function(e){return!e||e.setInterval?!1:Array.isArray&&Array.isArray(e)?!0:Ember.Array&&Ember.Array.detect(e)?!0:void 0!==e.length&&"object"==typeof e?!0:!1},Ember.makeArray=function(e){return null===e||void 0===e?[]:Ember.isArray(e)?e:[e]},Ember.canInvoke=t,Ember.tryInvoke=function(e,r,n){return t(e,r)?e[r].apply(e,n||[]):void 0};var p=function(){var e=0;try{try{}finally{throw e++,new Error("needsFinallyFixTest")}}catch(t){}return 1!==e}();Ember.tryFinally=p?function(e,t,r){var n,i,o;r=r||this;try{n=e.call(r)}finally{try{i=t.call(r)}catch(s){o=s}}if(o)throw o;return void 0===i?n:i}:function(e,t,r){var n,i;r=r||this;try{n=e.call(r)}finally{i=t.call(r)}return void 0===i?n:i},Ember.tryCatchFinally=p?function(e,t,r,n){var i,o,s;n=n||this;try{i=e.call(n)}catch(a){i=t.call(n,a)}finally{try{o=r.call(n)}catch(u){s=u}}if(s)throw s;return void 0===o?i:o}:function(e,t,r,n){var i,o;n=n||this;try{i=e.call(n)}catch(s){i=t.call(n,s)}finally{o=r.call(n)}return void 0===o?i:o};var d={},b="Boolean Number String Function Array Date RegExp Object".split(" ");Ember.ArrayPolyfills.forEach.call(b,function(e){d["[object "+e+"]"]=e.toLowerCase()});var E=Object.prototype.toString;Ember.typeOf=function(e){var t;return t=null===e||void 0===e?String(e):d[E.call(e)]||"object","function"===t?Ember.Object&&Ember.Object.detect(e)&&(t="class"):"object"===t&&(t=e instanceof Error?"error":Ember.Object&&e instanceof Ember.Object?"instance":"object"),t}}(),function(){Ember.Instrumentation={};var e=[],t={},r=function(r){for(var n,i=[],o=0,s=e.length;s>o;o++)n=e[o],n.regex.test(r)&&i.push(n.object);return t[r]=i,i},n=function(){var e="undefined"!=typeof window?window.performance||{}:{},t=e.now||e.mozNow||e.webkitNow||e.msNow||e.oNow;return t?t.bind(e):function(){return+new Date}}();Ember.Instrumentation.instrument=function(e,i,o,s){function a(){for(p=0,d=m.length;d>p;p++)f=m[p],b[p]=f.before(e,n(),i);return o.call(s)}function u(e){i=i||{},i.exception=e}function c(){for(p=0,d=m.length;d>p;p++)f=m[p],f.after(e,n(),i,b[p]);Ember.STRUCTURED_PROFILE&&console.timeEnd(l)}var l,h,m=t[e];if(Ember.STRUCTURED_PROFILE&&(l=e+": "+i.object,console.time(l)),m||(m=r(e)),0===m.length)return h=o.call(s),Ember.STRUCTURED_PROFILE&&console.timeEnd(l),h;var f,p,d,b=[];return Ember.tryCatchFinally(a,u,c)},Ember.Instrumentation.subscribe=function(r,n){for(var i,o=r.split("."),s=[],a=0,u=o.length;u>a;a++)i=o[a],"*"===i?s.push("[^\\.]*"):s.push(i);s=s.join("\\."),s+="(\\..*)?";var c={pattern:r,regex:new RegExp("^"+s+"$"),object:n};return e.push(c),t={},c},Ember.Instrumentation.unsubscribe=function(r){for(var n,i=0,o=e.length;o>i;i++)e[i]===r&&(n=i);e.splice(n,1),t={}},Ember.Instrumentation.reset=function(){e=[],t={}},Ember.instrument=Ember.Instrumentation.instrument,Ember.subscribe=Ember.Instrumentation.subscribe}(),function(){var e,t,r,n;n=Array.prototype.concat,e=Array.prototype.map||Ember.ArrayPolyfills.map,t=Array.prototype.forEach||Ember.ArrayPolyfills.forEach,r=Array.prototype.indexOf||Ember.ArrayPolyfills.indexOf;var i=Ember.EnumerableUtils={map:function(t,r,n){return t.map?t.map.call(t,r,n):e.call(t,r,n)},forEach:function(e,r,n){return e.forEach?e.forEach.call(e,r,n):t.call(e,r,n)},indexOf:function(e,t,n){return e.indexOf?e.indexOf.call(e,t,n):r.call(e,t,n)},indexesOf:function(e,t){return void 0===t?[]:i.map(t,function(t){return i.indexOf(e,t)})},addObject:function(e,t){var r=i.indexOf(e,t);-1===r&&e.push(t)},removeObject:function(e,t){var r=i.indexOf(e,t);-1!==r&&e.splice(r,1)},replace:function(e,t,r,i){if(e.replace)return e.replace(t,r,i);var o=n.apply([t,r],i);return e.splice.apply(e,o)},intersection:function(e,t){var r=[];return i.forEach(e,function(e){i.indexOf(t,e)>=0&&r.push(e)}),r}}}(),function(){var e=Ember.guidFor,t=Ember.ArrayPolyfills.indexOf,r=function(e){var t={};for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},n=function(e,t){var n=e.keys.copy(),i=r(e.values);return t.keys=n,t.values=i,t},i=Ember.OrderedSet=function(){this.clear()};i.create=function(){return new i},i.prototype={clear:function(){this.presenceSet={},this.list=[]},add:function(t){var r=e(t),n=this.presenceSet,i=this.list;r in n||(n[r]=!0,i.push(t))},remove:function(r){var n=e(r),i=this.presenceSet,o=this.list;delete i[n];var s=t.call(o,r);s>-1&&o.splice(s,1)},isEmpty:function(){return 0===this.list.length},has:function(t){var r=e(t),n=this.presenceSet;return r in n},forEach:function(e,t){for(var r=this.toArray(),n=0,i=r.length;i>n;n++)e.call(t,r[n])},toArray:function(){return this.list.slice()},copy:function(){var e=new i;return e.presenceSet=r(this.presenceSet),e.list=this.toArray(),e}};var o=Ember.Map=function(){this.keys=Ember.OrderedSet.create(),this.values={}};o.create=function(){return new o},o.prototype={get:function(t){var r=this.values,n=e(t);return r[n]},set:function(t,r){var n=this.keys,i=this.values,o=e(t);n.add(t),i[o]=r},remove:function(t){var r=this.keys,n=this.values,i=e(t);return n.hasOwnProperty(i)?(r.remove(t),delete n[i],!0):!1},has:function(t){var r=this.values,n=e(t);return r.hasOwnProperty(n)},forEach:function(t,r){var n=this.keys,i=this.values;n.forEach(function(n){var o=e(n);t.call(r,n,i[o])})},copy:function(){return n(this,new o)}};var s=Ember.MapWithDefault=function(e){o.call(this),this.defaultValue=e.defaultValue};s.create=function(e){return e?new s(e):new o},s.prototype=Ember.create(o.prototype),s.prototype.get=function(e){var t=this.has(e);if(t)return o.prototype.get.call(this,e);var r=this.defaultValue(e);return this.set(e,r),r},s.prototype.copy=function(){return n(this,new s({defaultValue:this.defaultValue}))}}(),function(){function e(e){return e.match(a)[0]}function t(t,n){var i,a=s.test(n),u=!a&&o.test(n);if((!t||u)&&(t=Ember.lookup),a&&(n=n.slice(5)),t===Ember.lookup&&(i=e(n),t=r(t,i),n=n.slice(i.length+1)),!n||0===n.length)throw new Error("Invalid Path");return[t,n]}var r,n=Ember.META_KEY,i=Ember.ENV.MANDATORY_SETTER,o=/^([A-Z$]|([0-9][A-Z$])).*[\.\*]/,s=/^this[\.\*]/,a=/^([^\.\*]+)/;r=function r(e,t){if(""===t)return e;if(t||"string"!=typeof e||(t=e,e=null),null===e||-1!==t.indexOf("."))return u(e,t);var r,o=e[n],s=o&&o.descs[t];return s?s.get(e,t):(r=i&&o&&o.watching[t]>0?o.values[t]:e[t],void 0!==r||"object"!=typeof e||t in e||"function"!=typeof e.unknownProperty?r:e.unknownProperty(t))},Ember.config.overrideAccessors&&(Ember.get=r,Ember.config.overrideAccessors(),r=Ember.get);var u=Ember._getPath=function(e,n){var i,o,a,u,c;if(null===e&&-1===n.indexOf("."))return r(Ember.lookup,n);for(i=s.test(n),(!e||i)&&(a=t(e,n),e=a[0],n=a[1],a.length=0),o=n.split("."),c=o.length,u=0;void 0!==e&&null!==e&&c>u;u++)if(e=r(e,o[u],!0),e&&e.isDestroyed)return void 0;return e};Ember.normalizeTuple=function(e,r){return t(e,r)},Ember.getWithDefault=function(e,t,n){var i=r(e,t);return void 0===i?n:i},Ember.get=r,Ember.getPath=Ember.deprecateFunc("getPath is deprecated since get now supports paths",Ember.get)}(),function(){function e(e,t,r){for(var n=-1,i=0,o=e.length;o>i;i++)if(t===e[i][0]&&r===e[i][1]){n=i;break}return n}function t(e,t){var r,n=f(e,!0);return n.listeners||(n.listeners={}),n.hasOwnProperty("listeners")||(n.listeners=m(n.listeners)),r=n.listeners[t],r&&!n.listeners.hasOwnProperty(t)?r=n.listeners[t]=n.listeners[t].slice():r||(r=n.listeners[t]=[]),r}function r(t,r,n){var i=t[p],o=i&&i.listeners&&i.listeners[r];if(o)for(var s=o.length-1;s>=0;s--){var a=o[s][0],u=o[s][1],c=o[s][2],l=e(n,a,u);-1===l&&n.push([a,u,c])}}function n(t,r,n){var i=t[p],o=i&&i.listeners&&i.listeners[r],s=[];if(o){for(var a=o.length-1;a>=0;a--){var u=o[a][0],c=o[a][1],l=o[a][2],h=e(n,u,c);-1===h&&(n.push([u,c,l]),s.push([u,c,l]))}return s}}function i(r,n,i,o,s){o||"function"!=typeof i||(o=i,i=null);var a=t(r,n),u=e(a,i,o),c=0;s&&(c|=d),-1===u&&(a.push([i,o,c]),"function"==typeof r.didAddListener&&r.didAddListener(n,i,o))}function o(r,n,i,o){function s(i,o){var s=t(r,n),a=e(s,i,o);-1!==a&&(s.splice(a,1),"function"==typeof r.didRemoveListener&&r.didRemoveListener(n,i,o))}if(o||"function"!=typeof i||(o=i,i=null),o)s(i,o);else{var a=r[p],u=a&&a.listeners&&a.listeners[n];if(!u)return;for(var c=u.length-1;c>=0;c--)s(u[c][0],u[c][1])}}function s(r,n,i,o,s){function a(){return s.call(i)}function u(){c&&(c[2]&=~b)}o||"function"!=typeof i||(o=i,i=null);var c,l=t(r,n),h=e(l,i,o);return-1!==h&&(c=l[h].slice(),c[2]|=b,l[h]=c),Ember.tryFinally(a,u)}function a(r,n,i,o,s){function a(){return s.call(i)}function u(){for(m=0,f=p.length;f>m;m++)p[m][2]&=~b}o||"function"!=typeof i||(o=i,i=null);var c,l,h,m,f,p=[];for(m=0,f=n.length;f>m;m++){c=n[m],l=t(r,c);var d=e(l,i,o);-1!==d&&(h=l[d].slice(),h[2]|=b,l[d]=h,p.push(h))}return Ember.tryFinally(a,u)}function u(e){var t=e[p].listeners,r=[];if(t)for(var n in t)t[n]&&r.push(n);return r}function c(e,t,r,n){if(e!==Ember&&"function"==typeof e.sendEvent&&e.sendEvent(t,r),!n){var i=e[p];n=i&&i.listeners&&i.listeners[t]}if(n){for(var s=n.length-1;s>=0;s--){var a=n[s];if(a){var u=a[0],c=a[1],l=a[2];l&b||(l&d&&o(e,t,u,c),u||(u=e),"string"==typeof c&&(c=u[c]),r?c.apply(u,r):c.call(u))}}return!0}}function l(e,t){var r=e[p],n=r&&r.listeners&&r.listeners[t];return!(!n||!n.length)}function h(e,t){var r=[],n=e[p],i=n&&n.listeners&&n.listeners[t];if(!i)return r;for(var o=0,s=i.length;s>o;o++){var a=i[o][0],u=i[o][1];r.push([a,u])}return r}var m=Ember.create,f=Ember.meta,p=Ember.META_KEY,d=1,b=2;Ember.addListener=i,Ember.removeListener=o,Ember._suspendListener=s,Ember._suspendListeners=a,Ember.sendEvent=c,Ember.hasListeners=l,Ember.watchedEvents=u,Ember.listenersFor=h,Ember.listenersDiff=n,Ember.listenersUnion=r}(),function(){var e=Ember.guidFor,t=Ember.sendEvent,r=Ember._ObserverSet=function(){this.clear()};r.prototype.add=function(t,r,n){var i,o=this.observerSet,s=this.observers,a=e(t),u=o[a];return u||(o[a]=u={}),i=u[r],void 0===i&&(i=s.push({sender:t,keyName:r,eventName:n,listeners:[]})-1,u[r]=i),s[i].listeners},r.prototype.flush=function(){var e,r,n,i,o=this.observers;for(this.clear(),e=0,r=o.length;r>e;++e)n=o[e],i=n.sender,i.isDestroying||i.isDestroyed||t(i,n.eventName,[i,n.keyName],n.listeners)},r.prototype.clear=function(){this.observerSet={},this.observers=[]}}(),function(){function e(e,t,i){if(!e.isDestroying){var o=n,s=!o;s&&(o=n={}),r(d,e,t,o,i),s&&(n=null)}}function t(e,t,n){if(!e.isDestroying){var o=i,s=!o;s&&(o=i={}),r(b,e,t,o,n),s&&(i=null)}}function r(e,t,r,n,i){var o=s(t);if(n[o]||(n[o]={}),!n[o][r]){n[o][r]=!0;var a=i.deps;if(a=a&&a[r])for(var u in a){var c=i.descs[u];c&&c._suspended===t||e(t,u)}}}var n,i,o=Ember.meta,s=Ember.guidFor,a=Ember.tryFinally,u=Ember.sendEvent,c=Ember.listenersUnion,l=Ember.listenersDiff,h=Ember._ObserverSet,m=new h,f=new h,p=0,d=Ember.propertyWillChange=function(t,r){var n=o(t,!1),i=n.watching[r]>0||"length"===r,s=n.proto,a=n.descs[r];i&&s!==t&&(a&&a.willChange&&a.willChange(t,r),e(t,r,n),E(t,r,n),w(t,r))},b=Ember.propertyDidChange=function(e,r){var n=o(e,!1),i=n.watching[r]>0||"length"===r,s=n.proto,a=n.descs[r];s!==e&&(a&&a.didChange&&a.didChange(e,r),(i||"length"===r)&&(t(e,r,n),v(e,r,n),_(e,r)))},E=function(e,t,r,n){if(r.hasOwnProperty("chainWatchers")){var i=r.chainWatchers;if(i=i[t])for(var o=0,s=i.length;s>o;o++)i[o].willChange(n)}},v=function(e,t,r,n){if(r.hasOwnProperty("chainWatchers")){var i=r.chainWatchers;if(i=i[t])for(var o=i.length-1;o>=0;o--)i[o].didChange(n)}};Ember.overrideChains=function(e,t,r){v(e,t,r,!0)};var g=Ember.beginPropertyChanges=function(){p++},y=Ember.endPropertyChanges=function(){p--,0>=p&&(m.clear(),f.flush())};Ember.changeProperties=function(e,t){g(),a(e,y,t)};var w=function(e,t){if(!e.isDestroying){var r,n,i=t+":before";p?(r=m.add(e,t,i),n=l(e,i,r),u(e,i,[e,t],n)):u(e,i,[e,t])}},_=function(e,t){if(!e.isDestroying){var r,n=t+":change";p?(r=f.add(e,t,n),c(e,n,r)):u(e,n,[e,t])}}}(),function(){function e(e,t,r,o){var s;if(s=t.slice(t.lastIndexOf(".")+1),t=t.slice(0,t.length-(s.length+1)),"this"!==t&&(e=n(e,t)),!s||0===s.length)throw new Error("You passed an empty path");if(!e){if(o)return;throw new Error("Object in path "+t+" could not be found or was destroyed.")}return i(e,s,r)}var t=Ember.META_KEY,r=Ember.ENV.MANDATORY_SETTER,n=Ember._getPath,i=function i(n,i,o,s){if("string"==typeof n&&(o=i,i=n,n=null),!n||-1!==i.indexOf("."))return e(n,i,o,s);var a,u,c=n[t],l=c&&c.descs[i];return l?l.set(n,i,o):(a="object"==typeof n&&!(i in n),a&&"function"==typeof n.setUnknownProperty?n.setUnknownProperty(i,o):c&&c.watching[i]>0?(u=r?c.values[i]:n[i],o!==u&&(Ember.propertyWillChange(n,i),r?void 0!==u||i in n?c.values[i]=o:Ember.defineProperty(n,i,null,o):n[i]=o,Ember.propertyDidChange(n,i))):n[i]=o),o};Ember.config.overrideAccessors&&(Ember.set=i,Ember.config.overrideAccessors(),i=Ember.set),Ember.set=i,Ember.setPath=Ember.deprecateFunc("setPath is deprecated since set now supports paths",Ember.set),Ember.trySet=function(e,t,r){return i(e,t,r,!0)},Ember.trySetPath=Ember.deprecateFunc("trySetPath has been renamed to trySet",Ember.trySet)}(),function(){var e=Ember.META_KEY,t=Ember.meta,r=Ember.platform.defineProperty,n=Ember.ENV.MANDATORY_SETTER;Ember.Descriptor=function(){};var i=Ember.MANDATORY_SETTER_FUNCTION=function(){},o=Ember.DEFAULT_GETTER_FUNCTION=function(t){return function(){var r=this[e];return r&&r.values[t]}};Ember.defineProperty=function(e,s,a,u,c){var l,h,m,f;return c||(c=t(e)),l=c.descs,h=c.descs[s],m=c.watching[s]>0,h instanceof Ember.Descriptor&&h.teardown(e,s),a instanceof Ember.Descriptor?(f=a,l[s]=a,n&&m?r(e,s,{configurable:!0,enumerable:!0,writable:!0,value:void 0}):e[s]=void 0,a.setup(e,s)):(l[s]=void 0,null==a?(f=u,n&&m?(c.values[s]=u,r(e,s,{configurable:!0,enumerable:!0,set:i,get:o(s)})):e[s]=u):(f=a,r(e,s,a))),m&&Ember.overrideChains(e,s,c),e.didDefineProperty&&e.didDefineProperty(e,s,f),this}}(),function(){var e=Ember.changeProperties,t=Ember.set;Ember.setProperties=function(r,n){return e(function(){for(var e in n)n.hasOwnProperty(e)&&t(r,e,n[e])}),r}}(),function(){var e=Ember.meta,t=Ember.typeOf,r=Ember.ENV.MANDATORY_SETTER,n=Ember.platform.defineProperty;Ember.watchKey=function(i,o){if("length"!==o||"array"!==t(i)){var s,a=e(i),u=a.watching;u[o]?u[o]=(u[o]||0)+1:(u[o]=1,s=a.descs[o],s&&s.willWatch&&s.willWatch(i,o),"function"==typeof i.willWatchProperty&&i.willWatchProperty(o),r&&o in i&&(a.values[o]=i[o],n(i,o,{configurable:!0,enumerable:!0,set:Ember.MANDATORY_SETTER_FUNCTION,get:Ember.DEFAULT_GETTER_FUNCTION(o)})))}},Ember.unwatchKey=function(t,i){var o,s=e(t),a=s.watching;1===a[i]?(a[i]=0,o=s.descs[i],o&&o.didUnwatch&&o.didUnwatch(t,i),"function"==typeof t.didUnwatchProperty&&t.didUnwatchProperty(i),r&&i in t&&(n(t,i,{configurable:!0,enumerable:!0,writable:!0,value:s.values[i]}),delete s.values[i])):a[i]>1&&a[i]--}}(),function(){function e(e){return e.match(m)[0]}function t(e,t,r){if(e&&"object"==typeof e){var i=n(e),o=i.chainWatchers;i.hasOwnProperty("chainWatchers")||(o=i.chainWatchers={}),o[t]||(o[t]=[]),o[t].push(r),u(e,t)}}function r(e){return n(e,!1).proto===e}var n=Ember.meta,i=Ember.get,o=Ember.normalizeTuple,s=Ember.ArrayPolyfills.forEach,a=Ember.warn,u=Ember.watchKey,c=Ember.unwatchKey,l=Ember.propertyWillChange,h=Ember.propertyDidChange,m=/^([^\.\*]+)/,f=[];Ember.flushPendingChains=function(){if(0!==f.length){var e=f;f=[],s.call(e,function(e){e[0].add(e[1])}),a("Watching an undefined global, Ember expects watched globals to be setup by the time the run loop is flushed, check for typos",0===f.length)}};var p=Ember.removeChainWatcher=function(e,t,r){if(e&&"object"==typeof e){var i=n(e,!1);if(i.hasOwnProperty("chainWatchers")){var o=i.chainWatchers;if(o[t]){o=o[t];for(var s=0,a=o.length;a>s;s++)o[s]===r&&o.splice(s,1)}c(e,t)}}},d=Ember._ChainNode=function(e,r,n){this._parent=e,this._key=r,this._watching=void 0===n,this._value=n,this._paths={},this._watching&&(this._object=e.value(),this._object&&t(this._object,this._key,this)),this._parent&&"@each"===this._parent._key&&this.value()},b=d.prototype;b.value=function(){if(void 0===this._value&&this._watching){var e=this._parent.value();this._value=e&&!r(e)?i(e,this._key):void 0}return this._value},b.destroy=function(){if(this._watching){var e=this._object;e&&p(e,this._key,this),this._watching=!1}},b.copy=function(e){var t,r=new d(null,null,e),n=this._paths;for(t in n)0>=n[t]||r.add(t);return r},b.add=function(t){var r,n,i,s,a;if(a=this._paths,a[t]=(a[t]||0)+1,r=this.value(),n=o(r,t),n[0]&&n[0]===r)t=n[1],i=e(t),t=t.slice(i.length+1);else{if(!n[0])return f.push([this,t]),n.length=0,void 0;s=n[0],i=t.slice(0,0-(n[1].length+1)),t=n[1]}n.length=0,this.chain(i,t,s)},b.remove=function(t){var r,n,i,s,a;a=this._paths,a[t]>0&&a[t]--,r=this.value(),n=o(r,t),n[0]===r?(t=n[1],i=e(t),t=t.slice(i.length+1)):(s=n[0],i=t.slice(0,0-(n[1].length+1)),t=n[1]),n.length=0,this.unchain(i,t)},b.count=0,b.chain=function(t,r,n){var i,o=this._chains;o||(o=this._chains={}),i=o[t],i||(i=o[t]=new d(this,t,n)),i.count++,r&&r.length>0&&(t=e(r),r=r.slice(t.length+1),i.chain(t,r))},b.unchain=function(t,r){var n=this._chains,i=n[t];r&&r.length>1&&(t=e(r),r=r.slice(t.length+1),i.unchain(t,r)),i.count--,0>=i.count&&(delete n[i._key],i.destroy())},b.willChange=function(){var e=this._chains;if(e)for(var t in e)e.hasOwnProperty(t)&&e[t].willChange();this._parent&&this._parent.chainWillChange(this,this._key,1)},b.chainWillChange=function(e,t,r){this._key&&(t=this._key+"."+t),this._parent?this._parent.chainWillChange(this,t,r+1):(r>1&&l(this.value(),t),t="this."+t,this._paths[t]>0&&l(this.value(),t))},b.chainDidChange=function(e,t,r){this._key&&(t=this._key+"."+t),this._parent?this._parent.chainDidChange(this,t,r+1):(r>1&&h(this.value(),t),t="this."+t,this._paths[t]>0&&h(this.value(),t))},b.didChange=function(e){if(this._watching){var r=this._parent.value();r!==this._object&&(p(this._object,this._key,this),this._object=r,t(r,this._key,this)),this._value=void 0,this._parent&&"@each"===this._parent._key&&this.value()}var n=this._chains;if(n)for(var i in n)n.hasOwnProperty(i)&&n[i].didChange(e);e||this._parent&&this._parent.chainDidChange(this,this._key,1)},Ember.finishChains=function(e){var t=n(e,!1),r=t.chains;r&&(r.value()!==e&&(t.chains=r=r.copy(e)),r.didChange(!0))}}(),function(){function e(e){var r=t(e),i=r.chains;return i?i.value()!==e&&(i=r.chains=i.copy(e)):i=r.chains=new n(null,null,e),i}var t=Ember.meta,r=Ember.typeOf,n=Ember._ChainNode;Ember.watchPath=function(n,i){if("length"!==i||"array"!==r(n)){var o=t(n),s=o.watching;s[i]?s[i]=(s[i]||0)+1:(s[i]=1,e(n).add(i))}},Ember.unwatchPath=function(r,n){var i=t(r),o=i.watching;1===o[n]?(o[n]=0,e(r).remove(n)):o[n]>1&&o[n]--}}(),function(){function e(e){return"*"===e||!h.test(e)}var t=Ember.meta,r=Ember.GUID_KEY,n=Ember.META_KEY,i=Ember.removeChainWatcher,o=Ember.watchKey,s=Ember.unwatchKey,a=Ember.watchPath,u=Ember.unwatchPath,c=Ember.typeOf,l=Ember.generateGuid,h=/[\.\*]/;Ember.watch=function(t,r){("length"!==r||"array"!==c(t))&&(e(r)?o(t,r):a(t,r))},Ember.isWatching=function(e,t){var r=e[n];return(r&&r.watching[t])>0},Ember.watch.flushPending=Ember.flushPendingChains,Ember.unwatch=function(t,r){("length"!==r||"array"!==c(t))&&(e(r)?s(t,r):u(t,r))},Ember.rewatch=function(e){var n=t(e,!1),i=n.chains;r in e&&!e.hasOwnProperty(r)&&l(e,"ember"),i&&i.value()!==e&&(n.chains=i.copy(e))};var m=[];Ember.destroy=function(e){var t,r,o,s,a=e[n];if(a&&(e[n]=null,t=a.chains))for(m.push(t);m.length>0;){if(t=m.pop(),r=t._chains)for(o in r)r.hasOwnProperty(o)&&m.push(r[o]);t._watching&&(s=t._object,s&&i(s,t._key,t))}}}(),function(){function e(e,t){var r=e[t];return r?e.hasOwnProperty(t)||(r=e[t]=m(r)):r=e[t]={},r}function t(t){return e(t,"deps")}function r(r,n,i,o){var s,a,u,c,l,h=r._dependentKeys;if(h)for(s=t(o),a=0,u=h.length;u>a;a++)c=h[a],l=e(s,c),l[i]=(l[i]||0)+1,p(n,c)}function n(r,n,i,o){var s,a,u,c,l,h=r._dependentKeys;if(h)for(s=t(o),a=0,u=h.length;u>a;a++)c=h[a],l=e(s,c),l[i]=(l[i]||0)-1,d(n,c)}function i(e,t){this.func=e,this._cacheable=t&&void 0!==t.cacheable?t.cacheable:!0,this._dependentKeys=t&&t.dependentKeys,this._readOnly=t&&(void 0!==t.readOnly||!!t.readOnly)}function o(e,t){for(var r={},n=0;t.length>n;n++)r[t[n]]=u(e,t[n]);return r}function s(e,t){Ember.computed[e]=function(e){var r=h.call(arguments);return Ember.computed(e,function(){return t.apply(this,r)})}}function a(e,t){Ember.computed[e]=function(){var e=h.call(arguments),r=Ember.computed(function(){return t.apply(this,[o(this,e)])});return r.property.apply(r,e)}}var u=Ember.get,c=Ember.set,l=Ember.meta,h=[].slice,m=Ember.create,f=Ember.META_KEY,p=Ember.watch,d=Ember.unwatch;Ember.ComputedProperty=i,i.prototype=new Ember.Descriptor;var b=i.prototype;b.cacheable=function(e){return this._cacheable=e!==!1,this},b.volatile=function(){return this.cacheable(!1)},b.readOnly=function(e){return this._readOnly=void 0===e||!!e,this},b.property=function(){for(var e=[],t=0,r=arguments.length;r>t;t++)e.push(arguments[t]);return this._dependentKeys=e,this},b.meta=function(e){return 0===arguments.length?this._meta||{}:(this._meta=e,this)},b.willWatch=function(e,t){var n=e[f];t in n.cache||r(this,e,t,n)},b.didUnwatch=function(e,t){var r=e[f];t in r.cache||n(this,e,t,r)},b.didChange=function(e,t){if(this._cacheable&&this._suspended!==e){var r=l(e);t in r.cache&&(delete r.cache[t],r.watching[t]||n(this,e,t,r))}},b.get=function(e,t){var n,i,o;if(this._cacheable){if(o=l(e),i=o.cache,t in i)return i[t];n=i[t]=this.func.call(e,t),o.watching[t]||r(this,e,t,o)}else n=this.func.call(e,t);return n},b.set=function(e,t,n){var i,o,s=this._cacheable,a=this.func,u=l(e,s),c=u.watching[t],h=this._suspended,m=!1,f=u.cache;if(this._readOnly)throw new Error("Cannot Set: "+t+" on: "+e.toString());this._suspended=e;try{if(s&&f.hasOwnProperty(t)&&(i=f[t],m=!0),a.wrappedFunction&&(a=a.wrappedFunction),3===a.length)o=a.call(e,t,n,i);else{if(2!==a.length)return Ember.defineProperty(e,t,null,i),Ember.set(e,t,n),void 0;o=a.call(e,t,n)}if(m&&i===o)return;c&&Ember.propertyWillChange(e,t),m&&delete f[t],s&&(c||m||r(this,e,t,u),f[t]=o),c&&Ember.propertyDidChange(e,t)}finally{this._suspended=h}return o},b.setup=function(e,t){var n=e[f];n&&n.watching[t]&&r(this,e,t,l(e))},b.teardown=function(e,t){var r=l(e);return(r.watching[t]||t in r.cache)&&n(this,e,t,r),this._cacheable&&delete r.cache[t],null},Ember.computed=function(e){var t;if(arguments.length>1&&(t=h.call(arguments,0,-1),e=h.call(arguments,-1)[0]),"function"!=typeof e)throw new Error("Computed Property declared without a property function");var r=new i(e);return t&&r.property.apply(r,t),r},Ember.cacheFor=function(e,t){var r=l(e,!1).cache;return r&&t in r?r[t]:void 0},s("empty",function(e){return Ember.isEmpty(u(this,e))}),s("notEmpty",function(e){return!Ember.isEmpty(u(this,e))}),s("none",function(e){return Ember.isNone(u(this,e))}),s("not",function(e){return!u(this,e)}),s("bool",function(e){return!!u(this,e)}),s("match",function(e,t){var r=u(this,e);return"string"==typeof r?!!r.match(t):!1}),s("equal",function(e,t){return u(this,e)===t}),s("gt",function(e,t){return u(this,e)>t}),s("gte",function(e,t){return u(this,e)>=t}),s("lt",function(e,t){return t>u(this,e)}),s("lte",function(e,t){return t>=u(this,e)}),a("and",function(e){for(var t in e)if(e.hasOwnProperty(t)&&!e[t])return!1;return!0}),a("or",function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!0;return!1}),a("any",function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return e[t];return null}),a("map",function(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&(Ember.isNone(e[r])?t.push(null):t.push(e[r]));return t}),Ember.computed.alias=function(e){return Ember.computed(e,function(t,r){return arguments.length>1?(c(this,e,r),r):u(this,e)})},Ember.computed.defaultTo=function(e){return Ember.computed(function(t,r,n){return 1===arguments.length?null!=n?n:u(this,e):null!=r?r:u(this,e)})}}(),function(){function e(e){return e+r}function t(e){return e+n}var r=":change",n=":before";Ember.guidFor,Ember.addObserver=function(t,r,n,i){return Ember.addListener(t,e(r),n,i),Ember.watch(t,r),this},Ember.observersFor=function(t,r){return Ember.listenersFor(t,e(r))},Ember.removeObserver=function(t,r,n,i){return Ember.unwatch(t,r),Ember.removeListener(t,e(r),n,i),this},Ember.addBeforeObserver=function(e,r,n,i){return Ember.addListener(e,t(r),n,i),Ember.watch(e,r),this},Ember._suspendBeforeObserver=function(e,r,n,i,o){return Ember._suspendListener(e,t(r),n,i,o)},Ember._suspendObserver=function(t,r,n,i,o){return Ember._suspendListener(t,e(r),n,i,o)};var i=Ember.ArrayPolyfills.map;Ember._suspendBeforeObservers=function(e,r,n,o,s){var a=i.call(r,t);return Ember._suspendListeners(e,a,n,o,s)},Ember._suspendObservers=function(t,r,n,o,s){var a=i.call(r,e);return Ember._suspendListeners(t,a,n,o,s)},Ember.beforeObserversFor=function(e,r){return Ember.listenersFor(e,t(r))},Ember.removeBeforeObserver=function(e,r,n,i){return Ember.unwatch(e,r),Ember.removeListener(e,t(r),n,i),this}}(),function(){e("backburner",["backburner/deferred_action_queues","exports"],function(e,t){"use strict";function r(e,t){this.queueNames=e,this.options=t||{}}function n(e){e.begin(),o=setTimeout(function(){e.end()})}function i(e){var t,r,n,o,u=+new Date;e.run(function(){for(n=0,o=m.length;o>n&&(t=m[n],!(t>u));n+=2);for(r=m.splice(0,n),n=1,o=r.length;o>n;n+=2)e.schedule(e.queueNames[0],null,r[n])}),m.length&&(s=setTimeout(function(){i(e)},m[0]-u),a=m[0])}var o,s,a,u=e.DeferredActionQueues,c=[].slice,l=[].pop,h=[],m=[];r.prototype={queueNames:null,options:null,currentInstance:null,previousInstance:null,begin:function(){this.currentInstance&&(this.previousInstance=this.currentInstance),this.currentInstance=new u(this.queueNames,this.options)},end:function(){try{this.currentInstance.flush()}finally{this.currentInstance=null,this.previousInstance&&(this.currentInstance=this.previousInstance,this.previousInstance=null)}},run:function(e,t){var r;this.begin(),t||(t=e,e=null),"string"==typeof t&&(t=e[t]);var n=!1;try{r=arguments.length>2?t.apply(e,c.call(arguments,2)):t.call(e)}finally{n||(n=!0,this.end())}return r},defer:function(e,t,r){r||(r=t,t=null),"string"==typeof r&&(r=t[r]);var i=(new Error).stack,o=arguments.length>3?c.call(arguments,3):void 0;return this.currentInstance||n(this),this.currentInstance.schedule(e,t,r,o,!1,i)},deferOnce:function(e,t,r){r||(r=t,t=null),"string"==typeof r&&(r=t[r]);
var i=(new Error).stack,o=arguments.length>3?c.call(arguments,3):void 0;return this.currentInstance||n(this),this.currentInstance.schedule(e,t,r,o,!0,i)},setTimeout:function(){var e=this,t=l.call(arguments),r=arguments[0],n=arguments[1],o=+new Date+t;n||(n=r,r=null),"string"==typeof n&&(n=r[n]);var u,h;arguments.length>2?(h=c.call(arguments,2),u=function(){n.apply(r,h)}):u=function(){n.call(r)};var f,p;for(f=0,p=m.length;p>f&&!(m[f]>o);f+=2);return m.splice(f,0,o,u),s&&o>a?u:(s&&(clearTimeout(s),s=null),s=setTimeout(function(){i(e),s=null,a=null},t),a=o,u)},debounce:function(e,t){for(var r,n=this,i=arguments,o=l.call(i),s=0,a=h.length;a>s;s++)if(r=h[s],r[0]===e&&r[1]===t)return;var u=setTimeout(function(){n.run.apply(n,i);for(var o=-1,s=0,a=h.length;a>s;s++)if(r=h[s],r[0]===e&&r[1]===t){o=s;break}o>-1&&h.splice(o,1)},o);h.push([e,t,u])},cancelTimers:function(){for(var e=0,t=h.length;t>e;e++)clearTimeout(h[e][2]);h=[],s&&(clearTimeout(s),s=null),m=[],o&&clearTimeout(o)},hasTimers:function(){return!!m.length&&!o},cancel:function(e){if("object"==typeof e&&e.queue&&e.method)return e.queue.cancel(e);if("function"==typeof e)for(var t=0,r=m.length;r>t;t+=2)if(m[t+1]===e)return m.splice(t,2),!0}},r.prototype.schedule=r.prototype.defer,r.prototype.scheduleOnce=r.prototype.deferOnce,r.prototype.later=r.prototype.setTimeout,t.Backburner=r}),e("backburner/deferred_action_queues",["backburner/queue","exports"],function(e,t){"use strict";function r(e,t){var r=this.queues={};this.queueNames=e=e||[];for(var n,o=0,s=e.length;s>o;o++)n=e[o],r[n]=new i(this,n,t[n])}function n(e,t){for(var r,n,i=0,o=t;o>=i;i++)if(r=e.queueNames[i],n=e.queues[r],n._queue.length)return i;return-1}var i=e.Queue;r.prototype={queueNames:null,queues:null,schedule:function(e,t,r,n,i,o){var s=this.queues,a=s[e];if(!a)throw new Error("You attempted to schedule an action in a queue ("+e+") that doesn't exist");return i?a.pushUnique(t,r,n,o):a.push(t,r,n,o)},flush:function(){for(var e,t,r,i,o=this.queues,s=this.queueNames,a=0,u=s.length;u>a;){e=s[a],t=o[e],r=t._queue.slice(),t._queue=[];var c,l,h,m=t.options,f=m&&m.before,p=m&&m.after,d=0,b=r.length;for(b&&f&&f();b>d;)c=r[d],l=r[d+1],h=r[d+2],"string"==typeof l&&(l=c[l]),h&&h.length>0?l.apply(c,h):l.call(c),d+=4;b&&p&&p(),-1===(i=n(this,a))?a++:a=i}}},t.DeferredActionQueues=r}),e("backburner/queue",["exports"],function(e){"use strict";function t(e,t,r){this.daq=e,this.name=t,this.options=r,this._queue=[]}t.prototype={daq:null,name:null,options:null,_queue:null,push:function(e,t,r,n){var i=this._queue;return i.push(e,t,r,n),{queue:this,target:e,method:t}},pushUnique:function(e,t,r,n){for(var i,o,s=this._queue,a=0,u=s.length;u>a;a+=4)if(i=s[a],o=s[a+1],i===e&&o===t)return s[a+2]=r,s[a+3]=n,{queue:this,target:e,method:t};return this._queue.push(e,t,r,n),{queue:this,target:e,method:t}},flush:function(){var e,t,r,n,i=this._queue,o=this.options,s=o&&o.before,a=o&&o.after,u=i.length;for(u&&s&&s(),n=0;u>n;n+=4)e=i[n],t=i[n+1],r=i[n+2],t.apply(e,r);u&&a&&a(),i.length>u?(this._queue=i.slice(u),this.flush()):this._queue.length=0},cancel:function(e){var t,r,n,i,o=this._queue;for(n=0,i=o.length;i>n;n+=4)if(t=o[n],r=o[n+1],t===e.target&&r===e.method)return o.splice(n,4),!0}},e.Queue=t})}(),function(){var e=t("backburner").Backburner,r=new e(["sync","actions","destroy"],{sync:{before:Ember.beginPropertyChanges,after:Ember.endPropertyChanges}}),n=[].slice;Ember.run=function(){var e;try{e=r.run.apply(r,arguments)}catch(t){if(!Ember.onerror)throw t;Ember.onerror(t)}return e},Ember.run.backburner=r,Ember.run,Ember.run.begin=function(){r.begin()},Ember.run.end=function(){r.end()},Ember.run.schedule=function(){r.schedule.apply(r,arguments)},Ember.run.hasScheduledTimers=function(){return r.hasTimers()},Ember.run.cancelTimers=function(){r.cancelTimers()},Ember.run.sync=function(){r.currentInstance.queues.sync.flush()},Ember.run.later=function(){return r.later.apply(r,arguments)},Ember.run.once=function(){var e=n.call(arguments);return e.unshift("actions"),r.scheduleOnce.apply(r,e)},Ember.run.scheduleOnce=function(){return r.scheduleOnce.apply(r,arguments)},Ember.run.next=function(){var e=n.call(arguments);return e.push(1),r.later.apply(r,e)},Ember.run.cancel=function(e){return r.cancel(e)}}(),function(){function e(e,t){return r(o(t)?Ember.lookup:e,t)}function t(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}Ember.LOG_BINDINGS=!1||!!Ember.ENV.LOG_BINDINGS;var r=Ember.get,n=(Ember.set,Ember.guidFor),i=/^([A-Z$]|([0-9][A-Z$]))/,o=Ember.isGlobalPath=function(e){return i.test(e)},s=function(e,t){this._direction="fwd",this._from=t,this._to=e,this._directionMap=Ember.Map.create()};s.prototype={copy:function(){var e=new s(this._to,this._from);return this._oneWay&&(e._oneWay=!0),e},from:function(e){return this._from=e,this},to:function(e){return this._to=e,this},oneWay:function(){return this._oneWay=!0,this},toString:function(){var e=this._oneWay?"[oneWay]":"";return"Ember.Binding<"+n(this)+">("+this._from+" -> "+this._to+")"+e},connect:function(t){var r=this._from,n=this._to;return Ember.trySet(t,n,e(t,r)),Ember.addObserver(t,r,this,this.fromDidChange),this._oneWay||Ember.addObserver(t,n,this,this.toDidChange),this._readyToSync=!0,this},disconnect:function(e){var t=!this._oneWay;return Ember.removeObserver(e,this._from,this,this.fromDidChange),t&&Ember.removeObserver(e,this._to,this,this.toDidChange),this._readyToSync=!1,this},fromDidChange:function(e){this._scheduleSync(e,"fwd")},toDidChange:function(e){this._scheduleSync(e,"back")},_scheduleSync:function(e,t){var r=this._directionMap,n=r.get(e);n||(Ember.run.schedule("sync",this,this._sync,e),r.set(e,t)),"back"===n&&"fwd"===t&&r.set(e,"fwd")},_sync:function(t){var n=Ember.LOG_BINDINGS;if(!t.isDestroyed&&this._readyToSync){var i=this._directionMap,o=i.get(t),s=this._from,a=this._to;if(i.remove(t),"fwd"===o){var u=e(t,this._from);n&&Ember.Logger.log(" ",this.toString(),"->",u,t),this._oneWay?Ember.trySet(t,a,u):Ember._suspendObserver(t,a,this,this.toDidChange,function(){Ember.trySet(t,a,u)})}else if("back"===o){var c=r(t,this._to);n&&Ember.Logger.log(" ",this.toString(),"<-",c,t),Ember._suspendObserver(t,s,this,this.fromDidChange,function(){Ember.trySet(Ember.isGlobalPath(s)?Ember.lookup:t,s,c)})}}}},t(s,{from:function(){var e=this,t=new e;return t.from.apply(t,arguments)},to:function(){var e=this,t=new e;return t.to.apply(t,arguments)},oneWay:function(e,t){var r=this,n=new r(null,e);return n.oneWay(t)}}),Ember.Binding=s,Ember.bind=function(e,t,r){return new Ember.Binding(t,r).connect(e)},Ember.oneWay=function(e,t,r){return new Ember.Binding(t,r).oneWay().connect(e)}}(),function(){function e(e){var t=Ember.meta(e,!0),r=t.mixins;return r?t.hasOwnProperty("mixins")||(r=t.mixins=x(r)):r=t.mixins={},r}function t(e,t){return t&&t.length>0&&(e.mixins=_.call(t,function(e){if(e instanceof g)return e;var t=new g;return t.properties=e,t})),e}function r(e){return"function"==typeof e&&e.isMethod!==!1&&e!==Boolean&&e!==Object&&e!==Number&&e!==Array&&e!==Date&&e!==String}function n(e,t){var r;return t instanceof g?(r=P(t),e[r]?V:(e[r]=t,t.properties)):t}function i(e,t,r){var n;return n=t.concatenatedProperties||r.concatenatedProperties,e.concatenatedProperties&&(n=n?n.concat(e.concatenatedProperties):e.concatenatedProperties),n}function o(e,t,r,n,i){var o;return void 0===n[t]&&(o=i[t]),o=o||e.descs[t],o&&o instanceof Ember.ComputedProperty?(r=x(r),r.func=Ember.wrap(r.func,o.func),r):r}function s(e,t,r,n,i){var o;return void 0===i[t]&&(o=n[t]),o=o||e[t],"function"!=typeof o?r:Ember.wrap(r,o)}function a(e,t,r,n){var i=n[t]||e[t];return i?"function"==typeof i.concat?i.concat(r):Ember.makeArray(i).concat(r):Ember.makeArray(r)}function u(e,t,n,i,u,c,l){if(n instanceof Ember.Descriptor){if(n===y&&u[t])return V;n.func&&(n=o(i,t,n,c,u)),u[t]=n,c[t]=void 0}else r(n)?n=s(e,t,n,c,u):(l&&C.call(l,t)>=0||"concatenatedProperties"===t)&&(n=a(e,t,n,c)),u[t]=void 0,c[t]=n}function c(e,t,r,o,s,a){function l(e){delete r[e],delete o[e]}for(var h,m,f,p,d,b=0,E=e.length;E>b;b++)if(h=e[b],m=n(t,h),m!==V)if(m){d=Ember.meta(s),p=i(m,o,s);for(f in m)m.hasOwnProperty(f)&&(a.push(f),u(s,f,m[f],d,r,o,p));m.hasOwnProperty("toString")&&(s.toString=m.toString)}else h.mixins&&(c(h.mixins,t,r,o,s,a),h._without&&O.call(h._without,l))}function l(e,t,r,n){if(T.test(t)){var i=n.bindings;i?n.hasOwnProperty("bindings")||(i=n.bindings=x(n.bindings)):i=n.bindings={},i[t]=r}}function h(e,t){var r,n,i,o=t.bindings;if(o){for(r in o)n=o[r],n&&(i=r.slice(0,-7),n instanceof Ember.Binding?(n=n.copy(),n.to(i)):n=new Ember.Binding(i,n),n.connect(e),e[r]=n);t.bindings={}}}function m(e,t){return h(e,t||Ember.meta(e)),e}function f(e,t,r,n,i){var o,s=t.methodName;return n[s]||i[s]?(o=i[s],t=n[s]):r.descs[s]?(t=r.descs[s],o=void 0):(t=void 0,o=e[s]),{desc:t,value:o}}function p(e,t,r,n,i){if("function"==typeof r){var o=r[n];if(o)for(var s=0,a=o.length;a>s;s++)Ember[i](e,o[s],null,t)}}function d(e,t,r){var n=e[t];p(e,t,n,"__ember_observesBefore__","removeBeforeObserver"),p(e,t,n,"__ember_observes__","removeObserver"),p(e,t,r,"__ember_observesBefore__","addBeforeObserver"),p(e,t,r,"__ember_observes__","addObserver")}function b(t,r,n){var i,o,s,a={},u={},h=Ember.meta(t),p=[];c(r,e(t),a,u,t,p);for(var b=0,E=p.length;E>b;b++)if(i=p[b],"constructor"!==i&&u.hasOwnProperty(i)&&(s=a[i],o=u[i],s!==y)){for(;s&&s instanceof w;){var v=f(t,s,h,a,u);s=v.desc,o=v.value}(void 0!==s||void 0!==o)&&(d(t,i,o),l(t,i,o,h),A(t,i,s,o,h))}return n||m(t,h),t}function E(e,t,r){var n=P(e);if(r[n])return!1;if(r[n]=!0,e===t)return!0;for(var i=e.mixins,o=i?i.length:0;--o>=0;)if(E(i[o],t,r))return!0;return!1}function v(e,t,r){if(!r[P(t)])if(r[P(t)]=!0,t.properties){var n=t.properties;for(var i in n)n.hasOwnProperty(i)&&(e[i]=!0)}else t.mixins&&O.call(t.mixins,function(t){v(e,t,r)})}var g,y,w,_=Ember.ArrayPolyfills.map,C=Ember.ArrayPolyfills.indexOf,O=Ember.ArrayPolyfills.forEach,S=[].slice,x=Ember.create,A=Ember.defineProperty,P=Ember.guidFor,V={},T=Ember.IS_BINDING=/^.+Binding$/;Ember.mixin=function(e){var t=S.call(arguments,1);return b(e,t,!1),e},Ember.Mixin=function(){return t(this,arguments)},g=Ember.Mixin,g.prototype={properties:null,mixins:null,ownerConstructor:null},g._apply=b,g.applyPartial=function(e){var t=S.call(arguments,1);return b(e,t,!0)},g.finishPartial=m,Ember.anyUnprocessedMixins=!1,g.create=function(){Ember.anyUnprocessedMixins=!0;var e=this;return t(new e,arguments)};var D=g.prototype;D.reopen=function(){var e,t;this.properties?(e=g.create(),e.properties=this.properties,delete this.properties,this.mixins=[e]):this.mixins||(this.mixins=[]);var r,n=arguments.length,i=this.mixins;for(r=0;n>r;r++)e=arguments[r],e instanceof g?i.push(e):(t=g.create(),t.properties=e,i.push(t));return this},D.apply=function(e){return b(e,[this],!1)},D.applyPartial=function(e){return b(e,[this],!0)},D.detect=function(e){if(!e)return!1;if(e instanceof g)return E(e,this,{});var t=Ember.meta(e,!1).mixins;return t?!!t[P(this)]:!1},D.without=function(){var e=new g(this);return e._without=S.call(arguments),e},D.keys=function(){var e={},t={},r=[];v(e,this,t);for(var n in e)e.hasOwnProperty(n)&&r.push(n);return r},g.mixins=function(e){var t=Ember.meta(e,!1).mixins,r=[];if(!t)return r;for(var n in t){var i=t[n];i.properties||r.push(i)}return r},y=new Ember.Descriptor,y.toString=function(){return"(Required Property)"},Ember.required=function(){return y},w=function(e){this.methodName=e},w.prototype=new Ember.Descriptor,Ember.alias=function(e){return new w(e)},Ember.alias=Ember.deprecateFunc("Ember.alias is deprecated. Please use Ember.aliasMethod or Ember.computed.alias instead.",Ember.alias),Ember.aliasMethod=function(e){return new w(e)},Ember.observer=function(e){var t=S.call(arguments,1);return e.__ember_observes__=t,e},Ember.immediateObserver=function(){for(var e=0,t=arguments.length;t>e;e++)arguments[e];return Ember.observer.apply(this,arguments)},Ember.beforeObserver=function(e){var t=S.call(arguments,1);return e.__ember_observesBefore__=t,e}}(),function(){e("rsvp/all",["rsvp/defer","exports"],function(e,t){"use strict";function r(e){var t=[],r=n(),i=e.length;0===i&&r.resolve([]);for(var o=function(e){return function(t){s(e,t)}},s=function(e,n){t[e]=n,0===--i&&r.resolve(t)},a=function(e){r.reject(e)},u=0;e.length>u;u++)e[u]&&"function"==typeof e[u].then?e[u].then(o(u),a):s(u,e[u]);return r.promise}var n=e.defer;t.all=r}),e("rsvp/async",["exports"],function(e){"use strict";var t,r="undefined"!=typeof window?window:{},n=r.MutationObserver||r.WebKitMutationObserver;if("undefined"!=typeof process&&"[object process]"==={}.toString.call(process))t=function(e,t){process.nextTick(function(){e.call(t)})};else if(n){var i=[],o=new n(function(){var e=i.slice();i=[],e.forEach(function(e){var t=e[0],r=e[1];t.call(r)})}),s=document.createElement("div");o.observe(s,{attributes:!0}),window.addEventListener("unload",function(){o.disconnect(),o=null}),t=function(e,t){i.push([e,t]),s.setAttribute("drainQueue","drainQueue")}}else t=function(e,t){setTimeout(function(){e.call(t)},1)};e.async=t}),e("rsvp/config",["rsvp/async","exports"],function(e,t){"use strict";var r=e.async,n={};n.async=r,t.config=n}),e("rsvp/defer",["rsvp/promise","exports"],function(e,t){"use strict";function r(){var e={},t=new n(function(t,r){e.resolve=t,e.reject=r});return e.promise=t,e}var n=e.Promise;t.defer=r}),e("rsvp/events",["exports"],function(e){"use strict";var t=function(e,t){this.type=e;for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])},r=function(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r][0]===t)return r;return-1},n=function(e){var t=e._promiseCallbacks;return t||(t=e._promiseCallbacks={}),t},i={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e},on:function(e,t,i){var o,s,a=n(this);for(e=e.split(/\s+/),i=i||this;s=e.shift();)o=a[s],o||(o=a[s]=[]),-1===r(o,t)&&o.push([t,i])},off:function(e,t){var i,o,s,a=n(this);for(e=e.split(/\s+/);o=e.shift();)t?(i=a[o],s=r(i,t),-1!==s&&i.splice(s,1)):a[o]=[]},trigger:function(e,r){var i,o,s,a,u,c=n(this);if(i=c[e])for(var l=0;i.length>l;l++)o=i[l],s=o[0],a=o[1],"object"!=typeof r&&(r={detail:r}),u=new t(e,r),s.call(a,u)}};e.EventTarget=i}),e("rsvp/hash",["rsvp/defer","exports"],function(e,t){"use strict";function r(e){var t=0;for(var r in e)t++;return t}function n(e){var t={},n=i(),o=r(e);0===o&&n.resolve({});var s=function(e){return function(t){a(e,t)}},a=function(e,r){t[e]=r,0===--o&&n.resolve(t)},u=function(e){n.reject(e)};for(var c in e)e[c]&&"function"==typeof e[c].then?e[c].then(s(c),u):a(c,e[c]);return n.promise}var i=e.defer;t.hash=n}),e("rsvp/node",["rsvp/promise","rsvp/all","exports"],function(e,t,r){"use strict";function n(e,t){return function(r,n){r?t(r):arguments.length>2?e(Array.prototype.slice.call(arguments,1)):e(n)}}function i(e){return function(){var t,r,i=Array.prototype.slice.call(arguments),a=new o(function(e,n){t=e,r=n});return s(i).then(function(i){i.push(n(t,r));try{e.apply(this,i)}catch(o){r(o)}}),a}}var o=e.Promise,s=t.all;r.denodeify=i}),e("rsvp/promise",["rsvp/config","rsvp/events","exports"],function(e,t,r){"use strict";function n(e){return i(e)||"object"==typeof e&&null!==e}function i(e){return"function"==typeof e}function o(e,t){e===t?a(e,t):s(e,t)||a(e,t)}function s(e,t){var r=null;if(n(t)){try{r=t.then}catch(s){return u(e,s),!0}if(i(r)){try{r.call(t,function(r){t!==r?o(e,r):a(e,r)},function(t){u(e,t)})}catch(s){u(e,s)}return!0}}return!1}function a(e,t){c.async(function(){e.trigger("promise:resolved",{detail:t}),e.isFulfilled=!0,e.fulfillmentValue=t})}function u(e,t){c.async(function(){e.trigger("promise:failed",{detail:t}),e.isRejected=!0,e.rejectedReason=t})}var c=e.config,l=t.EventTarget,h=function(e){var t=this,r=!1;if("function"!=typeof e)throw new TypeError("You must pass a resolver function as the sole argument to the promise constructor");if(!(t instanceof h))return new h(e);var n=function(e){r||(r=!0,o(t,e))},i=function(e){r||(r=!0,u(t,e))};this.on("promise:resolved",function(e){this.trigger("success",{detail:e.detail})},this),this.on("promise:failed",function(e){this.trigger("error",{detail:e.detail})},this);try{e(n,i)}catch(s){i(s)}},m=function(e,t,r,n){var a,c,l,h,m=i(r);if(m)try{a=r(n.detail),l=!0}catch(f){h=!0,c=f}else a=n.detail,l=!0;s(t,a)||(m&&l?o(t,a):h?u(t,c):"resolve"===e?o(t,a):"reject"===e&&u(t,a))};h.prototype={constructor:h,then:function(e,t){var r=new h(function(){});return this.isFulfilled&&c.async(function(){m("resolve",r,e,{detail:this.fulfillmentValue})},this),this.isRejected&&c.async(function(){m("reject",r,t,{detail:this.rejectedReason})},this),this.on("promise:resolved",function(t){m("resolve",r,e,t)}),this.on("promise:failed",function(e){m("reject",r,t,e)}),r}},l.mixin(h.prototype),r.Promise=h}),e("rsvp/reject",["rsvp/promise","exports"],function(e,t){"use strict";function r(e){return new n(function(t,r){r(e)})}var n=e.Promise;t.reject=r}),e("rsvp/resolve",["rsvp/promise","exports"],function(e,t){"use strict";function r(e){return"function"==typeof e||"object"==typeof e&&null!==e}function n(e){var t=new i(function(t,n){var i;try{r(e)?(i=e.then,"function"==typeof i?i.call(e,t,n):t(e)):t(e)}catch(o){n(o)}});return t}var i=e.Promise;t.resolve=n}),e("rsvp",["rsvp/events","rsvp/promise","rsvp/node","rsvp/all","rsvp/hash","rsvp/defer","rsvp/config","rsvp/resolve","rsvp/reject","exports"],function(e,t,r,n,i,o,s,a,u,c){"use strict";function l(e,t){E[e]=t}var h=e.EventTarget,m=t.Promise,f=r.denodeify,p=n.all,d=i.hash,b=o.defer,E=s.config,v=a.resolve,g=u.reject;c.Promise=m,c.EventTarget=h,c.all=p,c.hash=d,c.defer=b,c.denodeify=f,c.configure=l,c.resolve=v,c.reject=g})}(),function(){e("container",[],function(){function e(e){this.parent=e,this.dict={}}function t(t){this.parent=t,this.children=[],this.resolver=t&&t.resolver||function(){},this.registry=new e(t&&t.registry),this.cache=new e(t&&t.cache),this.typeInjections=new e(t&&t.typeInjections),this.injections={},this._options=new e(t&&t._options),this._typeOptions=new e(t&&t._typeOptions)}function r(e){throw new Error(e+" is not currently supported on child containers")}function n(e,t){var r=o(e,t,"singleton");return r!==!1}function i(e,t){var r={};if(!t)return r;for(var n,i,o=0,s=t.length;s>o;o++)n=t[o],i=e.lookup(n.fullName),r[n.property]=i;return r}function o(e,t,r){var n=e._options.get(t);if(n&&void 0!==n[r])return n[r];var i=t.split(":")[0];return n=e._typeOptions.get(i),n?n[r]:void 0}function s(e,t){var r=e.normalize(t);return e.resolve(r)}function a(e,t){var r,n=s(e,t),a=t.split(":"),u=a[0];if(o(e,t,"instantiate")===!1)return n;if(n){var c=[];c=c.concat(e.typeInjections.get(u)||[]),c=c.concat(e.injections[t]||[]);var l=i(e,c);return l.container=e,l._debugContainerKey=t,r=n.create(l)}}function u(e,t){e.cache.eachLocal(function(r,n){o(e,r,"instantiate")!==!1&&t(n)})}function c(e){e.cache.eachLocal(function(t,r){o(e,t,"instantiate")!==!1&&r.destroy()}),e.cache.dict={}}return e.prototype={get:function(e){var t=this.dict;return t.hasOwnProperty(e)?t[e]:this.parent?this.parent.get(e):void 0},set:function(e,t){this.dict[e]=t},has:function(e){var t=this.dict;return t.hasOwnProperty(e)?!0:this.parent?this.parent.has(e):!1},eachLocal:function(e,t){var r=this.dict;for(var n in r)r.hasOwnProperty(n)&&e.call(t,n,r[n])}},t.prototype={child:function(){var e=new t(this);return this.children.push(e),e},set:function(e,t,r){e[t]=r},register:function(e,t,r,n){var i;-1!==e.indexOf(":")?(n=r,r=t,i=e):i=e+":"+t;var o=this.normalize(i);this.registry.set(o,r),this._options.set(o,n||{})},resolve:function(e){return this.resolver(e)||this.registry.get(e)},normalize:function(e){return e},lookup:function(e,t){if(e=this.normalize(e),t=t||{},this.cache.has(e)&&t.singleton!==!1)return this.cache.get(e);var r=a(this,e);return r?(n(this,e)&&t.singleton!==!1&&this.cache.set(e,r),r):void 0},has:function(e){return this.cache.has(e)?!0:!!s(this,e)},optionsForType:function(e,t){this.parent&&r("optionsForType"),this._typeOptions.set(e,t)},options:function(e,t){this.optionsForType(e,t)},typeInjection:function(e,t,n){this.parent&&r("typeInjection");var i=this.typeInjections.get(e);i||(i=[],this.typeInjections.set(e,i)),i.push({property:t,fullName:n})},injection:function(e,t,n){if(this.parent&&r("injection"),-1===e.indexOf(":"))return this.typeInjection(e,t,n);var i=this.injections[e]=this.injections[e]||[];i.push({property:t,fullName:n})},destroy:function(){this.isDestroyed=!0;for(var e=0,t=this.children.length;t>e;e++)this.children[e].destroy();this.children=[],u(this,function(e){e.isDestroying=!0}),u(this,function(e){e.destroy()}),delete this.parent,this.isDestroyed=!0},reset:function(){for(var e=0,t=this.children.length;t>e;e++)c(this.children[e]);c(this)}},t})}(),function(){function e(r,n,i,o){var s,a,u;if("object"!=typeof r||null===r)return r;if(n&&(a=t(i,r))>=0)return o[a];if("array"===Ember.typeOf(r)){if(s=r.slice(),n)for(a=s.length;--a>=0;)s[a]=e(s[a],n,i,o)}else if(Ember.Copyable&&Ember.Copyable.detect(r))s=r.copy(n,i,o);else{s={};for(u in r)r.hasOwnProperty(u)&&"__"!==u.substring(0,2)&&(s[u]=n?e(r[u],n,i,o):r[u])}return n&&(i.push(r),o.push(s)),s}var t=Ember.EnumerableUtils.indexOf;Ember.compare=function r(e,t){if(e===t)return 0;var n=Ember.typeOf(e),i=Ember.typeOf(t),o=Ember.Comparable;if(o){if("instance"===n&&o.detect(e.constructor))return e.constructor.compare(e,t);if("instance"===i&&o.detect(t.constructor))return 1-t.constructor.compare(t,e)}var s=Ember.ORDER_DEFINITION_MAPPING;if(!s){var a=Ember.ORDER_DEFINITION;s=Ember.ORDER_DEFINITION_MAPPING={};var u,c;for(u=0,c=a.length;c>u;++u)s[a[u]]=u;delete Ember.ORDER_DEFINITION}var l=s[n],h=s[i];if(h>l)return-1;if(l>h)return 1;switch(n){case"boolean":case"number":return t>e?-1:e>t?1:0;case"string":var m=e.localeCompare(t);return 0>m?-1:m>0?1:0;case"array":for(var f=e.length,p=t.length,d=Math.min(f,p),b=0,E=0;0===b&&d>E;)b=r(e[E],t[E]),E++;return 0!==b?b:p>f?-1:f>p?1:0;case"instance":return Ember.Comparable&&Ember.Comparable.detect(e)?e.compare(e,t):0;case"date":var v=e.getTime(),g=t.getTime();return g>v?-1:v>g?1:0;default:return 0}},Ember.copy=function(t,r){return"object"!=typeof t||null===t?t:Ember.Copyable&&Ember.Copyable.detect(t)?t.copy(r):e(t,r,r?[]:null,r?[]:null)},Ember.inspect=function(e){if("object"!=typeof e||null===e)return e+"";var t,r=[];for(var n in e)if(e.hasOwnProperty(n)){if(t=e[n],"toString"===t)continue;"function"===Ember.typeOf(t)&&(t="function() { ... }"),r.push(n+": "+t)}return"{"+r.join(", ")+"}"},Ember.isEqual=function(e,t){return e&&"function"==typeof e.isEqual?e.isEqual(t):e===t},Ember.ORDER_DEFINITION=Ember.ENV.ORDER_DEFINITION||["undefined","null","boolean","number","string","array","object","instance","function","class","date"],Ember.keys=Object.keys,Ember.keys||(Ember.keys=function(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r);return t});var n=["description","fileName","lineNumber","message","name","number","stack"];Ember.Error=function(){for(var e=Error.prototype.constructor.apply(this,arguments),t=0;n.length>t;t++)this[n[t]]=e[n[t]]},Ember.Error.prototype=Ember.create(Error.prototype)}(),function(){Ember.RSVP=t("rsvp")}(),function(){var e=/[ _]/g,t={},r=/([a-z])([A-Z])/g,n=/(\-|_|\.|\s)+(.)?/g,i=/([a-z\d])([A-Z]+)/g,o=/\-|\s+/g;Ember.STRINGS={},Ember.String={fmt:function(e,t){var r=0;return e.replace(/%@([0-9]+)?/g,function(e,n){return n=n?parseInt(n,0)-1:r++,e=t[n],(null===e?"(null)":void 0===e?"":e).toString()})},loc:function(e,t){return e=Ember.STRINGS[e]||e,Ember.String.fmt(e,t)},w:function(e){return e.split(/\s+/)},decamelize:function(e){return e.replace(r,"$1_$2").toLowerCase()},dasherize:function(r){var n,i=t,o=i.hasOwnProperty(r);return o?i[r]:(n=Ember.String.decamelize(r).replace(e,"-"),i[r]=n,n)},camelize:function(e){return e.replace(n,function(e,t,r){return r?r.toUpperCase():""}).replace(/^([A-Z])/,function(e){return e.toLowerCase()})},classify:function(e){for(var t=e.split("."),r=[],n=0,i=t.length;i>n;n++){var o=Ember.String.camelize(t[n]);r.push(o.charAt(0).toUpperCase()+o.substr(1))}return r.join(".")},underscore:function(e){return e.replace(i,"$1_$2").replace(o,"_").toLowerCase()},capitalize:function(e){return e.charAt(0).toUpperCase()+e.substr(1)}}}(),function(){var e=Ember.String.fmt,t=Ember.String.w,r=Ember.String.loc,n=Ember.String.camelize,i=Ember.String.decamelize,o=Ember.String.dasherize,s=Ember.String.underscore,a=Ember.String.capitalize,u=Ember.String.classify;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.String)&&(String.prototype.fmt=function(){return e(this,arguments)},String.prototype.w=function(){return t(this)},String.prototype.loc=function(){return r(this,arguments)},String.prototype.camelize=function(){return n(this)},String.prototype.decamelize=function(){return i(this)},String.prototype.dasherize=function(){return o(this)},String.prototype.underscore=function(){return s(this)},String.prototype.classify=function(){return u(this)},String.prototype.capitalize=function(){return a(this)})}(),function(){var e=Array.prototype.slice;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.Function)&&(Function.prototype.property=function(){var e=Ember.computed(this);return e.property.apply(e,arguments)},Function.prototype.observes=function(){return this.__ember_observes__=e.call(arguments),this},Function.prototype.observesBefore=function(){return this.__ember_observesBefore__=e.call(arguments),this})}(),function(){function e(){return 0===a.length?{}:a.pop()}function t(e){return a.push(e),null}function r(e,t){function r(r){var o=n(r,e);return i?t===o:!!o}var i=2===arguments.length;return r}var n=Ember.get,i=Ember.set,o=Array.prototype.slice,s=Ember.EnumerableUtils.indexOf,a=[];Ember.Enumerable=Ember.Mixin.create({isEnumerable:!0,nextObject:Ember.required(Function),firstObject:Ember.computed(function(){if(0===n(this,"length"))return void 0;var r,i=e();return r=this.nextObject(0,null,i),t(i),r}).property("[]"),lastObject:Ember.computed(function(){var r=n(this,"length");if(0===r)return void 0;var i,o=e(),s=0,a=null;do a=i,i=this.nextObject(s++,a,o);while(void 0!==i);return t(o),a}).property("[]"),contains:function(e){return void 0!==this.find(function(t){return t===e})},forEach:function(r,i){if("function"!=typeof r)throw new TypeError;var o=n(this,"length"),s=null,a=e();void 0===i&&(i=null);for(var u=0;o>u;u++){var c=this.nextObject(u,s,a);r.call(i,c,u,this),s=c}return s=null,a=t(a),this},getEach:function(e){return this.mapProperty(e)},setEach:function(e,t){return this.forEach(function(r){i(r,e,t)})},map:function(e,t){var r=Ember.A([]);return this.forEach(function(n,i,o){r[i]=e.call(t,n,i,o)}),r},mapProperty:function(e){return this.map(function(t){return n(t,e)})},filter:function(e,t){var r=Ember.A([]);return this.forEach(function(n,i,o){e.call(t,n,i,o)&&r.push(n)}),r},reject:function(e,t){return this.filter(function(){return!e.apply(t,arguments)})},filterProperty:function(){return this.filter(r.apply(this,arguments))},rejectProperty:function(e,t){var r=function(r){return n(r,e)===t},i=function(t){return!!n(t,e)},o=2===arguments.length?r:i;return this.reject(o)},find:function(r,i){var o=n(this,"length");void 0===i&&(i=null);for(var s,a,u=null,c=!1,l=e(),h=0;o>h&&!c;h++)s=this.nextObject(h,u,l),(c=r.call(i,s,h,this))&&(a=s),u=s;return s=u=null,l=t(l),a},findProperty:function(){return this.find(r.apply(this,arguments))},every:function(e,t){return!this.find(function(r,n,i){return!e.call(t,r,n,i)})},everyProperty:function(){return this.every(r.apply(this,arguments))},some:function(e,t){return!!this.find(function(r,n,i){return!!e.call(t,r,n,i)})},someProperty:function(){return this.some(r.apply(this,arguments))},reduce:function(e,t,r){if("function"!=typeof e)throw new TypeError;var n=t;return this.forEach(function(t,i){n=e.call(null,n,t,i,this,r)},this),n},invoke:function(e){var t,r=Ember.A([]);return arguments.length>1&&(t=o.call(arguments,1)),this.forEach(function(n,i){var o=n&&n[e];"function"==typeof o&&(r[i]=t?o.apply(n,t):o.call(n))},this),r},toArray:function(){var e=Ember.A([]);return this.forEach(function(t,r){e[r]=t}),e},compact:function(){return this.filter(function(e){return null!=e})},without:function(e){if(!this.contains(e))return this;var t=Ember.A([]);return this.forEach(function(r){r!==e&&(t[t.length]=r)}),t},uniq:function(){var e=Ember.A([]);return this.forEach(function(t){0>s(e,t)&&e.push(t)}),e},"[]":Ember.computed(function(){return this}),addEnumerableObserver:function(e,t){var r=t&&t.willChange||"enumerableWillChange",i=t&&t.didChange||"enumerableDidChange",o=n(this,"hasEnumerableObservers");return o||Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.addListener(this,"@enumerable:before",e,r),Ember.addListener(this,"@enumerable:change",e,i),o||Ember.propertyDidChange(this,"hasEnumerableObservers"),this},removeEnumerableObserver:function(e,t){var r=t&&t.willChange||"enumerableWillChange",i=t&&t.didChange||"enumerableDidChange",o=n(this,"hasEnumerableObservers");return o&&Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.removeListener(this,"@enumerable:before",e,r),Ember.removeListener(this,"@enumerable:change",e,i),o&&Ember.propertyDidChange(this,"hasEnumerableObservers"),this},hasEnumerableObservers:Ember.computed(function(){return Ember.hasListeners(this,"@enumerable:change")||Ember.hasListeners(this,"@enumerable:before")}),enumerableContentWillChange:function(e,t){var r,i,o;return r="number"==typeof e?e:e?n(e,"length"):e=-1,i="number"==typeof t?t:t?n(t,"length"):t=-1,o=0>i||0>r||0!==i-r,-1===e&&(e=null),-1===t&&(t=null),Ember.propertyWillChange(this,"[]"),o&&Ember.propertyWillChange(this,"length"),Ember.sendEvent(this,"@enumerable:before",[this,e,t]),this},enumerableContentDidChange:function(e,t){var r,i,o;return r="number"==typeof e?e:e?n(e,"length"):e=-1,i="number"==typeof t?t:t?n(t,"length"):t=-1,o=0>i||0>r||0!==i-r,-1===e&&(e=null),-1===t&&(t=null),Ember.sendEvent(this,"@enumerable:change",[this,e,t]),o&&Ember.propertyDidChange(this,"length"),Ember.propertyDidChange(this,"[]"),this}})}(),function(){var e=Ember.get,t=(Ember.set,Ember.isNone),r=Ember.EnumerableUtils.map,n=Ember.cacheFor;Ember.Array=Ember.Mixin.create(Ember.Enumerable,{isSCArray:!0,length:Ember.required(),objectAt:function(t){return 0>t||t>=e(this,"length")?void 0:e(this,t)},objectsAt:function(e){var t=this;return r(e,function(e){return t.objectAt(e)})},nextObject:function(e){return this.objectAt(e)},"[]":Ember.computed(function(t,r){return void 0!==r&&this.replace(0,e(this,"length"),r),this}),firstObject:Ember.computed(function(){return this.objectAt(0)}),lastObject:Ember.computed(function(){return this.objectAt(e(this,"length")-1)}),contains:function(e){return this.indexOf(e)>=0},slice:function(r,n){var i=Ember.A([]),o=e(this,"length");for(t(r)&&(r=0),(t(n)||n>o)&&(n=o),0>r&&(r=o+r),0>n&&(n=o+n);n>r;)i[i.length]=this.objectAt(r++);return i},indexOf:function(t,r){var n,i=e(this,"length");for(void 0===r&&(r=0),0>r&&(r+=i),n=r;i>n;n++)if(this.objectAt(n,!0)===t)return n;return-1},lastIndexOf:function(t,r){var n,i=e(this,"length");for((void 0===r||r>=i)&&(r=i-1),0>r&&(r+=i),n=r;n>=0;n--)if(this.objectAt(n)===t)return n;return-1},addArrayObserver:function(t,r){var n=r&&r.willChange||"arrayWillChange",i=r&&r.didChange||"arrayDidChange",o=e(this,"hasArrayObservers");return o||Ember.propertyWillChange(this,"hasArrayObservers"),Ember.addListener(this,"@array:before",t,n),Ember.addListener(this,"@array:change",t,i),o||Ember.propertyDidChange(this,"hasArrayObservers"),this},removeArrayObserver:function(t,r){var n=r&&r.willChange||"arrayWillChange",i=r&&r.didChange||"arrayDidChange",o=e(this,"hasArrayObservers");return o&&Ember.propertyWillChange(this,"hasArrayObservers"),Ember.removeListener(this,"@array:before",t,n),Ember.removeListener(this,"@array:change",t,i),o&&Ember.propertyDidChange(this,"hasArrayObservers"),this},hasArrayObservers:Ember.computed(function(){return Ember.hasListeners(this,"@array:change")||Ember.hasListeners(this,"@array:before")}),arrayContentWillChange:function(t,r,n){void 0===t?(t=0,r=n=-1):(void 0===r&&(r=-1),void 0===n&&(n=-1)),Ember.isWatching(this,"@each")&&e(this,"@each"),Ember.sendEvent(this,"@array:before",[this,t,r,n]);var i,o;if(t>=0&&r>=0&&e(this,"hasEnumerableObservers")){i=[],o=t+r;for(var s=t;o>s;s++)i.push(this.objectAt(s))}else i=r;return this.enumerableContentWillChange(i,n),this},arrayContentDidChange:function(t,r,i){void 0===t?(t=0,r=i=-1):(void 0===r&&(r=-1),void 0===i&&(i=-1));var o,s;if(t>=0&&i>=0&&e(this,"hasEnumerableObservers")){o=[],s=t+i;for(var a=t;s>a;a++)o.push(this.objectAt(a))}else o=i;this.enumerableContentDidChange(r,o),Ember.sendEvent(this,"@array:change",[this,t,r,i]);var u=e(this,"length"),c=n(this,"firstObject"),l=n(this,"lastObject");return this.objectAt(0)!==c&&(Ember.propertyWillChange(this,"firstObject"),Ember.propertyDidChange(this,"firstObject")),this.objectAt(u-1)!==l&&(Ember.propertyWillChange(this,"lastObject"),Ember.propertyDidChange(this,"lastObject")),this
},"@each":Ember.computed(function(){return this.__each||(this.__each=new Ember.EachProxy(this)),this.__each})})}(),function(){Ember.Comparable=Ember.Mixin.create({isComparable:!0,compare:Ember.required(Function)})}(),function(){var e=Ember.get;Ember.set,Ember.Copyable=Ember.Mixin.create({copy:Ember.required(Function),frozenCopy:function(){if(Ember.Freezable&&Ember.Freezable.detect(this))return e(this,"isFrozen")?this:this.copy().freeze();throw new Error(Ember.String.fmt("%@ does not support freezing",[this]))}})}(),function(){var e=Ember.get,t=Ember.set;Ember.Freezable=Ember.Mixin.create({isFrozen:!1,freeze:function(){return e(this,"isFrozen")?this:(t(this,"isFrozen",!0),this)}}),Ember.FROZEN_ERROR="Frozen object cannot be modified."}(),function(){var e=Ember.EnumerableUtils.forEach;Ember.MutableEnumerable=Ember.Mixin.create(Ember.Enumerable,{addObject:Ember.required(Function),addObjects:function(t){return Ember.beginPropertyChanges(this),e(t,function(e){this.addObject(e)},this),Ember.endPropertyChanges(this),this},removeObject:Ember.required(Function),removeObjects:function(t){return Ember.beginPropertyChanges(this),e(t,function(e){this.removeObject(e)},this),Ember.endPropertyChanges(this),this}})}(),function(){var e="Index out of range",t=[],r=Ember.get;Ember.set,Ember.MutableArray=Ember.Mixin.create(Ember.Array,Ember.MutableEnumerable,{replace:Ember.required(),clear:function(){var e=r(this,"length");return 0===e?this:(this.replace(0,e,t),this)},insertAt:function(t,n){if(t>r(this,"length"))throw new Error(e);return this.replace(t,0,[n]),this},removeAt:function(n,i){if("number"==typeof n){if(0>n||n>=r(this,"length"))throw new Error(e);void 0===i&&(i=1),this.replace(n,i,t)}return this},pushObject:function(e){return this.insertAt(r(this,"length"),e),e},pushObjects:function(e){return this.replace(r(this,"length"),0,e),this},popObject:function(){var e=r(this,"length");if(0===e)return null;var t=this.objectAt(e-1);return this.removeAt(e-1,1),t},shiftObject:function(){if(0===r(this,"length"))return null;var e=this.objectAt(0);return this.removeAt(0),e},unshiftObject:function(e){return this.insertAt(0,e),e},unshiftObjects:function(e){return this.replace(0,0,e),this},reverseObjects:function(){var e=r(this,"length");if(0===e)return this;var t=this.toArray().reverse();return this.replace(0,e,t),this},setObjects:function(e){if(0===e.length)return this.clear();var t=r(this,"length");return this.replace(0,t,e),this},removeObject:function(e){for(var t=r(this,"length")||0;--t>=0;){var n=this.objectAt(t);n===e&&this.removeAt(t)}return this},addObject:function(e){return this.contains(e)||this.pushObject(e),this}})}(),function(){var e=Ember.get,t=Ember.set;Ember.Observable=Ember.Mixin.create({get:function(t){return e(this,t)},getProperties:function(){var t={},r=arguments;1===arguments.length&&"array"===Ember.typeOf(arguments[0])&&(r=arguments[0]);for(var n=0;r.length>n;n++)t[r[n]]=e(this,r[n]);return t},set:function(e,r){return t(this,e,r),this},setProperties:function(e){return Ember.setProperties(this,e)},beginPropertyChanges:function(){return Ember.beginPropertyChanges(),this},endPropertyChanges:function(){return Ember.endPropertyChanges(),this},propertyWillChange:function(e){return Ember.propertyWillChange(this,e),this},propertyDidChange:function(e){return Ember.propertyDidChange(this,e),this},notifyPropertyChange:function(e){return this.propertyWillChange(e),this.propertyDidChange(e),this},addBeforeObserver:function(e,t,r){Ember.addBeforeObserver(this,e,t,r)},addObserver:function(e,t,r){Ember.addObserver(this,e,t,r)},removeObserver:function(e,t,r){Ember.removeObserver(this,e,t,r)},hasObserverFor:function(e){return Ember.hasListeners(this,e+":change")},getPath:function(e){return this.get(e)},setPath:function(e,t){return this.set(e,t)},getWithDefault:function(e,t){return Ember.getWithDefault(this,e,t)},incrementProperty:function(r,n){return Ember.isNone(n)&&(n=1),t(this,r,(e(this,r)||0)+n),e(this,r)},decrementProperty:function(r,n){return Ember.isNone(n)&&(n=1),t(this,r,(e(this,r)||0)-n),e(this,r)},toggleProperty:function(r){return t(this,r,!e(this,r)),e(this,r)},cacheFor:function(e){return Ember.cacheFor(this,e)},observersForKey:function(e){return Ember.observersFor(this,e)}})}(),function(){var e=Ember.get;Ember.set,Ember.TargetActionSupport=Ember.Mixin.create({target:null,action:null,actionContext:null,targetObject:Ember.computed(function(){var t=e(this,"target");if("string"===Ember.typeOf(t)){var r=e(this,t);return void 0===r&&(r=e(Ember.lookup,t)),r}return t}).property("target"),actionContextObject:Ember.computed(function(){var t=e(this,"actionContext");if("string"===Ember.typeOf(t)){var r=e(this,t);return void 0===r&&(r=e(Ember.lookup,t)),r}return t}).property("actionContext"),triggerAction:function(t){t=t||{};var r=t.action||e(this,"action"),n=t.target||e(this,"targetObject"),i=t.actionContext||e(this,"actionContextObject")||this;if(n&&r){var o;return o=n.send?n.send.apply(n,[r,i]):n[r].apply(n,[i]),o!==!1&&(o=!0),o}return!1}})}(),function(){Ember.Evented=Ember.Mixin.create({on:function(e,t,r){return Ember.addListener(this,e,t,r),this},one:function(e,t,r){return r||(r=t,t=null),Ember.addListener(this,e,t,r,!0),this},trigger:function(e){var t,r,n=[];for(t=1,r=arguments.length;r>t;t++)n.push(arguments[t]);Ember.sendEvent(this,e,n)},fire:function(){this.trigger.apply(this,arguments)},off:function(e,t,r){return Ember.removeListener(this,e,t,r),this},has:function(e){return Ember.hasListeners(this,e)}})}(),function(){var e=t("rsvp");e.configure("async",function(e,t){Ember.run.schedule("actions",t,e)});var r=Ember.get;Ember.DeferredMixin=Ember.Mixin.create({then:function(e,t){var n,i,o;return o=this,n=r(this,"_deferred"),i=n.promise,i.then(function(t){return t===i?e(o):e(t)},function(e){return t(e)})},resolve:function(e){var t,n;t=r(this,"_deferred"),n=t.promise,e===this?t.resolve(n):t.resolve(e)},reject:function(e){r(this,"_deferred").reject(e)},_deferred:Ember.computed(function(){return e.defer()})})}(),function(){Ember.Container=t("container"),Ember.Container.set=Ember.set}(),function(){function e(){var e,t,o=!1,s=function(){o||s.proto(),n(this,i,v),n(this,"_super",v);var u=a(this);if(u.proto=this,e){var l=e;e=null,this.reopen.apply(this,l)}if(t){var h=t;t=null;for(var m=this.concatenatedProperties,f=0,d=h.length;d>f;f++){var g=h[f];for(var y in g)if(g.hasOwnProperty(y)){var w=g[y],_=Ember.IS_BINDING;if(_.test(y)){var C=u.bindings;C?u.hasOwnProperty("bindings")||(C=u.bindings=r(u.bindings)):C=u.bindings={},C[y]=w}var O=u.descs[y];if(m&&E(m,y)>=0){var S=this[y];w=S?"function"==typeof S.concat?S.concat(w):Ember.makeArray(S).concat(w):Ember.makeArray(w)}O?O.set(this,y,w):"function"!=typeof this.setUnknownProperty||y in this?b?Ember.defineProperty(this,y,null,w):this[y]=w:this.setUnknownProperty(y,w)}}}p(this,u),delete u.proto,c(this),this.init.apply(this,arguments)};return s.toString=m.prototype.toString,s.willReopen=function(){o&&(s.PrototypeMixin=m.create(s.PrototypeMixin)),o=!1},s._initMixins=function(t){e=t},s._initProperties=function(e){t=e},s.proto=function(){var e=s.superclass;return e&&e.proto(),o||(o=!0,s.PrototypeMixin.applyPartial(s.prototype),u(s.prototype)),this.prototype},s}function t(e){return function(){return e}}var r=(Ember.set,Ember.get,Ember.create),n=Ember.platform.defineProperty,i=Ember.GUID_KEY,o=Ember.guidFor,s=Ember.generateGuid,a=Ember.meta,u=Ember.rewatch,c=Ember.finishChains,l=Ember.destroy,h=Ember.run.schedule,m=Ember.Mixin,f=m._apply,p=m.finishPartial,d=m.prototype.reopen,b=Ember.ENV.MANDATORY_SETTER,E=Ember.EnumerableUtils.indexOf,v={configurable:!0,writable:!0,enumerable:!1,value:void 0},g=e();g.toString=function(){return"Ember.CoreObject"},g.PrototypeMixin=m.create({reopen:function(){return f(this,arguments,!0),this},isInstance:!0,init:function(){},concatenatedProperties:null,isDestroyed:!1,isDestroying:!1,destroy:function(){return this._didCallDestroy?void 0:(this.isDestroying=!0,this._didCallDestroy=!0,h("destroy",this,this._scheduledDestroy),this)},willDestroy:Ember.K,_scheduledDestroy:function(){this.willDestroy&&this.willDestroy(),l(this),this.isDestroyed=!0,this.didDestroy&&this.didDestroy()},bind:function(e,t){return t instanceof Ember.Binding||(t=Ember.Binding.from(t)),t.to(e).connect(this),t},toString:function(){var e="function"==typeof this.toStringExtension,r=e?":"+this.toStringExtension():"",n="<"+this.constructor.toString()+":"+o(this)+r+">";return this.toString=t(n),n}}),g.PrototypeMixin.ownerConstructor=g,Ember.config.overridePrototypeMixin&&Ember.config.overridePrototypeMixin(g.PrototypeMixin),g.__super__=null;var y=m.create({ClassMixin:Ember.required(),PrototypeMixin:Ember.required(),isClass:!0,isMethod:!1,extend:function(){var t,n=e();return n.ClassMixin=m.create(this.ClassMixin),n.PrototypeMixin=m.create(this.PrototypeMixin),n.ClassMixin.ownerConstructor=n,n.PrototypeMixin.ownerConstructor=n,d.apply(n.PrototypeMixin,arguments),n.superclass=this,n.__super__=this.prototype,t=n.prototype=r(this.prototype),t.constructor=n,s(t,"ember"),a(t).proto=t,n.ClassMixin.apply(n),n},createWithMixins:function(){var e=this;return arguments.length>0&&this._initMixins(arguments),new e},create:function(){var e=this;return arguments.length>0&&this._initProperties(arguments),new e},reopen:function(){return this.willReopen(),d.apply(this.PrototypeMixin,arguments),this},reopenClass:function(){return d.apply(this.ClassMixin,arguments),f(this,arguments,!1),this},detect:function(e){if("function"!=typeof e)return!1;for(;e;){if(e===this)return!0;e=e.superclass}return!1},detectInstance:function(e){return e instanceof this},metaForProperty:function(e){var t=a(this.proto(),!1).descs[e];return t._meta||{}},eachComputedProperty:function(e,t){var r,n=this.proto(),i=a(n).descs,o={};for(var s in i)r=i[s],r instanceof Ember.ComputedProperty&&e.call(t||this,s,r._meta||o)}});y.ownerConstructor=g,Ember.config.overrideClassMixin&&Ember.config.overrideClassMixin(y),g.ClassMixin=y,y.apply(g),Ember.CoreObject=g}(),function(){Ember.Object=Ember.CoreObject.extend(Ember.Observable),Ember.Object.toString=function(){return"Ember.Object"}}(),function(){function e(t,r,i){var s=t.length;c[t.join(".")]=r;for(var a in r)if(l.call(r,a)){var u=r[a];if(t[s]=a,u&&u.toString===n)u.toString=o(t.join(".")),u[m]=t.join(".");else if(u&&u.isNamespace){if(i[h(u)])continue;i[h(u)]=!0,e(t,u,i)}}t.length=s}function t(){var e,t,r=Ember.Namespace,n=Ember.lookup;if(!r.PROCESSED)for(var i in n)if("parent"!==i&&"top"!==i&&"frameElement"!==i&&"webkitStorageInfo"!==i&&!("globalStorage"===i&&n.StorageList&&n.globalStorage instanceof n.StorageList||n.hasOwnProperty&&!n.hasOwnProperty(i))){try{e=Ember.lookup[i],t=e&&e.isNamespace}catch(o){continue}t&&(e[m]=i)}}function r(e){var t=e.superclass;return t?t[m]?t[m]:r(t):void 0}function n(){Ember.BOOTED||this[m]||i();var e;if(this[m])e=this[m];else{var t=r(this);e=t?"(subclass of "+t+")":"(unknown mixin)",this.toString=o(e)}return e}function i(){var r=!u.PROCESSED,n=Ember.anyUnprocessedMixins;if(r&&(t(),u.PROCESSED=!0),r||n){for(var i,o=u.NAMESPACES,s=0,a=o.length;a>s;s++)i=o[s],e([i.toString()],i,{});Ember.anyUnprocessedMixins=!1}}function o(e){return function(){return e}}var s=Ember.get,a=Ember.ArrayPolyfills.indexOf,u=Ember.Namespace=Ember.Object.extend({isNamespace:!0,init:function(){Ember.Namespace.NAMESPACES.push(this),Ember.Namespace.PROCESSED=!1},toString:function(){var e=s(this,"name");return e?e:(t(),this[Ember.GUID_KEY+"_name"])},nameClasses:function(){e([this.toString()],this,{})},destroy:function(){var e=Ember.Namespace.NAMESPACES;Ember.lookup[this.toString()]=void 0,e.splice(a.call(e,this),1),this._super()}});u.reopenClass({NAMESPACES:[Ember],NAMESPACES_BY_ID:{},PROCESSED:!1,processAll:i,byName:function(e){return Ember.BOOTED||i(),c[e]}});var c=u.NAMESPACES_BY_ID,l={}.hasOwnProperty,h=Ember.guidFor,m=Ember.NAME_KEY=Ember.GUID_KEY+"_name";Ember.Mixin.prototype.toString=n}(),function(){Ember.Application=Ember.Namespace.extend()}(),function(){var e="Index out of range",t=[],r=Ember.get;Ember.set,Ember.ArrayProxy=Ember.Object.extend(Ember.MutableArray,{content:null,arrangedContent:Ember.computed.alias("content"),objectAtContent:function(e){return r(this,"arrangedContent").objectAt(e)},replaceContent:function(e,t,n){r(this,"content").replace(e,t,n)},_contentWillChange:Ember.beforeObserver(function(){this._teardownContent()},"content"),_teardownContent:function(){var e=r(this,"content");e&&e.removeArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},contentArrayWillChange:Ember.K,contentArrayDidChange:Ember.K,_contentDidChange:Ember.observer(function(){r(this,"content"),this._setupContent()},"content"),_setupContent:function(){var e=r(this,"content");e&&e.addArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},_arrangedContentWillChange:Ember.beforeObserver(function(){var e=r(this,"arrangedContent"),t=e?r(e,"length"):0;this.arrangedContentArrayWillChange(this,0,t,void 0),this.arrangedContentWillChange(this),this._teardownArrangedContent(e)},"arrangedContent"),_arrangedContentDidChange:Ember.observer(function(){var e=r(this,"arrangedContent"),t=e?r(e,"length"):0;this._setupArrangedContent(),this.arrangedContentDidChange(this),this.arrangedContentArrayDidChange(this,0,void 0,t)},"arrangedContent"),_setupArrangedContent:function(){var e=r(this,"arrangedContent");e&&e.addArrayObserver(this,{willChange:"arrangedContentArrayWillChange",didChange:"arrangedContentArrayDidChange"})},_teardownArrangedContent:function(){var e=r(this,"arrangedContent");e&&e.removeArrayObserver(this,{willChange:"arrangedContentArrayWillChange",didChange:"arrangedContentArrayDidChange"})},arrangedContentWillChange:Ember.K,arrangedContentDidChange:Ember.K,objectAt:function(e){return r(this,"content")&&this.objectAtContent(e)},length:Ember.computed(function(){var e=r(this,"arrangedContent");return e?r(e,"length"):0}),_replace:function(e,t,n){var i=r(this,"content");return i&&this.replaceContent(e,t,n),this},replace:function(){if(r(this,"arrangedContent")!==r(this,"content"))throw new Ember.Error("Using replace on an arranged ArrayProxy is not allowed.");this._replace.apply(this,arguments)},_insertAt:function(t,n){if(t>r(this,"content.length"))throw new Error(e);return this._replace(t,0,[n]),this},insertAt:function(e,t){if(r(this,"arrangedContent")===r(this,"content"))return this._insertAt(e,t);throw new Ember.Error("Using insertAt on an arranged ArrayProxy is not allowed.")},removeAt:function(n,i){if("number"==typeof n){var o,s=r(this,"content"),a=r(this,"arrangedContent"),u=[];if(0>n||n>=r(this,"length"))throw new Error(e);for(void 0===i&&(i=1),o=n;n+i>o;o++)u.push(s.indexOf(a.objectAt(o)));for(u.sort(function(e,t){return t-e}),Ember.beginPropertyChanges(),o=0;u.length>o;o++)this._replace(u[o],1,t);Ember.endPropertyChanges()}return this},pushObject:function(e){return this._insertAt(r(this,"content.length"),e),e},pushObjects:function(e){return this._replace(r(this,"length"),0,e),this},setObjects:function(e){if(0===e.length)return this.clear();var t=r(this,"length");return this._replace(0,t,e),this},unshiftObject:function(e){return this._insertAt(0,e),e},unshiftObjects:function(e){return this._replace(0,0,e),this},slice:function(){var e=this.toArray();return e.slice.apply(e,arguments)},arrangedContentArrayWillChange:function(e,t,r,n){this.arrayContentWillChange(t,r,n)},arrangedContentArrayDidChange:function(e,t,r,n){this.arrayContentDidChange(t,r,n)},init:function(){this._super(),this._setupContent(),this._setupArrangedContent()},willDestroy:function(){this._teardownArrangedContent(),this._teardownContent()}})}(),function(){function e(e,t){var r=t.slice(8);r in this||u(this,r)}function t(e,t){var r=t.slice(8);r in this||c(this,r)}var r=Ember.get,n=Ember.set,i=(Ember.String.fmt,Ember.addBeforeObserver),o=Ember.addObserver,s=Ember.removeBeforeObserver,a=Ember.removeObserver,u=Ember.propertyWillChange,c=Ember.propertyDidChange;Ember.ObjectProxy=Ember.Object.extend({content:null,_contentDidChange:Ember.observer(function(){},"content"),isTruthy:Ember.computed.bool("content"),_debugContainerKey:null,willWatchProperty:function(r){var n="content."+r;i(this,n,null,e),o(this,n,null,t)},didUnwatchProperty:function(r){var n="content."+r;s(this,n,null,e),a(this,n,null,t)},unknownProperty:function(e){var t=r(this,"content");return t?r(t,e):void 0},setUnknownProperty:function(e,t){var i=r(this,"content");return n(i,e,t)}}),Ember.ObjectProxy.reopenClass({create:function(){var e,t,r,n,i,o;if(arguments.length){for(t=this.proto(),r=0,n=arguments.length;n>r;r++){i=arguments[r];for(o in i)!i.hasOwnProperty(o)||o in t||(e||(e={}),e[o]=null)}e&&this._initMixins([e])}return this._super.apply(this,arguments)}})}(),function(){function e(e,t,r,i,o){var s,a=r._objects;for(a||(a=r._objects={});--o>=i;){var u=e.objectAt(o);u&&(Ember.addBeforeObserver(u,t,r,"contentKeyWillChange"),Ember.addObserver(u,t,r,"contentKeyDidChange"),s=n(u),a[s]||(a[s]=[]),a[s].push(o))}}function t(e,t,r,i,o){var s=r._objects;s||(s=r._objects={});for(var a,u;--o>=i;){var c=e.objectAt(o);c&&(Ember.removeBeforeObserver(c,t,r,"contentKeyWillChange"),Ember.removeObserver(c,t,r,"contentKeyDidChange"),u=n(c),a=s[u],a[a.indexOf(o)]=null)}}var r=(Ember.set,Ember.get),n=Ember.guidFor,i=Ember.EnumerableUtils.forEach,o=Ember.Object.extend(Ember.Array,{init:function(e,t,r){this._super(),this._keyName=t,this._owner=r,this._content=e},objectAt:function(e){var t=this._content.objectAt(e);return t&&r(t,this._keyName)},length:Ember.computed(function(){var e=this._content;return e?r(e,"length"):0})}),s=/^.+:(before|change)$/;Ember.EachProxy=Ember.Object.extend({init:function(e){this._super(),this._content=e,e.addArrayObserver(this),i(Ember.watchedEvents(this),function(e){this.didAddListener(e)},this)},unknownProperty:function(e){var t;return t=new o(this._content,e,this),Ember.defineProperty(this,e,null,t),this.beginObservingContentKey(e),t},arrayWillChange:function(e,r,n){var i,o,s=this._keys;o=n>0?r+n:-1,Ember.beginPropertyChanges(this);for(i in s)s.hasOwnProperty(i)&&(o>0&&t(e,i,this,r,o),Ember.propertyWillChange(this,i));Ember.propertyWillChange(this._content,"@each"),Ember.endPropertyChanges(this)},arrayDidChange:function(t,r,n,i){var o,s,a=this._keys;s=i>0?r+i:-1,Ember.beginPropertyChanges(this);for(o in a)a.hasOwnProperty(o)&&(s>0&&e(t,o,this,r,s),Ember.propertyDidChange(this,o));Ember.propertyDidChange(this._content,"@each"),Ember.endPropertyChanges(this)},didAddListener:function(e){s.test(e)&&this.beginObservingContentKey(e.slice(0,-7))},didRemoveListener:function(e){s.test(e)&&this.stopObservingContentKey(e.slice(0,-7))},beginObservingContentKey:function(t){var n=this._keys;if(n||(n=this._keys={}),n[t])n[t]++;else{n[t]=1;var i=this._content,o=r(i,"length");e(i,t,this,0,o)}},stopObservingContentKey:function(e){var n=this._keys;if(n&&n[e]>0&&0>=--n[e]){var i=this._content,o=r(i,"length");t(i,e,this,0,o)}},contentKeyWillChange:function(e,t){Ember.propertyWillChange(this,t)},contentKeyDidChange:function(e,t){Ember.propertyDidChange(this,t)}})}(),function(){var e=Ember.get;Ember.set;var t=Ember.Mixin.create(Ember.MutableArray,Ember.Observable,Ember.Copyable,{get:function(e){return"length"===e?this.length:"number"==typeof e?this[e]:this._super(e)},objectAt:function(e){return this[e]},replace:function(t,r,n){if(this.isFrozen)throw Ember.FROZEN_ERROR;var i=n?e(n,"length"):0;if(this.arrayContentWillChange(t,r,i),n&&0!==n.length){var o=[t,r].concat(n);this.splice.apply(this,o)}else this.splice(t,r);return this.arrayContentDidChange(t,r,i),this},unknownProperty:function(e,t){var r;return void 0!==t&&void 0===r&&(r=this[e]=t),r},indexOf:function(e,t){var r,n=this.length;for(t=void 0===t?0:0>t?Math.ceil(t):Math.floor(t),0>t&&(t+=n),r=t;n>r;r++)if(this[r]===e)return r;return-1},lastIndexOf:function(e,t){var r,n=this.length;for(t=void 0===t?n-1:0>t?Math.ceil(t):Math.floor(t),0>t&&(t+=n),r=t;r>=0;r--)if(this[r]===e)return r;return-1},copy:function(e){return e?this.map(function(e){return Ember.copy(e,!0)}):this.slice()}}),r=["length"];Ember.EnumerableUtils.forEach(t.keys(),function(e){Array.prototype[e]&&r.push(e)}),r.length>0&&(t=t.without.apply(t,r)),Ember.NativeArray=t,Ember.A=function(e){return void 0===e&&(e=[]),Ember.Array.detect(e)?e:Ember.NativeArray.apply(e)},Ember.NativeArray.activate=function(){t.apply(Array.prototype),Ember.A=function(e){return e||[]}},(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.Array)&&Ember.NativeArray.activate()}(),function(){var e=Ember.get,t=Ember.set,r=Ember.guidFor,n=Ember.isNone,i=Ember.String.fmt;Ember.Set=Ember.CoreObject.extend(Ember.MutableEnumerable,Ember.Copyable,Ember.Freezable,{length:0,clear:function(){if(this.isFrozen)throw new Error(Ember.FROZEN_ERROR);var n=e(this,"length");if(0===n)return this;var i;this.enumerableContentWillChange(n,0),Ember.propertyWillChange(this,"firstObject"),Ember.propertyWillChange(this,"lastObject");for(var o=0;n>o;o++)i=r(this[o]),delete this[i],delete this[o];return t(this,"length",0),Ember.propertyDidChange(this,"firstObject"),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(n,0),this},isEqual:function(t){if(!Ember.Enumerable.detect(t))return!1;var r=e(this,"length");if(e(t,"length")!==r)return!1;for(;--r>=0;)if(!t.contains(this[r]))return!1;return!0},add:Ember.aliasMethod("addObject"),remove:Ember.aliasMethod("removeObject"),pop:function(){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);var t=this.length>0?this[this.length-1]:null;return this.remove(t),t},push:Ember.aliasMethod("addObject"),shift:Ember.aliasMethod("pop"),unshift:Ember.aliasMethod("push"),addEach:Ember.aliasMethod("addObjects"),removeEach:Ember.aliasMethod("removeObjects"),init:function(e){this._super(),e&&this.addObjects(e)},nextObject:function(e){return this[e]},firstObject:Ember.computed(function(){return this.length>0?this[0]:void 0}),lastObject:Ember.computed(function(){return this.length>0?this[this.length-1]:void 0}),addObject:function(i){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(n(i))return this;var o,s=r(i),a=this[s],u=e(this,"length");return a>=0&&u>a&&this[a]===i?this:(o=[i],this.enumerableContentWillChange(null,o),Ember.propertyWillChange(this,"lastObject"),u=e(this,"length"),this[s]=u,this[u]=i,t(this,"length",u+1),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(null,o),this)},removeObject:function(i){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(n(i))return this;var o,s,a=r(i),u=this[a],c=e(this,"length"),l=0===u,h=u===c-1;return u>=0&&c>u&&this[u]===i&&(s=[i],this.enumerableContentWillChange(s,null),l&&Ember.propertyWillChange(this,"firstObject"),h&&Ember.propertyWillChange(this,"lastObject"),c-1>u&&(o=this[c-1],this[u]=o,this[r(o)]=u),delete this[a],delete this[c-1],t(this,"length",c-1),l&&Ember.propertyDidChange(this,"firstObject"),h&&Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(s,null)),this},contains:function(e){return this[r(e)]>=0},copy:function(){var n=this.constructor,i=new n,o=e(this,"length");for(t(i,"length",o);--o>=0;)i[o]=this[o],i[r(this[o])]=o;return i},toString:function(){var e,t=this.length,r=[];for(e=0;t>e;e++)r[e]=this[e];return i("Ember.Set<%@>",[r.join(",")])}})}(),function(){var e=Ember.DeferredMixin;Ember.get;var t=Ember.Object.extend(e);t.reopenClass({promise:function(e,r){var n=t.create();return e.call(r,n),n}}),Ember.Deferred=t}(),function(){var e=Ember.ArrayPolyfills.forEach,t=Ember.ENV.EMBER_LOAD_HOOKS||{},r={};Ember.onLoad=function(e,n){var i;t[e]=t[e]||Ember.A(),t[e].pushObject(n),(i=r[e])&&n(i)},Ember.runLoadHooks=function(n,i){r[n]=i,t[n]&&e.call(t[n],function(e){e(i)})}}(),function(){var e=Ember.get;Ember.ControllerMixin=Ember.Mixin.create({isController:!0,target:null,container:null,parentController:null,store:null,model:Ember.computed.alias("content"),send:function(t){var r,n=[].slice.call(arguments,1);this[t]?this[t].apply(this,n):(r=e(this,"target"))&&r.send.apply(r,arguments)}}),Ember.Controller=Ember.Object.extend(Ember.ControllerMixin)}(),function(){var e=Ember.get,t=(Ember.set,Ember.EnumerableUtils.forEach);Ember.SortableMixin=Ember.Mixin.create(Ember.MutableEnumerable,{sortProperties:null,sortAscending:!0,orderBy:function(r,n){var i=0,o=e(this,"sortProperties"),s=e(this,"sortAscending");return t(o,function(t){0===i&&(i=Ember.compare(e(r,t),e(n,t)),0===i||s||(i=-1*i))}),i},destroy:function(){var r=e(this,"content"),n=e(this,"sortProperties");return r&&n&&t(r,function(e){t(n,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),this._super()},isSorted:Ember.computed.bool("sortProperties"),arrangedContent:Ember.computed("content","sortProperties.@each",function(){var r=e(this,"content"),n=e(this,"isSorted"),i=e(this,"sortProperties"),o=this;return r&&n?(r=r.slice(),r.sort(function(e,t){return o.orderBy(e,t)}),t(r,function(e){t(i,function(t){Ember.addObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),Ember.A(r)):r}),_contentWillChange:Ember.beforeObserver(function(){var r=e(this,"content"),n=e(this,"sortProperties");r&&n&&t(r,function(e){t(n,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),this._super()},"content"),sortAscendingWillChange:Ember.beforeObserver(function(){this._lastSortAscending=e(this,"sortAscending")},"sortAscending"),sortAscendingDidChange:Ember.observer(function(){if(e(this,"sortAscending")!==this._lastSortAscending){var t=e(this,"arrangedContent");t.reverseObjects()}},"sortAscending"),contentArrayWillChange:function(r,n,i,o){var s=e(this,"isSorted");if(s){var a=e(this,"arrangedContent"),u=r.slice(n,n+i),c=e(this,"sortProperties");t(u,function(e){a.removeObject(e),t(c,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this)}return this._super(r,n,i,o)},contentArrayDidChange:function(r,n,i,o){var s=e(this,"isSorted"),a=e(this,"sortProperties");if(s){var u=r.slice(n,n+o);t(u,function(e){this.insertItemSorted(e),t(a,function(t){Ember.addObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this)}return this._super(r,n,i,o)},insertItemSorted:function(t){var r=e(this,"arrangedContent"),n=e(r,"length"),i=this._binarySearch(t,0,n);r.insertAt(i,t)},contentItemSortPropertyDidChange:function(t){var r=e(this,"arrangedContent"),n=r.indexOf(t),i=r.objectAt(n-1),o=r.objectAt(n+1),s=i&&this.orderBy(t,i),a=o&&this.orderBy(t,o);(0>s||a>0)&&(r.removeObject(t),this.insertItemSorted(t))},_binarySearch:function(t,r,n){var i,o,s,a;return r===n?r:(a=e(this,"arrangedContent"),i=r+Math.floor((n-r)/2),o=a.objectAt(i),s=this.orderBy(o,t),0>s?this._binarySearch(t,i+1,n):s>0?this._binarySearch(t,r,i):i)}})}(),function(){var e=Ember.get,t=(Ember.set,Ember.EnumerableUtils.forEach),r=Ember.EnumerableUtils.replace;Ember.ArrayController=Ember.ArrayProxy.extend(Ember.ControllerMixin,Ember.SortableMixin,{itemController:null,lookupItemController:function(){return e(this,"itemController")},objectAtContent:function(t){var r=e(this,"length"),n=e(this,"arrangedContent"),i=n&&n.objectAt(t);if(t>=0&&r>t){var o=this.lookupItemController(i);if(o)return this.controllerAt(t,i,o)}return i},arrangedContentDidChange:function(){this._super(),this._resetSubControllers()},arrayContentDidChange:function(n,i,o){var s=e(this,"_subControllers"),a=s.slice(n,n+i);t(a,function(e){e&&e.destroy()}),r(s,n,i,new Array(o)),this._super(n,i,o)},init:function(){this.get("content")||Ember.defineProperty(this,"content",void 0,Ember.A()),this._super(),this.set("_subControllers",Ember.A())},controllerAt:function(t,r,n){var i=e(this,"container"),o=e(this,"_subControllers"),s=o[t];if(s||(s=i.lookup("controller:"+n,{singleton:!1}),o[t]=s),!s)throw new Error('Could not resolve itemController: "'+n+'"');return s.set("target",this),s.set("parentController",e(this,"parentController")||this),s.set("content",r),s},_subControllers:null,_resetSubControllers:function(){var r=e(this,"_subControllers");r&&t(r,function(e){e&&e.destroy()}),this.set("_subControllers",Ember.A())}})}(),function(){Ember.ObjectController=Ember.ObjectProxy.extend(Ember.ControllerMixin)}(),function(){var e=Ember.imports.jQuery;Ember.$=e}(),function(){if(Ember.$){var e=Ember.String.w("dragstart drag dragenter dragleave dragover drop dragend");Ember.EnumerableUtils.forEach(e,function(e){Ember.$.event.fixHooks[e]={props:["dataTransfer"]}})}}(),function(){function e(e){var t=e.shiftKey||e.metaKey||e.altKey||e.ctrlKey,r=e.which>1;return!t&&!r}var t=this.document&&function(){var e=document.createElement("div");return e.innerHTML="<div></div>",e.firstChild.innerHTML="<script></script>",""===e.firstChild.innerHTML}(),r=this.document&&function(){var e=document.createElement("div");return e.innerHTML="Test: <script type='text/x-placeholder'></script>Value","Test:"===e.childNodes[0].nodeValue&&" Value"===e.childNodes[2].nodeValue}(),n=function(e,t){if(e.getAttribute("id")===t)return e;var r,i,o,s=e.childNodes.length;for(r=0;s>r;r++)if(i=e.childNodes[r],o=1===i.nodeType&&n(i,t))return o},i=function(e,i){t&&(i="&shy;"+i);var o=[];if(r&&(i=i.replace(/(\s+)(<script id='([^']+)')/g,function(e,t,r,n){return o.push([n,t]),r})),e.innerHTML=i,o.length>0){var s,a=o.length;for(s=0;a>s;s++){var u=n(e,o[s][0]),c=document.createTextNode(o[s][1]);u.parentNode.insertBefore(c,u)}}if(t){for(var l=e.firstChild;1===l.nodeType&&!l.nodeName;)l=l.firstChild;3===l.nodeType&&"­"===l.nodeValue.charAt(0)&&(l.nodeValue=l.nodeValue.slice(1))}},o={},s=function(e){if(void 0!==o[e])return o[e];var t=!0;if("select"===e.toLowerCase()){var r=document.createElement("select");i(r,'<option value="test">Test</option>'),t=1===r.options.length}return o[e]=t,t},a=function(e,t){var r=e.tagName;if(s(r))i(e,t);else{var n=e.outerHTML||(new XMLSerializer).serializeToString(e),o=n.match(new RegExp("<"+r+"([^>]*)>","i"))[0],a="</"+r+">",u=document.createElement("div");for(i(u,o+t+a),e=u.firstChild;e.tagName!==r;)e=e.nextSibling}return e};Ember.ViewUtils={setInnerHTML:a,isSimpleClick:e}}(),function(){Ember.get,Ember.set;var e=function(){this.seen={},this.list=[]};e.prototype={add:function(e){e in this.seen||(this.seen[e]=!0,this.list.push(e))},toDOM:function(){return this.list.join(" ")}},Ember.RenderBuffer=function(e){return new Ember._RenderBuffer(e)},Ember._RenderBuffer=function(e){this.tagNames=[e||null],this.buffer=""},Ember._RenderBuffer.prototype={_element:null,_hasElement:!0,elementClasses:null,classes:null,elementId:null,elementAttributes:null,elementProperties:null,elementTag:null,elementStyle:null,parentBuffer:null,push:function(e){return this.buffer+=e,this},addClass:function(t){return this.elementClasses=this.elementClasses||new e,this.elementClasses.add(t),this.classes=this.elementClasses.list,this},setClasses:function(e){this.classes=e},id:function(e){return this.elementId=e,this},attr:function(e,t){var r=this.elementAttributes=this.elementAttributes||{};return 1===arguments.length?r[e]:(r[e]=t,this)},removeAttr:function(e){var t=this.elementAttributes;return t&&delete t[e],this},prop:function(e,t){var r=this.elementProperties=this.elementProperties||{};return 1===arguments.length?r[e]:(r[e]=t,this)},removeProp:function(e){var t=this.elementProperties;return t&&delete t[e],this},style:function(e,t){return this.elementStyle=this.elementStyle||{},this.elementStyle[e]=t,this},begin:function(e){return this.tagNames.push(e||null),this},pushOpeningTag:function(){var e=this.currentTagName();if(e){if(this._hasElement&&!this._element&&0===this.buffer.length)return this._element=this.generateElement(),void 0;var t,r,n=this.buffer,i=this.elementId,o=this.classes,s=this.elementAttributes,a=this.elementProperties,u=this.elementStyle;if(n+="<"+e,i&&(n+=' id="'+this._escapeAttribute(i)+'"',this.elementId=null),o&&(n+=' class="'+this._escapeAttribute(o.join(" "))+'"',this.classes=null),u){n+=' style="';for(r in u)u.hasOwnProperty(r)&&(n+=r+":"+this._escapeAttribute(u[r])+";");n+='"',this.elementStyle=null}if(s){for(t in s)s.hasOwnProperty(t)&&(n+=" "+t+'="'+this._escapeAttribute(s[t])+'"');this.elementAttributes=null}if(a){for(r in a)if(a.hasOwnProperty(r)){var c=a[r];(c||"number"==typeof c)&&(n+=c===!0?" "+r+'="'+r+'"':" "+r+'="'+this._escapeAttribute(a[r])+'"')}this.elementProperties=null}n+=">",this.buffer=n}},pushClosingTag:function(){var e=this.tagNames.pop();e&&(this.buffer+="</"+e+">")},currentTagName:function(){return this.tagNames[this.tagNames.length-1]},generateElement:function(){var e,t,r=this.tagNames.pop(),n=document.createElement(r),i=Ember.$(n),o=this.elementId,s=this.classes,a=this.elementAttributes,u=this.elementProperties,c=this.elementStyle,l="";if(o&&(i.attr("id",o),this.elementId=null),s&&(i.attr("class",s.join(" ")),this.classes=null),c){for(t in c)c.hasOwnProperty(t)&&(l+=t+":"+c[t]+";");
i.attr("style",l),this.elementStyle=null}if(a){for(e in a)a.hasOwnProperty(e)&&i.attr(e,a[e]);this.elementAttributes=null}if(u){for(t in u)u.hasOwnProperty(t)&&i.prop(t,u[t]);this.elementProperties=null}return n},element:function(){var e=this.innerString();return e&&(this._element=Ember.ViewUtils.setInnerHTML(this._element,e)),this._element},string:function(){if(this._hasElement&&this._element){var e=this.element(),t=e.outerHTML;return"undefined"==typeof t?Ember.$("<div/>").append(e).html():t}return this.innerString()},innerString:function(){return this.buffer},_escapeAttribute:function(e){var t={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},r=/&(?!\w+;)|[<>"'`]/g,n=/[&<>"'`]/,i=function(e){return t[e]||"&amp;"},o=e.toString();return n.test(o)?o.replace(r,i):o}}}(),function(){var e=Ember.get,t=Ember.set;Ember.String.fmt,Ember.EventDispatcher=Ember.Object.extend({rootElement:"body",setup:function(r,n){var i,o={touchstart:"touchStart",touchmove:"touchMove",touchend:"touchEnd",touchcancel:"touchCancel",keydown:"keyDown",keyup:"keyUp",keypress:"keyPress",mousedown:"mouseDown",mouseup:"mouseUp",contextmenu:"contextMenu",click:"click",dblclick:"doubleClick",mousemove:"mouseMove",focusin:"focusIn",focusout:"focusOut",mouseenter:"mouseEnter",mouseleave:"mouseLeave",submit:"submit",input:"input",change:"change",dragstart:"dragStart",drag:"drag",dragenter:"dragEnter",dragleave:"dragLeave",dragover:"dragOver",drop:"drop",dragend:"dragEnd"};Ember.$.extend(o,r||{}),Ember.isNone(n)||t(this,"rootElement",n),n=Ember.$(e(this,"rootElement")),n.addClass("ember-application");for(i in o)o.hasOwnProperty(i)&&this.setupHandler(n,i,o[i])},setupHandler:function(e,t,r){var n=this;e.on(t+".ember",".ember-view",function(e,t){return Ember.handleErrors(function(){var i=Ember.View.views[this.id],o=!0,s=null;return s=n._findNearestEventManager(i,r),s&&s!==t?o=n._dispatchEvent(s,e,r,i):i?o=n._bubbleEvent(i,e,r):e.stopPropagation(),o},this)}),e.on(t+".ember","[data-ember-action]",function(e){return Ember.handleErrors(function(){var t=Ember.$(e.currentTarget).attr("data-ember-action"),n=Ember.Handlebars.ActionHelper.registeredActions[t];return n&&n.eventName===r?n.handler(e):void 0},this)})},_findNearestEventManager:function(t,r){for(var n=null;t&&(n=e(t,"eventManager"),!n||!n[r]);)t=e(t,"parentView");return n},_dispatchEvent:function(e,t,r,n){var i=!0,o=e[r];return"function"===Ember.typeOf(o)?(i=o.call(e,t,n),t.stopPropagation()):i=this._bubbleEvent(n,t,r),i},_bubbleEvent:function(e,t,r){return Ember.run(function(){return e.handleEvent(r,t)})},destroy:function(){var t=e(this,"rootElement");return Ember.$(t).off(".ember","**").removeClass("ember-application"),this._super()}})}(),function(){var e=Ember.run.backburner.queueNames,t=Ember.ArrayPolyfills.indexOf;e.splice(t.call(e,"actions")+1,0,"render","afterRender")}(),function(){var e=Ember.get,t=Ember.set;Ember.ControllerMixin.reopen({target:null,namespace:null,view:null,container:null,_childContainers:null,init:function(){this._super(),t(this,"_childContainers",{})},_modelDidChange:Ember.observer(function(){var r=e(this,"_childContainers");for(var n in r)r.hasOwnProperty(n)&&r[n].destroy();t(this,"_childContainers",{})},"model")})}(),function(){function e(){Ember.run.once(Ember.View,"notifyMutationListeners")}var t={},r=Ember.get,n=Ember.set,i=Ember.guidFor,o=Ember.EnumerableUtils.forEach,s=Ember.EnumerableUtils.addObject,a=Ember.computed(function(){var e=this._childViews,t=Ember.A(),n=this;return o(e,function(e){e.isVirtual?t.pushObjects(r(e,"childViews")):t.push(e)}),t.replace=function(e,t,r){if(n instanceof Ember.ContainerView)return n.replace(e,t,r);throw new Error("childViews is immutable")},t});Ember.TEMPLATES={},Ember.CoreView=Ember.Object.extend(Ember.Evented,{isView:!0,states:t,init:function(){this._super(),this.transitionTo("preRender")},parentView:Ember.computed(function(){var e=this._parentView;return e&&e.isVirtual?r(e,"parentView"):e}).property("_parentView"),state:null,_parentView:null,concreteView:Ember.computed(function(){return this.isVirtual?r(this,"parentView"):this}).property("parentView"),instrumentName:"core_view",instrumentDetails:function(e){e.object=this.toString()},renderToBuffer:function(e,t){var r="render."+this.instrumentName,n={};return this.instrumentDetails(n),Ember.instrument(r,n,function(){return this._renderToBuffer(e,t)},this)},_renderToBuffer:function(e){var t=this.tagName;(null===t||void 0===t)&&(t="div");var r=this.buffer=e&&e.begin(t)||Ember.RenderBuffer(t);return this.transitionTo("inBuffer",!1),this.beforeRender(r),this.render(r),this.afterRender(r),r},trigger:function(e){this._super.apply(this,arguments);var t=this[e];if(t){var r,n,i=[];for(r=1,n=arguments.length;n>r;r++)i.push(arguments[r]);return t.apply(this,i)}},has:function(e){return"function"===Ember.typeOf(this[e])||this._super(e)},destroy:function(){var e=this._parentView;if(this._super())return this.removedFromDOM||this.destroyElement(),e&&e.removeChild(this),this.transitionTo("destroying",!1),this},clearRenderedChildren:Ember.K,triggerRecursively:Ember.K,invokeRecursively:Ember.K,transitionTo:Ember.K,destroyElement:Ember.K});var u=Ember._ViewCollection=function(e){var t=this.views=e||[];this.length=t.length};u.prototype={length:0,trigger:function(e){for(var t,r=this.views,n=0,i=r.length;i>n;n++)t=r[n],t.trigger&&t.trigger(e)},triggerRecursively:function(e){for(var t=this.views,r=0,n=t.length;n>r;r++)t[r].triggerRecursively(e)},invokeRecursively:function(e){for(var t,r=this.views,n=0,i=r.length;i>n;n++)t=r[n],e(t)},transitionTo:function(e,t){for(var r=this.views,n=0,i=r.length;i>n;n++)r[n].transitionTo(e,t)},push:function(){this.length+=arguments.length;var e=this.views;return e.push.apply(e,arguments)},objectAt:function(e){return this.views[e]},forEach:function(e){var t=this.views;return o(t,e)},clear:function(){this.length=0,this.views.length=0}};var c=[];Ember.View=Ember.CoreView.extend({concatenatedProperties:["classNames","classNameBindings","attributeBindings"],isView:!0,templateName:null,layoutName:null,templates:Ember.TEMPLATES,template:Ember.computed(function(e,t){if(void 0!==t)return t;var n=r(this,"templateName"),i=this.templateForName(n,"template");return i||r(this,"defaultTemplate")}).property("templateName"),controller:Ember.computed(function(){var e=r(this,"_parentView");return e?r(e,"controller"):null}).property("_parentView"),layout:Ember.computed(function(){var e=r(this,"layoutName"),t=this.templateForName(e,"layout");return t||r(this,"defaultLayout")}).property("layoutName"),templateForName:function(e){if(e){var t=this.container||Ember.Container&&Ember.Container.defaultContainer;return t&&t.lookup("template:"+e)}},context:Ember.computed(function(e,t){return 2===arguments.length?(n(this,"_context",t),t):r(this,"_context")}).volatile(),_context:Ember.computed(function(){var e,t;return(t=r(this,"controller"))?t:(e=this._parentView,e?r(e,"_context"):null)}),_contextDidChange:Ember.observer(function(){this.rerender()},"context"),isVisible:!0,childViews:a,_childViews:c,_childViewsWillChange:Ember.beforeObserver(function(){if(this.isVirtual){var e=r(this,"parentView");e&&Ember.propertyWillChange(e,"childViews")}},"childViews"),_childViewsDidChange:Ember.observer(function(){if(this.isVirtual){var e=r(this,"parentView");e&&Ember.propertyDidChange(e,"childViews")}},"childViews"),nearestInstanceOf:function(e){for(var t=r(this,"parentView");t;){if(t instanceof e)return t;t=r(t,"parentView")}},nearestOfType:function(e){for(var t=r(this,"parentView"),n=e instanceof Ember.Mixin?function(t){return e.detect(t)}:function(t){return e.detect(t.constructor)};t;){if(n(t))return t;t=r(t,"parentView")}},nearestWithProperty:function(e){for(var t=r(this,"parentView");t;){if(e in t)return t;t=r(t,"parentView")}},nearestChildOf:function(e){for(var t=r(this,"parentView");t;){if(r(t,"parentView")instanceof e)return t;t=r(t,"parentView")}},_parentViewDidChange:Ember.observer(function(){this.isDestroying||r(this,"parentView.controller")&&!r(this,"controller")&&this.notifyPropertyChange("controller")},"_parentView"),_controllerDidChange:Ember.observer(function(){this.isDestroying||(this.rerender(),this.forEachChildView(function(e){e.propertyDidChange("controller")}))},"controller"),cloneKeywords:function(){var e=r(this,"templateData"),t=e?Ember.copy(e.keywords):{};return n(t,"view",r(this,"concreteView")),n(t,"_view",this),n(t,"controller",r(this,"controller")),t},render:function(e){var t=r(this,"layout")||r(this,"template");if(t){var n,i=r(this,"context"),o=this.cloneKeywords(),s={view:this,buffer:e,isRenderData:!0,keywords:o,insideGroup:r(this,"templateData.insideGroup")};n=t(i,{data:s}),void 0!==n&&e.push(n)}},rerender:function(){return this.currentState.rerender(this)},clearRenderedChildren:function(){for(var e=this.lengthBeforeRender,t=this.lengthAfterRender,r=this._childViews,n=t-1;n>=e;n--)r[n]&&r[n].destroy()},_applyClassNameBindings:function(e){var t,r,n,i=this.classNames;o(e,function(e){var o,a=Ember.View._parsePropertyPath(e),u=function(){r=this._classStringForProperty(e),t=this.$(),o&&(t.removeClass(o),i.removeObject(o)),r?(t.addClass(r),o=r):o=null};n=this._classStringForProperty(e),n&&(s(i,n),o=n),this.registerObserver(this,a.path,u),this.one("willClearRender",function(){o&&(i.removeObject(o),o=null)})},this)},_applyAttributeBindings:function(e,t){var n,i;o(t,function(t){var o=t.split(":"),s=o[0],a=o[1]||s,u=function(){i=this.$(),n=r(this,s),Ember.View.applyAttributeBindings(i,a,n)};this.registerObserver(this,s,u),n=r(this,s),Ember.View.applyAttributeBindings(e,a,n)},this)},_classStringForProperty:function(e){var t=Ember.View._parsePropertyPath(e),n=t.path,i=r(this,n);return void 0===i&&Ember.isGlobalPath(n)&&(i=r(Ember.lookup,n)),Ember.View._classStringForValue(n,i,t.className,t.falsyClassName)},element:Ember.computed(function(e,t){return void 0!==t?this.currentState.setElement(this,t):this.currentState.getElement(this)}).property("_parentView"),$:function(e){return this.currentState.$(this,e)},mutateChildViews:function(e){for(var t,r=this._childViews,n=r.length;--n>=0;)t=r[n],e(this,t,n);return this},forEachChildView:function(e){var t=this._childViews;if(!t)return this;var r,n,i=t.length;for(n=0;i>n;n++)r=t[n],e(r);return this},appendTo:function(e){return this._insertElementLater(function(){this.$().appendTo(e)}),this},replaceIn:function(e){return this._insertElementLater(function(){Ember.$(e).empty(),this.$().appendTo(e)}),this},_insertElementLater:function(e){this._scheduledInsert=Ember.run.scheduleOnce("render",this,"_insertElement",e)},_insertElement:function(e){this._scheduledInsert=null,this.currentState.insertElement(this,e)},append:function(){return this.appendTo(document.body)},remove:function(){this.removedFromDOM||this.destroyElement(),this.invokeRecursively(function(e){e.clearRenderedChildren&&e.clearRenderedChildren()})},elementId:null,findElementInParentElement:function(e){var t="#"+this.elementId;return Ember.$(t)[0]||Ember.$(t,e)[0]},createElement:function(){if(r(this,"element"))return this;var e=this.renderToBuffer();return n(this,"element",e.element()),this},willInsertElement:Ember.K,didInsertElement:Ember.K,willClearRender:Ember.K,invokeRecursively:function(e,t){for(var r,n,i=t===!1?this._childViews:[this];i.length;){r=i.slice(),i=[];for(var o=0,s=r.length;s>o;o++)n=r[o],e(n),n._childViews&&i.push.apply(i,n._childViews)}},triggerRecursively:function(e){for(var t,r,n=[this];n.length;){t=n.slice(),n=[];for(var i=0,o=t.length;o>i;i++)r=t[i],r.trigger&&r.trigger(e),r._childViews&&n.push.apply(n,r._childViews)}},viewHierarchyCollection:function(){for(var e,t=new u([this]),r=0;t.length>r;r++)e=t.objectAt(r),e._childViews&&t.push.apply(t,e._childViews);return t},destroyElement:function(){return this.currentState.destroyElement(this)},willDestroyElement:function(){},_notifyWillDestroyElement:function(){var e=this.viewHierarchyCollection();return e.trigger("willClearRender"),e.trigger("willDestroyElement"),e},_elementWillChange:Ember.beforeObserver(function(){this.forEachChildView(function(e){Ember.propertyWillChange(e,"element")})},"element"),_elementDidChange:Ember.observer(function(){this.forEachChildView(function(e){Ember.propertyDidChange(e,"element")})},"element"),parentViewDidChange:Ember.K,instrumentName:"view",instrumentDetails:function(e){e.template=r(this,"templateName"),this._super(e)},_renderToBuffer:function(e,t){this.lengthBeforeRender=this._childViews.length;var r=this._super(e,t);return this.lengthAfterRender=this._childViews.length,r},renderToBufferIfNeeded:function(e){return this.currentState.renderToBufferIfNeeded(this,e)},beforeRender:function(e){this.applyAttributesToBuffer(e),e.pushOpeningTag()},afterRender:function(e){e.pushClosingTag()},applyAttributesToBuffer:function(e){var t=r(this,"classNameBindings");t.length&&this._applyClassNameBindings(t);var n=r(this,"attributeBindings");n.length&&this._applyAttributeBindings(e,n),e.setClasses(this.classNames),e.id(this.elementId);var i=r(this,"ariaRole");i&&e.attr("role",i),r(this,"isVisible")===!1&&e.style("display","none")},tagName:null,ariaRole:null,classNames:["ember-view"],classNameBindings:c,attributeBindings:c,init:function(){this.elementId=this.elementId||i(this),this._super(),this._childViews=this._childViews.slice(),this.classNameBindings=Ember.A(this.classNameBindings.slice()),this.classNames=Ember.A(this.classNames.slice());var e=r(this,"viewController");e&&(e=r(e),e&&n(e,"view",this))},appendChild:function(e,t){return this.currentState.appendChild(this,e,t)},removeChild:function(e){if(!this.isDestroying){n(e,"_parentView",null);var t=this._childViews;return Ember.EnumerableUtils.removeObject(t,e),this.propertyDidChange("childViews"),this}},removeAllChildren:function(){return this.mutateChildViews(function(e,t){e.removeChild(t)})},destroyAllChildren:function(){return this.mutateChildViews(function(e,t){t.destroy()})},removeFromParent:function(){var e=this._parentView;return this.remove(),e&&e.removeChild(this),this},destroy:function(){var e,t,n=this._childViews,i=r(this,"parentView"),o=this.viewName;if(this._super()){for(e=n.length,t=e-1;t>=0;t--)n[t].removedFromDOM=!0;for(o&&i&&i.set(o,null),e=n.length,t=e-1;t>=0;t--)n[t].destroy();return this}},createChildView:function(e,t){return e.isView&&e._parentView===this?e:(Ember.CoreView.detect(e)?(t=t||{},t._parentView=this,t.container=this.container,t.templateData=t.templateData||r(this,"templateData"),e=e.create(t),e.viewName&&n(r(this,"concreteView"),e.viewName,e)):(t&&e.setProperties(t),r(e,"templateData")||n(e,"templateData",r(this,"templateData")),n(e,"_parentView",this)),e)},becameVisible:Ember.K,becameHidden:Ember.K,_isVisibleDidChange:Ember.observer(function(){var e=this.$();if(e){var t=r(this,"isVisible");e.toggle(t),this._isAncestorHidden()||(t?this._notifyBecameVisible():this._notifyBecameHidden())}},"isVisible"),_notifyBecameVisible:function(){this.trigger("becameVisible"),this.forEachChildView(function(e){var t=r(e,"isVisible");(t||null===t)&&e._notifyBecameVisible()})},_notifyBecameHidden:function(){this.trigger("becameHidden"),this.forEachChildView(function(e){var t=r(e,"isVisible");(t||null===t)&&e._notifyBecameHidden()})},_isAncestorHidden:function(){for(var e=r(this,"parentView");e;){if(r(e,"isVisible")===!1)return!0;e=r(e,"parentView")}return!1},clearBuffer:function(){this.invokeRecursively(function(e){e.buffer=null})},transitionTo:function(e,t){var r=this.currentState,n=this.currentState=this.states[e];this.state=e,r&&r.exit&&r.exit(this),n.enter&&n.enter(this),t!==!1&&this.forEachChildView(function(t){t.transitionTo(e)})},handleEvent:function(e,t){return this.currentState.handleEvent(this,e,t)},registerObserver:function(e,t,r,n){n||"function"!=typeof r||(n=r,r=null);var i=this,o=function(){i.currentState.invokeObserver(this,n)},s=function(){Ember.run.scheduleOnce("render",this,o)};Ember.addObserver(e,t,r,s),this.one("willClearRender",function(){Ember.removeObserver(e,t,r,s)})}});var l={prepend:function(t,r){t.$().prepend(r),e()},after:function(t,r){t.$().after(r),e()},html:function(t,r){t.$().html(r),e()},replace:function(t){var i=r(t,"element");n(t,"element",null),t._insertElementLater(function(){Ember.$(i).replaceWith(r(t,"element")),e()})},remove:function(t){t.$().remove(),e()},empty:function(t){t.$().empty(),e()}};Ember.View.reopen({domManager:l}),Ember.View.reopenClass({_parsePropertyPath:function(e){var t,r,n=e.split(":"),i=n[0],o="";return n.length>1&&(t=n[1],3===n.length&&(r=n[2]),o=":"+t,r&&(o+=":"+r)),{path:i,classNames:o,className:""===t?void 0:t,falsyClassName:r}},_classStringForValue:function(e,t,r,n){if(r||n)return r&&t?r:n&&!t?n:null;if(t===!0){var i=e.split(".");return Ember.String.dasherize(i[i.length-1])}return t!==!1&&void 0!==t&&null!==t?t:null}});var h=Ember.Object.extend(Ember.Evented).create();Ember.View.addMutationListener=function(e){h.on("change",e)},Ember.View.removeMutationListener=function(e){h.off("change",e)},Ember.View.notifyMutationListeners=function(){h.trigger("change")},Ember.View.views={},Ember.View.childViewsProperty=a,Ember.View.applyAttributeBindings=function(e,t,r){var n=Ember.typeOf(r);"value"===t||"string"!==n&&("number"!==n||isNaN(r))?"value"===t||"boolean"===n?(void 0===r&&(r=null),r!==e.prop(t)&&e.prop(t,r)):r||e.removeAttr(t):r!==e.attr(t)&&e.attr(t,r)},Ember.View.states=t}(),function(){var e=(Ember.get,Ember.set);Ember.View.states._default={appendChild:function(){throw"You can't use appendChild outside of the rendering process"},$:function(){return void 0},getElement:function(){return null},handleEvent:function(){return!0},destroyElement:function(t){return e(t,"element",null),t._scheduledInsert&&(Ember.run.cancel(t._scheduledInsert),t._scheduledInsert=null),t},renderToBufferIfNeeded:function(){return!1},rerender:Ember.K,invokeObserver:Ember.K}}(),function(){var e=Ember.View.states.preRender=Ember.create(Ember.View.states._default);Ember.merge(e,{insertElement:function(e,t){e.createElement();var r=e.viewHierarchyCollection();r.trigger("willInsertElement"),t.call(e),r.transitionTo("inDOM",!1),r.trigger("didInsertElement")},renderToBufferIfNeeded:function(e,t){return e.renderToBuffer(t),!0},empty:Ember.K,setElement:function(e,t){return null!==t&&e.transitionTo("hasElement"),t}})}(),function(){Ember.get,Ember.set;var e=Ember.View.states.inBuffer=Ember.create(Ember.View.states._default);Ember.merge(e,{$:function(e){return e.rerender(),Ember.$()},rerender:function(){throw new Ember.Error("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM.")},appendChild:function(e,t,r){var n=e.buffer,i=e._childViews;return t=e.createChildView(t,r),i.length||(i=e._childViews=i.slice()),i.push(t),t.renderToBuffer(n),e.propertyDidChange("childViews"),t},destroyElement:function(e){e.clearBuffer();var t=e._notifyWillDestroyElement();return t.transitionTo("preRender",!1),e},empty:function(){},renderToBufferIfNeeded:function(){return!1},insertElement:function(){throw"You can't insert an element that has already been rendered"},setElement:function(e,t){return null===t?e.transitionTo("preRender"):(e.clearBuffer(),e.transitionTo("hasElement")),t},invokeObserver:function(e,t){t.call(e)}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.View.states.hasElement=Ember.create(Ember.View.states._default);Ember.merge(r,{$:function(t,r){var n=e(t,"element");return r?Ember.$(r,n):Ember.$(n)},getElement:function(t){var r=e(t,"parentView");return r&&(r=e(r,"element")),r?t.findElementInParentElement(r):Ember.$("#"+e(t,"elementId"))[0]},setElement:function(e,t){if(null!==t)throw"You cannot set an element to a non-null value when the element is already in the DOM.";return e.transitionTo("preRender"),t},rerender:function(e){return e.triggerRecursively("willClearRender"),e.clearRenderedChildren(),e.domManager.replace(e),e},destroyElement:function(e){return e._notifyWillDestroyElement(),e.domManager.remove(e),t(e,"element",null),e._scheduledInsert&&(Ember.run.cancel(e._scheduledInsert),e._scheduledInsert=null),e},empty:function(e){var t,r,n=e._childViews;if(n)for(t=n.length,r=0;t>r;r++)n[r]._notifyWillDestroyElement();e.domManager.empty(e)},handleEvent:function(e,t,r){return e.has(t)?e.trigger(t,r):!0},invokeObserver:function(e,t){t.call(e)}});var n=Ember.View.states.inDOM=Ember.create(r);Ember.merge(n,{enter:function(e){e.isVirtual||(Ember.View.views[e.elementId]=e),e.addBeforeObserver("elementId",function(){throw new Error("Changing a view's elementId after creation is not allowed")})},exit:function(e){this.isVirtual||delete Ember.View.views[e.elementId]},insertElement:function(){throw"You can't insert an element into the DOM that has already been inserted"}})}(),function(){var e="You can't call %@ on a view being destroyed",t=Ember.String.fmt,r=Ember.View.states.destroying=Ember.create(Ember.View.states._default);Ember.merge(r,{appendChild:function(){throw t(e,["appendChild"])},rerender:function(){throw t(e,["rerender"])},destroyElement:function(){throw t(e,["destroyElement"])},empty:function(){throw t(e,["empty"])},setElement:function(){throw t(e,["set('element', ...)"])},renderToBufferIfNeeded:function(){return!1},insertElement:Ember.K})}(),function(){Ember.View.cloneStates=function(e){var t={};t._default={},t.preRender=Ember.create(t._default),t.destroying=Ember.create(t._default),t.inBuffer=Ember.create(t._default),t.hasElement=Ember.create(t._default),t.inDOM=Ember.create(t.hasElement);for(var r in e)e.hasOwnProperty(r)&&Ember.merge(t[r],e[r]);return t}}(),function(){function e(e,t,r,n){t.triggerRecursively("willInsertElement"),r?r.domManager.after(r,n.string()):e.domManager.prepend(e,n.string()),t.forEach(function(e){e.transitionTo("inDOM"),e.propertyDidChange("element"),e.triggerRecursively("didInsertElement")})}var t=Ember.View.cloneStates(Ember.View.states),r=Ember.get,n=Ember.set,i=Ember.EnumerableUtils.forEach,o=Ember._ViewCollection;Ember.ContainerView=Ember.View.extend(Ember.MutableArray,{states:t,init:function(){this._super();var e=r(this,"childViews");Ember.defineProperty(this,"childViews",Ember.View.childViewsProperty);var t=this._childViews;i(e,function(e,i){var o;"string"==typeof e?(o=r(this,e),o=this.createChildView(o),n(this,e,o)):o=this.createChildView(e),t[i]=o},this);var o=r(this,"currentView");o&&(t.length||(t=this._childViews=this._childViews.slice()),t.push(this.createChildView(o)))},replace:function(e,t,n){var i=n?r(n,"length"):0;if(this.arrayContentWillChange(e,t,i),this.childViewsWillChange(this._childViews,e,t),0===i)this._childViews.splice(e,t);else{var o=[e,t].concat(n);n.length&&!this._childViews.length&&(this._childViews=this._childViews.slice()),this._childViews.splice.apply(this._childViews,o)}return this.arrayContentDidChange(e,t,i),this.childViewsDidChange(this._childViews,e,t,i),this},objectAt:function(e){return this._childViews[e]},length:Ember.computed(function(){return this._childViews.length}),render:function(e){this.forEachChildView(function(t){t.renderToBuffer(e)})},instrumentName:"container",childViewsWillChange:function(e,t,r){if(this.propertyWillChange("childViews"),r>0){var n=e.slice(t,t+r);this.currentState.childViewsWillChange(this,e,t,r),this.initializeViews(n,null,null)}},removeChild:function(e){return this.removeObject(e),this},childViewsDidChange:function(e,t,n,i){if(i>0){var o=e.slice(t,t+i);this.initializeViews(o,this,r(this,"templateData")),this.currentState.childViewsDidChange(this,e,t,i)}this.propertyDidChange("childViews")},initializeViews:function(e,t,o){i(e,function(e){n(e,"_parentView",t),r(e,"templateData")||n(e,"templateData",o)})},currentView:null,_currentViewWillChange:Ember.beforeObserver(function(){var e=r(this,"currentView");e&&e.destroy()},"currentView"),_currentViewDidChange:Ember.observer(function(){var e=r(this,"currentView");e&&this.pushObject(e)},"currentView"),_ensureChildrenAreInDOM:function(){this.currentState.ensureChildrenAreInDOM(this)}}),Ember.merge(t._default,{childViewsWillChange:Ember.K,childViewsDidChange:Ember.K,ensureChildrenAreInDOM:Ember.K}),Ember.merge(t.inBuffer,{childViewsDidChange:function(){throw new Error("You cannot modify child views while in the inBuffer state")}}),Ember.merge(t.hasElement,{childViewsWillChange:function(e,t,r,n){for(var i=r;r+n>i;i++)t[i].remove()},childViewsDidChange:function(e){Ember.run.scheduleOnce("render",e,"_ensureChildrenAreInDOM")},ensureChildrenAreInDOM:function(t){var r,n,i,s,a,u=t._childViews,c=new o;for(r=0,n=u.length;n>r;r++)i=u[r],a||(a=Ember.RenderBuffer(),a._hasElement=!1),i.renderToBufferIfNeeded(a)?c.push(i):c.length?(e(t,c,s,a),a=null,s=i,c.clear()):s=i;c.length&&e(t,c,s,a)}})}(),function(){var e=Ember.get,t=Ember.set;Ember.String.fmt,Ember.CollectionView=Ember.ContainerView.extend({content:null,emptyViewClass:Ember.View,emptyView:null,itemViewClass:Ember.View,init:function(){var e=this._super();return this._contentDidChange(),e},_contentWillChange:Ember.beforeObserver(function(){var t=this.get("content");t&&t.removeArrayObserver(this);var r=t?e(t,"length"):0;this.arrayWillChange(t,0,r)},"content"),_contentDidChange:Ember.observer(function(){var t=e(this,"content");t&&t.addArrayObserver(this);var r=t?e(t,"length"):0;this.arrayDidChange(t,0,null,r)},"content"),destroy:function(){if(this._super()){var t=e(this,"content");return t&&t.removeArrayObserver(this),this._createdEmptyView&&this._createdEmptyView.destroy(),this}},arrayWillChange:function(t,r,n){var i=e(this,"emptyView");i&&i instanceof Ember.View&&i.removeFromParent();var o,s,a,u=this._childViews;a=this._childViews.length;var c=n===a;for(c&&(this.currentState.empty(this),this.invokeRecursively(function(e){e.removedFromDOM=!0},!1)),s=r+n-1;s>=r;s--)o=u[s],o.destroy()},arrayDidChange:function(r,n,i,o){var s,a,u,c,l=e(this,"itemViewClass"),h=[];if("string"==typeof l&&(l=e(l)),c=r?e(r,"length"):0)for(u=n;n+o>u;u++)a=r.objectAt(u),s=this.createChildView(l,{content:a,contentIndex:u}),h.push(s);else{var m=e(this,"emptyView");if(!m)return;var f=Ember.CoreView.detect(m);m=this.createChildView(m),h.push(m),t(this,"emptyView",m),f&&(this._createdEmptyView=m)}this.replace(n,0,h)},createChildView:function(r,n){r=this._super(r,n);var i=e(r,"tagName"),o=null===i||void 0===i?Ember.CollectionView.CONTAINER_MAP[e(this,"tagName")]:i;return t(r,"tagName",o),r}}),Ember.CollectionView.CONTAINER_MAP={ul:"li",ol:"li",table:"tr",thead:"tr",tbody:"tr",tfoot:"tr",tr:"td",select:"option"}}(),function(){Ember.ViewTargetActionSupport=Ember.Mixin.create(Ember.TargetActionSupport,{target:Ember.computed.alias("controller"),actionContext:Ember.computed.alias("context")})}(),function(){e("metamorph",[],function(){"use strict";// Copyright: ©2011 My Company Inc. All rights reserved.
var e=function(){},t=0,r=this.document,n=r&&"createRange"in r&&"undefined"!=typeof Range&&Range.prototype.createContextualFragment,i=r&&function(){var e=r.createElement("div");return e.innerHTML="<div></div>",e.firstChild.innerHTML="<script></script>",""===e.firstChild.innerHTML}(),o=r&&function(){var e=r.createElement("div");return e.innerHTML="Test: <script type='text/x-placeholder'></script>Value","Test:"===e.childNodes[0].nodeValue&&" Value"===e.childNodes[2].nodeValue}(),s=function(r){var n;n=this instanceof s?this:new e,n.innerHTML=r;var i="metamorph-"+t++;return n.start=i+"-start",n.end=i+"-end",n};e.prototype=s.prototype;var a,u,c,l,h,m,f,p,d;if(l=function(){return this.startTag()+this.innerHTML+this.endTag()},p=function(){return"<script id='"+this.start+"' type='text/x-placeholder'></script>"},d=function(){return"<script id='"+this.end+"' type='text/x-placeholder'></script>"},n)a=function(e,t){var n=r.createRange(),i=r.getElementById(e.start),o=r.getElementById(e.end);return t?(n.setStartBefore(i),n.setEndAfter(o)):(n.setStartAfter(i),n.setEndBefore(o)),n},u=function(e,t){var r=a(this,t);r.deleteContents();var n=r.createContextualFragment(e);r.insertNode(n)},c=function(){var e=a(this,!0);e.deleteContents()},h=function(e){var t=r.createRange();t.setStart(e),t.collapse(!1);var n=t.createContextualFragment(this.outerHTML());e.appendChild(n)},m=function(e){var t=r.createRange(),n=r.getElementById(this.end);t.setStartAfter(n),t.setEndAfter(n);var i=t.createContextualFragment(e);t.insertNode(i)},f=function(e){var t=r.createRange(),n=r.getElementById(this.start);t.setStartAfter(n),t.setEndAfter(n);var i=t.createContextualFragment(e);t.insertNode(i)};else{var b={select:[1,"<select multiple='multiple'>","</select>"],fieldset:[1,"<fieldset>","</fieldset>"],table:[1,"<table>","</table>"],tbody:[2,"<table><tbody>","</tbody></table>"],tr:[3,"<table><tbody><tr>","</tr></tbody></table>"],colgroup:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],map:[1,"<map>","</map>"],_default:[0,"",""]},E=function(e,t){if(e.getAttribute("id")===t)return e;var r,n,i,o=e.childNodes.length;for(r=0;o>r;r++)if(n=e.childNodes[r],i=1===n.nodeType&&E(n,t))return i},v=function(e,t){var n=[];if(o&&(t=t.replace(/(\s+)(<script id='([^']+)')/g,function(e,t,r,i){return n.push([i,t]),r})),e.innerHTML=t,n.length>0){var i,s=n.length;for(i=0;s>i;i++){var a=E(e,n[i][0]),u=r.createTextNode(n[i][1]);a.parentNode.insertBefore(u,a)}}},g=function(e,t){var n=b[e.tagName.toLowerCase()]||b._default,o=n[0],s=n[1],a=n[2];i&&(t="&shy;"+t);var u=r.createElement("div");v(u,s+t+a);for(var c=0;o>=c;c++)u=u.firstChild;if(i){for(var l=u;1===l.nodeType&&!l.nodeName;)l=l.firstChild;3===l.nodeType&&"­"===l.nodeValue.charAt(0)&&(l.nodeValue=l.nodeValue.slice(1))}return u},y=function(e){for(;""===e.parentNode.tagName;)e=e.parentNode;return e},w=function(e,t){e.parentNode!==t.parentNode&&t.parentNode.insertBefore(e,t.parentNode.firstChild)};u=function(e,t){var n,i,o,s=y(r.getElementById(this.start)),a=r.getElementById(this.end),u=a.parentNode;for(w(s,a),n=s.nextSibling;n;){if(i=n.nextSibling,o=n===a){if(!t)break;a=n.nextSibling}if(n.parentNode.removeChild(n),o)break;n=i}for(n=g(s.parentNode,e);n;)i=n.nextSibling,u.insertBefore(n,a),n=i},c=function(){var e=y(r.getElementById(this.start)),t=r.getElementById(this.end);this.html(""),e.parentNode.removeChild(e),t.parentNode.removeChild(t)},h=function(e){for(var t,r=g(e,this.outerHTML());r;)t=r.nextSibling,e.appendChild(r),r=t},m=function(e){var t,n,i=r.getElementById(this.end),o=i.nextSibling,s=i.parentNode;for(n=g(s,e);n;)t=n.nextSibling,s.insertBefore(n,o),n=t},f=function(e){var t,n,i=r.getElementById(this.start),o=i.parentNode;n=g(o,e);for(var s=i.nextSibling;n;)t=n.nextSibling,o.insertBefore(n,s),n=t}}return s.prototype.html=function(e){return this.checkRemoved(),void 0===e?this.innerHTML:(u.call(this,e),this.innerHTML=e,void 0)},s.prototype.replaceWith=function(e){this.checkRemoved(),u.call(this,e,!0)},s.prototype.remove=c,s.prototype.outerHTML=l,s.prototype.appendTo=h,s.prototype.after=m,s.prototype.prepend=f,s.prototype.startTag=p,s.prototype.endTag=d,s.prototype.isRemoved=function(){var e=r.getElementById(this.start),t=r.getElementById(this.end);return!e||!t},s.prototype.checkRemoved=function(){if(this.isRemoved())throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.")},s})}(),function(){function e(e){var t=e.hash,r=e.hashTypes;for(var n in t)"ID"===r[n]&&(t[n+"Binding"]=t[n],r[n+"Binding"]="STRING",delete t[n],delete r[n])}var t=Object.create||function(e){function t(){}return t.prototype=e,new t},r=this.Handlebars||Ember.imports&&Ember.imports.Handlebars;r||"function"!=typeof require||(r=require("handlebars")),Ember.Handlebars=t(r),Ember.Handlebars.helper=function(t,r){Ember.View.detect(r)?Ember.Handlebars.registerHelper(t,function(t){return e(t),Ember.Handlebars.helpers.view.call(this,r,t)}):Ember.Handlebars.registerBoundHelper.apply(null,arguments)},Ember.Handlebars.helpers=t(r.helpers),Ember.Handlebars.Compiler=function(){},r.Compiler&&(Ember.Handlebars.Compiler.prototype=t(r.Compiler.prototype)),Ember.Handlebars.Compiler.prototype.compiler=Ember.Handlebars.Compiler,Ember.Handlebars.JavaScriptCompiler=function(){},r.JavaScriptCompiler&&(Ember.Handlebars.JavaScriptCompiler.prototype=t(r.JavaScriptCompiler.prototype),Ember.Handlebars.JavaScriptCompiler.prototype.compiler=Ember.Handlebars.JavaScriptCompiler),Ember.Handlebars.JavaScriptCompiler.prototype.namespace="Ember.Handlebars",Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer=function(){return"''"},Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer=function(e){return"data.buffer.push("+e+");"};var n="ember"+ +new Date,i=1;Ember.Handlebars.Compiler.prototype.mustache=function(e){if(e.isHelper&&"control"===e.id.string)e.hash=e.hash||new r.AST.HashNode([]),e.hash.pairs.push(["controlID",new r.AST.StringNode(n+i++)]);else if(e.params.length||e.hash);else{var t=new r.AST.IdNode(["_triageMustache"]);e.escaped||(e.hash=e.hash||new r.AST.HashNode([]),e.hash.pairs.push(["unescaped",new r.AST.StringNode("true")])),e=new r.AST.MustacheNode([t].concat([e.id]),e.hash,!e.escaped)}return r.Compiler.prototype.mustache.call(this,e)},Ember.Handlebars.precompile=function(e){var t=r.parse(e),n={knownHelpers:{action:!0,unbound:!0,bindAttr:!0,template:!0,view:!0,_triageMustache:!0},data:!0,stringParams:!0},i=(new Ember.Handlebars.Compiler).compile(t,n);return(new Ember.Handlebars.JavaScriptCompiler).compile(i,n,void 0,!0)},r.compile&&(Ember.Handlebars.compile=function(e){var t=r.parse(e),n={data:!0,stringParams:!0},i=(new Ember.Handlebars.Compiler).compile(t,n),o=(new Ember.Handlebars.JavaScriptCompiler).compile(i,n,void 0,!0);return Ember.Handlebars.template(o)})}(),function(){function e(e,t,r,i){var o,s,a,u,c,l,h=r.length,m=i.data,f=m.view,p=i.hash,d=p.boundOptions;a=new Ember._SimpleHandlebarsView(null,null,!p.unescaped,m),a.normalizedValue=function(){var o,s=[];for(o in d)d.hasOwnProperty(o)&&(c=n(e,d[o],m),a.path=c.path,a.pathRoot=c.root,p[o]=Ember._SimpleHandlebarsView.prototype.normalizedValue.call(a));for(u=0;h>u;++u)c=r[u],a.path=c.path,a.pathRoot=c.root,s.push(Ember._SimpleHandlebarsView.prototype.normalizedValue.call(a));return s.push(i),t.apply(e,s)},f.appendChild(a),o=[];for(s in d)d.hasOwnProperty(s)&&o.push(n(e,d[s],m));for(o=o.concat(r),u=0,l=o.length;l>u;++u)c=o[u],f.registerObserver(c.root,c.path,a,a.rerender)}function t(e,t,r,n){var i,o,s,a,u=[],c=n.hash,l=c.boundOptions;for(a in l)l.hasOwnProperty(a)&&(c[a]=Ember.Handlebars.get(e,l[a],n));for(i=0,o=r.length;o>i;++i)s=r[i],u.push(Ember.Handlebars.get(e,s.path,n));return u.push(n),t.apply(e,u)}var r=Array.prototype.slice,n=Ember.Handlebars.normalizePath=function(e,t,r){var n,i,o=r&&r.keywords||{};return n=t.split(".",1)[0],o.hasOwnProperty(n)&&(e=o[n],i=!0,t=t===n?"":t.substr(n.length+1)),{root:e,path:t,isKeyword:i}},i=Ember.Handlebars.get=function(e,t,r){var i,o=r&&r.data,s=n(e,t,o);return e=s.root,t=s.path,i=Ember.get(e,t),void 0===i&&e!==Ember.lookup&&Ember.isGlobalPath(t)&&(i=Ember.get(Ember.lookup,t)),i};Ember.Handlebars.getPath=Ember.deprecateFunc("`Ember.Handlebars.getPath` has been changed to `Ember.Handlebars.get` for consistency.",Ember.Handlebars.get),Ember.Handlebars.resolveParams=function(e,t,r){for(var n,o,s=[],a=r.types,u=0,c=t.length;c>u;u++)n=t[u],o=a[u],"ID"===o?s.push(i(e,n,r)):s.push(n);return s},Ember.Handlebars.resolveHash=function(e,t,r){var n,o={},s=r.hashTypes;for(var a in t)t.hasOwnProperty(a)&&(n=s[a],o[a]="ID"===n?i(e,t[a],r):t[a]);return o},Ember.Handlebars.registerHelper("helperMissing",function(e,t){var r,n="";throw r="%@ Handlebars error: Could not find property '%@' on object %@.",t.data&&(n=t.data.view),new Ember.Error(Ember.String.fmt(r,[n,e,this]))}),Ember.Handlebars.registerBoundHelper=function(i,o){function s(){var i,s,u,c,l,h=r.call(arguments,0,-1),m=h.length,f=arguments[arguments.length-1],p=[],d=f.data,b=f.hash,E=d.view,v=f.contexts&&f.contexts[0]||this;b.boundOptions={};for(l in b)b.hasOwnProperty(l)&&Ember.IS_BINDING.test(l)&&"string"==typeof b[l]&&(b.boundOptions[l.slice(0,-7)]=b[l]);for(d.properties=[],c=0;m>c;++c)d.properties.push(h[c]),p.push(n(v,h[c],d));if(d.isUnbound)return t(this,o,p,f);if(0===a.length)return e(v,o,p,f);i=p[0],s=i.root,u=i.path;var g=new Ember._SimpleHandlebarsView(u,s,!f.hash.unescaped,f.data);g.normalizedValue=function(){var e=Ember._SimpleHandlebarsView.prototype.normalizedValue.call(g);return o.call(E,e,f)},E.appendChild(g),E.registerObserver(s,u,g,g.rerender);for(var y=0,w=a.length;w>y;y++)E.registerObserver(s,u+"."+a[y],g,g.rerender)}var a=r.call(arguments,2);s._rawFunction=o,Ember.Handlebars.registerHelper(i,s)},Ember.Handlebars.template=function(e){var t=Handlebars.template(e);return t.isTop=!0,t}}(),function(){Ember.String.htmlSafe=function(e){return new Handlebars.SafeString(e)};var e=Ember.String.htmlSafe;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.String)&&(String.prototype.htmlSafe=function(){return e(this)})}(),function(){Ember.Handlebars.resolvePaths=function(e){for(var t=[],r=e.contexts,n=e.roots,i=e.data,o=0,s=r.length;s>o;o++)t.push(Ember.Handlebars.get(n[o],r[o],{data:i}));return t}}(),function(){function e(){Ember.run.once(Ember.View,"notifyMutationListeners")}Ember.set,Ember.get;var r=t("metamorph"),n={remove:function(t){t.morph.remove(),e()},prepend:function(t,r){t.morph.prepend(r),e()},after:function(t,r){t.morph.after(r),e()},html:function(t,r){t.morph.html(r),e()},replace:function(t){var r=t.morph;t.transitionTo("preRender"),Ember.run.schedule("render",this,function(){if(!t.isDestroying){t.clearRenderedChildren();var n=t.renderToBuffer();t.invokeRecursively(function(e){e.propertyWillChange("element")}),t.triggerRecursively("willInsertElement"),r.replaceWith(n.string()),t.transitionTo("inDOM"),t.invokeRecursively(function(e){e.propertyDidChange("element")}),t.triggerRecursively("didInsertElement"),e()}})},empty:function(t){t.morph.html(""),e()}};Ember._Metamorph=Ember.Mixin.create({isVirtual:!0,tagName:"",instrumentName:"metamorph",init:function(){this._super(),this.morph=r()},beforeRender:function(e){e.push(this.morph.startTag()),e.pushOpeningTag()},afterRender:function(e){e.pushClosingTag(),e.push(this.morph.endTag())},createElement:function(){var e=this.renderToBuffer();this.outerHTML=e.string(),this.clearBuffer()},domManager:n}),Ember._MetamorphView=Ember.View.extend(Ember._Metamorph),Ember._SimpleMetamorphView=Ember.CoreView.extend(Ember._Metamorph)}(),function(){function e(e,t,r,n){this.path=e,this.pathRoot=t,this.isEscaped=r,this.templateData=n,this.morph=o(),this.state="preRender",this.updateId=null}var r=Ember.get,n=Ember.set,i=Ember.Handlebars.get,o=t("metamorph");Ember._SimpleHandlebarsView=e,e.prototype={isVirtual:!0,isView:!0,destroy:function(){this.updateId&&(Ember.run.cancel(this.updateId),this.updateId=null),this.morph=null},propertyWillChange:Ember.K,propertyDidChange:Ember.K,normalizedValue:function(){var e,t,r=this.path,n=this.pathRoot;return""===r?e=n:(t=this.templateData,e=i(n,r,{data:t})),e},renderToBuffer:function(e){var t="";t+=this.morph.startTag(),t+=this.render(),t+=this.morph.endTag(),e.push(t)},render:function(){var e=this.isEscaped,t=this.normalizedValue();return null===t||void 0===t?t="":t instanceof Handlebars.SafeString||(t=String(t)),e&&(t=Handlebars.Utils.escapeExpression(t)),t},rerender:function(){switch(this.state){case"preRender":case"destroying":break;case"inBuffer":throw new Ember.Error("Something you did tried to replace an {{expression}} before it was inserted into the DOM.");case"hasElement":case"inDOM":this.updateId=Ember.run.scheduleOnce("render",this,"update")}return this},update:function(){this.updateId=null,this.morph.html(this.render())},transitionTo:function(e){this.state=e}};var s=Ember.View.cloneStates(Ember.View.states),a=Ember.merge;a(s._default,{rerenderIfNeeded:Ember.K}),a(s.inDOM,{rerenderIfNeeded:function(e){e.normalizedValue()!==e._lastNormalizedValue&&e.rerender()}}),Ember._HandlebarsBoundView=Ember._MetamorphView.extend({instrumentName:"boundHandlebars",states:s,shouldDisplayFunc:null,preserveContext:!1,previousContext:null,displayTemplate:null,inverseTemplate:null,path:null,pathRoot:null,normalizedValue:function(){var e,t,n=r(this,"path"),o=r(this,"pathRoot"),s=r(this,"valueNormalizerFunc");return""===n?e=o:(t=r(this,"templateData"),e=i(o,n,{data:t})),s?s(e):e},rerenderIfNeeded:function(){this.currentState.rerenderIfNeeded(this)},render:function(e){var t=r(this,"isEscaped"),i=r(this,"shouldDisplayFunc"),o=r(this,"preserveContext"),s=r(this,"previousContext"),a=r(this,"inverseTemplate"),u=r(this,"displayTemplate"),c=this.normalizedValue();if(this._lastNormalizedValue=c,i(c))if(n(this,"template",u),o)n(this,"_context",s);else{if(!u)return null===c||void 0===c?c="":c instanceof Handlebars.SafeString||(c=String(c)),t&&(c=Handlebars.Utils.escapeExpression(c)),e.push(c),void 0;n(this,"_context",c)}else a?(n(this,"template",a),o?n(this,"_context",s):n(this,"_context",c)):n(this,"template",function(){return""});return this._super(e)}})}(),function(){function e(e){return!Ember.isNone(e)}function t(e,t,r,n,s,a){var u,c,l,h=t.data,m=t.fn,f=t.inverse,p=h.view,d=this;if(u=o(d,e,h),"object"==typeof this){if(h.insideGroup){c=function(){Ember.run.once(p,"rerender")};var b,E,v=i(d,e,t);v=s(v),E=r?d:v,n(v)?b=m:f&&(b=f),b(E,{data:t.data})}else{var g=p.createChildView(Ember._HandlebarsBoundView,{preserveContext:r,shouldDisplayFunc:n,valueNormalizerFunc:s,displayTemplate:m,inverseTemplate:f,path:e,pathRoot:d,previousContext:d,isEscaped:!t.hash.unescaped,templateData:t.data});p.appendChild(g),c=function(){Ember.run.scheduleOnce("render",g,"rerenderIfNeeded")}}if(""!==u.path&&(p.registerObserver(u.root,u.path,c),a))for(l=0;a.length>l;l++)p.registerObserver(u.root,u.path+"."+a[l],c)}else h.buffer.push(i(d,e,t))}function r(e,t){var r,n,s=t.data,a=s.view,u=this;if(r=o(u,e,s),"object"==typeof this){if(s.insideGroup){n=function(){Ember.run.once(a,"rerender")};var c=i(u,e,t);(null===c||void 0===c)&&(c=""),s.buffer.push(c)}else{var l=new Ember._SimpleHandlebarsView(e,u,!t.hash.unescaped,t.data);l._parentView=a,a.appendChild(l),n=function(){Ember.run.scheduleOnce("render",l,"rerender")}}""!==r.path&&a.registerObserver(r.root,r.path,n)}else s.buffer.push(i(u,e,t))}var n=Ember.get;Ember.set,Ember.String.fmt;var i=Ember.Handlebars.get,o=Ember.Handlebars.normalizePath,s=Ember.ArrayPolyfills.forEach,a=Ember.Handlebars,u=a.helpers;a.registerHelper("_triageMustache",function(e,t){return u[e]?u[e].call(this,t):u.bind.apply(this,arguments)}),a.registerHelper("bind",function(n,i){var o=i.contexts&&i.contexts[0]||this;return i.fn?t.call(o,n,i,!1,e):r.call(o,n,i)}),a.registerHelper("boundIf",function(e,r){var i=r.contexts&&r.contexts[0]||this,o=function(e){var t=e&&n(e,"isTruthy");return"boolean"==typeof t?t:Ember.isArray(e)?0!==n(e,"length"):!!e};return t.call(i,e,r,!0,o,o,["isTruthy","length"])}),a.registerHelper("with",function(r,n){if(4===arguments.length){var i,s,a,c;if(n=arguments[3],i=arguments[2],s=arguments[0],Ember.isGlobalPath(s))Ember.bind(n.data.keywords,i,s);else{c=o(this,s,n.data),s=c.path,a=c.root;var l=Ember.$.expando+Ember.guidFor(a);n.data.keywords[l]=a;var h=s?l+"."+s:l;Ember.bind(n.data.keywords,i,h)}return t.call(this,s,n,!0,e)}return u.bind.call(n.contexts[0],r,n)}),a.registerHelper("if",function(e,t){return u.boundIf.call(t.contexts[0],e,t)}),a.registerHelper("unless",function(e,t){var r=t.fn,n=t.inverse;return t.fn=n,t.inverse=r,u.boundIf.call(t.contexts[0],e,t)}),a.registerHelper("bindAttr",function(e){var t=e.hash,r=e.data.view,n=[],u=this,c=++Ember.uuid,l=t["class"];if(null!==l&&void 0!==l){var h=a.bindClasses(this,l,r,c,e);n.push('class="'+Handlebars.Utils.escapeExpression(h.join(" "))+'"'),delete t["class"]}var m=Ember.keys(t);return s.call(m,function(s){var a,l=t[s];a=o(u,l,e.data);var h,m,f="this"===l?a.root:i(u,l,e),p=Ember.typeOf(f);h=function h(){var t=i(u,l,e),n=r.$("[data-bindattr-"+c+"='"+c+"']");return n&&0!==n.length?(Ember.View.applyAttributeBindings(n,s,t),void 0):(Ember.removeObserver(a.root,a.path,m),void 0)},"this"===l||a.isKeyword&&""===a.path||r.registerObserver(a.root,a.path,h),"string"===p||"number"===p&&!isNaN(f)?n.push(s+'="'+Handlebars.Utils.escapeExpression(f)+'"'):f&&"boolean"===p&&n.push(s+'="'+s+'"')},this),n.push("data-bindattr-"+c+'="'+c+'"'),new a.SafeString(n.join(" "))}),a.bindClasses=function(e,t,r,n,a){var u,c,l,h=[],m=function(e,t,r){var n,o=t.path;return n="this"===o?e:""===o?!0:i(e,o,r),Ember.View._classStringForValue(o,n,t.className,t.falsyClassName)};return s.call(t.split(" "),function(t){var i,s,f,p,d=Ember.View._parsePropertyPath(t),b=d.path,E=e;""!==b&&"this"!==b&&(p=o(e,b,a.data),E=p.root,b=p.path),s=function(){u=m(e,d,a),l=n?r.$("[data-bindattr-"+n+"='"+n+"']"):r.$(),l&&0!==l.length?(i&&l.removeClass(i),u?(l.addClass(u),i=u):i=null):Ember.removeObserver(E,b,f)},""!==b&&"this"!==b&&r.registerObserver(E,b,s),c=m(e,d,a),c&&(h.push(c),i=c)}),h}}(),function(){Ember.get,Ember.set;var e=Ember.Handlebars;e.ViewHelper=Ember.Object.create({propertiesFromHTMLOptions:function(e){var t=e.hash,r=e.data,n={},i=t["class"],o=!1;t.id&&(n.elementId=t.id,o=!0),t.tag&&(n.tagName=t.tag,o=!0),i&&(i=i.split(" "),n.classNames=i,o=!0),t.classBinding&&(n.classNameBindings=t.classBinding.split(" "),o=!0),t.classNameBindings&&(void 0===n.classNameBindings&&(n.classNameBindings=[]),n.classNameBindings=n.classNameBindings.concat(t.classNameBindings.split(" ")),o=!0),t.attributeBindings&&(n.attributeBindings=null,o=!0),o&&(t=Ember.$.extend({},t),delete t.id,delete t.tag,delete t["class"],delete t.classBinding);var s;for(var a in t)t.hasOwnProperty(a)&&Ember.IS_BINDING.test(a)&&"string"==typeof t[a]&&(s=this.contextualizeBindingPath(t[a],r),s&&(t[a]=s));if(n.classNameBindings)for(var u in n.classNameBindings){var c=n.classNameBindings[u];if("string"==typeof c){var l=Ember.View._parsePropertyPath(c);s=this.contextualizeBindingPath(l.path,r),s&&(n.classNameBindings[u]=s+l.classNames)}}return Ember.$.extend(t,n)},contextualizeBindingPath:function(e,t){var r=Ember.Handlebars.normalizePath(null,e,t);return r.isKeyword?"templateData.keywords."+e:Ember.isGlobalPath(e)?null:"this"===e?"_parentView.context":"_parentView.context."+e},helper:function(t,r,n){var i,o=n.data,s=n.fn;i="string"==typeof r?e.get(t,r,n):r;var a=this.propertiesFromHTMLOptions(n,t),u=o.view;a.templateData=o;var c=i.proto?i.proto():i;s&&(a.template=s),c.controller||c.controllerBinding||a.controller||a.controllerBinding||(a._context=t),u.appendChild(i,a)}}),e.registerHelper("view",function(t,r){return t&&t.data&&t.data.isRenderData&&(r=t,t="Ember.View"),e.ViewHelper.helper(this,t,r)})}(),function(){var e=Ember.get,t=Ember.Handlebars.get;Ember.String.fmt,Ember.Handlebars.registerHelper("collection",function(r,n){r&&r.data&&r.data.isRenderData&&(n=r,r=void 0);var i=n.fn,o=n.data,s=n.inverse;n.data.view;var a;a=r?t(this,r,n):Ember.CollectionView;var u,c,l=n.hash,h={},m=l.itemViewClass,f=a.proto();delete l.itemViewClass,c=m?t(f,m,n):f.itemViewClass;for(var p in l)l.hasOwnProperty(p)&&(u=p.match(/^item(.)(.*)$/),u&&"itemController"!==p&&(h[u[1].toLowerCase()+u[2]]=l[p],delete l[p]));i&&(h.template=i,delete n.fn);var d;s&&s!==Handlebars.VM.noop?(d=e(f,"emptyViewClass"),d=d.extend({template:s,tagName:h.tagName})):l.emptyViewClass&&(d=t(this,l.emptyViewClass,n)),d&&(l.emptyView=d),l.keyword||(h._context=Ember.computed.alias("content"));var b=Ember.Handlebars.ViewHelper.propertiesFromHTMLOptions({data:o,hash:h},this);return l.itemViewClass=c.extend(b),Ember.Handlebars.helpers.view.call(this,a,n)})}(),function(){var e=Ember.Handlebars.get;Ember.Handlebars.registerHelper("unbound",function(t,r){var n,i,o,s=arguments[arguments.length-1];return arguments.length>2?(s.data.isUnbound=!0,n=Ember.Handlebars.helpers[arguments[0]]||Ember.Handlebars.helperMissing,o=n.apply(this,Array.prototype.slice.call(arguments,1)),delete s.data.isUnbound,o):(i=r.contexts&&r.contexts[0]||this,e(i,t,r))})}(),function(){var e=Ember.Handlebars.get,t=Ember.Handlebars.normalizePath;Ember.Handlebars.registerHelper("log",function(r,n){var i=n.contexts&&n.contexts[0]||this,o=t(i,r,n.data),s=o.root,a=o.path,u="this"===a?s:e(s,a,n);Ember.Logger.log(u)}),Ember.Handlebars.registerHelper("debugger",function(){})}(),function(){var e=Ember.get,t=Ember.set;Ember.Handlebars.EachView=Ember.CollectionView.extend(Ember._Metamorph,{init:function(){var r,n=e(this,"itemController");if(n){var i=Ember.ArrayController.create();t(i,"itemController",n),t(i,"container",e(this,"controller.container")),t(i,"_eachView",this),t(i,"target",e(this,"controller")),t(i,"parentController",e(this,"controller")),this.disableContentObservers(function(){t(this,"content",i),r=new Ember.Binding("content","_eachView.dataSource").oneWay(),r.connect(i)}),t(this,"_arrayController",i)}else this.disableContentObservers(function(){r=new Ember.Binding("content","dataSource").oneWay(),r.connect(this)});return this._super()},disableContentObservers:function(e){Ember.removeBeforeObserver(this,"content",null,"_contentWillChange"),Ember.removeObserver(this,"content",null,"_contentDidChange"),e.call(this),Ember.addBeforeObserver(this,"content",null,"_contentWillChange"),Ember.addObserver(this,"content",null,"_contentDidChange")},itemViewClass:Ember._MetamorphView,emptyViewClass:Ember._MetamorphView,createChildView:function(r,n){r=this._super(r,n);var i=e(this,"keyword"),o=e(r,"content");if(i){var s=e(r,"templateData");s=Ember.copy(s),s.keywords=r.cloneKeywords(),t(r,"templateData",s),s.keywords[i]=o}return o&&e(o,"isController")&&t(r,"controller",o),r},destroy:function(){if(this._super()){var t=e(this,"_arrayController");return t&&t.destroy(),this}}});var r=Ember.Handlebars.GroupedEach=function(e,t,r){var n=this,i=Ember.Handlebars.normalizePath(e,t,r.data);this.context=e,this.path=t,this.options=r,this.template=r.fn,this.containingView=r.data.view,this.normalizedRoot=i.root,this.normalizedPath=i.path,this.content=this.lookupContent(),this.addContentObservers(),this.addArrayObservers(),this.containingView.on("willClearRender",function(){n.destroy()})};r.prototype={contentWillChange:function(){this.removeArrayObservers()},contentDidChange:function(){this.content=this.lookupContent(),this.addArrayObservers(),this.rerenderContainingView()},contentArrayWillChange:Ember.K,contentArrayDidChange:function(){this.rerenderContainingView()},lookupContent:function(){return Ember.Handlebars.get(this.normalizedRoot,this.normalizedPath,this.options)},addArrayObservers:function(){this.content.addArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},removeArrayObservers:function(){this.content.removeArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},addContentObservers:function(){Ember.addBeforeObserver(this.normalizedRoot,this.normalizedPath,this,this.contentWillChange),Ember.addObserver(this.normalizedRoot,this.normalizedPath,this,this.contentDidChange)},removeContentObservers:function(){Ember.removeBeforeObserver(this.normalizedRoot,this.normalizedPath,this.contentWillChange),Ember.removeObserver(this.normalizedRoot,this.normalizedPath,this.contentDidChange)},render:function(){var t=this.content,r=e(t,"length"),n=this.options.data,i=this.template;n.insideEach=!0;for(var o=0;r>o;o++)i(t.objectAt(o),{data:n})},rerenderContainingView:function(){Ember.run.scheduleOnce("render",this.containingView,"rerender")},destroy:function(){this.removeContentObservers(),this.removeArrayObservers()}},Ember.Handlebars.registerHelper("each",function(e,t){if(4===arguments.length){var r=arguments[0];t=arguments[3],e=arguments[2],""===e&&(e="this"),t.hash.keyword=r}return t.hash.dataSourceBinding=e,!t.data.insideGroup||t.hash.groupedRows||t.hash.itemViewClass?Ember.Handlebars.helpers.collection.call(this,"Ember.Handlebars.EachView",t):(new Ember.Handlebars.GroupedEach(this,e,t).render(),void 0)})}(),function(){Ember.Handlebars.registerHelper("template",function(e,t){var r=t.data.view,n=r.templateForName(e);n(this,{data:t.data})})}(),function(){Ember.Handlebars.registerHelper("partial",function(e,t){var r=e.split("/"),n=r[r.length-1];r[r.length-1]="_"+n;var i=t.data.view,o=r.join("/"),s=i.templateForName(o),a=i.templateForName(e);s=s||a,s(this,{data:t.data})})}(),function(){var e=Ember.get;Ember.set,Ember.Handlebars.registerHelper("yield",function(t){for(var r,n=t.data.view;n&&!e(n,"layout");)n=e(n,"parentView");r=e(n,"template"),r&&r(this,t)})}(),function(){var e=Ember.set;Ember.get,Ember.Checkbox=Ember.View.extend({classNames:["ember-checkbox"],tagName:"input",attributeBindings:["type","checked","disabled","tabindex","name"],type:"checkbox",checked:!1,disabled:!1,init:function(){this._super(),this.on("change",this,this._updateElementValue)},_updateElementValue:function(){e(this,"checked",this.$().prop("checked"))}})}(),function(){var e=(Ember.get,Ember.set);Ember.TextSupport=Ember.Mixin.create({value:"",attributeBindings:["placeholder","disabled","maxlength","tabindex"],placeholder:null,disabled:!1,maxlength:null,insertNewline:Ember.K,cancel:Ember.K,init:function(){this._super(),this.on("focusOut",this,this._elementValueDidChange),this.on("change",this,this._elementValueDidChange),this.on("paste",this,this._elementValueDidChange),this.on("cut",this,this._elementValueDidChange),this.on("input",this,this._elementValueDidChange),this.on("keyUp",this,this.interpretKeyEvents)},interpretKeyEvents:function(e){var t=Ember.TextSupport.KEY_EVENTS,r=t[e.keyCode];return this._elementValueDidChange(),r?this[r](e):void 0},_elementValueDidChange:function(){e(this,"value",this.$().val())}}),Ember.TextSupport.KEY_EVENTS={13:"insertNewline",27:"cancel"}}(),function(){function e(e,r,n){var i=t(r,"action"),o=t(r,"onEvent");if(i&&o===e){var s=t(r,"controller"),a=t(r,"value"),u=t(r,"bubbles");s.send(i,a,r),u||n.stopPropagation()}}var t=Ember.get;Ember.set,Ember.TextField=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-field"],tagName:"input",attributeBindings:["type","value","size","pattern","name"],value:"",type:"text",size:null,pattern:null,action:null,onEvent:"enter",bubbles:!1,insertNewline:function(t){e("enter",this,t)},keyPress:function(t){e("keyPress",this,t)}})}(),function(){var e=Ember.get,t=Ember.set;Ember.Button=Ember.View.extend(Ember.TargetActionSupport,{classNames:["ember-button"],classNameBindings:["isActive"],tagName:"button",propagateEvents:!1,attributeBindings:["type","disabled","href","tabindex"],targetObject:Ember.computed(function(){var t=e(this,"target"),r=e(this,"context"),n=e(this,"templateData");return"string"!=typeof t?t:Ember.Handlebars.get(r,t,{data:n})}).property("target"),type:Ember.computed(function(){var e=this.tagName;return"input"===e||"button"===e?"button":void 0}),disabled:!1,href:Ember.computed(function(){return"a"===this.tagName?"#":null}),mouseDown:function(){return e(this,"disabled")||(t(this,"isActive",!0),this._mouseDown=!0,this._mouseEntered=!0),e(this,"propagateEvents")},mouseLeave:function(){this._mouseDown&&(t(this,"isActive",!1),this._mouseEntered=!1)},mouseEnter:function(){this._mouseDown&&(t(this,"isActive",!0),this._mouseEntered=!0)},mouseUp:function(){return e(this,"isActive")&&(this.triggerAction(),t(this,"isActive",!1)),this._mouseDown=!1,this._mouseEntered=!1,e(this,"propagateEvents")},keyDown:function(e){(13===e.keyCode||32===e.keyCode)&&this.mouseDown()},keyUp:function(e){(13===e.keyCode||32===e.keyCode)&&this.mouseUp()},touchStart:function(e){return this.mouseDown(e)},touchEnd:function(e){return this.mouseUp(e)},init:function(){this._super()}})}(),function(){var e=Ember.get;Ember.set,Ember.TextArea=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-area"],tagName:"textarea",attributeBindings:["rows","cols","name"],rows:null,cols:null,_updateElementValue:Ember.observer(function(){var t=e(this,"value"),r=this.$();r&&t!==r.val()&&r.val(t)},"value"),init:function(){this._super(),this.on("didInsertElement",this,this._updateElementValue)}})}(),function(){var e=Ember.set,t=Ember.get,r=Ember.EnumerableUtils.indexOf,n=Ember.EnumerableUtils.indexesOf,i=Ember.EnumerableUtils.replace,o=Ember.isArray;Ember.Handlebars.compile,Ember.SelectOption=Ember.View.extend({tagName:"option",attributeBindings:["value","selected"],defaultTemplate:function(e,t){t={data:t.data,hash:{}},Ember.Handlebars.helpers.bind.call(e,"view.label",t)},init:function(){this.labelPathDidChange(),this.valuePathDidChange(),this._super()},selected:Ember.computed(function(){var e=t(this,"content"),n=t(this,"parentView.selection");return t(this,"parentView.multiple")?n&&r(n,e.valueOf())>-1:e==n}).property("content","parentView.selection"),labelPathDidChange:Ember.observer(function(){var e=t(this,"parentView.optionLabelPath");e&&Ember.defineProperty(this,"label",Ember.computed(function(){return t(this,e)}).property(e))},"parentView.optionLabelPath"),valuePathDidChange:Ember.observer(function(){var e=t(this,"parentView.optionValuePath");e&&Ember.defineProperty(this,"value",Ember.computed(function(){return t(this,e)}).property(e))},"parentView.optionValuePath")}),Ember.Select=Ember.View.extend({tagName:"select",classNames:["ember-select"],defaultTemplate:Ember.Handlebars.template(function(e,t,r,n,i){function o(e,t){var n,i="";return t.buffer.push('<option value="">'),n={},t.buffer.push(l(r._triageMustache.call(e,"view.prompt",{hash:{},contexts:[e],types:["ID"],hashTypes:n,data:t}))),t.buffer.push("</option>"),i}function s(e,t){var n;n={contentBinding:"STRING"},t.buffer.push(l(r.view.call(e,"view.optionView",{hash:{contentBinding:"this"},contexts:[e],types:["ID"],hashTypes:n,data:t})))}this.compilerInfo=[2,">= 1.0.0-rc.3"],r=r||Ember.Handlebars.helpers,i=i||{};var a,u,c="",l=this.escapeExpression,h=this;return u={},a=r["if"].call(t,"view.prompt",{hash:{},inverse:h.noop,fn:h.program(1,o,i),contexts:[t],types:["ID"],hashTypes:u,data:i}),(a||0===a)&&i.buffer.push(a),u={},a=r.each.call(t,"view.content",{hash:{},inverse:h.noop,fn:h.program(3,s,i),contexts:[t],types:["ID"],hashTypes:u,data:i}),(a||0===a)&&i.buffer.push(a),c}),attributeBindings:["multiple","disabled","tabindex","name"],multiple:!1,disabled:!1,content:null,selection:null,value:Ember.computed(function(e,r){if(2===arguments.length)return r;var n=t(this,"optionValuePath").replace(/^content\.?/,"");return n?t(this,"selection."+n):t(this,"selection")}).property("selection"),prompt:null,optionLabelPath:"content",optionValuePath:"content",optionView:Ember.SelectOption,_change:function(){t(this,"multiple")?this._changeMultiple():this._changeSingle()},selectionDidChange:Ember.observer(function(){var r=t(this,"selection");if(t(this,"multiple")){if(!o(r))return e(this,"selection",Ember.A([r])),void 0;this._selectionDidChangeMultiple()}else this._selectionDidChangeSingle()},"selection.@each"),valueDidChange:Ember.observer(function(){var e,r=t(this,"content"),n=t(this,"value"),i=t(this,"optionValuePath").replace(/^content\.?/,""),o=i?t(this,"selection."+i):t(this,"selection");n!==o&&(e=r?r.find(function(e){return n===(i?t(e,i):e)}):null,this.set("selection",e))},"value"),_triggerChange:function(){var e=t(this,"selection"),r=t(this,"value");e&&this.selectionDidChange(),r&&this.valueDidChange(),this._change()},_changeSingle:function(){var r=this.$()[0].selectedIndex,n=t(this,"content"),i=t(this,"prompt");if(n&&t(n,"length")){if(i&&0===r)return e(this,"selection",null),void 0;i&&(r-=1),e(this,"selection",n.objectAt(r))}},_changeMultiple:function(){var r=this.$("option:selected"),n=t(this,"prompt"),s=n?1:0,a=t(this,"content"),u=t(this,"selection");if(a&&r){var c=r.map(function(){return this.index-s}).toArray(),l=a.objectsAt(c);o(u)?i(u,0,t(u,"length"),l):e(this,"selection",l)
}},_selectionDidChangeSingle:function(){var e=this.get("element");if(e){var n=t(this,"content"),i=t(this,"selection"),o=n?r(n,i):-1,s=t(this,"prompt");s&&(o+=1),e&&(e.selectedIndex=o)}},_selectionDidChangeMultiple:function(){var e,i=t(this,"content"),o=t(this,"selection"),s=i?n(i,o):[-1],a=t(this,"prompt"),u=a?1:0,c=this.$("option");c&&c.each(function(){e=this.index>-1?this.index-u:-1,this.selected=r(s,e)>-1})},init:function(){this._super(),this.on("didInsertElement",this,this._triggerChange),this.on("change",this,this._change)}})}(),function(){function e(e,t){for(var r in e)"ID"===t[r]&&(e[r+"Binding"]=e[r],delete e[r])}Ember.Handlebars.registerHelper("input",function(t){var r=t.hash,n=t.hashTypes,i=r.type,o=r.on;return delete r.type,delete r.on,e(r,n),"checkbox"===i?Ember.Handlebars.helpers.view.call(this,Ember.Checkbox,t):(r.type=i||"text",r.onEvent=o||"enter",Ember.Handlebars.helpers.view.call(this,Ember.TextField,t))}),Ember.Handlebars.registerHelper("textarea",function(t){var r=t.hash,n=t.hashTypes;return e(r,n),Ember.Handlebars.helpers.view.call(this,Ember.TextArea,t)})}(),function(){function e(){Ember.Handlebars.bootstrap(Ember.$(document))}Ember.Handlebars.bootstrap=function(e){var t='script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';Ember.$(t,e).each(function(){var e=Ember.$(this),t="text/x-raw-handlebars"===e.attr("type")?Ember.$.proxy(Handlebars.compile,Handlebars):Ember.$.proxy(Ember.Handlebars.compile,Ember.Handlebars),r=e.attr("data-template-name")||e.attr("id")||"application",n=t(e.html());Ember.TEMPLATES[r]=n,e.remove()})},Ember.onLoad("application",e)}(),function(){Ember.runLoadHooks("Ember.Handlebars",Ember.Handlebars)}(),function(){e("route-recognizer",[],function(){"use strict";function e(e){this.string=e}function t(e){this.name=e}function r(e){this.name=e}function n(){}function i(i,o,s){"/"===i.charAt(0)&&(i=i.substr(1));for(var a=i.split("/"),u=[],c=0,l=a.length;l>c;c++){var h,m=a[c];(h=m.match(/^:([^\/]+)$/))?(u.push(new t(h[1])),o.push(h[1]),s.dynamics++):(h=m.match(/^\*([^\/]+)$/))?(u.push(new r(h[1])),o.push(h[1]),s.stars++):""===m?u.push(new n):(u.push(new e(m)),s.statics++)}return u}function o(e){this.charSpec=e,this.nextStates=[]}function s(e){return e.sort(function(e,t){return e.types.stars!==t.types.stars?e.types.stars-t.types.stars:e.types.dynamics!==t.types.dynamics?e.types.dynamics-t.types.dynamics:e.types.statics!==t.types.statics?e.types.statics-t.types.statics:0})}function a(e,t){for(var r=[],n=0,i=e.length;i>n;n++){var o=e[n];r=r.concat(o.match(t))}return r}function u(e,t){for(var r=e.handlers,n=e.regex,i=t.match(n),o=1,s=[],a=0,u=r.length;u>a;a++){for(var c=r[a],l=c.names,h={},m=0,f=l.length;f>m;m++)h[l[m]]=i[o++];s.push({handler:c.handler,params:h,isDynamic:!!l.length})}return s}function c(e,t){return t.eachChar(function(t){e=e.put(t)}),e}function l(e,t,r){this.path=e,this.matcher=t,this.delegate=r}function h(e){this.routes={},this.children={},this.target=e}function m(e,t,r){return function(n,i){var o=e+n;return i?(i(m(o,t,r)),void 0):new l(e+n,t,r)}}function f(e,t,r){for(var n=0,i=0,o=e.length;o>i;i++)n+=e[i].path.length;t=t.substr(n),e.push({path:t,handler:r})}function p(e,t,r,n){var i=t.routes;for(var o in i)if(i.hasOwnProperty(o)){var s=e.slice();f(s,o,i[o]),t.children[o]?p(s,t.children[o],r,n):r.call(n,s)}}var d=["/",".","*","+","?","|","(",")","[","]","{","}","\\"],b=new RegExp("(\\"+d.join("|\\")+")","g");e.prototype={eachChar:function(e){for(var t,r=this.string,n=0,i=r.length;i>n;n++)t=r.charAt(n),e({validChars:t})},regex:function(){return this.string.replace(b,"\\$1")},generate:function(){return this.string}},t.prototype={eachChar:function(e){e({invalidChars:"/",repeat:!0})},regex:function(){return"([^/]+)"},generate:function(e){return e[this.name]}},r.prototype={eachChar:function(e){e({invalidChars:"",repeat:!0})},regex:function(){return"(.+)"},generate:function(e){return e[this.name]}},n.prototype={eachChar:function(){},regex:function(){return""},generate:function(){return""}},o.prototype={get:function(e){for(var t=this.nextStates,r=0,n=t.length;n>r;r++){var i=t[r],o=i.charSpec.validChars===e.validChars;if(o=o&&i.charSpec.invalidChars===e.invalidChars)return i}},put:function(e){var t;return(t=this.get(e))?t:(t=new o(e),this.nextStates.push(t),e.repeat&&t.nextStates.push(t),t)},match:function(e){for(var t,r,n,i=this.nextStates,o=[],s=0,a=i.length;a>s;s++)t=i[s],r=t.charSpec,"undefined"!=typeof(n=r.validChars)?-1!==n.indexOf(e)&&o.push(t):"undefined"!=typeof(n=r.invalidChars)&&-1===n.indexOf(e)&&o.push(t);return o}};var E=function(){this.rootState=new o,this.names={}};return E.prototype={add:function(e,t){for(var r,o=this.rootState,s="^",a={statics:0,dynamics:0,stars:0},u=[],l=[],h=!0,m=0,f=e.length;f>m;m++){var p=e[m],d=[],b=i(p.path,d,a);l=l.concat(b);for(var E=0,v=b.length;v>E;E++){var g=b[E];g instanceof n||(h=!1,o=o.put({validChars:"/"}),s+="/",o=c(o,g),s+=g.regex())}u.push({handler:p.handler,names:d})}h&&(o=o.put({validChars:"/"}),s+="/"),o.handlers=u,o.regex=new RegExp(s+"$"),o.types=a,(r=t&&t.as)&&(this.names[r]={segments:l,handlers:u})},handlersFor:function(e){var t=this.names[e],r=[];if(!t)throw new Error("There is no route named "+e);for(var n=0,i=t.handlers.length;i>n;n++)r.push(t.handlers[n]);return r},hasRoute:function(e){return!!this.names[e]},generate:function(e,t){var r=this.names[e],i="";if(!r)throw new Error("There is no route named "+e);for(var o=r.segments,s=0,a=o.length;a>s;s++){var u=o[s];u instanceof n||(i+="/",i+=u.generate(t))}return"/"!==i.charAt(0)&&(i="/"+i),i},recognize:function(e){var t,r,n,i=[this.rootState];for("/"!==e.charAt(0)&&(e="/"+e),t=e.length,t>1&&"/"===e.charAt(t-1)&&(e=e.substr(0,t-1)),r=0,n=e.length;n>r&&(i=a(i,e.charAt(r)),i.length);r++);var o=[];for(r=0,n=i.length;n>r;r++)i[r].handlers&&o.push(i[r]);i=s(o);var c=o[0];return c&&c.handlers?u(c,e):void 0}},l.prototype={to:function(e,t){var r=this.delegate;if(r&&r.willAddRoute&&(e=r.willAddRoute(this.matcher.target,e)),this.matcher.add(this.path,e),t){if(0===t.length)throw new Error("You must have an argument in the function passed to `to`");this.matcher.addChild(this.path,e,t,this.delegate)}}},h.prototype={add:function(e,t){this.routes[e]=t},addChild:function(e,t,r,n){var i=new h(t);this.children[e]=i;var o=m(e,i,n);n&&n.contextEntered&&n.contextEntered(t,o),r(o)}},E.prototype.map=function(e,t){var r=new h;e(m("",r,this.delegate)),p([],r,function(e){t?t(this,e):this.add(e)},this)},E})}(),function(){e("router",["route-recognizer"],function(e){"use strict";function t(){this.recognizer=new e}function r(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}function n(e){if(!e.isLoading){e.isLoading=!0;var t=e.getHandler("loading");t&&(t.enter&&t.enter(),t.setup&&t.setup())}}function i(e){e.isLoading=!1;var t=e.getHandler("loading");t&&t.exit&&t.exit()}function o(e,t){i(e);var r=e.getHandler("failure");r&&(r.enter&&r.enter(),r.setup&&r.setup(t))}function s(e,t,r,n){var i=e._paramsForHandler(t,n,!0),o=i.params,s=i.toSetup,a=e.recognizer.generate(t,o);r.call(e,a),u(e,s)}function a(e,t,r,s){function c(n){d.context!==b&&m(d,b);var i=s.concat([{context:n,name:p.handler,handler:e.getHandler(p.handler),isDynamic:p.isDynamic}]);a(e,t,r+1,i)}if(t.length===r){var l=s[s.length-1],h=l&&l.handler;if(!h||!h.additionalHandler)return i(e),u(e,s),void 0;var f={handler:h.additionalHandler(),params:{},isDynamic:!1};t.push(f)}var p=t[r],d=e.getHandler(p.handler),b=d.deserialize&&d.deserialize(p.params);b&&"function"==typeof b.then?(n(e),b.then(c).then(null,function(t){o(e,t)})):c(b)}function u(e,t){var r=l(e.currentHandlerInfos||[],t);e.targetHandlerInfos=t,c(r.exited,function(e){delete e.context,e.exit&&e.exit()});var n=r.unchanged.slice();e.currentHandlerInfos=n,c(r.updatedContext,function(e,t,r){m(e,t),e.setup&&e.setup(t),n.push(r)});var i=!1;c(r.entered,function(e,t,r){i||(e.enter&&e.enter(),m(e,t),e.setup&&!1===e.setup(t)&&(i=!0),i||n.push(r))}),!i&&e.didTransition&&e.didTransition(t)}function c(e,t){for(var r=0,n=e.length;n>r;r++){var i=e[r],o=i.handler,s=i.context;t(o,s,i)}}function l(e,t){var r,n,i,o,s={updatedContext:[],exited:[],entered:[],unchanged:[]};for(i=0,o=t.length;o>i;i++){var a=e[i],u=t[i];a&&a.handler===u.handler||(r=!0),r?(s.entered.push(u),a&&s.exited.unshift(a)):n||a.context!==u.context?(n=!0,s.updatedContext.push(u)):s.unchanged.push(a)}for(i=t.length,o=e.length;o>i;i++)s.exited.unshift(e[i]);return s}function h(e,t){var r=e.currentHandlerInfos,n=t.shift();if(!r)throw new Error("Could not trigger event '"+n+"'. There are no active handlers");for(var i=!1,o=r.length-1;o>=0;o--){var s=r[o],a=s.handler;if(a.events&&a.events[n]){if(a.events[n].apply(a,t)!==!0)return;i=!0}}if(!i)throw new Error("Nothing handled the event '"+n+"'.")}function m(e,t){e.context=t,e.contextDidChange&&e.contextDidChange()}return t.prototype={map:function(e){this.recognizer.delegate=this.delegate,this.recognizer.map(e,function(e,t){var r=t[t.length-1].handler,n=[t,{as:r}];e.add.apply(e,n)})},hasRoute:function(e){return this.recognizer.hasRoute(e)},handleURL:function(e){var t=this.recognizer.recognize(e);if(!t)throw new Error("No route matched the URL '"+e+"'");a(this,t,0,[])},updateURL:function(){throw"updateURL is not implemented"},replaceURL:function(e){this.updateURL(e)},transitionTo:function(e){var t=Array.prototype.slice.call(arguments,1);s(this,e,this.updateURL,t)},replaceWith:function(e){var t=Array.prototype.slice.call(arguments,1);s(this,e,this.replaceURL,t)},paramsForHandler:function(e){var t=this._paramsForHandler(e,[].slice.call(arguments,1));return t.params},generate:function(e){var t=this.paramsForHandler.apply(this,arguments);return this.recognizer.generate(e,t)},_paramsForHandler:function(e,t,n){var i,o,s,a,u,c,l=this.recognizer.handlersFor(e),h={},f=[],p=l.length,d=t.length;for(c=l.length-1;c>=0&&d>0;c--)l[c].names.length&&(d--,p=c);if(d>0)throw"More context objects were passed than there are dynamic segments for the route: "+e;for(c=0;l.length>c;c++)if(s=l[c],a=this.getHandler(s.handler),u=s.names,o=!1,u.length?(c>=p?(i=t.shift(),o=!0):i=a.context,a.serialize&&r(h,a.serialize(i,u))):n&&(c>p||!a.hasOwnProperty("context")?a.deserialize&&(i=a.deserialize({}),o=!0):i=a.context),n&&o&&m(a,i),f.push({isDynamic:!!s.names.length,name:s.handler,handler:a,context:i}),c===l.length-1){var b,E=f[f.length-1];(b=E.handler.additionalHandler)&&l.push({handler:b.call(E.handler),names:[]})}return{params:h,toSetup:f}},isActive:function(e){for(var t,r,n=[].slice.call(arguments,1),i=this.targetHandlerInfos,o=!1,s=i.length-1;s>=0;s--)if(r=i[s],r.name===e&&(o=!0),o){if(0===n.length)break;if(r.isDynamic&&(t=n.pop(),r.context!==t))return!1}return 0===n.length&&o},trigger:function(){var e=[].slice.call(arguments);h(this,e)}},t})}(),function(){function e(e){this.parent=e,this.matches=[]}e.prototype={resource:function(t,r,n){if(2===arguments.length&&"function"==typeof r&&(n=r,r={}),1===arguments.length&&(r={}),"string"!=typeof r.path&&(r.path="/"+t),n){var i=new e(t);n.call(i),this.push(r.path,t,i.generate())}else this.push(r.path,t)},push:function(e,t,r){var n=t.split(".");(""===e||"/"===e||"index"===n[n.length-1])&&(this.explicitIndex=!0),this.matches.push([e,t,r])},route:function(e,t){t=t||{},"string"!=typeof t.path&&(t.path="/"+e),this.parent&&"application"!==this.parent&&(e=this.parent+"."+e),this.push(t.path,e)},generate:function(){var e=this.matches;return this.explicitIndex||this.route("index",{path:"/"}),function(t){for(var r=0,n=e.length;n>r;r++){var i=e[r];t(i[0]).to(i[1],i[2])}}}},e.map=function(t){var r=new e;return t.call(r),r},Ember.RouterDSL=e}(),function(){Ember.controllerFor=function(e,t,r,n){return e.lookup("controller:"+t,n)||Ember.generateController(e,t,r)},Ember.generateController=function(e,t,r){var n,i,o;return r&&Ember.isArray(r)?(i=e.resolve("controller:array"),n=i.extend({content:r})):r?(i=e.resolve("controller:object"),n=i.extend({content:r})):(i=e.resolve("controller:basic"),n=i.extend()),n.toString=function(){return"(generated "+t+" controller)"},o="controller:"+t,e.register(o,n),e.lookup(o)}}(),function(){function e(e){var t=a(e,"location"),r=a(e,"rootURL"),n={};"string"==typeof r&&(n.rootURL=r),"string"==typeof t&&(n.implementation=t,t=u(e,"location",Ember.Location.create(n)))}function r(e){var t={},r=e.container,n=r.resolve("route:basic");return function(i){var o="route:"+i,s=r.lookup(o);if(t[i])return s;if(t[i]=!0,!s){if("loading"===i)return{};if("failure"===i)return e.constructor.defaultFailureHandler;r.register(o,n.extend()),s=r.lookup(o)}return"application"===i&&(s.events=s.events||{},s.events.routeTo=s.events.routeTo||Ember.TransitionEvent.defaultHandler),s.routeName=i,s}}function n(e){for(var t=[],r=1,n=e.length;n>r;r++){var i=e[r].name,o=i.split(".");t.push(o[o.length-1])}return t.join(".")}function i(e,t,n){var i;t.getHandler=r(e);var o=function(){n.setURL(i)};if(t.updateURL=function(e){i=e,Ember.run.once(o)},n.replaceURL){var s=function(){n.replaceURL(i)};t.replaceURL=function(e){i=e,Ember.run.once(s)}}t.didTransition=function(t){e.didTransition(t)}}function o(e,t,r){var n,i=r[0];n=e.router.hasRoute(r[0])?i:r[0]=i+".index",e.router[t].apply(e.router,r),e.notifyPropertyChange("url")}var s=t("router"),a=Ember.get,u=Ember.set,c=Ember._MetamorphView;Ember.Router=Ember.Object.extend({location:"hash",init:function(){this.router=this.constructor.router,this._activeViews={},e(this)},url:Ember.computed(function(){return a(this,"location").getURL()}),startRouting:function(){this.router=this.router||this.constructor.map(Ember.K);var e=this.router,t=a(this,"location"),r=this.container,n=this;i(this,e,t),r.register("view:default",c),r.register("view:toplevel",Ember.View.extend()),t.onUpdateURL(function(e){n.handleURL(e)}),this.handleURL(t.getURL())},didTransition:function(e){var t=this.container.lookup("controller:application"),r=n(e);u(t,"currentPath",r),this.notifyPropertyChange("url"),a(this,"namespace").LOG_TRANSITIONS&&Ember.Logger.log("Transitioned into '"+r+"'")},handleURL:function(e){this.router.handleURL(e),this.notifyPropertyChange("url")},routeTo:function(e){var t=this.router.currentHandlerInfos;t&&(e.sourceRoute=t[t.length-1].handler),this.send("routeTo",e)},transitionTo:function(){var e=[].slice.call(arguments);o(this,"transitionTo",e)},replaceWith:function(){var e=[].slice.call(arguments);o(this,"replaceWith",e)},generate:function(){var e=this.router.generate.apply(this.router,arguments);return this.location.formatURL(e)},isActive:function(){var e=this.router;return e.isActive.apply(e,arguments)},send:function(){this.router.trigger.apply(this.router,arguments)},hasRoute:function(e){return this.router.hasRoute(e)},_lookupActiveView:function(e){var t=this._activeViews[e];return t&&t[0]},_connectActiveView:function(e,t){var r=this._activeViews[e];r&&r[0].off("willDestroyElement",this,r[1]);var n=function(){delete this._activeViews[e]};this._activeViews[e]=[t,n],t.one("willDestroyElement",this,n)}}),Ember.Router.reopenClass({defaultFailureHandler:{setup:function(e){Ember.Logger.error("Error while loading route:",e),setTimeout(function(){throw e})}}}),Ember.Router.reopenClass({map:function(e){var t=this.router=new s,r=Ember.RouterDSL.map(function(){this.resource("application",{path:"/"},function(){e.call(this)})});return t.map(r.generate()),t}})}(),function(){function e(e){for(var t,r,n=e.router.router.targetHandlerInfos,i=0,o=n.length;o>i;i++){if(r=n[i].handler,r===e)return t;t=r}}function t(r){var n,i=e(r);if(i)return(n=i.lastRenderedTemplate)?n:t(i,!0)}function r(e,r,n,i){i=i||{},i.into=i.into?i.into.replace(/\//g,"."):t(e),i.outlet=i.outlet||"main",i.name=r,i.template=n;var o,s=i.controller;return s=i.controller?i.controller:(o=e.container.lookup("controller:"+r))?o:e.routeName,"string"==typeof s&&(s=e.container.lookup("controller:"+s)),i.controller=s,i}function n(e,t,r){var n=r.into?"view:default":"view:toplevel";return e=e||t.lookup(n),u(e,"templateName")||(c(e,"template",r.template),c(e,"_debugTemplateName",r.name)),c(e,"renderedName",r.name),c(e,"controller",r.controller),e}function i(e,t,r){if(r.into){var n=e.router._lookupActiveView(r.into);e.teardownView=s(n,r.outlet),n.connectOutlet(r.outlet,t)}else{var i=u(e,"router.namespace.rootElement");e.teardownView&&e.teardownView(),e.router._connectActiveView(r.name,t),e.teardownView=o(t),t.appendTo(i)}}function o(e){return function(){e.destroy()}}function s(e,t){return function(){e.disconnectOutlet(t)}}function a(e){e.teardownView&&e.teardownView(),delete e.teardownView,delete e.lastRenderedTemplate}var u=Ember.get,c=Ember.set,l=Ember.String.classify;Ember.String.fmt,Ember.Route=Ember.Object.extend({exit:function(){this.deactivate(),a(this)},enter:function(){this.activate()},events:null,deactivate:Ember.K,activate:Ember.K,routeTo:function(e){this.router.routeTo(e)},transitionTo:function(){var e=this.router;if(!e.isActive.apply(e,arguments))return this._checkingRedirect&&(this._redirected[this._redirectDepth]=!0),e.transitionTo.apply(e,arguments)},replaceWith:function(){var e=this.router;if(!e.isActive.apply(e,arguments))return this._checkingRedirect&&(this._redirected[this._redirectDepth]=!0),this.router.replaceWith.apply(this.router,arguments)},send:function(){return this.router.send.apply(this.router,arguments)},_redirectDepth:0,setup:function(e){var t;this._redirected||(t=!0,this._redirected=[]),this._checkingRedirect=!0;var r=++this._redirectDepth;void 0===e?this.redirect():this.redirect(e),this._redirectDepth--,this._checkingRedirect=!1;var n=this._redirected;if(t&&(this._redirected=null),n[r])return!1;var i=this.controllerFor(this.routeName,e);i&&(this.controller=i,c(i,"model",e)),this.setupControllers?this.setupControllers(i,e):this.setupController(i,e),this.renderTemplates?this.renderTemplates(e):this.renderTemplate(i,e)},redirect:Ember.K,deserialize:function(e){var t=this.model(e);return this.currentModel=t},contextDidChange:function(){this.currentModel=this.context},model:function(e){var t,r,n,i;for(var o in e)(t=o.match(/^(.*)_id$/))&&(r=t[1],i=e[o]),n=!0;if(!r&&n)return e;if(r){var s=l(r),a=this.router.namespace,u=a[s];return u.find(i)}},serialize:function(e,t){if(1===t.length){var r=t[0],n={};return n[r]=/_id$/.test(r)?u(e,"id"):e,n}},setupController:Ember.K,controllerFor:function(e,t){var r=this.router.container,n=r.lookup("controller:"+e);return n||(t=t||this.modelFor(e),n=Ember.generateController(r,e,t)),n},modelFor:function(e){var t=this.container.lookup("route:"+e);return t&&t.currentModel},renderTemplate:function(){this.render()},render:function(e,t){"object"!=typeof e||t||(t=e,e=this.routeName),e=e?e.replace(/\//g,"."):this.routeName;var o=this.container,s=o.lookup("view:"+e),a=o.lookup("template:"+e);(s||a)&&(t=r(this,e,a,t),s=n(s,o,t),"main"===t.outlet&&(this.lastRenderedTemplate=e),i(this,s,t))},willDestroy:function(){a(this)}})}(),function(){Ember.TransitionEvent=Ember.Object.extend({transitionMethod:"transitionTo",destinationRouteName:null,sourceRoute:null,contexts:null,init:function(){this._super(),this.contexts=this.contexts||[]},transitionToArgs:function(){return[this.destinationRouteName].concat(this.contexts)}}),Ember.TransitionEvent.reopenClass({defaultHandler:function(e){var t=this.router;t[e.transitionMethod].apply(t,e.transitionToArgs())}})}(),function(){Ember.onLoad("Ember.Handlebars",function(){function e(e,i,o){function s(e,t){return"controller"===i[t]?e:Ember.ControllerMixin.detect(e)?s(n(e,"model")):e}var a=t(e,i,o);return r.call(a,s)}var t=Ember.Handlebars.resolveParams,r=Ember.ArrayPolyfills.map,n=Ember.get;Ember.Router.resolveParams=e})}(),function(){var e=Ember.get;Ember.set,Ember.String.fmt,Ember.onLoad("Ember.Handlebars",function(){function t(e,t){return e.hasRoute(t)||(t+=".index"),t}function r(e){var t=e.options.types.slice(1),r=e.options.data;return i(e.context,e.params,{types:t,data:r})}function n(e,n,i){var o,s=i||e.namedRoute;o=t(n,s);var a=[o];return a.concat(r(e.parameters))}var i=Ember.Router.resolveParams,o=Ember.ViewUtils.isSimpleClick,s=Ember.LinkView=Ember.View.extend({tagName:"a",namedRoute:null,currentWhen:null,title:null,activeClass:"active",disabledClass:"disabled",_isDisabled:!1,replace:!1,attributeBindings:["href","title"],classNameBindings:["active","disabled"],concreteView:Ember.computed(function(){return e(this,"parentView")}).property("parentView"),disabled:Ember.computed(function(e,t){return void 0!==t&&this.set("_isDisabled",t),t?this.get("disabledClass"):!1}),active:Ember.computed(function(){var t=this.get("router"),n=r(this.parameters),i=this.currentWhen+".index",o=t.isActive.apply(t,[this.currentWhen].concat(n))||t.isActive.apply(t,[i].concat(n));return o?e(this,"activeClass"):void 0}).property("namedRoute","router.url"),router:Ember.computed(function(){return this.get("controller").container.lookup("router:main")}),click:function(t){if(!o(t))return!0;if(t.preventDefault(),this.bubbles===!1&&t.stopPropagation(),e(this,"_isDisabled"))return!1;var r=this.get("router");if(Ember.ENV.ENABLE_ROUTE_TO){var i=n(this,r);r.routeTo(Ember.TransitionEvent.create({transitionMethod:this.get("replace")?"replaceWith":"transitionTo",destinationRouteName:i[0],contexts:i.slice(1)}))}else this.get("replace")?r.replaceWith.apply(r,n(this,r)):r.transitionTo.apply(r,n(this,r))},href:Ember.computed(function(){if("a"!==this.get("tagName"))return!1;var e=this.get("router");return e.generate.apply(e,n(this,e))})});s.toString=function(){return"LinkView"},Ember.Handlebars.registerHelper("linkTo",function(e){var t=[].slice.call(arguments,-1)[0],r=[].slice.call(arguments,1,-1),n=t.hash;return n.namedRoute=e,n.currentWhen=n.currentWhen||e,n.disabledBinding=n.disabledWhen,n.parameters={context:this,options:t,params:r},Ember.Handlebars.helpers.view.call(this,s,t)})})}(),function(){Ember.get,Ember.set,Ember.onLoad("Ember.Handlebars",function(e){e.OutletView=Ember.ContainerView.extend(Ember._Metamorph),e.registerHelper("outlet",function(t,r){var n;for(t&&t.data&&t.data.isRenderData&&(r=t,t="main"),n=r.data.view;!n.get("template.isTop");)n=n.get("_parentView");return r.data.view.set("outletSource",n),r.hash.currentViewBinding="_view.outletSource._outlets."+t,e.helpers.view.call(this,e.OutletView,r)})})}(),function(){Ember.get,Ember.set,Ember.onLoad("Ember.Handlebars",function(){Ember.Handlebars.registerHelper("render",function(e,t,r){var n,i,o,s,a,u;2===arguments.length&&(r=t,t=void 0),"string"==typeof t&&(a=Ember.Handlebars.get(r.contexts[1],t,r),u={singleton:!1}),e=e.replace(/\//g,"."),n=r.data.keywords.controller.container,i=n.lookup("router:main"),s=n.lookup("view:"+e)||n.lookup("view:default"),o=(o=r.hash.controller)?n.lookup("controller:"+o,u):Ember.controllerFor(n,e,a,u),o&&a&&o.set("model",a);var c=r.contexts[1];c&&s.registerObserver(c,t,function(){o.set("model",Ember.Handlebars.get(c,t,r))}),o.set("target",r.data.keywords.controller),r.hash.viewName=Ember.String.camelize(e),r.hash.template=n.lookup("template:"+e),r.hash.controller=o,i&&!a&&i._connectActiveView(e,s),Ember.Handlebars.helpers.view.call(this,s,r)})})}(),function(){Ember.onLoad("Ember.Handlebars",function(){function e(e,r){var n=[];r&&n.push(r);var i=e.options.types.slice(1),o=e.options.data;return n.concat(t(e.context,e.params,{types:i,data:o}))}var t=Ember.Router.resolveParams,r=Ember.ViewUtils.isSimpleClick,n=Ember.Handlebars,i=n.get,o=n.SafeString,s=Ember.ArrayPolyfills.forEach,a=(Ember.get,Array.prototype.slice),u=n.ActionHelper={registeredActions:{}},c=["alt","shift","meta","ctrl"],l=function(e,t){if("undefined"==typeof t)return r(e);var n=!0;return s.call(c,function(r){e[r+"Key"]&&-1===t.indexOf(r)&&(n=!1)}),n};u.registerAction=function(t,r,n){var o=(++Ember.uuid).toString();return u.registeredActions[o]={eventName:r.eventName,handler:function(o){if(!l(o,n))return!0;o.preventDefault(),r.bubbles===!1&&o.stopPropagation();var s=r.target;s=s.target?i(s.root,s.target,s.options):s.root,Ember.run(function(){s.send?s.send.apply(s,e(r.parameters,t)):s[t].apply(s,e(r.parameters))})}},r.view.on("willClearRender",function(){delete u.registeredActions[o]}),o},n.registerHelper("action",function(e){var t,r=arguments[arguments.length-1],n=a.call(arguments,1,-1),i=r.hash,s={eventName:i.on||"click"};s.parameters={context:this,options:r,params:n},s.view=r.data.view;var c,l;i.target?(c=this,l=i.target):(t=r.data.keywords.controller)&&(c=t),s.target={root:c,target:l,options:r},s.bubbles=i.bubbles;var h=u.registerAction(e,s,i.allowedKeys);return new o('data-ember-action="'+h+'"')})})}(),function(){if(Ember.ENV.EXPERIMENTAL_CONTROL_HELPER){var e=Ember.get,t=Ember.set;Ember.Handlebars.registerHelper("control",function(r,n,i){function o(){var e=Ember.Handlebars.get(this,n,i);t(p,"model",e),f.rerender()}2===arguments.length&&(i=n,n=void 0);var s;n&&(s=Ember.Handlebars.get(this,n,i));var a,u,c=i.data.keywords.controller,l=(i.data.keywords.view,e(c,"_childContainers")),h=i.hash.controlID;l.hasOwnProperty(h)?u=l[h]:(a=e(c,"container"),u=a.child(),l[h]=u);var m=r.replace(/\//g,"."),f=u.lookup("view:"+m)||u.lookup("view:default"),p=u.lookup("controller:"+m),d=u.lookup("template:"+r);t(p,"target",c),t(p,"model",s),i.hash.template=d,i.hash.controller=p,Ember.addObserver(this,n,o),f.one("willDestroyElement",this,function(){Ember.removeObserver(this,n,o)}),Ember.Handlebars.helpers.view.call(this,f,i)})}}(),function(){var e=Ember.get;Ember.set,Ember.ControllerMixin.reopen({transitionToRoute:function(){var t=e(this,"target"),r=t.transitionToRoute||t.transitionTo;return r.apply(t,arguments)},transitionTo:function(){return this.transitionToRoute.apply(this,arguments)},replaceRoute:function(){var t=e(this,"target"),r=t.replaceRoute||t.replaceWith;return r.apply(t,arguments)},replaceWith:function(){return this.replaceRoute.apply(this,arguments)}})}(),function(){var e=Ember.get,t=Ember.set;Ember.View.reopen({init:function(){t(this,"_outlets",{}),this._super()},connectOutlet:function(r,n){var i=e(this,"_outlets"),o=e(this,"container"),s=o&&o.lookup("router:main"),a=e(n,"renderedName");t(i,r,n),s&&a&&s._connectActiveView(a,n)},disconnectOutlet:function(r){var n=e(this,"_outlets");t(n,r,null)}})}(),function(){Ember.get,Ember.set,Ember.Location={create:function(e){var t=e&&e.implementation,r=this.implementations[t];return r.create.apply(r,arguments)},registerImplementation:function(e,t){this.implementations[e]=t},implementations:{}}}(),function(){var e=Ember.get,t=Ember.set;Ember.NoneLocation=Ember.Object.extend({path:"",getURL:function(){return e(this,"path")},setURL:function(e){t(this,"path",e)},onUpdateURL:function(e){this.updateCallback=e},handleURL:function(e){t(this,"path",e),this.updateCallback(e)},formatURL:function(e){return e}}),Ember.Location.registerImplementation("none",Ember.NoneLocation)}(),function(){var e=Ember.get,t=Ember.set;Ember.HashLocation=Ember.Object.extend({init:function(){t(this,"location",e(this,"location")||window.location)},getURL:function(){return e(this,"location").hash.substr(1)},setURL:function(r){e(this,"location").hash=r,t(this,"lastSetURL",r)},onUpdateURL:function(r){var n=this,i=Ember.guidFor(this);Ember.$(window).on("hashchange.ember-location-"+i,function(){Ember.run(function(){var i=location.hash.substr(1);e(n,"lastSetURL")!==i&&(t(n,"lastSetURL",null),r(i))})})},formatURL:function(e){return"#"+e},willDestroy:function(){var e=Ember.guidFor(this);Ember.$(window).unbind("hashchange.ember-location-"+e)}}),Ember.Location.registerImplementation("hash",Ember.HashLocation)}(),function(){var e=Ember.get,t=Ember.set,r=!1;Ember.HistoryLocation=Ember.Object.extend({init:function(){t(this,"location",e(this,"location")||window.location),this.initState()},initState:function(){t(this,"history",e(this,"history")||window.history),this.replaceState(this.formatURL(this.getURL()))},rootURL:"/",getURL:function(){var t=e(this,"rootURL"),r=e(this,"location").pathname;return t=t.replace(/\/$/,""),r=r.replace(t,"")},setURL:function(e){e=this.formatURL(e),this.getState()&&this.getState().path!==e&&this.pushState(e)},replaceURL:function(e){e=this.formatURL(e),this.getState()&&this.getState().path!==e&&this.replaceState(e)},getState:function(){return e(this,"history").state},pushState:function(t){e(this,"history").pushState({path:t},null,t),this._previousURL=this.getURL()},replaceState:function(t){e(this,"history").replaceState({path:t},null,t),this._previousURL=this.getURL()},onUpdateURL:function(e){var t=Ember.guidFor(this),n=this;Ember.$(window).on("popstate.ember-location-"+t,function(){(r||(r=!0,n.getURL()!==n._previousURL))&&e(n.getURL())})},formatURL:function(t){var r=e(this,"rootURL");return""!==t&&(r=r.replace(/\/$/,"")),r+t},willDestroy:function(){var e=Ember.guidFor(this);Ember.$(window).unbind("popstate.ember-location-"+e)}}),Ember.Location.registerImplementation("history",Ember.HistoryLocation)}(),function(){function e(t,r,n,i){var o,s=t.name,a=t.incoming,u=t.incomingNames,c=u.length;if(n||(n={}),i||(i=[]),!n.hasOwnProperty(s)){for(i.push(s),n[s]=!0,o=0;c>o;o++)e(a[u[o]],r,n,i);r(t,i),i.pop()}}function t(){this.names=[],this.vertices={}}t.prototype.add=function(e){if(e){if(this.vertices.hasOwnProperty(e))return this.vertices[e];var t={name:e,incoming:{},incomingNames:[],hasOutgoing:!1,value:null};return this.vertices[e]=t,this.names.push(e),t}},t.prototype.map=function(e,t){this.add(e).value=t},t.prototype.addEdge=function(t,r){function n(e,t){if(e.name===r)throw new Error("cycle detected: "+r+" <- "+t.join(" <- "))}if(t&&r&&t!==r){var i=this.add(t),o=this.add(r);o.incoming.hasOwnProperty(t)||(e(i,n),i.hasOutgoing=!0,o.incoming[t]=i,o.incomingNames.push(t))}},t.prototype.topsort=function(t){var r,n,i={},o=this.vertices,s=this.names,a=s.length;for(r=0;a>r;r++)n=o[s[r]],n.hasOutgoing||e(n,t,i)},t.prototype.addEdges=function(e,t,r,n){var i;if(this.map(e,t),r)if("string"==typeof r)this.addEdge(e,r);else for(i=0;r.length>i;i++)this.addEdge(e,r[i]);if(n)if("string"==typeof n)this.addEdge(n,e);else for(i=0;n.length>i;i++)this.addEdge(n[i],e)},Ember.DAG=t}(),function(){var e=Ember.get,t=Ember.String.classify,r=Ember.String.capitalize,n=Ember.String.decamelize;Ember.DefaultResolver=Ember.Object.extend({namespace:null,resolve:function(e){var t=this.parseName(e),r=this[t.resolveMethodName];if(r){var n=r.call(this,t);if(n)return n}return this.resolveOther(t)},parseName:function(n){var i=n.split(":"),o=i[0],s=i[1],a=s,u=e(this,"namespace"),c=u;if("template"!==o&&-1!==a.indexOf("/")){var l=a.split("/");a=l[l.length-1];var h=r(l.slice(0,-1).join("."));c=Ember.Namespace.byName(h)}return{fullName:n,type:o,fullNameWithoutType:s,name:a,root:c,resolveMethodName:"resolve"+t(o)}},resolveTemplate:function(e){var t=e.fullNameWithoutType.replace(/\./g,"/");return Ember.TEMPLATES[t]?Ember.TEMPLATES[t]:(t=n(t),Ember.TEMPLATES[t]?Ember.TEMPLATES[t]:void 0)},useRouterNaming:function(e){e.name=e.name.replace(/\./g,"_"),"basic"===e.name&&(e.name="")},resolveController:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveRoute:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveView:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveOther:function(r){var n=t(r.name)+t(r.type),i=e(r.root,n);return i?i:void 0}})}(),function(){function e(e){this._container=e}function t(e){var t=e.get("resolver")||Ember.DefaultResolver,r=t.create({namespace:e});return function(e){return r.resolve(e)}}function r(e){var t=e.split(":"),r=t[0],n=t[1];if("template"!==r){var i=n;return i.indexOf(".")>-1&&(i=i.replace(/\.(.)/g,function(e){return e.charAt(1).toUpperCase()})),n.indexOf("_")>-1&&(i=i.replace(/_(.)/g,function(e){return e.charAt(1).toUpperCase()})),r+":"+i}return e}var n=Ember.get,i=Ember.set;e.deprecate=function(e){return function(){var t=this._container;return t[e].apply(t,arguments)}},e.prototype={_container:null,lookup:e.deprecate("lookup"),resolve:e.deprecate("resolve"),register:e.deprecate("register")};var o=Ember.Application=Ember.Namespace.extend(Ember.DeferredMixin,{rootElement:"body",eventDispatcher:null,customEvents:null,_readinessDeferrals:1,init:function(){this.$||(this.$=Ember.$),this.__container__=this.buildContainer(),this.Router=this.Router||this.defaultRouter(),this.Router&&(this.Router.namespace=this),this._super(),this.scheduleInitialize(),Ember.LOG_VERSION&&(Ember.LOG_VERSION=!1)},buildContainer:function(){var e=this.__container__=o.buildContainer(this);return e},defaultRouter:function(){return void 0===this.router?Ember.Router.extend():void 0},scheduleInitialize:function(){var e=this;!this.$||this.$.isReady?Ember.run.schedule("actions",e,"_initialize"):this.$().ready(function(){Ember.run(e,"_initialize")})},deferReadiness:function(){this._readinessDeferrals++},advanceReadiness:function(){this._readinessDeferrals--,0===this._readinessDeferrals&&Ember.run.once(this,this.didBecomeReady)},register:function(){var e=this.__container__;
e.register.apply(e,arguments)},inject:function(){var e=this.__container__;e.injection.apply(e,arguments)},initialize:function(){},_initialize:function(){return this.isDestroyed?void 0:(this.register("router:main",this.Router),this.runInitializers(),Ember.runLoadHooks("application",this),this.advanceReadiness(),this)},reset:function(){Ember.run(this,function(){Ember.run(this.__container__,"destroy"),this.buildContainer(),this._readinessDeferrals=1,Ember.run.schedule("actions",this,function(){this._initialize(),this.startRouting()})})},runInitializers:function(){var e,t,r=n(this.constructor,"initializers"),i=this.__container__,o=new Ember.DAG,s=this;for(e=0;r.length>e;e++)t=r[e],o.addEdges(t.name,t.initialize,t.before,t.after);o.topsort(function(e){var t=e.value;t(i,s)})},didBecomeReady:function(){this.setupEventDispatcher(),this.ready(),this.startRouting(),Ember.testing||(Ember.Namespace.processAll(),Ember.BOOTED=!0),this.resolve(this)},setupEventDispatcher:function(){var e=n(this,"customEvents"),t=n(this,"rootElement"),r=this.__container__.lookup("event_dispatcher:main");i(this,"eventDispatcher",r),r.setup(e,t)},startRouting:function(){var e=this.__container__.lookup("router:main");e&&e.startRouting()},handleURL:function(e){var t=this.__container__.lookup("router:main");t.handleURL(e)},ready:Ember.K,resolver:null,willDestroy:function(){Ember.BOOTED=!1,this.__container__.destroy()},initializer:function(e){this.constructor.initializer(e)}});Ember.Application.reopenClass({concatenatedProperties:["initializers"],initializers:Ember.A(),initializer:function(e){var t=n(this,"initializers");t.push(e)},buildContainer:function(n){var i=new Ember.Container;return Ember.Container.defaultContainer=new e(i),i.set=Ember.set,i.normalize=r,i.resolver=t(n),i.optionsForType("view",{singleton:!1}),i.optionsForType("template",{instantiate:!1}),i.register("application:main",n,{instantiate:!1}),i.register("controller:basic",Ember.Controller,{instantiate:!1}),i.register("controller:object",Ember.ObjectController,{instantiate:!1}),i.register("controller:array",Ember.ArrayController,{instantiate:!1}),i.register("route:basic",Ember.Route,{instantiate:!1}),i.register("event_dispatcher:main",Ember.EventDispatcher),i.injection("router:main","namespace","application:main"),i.injection("controller","target","router:main"),i.injection("controller","namespace","application:main"),i.injection("route","router","router:main"),i}}),Ember.runLoadHooks("Ember.Application",Ember.Application)}(),function(){function e(e){for(var r,n=t(e,"needs"),i=t(e,"container"),o=!0,s=0,a=n.length;a>s;s++)r=n[s],-1===r.indexOf(":")&&(r="controller:"+r),i.has(r)||(o=!1);return o}var t=Ember.get;Ember.set;var r=Ember.Object.extend({controller:null,unknownProperty:function(e){for(var r,n=t(this,"controller"),i=t(n,"needs"),o=n.get("container"),s=0,a=i.length;a>s;s++)if(r=i[s],r===e)return o.lookup("controller:"+e)}});Ember.ControllerMixin.reopen({concatenatedProperties:["needs"],needs:[],init:function(){this._super.apply(this,arguments),!e(this)},controllerFor:function(e){var r=t(this,"container");return r.lookup("controller:"+e)},controllers:Ember.computed(function(){return r.create({controller:this})})})}(),function(){var e=Ember.get,t=Ember.set;Ember.State=Ember.Object.extend(Ember.Evented,{isState:!0,parentState:null,start:null,name:null,path:Ember.computed(function(){var t=e(this,"parentState.path"),r=e(this,"name");return t&&(r=t+"."+r),r}),trigger:function(e){this[e]&&this[e].apply(this,[].slice.call(arguments,1)),this._super.apply(this,arguments)},init:function(){var r=e(this,"states");t(this,"childStates",Ember.A()),t(this,"eventTransitions",e(this,"eventTransitions")||{});var n,i,o;if(r)for(n in r)this.setupChild(r,n,r[n]);else{r={};for(n in this)"constructor"!==n&&(i=this[n])&&((o=i.transitionTarget)&&(this.eventTransitions[n]=o),this.setupChild(r,n,i));t(this,"states",r)}t(this,"pathsCaches",{})},setPathsCache:function(t,r,n){var i=Ember.guidFor(t.constructor),o=e(this,"pathsCaches"),s=o[i]||{};s[r]=n,o[i]=s},getPathsCache:function(t,r){var n=Ember.guidFor(t.constructor),i=e(this,"pathsCaches"),o=i[n]||{};return o[r]},setupChild:function(r,n,i){return i?(i.isState?t(i,"name",n):Ember.State.detect(i)&&(i=i.create({name:n})),i.isState?(t(i,"parentState",this),e(this,"childStates").pushObject(i),r[n]=i,i):void 0):!1},lookupEventTransition:function(e){for(var t,r=this;r&&!t;)t=r.eventTransitions[e],r=r.get("parentState");return t},isLeaf:Ember.computed(function(){return!e(this,"childStates").length}),hasContext:!0,setup:Ember.K,enter:Ember.K,exit:Ember.K}),Ember.State.reopenClass({transitionTo:function(e){var t=function(t,r){var n=[],i=Ember.$&&Ember.$.Event;r&&i&&r instanceof i?r.hasOwnProperty("contexts")&&(n=r.contexts.slice()):n=[].slice.call(arguments,1),n.unshift(e),t.transitionTo.apply(t,n)};return t.transitionTarget=e,t}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.String.fmt,n=Ember.ArrayPolyfills.forEach,i=function(e){this.enterStates=e.enterStates.slice(),this.exitStates=e.exitStates.slice(),this.resolveState=e.resolveState,this.finalState=e.enterStates[e.enterStates.length-1]||e.resolveState};i.prototype={normalize:function(e,t){return this.matchContextsToStates(t),this.addInitialStates(),this.removeUnchangedContexts(e),this},matchContextsToStates:function(t){for(var r,n,i=this.enterStates.length-1,o=[];t.length>0;){if(i>=0)r=this.enterStates[i--];else{if(this.enterStates.length){if(r=e(this.enterStates[0],"parentState"),!r)throw"Cannot match all contexts to states"}else r=this.resolveState;this.enterStates.unshift(r),this.exitStates.unshift(r)}n=e(r,"hasContext")?t.pop():null,o.unshift(n)}this.contexts=o},addInitialStates:function(){for(var t,r=this.finalState;;){if(t=e(r,"initialState")||"start",r=e(r,"states."+t),!r)break;this.finalState=r,this.enterStates.push(r),this.contexts.push(void 0)}},removeUnchangedContexts:function(e){for(;this.enterStates.length>0&&this.enterStates[0]===this.exitStates[0];){if(this.enterStates.length===this.contexts.length){if(e.getStateMeta(this.enterStates[0],"context")!==this.contexts[0])break;this.contexts.shift()}this.resolveState=this.enterStates.shift(),this.exitStates.shift()}}};var o=function(t,n,i){var a,u,c,l=this.enableLogging,h=i?"unhandledEvent":t,m=n[h];if(a=[].slice.call(arguments,3),"function"==typeof m)return l&&(i?Ember.Logger.log(r("STATEMANAGER: Unhandled event '%@' being sent to state %@.",[t,e(n,"path")])):Ember.Logger.log(r("STATEMANAGER: Sending event '%@' to state %@.",[t,e(n,"path")]))),c=a,i&&c.unshift(t),c.unshift(this),m.apply(n,c);var f=e(n,"parentState");return f?(u=a,u.unshift(t,f,i),o.apply(this,u)):i?void 0:s.call(this,t,a,!0)},s=function(t,r,n){return r.unshift(t,e(this,"currentState"),n),o.apply(this,r)};Ember.StateManager=Ember.State.extend({init:function(){this._super(),t(this,"stateMeta",Ember.Map.create());var r=e(this,"initialState");!r&&e(this,"states.start")&&(r="start"),r&&this.transitionTo(r)},stateMetaFor:function(t){var r=e(this,"stateMeta"),n=r.get(t);return n||(n={},r.set(t,n)),n},setStateMeta:function(e,r,n){return t(this.stateMetaFor(e),r,n)},getStateMeta:function(t,r){return e(this.stateMetaFor(t),r)},currentState:null,currentPath:Ember.computed.alias("currentState.path"),transitionEvent:"setup",errorOnUnhandledEvent:!0,send:function(e){var t=[].slice.call(arguments,1);return s.call(this,e,t,!1)},unhandledEvent:function(t,r){if(e(this,"errorOnUnhandledEvent"))throw new Ember.Error(this.toString()+" could not respond to event "+r+" in state "+e(this,"currentState.path")+".")},getStateByPath:function(t,r){for(var n=r.split("."),i=t,o=0,s=n.length;s>o&&(i=e(e(i,"states"),n[o]),i);o++);return i},findStateByPath:function(t,r){for(var n;!n&&t;)n=this.getStateByPath(t,r),t=e(t,"parentState");return n},getStatesInPath:function(t,r){if(!r||""===r)return void 0;for(var n,i,o=r.split("."),s=[],a=0,u=o.length;u>a;a++){if(n=e(t,"states"),!n)return void 0;if(i=e(n,o[a]),!i)return void 0;t=i,s.push(i)}return s},goToState:function(){return this.transitionTo.apply(this,arguments)},transitionTo:function(t,r){if(!Ember.isEmpty(t)){var n=r?Array.prototype.slice.call(arguments,1):[],o=e(this,"currentState")||this,s=this.contextFreeTransition(o,t),a=new i(s).normalize(this,n);this.enterState(a),this.triggerSetupContext(a)}},contextFreeTransition:function(t,r){var n=t.getPathsCache(this,r);if(n)return n;for(var i=this.getStatesInPath(t,r),o=[],s=t;s&&!i;){if(o.unshift(s),s=e(s,"parentState"),!s&&(i=this.getStatesInPath(this,r),!i))return;i=this.getStatesInPath(s,r)}for(;i.length>0&&i[0]===o[0];)s=i.shift(),o.shift();var a={exitStates:o,enterStates:i,resolveState:s};return t.setPathsCache(this,r,a),a},triggerSetupContext:function(t){var r=t.contexts,i=t.enterStates.length-r.length,o=t.enterStates,s=e(this,"transitionEvent");n.call(o,function(e,t){e.trigger(s,this,r[t-i])},this)},getState:function(t){var r=e(this,t),n=e(this,"parentState");return r?r:n?n.getState(t):void 0},enterState:function(r){var i=this.enableLogging,o=r.exitStates.slice(0).reverse();n.call(o,function(e){e.trigger("exit",this)},this),n.call(r.enterStates,function(t){i&&Ember.Logger.log("STATEMANAGER: Entering "+e(t,"path")),t.trigger("enter",this)},this),t(this,"currentState",r.finalState)}})}(),function(){function e(e,r){return function(){var n=t.call(arguments);return n.unshift(e),r.apply(e,n)}}var t=[].slice,r={},n={},i=[];Ember.Test={registerHelper:function(e,t){r[e]=t},unregisterHelper:function(e){delete r[e],n[e]&&(window[e]=n[e]),delete n[e]},onInjectHelpers:function(e){i.push(e)}},Ember.Application.reopen({testHelpers:{},setupForTesting:function(){this.deferReadiness(),this.Router.reopen({location:"none"})},injectTestHelpers:function(){this.testHelpers={};for(var t in r)n[t]=window[t],this.testHelpers[t]=window[t]=e(this,r[t]);for(var o=0,s=i.length;s>o;o++)i[o](this)},removeTestHelpers:function(){for(var e in r)window[e]=n[e],delete this.testHelpers[e],delete n[e]}})}(),function(){function e(e,t){return Ember.run(e,e.handleURL,t),e.__container__.lookup("router:main").location.setURL(t),i(e)}function t(e,t){return Ember.run(function(){e.$(t).click()}),i(e)}function r(e,t,r){var o=n(e,t);return Ember.run(function(){o.val(r)}),i(e)}function n(e,t){return e.$(s(e,"rootElement")).find(t)}function i(e,t){return new o(function(r){stop();var n=setInterval(function(){var i=e.__container__.lookup("router:main").router.isLoading;i||u||Ember.run.hasScheduledTimers()||Ember.run.backburner.currentInstance||(clearInterval(n),start(),Ember.run(function(){r(t)}))},10)})}var o=Ember.RSVP.Promise,s=Ember.get,a=Ember.Test.registerHelper,u=0;Ember.Test.onInjectHelpers(function(){Ember.$(document).ajaxStart(function(){u++}),Ember.$(document).ajaxStop(function(){u--})}),a("visit",e),a("click",t),a("fillIn",r),a("find",n),a("wait",i)}()})(),"undefined"==typeof location||"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname||console.warn("You are running a production build of Ember on localhost and won't receive detailed error messages. If you want full error messages please use the non-minified build provided on the Ember website.");
// ==========================================================================
// Project:   Ember Data
// Copyright: ©2011-2012 Tilde Inc. and contributors.
//            Portions ©2011 Living Social Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



// Last commit: 509b7ef (2013-05-09 18:34:32 -0700)


(function(){var e,t;(function(){var r={},n={};e=function(e,t,n){r[e]={deps:t,callback:n}},t=function(e){if(n[e])return n[e];n[e]={};for(var i,a=r[e],o=a.deps,s=a.callback,c=[],d=0,u=o.length;u>d;d++)"exports"===o[d]?c.push(i={}):c.push(t(o[d]));var h=s.apply(this,c);return n[e]=i||h}})(),function(){e("json-normalizer/hash-utils",["json-normalizer/string-utils","exports"],function(e,t){"use strict";function r(e,t,r){var n={};for(var i in e)t.call(r,n,i,e[i]);return n}var n=e.camelize,i=e.decamelize,a=function(e){return r(e,function(e,t,r){e[n(t)]=r})},o=function(e){return r(e,function(e,t,r){e[i(t)]=r})};t.map=r,t.camelizeKeys=a,t.decamelizeKeys=o}),e("json-normalizer/processor",["json-normalizer/hash-utils","exports"],function(e,t){"use strict";function r(e){this.json=e}var n=e.camelizeKeys;r.prototype={constructor:r,camelizeKeys:function(){return this.json=n(this.json),this}},t.Processor=r}),e("json-normalizer/string-utils",["exports"],function(e){"use strict";var t=/(\-|_|\.|\s)+(.)?/g,r=function(e){return e.replace(t,function(e,t,r){return r?r.toUpperCase():""}).replace(/^([A-Z])/,function(e){return e.toLowerCase()})},n=/([a-z])([A-Z])/g,i=function(e){return e.replace(n,"$1_$2").toLowerCase()};e.camelize=r,e.decamelize=i}),e("json-normalizer",["json-normalizer/string-utils","json-normalizer/hash-utils","json-normalizer/processor","exports"],function(e,t,r,n){"use strict";var i=e.camelize,a=e.decamelize,o=t.map,s=t.camelizeKeys,c=t.decamelizeKeys,d=r.Processor,u=o;n.camelize=i,n.decamelize=a,n.mapKeys=u,n.camelizeKeys=s,n.decamelizeKeys=c,n.Processor=d})}(),function(){window.DS=Ember.Namespace.create({CURRENT_API_REVISION:12})}(),function(){Ember.Date=Ember.Date||{};var e=Date.parse,t=[1,4,5,6,7,10,11];Ember.Date.parse=function(r){var n,i,a=0;if(i=/^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(r)){for(var o,s=0;o=t[s];++s)i[o]=+i[o]||0;i[2]=(+i[2]||1)-1,i[3]=+i[3]||1,"Z"!==i[8]&&void 0!==i[9]&&(a=60*i[10]+i[11],"+"===i[9]&&(a=0-a)),n=Date.UTC(i[1],i[2],i[3],i[4],i[5]+a,i[6],i[7])}else n=e?e(r):0/0;return n},(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.Date)&&(Date.parse=Ember.Date.parse)}(),function(){var e=Ember.Evented,t=Ember.DeferredMixin,r=Ember.run,n=Ember.get,i=Ember.Mixin.create(e,t,{init:function(){this._super.apply(this,arguments),this.one("didLoad",this,function(){r(this,"resolve",this)}),this.one("becameError",this,function(){r(this,"reject",this)}),n(this,"isLoaded")&&this.trigger("didLoad")}});DS.LoadPromise=i}(),function(){var e=Ember.get;Ember.set;var t=DS.LoadPromise;DS.RecordArray=Ember.ArrayProxy.extend(Ember.Evented,t,{type:null,content:null,isLoaded:!1,isUpdating:!1,store:null,objectAtContent:function(t){var r=e(this,"content"),n=r.objectAt(t),i=e(this,"store");return n?i.recordForReference(n):void 0},materializedObjectAt:function(t){var r=e(this,"content").objectAt(t);if(r)return e(this,"store").recordIsMaterialized(r)?this.objectAt(t):void 0},update:function(){if(!e(this,"isUpdating")){var t=e(this,"store"),r=e(this,"type");t.fetchAll(r,this)}},addReference:function(t){e(this,"content").addObject(t)},removeReference:function(t){e(this,"content").removeObject(t)}})}(),function(){var e=Ember.get;Ember.set;var t=Ember.run.once,r=Ember.EnumerableUtils.forEach;DS.RecordArrayManager=Ember.Object.extend({init:function(){this.filteredRecordArrays=Ember.MapWithDefault.create({defaultValue:function(){return[]}}),this.changedReferences=[]},referenceDidChange:function(e){this.changedReferences.push(e),t(this,this.updateRecordArrays)},recordArraysForReference:function(e){return e.recordArrays=e.recordArrays||Ember.OrderedSet.create(),e.recordArrays},updateRecordArrays:function(){r(this.changedReferences,function(t){var r,n=t.type,i=this.filteredRecordArrays.get(n);i.forEach(function(i){r=e(i,"filterFunction"),this.updateRecordArray(i,r,n,t)},this);var a=t.loadingRecordArrays;if(a){for(var o=0,s=a.length;s>o;o++)a[o].loadedRecord();t.loadingRecordArrays=[]}},this),this.changedReferences=[]},updateRecordArray:function(e,t,r,n){var i,a;t?(a=this.store.recordForReference(n),i=t(a)):i=!0;var o=this.recordArraysForReference(n);i?(o.add(e),e.addReference(n)):i||(o.remove(e),e.removeReference(n))},remove:function(t){var r=e(t,"_reference"),n=r.recordArrays||[];n.forEach(function(e){e.removeReference(r)})},updateFilter:function(t,r,n){for(var i,a,o,s,c=this.store.typeMapFor(r),d=c.references,u=0,h=d.length;h>u;u++)i=d[u],o=!1,a=i.data,"object"==typeof a&&((s=i.record)?e(s,"isDeleted")||(o=!0):o=!0,o&&this.updateRecordArray(t,n,r,i))},createManyArray:function(e,t){var r=DS.ManyArray.create({type:e,content:t,store:this.store});return t.forEach(function(e){var t=this.recordArraysForReference(e);t.add(r)},this),r},registerFilteredRecordArray:function(e,t,r){var n=this.filteredRecordArrays.get(t);n.push(e),this.updateFilter(e,t,r)},registerWaitingRecordArray:function(e,t){var r=t.loadingRecordArrays||[];r.push(e),t.loadingRecordArrays=r}})}(),function(){var e=Ember.get;DS.FilteredRecordArray=DS.RecordArray.extend({filterFunction:null,isLoaded:!0,replace:function(){var t=e(this,"type").toString();throw new Error("The result of a client-side filter (on "+t+") is immutable.")},updateFilter:Ember.observer(function(){var t=e(this,"manager");t.updateFilter(this,e(this,"type"),e(this,"filterFunction"))},"filterFunction")})}(),function(){var e=Ember.get,t=Ember.set;DS.AdapterPopulatedRecordArray=DS.RecordArray.extend({query:null,replace:function(){var t=e(this,"type").toString();throw new Error("The result of a server query (on "+t+") is immutable.")},load:function(e){this.beginPropertyChanges(),t(this,"content",Ember.A(e)),t(this,"isLoaded",!0),this.endPropertyChanges();var r=this;Ember.run.once(function(){r.trigger("didLoad")})}})}(),function(){var e=Ember.get,t=Ember.set;DS.ManyArray=DS.RecordArray.extend({init:function(){this._super.apply(this,arguments),this._changesToSync=Ember.OrderedSet.create()},owner:null,isPolymorphic:!1,isLoaded:!1,loadingRecordsCount:function(e){this.loadingRecordsCount=e},loadedRecord:function(){this.loadingRecordsCount--,0===this.loadingRecordsCount&&(t(this,"isLoaded",!0),this.trigger("didLoad"))},fetch:function(){var t=e(this,"content"),r=e(this,"store"),n=e(this,"owner");r.fetchUnloadedReferences(t,n)},replaceContent:function(t,r,n){n=n.map(function(t){return e(t,"_reference")},this),this._super(t,r,n)},arrangedContentDidChange:function(){this.fetch()},arrayContentWillChange:function(t,r){var n=e(this,"owner"),i=e(this,"name");if(!n._suspendedRelationships)for(var a=t;t+r>a;a++){var o=e(this,"content").objectAt(a),s=DS.RelationshipChange.createChange(n.get("_reference"),o,e(this,"store"),{parentType:n.constructor,changeType:"remove",kind:"hasMany",key:i});this._changesToSync.add(s)}return this._super.apply(this,arguments)},arrayContentDidChange:function(t,r,n){this._super.apply(this,arguments);var i=e(this,"owner"),a=e(this,"name"),o=e(this,"store");if(!i._suspendedRelationships){for(var s=t;t+n>s;s++){var c=e(this,"content").objectAt(s),d=DS.RelationshipChange.createChange(i.get("_reference"),c,o,{parentType:i.constructor,changeType:"add",kind:"hasMany",key:a});d.hasManyName=a,this._changesToSync.add(d)}this._changesToSync.forEach(function(e){e.sync()}),DS.OneToManyChange.ensureSameTransaction(this._changesToSync,o),this._changesToSync.clear()}},createRecord:function(t,r){var n,i=e(this,"owner"),a=e(i,"store"),o=e(this,"type");return r=r||e(i,"transaction"),n=a.createRecord.call(a,o,t,r),this.pushObject(n),n}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.EnumerableUtils.forEach;DS.Transaction=Ember.Object.extend({init:function(){t(this,"records",Ember.OrderedSet.create())},createRecord:function(t,r){var n=e(this,"store");return n.createRecord(t,r,this)},isEqualOrDefault:function(t){return this===t||t===e(this,"store.defaultTransaction")?!0:void 0},isDefault:Ember.computed(function(){return this===e(this,"store.defaultTransaction")}).volatile(),add:function(t){var r=e(this,"store"),n=e(r,"_adapter"),i=e(n,"serializer");i.eachEmbeddedRecord(t,function(e,t){"load"!==t&&this.add(e)},this),this.adoptRecord(t)},relationships:Ember.computed(function(){var t=Ember.OrderedSet.create(),r=e(this,"records"),n=e(this,"store");return r.forEach(function(r){for(var i=e(r,"_reference"),a=n.relationshipChangesFor(i),o=0;a.length>o;o++)t.add(a[o])}),t}).volatile(),commit:function(){var r=e(this,"store"),n=e(r,"_adapter");e(this,"isDefault")&&t(r,"defaultTransaction",r.transaction()),this.removeCleanRecords();var i=e(this,"relationships"),a=this._commitDetails();a.created.isEmpty()&&a.updated.isEmpty()&&a.deleted.isEmpty()&&a.relationships.isEmpty()||n.commit(r,a),i.forEach(function(e){e.destroy()})},_commitDetails:function(){var t=e(this,"relationships"),r={created:Ember.OrderedSet.create(),updated:Ember.OrderedSet.create(),deleted:Ember.OrderedSet.create(),relationships:t},n=e(this,"records");return n.forEach(function(t){e(t,"isDirty")&&(t.send("willCommit"),r[e(t,"dirtyType")].add(t))}),r},rollback:function(){e(this,"store");var t=Ember.OrderedSet.create(),r=e(this,"relationships");r.forEach(function(e){t.add(e.firstRecordReference),t.add(e.secondRecordReference),e.destroy()}),r.clear();var n=e(this,"records");n.forEach(function(e){e.get("isDirty")&&e.send("rollback")}),this.removeCleanRecords(),t.forEach(function(e){if(e&&e.record){var t=e.record;t.suspendRelationshipObservers(function(){t.reloadHasManys()})}},this)},remove:function(t){var r=e(this,"store.defaultTransaction");r.adoptRecord(t)},removeCleanRecords:function(){var t=e(this,"records");t.forEach(function(e){e.get("isDirty")||this.remove(e)},this)},adoptRecord:function(r){var n=e(r,"transaction");n&&n.removeRecord(r),e(this,"records").add(r),t(r,"transaction",this)},removeRecord:function(t){e(this,"records").remove(t)}}),DS.Transaction.reopenClass({ensureSameTransaction:function(t){var n=Ember.A();r(t,function(t){t&&n.pushObject(e(t,"transaction"))});var i=n.reduce(function(t,r){return e(r,"isDefault")||null!==t?t:r},null);return i?r(t,function(e){e&&i.add(e)}):i=n.objectAt(0),i}})}(),function(){Ember.get;var e=function(e){return e},t=function(e){return e},r=function(e,t){return t};DS._Mappable=Ember.Mixin.create({createInstanceMapFor:function(e){var t=Ember.metaPath(this,["DS.Mappable"],!0);if(t.values=t.values||{},t.values[e])return t.values[e];for(var r=t.values[e]=new Ember.Map,n=this.constructor;n&&n!==DS.Store;)this._copyMap(e,n,r),n=n.superclass;return t.values[e]=r,r},_copyMap:function(n,i,a){function o(n,o){var s=(i.transformMapKey||t)(n,o),c=(i.transformMapValue||r)(n,o),d=a.get(s),u=c;d&&(u=(this.constructor.resolveMapConflict||e)(d,u)),a.set(s,u)}var s=Ember.metaPath(i,["DS.Mappable"],!0),c=s[n];c&&c.forEach(o,this)}}),DS._Mappable.generateMapFunctionFor=function(e,t){return function(r,n){var i=Ember.metaPath(this,["DS.Mappable"],!0),a=i[e]||Ember.MapWithDefault.create({defaultValue:function(){return{}}});t.call(this,r,n,a),i[e]=a}}}(),function(){var e=Ember.get,t=Ember.set,r=Ember.run.once,n=Ember.isNone,i=Ember.EnumerableUtils.forEach,a=Ember.EnumerableUtils.map,o="unloaded",s="loading",c={materialized:!0},d={created:!0},u=function(e){return null==e?null:e+""};DS.Store=Ember.Object.extend(DS._Mappable,{init:function(){var r=e(this,"revision");if(r!==DS.CURRENT_API_REVISION&&!Ember.ENV.TESTING)throw new Error("Error: The Ember Data library has had breaking API changes since the last time you updated the library. Please review the list of breaking changes at https://github.com/emberjs/data/blob/master/BREAKING_CHANGES.md, then update your store's `revision` property to "+DS.CURRENT_API_REVISION);(!e(DS,"defaultStore")||e(this,"isDefaultStore"))&&t(DS,"defaultStore",this),this.typeMaps={},this.recordArrayManager=DS.RecordArrayManager.create({store:this}),this.relationshipChanges={},t(this,"currentTransaction",this.transaction()),t(this,"defaultTransaction",this.transaction())},transaction:function(){return DS.Transaction.create({store:this})},materializeData:function(t){var r=e(t,"_reference"),n=r.data,i=this.adapterForType(t.constructor);r.data=c,t.setupData(),n!==d&&i.materialize(t,n,r.prematerialized)},adapter:Ember.computed(function(){return"DS.RESTAdapter"}).property(),serialize:function(e,t){return this.adapterForType(e.constructor).serialize(e,t)},_adapter:Ember.computed(function(){var t=e(this,"adapter");return"string"==typeof t&&(t=e(this,t,!1)||e(Ember.lookup,t)),DS.Adapter.detect(t)&&(t=t.create()),t}).property("adapter"),clientIdCounter:1,createRecord:function(r,i,a){i=i||{};var o=r._create({store:this});a=a||e(this,"defaultTransaction"),a.adoptRecord(o);var s=i.id;if(n(s)){var c=this.adapterForType(r);c&&c.generateIdForRecord&&(s=u(c.generateIdForRecord(this,o)),i.id=s)}s=u(s);var h=this.createReference(r,s);return h.data=d,t(o,"_reference",h),h.record=o,o.loadedData(),o.setupData(),o.setProperties(i),Ember.run(o,"resolve",o),o},deleteRecord:function(e){e.deleteRecord()},unloadRecord:function(e){e.unloadRecord()},find:function(e,t){return void 0===t?this.findAll(e):"object"===Ember.typeOf(t)?this.findQuery(e,t):this.findById(e,u(t))},findById:function(e,t){var r;if(this.hasReferenceForId(e,t)&&(r=this.referenceForId(e,t),r.data!==o))return this.recordForReference(r);r||(r=this.createReference(e,t)),r.data=s;var n=this.materializeRecord(r);if(r.data===s){var i=this.adapterForType(e),a=this,c=i.find(this,e,t);c&&c.then&&c.then(null,function(){a.recordWasError(n)})}return n},reloadRecord:function(t){var r=t.constructor,n=this.adapterForType(r),i=this,a=e(t,"id"),o=n.find(this,r,a);o&&o.then&&o.then(null,function(){i.recordWasError(t)})},recordForReference:function(e){var t=e.record;return t||(t=this.materializeRecord(e)),t},unloadedReferences:function(e){for(var t=[],r=0,n=e.length;n>r;r++){var i=e[r];i.data===o&&(t.push(i),i.data=s)}return t},fetchUnloadedReferences:function(e,t){var r=this.unloadedReferences(e);this.fetchMany(r,t)},fetchMany:function(e,t){if(e.length){var r=Ember.MapWithDefault.create({defaultValue:function(){return Ember.A()}});i(e,function(e){r.get(e.type).push(e)}),i(r,function(e){var n=r.get(e),i=a(n,function(e){return e.id}),o=this.adapterForType(e);o.findMany(this,e,i,t)},this)}},hasReferenceForId:function(e,t){return t=u(t),!!this.typeMapFor(e).idToReference[t]},referenceForId:function(e,t){t=u(t);var r=this.typeMapFor(e).idToReference[t];return r||(r=this.createReference(e,t),r.data=o),r},findMany:function(e,t,r,n){if(!Ember.isArray(t)){var i=this.adapterForType(e);return i&&i.findHasMany&&i.findHasMany(this,r,n,t),this.recordArrayManager.createManyArray(e,Ember.A())}var o,s,c,d=a(t,function(t){return"object"!=typeof t&&null!==t?this.referenceForId(e,t):t},this),u=this.unloadedReferences(d),h=this.recordArrayManager.createManyArray(e,Ember.A(d));if(this.loadingRecordArrays,h.loadingRecordsCount(u.length),u.length){for(s=0,c=u.length;c>s;s++)o=u[s],this.recordArrayManager.registerWaitingRecordArray(h,o);this.fetchMany(u,r)}else h.set("isLoaded",!0),Ember.run.once(function(){h.trigger("didLoad")});return h},findQuery:function(e,t){var r=DS.AdapterPopulatedRecordArray.create({type:e,query:t,content:Ember.A([]),store:this}),n=this.adapterForType(e);return n.findQuery(this,e,t,r),r},findAll:function(e){return this.fetchAll(e,this.all(e))},fetchAll:function(e,r){var n=this.adapterForType(e),i=this.typeMapFor(e).metadata.since;return t(r,"isUpdating",!0),n.findAll(this,e,i),r},metaForType:function(e,r,n){var i=this.typeMapFor(e).metadata;t(i,r,n)},didUpdateAll:function(e){var r=this.typeMapFor(e).findAllCache;t(r,"isUpdating",!1)},all:function(e){var t=this.typeMapFor(e),r=t.findAllCache;if(r)return r;var n=DS.RecordArray.create({type:e,content:Ember.A([]),store:this,isLoaded:!0});return this.recordArrayManager.registerFilteredRecordArray(n,e),t.findAllCache=n,n},filter:function(e,t,r){3===arguments.length?this.findQuery(e,t):2===arguments.length&&(r=t);var n=DS.FilteredRecordArray.create({type:e,content:Ember.A([]),store:this,manager:this.recordArrayManager,filterFunction:r});return this.recordArrayManager.registerFilteredRecordArray(n,e,r),n},recordIsLoaded:function(e,t){return this.hasReferenceForId(e,t)?"object"==typeof this.referenceForId(e,t).data:!1},dataWasUpdated:function(t,r,n){e(n,"isDeleted")||"object"==typeof r.data&&this.recordArrayManager.referenceDidChange(r)},scheduleSave:function(t){e(this,"currentTransaction").add(t),r(this,"flushSavedRecords")},flushSavedRecords:function(){e(this,"currentTransaction").commit(),t(this,"currentTransaction",this.transaction())},save:function(){r(this,"commit")},commit:function(){e(this,"defaultTransaction").commit()},didSaveRecord:function(e,t){t?(this.updateId(e,t),this.updateRecordData(e,t)):this.didUpdateAttributes(e),e.adapterDidCommit()},didSaveRecords:function(e,t){var r=0;e.forEach(function(e){this.didSaveRecord(e,t&&t[r++])},this)},recordWasInvalid:function(e,t){e.adapterDidInvalidate(t)},recordWasError:function(e){e.adapterDidError()},didUpdateAttribute:function(e,t,r){e.adapterDidUpdateAttribute(t,r)},didUpdateAttributes:function(e){e.eachAttribute(function(t){this.didUpdateAttribute(e,t)},this)},didUpdateRelationship:function(t,r){var n=e(t,"_reference").clientId,i=this.relationshipChangeFor(n,r);i&&i.adapterDidUpdate()},didUpdateRelationships:function(t){var r=this.relationshipChangesFor(e(t,"_reference"));for(var n in r)r.hasOwnProperty(n)&&r[n].adapterDidUpdate()},didReceiveId:function(t,r){var n=this.typeMapFor(t.constructor),i=e(t,"clientId");e(t,"id"),n.idToCid[r]=i,this.clientIdToId[i]=r},updateRecordData:function(t,r){e(t,"_reference").data=r,t.didChangeData()},updateId:function(t,r){var n=t.constructor,i=this.typeMapFor(n),a=e(t,"_reference"),o=(e(t,"id"),this.preprocessData(n,r));i.idToReference[o]=a,a.id=o},preprocessData:function(e,t){return this.adapterForType(e).extractId(e,t)},typeMapFor:function(t){var r,n=e(this,"typeMaps"),i=Ember.guidFor(t);return(r=n[i])?r:(r={idToReference:{},references:[],metadata:{}},n[i]=r,r)},load:function(e,t,n){var i;("number"==typeof t||"string"==typeof t)&&(i=t,t=n,n=null),n&&n.id?i=n.id:void 0===i&&(i=this.preprocessData(e,t)),i=u(i);var a=this.referenceForId(e,i);return a.record&&r(a.record,"loadedData"),a.data=t,a.prematerialized=n,this.recordArrayManager.referenceDidChange(a),a},loadMany:function(e,t,r){return void 0===r&&(r=t,t=a(r,function(t){return this.preprocessData(e,t)},this)),a(t,function(t,n){return this.load(e,t,r[n])},this)},loadHasMany:function(e,r,n){var i=e.get(r+".type"),o=a(n,function(e){return{id:e,type:i}});e.materializeHasMany(r,o),e.hasManyDidChange(r);var s=e.cacheFor(r);s&&(t(s,"isLoaded",!0),s.trigger("didLoad"))},createReference:function(e,t){var r=this.typeMapFor(e),n=r.idToReference,i={id:t,clientId:this.clientIdCounter++,type:e};return t&&(n[t]=i),r.references.push(i),i},materializeRecord:function(t){var r=t.type._create({id:t.id,store:this,_reference:t});return t.record=r,e(this,"defaultTransaction").adoptRecord(r),r.loadingData(),"object"==typeof t.data&&r.loadedData(),r},dematerializeRecord:function(t){var r=e(t,"_reference"),n=r.type,i=r.id,a=this.typeMapFor(n);t.updateRecordArrays(),i&&delete a.idToReference[i];var o=a.references.indexOf(r);a.references.splice(o,1)},willDestroy:function(){e(DS,"defaultStore")===this&&t(DS,"defaultStore",null)},addRelationshipChangeFor:function(e,t,r,n,i){var a=e.clientId,o=r?r.clientId:r,s=t+n,c=this.relationshipChanges;a in c||(c[a]={}),o in c[a]||(c[a][o]={}),s in c[a][o]||(c[a][o][s]={}),c[a][o][s][i.changeType]=i},removeRelationshipChangeFor:function(e,t,r,n,i){var a=e.clientId,o=r?r.clientId:r,s=this.relationshipChanges,c=t+n;a in s&&o in s[a]&&c in s[a][o]&&delete s[a][o][c][i]},relationshipChangeFor:function(e,t,r,n,i){var a=e.clientId,o=r?r.clientId:r,s=this.relationshipChanges,c=t+n;return a in s&&o in s[a]?i?s[a][o][c][i]:s[a][o][c].add||s[a][o][c].remove:void 0},relationshipChangePairsFor:function(e){var t=[];if(!e)return t;var r=this.relationshipChanges[e.clientId];for(var n in r)if(r.hasOwnProperty(n))for(var i in r[n])r[n].hasOwnProperty(i)&&t.push(r[n][i]);return t},relationshipChangesFor:function(e){var t=[];if(!e)return t;var r=this.relationshipChangePairsFor(e);return i(r,function(e){var r=e.add,n=e.remove;r&&t.push(r),n&&t.push(n)}),t},adapterForType:function(e){this._adaptersMap=this.createInstanceMapFor("adapters");var t=this._adaptersMap.get(e);return t?t:this.get("_adapter")},recordAttributeDidChange:function(e,t,r,n){var i=e.record,a=new Ember.OrderedSet,o=this.adapterForType(i.constructor);o.dirtyRecordsForAttributeChange&&o.dirtyRecordsForAttributeChange(a,i,t,r,n),a.forEach(function(e){e.adapterDidDirty()})},recordBelongsToDidChange:function(e,t,r){var n=this.adapterForType(t.constructor);n.dirtyRecordsForBelongsToChange&&n.dirtyRecordsForBelongsToChange(e,t,r)},recordHasManyDidChange:function(e,t,r){var n=this.adapterForType(t.constructor);n.dirtyRecordsForHasManyChange&&n.dirtyRecordsForHasManyChange(e,t,r)}}),DS.Store.reopenClass({registerAdapter:DS._Mappable.generateMapFunctionFor("adapters",function(e,t,r){r.set(e,t)}),transformMapKey:function(t){if("string"==typeof t){var r;return r=e(Ember.lookup,t)}return t},transformMapValue:function(e,t){return Ember.Object.detect(t)?t.create():t}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.run.once,n=Ember.ArrayPolyfills.map,i=Ember.computed(function(t){var r=e(this,"parentState");return r?e(r,t):void 0}).property(),a=function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!0;return!1},o=function(t){var r=e(t,"record");r.materializeData()},s=function(t,r){r.oldValue=e(e(t,"record"),r.name);var n=DS.AttributeChange.createChange(r);e(t,"record")._changesToSync[r.name]=n},c=function(t,r){var n=e(t,"record")._changesToSync[r.name];n.value=e(e(t,"record"),r.name),n.sync()};DS.State=Ember.State.extend({isLoading:i,isLoaded:i,isReloading:i,isDirty:i,isSaving:i,isDeleted:i,isError:i,isNew:i,isValid:i,dirtyType:i});var d=DS.State.extend({initialState:"uncommitted",isDirty:!0,uncommitted:DS.State.extend({willSetProperty:s,didSetProperty:c,becomeDirty:Ember.K,willCommit:function(e){e.transitionTo("inFlight")},becameClean:function(t){var r=e(t,"record");r.withTransaction(function(e){e.remove(r)}),t.transitionTo("loaded.materializing")},becameInvalid:function(e){e.transitionTo("invalid")},rollback:function(t){e(t,"record").rollback()}}),inFlight:DS.State.extend({isSaving:!0,enter:function(t){var r=e(t,"record");r.becameInFlight()},materializingData:function(r){t(r,"lastDirtyType",e(this,"dirtyType")),r.transitionTo("materializing")},didCommit:function(t){var r=e(this,"dirtyType"),n=e(t,"record");n.withTransaction(function(e){e.remove(n)}),t.transitionTo("saved"),t.send("invokeLifecycleCallbacks",r)},didChangeData:o,becameInvalid:function(r,n){var i=e(r,"record");t(i,"errors",n),r.transitionTo("invalid"),r.send("invokeLifecycleCallbacks")},becameError:function(e){e.transitionTo("error"),e.send("invokeLifecycleCallbacks")}}),invalid:DS.State.extend({isValid:!1,exit:function(t){var r=e(t,"record");r.withTransaction(function(e){e.remove(r)})},deleteRecord:function(t){t.transitionTo("deleted"),e(t,"record").clearRelationships()},willSetProperty:s,didSetProperty:function(r,n){var i=e(r,"record"),o=e(i,"errors"),s=n.name;t(o,s,null),a(o)||r.send("becameValid"),c(r,n)},becomeDirty:Ember.K,rollback:function(e){e.send("becameValid"),e.send("rollback")},becameValid:function(e){e.transitionTo("uncommitted")},invokeLifecycleCallbacks:function(t){var r=e(t,"record");r.trigger("becameInvalid",r)}})}),u=d.create({dirtyType:"created",isNew:!0}),h=d.create({dirtyType:"updated"});u.states.uncommitted.reopen({deleteRecord:function(t){var r=e(t,"record");r.clearRelationships(),t.transitionTo("deleted.saved")}}),u.states.uncommitted.reopen({rollback:function(e){this._super(e),e.transitionTo("deleted.saved")}}),h.states.uncommitted.reopen({deleteRecord:function(t){var r=e(t,"record");t.transitionTo("deleted"),r.clearRelationships()}});var l={rootState:Ember.State.create({isLoading:!1,isLoaded:!1,isReloading:!1,isDirty:!1,isSaving:!1,isDeleted:!1,isError:!1,isNew:!1,isValid:!0,empty:DS.State.create({loadingData:function(e){e.transitionTo("loading")},loadedData:function(e){e.transitionTo("loaded.created")}}),loading:DS.State.create({isLoading:!0,loadedData:o,materializingData:function(e){e.transitionTo("loaded.materializing.firstTime")},becameError:function(e){e.transitionTo("error"),e.send("invokeLifecycleCallbacks")}}),loaded:DS.State.create({initialState:"saved",isLoaded:!0,materializing:DS.State.create({willSetProperty:Ember.K,didSetProperty:Ember.K,didChangeData:o,finishedMaterializing:function(e){e.transitionTo("loaded.saved")},firstTime:DS.State.create({isLoaded:!1,exit:function(t){var n=e(t,"record");r(function(){n.trigger("didLoad")})}})}),reloading:DS.State.create({isReloading:!0,enter:function(t){var r=e(t,"record"),n=e(r,"store");n.reloadRecord(r)},exit:function(t){var n=e(t,"record");r(n,"trigger","didReload")},loadedData:o,materializingData:function(e){e.transitionTo("loaded.materializing")}}),saved:DS.State.create({willSetProperty:s,didSetProperty:c,didChangeData:o,loadedData:o,reloadRecord:function(e){e.transitionTo("loaded.reloading")},materializingData:function(e){e.transitionTo("loaded.materializing")},becomeDirty:function(e){e.transitionTo("updated")},deleteRecord:function(t){t.transitionTo("deleted"),e(t,"record").clearRelationships()},unloadRecord:function(t){var r=e(t,"record");r.clearRelationships(),t.transitionTo("deleted.saved")},didCommit:function(t){var r=e(t,"record");r.withTransaction(function(e){e.remove(r)}),t.send("invokeLifecycleCallbacks",e(t,"lastDirtyType"))},invokeLifecycleCallbacks:function(t,r){var n=e(t,"record");"created"===r?n.trigger("didCreate",n):n.trigger("didUpdate",n),n.trigger("didCommit",n)}}),created:u,updated:h}),deleted:DS.State.create({initialState:"uncommitted",dirtyType:"deleted",isDeleted:!0,isLoaded:!0,isDirty:!0,setup:function(t){var r=e(t,"record"),n=e(r,"store");n.recordArrayManager.remove(r)},uncommitted:DS.State.create({willCommit:function(e){e.transitionTo("inFlight")},rollback:function(t){e(t,"record").rollback()},becomeDirty:Ember.K,becameClean:function(t){var r=e(t,"record");r.withTransaction(function(e){e.remove(r)}),t.transitionTo("loaded.materializing")}}),inFlight:DS.State.create({isSaving:!0,enter:function(t){var r=e(t,"record");r.becameInFlight()},didCommit:function(t){var r=e(t,"record");r.withTransaction(function(e){e.remove(r)}),t.transitionTo("saved"),t.send("invokeLifecycleCallbacks")}}),saved:DS.State.create({isDirty:!1,setup:function(t){var r=e(t,"record"),n=e(r,"store");n.dematerializeRecord(r)},invokeLifecycleCallbacks:function(t){var r=e(t,"record");r.trigger("didDelete",r),r.trigger("didCommit",r)}})}),error:DS.State.create({isError:!0,invokeLifecycleCallbacks:function(t){var r=e(t,"record");r.trigger("becameError",r)}})})};DS.StateManager=Ember.StateManager.extend({record:null,initialState:"rootState",states:l,unhandledEvent:function(t,r){var i,a=t.get("record"),o=[].slice.call(arguments,2);throw i="Attempted to handle event `"+r+"` ",i+="on "+a.toString()+" while in state ",i+=e(t,"currentState.path")+". Called with ",i+=n.call(o,function(e){return Ember.inspect(e)}).join(", "),new Ember.Error(i)}})}(),function(){var e=DS.LoadPromise,t=Ember.get,r=Ember.set,n=Ember.EnumerableUtils.map,i=Ember.computed(function(e){return t(t(this,"stateManager.currentState"),e)}).property("stateManager.currentState").readOnly();DS.Model=Ember.Object.extend(Ember.Evented,e,{isLoading:i,isLoaded:i,isReloading:i,isDirty:i,isSaving:i,isDeleted:i,isError:i,isNew:i,isValid:i,dirtyType:i,clientId:null,id:null,transaction:null,stateManager:null,errors:null,serialize:function(e){var r=t(this,"store");return r.serialize(this,e)},toJSON:function(e){var t=DS.JSONSerializer.create();return t.serialize(this,e)},didLoad:Ember.K,didReload:Ember.K,didUpdate:Ember.K,didCreate:Ember.K,didDelete:Ember.K,becameInvalid:Ember.K,becameError:Ember.K,data:Ember.computed(function(){return this._data||this.materializeData(),this._data}).property(),materializeData:function(){this.send("materializingData"),t(this,"store").materializeData(this),this.suspendRelationshipObservers(function(){this.notifyPropertyChange("data")})},_data:null,init:function(){this._super();var e=DS.StateManager.create({record:this});r(this,"stateManager",e),this._setup(),e.goToState("empty")},_setup:function(){this._changesToSync={}},send:function(e,r){return t(this,"stateManager").send(e,r)},withTransaction:function(e){var r=t(this,"transaction");r&&e(r)},loadingData:function(){this.send("loadingData")},loadedData:function(){this.send("loadedData")},didChangeData:function(){this.send("didChangeData")},reload:function(){this.send("reloadRecord")},deleteRecord:function(){this.send("deleteRecord")},unloadRecord:function(){this.send("unloadRecord")},clearRelationships:function(){this.eachRelationship(function(e,t){"belongsTo"===t.kind?r(this,e,null):"hasMany"===t.kind&&this.clearHasMany(t)},this)},updateRecordArrays:function(){var e=t(this,"store");e&&e.dataWasUpdated(this.constructor,t(this,"_reference"),this)},adapterDidCommit:function(){var e=t(this,"data").attributes;t(this.constructor,"attributes").forEach(function(r){e[r]=t(this,r)},this),this.send("didCommit"),this.updateRecordArraysLater()},adapterDidDirty:function(){this.send("becomeDirty"),this.updateRecordArraysLater()},dataDidChange:Ember.observer(function(){this.reloadHasManys(),this.send("finishedMaterializing")},"data"),reloadHasManys:function(){var e=t(this.constructor,"relationshipsByName");this.updateRecordArraysLater(),e.forEach(function(e,t){"hasMany"===t.kind&&this.hasManyDidChange(t.key)},this)},hasManyDidChange:function(e){var i=this.cacheFor(e);if(i){var a=t(this.constructor,"relationshipsByName").get(e).type,o=t(this,"store"),s=this._data.hasMany[e]||[],c=n(s,function(e){return"object"==typeof e?e.clientId?e:o.referenceForId(e.type,e.id):o.referenceForId(a,e)});r(i,"content",Ember.A(c))}},updateRecordArraysLater:function(){Ember.run.once(this,this.updateRecordArrays)},setupData:function(){this._data={attributes:{},belongsTo:{},hasMany:{},id:null}},materializeId:function(e){r(this,"id",e)},materializeAttributes:function(e){this._data.attributes=e},materializeAttribute:function(e,t){this._data.attributes[e]=t},materializeHasMany:function(e,t){var r=typeof t;if(t&&"string"!==r&&t.length>1&&Ember.assert("materializeHasMany expects tuples, references or opaque token, not "+t[0],t[0].hasOwnProperty("id")&&t[0].type),"string"===r)this._data.hasMany[e]=t;else{var n=t;t&&Ember.isArray(t)&&(n=this._convertTuplesToReferences(t)),this._data.hasMany[e]=n}},materializeBelongsTo:function(e,t){t&&Ember.assert("materializeBelongsTo expects a tuple or a reference, not a "+t,!t||t.hasOwnProperty("id")&&t.hasOwnProperty("type")),this._data.belongsTo[e]=t},_convertTuplesToReferences:function(e){return n(e,function(e){return this._convertTupleToReference(e)},this)},_convertTupleToReference:function(e){var r=t(this,"store");return e.clientId?e:r.referenceForId(e.type,e.id)},rollback:function(){this._setup(),this.send("becameClean"),this.suspendRelationshipObservers(function(){this.notifyPropertyChange("data")})},toStringExtension:function(){return t(this,"id")},suspendRelationshipObservers:function(e,r){var n=t(this.constructor,"relationshipNames").belongsTo,i=this;try{this._suspendedRelationships=!0,Ember._suspendObservers(i,n,null,"belongsToDidChange",function(){Ember._suspendBeforeObservers(i,n,null,"belongsToWillChange",function(){e.call(r||i)})})}finally{this._suspendedRelationships=!1}},becameInFlight:function(){},save:function(){var e=this;return this.get("store").scheduleSave(this),new Ember.RSVP.Promise(function(t){e.one("didCommit",function(){t(this)})})},adapterDidUpdateAttribute:function(e,r){void 0!==r?(t(this,"data.attributes")[e]=r,this.notifyPropertyChange(e)):(r=t(this,e),t(this,"data.attributes")[e]=r),this.updateRecordArraysLater()},adapterDidInvalidate:function(e){this.send("becameInvalid",e)},adapterDidError:function(){this.send("becameError")},trigger:function(e){Ember.tryInvoke(this,e,[].slice.call(arguments,1)),this._super.apply(this,arguments)}});var a=function(e){return function(){var r=t(DS,"defaultStore"),n=[].slice.call(arguments);return n.unshift(this),r[e].apply(r,n)}};DS.Model.reopenClass({isLoaded:a("recordIsLoaded"),find:a("find"),all:a("all"),query:a("findQuery"),filter:a("filter"),_create:DS.Model.create,create:function(){throw new Ember.Error("You should not call `create` on a model. Instead, call `createRecord` with the attributes you would like to set.")},createRecord:a("createRecord")})}(),function(){function e(e,r,n){var i=t(e,"data").attributes,a=i[n];
return void 0===a&&(a="function"==typeof r.defaultValue?r.defaultValue():r.defaultValue),a}var t=Ember.get;DS.Model.reopenClass({attributes:Ember.computed(function(){var e=Ember.Map.create();return this.eachComputedProperty(function(t,r){r.isAttribute&&(r.name=t,e.set(t,r))}),e})});var r=DS.AttributeChange=function(e){this.reference=e.reference,this.store=e.store,this.name=e.name,this.oldValue=e.oldValue};r.createChange=function(e){return new r(e)},r.prototype={sync:function(){this.store.recordAttributeDidChange(this.reference,this.name,this.value,this.oldValue),this.destroy()},destroy:function(){delete this.store.recordForReference(this.reference)._changesToSync[this.name]}},DS.Model.reopen({eachAttribute:function(e,r){t(this.constructor,"attributes").forEach(function(t,n){e.call(r,t,n)},r)},attributeWillChange:Ember.beforeObserver(function(e,r){var n=t(e,"_reference"),i=t(e,"store");e.send("willSetProperty",{reference:n,store:i,name:r})}),attributeDidChange:Ember.observer(function(e,t){e.send("didSetProperty",{name:t})})}),DS.attr=function(t,r){r=r||{};var n={type:t,isAttribute:!0,options:r};return Ember.computed(function(t,n){return arguments.length>1||(n=e(this,r,t)),n}).property("data").meta(n)}}(),function(){var e=Ember.get,t=(Ember.set,Ember.isNone);DS.belongsTo=function(r,n){n=n||{};var i={type:r,isRelationship:!0,options:n,kind:"belongsTo"};return Ember.computed(function(n,i){if("string"==typeof r&&(r=e(this,r,!1)||e(Ember.lookup,r)),2===arguments.length)return void 0===i?null:i;var a,o=e(this,"data").belongsTo,s=e(this,"store");return a=o[n],t(a)?null:a.clientId?s.recordForReference(a):a.type?s.findById(a.type,a.id):s.findById(r,a.id)}).property("data").meta(i)},DS.Model.reopen({belongsToWillChange:Ember.beforeObserver(function(t,r){if(e(t,"isLoaded")){var n=e(t,r),i=e(t,"_reference"),a=e(t,"store");if(n){var o=DS.RelationshipChange.createChange(i,e(n,"_reference"),a,{key:r,kind:"belongsTo",changeType:"remove"});o.sync(),this._changesToSync[r]=o}}}),belongsToDidChange:Ember.immediateObserver(function(t,r){if(e(t,"isLoaded")){var n=e(t,r);if(n){var i=e(t,"_reference"),a=e(t,"store"),o=DS.RelationshipChange.createChange(i,e(n,"_reference"),a,{key:r,kind:"belongsTo",changeType:"add"});o.sync(),this._changesToSync[r]&&DS.OneToManyChange.ensureSameTransaction([o,this._changesToSync[r]],a)}}delete this._changesToSync[r]})})}(),function(){function e(e,i){var a=(t(e,"store"),t(e,"data").hasMany),o=a[i.key];if(o){var s=e.constructor.inverseFor(i.key).name;n.call(o,function(t){var n;(n=t.record)&&e.suspendRelationshipObservers(function(){r(n,s,null)})})}}var t=Ember.get,r=Ember.set,n=Ember.ArrayPolyfills.forEach,i=function(e,n){n=n||{};var i={type:e,isRelationship:!0,options:n,kind:"hasMany"};return Ember.computed(function(a){var o,s,c=t(this,"data").hasMany,d=t(this,"store");return"string"==typeof e&&(e=t(this,e,!1)||t(Ember.lookup,e)),o=c[a],s=d.findMany(e,o,this,i),r(s,"owner",this),r(s,"name",a),r(s,"isPolymorphic",n.polymorphic),s}).property().meta(i)};DS.hasMany=function(e,t){return i(e,t)},DS.Model.reopen({clearHasMany:function(t){var r=this.cacheFor(t.name);r?r.clear():e(this,t)}})}(),function(){var e=Ember.get;Ember.set,DS.Model.reopen({didDefineProperty:function(e,t,r){if(r instanceof Ember.Descriptor){var n=r.meta();n.isRelationship&&"belongsTo"===n.kind&&(Ember.addObserver(e,t,null,"belongsToDidChange"),Ember.addBeforeObserver(e,t,null,"belongsToWillChange")),n.isAttribute&&(Ember.addObserver(e,t,null,"attributeDidChange"),Ember.addBeforeObserver(e,t,null,"attributeWillChange")),n.parentType=e.constructor}}}),DS.Model.reopenClass({typeForRelationship:function(t){var r=e(this,"relationshipsByName").get(t);return r&&r.type},inverseFor:function(t){function r(t,n,i){i=i||[];var a=e(n,"relationships");if(a){var o=a.get(t);return o&&i.push.apply(i,a.get(t)),t.superclass&&r(t.superclass,n,i),i}}var n=this.typeForRelationship(t);if(!n)return null;var i,a,o=this.metaForProperty(t).options;if(o.inverse)i=o.inverse,a=Ember.get(n,"relationshipsByName").get(i).kind;else{var s=r(this,n);if(0===s.length)return null;i=s[0].name,a=s[0].kind}return{type:n,name:i,kind:a}},relationships:Ember.computed(function(){var e=new Ember.MapWithDefault({defaultValue:function(){return[]}});return this.eachComputedProperty(function(t,r){if(r.isRelationship){"string"==typeof r.type&&(r.type=Ember.get(Ember.lookup,r.type));var n=e.get(r.type);n.push({name:t,kind:r.kind})}}),e}),relationshipNames:Ember.computed(function(){var e={hasMany:[],belongsTo:[]};return this.eachComputedProperty(function(t,r){r.isRelationship&&e[r.kind].push(t)}),e}),relatedTypes:Ember.computed(function(){var t,r=Ember.A([]);return this.eachComputedProperty(function(n,i){i.isRelationship&&(t=i.type,"string"==typeof t&&(t=e(this,t,!1)||e(Ember.lookup,t)),r.contains(t)||r.push(t))}),r}),relationshipsByName:Ember.computed(function(){var t,r=Ember.Map.create();return this.eachComputedProperty(function(n,i){i.isRelationship&&(i.key=n,t=i.type,"string"==typeof t&&(t=e(this,t,!1)||e(Ember.lookup,t),i.type=t),r.set(n,i))}),r}),fields:Ember.computed(function(){var e=Ember.Map.create();return this.eachComputedProperty(function(t,r){r.isRelationship?e.set(t,r.kind):r.isAttribute&&e.set(t,"attribute")}),e}),eachRelationship:function(t,r){e(this,"relationshipsByName").forEach(function(e,n){t.call(r,e,n)})},eachRelatedType:function(t,r){e(this,"relatedTypes").forEach(function(e){t.call(r,e)})}}),DS.Model.reopen({eachRelationship:function(e,t){this.constructor.eachRelationship(e,t)}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.EnumerableUtils.forEach;DS.RelationshipChange=function(e){this.parentReference=e.parentReference,this.childReference=e.childReference,this.firstRecordReference=e.firstRecordReference,this.firstRecordKind=e.firstRecordKind,this.firstRecordName=e.firstRecordName,this.secondRecordReference=e.secondRecordReference,this.secondRecordKind=e.secondRecordKind,this.secondRecordName=e.secondRecordName,this.store=e.store,this.committed={},this.changeType=e.changeType},DS.RelationshipChangeAdd=function(e){DS.RelationshipChange.call(this,e)},DS.RelationshipChangeRemove=function(e){DS.RelationshipChange.call(this,e)},DS.RelationshipChange.create=function(e){return new DS.RelationshipChange(e)},DS.RelationshipChangeAdd.create=function(e){return new DS.RelationshipChangeAdd(e)},DS.RelationshipChangeRemove.create=function(e){return new DS.RelationshipChangeRemove(e)},DS.OneToManyChange={},DS.OneToNoneChange={},DS.ManyToNoneChange={},DS.OneToOneChange={},DS.ManyToManyChange={},DS.RelationshipChange._createChange=function(e){return"add"===e.changeType?DS.RelationshipChangeAdd.create(e):"remove"===e.changeType?DS.RelationshipChangeRemove.create(e):void 0},DS.RelationshipChange.determineRelationshipType=function(e,t){var r,n,i=t.key,a=t.kind,o=e.inverseFor(i);return o&&(r=o.name,n=o.kind),o?"belongsTo"===n?"belongsTo"===a?"oneToOne":"manyToOne":"belongsTo"===a?"oneToMany":"manyToMany":"belongsTo"===a?"oneToNone":"manyToNone"},DS.RelationshipChange.createChange=function(e,t,r,n){var i,a=e.type;return i=DS.RelationshipChange.determineRelationshipType(a,n),"oneToMany"===i?DS.OneToManyChange.createChange(e,t,r,n):"manyToOne"===i?DS.OneToManyChange.createChange(t,e,r,n):"oneToNone"===i?DS.OneToNoneChange.createChange(e,t,r,n):"manyToNone"===i?DS.ManyToNoneChange.createChange(e,t,r,n):"oneToOne"===i?DS.OneToOneChange.createChange(e,t,r,n):"manyToMany"===i?DS.ManyToManyChange.createChange(e,t,r,n):void 0},DS.OneToNoneChange.createChange=function(e,t,r,n){var i=n.key,a=DS.RelationshipChange._createChange({parentReference:t,childReference:e,firstRecordReference:e,store:r,changeType:n.changeType,firstRecordName:i,firstRecordKind:"belongsTo"});return r.addRelationshipChangeFor(e,i,t,null,a),a},DS.ManyToNoneChange.createChange=function(e,t,r,n){var i=n.key,a=DS.RelationshipChange._createChange({parentReference:e,childReference:t,secondRecordReference:e,store:r,changeType:n.changeType,secondRecordName:n.key,secondRecordKind:"hasMany"});return r.addRelationshipChangeFor(e,i,t,null,a),a},DS.ManyToManyChange.createChange=function(e,t,r,n){var i=n.key,a=DS.RelationshipChange._createChange({parentReference:t,childReference:e,firstRecordReference:e,secondRecordReference:t,firstRecordKind:"hasMany",secondRecordKind:"hasMany",store:r,changeType:n.changeType,firstRecordName:i});return r.addRelationshipChangeFor(e,i,t,null,a),a},DS.OneToOneChange.createChange=function(e,t,r,n){var i;n.parentType?i=n.parentType.inverseFor(n.key).name:n.key&&(i=n.key);var a=DS.RelationshipChange._createChange({parentReference:t,childReference:e,firstRecordReference:e,secondRecordReference:t,firstRecordKind:"belongsTo",secondRecordKind:"belongsTo",store:r,changeType:n.changeType,firstRecordName:i});return r.addRelationshipChangeFor(e,i,t,null,a),a},DS.OneToOneChange.maintainInvariant=function(t,r,n,i){if("add"===t.changeType&&r.recordIsMaterialized(n)){var a=r.recordForReference(n),o=e(a,i);if(o){var s=DS.OneToOneChange.createChange(n,o.get("_reference"),r,{parentType:t.parentType,hasManyName:t.hasManyName,changeType:"remove",key:t.key});r.addRelationshipChangeFor(n,i,t.parentReference,null,s),s.sync()}}},DS.OneToManyChange.createChange=function(e,t,r,n){var i;n.parentType?(i=n.parentType.inverseFor(n.key).name,DS.OneToManyChange.maintainInvariant(n,r,e,i)):n.key&&(i=n.key);var a=DS.RelationshipChange._createChange({parentReference:t,childReference:e,firstRecordReference:e,secondRecordReference:t,firstRecordKind:"belongsTo",secondRecordKind:"hasMany",store:r,changeType:n.changeType,firstRecordName:i});return r.addRelationshipChangeFor(e,i,t,a.getSecondRecordName(),a),a},DS.OneToManyChange.maintainInvariant=function(t,r,n,i){var a=n.record;if("add"===t.changeType&&a){var o=e(a,i);if(o){var s=DS.OneToManyChange.createChange(n,o.get("_reference"),r,{parentType:t.parentType,hasManyName:t.hasManyName,changeType:"remove",key:t.key});r.addRelationshipChangeFor(n,i,t.parentReference,s.getSecondRecordName(),s),s.sync()}}},DS.OneToManyChange.ensureSameTransaction=function(e){var t=Ember.A();return r(e,function(e){t.addObject(e.getSecondRecord()),t.addObject(e.getFirstRecord())}),DS.Transaction.ensureSameTransaction(t)},DS.RelationshipChange.prototype={getSecondRecordName:function(){var e,t=this.secondRecordName;if(!t){if(e=this.secondRecordReference,!e)return;var r=this.firstRecordReference.type,n=r.inverseFor(this.firstRecordName);this.secondRecordName=n.name}return this.secondRecordName},getFirstRecordName:function(){var e=this.firstRecordName;return e},destroy:function(){var e=this.childReference,t=this.getFirstRecordName(),r=this.getSecondRecordName(),n=this.store;n.removeRelationshipChangeFor(e,t,this.parentReference,r,this.changeType)},getByReference:function(e){return this.store,e?e.record?e.record:void 0:e},getSecondRecord:function(){return this.getByReference(this.secondRecordReference)},getFirstRecord:function(){return this.getByReference(this.firstRecordReference)},ensureSameTransaction:function(){var e=this.getFirstRecord(),t=this.getSecondRecord(),r=DS.Transaction.ensureSameTransaction([e,t]);return this.transaction=r,r},callChangeEvents:function(){var t=this.getFirstRecord(),r=this.getSecondRecord(),n=new Ember.OrderedSet;r&&e(r,"isLoaded")&&this.store.recordHasManyDidChange(n,r,this),t&&this.store.recordBelongsToDidChange(n,t,this),n.forEach(function(e){e.adapterDidDirty()})},coalesce:function(){var e=this.store.relationshipChangePairsFor(this.firstRecordReference);r(e,function(e){var t=e.add,r=e.remove;t&&r&&(t.destroy(),r.destroy())})}},DS.RelationshipChangeAdd.prototype=Ember.create(DS.RelationshipChange.create({})),DS.RelationshipChangeRemove.prototype=Ember.create(DS.RelationshipChange.create({})),DS.RelationshipChangeAdd.prototype.changeType="add",DS.RelationshipChangeAdd.prototype.sync=function(){var r=this.getSecondRecordName(),n=this.getFirstRecordName(),i=this.getFirstRecord(),a=this.getSecondRecord();this.ensureSameTransaction(),this.callChangeEvents(),a&&i&&("belongsTo"===this.secondRecordKind?a.suspendRelationshipObservers(function(){t(a,r,i)}):"hasMany"===this.secondRecordKind&&a.suspendRelationshipObservers(function(){e(a,r).addObject(i)})),i&&a&&e(i,n)!==a&&("belongsTo"===this.firstRecordKind?i.suspendRelationshipObservers(function(){t(i,n,a)}):"hasMany"===this.firstRecordKind&&i.suspendRelationshipObservers(function(){e(i,n).addObject(a)})),this.coalesce()},DS.RelationshipChangeRemove.prototype.changeType="remove",DS.RelationshipChangeRemove.prototype.sync=function(){var r=this.getSecondRecordName(),n=this.getFirstRecordName(),i=this.getFirstRecord(),a=this.getSecondRecord();this.ensureSameTransaction(i,a,r,n),this.callChangeEvents(),a&&i&&("belongsTo"===this.secondRecordKind?a.suspendRelationshipObservers(function(){t(a,r,null)}):"hasMany"===this.secondRecordKind&&a.suspendRelationshipObservers(function(){e(a,r).removeObject(i)})),i&&e(i,n)&&("belongsTo"===this.firstRecordKind?i.suspendRelationshipObservers(function(){t(i,n,null)}):"hasMany"===this.firstRecordKind&&i.suspendRelationshipObservers(function(){e(i,n).removeObject(a)})),this.coalesce()}}(),function(){var e=Ember.set;Ember.onLoad("Ember.Application",function(t){t.registerInjection?(t.registerInjection({name:"store",before:"controllers",injection:function(t,r,n){r&&"Store"===n&&e(r,"store",t[n].create())}}),t.registerInjection({name:"giveStoreToControllers",after:["store","controllers"],injection:function(e,t,r){if(t&&/^[A-Z].*Controller$/.test(r)){var n=r.charAt(0).toLowerCase()+r.substr(1),i=t.get("store"),a=t.get(n);if(!a)return;a.set("store",i)}}})):t.initializer&&(t.initializer({name:"store",initialize:function(e,t){t.register("store:main",t.Store),e.lookup("store:main")}}),t.initializer({name:"injectStore",initialize:function(e,t){t.inject("controller","store","store:main"),t.inject("route","store","store:main")}}))})}(),function(){function e(e){return function(){throw new Ember.Error("Your serializer "+this.toString()+" does not implement the required method "+e)}}var t=Ember.get,r=(Ember.set,Ember.ArrayPolyfills.map),n=Ember.isNone;DS.Serializer=Ember.Object.extend({init:function(){this.mappings=Ember.Map.create(),this.aliases=Ember.Map.create(),this.configurations=Ember.Map.create(),this.globalConfigurations={}},extract:e("extract"),extractMany:e("extractMany"),extractId:e("extractId"),extractAttribute:e("extractAttribute"),extractHasMany:e("extractHasMany"),extractBelongsTo:e("extractBelongsTo"),extractRecordRepresentation:function(e,t,r,i){var a,o={};return a=i?e.sideload(t,r):e.load(t,r),this.eachEmbeddedHasMany(t,function(t,i){var s=r[this.keyFor(i)];n(s)||this.extractEmbeddedHasMany(e,i,s,a,o)},this),this.eachEmbeddedBelongsTo(t,function(t,i){var s=r[this.keyFor(i)];n(s)||this.extractEmbeddedBelongsTo(e,i,s,a,o)},this),e.prematerialize(a,o),a},extractEmbeddedHasMany:function(e,t,n,i,a){var o=r.call(n,function(r){if(r){var n=this.extractEmbeddedType(t,r),a=this.extractRecordRepresentation(e,n,r,!0),o=this.embeddedType(i.type,t.key);return"always"===o&&(a.parent=i),a}},this);a[t.key]=o},extractEmbeddedBelongsTo:function(e,t,r,n,i){var a=this.extractEmbeddedType(t,r),o=this.extractRecordRepresentation(e,a,r,!0);i[t.key]=o;var s=this.embeddedType(n.type,t.key);"always"===s&&(o.parent=n)},extractEmbeddedType:function(e){return e.type},serialize:function(e,r){r=r||{};var n,i=this.createSerializedForm();return r.includeId&&(n=t(e,"id"))&&this._addId(i,e.constructor,n),r.includeType&&this.addType(i,e.constructor),this.addAttributes(i,e),this.addRelationships(i,e),i},serializeValue:function(e,t){var r=this.transforms?this.transforms[t]:null;return r.serialize(e)},serializeId:function(e){return isNaN(e)?e:+e},addAttributes:function(e,t){t.eachAttribute(function(r,n){this._addAttribute(e,t,r,n.type)},this)},addAttribute:e("addAttribute"),addId:e("addId"),addType:Ember.K,createSerializedForm:function(){return{}},addRelationships:function(e,t){t.eachRelationship(function(r,n){"belongsTo"===n.kind?this._addBelongsTo(e,t,r,n):"hasMany"===n.kind&&this._addHasMany(e,t,r,n)},this)},addBelongsTo:e("addBelongsTo"),addHasMany:e("addHasMany"),keyForAttributeName:function(e,t){return t},primaryKey:function(){return"id"},keyForBelongsTo:function(e,t){return this.keyForAttributeName(e,t)},keyForHasMany:function(e,t){return this.keyForAttributeName(e,t)},materialize:function(e,r,n){var i;Ember.isNone(t(e,"id"))&&(i=n&&n.hasOwnProperty("id")?n.id:this.extractId(e.constructor,r),e.materializeId(i)),this.materializeAttributes(e,r,n),this.materializeRelationships(e,r,n)},deserializeValue:function(e,t){var r=this.transforms?this.transforms[t]:null;return r.deserialize(e)},materializeAttributes:function(e,t,r){e.eachAttribute(function(n,i){r&&r.hasOwnProperty(n)?e.materializeAttribute(n,r[n]):this.materializeAttribute(e,t,n,i.type)},this)},materializeAttribute:function(e,t,r,n){var i=this.extractAttribute(e.constructor,t,r);i=this.deserializeValue(i,n),e.materializeAttribute(r,i)},materializeRelationships:function(e,t,r){e.eachRelationship(function(n,i){if("hasMany"===i.kind)if(r&&r.hasOwnProperty(n)){var a=this._convertPrematerializedHasMany(i.type,r[n]);e.materializeHasMany(n,a)}else this.materializeHasMany(n,e,t,i,r);else if("belongsTo"===i.kind)if(r&&r.hasOwnProperty(n)){var o=this._convertTuple(i.type,r[n]);e.materializeBelongsTo(n,o)}else this.materializeBelongsTo(n,e,t,i,r)},this)},materializeHasMany:function(e,t,r,n){var i=t.constructor,a=this._keyForHasMany(i,n.key),o=this.extractHasMany(i,r,a),s=o;o&&Ember.isArray(o)&&(s=this._convertTuples(n.type,o)),t.materializeHasMany(e,s)},materializeBelongsTo:function(e,t,r,i){var a,o=t.constructor,s=this._keyForBelongsTo(o,i.key),c=null;a=i.options&&i.options.polymorphic?this.extractBelongsToPolymorphic(o,r,s):this.extractBelongsTo(o,r,s),n(a)||(c=this._convertTuple(i.type,a)),t.materializeBelongsTo(e,c)},_convertPrematerializedHasMany:function(e,t){var r;return r="string"==typeof t?t:this._convertTuples(e,t)},_convertTuples:function(e,t){return r.call(t,function(t){return this._convertTuple(e,t)},this)},_convertTuple:function(e,t){var r;return"object"==typeof t?DS.Model.detect(t.type)?t:(r=this.typeFromAlias(t.type),{id:t.id,type:r}):{id:t,type:e}},_primaryKey:function(e){var t=this.configurationForType(e),r=t&&t.primaryKey;return r?r:this.primaryKey(e)},_addAttribute:function(e,r,n,i){var a=this._keyForAttributeName(r.constructor,n),o=t(r,n);this.addAttribute(e,a,this.serializeValue(o,i))},_addId:function(e,t,r){var n=this._primaryKey(t);this.addId(e,n,this.serializeId(r))},_keyForAttributeName:function(e,t){return this._keyFromMappingOrHook("keyForAttributeName",e,t)},_keyForBelongsTo:function(e,t){return this._keyFromMappingOrHook("keyForBelongsTo",e,t)},keyFor:function(e){var t=e.parentType,r=e.key;switch(e.kind){case"belongsTo":return this._keyForBelongsTo(t,r);case"hasMany":return this._keyForHasMany(t,r)}},_keyForHasMany:function(e,t){return this._keyFromMappingOrHook("keyForHasMany",e,t)},_addBelongsTo:function(e,t,r,n){var i=this._keyForBelongsTo(t.constructor,r);this.addBelongsTo(e,t,i,n)},_addHasMany:function(e,t,r,n){var i=this._keyForHasMany(t.constructor,r);this.addHasMany(e,t,i,n)},_keyFromMappingOrHook:function(e,t,r){var n=this.mappingOption(t,r,"key");return n?n:this[e](t,r)},registerTransform:function(e,t){this.transforms[e]=t},registerEnumTransform:function(e,t){var r={deserialize:function(e){return Ember.A(t).objectAt(e)},serialize:function(e){return Ember.EnumerableUtils.indexOf(t,e)},values:t};this.registerTransform(e,r)},map:function(e,t){this.mappings.set(e,t)},configure:function(e,t){if(e&&!t)return Ember.merge(this.globalConfigurations,e),void 0;var r,n;t.alias&&(n=t.alias,this.aliases.set(n,e),delete t.alias),r=Ember.create(this.globalConfigurations),Ember.merge(r,t),this.configurations.set(e,r)},typeFromAlias:function(e){return this._completeAliases(),this.aliases.get(e)},mappingForType:function(e){return this._reifyMappings(),this.mappings.get(e)||{}},configurationForType:function(e){return this._reifyConfigurations(),this.configurations.get(e)||this.globalConfigurations},_completeAliases:function(){this._pluralizeAliases(),this._reifyAliases()},_pluralizeAliases:function(){if(!this._didPluralizeAliases){var e,t=this.aliases,r=this.aliases.sideloadMapping,n=this;t.forEach(function(r,i){e=n.pluralize(r),t.set(e,i)}),r&&(r.forEach(function(e,r){t.set(e,r)}),delete this.aliases.sideloadMapping),this._didPluralizeAliases=!0}},_reifyAliases:function(){if(!this._didReifyAliases){var e,t=this.aliases,r=Ember.Map.create();t.forEach(function(t,n){"string"==typeof n?(e=Ember.get(Ember.lookup,n),r.set(t,e)):r.set(t,n)}),this.aliases=r,this._didReifyAliases=!0}},_reifyMappings:function(){if(!this._didReifyMappings){var e=this.mappings,t=Ember.Map.create();e.forEach(function(e,r){if("string"==typeof e){var n=Ember.get(Ember.lookup,e);t.set(n,r)}else t.set(e,r)}),this.mappings=t,this._didReifyMappings=!0}},_reifyConfigurations:function(){if(!this._didReifyConfigurations){var e=this.configurations,t=Ember.Map.create();e.forEach(function(e,r){if("string"==typeof e&&"plurals"!==e){var n=Ember.get(Ember.lookup,e);t.set(n,r)}else t.set(e,r)}),this.configurations=t,this._didReifyConfigurations=!0}},mappingOption:function(e,t,r){var n=this.mappingForType(e)[t];return n&&n[r]},configOption:function(e,t){var r=this.configurationForType(e);return r[t]},embeddedType:function(e,t){return this.mappingOption(e,t,"embedded")},eachEmbeddedRecord:function(e,t,r){this.eachEmbeddedBelongsToRecord(e,t,r),this.eachEmbeddedHasManyRecord(e,t,r)},eachEmbeddedBelongsToRecord:function(e,r,n){this.eachEmbeddedBelongsTo(e.constructor,function(i,a,o){var s=t(e,i);s&&r.call(n,s,o)})},eachEmbeddedHasManyRecord:function(e,r,n){this.eachEmbeddedHasMany(e.constructor,function(i,a,o){for(var s=t(e,i),c=0,d=t(s,"length");d>c;c++)r.call(n,s.objectAt(c),o)})},eachEmbeddedHasMany:function(e,t,r){this.eachEmbeddedRelationship(e,"hasMany",t,r)},eachEmbeddedBelongsTo:function(e,t,r){this.eachEmbeddedRelationship(e,"belongsTo",t,r)},eachEmbeddedRelationship:function(e,t,r,n){e.eachRelationship(function(i,a){var o=this.embeddedType(e,i);o&&a.kind===t&&r.call(n,i,a,o)},this)},pluralize:function(e){var t=this.configurations.get("plurals");return t&&t[e]||e+"s"},singularize:function(e){var t=this.configurations.get("plurals");if(t)for(var r in t)if(t[r]===e)return r;return e.lastIndexOf("s")===e.length-1?e.substring(0,e.length-1):e}})}(),function(){var e=Ember.isNone,t=Ember.isEmpty;DS.JSONTransforms={string:{deserialize:function(t){return e(t)?null:String(t)},serialize:function(t){return e(t)?null:String(t)}},number:{deserialize:function(e){return t(e)?null:Number(e)},serialize:function(e){return t(e)?null:Number(e)}},"boolean":{deserialize:function(e){var t=typeof e;return"boolean"===t?e:"string"===t?null!==e.match(/^true$|^t$|^1$/i):"number"===t?1===e:!1},serialize:function(e){return Boolean(e)}},date:{deserialize:function(e){var t=typeof e;return"string"===t?new Date(Ember.Date.parse(e)):"number"===t?new Date(e):null===e||void 0===e?e:null},serialize:function(e){if(e instanceof Date){var t=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],n=function(e){return 10>e?"0"+e:""+e},i=e.getUTCFullYear(),a=e.getUTCMonth(),o=e.getUTCDate(),s=e.getUTCDay(),c=e.getUTCHours(),d=e.getUTCMinutes(),u=e.getUTCSeconds(),h=t[s],l=n(o),f=r[a];return h+", "+l+" "+f+" "+i+" "+n(c)+":"+n(d)+":"+n(u)+" GMT"}return null}}}}(),function(){var e=Ember.get;Ember.set,DS.JSONSerializer=DS.Serializer.extend({init:function(){this._super(),e(this,"transforms")||this.set("transforms",DS.JSONTransforms),this.sideloadMapping=Ember.Map.create(),this.metadataMapping=Ember.Map.create(),this.configure({meta:"meta",since:"since"})},configure:function(t,r){var n;if(t&&!r){for(n in t)this.metadataMapping.set(e(t,n),n);return this._super(t)}var i,a=r.sideloadAs;a&&(i=this.aliases.sideloadMapping||Ember.Map.create(),i.set(a,t),this.aliases.sideloadMapping=i,delete r.sideloadAs),this._super.apply(this,arguments)},addId:function(e,t,r){e[t]=r},addAttribute:function(e,t,r){e[t]=r},extractAttribute:function(e,t,r){var n=this._keyForAttributeName(e,r);return t[n]},extractId:function(e,t){var r=this._primaryKey(e);return t.hasOwnProperty(r)?t[r]+"":null},extractHasMany:function(e,t,r){return t[r]},extractBelongsTo:function(e,t,r){return t[r]},extractBelongsToPolymorphic:function(e,t,r){var n,i=this.keyForPolymorphicId(r),a=t[i];return a?(n=this.keyForPolymorphicType(r),{id:a,type:t[n]}):null},addBelongsTo:function(t,r,n,i){var a,o,s,c=r.constructor,d=i.key,u=null,h=i.options&&i.options.polymorphic;this.embeddedType(c,d)?((a=e(r,d))&&(u=this.serialize(a,{includeId:!0,includeType:h})),t[n]=u):(o=e(r,i.key),s=e(o,"id"),i.options&&i.options.polymorphic&&!Ember.isNone(s)?this.addBelongsToPolymorphic(t,n,s,o.constructor):t[n]=void 0===s?null:this.serializeId(s))},addBelongsToPolymorphic:function(e,t,r,n){var i=this.keyForPolymorphicId(t),a=this.keyForPolymorphicType(t);e[i]=r,e[a]=this.rootForType(n)},addHasMany:function(t,r,n,i){var a,o,s=r.constructor,c=i.key,d=[],u=i.options&&i.options.polymorphic;o=this.embeddedType(s,c),"always"===o&&(a=e(r,c),a.forEach(function(e){d.push(this.serialize(e,{includeId:!0,includeType:u}))},this),t[n]=d)},addType:function(e,t){var r=this.keyForEmbeddedType();e[r]=this.rootForType(t)},extract:function(e,t,r,n){var i=this.rootForType(r);this.sideload(e,r,t,i),this.extractMeta(e,r,t),t[i]&&(n&&e.updateId(n,t[i]),this.extractRecordRepresentation(e,r,t[i]))},extractMany:function(e,t,r,n){var i=this.rootForType(r);if(i=this.pluralize(i),this.sideload(e,r,t,i),this.extractMeta(e,r,t),t[i]){var a=t[i],o=[];n&&(n=n.toArray());for(var s=0;a.length>s;s++){n&&e.updateId(n[s],a[s]);var c=this.extractRecordRepresentation(e,r,a[s]);o.push(c)}e.populateArray(o)}},extractMeta:function(e,t,r){var n,i=this.configOption(t,"meta"),a=r;i&&r[i]&&(a=r[i]),this.metadataMapping.forEach(function(r,i){(n=a[r])&&e.metaForType(t,i,n)})},extractEmbeddedType:function(e,t){var r=e.type;if(e.options&&e.options.polymorphic){var n=this.keyFor(e),i=this.keyForEmbeddedType(n);r=this.typeFromAlias(t[i]),delete t[i]}return r},sideload:function(e,t,r,n){var i;this.configureSideloadMappingForType(t);for(var a in r)r.hasOwnProperty(a)&&a!==n&&!this.metadataMapping.get(a)&&(i=this.typeFromAlias(a),this.loadValue(e,i,r[a]))},configureSideloadMappingForType:function(e,t){t||(t=Ember.A([])),t.pushObject(e),e.eachRelatedType(function(e){if(!t.contains(e)){var r=this.defaultSideloadRootForType(e);this.aliases.set(r,e),this.configureSideloadMappingForType(e,t)}},this)},loadValue:function(e,t,r){if(r instanceof Array)for(var n=0;r.length>n;n++)e.sideload(t,r[n]);else e.sideload(t,r)},keyForPolymorphicId:function(e){return e},keyForPolymorphicType:function(e){return this.keyForPolymorphicId(e)+"_type"},keyForEmbeddedType:function(){return"type"},rootForType:function(e){var t=e.toString(),r=t.split("."),n=r[r.length-1];return n.replace(/([A-Z])/g,"_$1").toLowerCase().slice(1)},defaultSideloadRootForType:function(e){return this.pluralize(this.rootForType(e))}})}(),function(){function e(e){return{load:function(t,r,n){return e.load(t,r,n)},loadMany:function(t,r){return e.loadMany(t,r)},updateId:function(t,r){return e.updateId(t,r)},populateArray:Ember.K,sideload:function(t,r){return e.adapterForType(t).load(e,t,r)},sideloadMany:function(t,r){return e.loadMany(t,r)},prematerialize:function(e,t){e.prematerialized=t},metaForType:function(t,r,n){e.metaForType(t,r,n)}}}var t=Ember.get,r=Ember.set,n=Ember.merge;DS.loaderFor=e,DS.Adapter=Ember.Object.extend(DS._Mappable,{init:function(){var e=t(this,"serializer");Ember.Object.detect(e)&&(e=e.create(),r(this,"serializer",e)),this._attributesMap=this.createInstanceMapFor("attributes"),this._configurationsMap=this.createInstanceMapFor("configurations"),this._outstandingOperations=new Ember.MapWithDefault({defaultValue:function(){return 0}}),this._dependencies=new Ember.MapWithDefault({defaultValue:function(){return new Ember.OrderedSet}}),this.registerSerializerTransforms(this.constructor,e,{}),this.registerSerializerMappings(e)},load:function(r,n,i){var a=e(r);return t(this,"serializer").extractRecordRepresentation(a,n,i)},didCreateRecord:function(e,r,n,i){if(e.didSaveRecord(n),i){var a=DS.loaderFor(e);a.load=function(t,r,i){return e.updateId(n,r),e.load(t,r,i)},t(this,"serializer").extract(a,i,r)}},didCreateRecords:function(e,r,n,i){if(n.forEach(function(t){e.didSaveRecord(t)},this),i){var a=DS.loaderFor(e);t(this,"serializer").extractMany(a,i,r,n)}},didSaveRecord:function(e,r,n,i){e.didSaveRecord(n);var a=t(this,"serializer");if(a.eachEmbeddedRecord(n,function(t,r){"load"!==r&&this.didSaveRecord(e,t.constructor,t)},this),i){var o=DS.loaderFor(e);a.extract(o,i,r)}},didUpdateRecord:function(){this.didSaveRecord.apply(this,arguments)},didDeleteRecord:function(){this.didSaveRecord.apply(this,arguments)},didSaveRecords:function(e,r,n,i){if(n.forEach(function(t){e.didSaveRecord(t)},this),i){var a=DS.loaderFor(e);t(this,"serializer").extractMany(a,i,r)}},didUpdateRecords:function(){this.didSaveRecords.apply(this,arguments)},didDeleteRecords:function(){this.didSaveRecords.apply(this,arguments)},didFindRecord:function(e,r,n,i){var a=DS.loaderFor(e);a.load=function(t,r,n){return n=n||{},n.id=i,e.load(t,r,n)},t(this,"serializer").extract(a,n,r)},didFindAll:function(e,r,n){var i=DS.loaderFor(e),a=t(this,"serializer");e.didUpdateAll(r),a.extractMany(i,n,r)},didFindQuery:function(e,r,n,i){var a=DS.loaderFor(e);a.populateArray=function(e){i.load(e)},t(this,"serializer").extractMany(a,n,r)},didFindMany:function(e,r,n){var i=DS.loaderFor(e);t(this,"serializer").extractMany(i,n,r)},didError:function(e,t,r){e.recordWasError(r)},dirtyRecordsForAttributeChange:function(e,t,r,n,i){n!==i&&this.dirtyRecordsForRecordChange(e,t)},dirtyRecordsForRecordChange:function(e,t){e.add(t)},dirtyRecordsForBelongsToChange:function(e,t){this.dirtyRecordsForRecordChange(e,t)},dirtyRecordsForHasManyChange:function(e,t){this.dirtyRecordsForRecordChange(e,t)},registerSerializerTransforms:function(e,t,r){var n,i,a=e._registeredTransforms,o=e._registeredEnumTransforms;for(i in a)!a.hasOwnProperty(i)||i in r||(r[i]=!0,t.registerTransform(i,a[i]));for(i in o)!o.hasOwnProperty(i)||i in r||(r[i]=!0,t.registerEnumTransform(i,o[i]));(n=e.superclass)&&this.registerSerializerTransforms(n,t,r)},registerSerializerMappings:function(e){var t=this._attributesMap,r=this._configurationsMap;t.forEach(e.map,e),r.forEach(e.configure,e)},find:null,serializer:DS.JSONSerializer,registerTransform:function(e,r){t(this,"serializer").registerTransform(e,r)},registerEnumTransform:function(e,r){t(this,"serializer").registerEnumTransform(e,r)},generateIdForRecord:null,materialize:function(e,r,n){t(this,"serializer").materialize(e,r,n)},serialize:function(e,r){return t(this,"serializer").serialize(e,r)},extractId:function(e,r){return t(this,"serializer").extractId(e,r)},groupByType:function(e){var t=Ember.MapWithDefault.create({defaultValue:function(){return Ember.OrderedSet.create()}});return e.forEach(function(e){t.get(e.constructor).add(e)}),t},commit:function(e,t){this.save(e,t)},save:function(e,t){function r(e){var t=Ember.OrderedSet.create();return e.forEach(function(e){n.shouldSave(e)&&t.add(e)}),t}var n=this;this.groupByType(t.created).forEach(function(t,n){this.createRecords(e,t,r(n))},this),this.groupByType(t.updated).forEach(function(t,n){this.updateRecords(e,t,r(n))},this),this.groupByType(t.deleted).forEach(function(t,n){this.deleteRecords(e,t,r(n))},this)},shouldSave:Ember.K,createRecords:function(e,t,r){r.forEach(function(r){this.createRecord(e,t,r)},this)},updateRecords:function(e,t,r){r.forEach(function(r){this.updateRecord(e,t,r)},this)},deleteRecords:function(e,t,r){r.forEach(function(r){this.deleteRecord(e,t,r)},this)},findMany:function(e,t,r){r.forEach(function(r){this.find(e,t,r)},this)}}),DS.Adapter.reopenClass({registerTransform:function(e,t){var r=this._registeredTransforms||{};r[e]=t,this._registeredTransforms=r},registerEnumTransform:function(e,t){var r=this._registeredEnumTransforms||{};r[e]=t,this._registeredEnumTransforms=r},map:DS._Mappable.generateMapFunctionFor("attributes",function(e,t,r){var i=r.get(e);n(i,t)}),configure:DS._Mappable.generateMapFunctionFor("configurations",function(e,t,r){var i=r.get(e),a=t&&t.mappings;a&&(this.map(e,a),delete t.mappings),n(i,t)}),resolveMapConflict:function(e,t){return n(t,e),t}})}(),function(){var e=Ember.get;Ember.set,DS.FixtureSerializer=DS.Serializer.extend({deserializeValue:function(e){return e},serializeValue:function(e){return e},addId:function(e,t,r){e[t]=r},addAttribute:function(e,t,r){e[t]=r},addBelongsTo:function(t,r,n,i){var a=e(r,i.key+".id");
Ember.isNone(a)||(t[n]=a)},addHasMany:function(t,r,n,i){var a=e(r,i.key).map(function(e){return e.get("id")});t[i.key]=a},extract:function(e,t,r,n){n&&e.updateId(n,t),this.extractRecordRepresentation(e,r,t)},extractMany:function(e,t,r,n){var i=t,a=[];n&&(n=n.toArray());for(var o=0;i.length>o;o++){n&&e.updateId(n[o],i[o]);var s=this.extractRecordRepresentation(e,r,i[o]);a.push(s)}e.populateArray(a)},extractId:function(e,t){var r=this._primaryKey(e);return t.hasOwnProperty(r)?t[r]+"":null},extractAttribute:function(e,t,r){var n=this._keyForAttributeName(e,r);return t[n]},extractHasMany:function(e,t,r){return t[r]},extractBelongsTo:function(e,t,r){var n=t[r];return null!==n&&void 0!==n&&(n+=""),n},extractBelongsToPolymorphic:function(e,t,r){var n,i=this.keyForPolymorphicId(r),a=t[i];return a?(n=this.keyForPolymorphicType(r),{id:a,type:t[n]}):null},keyForPolymorphicId:function(e){return e},keyForPolymorphicType:function(e){return e+"_type"}})}(),function(){var e=Ember.get,t=Ember.String.fmt,r=Ember.get(window,"JSON.stringify")||function(e){return e.toString()};DS.FixtureAdapter=DS.Adapter.extend({simulateRemoteResponse:!0,latency:50,serializer:DS.FixtureSerializer,fixturesForType:function(e){if(e.FIXTURES){var n=Ember.A(e.FIXTURES);return n.map(function(e){if(!e.id)throw new Error(t("the id property must be defined for fixture %@",[r(e)]));return e.id=e.id+"",e})}return null},queryFixtures:function(){},updateFixtures:function(e,t){e.FIXTURES||(e.FIXTURES=[]);var r=e.FIXTURES;this.deleteLoadedFixture(e,t),r.push(t)},mockJSON:function(e,t){return this.serialize(t,{includeId:!0})},generateIdForRecord:function(e,t){return Ember.guidFor(t)},find:function(e,t,r){var n,i=this.fixturesForType(t);i&&(n=Ember.A(i).findProperty("id",r)),n&&this.simulateRemoteCall(function(){this.didFindRecord(e,t,n,r)},this)},findMany:function(e,t,r){var n=this.fixturesForType(t);n&&(n=n.filter(function(e){return-1!==r.indexOf(e.id)})),n&&this.simulateRemoteCall(function(){this.didFindMany(e,t,n)},this)},findAll:function(e,t){var r=this.fixturesForType(t);this.simulateRemoteCall(function(){this.didFindAll(e,t,r)},this)},findQuery:function(e,t,r,n){var i=this.fixturesForType(t);i=this.queryFixtures(i,r,t),i&&this.simulateRemoteCall(function(){this.didFindQuery(e,t,i,n)},this)},createRecord:function(e,t,r){var n=this.mockJSON(t,r);this.updateFixtures(t,n),this.simulateRemoteCall(function(){this.didCreateRecord(e,t,r,n)},this)},updateRecord:function(e,t,r){var n=this.mockJSON(t,r);this.updateFixtures(t,n),this.simulateRemoteCall(function(){this.didUpdateRecord(e,t,r,n)},this)},deleteRecord:function(e,t,r){var n=this.mockJSON(t,r);this.deleteLoadedFixture(t,n),this.simulateRemoteCall(function(){this.didDeleteRecord(e,t,r)},this)},deleteLoadedFixture:function(e,t){var r=this.findExistingFixture(e,t);if(r){var n=e.FIXTURES.indexOf(r);return e.FIXTURES.splice(n,1),!0}},findExistingFixture:function(e,t){var r=this.fixturesForType(e),n=this.extractId(e,t);return this.findFixtureById(r,n)},findFixtureById:function(t,r){return Ember.A(t).find(function(t){return""+e(t,"id")==""+r?!0:!1})},simulateRemoteCall:function(t,r){e(this,"simulateRemoteResponse")?Ember.run.later(r,t,e(this,"latency")):Ember.run.once(r,t)}})}(),function(){var e=Ember.get;DS.RESTSerializer=DS.JSONSerializer.extend({keyForAttributeName:function(e,t){return Ember.String.decamelize(t)},keyForBelongsTo:function(e,t){var r=this.keyForAttributeName(e,t);return this.embeddedType(e,t)?r:r+"_id"},keyForHasMany:function(e,t){var r=this.keyForAttributeName(e,t);return this.embeddedType(e,t)?r:this.singularize(r)+"_ids"},keyForPolymorphicId:function(e){return e},keyForPolymorphicType:function(e){return e.replace(/_id$/,"_type")},extractValidationErrors:function(t,r){var n={};return e(t,"attributes").forEach(function(e){var i=this._keyForAttributeName(t,e);r.errors.hasOwnProperty(i)&&(n[e]=r.errors[i])},this),n}})}(),function(){var e=Ember.get;Ember.set,DS.RESTAdapter=DS.Adapter.extend({namespace:null,bulkCommit:!1,since:"since",serializer:DS.RESTSerializer,init:function(){this._super.apply(this,arguments)},shouldSave:function(t){var r=e(t,"_reference");return!r.parent},dirtyRecordsForRecordChange:function(e,t){this._dirtyTree(e,t)},dirtyRecordsForHasManyChange:function(t,r,n){var i=e(this,"serializer").embeddedType(r.constructor,n.secondRecordName);"always"===i&&(n.childReference.parent=n.parentReference,this._dirtyTree(t,r))},_dirtyTree:function(t,r){t.add(r),e(this,"serializer").eachEmbeddedRecord(r,function(e,r){"always"===r&&(t.has(e)||this._dirtyTree(t,e))},this);var n=r.get("_reference");if(n.parent){var i=e(r,"store"),a=i.recordForReference(n.parent);this._dirtyTree(t,a)}},createRecord:function(e,t,r){var n=this.rootForType(t),i=this,a={};return a[n]=this.serialize(r,{includeId:!0}),this.ajax(this.buildURL(n),"POST",{data:a}).then(function(n){Ember.run(i,"didCreateRecord",e,t,r,n)},function(n){throw i.didError(e,t,r,n),n})},createRecords:function(t,r,n){var i=this;if(e(this,"bulkCommit")===!1)return this._super(t,r,n);var a=this.rootForType(r),o=this.pluralize(a),s={};return s[o]=[],n.forEach(function(e){s[o].push(this.serialize(e,{includeId:!0}))},this),this.ajax(this.buildURL(a),"POST",{data:s}).then(function(e){Ember.run(i,"didCreateRecords",t,r,n,e)})},updateRecord:function(t,r,n){var i,a,o,s;return i=e(n,"id"),a=this.rootForType(r),o=this,s={},s[a]=this.serialize(n),this.ajax(this.buildURL(a,i),"PUT",{data:s}).then(function(e){Ember.run(o,"didUpdateRecord",t,r,n,e)},function(e){throw o.didError(t,r,n,e),e})},updateRecords:function(t,r,n){var i,a,o,s;return e(this,"bulkCommit")===!1?this._super(t,r,n):(i=this.rootForType(r),a=this.pluralize(i),o=this,s={},s[a]=[],n.forEach(function(e){s[a].push(this.serialize(e,{includeId:!0}))},this),this.ajax(this.buildURL(i,"bulk"),"PUT",{data:s}).then(function(e){Ember.run(o,"didUpdateRecords",t,r,n,e)}))},deleteRecord:function(t,r,n){var i,a,o;return i=e(n,"id"),a=this.rootForType(r),o=this,this.ajax(this.buildURL(a,i),"DELETE").then(function(e){Ember.run(o,"didDeleteRecord",t,r,n,e)},function(e){throw o.didError(t,r,n,e),e})},deleteRecords:function(t,r,n){var i,a,o,s,c;return e(this,"bulkCommit")===!1?this._super(t,r,n):(i=this.rootForType(r),a=this.pluralize(i),o=e(this,"serializer"),s=this,c={},c[a]=[],n.forEach(function(t){c[a].push(o.serializeId(e(t,"id")))}),this.ajax(this.buildURL(i,"bulk"),"DELETE",{data:c}).then(function(e){Ember.run(s,"didDeleteRecords",t,r,n,e)}))},find:function(e,t,r){var n=this.rootForType(t),i=this;return this.ajax(this.buildURL(n,r),"GET").then(function(n){return Ember.run(i,"didFindRecord",e,t,n,r)})},findAll:function(e,t,r){var n,i;return n=this.rootForType(t),i=this,this.ajax(this.buildURL(n),"GET",{data:this.sinceQuery(r)}).then(function(r){Ember.run(i,"didFindAll",e,t,r)})},findQuery:function(e,t,r,n){var i=this.rootForType(t),a=this;return this.ajax(this.buildURL(i),"GET",{data:r}).then(function(r){Ember.run(a,function(){this.didFindQuery(e,t,r,n)})})},findMany:function(e,t,r){var n=this.rootForType(t),i=this;return r=this.serializeIds(r),this.ajax(this.buildURL(n),"GET",{data:{ids:r}}).then(function(r){return Ember.run(i,"didFindMany",e,t,r)})},serializeIds:function(t){var r=e(this,"serializer");return Ember.EnumerableUtils.map(t,function(e){return r.serializeId(e)})},didError:function(t,r,n,i){if(422===i.status){var a=JSON.parse(i.responseText),o=e(this,"serializer"),s=o.extractValidationErrors(r,a);t.recordWasInvalid(n,s)}else this._super.apply(this,arguments)},ajax:function(e,t,r){try{return r=r||{},r.url=e,r.type=t,r.dataType="json",r.context=this,r.data&&"GET"!==t&&(r.contentType="application/json; charset=utf-8",r.data=JSON.stringify(r.data)),Ember.RSVP.resolve(jQuery.ajax(r))}catch(n){return Ember.RSVP.reject(n)}},url:"",rootForType:function(t){var r=e(this,"serializer");return r.rootForType(t)},pluralize:function(t){var r=e(this,"serializer");return r.pluralize(t)},buildURL:function(e,t){var r=[this.url];return Ember.isNone(this.namespace)||r.push(this.namespace),r.push(this.pluralize(e)),void 0!==t&&r.push(t),r.join("/")},sinceQuery:function(t){var r={};return r[e(this,"since")]=t,t?r:null}})}()})(),"undefined"==typeof location||"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname||console.warn("You are running a production build of Ember on localhost and won't receive detailed error messages. If you want full error messages please use the non-minified build provided on the Ember website.");
(function() {

  window.Weave = Ember.Application.create({
    LOG_TRANSITIONS: true
  });

}).call(this);
(function() {

  DS.RESTAdapter.configure('Weave.Customization', {
    sideloadsAs: 'customizations'
  });

  DS.RESTAdapter.configure('plurals', {
    referral_batch: "referral_batches",
    referralBatch: "referralBatches"
  });

  DS.RESTAdapter.map('Weave.Referral', {
    customizations: {
      embedded: 'always'
    }
  });

  DS.RESTAdapter.registerTransform('json', {
    serialize: function(json) {
      return json;
    },
    deserialize: function(json) {
      return json;
    }
  });

  Weave.Store = DS.Store.extend({
    revision: 12,
    adapter: DS.RESTAdapter.create()
  });

}).call(this);
(function() {

  Weave.FriendFilter = Ember.Object.extend({
    friendResultToFriendStruct: function(friendResult, provider) {
      Em.assert("provider is facebook", provider === "FACEBOOK");
      return {
        label: friendResult.name,
        user: {
          name: friendResult.name,
          email: friendResult.email,
          info: {
            uid: friendResult.id,
            name: friendResult.name,
            email: friendResult.email,
            provider: "FACEBOOK",
            other_info: friendResult
          }
        }
      };
    },
    facebookFriends: function() {
      var _this = this;
      return this._friends || (this._friends = facebook.query("/me/friends").then(function(friendResults) {
        _this._cached_friends = friendResults;
        return friendResults.data.map(function(friendResult) {
          return _this.friendResultToFriendStruct(friendResult, "FACEBOOK");
        });
      }));
    },
    friendSource: function() {
      var d;
      if (this.get('auth.omniauthed')) {
        return this.facebookFriends();
      } else {
        d = new $.Deferred();
        d.resolve([]);
        return d.promise();
      }
    },
    filterAndRank: function(pfriends, score) {
      var _this = this;
      return pfriends.then(function(friends) {
        friends.forEach(function(friend) {
          return friend.score = score.call(_this, friend);
        });
        friends.sort(function(a, b) {
          return b.score - a.score;
        });
        friends = friends.filter(function(friend) {
          return friend.score > 0;
        });
        return friends.slice(0, 6);
      });
    },
    filterAndRankAgainst: function(term) {
      return this.filterAndRank(this.friendSource(), this.scoreAgainstTerm(term));
    },
    score: function(term, friendStruct) {
      var filtered, regexs, terms;
      terms = term.trim().split(/\s+/);
      regexs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = terms.length; _i < _len; _i++) {
          term = terms[_i];
          _results.push(new RegExp("\\b" + term, "i"));
        }
        return _results;
      })();
      filtered = regexs.filter(function(regex) {
        return regex.test(friendStruct.user.name);
      });
      return filtered.length;
    },
    scoreAgainstTerm: function(term) {
      return function(friendStruct) {
        return this.score(term, friendStruct);
      };
    }
  });

}).call(this);
(function() {

  Weave.u = {
    viewFromId: function(id) {
      return Ember.get("Ember.View.views." + id);
    },
    viewFromElement: function(ele) {
      return Weave.u.viewFromId($(ele).first().attr('id'));
    },
    viewFromNumber: function(num) {
      return Weave.u.viewFromId("ember" + num);
    },
    currentPath: function() {
      return Weave.__container__.lookup('controller:application').currentPath;
    }
  };

  Weave.vfi = Weave.u.viewFromId;

  Weave.vfe = Weave.u.viewFromElement;

  Weave.vf = Weave.u.viewFromNumber;

  Weave.lu = function(str) {
    return Weave.__container__.lookup(str);
  };

  window.lu = Weave.lu;

  window.vf = Weave.vf;

  window.cp = Weave.u.currentPath;

  window.rt = function() {
    return Weave.lu("router:main");
  };

  window.ctrl = function(name) {
    return Weave.lu("controller:" + name);
  };

  window.routes = function() {
    return Weave.Router.router.recognizer.names;
  };

  window.msm = function(model) {
    return model.get('stateManager');
  };

  window.mcp = function(model) {
    return msm(model).get('currentPath');
  };

  window.mcs = function(model) {
    return msm(model).get('currentState');
  };

  window.utils = {
    ajax: function(opts) {
      var defaults;
      opts.data = JSON.stringify(opts.data);
      defaults = {
        contentType: "application/json",
        dataType: "json",
        type: 'GET'
      };
      $.extend(defaults, opts);
      return $.ajax(defaults);
    },
    put: function(opts) {
      var defaults;
      $.extend(true, opts, {
        data: {
          "_method": 'put'
        }
      });
      defaults = {
        headers: {
          "X-Http-Method-Override": "put"
        },
        type: 'post'
      };
      $.extend(defaults, opts);
      return this.ajax(defaults);
    },
    post: function(opts) {
      var defaults;
      defaults = {
        type: 'POST'
      };
      $.extend(defaults, opts);
      return this.ajax(defaults);
    }
  };

}).call(this);
(function() {

  Weave.Campaign = DS.Model.extend({
    description: DS.attr("string"),
    outreachEmailContent: DS.attr('string'),
    senderPageContent: DS.attr('string'),
    recipientPageContent: DS.attr('string'),
    live: DS.attr('boolean'),
    product: DS.belongsTo('Weave.Product')
  });

}).call(this);
(function() {

  Weave.Customization = DS.Model.extend({
    description: DS.attr('string'),
    referral: DS.belongsTo('Weave.Referral'),
    product: DS.belongsTo('Weave.Product')
  });

}).call(this);
(function() {

  Weave.Product = DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    campaigns: DS.hasMany('Weave.Campaign'),
    customizations: DS.hasMany('Weave.Customization')
  });

}).call(this);
(function() {

  Weave.ReferralCustomization = Ember.Object.extend({
    selected: false,
    customization: null,
    referral: null,
    customizationSetBinding: "referral.customizations",
    descriptionBinding: "customization.description",
    selectedToggled: (function() {
      if (this.get('selected')) {
        return this.get('customizationSet').pushObject(this.get('customization'));
      } else {
        if (this.get('customizationSet').contains(this.get('customization'))) {
          return this.get('customizationSet').removeObject(this.get('customization'));
        }
      }
    }).observes('selected')
  });

  Weave.Referral = DS.Model.extend({
    message: DS.attr('string'),
    customizations: DS.hasMany('Weave.Customization'),
    referralBatch: DS.belongsTo('Weave.ReferralBatch'),
    recipient_attributes: DS.attr('json'),
    availableCustomizations: (function() {
      var _ref,
        _this = this;
      this.get('stateManager');
      return (_ref = this.get('referralBatch.campaign.product.customizations')) != null ? _ref.map(function(customization) {
        return Weave.ReferralCustomization.create({
          customization: customization,
          referral: _this
        });
      }) : void 0;
    }).property('referralBatch')
  });

}).call(this);
(function() {

  Weave.ReferralBatch = DS.Model.extend({
    url_code: DS.attr('string'),
    senderPageVisited_at: DS.attr('date'),
    senderPagePersonalized: DS.attr('boolean'),
    campaign: DS.belongsTo('Weave.Campaign')
  });

}).call(this);
(function() {

  Weave.AuthenticationController = Ember.Object.extend({
    facebookStatus: "",
    auths: null,
    omniauthed: (function() {
      return !!this.get('auths.facebook');
    }).property('auths.facebook', 'auths.gmail'),
    facebookLogin: function() {
      var promise,
        _this = this;
      promise = facebook.login().then(function(success) {
        return _this._ajaxOmniauth('facebook');
      }, function(error) {
        return console.log(error);
      });
      return this._handleOmniauthResponse(promise);
    },
    gmailLogin: function() {
      var promise,
        _this = this;
      promise = facebook.login().then(function(success) {
        return _this.ajaxOmniauth('gmail');
      }, function(error) {
        return console.log(error);
      });
      return this._handleOmniauthResponse(promise);
    },
    _handleOmniauthResponse: function(ajax) {
      var _this = this;
      return ajax.then(function(payload) {
        return _this.userAuthenticated(payload);
      }, function(error) {
        return console.log(error);
      }).fail(function(e) {
        debugger;
      });
    },
    _ajaxOmniauth: function(provider) {
      Em.assert('only supporting facebook right now', provider === 'facebook');
      return $.ajax({
        url: Weave.rails().pathHelpers.userOmniauthCallbackPathFacebook
      });
    },
    userAuthenticated: function(payload) {
      var user;
      user = payload.user;
      return this.get('auths').set('facebook', user.authorizations[0]);
    },
    init: function() {
      this._super();
      return this.set('auths', Ember.Object.create({
        facebook: null,
        google: null
      }));
    }
  });

}).call(this);
(function() {

  Weave.ReferralController = Ember.ObjectController.extend({
    myView: null,
    editingBody: false,
    selectingRecipient: false,
    createWithRecipient: function() {
      var recip;
      recip = this.get('content').get('recipient_attributes');
      recip.user_infos_attributes = [recip.info];
      delete recip.info;
      return this.get('content.transaction').commit();
    },
    updateAndDeliver: function() {
      return this.get('store').commit();
    },
    createWithRecipient2: function() {
      var params, referral_batch_id;
      referral_batch_id = 1;
      params = this.formatNew(this.get('content'));
      utils.post({
        data: params,
        url: "/referrals"
      });
      return this.send('editBody');
    },
    formatUpdate: function() {
      var referral, referral_batch_id;
      referral = $.extend(true, {}, this.get('content'));
      referral_batch_id = referral.referral_batch_id;
      delete referral.referral_batch_id;
      return {
        referral: referral,
        referral_batch_id: referral_batch_id
      };
    },
    formatNew: function() {
      var recipient, referral, referral_batch_id;
      referral = $.extend(true, {}, this.get('content'));
      referral_batch_id = referral.referral_batch_id;
      recipient = referral.recipient;
      recipient.user_infos_attributes = [referral.recipient.info];
      delete referral.referral_batch_id;
      delete referral.recipient.meta;
      return {
        referral: {
          content: null,
          recipient_attributes: recipient
        },
        referral_batch_id: 1
      };
    }
  });

}).call(this);
(function() {

  Weave.ReferralSelectRecipientView = Ember.View.extend({
    classNames: ['select-recipient'],
    templateName: "referral_select_recipient",
    didInsertElement: function() {
      return this.bindAutocompletion(this.$('input'));
    },
    init: function() {
      return this._super();
    },
    bindAutocompletion: function($el) {
      var _this = this;
      return $el.autocomplete({
        select: function(event, ui) {
          _this.get('context').set('recipient_attributes', ui.item.user);
          _this.$("#name-or-email").val(ui.item.label);
          return _this.get('controller').send('recipientSelected');
        },
        minLength: 2,
        source: function(request, response) {
          return _this.get('friendFilter').filterAndRankAgainst(request.term).then(function(friends) {
            return response(friends);
          });
        }
      });
    },
    selectingRecipientDidChange: (function() {
      var _ref;
      if (!this.get('context.selectingRecipient')) {
        return (_ref = this.$('input')) != null ? _ref.autocomplete('zug') : void 0;
      }
    }).observes('context.selectingRecipient')
  });

}).call(this);
(function() {

  Weave.ReferralBatchShowView = Ember.View.extend({
    classNames: ['referral-batch-show'],
    templateName: "referral_batch_show"
  });

  Weave.ReferralView = Ember.View.extend({
    classNames: ['referral'],
    didInsertElement: function() {
      return this.set('context.myView', this);
    },
    willDestroyElement: function() {
      return this.set('context.myView', null);
    }
  });

  Weave.ReferralEditBodyView = Ember.View.extend({
    classNames: ['edit-body'],
    templateName: "referral_edit_body"
  });

  Weave.ReferralCustomizationsSelectView = Ember.View.extend({
    customizations: null,
    classNames: ['referral-customizations'],
    templateName: "referral_customizations_select"
  });

}).call(this);
Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1> Weave! </h1>\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["authentication"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "facebookLogin", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("> Login with Facebook </a>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "gmailLogin", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("> Login with Google </a>\n");
  return buffer;
  }

  hashTypes = {};
  stack1 = helpers.unless.call(depth0, "auths.facebook", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers.unless.call(depth0, "auths.google", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["referral"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<h1>Referral View</h1>\n<a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectRecipient", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" >sup </a>\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Weave.ReferralSelectRecipientView", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Weave.ReferralEditBodyView", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "authentication", options) : helperMissing.call(depth0, "render", "authentication", options))));
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["referral_batch_show"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1>Referral Batch Show</h1>\n<p> Instructions go here </p>\n<a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "startReferring", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" >sup </a>\n");
  return buffer;
  
});
Ember.TEMPLATES["referral_customizations_select"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <li class=\"customization\">\n    ");
  hashTypes = {'checkedBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Checkbox", {hash:{
    'checkedBinding': ("customization.selected")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "customization.description", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  </li>\n");
  return buffer;
  }

  data.buffer.push("<h3> Select dem customizations </h3>\navailableCustomizations ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "availableCustomizations", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "customization", "in", "availableCustomizations", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["referral_edit_body"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("editingBody:visible:invisible")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <h2>Customize dat body</h2>\n  <hr>\n  ");
  hashTypes = {'valueBinding': "STRING",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'valueBinding': ("message"),
    'class': ("referral-message")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  ");
  hashTypes = {'availableCustomizationsBinding': "STRING",'customizationsBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Weave.ReferralCustomizationsSelectView", {hash:{
    'availableCustomizationsBinding': ("avaliableCustomizations"),
    'customizationsBinding': ("customizations")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  message: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  availableCustomizations:: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "availableCustomizations", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  <a id=\"deliver-button\" class='btn btn-primary' ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "deliverClicked", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("> Deliver! </a>\n</div>\n<div ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("editingBody:invisible:visible")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "editBody", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("><h2>Customize dat body</h2></a>\n</div>\n");
  return buffer;
  
});
Ember.TEMPLATES["referral_select_recipient"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("selectingRecipient:visible:invisible")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <h2>Select a friend</h2>\n  <h3>Enter a friend's name or email</h3>\n  ");
  hashTypes = {'class': "STRING",'valueBinding': "STRING",'id': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
    'class': ("recipient-name-or-email"),
    'valueBinding': ("view.recipient.email"),
    'id': ("wala")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  vre: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.recipient.email", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>\n<div class ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("selectingRecipient:invisible:visible")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <a ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectRecipient", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("><h2>Select a friend</h2></a>\n</div>\nthis: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "messenger", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\nthis: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});
(function() {

  Weave.Router.map(function(match) {
    this.resource("campaign", {
      path: "/campaigns/:campaign_id"
    }, function() {
      return this.resource("referralBatches", {
        path: "/stories"
      }, function() {
        return this.route("new");
      });
    });
    this.resource("referralBatches", {
      path: "/stories"
    }, function() {
      return this.route("new");
    });
    return this.resource("referralBatch", {
      path: "/stories/:story_id"
    }, function() {
      this.route("show");
      this.resource("referral", {
        path: "/referrals"
      }, function() {
        this.route("select_recipient");
        return this.route("edit_body", {
          path: "/:referral_id/edit_body"
        });
      });
      /*
      @resource "referral", path: "/referrals/:referral_id", ->
        @route "select_recipient"
        @route "edit_body"
      */

      this.resource("firstReferral", {
        path: "/referrals/first/:referral_id"
      }, function() {
        this.route("select_recipient");
        return this.route("edit_body");
      });
      return this.route("done");
    });
    /*
    @resource "referral", path: "/referrals", ->
      @route "new"
    */

  });

  Weave.CampaignRoute = Ember.Route.extend();

  Weave.IndexRoute = Ember.Route.extend();

  Weave.ReferralBatchesRoute = Ember.Route.extend();

  Weave.ReferralBatchesNewRoute = Ember.Route.extend({
    activate: function() {
      var cc;
      console.log('walawala');
      return cc = Weave.Campaign.createRecord();
    },
    model: function() {},
    setupController: function(controller, model) {
      var _this = this;
      this.campaign = this.modelFor('campaign');
      this.referralBatch = Weave.ReferralBatch.createRecord({
        campaign: this.campaign
      });
      return this.referralBatch.save().then((function(result) {
        return _this.transitionTo('referralBatch.show', result);
      }), function(error) {
        return console.log('Error occured');
      }).then(null, function(error) {
        debugger;        return console.log(error);
      });
    }
  });

  Weave.ReferralBatchRoute = Ember.Route.extend({
    model: function(params) {
      return Weave.ReferralBatch.find(params.story_id);
    },
    events: {
      startReferring: function() {
        return this.transitionTo('referral.select_recipient');
      }
    }
  });

  Weave.ReferralBatchShowRoute = Ember.Route.extend({
    wala: 5
  });

  Weave.ReferralRoute = Ember.Route.extend({
    events: {
      selectRecipient: function() {
        return this.transitionTo('referral.select_recipient');
      },
      editBody: function(referral) {
        return this.transitionTo('referral.edit_body', referral);
      },
      startNewReferral: function() {
        return this.transitionTo('referral.select_recipient');
      }
    }
  });

  Weave.ReferralSelectRecipientRoute = Ember.Route.extend({
    model: function(params) {
      console.log("referral id" + params.referal_id);
      return Weave.Referral.createRecord({
        referralBatch: this.modelFor('referralBatch')
      });
    },
    setupController: function(controller, model) {
      this.controllerFor('referral').set('content', model);
      this.controllerFor('referral').set('message', "Enter your content here");
      return this.controllerFor('referral').set('selectingRecipient', true);
    },
    renderTemplate: function() {
      var _ref;
      return (_ref = this.controllerFor('referral').get('myView')) != null ? _ref.$('.select-recipient > input').val('wala') : void 0;
    },
    deactivate: function() {
      return this.controllerFor('referral').set('selectingRecipient', false);
    },
    events: {
      recipientSelected: function() {
        var _this = this;
        this.modelFor('referral.select_recipient').one('didCreate', function() {
          return Ember.run.next(_this, function() {
            var rf;
            rf = _this.controllerFor('referral').get('content');
            return _this.send('editBody', rf);
          });
        });
        return this.controllerFor('referral').createWithRecipient();
      }
    }
  });

  Weave.ReferralEditBodyRoute = Ember.Route.extend({
    redirect: function(model) {
      if (model == null) {
        return this.transitionTo('referral.select_recipient');
      }
    },
    setupController: function(controller, model) {
      this.controllerFor('referral').set('content', model);
      return this.controllerFor('referral').set('editingBody', true);
    },
    deactivate: function() {
      return this.controllerFor('referral').set('editingBody', false);
    },
    events: {
      deliverClicked: function(referral) {
        var _this = this;
        this.controllerFor('referral').get('content').one('didUpdate', function() {
          return _this.send('startNewReferral');
        });
        return this.controllerFor('referral').updateAndDeliver();
      }
    }
  });

}).call(this);
(function() {
  var _ref;

  Weave.rails = function() {
    return window._rails;
  };

  if ((((_ref = Weave.rails()) != null ? _ref.path : void 0) != null) && !window.location.hash) {
    window.location.hash = Weave.rails.path;
  }

  Weave.register('friendFilter:main', Weave.FriendFilter);

  Weave.inject('controller:referral', 'friendFilter', 'friendFilter:main');

  Weave.register('controller:authentication', Weave.AuthenticationController);

  Weave.inject('friendFilter', 'auth', 'controller:authentication');

}).call(this);
(function() {
  var __slice = [].slice;

  jQuery(function() {
    $('body').prepend('<div id="fb-root"></div>');
    return $.ajax({
      url: "" + window.location.protocol + "//connect.facebook.net/en_US/all.js",
      dataType: 'script',
      cache: 'true'
    });
  });

  window.facebook = {
    scope: 'email, user_education_history, user_interests, user_likes, user_activities, friends_status, user_status, friends_about_me, friends_activities, friends_education_history, friends_interests, friends_location, friends_religion_politics',
    populateUserInfo: function() {},
    unwrap: function(dfd) {
      var x;
      x = null;
      dfd.always(function(result) {
        return x = result;
      });
      return x;
    },
    login: function() {
      var dfd;
      dfd = new $.Deferred();
      FB.login((function(response) {
        if (response.authResponse) {
          console.log("User did auth");
          return dfd.resolve(response);
        } else {
          console.log("User didn't auth..");
          return dfd.reject(response);
        }
      }), {
        scope: facebook.scope
      });
      return dfd.promise();
    },
    logout: function(cb) {
      console.log('FB.logging out');
      return FB.getLoginStatus(function(response) {
        if (response.authResponse) {
          return FB.logout();
        }
      });
    },
    status: function() {
      return FB.getLoginStatus(function(response) {
        return console.log("status: ", response);
      });
    },
    query: function(query) {
      var dfd;
      dfd = new $.Deferred();
      FB.api(query, function(response) {
        return dfd.resolve(response);
      });
      return dfd.promise();
    },
    mutualFriends: function() {
      window.friendCounts = {};
      window.promiseOfFriends = fb('/me/friends');
      return promiseOfFriends.then(function(response) {
        var friend, friends, muts;
        friends = response.data;
        muts = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = friends.length; _i < _len; _i++) {
            friend = friends[_i];
            _results.push((function(friend) {
              var expectingFriend;
              expectingFriend = fb("/" + friend.id + "/mutualFriends");
              return expectingFriend.then(function(r) {
                return friendCounts[friend.id] = r.data.length;
              });
            })(friend));
          }
          return _results;
        })();
        return $.when.apply($, muts);
      }).then(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        debugger;
      });
    },
    initBindings: function() {
      $('#sign-in-facebook').click(function(e) {
        e.preventDefault();
        return facebook.login();
      });
      return $('#sign-out-facebook').click(function(e) {
        return facebook.logout();
      });
    }
  };

  window.fbAsyncInit = function() {
    FB.init({
      appId: Weave.rails().env.FACEBOOK_APP_ID,
      status: true,
      cookie: true,
      oauth: true
    });
    facebook.initBindings();
    return FB.getLoginStatus(function(response) {
      return console.log("FB login status ", response);
    });
  };

}).call(this);
(function() {

  window.referrals = {
    /*
    ajax:
      createReferral: (args) ->
        utils.ajax
          type: 'POST'
          data: args
    
      updateReferral: (args) ->
        utils.put
          data: args
    */

    friends: null,
    nameAutoComplete: function() {
      return this.friends || (this.friends = facebook.query("/me/friends").then(function(results) {
        return results.data.map(function(item) {
          return {
            label: item.name,
            value: item
          };
        });
      }));
    },
    nameFilter: function(term, name) {
      var regexs, terms;
      terms = term.trim().split(/\s+/);
      regexs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = terms.length; _i < _len; _i++) {
          term = terms[_i];
          _results.push(new RegExp("\\b" + term, "i"));
        }
        return _results;
      })();
      return regexs.every(function(regex) {
        return regex.test(name);
      });
    },
    initBindings: function() {
      return $("#name-or-email").autocomplete({
        select: function(event, ui) {
          $("#name-or-email").val(ui.item.label);
          $("#fb-uid").val(ui.item.value.id);
          $("#fb-uinfo").val(JSON.stringify(ui.item.value.info));
          return false;
        },
        minLength: 2,
        source: function(request, response) {
          return referrals.nameAutoComplete().then(function(results) {
            var filtered;
            filtered = results.filter(function(e) {
              return referrals.nameFilter(request.term, e.label);
            });
            filtered.map(function(e) {
              return facebook.query("" + e.value.id + "?fields=location,education,political").done(function(results) {
                return e.value["info"] = results;
              });
            });
            return response(filtered);
          });
        }
      });
    }
  };

  jQuery(function() {
    return referrals.initBindings();
  });

}).call(this);
