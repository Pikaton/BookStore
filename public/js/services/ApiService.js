/**
 * ApiService
 * Handles all AJAX communication with the server
 * Uses XMLHttpRequest for AJAX calls
 * 
 * @class ApiService
 */
class ApiService {
    /**
     * Base API URL
     * @static
     */
    static BASE_URL = '/api';

    /**
     * Make AJAX request
     * @static
     * @param {string} method - HTTP method
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @returns {Promise} Promise with response data
     */
    static request(method, url, data = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, `${this.BASE_URL}${url}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            resolve(xhr.responseText);
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            reject(new Error(error.message || 'Ошибка сервера'));
                        } catch (e) {
                            reject(new Error('Ошибка сервера'));
                        }
                    }
                }
            };

            xhr.onerror = function() {
                reject(new Error('Ошибка сети'));
            };

            xhr.ontimeout = function() {
                reject(new Error('Превышено время ожидания'));
            };

            xhr.timeout = 30000; // 30 seconds

            if (data) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    }

    /**
     * GET request
     * @static
     * @param {string} url - Request URL
     * @returns {Promise} Promise with response
     */
    static get(url) {
        return this.request('GET', url);
    }

    /**
     * POST request
     * @static
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @returns {Promise} Promise with response
     */
    static post(url, data) {
        return this.request('POST', url, data);
    }

    /**
     * PUT request
     * @static
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @returns {Promise} Promise with response
     */
    static put(url, data) {
        return this.request('PUT', url, data);
    }

    /**
     * DELETE request
     * @static
     * @param {string} url - Request URL
     * @returns {Promise} Promise with response
     */
    static delete(url) {
        return this.request('DELETE', url);
    }

    // ==========================================
    // BOOKS API
    // ==========================================

    /**
     * Get all books
     * @static
     * @returns {Promise<Array>} Promise with books array
     */
    static getBooks() {
        // For demo - return mock data
        // In production: return this.get('/books');
        return Promise.resolve(this.getMockBooks());
    }

    /**
     * Get book by ID
     * @static
     * @param {number} id - Book ID
     * @returns {Promise<Object>} Promise with book data
     */
    static getBook(id) {
        // For demo - return mock data
        // In production: return this.get(`/books/${id}`);
        const book = this.getMockBooks().find(b => b.id === id);
        return book ? Promise.resolve(book) : Promise.reject(new Error('Книга не найдена'));
    }

    /**
     * Get books by genre
     * @static
     * @param {string} genre - Genre filter
     * @returns {Promise<Array>} Promise with filtered books
     */
    static getBooksByGenre(genre) {
        // For demo - return mock data
        // In production: return this.get(`/books?genre=${genre}`);
        const books = this.getMockBooks().filter(b => b.genre === genre);
        return Promise.resolve(books);
    }

    // ==========================================
    // USER API
    // ==========================================

    /**
     * Login user
     * @static
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Promise with user data
     */
    static login(email, password) {
        // For demo - simulate login
        // In production: return this.post('/auth/login', { email, password });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check mock users
                const users = StorageService.getUsers();
                const user = users.find(u => u.email === email);
                
                if (user && user.password === password) {
                    resolve({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    });
                } else {
                    reject(new Error('Неверный email или пароль'));
                }
            }, 500);
        });
    }

    /**
     * Register user
     * @static
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Promise with created user
     */
    static register(userData) {
        // For demo - simulate registration
        // In production: return this.post('/auth/register', userData);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = StorageService.getUsers();
                
                // Check if email exists
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('Пользователь с таким email уже существует'));
                    return;
                }

                const newUser = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                StorageService.saveUsers(users);

                resolve({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone
                });
            }, 500);
        });
    }

    // ==========================================
    // ORDER API
    // ==========================================

    /**
     * Create order
     * @static
     * @param {Object} orderData - Order data
     * @returns {Promise<Object>} Promise with created order
     */
    static createOrder(orderData) {
        // For demo - simulate order creation
        // In production: return this.post('/orders', orderData);
        return new Promise((resolve) => {
            setTimeout(() => {
                const order = new Order(orderData);
                
                // Save to local storage for demo
                const orders = StorageService.getOrders();
                orders.push(order.toObject());
                StorageService.saveOrders(orders);

                resolve({
                    id: order.id,
                    status: order.status,
                    total: order.total
                });
            }, 1000);
        });
    }

    /**
     * Get user orders
     * @static
     * @param {number} userId - User ID
     * @returns {Promise<Array>} Promise with orders array
     */
    static getUserOrders(userId) {
        // For demo - return from local storage
        // In production: return this.get(`/users/${userId}/orders`);
        const orders = StorageService.getOrders().filter(o => o.userId === userId);
        return Promise.resolve(orders);
    }

    // ==========================================
    // MOCK DATA
    // ==========================================

    /**
     * Get mock books data
     * @static
     * @returns {Array} Mock books array
     */
    static getMockBooks() {
        return [
            // Fantasy
            {
                id: 1,
                title: 'Властелин колец',
                author: 'Дж. Р. Р. Толкин',
                genre: 'fantasy',
                price: 890,
                description: 'Эпическая история о борьбе добра и зла в мире Средиземья.',
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
                year: 1954,
                pages: 1216,
                isNew: false,
                isPopular: true
            },
            {
                id: 2,
                title: 'Гарри Поттер и философский камень',
                author: 'Дж. К. Роулинг',
                genre: 'fantasy',
                price: 650,
                description: 'Первая книга о мальчике-волшебнике.',
                image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400',
                year: 1997,
                pages: 309,
                isNew: false,
                isPopular: true
            },
            {
                id: 3,
                title: 'Игра престолов',
                author: 'Джордж Мартин',
                genre: 'fantasy',
                price: 750,
                description: 'Первая книга цикла "Песнь льда и пламени".',
                image: 'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=400',
                year: 1996,
                pages: 694,
                isNew: true,
                isPopular: true
            },
            // Romance
            {
                id: 4,
                title: 'Гордость и предубеждение',
                author: 'Джейн Остин',
                genre: 'romance',
                price: 450,
                description: 'Классический роман о любви и общественных нравах.',
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                year: 1813,
                pages: 432,
                isNew: false,
                isPopular: true
            },
            {
                id: 5,
                title: 'Унесённые ветром',
                author: 'Маргарет Митчелл',
                genre: 'romance',
                price: 580,
                description: 'История любви на фоне Гражданской войны в США.',
                image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
                year: 1936,
                pages: 1037,
                isNew: false,
                isPopular: false
            },
            {
                id: 6,
                title: 'Анна Каренина',
                author: 'Лев Толстой',
                genre: 'romance',
                price: 520,
                description: 'Величайший роман о любви и обществе.',
                image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
                year: 1877,
                pages: 864,
                isNew: true,
                isPopular: true
            },
            // Detective
            {
                id: 7,
                title: 'Убийство в Восточном экспрессе',
                author: 'Агата Кристи',
                genre: 'detective',
                price: 420,
                description: 'Знаменитый детектив с Эркюлем Пуаро.',
                image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
                year: 1934,
                pages: 256,
                isNew: true,
                isPopular: true
            },
            {
                id: 8,
                title: 'Шерлок Холмс. Полное собрание',
                author: 'Артур Конан Дойл',
                genre: 'detective',
                price: 990,
                description: 'Все рассказы о великом сыщике.',
                image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
                year: 1927,
                pages: 1056,
                isNew: false,
                isPopular: true
            },
            {
                id: 9,
                title: 'Девушка с татуировкой дракона',
                author: 'Стиг Ларссон',
                genre: 'detective',
                price: 550,
                description: 'Современный скандинавский детектив.',
                image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400',
                year: 2005,
                pages: 465,
                isNew: true,
                isPopular: false
            },
            // Adventure
            {
                id: 10,
                title: 'Остров сокровищ',
                author: 'Роберт Стивенсон',
                genre: 'adventure',
                price: 380,
                description: 'Классическая история о пиратах и сокровищах.',
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
                year: 1883,
                pages: 292,
                isNew: false,
                isPopular: true
            },
            {
                id: 11,
                title: 'Робинзон Крузо',
                author: 'Даниэль Дефо',
                genre: 'adventure',
                price: 350,
                description: 'История выживания на необитаемом острове.',
                image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                year: 1719,
                pages: 320,
                isNew: false,
                isPopular: false
            },
            {
                id: 12,
                title: 'Вокруг света за 80 дней',
                author: 'Жюль Верн',
                genre: 'adventure',
                price: 420,
                description: 'Захватывающее кругосветное путешествие.',
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
                year: 1872,
                pages: 312,
                isNew: true,
                isPopular: true
            },
            // Educational
            {
                id: 13,
                title: 'Краткая история времени',
                author: 'Стивен Хокинг',
                genre: 'educational',
                price: 680,
                description: 'Популярное введение в космологию.',
                image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
                year: 1988,
                pages: 256,
                isNew: true,
                isPopular: true
            },
            {
                id: 14,
                title: 'Sapiens. Краткая история человечества',
                author: 'Юваль Харари',
                genre: 'educational',
                price: 720,
                description: 'История развития человеческой цивилизации.',
                image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400',
                year: 2011,
                pages: 512,
                isNew: true,
                isPopular: true
            },
            {
                id: 15,
                title: 'Искусство программирования',
                author: 'Дональд Кнут',
                genre: 'educational',
                price: 2500,
                description: 'Фундаментальный труд по алгоритмам.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                year: 1968,
                pages: 672,
                isNew: false,
                isPopular: false
            },
            {
                id: 16,
                title: 'Психология влияния',
                author: 'Роберт Чалдини',
                genre: 'educational',
                price: 590,
                description: 'Классика о методах убеждения.',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                year: 1984,
                pages: 336,
                isNew: false,
                isPopular: true
            }
        ];
    }
}
