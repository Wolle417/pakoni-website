// Simple SPA Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '/';
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.pathname);
        });
        
        // Intercept all link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
    }
    
    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    
    // Navigate to a route
    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadRoute(path);
    }
    
    // Initialize About Page Video with slow motion
    initAboutPageVideo() {
        const video = document.getElementById('morph-video');
        if (video) {
            video.playbackRate = 0.25;
            video.defaultPlaybackRate = 0.25;
            
            ['loadedmetadata', 'canplay', 'play', 'playing'].forEach(event => {
                video.addEventListener(event, () => {
                    video.playbackRate = 0.25;
                });
            });
            
            console.log('About video speed set to 0.25x');
        }
    }
    
    // Load route content
    async loadRoute(path) {
        this.currentPath = path;
        const handler = this.routes[path] || this.routes['/404'];
        
        if (handler) {
            const content = await handler();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const mobileMenu = document.getElementById('mobile-menu');
                if (hamburger && mobileMenu) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
                
                // Initialize page-specific features
                if (path === '/about') {
                    // Kurz warten bis Video im DOM ist
                    setTimeout(() => {
                        this.initAboutPageVideo();
                    }, 100);
                }
            }
        }
    }
    
    // Initialize router
    init() {
        this.loadRoute(window.location.pathname);
    }
}

// Create global router instance
const router = new Router();