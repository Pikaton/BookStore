/**
 * CartController
 * Handles cart page UI interactions
 * Minimal logic - delegates to Cart model and StorageService
 * 
 * @class CartController
 * @extends BaseController
 */
class CartController extends BaseController {
    constructor() {
        super();
        this.cart = new Cart();
    }

    /**
     * Initialize cart controller
     */
    init() {
        super.init();
        this.loadCart();
        this.updateCartCount();
    }

    /**
     * Load cart from storage
     */
    loadCart() {
        const savedCart = StorageService.getCart();
        if (savedCart) {
            this.cart = Cart.fromObject(savedCart);
        }
    }

    /**
     * Save cart to storage
     */
    saveCart() {
        StorageService.saveCart(this.cart.toObject());
        this.updateCartCount();
    }

    /**
     * Update cart count in header
     */
    updateCartCount() {
        const count = this.cart.getTotalItemsCount();
        const elements = document.querySelectorAll('#cart-count');
        elements.forEach(el => el.textContent = count);
    }

    /**
     * Add book to cart
     * @param {Book} book - Book to add
     */
    addToCart(book) {
        this.cart.addItem(book);
        this.saveCart();
        this.showAddedNotification(book.title);
    }

    /**
     * Remove item from cart
     * @param {number} bookId - Book ID
     */
    removeFromCart(bookId) {
        this.cart.removeItem(bookId);
        this.saveCart();
        this.renderCartPage();
    }

    /**
     * Increase item quantity
     * @param {number} bookId - Book ID
     */
    increaseQuantity(bookId) {
        this.cart.increaseItemQuantity(bookId);
        this.saveCart();
        this.renderCartPage();
    }

    /**
     * Decrease item quantity
     * @param {number} bookId - Book ID
     */
    decreaseQuantity(bookId) {
        this.cart.decreaseItemQuantity(bookId);
        this.saveCart();
        this.renderCartPage();
    }

    /**
     * Show notification when item added
     * @param {string} title - Book title
     */
    showAddedNotification(title) {
        const container = this.getElement('cart-alerts') || document.body;
        const notification = document.createElement('div');
        notification.className = 'alert alert--success';
        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.textContent = `"${title}" добавлена в корзину`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Render cart page
     */
    renderCartPage() {
        if (this.cart.isEmpty()) {
            this.showEmptyCart();
            return;
        }

        this.hideElement('empty-cart');
        this.showElement('cart-content');
        this.renderCartItems();
        this.renderCartSummary();
    }

    /**
     * Show empty cart state
     */
    showEmptyCart() {
        this.hideElement('cart-content');
        this.showElement('empty-cart');
    }

    /**
     * Render cart items list
     */
    renderCartItems() {
        const container = this.getElement('cart-items');
        if (!container) return;

        const html = this.cart.items.map(item => this.getCartItemHtml(item)).join('');
        container.innerHTML = html;
        this.bindCartItemEvents();
    }

    /**
     * Get cart item HTML
     * @param {CartItem} item - Cart item
     * @returns {string} HTML
     */
    getCartItemHtml(item) {
        return `
            <div class="cart-item" data-book-id="${item.book.id}">
                <img src="${item.book.image}" alt="${item.book.title}" class="cart-item__image">
                <div class="cart-item__info">
                    <h3 class="cart-item__title">${item.book.title}</h3>
                    <p class="cart-item__author">${item.book.author}</p>
                    <p class="cart-item__price">${item.book.getFormattedPrice()}</p>
                </div>
                <div class="cart-item__actions">
                    <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn decrease-qty" data-book-id="${item.book.id}">-</button>
                        <span class="cart-item__quantity-value">${item.quantity}</span>
                        <button class="cart-item__quantity-btn increase-qty" data-book-id="${item.book.id}">+</button>
                    </div>
                    <span style="font-weight: 600;">${item.getFormattedTotalPrice()}</span>
                    <button class="cart-item__remove remove-item" data-book-id="${item.book.id}">Удалить</button>
                </div>
            </div>
        `;
    }

    /**
     * Bind cart item events
     */
    bindCartItemEvents() {
        this.addEventToAll('.increase-qty', 'click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            this.increaseQuantity(bookId);
        });

        this.addEventToAll('.decrease-qty', 'click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            this.decreaseQuantity(bookId);
        });

        this.addEventToAll('.remove-item', 'click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            this.removeFromCart(bookId);
        });
    }

    /**
     * Render cart summary
     */
    renderCartSummary() {
        const summary = this.cart.getSummary();
        
        this.setText('summary-count', summary.itemsCount);
        this.setText('summary-subtotal', summary.formattedSubtotal);
        this.setText('summary-discount', summary.formattedDiscount);
        this.setText('summary-total', summary.formattedTotal);
    }

    /**
     * Get cart for checkout
     * @returns {Cart} Cart instance
     */
    getCart() {
        return this.cart;
    }

    /**
     * Clear cart after successful order
     */
    clearCart() {
        this.cart.clear();
        this.saveCart();
    }
}
