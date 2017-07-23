

'use strict';


const util = require('./util');


module.exports = function (args) {
  
  let arity = args.length;
  
  let
    config,
    srcPath,
    srcLogin,
    dstPath,
    dstLogin;
    
  let
    srcType, // local | remote
    dstType;
  
  let
    srcPlat, // win | nix
    dstPlat;
    
  let
    srcConn,
    dstConn;
    
  if (arity === 1) {
    [config] = args;
  }
  else if (arity === 2) {
    [srcLogin, dstLogin] = args;
  }
  else if (arity === 3) {
    if (util.isObject(args[0])) {
      [srcLogin, dstPath, dstLogin] = args;
    }
    else {
      [srcPath, srcLogin, dstLogin] = args;
    }
  }
  else if (arity === 4) {
    [srcPath, srcLogin, dstPath, dstLogin] = args;
  }
  else if (arity === 0) {
    // we have no login data
    // error out on failure
  }
  else {
    // we have too many args
    // error out on failure
  }
  
  if (config) {
    if (util.isString(config)) {
      if (util.isLocalFile(config)) {
        config = util.loadData(config);
      }
      else {
        // file path does not exist
        // error out on failure
      }
    }
    
    if (util.isObject(config)) {
      if (config.srcPath) {
        srcPath = config.srcPath;
      }
      if (config.dstPath) {
        dstPath = config.dstPath;
      }
      if (config.srcLogin) {
        srcLogin = config.srcLogin;
      }
      if (config.dstLogin) {
        dstLogin = config.dstLogin;
      }
    }
  }
  
  if (srcLogin) {
    srcType = (srcLogin.local) ? 'local' : 'remote';
  }
  else {
    // bad signature
    // login required
    // error out on failure
  }
  
  if (dstLogin) {
    dstType = (dstLogin.local) ? 'local' : 'remote';
  }
  else {
    // bad signature
    // login required
    // error out on failure
  }
  
  if (srcType === 'remote') {
    if (srcLogin.privateKey) {
      if (util.isLocalFile(srcLogin.privateKey)) {
        srcLogin.privateKey = util.loadFile(srcLogin.privateKey);
      }
    }
    // try to connect
    // srcConn = new sshConn(srcLogin);
    // set srcConn to conn
  }
  
  if (dstType === 'remote') {
    if (dstLogin.privateKey) {
      if (util.isLocalFile(dstLogin.privateKey)) {
        dstLogin.privateKey = util.loadFile(dstLogin.privateKey);
      }
    }
    // try to connect
    //
    // set dstConn to conn
  }
  
  this.srcPath = srcPath;
  this.srcType = srcType;
  this.srcPlat = srcPlat;
  this.srcConn = srcConn;
  
  this.dstPath = dstPath;
  this.dstType = dstType;
  this.dstPlat = dstPlat;
  this.dstConn = dstConn;
  
};

