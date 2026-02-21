
/**
 * Theme Switcher
 * Handles theme switching functionality and persistence
 */

const THEME_STORAGE_KEY = 'seo-website-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark'; // Default
const BLUE_THEME = 'blue';
const GREEN_THEME = 'green';

const THEMES = [
    { name: LIGHT_THEME, icon: 'fa-sun', label: 'Light', description: 'Clean, bright interface' },
    { name: DARK_THEME, icon: 'fa-moon', label: 'Dark', description: 'Immersive dark mode' },
    { name: BLUE_THEME, icon: 'fa-water', label: 'Blue', description: 'Professional blue tones' },
    { name: GREEN_THEME, icon: 'fa-leaf', label: 'Green', description: 'Fresh organic feel' }
];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

function initTheme() {
    // 1. Load saved theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DARK_THEME; // Default to dark if not set
    setTheme(savedTheme);

    // 2. Create UI Elements
    createThemePanel();
    createFloatingTrigger();
    createToastContainer();
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    
    // Update active state in panel if open
    updateActiveState(themeName);
}

function createThemePanel() {
    if (document.getElementById('modern-theme-toggle')) return;

    const panel = document.createElement('div');
    panel.id = 'modern-theme-toggle';
    panel.className = 'modern-theme-toggle';
    panel.setAttribute('aria-hidden', 'true');

    // Header
    const header = document.createElement('div');
    header.className = 'toggle-header';
    header.innerHTML = `
        <h3 class="toggle-title">Appearance</h3>
        <button class="toggle-close" aria-label="Close theme panel">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Options Container
    const options = document.createElement('div');
    options.className = 'theme-options';
    options.innerHTML = `<p class="theme-instructions">Select a theme to customize your experience.</p>`;

    // Theme Cards
    THEMES.forEach(theme => {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.dataset.theme = theme.name;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        
        card.innerHTML = `
            <div class="theme-preview"><i class="fas ${theme.icon}"></i></div>
            <div class="theme-info">
                <div class="theme-label">${theme.label}</div>
                <div class="theme-description">${theme.description}</div>
            </div>
            <div class="selection-indicator"><i class="fas fa-check"></i></div>
        `;

        card.addEventListener('click', () => {
            setTheme(theme.name);
            showToast(`${theme.label} theme activated`);
        });

        // Keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                setTheme(theme.name);
                showToast(`${theme.label} theme activated`);
            }
        });

        options.appendChild(card);
    });

    panel.appendChild(header);
    panel.appendChild(options);
    document.body.appendChild(panel);

    // Event Listeners for Panel
    const closeBtn = header.querySelector('.toggle-close');
    closeBtn.addEventListener('click', closePanel);

    // Close on click outside
    document.addEventListener('click', (e) => {
        const trigger = document.getElementById('theme-trigger-btn');
        if (panel.classList.contains('active') && 
            !panel.contains(e.target) && 
            e.target !== trigger && 
            !trigger.contains(e.target)) {
            closePanel();
        }
    });
}

function createFloatingTrigger() {
    if (document.getElementById('theme-trigger-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'theme-trigger-btn';
    btn.className = 'theme-toggle-btn-fixed';
    btn.setAttribute('aria-label', 'Open theme settings');
    btn.innerHTML = '<i class="fas fa-palette"></i>';

    btn.addEventListener('click', () => {
        const panel = document.getElementById('modern-theme-toggle');
        if (panel) {
            const isActive = panel.classList.contains('active');
            if (isActive) {
                closePanel();
            } else {
                openPanel();
            }
        }
    });

    document.body.appendChild(btn);
}

function openPanel() {
    const panel = document.getElementById('modern-theme-toggle');
    if (panel) {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        updateActiveState(localStorage.getItem(THEME_STORAGE_KEY) || DARK_THEME);
    }
}

function closePanel() {
    const panel = document.getElementById('modern-theme-toggle');
    if (panel) {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
    }
}

function updateActiveState(currentTheme) {
    const cards = document.querySelectorAll('.theme-card');
    cards.forEach(card => {
        if (card.dataset.theme === currentTheme) {
            card.classList.add('active');
            card.setAttribute('aria-selected', 'true');
        } else {
            card.classList.remove('active');
            card.setAttribute('aria-selected', 'false');
        }
    });
}

function createToastContainer() {
    if (document.getElementById('theme-toast-container')) return;
    
    const container = document.createElement('div');
    container.id = 'theme-toast-container';
    container.className = 'theme-toast-container';
    document.body.appendChild(container);
}

function showToast(message) {
    const container = document.getElementById('theme-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'theme-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    container.appendChild(toast);

    // Animate
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
