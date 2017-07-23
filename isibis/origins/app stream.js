

'use strict';


var fs = require('fs');
// var read = fs.createReadStream('data.txt', 'utf8');

var newline = require('temple/plugins/newline');
var Escape = newline.Escape;
var Unescape = newline.Unescape;

var quote = require('temple/plugins/quote');
var Wrap = quote.Wrap;
var Unwrap = quote.Unwrap;


// read
// .pipe(new Escape())
// .pipe(new Unescape())
// .pipe(process.stdout);



var prepare = function(output) {
  fs.createReadStream('data.txt', 'utf8')
  .pipe(new Escape())
  .pipe(new Wrap())
  .pipe(output);
};

var cache = function(name, output, callable) {
  // if file 'name' exists, createReadStream
  // else
  callable(fs.createWriteStream(name + '.txt'));
  // fs.createReadStream(name = '.txt')
  // .pipe(output);
};

// cache('foo', process.stdout, prepare); // key-named cache, output stream, callable input function(output-stream) if cache does not exist


const stream = require('stream');

class Foo extends stream {
  construct () {
    // super();
    console.log(this);
  }
}

// console.log(new Foo())


const Transform = require('stream').Transform;

class Test extends Transform {
  constructor () {
    super();
    // var pip = this.pipe.bind(this._transform, this)
    // console.log(pip);
    // return this
    // console.log(this)
  }
  _transform (chunk, encoding, done) {
    
    // this
    // .pipe(new Escape())
    // .pipe(new Wrap())
    // .pipe(this);
    // console.log(this)
    // this.push(chunk.toString().replace(/\r?\n/g, '\\n'));
    // this.push(chunk);
    this.push('foo bar baz');
    done();
    // console.log(this)
    // this._transformState.writecb()
  }
  _flush (done) {
    // this.push('this is a flush')
    this.push('\n');
    done();
    process.exit(0);
  }
}

var test = new Test();
var fizz = Test.pipe.bind(test)
// console.log(test)

fs.createReadStream('data.txt', 'utf8')
.fizz
.pipe(process.stdout);



// read.on('end', () => {
//   process.stdout.write('\n');
//   process.exit(0);
// });



// var rl = require('readline').createInterface({input: read});

// rl.on('line', line => {
//   console.log(line);
// });

// rl.on('close', () => {
//   console.log('END OF FILE');
//   process.exit(0);
// });






// var payload = '"';
// read.on('data', (data) => {
//   payload += encode(data);
// });

// read.on('end', () => {
//   payload += '"';
//   console.log('IBIS');
//   // console.log(payload);
//   console.log(decode(payload));
//   console.log(JSON.parse(payload));
  
//   var json = fs.readFileSync('data.txt').toString();
//   json = JSON.stringify(json);
//   console.log('JSON');
//   // console.log(json);
//   // console.log(decode(json));
//   // console.log(JSON.parse(json));
// });




process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var message = process.stdin.read();
  if (message !== null) {
    // console.log(message)
    // switch(message.trim()) {
    //   case 'join':
    //     join();
    //     break;
    //   case 'pause':
    //     pause();
    //     break;
    //   case 'resume':
    //     resume();
    //     break;
    // }
    //process.stdout.write(`data: ${chunk}`);
    // ibis.request({ns: 'thoth', act: 'emit'}, message)
    // .then(result => {
    //   console.log('app thoth result', result);
    // })
    // .catch(error => {
    //   console.log('app thoth error', error);
    // });
  }
});

// process.stdin.on('end', () => {
//   process.stdout.write('end');
//   agent.close();
// });
