

'use strict';

var t = require('temple');


// var fs = require('fs');
// var read = fs.createReadStream('data.txt', 'utf8');


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




// process.stdin.setEncoding('utf8');

// process.stdin.on('readable', () => {
//   var message = process.stdin.read();
//   if (message !== null) {
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
//   }
// });

// process.stdin.on('end', () => {
//   process.stdout.write('end');
//   agent.close();
// });
