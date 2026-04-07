/**
 * User Model
 * Represents a user entity in the bookstore application
 * 
 * @class User
 */
class User {
    /**
     * User roles
     * @static
     */
    static ROLES = {
        CUSTOMER: 'customer',
        ADMIN: 'admin'
    };

    /**
     * Creates a new User instance
     * @param {Object} data - User data
     * @param {number} data.id - Unique identifier
     * @param {string} data.name - User name
     * @param {string} data.email - Email address
     * @param {string} data.phone - Phone number
     * @param {string} data.password - Password (hashed)
     * @param {string} data.role - User role
     * @param {string} data.address - Delivery address
     * @param {Date} data.createdAt - Registration date
     */
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone || '';
        this.password = data.password;
        this.role = data.role || User.ROLES.CUSTOMER;
        this.address = data.address || '';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    /**
     * Get user's display name
     * @returns {string} Display name
     */
    getDisplayName() {
        return this.name || this.email.split('@')[0];
    }

    /**
     * Check if user is admin
     * @returns {boolean} Is admin
     */
    isAdmin() {
        return this.role === User.ROLES.ADMIN;
    }

    /**
     * Validate user data
     * @returns {Object} Validation result with isValid and errors
     */
    validate() {
        const errors = {};

        if (!this.name || this.name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!this.email || !User.isValidEmail(this.email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (this.phone && !User.isValidPhone(this.phone)) {
            errors.phone = 'Введите корректный номер телефона';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Convert user to plain object (without password)
     * @returns {Object} Plain object representation
     */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            role: this.role,
            address: this.address,
            createdAt: this.createdAt.toISOString()
        };
    }

    /**
     * Convert user to JSON for storage (without sensitive data)
     * @returns {Object} Safe object for storage
     */
    toSafeObject() {
        const obj = this.toObject();
        delete obj.password;
        return obj;
    }

    /**
     * Create User instance from plain object
     * @static
     * @param {Object} obj - Plain object
     * @returns {User} User instance
     */
    static fromObject(obj) {
        return new User(obj);
    }

    /**
     * Validate email format
     * @static
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone format
     * @static
     * @param {string} phone - Phone to validate
     * @returns {boolean} Is valid
     */
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Validate password strength
     * @static
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    static validatePassword(password) {
        const errors = [];
        
        if (password.length < 6) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if passwords match
     * @static
     * @param {string} password - Password
     * @param {string} confirmPassword - Confirmation password
     * @returns {boolean} Passwords match
     */
    static passwordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }
}

/**
 * UserCredentials class for login data
 */
class UserCredentials {
    /**
     * Creates new UserCredentials instance
     * @param {string} email - User email
     * @param {string} password - User password
     */
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Validate credentials
     * @returns {Object} Validation result
     */
    validate() {
        const errors = {};

        if (!this.email || !User.isValidEmail(this.email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (!this.password || this.password.length < 1) {
            errors.password = 'Введите пароль';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

/**
 * UserRegistration class for registration data
 */
class UserRegistration {
    /**
     * Creates new UserRegistration instance
     * @param {Object} data - Registration data
     */
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone || '';
        this.password = data.password;
        this.passwordConfirm = data.passwordConfirm;
    }

    /**
     * Validate registration data
     * @returns {Object} Validation result
     */
    validate() {
        const errors = {};

        if (!this.name || this.name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!this.email || !User.isValidEmail(this.email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (this.phone && !User.isValidPhone(this.phone)) {
            errors.phone = 'Введите корректный номер телефона';
        }

        const passwordValidation = User.validatePassword(this.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        if (!User.passwordsMatch(this.password, this.passwordConfirm)) {
            errors.passwordConfirm = 'Пароли не совпадают';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Convert to User object
     * @returns {Object} User data
     */
    toUserData() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: this.password
        };
    }
}
