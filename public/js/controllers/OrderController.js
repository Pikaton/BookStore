/**
 * OrderController
 * Handles checkout page UI interactions
 * Minimal logic - delegates to Order model and ApiService
 * 
 * @class OrderController
 * @extends BaseController
 */
class OrderController extends BaseController {
    constructor() {
        super();
        this.deliveryPrice = 0;
    }

    /**
     * Initialize order controller
     */
    init() {
        super.init();
    }

    /**
     * Initialize checkout page
     */
    initCheckoutPage() {
        this.bindCheckoutEvents();
        this.renderOrderSummary();
        this.prefillUserData();
    }

    /**
     * Bind checkout page events
     */
    bindCheckoutEvents() {
        this.addEvent('checkout-form', 'submit', (e) => {
            e.preventDefault();
            this.handleSubmitOrder();
        });

        this.addEvent('delivery-method', 'change', (e) => {
            this.handleDeliveryChange(e);
        });

        this.addEvent('close-modal', 'click', () => {
            this.hideSuccessModal();
        });
    }

    /**
     * Prefill form with user data if logged in
     */
    prefillUserData() {
        const user = App.userController.getCurrentUser();
        if (!user) return;

        const firstName = this.getElement('first-name');
        const email = this.getElement('email');
        const phone = this.getElement('phone');

        if (firstName && user.name) {
            const nameParts = user.name.split(' ');
            firstName.value = nameParts[0] || '';
            const lastName = this.getElement('last-name');
            if (lastName && nameParts[1]) lastName.value = nameParts[1];
        }
        if (email) email.value = user.email || '';
        if (phone) phone.value = user.phone || '';
    }

    /**
     * Handle delivery method change
     * @param {Event} e - Change event
     */
    handleDeliveryChange(e) {
        const method = e.target.value;
        this.deliveryPrice = Order.getDeliveryPrice(method);
        
        // Show/hide address field for pickup
        const addressGroup = this.getElement('address-group');
        if (addressGroup) {
            if (method === 'pickup') {
                addressGroup.style.display = 'none';
            } else {
                addressGroup.style.display = 'block';
            }
        }

        this.updateOrderTotal();
    }

    /**
     * Render order summary
     */
    renderOrderSummary() {
        const cart = App.cartController.getCart();
        
        // Render items
        const itemsHtml = cart.items.map(item => this.getOrderItemHtml(item)).join('');
        this.setHtml('order-items', itemsHtml);

        // Update totals
        this.setText('checkout-subtotal', cart.getFormattedTotal());
        this.updateOrderTotal();
    }

    /**
     * Get order item HTML
     * @param {CartItem} item - Cart item
     * @returns {string} HTML
     */
    getOrderItemHtml(item) {
        return `
            <div class="summary__row" style="margin-bottom: 10px;">
                <span style="flex: 1;">${item.book.title} x ${item.quantity}</span>
                <span class="summary__value">${item.getFormattedTotalPrice()}</span>
            </div>
        `;
    }

    /**
     * Update order total with delivery
     */
    updateOrderTotal() {
        const cart = App.cartController.getCart();
        const subtotal = cart.getTotal();
        const total = subtotal + this.deliveryPrice;

        const deliveryText = this.deliveryPrice === 0 ? 'Бесплатно' : this.formatPrice(this.deliveryPrice);
        this.setText('checkout-delivery', deliveryText);
        this.setText('checkout-total', this.formatPrice(total));
    }

    /**
     * Handle order submission
     */
    handleSubmitOrder() {
        const fieldIds = ['first-name', 'last-name', 'email', 'phone', 'city', 'address'];
        this.clearAllErrors(fieldIds);

        const formData = this.getFormData('checkout-form');
        const orderForm = new OrderForm(formData);

        const validation = orderForm.validate();
        if (!validation.isValid) {
            this.displayErrors(validation.errors);
            return;
        }

        this.submitOrder(orderForm);
    }

    /**
     * Submit order to API
     * @param {OrderForm} orderForm - Order form data
     */
    submitOrder(orderForm) {
        const cart = App.cartController.getCart();
        const userId = App.userController.getCurrentUserId();
        const orderData = orderForm.toOrderData(cart, userId);

        const submitBtn = this.getElement('submit-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Оформление...';
        }

        ApiService.createOrder(orderData)
            .then(result => {
                this.handleOrderSuccess(result);
            })
            .catch(error => {
                this.handleOrderError(error);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Подтвердить заказ';
                }
            });
    }

    /**
     * Handle successful order
     * @param {Object} result - Order result
     */
    handleOrderSuccess(result) {
        App.cartController.clearCart();
        this.setText('order-number', result.id);
        this.showSuccessModal();
    }

    /**
     * Handle order error
     * @param {Error} error - Error object
     */
    handleOrderError(error) {
        this.showAlert('checkout-alerts', error.message || 'Ошибка оформления заказа', 'error');
    }

    /**
     * Show success modal
     */
    showSuccessModal() {
        const modal = this.getElement('success-modal');
        if (modal) modal.classList.add('modal-overlay--active');
    }

    /**
     * Hide success modal
     */
    hideSuccessModal() {
        const modal = this.getElement('success-modal');
        if (modal) modal.classList.remove('modal-overlay--active');
    }

    /**
     * Display validation errors
     * @param {Object} errors - Errors object
     */
    displayErrors(errors) {
        Object.keys(errors).forEach(field => {
            const fieldId = this.toKebabCase(field);
            this.showFieldError(fieldId, errors[field]);
        });

        // Scroll to first error
        const firstError = Object.keys(errors)[0];
        if (firstError) {
            this.scrollToElement(this.toKebabCase(firstError));
        }
    }

    /**
     * Convert camelCase to kebab-case
     * @param {string} str - String to convert
     * @returns {string} Kebab case string
     */
    toKebabCase(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
}
