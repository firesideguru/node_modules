
// Copyright 2015 by Kevin Douglas
// Version 0.0.1 [2015.11.05]

// == Table of Contents ==

// == Headnotes ==`

// == Initialization ==

// == Attributes ==
//    bind
//    call
//    href
//    path
//    ns

// == Properties ==
// -- Private --
//    map
// -- Public --
//    data
//    mark
//    host (root, self, this, node)

// == Methods ==
// -- Private --
//    ibis.ready
//    ibis.map
//        store
//        fetch
//        clear
//        reset
//        show (debug)
//    ibis.populate
//    ibis.format
//    ibis.assert
//    ibis.filter
//    ibis.sort
// -- Public --
//    ibis.attachBindNode
//    ibis.detachBindNode

// == Prototypes ==
//    ibis.data
//    ibis.call
//    ibis.link
//    ibis.json
//    ibis.tds
//    ibis.edit (form)
//    ibis.view
//    ibis.ghost
//    ibis.widget
//    ibis.layout
//    ibis.extend (parent)
//    ibis.filter
//    ibis.sort
//    ibis.format
//    ibis.assert

// == Elements ==
//    ibis-data
//    ibis-call
//    ibis-link
//    ibis-json
//    ibis-tds
//    ibis-edit (form)
//    ibis-view
//    ibis-ghost
//    ibis-widget
//    ibis-layout
//    ibis-extend (parent)
//    ibis-filter
//    ibis-sort
//    ibis-format
//    ibis-assert

// == Footnotes ==

// End ToC

// ==================================================================//

// == Initialization ==

var ibis = {}; // window.ibis ???


WeakMap.prototype.store = function(key, val) {
	var temp = (this.has(this)) ? this.get(this) : {};
	temp[key] = val;
	this.set(this, temp);
};

WeakMap.prototype.fetch = function(key) {
	return (this.has(this)) ? this.get(this)[key] : undefined;
};

WeakMap.prototype.undef = function(key) {
	this.store(key, undefined);
};

WeakMap.prototype.reset = function() {
	this.set(this, {});
};

// == Attributes ==

ibis.attrGetter = function(attr) {
	return function() {
		return (this.hasAttribute(attr)) ? // null
			this.getAttribute(attr) : undefined;
	};
};

ibis.attrSetter = function(attr, cb) {
	return function(value) {
		this.setAttribute(attr, value);
		if (typeof cb === 'function') {
			cb.call(this, value);
		}
	};
};

ibis.attribute = function(attr) {
	return {
		get: ibis.attrGetter(attr),
		set: ibis.attrSetter(attr)
	};
};

ibis.getattrib = function(attr) {
	return {
		get: ibis.attrGetter(attr)
	};
};


// == Properties ==
// -- Private --
//    map
// -- Public --
//    data
//    mark
//    host (root, self, this, node)


// == Methods ==

// -- Private --

ibis.ready = function(callback) {
	// DOMContentReady, ...
};

ibis.isIbis = function(node) {
	// null, undef, ..., string ID
	return (typeof node.nodeName === 'string' &&
		node.nodeName.substr(0, 4) === 'IBIS') ?
		true : false;
};

ibis.isJSON = function(str) {
	
};

ibis.isTDS = function(str) {
	
};

ibis.resolveBindAttr = function() {
	var node = document.getElementById(attr);
	if (node === null) {
		throw new Error('bind attribute does not resolve to a valid element id');
	}
	ibis.attachBindNode.call(this, node);
};

ibis.resolveHrefAttr = function() {
	
};

ibis.resolvePathAttr = function() {
	
};

ibis.resolveNsAttr = function() {
	
};

ibis.attachDataListener = function(node) {
	node.addEventListener('dataready', handleEvent, false);
	ibis.map.set(this, 'data', node.data);
	ibis.map.set(this, 'node', node);
};


// -- Public --

ibis.attachBindNode = function() {
	return {
		value: function(node) {
			//map = ibis._map.bind(this);
			//console.log(map);
			//map.store('id', this.id);
			//console.log(map.show());
			if (ibis.isIbis(node)) {
				// add to map
				ibis.detachBindNode.call(this); // clear prev
				ibis.attachDataListener.call(this, node);
				ibis.handleData.call(this, node); // varies per element
				ibis.reportData.call(this);
			}
		}
	};
	
	// remove previous bind node if exists
	// remove previous listener on node
	// attach listener on node
	// store bind node to map
	/*
	if (typeof node === 'undefined') return;
	
		if (this.bind === null) {
			return;
		}
		node = document.getElementById(this.bind);
	}
	if (node === null) {
		console.warn('Ibis: could not bind to node with id "',
			this.bind, '" (node not found)');
		return;
	}
	
	this.dispatchEvent(ibis.onattach);
	//handleData();
	node = null;
	*/
};

ibis.detachBindNode = function() { // remove, release
	return {
		value: function() {
			
		}
	};
	//bindNode.removeEventListener('data', handleEvent, false);
	//this.dispatchEvent(ibis.onattach);
	//reset();
};

// ***************** function foo() is faster than var foo = function() *******************************

/*
console.log('outside', document.readyState);
document.onreadystatechange = function () {
	console.log('outside', document.readyState);
};
*/

ibis.rootTest = function() {
	
};

ibis.doBind = function() {
	console.log(this.bind, document.readyState);
};

document.addEventListener('readystatechange', function(e) {
  // imports are loaded and elements have been registered
  //console.log('new ready state', document.readyState);
});
// == Prototypes ==

ibis.data = function() {
	var cache = null;
	return {
		init: {
			value: (function() {
				// http://jsperf.com/bind-compare/4
				//cache = new (WeakMap.bind(this))();
				var WM = WeakMap.bind(this);
				cache = new WM();
			})()
		},
		createdCallback: {
			value: function() {
				ibis.doBind.call(this);
			}
		},
		attachedCallback: {
			value: function() {
				
			}
		},
		attributeChangedCallback: {
			value: function(attr, prev, curr) {
				switch(attr) {
					case 'bind':
						ibis.doBind.call(this);
						break;
				}
				//console.log('attr changed:', attr, prev, curr);
			}
		},
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		attachBindNode: ibis.attachBindNode(),
		detachBindNode: ibis.detachBindNode()
	};
};

ibis.call = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		call: ibis.attribute('call', ibis.resolveCallAttr)
	};
};

ibis.link = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		href: ibis.attribute('href', ibis.resolveHrefAttr)
	};
};

ibis.json = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.tds = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.edit = function() { // form
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.view = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		path: ibis.attribute('path', ibis.resolvePathAttr),
		ns: ibis.attribute('ns', ibis.resolveNsAttr)
	};
};

ibis.ghost = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		path: ibis.attribute('path', ibis.resolvePathAttr),
		ns: ibis.attribute('ns', ibis.resolveNsAttr)
	};
};

ibis.widget = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		path: ibis.attribute('path', ibis.resolvePathAttr),
		ns: ibis.attribute('ns', ibis.resolveNsAttr)
	};
};

ibis.layout = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr),
		path: ibis.attribute('path', ibis.resolvePathAttr),
		ns: ibis.attribute('ns', ibis.resolveNsAttr)
	};
};

ibis.filter = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.sort = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.format = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.assert = function() {
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};

ibis.extend = function() { // parent
	//var map = new ibis.map();
	return {
		bind: ibis.attribute('bind', ibis.resolveBindAttr)
	};
};


// == Elements ==

ibis.elements = [
	'data',
	'call',
	'link',
	'json',
	'tds',
	'edit', // form
	'view',
	'ghost',
	'widget',
	'layout',
	'extend', // parent
	'filter',
	'sort',
	'format',
	'assert'
];

var element;
while ((element = ibis.elements.shift())) {
	document.registerElement('ibis-' + element, {
		prototype: Object.create(
			HTMLElement.prototype,
			ibis[element]()
		)
	});
}


// == Footnotes ==
