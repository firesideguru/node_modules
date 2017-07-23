
// DATA IS ...
// an array of records, usually uniform but not neccessarily
// or an object of ns-keys and array-values of records (as above) ???
// or a single primitive (string, bool, number, null, undefined) value cast as a string ???
// or an array of values (as above) ???

// ability to follow dot-notation paths on objects

'use strict';

// STUBS ...

var selectAll = selectAll || function() {};
var toArray = toArray || function() {};


// MAIN ...

function registerDataElements () {
  var datas = toArray(selectAll(document, 'data'));
  for (var data, obj, as, src, type, i = 0; i < datas.length; i ++) {
    data = datas[i]; // JSON or other registered
    as = data.as;
    src = data.src;
    type = data.type || 'json';
    if (!as) {
      throw new Error('<data> elements must have an as="alias" attribute defined at', data );
    }
    
    if (src) {
      
    }
    else {
      obj = parseData(data.innerHTML, type);
      registerBindData(as, obj);
    }
  }
}


////////////////////////////////////////////////////////////////


var parseData = function (data, type) {
  return JSON.parse(data); // by type
};


document.registerDataParser = function (type, parser) { // handler
  // 'tds', 'json',
};


////////////////////////////////////////////////////////////////


//ibis.resolvePath('context.test.numbers');
//ibis.resoolvePath('ibis.view.test');
var resolvePath = function(attr) { // returns window or path object
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
var dataPath = function(attr) {
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


////////////////////////////////////////////////////////////////


var _bindData = (function () {
  var _data = {};
  // var validKey = function (key) {
  //   var valid = typeof key === 'string';
  //   // if (!valid) throw new Error('');
  //   return valid;
  // };
  // var validVal = function (val) {
  //   var valid = typeof val === 'object';
  //   // if (!valid) throw new Error('');
  //   return valid;
  // };
  return {
    set: function (key, val) {
      // validate here ...
      _data[key] = val;
      return this.has(key);
    },
    get: function (key) {
      return _data[key];
    },
    has: function (key) {
      return key in _data;
    },
    del: function (key) {
      delete _data[key];
      return !this.has(key);
    }
  };
})();


var bindData = {};


function registerBindData (name, data) { // document.registerViewData
  _bindData.set (name, data);
  Object.defineProperty(bindData, name, {
    get: function () {
      return _bindData.get(name);
    },
    set: function (value) {
      _bindData.set(name, value);
      console.log(`do update elements bound to ${name} here`);
    }
  });
}


// registerBindData('bing', {java:'ping'})
// registerBindData('bong', {fitz:'twang'})

// console.log(viewData.bing)
// console.log(viewData.bong)

// var didset = viewData.bing = {one:"two"}
// var diddel = viewData.

// console.log('has', _viewData.has('bingx'))

// console.log(viewData.bing)



// define '_viewData' on 'ibis'
// define 'registerBindData' on 'document'

// var _test = (function (d) {
//   d.foo = function () {
//     console.log(d);
//   };
//   return {
//     get: function () {
//       d.foo();
//     }
//   }
// })(document);

// _test.get();
// console.log(document.foo)

