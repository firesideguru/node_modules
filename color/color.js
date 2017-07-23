
'use strict';

const colors = require('./colors.json');

function getColor(name) {
  let
    obj = {},
    idx = colors.col.indexOf(name.toLowerCase());
  if (idx > -1) {
    obj.hex = colors.hex[idx];
    obj.rgb = colors.rgb[idx];
  } else {
    obj.err = new Error('No color found by that name');
  }
  return JSON.stringify(obj);
}


console.log(getColor('blue'))

// http://www.rapidtables.com/web/color/RGB_Color.htm
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/39077686#39077686
// http://jsfiddle.net/Mottie/xcqpF/1/light/