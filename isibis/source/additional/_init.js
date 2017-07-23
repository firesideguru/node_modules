

'use strict';

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}

var init = [];

function main () { // ??? var main = function () { // not hoisted
  console.log('page loaded enough');
  init.forEach(function(method) {
    method();
  });
  // load all <data> <view> src= assets, then ...
  traverse(document.documentElement);
  console.log('page methods loaded');
}

