

'use strict';

// add a sort option to main

module.exports = function includes() {
  return function (files, metalsmith, done) {
    setImmediate(done);
    
    var meta = metalsmith.metadata();
    meta.includes = {};
    
    Object.keys(files).forEach(file => {
      if (! /html/.test(file)) return;
      
      var collection = files[file].collection;
      
      if (collection === undefined) return;
      
      if (typeof collection === 'string') {
        collection = [collection];
      }
      
      /**
       * This is what makes it work.
       *
       * By calling this before `metalsmith-collections`
       * we can make a `copy` of the `file` object
       * which will NOT be updated by reference with later transforms
       * and have a clean original to include using our
       * template engine in `metalsmith-layouts`
       *
       * If we call this after `metalsmith-collections`
       * we have to deal with the introduced complexity
       * of copying the `file` object after circular references
       * have been introduced (next, previous)
       **/
       
      // var included = JSON.parse(JSON.stringify(files[file]));
      var included = Object.assign({}, files[file]);
      included.path = file;
      // included.contents = included.contents.toString(); // not needed
      
      collection.forEach(key => {
        if (meta.includes[key] === undefined) {
          meta.includes[key] = [];
        }
        meta.includes[key].push(included);
        // sort here ...
      });
    });
    // console.log('INC', meta.includes);
  };
};

