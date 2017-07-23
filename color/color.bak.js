
'use strict';

var fs = require('fs');
  
function parseColors() {
  var data = fs.readFileSync('colors.txt');
  var split = /(?:\r\n|\r|\n)/; // on newlines
  var arr = data.toString().split(split);
  var obj = {
    col: [],
    hex: [],
    rgb: []
  };
  for(var i = 0; i < arr.length; i ++) {
    var val = arr[i];
    switch (i % 3) {
      case 0:
        obj.col.push(val.toLowerCase());
        break;
      case 1:
        obj.hex.push(val);
        break;
      case 2:
        obj.rgb.push(val.toLowerCase().match(/\d+/g));
        break;
    }
  }
  return obj;
}


fs.writeFileSync('colors.json', JSON.stringify(parseColors()))