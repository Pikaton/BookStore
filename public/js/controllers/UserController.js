/**
 * UserController
 * Handles user authentication UI interactions
 * Minimal logic - delegates to User model and ApiService
 * 
 * @class UserController
 * @extends BaseController
 */
class UserController extends BaseController {
    constructor() {
        super();
        this.currentUser = null;
    }

    /**
     * Initialize user controller
     */
    init() {
        super.init();
        this.loadCurrentUser();
        this.updateAuthUI();
    }

    /**
     * Load current user from storage
     */
    loadCurrentUser() {
        const userData = StorageService.getUser();
        if (userData) {
            this.currentUser = User.fromObject(userData);
        }
    }

    /**
     * Update auth UI in header
     */
    updateAuthUI() {
        const authLink = this.getElement('auth-link');
        if (!authLink) return;

        if (this.currentUser) {
            authLink.textContent = this.currentUser.getDisplayName();
            authLink.href = 'register.html';
        } else {
            authLink.textContent = 'Войти';
            authLink.href = 'register.html';
        }
    }

    /**
     * Initialize auth page
     */
    initAuthPage() {
        this.bindAuthEvents();
        
        if (this.currentUser) {
            this.showProfile();
        } else {
            this.showLogin();
        }
    }

    /**
     * Bind auth page events
     */
    bindAuthEvents() {
        // Toggle forms
        this.addEvent('show-register', 'click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        this.addEvent('show-login', 'click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Form submissions
        this.addEvent('login-form', 'submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.addEvent('register-form', 'submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        this.addEvent('logout-btn', 'click', () => this.handleLogout());
    }

    /**
     * Show login form
     */
    showLogin() {
        this.hideElement('register-form-container');
        this.hideElement('profile-container');
        this.showElement('login-form-container');
    }

    /**
     * Show register form
     */
    showRegister() {
        this.hideElement('login-form-container');
        this.hideElement('profile-container');
        this.showElement('register-form-container');
    }

    /**
     * Show user profile
     */
    showProfile() {
        this.hideElement('login-form-container');
        this.hideElement('register-form-container');
        this.showElement('profile-container');
        this.renderProfile();
    }

    /**
     * Render user profile
     */
    renderProfile() {
        if (!this.currentUser) return;

        this.setText('user-name', this.currentUser.getDisplayName());
        this.setText('user-email', this.currentUser.email);
        this.setText('user-phone', this.currentUser.phone || 'Не указан');
    }

    /**
     * Handle login form submission
     */
    handleLogin() {
        this.clearAllErrors(['login-email', 'login-password']);

        const formData = this.getFormData('login-form');
        const credentials = new UserCredentials(formData.email, formData.password);
        
        const validation = credentials.validate();
        if (!validation.isValid) {
            this.displayErrors(validation.errors, 'login-');
            return;
        }

        this.performLogin(credentials);
    }

    /**
     * Perform login API call
     * @param {UserCredentials} credentials - User credentials
     */
    performLogin(credentials) {
        ApiService.login(credentials.email, credentials.password)
            .then(userData => {
                this.currentUser = User.fromObject(userData);
                StorageService.saveUser(this.currentUser.toSafeObject());
                this.updateAuthUI();
                this.showProfile();
                this.showAlert('login-alerts', 'Вход выполнен успешно!', 'success');
            })
            .catch(error => {
                this.showAlert('login-alerts', error.message || 'Ошибка входа', 'error');
            });
    }

    /**
     * Handle register form submission
     */
    handleRegister() {
        const fieldIds = ['register-name', 'register-email', 'register-phone', 'register-password', 'register-password-confirm'];
        this.clearAllErrors(fieldIds);

        const formData = this.getFormData('register-form');
        const registration = new UserRegistration(formData);
        
        const validation = registration.validate();
        if (!validation.isValid) {
            this.displayErrors(validation.errors, 'register-');
            return;
        }

        this.performRegister(registration);
    }

    /**
     * Perform registration API call
     * @param {UserRegistration} registration - Registration data
     */
    performRegister(registration) {
        ApiService.register(registration.toUserData())
            .then(userData => {
                this.currentUser = User.fromObject(userData);
                StorageService.saveUser(this.currentUser.toSafeObject());
                this.updateAuthUI();
                this.showProfile();
                this.showAlert('register-alerts', 'Регистрация успешна!', 'success');
            })
            .catch(error => {
                this.showAlert('register-alerts', error.message || 'Ошибка регистрации', 'error');
            });
    }

    /**
     * Handle logout
     */
    handleLogout() {
        this.currentUser = null;
        StorageService.removeUser();
        this.updateAuthUI();
        this.showLogin();
    }

    /**
     * Display validation errors
     * @param {Object} errors - Errors object
     * @param {string} prefix - Field ID prefix
     */
    displayErrors(errors, prefix) {
        Object.keys(errors).forEach(field => {
            const fieldId = prefix + this.toKebabCase(field);
            this.showFieldError(fieldId, errors[field]);
        });
    }

    /**
     * Convert camelCase to kebab-case
     * @param {string} str - String to convert
     * @returns {string} Kebab case string
     */
    toKebabCase(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    /**
     * Check if user is logged in
     * @returns {boolean} Is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Get current user
     * @returns {User|null} Current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get current user ID
     * @returns {number|null} User ID
     */
    getCurrentUserId() {
        return this.currentUser?.id || null;
    }
}
