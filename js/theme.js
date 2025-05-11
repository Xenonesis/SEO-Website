/**
 * Theme Switcher
 * Handles theme switching functionality and persistence
 * Supports multiple themes: light, dark, blue, green
 */

// Theme constants
const THEME_STORAGE_KEY = 'seo-website-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const BLUE_THEME = 'blue';
const GREEN_THEME = 'green';

// Theme array for cycling through themes
const THEMES = [LIGHT_THEME, DARK_THEME, BLUE_THEME, GREEN_THEME];

// DOM elements
let themeToggle;
let themeToggleThumb;
let themeSelector;

/**
 * Initialize the theme system
 */
function initTheme() {
    // Create theme toggle elements if they don't exist
    createThemeToggle();

    // Load saved theme or use system preference
    loadTheme();

    // Add event listeners
    addThemeEventListeners();

    // Apply initial theme class based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    if (currentTheme === DARK_THEME) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
}

/**
 * Create the theme selector if it doesn't exist
 */
function createThemeToggle() {
    // Check if theme selector already exists
    themeSelector = document.getElementById('theme-selector');
    if (themeSelector) return;

    // Create theme selector container
    themeSelector = document.createElement('div');
    themeSelector.id = 'theme-selector';
    themeSelector.className = 'theme-selector';

    // Create theme toggle panel
    const themePanel = document.createElement('div');
    themePanel.className = 'theme-panel';

    // Add title to the theme panel
    const themeTitle = document.createElement('div');
    themeTitle.className = 'theme-panel-title';
    themeTitle.textContent = 'Select Theme';
    themePanel.appendChild(themeTitle);

    // Create theme options container
    const themeOptions = document.createElement('div');
    themeOptions.className = 'theme-options';

    // Define theme options
    const themes = [
        { name: LIGHT_THEME, icon: 'fa-sun', label: 'Light' },
        { name: DARK_THEME, icon: 'fa-moon', label: 'Dark' },
        { name: BLUE_THEME, icon: 'fa-water', label: 'Blue' },
        { name: GREEN_THEME, icon: 'fa-leaf', label: 'Green' }
    ];

    // Create each theme option button
    themes.forEach(theme => {
        const themeButton = document.createElement('button');
        themeButton.className = `theme-button theme-${theme.name}`;
        themeButton.setAttribute('data-theme', theme.name);
        themeButton.setAttribute('aria-label', `${theme.label} theme`);
        themeButton.title = `${theme.label} Theme`;

        // Create color preview
        const colorPreview = document.createElement('span');
        colorPreview.className = `theme-color-preview ${theme.name}-preview`;
        themeButton.appendChild(colorPreview);

        // Create icon
        const icon = document.createElement('i');
        icon.className = `fas ${theme.icon}`;
        themeButton.appendChild(icon);

        // Create label
        const label = document.createElement('span');
        label.className = 'theme-button-label';
        label.textContent = theme.label;
        themeButton.appendChild(label);

        // Add click event
        themeButton.addEventListener('click', () => {
            setTheme(theme.name);
            updateActiveThemeButton();
        });

        themeOptions.appendChild(themeButton);
    });

    // Add theme options to panel
    themePanel.appendChild(themeOptions);

    // Create toggle button to show/hide the panel
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme panel');

    // Create toggle icon
    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-palette';
    themeToggle.appendChild(toggleIcon);

    // Add click event to toggle panel
    themeToggle.addEventListener('click', () => {
        themePanel.classList.toggle('show-panel');
        themeToggle.classList.toggle('active');
    });

    // Add components to theme selector
    themeSelector.appendChild(themeToggle);
    themeSelector.appendChild(themePanel);

    // Add to header
    const headerNav = document.querySelector('header nav.desktop-nav, header nav.hidden.md\\:flex');
    if (headerNav) {
        // For desktop, add before the last link (usually Contact Us)
        const navLinks = headerNav.querySelectorAll('a');
        if (navLinks.length > 0) {
            const lastLink = navLinks[navLinks.length - 1];
            headerNav.insertBefore(themeSelector, lastLink);
            themeSelector.style.marginRight = '1rem';
        } else {
            headerNav.appendChild(themeSelector);
        }
    } else {
        // Fallback: add to body
        document.body.appendChild(themeSelector);
        themeSelector.style.position = 'fixed';
        themeSelector.style.top = '1rem';
        themeSelector.style.right = '1rem';
        themeSelector.style.zIndex = '1000';
    }

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeSelector.contains(e.target) && themePanel.classList.contains('show-panel')) {
            themePanel.classList.remove('show-panel');
            themeToggle.classList.remove('active');
        }
    });

    // Function to update active theme button
    function updateActiveThemeButton() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        const buttons = themeOptions.querySelectorAll('.theme-button');

        buttons.forEach(button => {
            if (button.getAttribute('data-theme') === currentTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Set initial active state
    updateActiveThemeButton();

    // Create mobile theme toggle
    createMobileThemeToggle();
}

// These functions have been replaced by the panel toggle functionality in createThemeToggle

/**
 * Create a mobile theme selector
 */
function createMobileThemeToggle() {
    // Find mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    // Check if mobile theme selector already exists
    if (mobileMenu.querySelector('.mobile-theme-selector')) return;

    // Create container for mobile theme options
    const mobileThemeContainer = document.createElement('div');
    mobileThemeContainer.className = 'px-4 pt-4 pb-2 mobile-theme-selector';

    // Create label
    const label = document.createElement('p');
    label.className = 'text-sm font-medium mb-3 dark:text-gray-300';
    label.textContent = 'Select Theme';
    label.style.color = 'var(--text-medium)';
    mobileThemeContainer.appendChild(label);

    // Create theme options container
    const themeGrid = document.createElement('div');
    themeGrid.className = 'mobile-theme-grid';

    // Theme options
    const themeOptions = [
        { name: LIGHT_THEME, icon: 'fa-sun', label: 'Light' },
        { name: DARK_THEME, icon: 'fa-moon', label: 'Dark' },
        { name: BLUE_THEME, icon: 'fa-water', label: 'Blue' },
        { name: GREEN_THEME, icon: 'fa-leaf', label: 'Green' }
    ];

    // Create theme option buttons
    themeOptions.forEach(option => {
        const themeButton = document.createElement('button');
        themeButton.className = `mobile-theme-button mobile-theme-${option.name}`;
        themeButton.setAttribute('data-theme', option.name);
        themeButton.setAttribute('aria-label', `${option.label} theme`);

        // Create color preview
        const colorPreview = document.createElement('span');
        colorPreview.className = `mobile-theme-color-preview ${option.name}-preview`;
        themeButton.appendChild(colorPreview);

        // Create icon
        const icon = document.createElement('i');
        icon.className = `fas ${option.icon}`;
        themeButton.appendChild(icon);

        // Create label
        const buttonLabel = document.createElement('span');
        buttonLabel.className = 'mobile-theme-button-label';
        buttonLabel.textContent = option.label;
        themeButton.appendChild(buttonLabel);

        // Add click event
        themeButton.addEventListener('click', () => {
            setTheme(option.name);

            // Update active state
            document.querySelectorAll('.mobile-theme-button').forEach(btn => {
                btn.classList.remove('active');
            });
            themeButton.classList.add('active');
        });

        // Set active state for current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        if (option.name === currentTheme) {
            themeButton.classList.add('active');
        }

        themeGrid.appendChild(themeButton);
    });

    mobileThemeContainer.appendChild(themeGrid);

    // Add to mobile menu
    const menuContent = mobileMenu.querySelector('div');
    if (menuContent) {
        menuContent.appendChild(mobileThemeContainer);
    } else {
        mobileMenu.appendChild(mobileThemeContainer);
    }
}

/**
 * Load theme from localStorage or system preference
 */
function loadTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme) {
        // Use saved theme
        setTheme(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? DARK_THEME : LIGHT_THEME);
    }
}

/**
 * Set the theme
 * @param {string} theme - 'light', 'dark', 'blue', or 'green'
 */
function setTheme(theme) {
    // Update data attribute on html element
    document.documentElement.setAttribute('data-theme', theme);

    // Remove all theme classes
    document.documentElement.classList.remove('dark-mode', 'blue-mode', 'green-mode');

    // Add appropriate theme class for CSS compatibility
    switch (theme) {
        case DARK_THEME:
            document.documentElement.classList.add('dark-mode');
            break;
        case BLUE_THEME:
            document.documentElement.classList.add('blue-mode');
            break;
        case GREEN_THEME:
            document.documentElement.classList.add('green-mode');
            break;
        // Light theme is default, no class needed
    }

    // Update desktop theme selector
    if (themeToggle) {
        themeToggle.setAttribute('data-theme', theme);

        // Hide all icons
        const icons = themeToggleThumb.querySelectorAll('.theme-toggle-icon');
        icons.forEach(icon => icon.style.opacity = '0');

        // Show the current theme icon
        const activeIcon = themeToggleThumb.querySelector(`.${theme}-icon`);
        if (activeIcon) activeIcon.style.opacity = '1';
    }

    // Update mobile theme options
    const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
    mobileThemeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Add transition class for smooth color changes
    document.documentElement.classList.add('theme-transition');

    // Remove transition class after transition completes to prevent transition on page load
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Toggle between all available themes in sequence
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;

    // Find current theme index
    const currentIndex = THEMES.indexOf(currentTheme);

    // Get next theme (cycle back to first if at the end)
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const newTheme = THEMES[nextIndex];

    setTheme(newTheme);
}

/**
 * Add event listeners for theme switching
 */
function addThemeEventListeners() {
    // Toggle button click
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);

        // Keyboard accessibility
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Add event listeners for dynamically created mobile toggles
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-theme-toggle')) {
            toggleTheme();
        }
    });

    // Keyboard accessibility for mobile toggles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const toggle = e.target.closest('.mobile-theme-toggle');
            if (toggle) {
                e.preventDefault();
                toggleTheme();
            }
        }
    });

    // System preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't manually set a theme
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    });

    // Handle theme changes when mobile menu opens/closes
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // If mobile menu becomes visible, ensure mobile toggle is updated
                    if (!mobileMenu.classList.contains('hidden') && mobileMenu.style.maxHeight !== '0px') {
                        createMobileThemeToggle();
                    }
                }
            });
        });

        observer.observe(mobileMenu, { attributes: true });
    }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);
