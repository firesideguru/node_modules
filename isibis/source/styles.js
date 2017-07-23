

'use strict';


var setStyles = function () {
  
  // https://davidwalsh.name/add-rules-stylesheets
  
  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  script.parentNode.insertBefore(style, script);
  
  style.id = 'ibis-style';
  var sheet = document.styleSheets['ibis-style'];
  
  function addCSSRule(sheet, selector, rules, index) {
    if ('insertRule' in sheet) {
      sheet.insertRule(selector + '{' + rules + '}', index);
    }
    else if ('addRule' in sheet) { // IE < 9
      sheet.addRule(selector, rules, index);
    }
  }
  
  var index = function() {
    return sheet.cssRules.length || 0;
  }
  
  addCSSRule(sheet, 'data', 'display: none', index());
  addCSSRule(sheet, 'view', 'display: none', index());
  addCSSRule(sheet, 'trigger', 'cursor: pointer', index());
  // addCSSRule(sheet, 'body', 'background: blue', index());
  
}

