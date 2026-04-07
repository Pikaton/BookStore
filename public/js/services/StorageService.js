/**
 * StorageService
 * Handles local storage operations
 * Provides abstraction over localStorage for data persistence
 * 
 * @class StorageService
 */
class StorageService {
    /**
     * Storage keys
     * @static
     */
    static KEYS = {
        CART: 'bookstore_cart',
        USER: 'bookstore_user',
        USERS: 'bookstore_users',
        ORDERS: 'bookstore_orders'
    };

    // ==========================================
    // GENERIC METHODS
    // ==========================================

    /**
     * Get item from storage
     * @static
     * @param {string} key - Storage key
     * @returns {any} Stored value or null
     */
    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('StorageService.getItem error:', e);
            return null;
        }
    }

    /**
     * Set item in storage
     * @static
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     */
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('StorageService.setItem error:', e);
        }
    }

    /**
     * Remove item from storage
     * @static
     * @param {string} key - Storage key
     */
    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('StorageService.removeItem error:', e);
        }
    }

    /**
     * Clear all storage
     * @static
     */
    static clear() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (e) {
            console.error('StorageService.clear error:', e);
        }
    }

    // ==========================================
    // CART METHODS
    // ==========================================

    /**
     * Get cart from storage
     * @static
     * @returns {Object|null} Cart data
     */
    static getCart() {
        return this.getItem(this.KEYS.CART);
    }

    /**
     * Save cart to storage
     * @static
     * @param {Object} cart - Cart data
     */
    static saveCart(cart) {
        this.setItem(this.KEYS.CART, cart);
    }

    /**
     * Clear cart from storage
     * @static
     */
    static clearCart() {
        this.removeItem(this.KEYS.CART);
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    /**
     * Get current user from storage
     * @static
     * @returns {Object|null} User data
     */
    static getUser() {
        return this.getItem(this.KEYS.USER);
    }

    /**
     * Save current user to storage
     * @static
     * @param {Object} user - User data
     */
    static saveUser(user) {
        this.setItem(this.KEYS.USER, user);
    }

    /**
     * Remove current user from storage
     * @static
     */
    static removeUser() {
        this.removeItem(this.KEYS.USER);
    }

    /**
     * Get all registered users (for demo auth)
     * @static
     * @returns {Array} Users array
     */
    static getUsers() {
        return this.getItem(this.KEYS.USERS) || [];
    }

    /**
     * Save users list (for demo auth)
     * @static
     * @param {Array} users - Users array
     */
    static saveUsers(users) {
        this.setItem(this.KEYS.USERS, users);
    }

    // ==========================================
    // ORDER METHODS
    // ==========================================

    /**
     * Get orders from storage
     * @static
     * @returns {Array} Orders array
     */
    static getOrders() {
        return this.getItem(this.KEYS.ORDERS) || [];
    }

    /**
     * Save orders to storage
     * @static
     * @param {Array} orders - Orders array
     */
    static saveOrders(orders) {
        this.setItem(this.KEYS.ORDERS, orders);
    }

    /**
     * Add order to storage
     * @static
     * @param {Object} order - Order data
     */
    static addOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        this.saveOrders(orders);
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * Check if storage is available
     * @static
     * @returns {boolean} Is available
     */
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get storage size in bytes
     * @static
     * @returns {number} Size in bytes
     */
    static getSize() {
        let size = 0;
        Object.values(this.KEYS).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                size += item.length * 2; // UTF-16
            }
        });
        return size;
    }
}
