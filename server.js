const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Amadeus = require('amadeus');

const port = process.env.PORT || 3000;
const baseDir = process.cwd();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID || "8k7L2HM3T5ApBkArcX24IYVkw2iv5LaA",
  clientSecret: process.env.AMADEUS_CLIENT_SECRET || "IFnNDbzM7232IRYF",
});

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif'
  };
  return map[ext] || 'application/octet-stream';
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;


  // Serve static files
  const safePath = path.normalize(decodeURIComponent(pathname.split('?')[0]));
  let filePath = path.join(baseDir, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server error');
        return;
      }

      res.setHeader('Content-Type', getContentType(filePath));
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
