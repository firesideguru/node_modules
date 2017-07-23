
# Zink

> Sync or copy files locally or across remote machines.

Zinc uses an (ssh2)[] backbone to provide convenience methods
for diff syncing or copying files across machines.



Must provide logins on instantiation

srcLogin = object with
  ssh2 login credentials
  [or] local: bool<true>
  
dstLogin = object with
  ssh2 login credentials
  [or] local: bool<true>

config = object with
  srcLogin object, as above
  dstLogin object, as above
  [optionally]
  srcPath <string>
  dstPath <string>
  
config = string with path to config file
  config.yaml, config.yml, config.json
  with same values as defined
  
Optional paramaters include
  srcPath = string of path to working directory
  dstPath = string of path to working directory

Signatures
var z = new Zink(config);
var z = new Zink('path/to/config.yaml|yml|json');
var z = new Zink(srcLogin, dstLogin);
var z = new Zink(srcPath, srcLogin, dstLogin);
var z = new Zink(srcLogin, dstPath, dstLogin);
var z = new Zink(srcPath, srcLogin, dstPath, dstLogin);

Methods
z.sync(opts); // perform checksum diff sync
z.diff(opts); // perform checksum diff report
z.test(opts); // perform permissions dry run
z.copy(opts); // perform (compressed if remote) copy of entire file or dir

z.srcExec('cmd', cb); // uses ssh2, not conn.sftp
z.dstExec('cmd', cb); // uses ssh2, not conn.sftp

Setters/Getters
z.srcConn; // getter only, returns ssh2 conn object or 'local'
z.dstConn; // getter only, returns ssh2 conn object or 'local'
z.srcPath | srcPath = 'path';
z.dstPath | dstPath = 'path';
z.setSrcPath();
z.setDstPath();
z.getSrcPath();
z.getDstPath();

Options
nuke:     bool   // remove destination before z.copy (WARNING !!!)
sanitize: bool   // remove detached files and dirs after z.sync (WARNING !!!)
  tidy: bool
sudo:     bool   // attempt sudo, only if perms need to be elevated (WARNGING !!!)
  root: bool
report:   bool   // create diff report and return at end of z.sync or z.copy (only, not z.diff)
  diff: bool
ignore:   []     // do not include list of file|dir names, paths relative to working dir, absolute paths during z.sync only
  omit: []
backup:   'name' // rename existing destination before z.copy only
  back: 'name'
  save: 'name'
  

