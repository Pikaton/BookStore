/**
 * Book Model
 * Represents a book entity in the bookstore application
 * 
 * @class Book
 */
class Book {
    /**
     * Genre constants
     * @static
     */
    static GENRES = {
        FANTASY: 'fantasy',
        ROMANCE: 'romance',
        DETECTIVE: 'detective',
        ADVENTURE: 'adventure',
        EDUCATIONAL: 'educational'
    };

    /**
     * Genre labels for display
     * @static
     */
    static GENRE_LABELS = {
        fantasy: 'Фантастика',
        romance: 'Романы',
        detective: 'Детективы',
        adventure: 'Приключения',
        educational: 'Учебные материалы'
    };

    /**
     * Creates a new Book instance
     * @param {Object} data - Book data
     * @param {number} data.id - Unique identifier
     * @param {string} data.title - Book title
     * @param {string} data.author - Author name
     * @param {string} data.genre - Book genre
     * @param {number} data.price - Price in rubles
     * @param {string} data.description - Book description
     * @param {string} data.image - Image URL
     * @param {string} data.isbn - ISBN number
     * @param {number} data.year - Publication year
     * @param {number} data.pages - Number of pages
     * @param {boolean} data.isNew - Is new arrival
     * @param {boolean} data.isPopular - Is popular/bestseller
     */
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.author = data.author;
        this.genre = data.genre;
        this.price = data.price;
        this.description = data.description || '';
        this.image = data.image || 'images/book-placeholder.jpg';
        this.isbn = data.isbn || '';
        this.year = data.year || new Date().getFullYear();
        this.pages = data.pages || 0;
        this.isNew = data.isNew || false;
        this.isPopular = data.isPopular || false;
    }

    /**
     * Get formatted price string
     * @returns {string} Formatted price
     */
    getFormattedPrice() {
        return `${this.price.toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get genre label for display
     * @returns {string} Genre label in Russian
     */
    getGenreLabel() {
        return Book.GENRE_LABELS[this.genre] || this.genre;
    }

    /**
     * Validate book data
     * @returns {boolean} Is valid
     */
    isValid() {
        return !!(this.id && this.title && this.author && this.genre && this.price > 0);
    }

    /**
     * Convert book to plain object
     * @returns {Object} Plain object representation
     */
    toObject() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            genre: this.genre,
            price: this.price,
            description: this.description,
            image: this.image,
            isbn: this.isbn,
            year: this.year,
            pages: this.pages,
            isNew: this.isNew,
            isPopular: this.isPopular
        };
    }

    /**
     * Create Book instance from plain object
     * @static
     * @param {Object} obj - Plain object
     * @returns {Book} Book instance
     */
    static fromObject(obj) {
        return new Book(obj);
    }

    /**
     * Create array of Book instances from array of objects
     * @static
     * @param {Array} arr - Array of plain objects
     * @returns {Array<Book>} Array of Book instances
     */
    static fromArray(arr) {
        return arr.map(obj => Book.fromObject(obj));
    }

    /**
     * Filter books by genre
     * @static
     * @param {Array<Book>} books - Array of books
     * @param {string} genre - Genre to filter by
     * @returns {Array<Book>} Filtered books
     */
    static filterByGenre(books, genre) {
        if (!genre) return books;
        return books.filter(book => book.genre === genre);
    }

    /**
     * Filter books by multiple genres
     * @static
     * @param {Array<Book>} books - Array of books
     * @param {Array<string>} genres - Genres to filter by
     * @returns {Array<Book>} Filtered books
     */
    static filterByGenres(books, genres) {
        if (!genres || genres.length === 0) return books;
        return books.filter(book => genres.includes(book.genre));
    }

    /**
     * Filter books by price range
     * @static
     * @param {Array<Book>} books - Array of books
     * @param {number} minPrice - Minimum price
     * @param {number} maxPrice - Maximum price
     * @returns {Array<Book>} Filtered books
     */
    static filterByPriceRange(books, minPrice, maxPrice) {
        return books.filter(book => {
            const meetsMin = !minPrice || book.price >= minPrice;
            const meetsMax = !maxPrice || book.price <= maxPrice;
            return meetsMin && meetsMax;
        });
    }

    /**
     * Sort books by specified criteria
     * @static
     * @param {Array<Book>} books - Array of books
     * @param {string} sortBy - Sort criteria (title, price-asc, price-desc, newest)
     * @returns {Array<Book>} Sorted books
     */
    static sortBooks(books, sortBy) {
        const sorted = [...books];
        switch (sortBy) {
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
                break;
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sorted.sort((a, b) => b.year - a.year);
                break;
            default:
                break;
        }
        return sorted;
    }

    /**
     * Search books by query
     * @static
     * @param {Array<Book>} books - Array of books
     * @param {string} query - Search query
     * @returns {Array<Book>} Matching books
     */
    static searchBooks(books, query) {
        if (!query) return books;
        const lowerQuery = query.toLowerCase();
        return books.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get new arrivals
     * @static
     * @param {Array<Book>} books - Array of books
     * @returns {Array<Book>} New arrival books
     */
    static getNewArrivals(books) {
        return books.filter(book => book.isNew);
    }

    /**
     * Get popular/bestseller books
     * @static
     * @param {Array<Book>} books - Array of books
     * @returns {Array<Book>} Popular books
     */
    static getPopularBooks(books) {
        return books.filter(book => book.isPopular);
    }
}
