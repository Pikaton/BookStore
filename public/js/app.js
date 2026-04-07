/**
 * App - Main Application Entry Point
 * Initializes and coordinates all controllers
 * 
 * @namespace App
 */
const App = {
    /**
     * Controller instances
     */
    catalogController: null,
    cartController: null,
    userController: null,
    orderController: null,

    /**
     * Initialize the application
     */
    init: function() {
        // Initialize controllers
        this.catalogController = new CatalogController();
        this.cartController = new CartController();
        this.userController = new UserController();
        this.orderController = new OrderController();

        // Initialize base functionality
        this.cartController.init();
        this.userController.init();

        // Setup navigation toggle
        this.setupNavigation();
    },

    /**
     * Setup mobile navigation toggle
     */
    setupNavigation: function() {
        const toggle = document.getElementById('nav-toggle');
        const navList = document.getElementById('nav-list');

        if (toggle && navList) {
            toggle.addEventListener('click', function() {
                navList.classList.toggle('nav__list--active');
            });
        }
    },

    /**
     * Load home page content
     */
    loadHomePage: function() {
        this.catalogController.init();
        this.catalogController.loadNewArrivals('new-arrivals');
        this.catalogController.loadPopularBooks('popular-books');
    },

    /**
     * Load catalog page content
     */
    loadCatalogPage: function() {
        this.catalogController.init();
        this.catalogController.loadBooks();
    },

    /**
     * Load cart page content
     */
    loadCartPage: function() {
        this.cartController.renderCartPage();
    },

    /**
     * Load checkout page content
     */
    loadCheckoutPage: function() {
        // Check if cart is empty
        const cart = this.cartController.getCart();
        if (cart.isEmpty()) {
            window.location.href = 'cart.html';
            return;
        }

        this.orderController.init();
        this.orderController.initCheckoutPage();
    },

    /**
     * Load auth page content
     */
    loadAuthPage: function() {
        this.userController.initAuthPage();
    }
};
