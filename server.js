// server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

// Fungsi untuk melayani file statis
const serveStaticFile = (filePath, contentType, response) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Jika file tidak ditemukan, kembalikan halaman 404
                fs.readFile('./public/404.html', (err, data) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(data, 'utf-8');
                });
            } else {
                // Jika terjadi error lain, kembalikan status 500
                response.writeHead(500);
                response.end(`Server Error: ${err.code}`);
            }
        } else {
            // Jika file ditemukan, kembalikan file tersebut dengan content type yang sesuai
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data, 'utf-8');
        }
    });
};

// Fungsi untuk melayani daftar file di direktori public
const serveDirectoryListing = (response) => {
    fs.readdir(path.join(__dirname, 'public'), (err, files) => {
        if (err) {
            response.writeHead(500);
            response.end(`Server Error: ${err.code}`);
        } else {
            let fileListHTML = '<h1>File List in Public Directory</h1><ul>';
            files.forEach(file => {
                fileListHTML += `<li><a href="/${file}">${file}</a></li>`;
            });
            fileListHTML += '</ul>';
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(fileListHTML, 'utf-8');
        }
    });
};

// Membuat server HTTP
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Tampilkan daftar file di direktori public
        serveDirectoryListing(res);
    } else {
        // Tentukan file path berdasarkan URL
        let filePath = path.join(__dirname, 'public', req.url);

        // Tentukan content type berdasarkan ekstensi file
        let extname = String(path.extname(filePath)).toLowerCase();
        let mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream';

        // Layani file statis
        serveStaticFile(filePath, contentType, res);
    }
});

// Tentukan port server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
