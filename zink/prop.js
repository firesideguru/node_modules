

'use strict';

var ssh = require('ssh2').Client;
var fs = require('fs');


var key = fs.readFileSync('certs/ibis.pem');

var login = {
  port: 22,
  host: '52.20.143.110',
  username: 'ubuntu',
  privateKey: key
};


function Prop (foo, cb) {
  var self = this;
  var conn = new ssh();
  conn.on('ready', function() {
    console.log('ready');
    // Object.defineProperty(self, 'conn', {
    //   value: conn
    // });
    self.conn = conn;
    cb();
  });
  
  conn.connect(login);
  
  if (foo == 'foo') {
    Object.defineProperty(this, 'bar', {
      value: 29
    });
  }
}


// var p = new Prop('foo', function() {
//   console.log(p.bar)
//   console.log(p.conn)
//   p.conn.end();
// });


function foo (...args) {
  var cb = args.pop();
  bar(...args);
  cb();
}

function bar (one, two) {
  console.log(bar.length)
  console.log(one, two);
}

foo('a', 'b', function() {
  console.log('callback called')
})