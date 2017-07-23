
'use strict';

var ssh2 = require('ssh2').Client;
var fs = require('fs');
var join = require('path').join;
var crypto = require('crypto');


// md5sum <file>
// CertUtil -hashfile <file> MD5
// certutil -hashfile <file> MD5


var key = fs.readFileSync('certs/ibis.pem');

var dstLogin = {
  port: 22,
  host: '52.20.143.110',
  username: 'ubuntu',
  privateKey: key
};

var srcRoot = '/home/chronos/user/Downloads/transfer/public';
var dstRoot = '/home/ubuntu/public';

var dirA = '/home/chronos/user/Downloads/example/publish';
var dirB = '/home/chronos/user/Downloads/example/pubx';


function Zink (srcPath, srcLogin, dstPath, dstLogin, ready) { // combine with z.sync()
  let srcConn;
  let srcReady = true;
  let dstConn = new ssh2();
  let dstReady = false;
  
  // srcConn.on('ready', function() {
  //   srcReady = true;
  //   if (dstReady) {
  //     ready();
  //   }
  // });
  
  dstConn.on('ready', function() {
    dstReady = true;
    if (srcReady) {
      ready(dstConn, dstPath); // fire ready event
    }
  });
  
  // srcConn.on('error', function(err) {
  //   console.log('Zink Error: srcLogin failed. Check your settings.');
  //   console.log('With message', err);
  // });
  
  dstConn.on('error', function(err) {
    console.log('Zink Error: dstLogin failed. Check your settings.');
    console.log('With message', err);
  });
  
  // srcConn.connect(srcLogin);
  dstConn.connect(dstLogin);
}

var z = new Zink(null, null, dstRoot, dstLogin, onReady);

Zink.prototype.syncCb = function (srcPath, dstPath, opts, cb) { // ...args, this.sync(args);
  
};

Zink.prototype.syncEv = function (srcPath, dstPath, opts) {
  
};

Zink.prototype.syncPr = function (srcPath, dstPath, opts) {
  
};

Zink.prototype.sync = function (srcPath, dstPath, opts, cb) {
  this.hasPaths(srcPath, dstPath);
  
};

Zink.prototype.connect = function () {
  
};

Zink.prototype.hasPaths = function (srcPath, dstPath) {
  if (srcPath) {
    this.srcPath = srcPath;
  }
  if (dstPath) {
    this.dstPath = dstPath;
  }
  if (!this.srcPath) {
    // throw error on failure
  }
  if (!this.dstPath) {
    // throw error on failure
  }
};

function onReady(conn, path) { // z.sync()
  // if no path (srcPath, dstPath) cannot do method
  conn.sftp(function(err, sftp) {
    if (err) throw err;
    sftp.readdir(path, function(err, list) {
      if (err) throw err;
      // console.dir(list);
      // conn.end();
    });
    sftp.stat(path, function(err, stat) {
      if (err) console.log('stat error')
      console.log(stat.isDirectory())
      conn.end();
    })
  });
}







var opts = {
  ignore: ['.gitignore', '.git', 'node_modules', '/index.html'] // /home/chronos/user/Downloads/example/publish/include/css
};

// var diff = diffDir(dirA, dirB, opts);
// console.log(diff);



function diffDir (srcRoot, dstRoot, opts, path, diff) { // traverse() , do diff() via method calls, and test(), and copy() | del()
  
  if (!diff) {
    diff = {
      ignoring: [],
      detached: [],
      notfound: [],
      modified: [],
      nochange: []
    };
  }
  
  if (!path) {
    path = '';
  }
  
  // sanitize and validate opts before calling diffDir
  if (!opts) {
    opts = {};
  }
  
  if (!opts.ignore) {
    opts.ignore = [];
  }
  
  let srcList = listDir(srcRoot);
  let dstList = listDir(dstRoot);
  
  srcList.forEach(srcItem => {
    
    let srcPath = join(srcRoot, srcItem);
    let dstPath = join(dstRoot, srcItem);
    
    let srcInfo = info(srcPath);
    let dstInfo = info(dstPath);
    
    let item = {
      itemName: srcItem,
      srcRoot: srcRoot,
      dstRoot: dstRoot,
      isDir: srcInfo.isDir
    };
    
    // skip items on ignore list
    if (ignore(srcRoot, path, srcItem, opts.ignore)) {
      diff.ignoring.push(item);
      return; // next item
    }
    
    let dstIdx = dstList.indexOf(srcItem);
    
    if (dstIdx > -1) {
      let found = dstList.splice(dstIdx, 1);
    
      if (srcInfo.cksum && srcInfo.cksum === dstInfo.cksum) {
        diff.nochange.push(item);
        return; // next item
      }
      else if (srcInfo.isFile) {
        // upload modified here
        diff.modified.push(item);
      }
      else if (srcInfo.isDir) {
        if (dstInfo.isDir) {
          // recursive traverse here
          diffDir(srcPath, dstPath, opts, join(path, srcItem), diff);
        }
        else {
          // upload modified here
          diff.modified.push(item);
        }
      }
      else {
        // src is not file or dir
        // we do not handle others
      }
    }
    else {
      // upload missing here
      diff.notfound.push(item);
    }
  });
  
  // process detached (remaining) dst items
  dstList.forEach(dstItem => {
    if (ignore(srcRoot, path, dstItem, opts.ignore)) {
      return; // next item
    }
    // remove detached here
    
    let dstPath = join(dstRoot, dstItem);
    let dstInfo = info(dstPath);
    
    let item = {
      itemName: dstItem,
      srcRoot: srcRoot,
      dstRoot: dstRoot,
      isDir: dstInfo.isDir
    };
    
    diff.detached.push(item);
  });
  
  return diff;
}


function ignore (root, path, item, ignores) {
  
  let isolated = item;
  let relative = join(path, item);
  let absolute = join(root, item);
  let prefixed = join('/', path, item);
  let trailing = join(path, item, '/');
  let enclosed = join('/', path, item, '/');
  
  return false ||
    ignores.indexOf(isolated) > -1 ||
    ignores.indexOf(relative) > -1 ||
    ignores.indexOf(absolute) > -1 ||
    ignores.indexOf(prefixed) > -1 ||
    ignores.indexOf(trailing) > -1 ||
    ignores.indexOf(enclosed) > -1;
}


function listDir (path) {
  return fs.readdirSync(path);
}


function info (path) {
  
  let stats = stat(path);
  let isFile = stats.isFile();
  let isDir = stats.isDirectory();
  let cksum = (isFile) ? crc(path) : false; // (isDir ? 'DIR' : 'NON')
  
  return {
    isFile: isFile,
    isDir: isDir,
    cksum: cksum
  };
}


function stat (path) {
  return fs.statSync(path);
}


function crc (file, algo, enc) {
  
  let data = fs.readFileSync(file);
  
  let cksum = crypto
    .createHash(algo || 'md5')
    .update(data, 'utf8')
    .digest(enc || 'hex');
    
  return cksum;
}
