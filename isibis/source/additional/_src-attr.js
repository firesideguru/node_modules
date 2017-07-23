




function foo (e) {
  console.log(e.target.nodeName)
}
  
  
window.onload = function () {
  var b = document.querySelector('[bind]');
  
  // if (typeof fn === 'function')
  var fn = window['foo'];
  b.addEventListener('click', fn);
}



// timeout
// nocache

// onload
// onerror

// emit(load)
// emit(error)

// <loading></loading> // <loading view="loader"></loading>
// <error></error>     // <error view="error"></error>

// dedupe()

