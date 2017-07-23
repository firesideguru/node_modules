
'use strict';


var args = process.argv.slice(2); // cmds

var help_message = `

// INFO MESSAGES

--help,
-h (this message)

--version,
--ver,
-v (zink version)

// MAIN METHODS

--sync,
-s (perform sync over) <bool flag>

--copy,
-c (perform copy over) <bool flag>

--test,
-t (run permissions test) <bool flag>

--diff,
-d (report diff) <bool flag>

// SETUP, SETTINGS FILES PATH

--config,
--conf,
--cfg,
-f (configuration file) "path"

// ROOT PATHS

--source,
--src,
-i (input source root) "path"

--destin,
--dst,
-o (output destination root) "path"

// OPTIONS

--diff,
-d (report diff) <bool flag>

--back,
-b (backup first) "new name"

--root,
-r (elevate privilages if needed) <bool flag>

--nuke,
-n (remove target destination directory before copy) <bool flag>

--wash,
-w
--extra
-x (clean extra satelite detached files not found in source, after sync) <bool flag>

--omit,
-m (omit ignore files paths array) "file; or; semicolon; seperated; string"

`;

console.log(args);

// process each cmd,
// split combined cmds,
// validate has arg for arg cmds,
// set opts object,
// call main method last,
// no main method conflicts,
// let main method sort which args it supports and needs

// flag, action
var cmd = {
  '--help'  : h,
  '-h'      : h,
  '--version': v,
  '--ver': v,
  '--v': v
  
};

function combos (cmd) {
  if (cmd === '-cbnr') {
    // ...
  }
}

function h (cmd, args) {
  
}

function v (cmd, args) {
  
}

function s (cmd, args) {
  
}

function f (cmd, args) {
  // unshift next arg for path
}