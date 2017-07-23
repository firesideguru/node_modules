

'use strict';

// links ...
// http://caniuse.com/#feat=history  //  IE >= 10
// http://www.adequatelygood.com/Saner-HTML5-History-Management.html

// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
// https://developer.mozilla.org/en-US/docs/Web/API/History_API
// http://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
//





// capture event changes, update and monitor browser history


// There is no one right way to handle dynamic site navigation

// On the client do we want to handle every link programatically
// On the client do we degrade gracefully for older browsers or absence of javascript support
// On the server do we share a lookup dictionary for content and templates with the client
// On the server do we allow the server to handle static pages and "fall through" to dynamic ones
// or does the CGI handler route every request
// How are you going to manage history and URL paths to deliver state and views

// These are a few tools to help with dynamic site navigation
// You should test each function in your target browsers for support
// Bundle these up in a library to remove from global (window) scope

// Article
// http://www.adequatelygood.com/Saner-HTML5-History-Management.html


// Handle all clicks that have a "data-nav" attribute
// <element data-nav="reference"> can be any element
document.addEventListener('click', function(event) {
  if (event.target.hasAttribute('data-nav')) {
    console.log(event.target.getAttribute('data-nav'));
    // do something useful with the nav data here
    event.preventDefault();
  }
});

document.addEventListener('readystatechange', function(event) {
  console.log(document.readyState);
  if (document.readyState == "interactive") { // interactive, complete
    //alert('loaded')
    // page has now loaded, do nav business
  }
});

var pathchange = new Event('pathchange');

document.addEventListener('pathchange', function(event) {
  // we don't use event.details as the value is static at the time of defining the event
  console.log(event.details);
  //console.log('pathchange event triggered');
  // lookup the new path value at this point
});

window.addEventListener('hashchange', function(event){
  // redundant with popstate event, but better supported, but limited to #hash navigation
  //console.log('hashchange');
  //console.log(event);
});

// IE 10+
window.addEventListener('popstate', function(event){
  console.log('popstate');
  //console.log(event);
});

window.addEventListener('pushstate', function(event){
  console.log('pushstate');
  //console.log(event);
});

// IE 10+
function pushNav(state) {
  history.pushState(null, null, '?' + state); // query string arbitrary URL format
}

// http://stackoverflow.com/questions/4708358/detect-whether-html5-history-supported-or-not
// ********************************************** http://diveintohtml5.info/everything.html
if (window.history && window.history.pushState) {
  // polling ...
}



// trigger our custom event
document.dispatchEvent(pathchange);


function urlObj() {
  //console.log(location);
  console.log(window.history)
}

// urlObj();

