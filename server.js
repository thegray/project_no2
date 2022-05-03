var http = require('http');
var url = require('url');
var path = require('path');

var fs = require('fs');


require('./game.js')();

var server = http.createServer(handleRequest);
server.listen(8080);

console.log('Server started on port 8080');

function handleRequest(req, res) {
  // parse request
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  } else if (pathname == '/game') {
    pathname = '/game/game.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };

  // Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // console.log("file: ", __dirname+pathname);
  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  );
}

gameServerInit(server);
