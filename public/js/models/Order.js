/**
 * Order Model
 * Represents an order in the bookstore application
 * 
 * @class Order
 */
class Order {
    /**
     * Order status constants
     * @static
     */
    static STATUS = {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    };

    /**
     * Status labels for display
     * @static
     */
    static STATUS_LABELS = {
        pending: 'Ожидает подтверждения',
        confirmed: 'Подтверждён',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменён'
    };

    /**
     * Delivery method constants
     * @static
     */
    static DELIVERY_METHODS = {
        COURIER: 'courier',
        PICKUP: 'pickup',
        POST: 'post'
    };

    /**
     * Delivery method labels
     * @static
     */
    static DELIVERY_LABELS = {
        courier: 'Курьер',
        pickup: 'Самовывоз',
        post: 'Почта России'
    };

    /**
     * Delivery prices
     * @static
     */
    static DELIVERY_PRICES = {
        courier: 300,
        pickup: 0,
        post: 250
    };

    /**
     * Payment method constants
     * @static
     */
    static PAYMENT_METHODS = {
        CARD: 'card',
        CASH: 'cash',
        SBP: 'sbp'
    };

    /**
     * Payment method labels
     * @static
     */
    static PAYMENT_LABELS = {
        card: 'Банковская карта',
        cash: 'Наличными при получении',
        sbp: 'СБП'
    };

    /**
     * Creates a new Order instance
     * @param {Object} data - Order data
     */
    constructor(data) {
        this.id = data.id || Order.generateOrderId();
        this.userId = data.userId || null;
        this.items = data.items || [];
        this.status = data.status || Order.STATUS.PENDING;
        
        // Customer info
        this.customer = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || ''
        };

        // Delivery info
        this.delivery = {
            method: data.deliveryMethod || Order.DELIVERY_METHODS.COURIER,
            city: data.city || '',
            address: data.address || '',
            price: data.deliveryPrice || 0
        };

        // Payment info
        this.payment = {
            method: data.paymentMethod || Order.PAYMENT_METHODS.CARD,
            status: data.paymentStatus || 'pending'
        };

        // Totals
        this.subtotal = data.subtotal || 0;
        this.discount = data.discount || 0;
        this.total = data.total || 0;

        // Additional info
        this.comment = data.comment || '';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    }

    /**
     * Generate unique order ID
     * @static
     * @returns {string} Order ID
     */
    static generateOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    /**
     * Get full customer name
     * @returns {string} Full name
     */
    getCustomerName() {
        return `${this.customer.firstName} ${this.customer.lastName}`.trim();
    }

    /**
     * Get status label
     * @returns {string} Status label
     */
    getStatusLabel() {
        return Order.STATUS_LABELS[this.status] || this.status;
    }

    /**
     * Get delivery method label
     * @returns {string} Delivery label
     */
    getDeliveryLabel() {
        return Order.DELIVERY_LABELS[this.delivery.method] || this.delivery.method;
    }

    /**
     * Get payment method label
     * @returns {string} Payment label
     */
    getPaymentLabel() {
        return Order.PAYMENT_LABELS[this.payment.method] || this.payment.method;
    }

    /**
     * Get formatted subtotal
     * @returns {string} Formatted subtotal
     */
    getFormattedSubtotal() {
        return `${this.subtotal.toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get formatted delivery price
     * @returns {string} Formatted delivery price
     */
    getFormattedDeliveryPrice() {
        if (this.delivery.price === 0) {
            return 'Бесплатно';
        }
        return `${this.delivery.price.toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get formatted total
     * @returns {string} Formatted total
     */
    getFormattedTotal() {
        return `${this.total.toLocaleString('ru-RU')} руб.`;
    }

    /**
     * Get formatted date
     * @returns {string} Formatted date
     */
    getFormattedDate() {
        return this.createdAt.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Get items count
     * @returns {number} Total items count
     */
    getItemsCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Calculate delivery price based on method
     * @param {string} method - Delivery method
     * @returns {number} Delivery price
     */
    static getDeliveryPrice(method) {
        return Order.DELIVERY_PRICES[method] || 0;
    }

    /**
     * Convert to plain object
     * @returns {Object} Plain object
     */
    toObject() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            status: this.status,
            customer: this.customer,
            delivery: this.delivery,
            payment: this.payment,
            subtotal: this.subtotal,
            discount: this.discount,
            total: this.total,
            comment: this.comment,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }

    /**
     * Create Order from plain object
     * @static
     * @param {Object} obj - Plain object
     * @returns {Order} Order instance
     */
    static fromObject(obj) {
        return new Order({
            id: obj.id,
            userId: obj.userId,
            items: obj.items,
            status: obj.status,
            firstName: obj.customer?.firstName,
            lastName: obj.customer?.lastName,
            email: obj.customer?.email,
            phone: obj.customer?.phone,
            deliveryMethod: obj.delivery?.method,
            city: obj.delivery?.city,
            address: obj.delivery?.address,
            deliveryPrice: obj.delivery?.price,
            paymentMethod: obj.payment?.method,
            paymentStatus: obj.payment?.status,
            subtotal: obj.subtotal,
            discount: obj.discount,
            total: obj.total,
            comment: obj.comment,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        });
    }
}

/**
 * OrderForm - Data Transfer Object for order creation
 */
class OrderForm {
    /**
     * Creates new OrderForm instance
     * @param {Object} data - Form data
     */
    constructor(data) {
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.deliveryMethod = data.deliveryMethod || '';
        this.city = data.city || '';
        this.address = data.address || '';
        this.paymentMethod = data.paymentMethod || '';
        this.comment = data.comment || '';
    }

    /**
     * Validate form data
     * @returns {Object} Validation result
     */
    validate() {
        const errors = {};

        if (!this.firstName || this.firstName.trim().length < 2) {
            errors.firstName = 'Введите имя (минимум 2 символа)';
        }

        if (!this.lastName || this.lastName.trim().length < 2) {
            errors.lastName = 'Введите фамилию (минимум 2 символа)';
        }

        if (!this.email || !User.isValidEmail(this.email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (!this.phone || !User.isValidPhone(this.phone)) {
            errors.phone = 'Введите корректный номер телефона';
        }

        if (!this.deliveryMethod) {
            errors.deliveryMethod = 'Выберите способ доставки';
        }

        if (!this.city || this.city.trim().length < 2) {
            errors.city = 'Введите город';
        }

        if (this.deliveryMethod !== 'pickup' && (!this.address || this.address.trim().length < 5)) {
            errors.address = 'Введите адрес доставки';
        }

        if (!this.paymentMethod) {
            errors.paymentMethod = 'Выберите способ оплаты';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Convert to order data
     * @param {Cart} cart - Cart instance
     * @param {number|null} userId - User ID
     * @returns {Object} Order data
     */
    toOrderData(cart, userId = null) {
        const deliveryPrice = Order.getDeliveryPrice(this.deliveryMethod);
        const subtotal = cart.getTotal();
        
        return {
            userId,
            items: cart.items.map(item => item.toObject()),
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            deliveryMethod: this.deliveryMethod,
            city: this.city,
            address: this.address,
            deliveryPrice,
            paymentMethod: this.paymentMethod,
            subtotal,
            discount: cart.getDiscountAmount(),
            total: subtotal + deliveryPrice,
            comment: this.comment
        };
    }
}
