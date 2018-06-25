
function Sizzle ( selector, context, results, seed ) {
  var m, i, elem, nid, match, groups, newSelector,
    newContext = context && context.ownerDocument,

    nodeType = context ? context.nodeType : 9;

  results = results || [];

  if (typeof selector !== "string" || !selector ||
    nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

    return results;
  }

  if ( !seed ) {
    if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
      setDocument ( context );
    }
    context = context || document;

    if ( documentIsHTML ) {
      if (nodeType !== 11 && (match = rquickExpr.exec( selector ) ) ) {
        if ( (m = match[1] ) ) {
          if ( nodeType === 9 ) {
            if ( (elem = context.getElementById( m ) ) ) {
              if ( elem.id === m ) {
                results.push( elem );
                return results;
              }
            } else {
              return results;
            }
          } else {
            if ( newContext && (elem = newContext.getElementById( m )) && contains(context, elem) && elem.id === m) {
              results.push(elem);
              return results;
            }
          }
        } else if (match[2]) {
          push.apply(results, context.getElementsByTagName(selector) );
          return results;
        } else if( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
          push.apply( results, context.getElementsByClassName( m ) );
          return results;
        }
      }
      if (support.qsa && !compileCache[ selector + " " ]
        && (!rbuggyQSA || rbuggyQSA.test( selector )) ) {
        if ( nodeType !== 1) {
          newContext = context;
          newSelector = selector;
        } else if ( context.nodeName.toLowerCase() !== "object" ) {
          if ( ( nid = context.getAttribute("id")) ) {
            nid = nid.replace( rcssescape, fcssescape);
          } else {
            context.setAttribute("id", (nid = expando) );
          }

          groups = tokenize(selector);
          i = groups.length;
          while ( i-- ) {
            groups[i] = "#" + nid + " " + toSelector( groups[i] );
          }
          newSelector = groups.join(",");

          newContext = rsibling.test( selector ) && testContext ( context.parentNode ) || context;
        }

        if (newSelector) {
          try {
            push.apply(results, newContext.querySelectorAll( newSelector ));
            return results;
          } catch (qsaError ) {

          } finally {
            if ( nid === expando ) {
              context.removeAttribute("id");
            }
          }
        }
      }
    }
  }

  return  select( selector.replace(rtrim, "$1"), context, results, seed);
}
