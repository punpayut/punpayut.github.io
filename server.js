const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;

  // Extract the first segment of the URL path to determine the subdirectory
  const segments = req.url.split('/');
  const subdirectory = segments[1]; // Assuming the first segment is the subdirectory

  // Check if the requested subdirectory exists
  const subdirectoryPath = path.join(__dirname, subdirectory);
  if (!fs.existsSync(subdirectoryPath)) {
    res.statusCode = 404;
    res.end('404 Not Found');
    return;
  }

  // Adjust the file path to include the subdirectory
  filePath = path.join(subdirectoryPath, filePath.slice(2 + subdirectory.length));

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.statusCode = 404;
        res.end('404 Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
