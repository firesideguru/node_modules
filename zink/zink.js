

'use strict';


const
  // util = require('./util'),
  init = require('./init'),
  call = require('./call'); // on Session and Settings


function Zink (...args) {
  
  this.init(args);
  
  
  
  // can we define setter/getter on the this object ???
  // Object.defineProperty('srcConn', this, {
  
}


Zink.prototype.init = init;


// public methods
Zink.prototype.main = function (args) {
  
};

Zink.prototype.sync = function (opts) {
  
};

Zink.prototype.diff = function (opts) {
  
};

Zink.prototype.copy = function (opts) {
  
};

Zink.prototype.test = function (opts) {
  
};




var z = new Zink ('one', 'two');

