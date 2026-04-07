/**
 * BaseController
 * Base class for all controllers with common UI helper methods
 * Controllers contain minimal logic - they delegate to services and models
 * 
 * @class BaseController
 */
class BaseController {
    /**
     * Creates new BaseController instance
     */
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize controller
     */
    init() {
        this.initialized = true;
    }

    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element
     */
    getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Get elements by selector
     * @param {string} selector - CSS selector
     * @returns {NodeList} Elements
     */
    getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Set element text content
     * @param {string} id - Element ID
     * @param {string} text - Text content
     */
    setText(id, text) {
        const element = this.getElement(id);
        if (element) element.textContent = text;
    }

    /**
     * Set element HTML content
     * @param {string} id - Element ID
     * @param {string} html - HTML content
     */
    setHtml(id, html) {
        const element = this.getElement(id);
        if (element) element.innerHTML = html;
    }

    /**
     * Show element
     * @param {string} id - Element ID
     */
    showElement(id) {
        const element = this.getElement(id);
        if (element) element.classList.remove('hidden');
    }

    /**
     * Hide element
     * @param {string} id - Element ID
     */
    hideElement(id) {
        const element = this.getElement(id);
        if (element) element.classList.add('hidden');
    }

    /**
     * Toggle element visibility
     * @param {string} id - Element ID
     * @param {boolean} show - Show or hide
     */
    toggleElement(id, show) {
        show ? this.showElement(id) : this.hideElement(id);
    }

    /**
     * Add event listener
     * @param {string} id - Element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    addEvent(id, event, handler) {
        const element = this.getElement(id);
        if (element) element.addEventListener(event, handler);
    }

    /**
     * Add event listener to multiple elements
     * @param {string} selector - CSS selector
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    addEventToAll(selector, event, handler) {
        const elements = this.getElements(selector);
        elements.forEach(el => el.addEventListener(event, handler));
    }

    /**
     * Show alert message
     * @param {string} containerId - Alert container ID
     * @param {string} message - Message text
     * @param {string} type - Alert type (success, error, info)
     */
    showAlert(containerId, message, type = 'info') {
        const container = this.getElement(containerId);
        if (!container) return;

        const alertHtml = `
            <div class="alert alert--${type}">
                ${message}
            </div>
        `;
        container.innerHTML = alertHtml;

        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    /**
     * Show form error
     * @param {string} fieldId - Field ID
     * @param {string} message - Error message
     */
    showFieldError(fieldId, message) {
        const field = this.getElement(fieldId);
        const errorEl = this.getElement(`${fieldId}-error`);
        
        if (field) field.classList.add('form__input--error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    /**
     * Clear form error
     * @param {string} fieldId - Field ID
     */
    clearFieldError(fieldId) {
        const field = this.getElement(fieldId);
        const errorEl = this.getElement(`${fieldId}-error`);
        
        if (field) field.classList.remove('form__input--error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.add('hidden');
        }
    }

    /**
     * Clear all form errors
     * @param {Array<string>} fieldIds - Array of field IDs
     */
    clearAllErrors(fieldIds) {
        fieldIds.forEach(id => this.clearFieldError(id));
    }

    /**
     * Show loading state
     * @param {string} containerId - Container ID
     */
    showLoading(containerId) {
        this.setHtml(containerId, `
            <div class="loading">
                <div class="loading__spinner"></div>
            </div>
        `);
    }

    /**
     * Get form data as object
     * @param {string} formId - Form ID
     * @returns {Object} Form data
     */
    getFormData(formId) {
        const form = this.getElement(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Reset form
     * @param {string} formId - Form ID
     */
    resetForm(formId) {
        const form = this.getElement(formId);
        if (form) form.reset();
    }

    /**
     * Scroll to element
     * @param {string} id - Element ID
     */
    scrollToElement(id) {
        const element = this.getElement(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Format price for display
     * @param {number} price - Price value
     * @returns {string} Formatted price
     */
    formatPrice(price) {
        return `${price.toLocaleString('ru-RU')} руб.`;
    }
}
