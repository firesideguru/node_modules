

'use strict';

// STUBS ...

var setStyles = setStyles || function () {};
var traverse = traverse || function () {};
var registerViewElements = registerViewElements || function () {};
var registerDataElements = registerDataElements || function () {};


// MAIN ...

var selectAll = function (node, selector) {
  return node.querySelectorAll(selector);
};


var toArray = function (collection) {
  var array = [];
  for (var i = 0; i < collection.length; i ++) {
    array.push(collection[i]);
  }
  return array;
};


var attrAssign = function (node, attr, onset) {
  Object.defineProperty(node, attr, {
    configurable: true,
    enumerable: true,
    get: function () {
      return this.getAttribute(attr).trim().toLowerCase();
    },
    set: function (value) {
      this.setAttribute(attr, value);
      if (typeof onset == 'function') {
        onset(node);
      }
    }
  });
};


var registerAttributes = function (root) {
  var attributes = ['test','true','false','equals','then','view','case',
    'bind','ns','wrap','key','as','for'];
  var reparse = ['test','view','bind'];
  var loaders = ['view', 'data'];
  
  for (var attr, nodes, onset, i = 0; i < attributes.length; i ++) {
    attr = attributes[i];
    nodes = toArray(selectAll(root, '[' + attr + ']'));
    onset = (reparse.indexOf(attr) > -1) ? traverse : false;
    for (var node, j = 0; j < nodes.length; j ++) {
      node = nodes[j];
      attrAssign(node, attr, onset);
    }
  }
  // DO NOT set source on <script> elements // DO dedupe
  var includes = toArray(selectAll(root, '[src]'));
  for (var include, k = 0; k < includes.length; k ++) {
    include = includes[k];
    if (loaders.indexOf(include.nodeName.toLowerCase()) > -1){
      attrAssign(include, 'src'); // onset for include src attrs
    }
  }
};


function main () { // var main = function () { // not hoisted
  console.log('page loaded enough');
  
  setStyles();
  registerAttributes(document);
  registerViewElements(document); // .documentElement also works
  registerDataElements(document);
  
  
  console.log('page methods loaded');
  
  // load all <data> <view> src= assets, then ...
  
  traverse(document.documentElement); // .documentElement required
  
  console.log('traversal complete');
}


if (document.readyState === 'interactive' || document.readyState === 'complete') {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}





// https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
// Source: https://github.com/jserz/js_piece/blob/master/DOM/NonDocumentTypeChildNode/nextElementSibling/nextElementSibling.md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('nextElementSibling')) {
      return;
    }
    Object.defineProperty(item, 'nextElementSibling', {
      configurable: true,
      enumerable: true,
      get: function () {
        var el = this;
        while (el = el.nextSibling) {
          if (el.nodeType === 1) {
            return el;
          }
        }
        return null;
      },
      set: undefined
    });
  });
})([Element.prototype, CharacterData.prototype]);


