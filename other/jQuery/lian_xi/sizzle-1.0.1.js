(function (window) {
  /**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
   select = Sizzle.select = function ( selector, context, results, seed ) {

   };
  // Sort stability
  support.sortStable = expando.split("").sort( sortorder).join("") === expando;

  support.detectDuplicates = !! hasDuplicate;

  setDocument();

  support.sortDetached = assert( function (el){
    return el.compareDocumentPosition( document.createElement("fieldset")) & 1;
  });

  // Prevent attribute/property "interpolation"
  if ( !assert( function (el) {
    el.innerHtml = '<a href="#"></a>';
    return el.firstChild.getAttribute("href") === "#";
  })) {
    addHandle( "type|href|height|width", function ( elem, name, isXML) {
      if( !isXML ) {
        return elem.getAttribute( name, name.toLowerCase() === "type" ? 1: 2);
      }
    });
  }
  // Use defaultValue in place of getAttribute("value")
  if ( !support.attributes || !assert(function (el) {
    el.innerHtml = "<input/>";
    el.firstChild.setAttribute("value", "");
    return el.firstChild.getAttribute("value") === "";
  }) ) {
    addHandle( "value", function ( elem, name, isXML) {
      if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
        return elem.defaultValue;
      }
    });
  }

  // Use getAttributeNode to fetch booleans when getAttribute lies
  if ( !assert( function (el) {
    return el.getAttribute("disabled") == null;
  }) ) {
    addHandle( booleans, function (elem, name, isXML) {
      var val;
      if( !isXML ) {
        return elem[ name ] === true ? name.toLowerCase() :
         (val = elem.getAttributeNode (name) ) && val.specified ?
         val.value : null;
      }
    });
  }
  // expose
  var _sizzle = window.Sizzle;

  Sizzle.noConflict = function () {
    if( window.Sizzle === Sizzle ) {
      window.Sizzle = _sizzle;
    }

    return Sizzle;
  };

  if ( typeof define === "function" && define.amd) {
    define (function () { return Sizzle; });
  } else if ( typeof module !== "undefined" && module.exports ) {
    module.exports = Sizzle;
  } else {
    window.Sizzle = Sizzle;
  }

})(window)