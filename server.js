// ========================================================
// Ramayana 2026 - High-Performance Local Streaming Server
// Native Node.js with HTTP 206 Partial Content (Range) Support
// ========================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mkv': 'video/x-matroska',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // REST API: Peachify TMDB Movie Stream Endpoint
  if (reqPath.startsWith('/api/stream/movie/')) {
    const tmdbId = reqPath.replace('/api/stream/movie/', '').trim();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      success: true,
      provider: 'Peachify',
      tmdbId: tmdbId,
      embedUrl: `https://peachify.net/movie/${tmdbId}`,
      playerType: 'iframe'
    }));
  }

  // REST API: Peachify TMDB TV/Series Stream Endpoint
  if (reqPath.startsWith('/api/stream/tv/')) {
    const parts = reqPath.replace('/api/stream/tv/', '').split('/');
    const tmdbId = parts[0] || '243555';
    const season = parts[1] || '1';
    const episode = parts[2] || '1';
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      success: true,
      provider: 'Peachify',
      tmdbId: tmdbId,
      season: season,
      episode: episode,
      embedUrl: `https://peachify.net/tv/${tmdbId}/${season}/${episode}`,
      playerType: 'iframe'
    }));
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(ROOT_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileSize = stats.size;
    const range = req.headers.range;

    // Handle HTTP 206 Partial Content (Range requests) for fast video scrubbing
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`
        });
        return res.end();
      }

      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      });

      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`=======================================================`);
  console.log(`🎬 Ramayana (2026) Cinema Server running!`);
  console.log(`🌐 Open in your browser: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

