document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.main-nav ul.menu');
    
    if (mobileMenuToggle && menu) {
        mobileMenuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    const menuItems = document.querySelectorAll('.main-nav ul.menu > li');
    
    // Add dropdown arrow for items with submenus
    menuItems.forEach(item => {
        if (item.querySelector('ul')) {
            const link = item.querySelector('a');
            // Only add arrow if not already present
            if (!link.querySelector('.arrow')) {
                link.innerHTML += ' <span class="arrow">▼</span>';
            }
            
            // For mobile view, handle clicks
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const submenu = item.querySelector('ul');
                    if (submenu) {
                        e.preventDefault();
                        item.classList.toggle('active');
                        // Submenu display is handled by CSS based on .active class on <li>
                    }
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu && menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            menu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Search functionality placeholder
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                alert(`Searching for: ${query}`);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});
