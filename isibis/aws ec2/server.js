/***

https://gist.github.com/amejiarosario/53afae82e18db30dadc9bc39035778e5

http://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http

https://blog.risingstack.com/your-first-node-js-http-server/

http://stackoverflow.com/questions/17124600/how-can-i-add-cors-headers-to-a-static-connect-server


mime type lists...

https://www.sitepoint.com/web-foundations/mime-types-complete-list

https://github.com/h5bp/server-configs-nginx/blob/master/mime.types

IE issue: http://www.entwicklungsgedanken.de/2008/06/06/problems-with-internet-explorer-and-applicationjson/


In our simple playground scenario we just want to server some static
json, html, jpeg, png type files out of a 'public' directory path

And set CORS headers


***/


'use strict';

const http = require('http');
const url  = require('url');
const fs   = require('fs');
const path = require('path');

const port = process.argv[2] || 80;
const root = 'public';


const app = function (req, res) {
  
  console.log(`${req.method} ${req.url}`);

  const urlData = url.parse(req.url);
  
  // const filePath = `./${root}${urlData.pathname}`;
  const filePath = path.join(__dirname, root, urlData.pathname);
  
  console.log(filePath);
  
  const fileExists = fs.existsSync(filePath);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (fileExists) {
    
    let fileStats = fs.statSync(filePath);
    let fileData = fileType(filePath);
    let mimeType = fileData.mime;
    let encoding = fileData.enc;
    
    if (fileStats.isDirectory()) {
      fs.readdir(filePath, (error, dirList) => {
        let fileData = JSON.stringify(dirList);
				mimeType = 'application/json';
				res.setHeader('Content-Type', mimeType);
        res.end(fileData, encoding);
      });
    }
    
    else if (fileStats.isFile()) {
      fs.readFile(filePath, encoding, (error, fileData) => {
        if (error) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${error}.`);
        }
        else {
          res.setHeader('Content-Type', mimeType);
          // res.writeHead(200, {'Content-Type': mimeType});
          res.end(fileData, encoding);
        }
      });
    }
  }
  
  else {
    res.statusCode = 404;
    res.end(`404 File ${urlData.pathname} not found!`);
  }

};

const server = http.createServer(app);
server.listen(parseInt(port));

console.log(`Server listening on port ${port}`);


const fileType = function (filePath) {
  let fileExt = path.parse(filePath).ext;
  const typeMap = {
    '.html':  {enc: 'utf8', mime: 'text/html'},
    '.css':   {enc: 'utf8', mime: 'text/css'},
    '.js':    {enc: 'utf8', mime: 'text/javascript'},
    '.json':  {enc: 'utf8', mime: 'application/json'},
    '.pdf':   {enc: 'utf8', mime: 'application/pdf'},
    '.doc':   {enc: 'utf8', mime: 'application/msword'},
    '.ico':   {enc: 'binary', mime: 'image/x-icon'},
    '.png':   {enc: 'binary', mime: 'image/png'},
    '.jpg':   {enc: 'binary', mime: 'image/jpeg'},
    '.wav':   {enc: 'binary', mime: 'audio/wav'},
    '.mp3':   {enc: 'binary', mime: 'audio/mpeg'},
    '.svg':   {enc: 'binary', mime: 'image/svg+xml'}
  };
  return typeMap[fileExt] || {enc: 'utf8', mime: 'text/plain'};
};

