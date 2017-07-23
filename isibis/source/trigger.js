

'use strict';





/***
var init = init || [];
init.push(registerTriggerElements);


function registerTriggerElements () {
  var triggerElems = toArray(selectAll('trigger'));
  triggerElems.forEach(function (node) {
    // attrAssign(node, 'bind', doBind);
    // doBind(node);
  });
}



function attrSet (node, attr, value) {
  // still needs some work
  // check if current value
  // store current value (for toggle) => store on toggle ???
  node[attr] = value;
  if (node.getAttribute(attr) !== value) {
    if (node[attr]) { // if prev reset to prev value
      delete node[attr];
    }
    node.setAttribute(attr, value);
  }
  return node;
}




var trigger = document.querySelector('trigger');
trigger.ibis = true;
trigger.addEventListener('click', (e) => {
  var node = e.target;
  do {
    if (node.ibis) {
      var tid = node.getAttribute('for');
      var tattr = node.getAttribute('attr');
      var tval = node.getAttribute('value');
      if (tid && tid.length) {
        var tnode = document.getElementById(tid);
        if (tnode && tattr && tattr.length && tval && tval.length) {
          // console.log(tnode)
          // window.setTimeout(() => {
            // tnode.setAttribute(tattr, tval)
            tnode.value = tval;
            console.log('tnode val', tnode.href);
            // console.log(tnode)
            // }, 100);
        }
      }
      break;
    }
    console.log(node.nodeName);
    node = node.parentNode;
  } while (node);
});

***/