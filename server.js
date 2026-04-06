/**
 * Simple HTTP Server for BookStore
 * Serves static files from the public directory
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for different file extensions
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
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// In-memory data storage (simulating database)
const dataStore = {
    users: [],
    orders: [],
    books: [
        {
            id: '1',
            title: 'Дюна',
            author: 'Фрэнк Герберт',
            price: 750,
            genre: 'fiction',
            description: 'Легендарный научно-фантастический роман о далеком будущем человечества.',
            isbn: '978-5-17-118617-0',
            publishYear: 1965,
            pages: 704,
            coverImage: '/images/book-placeholder.jpg',
            stock: 25,
            rating: 4.8
        },
        {
            id: '2',
            title: 'Гордость и предубеждение',
            author: 'Джейн Остин',
            price: 450,
            genre: 'romance',
            description: 'Классический роман о любви и социальных предрассудках в Англии XIX века.',
            isbn: '978-5-17-118618-7',
            publishYear: 1813,
            pages: 416,
            coverImage: '/images/book-placeholder.jpg',
            stock: 30,
            rating: 4.9
        },
        {
            id: '3',
            title: 'Убийство в Восточном экспрессе',
            author: 'Агата Кристи',
            price: 380,
            genre: 'detective',
            description: 'Знаменитый детектив с Эркюлем Пуаро в главной роли.',
            isbn: '978-5-17-118619-4',
            publishYear: 1934,
            pages: 256,
            coverImage: '/images/book-placeholder.jpg',
            stock: 40,
            rating: 4.7
        },
        {
            id: '4',
            title: 'Остров сокровищ',
            author: 'Роберт Льюис Стивенсон',
            price: 320,
            genre: 'adventure',
            description: 'Захватывающая история о пиратах и поисках сокровищ.',
            isbn: '978-5-17-118620-0',
            publishYear: 1883,
            pages: 288,
            coverImage: '/images/book-placeholder.jpg',
            stock: 35,
            rating: 4.6
        },
        {
            id: '5',
            title: 'Основы программирования на JavaScript',
            author: 'Дэвид Флэнаган',
            price: 1200,
            genre: 'educational',
            description: 'Полное руководство по языку JavaScript для начинающих и профессионалов.',
            isbn: '978-5-17-118621-7',
            publishYear: 2020,
            pages: 752,
            coverImage: '/images/book-placeholder.jpg',
            stock: 20,
            rating: 4.5
        },
        {
            id: '6',
            title: '1984',
            author: 'Джордж Оруэлл',
            price: 420,
            genre: 'fiction',
            description: 'Антиутопический роман о тоталитарном обществе будущего.',
            isbn: '978-5-17-118622-4',
            publishYear: 1949,
            pages: 320,
            coverImage: '/images/book-placeholder.jpg',
            stock: 28,
            rating: 4.8
        },
        {
            id: '7',
            title: 'Джейн Эйр',
            author: 'Шарлотта Бронте',
            price: 480,
            genre: 'romance',
            description: 'История любви и самопознания молодой гувернантки.',
            isbn: '978-5-17-118623-1',
            publishYear: 1847,
            pages: 480,
            coverImage: '/images/book-placeholder.jpg',
            stock: 22,
            rating: 4.7
        },
        {
            id: '8',
            title: 'Собака Баскервилей',
            author: 'Артур Конан Дойл',
            price: 350,
            genre: 'detective',
            description: 'Классический детектив о Шерлоке Холмсе и загадочном проклятии.',
            isbn: '978-5-17-118624-8',
            publishYear: 1902,
            pages: 224,
            coverImage: '/images/book-placeholder.jpg',
            stock: 45,
            rating: 4.8
        },
        {
            id: '9',
            title: 'Граф Монте-Кристо',
            author: 'Александр Дюма',
            price: 650,
            genre: 'adventure',
            description: 'Эпическая история мести и справедливости.',
            isbn: '978-5-17-118625-5',
            publishYear: 1844,
            pages: 1216,
            coverImage: '/images/book-placeholder.jpg',
            stock: 18,
            rating: 4.9
        },
        {
            id: '10',
            title: 'Чистый код',
            author: 'Роберт Мартин',
            price: 980,
            genre: 'educational',
            description: 'Руководство по написанию качественного и поддерживаемого кода.',
            isbn: '978-5-17-118626-2',
            publishYear: 2008,
            pages: 464,
            coverImage: '/images/book-placeholder.jpg',
            stock: 15,
            rating: 4.6
        },
        {
            id: '11',
            title: 'Мастер и Маргарита',
            author: 'Михаил Булгаков',
            price: 520,
            genre: 'fiction',
            description: 'Культовый роман о добре и зле, любви и творчестве.',
            isbn: '978-5-17-118627-9',
            publishYear: 1967,
            pages: 480,
            coverImage: '/images/book-placeholder.jpg',
            stock: 32,
            rating: 4.9
        },
        {
            id: '12',
            title: 'Анна Каренина',
            author: 'Лев Толстой',
            price: 580,
            genre: 'romance',
            description: 'Великий роман о любви, семье и обществе.',
            isbn: '978-5-17-118628-6',
            publishYear: 1877,
            pages: 864,
            coverImage: '/images/book-placeholder.jpg',
            stock: 25,
            rating: 4.8
        }
    ]
};

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Parse JSON body from request
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// Send JSON response
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Handle API requests
async function handleApi(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        // Books API
        if (pathname === '/api/books' && method === 'GET') {
            const genre = url.searchParams.get('genre');
            const search = url.searchParams.get('search');
            const minPrice = url.searchParams.get('minPrice');
            const maxPrice = url.searchParams.get('maxPrice');
            const sortBy = url.searchParams.get('sortBy');
            const sortOrder = url.searchParams.get('sortOrder') || 'asc';
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 12;

            let books = [...dataStore.books];

            // Filter by genre
            if (genre && genre !== 'all') {
                books = books.filter(b => b.genre === genre);
            }

            // Filter by search
            if (search) {
                const searchLower = search.toLowerCase();
                books = books.filter(b => 
                    b.title.toLowerCase().includes(searchLower) ||
                    b.author.toLowerCase().includes(searchLower)
                );
            }

            // Filter by price
            if (minPrice) {
                books = books.filter(b => b.price >= parseFloat(minPrice));
            }
            if (maxPrice) {
                books = books.filter(b => b.price <= parseFloat(maxPrice));
            }

            // Sort
            if (sortBy) {
                books.sort((a, b) => {
                    let comparison = 0;
                    if (sortBy === 'price') {
                        comparison = a.price - b.price;
                    } else if (sortBy === 'title') {
                        comparison = a.title.localeCompare(b.title);
                    } else if (sortBy === 'rating') {
                        comparison = a.rating - b.rating;
                    }
                    return sortOrder === 'desc' ? -comparison : comparison;
                });
            }

            // Pagination
            const total = books.length;
            const start = (page - 1) * limit;
            const paginatedBooks = books.slice(start, start + limit);

            sendJson(res, 200, {
                success: true,
                data: paginatedBooks,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
            return;
        }

        // Single book
        if (pathname.match(/^\/api\/books\/[\w-]+$/) && method === 'GET') {
            const id = pathname.split('/').pop();
            const book = dataStore.books.find(b => b.id === id);
            
            if (book) {
                sendJson(res, 200, { success: true, data: book });
            } else {
                sendJson(res, 404, { success: false, error: 'Book not found' });
            }
            return;
        }

        // User registration
        if (pathname === '/api/users/register' && method === 'POST') {
            const body = await parseBody(req);
            
            // Check if email already exists
            if (dataStore.users.find(u => u.email === body.email)) {
                sendJson(res, 400, { success: false, error: 'Email already registered' });
                return;
            }

            const user = {
                id: generateId(),
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                password: body.password, // In real app, hash this!
                createdAt: new Date().toISOString()
            };

            dataStore.users.push(user);
            
            // Don't send password back
            const { password, ...safeUser } = user;
            sendJson(res, 201, { success: true, data: safeUser });
            return;
        }

        // User login
        if (pathname === '/api/users/login' && method === 'POST') {
            const body = await parseBody(req);
            const user = dataStore.users.find(
                u => u.email === body.email && u.password === body.password
            );

            if (user) {
                const { password, ...safeUser } = user;
                sendJson(res, 200, { success: true, data: safeUser });
            } else {
                sendJson(res, 401, { success: false, error: 'Invalid credentials' });
            }
            return;
        }

        // Create order
        if (pathname === '/api/orders' && method === 'POST') {
            const body = await parseBody(req);
            
            const order = {
                id: generateId(),
                orderNumber: 'ORD-' + Date.now(),
                ...body,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            dataStore.orders.push(order);
            sendJson(res, 201, { success: true, data: order });
            return;
        }

        // Get user orders
        if (pathname.match(/^\/api\/orders\/user\/[\w-]+$/) && method === 'GET') {
            const userId = pathname.split('/').pop();
            const orders = dataStore.orders.filter(o => o.userId === userId);
            sendJson(res, 200, { success: true, data: orders });
            return;
        }

        // Genres
        if (pathname === '/api/genres' && method === 'GET') {
            const genres = [
                { id: 'fiction', name: 'Фантастика', description: 'Научная фантастика и фэнтези' },
                { id: 'romance', name: 'Романы', description: 'Любовные романы и драмы' },
                { id: 'detective', name: 'Детективы', description: 'Криминальные истории и расследования' },
                { id: 'adventure', name: 'Приключения', description: 'Захватывающие приключенческие истории' },
                { id: 'educational', name: 'Учебные материалы', description: 'Учебники и образовательная литература' }
            ];
            sendJson(res, 200, { success: true, data: genres });
            return;
        }

        sendJson(res, 404, { success: false, error: 'API endpoint not found' });

    } catch (error) {
        console.error('API Error:', error);
        sendJson(res, 500, { success: false, error: 'Internal server error' });
    }
}

// Serve static files
function serveStatic(req, res) {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Remove query string
    filePath = filePath.split('?')[0];
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Try to serve index.html for SPA routing
                fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, content2) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('File not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(content2);
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Create server
const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.url.startsWith('/api/')) {
        await handleApi(req, res);
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`BookStore server running at http://localhost:${PORT}`);
    console.log(`Public directory: ${PUBLIC_DIR}`);
});
