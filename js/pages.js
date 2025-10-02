// Page loader - fetches HTML from separate files
async function loadPage(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Page not found');
        return await response.text();
    } catch (error) {
        console.error('Error loading page:', error);
        return '<div class="error-page"><h1>Page not found</h1></div>';
    }
}

// Register all routes
router.addRoute('/', async () => {
    return await loadPage('pages/home.html');
});

router.addRoute('/about', async () => {
    return await loadPage('pages/about.html');
});

router.addRoute('/shop', async () => {
    return await loadPage('pages/shop.html');
});

router.addRoute('/login', async () => {
    return await loadPage('pages/login.html');
});

router.addRoute('/404', () => {
    return `
        <section class="error-page">
            <div class="error-container">
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/" data-link>Back to Home</a>
            </div>
        </section>
    `;
});

// Initialize router after routes are registered
router.init();