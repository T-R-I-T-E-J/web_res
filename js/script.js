document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (simple version)
    const menuItems = document.querySelectorAll('.main-nav ul.menu > li');
    
    // Add dropdown arrow for items with submenus
    menuItems.forEach(item => {
        if (item.querySelector('ul')) {
            const link = item.querySelector('a');
            link.innerHTML += ' <span class="arrow">▼</span>';
            
            // For mobile view, handle clicks
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const submenu = item.querySelector('ul');
                    const isVisible = window.getComputedStyle(submenu).display === 'block';
                    submenu.style.display = isVisible ? 'none' : 'block';
                }
            });
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

