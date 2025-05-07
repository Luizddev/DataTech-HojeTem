const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');
require('dotenv').config(); // Carrega variáveis do .env

const API_KEY = process.env.CHAVE_API;
const PORT = 3000;

const basePath = __dirname;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Servir index.html na raiz
    if (pathname === '/') {
        const indexPath = path.join(basePath, 'index.html');
        fs.readFile(indexPath, (err, data) => {
            if (err) {
                console.error('Erro ao carregar index.html:', err);
                res.writeHead(500);
                res.end('Erro ao carregar a página');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Servir arquivos estáticos (CSS, JS, imagens, etc.)
    else if (pathname.match(/\.(css|js|png|jpg|jpeg|gif)$/)) {
        const filePath = path.join(basePath, decodeURIComponent(pathname));
        const ext = path.extname(filePath).toLowerCase();

        const mimeTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif'
        };

        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.error('Erro ao carregar arquivo estático:', filePath, err);
                res.writeHead(404);
                res.end('Arquivo não encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                res.end(content);
            }
        });
    }

    // API: buscar gêneros
    else if (pathname === '/api/genres') {
        const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;

        https.get(apiUrl, apiRes => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });
    }

    // API: buscar filmes por gênero
    else if (pathname === '/api/movies') {
        const genreId = parsedUrl.query.genre;
        if (!genreId) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Gênero não informado' }));
        }

        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc`;

        https.get(apiUrl, apiRes => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                const json = JSON.parse(data);
                const shuffled = json.results.sort(() => 0.5 - Math.random()).slice(0, 50);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(shuffled));
            });
        });
    }

    // API: buscar filmes populares (nova rota)
    else if (pathname === '/api/popular-movies') {
        const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

        https.get(apiUrl, apiRes => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                const json = JSON.parse(data);
                const movies = json.results.filter(movie => movie.poster_path); // Garantir que só filmes com poster sejam retornados
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(movies));
            });
        });
    }

    // Rota inexistente
    else {
        res.writeHead(404);
        res.end('Página ou recurso não encontrado');
    }
});

server.listen(PORT, () => {
    console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
