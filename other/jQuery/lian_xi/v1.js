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
      
    }

  }

} )