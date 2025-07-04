// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme on page load
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Add event listener to toggle checkbox
        document.addEventListener('DOMContentLoaded', () => {
            const toggleInput = document.querySelector('.toggle input[type="checkbox"]');
            if (toggleInput) {
                // Set initial state
                toggleInput.checked = this.theme === 'dark';
                
                // Add change event listener
                toggleInput.addEventListener('change', () => this.toggleTheme());
            }
        });
    }

    toggleTheme() {
        const toggleInput = document.querySelector('.toggle input[type="checkbox"]');
        this.theme = toggleInput.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.animateToggle();
    }

    animateToggle() {
        const button = document.querySelector('.toggle .button');
        if (!button) return;

        // Brief scale animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize theme toggle
new ThemeToggle();
