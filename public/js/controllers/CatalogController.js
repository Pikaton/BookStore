/**
 * CatalogController
 * Handles catalog page UI interactions
 * Minimal logic - delegates to Book model and ApiService
 * 
 * @class CatalogController
 * @extends BaseController
 */
class CatalogController extends BaseController {
    constructor() {
        super();
        this.books = [];
        this.filteredBooks = [];
        this.currentFilters = {
            genres: [],
            minPrice: null,
            maxPrice: null,
            sortBy: 'title'
        };
    }

    /**
     * Initialize catalog controller
     */
    init() {
        super.init();
        this.bindEvents();
        this.parseUrlParams();
    }

    /**
     * Bind UI events
     */
    bindEvents() {
        this.addEvent('apply-filters', 'click', () => this.handleApplyFilters());
        this.addEvent('reset-filters', 'click', () => this.handleResetFilters());
        this.addEvent('sort-select', 'change', (e) => this.handleSortChange(e));
    }

    /**
     * Parse URL parameters for initial filters
     */
    parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const genre = params.get('genre');
        if (genre) {
            this.currentFilters.genres = [genre];
            this.setGenreCheckbox(genre, true);
            this.updatePageTitle(genre);
        }
    }

    /**
     * Set genre checkbox state
     * @param {string} genre - Genre value
     * @param {boolean} checked - Checked state
     */
    setGenreCheckbox(genre, checked) {
        const checkbox = document.querySelector(`input[name="genre"][value="${genre}"]`);
        if (checkbox) checkbox.checked = checked;
    }

    /**
     * Update page title based on genre
     * @param {string} genre - Genre value
     */
    updatePageTitle(genre) {
        const label = Book.GENRE_LABELS[genre];
        if (label) {
            this.setText('page-title', label);
            this.setText('breadcrumb-current', label);
        }
    }

    /**
     * Load books from API
     * @param {Function} onComplete - Callback when complete
     */
    loadBooks(onComplete) {
        this.showLoading('books-grid');
        
        ApiService.getBooks()
            .then(data => {
                this.books = Book.fromArray(data);
                this.applyFilters();
                if (onComplete) onComplete();
            })
            .catch(error => {
                this.showAlert('books-grid', 'Ошибка загрузки книг', 'error');
            });
    }

    /**
     * Load new arrivals for home page
     * @param {string} containerId - Container element ID
     */
    loadNewArrivals(containerId) {
        this.showLoading(containerId);
        
        ApiService.getBooks()
            .then(data => {
                const books = Book.fromArray(data);
                const newBooks = Book.getNewArrivals(books).slice(0, 4);
                this.renderBooksGrid(containerId, newBooks);
            })
            .catch(() => {
                this.setHtml(containerId, '<p>Ошибка загрузки</p>');
            });
    }

    /**
     * Load popular books for home page
     * @param {string} containerId - Container element ID
     */
    loadPopularBooks(containerId) {
        this.showLoading(containerId);
        
        ApiService.getBooks()
            .then(data => {
                const books = Book.fromArray(data);
                const popular = Book.getPopularBooks(books).slice(0, 4);
                this.renderBooksGrid(containerId, popular);
            })
            .catch(() => {
                this.setHtml(containerId, '<p>Ошибка загрузки</p>');
            });
    }

    /**
     * Handle apply filters button click
     */
    handleApplyFilters() {
        this.collectFilters();
        this.applyFilters();
    }

    /**
     * Handle reset filters button click
     */
    handleResetFilters() {
        this.currentFilters = {
            genres: [],
            minPrice: null,
            maxPrice: null,
            sortBy: 'title'
        };
        this.resetFilterInputs();
        this.applyFilters();
    }

    /**
     * Handle sort select change
     * @param {Event} e - Change event
     */
    handleSortChange(e) {
        this.currentFilters.sortBy = e.target.value;
        this.applyFilters();
    }

    /**
     * Collect filter values from UI
     */
    collectFilters() {
        // Collect genres
        const genreCheckboxes = this.getElements('input[name="genre"]:checked');
        this.currentFilters.genres = Array.from(genreCheckboxes).map(cb => cb.value);

        // Collect price range
        const minPrice = this.getElement('price-min');
        const maxPrice = this.getElement('price-max');
        this.currentFilters.minPrice = minPrice?.value ? parseInt(minPrice.value) : null;
        this.currentFilters.maxPrice = maxPrice?.value ? parseInt(maxPrice.value) : null;

        // Collect sort
        const sortSelect = this.getElement('sort-select');
        this.currentFilters.sortBy = sortSelect?.value || 'title';
    }

    /**
     * Reset filter inputs to default
     */
    resetFilterInputs() {
        const checkboxes = this.getElements('input[name="genre"]');
        checkboxes.forEach(cb => cb.checked = false);

        const minPrice = this.getElement('price-min');
        const maxPrice = this.getElement('price-max');
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';

        const sortSelect = this.getElement('sort-select');
        if (sortSelect) sortSelect.value = 'title';
    }

    /**
     * Apply filters and render books
     */
    applyFilters() {
        let filtered = [...this.books];

        // Apply genre filter
        filtered = Book.filterByGenres(filtered, this.currentFilters.genres);

        // Apply price filter
        filtered = Book.filterByPriceRange(
            filtered, 
            this.currentFilters.minPrice, 
            this.currentFilters.maxPrice
        );

        // Apply sorting
        filtered = Book.sortBooks(filtered, this.currentFilters.sortBy);

        this.filteredBooks = filtered;
        this.renderBooksGrid('books-grid', filtered);
        this.renderResultsInfo(filtered.length);
    }

    /**
     * Render results count info
     * @param {number} count - Results count
     */
    renderResultsInfo(count) {
        const text = this.getResultsText(count);
        this.setText('results-info', text);
    }

    /**
     * Get results text with correct plural form
     * @param {number} count - Count
     * @returns {string} Results text
     */
    getResultsText(count) {
        const lastTwo = count % 100;
        const lastOne = count % 10;
        
        let word = 'книг';
        if (lastTwo >= 11 && lastTwo <= 14) {
            word = 'книг';
        } else if (lastOne === 1) {
            word = 'книга';
        } else if (lastOne >= 2 && lastOne <= 4) {
            word = 'книги';
        }
        
        return `Найдено: ${count} ${word}`;
    }

    /**
     * Render books grid
     * @param {string} containerId - Container ID
     * @param {Array<Book>} books - Books to render
     */
    renderBooksGrid(containerId, books) {
        if (books.length === 0) {
            this.setHtml(containerId, this.getEmptyStateHtml());
            return;
        }

        const html = books.map(book => this.getBookCardHtml(book)).join('');
        this.setHtml(containerId, html);
        this.bindCardEvents();
    }

    /**
     * Get empty state HTML
     * @returns {string} HTML
     */
    getEmptyStateHtml() {
        return `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state__icon">📚</div>
                <h3 class="empty-state__title">Книги не найдены</h3>
                <p class="empty-state__text">Попробуйте изменить параметры фильтра</p>
            </div>
        `;
    }

    /**
     * Get book card HTML
     * @param {Book} book - Book instance
     * @returns {string} HTML
     */
    getBookCardHtml(book) {
        return `
            <div class="card" data-book-id="${book.id}">
                <img src="${book.image}" alt="${book.title}" class="card__image">
                <div class="card__body">
                    <span class="card__genre">${book.getGenreLabel()}</span>
                    <h3 class="card__title">${book.title}</h3>
                    <p class="card__author">${book.author}</p>
                    <p class="card__price">${book.getFormattedPrice()}</p>
                    <div class="card__actions">
                        <button class="btn btn--primary btn--small add-to-cart-btn" data-book-id="${book.id}">
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Bind card action events
     */
    bindCardEvents() {
        this.addEventToAll('.add-to-cart-btn', 'click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            this.handleAddToCart(bookId);
        });
    }

    /**
     * Handle add to cart button click
     * @param {number} bookId - Book ID
     */
    handleAddToCart(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            App.cartController.addToCart(book);
        }
    }
}
