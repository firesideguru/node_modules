


// next steps ...
// dot paths for object resolution
// DOM copy|move|clone for resolveBind
// parseStateFile|NavMapFile
// location state resolution logic


'use strict';

// STUBS ...

var bindData = bindData || function() {};
var viewHTML = viewHTML || function() {};
var registerAttributes = registerAttributes || function() {};



// MAIN ...

var traverse = function (node, active) {
  
  active = active || {};
  var revert = {};
  
  // RESOLVE ...
  
  resolveView(node, active, revert);
  
  if (node.case && active.test) {
    resolveCase(node, active);
  }
  
  if (node.key && active.record) {
    resolveKey(node, active);
  }
  
  // DESCEND ...
  
  if (node.bind) {
    resolveBind(node, active, revert);
  }
  else if (node.children.length) {
    traverse(node.children.item(0), active);
  }
  
  // ASCEND ...
  
  // registerView(node, html);
  
  if (revert.test) {
    active.test = revert.test;
  }
  if (revert.record) {
    active.record = revert.record;
  }
  
  if (node.nextElementSibling) {
    traverse(node.nextElementSibling, active);
  }
};


// RESOLVE ...


var resolveView = function (node, active, revert) {
  var view = '';
  
  if (node.hasAttribute('test')) {
    var test = bindData[node.test] || node.test;
    // can we test on the active.record too ??? instead ???
    // we also need to parse object path to resolve data on objects
    // parseObjectPath(bindData, node.test) || parseObjectPath(active.record, node.test) || node.test
    //
    // do we need to consider ns as well ???
    // || active.record[ns ? '_' : ns][node.test] // active.ns
    //
    var falsy = ['false', 'no', 'null', 'undef', 'undefined', '0'];
    
    // expand to include CSS selecctor options like (contains, starts-with, ends-with)
    // possibly expand to include strict and truthy|falsy modes, and number mode
    
    if (!test || falsy.indexOf(test) > -1) {
      test = 'false';
    }
    
    revert.test = active.test;
    active.test = test;
    
    if (node.false && test == 'false') {
      view = viewHTML(node.false) || '';
    }
    else if (node.equals && node.then && test == node.equals) {
      view = viewHTML(node.then) || ''; // node.result
    }
    else if (node.true && test != 'false') {
      view = viewHTML(node.true) || '';
    }
  }
  
  if (node.view && !view) {
    view = viewHTML(node.view) || '';
  }
  
  if (view && active.dataset) {
    populateTokens(view, active.dataset);
  }
  
  if (view) {
    replaceInner(node, view);
    registerAttributes(node);
  }
};


var resolveCase = function (node, active) {
  if (node.case == active.test || node.case == 'true' && active.test != 'false') {
    // do nothing
  }
  else {
    if (node.nextElementSibling) {
      traverse(node.nextElementSibling, active);
    }
    node.parentNode.removeChild(node);
  }
};


var resolveKey = function (node, active) {
  var nskey = node.key.match(/\s*(\w+)\s*\:?\s*(\w*)\s*/);
  var text = (nskey[2]) ? active.record[nskey[1]][nskey[2]] : active.record['_'][nskey[1]]; // html =
  if (text) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    // value = populateTokens(value, active.record); // already done in bind="..." traverse
    
    // ??? enforce no html in data model ???
    node.textContent = text;
    // vs...
    // replaceInner(node, html); // node.innerHTML = htnl; allows html markup in data model
    // registerAttributes(node);
  }
};


// page= pagination option with <prev> <next> <trigger prev|next> ...page range
// alternation, styles, incramented id=, auto-number property, etc
// for links have href or this or self token to test against
// error state for parsing (ie. malformed record data) and error token to test against
var resolveBind = function (node, active, revert) {
  active.record = active.record || {};
  var data = bindData[node.bind] || []; // dataset data
  if (data.length) {
    var ns = (node.ns) ? node.ns : '_';
    var frag = document.createElement('div');
    var html = '';
    revert.record = Object.assign({}, active.record);
    // if (node.page) // attach .next|.prev to node and limit output
    // var page = (node.page) ? registerPage(node) : data.length; i < page
    for (var record, i = 0; i < data.length; i ++) {
      record = data[i]; // ability to follow dot-notation paths on objects
      active.record[ns] = record;
      if (node.key) {
        resolveKey(node, active);
      }
      frag.innerHTML = node.innerHTML;
      frag.innerHTML = populateTokens(frag.innerHTML, active.record, ns);
      registerAttributes(frag);
      traverse(frag, active);
      html = html.concat(frag.innerHTML);
    }
    active.record = revert.record;
    replaceInner(node, html);
    registerAttributes(node);
  }
};


// SHARED ...

// encode string for non-html values ??? encodeURIComponent(val);

var replaceInner = function (node, html) {
  // consider IE table and related elements read-only on inner|outerHTML
  // try catch or IEException = [];
  node.innerHTML = html;
};

