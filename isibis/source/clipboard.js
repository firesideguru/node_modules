



// https://jsperf.com/innerhtml-vs-documentfragment-vs-appendchild



// elements
// attributes
// collections
  // bindData
  // viewHTML
// methods
// overloads
  // id=
  // <a
// polyfills
  // cloneNode
  // dataset
  // new Event
  // hasAttribute
  // pushState (none)

// more logic...
// dedupe src=


// ==================================================

// "test attribute"
// test=
  // true=
  // false=
  // equals=
  // then=
  
  // case=
  
// "view attribute"
// view=

// "bind attribute"
// bind=
  // ns=
  // page=
  // words=
  // key=
  // attr-foo=
  // data-foo= | data-foo=^
  
  // <a next|prev|more></a>
  
// "call attribute"
// call=
  

// "view element"
// <view></view>
  // type=
  // as=
  // src=
    // timeout=
    // nocache
    // defer
    // onerror=
    // onload=
    // <error></error>
    // <loading></loading>

// "data element"
// <data></data>
  // type=
  // as=
  // src=
    // timeout=
    // nocache
    // defer
    // onerror=
    // onload=
    // <onerror></onerror>
    // <loading></loading>
    
// "state element"
// <state></state>
    
// "load element"
// <load></load>
  // type=data|view|state|script|style|html/mixed
  // as=
  // src=
    // timeout=
    // nocache
    // defer/lazy
    // onerror=
    // onload=
    // <onerror for=></onerror>
    // <loading for=></loading>
    
    // <src href= as=></src>

// "a element overload"
// <a></a>
  // radio=
  // toggle=

// "meta element"
// <meta name content>
  
// "nav navmap state group elements"
// <nav></nav>

// "extend element"
// <extend></extend>

// "save element"
// <save></save>
  
  
  

// currently, ALL ibis element attribute "values" are transformed to lower case (case-insensitive)

// NOTICE !!!
// We can not do wrap="inner|outer" for "outer" wrapping
// we lose reference of the node after reassigning result to node.outerHTML
// and according to MDN we keep a reference to overwritten node in the DOM
// To wrap="outer" you must instead wrap the target element in a parent node
// and apply the bind="data" to that parent node.innerHTML view


// data-attr
// Must be handled on a per-node basis
// We test for it WHILE doing traverse
// and not register it prior to that
// Unlike bind-attr and view-attr we use
// the native 'dataset' collection

// dataset pollyfill ... pick one
// https://github.com/remy/polyfills/blob/master/dataset.js
// https://gist.github.com/brettz9/4093766
// https://github.com/epiloque/element-dataset/blob/master/src/index.js
// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills

// dataset documentation ...
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

// if we restore use of dataset
// does dataset trigger a traverse on its own ??? probably not -- NO
// if dataset only aguments bind="data"
// does it override active.record
// or does it provide default fallback for absence of key=value in active.record ???
// or using syntax like data-foo="!bar" it can override, otherwise is fallback
// also, is dataset global to page
// or local to node it is defined on and reset after node is parsed ??? probably resets



'use strict';

// STUBS ...

var populateTokens = populateTokens || function() {};


  // RESOLVE ...
  
  // if (Object.keys(node.dataset).length) {
  //   resolveDataset(node, active, revert);
  // }
  

  // ASCEND ...
  
  // registerView(node, html);
  
  // if (revert.dataset) {
  //   active.dataset = revert.dataset;
  // }
  
  
// RESOLVE ...

// var resolveDataset = function (node, active, revert) {
//   active.dataset = active.dataset || {};
//   revert.dataset = Object.assign({}, active.dataset);
//   active.dataset = Object.assign(active.dataset, node.dataset);
//   var html = populateTokens(node.innerHTML, active.dataset); // text
//   replaceInner(node, html);
//   registerAttributes(node);
// };



var token = function (key, ns) {
  var tkn = ns ? ns + ':' + key : key; // `${ns}:${key}`
  tkn = tkn.replace(/([\.?*+^$[\]\\(){}|-])/g, "\\$1");
  return new RegExp('{{' + tkn + '}}', 'gi');
};

// ability to follow dot-notation paths on objects
var populateTokens = function (html, data, ns) {
  data = ns ? data[ns] : data;
  var keys = Object.keys(data);
  for (var key, tkn, val, i = 0; i < keys.length; i ++) {
    key = keys[i];
    tkn = token(key, ns == '_' || !ns ? '' : ns);
    val = data[key]; // We should probably escape <html attr="val"> here for security
    html = html.replace(tkn, val);
  }
  return html;
};



// IE Lameness ...
// replaceInner(node, html); replaceOuter(node, html);
// use css to mark up table format
// create table specific method for ibis
// discussion ...
// https://msdn.microsoft.com/en-us/library/ms533897(v=vs.85).aspx
// http://stackoverflow.com/questions/4729644/cant-set-innerhtml-on-tbody-in-ie
// https://www.google.com/search?q=ie+table+innerhtml&oq=ie+tables+and+inner

// https://msdn.microsoft.com/en-us/library/ms533897(v=vs.85).aspx
// When using innerHTML to insert script, you must include the defer attribute in the script element.
// The innerHTML property is read-only on the
// col, colGroup, frameSet, html, head, style, table, tBody, tFoot, tHead, title, and tr objects.
// You can change the value of the title element using the document.title property.
// To change the contents of the table, tFoot, tHead, and tr elements, use the table object model
// described in Building Tables Dynamically.
// However, to change the content of a particular cell, you can use innerHTML.

// for IE we can copy innerHTML and insert it into a DIV element
// from there we can manipulate it
// then finally transfer back to target node using DOM transfer method


// Chrome lameness ,,,
// https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
// Note: If a <div>, <span>, or <noembed> node has a child text node
// that includes the characters (&), (<), or (>),
// innerHTML returns these characters as &amp, &lt and &gt respectively.
// Use Node.textContent to get a correct copy of these text nodes' contents.




// LAST VERSION OF IBIS USING CUSTOM ELEMENTS ...

var ibis = ibis || {};

// ibis.onready = new Event('dataready');
// ibis.onattach = new Event('attached');
// ibis.ondetach = new Event('detached');


// this vs clone = Object.assign({}, data); // not IE supported
// https://jsperf.com/json-vs-object-assign
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
ibis.cloneData = function(data) {
	return JSON.parse(JSON.stringify(data));
};

ibis.cloneNode = function(node) { // copyNode
	var frag = document.createDocumentFragment();
	while (this.childNodes.length > 0) { // does not iterate with cloneNode(true) // for ()
		frag.appendChild(this.firstChild.cloneNode(true));
	}
	return frag;
};

ibis.moveNode = function(node) {
	var frag = document.createDocumentFragment();
	while (this.childNodes.length > 0) {
		frag.appendChild(this.firstChild);
	}
	return frag;
};

//ibis.resolvePath('context.test.numbers');
//ibis.resoolvePath('ibis.view.test');
ibis.resolvePath = function(attr) { // returns window or path object
	var path = window;
	if (typeof attr === 'string') {
		var keys = attr.split('.'),
			key;
		while (keys.length > 0) {
			key = keys.shift();
			path = path[key];
		}
	}
	return path;
};

// allows array notation
// console.log(window['data'][2]['count'][1]);
// var token = 'data.2.count.1';
ibis.dataPath = function(attr) {
	var path = window;
	if (typeof attr === 'string') {
		var keys = attr.split('.'),
			key,
			idx;
		while (keys.length > 0) { // (typeof data === 'object')
			key = keys.shift();
			idx = parseInt(key, 10);
			if (isNaN(idx) === 'false') {
				key = idx;
			}
			path = path[key];
		}
	}
	return path;
};

ibis.resolveArgs = function(attr) { // returns args object
	var args = {};
	if (typeof attr === 'string') {
		var pairs = attr.split('&'),
			pair;
		while (pairs.length > 0) {
			pair = pairs.shift().split('=');
			if (pair.length !== 2) continue;
			args[pair[0]] = pair[1];
		}
	}
	return args;
};

ibis.resolveCall = function(attr) {
	var call = {},
		both = attr.split('?'),
		path = ibis.resolvePath(both[0]),
		args = ibis.resolveArgs(both[1]);
	if (typeof path === 'function') {
		call.path = path;
		call.args = args;
		return call;
	}
	return false;
};

ibis.resolveHash = function(href) {
	var ident = href.indexOf('#'),
		query = href.indexOf('?'),
		hash;
	if (ident > -1) {
		if (query > ident) {
			throw new Error('Malformed link href (#ident should go after ?query)');
		}
		hash = href.substring(ident + 1);
	}
	return (typeof hash === 'string') ? hash : false;
};


var handleData = function() {
	// do stuff with data
	this.dispatchEvent(dataReadyEvent); // , {'data': data}
	dataReady = true;
};


//var call = ibis.resolveCall('ibis.view.test?one=foo&two=bar'); // call is now custom handler on node
//call.path(call.args);
ibis.linkLoad = function(event) {
	//alert(this.href); // works also
	var hash = ibis.resolveHash(event.href); // this.href
	console.log(hash);
	//console.log(event.target.import.querySelector('h1').innerHTML);
	//console.log(event.target.href);
	//document.body.appendChild(event.target.import.querySelector('h1'));
};


