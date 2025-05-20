const NotFound = {
    async render() {
        return `
            <div class="not-found">
                <div class="not-found-illustration">
                    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="80" cy="80" r="80" fill="#F2F2F2"/>
                        <text x="50%" y="55%" text-anchor="middle" fill="#2196f3" font-size="48" font-family="Arial" dy=".3em">404</text>
                        <circle cx="60" cy="100" r="6" fill="#2196f3"/>
                        <circle cx="100" cy="100" r="6" fill="#2196f3"/>
                        <rect x="70" y="120" width="20" height="6" rx="3" fill="#BDBDBD"/>
                    </svg>
                </div>
                <h2>404 - Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
                <a href="#/" class="back-home">Back to Home</a>
            </div>
        `;
    },

    async afterRender() {
    },
};

export default NotFound; 