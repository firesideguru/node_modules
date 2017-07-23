

'use strict';


const
  fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml');


function loadFile (filePath) {
  let raw;
  if (isLocalFile(filePath)) {
    try {
      raw = fs.readFileSync(filePath);
    } catch (error) {
      // can not read file at path.resolve(filePath);
      // error out on failure
    }
  }
  else {
    // file does not exist at path.resolve(filePath);
    // error out on failure
  }
  return raw;
}


function loadData (filePath) {
  let data;
  let ext = path.extname(filePath);
  let src = loadFile(filePath);
  if (ext == '.yaml' || ext == '.yml') {
    data = yaml.safeLoad(src);
  }
  else if (ext == '.json') {
    data = JSON.parse(src);
  }
  else {
    // unrecognized file type
    // error out on failure
  }
  return data;
}


var isLocalFile = function (filePath) {
  return true &&
    fs.existsSync(filePath) &&
    fs.statSync(filePath).isFile();
};


var isString = function (value) {
  return value.constructor === String;
};


var isObject = function (value) {
  return value.constructor === Object;
};


var isLocal = function (login) {
  return login.local || false;
};


module.exports = {
  loadFile: loadFile,
  loadData: loadData,
  isString: isString,
  isObject: isObject
};

