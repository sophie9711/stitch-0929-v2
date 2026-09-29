const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
let PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let decodedUrl = decodeURI(req.url.split('?')[0]);
  if (decodedUrl === '/') {
    decodedUrl = '/index.html';
  }

  let filePath = path.join(BASE_DIR, decodedUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else if (fs.existsSync(path.join(filePath, 'code.html'))) {
      filePath = path.join(filePath, 'code.html');
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 로컬 서버가 시작되었습니다!`);
    console.log(`👉 접속 URL: http://localhost:${port}`);
    console.log(`==============================================\n`);
  });
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`포트 ${PORT} 사용 중. 포트 ${PORT + 1}로 재시도...`);
    PORT += 1;
    setTimeout(() => startServer(PORT), 200);
  } else {
    console.error('서버 오류:', e);
  }
});

startServer(PORT);
