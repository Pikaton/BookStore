/**
 * CartItem Model
 * Represents an item in the shopping cart
 * 
 * @class CartItem
 */
class CartItem {
    /**
     * Creates a new CartItem instance
     * @param {Book} book - Book instance
     * @param {number} quantity - Quantity of books
     */
    constructor(book, quantity = 1) {
        this.book = book;
        this.quantity = quantity;
    }

    /**
     * Get total price for this item
     * @returns {number} Total price
     */
    getTotalPrice() {
        return this.book.price * this.quantity;
    }

    /**
     * Get formatted total price
     * @returns {string} Formatted price
     */
    getFormattedTotalPrice() {
        return `${this.getTotalPrice().toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Increase quantity
     * @param {number} amount - Amount to add
     */
    increaseQuantity(amount = 1) {
        this.quantity += amount;
    }

    /**
     * Decrease quantity
     * @param {number} amount - Amount to subtract
     * @returns {boolean} Whether item should be removed
     */
    decreaseQuantity(amount = 1) {
        this.quantity -= amount;
        return this.quantity <= 0;
    }

    /**
     * Set quantity
     * @param {number} quantity - New quantity
     */
    setQuantity(quantity) {
        this.quantity = Math.max(1, quantity);
    }

    /**
     * Convert to plain object
     * @returns {Object} Plain object
     */
    toObject() {
        return {
            bookId: this.book.id,
            book: this.book.toObject(),
            quantity: this.quantity
        };
    }

    /**
     * Create CartItem from plain object
     * @static
     * @param {Object} obj - Plain object
     * @returns {CartItem} CartItem instance
     */
    static fromObject(obj) {
        const book = Book.fromObject(obj.book);
        return new CartItem(book, obj.quantity);
    }
}

/**
 * Cart Model
 * Represents the shopping cart
 * 
 * @class Cart
 */
class Cart {
    /**
     * Creates a new Cart instance
     */
    constructor() {
        this.items = [];
        this.discount = 0;
        this.discountCode = null;
    }

    /**
     * Add book to cart
     * @param {Book} book - Book to add
     * @param {number} quantity - Quantity to add
     * @returns {CartItem} The cart item
     */
    addItem(book, quantity = 1) {
        const existingItem = this.findItem(book.id);
        
        if (existingItem) {
            existingItem.increaseQuantity(quantity);
            return existingItem;
        } else {
            const newItem = new CartItem(book, quantity);
            this.items.push(newItem);
            return newItem;
        }
    }

    /**
     * Remove item from cart
     * @param {number} bookId - Book ID to remove
     * @returns {boolean} Whether item was removed
     */
    removeItem(bookId) {
        const index = this.items.findIndex(item => item.book.id === bookId);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Update item quantity
     * @param {number} bookId - Book ID
     * @param {number} quantity - New quantity
     * @returns {boolean} Whether update was successful
     */
    updateItemQuantity(bookId, quantity) {
        const item = this.findItem(bookId);
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(bookId);
            }
            item.setQuantity(quantity);
            return true;
        }
        return false;
    }

    /**
     * Increase item quantity
     * @param {number} bookId - Book ID
     * @returns {boolean} Success
     */
    increaseItemQuantity(bookId) {
        const item = this.findItem(bookId);
        if (item) {
            item.increaseQuantity();
            return true;
        }
        return false;
    }

    /**
     * Decrease item quantity
     * @param {number} bookId - Book ID
     * @returns {boolean} Success (false if item was removed)
     */
    decreaseItemQuantity(bookId) {
        const item = this.findItem(bookId);
        if (item) {
            const shouldRemove = item.decreaseQuantity();
            if (shouldRemove) {
                this.removeItem(bookId);
            }
            return !shouldRemove;
        }
        return false;
    }

    /**
     * Find item by book ID
     * @param {number} bookId - Book ID
     * @returns {CartItem|null} Cart item or null
     */
    findItem(bookId) {
        return this.items.find(item => item.book.id === bookId) || null;
    }

    /**
     * Check if book is in cart
     * @param {number} bookId - Book ID
     * @returns {boolean} Is in cart
     */
    hasItem(bookId) {
        return this.findItem(bookId) !== null;
    }

    /**
     * Get total number of items
     * @returns {number} Total items count
     */
    getTotalItemsCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Get unique items count
     * @returns {number} Unique items count
     */
    getUniqueItemsCount() {
        return this.items.length;
    }

    /**
     * Get subtotal (before discount)
     * @returns {number} Subtotal
     */
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
    }

    /**
     * Get discount amount
     * @returns {number} Discount amount
     */
    getDiscountAmount() {
        return Math.round(this.getSubtotal() * (this.discount / 100));
    }

    /**
     * Get total (after discount)
     * @returns {number} Total
     */
    getTotal() {
        return this.getSubtotal() - this.getDiscountAmount();
    }

    /**
     * Get formatted subtotal
     * @returns {string} Formatted subtotal
     */
    getFormattedSubtotal() {
        return `${this.getSubtotal().toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get formatted discount
     * @returns {string} Formatted discount
     */
    getFormattedDiscount() {
        return `${this.getDiscountAmount().toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get formatted total
     * @returns {string} Formatted total
     */
    getFormattedTotal() {
        return `${this.getTotal().toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Apply discount code
     * @param {string} code - Discount code
     * @returns {Object} Result with success and message
     */
    applyDiscountCode(code) {
        const discounts = {
            'SAVE10': 10,
            'SAVE20': 20,
            'BOOK15': 15
        };

        const upperCode = code.toUpperCase();
        if (discounts[upperCode]) {
            this.discount = discounts[upperCode];
            this.discountCode = upperCode;
            return {
                success: true,
                message: `Скидка ${this.discount}% применена`
            };
        }

        return {
            success: false,
            message: 'Недействительный промокод'
        };
    }

    /**
     * Remove discount
     */
    removeDiscount() {
        this.discount = 0;
        this.discountCode = null;
    }

    /**
     * Clear cart
     */
    clear() {
        this.items = [];
        this.discount = 0;
        this.discountCode = null;
    }

    /**
     * Check if cart is empty
     * @returns {boolean} Is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Convert cart to plain object
     * @returns {Object} Plain object
     */
    toObject() {
        return {
            items: this.items.map(item => item.toObject()),
            discount: this.discount,
            discountCode: this.discountCode
        };
    }

    /**
     * Create Cart from plain object
     * @static
     * @param {Object} obj - Plain object
     * @returns {Cart} Cart instance
     */
    static fromObject(obj) {
        const cart = new Cart();
        if (obj.items) {
            cart.items = obj.items.map(item => CartItem.fromObject(item));
        }
        cart.discount = obj.discount || 0;
        cart.discountCode = obj.discountCode || null;
        return cart;
    }

    /**
     * Get cart summary
     * @returns {Object} Cart summary
     */
    getSummary() {
        return {
            itemsCount: this.getTotalItemsCount(),
            uniqueItemsCount: this.getUniqueItemsCount(),
            subtotal: this.getSubtotal(),
            discount: this.getDiscountAmount(),
            discountPercent: this.discount,
            total: this.getTotal(),
            formattedSubtotal: this.getFormattedSubtotal(),
            formattedDiscount: this.getFormattedDiscount(),
            formattedTotal: this.getFormattedTotal()
        };
    }
}
