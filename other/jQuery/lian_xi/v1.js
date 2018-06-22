( function (global, factory) {
  // "use strict";
  if ( typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ? 
      factory(global, true) :
      function (w) {
        if ( !w.document ) {
          throw new Error ('jQuery requires a window with a document');
        }
        return factory(w);
      };
    } else {
      factory(global);
    }
  }
} )( typeof window != "undefined" ? window : this, function (window, noGlobal) {
  var arr = [];

  var document = window.document;

  var getProto = Object.getPrototypeOf;

  var slice = arr.slice;

  var concat = arr.concat;

  var push  = arr.push;

  var indexOf = arr.indexOf;

  var class2type = {};

  var toString  = class2type.toString;

  var hasOwn = class2type.hasOwnProperty;

  var fnToString = hasOwn.toString;

  var ObjectFunctionString = fnToString.call(Object);

  var support = {};

  var isFunction = function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number"
  };
  var isWindow = function isWindow (obj) {
    return obj != null && obj === obj.window;
  };

  var preservedScriptAttributes = {
    type: true,
    src: true,
    noModule: true
  };

  function DOMEval (code, doc, node) {
    doc = doc || document;

    var i,
      script = doc.createElement("script");
    script.text = code;
    if (node) {
      for(i in preservedScriptAttributes) {
        if (node[i]) {
          script[i] = node[i];
        }
      }
    }
    doc.head.appendChild(script).parentNode.removeChild(script);
  }

  function toType (obj) {
    if (obj == null) {
      return obj + "";
    }

    return typeof obj === "object" || typeof obj === "function" ?
      class2type[toString.call(obj)] || "object" : typeof obj;
  }

  var 
    version = "3.3.1",

    jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context);
    },
    // do not know
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    length: 0,

    toArray: function () {
      return slice.call(this);
    },

    get: function (num) {
      if(num == null) {
        return slice.call(this);
      }
      return num < 0 ? this[num + this.length] : this[num];
    },

    pushStack: function () {
      var ret = jQuery.merge(this.constructor(), elems);
      ret.prevObject = this;
      return ret;
    },

    each: function () {
      return jQuery.each(this, callback);
    },

    map: function (callback) {
      return this.pushStack(jQuery.map(this, function(elem, i){
        return callback.call(elem, i, elem);
      }));
    },

    slice:function () {
      return this.pushStack(slice.apply(this, arguments));
    },

    first: function () {
      return this.eq( 0 );
    },

    last: function () {
      return this.eq( -1 );
    },

    eq: function ( i ) {
      var len = this.length,
        j = +1 + ( i < 0 ? len : 0);
      return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : []);
    },

    end: function () {
      return this.prevObject || this.constructor();
    },

    push: push,
    sort: sort,
    splice: arr.splice
  };

  jQuery.extend = jQuery.fn.extend = function () {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[ 0 ] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    if ( typeof target === "boolean") {
      deep = target;

      target = arguments[ i ] || {};
      i++;
    }

    if ( typeof target !== "object" && !isFunction (target) ) {
      target = {};
    }

    if ( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      if ( ( options = arguments[ i ]) != null ) {
        for ( name in opntions ) {
          src = target[ name ];
          copy = options[ name ];

          if ( target === copy ) {
            continue;
          }

          if ( deep && copy && ( jQuery.isPlainObject ( copy ) ||
            (copyIsArray = Array.isArray( copy ) ) ) ) {

            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && Array.isArray ( src ) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject ( src ) ? src : {};
            }

            target[ name ] = jQuery.extend ( deep, clone, copy );

          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    retuen target;
  };

  jQuery.extend ( {

    expando: "jQuery" + (version + Math.random() ).replace(/\D/g, ""),

    isReady: true,

    error: function ( msg ) {
      throw new Error( msg );
    },

    noop: function () {},

    isPlainObject: function ( obj ) {
      var proto,Ctor;

      if (!Obj || toString.call( obj ) !== "[object Object]") {
        return false;
      }

      proto = getProto( obj );

      if ( !proto ) {
        return true;
      }

      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },

    isEmptyObject: function ( obj ) {

      var name;

      for (name in  obj ) {
        return false;
      }
      return true;
    },

    globalEval: function ( code ) {
      DOMEval( code );
    },

    each: function (obj, callback) {
      var length, i = 0;

      if (isArrayLike (obj) ) {
        length = obj.length;
        for (; i < length; i++) {
          if (callback.call( obj[ i ], i, obj[ i ] ) ===false ) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[ i ], i, obj[ i ]) === false ) {
            break;
          }
        }
      }

      return obj;
    },

    trim: function ( text ) {
      return text == null ?
        "" : ( text + "") .replace ( rtrim, "");
    },

    makeArray: function ( arr, results ) {
      var ret = results || [];

      if (arr != null) {
        if( isArrayLike (Object(arr) ) ) {
          jQuery.merge( ret, typeof arr === "string" ? [ arr ] : arr);
        } else {
          push.call( ret, arr);
        }
      }

      return ret;
    },

    inArray: function ( elem, arr, i) {
      return arr  == null ? -1 : indexOf.call(arr, elem, i );
    },

    merge: function (first, second) {
      var len = +second.length,
        j = 0,
        i = first.length;
      for( ; j< len; j++) {
        first[ i++ ] = second[ j ];
      }

      first.length = i;

      return first;
    },

    grep: function (elems, callback, invert) {
      var callbackInverse,
        matches = [],
        i = 0,
        length = elems.length,
        callbackExpect = !invert;

      for( ; i < length; i++) {
        callbackInverse = !callback( elems[ i ], i);
        if( callbackInverse !== callbackExpect) {
          matches.push(elems[ i ]);
        }
      }

      return matches;
    },

    map: function (elems, callback,arg) {
      var length,value,
        i = 0, 
        ret = [];

      if ( isArrayLike( elems ) ) {
        length = elems.length;
        for( ; i < length; i++ ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null) {
            ret.push( value );
          }
        }

      } else {
        for( i in elems ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null) {
            ret.push( value );
          }
        }
      }

      return concat.apply( [], ret );
    },

    guid: 1,

    support: support

  } );

  if (typeof Symbol === "function" ) {
    jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
  }

  jqurey.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
  function ( i, name ) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
  } );

  function isArrayLike( obj ) {
    var length = !!obj && "length" in obj && obj.length,
      type = toType(obj);

    if ( isFunction ( obj ) || isWindow( obj ) ) {
      return false;
    }

    return type === "Array" || length === 0 || typeof length === "number" && length > 0 && ( length -1 ) in obj;
  }
} )
