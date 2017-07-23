
// VIEW IS ...
// any html or plain text content
// or if src=
// an optional <loading> element
// and/or an optional <error> element


'use strict';

// STUBS ...

var selectAll = selectAll || function() {};
var toArray = toArray || function() {};


// MAIN ...

var registerViewElements = function (root) {
  var views = toArray(selectAll(root, 'view'));
  for (var view, html, as, src, i = 0; i < views.length; i ++) {
    view = views[i];
    as = view.as;
    src = view.src;
    if (!as) {
      throw new Error('<view> elements must have an as="alias" attribute defined at', view );
    }
    
    if (src) {
      
    }
    else {
      // parse by type ... see data
      html = view.innerHTML;
      // validate here or at registerViewHTML
      registerViewHTML(as, html);
    }
  }
};


var _viewHTML = (function () {
  var _html = {};
  // var validKey = function (key) {
  //   var valid = typeof key === 'string';
  //   // if (!valid) throw new Error('')
  //   return valid;
  // };
  // var validVal = function (val) {
  //   var valid = typeof val === 'string';
  //   // if (!valid) throw new Error('');
  //   return valid;
  // };
  return {
    set: function (key, val) {
      // validate here ...
      _html[key] = val;
      return this.has(key);
    },
    get: function (key) {
      return _html[key];
    },
    has: function (key) {
      return key in _html;
    },
    del: function (key) {
      delete _html[key];
      return !this.has(key);
    }
  };
})();


var viewHTML = {};


function registerViewHTML (name, html) { // transform name to lower case
  _viewHTML.set (name, html);
  Object.defineProperty(viewHTML, name, {
    get: function () {
      return _viewHTML.get(name);
    },
    set: function (value) {
      _viewHTML.set(name, value);
      console.log(`do update elements bound to ${name} here`);
    }
  });
}


var activeView = function (node) { // viewHist store, next, prev, last, swap/toggle
  node._activeView = [];
  node._viewIndex = 0;
  node.activeView = {
    store: function (view) { // push
      node._activeView.push(view);
      return node.activeView.last();
    },
    next: function () {
      node._viewIndex = node._viewIndex + 1 < node._viewIndex.length ?
        node._viewIndex + 1 : node._viewIndex.length - 1;
      return node._activeView[node._viewIndex];
    },
    prev: function () {
      node._viewIndex = node._viewIndex ? node._viewIndex - 1 : 0;
      return node._activeView[node._viewIndex];
    },
    first: function () {
      node._viewIndex = 0;
      return node._activeView[node._viewIndex];
    },
    last: function () {
      node._viewIndex = node.activeView.length - 1;
      return node._activeView[node._viewIndex];
    }
  };
};


var registerView = function (node, html) { // register specific states 'original|base', 'dataset', 'view', 'test'
  if (!node.activeView) {
    activeView(node);
  }
  if (!html) {
    html = node.outerHTML;
  }
  node.activeView.store(html);
};

